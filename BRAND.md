# Brand & style guide

Borehamwood Chiropody and Podiatry. This document describes the visual system used
by the rebuilt site. Everything here is expressed as a CSS custom property in
`assets/css/style.css` under `:root` — change it there, not in individual rules.

---

## 1. Palette

The green was carried over from the original site rather than reinvented. The original
site's working green was `#8fb13b`, with `#a7c758`, `#718e28` and `#abca5f` used
alongside it, plus a near-black `#212121` and an off-white `#ebebeb`.

### The problem with the original green

`#8fb13b` on white gives a contrast ratio of **2.95:1**. WCAG AA requires 4.5:1 for
normal-sized text. The original site used it for body links and small text, which
means some of that text was not legible to users with reduced vision.

The fix was to keep the hue and lower the lightness for anything that carries text,
while retaining the original brighter green for large fills, icons and decoration
where contrast rules are looser.

### Working palette

| Token | Value | Contrast on white | Used for |
|---|---|---|---|
| `--brand` | `#5f7d1d` | **4.73:1** ✅ AA | Links, eyebrow labels, prices, primary buttons, focus rings |
| `--brand-mid` | `#6e8f22` | 3.85:1 | Logo mark fill only (not text) |
| `--brand-bright` | `#8fb13b` | 2.95:1 ❌ | Large fills and tint generation only — **never text on white** |
| `--brand-light` | `#a7c758` | 1.97:1 ❌ | Accents on dark backgrounds only (hero heading emphasis, dark-card icons) |
| `--brand-deep` | `#3f5413` | 9.16:1 ✅ AAA | Utility strip background, contact card background, button hover |

### Neutrals

| Token | Value | Contrast on white | Used for |
|---|---|---|---|
| `--ink` | `#15191c` | 17.4:1 | Headings, strong text, dark footer background |
| `--ink-2` | `#333c43` | 10.6:1 | Body copy |
| `--muted` | `#5c6771` | 5.78:1 ✅ AA | Secondary copy, section subheads, card body |
| `--muted-2` | `#6b7883` | 4.53:1 ✅ AA | Placeholders, small captions — this is the floor, do not go lighter |
| `--line` | `#e5e9ea` | — | Card and input borders |
| `--line-soft` | `#eef1f0` | — | Internal dividers (table rows, header underline) |
| `--surface` | `#ffffff` | — | Default background |
| `--surface-2` | `#f7f9f4` | — | Alternating section background (very slightly green-tinted) |
| `--surface-3` | `#f1f4ec` | — | Chips, nav hover, skeleton base |

### Derived tints

These use `color-mix()` so every tint stays locked to the brand hue. If the brand
green ever changes, the tints follow automatically.

```css
--brand-tint:      color-mix(in srgb, var(--brand-bright) 12%, #fff);  /* icon chips */
--brand-tint-soft: color-mix(in srgb, var(--brand-bright)  6%, #fff);  /* notes panel */
--brand-ring:      color-mix(in srgb, var(--brand) 28%, transparent);  /* focus ring */
--brand-hairline:  color-mix(in srgb, var(--brand) 20%, var(--line));  /* hover border */
```

### Contrast rules of thumb

- Text on white → `--brand`, `--ink`, `--ink-2`, `--muted`, `--muted-2`. Nothing lighter.
- Text on `--brand-deep` or `--ink` → white at 100%, or ≥68% opacity for secondary.
  `--brand-light` at full strength on `--brand-deep` is 4.39:1, marginally short of AA;
  the utility strip lifts it with `color-mix(… 62%, #fff)` to clear it.
- Decoration (icons, rules, fills) is exempt from the 4.5:1 rule but should still
  clear 3:1 where it carries meaning.

---

## 2. Logo

There was no usable logo. The original site used a bitmap wordmark
(`Borehamwood` in a serif, `Chiropody and Podiatry` in green below it), only available
at 446×119px, which does not survive on a modern display.

The replacement is `assets/img/logo-mark.svg`: a white footprint — sole plus five
toes — on a `#6E8F22` rounded square, 13px corner radius on a 48px grid. Paired with
a two-line wordmark set in Inter (700 for `Borehamwood`, 600 uppercase tracked-out for
`Chiropody & Podiatry` in `--brand`).

Design notes:

- **Verified legible at 24px.** The toe ellipses are sized on a decreasing curve
  (3.3 → 1.6 radius) so they stay distinct rather than merging into a blur at small sizes.
- Vector only. Never rasterise the mark for use on the site — the PNGs in
  `assets/img/` exist purely to satisfy favicon and Apple touch icon requirements.
- On dark backgrounds the mark works unchanged; the green square provides its own
  contrast.
- Minimum clear space: half the mark's width on all sides.
- Do not recolour the footprint. Do not place the mark on a photograph without a solid
  backing shape.

