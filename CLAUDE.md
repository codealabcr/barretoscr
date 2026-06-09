# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Barretos Western Store CR** — Single-page marketing site for a Costa Rican western retail store based in Cartago. Vanilla HTML/CSS/JS, no build step. Origin on GitHub Pages, fronted by Cloudflare at the apex domain `barretos.cr`.

- **Live**: https://barretos.cr/
- **Origin (still accessible)**: https://codealabcr.github.io/barretoscr/
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

### Hosting topology

```
Visitor → Cloudflare proxy (TLS terminates here) → GitHub Pages (origin) → Fastly cache → repo HTML
```

- **Registrar**: NIC.cr (apex `.cr` domain).
- **Nameservers**: Cloudflare (`amy.ns.cloudflare.com`, `jihoon.ns.cloudflare.com`). NIC.cr just delegates.
- **DNS records (in Cloudflare panel)**:
  - 4× `A` records `@` → `185.199.108.153`, `.109.153`, `.110.153`, `.111.153` — **proxied (🟠)**
  - 1× `CNAME` `www` → `codealabcr.github.io` — **proxied (🟠)**
- **`CNAME` file in repo root** contains literally `barretos.cr`. This is what triggers GitHub Pages to (a) treat the request as belonging to the custom domain and (b) 301 `www.barretos.cr` → `barretos.cr` for us at the origin layer.
- **SSL/TLS mode in Cloudflare**: **Full** (not "Full (strict)"). With proxy on, GitHub Pages can't verify DNS resolves to its own IPs, so it never issues its own Let's Encrypt cert for `barretos.cr`. The origin therefore presents the default `*.github.io` cert, which "Full (strict)" would reject by hostname mismatch.
  - **To upgrade to Full (strict) someday**: flip the 4 A records to **DNS-only** for ~15 min, wait until `gh api /repos/codealabcr/barretoscr/pages` shows `https_enforced` becomes settable / a cert is issued, flip back to proxied, then change Cloudflare SSL/TLS to "Full (strict)". The cert lives on GH's servers and is presented to Cloudflare on the origin connection even after re-enabling proxy.
- **`https_enforced` in the GH Pages API is `false` and that's expected**. Cloudflare handles the HTTP→HTTPS redirect via **Always Use HTTPS** + **Automatic HTTPS Rewrites** in SSL/TLS → Edge Certificates. Do not try to flip `https_enforced` to `true` while proxied — the API errors with `404 The certificate does not exist yet`.

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

**Cache-busting:** every stylesheet link uses a `?v=YYYYMMDD` query string (e.g. `assets/styles.css?v=20260608`). Cloudflare and the browser cache the file by full URL, so the query string is what forces a refresh. **When you make a CSS change that should reach existing visitors immediately, bump the date in every `?v=` in `index.html` and `privacidad/index.html` (3 refs total).** A no-op change in CSS with the same `?v=` will sit in stale caches for days.

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

- **Canonical URLs always absolute to `barretos.cr`**. The origin at `codealabcr.github.io/barretoscr/` is still reachable but should never be the canonical target.
- **JSON-LD**: one block in `index.html` — `ClothingStore` with full address, geo, hours, sameAs, phone E.164 (no dashes), logo. A `FAQPage` block used to live here but was removed after Google announced FAQ rich results would stop appearing in Search as of 2026-05-07 (Rich Results Test support drops 2026-06). The visible FAQ content on the page stays — only the structured data is gone.
- `privacidad/` has a `WebPage` JSON-LD with `isPartOf` linking back to the store entity.
- `robots.txt` and `sitemap.xml` at repo root.
- **All internal nav links use relative paths** (`href="#section"`, `href="privacidad/"`, `href="../#section"`) so the site works at both the `codealabcr.github.io/barretoscr/` subpath and the `barretos.cr/` root.

### Image placeholder convention
Unsplash hot-linked product images are placeholder. Each has a `<!-- TODO alt: ... -->` comment above it indicating what the descriptive alt text should be when real catalog photos arrive. Empty `alt=""` is intentional until then.

## Analytics & Privacy

- **GA4 ID**: `G-MLCG6GS7YJ`
- **Search Console verification**: meta tag on both pages with content `Bd5Yy27x1V4vq8RcGWsoRCzhiceaFvMi2qmmuk29bGI`. Original property is the URL prefix `https://codealabcr.github.io/barretoscr/`. A new `https://barretos.cr/` property should be added in Search Console now that the domain is live — the same meta tag re-verifies it automatically.

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
- **`barretos.cr` is the canonical host in JSON-LD, sitemap, robots, and canonical tags** — never "fix" them to point at the `codealabcr.github.io` origin.
- **Never enable Cloudflare SSL/TLS "Full (strict)" without going through the DNS-only cert-bootstrap dance** (see Hosting topology) — origin will start presenting `*.github.io` and break HTTPS for visitors.

## Client-Facing Docs (in `docs/`)

- `docs/COPY-BRIEF.md` — questionnaire to send to the client for landing-page copy. Section-by-section.
- `docs/WHATSAPP-SETUP.md` — WhatsApp Business setup checklist (minimum / recommended / when-they-grow), plus the pre-filled message catalog this site sends.

If a client question comes up about copy or WA setup, point them at these.

## Open Items Waiting on Client

- Real catalog photos (replace 11 Unsplash placeholders + complete alt text). Raw photos the client sends arrive in `docs/client-photos/`; intake notes in `docs/CLIENT-INTAKE.md`.
- Real testimonials with consent (currently 3 fabricated names).
- Confirm Saturday/Sunday opening hours (client confirmed Mon–Fri 8:00–17:00 jornada continua but didn't specify weekends — JSON-LD `openingHoursSpecification` currently understates if they open weekends).
- Confirm legal phone (assumed `+506 8844 3180`).
- Apply intake response (`docs/CLIENT-INTAKE.md`, captured 2026-06-08) to the site:
  - Update privacy "Responsable": **Grupo Barretos Sociedad Anónima, cédula jurídica 3-101-903898**.
  - Update address in JSON-LD + "Visítanos": **Cartago, carretera a Paraíso, del Restaurante Versalles 75 m sur**. Recompute geo coords for JSON-LD.
  - Update brands strip: Justin Boots, Nokota Horse, Tony Lamas, Ariat, Kimes Ranch, Mesace *(spelling TBC)*, Yellowstone, Wrangler, Roper, Ranch Corral. Highlight the exclusive distributions (Nokota Horse, Justin Boots, Wrangler).
  - Decide whether categories grid stays at 5 (recommended hero + featured) or expands to the full 10 the client listed.

### Done

- ~~Domain `barretos.cr` registered, DNS configured, site live with SSL via Cloudflare~~ (2026-06-08).
- ~~Sociedad legal name + cédula jurídica obtained from client~~ (2026-06-08, pending application to privacy policy).
