// src/erp/registry/erpModuleRegistry.ts
// Extensible Screen Registry for Iron Prairie Group (IPG) ERP
// Makes it effortless to add new screens, tools, and workflows dynamically

import { ErpModuleDefinition } from '../../types';

export const DEFAULT_ERP_MODULES: ErpModuleDefinition[] = [
  // 1. OPERATIONS
  {
    id: 'dashboard',
    name: 'Executive Dashboard',
    category: 'Operations',
    description: 'High-level shop metrics, active jobs, live trigger feed, and quick actions.',
    iconName: 'LayoutDashboard',
    enabled: true,
  },
  {
    id: 'work_orders',
    name: 'Work Orders & Job Tracker',
    category: 'Operations',
    description: 'Auto Job # generation, Kanban production stages, ASME travelers, and analytics.',
    iconName: 'Flame',
    enabled: true,
  },
  {
    id: 'catalog_orders',
    name: 'Catalog & Paddle Blinds',
    category: 'Operations',
    description: 'Interactive ASME B16.48 paddle blind configurator, orders queue, and RFQs.',
    iconName: 'Layers',
    enabled: true,
  },
  {
    id: 'sales_triggers',
    name: 'Sales Email Triggers',
    category: 'Operations',
    description: 'Automated email parser from sales@iron-prairie.com into active shop orders.',
    iconName: 'Mail',
    enabled: true,
  },

  // 2. QUALITY & MATERIALS
  {
    id: 'mtr_vault',
    name: 'ASME MTR Vault & Log',
    category: 'Quality & Materials',
    description: 'Section VIII Heat Number traceability, chemistry/mechanical certs, and QR codes.',
    iconName: 'ShieldCheck',
    enabled: true,
  },
  {
    id: 'stock_inventory',
    name: 'Stock Inventory (Plate/Pipe)',
    category: 'Quality & Materials',
    description: 'Track HT#s, SKUs, and stock quantities across Plate, Pipe, and Structural components.',
    iconName: 'Boxes',
    enabled: true,
  },
  {
    id: 'ncr_log',
    name: 'NCR Quality Log',
    category: 'Quality & Materials',
    description: 'Non-conformance tracking, root cause analysis, dispositions, and QA sign-offs.',
    iconName: 'AlertTriangle',
    enabled: true,
  },

  // 3. SUPPLY CHAIN & FINANCE
  {
    id: 'purchase_orders',
    name: 'Purchase Orders & Suppliers',
    category: 'Supply Chain & Finance',
    description: 'Supplier directory, issue material POs, tracking, and receiving logs.',
    iconName: 'Truck',
    enabled: true,
  },
  {
    id: 'ap_ar_invoicing',
    name: 'Invoicing & AP / AR',
    category: 'Supply Chain & Finance',
    description: 'Track invoices sent (AR) and bills received (AP) with aging breakdown.',
    iconName: 'Receipt',
    enabled: true,
  },

  // 4. ENGINEERING & SYSTEM
  {
    id: 'doc_control',
    name: 'Document Control & CAD',
    category: 'Engineering & System',
    description: 'DWG/DXF drawings, customer prints, WPS weld procedures, and Google Drive links.',
    iconName: 'FolderKanban',
    enabled: true,
  },
  {
    id: 'auto_ingestion',
    name: 'Auto-Ingestion & Google Drive',
    category: 'Engineering & System',
    description: 'Smart parser for emails, MTRs, drawings, and Google Drive cloud organizer.',
    iconName: 'Sparkles',
    enabled: true,
  },
  {
    id: 'module_manager',
    name: 'Module Builder & Registry',
    category: 'Engineering & System',
    description: 'Configure active screens and dynamically register new custom ERP modules.',
    iconName: 'Grid',
    enabled: true,
  }
];

export function getInitialModules(): ErpModuleDefinition[] {
  const saved = localStorage.getItem('ipg_erp_registered_modules');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_ERP_MODULES;
    }
  }
  return DEFAULT_ERP_MODULES;
}
