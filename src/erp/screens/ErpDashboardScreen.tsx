// src/erp/screens/ErpDashboardScreen.tsx
// Main Home Page & Executive Operations Dashboard for Iron Prairie Group LLC

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
  Building
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
  } = useErp();

  const [selectedOrderForPacket, setSelectedOrderForPacket] = useState<ErpWorkOrder | null>(null);

  // High-Level KPI Calculations
  const activeJobs = workOrders.filter((w) => w.stage !== 'Invoiced & Completed');
  const completedJobs = workOrders.filter((w) => w.stage === 'Invoiced & Completed');
  const totalRevenue = workOrders.reduce((sum, w) => sum + w.totalAmount, 0);
  
  const arInvoices = invoices.filter((i) => i.type === 'AR_Invoice');
  const openArBalance = arInvoices
    .filter((i) => i.paymentStatus !== 'Paid in Full')
    .reduce((sum, i) => sum + i.balanceDue, 0);

  const openNcrCount = ncrRecords.filter((n) => n.status !== 'Closed').length;
  const lowStockCount = stockInventory.filter((s) => s.availableQuantity <= s.minReorderThreshold).length;
  const pendingPos = purchaseOrders.filter((p) => p.status === 'Issued to Vendor' || p.status === 'Draft').length;

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
      {(lowStockCount > 0 || openNcrCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

      {/* Split Stage: Production Flow & Live Sales Trigger Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Active Work Orders Pipeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-100 uppercase">
              <Flame className="h-4 w-4 text-cyan-400" />
              <span>Live Work Orders &amp; Cutting Queue</span>
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
            {workOrders.slice(0, 5).map((wo) => (
              <div
                key={wo.jobNumber}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                      {wo.jobNumber}
                    </span>
                    <span className="font-bold text-slate-200 truncate">{wo.clientCompanyName}</span>
                    {wo.priority === 'Urgent / Hot Shot' && (
                      <span className="text-[10px] font-bold bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/40 animate-pulse">
                        HOT-SHOT
                      </span>
                    )}
                  </div>
                  <div className="text-slate-400 truncate">
                    PO: {wo.customerPoNumber} &bull; {wo.projectName} &bull; Items: {wo.items.map(i => `${i.quantity}x ${i.nps} ${i.materialCode}`).join(', ')}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Ship Target: <strong className="text-slate-300">{wo.scheduledShipDate}</strong> &bull; Heat #s: {wo.allocatedHeatNumbers.join(', ') || 'Unallocated'}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                    wo.stage === 'Invoiced & Completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : wo.stage === 'Laser / Plasma Cutting'
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 animate-pulse'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {wo.stage}
                  </span>

                  <button
                    onClick={() => setSelectedOrderForPacket(wo)}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold transition-colors"
                  >
                    Traveler
                  </button>
                </div>
              </div>
            ))}
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
              When orders or RFQs are received from <span className="text-cyan-400 font-semibold">sales@iron-prairie.com</span>, they are parsed and populate the dashboard automatically with assigned Job #s.
            </p>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto">
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
