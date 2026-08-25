// src/operations/components/AbandonedCartRecovery.tsx
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
      orderId: `PO-REC-${Math.floor(1000 + Math.random() * 9000)}`,
      orderSource: 'Direct PO',
      createdAt: new Date().toLocaleString(),
      companyName: cart.companyName,
      contactName: cart.buyerName,
      email: cart.email,
      jobsiteAddress: cart.facilityLocation || 'Texas Petrochemical Complex, TX',
      poNumber: `PO-RECOVERED-${Date.now().toString().slice(-4)}`,
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
              ${totalRecoveredValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
          <div className="text-slate-400 text-[10px] font-bold uppercase">Unconverted Pipeline Value</div>
          <div className="text-xl font-black text-amber-400 mt-1">${totalAbandonedValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{abandonedCarts.filter(c => c.status !== 'Recovered').length} Open RFQs</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
          <div className="text-slate-400 text-[10px] font-bold uppercase">Total Recovered Sales</div>
          <div className="text-xl font-black text-emerald-400 mt-1">${totalRecoveredValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
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
              className={`p-5 rounded-2xl border bg-slate-900 shadow-lg space-y-3 transition-all ${
                isRecovered ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{cart.companyName}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isRecovered ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {cart.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Buyer: <strong className="text-slate-300">{cart.buyerName}</strong> &bull; {cart.email} &bull; {cart.phone}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-emerald-400">${cart.totalAmount.toLocaleString()}</div>
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
                      <span className="text-slate-200 font-bold">${(it.unitPrice * it.quantity).toLocaleString()}</span>
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