Derived files, all generated from the same SVG source:

| File | Size | Purpose |
|---|---|---|
| `logo-mark.svg` | vector | Header, footer, 404 page |
| `favicon.svg` | vector | Modern browsers |
| `favicon-32.png` | 32×32 | Legacy fallback |
| `apple-touch-icon.png` | 180×180 | iOS home screen |
| `icon-512.png` | 512×512 | Spare, for a future web app manifest |

---

## 3. Typography

**One family: Inter**, loaded from Google Fonts at weights 400, 500, 600 and 700 with
`display=swap`. A single family keeps the font payload to one request. Character comes
from spacing, weight and colour rather than from mixing typefaces — this is the same
approach Stripe and Linear take.

### Fluid scale

Every size uses `clamp()`, so there are no typography breakpoints anywhere in the
stylesheet. The middle term is `rem + vw` so the scale still responds to a user's
browser font-size setting rather than being purely viewport-driven.

| Token | Min | Max | Used for |
|---|---|---|---|
| `--fs-h1` | 2.3rem | 4rem | Hero heading only |
| `--fs-h2` | 1.7rem | 2.6rem | Section headings |
| `--fs-h3` | 1.15rem | 1.35rem | Card and subsection headings |
| `--fs-lead` | 1.075rem | 1.25rem | Section subheads, hero lede |
| `--fs-base` | 1rem | 1.0625rem | Body copy |
| `--fs-sm` | 0.875rem | — | Card body, form labels, footer |
| `--fs-xs` | 0.78rem | — | Eyebrows, labels, legal text |

### Letter-spacing

Headings tighten as they grow, which is what stops large text looking loose:

- `h1` — `-0.033em`
- `h2` — `-0.028em`
- `h3` — `-0.015em`
- Body — `0` (Inter's default is already correct at text sizes)
- Eyebrows and labels — `+0.1em`, uppercase, 600 weight

### Other type rules

- Body line-height `1.65`; headings `1.14`.
- `text-wrap: balance` on all headings — stops orphaned words on the last line.
- `text-wrap: pretty` on paragraphs.
- `font-variant-numeric: tabular-nums` on prices and opening times so columns align.

---

## 4. Shape, depth and motion

### Radii

`--r-sm` 8px (inputs, small chips) · `--r` 12px (FAQ rows, map thumbnails) ·
`--r-lg` 18px (cards) · `--r-xl` 26px (hero panels, contact card, map).
Buttons are fully rounded (`999px`).

### Elevation

Three levels, each combining a tight shadow with a wider, softer one. This is the
detail that separates a modern surface from a 2014 one — a single large blur reads as
a drop shadow, two layered reads as depth.

```css
--sh-1: 0 1px 2px  rgb(21 25 28 / .05), 0  1px  3px      rgb(21 25 28 / .04);
--sh-2: 0 2px 4px  rgb(21 25 28 / .05), 0  8px 20px -6px rgb(21 25 28 / .09);
--sh-3: 0 4px 8px  rgb(21 25 28 / .05), 0 22px 44px -14px rgb(21 25 28 / .16);
```

Cards sit at `--sh-1` and rise to `--sh-2` with a `-2px` translate on hover. Hairline
borders do most of the definition work; the shadows are deliberately subtle.

### Motion

One easing curve throughout: `--ease: cubic-bezier(.22,.68,.36,1)`. Hovers are 160–220ms,
scroll reveals 600ms with a staggered delay capped at six items so a long grid doesn't
cascade for several seconds. All of it collapses under
`@media (prefers-reduced-motion: reduce)`.

---

## 5. Layout

- Content width `--wrap: 1180px`; prose width `--wrap-narrow: 820px` (fees, FAQs, legal).
- Gutter and vertical rhythm are both fluid: `--gutter` 1.15→2.5rem,
  `--section-y` 3.75→7rem.
- Sections alternate `--surface` and `--surface-2`, with a `--line-soft` hairline on
  the alt sections to prevent the tint edge looking accidental.
- The hero uses `svh` rather than `vh` so mobile browser chrome doesn't crop it.

---

## 6. Voice

The original site's copy is plain, direct and occasionally blunt — "Easily treated",
"be prepared to be patient". That register was preserved rather than smoothed into
marketing language. It reads as a practitioner talking, which is the practice's
main asset.

Rules applied when rewriting:

- Fix spelling, grammar and capitalisation. Leave the tone alone.
- British English throughout (`callous`, `orthotics`, `£`, DD/MM dates).
- No superlatives that weren't already there. The site says what treatment involves,
  including when it may hurt — that honesty is a differentiator, not a liability.
- Testimonials are quoted verbatim, including Sue from Elstree's, which is funnier
  than anything that could be written for it.
