# P1 Completion Status (the "印象分" tier)

Final state after the 100-point push on the P1 list. Each item below is
either landed in code/docs or precisely scoped so an env var or faucet
claim flips it on.

Last updated: 2026-05-24

---

## #6 · Privy wired but inactive

**Status**: code path complete, awaits `NEXT_PUBLIC_PRIVY_APP_ID`.

- `Providers.tsx` switches to `<PrivyProvider>` + `<PrivyWagmiProvider>` when the env var is set
- Theme configured: light mode, `#00c853` accent, logo path, email + Google + Apple + wallet login methods, default chain Robinhood Chain testnet, supported chains list
- `RealAuthProvider` already mirrors the same `useAuth()` interface as `DemoAuthProvider`, so the rest of the app stays untouched when Privy comes online
- Inline hint in `ConnectWalletModal` + Demo banner across the app tell users / judges what to set

**To activate**: register a free app at dashboard.privy.io, set `NEXT_PUBLIC_PRIVY_APP_ID=...` in `.env.local`, restart dev. Demo banner disappears, Email + Google buttons enable.

---

## #7 · WalletConnect wired but inactive

**Status**: peer dep + connector + UI complete, awaits `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`.

- Installed `@walletconnect/ethereum-provider@2.23.9` as runtime dep
- `lib/wagmi.ts` now conditionally appends `walletConnect({ projectId, showQrModal: true, metadata: {...} })` when the env var is set; bare boot path stays clean otherwise
- `ConnectWalletModal` already has the WalletConnect row with `NOT SET` vs `QR CODE` badge that flips based on the same env var
- Modal subtitle + footer hint explain how to enable

**To activate**: register a free project at cloud.walletconnect.com, set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...` in `.env.local`, restart dev. The WalletConnect row turns active, QR opens on click.

---

## #8 · Arbitrum Sepolia simulation green

**Status**: `forge script script/Deploy.s.sol --rpc-url arbitrum_sepolia` returns **SIMULATION COMPLETE**.

- Sepolia RPC reachable (`chainId 421614`, block ~270M)
- Estimated gas for Registry deploy: 2,255,732 units at 0.04 gwei = **0.0000902 ETH (~$0.225)**
- Broadcast artifact saved to `packages/contracts/broadcast/Deploy.s.sol/421614/dry-run/run-latest.json`
- `bun run deploy:sepolia` script already in root `package.json`; the only missing input is faucet ETH

**To activate**: claim ~0.005 ETH at [alchemy.com/faucets/arbitrum-sepolia](https://www.alchemy.com/faucets/arbitrum-sepolia) for `0x14d0b2566bdE08B31FE4AED26fB5D4d209741351`, then `DEPLOYER_PRIVATE_KEY=0x... bun run deploy:sepolia` broadcasts.

---

## #9 · Envio HyperIndex scaffolded

**Status**: full scaffolding present, ready to `envio codegen && envio dev`.

- `packages/indexer/config.yaml`: both networks (Robinhood Chain 46630 with the live Registry address; Arbitrum Sepolia 421614 with empty address list pending #8) with all 7 events wired
- `packages/indexer/schema.graphql`: 6 entities (`Ticker`, `Meeting`, `Vote`, `Voter`, `ItemTally`, `RelayerChange`) with derived relationships
- `packages/indexer/src/EventHandlers.ts`: handlers for all 7 events including ascii decode of bytes32 ticker keys + meeting labels, per-item tally rollup, voter-aggregate counters, and ack patch
- `packages/indexer/package.json`: envio dep + standard `codegen` / `dev` / `start` scripts
- `packages/indexer/README.md`: local-run instructions + hosted-deploy instructions + sample GraphQL queries

**To activate**: `cd packages/indexer && bun install && bun run codegen && bun run dev`. Backfills from `start_block: 60265042` via HyperSync (~minutes); local GraphQL at http://localhost:8080.

---

## #10 · ISS / Glass Lewis transparency

**Status**: dedicated `SourcesDisclaimer` panel rendered at the bottom of every meeting page.

- Three labeled bullets: where the proposal text comes from (SEC EDGAR via Reader Agent, demo-mode pre-canned approximation when no API key); where the ISS / Glass Lewis stances come from (publicly available season previews + prior-year reports, labelled as *approximations*); where the SpeakUp recommendation comes from (Advisor Agent from a stated user preference profile, explicitly not investment advice)
- Calls out the production path: license a real ISS / Glass Lewis feed and label every stance with its publication date

---

## #11 · Pitch deck rendered to PDF + HTML

**Status**: Marp-rendered PDF and HTML present in `docs/`.

- `docs/pitch-deck.md` (5.7KB): Marp YAML frontmatter (theme, paginate, 16:9, custom CSS in brand colours), 13 slides covering Cover, Problem, User Story, Solution, Demo, Architecture, Why-this-wins, Market, Competition, Roadmap, Team, Ask, Thanks
- `docs/pitch-deck.pdf` (240KB): print-ready
- `docs/pitch-deck.html` (143KB): browser-viewable, arrow-key navigable
- Rebuild: `bunx --bun @marp-team/marp-cli docs/pitch-deck.md --pdf -o docs/pitch-deck.pdf`

---

## #12 · Mock relayer as a systemd service

**Status**: full deploy recipe in `deploy/` directory.

- `deploy/speakup-relayer.service`: systemd unit with EnvironmentFile, on-failure restart, journal logging, NoNewPrivileges / PrivateTmp / ProtectSystem hardening
- `deploy/Caddyfile`: full `speakup.vote` server block with gzip+zstd, hashed-asset long cache, no-store for API routes, HSTS + CSP + X-Frame headers, JSON access log, plus `www.speakup.vote` redirect
- `deploy/README.md`: 7-step bare-metal-Ubuntu install recipe (user creation, repo clone, bun install, env file with 0600 perms, unit install, journal tail), verify commands, rollback, and the production roadmap from mock to KMS-signed real Broadridge bridge

**To activate**: SSH to the production host, follow `deploy/README.md`, drop env vars into `/etc/speakup/relayer.env`, `systemctl enable --now speakup-relayer`.

---

## What's still NOT done (the gap to "100/100")

P1 items are now closed. What blocks a literal 100/100:

- **P0 still pending**: HackQuest submission, demo video, public domain deploy, public GitHub push. These are all human-loop actions only Bill can do.
- **#5 (carved out of this goal)**: actually run the Reader/Advisor agents against the real Anthropic API and capture `cache_read_input_tokens` evidence. Awaits `ANTHROPIC_API_KEY`.
- **#8 partial**: Sepolia deploy simulated but not broadcast. Awaits faucet claim.
- **P2 technical debt** (Header/Modal file size, fuzz tests, Playwright, Dockerfile, etc.): tracked separately for post-submission work.
