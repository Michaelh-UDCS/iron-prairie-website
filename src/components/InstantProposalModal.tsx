import React, { useState } from 'react';
import {
  X,
  FileText,
  ShieldCheck,
  Printer,
  Mail,
  Building,
  User,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Flame,
  Download,
  Clock,
  Sparkles,
  Phone
} from 'lucide-react';
import {
  ProposalPayload,
  triggerProposalEmailNotification,
  IPG_SALES_EMAIL
} from '../services/emailService';
import brandLogo from '../../Logo.jpg';

interface InstantProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
  onConfirmOrderAsPO?: (poOrderData: any) => void;
}

export const InstantProposalModal: React.FC<InstantProposalModalProps> = ({
  isOpen,
  onClose,
  items,
  onConfirmOrderAsPO,
}) => {
  const [buyerName, setBuyerName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobsiteAddress, setJobsiteAddress] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isHotShot, setIsHotShot] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<ProposalPayload | null>(null);
  const [isPoDispatched, setIsPoDispatched] = useState(false);
  const [poNumberInput, setPoNumberInput] = useState('');

  if (!isOpen) return null;

  // Calculate items summary
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const totalWeight = Math.round(items.reduce((sum, item) => sum + ((item.actualWeightLbs || item.finishedWeightPerUnit || 1) * item.quantity), 0) * 10) / 10;
  const isLTL = totalWeight >= 150 || items.some(item => (item.nominalSizeInches || 0) >= 14);
  const shippingCost = isLTL ? 245.00 : Math.round((12.00 + totalWeight * 1.45) * 100) / 100;
  const hotShotFee = isHotShot ? 250.00 : 0;
  const totalAmount = subtotal + shippingCost + hotShotFee;

  const handleGenerateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !companyName.trim() || !buyerName.trim()) {
      alert('Please enter your Name, Company, and Work Email.');
      return;
    }

    setIsGenerating(true);

    const today = new Date();
    const expiry = new Date(today);
    expiry.setDate(expiry.getDate() + 30);

    const proposalId = `IPF-PROP-${today.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = today.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    const expiresAt = expiry.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

    const newProposal: ProposalPayload = {
      proposalId,
      createdAt,
      expiresAt,
      companyName: companyName.trim(),
      buyerName: buyerName.trim(),
      email: email.trim(),
      jobsiteAddress: jobsiteAddress.trim() || 'Direct Plant Receiving / Gate',
      items: [...items],
      subtotal,
      shippingCost,
      hotShotFee,
      totalAmount,
      totalWeightLbs: totalWeight,
      shippingMethod: isHotShot ? 'Emergency Hot Shot Courier' : isLTL ? 'Palletized LTL Freight' : 'UPS Ground Parcel',
      isHotShot,
      leadTimeEstimate: isHotShot ? '🔥 2-4 Hr Emergency Burn & Dispatch' : '⚡ Next-Day In-Stock Plate Dispatch',
      notes: specialNotes.trim()
    };

    setGeneratedProposal(newProposal);
    setPoNumberInput(`PO-${today.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);

    // Dispatch background notification to Client and IPG Sales Team
    await triggerProposalEmailNotification(newProposal);

    setIsGenerating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmPO = () => {
    if (!generatedProposal) return;
    if (onConfirmOrderAsPO) {
      onConfirmOrderAsPO({
        orderId: generatedProposal.proposalId.replace('IPF-PROP', 'PO'),
        poNumber: poNumberInput.trim() || `PO-${Date.now().toString().slice(-4)}`,
        companyName: generatedProposal.companyName,
        contactName: generatedProposal.buyerName,
        email: generatedProposal.email,
        jobsiteAddress: generatedProposal.jobsiteAddress,
        items: generatedProposal.items,
        subtotal: generatedProposal.subtotal,
        shippingCost: generatedProposal.shippingCost,
        hotShotFee: generatedProposal.hotShotFee,
        totalAmount: generatedProposal.totalAmount,
        totalWeightLbs: generatedProposal.totalWeightLbs,
        shippingMethod: generatedProposal.shippingMethod,
        isHotShot: generatedProposal.isHotShot,
        leadTimeEstimate: generatedProposal.leadTimeEstimate,
        paymentMethod: 'Net 30 Commercial Account',
        paymentStatus: 'Net 30 Authorized'
      });
    }
    setIsPoDispatched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative flex max-h-[94vh] w-full max-w-3xl flex-col rounded-3xl border border-slate-700 bg-white text-slate-900 shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 text-white px-6 py-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {generatedProposal ? `Official Proposal #${generatedProposal.proposalId}` : 'Generate Instant Official Proposal'}
              </h3>
              <p className="text-xs text-slate-300">
                {generatedProposal ? '30-Day Guaranteed Price Lock &bull; Sent from Sales@ironprairiefabrication.com' : 'ASME B16.48 Precision Plasma Cutting &bull; Texas Facility'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {!generatedProposal ? (
            /* STEP 1: EMAIL & CONTACT GATE (Protects Pricing from Scrapers) */
            <div className="space-y-6">
              
              {/* Order Scope Snapshot */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Proposal Scope:</span>
                  <span className="bg-sky-100 text-sky-800 font-mono font-bold text-xs px-2.5 py-0.5 rounded-full">
                    {items.reduce((sum, item) => sum + item.quantity, 0)} Units ({totalWeight} Scale Lbs)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-600">
                  {items.map((item, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-lg p-2.5 flex justify-between">
                      <span>{item.quantity}x {item.nps} {item.pressureClass}# {item.materialCode || item.material}</span>
                      <span className="text-slate-400 font-sans">{item.thicknessLabel || '11 Ga'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Turnaround Lead Time & Hot Shot Toggle */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isHotShot ? 'bg-rose-50 border-rose-300' : 'bg-slate-50 border-slate-200'
              }`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isHotShot}
                    onChange={e => setIsHotShot(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-900 flex items-center gap-1.5 uppercase">
                        <Flame className="h-4 w-4 text-rose-600" /> Need Same-Day Emergency Hot Shot Courier Dispatch?
                      </span>
                      <span className="font-mono text-rose-700">+$250.00</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Direct truck courier (e.g. Champion Logistics) dispatched straight to your plant gate upon plasma cut completion.
                    </p>
                  </div>
                </label>
              </div>

              {/* Contact Information Form */}
              <form onSubmit={handleGenerateProposal} className="space-y-4">
                <div className="text-xs text-slate-600 border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-800 uppercase tracking-wider block mb-1">
                    Enter Your Work Credentials for Instant Proposal:
                  </span>
                  Your proposal with itemized pricing, freight, and MTR certification terms will be generated on-screen and emailed to you from <strong>{IPG_SALES_EMAIL}</strong>.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Your Name / Estimator <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={buyerName}
                        onChange={e => setBuyerName(e.target.value)}
                        placeholder="e.g. Mark Henderson"
                        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Commercial Work Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="e.g. m.henderson@plant.com"
                        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Company / Plant Facility <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        placeholder="e.g. Dow Chemical / Plant Site"
                        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Delivery Address / Plant Gate
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={jobsiteAddress}
                        onChange={e => setJobsiteAddress(e.target.value)}
                        placeholder="e.g. Gate 4 Receiving, TX 77531"
                        className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-700 font-semibold mb-1">
                    Special Turnaround / Tag Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={e => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Unit 4 shutdown outage, tag line ISO-P104"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-amber-500 py-3.5 text-sm font-black text-slate-950 hover:bg-amber-400 transition-all shadow-lg active:scale-98 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <span>Generating Formal Proposal &amp; Emailing...</span>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Generate &amp; Email Official Proposal Now</span>
                      </>
                    )}
                  </button>
                  <div className="mt-2 flex items-center justify-center gap-4 text-[11px] text-slate-500 text-center">
                    <span>🔒 Anti-Scrape Pricing Protection</span>
                    <span>⚡ 30-Day Guaranteed Price Lock</span>
                    <span>🛡️ ASME B16.48 Compliant</span>
                  </div>
                </div>
              </form>

            </div>
          ) : isPoDispatched ? (
            /* CONFIRMED PO DISPATCH STATE */
            <div className="py-8 text-center space-y-5 animate-fadeIn">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 border-2 border-emerald-500">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div>
                <h4 className="text-2xl font-black text-slate-900">Purchase Order Dispatched!</h4>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Your order <strong className="font-mono text-sky-800">{poNumberInput}</strong> has been transmitted straight to the <strong>Iron Prairie Plasma Table Queue</strong>.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono max-w-md mx-auto space-y-1.5 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500">Facility:</span>
                  <span className="font-bold text-slate-900">{generatedProposal.companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Items:</span>
                  <span className="font-bold text-sky-800">{generatedProposal.items.reduce((s, i) => s + i.quantity, 0)} Blinds ({generatedProposal.totalWeightLbs} lbs)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Invoiced Amount:</span>
                  <span className="font-bold text-emerald-700 text-sm">${generatedProposal.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-all"
                >
                  Close &amp; Return to Storefront
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: COMPLETE OFFICIAL FORMAL PROPOSAL (LETTERHEAD & PDF VIEW) */
            <div className="space-y-6 animate-fadeIn print:space-y-4">
              
              {/* Proposal Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between text-xs print:hidden">
                <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Proposal Generated &amp; Dispatched from {IPG_SALES_EMAIL} to {generatedProposal.email}</span>
                </div>
                <span className="font-mono text-emerald-700 font-bold">30-Day Price Lock Active</span>
              </div>

              {/* Printable Official Letterhead Proposal */}
              <div className="border border-slate-200 rounded-3xl p-6 sm:p-8 bg-white shadow-sm space-y-6 print:border-none print:p-0 print:shadow-none">
                
                {/* Letterhead Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-slate-900 pb-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={brandLogo}
                      alt="Iron Prairie Fabrication Group LLC"
                      className="h-14 w-auto rounded border border-slate-200 p-0.5"
                    />
                    <div>
                      <h1 className="text-lg sm:text-xl font-black text-slate-950 font-display uppercase tracking-tight">
                        Iron Prairie Fabrication Group LLC
                      </h1>
                      <div className="text-xs text-slate-600 font-medium">
                        ASME B16.48 Paddle Blinds &bull; Precision CNC Plasma Cutting &bull; Certified Woman-Owned
                      </div>
                      <div className="text-xs text-slate-500">
                        Texas Facility &bull; Phone: (979) 248-9266 &bull; {IPG_SALES_EMAIL}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-slate-400 uppercase">Official Proposal #</div>
                    <div className="text-base sm:text-lg font-black font-mono text-sky-800">{generatedProposal.proposalId}</div>
                    <div className="text-xs text-slate-500 font-mono">Date: {generatedProposal.createdAt}</div>
                    <div className="text-xs font-bold text-emerald-700 font-mono">Valid To: {generatedProposal.expiresAt}</div>
                  </div>
                </div>

                {/* Prepared For Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Client &amp; Estimator:</span>
                    <div className="font-bold text-slate-900 text-sm">{generatedProposal.companyName}</div>
                    <div className="text-slate-700">{generatedProposal.buyerName}</div>
                    <div className="text-sky-700 font-mono">{generatedProposal.email}</div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Logistics &amp; Terms:</span>
                    <div className="text-slate-900 font-bold">{generatedProposal.shippingMethod}</div>
                    <div className="text-slate-600 truncate">{generatedProposal.jobsiteAddress}</div>
                    <div className="text-emerald-700 font-bold">Terms: Net 30 / P-Card / Direct ACH</div>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 text-[11px] font-sans uppercase">
                        <th className="py-2.5 px-3 font-bold">Item</th>
                        <th className="py-2.5 px-3 font-bold">NPS &amp; Class</th>
                        <th className="py-2.5 px-3 font-bold">Metallurgy Spec</th>
                        <th className="py-2.5 px-3 font-bold">Thickness</th>
                        <th className="py-2.5 px-3 font-bold">Scale Wt</th>
                        <th className="py-2.5 px-3 font-bold">Handle Stamp</th>
                        <th className="py-2.5 px-2 text-center font-bold">Qty</th>
                        <th className="py-2.5 px-3 text-right font-bold">Unit Rate</th>
                        <th className="py-2.5 px-3 text-right font-bold">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {generatedProposal.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-900">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-bold text-sky-800">
                            <div>{item.nps} {item.pressureClass}#</div>
                            {item.blindType === 'Figure 8 (Spectacle Blind)' && (
                              <div className="text-[10px] text-amber-700 font-sans font-bold">♾️ Figure 8 Spectacle</div>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700">{item.materialCode || item.material}</td>
                          <td className="py-2.5 px-3 text-slate-800">
                            <div>{item.thicknessLabel || '11 Ga (0.120")'}</div>
                            {item.addTHadle && <span className="text-[9px] bg-sky-100 text-sky-800 px-1 rounded mr-1">T-Handle</span>}
                            {item.addLockoutHole && <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded">3/8" Lockout</span>}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700">{(item.actualWeightLbs || item.finishedWeightPerUnit || 1)} lbs</td>
                          <td className="py-2.5 px-3 text-slate-600">{item.handleStamp || 'STD'}</td>
                          <td className="py-2.5 px-2 text-center font-bold text-slate-900">{item.quantity}</td>
                          <td className="py-2.5 px-3 text-right text-slate-800">${(item.unitPrice || 0).toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900">${((item.unitPrice || 0) * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Financial Summary */}
                <div className="border-t-2 border-slate-200 pt-4 flex flex-col md:flex-row justify-between items-start gap-4 text-xs font-mono">
                  <div className="max-w-md text-slate-500 font-sans space-y-2">
                    <div className="font-bold text-slate-800 uppercase text-[11px]">Quality &amp; Compliance Guarantee:</div>
                    <p className="text-[11px] leading-relaxed">
                      All paddle blinds manufactured strictly to ASME B16.48 specifications from domestic mill-certified plate. Mill Heat Numbers permanently stamped on handles. Certified MTR packets included with delivery.
                    </p>
                    {/* ACH Discount Callout */}
                    <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-2.5 text-emerald-800 text-[11px] font-sans flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-emerald-900">3% ACH / Bank Payment Discount:</strong> Pay or authorize invoice via <strong>Direct ACH Bank Transfer</strong> and save <strong>${(generatedProposal.subtotal * 0.03).toFixed(2)}</strong> (Discounted Total: <strong>${(generatedProposal.totalAmount - (generatedProposal.subtotal * 0.03)).toFixed(2)}</strong>).
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-72 space-y-1.5 text-right">
                    <div className="flex justify-between text-slate-600">
                      <span>Items Subtotal:</span>
                      <span className="font-bold text-slate-900">${generatedProposal.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Estimated Freight ({generatedProposal.totalWeightLbs} lbs):</span>
                      <span className="text-slate-900">${generatedProposal.shippingCost.toFixed(2)}</span>
                    </div>
                    {generatedProposal.hotShotFee > 0 && (
                      <div className="flex justify-between text-rose-700 font-bold">
                        <span>Hot Shot Rush Courier:</span>
                        <span>+${generatedProposal.hotShotFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs font-bold text-slate-700 border-t border-slate-200 pt-1.5">
                      <span className="font-sans">Standard Rate (Card / Net 30):</span>
                      <span className="text-slate-900 font-mono">${generatedProposal.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-emerald-800 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                      <span className="font-sans">⚡ Direct ACH Discount Rate:</span>
                      <span className="font-mono text-emerald-700 text-base font-black">${(generatedProposal.totalAmount - (generatedProposal.subtotal * 0.03)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Actions & Confirm PO Row */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 print:hidden">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                      <ShieldCheck className="h-4 w-4 text-amber-400" />
                      <span>Ready to Dispatch to CNC Plasma Table?</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Enter your Purchase Order number below to authorize production and lock in your scheduled table slot.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      value={poNumberInput}
                      onChange={e => setPoNumberInput(e.target.value)}
                      placeholder="PO Number"
                      className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-amber-300 placeholder-slate-500 focus:outline-none focus:border-amber-400 w-full sm:w-40"
                    />
                    <button
                      type="button"
                      onClick={handleConfirmPO}
                      className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-md active:scale-95 shrink-0"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Confirm &amp; Dispatch PO</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4 text-xs">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    <Printer className="h-4 w-4 text-sky-400" />
                    <span>Print / Save as Official PDF</span>
                  </button>

                  <a
                    href={`mailto:${IPG_SALES_EMAIL}?subject=Purchase%20Order%20Authorization%20-%20Proposal%20${generatedProposal.proposalId}`}
                    className="flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email PO to {IPG_SALES_EMAIL}</span>
                  </a>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
