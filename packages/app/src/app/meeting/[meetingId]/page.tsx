import MeetingClient from './MeetingClient';

// Pre-render all 3 demo meeting routes at build time so the Cloudflare
// Pages Edge worker doesn't have to dynamically resolve them on every
// request. Bypasses the next-on-pages "_ENTRIES_REACHED" runtime error
// that hits dynamic-param routes when the wallet provider chain is in
// the bundle.
export function generateStaticParams() {
  return [
    { meetingId: 'TSLA-2025-ANNUAL' },
    { meetingId: 'AMZN-2026-ANNUAL' },
    { meetingId: 'NFLX-2026-ANNUAL' },
  ];
}

export const dynamicParams = false;

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ meetingId: string }>;
}) {
  const { meetingId } = await params;
  return <MeetingClient meetingId={meetingId} />;
}
