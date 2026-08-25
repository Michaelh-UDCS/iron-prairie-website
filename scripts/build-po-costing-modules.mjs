import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function writeSrc(relPath, content) {
  const fullPath = path.join(rootDir, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log('✓ Created ' + relPath);
}

// ============================================================================
// 1. src/operations/components/SupplierPoGenerator.tsx
// ============================================================================
const supplierPoContent = `// src/operations/components/SupplierPoGenerator.tsx
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
      poNumber: \`PO-STEEL-2026-\${Math.floor(1000 + Math.random() * 9000)}\`,
      supplierName: sup.name,
      supplierContact: sup.contactPerson,
      supplierEmail: sup.email,
      orderDate: new Date().toISOString().split('T')[0],
      requestedDeliveryDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      category: 'Master Steel Plate',
      items: [
        {
          id: \`POI-\${Date.now()}\`,
          materialCode: plateMatCode,
          asmeSpec: matConfig.shortSpec,
          thickness: plateThk,
          thicknessLabel: \`\${plateThk}" (\${matConfig.name})\`,
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
      destination: 'Iron Prairie Fabrication Group LLC, Texas',
      specialInstructions: 'Mandatory: Full ASME Section VIII Div 1 CMTR certified chemistry/mechanical and Buy American Act compliance required with shipment.',
    };

    setPoList([newPo, ...poList]);
    setIsNewPlatePoModalOpen(false);
    setSelectedPo(newPo);
  };

  const handleCreateGasPo = (gasType: string) => {
    const newGasPo: SupplierPO = {
      poNumber: \`PO-GAS-2026-\${Math.floor(1000 + Math.random() * 9000)}\`,
      supplierName: 'Airgas USA LLC (Texas Branch)',
      supplierContact: 'Travis Sterling (Bulk Gas Dispatch)',
      supplierEmail: 'texas.bulk@airgas.com',
      orderDate: new Date().toISOString().split('T')[0],
      requestedDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      category: 'Laser Assist Gas',
      items: [
        {
          id: \`POG-\${Date.now()}\`,
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
      deliveryStatus: 'Scheduled Delivery to Shop Gas Pad',
      requireMTR: false,
      destination: 'North Laser Bulkhead Gas Pad, Texas Shop',
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
            Automated master plate procurement orders ($96" \times 240"$) and real-time cryogenic liquid nitrogen ($LN_2$) / oxygen tank level replenishment.
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
          <span className="text-xs text-slate-500 font-mono">Live Monitoring &bull; Texas Shop Pad</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gasTelemetry.map((gas, idx) => {
            const isWarning = gas.currentLevelPct <= gas.reorderThresholdPct;

            return (
              <div
                key={idx}
                className={\`rounded-2xl border p-5 space-y-4 shadow-lg transition-all \${
                  isWarning
                    ? 'border-rose-500/60 bg-rose-950/20 ring-1 ring-rose-500/30'
                    : 'border-slate-800 bg-slate-900/90'
                }\`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold font-mono text-slate-400">{gas.supplier}</div>
                    <h3 className="text-sm font-black text-slate-100 mt-0.5">{gas.gasType}</h3>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{gas.tankCapacity}</div>
                  </div>
                  <span
                    className={\`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold \${
                      isWarning
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }\`}
                  >
                    {gas.currentLevelPct}% Tank Level
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={\`h-full rounded-full transition-all \${
                        isWarning ? 'bg-rose-500' : 'bg-sky-500'
                      }\`}
                      style={{ width: \`\${gas.currentLevelPct}%\` }}
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
                  <td className="py-3 px-4 font-bold text-emerald-400">\${po.totalAmount.toLocaleString()}</td>
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
                    Texas &bull; (979) 248-9266
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
                          {it.widthInches > 0 ? \`\${it.widthInches}" x \${it.lengthInches}" x \${it.thickness}"\` : 'Bulkhead Tank Fill'}
                        </td>
                        <td className="py-2.5 px-2 font-bold">{it.quantity}</td>
                        <td className="py-2.5 px-2">{it.totalWeightLbs.toLocaleString()}</td>
                        <td className="py-2.5 px-2">\${it.pricePerLb.toFixed(2)}/lb</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-400 print:text-black">
                          \${it.totalCost.toLocaleString()}
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
                    \${selectedPo.totalAmount.toLocaleString()}
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
                  <span className="text-amber-400 font-bold">Estimated Cost (@ \${pricePerLb}/lb):</span>
                  <span className="text-emerald-400 font-black">\${totalCost.toLocaleString()}</span>
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
                Generate immediate replenishment purchase order to <strong>Airgas Texas Branch</strong> for delivery to North Laser Pad.
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
`;

writeSrc('src/operations/components/SupplierPoGenerator.tsx', supplierPoContent);

// ============================================================================
// 2. src/operations/components/JobCostingTracker.tsx
// ============================================================================
const jobCostingContent = `// src/operations/components/JobCostingTracker.tsx
// Real-Time Job Costing, COGS & Gross Margin Profitability Engine

import React, { useMemo } from 'react';
import { CustomerOrder, PricingConfig, JobCosting } from '../../types';
import { DEFAULT_PRICING_CONFIG, MATERIALS, LABOR_HOURS } from '../../data/masterGeometry';
import {
  DollarSign,
  TrendingUp,
  Percent,
  PieChart,
  BarChart3,
  Flame,
  Wrench,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface JobCostingTrackerProps {
  orders: CustomerOrder[];
  pricingConfig: PricingConfig;
}

export const JobCostingTracker: React.FC<JobCostingTrackerProps> = ({ orders, pricingConfig }) => {
  // Compute job costing for every order in the shop pipeline
  const costedOrders = useMemo(() => {
    return orders.map((order) => {
      let totalMaterialCost = 0;
      let totalLaserGasCost = 0;
      let totalMachineLaborCost = 0;

      order.items.forEach((item) => {
        const mat = MATERIALS[item.materialCode] || MATERIALS['SA-516-70'];
        let activePricePerLb = pricingConfig.sa516PricePerLb;
        if (item.materialCode === 'SA-36') activePricePerLb = pricingConfig.sa36PricePerLb;
        else if (item.materialCode === '304') activePricePerLb = pricingConfig.ss304PricePerLb;
        else if (item.materialCode === '304L') activePricePerLb = pricingConfig.ss304LPricePerLb;
        else if (item.materialCode === '316L') activePricePerLb = pricingConfig.ss316LPricePerLb;
        else if (item.materialCode === 'AL-6061') activePricePerLb = pricingConfig.alPricePerLb;

        // Raw material plate cost
        const matCost = item.adjustedWeightLbs * activePricePerLb * item.quantity;
        totalMaterialCost += matCost;

        // Laser assist gas cost (cut perimeter in inches * gas rate)
        const perimeterInches = Math.PI * item.od + (item.od * 0.25 + 6.0) * 2;
        const gasRate = pricingConfig.laserGasRatePerInch || 0.08;
        const gasCost = perimeterInches * gasRate * item.quantity;
        totalLaserGasCost += gasCost;

        // CNC Laser & Deburring shop labor
        const laborHrs = (LABOR_HOURS[item.nps] || 0.35) * item.quantity;
        const laborCost = laborHrs * pricingConfig.laborRatePerHour;
        totalMachineLaborCost += laborCost;
      });

      const freightCost = order.shippingCost || 35.0;
      const totalCogs = Math.round((totalMaterialCost + totalLaserGasCost + totalMachineLaborCost + freightCost) * 100) / 100;
      const netMarginDollars = Math.round((order.totalAmount - totalCogs) * 100) / 100;
      const netMarginPct = order.totalAmount > 0 ? Math.round((netMarginDollars / order.totalAmount) * 100) : 0;

      let profitHealth: 'High Margin' | 'Healthy' | 'Low Margin' | 'Loss' = 'Healthy';
      if (netMarginPct >= 45) profitHealth = 'High Margin';
      else if (netMarginPct >= 30) profitHealth = 'Healthy';
      else if (netMarginPct >= 15) profitHealth = 'Low Margin';
      else profitHealth = 'Loss';

      const costing: JobCosting = {
        orderId: order.orderId,
        invoicedRevenue: order.totalAmount,
        materialPlateCost: Math.round(totalMaterialCost * 100) / 100,
        laserAssistGasCost: Math.round(totalLaserGasCost * 100) / 100,
        machineLaborCost: Math.round(totalMachineLaborCost * 100) / 100,
        freightCost: freightCost,
        totalCogs: totalCogs,
        netMarginDollars: netMarginDollars,
        netMarginPct: netMarginPct,
        profitHealth: profitHealth,
      };

      return {
        ...order,
        costing,
      };
    });
  }, [orders, pricingConfig]);

  // Overall Financial Summary
  const summary = useMemo(() => {
    const totalRevenue = costedOrders.reduce((s, o) => s + o.costing.invoicedRevenue, 0);
    const totalCogs = costedOrders.reduce((s, o) => s + o.costing.totalCogs, 0);
    const totalGrossProfit = totalRevenue - totalCogs;
    const avgMarginPct = totalRevenue > 0 ? Math.round((totalGrossProfit / totalRevenue) * 100) : 0;

    const totalPlateCost = costedOrders.reduce((s, o) => s + o.costing.materialPlateCost, 0);
    const totalGasCost = costedOrders.reduce((s, o) => s + o.costing.laserAssistGasCost, 0);
    const totalLaborCost = costedOrders.reduce((s, o) => s + o.costing.machineLaborCost, 0);
    const totalFreightCost = costedOrders.reduce((s, o) => s + o.costing.freightCost, 0);

    return {
      totalRevenue,
      totalCogs,
      totalGrossProfit,
      avgMarginPct,
      totalPlateCost,
      totalGasCost,
      totalLaborCost,
      totalFreightCost,
    };
  }, [costedOrders]);

  return (
    <div className="space-y-6 pb-20 font-mono text-xs">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <DollarSign className="h-6 w-6 text-emerald-400" />
            <h1 className="text-2xl font-black text-slate-100 tracking-tight font-display font-sans">
              Job Costing, COGS &amp; Gross Margin Engine
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans">
            Real-time margin formula: $\\text{Net Margin} = \\text{Invoiced Revenue} - (\\text{Plate Cost} + \\text{Laser Assist Gas} + \\text{Labor} + \\text{Freight})$.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Average Shop Margin</span>
            <span className="text-lg font-black text-emerald-400">
              {summary.avgMarginPct}% Net Margin
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
          <div className="text-slate-400 text-[10px] font-bold uppercase">Total Invoiced Revenue</div>
          <div className="text-xl font-black text-slate-100 mt-1">\${summary.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{orders.length} Total Orders</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
          <div className="text-slate-400 text-[10px] font-bold uppercase">Total COGS (Plate + Gas + Labor)</div>
          <div className="text-xl font-black text-rose-400 mt-1">\${summary.totalCogs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{((summary.totalCogs / (summary.totalRevenue || 1)) * 100).toFixed(0)}% of Revenue</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
          <div className="text-slate-400 text-[10px] font-bold uppercase">Net Gross Profit</div>
          <div className="text-xl font-black text-emerald-400 mt-1">\${summary.totalGrossProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-[10px] text-emerald-500 mt-0.5">{summary.avgMarginPct}% Gross Margin</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
          <div className="text-slate-400 text-[10px] font-bold uppercase">Laser Assist Gas Cost</div>
          <div className="text-xl font-black text-sky-400 mt-1">\${summary.totalGasCost.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">LN2 &amp; O2 Assist</div>
        </div>
      </div>

      {/* COGS Breakdown Share Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between text-xs font-bold text-slate-200">
          <span>Cost of Goods Sold (COGS) Expense Share</span>
          <span className="text-slate-400">Total: \${summary.totalCogs.toFixed(2)}</span>
        </div>

        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-amber-500"
            title={\`Raw Steel Plate: \$\${summary.totalPlateCost.toFixed(0)}\`}
            style={{ width: \`\${(summary.totalPlateCost / (summary.totalCogs || 1)) * 100}%\` }}
          />
          <div
            className="h-full bg-sky-500"
            title={\`Shop Labor: \$\${summary.totalLaborCost.toFixed(0)}\`}
            style={{ width: \`\${(summary.totalLaborCost / (summary.totalCogs || 1)) * 100}%\` }}
          />
          <div
            className="h-full bg-indigo-500"
            title={\`Laser Gas: \$\${summary.totalGasCost.toFixed(0)}\`}
            style={{ width: \`\${(summary.totalGasCost / (summary.totalCogs || 1)) * 100}%\` }}
          />
          <div
            className="h-full bg-emerald-500"
            title={\`Freight: \$\${summary.totalFreightCost.toFixed(0)}\`}
            style={{ width: \`\${(summary.totalFreightCost / (summary.totalCogs || 1)) * 100}%\` }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500"></span> Steel Plate (\${summary.totalPlateCost.toFixed(0)})</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-500"></span> CNC Shop Labor (\${summary.totalLaborCost.toFixed(0)})</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-500"></span> Laser Assist Gas (\${summary.totalGasCost.toFixed(0)})</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Freight Dispatch (\${summary.totalFreightCost.toFixed(0)})</span>
        </div>
      </div>

      {/* Itemized Order Margin Table */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-emerald-400" />
          Itemized Job Margin Analysis
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">
          <table className="w-full text-center text-xs">
            <thead className="bg-slate-950 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 text-left">PO # &amp; Customer</th>
                <th className="py-3 px-2">Revenue</th>
                <th className="py-3 px-2">Steel Plate</th>
                <th className="py-3 px-2">Assist Gas</th>
                <th className="py-3 px-2">Labor</th>
                <th className="py-3 px-2">Freight</th>
                <th className="py-3 px-2">Total COGS</th>
                <th className="py-3 px-2">Gross Profit</th>
                <th className="py-3 px-3 text-right">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {costedOrders.map((order) => {
                const c = order.costing;

                return (
                  <tr key={order.orderId} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3 text-left">
                      <div className="font-bold text-amber-400">{order.poNumber}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{order.companyName}</div>
                    </td>
                    <td className="py-3 px-2 font-bold text-slate-100">\${c.invoicedRevenue.toFixed(2)}</td>
                    <td className="py-3 px-2 text-slate-300">\${c.materialPlateCost.toFixed(2)}</td>
                    <td className="py-3 px-2 text-slate-400">\${c.laserAssistGasCost.toFixed(2)}</td>
                    <td className="py-3 px-2 text-slate-300">\${c.machineLaborCost.toFixed(2)}</td>
                    <td className="py-3 px-2 text-slate-400">\${c.freightCost.toFixed(2)}</td>
                    <td className="py-3 px-2 font-bold text-rose-400">\${c.totalCogs.toFixed(2)}</td>
                    <td className="py-3 px-2 font-black text-emerald-400">\${c.netMarginDollars.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={\`px-2.5 py-0.5 rounded-full font-black text-[11px] \${
                          c.netMarginPct >= 45
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : c.netMarginPct >= 30
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }\`}
                      >
                        {c.netMarginPct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
`;

writeSrc('src/operations/components/JobCostingTracker.tsx', jobCostingContent);

// ============================================================================
// 3. src/operations/components/QuickbooksExportModal.tsx
// ============================================================================
const qbExportContent = `// src/operations/components/QuickbooksExportModal.tsx
// 1-Click QuickBooks Online & Desktop Accounting CSV / IIF Exporter

import React, { useState } from 'react';
import { CustomerOrder } from '../../types';
import { X, Download, FileSpreadsheet, CheckCircle2, Copy } from 'lucide-react';

interface QuickbooksExportModalProps {
  orders: CustomerOrder[];
  isOpen: boolean;
  onClose: () => void;
}

export const QuickbooksExportModal: React.FC<QuickbooksExportModalProps> = ({ orders, isOpen, onClose }) => {
  const [exportFormat, setExportFormat] = useState<'qbo_csv' | 'desktop_iif'>('qbo_csv');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate QBO CSV format
  const generateQboCsv = (): string => {
    const headers = [
      'InvoiceNo',
      'Customer',
      'InvoiceDate',
      'DueDate',
      'Terms',
      'Item',
      'ItemDescription',
      'ItemQuantity',
      'ItemRate',
      'ItemAmount',
      'ShippingAmount',
      'Taxable'
    ];

    const rows: string[][] = [];

    orders.forEach((order) => {
      order.items.forEach((item, idx) => {
        rows.push([
          order.poNumber,
          \`"\${order.companyName.replace(/"/g, '""')}"\`,
          order.createdAt.split(' ')[0] || new Date().toISOString().split('T')[0],
          order.scheduledShipDate,
          order.paymentMethod === 'Net 30 Commercial PO' ? 'Net 30' : 'Due on Receipt',
          item.partNumber,
          \`"\${item.nps} \${item.pressureClass}# \${item.materialCode} (\${item.thicknessLabel}) - Tag: \${item.handleStamp || 'N/A'}"\`,
          item.quantity.toString(),
          item.unitPrice.toFixed(2),
          (item.unitPrice * item.quantity).toFixed(2),
          idx === 0 ? order.shippingCost.toFixed(2) : '0.00',
          'NON'
        ]);
      });
    });

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\\n');
  };

  const csvContent = generateQboCsv();

  const handleDownload = () => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`Iron_Prairie_QuickBooks_Export_\${new Date().toISOString().split('T')[0]}.csv\`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(csvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md font-mono text-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl p-6 space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">
              QuickBooks Accounting Integration Export
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-slate-300">
            Export all <strong>{orders.length} active orders</strong> formatted for QuickBooks Online (QBO) Invoices or QuickBooks Desktop CSV Batch Import.
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setExportFormat('qbo_csv')}
              className={\`px-3 py-1.5 rounded-lg font-bold text-xs \${
                exportFormat === 'qbo_csv' ? 'bg-emerald-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400'
              }\`}
            >
              QuickBooks Online (QBO CSV)
            </button>
            <button
              onClick={() => setExportFormat('desktop_iif')}
              className={\`px-3 py-1.5 rounded-lg font-bold text-xs \${
                exportFormat === 'desktop_iif' ? 'bg-emerald-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400'
              }\`}
            >
              QuickBooks Desktop Format
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 max-h-56 overflow-y-auto font-mono text-[11px] text-slate-300 whitespace-pre">
            {csvContent}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 font-bold text-slate-200 hover:bg-slate-700"
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Raw CSV'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-5 py-2 font-bold text-slate-950 hover:bg-emerald-400 shadow active:scale-95"
            >
              <Download className="h-4 w-4" />
              <span>Download QuickBooks CSV</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
`;

writeSrc('src/operations/components/QuickbooksExportModal.tsx', qbExportContent);

console.log('✓ All Supplier PO, Job Costing & QuickBooks modules written successfully');

