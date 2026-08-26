# IPG Custom ERP - Host & Cloud Synchronization Reference

This document provides exact paths and credentials reference to ensure full synchronization between the standalone ERP workspace and the host environment:

| Property | Value |
| :--- | :--- |
| **Primary Host Directory** | `C:\Users\micha\Desktop\Iron-Prairie-Website` |
| **Custom ERP Subfolder** | `C:\Users\micha\Desktop\Iron-Prairie-Website\IPG-Custom-ERP` |
| **Firebase Project ID** | `iron-prairie-website` |
| **Git Remote Origin** | Connected via parent repository `Iron-Prairie-Website` |
| **Default ERP Port** | `http://localhost:5174` |
| **Parent Web App Port** | `http://localhost:5173` |
| **Sales Trigger Email** | `sales@iron-prairie.com` |
| **Accounting Remittance** | `ap@iron-prairie.com` / `ar@iron-prairie.com` |

---

### Quick Git Commit & Push Script
From within this folder or the parent:
```powershell
Set-Location "C:\Users\micha\Desktop\Iron-Prairie-Website"
git add .
git commit -m "feat(erp): Update IPG Custom ERP Workspace"
git push origin main
```
