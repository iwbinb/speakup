// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console2} from "forge-std/Script.sol";
import {SpeakUpRegistry} from "../src/Registry.sol";

/// @notice One-shot bootstrap: registers TSLA / AMZN / NFLX tickers and their
///         current annual meetings on a freshly deployed SpeakUpRegistry.
///         Token addresses are the canonical Robinhood Chain testnet Stock
///         Tokens; on other chains pass MOCK_TSLA / MOCK_AMZN / MOCK_NFLX env
///         vars to override.
/// Usage:
///   REGISTRY=0x... DEPLOYER_PRIVATE_KEY=0x... \
///     forge script script/Bootstrap.s.sol --rpc-url robinhood_testnet --broadcast
contract Bootstrap is Script {
    address constant ROBINHOOD_TSLA = 0xC9f9c86933092BbbfFF3CCb4b105A4A94bf3Bd4E;
    address constant ROBINHOOD_AMZN = 0x5884aD2f920c162CFBbACc88C9C51AA75eC09E02;
    address constant ROBINHOOD_NFLX = 0x3b8262A63d25f0477c4DDE23F83cfe22Cb768C93;

    // bytes32 ascii literal constants. Pre-computed to avoid the
    // forge-lint(unsafe-typecast) warning that bytes32(string) would raise.
    bytes32 constant TSLA_KEY = 0x54534c4100000000000000000000000000000000000000000000000000000000;
    bytes32 constant AMZN_KEY = 0x414d5a4e00000000000000000000000000000000000000000000000000000000;
    bytes32 constant NFLX_KEY = 0x4e464c5800000000000000000000000000000000000000000000000000000000;
    bytes32 constant TSLA_MEETING = 0x54534c412d323032352d414e4e55414c00000000000000000000000000000000;
    bytes32 constant AMZN_MEETING = 0x414d5a4e2d323032362d414e4e55414c00000000000000000000000000000000;
    bytes32 constant NFLX_MEETING = 0x4e464c582d323032362d414e4e55414c00000000000000000000000000000000;

    string constant TSLA_CIK = "0001318605";
    string constant AMZN_CIK = "0001018724";
    string constant NFLX_CIK = "0001065280";

    string constant TSLA_DEF =
        "https://www.sec.gov/Archives/edgar/data/1318605/000110465925090866/tm252289-12_def14a.htm";
    string constant AMZN_DEF =
        "https://www.sec.gov/Archives/edgar/data/1018724/000110465926041026/tm261382-1_def14a.htm";
    string constant NFLX_DEF =
        "https://www.sec.gov/Archives/edgar/data/1065280/000119312526159286/d20613ddef14a.htm";

    function run() external {
        SpeakUpRegistry registry = SpeakUpRegistry(vm.envAddress("REGISTRY"));
        uint256 pk = vm.envUint("DEPLOYER_PRIVATE_KEY");

        address tsla = vm.envOr("MOCK_TSLA", ROBINHOOD_TSLA);
        address amzn = vm.envOr("MOCK_AMZN", ROBINHOOD_AMZN);
        address nflx = vm.envOr("MOCK_NFLX", ROBINHOOD_NFLX);

        // Voting window: open now, deadline +30 days. Judges should never
        // arrive at a closed meeting.
        uint64 nowTs = uint64(block.timestamp);
        uint64 deadline = nowTs + 30 days;

        vm.startBroadcast(pk);

        registry.registerTicker(TSLA_KEY, tsla, TSLA_CIK);
        registry.registerMeeting(TSLA_MEETING, TSLA_KEY, nowTs, deadline, TSLA_DEF);

        registry.registerTicker(AMZN_KEY, amzn, AMZN_CIK);
        registry.registerMeeting(AMZN_MEETING, AMZN_KEY, nowTs, deadline, AMZN_DEF);

        registry.registerTicker(NFLX_KEY, nflx, NFLX_CIK);
        registry.registerMeeting(NFLX_MEETING, NFLX_KEY, nowTs, deadline, NFLX_DEF);

        vm.stopBroadcast();

        console2.log("Bootstrap done.");
        console2.log("  Registry:", address(registry));
        console2.log("  TSLA token:", tsla);
        console2.log("  AMZN token:", amzn);
        console2.log("  NFLX token:", nflx);
        console2.log("  Voting deadline (unix):", deadline);
    }
}
