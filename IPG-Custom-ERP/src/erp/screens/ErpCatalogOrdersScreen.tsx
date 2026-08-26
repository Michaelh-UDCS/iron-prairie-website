// src/erp/screens/ErpCatalogOrdersScreen.tsx
// Interactive ASME B16.48 Paddle Blind Catalog, 2D Dimension Visualizer, and Order Management for IPG

import React, { useState, useMemo } from 'react';
import { useErp } from '../context/ErpContext';
import {
  Layers,
  Sparkles,
  Search,
  SlidersHorizontal,
  CheckCircle2,
  ShieldCheck,
  ShoppingCart,
  Send,
  Eye,
  FileText,
  DollarSign
} from 'lucide-react';
import { NPSSize, PressureClass, MaterialCode } from '../../types';
import { MASTER_GEOMETRY, MATERIALS } from '../../data/masterGeometry';

export const ErpCatalogOrdersScreen: React.FC = () => {
  const { workOrders, simulateSalesEmailTrigger, setActiveModuleId } = useErp();

  // Configurator State
  const [selectedProductType, setSelectedProductType] = useState<'Paddle Blind' | 'Paddle Spacer' | 'Figure 8 (Spectacle)' | 'Bleeder Blind'>('Paddle Blind');
  const [nps, setNps] = useState<NPSSize>('4"');
  const [pressureClass, setPressureClass] = useState<PressureClass>(150);
  const [materialCode, setMaterialCode] = useState<MaterialCode>('SA-516-70');
  const [quantity, setQuantity] = useState(6);
  const [companyName, setCompanyName] = useState('ExxonMobil Baytown Complex');
  const [buyerName, setBuyerName] = useState('Travis Vance');
  const [poNumber, setPoNumber] = useState('PO-XOM-88492');
  const [orderSubmittedAlert, setOrderSubmittedAlert] = useState<string | null>(null);

  // Geometric Lookups
  const spec = MASTER_GEOMETRY[pressureClass]?.[nps] || {
    od: 6.75,
    boltCircle: 7.5,
    boltSize: 0.625,
    nominalThickness: 0.1196,
    thicknessLabel: '11 Gauge (0.120")',
  };

  const matConfig = MATERIALS[materialCode] || MATERIALS['SA-516-70'];
  const baseAreaSqIn = Math.PI * Math.pow(spec.od / 2, 2) + 2.0 * 6.0; // disc + handle
  const volumeCuIn = baseAreaSqIn * (spec.nominalThickness || 0.12);
  const estimatedWeightLbs = Math.max(1.2, volumeCuIn * matConfig.densityLbPerCuIn);
  
  const unitPrice = useMemo(() => {
    let base = estimatedWeightLbs * matConfig.defaultPricePerLb * 2.2 + 25.0;
    if (selectedProductType === 'Figure 8 (Spectacle)') base *= 1.8;
    if (selectedProductType === 'Bleeder Blind') base += 45.0;
    return Math.round(base);
  }, [estimatedWeightLbs, matConfig, selectedProductType]);

  const handlePlaceCatalogOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const triggered = simulateSalesEmailTrigger({
      companyName,
      contactName: buyerName,
      poNumber,
      items: [
        {
          partDescription: `${nps} ${pressureClass}# ${materialCode} ${selectedProductType}`,
          materialGrade: materialCode,
          nps,
          pressureClass,
          thicknessLabel: spec.thicknessLabel,
          quantity,
          unitPrice,
        }
      ],
      totalAmount: unitPrice * quantity + 85.0,
      isHotShot: false,
    });

    setOrderSubmittedAlert(`Order successfully submitted! Trigger email dispatched & Job #${triggered.generatedJobNumber} generated in Dashboard.`);
    setTimeout(() => setOrderSubmittedAlert(null), 6000);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[11px]">
            <Layers className="h-4 w-4" />
            <span>Interactive ASME B16.48 Product Catalog</span>
          </div>
          <h1 className="text-xl font-black text-white">Online Catalog &amp; Paddle Blind Orders</h1>
        </div>

        <button
          onClick={() => setActiveModuleId('work_orders')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition-all"
        >
          <span>View Production Work Orders ({workOrders.length})</span>
        </button>
      </div>

      {orderSubmittedAlert && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>{orderSubmittedAlert}</span>
          </div>
          <button
            onClick={() => setActiveModuleId('work_orders')}
            className="px-3 py-1 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black hover:bg-emerald-400 transition-colors"
          >
            Go to Work Order
          </button>
        </div>
      )}

      {/* Main Interactive Configurator & Live Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Product Parameters */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="font-bold text-white uppercase text-sm border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>1. Configure ASME Component</span>
            <span className="text-amber-400 text-xs">ASME B16.48 &amp; B16.5</span>
          </div>

          {/* Product Type Selector */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-2">Component Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Paddle Blind', 'Paddle Spacer', 'Figure 8 (Spectacle)', 'Bleeder Blind'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedProductType(type)}
                  className={`p-2.5 rounded-xl text-center font-bold transition-all ${
                    selectedProductType === type
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* NPS & Pressure Class */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Nominal Pipe Size (NPS)</label>
              <select
                value={nps}
                onChange={(e) => setNps(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-bold focus:outline-none"
              >
                {['1/2"', '3/4"', '1"', '1-1/2"', '2"', '3"', '4"', '6"', '8"', '10"', '12"', '16"', '20"', '24"'].map((size) => (
                  <option key={size} value={size}>{size} Nominal Pipe Size</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">ASME Pressure Class</label>
              <select
                value={pressureClass}
                onChange={(e) => setPressureClass(parseInt(e.target.value) as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-bold focus:outline-none"
              >
                <option value={150}>Class 150 (Standard)</option>
                <option value={300}>Class 300</option>
                <option value={600}>Class 600 (High Pressure)</option>
                <option value={900}>Class 900</option>
                <option value={1500}>Class 1500</option>
              </select>
            </div>
          </div>

          {/* Material Grade */}
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Material Specification</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'SA-516-70', label: 'SA-516-70 (PVQ Boiler Plate)' },
                { code: '316L', label: '316L Stainless Steel' },
                { code: '304L', label: '304L Stainless Steel' },
                { code: 'SA-36', label: 'SA-36 Carbon Steel' },
                { code: 'AL-6061', label: '6061-T6 Aluminum' },
              ].map((mat) => (
                <button
                  key={mat.code}
                  type="button"
                  onClick={() => setMaterialCode(mat.code as any)}
                  className={`p-2 rounded-xl text-left font-bold text-[11px] transition-all ${
                    materialCode === mat.code
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 border'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {mat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Order Intake Fields */}
          <form onSubmit={handlePlaceCatalogOrder} className="space-y-4 pt-3 border-t border-slate-800">
            <div className="font-bold text-white uppercase text-xs">2. Client &amp; Procurement Details</div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold">Buyer Contact</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold">PO Number</label>
                <input
                  type="text"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">Quantity:</span>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-20 bg-slate-950 border border-slate-800 rounded-xl p-2 text-center text-slate-100 font-black text-sm"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg active:scale-95"
              >
                <Send className="h-4 w-4" />
                <span>Submit Order &amp; Dispatch Sales Trigger</span>
              </button>
            </div>
          </form>

        </div>

        {/* Right 5 Cols: 2D Geometry Visualizer & Price Card */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Visual 2D CAD Blueprint Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-center">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase border-b border-slate-800 pb-2">
              <span>CAD Geometry Preview</span>
              <span className="text-amber-400">{nps} Class {pressureClass}</span>
            </div>

            {/* SVG Visualizer */}
            <div className="h-48 flex items-center justify-center relative bg-slate-950 rounded-xl border border-slate-800 p-4">
              <svg viewBox="0 0 200 200" className="h-full w-full max-h-40">
                {/* Center Blind Disc */}
                <circle cx="100" cy="115" r="55" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
                {/* Handle */}
                <rect x="91" y="20" width="18" height="60" fill="#334155" stroke="#f59e0b" strokeWidth="2" rx="3" />
                {/* Bolt Circle dotted line */}
                <circle cx="100" cy="115" r="42" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3,3" />
                {/* Hole in handle for hanging */}
                <circle cx="100" cy="35" r="5" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Spec Dimension Breakdown */}
            <div className="grid grid-cols-2 gap-2 text-left text-[11px] bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500">Outer Diameter:</span> <strong className="text-slate-200">{spec.od}" OD</strong>
              </div>
              <div>
                <span className="text-slate-500">Bolt Circle:</span> <strong className="text-slate-200">{spec.boltCircle}" BC</strong>
              </div>
              <div>
                <span className="text-slate-500">Nominal Thk:</span> <strong className="text-slate-200">{spec.thicknessLabel}</strong>
              </div>
              <div>
                <span className="text-slate-500">Unit Weight:</span> <strong className="text-emerald-400">~{estimatedWeightLbs.toFixed(1)} lbs</strong>
              </div>
            </div>

            {/* Real-time Pricing Calculator */}
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-left space-y-1">
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Unit Price:</span>
                <strong className="text-white font-mono">${unitPrice.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Total Quantity:</span>
                <strong className="text-slate-200 font-mono">{quantity} Pcs</strong>
              </div>
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Estimated Freight:</span>
                <strong className="text-slate-200 font-mono">$85.00</strong>
              </div>
              <div className="flex justify-between text-base font-black text-amber-400 pt-2 border-t border-slate-800">
                <span>ESTIMATED TOTAL:</span>
                <span className="font-mono">${(unitPrice * quantity + 85.0).toFixed(2)}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Incoming Paddle Blind Orders History Table */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase text-white">Recent Paddle Blind Production Queue</h2>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold">
                <th className="p-3">Job #</th>
                <th className="p-3">Client</th>
                <th className="p-3">Configured Part</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Stage</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {workOrders.slice(0, 6).map((wo) => (
                <tr key={wo.jobNumber} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-black text-amber-400">{wo.jobNumber}</td>
                  <td className="p-3 font-bold text-slate-200">{wo.clientCompanyName}</td>
                  <td className="p-3 text-slate-300">
                    {wo.items.map(i => `${i.nps} Cl.${i.pressureClass} ${i.materialCode}`).join(', ')}
                  </td>
                  <td className="p-3 font-bold text-emerald-400 text-center">
                    {wo.items.reduce((sum, i) => sum + i.quantity, 0)}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {wo.stage}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-100">
                    ${wo.totalAmount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
