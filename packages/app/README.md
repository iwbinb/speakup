# @speakup/app

Next.js frontend for SpeakUp. Initialized in D10.

## Bootstrap (D10)

```bash
# In packages/app:
bun create next-app@latest . \
  --typescript --tailwind --app --src-dir --import-alias "@/*" \
  --no-eslint --no-git --use-bun --skip-install
bun add viem wagmi @tanstack/react-query @privy-io/react-auth
```

## Style guide

- **Fintech tone**: clean, light theme, rounded cards, sans-serif. Target: looks like Robinhood / Cash App, not Web3 dark-mode cyberpunk.
- **Primary user**: a 30-year-old Robinhood user who has never used a crypto wallet. UX language must be plain English, no "gas" / "approve transaction" / "sign message" jargon unless paired with a tooltip.
- **No emojis** unless explicitly requested by user.
