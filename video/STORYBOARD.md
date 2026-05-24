# STORYBOARD · SpeakUp 3-Minute Demo

**Format:** 1920×1080
**Audio:** Kokoro TTS voiceover + ambient pad + minimal SFX
**VO direction:** Mid-age neutral, confident-friendly delivery, Linear/Notion product-launch register. Economy of words. Silence between sentences is a feature.
**Style basis:** DESIGN.md (SpeakUp green `#00C853`, ink-900 `#0A0F1C`, white surfaces, Inter type, fintech aesthetic, no neon, no glass-morphism)

**Underscore:** A single soft electric piano pad already playing when the video starts. Sits at -22dB under VO. Lifts +3dB on Beat 5 (Musk re-vote) climax. Drops to silence for one beat on Beat 8 close, then a single warm chord resolve.

---

## Asset Audit

| Asset | Type | Beat | Role |
|---|---|---|---|
| `docs/screenshots/01-landing.png` | Hero | 3, 7 | Full-bleed landing page |
| `docs/screenshots/02-identity-switcher.png` | UI | 3 | Identity panel open (DEMO chip) |
| `docs/screenshots/03-chain-switcher.png` | UI | 7 | Robinhood/Sepolia chain menu |
| `docs/screenshots/04-command-palette.png` | UI | 7 | Cmd+K palette (power-user signal) |
| `docs/screenshots/05-meeting-tsla.png` | Hero | 4 | Tesla 2025 meeting proposal 1 |
| `docs/screenshots/06-musk-comp-vote.png` | Hero | 5 | Musk $56B re-vote (peak) |
| `docs/screenshots/07-about.png` | Long doc | 8 | About page closing |
| `docs/screenshots/08-api-health.png` | API JSON | 6 | Live API proof |
| Tesla X avatar (red T) | Brand mark | 1, 4 | Recognized brand |
| Amazon X avatar (orange smile) | Brand mark | 3, 4 | Recognized brand |
| Netflix X avatar (red N) | Brand mark | 3, 4 | Recognized brand |
| SpeakUp logo (green sound wave) | Brand | 1, 8 | Open + close |
| Robinhood Chain testnet logo / Blockscout url | Proof | 6 | Live testnet proof |

Minimum utilization: 8/8 screenshots used. Logo opens + closes. Three ticker avatars are signature elements.

---

## BEAT 1 · HOOK (0:00–0:18)

**VO:** "You own a hundred shares of Tesla. Every year you get to vote on who runs the company, on the C E O's pay, on whether to move to Texas. And every year, seventy percent of retail shareholders skip the vote. Because the proxy statement is a hundred pages of legalese."

**Concept:** A single Tesla share token rotates slowly center-frame on white. Around it, ghostly stacks of 100-page legal documents fall and pile up. Beat ends with a giant red **70%** number washing across the frame.

**Visual:**
- Background: clean white, faint diagonal noise wash.
- Foreground: Tesla X-avatar (the red T mark) at 280×280, gently rotating 0°→3°→0°, slow scale 1.0→1.03 over 8 seconds.
- Mid-ground: SVG paper pages (8 of them) drift in from top edge, stack untidily at bottom corners with subtle drop shadow. Each page has "DEF 14A · 14a-2(b) · 14a-9" tiny mono text bleeding off-edge.
- Final 5s: large `70%` number scales in from center, ink-900, Inter weight 800, 360px tall. Underneath in ink-500, all-caps tracking-wide: "OF RETAIL SHAREHOLDERS SKIP THE VOTE".
- Tiny SpeakUp logo bottom-right corner from t=0, opacity 0.4.

**Techniques:** SVG path drawing (paper pages), CSS 3D transform (Tesla mark rotation), per-word kinetic typography (the 70% statement).

**Transition OUT:** Whip-zoom into the `0` of `70%`, blurs into white. 0.3s power3.in.

**SFX:** Soft paper rustle on each page fall (-30dB). On 70% reveal: a single low chime.

---

## BEAT 2 · STAKES (0:18–0:34)

