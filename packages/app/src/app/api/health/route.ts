import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    name: 'SpeakUp',
    ts: new Date().toISOString(),
    chain: Number(process.env['NEXT_PUBLIC_DEFAULT_CHAIN_ID'] ?? 46630),
    hasAnthropic: !!process.env['ANTHROPIC_API_KEY'],
    hasPrivy: !!process.env['NEXT_PUBLIC_PRIVY_APP_ID'],
  });
}
