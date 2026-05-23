import { NextResponse } from 'next/server';

import { anthropicClient, MODEL_PRIMARY } from '@speakup/agent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SYSTEM = `You are SpeakUp Copilot. The user has already seen a proposal summary and a recommendation. They are asking a follow-up question.

Rules:
- Reply in 3 short sentences or fewer.
- Plain English. No legalese, no SEC form codes.
- Never give investment advice. If asked for one, explain that SpeakUp only helps with the vote, not the trade.
- If the question is outside what the proposal text supports, say so explicitly: "The proxy doesn't say."`;

type Body = {
  question: string;
  proposalTitle: string;
  oneLineBackground: string;
  keyDetails: string[];
  managementRecommendation: string;
  speakUpRecommended: string;
  threeLineRationale: string[];
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  if (!body.question) {
    return NextResponse.json({ error: 'question required' }, { status: 400 });
  }

  const context = [
    `Proposal: ${body.proposalTitle}`,
    `Background: ${body.oneLineBackground}`,
    `Key details:\n- ${body.keyDetails.join('\n- ')}`,
    `Management recommends: ${body.managementRecommendation}`,
    `SpeakUp recommends: ${body.speakUpRecommended}`,
    `Rationale:\n- ${body.threeLineRationale.join('\n- ')}`,
  ].join('\n\n');

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messageStream = anthropicClient().messages.stream({
          model: MODEL_PRIMARY,
          max_tokens: 400,
          system: SYSTEM,
          messages: [
            {
              role: 'user',
              content: `${context}\n\nUser question: ${body.question}`,
            },
          ],
        });
        for await (const chunk of messageStream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        controller.enqueue(encoder.encode(`\n[error: ${message}]`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  });
}
