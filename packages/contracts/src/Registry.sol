// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IERC20} from "./interfaces/IERC20.sol";

/// @title SpeakUp Registry
/// @notice On-chain registry of shareholder proposals + vote attestations.
///         Schema is EAS-compatible; can be plugged into the canonical EAS
///         attestation service in production by replaying the same struct.
contract SpeakUpRegistry {
    enum Choice {
        ABSTAIN,
        FOR,
        AGAINST
    }

    enum AckStatus {
        PENDING,
        ACKNOWLEDGED,
        REJECTED
    }

    struct TickerInfo {
        address token;
        string cik;
        bool active;
    }

    struct Meeting {
        bytes32 ticker;
        uint64 voteOpen;
        uint64 voteDeadline;
        string defUrl;
        bool active;
    }

    struct VoteAttestation {
        address voter;
        bytes32 meetingId;
        uint16 itemId;
        Choice choice;
        uint256 weight;
        bytes32 reasoningHash;
        uint64 timestamp;
        AckStatus status;
        string ackRef;
    }

    address public owner;
    address public relayer;

    mapping(bytes32 ticker => TickerInfo) public tickers;
    mapping(bytes32 meetingId => Meeting) public meetings;
    mapping(bytes32 uid => VoteAttestation) public attestations;
    mapping(address voter => bytes32[]) private _voterUids;
    mapping(bytes32 meetingId => bytes32[]) private _meetingUids;
    mapping(address voter => mapping(bytes32 meetingId => mapping(uint16 itemId => bytes32 uid)))
        private _existingVote;

    event RelayerUpdated(address indexed oldRelayer, address indexed newRelayer);
    event TickerRegistered(bytes32 indexed ticker, address indexed token, string cik);
    event TickerDeactivated(bytes32 indexed ticker);
    event MeetingRegistered(
        bytes32 indexed meetingId, bytes32 indexed ticker, uint64 voteDeadline, string defUrl
    );
    event MeetingClosed(bytes32 indexed meetingId);
    event VoteCast(
        bytes32 indexed uid,
        address indexed voter,
        bytes32 indexed meetingId,
        uint16 itemId,
        Choice choice,
        uint256 weight
    );
    event VoteAcknowledged(bytes32 indexed uid, AckStatus status, string ackRef);

    error NotOwner();
    error NotRelayer();
    error ZeroAddress();
    error TickerAlreadyRegistered();
    error TickerNotFound();
    error TickerInactive();
    error MeetingAlreadyRegistered();
    error MeetingNotFound();
    error MeetingNotOpen();
    error MeetingClosedAlready();
    error NoVotingWeight();
    error AlreadyVoted();
    error AttestationNotFound();
    error AlreadyAcknowledged();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyRelayer() {
        if (msg.sender != relayer) revert NotRelayer();
        _;
    }

    constructor(address relayer_) {
        if (relayer_ == address(0)) revert ZeroAddress();
        owner = msg.sender;
        relayer = relayer_;
        emit RelayerUpdated(address(0), relayer_);
    }

    // ============ Admin ============

    function setRelayer(address newRelayer) external onlyOwner {
        if (newRelayer == address(0)) revert ZeroAddress();
        address old = relayer;
        relayer = newRelayer;
        emit RelayerUpdated(old, newRelayer);
    }

    function registerTicker(bytes32 ticker, address token, string calldata cik)
        external
        onlyOwner
    {
        if (token == address(0)) revert ZeroAddress();
        if (tickers[ticker].token != address(0)) revert TickerAlreadyRegistered();
        tickers[ticker] = TickerInfo({token: token, cik: cik, active: true});
        emit TickerRegistered(ticker, token, cik);
    }

    function deactivateTicker(bytes32 ticker) external onlyOwner {
        TickerInfo storage t = tickers[ticker];
        if (t.token == address(0)) revert TickerNotFound();
        t.active = false;
        emit TickerDeactivated(ticker);
    }

    function registerMeeting(
        bytes32 meetingId,
        bytes32 ticker,
        uint64 voteOpen,
        uint64 voteDeadline,
        string calldata defUrl
    ) external onlyOwner {
        TickerInfo storage t = tickers[ticker];
        if (t.token == address(0)) revert TickerNotFound();
        if (!t.active) revert TickerInactive();
        if (meetings[meetingId].ticker != bytes32(0)) revert MeetingAlreadyRegistered();
        meetings[meetingId] = Meeting({
            ticker: ticker,
            voteOpen: voteOpen,
            voteDeadline: voteDeadline,
            defUrl: defUrl,
            active: true
        });
        emit MeetingRegistered(meetingId, ticker, voteDeadline, defUrl);
    }

    function closeMeeting(bytes32 meetingId) external onlyOwner {
        Meeting storage m = meetings[meetingId];
        if (m.ticker == bytes32(0)) revert MeetingNotFound();
        if (!m.active) revert MeetingClosedAlready();
        m.active = false;
        emit MeetingClosed(meetingId);
    }

    // ============ Voting ============

    /// @notice Cast a vote on a proposal item. Weight is read from the underlying
    /// ERC-20 at call time; we trust the token contract for balance accounting.
    function castVote(bytes32 meetingId, uint16 itemId, Choice choice, bytes32 reasoningHash)
        external
        returns (bytes32 uid)
    {
        Meeting storage m = meetings[meetingId];
        if (m.ticker == bytes32(0)) revert MeetingNotFound();
        if (!m.active) revert MeetingClosedAlready();
        // Voting windows are measured in days; the ~15s validator timestamp
        // drift is irrelevant for this comparison.
        // forge-lint: disable-next-line(block-timestamp)
        if (block.timestamp < m.voteOpen || block.timestamp > m.voteDeadline) {
            revert MeetingNotOpen();
        }
        if (_existingVote[msg.sender][meetingId][itemId] != bytes32(0)) revert AlreadyVoted();

        TickerInfo storage t = tickers[m.ticker];
        uint256 weight = IERC20(t.token).balanceOf(msg.sender);
        if (weight == 0) revert NoVotingWeight();

        uid = keccak256(
            abi.encode(msg.sender, meetingId, itemId, block.chainid, address(this))
        );
        attestations[uid] = VoteAttestation({
            voter: msg.sender,
            meetingId: meetingId,
            itemId: itemId,
            choice: choice,
            weight: weight,
            reasoningHash: reasoningHash,
            timestamp: uint64(block.timestamp),
            status: AckStatus.PENDING,
            ackRef: ""
        });
        _voterUids[msg.sender].push(uid);
        _meetingUids[meetingId].push(uid);
        _existingVote[msg.sender][meetingId][itemId] = uid;

        emit VoteCast(uid, msg.sender, meetingId, itemId, choice, weight);
    }

    /// @notice Batch wrapper for casting multiple item votes in a single tx.
    function castVotes(
        bytes32 meetingId,
        uint16[] calldata itemIds,
        Choice[] calldata choices,
        bytes32[] calldata reasoningHashes
    ) external returns (bytes32[] memory uids) {
        uint256 n = itemIds.length;
        require(n == choices.length && n == reasoningHashes.length, "length mismatch");
        uids = new bytes32[](n);
        for (uint256 i; i < n; ++i) {
            uids[i] = this.castVote(meetingId, itemIds[i], choices[i], reasoningHashes[i]);
        }
    }

    // ============ Relayer acknowledgement ============

    function acknowledge(bytes32 uid, AckStatus status, string calldata ackRef)
        external
        onlyRelayer
    {
        VoteAttestation storage a = attestations[uid];
        if (a.voter == address(0)) revert AttestationNotFound();
        if (a.status != AckStatus.PENDING) revert AlreadyAcknowledged();
        a.status = status;
        a.ackRef = ackRef;
        emit VoteAcknowledged(uid, status, ackRef);
    }

    // ============ Views ============

    function getVoterUids(address voter) external view returns (bytes32[] memory) {
        return _voterUids[voter];
    }

    function getMeetingUids(bytes32 meetingId) external view returns (bytes32[] memory) {
        return _meetingUids[meetingId];
    }

    function hasVoted(address voter, bytes32 meetingId, uint16 itemId)
        external
        view
        returns (bool)
    {
        return _existingVote[voter][meetingId][itemId] != bytes32(0);
    }
}
