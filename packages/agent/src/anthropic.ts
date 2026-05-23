import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env['ANTHROPIC_API_KEY'];

export const MODEL_PRIMARY =
  process.env['ANTHROPIC_MODEL_PRIMARY'] ?? 'claude-sonnet-4-6';
export const MODEL_FAST =
  process.env['ANTHROPIC_MODEL_FAST'] ?? 'claude-haiku-4-5-20251001';

let _client: Anthropic | null = null;

export function client(): Anthropic {
  if (_client) return _client;
  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY missing. Set it in .env before calling any agent.',
    );
  }
  _client = new Anthropic({ apiKey });
  return _client;
}

export type CachedSystemBlock = {
  type: 'text';
  text: string;
  cache_control?: { type: 'ephemeral' };
};

/**
 * Build a system prompt array with prompt caching enabled on the last block.
 * Per Anthropic best practice, mark stable boilerplate (instructions + reference
 * docs) as cache_control. Variable input goes in user message instead.
 */
export function cachedSystem(blocks: string[]): CachedSystemBlock[] {
  return blocks.map((text, i) => {
    const block: CachedSystemBlock = { type: 'text', text };
    if (i === blocks.length - 1) {
      block.cache_control = { type: 'ephemeral' };
    }
    return block;
  });
}

export type CallOptions = {
  model?: string;
  system: string[];
  user: string;
  maxTokens?: number;
  temperature?: number;
};

export async function callJson<T>(opts: CallOptions): Promise<T> {
  const model = opts.model ?? MODEL_PRIMARY;
  const resp = await client().messages.create({
    model,
    max_tokens: opts.maxTokens ?? 8192,
    temperature: opts.temperature ?? 0,
    system: cachedSystem(opts.system),
    messages: [{ role: 'user', content: opts.user }],
  });

  const first = resp.content[0];
  if (!first || first.type !== 'text') {
    throw new Error(`Expected text response, got ${first?.type ?? 'empty'}`);
  }
  return extractJson<T>(first.text);
}

/**
 * Extract a JSON object from a model response that may include surrounding
 * prose. We look for the first balanced {...} block.
 */
export function extractJson<T>(raw: string): T {
  const start = raw.indexOf('{');
  if (start < 0) throw new Error('No JSON object found in response');
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < raw.length; i++) {
    const ch = raw[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === '\\') {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      if (depth === 0) {
        const slice = raw.slice(start, i + 1);
        return JSON.parse(slice) as T;
      }
    }
  }
  throw new Error('Unbalanced JSON object in response');
}
