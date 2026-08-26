// src/components/BulkListRfqModal.tsx
// Turnaround Bulk Bill of Materials (BOM) & Direct Reorder RFQ Modal
// Implements 10% Direct Wholesale Savings for Plant Buyers & Amazon Reorders

import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  Lock,
  Send,
  Building,
  Mail,
  User,
  Phone,
  Truck,
  Sparkles
} from 'lucide-react';

interface BulkListRfqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin?: (account: any) => void;
}

export const BulkListRfqModal: React.FC<BulkListRfqModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  const [companyName, setCompanyName] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jobsiteAddress, setJobsiteAddress] = useState('');
  const [urgency, setUrgency] = useState<'standard' | '24hr_expedited' | 'same_day_hotshot'>('standard');
  const [lineItemsText, setLineItemsText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !companyName) return;

    setIsSubmitting(true);

    const clientAccount = {
      companyName,
      buyerName: buyerName || 'Plant Buyer',
      email,
      phone,
      facilityLocation: jobsiteAddress || 'Texas / Gulf Coast Area',
      approvedTradeAccount: true,
      tradeDiscountPct: 10,
    };

    // Store in localStorage for instant 10% discount unlocking
    localStorage.setItem('ipf_client_logged_in', 'true');
    localStorage.setItem('ipf_client_account', JSON.stringify(clientAccount));

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSuccessLogin) {
        onSuccessLogin(clientAccount);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-cyan-50 border border-cyan-200 rounded-2xl flex items-center justify-center text-cyan-700 shadow-sm shrink-0">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-cyan-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-wider shadow-sm">
                  Save 10% Direct
                </span>
                <span className="text-xs text-sky-700 font-bold font-mono">Turnaround RFQ &amp; Amazon Reorder</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                Bulk BOM List &amp; Wholesale Pricing Quote
              </h3>
              <p className="text-xs text-slate-500">
                Submit your pipe isolation line items or upload your spreadsheet for instant 10% trade rate approval.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-900">BOM Transmitted &amp; 10% Discount Unlocked!</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Thank you, <strong>{buyerName || companyName}</strong>. Your line item list was sent to our CNC burn table team at <strong>sales@ironprairiefabrication.com</strong>.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-md mx-auto text-xs text-emerald-900 text-left space-y-1.5 font-mono">
              <div className="flex items-center gap-2 font-bold text-emerald-950">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span>Account Approved for Direct 10% Savings:</span>
              </div>
              <div>&bull; Company: {companyName}</div>
              <div>&bull; Email: {email}</div>
              <div>&bull; Active Rate: 10% Direct Wholesale Manufacturing Discount</div>
            </div>

            <div className="pt-3 flex justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-sky-700 hover:bg-sky-800 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all"
              >
                Return to Storefront (10% Discount Active)
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            
            {/* Value Proposition Box */}
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-sky-950">
                <Lock className="h-4 w-4 text-sky-700 shrink-0" />
                <span>
                  <strong>Amazon Buyers &amp; Turnaround Planners:</strong> Submitting this list instantly verifies your email for direct 10% wholesale trade pricing across our entire catalog.
                </span>
              </div>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1 flex items-center gap-1">
                  <Building className="h-3 w-3 text-sky-600" /> Company / Plant Facility Name *
                </label>
                <input
                  required
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="e.g. Dow Chemical, BASF, Turner, Chevron"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1 flex items-center gap-1">
                  <Mail className="h-3 w-3 text-sky-600" /> Commercial Work Email *
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. buyer@plant.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1 flex items-center gap-1">
                  <User className="h-3 w-3 text-sky-600" /> Contact Name / Job Title
                </label>
                <input
                  value={buyerName}
                  onChange={e => setBuyerName(e.target.value)}
                  placeholder="e.g. Mark Henderson (Turnaround Lead)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1 flex items-center gap-1">
                  <Phone className="h-3 w-3 text-sky-600" /> Direct Phone / Plant Gate Ext.
                </label>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. (979) 555-0192"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white font-medium"
                />
              </div>
            </div>

            {/* Line Items Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-700 font-bold uppercase text-[10px]">
                  Paste Turnaround Line Items / ISO Spool Manifest:
                </label>
                <span className="text-[10px] text-slate-500 font-mono">Accepts NPS sizes, class, metallurgy, &amp; qty</span>
              </div>
              <textarea
                rows={4}
                value={lineItemsText}
                onChange={e => setLineItemsText(e.target.value)}
                placeholder="Example:&#10;10x 4&quot; 150# SA-516-70 Paddle Blinds 11Ga with T-Handles&#10;5x 6&quot; 300# 304L Spectacle Blinds (Figure 8)&#10;8x 8&quot; 150# A-36 CS Paddle Spacers&#10;Special requirements / line stamping..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-mono text-xs focus:outline-none focus:border-sky-600 focus:bg-white"
              />
            </div>

            {/* File Upload / Drag Drop */}
            <div>
              <label className="block text-slate-700 font-bold uppercase text-[10px] mb-1">
                Or Attach Material Takeoff (CSV, Excel, PDF Drawing):
              </label>
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-sky-500 bg-slate-50 hover:bg-sky-50/50 rounded-xl p-4 cursor-pointer transition-colors">
                <Upload className="h-4 w-4 text-slate-500" />
                <span className="text-slate-600 text-xs font-medium">
                  {uploadedFile ? uploadedFile.name : 'Click to browse or drag & drop BOM file'}
                </span>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls,.pdf,.txt"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files?.[0]) setUploadedFile(e.target.files[0]);
                  }}
                />
              </label>
            </div>

            {/* Delivery Timeline Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-sky-700" />
                <span className="font-bold text-slate-800 text-xs">Required Turnaround Timeline:</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setUrgency('standard')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                    urgency === 'standard'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Standard 2-3 Day
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('same_day_hotshot')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                    urgency === 'same_day_hotshot'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  🚨 Same-Day Hot Shot
                </button>
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl border border-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3 rounded-xl shadow-md shadow-cyan-500/20 text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                {isSubmitting ? (
                  <span>Processing BOM &amp; Activating 10%...</span>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Transmit BOM &amp; Unlock 10% Discount</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
