# @speakup/indexer

Envio HyperIndex indexer for SpeakUp attestations. Bootstrapped in D15.

## What it indexes

- `Attestation` events from Registry contract on Robinhood Chain testnet + Arbitrum Sepolia
- Acknowledgement attestations from mock relayer
- Per-voter aggregate stats (total votes cast, last activity)

## Bootstrap (D15)

```bash
# In packages/indexer:
bunx envio init -d . -l typescript -n speakup-indexer
# Edit config.yaml: add Registry contract addresses + ABI from packages/contracts/out
bun run dev
```

## Frontend integration

App queries the indexer via GraphQL at `http://localhost:8080/v1/graphql` (dev) or hosted URL (prod).