**VO:** "Robinhood Chain is about to bring fifty million retail investors on-chain through tokenized stocks. If we do nothing, that participation gap is amplified one thousand times. SpeakUp closes it. Before it forms."

**Concept:** Counter animation. "50,000,000" ticks up in 2 seconds. Then a multiplier `× 1000` appears. Then a closing line.

**Visual:**
- Background: ink-50 wash, with a thin Robinhood Chain logo / wordmark watermarked at 8% opacity bottom-left.
- Center: huge counter "0 → 50,000,000" with tabular-nums Inter, 240px, ink-900. Sub-label below ink-500: "tokenized-stock holders by 2027".
- After 6s: the `× 1000` multiplier slides in from right, brand green pill, 80px.
- Final beat (3s): the full sentence "SpeakUp closes it." appears below in brand green weight 700, scaling 0.95→1.0 with a tiny bounce.
- Throughout: a thin animated horizontal line (gradient ink→brand) at frame baseline, slowly scrolls left.

**Techniques:** Counter animation (number tick), per-word typography reveal, MotionPath (multiplier slide-in).

**Transition OUT:** Cross-fade through white. 0.4s power2.out.

**SFX:** Subtle digital tick under counter rise. On `× 1000`: small "thunk".

---

## BEAT 3 · LIVE PRODUCT (0:34–0:52)

**VO:** "This is the live demo, running on Cloudflare. The header chip says DEMO, so you can explore the whole flow without setting up a wallet. Three real tickers. Tesla, Amazon, Netflix. Each one a live Stock Token on Robinhood Chain testnet."

**Concept:** Real product screenshot ken-burns pan. Cursor moves over the DEMO chip; it pulses. Then the IdentitySwitcher dropdown slides open (using screenshot 02).

**Visual:**
- Full-bleed: `docs/screenshots/01-landing.png` fills 100% of frame. Initial scale 1.04, slow drift to 1.0 over 8s.
- 1.5s in: cursor (custom SVG arrow with brand-color outline) lands on top-right "0x14d0…1351 DEMO" chip. The chip glows brand-green for 0.4s.
- 4s in: cross-dissolve to `docs/screenshots/02-identity-switcher.png` (panel open). Highlight box around the DEMO option with a brand-green outline that draws on (SVG strokeDashoffset animation).
- 9s in: cross-dissolve back to landing, cursor moves down the three ticker cards (Tesla → Amazon → Netflix). Each card gets a soft hover-lift effect (translateY -4px) as cursor passes.
- 14s in: tiny brand-green "live · cloudflare" badge fades in top-right corner.

**Techniques:** Ken Burns image pan, custom-rendered cursor MotionPath, SVG stroke-dash highlight box.

**Transition OUT:** Push-left to next beat. 0.35s power2.inOut.

**SFX:** Subtle UI "click" when cursor hits DEMO chip.

---

## BEAT 4 · PROPOSAL WALK-THROUGH (0:52–1:28)

**VO:** "Open Tesla. Seven proposals up for vote at the twenty twenty-five annual meeting. Take item one. The directors up for re-election. Management says yes. I S S, the largest independent proxy advisor, says no. Glass Lewis, the second largest, says no. SpeakUp's Advisor agent reads the full filing, weighs your stated preferences against both, and recommends AGAINST. High confidence. Three lines. That's the whole decision."

**Concept:** Anchor on `docs/screenshots/05-meeting-tsla.png`. Spotlight the three stance pills (Management FOR · ISS AGAINST · Glass Lewis AGAINST), then the brand-green "SPEAKUP RECOMMENDS AGAINST" strip.

**Visual:**
- Full-bleed: `docs/screenshots/05-meeting-tsla.png`. Hold for 4s on the overall meeting hero.
- 4s in: zoom 1.0 → 1.4, pivot to center the three stance pills row. The three pills get sequential 0.2s scale-in pop (1.0 → 1.05 → 1.0) with their tinted backgrounds glowing.
- 10s in: continued zoom into the SPEAKUP RECOMMENDS strip. Brand green pill at full scale.
- 18s in: per-word kinetic typography of the three-line rationale appearing underneath, each line scale 0.96→1.0 + opacity 0→1, staggered 0.4s apart.
- Throughout: tiny "Reader → Advisor → Executor" agent pipeline diagram in lower-left corner, 80px tall, animating arrows.

