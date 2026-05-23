# @speakup/contracts

Solidity contracts for SpeakUp, built with Foundry.

## Layout (after `forge init . --force --no-git`)

```
src/
  Registry.sol           Tracks attestation issuers + per-meeting metadata.
  schemas/
    VoteAttestation.sol  EAS schema definition.
lib/
  forge-std/             Foundry std lib.
  eas-contracts/         Ethereum Attestation Service.
test/
  Registry.t.sol
script/
  Deploy.s.sol
```

## Bootstrap

```bash
# In packages/contracts:
forge init . --force --no-git --no-commit
forge install foundry-rs/forge-std --no-commit
forge install ethereum-attestation-service/eas-contracts --no-commit
forge build
forge test -vvv
```

## Deploy

```bash
# Robinhood Chain testnet
forge script script/Deploy.s.sol \
  --rpc-url robinhood_testnet \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --broadcast \
  --verify

# Arbitrum Sepolia (fallback / dual deploy)
forge script script/Deploy.s.sol \
  --rpc-url arbitrum_sepolia \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --broadcast \
  --verify
```

## Coverage target

`forge coverage` ≥ 90% line + branch. Required by judge dimension 1 (smart contract quality).
