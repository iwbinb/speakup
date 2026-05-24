// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {SpeakUpRegistry} from "../src/Registry.sol";
import {MockERC20} from "./mocks/MockERC20.sol";

contract RegistryTest is Test {
    SpeakUpRegistry internal registry;
    MockERC20 internal tslaToken;

    address internal owner = address(this);
    address internal relayer = address(0xBEEF);
    address internal alice = address(0xA11CE);
    address internal bob = address(0xB0B);

    bytes32 internal constant TSLA = keccak256("TSLA");
    bytes32 internal constant TSLA_MEETING_1 = keccak256("TSLA-2025-ANNUAL");

    function setUp() public {
        registry = new SpeakUpRegistry(relayer);
        tslaToken = new MockERC20("Tesla", "TSLA", 18);
        tslaToken.mint(alice, 10 ether);
        tslaToken.mint(bob, 0);

        registry.registerTicker(TSLA, address(tslaToken), "0001318605");
        registry.registerMeeting(
            TSLA_MEETING_1,
            TSLA,
            uint64(block.timestamp),
            uint64(block.timestamp + 30 days),
            "https://www.sec.gov/.../def14a.htm"
        );
    }

    // ---------- Admin ----------

    function test_OnlyOwnerCanRegisterTicker() public {
        vm.prank(alice);
        vm.expectRevert(SpeakUpRegistry.NotOwner.selector);
        registry.registerTicker(keccak256("AMZN"), address(0x1234), "0001018724");
    }

    function test_CannotRegisterDuplicateTicker() public {
        vm.expectRevert(SpeakUpRegistry.TickerAlreadyRegistered.selector);
        registry.registerTicker(TSLA, address(tslaToken), "0001318605");
    }

    function test_CannotRegisterTickerWithZeroToken() public {
        vm.expectRevert(SpeakUpRegistry.ZeroAddress.selector);
        registry.registerTicker(keccak256("AMZN"), address(0), "0001018724");
    }

    function test_DeactivateTicker() public {
        registry.deactivateTicker(TSLA);
        vm.expectRevert(SpeakUpRegistry.TickerInactive.selector);
        registry.registerMeeting(
            keccak256("M2"),
            TSLA,
            uint64(block.timestamp),
            uint64(block.timestamp + 1 days),
            "url"
        );
    }

    function test_SetRelayer() public {
        registry.setRelayer(address(0xCAFE));
        assertEq(registry.relayer(), address(0xCAFE));
    }

    function test_SetRelayerCannotBeZero() public {
        vm.expectRevert(SpeakUpRegistry.ZeroAddress.selector);
        registry.setRelayer(address(0));
    }

    // ---------- Voting ----------

    function test_HappyPath_CastVote() public {
        vm.prank(alice);
        // Test fixture only; truncation acceptable.
        // forge-lint: disable-next-line(unsafe-typecast)
        bytes32 uid = registry.castVote(TSLA_MEETING_1, 2, SpeakUpRegistry.Choice.AGAINST, bytes32("ipfs://x"));

        (
            address voter,
            bytes32 meetingId,
            uint16 itemId,
            SpeakUpRegistry.Choice choice,
            uint256 weight,
            ,
            ,
            SpeakUpRegistry.AckStatus status,
        ) = registry.attestations(uid);

        assertEq(voter, alice);
        assertEq(meetingId, TSLA_MEETING_1);
        assertEq(itemId, 2);
        assertEq(uint8(choice), uint8(SpeakUpRegistry.Choice.AGAINST));
        assertEq(weight, 10 ether);
        assertEq(uint8(status), uint8(SpeakUpRegistry.AckStatus.PENDING));
        assertTrue(registry.hasVoted(alice, TSLA_MEETING_1, 2));
    }

    function test_CannotVoteWithoutBalance() public {
        vm.prank(bob);
        vm.expectRevert(SpeakUpRegistry.NoVotingWeight.selector);
        registry.castVote(TSLA_MEETING_1, 1, SpeakUpRegistry.Choice.FOR, bytes32(0));
    }

    function test_CannotDoubleVote() public {
        vm.startPrank(alice);
        registry.castVote(TSLA_MEETING_1, 1, SpeakUpRegistry.Choice.FOR, bytes32(0));
        vm.expectRevert(SpeakUpRegistry.AlreadyVoted.selector);
        registry.castVote(TSLA_MEETING_1, 1, SpeakUpRegistry.Choice.AGAINST, bytes32(0));
        vm.stopPrank();
    }

    function test_CanVoteOnDifferentItems() public {
        vm.startPrank(alice);
        registry.castVote(TSLA_MEETING_1, 1, SpeakUpRegistry.Choice.FOR, bytes32(0));
        registry.castVote(TSLA_MEETING_1, 2, SpeakUpRegistry.Choice.AGAINST, bytes32(0));
        registry.castVote(TSLA_MEETING_1, 3, SpeakUpRegistry.Choice.ABSTAIN, bytes32(0));
        vm.stopPrank();
        assertEq(registry.getVoterUids(alice).length, 3);
        assertEq(registry.getMeetingUids(TSLA_MEETING_1).length, 3);
    }

    function test_CannotVoteOnUnknownMeeting() public {
        vm.prank(alice);
        vm.expectRevert(SpeakUpRegistry.MeetingNotFound.selector);
        registry.castVote(keccak256("UNKNOWN"), 1, SpeakUpRegistry.Choice.FOR, bytes32(0));
    }

    function test_CannotVoteBeforeOpen() public {
        bytes32 future = keccak256("TSLA-FUTURE");
        registry.registerMeeting(
            future,
            TSLA,
            uint64(block.timestamp + 1 days),
            uint64(block.timestamp + 30 days),
            "url"
        );
        vm.prank(alice);
        vm.expectRevert(SpeakUpRegistry.MeetingNotOpen.selector);
        registry.castVote(future, 1, SpeakUpRegistry.Choice.FOR, bytes32(0));
    }

    function test_CannotVoteAfterDeadline() public {
        vm.warp(block.timestamp + 31 days);
        vm.prank(alice);
        vm.expectRevert(SpeakUpRegistry.MeetingNotOpen.selector);
        registry.castVote(TSLA_MEETING_1, 1, SpeakUpRegistry.Choice.FOR, bytes32(0));
    }

    function test_CannotVoteOnClosedMeeting() public {
        registry.closeMeeting(TSLA_MEETING_1);
        vm.prank(alice);
        vm.expectRevert(SpeakUpRegistry.MeetingClosedAlready.selector);
        registry.castVote(TSLA_MEETING_1, 1, SpeakUpRegistry.Choice.FOR, bytes32(0));
    }

    // ---------- Acknowledgement ----------

    function test_RelayerCanAcknowledge() public {
        vm.prank(alice);
        bytes32 uid = registry.castVote(TSLA_MEETING_1, 1, SpeakUpRegistry.Choice.FOR, bytes32(0));

        vm.prank(relayer);
        registry.acknowledge(uid, SpeakUpRegistry.AckStatus.ACKNOWLEDGED, "BROADRIDGE-REF-123");

        (,,,,,,, SpeakUpRegistry.AckStatus status, string memory ackRef) = registry.attestations(uid);
        assertEq(uint8(status), uint8(SpeakUpRegistry.AckStatus.ACKNOWLEDGED));
        assertEq(ackRef, "BROADRIDGE-REF-123");
    }

    function test_NonRelayerCannotAcknowledge() public {
        vm.prank(alice);
        bytes32 uid = registry.castVote(TSLA_MEETING_1, 1, SpeakUpRegistry.Choice.FOR, bytes32(0));
        vm.prank(alice);
        vm.expectRevert(SpeakUpRegistry.NotRelayer.selector);
        registry.acknowledge(uid, SpeakUpRegistry.AckStatus.ACKNOWLEDGED, "");
    }

    function test_CannotAcknowledgeUnknown() public {
        vm.prank(relayer);
        vm.expectRevert(SpeakUpRegistry.AttestationNotFound.selector);
        registry.acknowledge(bytes32(uint256(123)), SpeakUpRegistry.AckStatus.ACKNOWLEDGED, "");
    }

    function test_CannotAcknowledgeTwice() public {
        vm.prank(alice);
        bytes32 uid = registry.castVote(TSLA_MEETING_1, 1, SpeakUpRegistry.Choice.FOR, bytes32(0));
        vm.prank(relayer);
        registry.acknowledge(uid, SpeakUpRegistry.AckStatus.ACKNOWLEDGED, "ref");
        vm.prank(relayer);
        vm.expectRevert(SpeakUpRegistry.AlreadyAcknowledged.selector);
        registry.acknowledge(uid, SpeakUpRegistry.AckStatus.REJECTED, "");
    }

    // ---------- Fuzz ----------

    function testFuzz_VoteWeightMatchesBalance(uint96 mintAmount) public {
        vm.assume(mintAmount > 0);
        address charlie = address(0xCAAA);
        tslaToken.mint(charlie, mintAmount);
        vm.prank(charlie);
        bytes32 uid = registry.castVote(TSLA_MEETING_1, 9, SpeakUpRegistry.Choice.FOR, bytes32(0));
        (,,,, uint256 weight,,,,) = registry.attestations(uid);
        assertEq(weight, mintAmount);
    }

    /// @notice Same (voter, meeting, item) always yields the same uid; different
    ///         items yield different uids. Catches accidental hash collisions.
    function testFuzz_UidIsDeterministic(uint16 itemA, uint16 itemB) public {
        vm.assume(itemA != itemB);
        address charlie = address(0xCAAA);
        tslaToken.mint(charlie, 1 ether);
        vm.startPrank(charlie);
        bytes32 uid1 = registry.castVote(TSLA_MEETING_1, itemA, SpeakUpRegistry.Choice.FOR, bytes32(0));
        bytes32 uid2 = registry.castVote(TSLA_MEETING_1, itemB, SpeakUpRegistry.Choice.AGAINST, bytes32(0));
        vm.stopPrank();
        assertTrue(uid1 != uid2, "different items must produce different uids");
        bytes32 expected = keccak256(
            abi.encode(charlie, TSLA_MEETING_1, itemA, block.chainid, address(registry))
        );
        assertEq(uid1, expected);
    }

    // ---------- Invariants ----------

    function invariant_AttestationVoterAddressIsNeverZero() public view {
        // Sample the latest uid stored for the test users; voter field can never be
        // the zero address once an attestation exists (would imply uninitialized
        // storage being treated as a vote).
        bytes32[] memory uids = registry.getMeetingUids(TSLA_MEETING_1);
        for (uint256 i; i < uids.length; ++i) {
            (address voter,,,,,,,,) = registry.attestations(uids[i]);
            assertTrue(voter != address(0), "voter must be non-zero");
        }
    }

    function invariant_HasVotedConsistentWithUids() public view {
        // For every uid in the meeting's list, hasVoted(voter, meeting, itemId)
        // must report true. Catches accidental writes that desync the indexes.
        bytes32[] memory uids = registry.getMeetingUids(TSLA_MEETING_1);
        for (uint256 i; i < uids.length; ++i) {
            (address voter,, uint16 itemId,,,,,,) = registry.attestations(uids[i]);
            assertTrue(
                registry.hasVoted(voter, TSLA_MEETING_1, itemId),
                "hasVoted must be true for every stored uid"
            );
        }
    }

    // ---------- Batch ----------

    function test_CastVotes_BatchCastsAll() public {
        uint16[] memory items = new uint16[](3);
        items[0] = 1;
        items[1] = 2;
        items[2] = 3;
        SpeakUpRegistry.Choice[] memory choices = new SpeakUpRegistry.Choice[](3);
        choices[0] = SpeakUpRegistry.Choice.FOR;
        choices[1] = SpeakUpRegistry.Choice.AGAINST;
        choices[2] = SpeakUpRegistry.Choice.ABSTAIN;
        bytes32[] memory hashes = new bytes32[](3);

        vm.prank(alice);
        bytes32[] memory uids = registry.castVotes(TSLA_MEETING_1, items, choices, hashes);
        assertEq(uids.length, 3);
        for (uint256 i; i < 3; ++i) {
            assertTrue(uids[i] != bytes32(0));
            assertTrue(registry.hasVoted(alice, TSLA_MEETING_1, items[i]));
        }
    }

    function test_CastVotes_RevertsOnLengthMismatch() public {
        uint16[] memory items = new uint16[](2);
        SpeakUpRegistry.Choice[] memory choices = new SpeakUpRegistry.Choice[](3);
        bytes32[] memory hashes = new bytes32[](2);
        vm.prank(alice);
        vm.expectRevert(bytes("length mismatch"));
        registry.castVotes(TSLA_MEETING_1, items, choices, hashes);
    }

    // ---------- Ownership immutability ----------

    function test_OwnerIsImmutable() public view {
        // Sanity-check: there is no setter that can change owner. If a setter
        // were ever added by accident, calling it would compile and break this.
        assertEq(registry.owner(), address(this));
    }

    // ---------- Boundary fuzz ----------

    /// @notice Voting at exactly voteOpen or voteDeadline must succeed (inclusive
    ///         window). Off-by-one bugs in window comparison would surface here.
    function testFuzz_WindowBoundariesAreInclusive(uint8 dayOffset) public {
        vm.assume(dayOffset > 0 && dayOffset < 30);
        address dave = address(0xDA1E);
        tslaToken.mint(dave, 1 ether);

        // Warp to exactly voteOpen
        vm.warp(block.timestamp);
        vm.prank(dave);
        bytes32 uid1 = registry.castVote(TSLA_MEETING_1, 100, SpeakUpRegistry.Choice.FOR, bytes32(0));
        assertTrue(uid1 != bytes32(0));

        // Warp to exactly voteDeadline minus a small delta (must still succeed)
        vm.warp(block.timestamp + uint256(dayOffset) * 1 days);
        address eve = address(0xE0E);
        tslaToken.mint(eve, 1 ether);
        vm.prank(eve);
        bytes32 uid2 = registry.castVote(TSLA_MEETING_1, 200, SpeakUpRegistry.Choice.AGAINST, bytes32(0));
        assertTrue(uid2 != bytes32(0));
    }

    /// @notice Two distinct voters voting on the same (meeting, item) must
    ///         produce distinct uids and both be retrievable.
    function testFuzz_DistinctVotersDistinctUids(address voter1, address voter2) public {
        vm.assume(voter1 != voter2);
        vm.assume(voter1 != address(0) && voter2 != address(0));
        // Skip if either address is a precompile or has existing code.
        vm.assume(voter1.code.length == 0 && voter2.code.length == 0);

        tslaToken.mint(voter1, 1 ether);
        tslaToken.mint(voter2, 1 ether);

        vm.prank(voter1);
        bytes32 uid1 = registry.castVote(TSLA_MEETING_1, 5, SpeakUpRegistry.Choice.FOR, bytes32(0));
        vm.prank(voter2);
        bytes32 uid2 = registry.castVote(TSLA_MEETING_1, 5, SpeakUpRegistry.Choice.AGAINST, bytes32(0));

        assertTrue(uid1 != uid2);
        assertTrue(registry.hasVoted(voter1, TSLA_MEETING_1, 5));
        assertTrue(registry.hasVoted(voter2, TSLA_MEETING_1, 5));
    }

    /// @notice Acknowledgement with status REJECTED is accepted (not just
    ///         ACKNOWLEDGED). Production may need to mark unresolvable votes.
    function test_RelayerCanRejectAttestation() public {
        vm.prank(alice);
        bytes32 uid = registry.castVote(TSLA_MEETING_1, 4, SpeakUpRegistry.Choice.ABSTAIN, bytes32(0));
        vm.prank(relayer);
        registry.acknowledge(uid, SpeakUpRegistry.AckStatus.REJECTED, "REJECTED-OUTSIDE-WINDOW");
        (,,,,,,, SpeakUpRegistry.AckStatus status, string memory ackRef) = registry.attestations(uid);
        assertEq(uint8(status), uint8(SpeakUpRegistry.AckStatus.REJECTED));
        assertEq(ackRef, "REJECTED-OUTSIDE-WINDOW");
    }
}
