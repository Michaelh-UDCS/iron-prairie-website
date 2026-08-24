import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function writeSrc(relPath, content) {
  const fullPath = path.join(rootDir, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log('✓ Created ' + relPath);
}

// ============================================================================
// 1. src/operations/components/LaserCuttingKanban.tsx
// ============================================================================
const kanbanContent = `// src/operations/components/LaserCuttingKanban.tsx
// 5-Stage Shop Floor Kanban with ASME UG-77 Heat Assignment & QC Traveler

import React, { useState, useMemo } from 'react';
import { CustomerOrder, MaterialTestReport } from '../../types';
import { HeatMatcherPanel } from './HeatMatcherPanel';
import { chimeManager } from '../services/AudioChimeManager';
import {
  Clock,
  Flame,
  Wrench,
  Truck,
  CheckCircle2,
  FileText,
  Search,
  Zap,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  Edit2,
  Check
} from 'lucide-react';

interface LaserCuttingKanbanProps {
  orders: CustomerOrder[];
  setOrders: React.Dispatch<React.SetStateAction<CustomerOrder[]>>;
  onOpenTraveler: (order: CustomerOrder) => void;
  onPreviewMtr: (mtr: MaterialTestReport) => void;
}

export const LaserCuttingKanban: React.FC<LaserCuttingKanbanProps> = ({
  orders,
  setOrders,
  onOpenTraveler,
  onPreviewMtr,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingHeatOrderId, setEditingHeatOrderId] = useState<string | null>(null);
  const [heatInputValue, setHeatInputValue] = useState('');

  // 5 Kanban Columns
  const stages: {
    key: CustomerOrder['status'];
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    borderAccent: string;
    headerBg: string;
  }[] = [
    {
      key: 'queued',
      title: '1. Queued to Burn',
      icon: Clock,
      accentColor: 'text-amber-400',
      borderAccent: 'border-amber-500/40',
      headerBg: 'bg-amber-950/20',
    },
    {
      key: 'laser_cutting',
      title: '2. At Laser Table',
      icon: Flame,
      accentColor: 'text-orange-400',
      borderAccent: 'border-orange-500/40',
      headerBg: 'bg-orange-950/20',
    },
    {
      key: 'deburred_stamped',
      title: '3. Deburred & Stamped',
      icon: Wrench,
      accentColor: 'text-sky-400',
      borderAccent: 'border-sky-500/40',
      headerBg: 'bg-sky-950/20',
    },
    {
      key: 'ready_to_ship',
      title: '4. Ready to Ship',
      icon: Truck,
      accentColor: 'text-indigo-400',
      borderAccent: 'border-indigo-500/40',
      headerBg: 'bg-indigo-950/20',
    },
    {
      key: 'shipped',
      title: '5. Shipped / Complete',
      icon: CheckCircle2,
      accentColor: 'text-emerald-400',
      borderAccent: 'border-emerald-500/40',
      headerBg: 'bg-emerald-950/20',
    },
  ];

  // Stage Advancement Handler
  const advanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.orderId !== orderId) return order;

        if (order.status === 'queued') {
          return { ...order, status: 'laser_cutting' };
        }
        if (order.status === 'laser_cutting') {
          return { ...order, status: 'deburred_stamped' };
        }
        if (order.status === 'deburred_stamped') {
          return { ...order, status: 'ready_to_ship' };
        }
        if (order.status === 'ready_to_ship') {
          chimeManager.playOrderShippedDing();
          return {
            ...order,
            status: 'shipped',
            carrierName: order.shippingMethod.includes('LTL') ? 'R+L Carriers (Freeport Dock)' : 'UPS Freight Express',
            trackingNumber: \`1Z-IPF-\${Math.floor(100000000 + Math.random() * 900000000)}\`,
          };
        }
        return order;
      })
    );
  };

  // Assign Heat Handler
  const handleAssignHeat = (orderId: string, heatNumber: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, millHeatNumber: heatNumber } : o))
    );
    setEditingHeatOrderId(null);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchQuery.toLowerCase();
      return (
        o.poNumber.toLowerCase().includes(q) ||
        o.companyName.toLowerCase().includes(q) ||
        o.orderId.toLowerCase().includes(q) ||
        (o.millHeatNumber && o.millHeatNumber.toLowerCase().includes(q))
      );
    });
  }, [orders, searchQuery]);

  return (
    <div className="space-y-4 font-mono text-xs">
      
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search PO #, Client, Mill Heat, Order ID..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-10 pr-4 text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="text-slate-400 text-[11px] hidden sm:block">
          Active WIP Orders: <strong className="text-amber-400">{orders.filter(o => o.status !== 'shipped').length}</strong> &bull; Completed: <strong className="text-emerald-400">{orders.filter(o => o.status === 'shipped').length}</strong>
        </div>
      </div>

      {/* 5-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-start">
        {stages.map((stage) => {
          const colOrders = filteredOrders.filter((o) => o.status === stage.key);
          const Icon = stage.icon;

          return (
            <div
              key={stage.key}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden min-h-[550px]"
            >
              {/* Column Header */}
              <div className={\`p-3.5 border-b border-slate-800 flex items-center justify-between \${stage.headerBg}\`}>
                <div className="flex items-center gap-2">
                  <Icon className={\`h-4 w-4 \${stage.accentColor}\`} />
                  <span className="font-bold text-slate-100 text-xs tracking-tight font-sans">
                    {stage.title}
                  </span>
                </div>
                <span className="h-5 w-5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-black text-slate-300">
                  {colOrders.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="p-2.5 space-y-3 overflow-y-auto max-h-[700px]">
                {colOrders.length === 0 ? (
                  <div className="p-8 text-center text-[11px] text-slate-600 font-sans">
                    No orders staged
                  </div>
                ) : (
                  colOrders.map((order) => {
                    const primary = order.items[0];
                    const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);

                    return (
                      <div
                        key={order.orderId}
                        className={\`rounded-xl border bg-slate-950 p-3.5 space-y-2.5 shadow-md transition-all hover:border-slate-700 \${stage.borderAccent}\`}
                      >
                        {/* Card Top: PO # & Badges */}
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="text-xs font-bold text-amber-400 block">{order.poNumber}</span>
                            <span className="text-[11px] font-bold text-slate-200 truncate block max-w-[160px] font-sans">
                              {order.companyName}
                            </span>
                          </div>

                          {order.isHotShot && (
                            <span className="rounded bg-rose-500/20 text-rose-400 text-[9px] font-black px-1.5 py-0.5 border border-rose-500/40 animate-pulse">
                              HOT SHOT
                            </span>
                          )}
                        </div>

                        {/* Items Summary */}
                        <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] space-y-1">
                          <div className="text-slate-300 font-bold">
                            {totalQty}x Blinds &bull; {primary ? \`\${primary.nps} \${primary.pressureClass}# \${primary.materialCode}\` : ''}
                          </div>
                          <div className="text-slate-500 text-[10px]">
                            Ship Date: <strong className="text-slate-300">{order.scheduledShipDate}</strong> &bull; {order.totalWeightLbs} lbs
                          </div>
                        </div>

                        {/* Mill Heat Number Tag / Inline Editor */}
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-500 uppercase font-bold">Mill Heat #:</span>
                            {editingHeatOrderId !== order.orderId && (
                              <button
                                onClick={() => {
                                  setEditingHeatOrderId(order.orderId);
                                  setHeatInputValue(order.millHeatNumber || '');
                                }}
                                className="text-slate-500 hover:text-amber-400"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>

                          {editingHeatOrderId === order.orderId ? (
                            <div className="flex gap-1">
                              <input
                                type="text"
                                value={heatInputValue}
                                onChange={(e) => setHeatInputValue(e.target.value.toUpperCase())}
                                className="w-full bg-slate-900 border border-amber-500 px-2 py-0.5 rounded text-[11px] text-amber-300 font-bold focus:outline-none"
                              />
                              <button
                                onClick={() => handleAssignHeat(order.orderId, heatInputValue)}
                                className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-bold hover:bg-amber-400"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                              <span className="font-black text-amber-300 text-[11px]">
                                {order.millHeatNumber || 'PENDING ASSIGN'}
                              </span>
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                            </div>
                          )}
                        </div>

                        {/* Auto-Matcher Panel when at Laser Table stage */}
                        {stage.key === 'laser_cutting' && !order.millHeatNumber && (
                          <HeatMatcherPanel
                            order={order}
                            onAssignHeat={(heat) => handleAssignHeat(order.orderId, heat)}
                            onPreviewMtr={onPreviewMtr}
                          />
                        )}

                        {/* Tracking Number if Shipped */}
                        {stage.key === 'shipped' && order.trackingNumber && (
                          <div className="bg-emerald-950/20 border border-emerald-500/30 p-2 rounded-lg text-[10px] space-y-0.5">
                            <div className="text-slate-400">{order.carrierName}</div>
                            <div className="text-emerald-400 font-bold truncate">{order.trackingNumber}</div>
                          </div>
                        )}

                        {/* Actions Row */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                          <button
                            onClick={() => onOpenTraveler(order)}
                            title="Print ASME Job Traveler & UG-77 Log"
                            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-amber-400 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg transition-colors"
                          >
                            <FileText className="h-3 w-3" />
                            <span>Traveler</span>
                          </button>

                          {stage.key !== 'shipped' && (
                            <button
                              onClick={() => advanceOrderStatus(order.orderId)}
                              className="flex items-center gap-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] px-2.5 py-1 transition-all shadow active:scale-95 ml-auto"
                            >
                              <span>Advance</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
`;

writeSrc('src/operations/components/LaserCuttingKanban.tsx', kanbanContent);

// ============================================================================
// 2. src/operations/components/AbandonedCartRecovery.tsx
// ============================================================================
const abandonedCartContent = `// src/operations/components/AbandonedCartRecovery.tsx
// Abandoned Cart Telemetry & Commercial Turnaround Quote Recovery Engine

import React, { useState } from 'react';
import { AbandonedCartRecord, CustomerOrder } from '../../types';
import { generateAbandonedCartQuoteEmail, triggerOrderEmailNotification } from '../../services/emailService';
import { chimeManager } from '../services/AudioChimeManager';
import {
  ShoppingCart,
  Send,
  CheckCircle2,
  DollarSign,
  Phone,
  Mail,
  Building,
  RotateCcw,
  Trash2,
  Eye,
  X
} from 'lucide-react';

interface AbandonedCartRecoveryProps {
  abandonedCarts: AbandonedCartRecord[];
  setAbandonedCarts: React.Dispatch<React.SetStateAction<AbandonedCartRecord[]>>;
  orders: CustomerOrder[];
  setOrders: React.Dispatch<React.SetStateAction<CustomerOrder[]>>;
}

export const AbandonedCartRecovery: React.FC<AbandonedCartRecoveryProps> = ({
  abandonedCarts,
  setAbandonedCarts,
  orders,
  setOrders,
}) => {
  const [selectedQuoteCart, setSelectedQuoteCart] = useState<AbandonedCartRecord | null>(null);

  // Convert Abandoned Cart into Active PO
  const handleConvertToActivePO = (cart: AbandonedCartRecord) => {
    const newOrder: CustomerOrder = {
      orderId: \`PO-REC-\${Math.floor(1000 + Math.random() * 9000)}\`,
      orderSource: 'Direct PO',
      createdAt: new Date().toLocaleString(),
      companyName: cart.companyName,
      contactName: cart.buyerName,
      email: cart.email,
      jobsiteAddress: cart.facilityLocation || 'Freeport Petrochemical Complex, TX',
      poNumber: \`PO-RECOVERED-\${Date.now().toString().slice(-4)}\`,
      items: cart.items,
      subtotal: cart.subtotal,
      shippingCost: cart.shippingEstimate || 35.0,
      hotShotFee: 0,
      totalAmount: cart.totalAmount,
      totalWeightLbs: cart.totalWeightLbs,
      shippingMethod: cart.totalWeightLbs >= 150 ? 'LTL Palletized Freight' : 'UPS Ground Parcel',
      isHotShot: false,
      isLargeOrder: cart.totalAmount > 5000,
      leadTimeEstimate: '2-4 Business Days',
      paymentMethod: 'Net 30 Commercial PO',
      paymentStatus: 'Net 30 Authorized',
      status: 'queued',
      millHeatNumber: 'K49201-B',
      scheduledShipDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      carrierName: 'UPS Ground Express',
      trackingNumber: '',
      notes: 'Direct conversion from abandoned web quote session by Russell/Alicia.',
    };

    setOrders([newOrder, ...orders]);
    setAbandonedCarts((prev) =>
      prev.map((c) => (c.cartId === cart.cartId ? { ...c, status: 'Recovered' } : c))
    );

    chimeManager.playNewOrderChime();
    triggerOrderEmailNotification(newOrder);
  };

  const handleDismissCart = (cartId: string) => {
    setAbandonedCarts((prev) => prev.filter((c) => c.cartId !== cartId));
  };

  const totalAbandonedValue = abandonedCarts
    .filter((c) => c.status !== 'Recovered')
    .reduce((s, c) => s + c.totalAmount, 0);

  const totalRecoveredValue = abandonedCarts
    .filter((c) => c.status === 'Recovered')
    .reduce((s, c) => s + c.totalAmount, 0);

  return (
    <div className="space-y-6 pb-20 font-mono text-xs">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="h-6 w-6 text-amber-400" />
            <h1 className="text-2xl font-black text-slate-100 tracking-tight font-display font-sans">
              Abandoned Cart &amp; Turnaround Quote Recovery
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans">
            Recapture unconverted plant turnaround RFQs with 1-click official quote dispatches and direct PO conversions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Recovered Revenue</span>
            <span className="text-lg font-black text-emerald-400">
              \${totalRecoveredValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
          <div className="text-slate-400 text-[10px] font-bold uppercase">Unconverted Pipeline Value</div>
          <div className="text-xl font-black text-amber-400 mt-1">\${totalAbandonedValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{abandonedCarts.filter(c => c.status !== 'Recovered').length} Open RFQs</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
          <div className="text-slate-400 text-[10px] font-bold uppercase">Total Recovered Sales</div>
          <div className="text-xl font-black text-emerald-400 mt-1">\${totalRecoveredValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="text-[10px] text-emerald-500 mt-0.5">{abandonedCarts.filter(c => c.status === 'Recovered').length} Converted to PO</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
          <div className="text-slate-400 text-[10px] font-bold uppercase">Recovery Rate</div>
          <div className="text-xl font-black text-sky-400 mt-1">
            {abandonedCarts.length > 0 ? Math.round((abandonedCarts.filter(c => c.status === 'Recovered').length / abandonedCarts.length) * 100) : 0}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Commercial Outage Follow-Up</div>
        </div>
      </div>

      {/* Cart Cards List */}
      <div className="space-y-3">
        {abandonedCarts.map((cart) => {
          const isRecovered = cart.status === 'Recovered';

          return (
            <div
              key={cart.cartId}
              className={\`p-5 rounded-2xl border bg-slate-900 shadow-lg space-y-3 transition-all \${
                isRecovered ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800'
              }\`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{cart.companyName}</span>
                    <span
                      className={\`px-2.5 py-0.5 rounded-full text-[10px] font-bold \${
                        isRecovered ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }\`}
                    >
                      {cart.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Buyer: <strong className="text-slate-300">{cart.buyerName}</strong> &bull; {cart.email} &bull; {cart.phone}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-emerald-400">\${cart.totalAmount.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500">Drop-off: {cart.lastActiveStep}</div>
                </div>
              </div>

              {/* Items Summary Table */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="font-bold text-slate-300 mb-1">Configured Blinds in Quote:</div>
                <div className="space-y-1 text-slate-400 text-[11px]">
                  {cart.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{it.quantity}x {it.nps} {it.pressureClass}# {it.materialCode} ({it.thicknessLabel})</span>
                      <span className="text-slate-200 font-bold">\${(it.unitPrice * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setSelectedQuoteCart(cart)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700"
                >
                  <Mail className="h-3.5 w-3.5 text-amber-400" />
                  <span>Generate Quote Email</span>
                </button>

                {!isRecovered && (
                  <button
                    onClick={() => handleConvertToActivePO(cart)}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-1.5 text-xs font-bold text-slate-950 shadow active:scale-95"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Convert to Active PO</span>
                  </button>
                )}

                <button
                  onClick={() => handleDismissCart(cart.cartId)}
                  className="p-1.5 text-slate-600 hover:text-rose-400 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Quote Email Modal */}
      {selectedQuoteCart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md font-mono text-xs">
          <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-400" />
                Turnaround Recovery Quote &bull; {selectedQuoteCart.companyName}
              </h3>
              <button onClick={() => setSelectedQuoteCart(null)} className="text-slate-400 hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 whitespace-pre-wrap text-slate-300 text-[11px]">
                {generateAbandonedCartQuoteEmail(selectedQuoteCart).body}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <a
                  href={generateAbandonedCartQuoteEmail(selectedQuoteCart).mailtoUrl}
                  onClick={() => {
                    setAbandonedCarts((prev) =>
                      prev.map((c) => (c.cartId === selectedQuoteCart.cartId ? { ...c, status: 'Quote Sent' } : c))
                    );
                    setSelectedQuoteCart(null);
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-5 py-2 font-bold text-slate-950 hover:bg-amber-400 shadow active:scale-95"
                >
                  <Send className="h-4 w-4" />
                  <span>Send via Email Client</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
`;

writeSrc('src/operations/components/AbandonedCartRecovery.tsx', abandonedCartContent);

// ============================================================================
// 3. src/operations/OperationsAuthGate.tsx
// ============================================================================
const authGateContent = `// src/operations/OperationsAuthGate.tsx
// Security PIN Authentication Gate for Dedicated Desktop Operations Workspace

import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, KeyRound, ArrowRight, Building } from 'lucide-react';
import brandLogo from '../Logo.jpg';

interface OperationsAuthGateProps {
  children: React.ReactNode;
}

export const OperationsAuthGate: React.FC<OperationsAuthGateProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ipf_ops_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Default shop PIN: 1979 (Freeport area code origin) or 2026
  const VALID_PINS = ['1979', '2026', '979248'];

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (VALID_PINS.includes(pinInput.trim())) {
      setIsAuthenticated(true);
      try {
        localStorage.setItem('ipf_ops_authenticated', 'true');
      } catch (e) {
        console.error(e);
      }
    } else {
      setErrorMessage('Invalid Shop PIN. Please enter the authorized operations PIN.');
      setPinInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('ipf_ops_authenticated');
    } catch (e) {
      console.error(e);
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-100 font-mono">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
        
        <div className="flex flex-col items-center space-y-3">
          <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="h-8 w-8" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">
              IRON PRAIRIE FABRICATION GROUP LLC
            </div>
            <h1 className="text-xl font-black text-slate-100 mt-1 font-sans">
              Shop Floor &amp; Operations Workspace
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Authorized access only &bull; Freeport, TX Shop Operations
            </p>
          </div>
        </div>

        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2">
              Enter Operations Security PIN
            </label>
            <input
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="&bull;&bull;&bull;&bull;"
              className="w-full text-center tracking-[1em] text-2xl font-black bg-slate-950 border border-slate-700 rounded-xl py-3 text-amber-400 placeholder-slate-600 focus:border-amber-500 focus:outline-none"
              autoFocus
            />
          </div>

          {errorMessage && (
            <div className="text-rose-400 text-xs font-bold bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/30">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95"
          >
            <span>Unlock Operations Platform</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-[11px] text-slate-500 pt-4 border-t border-slate-800">
          Russell Huerta &bull; Alicia Huerta &bull; Michael Huerta
        </div>

      </div>
    </div>
  );
};
`;

writeSrc('src/operations/OperationsAuthGate.tsx', authGateContent);

// ============================================================================
// 4. src/operations/OperationsApp.tsx
// ============================================================================
const opsAppContent = `// src/operations/OperationsApp.tsx
// Main Desktop Operations Workspace Shell for Iron Prairie Fabrication Group LLC

import React, { useState, useEffect } from 'react';
import { CustomerOrder, AbandonedCartRecord, PricingConfig, MaterialTestReport } from '../types';
import { DEFAULT_PRICING_CONFIG } from '../data/masterGeometry';
import { INDUSTRIAL_TEST_CLIENTS, pickRandom, randomInt } from '../data/testClientsData';
import { triggerOrderEmailNotification, getEmailDispatchLogs, EmailNotificationRecord } from '../services/emailService';
import { chimeManager } from './services/AudioChimeManager';

import { LaserCuttingKanban } from './components/LaserCuttingKanban';
import { AsmeMtrVault } from './components/AsmeMtrVault';
import { SupplierPoGenerator } from './components/SupplierPoGenerator';
import { JobCostingTracker } from './components/JobCostingTracker';
import { AbandonedCartRecovery } from './components/AbandonedCartRecovery';
import { AsmeQcTravelerModal } from './components/AsmeQcTravelerModal';
import { QuickbooksExportModal } from './components/QuickbooksExportModal';

import {
  ShieldCheck,
  Flame,
  FolderOpen,
  Truck,
  DollarSign,
  ShoppingCart,
  Mail,
  Volume2,
  VolumeX,
  FileSpreadsheet,
  Settings,
  Sparkles,
  Layers,
  Printer,
  LogOut,
  Building
} from 'lucide-react';

interface OperationsAppProps {
  orders: CustomerOrder[];
  setOrders: React.Dispatch<React.SetStateAction<CustomerOrder[]>>;
  abandonedCarts: AbandonedCartRecord[];
  setAbandonedCarts: React.Dispatch<React.SetStateAction<AbandonedCartRecord[]>>;
  pricingConfig: PricingConfig;
  setPricingConfig: React.Dispatch<React.SetStateAction<PricingConfig>>;
}

export const OperationsApp: React.FC<OperationsAppProps> = ({
  orders,
  setOrders,
  abandonedCarts,
  setAbandonedCarts,
  pricingConfig,
  setPricingConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'kanban' | 'mtr_vault' | 'supplier_pos' | 'job_costing' | 'abandoned' | 'emails'>('kanban');
  const [audioEnabled, setAudioEnabled] = useState(chimeManager.isEnabled());
  const [selectedTravelerOrder, setSelectedTravelerOrder] = useState<CustomerOrder | null>(null);
  const [isQbModalOpen, setIsQbModalOpen] = useState(false);
  const [emailLogs, setEmailLogs] = useState<EmailNotificationRecord[]>(getEmailDispatchLogs());

  const handleToggleAudio = () => {
    const next = !audioEnabled;
    chimeManager.setEnabled(next);
    setAudioEnabled(next);
    if (next) chimeManager.playNewOrderChime();
  };

  // 1-Click Simulator Generator for Demo & Stress Testing
  const handleSimulateRandomOrder = () => {
    const client = pickRandom(INDUSTRIAL_TEST_CLIENTS);
    const npsOptions = ['2"', '3"', '4"', '6"', '8"', '10"', '12"'];
    const pClassOptions: (150 | 300 | 600)[] = [150, 300, 600];
    const matOptions: ('SA-516-70' | '304L' | '316L')[] = ['SA-516-70', '304L', '316L'];

    const chosenNps = pickRandom(npsOptions);
    const chosenClass = pickRandom(pClassOptions);
    const chosenMat = pickRandom(matOptions);
    const qty = randomInt(4, 35);

    const newSimulatedOrder: CustomerOrder = {
      orderId: \`PO-SIM-\${Math.floor(1000 + Math.random() * 9000)}\`,
      orderSource: 'Website B2B',
      createdAt: new Date().toLocaleString(),
      companyName: client.company,
      contactName: client.buyer,
      email: client.email,
      jobsiteAddress: client.jobsiteAddress,
      poNumber: \`\${client.poPrefix}-\${Math.floor(10000 + Math.random() * 90000)}\`,
      items: [
        {
          id: \`ITEM-\${Date.now()}\`,
          partNumber: \`PB\${chosenMat.replace('-', '')}-C\${chosenClass}T0105S\${chosenNps.replace('\"', '')}\`,
          nps: chosenNps,
          nominalSizeInches: 4,
          pressureClass: chosenClass,
          materialCode: chosenMat,
          materialName: chosenMat,
          facing: 'Flat Face (FF) - Standard (No Machining)',
          thickness: 0.1046,
          thicknessLabel: '12 Gauge (0.105")',
          od: 6.75,
          boltCircle: 7.5,
          boltSize: 0.625,
          actualWeightLbs: 5.2,
          adjustedWeightLbs: 7.3,
          unitPrice: chosenMat === '316L' ? 145 : 68,
          quantity: qty,
          handleStamp: \`ISO-\${client.company.split(' ')[0].toUpperCase()}-01\`,
          requireMTR: true,
          addTHadle: qty > 10,
          addLiftingLug: false,
          addPlateDog: false,
          addWedge: false,
        }
      ],
      subtotal: (chosenMat === '316L' ? 145 : 68) * qty,
      shippingCost: qty > 15 ? 245.0 : 45.0,
      hotShotFee: 0,
      totalAmount: (chosenMat === '316L' ? 145 : 68) * qty + (qty > 15 ? 245.0 : 45.0),
      totalWeightLbs: Math.round(5.2 * qty),
      shippingMethod: qty > 15 ? 'LTL Palletized Freight' : 'UPS Ground Parcel',
      isHotShot: false,
      isLargeOrder: qty > 20,
      leadTimeEstimate: '2-3 Business Days',
      paymentMethod: 'Net 30 Commercial PO',
      paymentStatus: 'Net 30 Authorized',
      status: 'queued',
      millHeatNumber: 'K49201-B',
      scheduledShipDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      carrierName: 'UPS Ground Express',
      trackingNumber: '',
    };

    setOrders([newSimulatedOrder, ...orders]);
    chimeManager.playNewOrderChime();
    triggerOrderEmailNotification(newSimulatedOrder);
    setEmailLogs(getEmailDispatchLogs());
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono">
      
      {/* Top Operations Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-7xl mx-auto">
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md">
              IPG
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                IRON PRAIRIE FABRICATION GROUP LLC
              </div>
              <div className="text-sm font-black text-slate-100">
                Desktop Operations &amp; ASME Section VIII Div 1 Platform
              </div>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleToggleAudio}
              className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all \${
                audioEnabled
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-800 bg-slate-950 text-slate-500'
              }\`}
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              <span>{audioEnabled ? 'Audio Chimes ON' : 'Muted'}</span>
            </button>

            <button
              onClick={() => setIsQbModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              <span>QuickBooks Export</span>
            </button>

            <button
              onClick={handleSimulateRandomOrder}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>+ Simulate Outage PO</span>
            </button>
          </div>

        </div>

        {/* Sub-Navigation Tabs */}
        <div className="max-w-7xl mx-auto pt-3 flex flex-wrap gap-2 border-t border-slate-800/80 mt-3">
          {[
            { key: 'kanban', label: '1. Production Kanban', icon: Flame },
            { key: 'mtr_vault', label: '2. ASME MTR Vault', icon: ShieldCheck },
            { key: 'supplier_pos', label: '3. Supplier Steel & Gas POs', icon: Truck },
            { key: 'job_costing', label: '4. Job Costing & Margins', icon: DollarSign },
            { key: 'abandoned', label: '5. Abandoned Cart Recovery', icon: ShoppingCart },
            { key: 'emails', label: '6. Email Notification Logs', icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={\`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all \${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }\`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Workspace Stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        {activeTab === 'kanban' && (
          <LaserCuttingKanban
            orders={orders}
            setOrders={setOrders}
            onOpenTraveler={(order) => setSelectedTravelerOrder(order)}
            onPreviewMtr={() => setActiveTab('mtr_vault')}
          />
        )}

        {activeTab === 'mtr_vault' && <AsmeMtrVault />}

        {activeTab === 'supplier_pos' && <SupplierPoGenerator />}

        {activeTab === 'job_costing' && (
          <JobCostingTracker orders={orders} pricingConfig={pricingConfig} />
        )}

        {activeTab === 'abandoned' && (
          <AbandonedCartRecovery
            abandonedCarts={abandonedCarts}
            setAbandonedCarts={setAbandonedCarts}
            orders={orders}
            setOrders={setOrders}
          />
        )}

        {activeTab === 'emails' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase text-slate-300">Order Dispatch Email Logs</h2>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 divide-y divide-slate-800 text-xs">
              {emailLogs.map((log, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-amber-400">{log.subject}</div>
                    <div className="text-[11px] text-slate-400">To: {log.recipients.map(r => r.email).join(', ')} &bull; {log.timestamp}</div>
                  </div>
                  <span className="text-emerald-400 font-bold">Dispatched</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Printable ASME QC Traveler Modal */}
      <AsmeQcTravelerModal
        order={selectedTravelerOrder}
        isOpen={Boolean(selectedTravelerOrder)}
        onClose={() => setSelectedTravelerOrder(null)}
      />

      {/* QuickBooks Integration Modal */}
      <QuickbooksExportModal
        orders={orders}
        isOpen={isQbModalOpen}
        onClose={() => setIsQbModalOpen(false)}
      />

    </div>
  );
};
`;

writeSrc('src/operations/OperationsApp.tsx', opsAppContent);

// ============================================================================
// 5. Windows Desktop Launcher: Iron-Prairie-Desktop-Ops.bat
// ============================================================================
const desktopBatContent = `@echo off
title Iron Prairie Operations & ASME MTR Platform
echo ========================================================================
echo   IRON PRAIRIE FABRICATION GROUP LLC - DESKTOP OPERATIONS PLATFORM
echo   ASME Section VIII Div 1 & ASME B16.48 Material Traceability Suite
echo ========================================================================
echo.
echo Launching Dedicated Desktop Operations App (Chrome App Mode)...

start "" "chrome.exe" --app=http://localhost:5173/operations --window-size=1920,1080

if %ERRORLEVEL% NEQ 0 (
  echo Chrome app mode launcher opening default browser...
  start http://localhost:5173/operations
)

echo Operations Platform Launched.
`;

writeSrc('Iron-Prairie-Desktop-Ops.bat', desktopBatContent);

console.log('✓ All Desktop Operations App Shell modules written successfully');

