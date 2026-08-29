# Gate 100 A++ Execution Plan — Iron Prairie Website

**Copy everything below the line into a new Cursor chat.**

---

## Mission
Bring Iron Prairie Fabrication Group LLC website scorecards from current post-audit levels to **literal 100 / 100 / 100 / 100** on:
1. SEO (11-pass master_seo_evaluator)
2. AI / GEO SEO (already 100 — do not regress)
3. Design / UX
4. Security (cloud_security_architect)

Repo: `C:\Users\micha\Desktop\Iron-Prairie-Website`  
Live domain: `https://ironprairiefabrication.com`  
Firebase project: `iron-prairie-website`  
Archetype: Mode A Local Service Dominator  

### Mandatory skills (read before coding)
- `C:\Users\micha\OneDrive - freeweld.com\Antigravity\skills\ultimate_web_architect\SKILL.md`
- `C:\Users\micha\OneDrive - freeweld.com\Antigravity\skills\claude_design_10x\SKILL.md`
- `C:\Users\micha\OneDrive - freeweld.com\Antigravity\skills\master_seo_evaluator\SKILL.md`
- `C:\Users\micha\OneDrive - freeweld.com\Antigravity\skills\local_seo_playbook\SKILL.md`
- `C:\Users\micha\OneDrive - freeweld.com\Antigravity\skills\cloud_security_architect\SKILL.md`
- `C:\Users\micha\OneDrive - freeweld.com\Antigravity\skills\master_claude_engine\SKILL.md`

Update `MISSION_CONTROL.md` first with this task list, then execute Auto-Run / YOLO.

### Current scores (do not lose ground)
| Card | Score | Notes |
|------|------:|-------|
| SEO | 99 | Almost there — fonts + bundle + true OG |
| AI / GEO SEO | **100** | Protect robots.txt, llms.txt, meta bounds, schema |
| Design / UX | 92 | Full-bleed hero + tokens + motion |
| Security | 94 | Hash CSP + App Check + reporting |

---

## Phase 0 — Protect AI SEO 100 (no regressions)
Before any visual/security work, verify and keep intact:
- [ ] `public/robots.txt` multi-agent citation allow + training disallow
- [ ] `public/llms.txt` + `public/llms-full.txt` (must serve `text/plain`, NOT SPA HTML)
- [ ] Title 50–60 chars / meta 145–155 chars on all routes in `scripts/prerender.mjs` + `index.html`
- [ ] JSON-LD `@type: HomeAndConstructionBusiness` (no self-serving aggregateRating)
- [ ] Prerender SSG still runs: `npm run build` → `vite build && node scripts/prerender.mjs`
- [ ] IndexNow key file `public/53c078864d4b4fb2a69dfd5291244304.txt` + `scripts/post-deploy-indexnow.mjs`
- [ ] NAP single source: `src/config/siteConfig.ts`

---

## Phase 1 — SEO → 100 (CWV / Zero-Hydration)
### 1A. Self-host fonts
- [ ] Download Inter + Playfair Display WOFF2 subsets into `public/fonts/` (or `src/assets/fonts/`)
- [ ] Add `@font-face` with `font-display: swap` in `src/index.css`
- [ ] Preload critical WOFF2 in `index.html` via `<link rel="preload" as="font" type="font/woff2" crossorigin>`
- [ ] Remove Google Fonts `<link>` stylesheet + preconnects from `index.html`
- [ ] Update CSP in `firebase.json` so `font-src` / `style-src` no longer need `fonts.googleapis.com` / `fonts.gstatic.com` if unused

### 1B. True OG banner
- [ ] Create real **1200×630** `public/og-banner.jpg` (not a logo copy)
- [ ] Confirm `index.html` + prerender use `https://ironprairiefabrication.com/og-banner.jpg`
- [ ] Keep `og:image:width=1200` and `og:image:height=630`

### 1C. Code-split JS
- [ ] Lazy-load heavy routes/components (storefront / paddle-blinds / ERP / operations) via `React.lazy` + `Suspense`
- [ ] Keep marketing pages (`/`, `/about`, `/services`, `/contact`, etc.) on a thin critical path
- [ ] Target: marketing route JS meaningfully below current ~806KB single chunk
- [ ] Re-run `npm run build` and confirm prerender still emits 13 route packages

Acceptance for Phase 1:
- [ ] `npm run build` passes
- [ ] No Google Fonts network dependency on first paint
- [ ] OG image is genuinely 1200×630
- [ ] SEO scorecard re-score = **100**

---

## Phase 2 — Design → 100
Preserve Iron Prairie brand (brown `#6b3b2a`, Playfair display, ranch authenticity). Client brand overrides generic AI aesthetic bans.

