import { parseHTML } from 'linkedom';

const EDGAR_BASE = 'https://data.sec.gov';
const userAgent = () =>
  process.env['EDGAR_USER_AGENT'] ?? 'SpeakUp iwbinb@gmail.com';

export type EdgarFiling = {
  form: string;
  filingDate: string;
  accessionNumber: string;
  primaryDocument: string;
  url: string;
};

export async function fetchDef14aFilings(
  cik: string,
  limit = 5,
): Promise<EdgarFiling[]> {
  const padded = cik.padStart(10, '0');
  const url = `${EDGAR_BASE}/submissions/CIK${padded}.json`;
  const resp = await fetch(url, { headers: { 'User-Agent': userAgent() } });
  if (!resp.ok) {
    throw new Error(`EDGAR submissions ${resp.status}: ${await resp.text()}`);
  }
  const data = (await resp.json()) as {
    filings: {
      recent: {
        form: string[];
        filingDate: string[];
        accessionNumber: string[];
        primaryDocument: string[];
      };
    };
  };
  const recent = data.filings.recent;
  const cikInt = Number(cik).toString();
  const out: EdgarFiling[] = [];
  for (let i = 0; i < recent.form.length && out.length < limit; i++) {
    const form = recent.form[i];
    if (!form || form !== 'DEF 14A') continue;
    const acc = recent.accessionNumber[i];
    const doc = recent.primaryDocument[i];
    const date = recent.filingDate[i];
    if (!acc || !doc || !date) continue;
    const accBare = acc.replace(/-/g, '');
    out.push({
      form,
      filingDate: date,
      accessionNumber: acc,
      primaryDocument: doc,
      url: `https://www.sec.gov/Archives/edgar/data/${cikInt}/${accBare}/${doc}`,
    });
  }
  return out;
}

/**
 * Fetch a DEF 14A HTML document and reduce it to clean text suitable for
 * passing to an LLM. Strips images, scripts, styles, and collapses whitespace.
 */
export async function fetchDef14aText(url: string): Promise<{
  text: string;
  approxTokens: number;
}> {
  const resp = await fetch(url, { headers: { 'User-Agent': userAgent() } });
  if (!resp.ok) {
    throw new Error(`EDGAR doc ${resp.status} for ${url}`);
  }
  const html = await resp.text();
  const text = htmlToCleanText(html);
  // Conservative token estimate: ~4 chars per token.
  const approxTokens = Math.ceil(text.length / 4);
  return { text, approxTokens };
}

export function htmlToCleanText(html: string): string {
  const { document } = parseHTML(html);
  document.querySelectorAll('script, style, img').forEach((n) => n.remove());
  const raw = document.body?.textContent ?? document.documentElement.textContent ?? '';
  return raw
    .replace(/ /g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Simple file-system cache for EDGAR docs. 24h TTL. Avoids hammering SEC
 * during development and prompt caching iterations.
 */
export async function fetchDef14aTextCached(
  url: string,
  cacheDir: string,
): Promise<{ text: string; approxTokens: number; cached: boolean }> {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  await fs.mkdir(cacheDir, { recursive: true });
  const key = crypto.createHash('sha256').update(url).digest('hex').slice(0, 32);
  const cachePath = path.join(cacheDir, `${key}.txt`);
  try {
    const stat = await fs.stat(cachePath);
    const ageMs = Date.now() - stat.mtimeMs;
    if (ageMs < 24 * 60 * 60 * 1000) {
      const text = await fs.readFile(cachePath, 'utf8');
      return { text, approxTokens: Math.ceil(text.length / 4), cached: true };
    }
  } catch {
    // miss
  }
  const { text, approxTokens } = await fetchDef14aText(url);
  await fs.writeFile(cachePath, text, 'utf8');
  return { text, approxTokens, cached: false };
}

/**
 * Compute a SpeakUp meetingId from a ticker + meeting label.
 * Matches keccak256("TSLA-2025-ANNUAL") used in the Seed script.
 */
export function meetingIdFor(ticker: string, label: string): string {
  // Pure utility; actual keccak comes from viem in the app layer. Here just
  // return the canonical string so caller can hash it.
  return `${ticker.toUpperCase()}-${label.toUpperCase()}`;
}
