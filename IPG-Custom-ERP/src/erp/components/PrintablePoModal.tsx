// src/erp/components/PrintablePoModal.tsx
// Printable Official Purchase Order (PO) Document Modal for IPG

import React from 'react';
import { ErpPurchaseOrder } from '../../types';
import brandLogo from '../../../Logo.jpg';
import { X, Printer, Truck, ShieldCheck, DollarSign } from 'lucide-react';

interface PrintablePoModalProps {
  po: ErpPurchaseOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintablePoModal: React.FC<PrintablePoModalProps> = ({ po, isOpen, onClose }) => {
  if (!isOpen || !po) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8 print:my-0 print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Controls Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 print:hidden">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white font-mono">SUPPLIER PURCHASE ORDER DOCUMENT</h2>
              <p className="text-xs text-slate-400 font-mono">{po.poNumber} &bull; {po.supplierName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow active:scale-95"
            >
              <Printer className="h-4 w-4" />
              <span>Print Official PO</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PO Document Body */}
        <div className="p-8 space-y-6 text-slate-100 print:text-black print:p-6 print:space-y-4 font-mono text-xs">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-700 print:border-black pb-4">
            <div className="flex items-center gap-3.5">
              <img
                src={brandLogo}
                alt="Iron Prairie Group"
                className="h-14 w-auto rounded-lg border border-slate-700 bg-white p-1 object-contain print:border-black"
              />
              <div>
                <div className="text-sm font-black text-amber-400 print:text-black tracking-wider uppercase">
                  IRON PRAIRIE GROUP LLC
                </div>
                <div className="text-[11px] text-slate-300 print:text-black">
                  200 County Rd 170, Bay City, TX 77414 &bull; Tel: (979) 248-9266
                </div>
                <div className="text-[10px] text-slate-400 print:text-black font-semibold">
                  Procurement &amp; Supply Chain Operations &bull; orders@iron-prairie.com
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 print:bg-slate-200 print:text-black font-black text-sm rounded-lg border border-amber-500/40 print:border-black mb-1">
                PURCHASE ORDER: {po.poNumber}
              </div>
              <div className="text-[11px] text-slate-300 print:text-black font-bold">Status: {po.status}</div>
              <div className="text-[10px] text-slate-400 print:text-black">Order Date: {po.orderDate}</div>
            </div>
          </div>

          {/* Supplier & Delivery Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-black">
            <div>
              <div className="text-[10px] text-amber-400 print:text-black font-bold uppercase tracking-wider mb-1">
                VENDOR / SUPPLIER:
              </div>
              <div className="text-sm font-bold text-slate-100 print:text-black">{po.supplierName}</div>
              <div className="text-[11px] text-slate-300 print:text-black">Payment Terms: {po.paymentTerms}</div>
              <div className="text-[11px] text-slate-400 print:text-black">Category: {po.category}</div>
            </div>

            <div>
              <div className="text-[10px] text-amber-400 print:text-black font-bold uppercase tracking-wider mb-1">
                SHIP TO DESTINATION:
              </div>
              <div className="text-sm font-bold text-slate-100 print:text-black">{po.destination}</div>
              <div className="text-[11px] text-emerald-400 print:text-black font-bold">
                Requested Delivery Date: {po.requestedDeliveryDate}
              </div>
              <div className="text-[11px] text-slate-400 print:text-black">Receiving Hours: Mon-Fri 7:00 AM - 5:00 PM</div>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <table className="w-full text-left border-collapse border border-slate-800 print:border-black text-[11px]">
              <thead>
                <tr className="bg-slate-800/80 print:bg-slate-200 text-slate-300 print:text-black font-bold">
                  <th className="p-2 border border-slate-700 print:border-black">Item #</th>
                  <th className="p-2 border border-slate-700 print:border-black">Description &amp; Material Spec</th>
                  <th className="p-2 border border-slate-700 print:border-black">Target Job #</th>
                  <th className="p-2 border border-slate-700 print:border-black text-center">Qty</th>
                  <th className="p-2 border border-slate-700 print:border-black">UOM</th>
                  <th className="p-2 border border-slate-700 print:border-black text-right">Unit Price</th>
                  <th className="p-2 border border-slate-700 print:border-black text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-black">
                {po.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 print:hover:bg-transparent">
                    <td className="p-2 border border-slate-800 print:border-black font-bold">{idx + 1}</td>
                    <td className="p-2 border border-slate-800 print:border-black">
                      <div className="font-bold text-slate-200 print:text-black">{item.description}</div>
                      {item.expectedHeatNumber && (
                        <div className="text-[10px] text-amber-400 print:text-black">
                          Expected Heat #: {item.expectedHeatNumber}
                        </div>
                      )}
                    </td>
                    <td className="p-2 border border-slate-800 print:border-black font-mono text-slate-400 print:text-black">
                      {item.targetJobNumber || 'Stock Inventory'}
                    </td>
                    <td className="p-2 border border-slate-800 print:border-black text-center font-bold text-slate-100 print:text-black">
                      {item.quantity}
                    </td>
                    <td className="p-2 border border-slate-800 print:border-black text-slate-300 print:text-black">
                      {item.unitOfMeasure}
                    </td>
                    <td className="p-2 border border-slate-800 print:border-black text-right font-mono text-slate-300 print:text-black">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="p-2 border border-slate-800 print:border-black text-right font-mono font-bold text-slate-100 print:text-black">
                      ${item.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary & Total */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 bg-slate-950/60 print:bg-slate-100 p-3 rounded-xl border border-slate-800 print:border-black text-[11px]">
              <div className="font-bold text-amber-400 print:text-black uppercase text-[10px] mb-1">
                Special Quality &amp; Delivery Instructions:
              </div>
              <p className="text-slate-300 print:text-black">{po.specialInstructions}</p>
              <div className="mt-2 text-[10px] text-slate-400 print:text-black font-semibold">
                * All steel plate and pipe shipments MUST include legible, certified Material Test Reports (CMTR) complying with ASME Section VIII Div 1.
              </div>
            </div>

            <div className="w-64 space-y-1.5 text-right text-[11px]">
              <div className="flex justify-between text-slate-400 print:text-black">
                <span>Subtotal:</span>
                <span className="font-mono text-slate-200 print:text-black">${po.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 print:text-black">
                <span>Freight / Delivery:</span>
                <span className="font-mono text-slate-200 print:text-black">${po.freightAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 print:text-black">
                <span>Tax (Exempt MFG):</span>
                <span className="font-mono text-slate-200 print:text-black">$0.00</span>
              </div>
              <div className="flex justify-between border-t border-slate-700 print:border-black pt-1.5 text-sm font-bold text-amber-400 print:text-black">
                <span>PO TOTAL:</span>
                <span className="font-mono">${po.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Authorization Signatures */}
          <div className="flex justify-between items-center border-t border-slate-700 print:border-black pt-4 text-[10px] text-slate-400 print:text-black">
            <div>
              <div className="font-bold text-slate-200 print:text-black">Authorized Procurement Officer: {po.approvedBy}</div>
              <div>Iron Prairie Group LLC &bull; Management Authorization</div>
            </div>
            <div className="text-right">
              <div>Vendor Acknowledgment Signature: _______________________</div>
              <div>Date: _______________</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
