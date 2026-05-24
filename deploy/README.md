# SpeakUp Deploy Recipes

Production deploy targets bare-metal Ubuntu 24.04 with Caddy + systemd, NodeStake's default stack.

## Components

| Process | systemd unit | port |
|---|---|---|
| Next.js front-end (`bun run start`) | `speakup-app.service` (TODO) | 3000 (local) |
| Mock relayer | `speakup-relayer.service` (this file) | n/a (outbound RPC only) |
| Envio indexer | `speakup-indexer.service` (TODO) | 8080 (local) |

Caddy fronts everything on 443 / 80 with auto-TLS.

## One-time setup

```bash
# 1. system user
sudo useradd --system --create-home --home /var/lib/speakup speakup

# 2. clone the repo into /opt/speakup
sudo git clone https://github.com/iwbinb/speakup /opt/speakup
sudo chown -R speakup:speakup /opt/speakup

# 3. install bun
curl -fsSL https://bun.sh/install | sudo -u speakup bash

# 4. bun install
sudo -u speakup bash -c 'cd /opt/speakup && bun install'

# 5. env file (DO NOT commit)
sudo mkdir -p /etc/speakup
sudo tee /etc/speakup/relayer.env > /dev/null <<'EOF'
ROBINHOOD_RPC_URL=https://rpc.testnet.chain.robinhood.com
ROBINHOOD_CHAIN_ID=46630
REGISTRY=0xb6D8E46BF9e48aDD4747595b2e437Eb327071c94
RELAYER_PRIVATE_KEY=0x<owner-key-here>
ACK_DELAY_SECONDS=2
EOF
sudo chmod 0600 /etc/speakup/relayer.env
sudo chown speakup:speakup /etc/speakup/relayer.env

# 6. install + start the unit
sudo cp /opt/speakup/deploy/speakup-relayer.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now speakup-relayer

# 7. tail logs
sudo journalctl -u speakup-relayer -f
```

## Caddy

```bash
sudo cp /opt/speakup/deploy/Caddyfile /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

DNS: point `speakup.vote` and `www.speakup.vote` A records at the host.
Caddy fetches the cert via ACME within a few seconds of the first request.

## Verify

```bash
# unit status
sudo systemctl status speakup-relayer

# recent acks
curl -s https://explorer.testnet.chain.robinhood.com/api/v2/addresses/0xb6D8E46BF9e48aDD4747595b2e437Eb327071c94/transactions?filter=to | jq '.items[0:3]'

# https reachable
curl -sI https://speakup.vote/ | head -3
```

## Rollback

```bash
sudo systemctl stop speakup-relayer
sudo systemctl disable speakup-relayer
sudo rm /etc/systemd/system/speakup-relayer.service
sudo systemctl daemon-reload
```

## Production roadmap

When Robinhood Chain mainnet ships:
1. Provision a Hetzner AX102 / AX162-R bare-metal host (NodeStake default).
2. Move relayer key to AWS KMS, replace `RELAYER_PRIVATE_KEY` with `RELAYER_KMS_KEY_ID`, patch mock-relayer.ts to sign via KMS.
3. Replace mock acknowledgement with real Broadridge SOAP API call (or Mediant if the issuer uses Mediant).
4. Add Prometheus exporter on the relayer + Grafana dashboard for VoteCast / VoteAcknowledged rates.
5. Two-of-three Safe multisig for `owner` role; relayer stays a single hot key but rotated weekly.
