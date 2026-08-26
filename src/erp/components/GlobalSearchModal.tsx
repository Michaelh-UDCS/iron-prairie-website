// src/erp/components/GlobalSearchModal.tsx
// Universal Quick Search & Command Palette (Ctrl+K) for IPG ERP

import React, { useState, useEffect, useMemo } from 'react';
import { useErp } from '../context/ErpContext';
import {
  Search,
  X,
  Flame,
  ShieldCheck,
  Truck,
  AlertTriangle,
  Receipt,
  Boxes,
  FolderKanban,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const {
    workOrders,
    mtrDatabase,
    stockInventory,
    purchaseOrders,
    ncrRecords,
    invoices,
    docControlItems,
    setActiveModuleId,
  } = useErp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    const results: {
      id: string;
      title: string;
      subtitle: string;
      category: string;
      icon: any;
      moduleId: string;
      badge?: string;
    }[] = [];

    // 1. Work Orders
    workOrders.forEach((wo) => {
      if (
        wo.jobNumber.toLowerCase().includes(q) ||
        wo.customerPoNumber.toLowerCase().includes(q) ||
        wo.clientCompanyName.toLowerCase().includes(q) ||
        wo.projectName.toLowerCase().includes(q) ||
        wo.allocatedHeatNumbers.some((h) => h.toLowerCase().includes(q))
      ) {
        results.push({
          id: `WO-${wo.jobNumber}`,
          title: `Job #${wo.jobNumber} &bull; ${wo.clientCompanyName}`,
          subtitle: `PO: ${wo.customerPoNumber} &bull; ${wo.stage} &bull; $${wo.totalAmount.toFixed(2)}`,
          category: 'Work Orders',
          icon: Flame,
          moduleId: 'work_orders',
          badge: wo.priority,
        });
      }
    });

    // 2. MTRs
    mtrDatabase.forEach((mtr) => {
      if (
        mtr.heatNumber.toLowerCase().includes(q) ||
        mtr.asmeSpec.toLowerCase().includes(q) ||
        mtr.steelMill.toLowerCase().includes(q) ||
        mtr.certificateNumber.toLowerCase().includes(q)
      ) {
        results.push({
          id: `MTR-${mtr.id}`,
          title: `Heat #${mtr.heatNumber} &bull; ${mtr.asmeSpec}`,
          subtitle: `${mtr.steelMill} &bull; Cert: ${mtr.certificateNumber} &bull; ${mtr.thicknessLabel}`,
          category: 'ASME MTRs',
          icon: ShieldCheck,
          moduleId: 'mtr_vault',
          badge: mtr.status,
        });
      }
    });

    // 3. Stock Materials
    stockInventory.forEach((stk) => {
      if (
        stk.stockSku.toLowerCase().includes(q) ||
        stk.heatNumber.toLowerCase().includes(q) ||
        stk.subType.toLowerCase().includes(q) ||
        stk.category.toLowerCase().includes(q) ||
        stk.storageLocation.toLowerCase().includes(q)
      ) {
        results.push({
          id: `STK-${stk.id}`,
          title: `${stk.subType} [HT# ${stk.heatNumber}]`,
          subtitle: `SKU: ${stk.stockSku} &bull; Loc: ${stk.storageLocation} &bull; Qty: ${stk.availableQuantity} Avail`,
          category: 'Stock Inventory',
          icon: Boxes,
          moduleId: 'stock_inventory',
          badge: stk.category,
        });
      }
    });

    // 4. Purchase Orders
    purchaseOrders.forEach((po) => {
      if (
        po.poNumber.toLowerCase().includes(q) ||
        po.supplierName.toLowerCase().includes(q) ||
        po.items.some((it) => it.description.toLowerCase().includes(q))
      ) {
        results.push({
          id: `PO-${po.poNumber}`,
          title: `PO #${po.poNumber} &bull; ${po.supplierName}`,
          subtitle: `Category: ${po.category} &bull; Status: ${po.status} &bull; Total: $${po.totalAmount.toFixed(2)}`,
          category: 'Purchase Orders',
          icon: Truck,
          moduleId: 'purchase_orders',
          badge: po.status,
        });
      }
    });

    // 5. NCR Records
    ncrRecords.forEach((ncr) => {
      if (
        ncr.ncrNumber.toLowerCase().includes(q) ||
        ncr.defectCategory.toLowerCase().includes(q) ||
        ncr.defectDescription.toLowerCase().includes(q) ||
        (ncr.linkedJobNumber && ncr.linkedJobNumber.toLowerCase().includes(q)) ||
        (ncr.heatNumber && ncr.heatNumber.toLowerCase().includes(q))
      ) {
        results.push({
          id: `NCR-${ncr.ncrNumber}`,
          title: `NCR #${ncr.ncrNumber} &bull; ${ncr.defectCategory}`,
          subtitle: `Job: ${ncr.linkedJobNumber || 'N/A'} &bull; HT#: ${ncr.heatNumber || 'N/A'} &bull; Disp: ${ncr.disposition}`,
          category: 'NCR Quality Log',
          icon: AlertTriangle,
          moduleId: 'ncr_log',
          badge: ncr.status,
        });
      }
    });

    // 6. Invoices
    invoices.forEach((inv) => {
      if (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.counterpartyName.toLowerCase().includes(q) ||
        (inv.linkedJobNumber && inv.linkedJobNumber.toLowerCase().includes(q)) ||
        (inv.linkedPoNumber && inv.linkedPoNumber.toLowerCase().includes(q))
      ) {
        results.push({
          id: `INV-${inv.invoiceNumber}`,
          title: `${inv.type === 'AR_Invoice' ? 'Invoice' : 'Bill'} #${inv.invoiceNumber} &bull; ${inv.counterpartyName}`,
          subtitle: `Due: ${inv.dueDate} &bull; Balance: $${inv.balanceDue.toFixed(2)} &bull; ${inv.paymentStatus}`,
          category: 'Invoicing & Accounting',
          icon: Receipt,
          moduleId: 'ap_ar_invoicing',
          badge: inv.paymentStatus,
        });
      }
    });

    // 7. Doc Control
    docControlItems.forEach((doc) => {
      if (
        doc.docNumber.toLowerCase().includes(q) ||
        doc.title.toLowerCase().includes(q) ||
        (doc.linkedJobNumber && doc.linkedJobNumber.toLowerCase().includes(q))
      ) {
        results.push({
          id: `DOC-${doc.id}`,
          title: `${doc.docNumber} (${doc.revision}) &bull; ${doc.title}`,
          subtitle: `Format: ${doc.fileFormat} &bull; Job: ${doc.linkedJobNumber || 'General'} &bull; ${doc.status}`,
          category: 'Document Control',
          icon: FolderKanban,
          moduleId: 'doc_control',
          badge: doc.revision,
        });
      }
    });

    return results.slice(0, 15);
  }, [query, workOrders, mtrDatabase, stockInventory, purchaseOrders, ncrRecords, invoices, docControlItems]);

  const handleSelectResult = (moduleId: string) => {
    setActiveModuleId(moduleId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm p-4 pt-16 sm:pt-24">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950">
          <Search className="h-5 w-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Universal Search across Job #, HT#, PO#, NCR#, SKU, Invoices, Clients..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[420px] overflow-y-auto p-3 divide-y divide-slate-800/60">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-slate-500">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-40 text-cyan-400" />
              <p className="text-xs">Type a Job # (e.g. <span className="text-cyan-400 font-bold">IPG-WO-2026-0101</span>), Heat # (e.g. <span className="text-cyan-400 font-bold">K49201</span>), PO #, or Client name.</p>
              <p className="text-[10px] text-slate-600 mt-2">Press ESC to dismiss &bull; Instant offline lookup</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p>No matching records found for "{query}".</p>
            </div>
          ) : (
            searchResults.map((res) => {
              const Icon = res.icon;
              return (
                <div
                  key={res.id}
                  onClick={() => handleSelectResult(res.moduleId)}
                  className="py-2.5 px-3 rounded-xl hover:bg-slate-800/80 cursor-pointer flex items-center justify-between gap-3 group transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-cyan-400 group-hover:border-cyan-400/40 shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div
                        className="font-bold text-slate-100 group-hover:text-cyan-400 truncate"
                        dangerouslySetInnerHTML={{ __html: res.title }}
                      />
                      <div className="text-[11px] text-slate-400 truncate">{res.subtitle}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {res.category}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Helper */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between items-center">
          <span>Search Engine: Local-First In-Memory Index (Bay City Resilient)</span>
          <span>Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Ctrl + K</kbd></span>
        </div>

      </div>
    </div>
  );
};
