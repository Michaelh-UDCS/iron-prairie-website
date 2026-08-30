## Mission Control – Iron Prairie Website

**Mode**: React + Vite site wired to Firebase (SDK + Hosting config); secrets live in `.env.local` (not committed).  
**Goal**: Premium, country-relaxed multi-page marketing site for Iron Prairie Fabrication Group LLC, deployable to Firebase Hosting on project `iron-prairie-website`.

### Identity Lock
- **Firebase**: `michael@universal-dynamic.com` → `iron-prairie-website` (ONLY)
- **Git author**: Michael Huerta `<michael@universal-dynamic.com>`
- **GitHub push**: `Michaelh-UDCS`

### Current Phase
- **Storefront Cart / Checkout Scaling Fix — DONE** (2026-08-29)
- **Track Incomplete Storefront Checkouts in ERP — DONE** (2026-08-29)

### Active Task — Canceled / Unfulfilled Paddle Blind Checkouts
1. [x] Confirm gap: Stripe cancel only toasts on storefront; ERP cannot read `checkout_leads` / `checkout_carts`
2. [x] Persist checkout status (`open` / `cancelled` / `expired` / `completed`) from session create, cancel URL, and Stripe webhooks
3. [x] Expose authenticated ERP feed of incomplete checkouts (merge Firestore + Stripe)
4. [x] Show incomplete checkouts on ERP dashboard + dedicated follow-up screen
5. [x] Capture buyer cancel on return from Stripe (`order_status=cancelled`)
6. [x] Restore `/operations` ERP gate (was not routed on the public site)
7. [x] Deploy functions + hosting; verified live dashboard shows the unpaid paddle-blind checkout

### Status Update (Latest)
- Canceled / unpaid storefront checkouts now appear on the ERP dashboard and **Incomplete Checkouts**.
- Live verification: ref **IPG-046686**, 1/2" SA-516-70 paddle blind, $62.00, Universal Dynamic Consulting Services LLC — checkout started, not paid.
- `/operations` is live again behind the executive passkey gate.

### Notes
- **Live Stripe**: `acct_1Tzf7K2NddnbOHqL`
- **Hosting**: https://iron-prairie-website.web.app / https://ironprairiefabrication.com
- **ERP**: https://ironprairiefabrication.com/operations
