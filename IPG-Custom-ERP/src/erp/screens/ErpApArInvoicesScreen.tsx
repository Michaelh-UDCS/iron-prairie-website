// src/erp/screens/ErpApArInvoicesScreen.tsx
// Accounts Payable (AP) & Accounts Receivable (AR) Invoicing Hub for IPG

import React, { useState, useMemo } from 'react';
import { useErp } from '../context/ErpContext';
import {
  Receipt,
  Search,
  Plus,
  Printer,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CreditCard,
  X
} from 'lucide-react';
import { ErpInvoice } from '../../types';
import { PrintableInvoiceModal } from '../components/PrintableInvoiceModal';

export const ErpApArInvoicesScreen: React.FC = () => {
  const { invoices, addInvoice, recordInvoicePayment, workOrders, purchaseOrders } = useErp();

  const [activeTab, setActiveTab] = useState<'all' | 'ar_receivables' | 'ap_payables'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<ErpInvoice | null>(null);
  const [payingInvoice, setPayingInvoice] = useState<ErpInvoice | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState('ACH Direct Debit');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Invoice Form State
  const [newType, setNewType] = useState<ErpInvoice['type']>('AR_Invoice');
  const [newCounterparty, setNewCounterparty] = useState('ExxonMobil Baytown Complex');
  const [newJobRef, setNewJobRef] = useState(workOrders[0]?.jobNumber || '');
  const [newSubtotal, setNewSubtotal] = useState(1771.0);
  const [newFreight, setNewFreight] = useState(85.0);
  const [newDueDate, setNewDueDate] = useState(new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (activeTab === 'ar_receivables' && inv.type !== 'AR_Invoice') return false;
      if (activeTab === 'ap_payables' && inv.type !== 'AP_Bill') return false;
      const q = searchFilter.toLowerCase().trim();
      if (!q) return true;
      return (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.counterpartyName.toLowerCase().includes(q) ||
        (inv.linkedJobNumber && inv.linkedJobNumber.toLowerCase().includes(q)) ||
        (inv.linkedPoNumber && inv.linkedPoNumber.toLowerCase().includes(q))
      );
    });
  }, [invoices, activeTab, searchFilter]);

  // Aging & Financial Calculations
  const arInvoices = invoices.filter((i) => i.type === 'AR_Invoice');
  const apBills = invoices.filter((i) => i.type === 'AP_Bill');

  const totalArReceivables = arInvoices.reduce((sum, i) => sum + i.balanceDue, 0);
  const totalApPayables = apBills.reduce((sum, i) => sum + i.balanceDue, 0);
  const totalOverdueAr = arInvoices.filter((i) => i.paymentStatus === 'Overdue').reduce((sum, i) => sum + i.balanceDue, 0);

  const handleOpenPayment = (inv: ErpInvoice) => {
    setPayingInvoice(inv);
    setPayAmount(inv.balanceDue);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;
    recordInvoicePayment(payingInvoice.invoiceNumber, payAmount, payMethod);
    setPayingInvoice(null);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const total = newSubtotal + newFreight;
    const invNum = newType === 'AR_Invoice'
      ? `IPG-INV-2026-${String(invoices.length + 501).padStart(4, '0')}`
      : `BILL-${newCounterparty.split(' ')[0].toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    addInvoice({
      invoiceNumber: invNum,
      type: newType,
      counterpartyName: newCounterparty,
      linkedJobNumber: newJobRef,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: newDueDate,
      subtotal: newSubtotal,
      freight: newFreight,
      tax: 0,
      totalAmount: total,
      paidAmount: 0,
      balanceDue: total,
      paymentTerms: 'Net 30',
      paymentStatus: 'Sent / Pending Payment',
      agingBucket: 'Current',
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[11px]">
            <Receipt className="h-4 w-4" />
            <span>Accounts Payable &amp; Accounts Receivable Ledger</span>
          </div>
          <h1 className="text-xl font-black text-white">Invoicing, AP &amp; AR Operations</h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>+ Create Invoice / Bill</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* AR Receivables */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] uppercase font-bold">Open AR (Customer Invoices)</span>
            <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">${totalArReceivables.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500">{arInvoices.length} total customer billings</div>
        </div>

        {/* AP Payables */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] uppercase font-bold">Open AP (Supplier Bills)</span>
            <ArrowUpRight className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">${totalApPayables.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500">{apBills.length} steel &amp; gas vendor bills</div>
        </div>

        {/* Overdue */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] uppercase font-bold">Overdue Invoices</span>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400">${totalOverdueAr.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500">Requires follow-up</div>
        </div>

      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'all' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Ledgers ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab('ar_receivables')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'ar_receivables' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Invoices Sent (AR)
          </button>
          <button
            onClick={() => setActiveTab('ap_payables')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'ap_payables' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Bills Received (AP)
          </button>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex-1 max-w-sm">
          <Search className="h-4 w-4 text-amber-400 shrink-0" />
          <input
            type="text"
            placeholder="Search Invoice #, Client, Supplier, Job #..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold">
              <th className="p-3">Type</th>
              <th className="p-3">Invoice / Bill #</th>
              <th className="p-3">Counterparty (Client / Supplier)</th>
              <th className="p-3">Job / PO #</th>
              <th className="p-3">Due Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3 text-right">Balance Due</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredInvoices.map((inv) => {
              const isAR = inv.type === 'AR_Invoice';
              const isPaid = inv.paymentStatus === 'Paid in Full';
              return (
                <tr key={inv.invoiceNumber} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      isAR
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                    }`}>
                      {isAR ? 'AR (Client)' : 'AP (Supplier)'}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-amber-400">{inv.invoiceNumber}</td>
                  <td className="p-3 font-bold text-slate-100">{inv.counterpartyName}</td>
                  <td className="p-3 font-mono text-slate-400">
                    {inv.linkedJobNumber || inv.linkedPoNumber || 'N/A'}
                  </td>
                  <td className="p-3 text-slate-300">{inv.dueDate}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      isPaid
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : inv.paymentStatus === 'Overdue'
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {inv.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono text-slate-200">${inv.totalAmount.toFixed(2)}</td>
                  <td className="p-3 text-right font-mono font-black text-emerald-400">
                    ${inv.balanceDue.toFixed(2)}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedInvoiceForPrint(inv)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                        title="Print Invoice / Bill"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                      {!isPaid && (
                        <button
                          onClick={() => handleOpenPayment(inv)}
                          className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-[10px]"
                        >
                          Record Pay
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Record Payment Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="font-bold text-white text-sm">RECORD PAYMENT TRANSACTION</div>
              <button onClick={() => setPayingInvoice(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleConfirmPayment} className="p-6 space-y-4">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-amber-400">{payingInvoice.invoiceNumber}</div>
                <div className="text-[11px] text-slate-300">Counterparty: <strong>{payingInvoice.counterpartyName}</strong></div>
                <div className="text-[11px] text-emerald-400 font-bold">Balance Due: ${payingInvoice.balanceDue.toFixed(2)}</div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Payment Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  max={payingInvoice.balanceDue}
                  value={payAmount}
                  onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-bold text-sm focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                >
                  <option value="ACH Direct Debit (Bluevine)">ACH Direct Debit (Bluevine)</option>
                  <option value="Commercial Credit Card">Commercial Credit Card</option>
                  <option value="Wire Transfer">Wire Transfer</option>
                  <option value="Physical Check">Physical Check</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black hover:bg-emerald-400 shadow"
                >
                  Post Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Invoice Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="font-bold text-white text-sm">CREATE NEW INVOICE / BILL</div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Ledger Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-bold focus:outline-none"
                  >
                    <option value="AR_Invoice">Customer Invoice (AR)</option>
                    <option value="AP_Bill">Supplier Bill (AP)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Counterparty</label>
                  <input
                    type="text"
                    value={newCounterparty}
                    onChange={(e) => setNewCounterparty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Subtotal ($)</label>
                  <input
                    type="number"
                    value={newSubtotal}
                    onChange={(e) => setNewSubtotal(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Freight ($)</label>
                  <input
                    type="number"
                    value={newFreight}
                    onChange={(e) => setNewFreight(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400 shadow"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      <PrintableInvoiceModal
        invoice={selectedInvoiceForPrint}
        isOpen={Boolean(selectedInvoiceForPrint)}
        onClose={() => setSelectedInvoiceForPrint(null)}
      />

    </div>
  );
};
