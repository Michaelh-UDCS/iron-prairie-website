// src/operations/components/AsmeQcTravelerModal.tsx
// Printable ASME Section VIII Div 1 (UG-77, UG-93, UG-94) Job Traveler & Stamping Log

import React from 'react';
import { CustomerOrder, MaterialTestReport } from '../../types';
import { getMTRByHeatNumber } from '../data/mtrRepository';
import { X, Printer, ShieldCheck, QrCode, FileText, CheckSquare, Flame } from 'lucide-react';

interface AsmeQcTravelerModalProps {
  order: CustomerOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AsmeQcTravelerModal: React.FC<AsmeQcTravelerModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const primaryItem = order.items[0];
  const mtr: MaterialTestReport | undefined = order.millHeatNumber
    ? getMTRByHeatNumber(order.millHeatNumber)
    : undefined;

  const handlePrint = () => {
    window.print();
  };

  const hardStampSpec = primaryItem
    ? `IPF - ${primaryItem.nps} ${primaryItem.pressureClass}# - ${primaryItem.materialCode} - ${order.millHeatNumber} - ${primaryItem.thicknessLabel.split(' ')[0]}`
    : 'IPF - ASME B16.48';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 md:p-6 backdrop-blur-md animate-fadeIn">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden print:m-0 print:max-h-none print:w-full print:border-none print:bg-white print:p-0 print:text-black">
        
