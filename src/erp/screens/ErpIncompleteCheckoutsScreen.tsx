import React, { useMemo, useState } from 'react';
import { useErp } from '../context/ErpContext';
import {
  ShoppingCart,
  Phone,
  Mail,
  Building,
  RefreshCw,
  ArrowRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  X,
  DollarSign,
} from 'lucide-react';
import { StorefrontCheckoutRecord, StorefrontCheckoutStatus } from '../../types';

function statusLabel(status: StorefrontCheckoutStatus): string {
  if (status === 'cancelled') return 'Buyer Cancelled';
  if (status === 'expired') return 'Session Expired';
  if (status === 'open') return 'Checkout Started';
  return 'Completed';
}

function statusClass(status: StorefrontCheckoutStatus): string {
  if (status === 'cancelled') return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  if (status === 'expired') return 'bg-slate-800 text-slate-300 border-slate-600';
  if (status === 'open') return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
  return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
}

function formatWhen(value?: string | null): string {
  if (!value) return 'Unknown time';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
}

export const ErpIncompleteCheckoutsScreen: React.FC = () => {
  const {
    incompleteCheckouts,
    completedCheckouts,
    dismissedCheckoutIds,
    storefrontFeedError,
    storefrontFeedAuthRequired,
    refreshStorefrontFeed,
    convertIncompleteCheckout,
    dismissIncompleteCheckout,
    setActiveModuleId,
  } = useErp();

  const [filter, setFilter] = useState<'active' | 'all'>('active');
  const [selected, setSelected] = useState<StorefrontCheckoutRecord | null>(null);

  const visible = useMemo(() => {
    const rows = filter === 'all'
      ? incompleteCheckouts
      : incompleteCheckouts.filter((row) => !dismissedCheckoutIds.includes(row.orderRefId));
    return rows;
  }, [filter, incompleteCheckouts, dismissedCheckoutIds]);

  return (
    <div className="space-y-6 font-mono text-xs text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[11px]">
            <ShoppingCart className="h-4 w-4" />
            <span>Unfulfilled Storefront Checkouts</span>
          </div>
          <h1 className="text-xl font-black text-white">Incomplete Paddle Blind Orders</h1>
          <p className="text-[11px] text-slate-400 mt-1 max-w-2xl">
            Buyers who started a web order and left without paying. Use this list to call back, email a quote, or convert the cart into a shop follow-up job.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refreshStorefrontFeed()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh Feed
          </button>
        </div>
      </div>

      {storefrontFeedAuthRequired && (
        <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-200">
          Lock and sign back into ERP so live checkout tracking can load. Existing sessions created before this update do not carry the ops key.
        </div>
      )}
      {storefrontFeedError && (
        <div className="p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-200">
          {storefrontFeedError}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Open / Cancelled</div>
          <div className="text-2xl font-black text-amber-300">{visible.length}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Buyer Cancelled</div>
          <div className="text-2xl font-black text-white">{incompleteCheckouts.filter((row) => row.status === 'cancelled').length}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Still Open</div>
          <div className="text-2xl font-black text-cyan-300">{incompleteCheckouts.filter((row) => row.status === 'open').length}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-bold">Paid Completions</div>
          <div className="text-2xl font-black text-emerald-300">{completedCheckouts.length}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold ${filter === 'active' ? 'bg-amber-500/20 text-amber-200 border-amber-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
        >
          Needs Follow-up
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold ${filter === 'all' ? 'bg-amber-500/20 text-amber-200 border-amber-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
        >
          Include Dismissed
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-2.5">
          {visible.length === 0 && (
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 text-slate-400">
              No incomplete storefront checkouts in this view. When a buyer starts Stripe checkout and leaves, the cart appears here.
            </div>
          )}
          {visible.map((row) => {
            const isSelected = selected?.orderRefId === row.orderRefId;
            const itemSummary = row.cartItems.length
              ? row.cartItems.map((item) => `${item.quantity}x ${item.nps || ''} ${item.partNumber}`.trim()).join(', ')
              : 'Line items captured at Stripe / checkout start';
            return (
              <button
                key={row.orderRefId}
                type="button"
                onClick={() => setSelected(row)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  isSelected ? 'bg-slate-900 border-amber-500/70' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black text-slate-100">{row.companyName || row.buyerName || 'Unknown buyer'}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">{itemSummary}</div>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full border text-[10px] font-bold ${statusClass(row.status)}`}>
                    {statusLabel(row.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-900">
                  <span>Ref {row.orderRefId}</span>
                  <span className="text-amber-300 font-bold">${Number(row.totalAmount || 0).toFixed(2)}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-5">
          {selected ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] text-amber-400 uppercase font-bold">Follow-up Record</div>
                  <h2 className="text-base font-black text-white mt-1">{selected.companyName || selected.buyerName || 'Unknown buyer'}</h2>
                  <div className="text-[11px] text-slate-400">{formatWhen(selected.createdAt)}</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${statusClass(selected.status)}`}>
                  {statusLabel(selected.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 text-[11px] bg-slate-950 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center gap-2"><Building className="h-3.5 w-3.5 text-slate-500" /> {selected.buyerName || '—'}</div>
                <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-slate-500" /> {selected.buyerEmail || '—'}</div>
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-slate-500" /> {selected.buyerPhone || '—'}</div>
                <div className="flex items-center gap-2"><DollarSign className="h-3.5 w-3.5 text-slate-500" /> ${Number(selected.totalAmount || 0).toFixed(2)} · {selected.paymentType || 'unspecified'}</div>
                <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-slate-500" /> {selected.deliveryAddress || 'No ship-to captured yet'}</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-2">Configured Items</div>
                <div className="space-y-1.5">
                  {(selected.cartItems.length ? selected.cartItems : [{ partNumber: 'No line snapshot', quantity: 0 }]).map((item, index) => (
                    <div key={`${item.partNumber}-${index}`} className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
                      <span className="text-slate-200">{item.quantity}x {item.nps} {item.partNumber} {item.material}</span>
                      <span className="text-slate-400">${Number(item.lineTotal || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => {
                    convertIncompleteCheckout(selected);
                    setActiveModuleId('work_orders');
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black"
                >
                  Convert to Shop Job <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => dismissIncompleteCheckout(selected.orderRefId)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold"
                >
                  <X className="h-3.5 w-3.5" /> Dismiss
                </button>
                {selected.buyerEmail && (
                  <a
                    href={`mailto:${selected.buyerEmail}?subject=Iron Prairie quote follow-up ${selected.orderRefId}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold"
                  >
                    <Mail className="h-3.5 w-3.5" /> Email Buyer
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900 text-slate-400 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              Select a checkout to see buyer contact details and line items.
            </div>
          )}

          {completedCheckouts[0] && (
            <div className="mt-4 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-[11px] text-emerald-200 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              Latest paid storefront order: {completedCheckouts[0].companyName || completedCheckouts[0].buyerEmail} · ${Number(completedCheckouts[0].totalAmount || 0).toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
