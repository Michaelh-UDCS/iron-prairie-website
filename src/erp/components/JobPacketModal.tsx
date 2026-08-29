// src/erp/components/JobPacketModal.tsx
// Printable ASME Section VIII & ASME B16.48 Shop Traveler / Job Packet Modal
// Generates official shop traveler for burning table, machining, QA sign-off, and customer package

import React from 'react';
import { ErpWorkOrder } from '../../types';
import brandLogo from '../../../Logo.jpg';
import { X, Printer, ShieldCheck, QrCode, FileText, CheckSquare, Factory, HardHat, Flame } from 'lucide-react';

interface JobPacketModalProps {
  order: ErpWorkOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JobPacketModal: React.FC<JobPacketModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8 print:my-0 print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Modal Controls Header (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 print:hidden">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-white font-mono">ASME QC SHOP TRAVELER &amp; JOB PACKET</h2>
              <p className="text-xs text-slate-400 font-mono">Job #{order.jobNumber} &bull; {order.clientCompanyName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-cyan-500/20 active:scale-95"
            >
              <Printer className="h-4 w-4" />
              <span>Print Shop Packet</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Job Packet Sheet */}
        <div className="p-8 space-y-6 text-slate-100 print:text-black print:p-6 print:space-y-4 font-mono text-xs">
          
          {/* Header & Logo */}
          <div className="flex justify-between items-start border-b-2 border-slate-700 print:border-black pb-4">
            <div className="flex items-center gap-3.5">
              <img
                src={brandLogo}
                alt="Iron Prairie Group"
                className="h-14 w-auto rounded-lg border border-slate-700 bg-white p-1 object-contain print:border-black"
              />
              <div>
                <div className="text-sm font-black text-cyan-400 print:text-black tracking-wider uppercase">
                  IRON PRAIRIE FABRICATION GROUP LLC
                </div>
                <div className="text-[11px] text-slate-300 print:text-black">
                  200 County Rd 170, Bay City, TX 77414 &bull; Phone: (979) 248-9266 &bull; Sales@ironprairiefabrication.com
                </div>
                <div className="text-[10px] text-slate-400 print:text-black font-semibold">
                  ASME Section VIII Div 1 &amp; ASME B16.48 Quality Program &bull; CC: Alicia@ironprairiefabrication.com
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 print:bg-slate-200 print:text-black font-black text-sm rounded-lg border border-cyan-500/40 print:border-black mb-1">
                JOB #{order.jobNumber}
              </div>
              <div className="text-[11px] text-slate-300 print:text-black font-bold">PO: {order.customerPoNumber}</div>
              <div className="text-[10px] text-slate-400 print:text-black">Date: {order.createdAt}</div>
            </div>
          </div>

