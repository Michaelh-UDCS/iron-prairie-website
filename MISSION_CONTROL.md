## Mission Control – Iron Prairie Website

**Mode**: React + Vite site wired to Firebase (SDK + Hosting config); secrets live in `.env.local` (not committed).  
**Goal**: Premium, country-relaxed multi-page marketing site for Iron Prairie Fabrication Group LLC, deployable to Firebase Hosting on project `iron-prairie-website`, with room to add Auth/Firestore/Functions for the quote form later.

### Current Phase
- Content refinement for core offerings and agency/government support messaging.

### High-Level Plan
- Build a modern React + Vite + Tailwind frontend in this folder (no backend/Firebase yet).
- Implement core pages and navigation: Home, About, Services, Projects, Woman-Owned, Contact.
- Apply Iron Prairie branding (logo, “Built to Last” tagline, warm country palette).
- Add a Windows launcher script `Iron-Prairie-Website.bat` that starts the dev server and opens the browser.
- Refine service positioning around CNC plasma cutting, welding, agricultural builds, blinds, O&G support, and public agency work.
- Add procurement-oriented messaging for SAM.gov registration path and support for DOE, DOD, TPWD, National Parks, and other agencies.
- Test the site in the browser and iterate on layout, copy, and visuals.
- Later, wire up Firebase Hosting and form handling once approved.

### Tasks & Status

0. **Website content updates (current request)**
   - [x] Replace website phone number with `979-248-9266` wherever public contact details appear.
   - [x] Add custom bunkers, tornado shelters, and large built-in safes to relevant service, home, project, and contact copy.
   - [x] Build the site to catch errors.
   - [x] Verify the changed pages in the browser and record screenshot/console notes.
   - [x] Deploy the updated site to Firebase Hosting and spot-check the live URL.

1. **Scaffold app structure (local only)**
   - [ ] Initialize a React + Vite project in this folder.
   - [ ] Add Tailwind CSS and basic configuration.
   - [ ] Add a `README.md` explaining how to run the site locally.

2. **Core layout & navigation**
   - [ ] Create a shared layout with header (logo + nav) and footer (contact info, service area).
   - [ ] Add routes/pages for Home, About, Services, Projects, Woman-Owned, Contact.
   - [ ] Ensure navigation works on desktop and mobile (hamburger or simple stacked menu).

3. **Branding & visual system**
   - [ ] Import and place the Iron Prairie logo in the header and/or hero.
   - [ ] Define a warm, country-relaxed color palette based on the logo brown plus supporting colors.
   - [ ] Choose and apply typography pairings for headings and body text.
   - [ ] Add subtle textures/spacing to achieve a premium yet relaxed feel.

4. **Page content shells**
   - [ ] Home: hero with “Built to Last” messaging, audience segments (Schools, Municipalities, Refineries), and primary CTAs.
   - [ ] About: founder story, woman-owned emphasis, service area.
   - [ ] Services: sections for Schools, Municipalities, and Refineries with example work and benefits.
   - [ ] Projects: simple gallery grid with placeholder/example projects.
   - [ ] Woman-Owned & Safety: highlight woman-owned status and safety/quality commitments.
   - [ ] Contact: request-a-quote form UI (local only for now) plus phone/email details.

5. **Launcher & local developer experience**
   - [ ] Create `Iron-Prairie-Website.bat` in the project root:
       - Changes into this folder.
       - Starts the dev server (e.g., `npm run dev`).
       - Uses `start "" http://localhost:5173` (or the correct port) to open the browser automatically.
   - [ ] Verify the script runs correctly and keeps the dev server visible for logs.

6. **Browser testing & iteration**
   - [ ] Run the local dev server and open the site in the browser.
   - [ ] Test navigation across all pages and basic responsive behavior.
   - [ ] Adjust layout, copy, and visuals based on how it feels in the browser.

7. **Business scope refinement (current sprint)**
   - [ ] Update Home messaging to include primary capabilities and target buyer groups.
   - [ ] Expand Services with CNC plasma plate cutting, simple welding, agricultural pens/equipment, blinds, and O&G machining support.
   - [ ] Add gates and fences fabrication positioning across agriculture, ranch, and public project scopes.
   - [ ] Add explicit public-sector support messaging for TPWD, National Parks, and broader state/federal agency work.
   - [ ] Add federal procurement readiness messaging (SAM.gov registration path and DOE/DOD support intent).
   - [ ] Update contact intake fields so quotes can be categorized by market and agency/project type.

