## Mission Control – Iron Prairie Website

**Mode**: React + Vite site wired to Firebase (SDK + Hosting config); secrets live in `.env.local` (not committed).  
**Goal**: Premium, country-relaxed multi-page marketing site for Iron Prairie Fabrication Group LLC, deployable to Firebase Hosting on project `iron-prairie-website`.

### Identity Lock
- **Firebase**: `michael@universal-dynamic.com` → `iron-prairie-website` (ONLY)
- **Git author**: Michael Huerta `<michael@universal-dynamic.com>`
- **GitHub push**: `Michaelh-UDCS`

### Current Phase
- **Remove Public ASME Traceability / MTR Page — DONE** (2026-08-29)

### Active Task — Hide MTR Traceability from Public Site
1. [x] Locate nav link + routes (`/traceability`, `/mtr`) and `PublicMtrViewer`
2. [x] Remove public nav entry so typical users never see it
3. [x] Remove/disable public routes + sitemap/prerender SEO entries
4. [x] Keep ERP/operations MTR vault intact (internal only)
5. [x] Verify no public nav still points at the page

### Status Update (Latest)
- Removed **"ASME Traceability / MTR"** from main-site nav.
- Removed public routes: `/traceability`, `/mtr`, `/mtr-lookup` (+ param variants).
- Deleted `src/pages/PublicMtrViewer.tsx`.
- Cleaned sitemap, prerender, IndexNow, and llms.txt references.
- ERP MTR vault (`/operations`, ERP screens) unchanged — internal only.
- **Not deployed yet** — needs Firebase Hosting deploy to go live.

### Notes
- **Live Stripe**: `acct_1Tzf7K2NddnbOHqL`
- **Hosting**: https://iron-prairie-website.web.app / https://ironprairiefabrication.com
