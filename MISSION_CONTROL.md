## Mission Control – Iron Prairie Website

**Mode**: React + Vite site wired to Firebase (SDK + Hosting config); secrets live in `.env.local` (not committed).  
**Goal**: Premium, country-relaxed multi-page marketing site for Iron Prairie Fabrication Group LLC, deployable to Firebase Hosting on project `iron-prairie-website`.

### Current Phase
- **Gate 100 A++ Execution** — close residual SEO/Design/Security gaps to literal **100 / 100 / 100 / 100**.
- Plan: `GATE_100_EXECUTION_PLAN.md`

### Active Task — Stripe Key Connectivity (done)
1. [x] Live secret + publishable keys authenticate to `acct_1Tzf7K2NddnbOHqL`.
2. [x] Card Checkout Session create/expire OK via secret key.
3. [x] Hosted `/api/create-checkout-session` returns live Stripe Checkout URL for `paymentType=card`.
4. [x] Webhook endpoint enabled at `/api/stripe-webhook`.

### Paused — Gate 100 Residuals
1. [ ] **Phase 0–5**: See `GATE_100_EXECUTION_PLAN.md`.

### Scorecard Targets
| Card | Current | Target | Notes |
|------|------:|------:|-------|
| SEO (11-pass) | 99 | **100** | Fonts + bundle + true OG |
| AI / GEO SEO | **100** | **100** | Do not regress |
| Design / UX | 92 | **100** | Full-bleed hero + tokens + motion |
| Security | 94 | **100** | Hash CSP + App Check + reporting |

### Status Update (Latest)
- **2026-08-29 Stripe keys**: CONNECTED — live keys on Iron Prairie acct; card session + live API checkout OK. Full paid-card + email e2e not re-run (no MCP; no new live charge).

### Notes
- **Live Stripe Production Checkout**: Configured with live account `acct_1Tzf7K2NddnbOHqL` (Iron Prairie Fabrication Group LLC).
- **Preferred custom domain**: `ironprairiefabrication.com`.
- **Firebase**: project `iron-prairie-website`; Hosting + Functions + Firestore rules.
- **Constraints**: No secrets committed; no self-serving review schema; surgical edits only; deploy at Phase 4.