**Techniques:** Image zoom-pivot, sequential pill pop, per-line kinetic typography, mini diagram.

**Transition OUT:** Pull back to wide, blur 0→12px, 0.35s.

**SFX:** Subtle pop on each stance pill reveal. On SPEAKUP RECOMMENDS reveal: warm chord swell +2dB.

---

## BEAT 5 · MUSK RE-VOTE (peak) (1:28–1:55)

**VO:** "Now item two. The one that matters. The fifty-six billion dollar Musk performance package. The Delaware court tore it up in twenty twenty-four. Now it's being re-voted. Largest C E O compensation package in U S history. SpeakUp recommends AGAINST. I S S agrees. Glass Lewis agrees. You tap once and move on."

**Concept:** The dollar number is the hero. We scale the screenshot to focus on item 2's title block. A huge `$56,000,000,000` counter rises behind it. The "AGAINST" tap action is shown with a brand-green tap-ripple.

**Visual:**
- Full-bleed: `docs/screenshots/06-musk-comp-vote.png`. Hold 2s.
- 2s in: behind the proposal text, a HUGE `$56,000,000,000` counter rises from 0 in 3 seconds, brand green outlined text, opacity 0.15, weight 900, positioned mid-frame behind the card.
- 8s in: small Delaware court SVG (gavel icon, ink-900) appears top-right, ink stroke-draws in. Tiny subtitle "2024 · rescinded by Court of Chancery".
- 14s in: animated tap on the "AGAINST" pill — a brand-green ripple expands from the pill, 1.0 → 2.5 scale, opacity 1 → 0.
- 18s in: bottom sticky bar updates from "0 of 7 decided" → "1 of 7 decided" with a brief checkmark scale-pop next to the count.
- Throughout: dark vignette around frame edges intensifies slightly (this is the emotional peak).

**Techniques:** Background counter parallax, SVG icon stroke-draw, tap-ripple animation, sticky-bar update with checkmark pop.

**Transition OUT:** Hard cut to wider product context.

**SFX:** On `$56B` counter complete: muted gong (low E). On tap: clean UI "tap" + brief ascending chime.

---

## BEAT 6 · ON-CHAIN PROOF (1:55–2:20)

**VO:** "Every vote becomes an on-chain attestation on Robinhood Chain. The Registry contract is verified on Blockscout. Eight transaction hashes are documented in the repo, proving the full deploy plus vote plus acknowledge cycle. One signature records all your decisions. A mock relayer bridges to Broadridge in production."

**Concept:** Cut to a stylized "blockchain explorer" view. Show the Registry contract address, then 8 transaction hashes scrolling, each one ticking with a brand-green check.

**Visual:**
- Background: cross-fade from previous to `docs/screenshots/08-api-health.png` (the live API JSON view) at 70% opacity.
- Overlay center: a custom dark card (ink-900 background, brand-green text) styled like Blockscout:
  - "SpeakUpRegistry · Verified" badge at top.
  - Contract address `0xb6D8E46BF9e48aDD4747595b2e437Eb327071c94` in mono, animated character-by-character typing effect (0.5s).
  - Below: 8 transaction hash rows appear one per 1.2s, each row: `0xc463...498  ✓ verified` in mono, brand-green check fading in from right.
  - Right side: a mini animated chain link icon (3 chain links connecting) showing the bridge from on-chain → Broadridge.
- The card has a thin brand-green border-bottom that pulses (opacity 0.5 → 1 → 0.5) as a "live signal".

**Techniques:** Character-by-character typing effect (contract address), staggered list reveal (8 hashes), SVG chain-link animation, BlurMask transition between scenes.

**Transition OUT:** Cross-dissolve. 0.4s.

