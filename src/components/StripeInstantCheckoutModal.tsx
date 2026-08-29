import React, { useState } from 'react';
import { ConfiguredBlind, ShopJob } from '../types';
import { calculateShipping } from '../data/paddleBlindData';
import { initiateStripeCheckout, isStripeConfigured } from '../services/stripeService';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Building,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
  AlertTriangle,
  Info
} from 'lucide-react';

interface StripeInstantCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: ConfiguredBlind[];
  onOrderSubmitted: (newJob: ShopJob) => void;
  onViewShopBoard: () => void;
}

export const StripeInstantCheckoutModal: React.FC<StripeInstantCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderSubmitted,
  onViewShopBoard
}) => {
  const [paymentType, setPaymentType] = useState<'card' | 'ach' | 'all'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [submittedJob, setSubmittedJob] = useState<ShopJob | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  
  // Card Inputs (for in-modal input simulation)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardZip, setCardZip] = useState('');

  // ACH Inputs
  const [selectedBank, setSelectedBank] = useState('Chase');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  if (!isOpen) return null;

  const isLiveStripe = isStripeConfigured();
  const shippingInfo = calculateShipping(cartItems);
  const itemsSubtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalWeight = cartItems.reduce((sum, item) => sum + item.totalFinishedWeight, 0);
  const hasMTR = cartItems.some((item) => item.includeMTR);

  // 3.5% Credit Card Processing Surcharge Calculation
  const cardSurchargeRate = 0.035;
  const baseOrderTotal = itemsSubtotal + shippingInfo.cost;
  const cardSurchargeAmount = Math.round(baseOrderTotal * cardSurchargeRate * 100) / 100;
  
  const activeSurcharge = paymentType === 'card' ? cardSurchargeAmount : 0;
  const finalTotalAmount = Math.round((baseOrderTotal + activeSurcharge) * 100) / 100;

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!buyerEmail.trim() || !buyerName.trim()) {
      setErrorMessage('Please provide your contact name and work email.');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await initiateStripeCheckout({
        cartItems,
        buyerEmail: buyerEmail.trim(),
        buyerName: buyerName.trim(),
        buyerPhone: buyerPhone.trim(),
        companyName: companyName.trim(),
        deliveryAddress: deliveryAddress.trim(),
        paymentType,
        shippingCost: shippingInfo.cost,
        shippingMethod: shippingInfo.method,
        hasMTR
      });

      if (result.success) {
        if (result.redirectUrl) {
          // Directing to Stripe Hosted Session
          return;
        } else if (result.job) {
          onOrderSubmitted(result.job);
          setSubmittedJob(result.job);
        }
      } else if (result.error) {
        setErrorMessage(result.error);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to process checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative flex max-h-[94vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100">
                  Instant E-Commerce Checkout
                </h3>
                <span className="rounded bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono text-[10px] font-bold px-2 py-0.5 flex items-center gap-1">
                  <span>STRIPE ENGINE</span>
                  {isLiveStripe ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ) : (
                    <span className="text-[9px] text-amber-400">(SANDBOX READY)</span>
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Direct CNC Plasma Dispatch &bull; 256-Bit Encrypted &bull; Instant Commercial Settlement
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
            /* Paid Success Screen */
            <div className="space-y-6 text-center py-6 animate-fadeIn">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <span className="rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs px-3 py-1 font-bold border border-emerald-500/40">
                  PAYMENT CONFIRMED • PAID IN FULL
                </span>
                <h4 className="text-2xl font-black text-slate-100 mt-2">Order Queued on Plasma Table!</h4>
                <p className="mt-1 text-sm text-slate-300">
                  Receipt sent to <strong className="text-amber-400 font-mono">{submittedJob.buyerEmail}</strong>. Reference: <strong className="font-mono text-slate-200">{submittedJob.poNumber}</strong>
                </p>
              </div>

              {/* Summary Card */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-left font-mono text-xs space-y-2 max-w-lg mx-auto">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Customer:</span>
                  <span className="font-bold text-slate-100">{submittedJob.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Total Items:</span>
                  <span className="font-bold text-amber-400">{submittedJob.items.reduce((s, i) => s + i.quantity, 0)} Units ({submittedJob.totalWeightLbs} lbs)</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Payment Engine:</span>
                  <span className="font-bold text-indigo-400">Stripe ({paymentType === 'card' ? 'Card / Apple Pay (+3.5% Surcharge)' : 'ACH Direct Debit (0% Surcharge)'})</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">ASME MTR Traveler:</span>
                  <span className="font-bold text-emerald-400">{submittedJob.mtrRequired ? 'Certified Stamped Heat #' : 'Commercial Spec'}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm">
                  <span className="text-slate-300 font-sans font-bold">Total Paid:</span>
                  <span className="font-bold text-emerald-400">${submittedJob.totalAmount.toFixed(2)} USD</span>
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
            /* Checkout Form */
            <form onSubmit={handlePaySubmit} className="space-y-4">
              {errorMessage && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-300 flex items-center gap-2">
                  <Info className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Order quick overview */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Items in Order:</span>
                  <span className="font-mono font-bold text-amber-400">
                    {cartItems.reduce((s, i) => s + i.quantity, 0)} units ({totalWeight.toFixed(1)} lbs)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Freight &amp; Handling:</span>
                  <span className="font-mono text-slate-200">
                    {shippingInfo.method} (${shippingInfo.cost.toFixed(2)})
                  </span>
                </div>

                {/* Surcharge Line Item */}
                {paymentType === 'card' ? (
                  <div className="flex items-center justify-between text-xs text-rose-400 font-semibold">
                    <span>Credit Card Processing Surcharge (3.5%):</span>
                    <span className="font-mono">+${cardSurchargeAmount.toFixed(2)}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                    <span>Stripe ACH Bank Pay Surcharge (0%):</span>
                    <span className="font-mono text-emerald-400">$0.00 (Zero Fee)</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm font-bold mt-2 pt-2 border-t border-slate-800">
                  <span className="text-slate-200">Total Due Today:</span>
                  <span className="font-mono text-emerald-400 text-base">${finalTotalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div>
                <label className="block text-slate-300 font-semibold text-xs mb-1.5 uppercase tracking-wider">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentType('card')}
                    className={`relative flex flex-col items-center justify-center gap-1 rounded-xl p-3 text-xs font-bold transition-all border ${
                      paymentType === 'card'
                        ? 'border-rose-500 bg-rose-500/15 text-rose-300 ring-1 ring-rose-500 shadow-md'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4" />
                      <span>Credit Card / Apple Pay</span>
                    </div>
                    <span className="text-[10px] text-rose-400 font-mono font-semibold">+3.5% Surcharge</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType('ach')}
                    className={`relative flex flex-col items-center justify-center gap-1 rounded-xl p-3 text-xs font-bold transition-all border ${
                      paymentType === 'ach'
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500 shadow-md'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Building className="h-4 w-4 text-emerald-400" />
                      <span>Stripe ACH Bank Pay</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono font-semibold">0% Surcharge (SAVE 3.5%)</span>
                    <span className="absolute -top-2 right-2 rounded-full bg-emerald-500 text-[9px] font-black text-slate-950 px-2 py-0.5 shadow">
                      RECOMMENDED
                    </span>
                  </button>
                </div>
              </div>

              {/* DYNAMIC SURCHARGE WARNING OR SAVINGS BANNER */}
              {paymentType === 'card' ? (
                <div className="rounded-xl border-2 border-amber-500/60 bg-amber-950/40 p-3.5 text-xs text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg animate-fadeIn">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300 text-sm block font-black">
                        3.5% Credit Card Processing Surcharge Applied (+${cardSurchargeAmount.toFixed(2)})
                      </strong>
                      <span className="text-slate-300 text-[11px] leading-relaxed block mt-0.5">
                        Credit/debit card transactions include a standard 3.5% processing fee. You can avoid this entire fee by paying via direct bank debit.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPaymentType('ach')}
                    className="shrink-0 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <Sparkles className="h-4 w-4 text-slate-950" />
                    <span>Switch to ACH &amp; Save ${cardSurchargeAmount.toFixed(2)}</span>
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/30 p-3.5 text-xs text-emerald-300 flex items-center justify-between shadow animate-fadeIn">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                    <div>
                      <strong className="text-emerald-200 font-bold block">
                        ✓ 0% Processing Surcharge Applied (Saved ${cardSurchargeAmount.toFixed(2)}!)
                      </strong>
                      <span className="text-slate-300 text-[11px]">
                        Direct bank connection via Stripe Plaid with \$5 flat capped fee.
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold px-2.5 py-1 border border-emerald-500/40">
                    ZERO SURCHARGE
                  </span>
                </div>
              )}

              {/* Contact / Delivery info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Contact / Buyer Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. John Miller"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Work Email (For Receipt &amp; MTR) <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="e.g. jmiller@turnaround.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Contact Phone Number <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="e.g. (979) 417-6489"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Gulf Coast Industrial"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Delivery Gate / Jobsite Address
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. Texas Facility, Gate 4"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Payment Input Section */}
              {paymentType === 'card' ? (
                /* Card Input Mock Elements */
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Credit or Debit Card Details</span>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">VISA</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">MC</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">AMEX</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">APPLE PAY</span>
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 •••• •••• 4242"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      placeholder="MM / YY"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="CVC / CVV"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={cardZip}
                      onChange={(e) => setCardZip(e.target.value)}
                      placeholder="Billing ZIP"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                /* ACH Bank Transfer Elements */
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">Stripe Instant Bank Connection (Plaid / ACH)</span>
                    <span className="text-[10px] font-mono text-emerald-400">$5 Flat Capped Fee</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {['Chase', 'Bank of America', 'Wells Fargo', 'Frost Bank', 'PNC', 'Other Bank'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`rounded-lg p-2 text-center border font-medium transition-all ${
                          selectedBank === bank
                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold'
                            : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <input
                      type="text"
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value)}
                      placeholder="Bank Routing # (9 digits)"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Account Number"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 text-sm font-black text-slate-950 hover:bg-emerald-400 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                      <span>Authorizing Stripe Transaction...</span>
                    </div>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>Pay ${finalTotalAmount.toFixed(2)} &amp; Dispatch to CNC Plasma Queue</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>256-Bit SSL Encrypted</span>
                  </span>
                  <span>&bull;</span>
                  <span>Instant Commercial Bank Settlement</span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
