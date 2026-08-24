// src/operations/components/SupplierPoGenerator.tsx
// Supplier Master Steel Plate & Laser Assist Gas (LN2/O2) Purchase Order Engine

import React, { useState } from 'react';
import { SupplierPO, GasTankTelemetry, MaterialCode } from '../../types';
import { STEEL_SUPPLIERS, GAS_SUPPLIERS, INITIAL_GAS_TELEMETRY, INITIAL_SUPPLIER_POS } from '../data/supplierData';
import { MATERIALS } from '../../data/masterGeometry';
import {
  Factory,
  Flame,
  Truck,
  FileText,
  Printer,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Send,
  Download,
  ShieldCheck,
  Zap,
  Gauge,
  X
} from 'lucide-react';

export const SupplierPoGenerator: React.FC = () => {
  const [poList, setPoList] = useState<SupplierPO[]>(INITIAL_SUPPLIER_POS);
  const [gasTelemetry, setGasTelemetry] = useState<GasTankTelemetry[]>(INITIAL_GAS_TELEMETRY);
  const [selectedPo, setSelectedPo] = useState<SupplierPO | null>(null);
  const [isNewPlatePoModalOpen, setIsNewPlatePoModalOpen] = useState(false);
  const [isGasOrderModalOpen, setIsGasOrderModalOpen] = useState(false);
  const [selectedGasType, setSelectedGasType] = useState<string>('Liquid Nitrogen (LN2)');

  // New Plate PO Form State
  const [supplierName, setSupplierName] = useState(STEEL_SUPPLIERS[0].name);
  const [plateMatCode, setPlateMatCode] = useState<MaterialCode>('SA-516-70');
  const [plateThk, setPlateThk] = useState(0.500);
  const [plateWidth, setPlateWidth] = useState(96);
  const [plateLength, setPlateLength] = useState(240);
  const [plateQty, setPlateQty] = useState(2);
  const [pricePerLb, setPricePerLb] = useState(2.15);

  const matConfig = MATERIALS[plateMatCode] || MATERIALS['SA-516-70'];
  const singlePlateAreaSqFt = (plateWidth * plateLength) / 144;
  const singlePlateWeightLbs = Math.round(singlePlateAreaSqFt * matConfig.density1InchSqFt * plateThk * 10) / 10;
  const totalWeightLbs = Math.round(singlePlateWeightLbs * plateQty);
  const totalCost = Math.round(totalWeightLbs * pricePerLb * 100) / 100;

  const handleCreatePlatePo = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = STEEL_SUPPLIERS.find((s) => s.name === supplierName) || STEEL_SUPPLIERS[0];
    const newPo: SupplierPO = {
      poNumber: `PO-STEEL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierName: sup.name,
      supplierContact: sup.contactPerson,
      supplierEmail: sup.email,
      orderDate: new Date().toISOString().split('T')[0],
      requestedDeliveryDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      category: 'Master Steel Plate',
      items: [
        {
          id: `POI-${Date.now()}`,
          materialCode: plateMatCode,
          asmeSpec: matConfig.shortSpec,
          thickness: plateThk,
          thicknessLabel: `${plateThk}" (${matConfig.name})`,
          widthInches: plateWidth,
          lengthInches: plateLength,
          quantity: plateQty,
          unitWeightLbs: singlePlateWeightLbs,
          totalWeightLbs: totalWeightLbs,
          pricePerLb: pricePerLb,
          totalCost: totalCost,
        }
      ],
      totalAmount: totalCost,
      status: 'Confirmed',
      deliveryStatus: 'Order Transmitted to Steel Service Center',
      requireMTR: true,
      destination: 'Iron Prairie Fabrication Group LLC, Freeport, TX 77541',
      specialInstructions: 'Mandatory: Full ASME Section VIII Div 1 CMTR certified chemistry/mechanical and Buy American Act compliance required with shipment.',
    };

    setPoList([newPo, ...poList]);
    setIsNewPlatePoModalOpen(false);
    setSelectedPo(newPo);
  };

  const handleCreateGasPo = (gasType: string) => {
    const newGasPo: SupplierPO = {
      poNumber: `PO-GAS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierName: 'Airgas USA LLC (Freeport Branch)',
      supplierContact: 'Travis Sterling (Bulk Gas Dispatch)',
      supplierEmail: 'freeport.bulk@airgas.com',
      orderDate: new Date().toISOString().split('T')[0],
      requestedDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      category: 'Laser Assist Gas',
      items: [
        {
          id: `POG-${Date.now()}`,
          materialCode: 'SA-36',
          asmeSpec: gasType === 'Liquid Nitrogen (LN2)' ? 'Liquid Nitrogen MicroBulk Bulkhead Fill (99.999% Purity)' : 'High-Purity Laser Assist Oxygen Pack (3000 PSI)',
          thickness: 0,
          thicknessLabel: 'Gas Bulk',
          widthInches: 0,
          lengthInches: 0,
          quantity: gasType === 'Liquid Nitrogen (LN2)' ? 1000 : 16,
          unitWeightLbs: 1,
          totalWeightLbs: 1000,
          pricePerLb: gasType === 'Liquid Nitrogen (LN2)' ? 1.65 : 45.0,
          totalCost: gasType === 'Liquid Nitrogen (LN2)' ? 1650.00 : 720.00,
        }
      ],
      totalAmount: gasType === 'Liquid Nitrogen (LN2)' ? 1650.00 : 720.00,
      status: 'Sent to Vendor',
      deliveryStatus: 'Scheduled Delivery to Freeport Gas Pad',
      requireMTR: false,
      destination: 'North Laser Bulkhead Gas Pad, Freeport, TX',
      specialInstructions: 'Delivery driver must check in with Russell or Shop Foreman prior to fill.',
    };

    setPoList([newGasPo, ...poList]);
    setIsGasOrderModalOpen(false);
    setSelectedPo(newGasPo);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <Factory className="h-6 w-6 text-amber-400" />
            <h1 className="text-2xl font-black text-slate-100 tracking-tight font-display">
              Supplier Material &amp; Laser Assist Gas Procurement
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Automated master plate procurement orders (96" x 240") and real-time cryogenic liquid nitrogen (LN2) / oxygen tank level replenishment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewPlatePoModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 text-xs transition-all shadow-md active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>+ Master Plate Steel PO</span>
          </button>
        </div>
      </div>

      {/* Laser Assist Gas Telemetry Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
            <Gauge className="h-4 w-4 text-sky-400" />
            Laser Assist Gas Bulk Telemetry &amp; Tank Monitoring
          </h2>
          <span className="text-xs text-slate-500 font-mono">Live Monitoring &bull; Freeport Shop Pad</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gasTelemetry.map((gas, idx) => {
            const isWarning = gas.currentLevelPct <= gas.reorderThresholdPct;

            return (
              <div
                key={idx}
                className={`rounded-2xl border p-5 space-y-4 shadow-lg transition-all ${
                  isWarning
                    ? 'border-rose-500/60 bg-rose-950/20 ring-1 ring-rose-500/30'
                    : 'border-slate-800 bg-slate-900/90'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold font-mono text-slate-400">{gas.supplier}</div>
                    <h3 className="text-sm font-black text-slate-100 mt-0.5">{gas.gasType}</h3>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{gas.tankCapacity}</div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isWarning
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}
                  >
                    {gas.currentLevelPct}% Tank Level
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isWarning ? 'bg-rose-500' : 'bg-sky-500'
                      }`}
                      style={{ width: `${gas.currentLevelPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Pressure: <strong>{gas.currentPsi} PSI</strong></span>
                    <span>Est: <strong>{gas.estimatedDaysRemaining} Days Left</strong></span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400 truncate max-w-[170px]">
                    {gas.dailyConsumptionAvg}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedGasType(gas.gasType);
                      setIsGasOrderModalOpen(true);
                    }}
                    className="flex items-center gap-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 text-xs font-bold transition-all shadow"
                  >
                    <Send className="h-3 w-3" />
                    <span>Order Refill</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supplier Purchase Orders History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
            <Truck className="h-4 w-4 text-amber-400" />
            Active &amp; Recent Supplier Purchase Orders ({poList.length})
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Delivery Date</th>
                <th className="py-3 px-4">Total Value</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {poList.map((po) => (
                <tr key={po.poNumber} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-amber-400">{po.poNumber}</td>
                  <td className="py-3 px-4">{po.category}</td>
                  <td className="py-3 px-4 font-bold text-slate-100">{po.supplierName}</td>
                  <td className="py-3 px-4 text-slate-400">{po.orderDate}</td>
                  <td className="py-3 px-4 text-slate-300">{po.requestedDeliveryDate}</td>
                  <td className="py-3 px-4 font-bold text-emerald-400">${po.totalAmount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950 border border-slate-700 text-slate-300">
                      {po.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedPo(po)}
                      className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-[11px] font-bold text-slate-200 hover:bg-slate-700 ml-auto"
                    >
                      <FileText className="h-3 w-3 text-amber-400" />
                      <span>View PO</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Printable PO Modal */}
      {selectedPo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
          <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden print:m-0 print:border-none print:bg-white print:p-0 print:text-black">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4 print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-slate-100">
                  Purchase Order Manifest &bull; <span className="font-mono text-amber-400">{selectedPo.poNumber}</span>
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print PO</span>
                </button>
                <button onClick={() => setSelectedPo(null)} className="p-1 text-slate-400 hover:text-slate-200">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Printable Body */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6 font-mono text-xs text-slate-200 print:text-black print:p-0">
              
              <div className="flex justify-between items-start pb-4 border-b-2 border-slate-800 print:border-black">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-amber-400 print:text-black">
                    IRON PRAIRIE FABRICATION GROUP LLC
                  </div>
                  <div className="text-base font-black text-white print:text-black mt-0.5">
                    MATERIAL PURCHASE ORDER
                  </div>
                  <div className="text-[11px] text-slate-400 print:text-gray-600">
                    2301 N Brazosport Blvd, Freeport, TX 77541 &bull; (979) 248-9266
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">PO Number</div>
                  <div className="text-base font-black text-amber-400 print:text-black">{selectedPo.poNumber}</div>
                  <div className="text-[10px] text-slate-400">Date: {selectedPo.orderDate}</div>
                </div>
              </div>

              {/* Vendor & Ship-To */}
              <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 print:bg-gray-50 print:border-gray-300">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Vendor / Supplier</span>
                  <div className="font-bold text-slate-100 print:text-black">{selectedPo.supplierName}</div>
                  <div className="text-[11px] text-slate-400 print:text-gray-700">Attn: {selectedPo.supplierContact}</div>
                  <div className="text-[11px] text-slate-400 print:text-gray-700">{selectedPo.supplierEmail}</div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Ship-To Facility</span>
                  <div className="font-bold text-slate-100 print:text-black">{selectedPo.destination}</div>
                  <div className="text-[11px] text-slate-400 print:text-gray-700">Required By: <strong>{selectedPo.requestedDeliveryDate}</strong></div>
                  <div className="text-[11px] text-emerald-400 print:text-black">Receiving Gate: Main Material Yard (Gate 1)</div>
                </div>
              </div>

              {/* Line Items */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 print:border-gray-300">
                <table className="w-full text-center text-xs">
                  <thead className="bg-slate-900 text-[10px] font-bold text-slate-400 uppercase print:bg-gray-200 print:text-black">
                    <tr>
                      <th className="py-2.5 px-3 text-left">Item Description &amp; ASME Spec</th>
                      <th className="py-2.5 px-2">Dimensions</th>
                      <th className="py-2.5 px-2">Qty</th>
                      <th className="py-2.5 px-2">Weight (lbs)</th>
                      <th className="py-2.5 px-2">Rate</th>
                      <th className="py-2.5 px-3 text-right">Extended Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200 print:divide-gray-300 print:text-black">
                    {selectedPo.items.map((it) => (
                      <tr key={it.id}>
                        <td className="py-2.5 px-3 text-left font-bold text-slate-100 print:text-black">
                          {it.asmeSpec} ({it.materialCode})
                        </td>
                        <td className="py-2.5 px-2">
                          {it.widthInches > 0 ? `${it.widthInches}" x ${it.lengthInches}" x ${it.thickness}"` : 'Bulkhead Tank Fill'}
                        </td>
                        <td className="py-2.5 px-2 font-bold">{it.quantity}</td>
                        <td className="py-2.5 px-2">{it.totalWeightLbs.toLocaleString()}</td>
                        <td className="py-2.5 px-2">${it.pricePerLb.toFixed(2)}/lb</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-400 print:text-black">
                          ${it.totalCost.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800 print:bg-gray-50 print:border-gray-300">
                <div className="text-[11px] text-slate-400 print:text-gray-600 max-w-md">
                  {selectedPo.specialInstructions || 'Commercial standard terms.'}
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Total Purchase Order Value</div>
                  <div className="text-lg font-black text-emerald-400 print:text-black">
                    ${selectedPo.totalAmount.toLocaleString()}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* New Master Plate PO Modal */}
      {isNewPlatePoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
          <div className="relative flex w-full max-w-lg flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Plus className="h-4 w-4 text-amber-400" />
                Generate Master Plate Steel PO
              </h3>
              <button onClick={() => setIsNewPlatePoModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlatePo} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Steel Supplier / Distributor</label>
                <select
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                >
                  {STEEL_SUPPLIERS.map((s) => (
                    <option key={s.id} value={s.name}>{s.name} ({s.cityState})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Material Metallurgy</label>
                  <select
                    value={plateMatCode}
                    onChange={(e) => setPlateMatCode(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="SA-516-70">SA-516 Gr. 70 (Boiler PVQ)</option>
                    <option value="SA-36">SA-36 (Structural Carbon)</option>
                    <option value="304L">304/304L Stainless</option>
                    <option value="316L">316L Moly Stainless</option>
                    <option value="AL-6061">AL-6061-T6 Aluminum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Thickness (Inches)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={plateThk}
                    onChange={(e) => setPlateThk(parseFloat(e.target.value) || 0.25)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Width (in)</label>
                  <input
                    type="number"
                    value={plateWidth}
                    onChange={(e) => setPlateWidth(parseInt(e.target.value) || 96)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Length (in)</label>
                  <input
                    type="number"
                    value={plateLength}
                    onChange={(e) => setPlateLength(parseInt(e.target.value) || 240)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Plates (Qty)</label>
                  <input
                    type="number"
                    min="1"
                    value={plateQty}
                    onChange={(e) => setPlateQty(parseInt(e.target.value) || 1)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-slate-100 focus:border-amber-500 focus:outline-none font-bold text-amber-400"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Single Plate Weight:</span>
                  <span className="text-slate-200 font-bold">{singlePlateWeightLbs.toLocaleString()} lbs</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Order Weight:</span>
                  <span className="text-slate-200 font-bold">{totalWeightLbs.toLocaleString()} lbs</span>
                </div>
                <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                  <span className="text-amber-400 font-bold">Estimated Cost (@ ${pricePerLb}/lb):</span>
                  <span className="text-emerald-400 font-black">${totalCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewPlatePoModalOpen(false)}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-5 py-2 font-bold text-slate-950 hover:bg-amber-400 transition-all shadow"
                >
                  Generate &amp; Dispatch PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gas Refill Modal */}
      {isGasOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
          <div className="relative flex w-full max-w-md flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Flame className="h-4 w-4 text-sky-400" />
                Order Laser Assist Gas Replenishment
              </h3>
              <button onClick={() => setIsGasOrderModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-slate-300">
                Generate immediate replenishment purchase order to <strong>Airgas Freeport Branch</strong> for delivery to North Laser Pad.
              </p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="text-slate-400">Selected Gas: <strong className="text-slate-100">{selectedGasType}</strong></div>
                <div className="text-slate-400">Standard Delivery: <strong className="text-emerald-400">Within 24-48 Hours</strong></div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setIsGasOrderModalOpen(false)}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCreateGasPo(selectedGasType)}
                  className="rounded-lg bg-sky-600 px-5 py-2 font-bold text-white hover:bg-sky-500 transition-all shadow"
                >
                  Transmit Gas PO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
