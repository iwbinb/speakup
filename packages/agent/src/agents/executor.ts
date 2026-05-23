import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { callJson, MODEL_FAST } from '../anthropic';
import {
  AttestationCallArgsSchema,
  type AttestationCallArgs,
  type VoteDecision,
} from '../types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT_PATH = join(
  __dirname,
  '..',
  'prompts',
  'executor-system.md',
);

let _systemPrompt: string | null = null;
async function systemPrompt(): Promise<string> {
  if (_systemPrompt) return _systemPrompt;
  _systemPrompt = await readFile(SYSTEM_PROMPT_PATH, 'utf8');
  return _systemPrompt;
}

export type ExecuteInput = {
  meetingId: `0x${string}`;
  decisions: VoteDecision[];
};

/**
 * Validate + pack on-chain call args. We run this through Haiku for
 * defense-in-depth (the agent has a hard rule to fail-loud on bad input),
 * then locally re-validate with the zod schema before returning.
 */
export async function pack(input: ExecuteInput): Promise<AttestationCallArgs> {
  const system = await systemPrompt();
  const user = JSON.stringify(input);

  const raw = await callJson<unknown>({
    model: MODEL_FAST,
    system: [system],
    user,
    maxTokens: 2048,
    temperature: 0,
  });
  return AttestationCallArgsSchema.parse(raw);
}

/** Local-only packer (no LLM). Used when we want to skip the agent loop. */
export function packLocal(input: ExecuteInput): AttestationCallArgs {
  return AttestationCallArgsSchema.parse(input);
}