**SFX:** Each tx hash check: subtle ascending pip (C, D, E, F#, G, A, B, C major scale).

---

## BEAT 7 · WHY WE WIN (2:20–2:42)

**VO:** "Three things we want judges to take away. One. We built directly on Robinhood Chain, with their native Stock Tokens, not a wrapper. Two. The product is three specialized Anthropic agents. Reader. Advisor. Executor. The core, not a sidecar. Three. Tokenized equity governance is the unwritten chapter in Robinhood Chain's own roadmap. There is no incumbent."

**Concept:** Three-card layout. Each card slides in left-to-right as the VO numbers them. Final state: all three live on screen, with the SpeakUp logo bottom-center.

**Visual:**
- Background: white with very faint geometric grid (ink-200, opacity 0.1).
- Three cards (640×360 each), stacked horizontally, rounded-2xl, white surface with brand-green left-border (8px).
  - **Card 1** "Native to Robinhood Chain": Robinhood Chain logo + the three ticker avatars (Tesla / Amazon / Netflix). Slides in at 0s.
  - **Card 2** "Three-Agent Architecture": Reader → Advisor → Executor diagram with animated arrows. Each agent labeled with their model (Sonnet / Sonnet / Haiku). Slides in at 7s.
  - **Card 3** "Missing Governance Layer": A subtle Robinhood Chain "roadmap" timeline with SpeakUp marked as the unfilled chapter. Slides in at 14s.
- Each card has a subtle scale-bounce when it lands (1.0 → 1.03 → 1.0).
- Background pulses brand-green at 0.05 opacity in sync with each card landing.

**Techniques:** Sequential card MotionPath slide, mini infographic per card, ambient background pulse.

**Transition OUT:** All three cards scale + fade simultaneously, revealing white. 0.5s expo.out.

**SFX:** On each card land: soft "tonk" (descending C, A, F).

---

## BEAT 8 · CLOSE (2:42–2:55)

**VO:** "SpeakUp is competing for the Robinhood Overall slot, Best Agentic Project, and a seat at Founder House London. Code on GitHub at iwbinb slash speakup. Live at speak up dot vote. Give every on-chain shareholder a voice. Thank you."

**Concept:** Closing brand card. Logo center, tagline below, three URLs. Hold for the final line. Fade to ink-900 black.

**Visual:**
- White surface. SpeakUp logo (green sound-wave mark) centered, 200px, fades in from 0 → 1 over 0.5s with a subtle scale 0.9 → 1.0.
- 1.5s in: "SpeakUp" wordmark appears below in ink-900 Inter 900, 80px.
- 3s in: tagline "Give every on-chain shareholder a voice." in ink-500, italic, 28px.
- 5s in: three small lines below:
  - **Live**: speak up dot vote
  - **Code**: github.com/iwbinb/speakup
  - **Reach**: iwbinb@gmail.com
- Each line slides up + fades in, 0.3s apart.
- Final 2s: hold all elements still. Tiny "Built for the Arbitrum Open House London Buildathon · 2026" footer.
- Background subtly shifts from white → ink-50 in the last 1s.

**Techniques:** Logo entrance (scale + fade), kinetic typography for wordmark, sequential metadata reveal, color-shift background.

**Transition OUT:** Fade to ink-900 over 1.5s. Then 0.5s of black silence before clip ends.

**SFX:** Logo entrance: warm chime (G chord). Final tagline: pad swells one last time, then resolves on a single C-major chord that holds through the black fade.

---

## Production architecture

```
video/
├── index.html                root composition orchestrating all 8 beats
├── DESIGN.md                 brand reference
├── SCRIPT.md                 narration text
├── STORYBOARD.md             THIS FILE
├── narration.wav             Kokoro TTS audio (Step 5)
├── transcript.json           word-level timestamps (Step 5)
├── capture/                  hyperframes capture output
└── compositions/
    ├── beat-1-hook.html
    ├── beat-2-stakes.html
    ├── beat-3-live-product.html
    ├── beat-4-proposal-walk.html
    ├── beat-5-musk-revote.html
    ├── beat-6-on-chain-proof.html
    ├── beat-7-why-we-win.html
    └── beat-8-close.html
```
