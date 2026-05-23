import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { callJson, MODEL_PRIMARY } from '../anthropic';
import { ProposalListSchema, type ProposalList } from '../types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT_PATH = join(__dirname, '..', 'prompts', 'reader-system.md');

let _systemPrompt: string | null = null;
async function systemPrompt(): Promise<string> {
  if (_systemPrompt) return _systemPrompt;
  _systemPrompt = await readFile(SYSTEM_PROMPT_PATH, 'utf8');
  return _systemPrompt;
}

const USER_TEMPLATE_HEADER = `You are reading the DEF 14A for the following company. Extract the proposals per the rules in the system prompt.

Company ticker: {TICKER}
Filing URL: {URL}

DEF 14A body text follows after the marker. The text is large; focus on sections titled "Proposal N" or items in the proxy card section.

=== DEF 14A BODY ===
`;

export type ReadInput = {
  ticker: string;
  defUrl: string;
  bodyText: string;
};

/**
 * Run the Reader agent on a single DEF 14A document. Returns a validated
 * ProposalList. The system prompt is cached so subsequent calls within the
 * 5-min Anthropic cache window are cheap.
 */
export async function readProposals(input: ReadInput): Promise<ProposalList> {
  const system = await systemPrompt();
  const userHeader = USER_TEMPLATE_HEADER.replace('{TICKER}', input.ticker).replace(
    '{URL}',
    input.defUrl,
  );
  const user = userHeader + truncateForContext(input.bodyText);

  const raw = await callJson<unknown>({
    model: MODEL_PRIMARY,
    system: [system],
    user,
    maxTokens: 8192,
    temperature: 0,
  });
  return ProposalListSchema.parse(raw);
}

/**
 * Sonnet 4.6 has 200k context, but DEF 14A bodies can exceed it after
 * cleaning. We keep the first ~150k tokens worth (600k chars) which always
 * contains the proxy card and proposal text; appendices follow.
 */
const MAX_CHARS = 600_000;
function truncateForContext(text: string): string {
  if (text.length <= MAX_CHARS) return text;
  return text.slice(0, MAX_CHARS) + '\n\n[TRUNCATED]';
}
