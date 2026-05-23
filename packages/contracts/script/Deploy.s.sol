// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script, console2} from "forge-std/Script.sol";
import {SpeakUpRegistry} from "../src/Registry.sol";

/// @notice Deploys SpeakUpRegistry to the target chain.
///         Reads RELAYER from env if set, otherwise uses deployer as relayer.
/// Usage:
///   forge script script/Deploy.s.sol --rpc-url robinhood_testnet \
///     --private-key $DEPLOYER_PRIVATE_KEY --broadcast --verify
contract Deploy is Script {
    function run() external returns (SpeakUpRegistry registry) {
        uint256 pk = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(pk);
        address relayer = vm.envOr("RELAYER_ADDRESS", deployer);

        vm.startBroadcast(pk);
        registry = new SpeakUpRegistry(relayer);
        vm.stopBroadcast();

        console2.log("SpeakUpRegistry deployed at", address(registry));
        console2.log("Owner:", deployer);
        console2.log("Relayer:", relayer);
        console2.log("Chain ID:", block.chainid);
    }
}
