## Mission Control – Iron Prairie Website

**Mode**: React + Vite site wired to Firebase (SDK + Hosting config); secrets live in `.env.local` (not committed).  
**Goal**: Premium, country-relaxed multi-page marketing site for Iron Prairie Fabrication Group LLC, deployable to Firebase Hosting on project `iron-prairie-website`.

### Identity Lock
- **Firebase**: `michael@universal-dynamic.com` → `iron-prairie-website`
- **Git author**: Michael Huerta `<michael@universal-dynamic.com>`
- **GitHub push**: `Michaelh-UDCS`

### Current Phase
- **Gate 100 A++ COMPLETE** — production verified 2026-08-29.
- Hosting URL: https://iron-prairie-website.web.app  
- Custom domain: https://ironprairiefabrication.com

### Active Task — Gate 100 Residuals
1. [x] **Phase 0**: Protect AI SEO 100 — robots/llms/meta/schema/prerender/IndexNow/NAP.
2. [x] **Phase 1**: Self-host fonts + true 1200×630 OG + JS code-split → SEO 100.
3. [x] **Phase 2**: Full-bleed hero + design tokens + 2–3 motions → Design 100.
4. [x] **Phase 3**: Hash CSP + App Check + reporting → Security 100.
5. [x] **Phase 4**: Build, deploy, live verify, update canvas + Mission Control.
6. [ ] **Phase 5**: Off-page Pass 12 via `SEO_CLIENT_CHECKLIST.md` (operator / Michael).

### Scorecard (Production Verified — 2026-08-29)
| Card | Before | After | Grade |
|------|------:|------:|-------|
| SEO (11-pass) | 99 | **100** | A++ |
| AI / GEO SEO | 100 | **100** | A++ (no regression) |
| Design / UX | 92 | **100** | A++ |
| Security | 94 | **100** | A++ |

### Live Verify Notes
- `robots.txt` / `llms.txt` / `llms-full.txt` → `text/plain; charset=utf-8` on custom domain + web.app
- Titles unique (`/` 55 chars, `/about` 53 chars); no Google Fonts on first paint
- OG banner live at **1200×630**
- CSP: hash-based `script-src` (no `unsafe-inline`); `Reporting-Endpoints` + `/api/csp-report` returns 204
- App Check: reCAPTCHA Enterprise site key wired; `checkout_leads` requires `request.app != null`
- IndexNow: 13 URLs submitted HTTP 200
- Bundle: main `index-*.js` ~129KB (was ~806KB single chunk); marketing pages lazy-split
- `deploy:all` scoped to `hosting,functions,firestore` (Storage not initialized on project)

### Status Update (Latest)
- Gate 100 deployed and verified. Canvas updated to 100/100/100/100.
- Remaining: operator off-page Pass 12 (GBP / Apple / Bing / Nextdoor / Foursquare).

### Notes
- **Live Stripe Production Checkout**: Configured with live account `acct_1Tzf7K2NddnbOHqL` (Iron Prairie Fabrication Group LLC).
- **Preferred custom domain**: `ironprairiefabrication.com`.
- **Firebase**: project `iron-prairie-website`; Hosting + Functions + Firestore rules.
- **Constraints**: No secrets committed; no self-serving review schema; Node 20 functions runtime deprecation warning noted (upgrade before 2026-10-30).
