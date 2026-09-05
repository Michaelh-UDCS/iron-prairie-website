# DOMINATION CHECKLIST — A+++ Miss-Proof Ship

**Mandatory.** Do not deploy production without completing every gate.  
**Doctrine:** `RESEARCH/AUTHORITY.md` · **Law:** `OFFICIAL_AUTHORITIES.md` · **Execute:** `BUILD_PLAYBOOK.md`

Never invent GA4 IDs or Maps / Apple / Bing `sameAs` URLs — leave PENDING until claimed.

---

## Phase 0 — Before UI

- [ ] Archetype locked: A | B | C | D
- [ ] Mode locked: Spec | Production
- [ ] Rendering: SSG (no marketing SPA shell)
- [ ] Protocol Zero `CLAUDE.md` present
- [ ] `site.config.mjs` hydrated (NAP, services/features, colors, domain)
- [ ] Skim `a-plus-build-gate.md` + `ai-search-2026.md` (+ RESEARCH Module 08 for browser/AI surfaces)

## Build — Security + SEO + Perf baked in

- [ ] `firebase.json`: `cleanUrls: true`
- [ ] **No** SPA rewrite `"**" → "/index.html"`
- [ ] Default-deny `firestore.rules` / `storage.rules`
- [ ] Security headers present (HSTS, XFO, nosniff, Referrer-Policy, Permissions-Policy, COOP)
- [ ] `robots.txt` allows `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot` (training bots optional)
- [ ] `sitemap.xml` correct namespace + all indexable routes
- [ ] Unique title / description / canonical / OG per route
- [ ] Trust routes: `/`, `/about`, `/contact`, `/privacy-policy`, `/terms-of-service`, `404`
- [ ] **Pre-ship perf (prevent PSI misses)**
  - [ ] Hero LCP: `fetchpriority="high"`, not lazy; width/height (or aspect-ratio); modern formats
  - [ ] Primary WOFF2 preloaded; `font-display: swap`; no extra render-blocking font CSS
  - [ ] No third-party JS above the fold (GA4/chat/pixels deferred)
  - [ ] Form controls have explicit contrast (esp. dark themes)
  - [ ] Images/icons below fold may lazy-load; LCP candidate must not
- [ ] `npm run build`
- [ ] `npm run seo:check` **≥ 95** (deploy blocked below 95)
- [ ] `npm run lh:check` **100/100/100/100 mobile + desktop** (deploy blocked below 100)

## Deploy

- [ ] Business Firebase account (`dual_account_orchestrator`)
- [ ] `firebase deploy --only hosting` (client project isolated)

## Launch handoff (cannot skip)

- [ ] `npm run launch:handoff`
- [ ] **IndexNow** key live + canonical URLs submitted
- [ ] **GSC** domain property + sitemap + Request Indexing on priority routes
- [ ] **GSC Generative AI performance** path noted (PENDING ok until data)
- [ ] **Bing Webmaster** + sitemap + **AI Performance** path noted
- [ ] **Gate 100** (`gate100_browser_scorecard`): live PSI/LH mobile **and** desktop = **100** each category
- [ ] Optional: `npm run psi:check` (needs `GOOGLE_PSI_API_KEY`) or pagespeed.web.dev both strategies
- [ ] **Big 3** (`local_seo_playbook`): GBP · Apple Business · Bing Places
- [ ] Real profile URLs added to `sameAs` only after claimed

## Browser / AI surfaces (Module 08)

- [ ] Chrome / Google path covered (indexed + snippet-eligible)
- [ ] Edge / Copilot path covered (Bing + IndexNow)
- [ ] Brave / Claude path covered (search bots allowed)
- [ ] ChatGPT path covered (SSG HTML + `OAI-SearchBot`)
- [ ] Apple entity path when local (Apple Business claimed)

## Done only when

All boxes checked, `seo:check ≥ 95`, `lh:check` PASS, Gate 100 blockers empty or explicitly deferred with owner + date.
