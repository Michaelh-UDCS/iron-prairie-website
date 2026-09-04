## Mission Control – Iron Prairie Website

**Mode**: React + Vite site wired to Firebase (SDK + Hosting config); secrets live in `.env.local` (not committed).  
**Goal**: Premium, country-relaxed multi-page marketing site for Iron Prairie Fabrication Group LLC, deployable to Firebase Hosting on project `iron-prairie-website`.

### Identity Lock
- **Firebase**: `michael@universal-dynamic.com` → `iron-prairie-website` (ONLY)
- **Git author**: Michael Huerta `<michael@universal-dynamic.com>`
- **GitHub push**: `Michaelh-UDCS`

### Current Phase
- **Gate 100 — Verified Live Scorecard (PSI)** — hero image restored in React tree (no external LCP plane)

### Active Task — Material Market Cost Ledger
1. [x] Document bidirectional market pass-through method (raise **and** cut)
2. [x] Create `logs/paddle-blind-prices/materialCostLedger.json` (anchor + policy + history — **internal only**)
3. [x] Add `scripts/apply-material-market-adjustment.mjs` (`--propose` / `--apply` / `--across ±N`)
4. [x] Micro gradual bump **$0.02→$0.06/lb** (cheapest→most expensive) — files/ledger only, **no website UI**
5. [x] Seal MCH audit for 2026-09-04 (timestamps **internal logs only**, never on live site)
6. [ ] Replace PLACEHOLDER mill quotes with real Bay City/Houston tickets
7. [ ] Deploy catalog rate changes when ready

### Status Update (Latest)
- **Committed / pushed / deployed** `4ae1041` — rates + hero LCP live.
- Live: https://ironprairiefabrication.com / https://iron-prairie-website.web.app
- IndexNow: 200 OK
- Timestamps / MCH audit remain under `logs/` only (not on website).

### Notes
- **Live Stripe**: `acct_1Tzf7K2NddnbOHqL`
- **Hosting**: https://iron-prairie-website.web.app / https://ironprairiefabrication.com
- **ERP**: https://ironprairiefabrication.com/operations