### 2A. Full-bleed hero (Home)
- [ ] Convert home hero so the gate image is a **dominant edge-to-edge visual plane/background** (not inset rounded media card)
- [ ] First viewport: brand + one headline + one short support sentence + one CTA group + dominant image only
- [ ] No hero overlay badges/chips/stickers on the media

### 2B. Design tokens
- [ ] Expand CSS custom properties in `src/index.css` from `siteConfig` brand values (colors, spacing, radii, type scale)
- [ ] Prefer tokens over scattered hex in marketing pages where practical
- [ ] Keep `prefers-reduced-motion` and `:focus-visible` (already added)

### 2C. Intentional motion (2–3)
- [ ] Add 2–3 compositor-safe motions (`transform`/`opacity` only): e.g. hero fade/rise, CTA hover, section reveal
- [ ] Wrap in `@media (prefers-reduced-motion: no-preference)`

Acceptance for Phase 2:
- [ ] Home first viewport passes brand-first + full-bleed hero rules
- [ ] Design scorecard re-score = **100**

---

## Phase 3 — Security → 100
### 3A. CSP Level 3 (hash or nonce)
- [ ] Remove `script-src 'unsafe-inline'` from `firebase.json` Content-Security-Policy
- [ ] Prefer **hash-based CSP** for static Hosting (compute sha256 of inline scripts if any remain; ideally zero inline scripts)
- [ ] Keep Stripe + Firebase + IndexNow connect/frame allowances working
- [ ] Add `Reporting-Endpoints` header + CSP `report-to` directive (or document staging endpoint)

### 3B. Firebase App Check
- [ ] Enable App Check (reCAPTCHA v3) for project `iron-prairie-website`
- [ ] Wire client App Check in Firebase init (`src/firebase.js` / equivalent)
- [ ] Enforce App Check on Firestore (at least for `checkout_leads` creates)
- [ ] Confirm Stripe checkout lead writes still succeed in a live smoke test

### 3C. Rules / headers polish
- [ ] Keep `checkout_leads` create validation (orderRefId, buyerEmail, createdAt) — do not reopen
- [ ] Keep Storage + orders/notifications default deny
- [ ] Confirm `X-XSS-Protection` stays omitted
- [ ] Verify Stripe Embedded/Checkout popups still work if tightening COOP

Acceptance for Phase 3:
- [ ] Security headers scan clean; no obsolete XSS header
- [ ] CSP has no `unsafe-inline` for scripts (or documented temporary exception with hash migration plan)
- [ ] App Check enforced on client Firestore writes
- [ ] Security scorecard re-score = **100**

---

## Phase 4 — Deploy + verify
- [ ] `npm run build`
- [ ] Deploy: `npm run deploy:all` (hosting + functions if needed + firestore rules + IndexNow)
- [ ] Live checks:
  - [ ] `https://ironprairiefabrication.com/robots.txt`
  - [ ] `https://ironprairiefabrication.com/llms.txt` → `text/plain` markdown, not HTML
  - [ ] `https://ironprairiefabrication.com/llms-full.txt`
  - [ ] Unique `<title>` / canonical on `/` vs `/about`
  - [ ] Response headers: HSTS, CSP (no unsafe-inline scripts), no X-XSS-Protection
  - [ ] Checkout smoke: lead write + Stripe session still works
- [ ] Update scorecard canvas:  
  `C:\Users\micha\.cursor\projects\c-Users-micha-Desktop-Iron-Prairie-Website\canvases\a-plus-plus-compliance-scorecard.canvas.tsx`
- [ ] Update `MISSION_CONTROL.md` with final 100/100/100/100 and deploy notes

---

## Phase 5 — Off-page Pass 12 (operator / Michael)
Do not block deploy on these, but required for full local A++ dominance. Follow `SEO_CLIENT_CHECKLIST.md`:
- [ ] Google Business Profile — NAP match exact
- [ ] Apple Business Connect
- [ ] Bing Places 1-click import from GBP
- [ ] Nextdoor Business
- [ ] Foursquare Places
- [ ] Confirm GSC + Bing Webmaster + IndexNow measurement live

---

## Constraints
- Do not commit secrets (`.env`, Stripe secret keys, service accounts)
- Do not regress AI SEO 100 (robots/llms/meta/schema/prerender)
- Do not add self-serving `aggregateRating` / `Review` on LocalBusiness/Organization schema
- Preserve brand palette and Playfair/Inter pairing (self-hosted)
- Prefer surgical edits; no unrelated refactors
- Only commit / push / deploy when explicitly asked (or when this chat says to deploy in Phase 4)

## Definition of Done
All four scorecards report **100 A++**, AI SEO still 100 with no regression, production deploy verified, Mission Control + canvas updated.
