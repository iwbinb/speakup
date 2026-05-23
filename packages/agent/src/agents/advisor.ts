import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { callJson, MODEL_PRIMARY } from '../anthropic';
import {
  RecommendationListSchema,
  type ProposalList,
  type RecommendationList,
  type UserPreference,
} from '../types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT_PATH = join(
  __dirname,
  '..',
  'prompts',
  'advisor-system.md',
);

let _systemPrompt: string | null = null;
async function systemPrompt(): Promise<string> {
  if (_systemPrompt) return _systemPrompt;
  _systemPrompt = await readFile(SYSTEM_PROMPT_PATH, 'utf8');
  return _systemPrompt;
}

export type AdviseInput = {
  proposals: ProposalList;
  preferences: UserPreference;
  meetingContext: string;
};

export async function advise(input: AdviseInput): Promise<RecommendationList> {
  const system = await systemPrompt();
  const user = JSON.stringify(
    {
      meetingContext: input.meetingContext,
      preferences: input.preferences,
      proposals: input.proposals.proposals.map((p) => ({
        itemId: p.itemId,
        title: p.title,
        category: p.category,
        managementRecommendation: p.managementRecommendation,
        oneLineBackground: p.oneLineBackground,
        keyDetails: p.keyDetails,
        iss: p.iss,
        glassLewis: p.glassLewis,
      })),
    },
    null,
    2,
  );

  const raw = await callJson<unknown>({
    model: MODEL_PRIMARY,
    system: [system],
    user,
    maxTokens: 4096,
    temperature: 0,
  });
  return RecommendationListSchema.parse(raw);
}
