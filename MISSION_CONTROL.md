## Mission Control – Iron Prairie Website

**Mode**: React + Vite site wired to Firebase (SDK + Hosting config); secrets live in `.env.local` (not committed).  
**Goal**: Premium, country-relaxed multi-page marketing site for Iron Prairie Fabrication Group LLC, deployable to Firebase Hosting on project `iron-prairie-website`.

### Identity Lock
- **Firebase**: `michael@universal-dynamic.com` → `iron-prairie-website` (ONLY)
- **Git author**: Michael Huerta `<michael@universal-dynamic.com>`
- **GitHub push**: `Michaelh-UDCS`

### Current Phase
- **Credit Card Checkout Fix — DEPLOYED** (2026-08-29)

### Active Task — Credit Card Checkout Fix
1. [x] Diagnose card vs ACH path
2. [x] Harden backend card sessions (card-only methods; no ACH opts on card; hotShotFee + surcharge; paymentType metadata)
3. [x] Harden frontend (no silent sandbox fallback; real errors; pass hotShotFee)
4. [x] Local Stripe verify (card-only session)
5. [x] Deploy as `michael@universal-dynamic.com` → hosting + `createStripeCheckoutSession` + `stripeWebhook`

### Status Update (Latest)
- Firebase reauth completed as **michael@universal-dynamic.com** only.
- Deploy complete to `iron-prairie-website` (hosting + Stripe checkout/webhook functions).
- Card checkout: select **Credit Card** in modal → Stripe hosted page with card fields + 3.5% surcharge line.

### Notes
- **Live Stripe**: `acct_1Tzf7K2NddnbOHqL`
- **Hosting**: https://iron-prairie-website.web.app / https://ironprairiefabrication.com
