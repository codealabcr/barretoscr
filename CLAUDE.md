# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Barretos Western Store CR** — Single-page marketing site for a Costa Rican western retail store based in Cartago. Vanilla HTML/CSS/JS, no build step. Hosted on GitHub Pages, will move to `barretos.cr` once the client registers the domain.

- **Live (preview)**: https://codealabcr.github.io/barretoscr/
- **Repo**: https://github.com/codealabcr/barretoscr
- **Owner of the business**: Client (not Codealab). Codealab built and maintains the site.
- **Primary conversion**: WhatsApp click (`wa.me/50688443180`). The site has no e-commerce, no forms, no checkout — every CTA funnels to WhatsApp.
- **Phone of record**: `+506 8844 3180` (E.164 in code).

## Workflow

There is **no build pipeline**. Edit HTML/CSS/JS directly, push to `main`, and GitHub Pages rebuilds automatically (~40-60s).

```bash
# Local preview (run from repo root)
python3 -m http.server 4242

# Then open http://localhost:4242
```

To wait for a Pages rebuild after pushing:
```bash
gh api /repos/codealabcr/barretoscr/pages/builds --jq '.[0] | {status,duration,commit}'
```

There are no tests, no linters, no formatters configured. Browser DevTools is the test surface.

## Architecture & Key Decisions

### Pages
- `/` — home (`index.html`): one-page landing with hero, brands strip, 5 categories grid, "Por qué Barretos", Instagram lookbook, testimonials, visit map, social grid, footer.
- `/privacidad/` (`privacidad/index.html`): privacy policy. Costa Rica **Ley N° 8968** with ARCO derechos. Links to PRODHAB as regulator.

Both pages share the same header (centered logo with split nav) and footer (4-column).

### Logo (`assets/logo.svg`)
The logo lives **inline as `<symbol id="brand-mark">`** in `index.html` (after `<body>`), referenced via `<svg><use href="#brand-mark"/></svg>` in both the header and footer. Color is controlled by CSS `color` because the symbol has `fill="currentColor"`.

