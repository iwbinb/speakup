# Design System · SpeakUp

## Overview

SpeakUp is a fintech-clean product positioned at the intersection of consumer
brokerage UX (Robinhood / Cash App / Public.com) and on-chain governance. The
visual personality is light, calm, and confidence-building: large white
surfaces, generous spacing, a single dominant accent green, and softly tinted
backgrounds that signal "this is finance, not crypto." Layout follows a
narrow-column reading rhythm with content centered in a max-width container,
sticky chrome at top and bottom, and rounded-2xl cards as the universal
surface primitive. Motion is restrained: gentle fade-up entrances, hover
lifts, and a Cmd+K palette that feels closer to Linear than to Web3.

## Colors

- **Brand Primary**: `#00C853` (the SpeakUp green; CTAs, active states, pills, sound-wave logo)
- **Brand Dark**: `#00701A` (text-on-light for high contrast, emphasis paragraphs)
- **Ink 900**: `#0A0F1C` (deep navy-black for headings and primary text)
- **Ink 700**: `#2C3650` (body copy, mid-emphasis)
- **Ink 500**: `#4A525A` (secondary text, captions, kbd hints)
- **Ink 200**: `#E5E7EB` (1px borders, dividers)
- **Ink 100**: `#EEF1F8` (card hover background, very light fills)
- **Ink 50**: `#F6F8FA` (page background tint)
- **Surface**: `#FFFFFF` (cards, modals, app shell)
- **Accent Blue**: `#3B99FC` (WalletConnect badge, link emphasis)
- **Soft Background Wash**: subtle `from-emerald-50/40 via-white to-blue-50/30` gradient on the page background

## Typography

- **Primary Font**: Inter (variable 100-900). Used for everything. No serif. No monospace except for technical strings (`<code>` blocks, 0x addresses).
- **Hero Heading**: 2rem / weight 700 / `text-ink-900` ("Your demo holdings", "Tesla 2025 Annual Meeting").
- **Section Heading**: 1.25rem / weight 600.
- **Body**: 0.875-1rem / weight 400 / `text-ink-700` for reading copy.
- **Caption**: 0.75rem / `text-ink-500` for subtitles and ticker symbols.
- **Microlabel**: 0.625rem uppercase / letter-spacing 0.06em / weight 600 (pill labels: DEMO, WATCHING, INSTALLED, NAVIGATE).
- **Mono / Address**: Inter tabular-nums for short hex strings (`0x14d0…1351`).

## Elevation

Light, layered, no harsh shadows. Cards use `shadow-sm` baseline + 1px `border-ink-200/60` outlines. Modals (ConnectWalletModal, Cmd+K palette) use `shadow-card-lg` (a soft 2-layer drop). Sticky bottom bar on the meeting page floats above the card list. Hover on holding rows lifts via `card-hover` (translateY -2px, brand-tinted border). The page background carries a barely-visible diagonal gradient wash to avoid flat-white sterility.

## Components

- **Ticker Holding Card**: rounded-2xl white card, 48x48 ticker avatar (real Tesla / Amazon / Netflix X profile pic), bold company name + small ticker code, story-hook line, and a green pill button "N proposals →" on the right. Hover lifts the entire card.
- **Identity Chip (header)**: pill-style button with truncated 0x address `0x14d0…1351` + tiny `DEMO` / `WATCHING` / `CONNECTED` badge, opens IdentitySwitcher dropdown.
- **Chain Pill (header)**: green-dot indicator + "Robinhood Chain Testnet" text, opens chain menu listing both supported chains with their numeric IDs.
- **Cmd+K Command Palette**: full-screen overlay with centered 560x400 panel. Search input at top, 4 grouped categories (NAVIGATE, IDENTITY, CHAIN, MEETING), each command shows title left + hint right. Active row tinted brand/10. Footer shows ↑↓ ⏎ ⌘K kbds.
- **ConnectWalletModal**: Reown / Web3Modal style. Centered card with header bar (help icon, "Connect Wallet" title, close X), inline search field, then a list: WalletConnect row (QR CODE badge), each EIP-6963-detected wallet (INSTALLED badge), "More wallets 550+" footer, divider "or", email input + Continue-with-Google button.
- **Proposal Card** (meeting page): white rounded-2xl block per proposal item. Top: category tag + bold title. Middle: 3-line key-details list. Bottom row: 3 tinted stance cards (Management FOR / ISS AGAINST / Glass Lewis AGAINST) with brand-color text. Below: SPEAKUP RECOMMENDS strip with confidence + Three-Line Rationale.
- **Sticky Vote Bar** (meeting page): bottom-anchored card showing "N of M proposals decided" + green "Cast N votes" CTA. Below it the SourcesDisclaimer panel with three labeled bullets explaining where AI / ISS / SpeakUp content comes from.
- **Footer**: 2-column on desktop. Left: logo + tagline + © year + MIT licence note. Right: PRODUCT (Holdings, About) links. Bottom strip: legal disclaimer + ⌘K hint kbd.

## Do's and Don'ts

### Do's

- Use brand green `#00C853` only for primary CTAs, active states, and the wave bars in the logo. One green per surface, not three.
- Pair white cards with the ink-200 border + tiny shadow, not solid shadows.
- Use real X / Twitter profile avatars for ticker logos (Tesla red T, Amazon orange smile, Netflix N).
- Keep address strings monospace and truncated to `0x____…____`.
- Show the SourcesDisclaimer panel anywhere AI output is presented as recommendation.

### Don'ts

- Do not use the dark/cyberpunk Web3 aesthetic (no neon, no glass-morphism with heavy blur, no purple gradients).
- Do not surface raw smart-contract jargon (ABI / opcode / wei) in primary UI. Translate to plain English.
- Do not use multiple accent colors in a single view. Green is the only accent.
- Do not use Comic Sans, serif, or display fonts. Inter only.
- Do not render demo data without a "DEMO" pill on the identity chip so users always know what's real.
