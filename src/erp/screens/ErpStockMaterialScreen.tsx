// src/erp/screens/ErpStockMaterialScreen.tsx
// Stock Material Inventory & Heat Number Traceability Hub for Plate, Pipe & Structural Shapes for IPG

import React, { useState } from 'react';
import { useErp } from '../context/ErpContext';
import {
  Boxes,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Flame,
  Layers,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { StockMaterialCategory, MaterialCode, StockMaterialItem } from '../../types';

export const ErpStockMaterialScreen: React.FC = () => {
  const { stockInventory, addStockItem, allocateStockToJob, workOrders, setActiveModuleId } = useErp();

  const [activeCategory, setActiveCategory] = useState<StockMaterialCategory | 'All'>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [allocatingItem, setAllocatingItem] = useState<StockMaterialItem | null>(null);
  const [selectedJobToAllocate, setSelectedJobToAllocate] = useState(workOrders[0]?.jobNumber || '');
  const [allocQty, setAllocQty] = useState(1);

  // New Stock Form State
  const [newCategory, setNewCategory] = useState<StockMaterialCategory>('Plate');
  const [newSubType, setNewSubType] = useState('ASME SA-516 Gr. 70 PVQ Plate');
  const [newHeatNum, setNewHeatNum] = useState('');
  const [newMaterialCode, setNewMaterialCode] = useState<MaterialCode>('SA-516-70');
  const [newQty, setNewQty] = useState(5);
  const [newUom, setNewUom] = useState<StockMaterialItem['unitOfMeasure']>('Plates');
  const [newLoc, setNewLoc] = useState('Plate Rack Bay 1 (Indoor)');
  const [newMill, setNewMill] = useState('Nucor Steel');

  const filteredItems = stockInventory.filter((stk) => {
    if (activeCategory !== 'All' && stk.category !== activeCategory) return false;
    const q = searchFilter.toLowerCase().trim();
    if (!q) return true;
    return (
      stk.stockSku.toLowerCase().includes(q) ||
      stk.heatNumber.toLowerCase().includes(q) ||
      stk.subType.toLowerCase().includes(q) ||
      stk.materialGrade.toLowerCase().includes(q) ||
      stk.storageLocation.toLowerCase().includes(q)
    );
  });

  const handleCreateStockItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeatNum) return;

    addStockItem({
      stockSku: `STK-${newCategory.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      heatNumber: newHeatNum,
      category: newCategory,
      subType: newSubType,
      materialCode: newMaterialCode,
      materialGrade: newSubType,
      dimensions: {
        thicknessLabel: '1/2" (0.500")',
      },
      quantityOnHand: newQty,
      allocatedQuantity: 0,
      availableQuantity: newQty,
      unitOfMeasure: newUom,
      unitCost: 1.25,
      minReorderThreshold: 2,
      storageLocation: newLoc,
      millSupplier: newMill,
      countryOfMelt: 'USA',
      allocatedJobNumbers: [],
    });

    setIsAddModalOpen(false);
  };

  const handleConfirmAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allocatingItem || !selectedJobToAllocate) return;
    allocateStockToJob(allocatingItem.id, selectedJobToAllocate, allocQty);
    setAllocatingItem(null);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px]">
            <Boxes className="h-4 w-4" />
            <span>Raw Materials, Pipe &amp; Structural Inventory</span>
          </div>
          <h1 className="text-xl font-black text-white">Stock Material &amp; Heat Numbers</h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-500/20 transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>+ Add Stock Material</span>
        </button>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap gap-1">
          {(['All', 'Plate', 'Pipe', 'Structural Components', 'Round Bar', 'Flanges'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex-1 max-w-sm">
          <Search className="h-4 w-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Search HT#, SKU, Plate, Pipe, Structural..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Inventory Grid / Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold">
              <th className="p-3">Category</th>
              <th className="p-3">Material Description</th>
              <th className="p-3">Heat Number (HT#)</th>
              <th className="p-3">Storage Bay / Location</th>
              <th className="p-3 text-center">On Hand</th>
              <th className="p-3 text-center">Allocated</th>
              <th className="p-3 text-center">Available</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredItems.map((stk) => {
              const isLow = stk.availableQuantity <= stk.minReorderThreshold;
              return (
                <tr key={stk.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {stk.category}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-slate-100">{stk.subType}</div>
                    <div className="text-[11px] text-slate-400">
                      SKU: {stk.stockSku} &bull; Mill: {stk.millSupplier}
                    </div>
                  </td>
                  <td className="p-3 font-mono font-bold text-cyan-400">
                    {stk.heatNumber}
                  </td>
                  <td className="p-3 text-slate-300">
                    📍 {stk.storageLocation}
                  </td>
                  <td className="p-3 text-center font-bold text-slate-200">
                    {stk.quantityOnHand} {stk.unitOfMeasure}
                  </td>
                  <td className="p-3 text-center font-bold text-cyan-400">
                    {stk.allocatedQuantity}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`font-black text-sm ${isLow ? 'text-red-400' : 'text-emerald-400'}`}>
                      {stk.availableQuantity}
                    </span>
                    {isLow && (
                      <span className="block text-[9px] text-red-400 font-bold uppercase">REORDER</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setAllocatingItem(stk)}
                      className="px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-[11px] transition-colors"
                    >
                      Allocate to Job #
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Allocate Stock Modal */}
      {allocatingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="font-bold text-white text-sm">ALLOCATE STOCK TO WORK ORDER</div>
              <button onClick={() => setAllocatingItem(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleConfirmAllocation} className="p-6 space-y-4">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-cyan-400">{allocatingItem.subType}</div>
                <div className="text-[11px] text-slate-400">Heat Number: <strong className="text-slate-200">{allocatingItem.heatNumber}</strong></div>
                <div className="text-[11px] text-emerald-400">Available to Allocate: <strong>{allocatingItem.availableQuantity} {allocatingItem.unitOfMeasure}</strong></div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Target Work Order (Job #)</label>
                <select
                  value={selectedJobToAllocate}
                  onChange={(e) => setSelectedJobToAllocate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-bold focus:outline-none"
                  required
                >
                  {workOrders.map((wo) => (
                    <option key={wo.jobNumber} value={wo.jobNumber}>
                      {wo.jobNumber} &bull; {wo.clientCompanyName} ({wo.projectName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Quantity to Allocate</label>
                <input
                  type="number"
                  min="1"
                  max={allocatingItem.availableQuantity}
                  value={allocQty}
                  onChange={(e) => setAllocQty(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-bold text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAllocatingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black hover:bg-cyan-400 shadow-md shadow-cyan-500/20"
                >
                  Confirm Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Stock Material Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="font-bold text-white text-sm">STOCK MATERIAL INTAKE &amp; HEAT LOG</div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateStockItem} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-bold focus:outline-none"
                  >
                    <option value="Plate">Plate (Steel / Stainless)</option>
                    <option value="Pipe">Pipe &amp; Tubular</option>
                    <option value="Structural Components">Structural (Tubing, Angle, Beam)</option>
                    <option value="Round Bar">Round Bar</option>
                    <option value="Flanges">Flanges</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Heat Number (HT#)</label>
                  <input
                    type="text"
                    placeholder="e.g. HT-K88201"
                    value={newHeatNum}
                    onChange={(e) => setNewHeatNum(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-cyan-400 font-black focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold">Description / Subtype</label>
                <input
                  type="text"
                  placeholder="e.g. ASME SA-516 Gr. 70 Plate 0.500 x 96 x 240"
                  value={newSubType}
                  onChange={(e) => setNewSubType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newQty}
                    onChange={(e) => setNewQty(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Unit of Measure</label>
                  <select
                    value={newUom}
                    onChange={(e) => setNewUom(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="Plates">Plates</option>
                    <option value="Lengths">Lengths (20/24/40 FT)</option>
                    <option value="Linear Ft">Linear Ft</option>
                    <option value="Pcs">Pcs</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Storage Location</label>
                  <input
                    type="text"
                    value={newLoc}
                    onChange={(e) => setNewLoc(e.target.value)}
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
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black hover:bg-cyan-400 shadow-md shadow-cyan-500/20"
                >
                  Add to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
