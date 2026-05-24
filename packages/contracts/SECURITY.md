# SpeakUp Contracts — Security Notes

Scope: `src/Registry.sol` (single Solidity file, < 250 LOC).

Last updated 2026-05-24.

## Verifiable artifacts

| Metric | Value |
|---|---|
| forge build warnings | 0 |
| forge test pass rate | **25 / 25 (100%)** |
| forge fuzz runs per fuzz test | 5,000 (CI profile) + 2 invariant suites at 256 runs × 256 depth |
| Registry.sol line coverage | **100%** (74 / 74) |
| Registry.sol statement coverage | **95.18%** (79 / 83) |
| Registry.sol branch coverage | **80.95%** (17 / 21) |
| Registry.sol function coverage | **100%** (15 / 15) |
| Slither findings (post-fix) | **0 High · 0 Medium · 1 Low (acknowledged) · 0 Informational · 0 Optimization** |
| Blockscout verification on Robinhood Chain testnet | Pass · Verified at [`0xb6D8E46BF9e48aDD4747595b2e437Eb327071c94`](https://explorer.testnet.chain.robinhood.com/address/0xb6D8E46BF9e48aDD4747595b2e437Eb327071c94) |

Reproduce locally:

```bash
cd packages/contracts
forge test                            # 25 tests
forge coverage --report summary       # Registry 100% line, 100% func
forge test --fuzz-runs 5000           # property tests
slither src/Registry.sol \
  --solc-remaps 'forge-std/=lib/forge-std/src/' \
  --filter-paths 'lib/'               # 0 H · 0 M · 1 L · 0 I · 0 O
```

## Threat model

| Asset | Threat | Mitigation |
|---|---|---|
| `owner` controls ticker / meeting registration | Owner key compromise lets attacker register fake meetings or deactivate tickers | `owner` is now `immutable`; cannot be rotated post-deploy. Production deploys must use a Safe multisig as `owner` from the start. |
| `relayer` writes acknowledgements | Relayer compromise lets attacker mark votes as ACKNOWLEDGED without bridging | Relayer is rotatable via owner-only `setRelayer`. Acknowledgement is informational, not authoritative; vote attestation itself is unforgeable. Production: hot key rotated weekly, KMS-signed in 2026 Q3. |
| Vote weight from `IERC20(token).balanceOf` at cast time | Token contract returns wrong balance | Only owner-registered tokens accepted; weight is read from a Robinhood-Chain or Sepolia ERC-20 that issuer controls. Production gate: only ERC-3643 or whitelist-style tokens pass an off-chain compliance check before owner registers them. |
| Reentrancy via external token call | Malicious token re-enters `_castVote` | `balanceOf` is read-only with no state mutation in the token; Registry writes happen after the call. No `transfer`-style value flows initiated by Registry. Invariant test asserts `voter != address(0)` for every stored uid. |
| Block-timestamp drift | Validators shift `block.timestamp` by ~15s to manipulate vote windows | Voting windows are measured in days; 15s drift is irrelevant. forge-lint and slither both flagged this; suppressed with explicit comment + listed below as accepted. |
| Hash collision on `uid` | Different votes collide on `uid`, overwriting prior attestation | `uid = keccak256(voter, meetingId, itemId, chainid, address(this))`. `testFuzz_UidIsDeterministic` asserts collision-freedom under fuzzing. |

## Slither output (after fixes)

```
Detector: calls-loop
SpeakUpRegistry._castVote(...) reads IERC20.balanceOf(voter) inside
castVotes loop.
```

**Accepted.** Each vote in a batch reads the latest weight; this is the intended semantics, not a flaw. Slither false-positives the read-only ERC-20 view call as a state-changing external call.

**Resolved between scans:**

- ~~`incorrect-equality` on `weight == 0`~~ → false positive against literal zero comparison on a `uint256`; suppressed with `slither-disable-next-line` + comment.
- ~~`immutable-states` on `owner`~~ → declared `immutable`. Real fix.
- ~~`calls-loop` from `this.castVote(...)`~~ → refactored to internal `_castVote(voter, ...)` helper. Real fix; also cheaper gas (saves the external CALL per item in batch).
- `timestamp` → suppressed with comment; voting windows measured in days, drift irrelevant.

## Tests

- 25 unit tests (`test/Registry.t.sol`), all passing.
- Cases covered: happy path, double-vote, no balance, closed meeting, before-open, after-deadline, owner-only registration, relayer-only acknowledgement, batch cast, batch length mismatch, owner immutability, uid determinism.
- 2 fuzz tests (5,000 runs each in CI profile): weight matches balance, uid is deterministic and collision-free.
- 2 invariants: attestation voter is never zero address; `hasVoted` is consistent with stored uids.

## Known gaps

1. **No formal audit.** Hackathon submission only. Production deploy will require an external audit before mainnet.
2. **No upgradeability.** Intentional: immutable owner + replaceable relayer give clean security boundaries without proxy footguns. New Registry versions ship as fresh deploys with explicit migration.
3. **Token registration trusts owner judgment** on whether a token's `balanceOf` is honest. Production gate: only ERC-3643 / whitelist tokens from approved issuers pass off-chain compliance, owner registers them on-chain after that.
4. **Mock relayer is a centralised process.** Production path bridges to Broadridge with off-chain attestations and an HSM-signed acknowledgement key.

## Out-of-scope

- Off-chain agent code (`packages/agent/`) is not part of the chain security boundary; it never holds the deployer or relayer key. AI prompt-injection risk is mitigated by always requiring a user signature for the on-chain action.
- Front-end (`packages/app/`) similarly never sees the deployer key; only the user's own wallet signs.
