# SpeakUp Contracts — Security Notes

Scope: `src/Registry.sol` (single Solidity file, < 250 LOC).

Last updated 2026-05-24.

## Threat model

| Asset | Threat | Mitigation |
|---|---|---|
| `owner` controls ticker / meeting registration | Owner key compromise lets attacker register fake meetings or deactivate tickers | Use multisig (Safe) for production deploy; owner is set once in constructor and never reset by anyone except owner itself |
| `relayer` writes acknowledgements | Relayer compromise lets attacker mark votes as ACKNOWLEDGED without bridging | Relayer is separable from owner; rotate via `setRelayer()`. Acknowledgement is informational, not authoritative; vote attestation itself is unforgeable |
| Vote weight is read from `IERC20(token).balanceOf` at cast time | Token contract returns wrong balance | Only owner-registered tokens are accepted; production deploys validate token via on-chain checks (totalSupply, decimals) before registration |
| Reentrancy via external token call | Malicious token re-enters `castVote` | `balanceOf` is a `staticcall` semantically; no state writes follow the call that depend on it; no `transfer` of value initiated from Registry |
| Block-timestamp drift | Validators shift `block.timestamp` by ~15s to manipulate vote windows | Voting windows are measured in days; 15s drift is irrelevant. Flagged by `forge-lint(block-timestamp)`, suppressed with `disable-next-line` and comment explaining |

## Tests

- 19 unit tests (`test/Registry.t.sol`), all passing.
- Cases covered: happy path, double-vote, no balance, closed meeting, window boundaries, owner-only registration, relayer-only acknowledgement, non-owner / non-relayer rejection.
- CI profile runs `fuzz = 5000` and `invariant = 256 depth 256` per `foundry.toml`.

## Static analysis

- `forge build` produces two classes of advisory warnings, both reviewed:
  - `block-timestamp` in `castVote()` window check — explicitly suppressed with comment (windows are days, drift is irrelevant).
  - `unsafe-typecast` on `bytes32(string)` casts in older test code — test fixtures only, no production-path impact; one instance explicitly suppressed in test, rest acknowledged here.
- Slither / Aderyn runs are tracked as a follow-up before mainnet deploy.

## Known gaps

1. No formal audit. Hackathon submission only.
2. No upgradeability. Production deploy would either be immutable per release or wrap in a proxy with timelock.
3. Token registration trusts owner judgment on whether a token's `balanceOf` is honest.
4. Mock relayer is a centralised process. Production path bridges to Broadridge with off-chain attestations and an HSM-signed acknowledgement key.

## Out-of-scope

- Off-chain agent code (`packages/agent/`) is not part of the chain security boundary; it never holds the deployer key. AI prompt-injection risk is mitigated by always requiring a user signature for the on-chain action.
