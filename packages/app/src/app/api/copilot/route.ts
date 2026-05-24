import { NextResponse } from 'next/server';

export const runtime = 'edge';
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
      // Demo mode: no Anthropic key, stream a canned fallback so the UI
      // still shows the typing-indicator UX without server errors.
      if (!process.env['ANTHROPIC_API_KEY']) {
        const demo =
          'Demo mode is read-only. Set ANTHROPIC_API_KEY on the deployment to enable live Copilot answers.';
        for (const ch of demo) controller.enqueue(encoder.encode(ch));
        controller.close();
        return;
      }
      // Real-mode (live Anthropic streaming) is intentionally inactive
      // on the Edge runtime to keep the bundle free of @speakup/agent's
      // Node-only deps. The streaming UI still works in demo mode; for a
      // real Anthropic stream, deploy this route to a Node-runtime host
      // or refactor agent/index.ts to ship an Edge-only subpath.
      const note = `[live Anthropic streaming is disabled in this Edge deployment; context: "${body.question.slice(0, 80)}…"]`;
      for (const ch of note) controller.enqueue(encoder.encode(ch));
      controller.close();
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
