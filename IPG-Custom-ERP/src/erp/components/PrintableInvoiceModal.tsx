// src/erp/components/PrintableInvoiceModal.tsx
// Printable Invoice (AR) & Bill (AP) Modal for IPG

import React from 'react';
import { ErpInvoice } from '../../types';
import brandLogo from '../../../Logo.jpg';
import { X, Printer, Receipt, DollarSign, CheckCircle2 } from 'lucide-react';

interface PrintableInvoiceModalProps {
  invoice: ErpInvoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintableInvoiceModal: React.FC<PrintableInvoiceModalProps> = ({ invoice, isOpen, onClose }) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const isAR = invoice.type === 'AR_Invoice';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8 print:my-0 print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 print:hidden">
          <div className="flex items-center gap-3">
            <Receipt className="h-5 w-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white font-mono">
                {isAR ? 'CUSTOMER INVOICE (ACCOUNTS RECEIVABLE)' : 'VENDOR BILL (ACCOUNTS PAYABLE)'}
              </h2>
              <p className="text-xs text-slate-400 font-mono">{invoice.invoiceNumber} &bull; {invoice.counterpartyName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow active:scale-95"
            >
              <Printer className="h-4 w-4" />
              <span>Print Invoice Document</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
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
                  Accounting &amp; Invoicing &bull; ap@iron-prairie.com &bull; ar@iron-prairie.com
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 print:bg-slate-200 print:text-black font-black text-sm rounded-lg border border-amber-500/40 print:border-black mb-1">
                {isAR ? 'INVOICE: ' : 'BILL: '}{invoice.invoiceNumber}
              </div>
              <div className="text-[11px] text-slate-300 print:text-black font-bold">
                Status: <span className={invoice.paymentStatus === 'Paid in Full' ? 'text-emerald-400' : 'text-amber-400'}>{invoice.paymentStatus}</span>
              </div>
              <div className="text-[10px] text-slate-400 print:text-black">Date Issued: {invoice.issueDate}</div>
              <div className="text-[10px] text-red-400 print:text-black font-bold">Payment Due: {invoice.dueDate}</div>
            </div>
          </div>

          {/* Counterparty & Job Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-black">
            <div>
              <div className="text-[10px] text-amber-400 print:text-black font-bold uppercase tracking-wider mb-1">
                {isAR ? 'BILLED TO (CLIENT):' : 'PAYABLE TO (SUPPLIER):'}
              </div>
              <div className="text-sm font-bold text-slate-100 print:text-black">{invoice.counterpartyName}</div>
              <div className="text-[11px] text-slate-300 print:text-black">Payment Terms: {invoice.paymentTerms}</div>
              <div className="text-[11px] text-slate-400 print:text-black">Aging Status: {invoice.agingBucket}</div>
            </div>

            <div>
              <div className="text-[10px] text-amber-400 print:text-black font-bold uppercase tracking-wider mb-1">
                CROSS-REFERENCE CODES:
              </div>
              {invoice.linkedJobNumber && (
                <div className="text-[11px] text-slate-200 print:text-black font-bold">
                  Associated Job #: <span className="text-amber-400 print:text-black">{invoice.linkedJobNumber}</span>
                </div>
              )}
              {invoice.linkedPoNumber && (
                <div className="text-[11px] text-slate-200 print:text-black">
                  Customer PO / Supplier PO #: <span className="font-bold">{invoice.linkedPoNumber}</span>
                </div>
              )}
              <div className="text-[10px] text-slate-400 print:text-black mt-1">
                Remittance Email: ar@iron-prairie.com
              </div>
            </div>
          </div>

          {/* Billing Summary Table */}
          <div>
            <table className="w-full text-left border-collapse border border-slate-800 print:border-black text-[11px]">
              <thead>
                <tr className="bg-slate-800/80 print:bg-slate-200 text-slate-300 print:text-black font-bold">
                  <th className="p-2 border border-slate-700 print:border-black">Description / Service</th>
                  <th className="p-2 border border-slate-700 print:border-black">Job # Reference</th>
                  <th className="p-2 border border-slate-700 print:border-black text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-black">
                <tr>
                  <td className="p-2.5 border border-slate-800 print:border-black">
                    <div className="font-bold text-slate-100 print:text-black">
                      {isAR
                        ? 'Custom ASME B16.48 Paddle Blind & Flange Components Fabrication'
                        : 'Raw Materials / Mill Plate & Industrial Gas Supplies'}
                    </div>
                    <div className="text-[10px] text-slate-400 print:text-black">
                      Includes certified ASME Section VIII Div 1 Material Test Reports (MTRs) and packaging.
                    </div>
                  </td>
                  <td className="p-2.5 border border-slate-800 print:border-black font-mono text-slate-300 print:text-black">
                    {invoice.linkedJobNumber || invoice.linkedPoNumber || 'N/A'}
                  </td>
                  <td className="p-2.5 border border-slate-800 print:border-black text-right font-mono font-bold text-slate-100 print:text-black">
                    ${invoice.subtotal.toFixed(2)}
                  </td>
                </tr>
                {invoice.freight > 0 && (
                  <tr>
                    <td className="p-2.5 border border-slate-800 print:border-black text-slate-300 print:text-black">
                      Dedicated Freight &amp; Logistics Delivery
                    </td>
                    <td className="p-2.5 border border-slate-800 print:border-black font-mono text-slate-400 print:text-black">
                      Direct Hub Drop
                    </td>
                    <td className="p-2.5 border border-slate-800 print:border-black text-right font-mono text-slate-200 print:text-black">
                      ${invoice.freight.toFixed(2)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Ledger Breakdown & Balance */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 bg-slate-950/60 print:bg-slate-100 p-3 rounded-xl border border-slate-800 print:border-black text-[11px]">
              <div className="font-bold text-amber-400 print:text-black uppercase text-[10px] mb-1">
                Remittance &amp; Payment Instructions:
              </div>
              <p className="text-slate-300 print:text-black">
                Please remit payments via ACH Direct Debit, Bluevine Commercial Transfer, or Check to:
              </p>
              <div className="font-bold text-slate-100 print:text-black mt-1">Iron Prairie Group LLC</div>
              <div className="text-slate-400 print:text-black">200 County Rd 170, Bay City, TX 77414</div>
              {invoice.notes && (
                <div className="mt-2 text-[10px] text-amber-300 print:text-black font-medium">
                  Note: {invoice.notes}
                </div>
              )}
            </div>

            <div className="w-64 space-y-1.5 text-right text-[11px]">
              <div className="flex justify-between text-slate-400 print:text-black">
                <span>Subtotal:</span>
                <span className="font-mono text-slate-200 print:text-black">${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 print:text-black">
                <span>Freight:</span>
                <span className="font-mono text-slate-200 print:text-black">${invoice.freight.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 print:text-black">
                <span>Tax:</span>
                <span className="font-mono text-slate-200 print:text-black">${invoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-700 print:border-black pt-1 font-bold text-slate-200 print:text-black">
                <span>Invoice Total:</span>
                <span className="font-mono">${invoice.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 print:text-black">
                <span>Paid to Date:</span>
                <span className="font-mono">-${invoice.paidAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t-2 border-amber-500/60 print:border-black pt-1.5 text-sm font-black text-amber-400 print:text-black">
                <span>BALANCE DUE:</span>
                <span className="font-mono">${invoice.balanceDue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center border-t border-slate-700 print:border-black pt-4 text-[10px] text-slate-400 print:text-black">
            <div>
              <div className="font-bold text-slate-200 print:text-black">Iron Prairie Group LLC &bull; Financial Operations</div>
              <div>Thank you for your business. For billing inquiries: ap@iron-prairie.com</div>
            </div>
            <div className="text-right font-bold text-slate-300 print:text-black">
              {invoice.paymentStatus === 'Paid in Full' ? '✓ VERIFIED PAID IN FULL' : 'PAYMENT DUE NET 30'}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
