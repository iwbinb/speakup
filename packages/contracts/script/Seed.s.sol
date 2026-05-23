// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console2} from "forge-std/Script.sol";
import {SpeakUpRegistry} from "../src/Registry.sol";

/// @notice Seeds the registry with the three demo tickers (TSLA / AMZN / NFLX)
///         and one upcoming meeting per ticker, pointing at real SEC EDGAR URLs.
///         Run after Deploy.s.sol completes.
/// Usage:
///   REGISTRY=0x... forge script script/Seed.s.sol --rpc-url robinhood_testnet \
///     --private-key $DEPLOYER_PRIVATE_KEY --broadcast
contract Seed is Script {
    // Robinhood Chain testnet native Stock Token addresses
    address constant TSLA_TOKEN_RH = 0xC9f9c86933092BbbfFF3CCb4b105A4A94bf3Bd4E;
    address constant AMZN_TOKEN_RH = 0x5884aD2f920c162CFBbACc88C9C51AA75eC09E02;
    address constant NFLX_TOKEN_RH = 0x3b8262A63d25f0477c4DDE23F83cfe22Cb768C93;

    function run() external {
        uint256 pk = vm.envUint("DEPLOYER_PRIVATE_KEY");
        SpeakUpRegistry registry = SpeakUpRegistry(vm.envAddress("REGISTRY"));

        // On non-Robinhood-Chain networks (Arbitrum Sepolia fallback), allow
        // overriding token addresses via env.
        address tsla = vm.envOr("TSLA_TOKEN", TSLA_TOKEN_RH);
        address amzn = vm.envOr("AMZN_TOKEN", AMZN_TOKEN_RH);
        address nflx = vm.envOr("NFLX_TOKEN", NFLX_TOKEN_RH);

        vm.startBroadcast(pk);

        registry.registerTicker(keccak256("TSLA"), tsla, "0001318605");
        registry.registerTicker(keccak256("AMZN"), amzn, "0001018724");
        registry.registerTicker(keccak256("NFLX"), nflx, "0001065280");

        // Open meetings: vote window now until 30 days out
        uint64 openAt = uint64(block.timestamp);
        uint64 closeAt = openAt + 30 days;

        registry.registerMeeting(
            keccak256("TSLA-2025-ANNUAL"),
            keccak256("TSLA"),
            openAt,
            closeAt,
            "https://www.sec.gov/Archives/edgar/data/1318605/000110465925090866/tm252289-12_def14a.htm"
        );

        registry.registerMeeting(
            keccak256("AMZN-2026-ANNUAL"),
            keccak256("AMZN"),
            openAt,
            closeAt,
            "https://www.sec.gov/Archives/edgar/data/1018724/000110465926041026/tm261382-1_def14a.htm"
        );

        registry.registerMeeting(
            keccak256("NFLX-2026-ANNUAL"),
            keccak256("NFLX"),
            openAt,
            closeAt,
            "https://www.sec.gov/Archives/edgar/data/1065280/000119312526159286/d20613ddef14a.htm"
        );

        vm.stopBroadcast();

        console2.log("Seeded 3 tickers and 3 meetings on chain", block.chainid);
    }
}