        {/* Screen Header - Hidden on Print */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                ASME Section VIII Div 1 Job Traveler &bull; <span className="font-mono text-amber-400">{order.poNumber}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {order.companyName} &bull; Heat: <span className="font-mono text-emerald-400 font-bold">{order.millHeatNumber}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-md active:scale-95"
            >
              <Printer className="h-4 w-4" />
              <span>Print Traveler Sheet</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 font-mono text-xs text-slate-200 print:text-black print:p-0">
          
          {/* Document Header */}
          <div className="flex items-start justify-between pb-4 border-b-2 border-slate-800 print:border-black">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-amber-400 print:text-black">
                IRON PRAIRIE FABRICATION GROUP LLC
              </div>
              <div className="text-base font-black text-white print:text-black mt-0.5">
                ASME SECTION VIII DIV 1 QC TRAVELER &amp; UG-77 STAMPING LOG
              </div>
              <div className="text-[11px] text-slate-400 print:text-gray-600">
                Facility: 2301 N Brazosport Blvd, Freeport, TX 77541 &bull; (979) 248-9266
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase font-bold">PO Number</div>
              <div className="text-base font-black text-amber-400 print:text-black">{order.poNumber}</div>
              <div className="text-[10px] text-slate-400">Order ID: {order.orderId}</div>
            </div>
          </div>

          {/* Job Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 print:bg-gray-50 print:border-gray-300">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Client / Facility</span>
              <span className="text-xs font-bold text-slate-100 print:text-black">{order.companyName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Ship-To Destination</span>
              <span className="text-[11px] text-slate-300 print:text-black">{order.jobsiteAddress}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Scheduled Ship Date</span>
              <span className="text-xs font-bold text-slate-100 print:text-black">{order.scheduledShipDate}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Priority / Shipping</span>
              <span className="text-xs font-bold text-amber-400 print:text-black">{order.shippingMethod}</span>
            </div>
          </div>

          {/* Section 1: UG-77 Physical Hard Stamp Specification */}
          <div className="rounded-xl border-2 border-dashed border-amber-500/60 bg-amber-500/5 p-4 space-y-2 print:border-black print:bg-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-black flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-400" />
                ASME UG-77 Required Hard-Stamp Specification
              </span>
              <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black">
                MANDATORY STAMP
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center font-mono text-sm font-black text-amber-300 print:bg-white print:text-black print:border-black">
              {hardStampSpec}
            </div>

            <div className="text-[10px] text-slate-400 print:text-gray-600">
              * Per ASME Section VIII Div 1 UG-77: All cut blinds must have mill heat traceability hard-stamped on handle before dispatch.
            </div>
          </div>

          {/* Section 2: Bill of Materials & Cut Dimensions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black">
              1. Cut Dimensions &amp; Geometry Manifest (ASME B16.48)
            </h4>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 print:border-gray-300">
              <table className="w-full text-center text-xs">
                <thead className="bg-slate-900 text-[10px] font-bold text-slate-400 uppercase print:bg-gray-200 print:text-black">
                  <tr>
                    <th className="py-2 px-2 text-left">Item SKU</th>
                    <th className="py-2 px-2">Size / Class</th>
                    <th className="py-2 px-2">Material</th>
                    <th className="py-2 px-2">Thk</th>
                    <th className="py-2 px-2">OD (in)</th>
                    <th className="py-2 px-2">Bolt Circle</th>
                    <th className="py-2 px-2">Qty</th>
                    <th className="py-2 px-2 text-right">Scale Wt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200 print:divide-gray-300 print:text-black">
                  {order.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="py-2 px-2 text-left font-bold text-amber-400 print:text-black">{item.partNumber}</td>
                      <td className="py-2 px-2">{item.nps} {item.pressureClass}#</td>
                      <td className="py-2 px-2 font-bold">{item.materialCode}</td>
                      <td className="py-2 px-2">{item.thicknessLabel}</td>
                      <td className="py-2 px-2 font-bold">{item.od.toFixed(2)}"</td>
                      <td className="py-2 px-2">{item.boltCircle.toFixed(2)}"</td>
                      <td className="py-2 px-2 font-black text-amber-400 print:text-black">{item.quantity}</td>
                      <td className="py-2 px-2 text-right font-mono">{(item.actualWeightLbs * item.quantity).toFixed(1)} lbs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: 5 ASME QC Hold Points & Sign-Off Signatures */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black">
              2. ASME Section VIII Div 1 QC Hold Points &amp; Inspector Sign-Offs
            </h4>

            <div className="space-y-2">
              {[
                {
                  code: 'UG-93',
                  title: 'Hold Point 1: Initial Plate Receiving & Heat Stamp Verification',
                  desc: 'Verify plate mill heat # matches MTR cert and is free of laminations or defects.',
                },
                {
                  code: 'CUT-QC',
                  title: 'Hold Point 2: Laser Burn & Cut Edge Profile',
                  desc: 'Inspect CNC laser kerf tolerance (±0.005"), perpendicularity, and verify zero dross.',
                },
                {
                  code: 'B16.48',
                  title: 'Hold Point 3: Dimensional Inspection (OD, Bolt Circle, Thickness)',
                  desc: 'Caliper verify disc OD, handle length/width, and nominal plate thickness.',
                },
                {
                  code: 'UG-77',
                  title: 'Hold Point 4: Heat Transfer Hard Stamp Verification',
                  desc: 'Confirm physical handle stamp is deep, legible, and matches the assigned heat number.',
                },
                {
                  code: 'UG-94',
                  title: 'Hold Point 5: Final Inspection, Deburring & MTR Collation',
                  desc: 'Deburr edges, wipe down with rust inhibitor, verify QR code, and collate MTR packet.',
                },
              ].map((hp, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950 gap-2 print:border-gray-300 print:bg-white"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-200 print:text-black flex items-center gap-2">
                      <span className="bg-slate-800 text-amber-400 print:bg-gray-200 print:text-black px-1.5 py-0.2 rounded text-[10px] font-black">
                        {hp.code}
                      </span>
                      <span>{hp.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 print:text-gray-600">{hp.desc}</div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="h-8 w-24 border border-dashed border-slate-700 rounded flex items-center justify-center text-[10px] text-slate-500 print:border-black">
                      Sign / Initials
                    </div>
                    <div className="h-8 w-20 border border-dashed border-slate-700 rounded flex items-center justify-center text-[10px] text-slate-500 print:border-black">
                      Date
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Attached MTR Summary */}
          {mtr && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 print:border-gray-300">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 print:text-black">Attached CMTR Mill Certification Summary:</span>
                <span className="text-emerald-400 font-bold print:text-black">Cert #{mtr.certificateNumber}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400 print:text-gray-700">
                <div>Mill: <strong>{mtr.steelMill}</strong></div>
                <div>Tensile: <strong>{mtr.mechanical.tensileStrengthPsi.toLocaleString()} PSI</strong></div>
                <div>Yield: <strong>{mtr.mechanical.yieldStrengthPsi.toLocaleString()} PSI</strong></div>
                <div>Elong: <strong>{mtr.mechanical.elongationPct}%</strong></div>
              </div>
            </div>
          )}

          {/* Footer QR Verification */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 print:border-black">
            <div className="flex items-center gap-2">
              <QrCode className="h-8 w-8 text-amber-400 print:text-black" />
              <div>
                <div>Permanent Digital Audit QR Code Attached to Travel Packet</div>
                <div className="text-[10px] text-slate-500">{mtr ? mtr.permanentUrl : '/mtr/traceability'}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-slate-200 print:text-black">Iron Prairie Fabrication Group LLC</div>
              <div className="text-emerald-400 print:text-black">ASME Section VIII Div 1 Compliant</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
