export const MODELS = {
  primary: process.env['ANTHROPIC_MODEL_PRIMARY'] ?? 'claude-sonnet-4-6',
  fast: process.env['ANTHROPIC_MODEL_FAST'] ?? 'claude-haiku-4-5-20251001',
} as const;

export type AgentRole = 'reader' | 'advisor' | 'executor';
