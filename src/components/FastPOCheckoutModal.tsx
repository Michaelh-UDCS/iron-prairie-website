import React, { useState } from 'react';
import { ConfiguredBlind, ShopJob } from '../types';
import { calculateShipping } from '../data/paddleBlindData';
import { X, CheckCircle2, ShieldCheck, Truck, Building2, User, Mail, MapPin, FileCheck2, ArrowRight } from 'lucide-react';

interface FastPOCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: ConfiguredBlind[];
  onOrderSubmitted: (newJob: ShopJob) => void;
  onViewShopBoard: () => void;
}

export const FastPOCheckoutModal: React.FC<FastPOCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderSubmitted,
  onViewShopBoard
}) => {
  const [companyName, setCompanyName] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [poNumber, setPoNumber] = useState(`PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [paymentTerms, setPaymentTerms] = useState('Net 30 Commercial Account');
  const [specialNotes, setSpecialNotes] = useState('');
  const [submittedJob, setSubmittedJob] = useState<ShopJob | null>(null);

  if (!isOpen) return null;

  const shippingInfo = calculateShipping(cartItems);
  const itemsSubtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalAmount = itemsSubtotal + shippingInfo.cost;
  const totalWeight = cartItems.reduce((sum, item) => sum + item.totalFinishedWeight, 0);
  const hasMTR = cartItems.some((item) => item.includeMTR);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !buyerEmail.trim()) {
      alert('Please enter your Company Name and Work Email.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const shipDateStr = tomorrow.toISOString().split('T')[0];

    const newJob: ShopJob = {
      id: `job-${Date.now()}`,
      poNumber: poNumber.trim() || `PO-ONLINE-${Date.now().toString().slice(-4)}`,
      customerName: companyName.trim(),
      buyerEmail: buyerEmail.trim(),
      deliveryAddress: deliveryAddress.trim() || 'Direct Facility Receiving',
      orderDate: todayStr,
      scheduledShipDate: shipDateStr,
      status: 'queued',
      items: [...cartItems],
      millHeatNumber: 'A516-HEAT-' + Math.floor(1000 + Math.random() * 9000),
      heatCertNumber: hasMTR ? `MTR-TX-${Date.now().toString().slice(-5)}` : undefined,
      carrier: shippingInfo.isLTL ? 'LTL Freight' : 'UPS Ground',
      totalWeightLbs: Math.round(totalWeight * 10) / 10,
      totalAmount: Math.round(totalAmount * 100) / 100,
      mtrRequired: hasMTR,
      notes: specialNotes.trim() ? `${paymentTerms} | ${specialNotes.trim()}` : paymentTerms
    };

    onOrderSubmitted(newJob);
    setSubmittedJob(newJob);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                1-Click Industrial Purchase Order Checkout
              </h3>
              <p className="text-xs text-slate-400">
                Direct CNC Plasma Table dispatch &bull; Same-Day Turnaround Processing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {submittedJob ? (
            /* Confirmation State */
            <div className="space-y-6 text-center py-6 animate-fadeIn">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <h4 className="text-2xl font-black text-slate-100">Purchase Order Dispatched!</h4>
                <p className="mt-1 text-sm text-slate-300">
                  Your order <strong className="font-mono text-amber-400">{submittedJob.poNumber}</strong> has been transmitted straight to the <strong>Iron Prairie Plasma Table Queue</strong>.
                </p>
              </div>

              {/* Summary Card */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-left font-mono text-xs space-y-2 max-w-lg mx-auto">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Account:</span>
                  <span className="font-bold text-slate-100">{submittedJob.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Items Ordered:</span>
                  <span className="font-bold text-amber-400">{submittedJob.items.reduce((s, i) => s + i.quantity, 0)} Paddle Blinds</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Total Scale Weight:</span>
                  <span className="font-bold text-slate-100">{submittedJob.totalWeightLbs} lbs ({submittedJob.carrier})</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">MTR Packet Status:</span>
                  <span className="font-bold text-emerald-400">{submittedJob.mtrRequired ? 'Certified Heat Stamped + PDF' : 'Standard Hydrotest'}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm">
                  <span className="text-slate-300 font-sans font-bold">Total Invoiced:</span>
                  <span className="font-bold text-emerald-400">${submittedJob.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onViewShopBoard();
                  }}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-lg active:scale-95"
                >
                  <span>Track Live on Shop Floor Whiteboard</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Order Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Order quick overview */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Blinds in Order:</span>
                  <span className="font-mono font-bold text-amber-400">
                    {cartItems.reduce((s, i) => s + i.quantity, 0)} units ({totalWeight.toFixed(1)} lbs)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-slate-400">Estimated Dispatch Freight:</span>
                  <span className="font-mono text-slate-200">
                    {shippingInfo.method} (${shippingInfo.cost.toFixed(2)})
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold mt-2 pt-2 border-t border-slate-800">
                  <span className="text-slate-200">Total Purchase Order Value:</span>
                  <span className="font-mono text-emerald-400 text-base">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Company / Facility Name <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Dow Chemical Freeport"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    PO # / Work Order Ref <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    placeholder="e.g. PO-2026-8849"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-amber-300 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Buyer / Contact Person
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="e.g. Mike Henderson"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Commercial Work Email <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="e.g. buyer@plant.com"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">
                  Delivery Destination / Gate Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. 2301 N Brazosport Blvd, Gate 4 Receiving, Freeport, TX 77541"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Invoicing &amp; Payment Terms
                  </label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Net 30 Commercial Account">Net 30 Commercial Account (Standard)</option>
                    <option value="Credit Card / P-Card on File">Credit Card / P-Card on File</option>
                    <option value="Direct ACH / Wire Transfer">Direct ACH / Wire Transfer</option>
                    <option value="Pre-approved Public Procurement Voucher">Pre-approved Public Procurement Voucher</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Turnaround / Rush Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Tag UNIT-4-ISO urgent morning delivery"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-lg active:scale-95"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Submit Purchase Order &amp; Dispatch to Plasma Table</span>
                </button>
                <p className="mt-2 text-center text-[11px] text-slate-400">
                  Instant Shop Routing &bull; Physical MTR Heat Stamping &bull; ASME B16.48 Guaranteed
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
