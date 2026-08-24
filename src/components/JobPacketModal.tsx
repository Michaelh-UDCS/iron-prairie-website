import React, { useState } from 'react';
import { ShopJob } from '../types';
import { MATERIALS } from '../data/paddleBlindData';
import {
  X,
  Printer,
  FileText,
  Truck,
  ShieldCheck,
  QrCode,
  Flame,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface JobPacketModalProps {
  job: ShopJob | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JobPacketModal: React.FC<JobPacketModalProps> = ({ job, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'cutTicket' | 'packingSlip' | 'mtrCert'>('cutTicket');

  if (!isOpen || !job) return null;

  const handlePrint = () => {
    window.print();
  };

  const primaryItem = job.items[0];
  const matInfo = primaryItem ? MATERIALS[primaryItem.material] : MATERIALS['A516'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 md:p-6 backdrop-blur-md animate-fadeIn">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden print:m-0 print:max-h-none print:w-full print:border-none print:bg-white print:p-0 print:text-black">
        {/* Header - Hidden during print if necessary */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Digital Shop Job Packet &bull; <span className="font-mono text-amber-400">{job.poNumber}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {job.customerName} &bull; Scheduled Dispatch: <span className="text-slate-200 font-mono">{job.scheduledShipDate}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-md active:scale-95"
            >
              <Printer className="h-4 w-4" />
              <span>Print Packet</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Screen only) */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-2 print:hidden">
          <button
            onClick={() => setActiveTab('cutTicket')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'cutTicket'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="h-4 w-4" />
            <span>1. Laser Cut Ticket</span>
          </button>

          <button
            onClick={() => setActiveTab('packingSlip')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'packingSlip'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Truck className="h-4 w-4" />
            <span>2. Shipping Packing Slip</span>
          </button>

          <button
            onClick={() => setActiveTab('mtrCert')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'mtrCert'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>3. Mill Heat Certification (MTR)</span>
          </button>
        </div>

        {/* Printable Content Body */}
        <div className="flex-1 overflow-auto p-6 space-y-6 print:p-8 print:text-black">
          {/* TAB 1: LASER CUT TICKET */}
          {(activeTab === 'cutTicket' || typeof window === 'undefined') && (
            <div className="space-y-6">
              {/* Shop Header Banner */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 print:border-black print:bg-stone-100">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 print:text-black">
                      CNC LASER TABLE ROUTING SLIP
                    </span>
                    <h2 className="text-xl font-black text-slate-100 print:text-black">
                      IRON PRAIRIE FABRICATION GROUP LLC
                    </h2>
                    <p className="text-xs text-slate-300 print:text-stone-700">
                      Freeport, TX &bull; 979-248-9266 &bull; ASME B16.48 Positive Isolation Production
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 print:text-stone-600">Job Reference</div>
                    <div className="font-mono text-lg font-black text-amber-400 print:text-black">{job.poNumber}</div>
                    <div className="text-[11px] font-mono text-slate-400 print:text-stone-600">Order ID: {job.id}</div>
                  </div>
                </div>
              </div>

              {/* Laser Parameters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 print:border-black print:bg-white">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 print:text-stone-600">
                    Plate Material
                  </div>
                  <div className="mt-1 font-mono text-sm font-bold text-amber-400 print:text-black">
                    {matInfo.astmSpec}
                  </div>
                  <div className="text-[10px] text-slate-400 print:text-stone-600">{matInfo.category}</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 print:border-black print:bg-white">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 print:text-stone-600">
                    Plate Thickness
                  </div>
                  <div className="mt-1 font-mono text-sm font-bold text-sky-400 print:text-black">
                    {primaryItem?.dimensions.thicknessFraction} ({primaryItem?.dimensions.nominalThickness.toFixed(3)}")
                  </div>
                  <div className="text-[10px] text-slate-400 print:text-stone-600">ASME B16.48 Nominal</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 print:border-black print:bg-white">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 print:text-stone-600">
                    Active Mill Heat #
                  </div>
                  <div className="mt-1 font-mono text-sm font-bold text-emerald-400 print:text-black">
                    {job.millHeatNumber || 'UNASSIGNED'}
                  </div>
                  <div className="text-[10px] text-slate-400 print:text-stone-600">Physical Stamp Mandate</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 print:border-black print:bg-white">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 print:text-stone-600">
                    Nesting / Gas Assist
                  </div>
                  <div className="mt-1 font-mono text-sm font-bold text-slate-200 print:text-black">
                    High-Purity O₂ / N₂
                  </div>
                  <div className="text-[10px] text-slate-400 print:text-stone-600">Clean Dross-Free Edge</div>
                </div>
              </div>

              {/* Items Cut Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 print:border-black print:bg-white">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 print:border-black print:bg-stone-200 print:text-black">
                    <tr>
                      <th className="px-4 py-3">Qty</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">OD (in)</th>
                      <th className="px-4 py-3">Handle Width &times; Lgth</th>
                      <th className="px-4 py-3">Handle Stamp Text</th>
                      <th className="px-4 py-3">Add-ons</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200 print:divide-black print:text-black">
                    {job.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="px-4 py-3 font-bold text-amber-400 print:text-black text-sm">{item.quantity}x</td>
                        <td className="px-4 py-3 font-semibold text-slate-100 print:text-black">
                          {item.nps} {item.pressureClass} {item.material} {item.facing}
                        </td>
                        <td className="px-4 py-3 font-bold text-sky-400 print:text-black">{item.dimensions.od.toFixed(3)}"</td>
                        <td className="px-4 py-3 text-slate-300 print:text-black">
                          {item.dimensions.handleWidth}" &times; {item.dimensions.handleLength}"
                        </td>
                        <td className="px-4 py-3 font-bold text-amber-300 print:text-black bg-amber-500/5 print:bg-transparent">
                          {item.handleStamping}
                        </td>
                        <td className="px-4 py-3 text-slate-300 print:text-black">
                          {item.addOns.tHandle && <span className="mr-1 rounded bg-amber-500/20 px-1 py-0.5 text-[10px]">T-Handle</span>}
                          {item.addOns.liftingLug && <span className="mr-1 rounded bg-sky-500/20 px-1 py-0.5 text-[10px]">Lug</span>}
                          {!item.addOns.tHandle && !item.addOns.liftingLug && 'Standard'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Shop Operator Sign-off */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-4 text-xs font-mono text-slate-400 print:border-black print:text-black">
                <div className="border border-dashed border-slate-700 p-3 rounded-lg print:border-black">
                  <div className="text-[10px] text-slate-400 print:text-stone-600">1. Laser Burn Operator</div>
                  <div className="mt-4 border-b border-slate-600 print:border-black"></div>
                  <div className="mt-1 flex justify-between text-[10px]">
                    <span>Initials: _______</span>
                    <span>Date: ________</span>
                  </div>
                </div>

                <div className="border border-dashed border-slate-700 p-3 rounded-lg print:border-black">
                  <div className="text-[10px] text-slate-400 print:text-stone-600">2. Deburring &amp; Stamping QC</div>
                  <div className="mt-4 border-b border-slate-600 print:border-black"></div>
                  <div className="mt-1 flex justify-between text-[10px]">
                    <span>Initials: _______</span>
                    <span>Date: ________</span>
                  </div>
                </div>

                <div className="border border-dashed border-slate-700 p-3 rounded-lg print:border-black">
                  <div className="text-[10px] text-slate-400 print:text-stone-600">3. MTR Packet Verification</div>
                  <div className="mt-4 border-b border-slate-600 print:border-black"></div>
                  <div className="mt-1 flex justify-between text-[10px]">
                    <span>Initials: _______</span>
                    <span>Date: ________</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SHIPPING PACKING SLIP */}
          {activeTab === 'packingSlip' && (
            <div className="space-y-6">
              {/* Slip Header */}
              <div className="flex justify-between items-start border-b border-slate-800 pb-6 print:border-black">
                <div>
                  <h2 className="text-2xl font-black text-slate-100 print:text-black">
                    IRON PRAIRIE FABRICATION GROUP LLC
                  </h2>
                  <p className="text-xs text-slate-400 print:text-stone-700 mt-1">
                    Direct CNC Laser Burn &amp; Machining Facility<br />
                    Freeport, TX 77541 &bull; Phone: (979) 248-9266<br />
                    sales@ironprairiefabrication.com
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-block rounded-lg bg-amber-500/20 px-3 py-1 text-xs font-mono font-bold text-amber-300 print:border print:border-black print:text-black">
                    COMMERCIAL PACKING SLIP
                  </div>
                  <div className="mt-2 text-xs text-slate-400 print:text-stone-700">
                    <div>Date: <strong className="text-slate-200 print:text-black">{job.orderDate}</strong></div>
                    <div>Ship Date: <strong className="text-slate-200 print:text-black">{job.scheduledShipDate}</strong></div>
                    <div>PO Reference: <strong className="text-amber-400 print:text-black">{job.poNumber}</strong></div>
                  </div>
                </div>
              </div>

              {/* Ship-to Addresses */}
              <div className="grid grid-cols-2 gap-6 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 print:border-black print:bg-white">
                  <span className="font-bold uppercase tracking-wider text-slate-400 print:text-stone-600">
                    Ship To / Delivery Destination:
                  </span>
                  <div className="mt-2 font-bold text-sm text-slate-100 print:text-black">{job.customerName}</div>
                  <div className="mt-1 text-slate-300 whitespace-pre-line print:text-black">{job.deliveryAddress}</div>
                  <div className="mt-2 text-slate-400 print:text-stone-700">Contact: {job.buyerEmail || 'MRO Purchasing'}</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 print:border-black print:bg-white">
                  <span className="font-bold uppercase tracking-wider text-slate-400 print:text-stone-600">
                    Logistics &amp; Carrier Dispatch:
                  </span>
                  <div className="mt-2 font-mono font-bold text-amber-400 print:text-black text-sm">
                    {job.carrier}
                  </div>
                  <div className="mt-1 text-slate-300 print:text-stone-800">
                    Total Scale Weight: <strong className="font-mono text-slate-100 print:text-black">{job.totalWeightLbs} lbs</strong>
                  </div>
                  <div className="mt-1 text-slate-400 print:text-stone-700">
                    MTR Document: {job.mtrRequired ? 'Included with Bill of Lading' : 'Commercial Hydrotest Spec'}
                  </div>
                </div>
              </div>

              {/* Itemized Manifest */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 print:border-black print:bg-white">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-slate-800 bg-slate-900 text-slate-400 print:border-black print:bg-stone-200 print:text-black">
                    <tr>
                      <th className="px-4 py-3">Item #</th>
                      <th className="px-4 py-3">SKU &amp; Description</th>
                      <th className="px-4 py-3">Mill Heat #</th>
                      <th className="px-4 py-3 text-right">Qty Shipped</th>
                      <th className="px-4 py-3 text-right">Unit Wt</th>
                      <th className="px-4 py-3 text-right">Total Wt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200 print:divide-black print:text-black">
                    {job.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-amber-400 print:text-black">{item.sku}</div>
                          <div className="text-slate-400 print:text-stone-700 font-sans">
                            {item.nps} ASME B16.48 {item.pressureClass} {item.material} ({item.facing}) - Tag: {item.handleStamping}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-emerald-400 print:text-black font-bold">
                          {job.millHeatNumber || 'VERIFIED'}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-sm">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">{item.finishedWeightPerUnit} lbs</td>
                        <td className="px-4 py-3 text-right font-bold">{item.totalFinishedWeight} lbs</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t border-slate-800 font-bold bg-slate-900/50 print:border-black print:bg-stone-100">
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-right">Total Shipment Weight:</td>
                      <td className="px-4 py-3 text-right text-amber-400 print:text-black">{job.totalWeightLbs} lbs</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: MILL HEAT CERTIFICATION (MTR) */}
          {activeTab === 'mtrCert' && (
            <div className="space-y-6">
              {/* Compliance Header */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 print:border-black print:bg-stone-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-8 w-8 text-emerald-400 print:text-black" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-100 print:text-black">
                        CERTIFIED MATERIAL TEST REPORT (MTR) &bull; ASME B16.48
                      </h3>
                      <p className="text-xs text-slate-300 print:text-stone-700">
                        Traceable Mill Heat Chemistry &amp; Mechanical Verification Certificate
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-xs text-slate-400 print:text-stone-700">Heat Cert Number</div>
                    <div className="font-bold text-emerald-400 print:text-black">{job.heatCertNumber || 'MTR-TX-2026-991'}</div>
                  </div>
                </div>
              </div>

              {/* Chemical & Mechanical Analysis Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 print:border-black print:bg-white">
                  <h4 className="font-bold text-amber-400 print:text-black uppercase tracking-wider mb-2">
                    Chemical Composition (% Max / Actual)
                  </h4>
                  <table className="w-full text-left font-mono">
                    <thead className="text-slate-400 print:text-stone-600 border-b border-slate-800">
                      <tr>
                        <th className="py-1">Element</th>
                        <th className="py-1">Carbon (C)</th>
                        <th className="py-1">Manganese (Mn)</th>
                        <th className="py-1">Phosphorus (P)</th>
                        <th className="py-1">Sulfur (S)</th>
                        <th className="py-1">Silicon (Si)</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-200 print:text-black divide-y divide-slate-800/40">
                      <tr>
                        <td className="py-1 text-slate-400">Spec</td>
                        <td>0.28 max</td>
                        <td>0.85-1.20</td>
                        <td>0.035 max</td>
                        <td>0.035 max</td>
                        <td>0.15-0.40</td>
                      </tr>
                      <tr className="font-bold text-emerald-400 print:text-black">
                        <td className="py-1">Heat {job.millHeatNumber || 'K49201'}</td>
                        <td>0.21%</td>
                        <td>1.02%</td>
                        <td>0.012%</td>
                        <td>0.008%</td>
                        <td>0.27%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 print:border-black print:bg-white">
                  <h4 className="font-bold text-sky-400 print:text-black uppercase tracking-wider mb-2">
                    Mechanical Tensile &amp; Yield Properties
                  </h4>
                  <div className="space-y-1.5 font-mono text-slate-300 print:text-black">
                    <div className="flex justify-between border-b border-slate-800/60 pb-1">
                      <span>Tensile Strength:</span>
                      <strong className="text-slate-100 print:text-black">74,200 PSI (70-90 ksi req)</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/60 pb-1">
                      <span>Yield Strength (0.2% offset):</span>
                      <strong className="text-slate-100 print:text-black">42,800 PSI (38 ksi min)</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/60 pb-1">
                      <span>Elongation in 2":</span>
                      <strong className="text-slate-100 print:text-black">26.5% (21% min)</strong>
                    </div>
                    <div className="flex justify-between pt-0.5">
                      <span>Standard Compliance:</span>
                      <strong className="text-emerald-400 print:text-black">ASME B16.48 / ASTM A516-70</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Digital QR / Download link */}
              <div className="flex flex-wrap items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4 print:border-black print:bg-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800 text-amber-400 border border-slate-700">
                    <QrCode className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200 print:text-black">Digital Traceability Verification</div>
                    <div className="text-[11px] font-mono text-slate-400 print:text-stone-600">
                      Scan or visit: ironprairiefabrication.com/mtr/{job.millHeatNumber || 'verify'}
                    </div>
                  </div>
                </div>

                <a
                  href={`#download-mtr-${job.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Downloading Certified MTR PDF for Heat #${job.millHeatNumber || 'TX-99042'}...`);
                  }}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-colors print:hidden"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Download Signed PDF</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-6 py-4 print:hidden">
          <div className="text-xs text-slate-400">
            Iron Prairie Fabrication Group LLC &bull; Quality Assurance System
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Close Packet
          </button>
        </div>
      </div>
    </div>
  );
};
