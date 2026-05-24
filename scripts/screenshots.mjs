#!/usr/bin/env bun
/**
 * Capture 8 hero shots of SpeakUp from the live deployment, save to
 * docs/screenshots/. Run with:
 *
 *   bun run scripts/screenshots.mjs              # uses live CF Pages URL
 *   BASE=http://localhost:3000 bun run scripts/screenshots.mjs   # local
 *
 * Output: docs/screenshots/01-landing.png ... 08-about.png at 1440x900.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '..', 'docs', 'screenshots');
const BASE = process.env.BASE ?? 'https://speakup-2la.pages.dev';
const VIEW = { width: 1440, height: 900 };

await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: VIEW,
  deviceScaleFactor: 2, // retina-quality PNGs
});
const page = await ctx.newPage();

async function shot(name, url, after) {
  const file = resolve(OUT_DIR, `${name}.png`);
  console.log(`→ ${name}  ${url}`);
  await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  if (after) await after(page);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`  saved ${file}`);
}

// 01 · landing
await shot('01-landing', '/');

// 02 · identity switcher open
await shot('02-identity-switcher', '/', async (p) => {
  await p.click('header button[title="Switch identity"]');
  await p.waitForTimeout(300);
});

// 03 · chain switcher open
await shot('03-chain-switcher', '/', async (p) => {
  await p.click('header button[title="Switch chain"]');
  await p.waitForTimeout(300);
});

// 04 · command palette (Cmd+K)
await shot('04-command-palette', '/', async (p) => {
  await p.keyboard.press('Meta+k');
  await p.waitForTimeout(300);
});

// 05 · TSLA meeting hero (proposal 1)
await shot('05-meeting-tsla', '/meeting/TSLA-2025-ANNUAL', async (p) => {
  await p.waitForSelector('text=Tesla 2025', { timeout: 10_000 });
});

// 06 · TSLA meeting proposal 2 (Musk $56B)
await shot('06-musk-comp-vote', '/meeting/TSLA-2025-ANNUAL', async (p) => {
  await p.waitForSelector('text=Musk', { timeout: 10_000 });
  // Scroll to second proposal
  await p.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('p, h2, h3'));
    const target = headings.find((el) =>
      el.textContent?.toLowerCase().includes('musk') ||
      el.textContent?.toLowerCase().includes('performance award'),
    );
    if (target) target.scrollIntoView({ block: 'center' });
  });
  await p.waitForTimeout(400);
});

// 07 · About page
await shot('07-about', '/about');

// 08 · API live (JSON) — render as a styled page via data-uri so the
// screenshot looks intentional instead of raw text.
await shot('08-api-health', '/', async (p) => {
  const resp = await p.evaluate(async () => {
    const r = await fetch('/api/health');
    return r.json();
  });
  const html = `<!doctype html><html><head><style>
    body{font-family:-apple-system,Inter,sans-serif;background:#f0f4ff;margin:0;padding:48px;color:#1a1d21}
    .wrap{max-width:760px;margin:0 auto}
    h1{font-size:28px;font-weight:700;color:#00701a;margin:0 0 8px}
    .sub{color:#4a525a;margin:0 0 28px}
    pre{background:#fff;border:1px solid #e6eaf0;border-radius:14px;padding:24px;font-size:15px;line-height:1.7;box-shadow:0 1px 2px rgba(0,0,0,.04)}
    .pill{display:inline-block;background:#00c853;color:#fff;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:3px 9px;border-radius:9px;margin-left:8px;vertical-align:middle}
  </style></head><body><div class="wrap">
    <h1>SpeakUp API <span class="pill">live</span></h1>
    <p class="sub">GET https://speakup-2la.pages.dev/api/health</p>
    <pre>${JSON.stringify(resp, null, 2)}</pre>
  </div></body></html>`;
  await p.setContent(html);
  await p.waitForTimeout(200);
});

await browser.close();
console.log('\n✅ 8 screenshots saved to docs/screenshots/');
