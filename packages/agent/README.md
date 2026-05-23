# @speakup/agent

Anthropic-powered agents for SpeakUp.

Three agents, each a thin wrapper over `@anthropic-ai/sdk`:

- **Reader** (Sonnet 4.6): Pulls SEC EDGAR DEF 14A, extracts a structured proposal array.
- **Advisor** (Sonnet 4.6): Takes proposals + user preferences + ISS/Glass Lewis stances, produces a recommendation with three-line rationale.
- **Executor** (Haiku 4.5): Packs decisions into EAS attestation call args.

Prompt caching is mandatory for cost control. Target: < $0.10 per full DEF 14A analysis.

## Scripts

```bash
bun run edgar-probe    # validates EDGAR API + cache strategy
bun test               # agent eval suite
```