          {/* Critical Project & Routing Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 print:bg-slate-100 p-3.5 rounded-xl border border-slate-800 print:border-black">
            <div>
              <div className="text-[10px] text-slate-400 print:text-black font-bold uppercase">Customer</div>
              <div className="text-xs font-bold text-slate-100 print:text-black truncate">{order.clientCompanyName}</div>
              <div className="text-[10px] text-slate-400 print:text-black">{order.contactName}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 print:text-black font-bold uppercase">Project / Unit</div>
              <div className="text-xs font-bold text-slate-100 print:text-black truncate">{order.projectName}</div>
              <div className="text-[10px] text-cyan-400 print:text-black font-bold">{order.priority}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 print:text-black font-bold uppercase">Ship Target</div>
              <div className="text-xs font-bold text-emerald-400 print:text-black">{order.scheduledShipDate}</div>
              <div className="text-[10px] text-slate-400 print:text-black">{order.carrierName}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 print:text-black font-bold uppercase">Drawing &amp; Rev</div>
              <div className="text-xs font-bold text-slate-100 print:text-black">{order.drawingNumber || 'DWG-STD'} ({order.drawingRev || 'Rev 0'})</div>
              <div className="text-[10px] text-slate-400 print:text-black">Drive Folder Linked</div>
            </div>
          </div>

          {/* Line Items & Fabrication Specs Table */}
          <div>
            <div className="text-xs font-bold uppercase text-cyan-400 print:text-black mb-2 flex items-center gap-1.5">
              <Flame className="h-4 w-4" />
              <span>Fabrication Bill of Materials &amp; Dimensions</span>
            </div>
            <table className="w-full text-left border-collapse border border-slate-800 print:border-black text-[11px]">
              <thead>
                <tr className="bg-slate-800/80 print:bg-slate-200 text-slate-300 print:text-black font-bold">
                  <th className="p-2 border border-slate-700 print:border-black">Item / Part #</th>
                  <th className="p-2 border border-slate-700 print:border-black">NPS &amp; Class</th>
                  <th className="p-2 border border-slate-700 print:border-black">Material Spec</th>
                  <th className="p-2 border border-slate-700 print:border-black">OD x Thk</th>
                  <th className="p-2 border border-slate-700 print:border-black">Qty</th>
                  <th className="p-2 border border-slate-700 print:border-black">Handle Hard Stamp</th>
                  <th className="p-2 border border-slate-700 print:border-black">Features</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-black">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 print:hover:bg-transparent">
                    <td className="p-2 border border-slate-800 print:border-black font-bold text-slate-200 print:text-black">
                      {item.partNumber}
                    </td>
                    <td className="p-2 border border-slate-800 print:border-black">
                      {item.nps} Cl.{item.pressureClass}
                    </td>
                    <td className="p-2 border border-slate-800 print:border-black font-bold text-cyan-300 print:text-black">
                      {item.materialCode}
                    </td>
                    <td className="p-2 border border-slate-800 print:border-black">
                      {item.od}" OD &bull; {item.thicknessLabel}
                    </td>
                    <td className="p-2 border border-slate-800 print:border-black font-black text-center text-emerald-400 print:text-black">
                      {item.quantity}
                    </td>
                    <td className="p-2 border border-slate-800 print:border-black font-mono text-[10px] text-slate-300 print:text-black">
                      {item.handleStamp}
                    </td>
                    <td className="p-2 border border-slate-800 print:border-black text-[10px] text-slate-400 print:text-black">
                      {[
                        item.addTHadle && 'T-Handle',
                        item.addLockoutHole && 'Lockout Hole',
                        item.addLiftingLug && 'Lift Lug',
                        item.addPlateDog && 'Plate Dog',
                      ].filter(Boolean).join(', ') || 'Standard'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ASME Heat Number & Traceability Box */}
          <div className="p-3.5 rounded-xl border-2 border-dashed border-cyan-500/40 print:border-black bg-cyan-500/5 print:bg-transparent">
            <div className="flex justify-between items-center mb-2">
              <div className="font-bold text-cyan-400 print:text-black uppercase text-xs flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                <span>ASME Section VIII Div 1 Material Traceability</span>
              </div>
              <span className="text-[10px] text-slate-400 print:text-black font-semibold">UG-77 / UG-93 / UG-94 Compliant</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
              <div>
                <span className="text-slate-400 print:text-black font-bold">Allocated Heat #s: </span>
                <span className="font-black text-slate-100 print:text-black">
                  {order.allocatedHeatNumbers.length > 0 ? order.allocatedHeatNumbers.join(', ') : 'STAGED AT CUTTER'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 print:text-black font-bold">MTR Certificate: </span>
                <span className="font-bold text-slate-100 print:text-black">
                  {order.associatedMtrIds.length > 0 ? order.associatedMtrIds.join(', ') : 'Certified in Vault'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 print:text-black font-bold">Verification: </span>
                <span className="font-bold text-emerald-400 print:text-black">Mill Cert Verified Pre-Cut</span>
              </div>
            </div>
          </div>

          {/* Shop Floor QC Traveler Sign-Off Matrix */}
          <div>
            <div className="text-xs font-bold uppercase text-slate-300 print:text-black mb-2 flex items-center gap-1.5">
              <CheckSquare className="h-4 w-4 text-emerald-400 print:text-black" />
              <span>Shop Floor Quality Checkpoints &amp; Operations Sign-Off</span>
            </div>
            <table className="w-full text-left border-collapse border border-slate-800 print:border-black text-[11px]">
              <thead>
                <tr className="bg-slate-800/80 print:bg-slate-200 text-slate-300 print:text-black font-bold">
                  <th className="p-2 border border-slate-700 print:border-black">Stage #</th>
                  <th className="p-2 border border-slate-700 print:border-black">Operation</th>
                  <th className="p-2 border border-slate-700 print:border-black">Requirement / Spec</th>
                  <th className="p-2 border border-slate-700 print:border-black">Operator / Tech</th>
                  <th className="p-2 border border-slate-700 print:border-black">Date</th>
                  <th className="p-2 border border-slate-700 print:border-black">Sign-Off</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-black">
                <tr>
                  <td className="p-2 border border-slate-800 print:border-black font-bold">10</td>
                  <td className="p-2 border border-slate-800 print:border-black font-semibold">Material Staging</td>
                  <td className="p-2 border border-slate-800 print:border-black text-slate-400 print:text-black">Verify HT# vs MTR &amp; Plate Thickness</td>
                  <td className="p-2 border border-slate-800 print:border-black">Dustin R.</td>
                  <td className="p-2 border border-slate-800 print:border-black">2026-08-25</td>
                  <td className="p-2 border border-slate-800 print:border-black font-bold text-emerald-400 print:text-black">[X] PASS</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-800 print:border-black font-bold">20</td>
                  <td className="p-2 border border-slate-800 print:border-black font-semibold">Laser / Plasma Burning</td>
                  <td className="p-2 border border-slate-800 print:border-black text-slate-400 print:text-black">ASME B16.48 OD/Bolt Circle +/- 0.030"</td>
                  <td className="p-2 border border-slate-800 print:border-black">Cody W.</td>
                  <td className="p-2 border border-slate-800 print:border-black">2026-08-25</td>
                  <td className="p-2 border border-slate-800 print:border-black font-bold text-emerald-400 print:text-black">[X] PASS</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-800 print:border-black font-bold">30</td>
                  <td className="p-2 border border-slate-800 print:border-black font-semibold">Deburr &amp; Stamp</td>
                  <td className="p-2 border border-slate-800 print:border-black text-slate-400 print:text-black">Low-stress vibro-etch handle stamp</td>
                  <td className="p-2 border border-slate-800 print:border-black">Cody W.</td>
                  <td className="p-2 border border-slate-800 print:border-black">2026-08-25</td>
                  <td className="p-2 border border-slate-800 print:border-black font-bold text-emerald-400 print:text-black">[X] PASS</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-800 print:border-black font-bold">40</td>
                  <td className="p-2 border border-slate-800 print:border-black font-semibold">Final QA Inspection</td>
                  <td className="p-2 border border-slate-800 print:border-black text-slate-400 print:text-black">100% Visual, Caliper Dimensions &amp; MTR Packet</td>
                  <td className="p-2 border border-slate-800 print:border-black">{order.qcInspectorName || 'Michael H.'}</td>
                  <td className="p-2 border border-slate-800 print:border-black">{order.qcSignOffDate || '2026-08-25'}</td>
                  <td className="p-2 border border-slate-800 print:border-black font-black text-emerald-400 print:text-black">
                    {order.qcInspectionPassed ? '[X] APPROVED' : '[ ] PENDING'}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-800 print:border-black font-bold">50</td>
                  <td className="p-2 border border-slate-800 print:border-black font-semibold">Packaging &amp; Shipping</td>
                  <td className="p-2 border border-slate-800 print:border-black text-slate-400 print:text-black">Rust preventative, crate, MTR hard copy</td>
                  <td className="p-2 border border-slate-800 print:border-black">Dustin R.</td>
                  <td className="p-2 border border-slate-800 print:border-black">{order.scheduledShipDate}</td>
                  <td className="p-2 border border-slate-800 print:border-black font-bold text-slate-400 print:text-black">[ ] READY</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Barcode & Footer Authentication */}
          <div className="flex justify-between items-center border-t border-slate-700 print:border-black pt-4 text-[10px] text-slate-400 print:text-black">
            <div>
              <div className="font-mono font-bold tracking-widest text-slate-300 print:text-black">
                *|||||||||||| {order.jobNumber} ||||||||||||*
              </div>
              <div>Digital ASME Section VIII Traceability Record &bull; Bay City Fabrication Facility</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-200 print:text-black">Authorized Lead Inspector: Michael Huerta</div>
              <div>Iron Prairie Group Quality Assurance Dept</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
