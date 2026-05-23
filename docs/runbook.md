# SpeakUp Runbook

How to run, deploy, demo, and submit SpeakUp.

---

## Local development (already verified)

Validated 2026-05-23 in a single session. All steps below have been observed working.

### 1. Install Foundry (one-time)

Already installed at `~/.foundry/bin/`. To install on a fresh machine:

```bash
# Option A: official installer
curl -L https://foundry.paradigm.xyz | bash && foundryup

# Option B: download binary directly from GitHub releases
mkdir -p ~/.foundry/bin
curl -fL -o /tmp/foundry.tar.gz \
  https://github.com/foundry-rs/foundry/releases/download/v1.7.1/foundry_v1.7.1_darwin_arm64.tar.gz
tar -xzf /tmp/foundry.tar.gz -C ~/.foundry/bin
```

Add `export PATH="$HOME/.foundry/bin:$PATH"` to your shell rc.

### 2. Install dependencies

```bash
bun install
cd packages/contracts && ~/.foundry/bin/forge install foundry-rs/forge-std
```

### 3. Local anvil chain (for fast E2E without testnet)

```bash
# Terminal 1: anvil
~/.foundry/bin/anvil --chain-id 31337 --port 8545 --silent

# Terminal 2: deploy + seed
cd packages/contracts
export DEPLOYER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80  # anvil[0]
~/.foundry/bin/forge script script/Deploy.s.sol:Deploy --rpc-url http://localhost:8545 --private-key $DEPLOYER_PRIVATE_KEY --broadcast
# Registry deployed to: 0x5fbdb2315678afecb367f032d93f642f64180aa3 (deterministic on anvil)

export REGISTRY=0x5fbdb2315678afecb367f032d93f642f64180aa3
~/.foundry/bin/forge script script/Seed.s.sol:Seed --rpc-url http://localhost:8545 --private-key $DEPLOYER_PRIVATE_KEY --broadcast
```

### 4. Frontend dev server

```bash
cd packages/app
PORT=3001 bun run dev
# Visit http://localhost:3001
# Without NEXT_PUBLIC_PRIVY_APP_ID, the landing page shows a setup hint
```

### 5. Test the API directly

```bash
curl http://localhost:3001/api/health
# {"status":"ok","name":"SpeakUp","ts":"...","chain":46630,"hasAnthropic":false,"hasPrivy":false}

# /api/proposals requires ANTHROPIC_API_KEY
curl 'http://localhost:3001/api/proposals?meetingId=TSLA-2025-ANNUAL'
```

### 6. Run the EDGAR probe

```bash
cd packages/agent
bun run scripts/edgar-probe.ts TSLA
# Output: fetches Tesla's 2025 DEF 14A, ~1.16 MB / ~298K tokens
# With ANTHROPIC_API_KEY set: full Reader Agent run + proposal extraction
```

### 7. Run the mock relayer

```bash
cd packages/agent
RELAYER_PRIVATE_KEY=0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d \
REGISTRY=0x5fbdb2315678afecb367f032d93f642f64180aa3 \
ROBINHOOD_RPC_URL=http://localhost:8545 \
ACK_DELAY_SECONDS=5 \
bun run scripts/mock-relayer.ts
# Watches VoteCast events, acknowledges 5s later
```

---

## Deploying to Robinhood Chain testnet (production demo)

### 1. Fund the deployer

A fresh deployer was generated during validation. Address recorded in `.env.local`.

Visit https://faucet.testnet.chain.robinhood.com, paste the deployer address, claim:

- 5 ETH (gas)
- 5x of each Stock Token (TSLA / AMZN / PLTR / NFLX / AMD)

The faucet is captcha-protected; must be done manually in a browser.

### 2. Deploy + seed on Robinhood Chain testnet

```bash
cd packages/contracts
source ../../.env.local
export DEPLOYER_PRIVATE_KEY=$ROBINHOOD_DEPLOYER_KEY

~/.foundry/bin/forge script script/Deploy.s.sol:Deploy \
  --rpc-url $ROBINHOOD_RPC_URL --private-key $DEPLOYER_PRIVATE_KEY --broadcast --verify

# Capture the printed Registry address
export REGISTRY=0x...  # paste from console output

~/.foundry/bin/forge script script/Seed.s.sol:Seed \
  --rpc-url $ROBINHOOD_RPC_URL --private-key $DEPLOYER_PRIVATE_KEY --broadcast
```

### 3. Deploy to Arbitrum Sepolia (dual-deploy)

Get Sepolia ETH from https://sepoliafaucet.com, then:

```bash
~/.foundry/bin/forge script script/Deploy.s.sol:Deploy \
  --rpc-url $ARBITRUM_SEPOLIA_RPC_URL --private-key $DEPLOYER_PRIVATE_KEY --broadcast --verify

# Seed uses env overrides for token addresses (Robinhood Stock Tokens don't exist on Sepolia,
# so deploy MockERC20 mocks first or skip the Sepolia seed).
```

### 4. Update .env.local

```bash
NEXT_PUBLIC_REGISTRY_RH=0x...           # from step 2
NEXT_PUBLIC_REGISTRY_ARB_SEPOLIA=0x...  # from step 3
```

### 5. Start mock relayer against Robinhood Chain

```bash
cd packages/agent
RELAYER_PRIVATE_KEY=$ROBINHOOD_DEPLOYER_KEY \
REGISTRY=<deployed-registry> \
ROBINHOOD_RPC_URL=https://rpc.testnet.chain.robinhood.com \
ACK_DELAY_SECONDS=10 \
bun run scripts/mock-relayer.ts &
```

---

## Demo day checklist

- [ ] Faucet ETH + Stock Tokens claimed for deployer + demo wallet
- [ ] Registry deployed + verified on Robinhood Chain testnet + Arbitrum Sepolia
- [ ] Seed run, tickers + meetings visible via cast
- [ ] mock relayer running in background
- [ ] `.env` populated: ANTHROPIC_API_KEY, PRIVY_APP_ID, both REGISTRY addresses
- [ ] `bun dev` running on production domain (Vercel or self-hosted Caddy)
- [ ] Demo wallet (browser) holds at least 1 TSLA / AMZN / NFLX
- [ ] At least one full end-to-end test recorded as backup video
- [ ] Pitch deck rendered to PDF
- [ ] HackQuest submission form drafted in a doc, ready to paste

---

## Submission day (2026-06-14)

1. Final smoke test on production URL
2. Record 3-minute demo video (script in `docs/pitch-deck.md` slide 5)
3. Upload deck PDF + video to a stable host (Loom, YouTube unlisted)
4. Submit on https://www.hackquest.io/hackathons/Arbitrum-Open-House-London-Online-Buildathon
   - Project name: SpeakUp
   - Tagline: Give every on-chain shareholder a voice
   - Description: copy from README + production roadmap onepager
   - GitHub URL: github.com/iwbinb/speakup
   - Demo URL: speakup.vote
   - Video URL: from step 3
   - Categories: Best Agentic Project + Robinhood Chain track
5. Tweet a thread with the demo video
6. Stay on Discord for 12 hours buffer in case judges flag bugs
