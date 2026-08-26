// src/erp/screens/ErpPurchaseOrdersScreen.tsx
// Supplier Management & Purchase Order Issuance Hub for IPG

import React, { useState } from 'react';
import { useErp } from '../context/ErpContext';
import {
  Truck,
  Plus,
  Search,
  Building,
  Printer,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  Send,
  X
} from 'lucide-react';
import { SupplierProfile, ErpPurchaseOrder } from '../../types';
import { PrintablePoModal } from '../components/PrintablePoModal';

export const ErpPurchaseOrdersScreen: React.FC = () => {
  const {
    suppliers,
    addSupplier,
    purchaseOrders,
    addPurchaseOrder,
    updatePurchaseOrderStatus,
    workOrders,
  } = useErp();

  const [activeTab, setActiveTab] = useState<'pos' | 'suppliers'>('pos');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedPoForPrint, setSelectedPoForPrint] = useState<ErpPurchaseOrder | null>(null);
  const [isNewPoModalOpen, setIsNewPoModalOpen] = useState(false);
  const [isNewSupplierModalOpen, setIsNewSupplierModalOpen] = useState(false);

  // New PO State
  const [poSupplierId, setPoSupplierId] = useState(suppliers[0]?.id || '');
  const [poCategory, setPoCategory] = useState<ErpPurchaseOrder['category']>('Raw Steel Plate');
  const [poItemDesc, setPoItemDesc] = useState('ASME SA-516 Gr. 70 Plate 0.500" x 96" x 240"');
  const [poItemQty, setPoItemQty] = useState(2);
  const [poItemUom, setPoItemUom] = useState('Plates');
  const [poItemUnitPrice, setPoItemUnitPrice] = useState(1480.0);
  const [poExpectedHeat, setPoExpectedHeat] = useState('M7782-A');
  const [poTargetJob, setPoTargetJob] = useState(workOrders[0]?.jobNumber || '');
  const [poSpecialInstructions, setPoSpecialInstructions] = useState('Include 2 copies of ASME Section VIII MTRs.');

  // New Supplier State
  const [suppName, setSuppName] = useState('');
  const [suppCategory, setSuppCategory] = useState<SupplierProfile['category']>('Steel Plate & Pipe Mill');
  const [suppContact, setSuppContact] = useState('');
  const [suppEmail, setSuppEmail] = useState('');
  const [suppPhone, setSuppPhone] = useState('');
  const [suppAddress, setSuppAddress] = useState('');
  const [suppTerms, setSuppTerms] = useState<SupplierProfile['paymentTerms']>('Net 30');

  const filteredPos = purchaseOrders.filter((p) => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return true;
    return (
      p.poNumber.toLowerCase().includes(q) ||
      p.supplierName.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q) ||
      p.items.some((i) => i.description.toLowerCase().includes(q))
    );
  });

  const filteredSuppliers = suppliers.filter((s) => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.contactPerson.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    );
  });

  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find((s) => s.id === poSupplierId) || suppliers[0];
    const itemTotal = poItemQty * poItemUnitPrice;
    const freight = 185.0;

    const poNumber = addPurchaseOrder({
      supplierId: sup.id,
      supplierName: sup.name,
      category: poCategory,
      paymentTerms: sup.paymentTerms,
      items: [
        {
          id: `PO-ITEM-${Date.now()}`,
          description: poItemDesc,
          quantity: poItemQty,
          unitOfMeasure: poItemUom,
          unitPrice: poItemUnitPrice,
          totalPrice: itemTotal,
          expectedHeatNumber: poExpectedHeat,
          targetJobNumber: poTargetJob,
          receivedQuantity: 0,
        }
      ],
      subtotal: itemTotal,
      taxAmount: 0,
      freightAmount: freight,
      totalAmount: itemTotal + freight,
      status: 'Issued to Vendor',
      specialInstructions: poSpecialInstructions,
    });

    setIsNewPoModalOpen(false);
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suppName) return;

    addSupplier({
      id: `SUPP-${Date.now()}`,
      name: suppName,
      category: suppCategory,
      contactPerson: suppContact,
      email: suppEmail,
      phone: suppPhone,
      address: suppAddress,
      paymentTerms: suppTerms,
      leadTimeAvgDays: 2,
      isoCertified: true,
      rating: 5,
    });

    setIsNewSupplierModalOpen(false);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[11px]">
            <Truck className="h-4 w-4" />
            <span>Procurement &amp; Material Sourcing</span>
          </div>
          <h1 className="text-xl font-black text-white">Purchase Orders &amp; Supplier Directory</h1>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('pos')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'pos' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Purchase Orders ({purchaseOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'suppliers' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Suppliers ({suppliers.length})
            </button>
          </div>

          {activeTab === 'pos' ? (
            <button
              onClick={() => setIsNewPoModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Issue Material PO</span>
            </button>
          ) : (
            <button
              onClick={() => setIsNewSupplierModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>+ Add Supplier</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Filter */}
      <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <Search className="h-4 w-4 text-amber-400 shrink-0" />
        <input
          type="text"
          placeholder={activeTab === 'pos' ? 'Search PO #, Supplier Name, Material Description...' : 'Search Supplier Name, Contact Person, Email...'}
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* TAB 1: PURCHASE ORDERS LIST */}
      {activeTab === 'pos' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold">
                <th className="p-3">PO #</th>
                <th className="p-3">Supplier Name</th>
                <th className="p-3">Category / Material Items</th>
                <th className="p-3">Order Date</th>
                <th className="p-3">Delivery Status</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Total Amount</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredPos.map((po) => (
                <tr key={po.poNumber} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-black text-amber-400">{po.poNumber}</td>
                  <td className="p-3 font-bold text-slate-100">{po.supplierName}</td>
                  <td className="p-3">
                    <div className="text-slate-200 truncate max-w-sm">
                      {po.items.map(i => `${i.quantity} ${i.unitOfMeasure} - ${i.description}`).join('; ')}
                    </div>
                    {po.items[0]?.expectedHeatNumber && (
                      <div className="text-[10px] text-amber-400 font-mono">
                        Exp HT: {po.items[0].expectedHeatNumber}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-slate-300">{po.orderDate}</td>
                  <td className="p-3">
                    <span className="text-[11px] text-emerald-400 font-bold">
                      {po.deliveryStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      po.status === 'Received & Fulfilled'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-100">
                    ${po.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setSelectedPoForPrint(po)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                      title="Print Official PO"
                    >
                      <Printer className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: SUPPLIERS DIRECTORY */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuppliers.map((supp) => {
            const supplierPos = purchaseOrders.filter((p) => p.supplierId === supp.id);
            const totalSpend = supplierPos.reduce((sum, p) => sum + p.totalAmount, 0);

            return (
              <div key={supp.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-white text-sm">{supp.name}</div>
                    <span className="text-[10px] text-amber-400 font-semibold">{supp.category}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold text-[10px] border border-slate-700">
                    {supp.paymentTerms}
                  </span>
                </div>

                <div className="space-y-1 text-[11px] text-slate-300">
                  <div>👤 Contact: <strong>{supp.contactPerson}</strong></div>
                  <div>✉️ {supp.email} &bull; 📞 {supp.phone}</div>
                  <div className="text-slate-400">📍 {supp.address}</div>
                </div>

                {supp.notes && (
                  <p className="text-[10px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    {supp.notes}
                  </p>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-[11px]">
                  <span className="text-slate-400">PO Orders: <strong className="text-slate-200">{supplierPos.length}</strong></span>
                  <span className="text-slate-400">Spend: <strong className="text-emerald-400">${totalSpend.toLocaleString()}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Issue PO Modal */}
      {isNewPoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="font-bold text-white text-sm">ISSUE SUPPLIER PURCHASE ORDER</div>
              <button onClick={() => setIsNewPoModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreatePo} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Select Supplier</label>
                <select
                  value={poSupplierId}
                  onChange={(e) => setPoSupplierId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-bold focus:outline-none"
                  required
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Item Description &amp; Material Spec</label>
                <input
                  type="text"
                  value={poItemDesc}
                  onChange={(e) => setPoItemDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={poItemQty}
                    onChange={(e) => setPoItemQty(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    value={poItemUnitPrice}
                    onChange={(e) => setPoItemUnitPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Expected HT#</label>
                  <input
                    type="text"
                    value={poExpectedHeat}
                    onChange={(e) => setPoExpectedHeat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-amber-400 font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Target Work Order (Job #)</label>
                <select
                  value={poTargetJob}
                  onChange={(e) => setPoTargetJob(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                >
                  <option value="">Stock Inventory (General)</option>
                  {workOrders.map((wo) => (
                    <option key={wo.jobNumber} value={wo.jobNumber}>{wo.jobNumber} - {wo.clientCompanyName}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewPoModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400 shadow"
                >
                  Generate PO Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {isNewSupplierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="font-bold text-white text-sm">ADD NEW SUPPLIER / VENDOR</div>
              <button onClick={() => setIsNewSupplierModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSupplier} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Triple-S Steel Houston"
                  value={suppName}
                  onChange={(e) => setSuppName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-bold focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Category</label>
                  <select
                    value={suppCategory}
                    onChange={(e) => setSuppCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="Steel Plate & Pipe Mill">Steel Plate &amp; Pipe Mill</option>
                    <option value="Structural Distributor">Structural Distributor</option>
                    <option value="Laser / Plasma Gas">Laser / Plasma Gas</option>
                    <option value="Consumables & Hardware">Consumables &amp; Hardware</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Payment Terms</label>
                  <select
                    value={suppTerms}
                    onChange={(e) => setSuppTerms(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="Net 30">Net 30</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Wire / ACH">Wire / ACH</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={suppContact}
                    onChange={(e) => setSuppContact(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Email</label>
                  <input
                    type="email"
                    value={suppEmail}
                    onChange={(e) => setSuppEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Physical Address</label>
                <input
                  type="text"
                  placeholder="Street, City, State ZIP"
                  value={suppAddress}
                  onChange={(e) => setSuppAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewSupplierModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400 shadow"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable PO Modal */}
      <PrintablePoModal
        po={selectedPoForPrint}
        isOpen={Boolean(selectedPoForPrint)}
        onClose={() => setSelectedPoForPrint(null)}
      />

    </div>
  );
};
