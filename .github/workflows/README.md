# CI / Deployment Workflows

| Workflow | Trigger | Purpose |
|---|---|---|
| `ci.yml` | push / PR | typecheck (bun) + forge build / test / coverage |
| `deploy.yml` | push to main | build with @cloudflare/next-on-pages + deploy to CF Pages |

## One-time setup for `deploy.yml`

The deploy workflow needs two GitHub repository secrets:

1. **`CLOUDFLARE_API_TOKEN`**
   Create at https://dash.cloudflare.com/profile/api-tokens with template
   "Edit Cloudflare Workers" (or custom token with `Account.Cloudflare Pages: Edit`
   permission scoped to the `iwbinb@gmail.com` account).

2. **`CLOUDFLARE_ACCOUNT_ID`**
   Find in any Cloudflare dashboard URL or at the bottom of the Workers & Pages
   overview page. Format: 32-char hex string. For this project:
   `d9e63a8ed31acf4425f6fde0bdca3ba1`

Set them via GitHub CLI:

```bash
gh secret set CLOUDFLARE_API_TOKEN     # paste API token when prompted
gh secret set CLOUDFLARE_ACCOUNT_ID --body 'd9e63a8ed31acf4425f6fde0bdca3ba1'
```

Or via the GitHub UI: Settings → Secrets and variables → Actions → New repository secret.

## Optional production environment variables

For the live deployment to leave demo mode, also set these secrets to **CF Pages**
(not GitHub) via dashboard or `wrangler pages secret put`:

```
wrangler pages secret put NEXT_PUBLIC_PRIVY_APP_ID         --project-name speakup
wrangler pages secret put NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID --project-name speakup
wrangler pages secret put ANTHROPIC_API_KEY                --project-name speakup
```

Note: `NEXT_PUBLIC_*` variables bake into the client bundle at build time, so
they must be present during the CI build step. Set them as build-time vars in
the Cloudflare Pages project settings under "Environment variables · Production".