On the privacy page, the logo is loaded as `<img src="../assets/logo.svg">` (no symbol indirection — that page doesn't need it).

**If you ever need to regenerate the logo from the source JPG** (`/Users/rommel/Downloads/barretos.jpg`):
```bash
# CRITICAL: do NOT use `mkbitmap` defaults — its highpass filter destroys
# solid black regions into thin parallel outlines. Use PIL + threshold
# instead, and Potrace with -i to invert foreground.
python3 -c "from PIL import Image; img = Image.open('SOURCE.jpg').convert('L'); img.point(lambda p: 255 if p < 128 else 0).convert('1').save('/tmp/logo.pbm')"
potrace -i /tmp/logo.pbm -s -t 4 -o assets/logo.svg
npx svgo assets/logo.svg --multipass --precision=2   # NEVER --precision=0 (breaks winding)
# Then manually edit root <svg> to add `fill="currentColor"` and strip width/height.
```

### Styles
- `assets/styles.css` — main stylesheet. Mobile-first, CSS variables at `:root` for palette and fonts.
- `assets/legal.css` — extra styles for legal pages (TOC, numbered sections). Only loaded on `/privacidad/`.

**Palette** (from brand audit of the physical store + logo):
- `--bg: #F4EFE5` (crema hueso, dominant)
- `--ink: #1A1714` (carbón negro, body text)
- `--accent: #E0A11C` (mostaza saloon — the actual color of the store façade)
- `--tabaco: #4A2E1A` (chocolate, footer/secondary surfaces)
- `--miel: #A06A38` (hovers)
- `--whatsapp: #25D366`

**Typography**:
- Display: `Fraunces` (italic with swashes for emphasis)
- Body: `Inter`
- Mono (utility/eyebrows): `DM Mono` — but most usages were globally replaced with `Fraunces` per client preference. The `--f-mono` variable still exists in CSS but is currently unused.

### Script (`assets/script.js`)
Single IIFE handling:
- Mobile nav toggle (`data-nav-toggle`)
- Instagram lookbook rail buttons (`data-rail-prev`/`-next`)
- Sticky header shadow on scroll
- Dynamic copyright year (`data-year`)
- **GA4 event tracking** (see Analytics section)

### Floating WhatsApp FAB
Outside the `<header>` but inside `<body>`. Fixed positioned bottom-right with pulse ring animation. Z-index 90 (below sticky header).

## SEO

- **Canonical URLs always absolute to `barretos.cr`** even while hosted at codealabcr.github.io. This is intentional — once the domain is connected, no migration needed.
- **JSON-LD**: two blocks in `index.html`:
  - `ClothingStore` with full address, geo, hours, sameAs, phone E.164 (no dashes), logo
  - `FAQPage` with 5 visible answers (matching content also visible on the page)
- `privacidad/` has a `WebPage` JSON-LD with `isPartOf` linking back to the store entity.
- `robots.txt` and `sitemap.xml` at repo root.
- **All internal nav links use relative paths** (`href="#section"`, `href="privacidad/"`, `href="../#section"`) so the site works at both `codealabcr.github.io/barretoscr/` and the future `barretos.cr/` root.

### Image placeholder convention
Unsplash hot-linked product images are placeholder. Each has a `<!-- TODO alt: ... -->` comment above it indicating what the descriptive alt text should be when real catalog photos arrive. Empty `alt=""` is intentional until then.

## Analytics & Privacy

- **GA4 ID**: `G-MLCG6GS7YJ`
- **Search Console verification**: meta tag on both pages with content `Bd5Yy27x1V4vq8RcGWsoRCzhiceaFvMi2qmmuk29bGI` (URL prefix property: `https://codealabcr.github.io/barretoscr/`)

The GA4 bootstrap is wrapped in a **DNT/GPC guard** — if `navigator.doNotTrack`, `navigator.globalPrivacyControl`, or related signals are set, gtag.js never loads and no events fire. This honors what the privacy policy promises. **Do not "simplify" this guard away.**

Event taxonomy fired from `script.js`:
- `whatsapp_click` (primary conversion) — `link_text`, `location`
- `social_click` — `network: instagram | tiktok | facebook`
- `outbound_click` — `destination: waze | google_maps`
- `email_click`, `phone_click`

Treat `whatsapp_click` as the conversion event when configuring GA4 goals.

## Common Tasks

### Update the og:image
The OG image at `/og.jpg` is generated by composing the logo SVG onto a 1200×630 cream canvas. If the client provides a polished version, replace `/og.jpg` (root) and verify the `og:image:width`/`height` meta tags still match.

### Add a new section to the home
Sections follow a numbered editorial pattern (`01`, `02`, etc.). Each section has a `section-head` with `section-num` + h2.display. New sections should keep the same `section-num` counter and link from the split nav in the header.

### Update the privacy policy
Bump the `lastmod` value in:
1. The eyebrow text in `privacidad/index.html` ("Última actualización …")
2. `dateModified` in the `WebPage` JSON-LD
3. `<lastmod>` in `sitemap.xml`

If you add or remove a third-party processor (e.g. adding Meta Pixel later), update both the "Compartir con terceros" and "Cookies" sections.

## Hard Rules

- **Never use `mkbitmap` default settings for logo retracing** — its `-f 4` highpass filter destroys solid fills (see logo regeneration note above).
- **Never run SVGO with `--precision=0` on the logo** — Potrace winding gets corrupted and the logo renders as wireframe outlines.
- **Never remove the DNT/GPC guard around GA4 loading** — the privacy policy promises it.
- **Never commit content from `.claude/`** — it's already gitignored.
- **Treat `barretos.cr` URLs in JSON-LD/canonical as the source of truth even before the domain is live** — do not "fix" them to point at GH Pages.

## Client-Facing Docs (in `docs/`)

- `docs/COPY-BRIEF.md` — questionnaire to send to the client for landing-page copy. Section-by-section.
- `docs/WHATSAPP-SETUP.md` — WhatsApp Business setup checklist (minimum / recommended / when-they-grow), plus the pre-filled message catalog this site sends.

If a client question comes up about copy or WA setup, point them at these.

## Open Items Waiting on Client

- Real catalog photos (replace 11 Unsplash placeholders + complete alt text)
- Real testimonials with consent (currently 3 fabricated names)
- Confirm legal phone, hours, and dirección
- Sociedad legal name + cédula jurídica (needed to register `barretos.cr` and finalize the privacy policy "Responsable")
- Once domain is registered: add `CNAME` file at repo root, configure DNS A records to GitHub Pages IPs (`185.199.108.153` and siblings), GH Pages auto-provisions Let's Encrypt SSL.
