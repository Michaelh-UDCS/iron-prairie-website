# Iron Prairie Group (IPG) Custom ERP System
**Bay City Fabrication Facility &bull; ASME Section VIII Div 1 &bull; ASME B16.48**

This is the dedicated, standalone ERP system for **Iron Prairie Group LLC (IPG)** located in Bay City, Texas.

---

## 🔗 Host Workspace & Git / Firebase Synchronization

- **Parent Host Workspace Location**: `C:\Users\micha\Desktop\Iron-Prairie-Website`
- **Subfolder Workspace Location**: `C:\Users\micha\Desktop\Iron-Prairie-Website\IPG-Custom-ERP`
- **Git Repository**: Tracks within the parent `Iron-Prairie-Website` Git tree (or can be initialized independently).
- **Firebase Project**: `iron-prairie-website` (Google Workspace / Firebase Hosting & Firestore).

### Git & Push Instructions:
When working inside this new workspace or from the parent directory:
```bash
cd C:\Users\micha\Desktop\Iron-Prairie-Website
git add .
git commit -m "feat(erp): Update IPG Custom ERP System"
git push origin main
```

---

## 🚀 How to Run Locally

### Option 1: Double-Click Desktop Launcher
Double-click `Launch-ERP.bat` inside this folder.

### Option 2: Command Line
```bash
npm install
npm run dev
```
Open **[http://localhost:5174](http://localhost:5174)** in your browser or Chrome App Mode.

---

## 🛡️ Key Features & Modules

1. **Executive Dashboard**: Real-time KPI summary, active job pipeline, critical stock alerts, and trigger feeds.
2. **Work Orders Hub (Job # Tracking & Analytics)**: Sequential Job numbers (e.g. `IPG-WO-2026-0101`), 7-stage Kanban board, ASME QC travelers with barcodes, and profit margins.
3. **ASME B16.48 Online Catalog & Visualizer**: 2D CAD blueprint visualizer (OD, Bolt circle, thickness, weight) and 1-click order submission.
4. **Sales Email Trigger Ingestion**: Parses incoming order notifications from `sales@iron-prairie.com` and auto-populates the dashboard and active work orders.
5. **ASME Section VIII MTR Vault**: Full chemical (C, Mn, P, S, Si, CE) and mechanical test properties (Tensile, Yield, Elongation), heat trace links, and printable CMTR certs.
6. **Stock Material Inventory**: Tracks Heat #s and SKUs across Plate (SA-516-70, 304L, 316L), Pipe (Sch 40/80/160), Structural Components (Tubing, Angle, Beam), Round Bar, and Flanges.
7. **Purchase Orders & Supplier Directory**: Supplier CRM and PO generator (`IPG-PO-2026-XXXX`) with printable PO documents.
8. **NCR Non-Conformance Quality Log**: ISO 9001 / ASME quality investigations, root cause analysis, dispositions, CAPA, and QA sign-offs.
9. **Accounts Payable & Receivable (AP/AR)**: Invoices Sent (AR) & Bills Received (AP) with aging breakdown and payment recording.
10. **Document Control & CAD Drawings**: DWG/DXF blueprints, WPS procedures, and Google Drive links.
11. **Auto-Ingestion & Google Drive Sync**: Smart email/MTR OCR parsers and Google Drive folder integration.
12. **Extensible Screen Registry & Module Builder**: Dynamic registry to add new custom screens on the fly.
13. **Local-First Zero-Downtime Engine**: Operates 100% offline with persistent local storage and automated cloud synchronization when online.
