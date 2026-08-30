// src/erp/screens/ErpDashboardScreen.tsx
// Main Home Page & Executive Operations Dashboard for Iron Prairie Group LLC
// Real-time integration: Stripe & Bluevine Financial Intelligence, Active Storefront Inbound Feed, Plate Stock Alerts & ASME Quality Flow

import React, { useState } from 'react';
import { useErp } from '../context/ErpContext';
import {
  Flame,
  ShieldCheck,
  Truck,
  Boxes,
  Receipt,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  DollarSign,
  Plus,
  ArrowUpRight,
  ChevronRight,
  Activity,
  Layers,
  FileSpreadsheet,
  Building,
  CreditCard,
  ExternalLink,
  Zap,
  ArrowDownLeft,
  Lock,
  Percent,
  Play,
  ShoppingCart
} from 'lucide-react';
import { ErpWorkOrder } from '../../types';
import { JobPacketModal } from '../components/JobPacketModal';

export const ErpDashboardScreen: React.FC = () => {
  const {
    workOrders,
    stockInventory,
    mtrDatabase,
    purchaseOrders,
    ncrRecords,
    invoices,
    salesEmailTriggers,
    simulateSalesEmailTrigger,
    setActiveModuleId,
    updateWorkOrderStage,
    releaseToPlasmaTable,
    financialMetrics,
    incompleteCheckouts,
    dismissedCheckoutIds,
    storefrontFeedAuthRequired,
    storefrontFeedError,
  } = useErp();

  const [selectedOrderForPacket, setSelectedOrderForPacket] = useState<ErpWorkOrder | null>(null);

  // High-Level KPI Calculations
  const activeJobs = workOrders.filter((w) => w.stage !== 'Invoiced & Completed');
  const completedJobs = workOrders.filter((w) => w.stage === 'Invoiced & Completed');
  const totalRevenue = financialMetrics.totalGrossRevenue;
  
  const arInvoices = invoices.filter((i) => i.type === 'AR_Invoice');
  const openArBalance = arInvoices
    .filter((i) => i.paymentStatus !== 'Paid in Full')
    .reduce((sum, i) => sum + i.balanceDue, 0);

  const openNcrCount = ncrRecords.filter((n) => n.status !== 'Closed').length;
  const lowStockCount = stockInventory.filter((s) => s.availableQuantity <= s.minReorderThreshold).length;
  const pendingPos = purchaseOrders.filter((p) => p.status === 'Issued to Vendor' || p.status === 'Draft').length;
  const liveIncomplete = incompleteCheckouts.filter((row) => !dismissedCheckoutIds.includes(row.orderRefId));
  const incompleteValue = liveIncomplete.reduce((sum, row) => sum + (Number(row.totalAmount) || 0), 0);

  // Key Fabrication Plate Materials
  const keyPlateAlloys = [
    { code: 'SA-516-70', label: 'A516-70 PVQ', spec: 'ASME SA-516 Gr. 70 (Normalized)', density: '0.284 lb/in³' },
    { code: 'SA-36', label: 'SA-36 Structural', spec: 'ASME SA-36 / ASTM A36', density: '0.283 lb/in³' },
    { code: '304L', label: '304L Stainless', spec: 'ASTM A240 304/304L Dual-Cert', density: '0.290 lb/in³' },
    { code: '316L', label: '316L Stainless', spec: 'ASTM A240 316L Moly Acid Grade', density: '0.290 lb/in³' },
    { code: 'AL-6061', label: '6061-T6 Aluminum', spec: 'ASTM B209 6061-T6 High Strength', density: '0.098 lb/in³' },
  ];

  return (
    <div className="space-y-6 font-mono">
      
      {/* Top Banner & Quick Action Launchpad */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Activity className="h-4 w-4" />
              <span>IPG Mission Control &bull; Bay City Fabrication Hub</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Executive Operations &amp; Production Overview
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Real-time synchronization across Laser Cutting, ASME Section VIII MTR Vault, Stock Materials, Purchase Orders, and AP/AR Invoicing.
            </p>
          </div>

          {/* Primary Quick Launch Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => simulateSalesEmailTrigger()}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-cyan-500/20 active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>+ Simulate Inbound Sales Email</span>
            </button>
            <button
              onClick={() => setActiveModuleId('catalog_orders')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
            >
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>Catalog Orders</span>
            </button>
            <button
              onClick={() => setActiveModuleId('purchase_orders')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
            >
              <Truck className="h-4 w-4 text-emerald-400" />
              <span>Issue PO</span>
            </button>
          </div>
        </div>
      </div>

      {/* Critical Alert Banners (if any) */}
      {(lowStockCount > 0 || openNcrCount > 0 || liveIncomplete.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {liveIncomplete.length > 0 && (
            <div
              onClick={() => setActiveModuleId('incomplete_checkouts')}
              className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs cursor-pointer hover:bg-amber-500/20 transition-all md:col-span-2"
            >
              <div className="flex items-center gap-2.5 text-amber-200 font-bold">
                <ShoppingCart className="h-4 w-4 text-amber-400 shrink-0" />
                <span>
                  {liveIncomplete.length} incomplete storefront checkout{liveIncomplete.length === 1 ? '' : 's'} — ${incompleteValue.toFixed(2)} started but not paid
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-amber-400" />
            </div>
          )}
          {lowStockCount > 0 && (
            <div
              onClick={() => setActiveModuleId('stock_inventory')}
              className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between text-xs cursor-pointer hover:bg-cyan-500/20 transition-all"
            >
              <div className="flex items-center gap-2.5 text-cyan-300 font-bold">
                <Boxes className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>{lowStockCount} Material Stock items below reorder threshold (Plate / Pipe)</span>
              </div>
              <ChevronRight className="h-4 w-4 text-cyan-400" />
            </div>
          )}
          {openNcrCount > 0 && (
            <div
              onClick={() => setActiveModuleId('ncr_log')}
              className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between text-xs cursor-pointer hover:bg-red-500/20 transition-all"
            >
              <div className="flex items-center gap-2.5 text-red-300 font-bold">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{openNcrCount} Open Quality NCRs requiring investigation / sign-off</span>
              </div>
              <ChevronRight className="h-4 w-4 text-red-400" />
            </div>
          )}
        </div>
      )}

      {/* STRIPE & BLUEVINE FINANCIAL INTELLIGENCE CARD */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Live Banking &amp; Payment Intelligence
                </h2>
                <span className="px-2 py-0.5 text-[9px] font-black bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/40 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  BLUEVINE SWEEPS ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Stripe Payments Engine &bull; Daily Automatic Sweeps to Bluevine Business Checking
              </p>
            </div>
          </div>

          <a
            href="https://dashboard.stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
          >
            <span>Stripe Dashboard</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Financial Metrics Split Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Gross Volume Processed</div>
            <div className="text-xl font-black text-white font-mono">${financialMetrics.totalGrossRevenue.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-400 font-bold">All Channels Combined</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
              <span>Credit Card (+3.5%)</span>
              <span className="text-amber-400">{financialMetrics.creditCardPct}%</span>
            </div>
            <div className="text-xl font-black text-amber-300 font-mono">${financialMetrics.creditCardVolume.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400">Surcharge: +${financialMetrics.totalCreditCardSurcharges.toFixed(2)}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
              <span>Stripe ACH (0%)</span>
              <span className="text-cyan-400">{financialMetrics.achPct}%</span>
            </div>
            <div className="text-xl font-black text-cyan-300 font-mono">${financialMetrics.achVolume.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-400 font-bold">Fee Savings: ${financialMetrics.totalAchFeeSavings.toFixed(2)}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Bluevine Swept Net</div>
            <div className="text-xl font-black text-emerald-400 font-mono">${financialMetrics.bluevineSweptTotal.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400">In-Flight: ${financialMetrics.stripeInFlightBalance.toLocaleString()}</div>
          </div>
        </div>

        {/* Volume Split Progress Visualizer */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Payment Method Split: Credit Card ({financialMetrics.creditCardPct}%) vs Stripe ACH Direct Debit ({financialMetrics.achPct}%) vs Net 30 ({financialMetrics.poPct}%)</span>
            <span className="text-emerald-400 font-bold">0% Surcharge Advantage Active</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden flex">
            <div style={{ width: `${financialMetrics.creditCardPct}%` }} className="bg-amber-400 h-full" title={`Credit Card: ${financialMetrics.creditCardPct}%`} />
            <div style={{ width: `${financialMetrics.achPct}%` }} className="bg-cyan-400 h-full" title={`Stripe ACH: ${financialMetrics.achPct}%`} />
            <div style={{ width: `${financialMetrics.poPct}%` }} className="bg-purple-500 h-full" title={`Commercial PO: ${financialMetrics.poPct}%`} />
          </div>
        </div>
      </div>

      {/* Metric KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* 1. Active Jobs */}
        <div
          onClick={() => setActiveModuleId('work_orders')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Active Jobs</span>
            <Flame className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white">{activeJobs.length}</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <span>{completedJobs.length} Completed YTD</span>
          </div>
        </div>

        {/* 2. Pipeline Revenue */}
        <div
          onClick={() => setActiveModuleId('work_orders')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Revenue</span>
            <DollarSign className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-emerald-400">${totalRevenue.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400 mt-1">Across all work orders</div>
        </div>

        {/* 3. MTR Heat Numbers */}
        <div
          onClick={() => setActiveModuleId('mtr_vault')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">MTR Heat #s</span>
            <ShieldCheck className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-cyan-400">{mtrDatabase.length}</div>
          <div className="text-[10px] text-slate-400 mt-1">ASME Section VIII Div 1</div>
        </div>

        {/* 4. Stock Inventory */}
        <div
          onClick={() => setActiveModuleId('stock_inventory')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Stock Inventory</span>
            <Boxes className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-cyan-400">{stockInventory.length} SKUs</div>
          <div className="text-[10px] text-slate-400 mt-1">Plate, Pipe &amp; Structural</div>
        </div>

        {/* 5. Open Purchase Orders */}
        <div
          onClick={() => setActiveModuleId('purchase_orders')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Open POs</span>
            <Truck className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-purple-400">{pendingPos}</div>
          <div className="text-[10px] text-slate-400 mt-1">Supplier Material Orders</div>
        </div>

        {/* 6. Accounts Receivable Balance */}
        <div
          onClick={() => setActiveModuleId('ap_ar_invoicing')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">AR Balance Due</span>
            <Receipt className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white">${openArBalance.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 mt-1">Client Invoices</div>
        </div>

      </div>

      {/* REAL-TIME FABRICATION PLATE STOCK INVENTORY MONITOR */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
            <Boxes className="h-4 w-4 text-cyan-400" />
            <span>Real-Time Plate Stock Inventory (ASME &amp; Structural Alloys)</span>
          </div>
          <button
            onClick={() => setActiveModuleId('stock_inventory')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
          >
            <span>Full Inventory ({stockInventory.length})</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {keyPlateAlloys.map((alloy) => {
            const items = stockInventory.filter((s) => s.materialCode === alloy.code);
            const totalAvailable = items.reduce((sum, i) => sum + i.availableQuantity, 0);
            const totalAllocated = items.reduce((sum, i) => sum + i.allocatedQuantity, 0);
            const isLow = totalAvailable <= 2;

            return (
              <div
                key={alloy.code}
                className={`p-3.5 rounded-xl border transition-all ${
                  isLow
                    ? 'bg-red-500/10 border-red-500/40 text-red-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-white font-black">{alloy.label}</span>
                  {isLow ? (
                    <span className="text-[9px] font-black bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/40 animate-pulse">
                      LOW STOCK
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/40">
                      IN STOCK
                    </span>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 truncate mb-2">{alloy.spec}</div>

                <div className="flex items-end justify-between border-t border-slate-800/80 pt-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Available</span>
                    <strong className="text-base font-black text-white">{totalAvailable} Plates</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 text-[10px] block">Allocated</span>
                    <span className="text-cyan-400 font-bold">{totalAllocated} Pcs</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Split Stage: Production Flow & Live Storefront / Email Trigger Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Active Inbound Storefront & Work Orders Pipeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-100 uppercase">
              <ShoppingCart className="h-4 w-4 text-amber-400" />
              <span>Incomplete Web Checkouts</span>
            </div>
            <button
              onClick={() => setActiveModuleId('incomplete_checkouts')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
            >
              <span>Follow-up Queue ({liveIncomplete.length})</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {storefrontFeedAuthRequired && (
            <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-[11px] text-amber-200">
              Lock ERP and sign in again to load live canceled / unpaid Stripe checkouts.
            </div>
          )}
          {storefrontFeedError && !storefrontFeedAuthRequired && (
            <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-[11px] text-red-200">
              {storefrontFeedError}
            </div>
          )}

          <div className="space-y-2">
            {liveIncomplete.slice(0, 4).map((row) => (
              <button
                key={row.orderRefId}
                type="button"
                onClick={() => setActiveModuleId('incomplete_checkouts')}
                className="w-full text-left p-3.5 rounded-2xl bg-slate-900 border border-amber-500/20 hover:border-amber-500/40 transition-all"
              >
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <div className="font-black text-slate-100 truncate">{row.companyName || row.buyerName || 'Unknown buyer'}</div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {row.status === 'cancelled' ? 'Buyer cancelled Stripe checkout' : row.status === 'expired' ? 'Checkout session expired' : 'Checkout started, not paid'}
                      {row.cartItems[0] ? ` · ${row.cartItems[0].quantity}x ${row.cartItems[0].nps || ''} ${row.cartItems[0].partNumber}` : ''}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black text-amber-300">${Number(row.totalAmount || 0).toFixed(2)}</div>
                    <div className="text-[10px] text-slate-500">{row.orderRefId}</div>
                  </div>
                </div>
              </button>
            ))}
            {liveIncomplete.length === 0 && !storefrontFeedAuthRequired && (
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-slate-500">
                No unpaid storefront checkouts right now. Canceled paddle-blind orders will land here automatically.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-100 uppercase">
              <Flame className="h-4 w-4 text-cyan-400" />
              <span>Active Inbound Storefront &amp; Cutting Queue</span>
            </div>
            <button
              onClick={() => setActiveModuleId('work_orders')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
            >
              <span>View All Work Orders ({workOrders.length})</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {workOrders.slice(0, 6).map((wo) => {
              const isPlasmaCutting = wo.stage === 'Laser / Plasma Cutting';
              return (
                <div
                  key={wo.jobNumber}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                        {wo.jobNumber}
                      </span>
                      <span className="font-bold text-slate-200 truncate">{wo.clientCompanyName}</span>
                      {wo.priority === 'Urgent / Hot Shot' && (
                        <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/40 animate-pulse">
                          HOT-SHOT
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">
                        ${wo.totalAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-slate-400 truncate">
                      PO: {wo.customerPoNumber} &bull; {wo.projectName} &bull; Items: {wo.items.map(i => `${i.quantity}x ${i.nps} ${i.materialCode}`).join(', ')}
                    </div>

                    <div className="text-[10px] text-slate-500 flex items-center gap-2 flex-wrap">
                      <span>Ship Target: <strong className="text-slate-300">{wo.scheduledShipDate}</strong></span>
                      <span>&bull;</span>
                      <span>Heat #s: <strong className="text-cyan-400">{wo.allocatedHeatNumbers.join(', ') || 'Auto-Allocated'}</strong></span>
                      {wo.notes && (
                        <>
                          <span>&bull;</span>
                          <span className="text-slate-400 truncate max-w-xs">{wo.notes}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      wo.stage === 'Invoiced & Completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : isPlasmaCutting
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 animate-pulse'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {wo.stage}
                    </span>

                    {/* 1-Click Release to Plasma Table Action */}
                    {!isPlasmaCutting && wo.stage !== 'Invoiced & Completed' && (
                      <button
                        onClick={() => releaseToPlasmaTable(wo.jobNumber)}
                        className="flex items-center gap-1 px-3 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] font-black transition-all shadow-md shadow-cyan-500/20 active:scale-95"
                        title="Release directly to CNC Plasma table"
                      >
                        <Zap className="h-3.5 w-3.5 fill-current" />
                        <span>Burn</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedOrderForPacket(wo)}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold transition-colors"
                      title="Open printable ASME QC shop traveler"
                    >
                      Traveler
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Sales Email Trigger Intake Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-100 uppercase">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Sales Email Trigger Feed</span>
            </div>
            <button
              onClick={() => setActiveModuleId('sales_triggers')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold"
            >
              Inbox
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              When orders or RFQs are received from <span className="text-cyan-400 font-semibold">sales@ironprairiefabrication.com</span>, they are parsed and populate the dashboard automatically with assigned Job #s.
            </p>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto">
              {salesEmailTriggers.map((trig) => (
                <div
                  key={trig.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400 truncate">{trig.companyName}</span>
                    <span className="text-[10px] text-slate-500">{trig.timestamp}</span>
                  </div>
                  <div className="text-slate-300 font-medium truncate">{trig.subject}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                    <span>PO: {trig.poNumber}</span>
                    {trig.generatedJobNumber ? (
                      <span className="text-emerald-400 font-bold">Job #{trig.generatedJobNumber}</span>
                    ) : (
                      <span className="text-cyan-400 font-bold">Pending Conversion</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Printable Shop Packet Modal */}
      <JobPacketModal
        order={selectedOrderForPacket}
        isOpen={Boolean(selectedOrderForPacket)}
        onClose={() => setSelectedOrderForPacket(null)}
      />

    </div>
  );
};