8. **Update CHX LLC Master Services Agreement (DOCX)**
   - [ ] Inspect DOCX for protection/locking, content controls, and placeholder fields.
   - [ ] Identify what content belongs to the “first page” and “last page” in Word (layout-based).
   - [ ] Update only first/last page to include editable fill-in fields for Michael’s info (leave body untouched).
   - [ ] Save as a new file next to the original with `-EDITABLE` in the filename.
   - [ ] Verify in Word that fields are editable and document opens without warnings.

### Status Update (Latest)
- Current request accepted: update public phone number to `979-248-9266` and add custom bunkers, tornado shelters, and large built-in safes to website offerings.
- Implementation plan: update shared footer/contact details, expand service/home/project/contact copy, run a production build, then verify pages in browser with screenshot and console summary.
- Completed phone/service update: public contact details now display `979-248-9266`; Home, Services, Projects, and Contact quote options now include custom bunkers, tornado shelters, and large built-in safes.
- Build verification: `npm run build` completed successfully; only existing Vite CJS and package module-type warnings appeared.
- Browser verification complete for `/`, `/services`, and `/contact`. Screenshot note: `iron-prairie-phone-specialty-updates.png` confirms the hyphenated phone number in the contact panel and footer. Console summary: no blocking runtime failures; only Vite dev logs, React DevTools prompt, and existing React Router v7 future-flag warnings.
- Firebase Hosting deploy complete. Live URL: `https://iron-prairie-website.web.app`. Live screenshot note: `iron-prairie-live-phone-specialty-updates.png` confirms `979-248-9266` on the public contact page and footer.
- Dev server and route-level functionality were previously verified locally.
- Current work is focused on aligning copy and page structure to the full manufacturing and sales scope.
- Completed content refinement pass for agriculture/ranch, O&G, blinds, and agency procurement support messaging.
- Browser verification complete for updated pages (`/`, `/services`, `/contact`).
- Screenshot note: `iron-prairie-refined-contact.png` confirms new agency procurement intake fields are visible in the quote form.
- Console summary: no blocking runtime failures; only Vite dev logs plus existing React Router v7 future-flag warnings.
- New user request adds explicit gates and fences offerings and image-based direction review.
- User-provided logo and gate imagery were integrated into the UI (`Logo.jpg` in header; home hero uses `src/assets/front-gate-no-trailer-v2~2.png` from cleaned export `front-gate-no-trailer-v2~2.png`).
- Home page redesign now uses a cleaner public-sector tone while preserving ranch/ag authenticity.
- Screenshot note: `iron-prairie-home-professional-refresh.png` shows updated header logo treatment, gate hero image card, and professional capability snapshot panel.
- Console summary after redesign verification: no blocking runtime failures; only expected Vite logs and existing React Router v7 future-flag warnings.
- Mobile refinement pass completed to make logo and opening gate image more prominent, with hero image prioritized on small screens.
- Source image note: older `Front-gate.jpg` included phone gallery UI; hero now uses `front-gate-no-trailer-v2~2.png` (no trailer / clean frame).
- Header logo scaled up (`h-24`–`lg:h-36`); home hero gate column widened and image height increased (viewport-based min heights) for stronger first-screen presence on mobile and desktop.
- **Firebase Hosting**: Latest production deploy completed; live site at `https://iron-prairie-website.web.app` (mirror `https://iron-prairie-website.firebaseapp.com`). Mobile viewport spot-check captured as `iron-prairie-firebase-mobile-full.png`.
- Home hero lead paragraph contrast fixed (`text-slate-800` on dark ink → `text-brand-muted`) and redeployed so mobile body copy reads clearly above the fold.

### Notes
- **Preferred custom domain (stakeholder choice)**: `ironprairiefabrication.com` — register, then attach in Firebase Hosting (custom domain + DNS records) when ready; optional secondary `ironprairiefab.com` for short links/email aliases.
- **Firebase (current)**: `firebase` npm package + `src/firebase.js` (reads `VITE_FIREBASE_*` from `.env.local`). `.firebaserc` targets `iron-prairie-website`; `firebase.json` serves SPA from `dist/` with rewrite to `index.html`. Deploy: `npm run deploy:hosting` after `firebase login` and registering a web app in the console.
- **Next**: Enable desired products in console (e.g. Firestore, Auth, Analytics); wire Contact form submit to a backend or callable function when ready.

