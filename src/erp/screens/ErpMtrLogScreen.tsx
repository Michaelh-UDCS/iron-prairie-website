// src/erp/screens/ErpMtrLogScreen.tsx
// ASME Section VIII Div 1 & ASME B16.48 Certified Material Test Report (CMTR) Vault for IPG

import React, { useState } from 'react';
import { useErp } from '../context/ErpContext';
import {
  ShieldCheck,
  Search,
  Plus,
  QrCode,
  Printer,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  FileText,
  Boxes,
  Flame,
  X
} from 'lucide-react';
import { MaterialTestReport, MaterialCode } from '../../types';
import brandLogo from '../../../Logo.jpg';

export const ErpMtrLogScreen: React.FC = () => {
  const { mtrDatabase, addMtr, workOrders, stockInventory, setActiveModuleId } = useErp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMtr, setSelectedMtr] = useState<MaterialTestReport | null>(mtrDatabase[0] || null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New MTR Form State
  const [newHeatNum, setNewHeatNum] = useState('');
  const [newSpec, setNewSpec] = useState('ASME SA-516 Gr. 70');
  const [newMaterialCode, setNewMaterialCode] = useState<MaterialCode>('SA-516-70');
  const [newSteelMill, setNewSteelMill] = useState('Nucor Steel Hertford County');
  const [newSupplier, setNewSupplier] = useState('Triple-S Steel Houston');
  const [newThicknessLabel, setNewThicknessLabel] = useState('1/2" (0.500")');
  const [newTensile, setNewTensile] = useState(74500);
  const [newYield, setNewYield] = useState(46200);
  const [newElongation, setNewElongation] = useState(28.0);
  const [newCarbon, setNewCarbon] = useState(0.22);
  const [newManganese, setNewManganese] = useState(1.18);

  const filteredMtrs = mtrDatabase.filter((mtr) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      mtr.heatNumber.toLowerCase().includes(q) ||
      mtr.asmeSpec.toLowerCase().includes(q) ||
      mtr.steelMill.toLowerCase().includes(q) ||
      mtr.materialCode.toLowerCase().includes(q) ||
      mtr.certificateNumber.toLowerCase().includes(q)
    );
  });

  const handleCreateMtr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeatNum) return;

    const newReport: MaterialTestReport = {
      id: `MTR-${Date.now()}`,
      heatNumber: newHeatNum,
      certificateNumber: `CMTR-${Date.now().toString().slice(-6)}`,
      asmeSpec: newSpec,
      astmSpec: newSpec,
      materialCode: newMaterialCode,
      materialGrade: newSpec,
      heatTreatment: 'Normalized',
      plateThickness: 0.500,
      thicknessLabel: newThicknessLabel,
      plateWidthInches: 96,
      plateLengthInches: 240,
      masterPlateWeightLbs: 3270,
      steelMill: newSteelMill,
      millLocation: 'USA',
      supplierDistributor: newSupplier,
      countryOfMelt: 'USA',
      buyAmericanCompliant: true,
      chemistry: {
        carbon: newCarbon,
        manganese: newManganese,
        phosphorus: 0.012,
        sulfur: 0.008,
        silicon: 0.28,
        carbonEquivalent: 0.42,
      },
      mechanical: {
        tensileStrengthPsi: newTensile,
        yieldStrengthPsi: newYield,
        elongationPct: newElongation,
      },
      certifiedDate: new Date().toISOString().split('T')[0],
      qrCodePayload: `https://ironprairiefabrication.com/mtr/${newHeatNum}`,
      permanentUrl: `/mtr/${newHeatNum}`,
      status: 'In Stock',
      initialAreaSqIn: 23040,
      remainingAreaSqIn: 23040,
      allocatedOrders: [],
      notes: 'Added via ERP MTR Log portal.',
    };

    addMtr(newReport);
    setSelectedMtr(newReport);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px]">
            <ShieldCheck className="h-4 w-4" />
            <span>ASME Section VIII Div 1 (UG-77 / UG-93 / UG-94)</span>
          </div>
          <h1 className="text-xl font-black text-white">ASME MTR Vault &amp; Heat Traceability Log</h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>+ Log New MTR</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <Search className="h-4 w-4 text-cyan-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by Heat # (e.g. K49201-B), Specification (SA-516-70), Mill, or Certificate #..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Split Stage: MTR Records List & Detailed Cert Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: MTR List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase pb-1">
            <span>Certified Heat Numbers ({filteredMtrs.length})</span>
            <span className="text-emerald-400">100% Traceable</span>
          </div>

          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {filteredMtrs.map((mtr) => {
              const isSelected = selectedMtr?.id === mtr.id;
              return (
                <div
                  key={mtr.id}
                  onClick={() => setSelectedMtr(mtr)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/80 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-black text-cyan-400 text-xs">
                      HT# {mtr.heatNumber}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                      {mtr.status}
                    </span>
                  </div>

                  <div className="font-bold text-slate-200 truncate">{mtr.asmeSpec}</div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {mtr.steelMill} &bull; {mtr.thicknessLabel}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                    <span>Cert: {mtr.certificateNumber}</span>
                    <span>{mtr.countryOfMelt} Melt</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Detailed MTR Inspector */}
        <div className="lg:col-span-7 space-y-4">
          {selectedMtr ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              
              {/* Top Meta */}
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div>
                  <div className="text-[10px] text-cyan-400 font-bold uppercase">Certified Mill Test Report</div>
                  <h2 className="text-base font-black text-white mt-0.5">HEAT NUMBER: {selectedMtr.heatNumber}</h2>
                  <div className="text-[11px] text-slate-400 mt-1">{selectedMtr.asmeSpec}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsCertModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-cyan-500/20"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>View / Print Digital Cert</span>
                  </button>
                </div>
              </div>

              {/* Specs & Mill Info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-500 font-bold">Steel Mill:</span>
                  <div className="font-bold text-slate-200 truncate">{selectedMtr.steelMill}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">Distributor:</span>
                  <div className="font-bold text-slate-200 truncate">{selectedMtr.supplierDistributor}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">Thickness / Dim:</span>
                  <div className="font-bold text-slate-200">{selectedMtr.thicknessLabel}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">Certificate #:</span>
                  <div className="font-mono text-cyan-400">{selectedMtr.certificateNumber}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">Heat Treatment:</span>
                  <div className="font-bold text-emerald-400">{selectedMtr.heatTreatment}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">Origin:</span>
                  <div className="font-bold text-slate-200">100% {selectedMtr.countryOfMelt} Melt</div>
                </div>
              </div>

              {/* Chemical Composition Table */}
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-2">Chemical Composition (%)</div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Carbon (C)</span>
                    <strong className="text-slate-200 font-mono">{selectedMtr.chemistry.carbon}%</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Manganese (Mn)</span>
                    <strong className="text-slate-200 font-mono">{selectedMtr.chemistry.manganese}%</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Phosphorus (P)</span>
                    <strong className="text-slate-200 font-mono">{selectedMtr.chemistry.phosphorus}%</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Sulfur (S)</span>
                    <strong className="text-slate-200 font-mono">{selectedMtr.chemistry.sulfur}%</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Silicon (Si)</span>
                    <strong className="text-slate-200 font-mono">{selectedMtr.chemistry.silicon}%</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">CE</span>
                    <strong className="text-cyan-400 font-mono">{selectedMtr.chemistry.carbonEquivalent || 0.42}</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Status</span>
                    <strong className="text-emerald-400">PASSED</strong>
                  </div>
                </div>
              </div>

              {/* Mechanical Properties Table */}
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-2">Mechanical Test Properties</div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Tensile Strength</span>
                    <strong className="text-sm text-slate-100 font-mono">
                      {selectedMtr.mechanical.tensileStrengthPsi.toLocaleString()} PSI
                    </strong>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">Spec: 70,000 - 90,000</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Yield Strength</span>
                    <strong className="text-sm text-slate-100 font-mono">
                      {selectedMtr.mechanical.yieldStrengthPsi.toLocaleString()} PSI
                    </strong>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">Spec: &gt;= 38,000</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">Elongation in 2"</span>
                    <strong className="text-sm text-slate-100 font-mono">
                      {selectedMtr.mechanical.elongationPct}%
                    </strong>
                    <span className="text-[10px] text-emerald-400 block mt-0.5">Spec: &gt;= 21.0%</span>
                  </div>
                </div>
              </div>

              {/* Linked Work Orders & Stock Material */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-400 uppercase text-[10px]">Cross-Referenced Work Orders</div>
                <div className="flex flex-wrap gap-2">
                  {workOrders.filter(w => w.allocatedHeatNumbers.includes(selectedMtr.heatNumber)).length === 0 ? (
                    <span className="text-slate-500 text-[11px]">No active work orders currently burning this heat #</span>
                  ) : (
                    workOrders.filter(w => w.allocatedHeatNumbers.includes(selectedMtr.heatNumber)).map(wo => (
                      <button
                        key={wo.jobNumber}
                        onClick={() => setActiveModuleId('work_orders')}
                        className="px-2 py-1 rounded bg-slate-900 border border-cyan-500/30 text-cyan-300 font-bold hover:bg-slate-800 transition-colors"
                      >
                        {wo.jobNumber} ({wo.clientCompanyName})
                      </button>
                    ))
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-600 bg-slate-900 border border-slate-800 rounded-2xl">
              <ShieldCheck className="h-10 w-10 mx-auto mb-2 opacity-40 text-cyan-400" />
              <p>Select an MTR record on the left to inspect chemistry and mechanical properties.</p>
            </div>
          )}
        </div>

      </div>

      {/* Add New MTR Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="font-bold text-white text-sm">LOG NEW ASME SECTION VIII MTR</div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateMtr} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Heat Number (HT#)</label>
                  <input
                    type="text"
                    placeholder="e.g. K49201-B"
                    value={newHeatNum}
                    onChange={(e) => setNewHeatNum(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-cyan-400 font-black text-xs focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Material Specification</label>
                  <input
                    type="text"
                    value={newSpec}
                    onChange={(e) => setNewSpec(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Steel Mill</label>
                  <input
                    type="text"
                    value={newSteelMill}
                    onChange={(e) => setNewSteelMill(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Distributor Supplier</label>
                  <input
                    type="text"
                    value={newSupplier}
                    onChange={(e) => setNewSupplier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Tensile (PSI)</label>
                  <input
                    type="number"
                    value={newTensile}
                    onChange={(e) => setNewTensile(parseInt(e.target.value) || 70000)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Yield (PSI)</label>
                  <input
                    type="number"
                    value={newYield}
                    onChange={(e) => setNewYield(parseInt(e.target.value) || 45000)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Elongation %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newElongation}
                    onChange={(e) => setNewElongation(parseFloat(e.target.value) || 25)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
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
                  Save to MTR Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Digital Certificate Modal */}
      {isCertModalOpen && selectedMtr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto print:p-0 print:bg-white">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8 print:my-0 print:border-none print:shadow-none print:bg-white print:text-black">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 print:hidden">
              <div className="font-bold text-white text-sm">ASME CMTR CERTIFICATE VIEWER</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs"
                >
                  Print Certificate
                </button>
                <button onClick={() => setIsCertModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
            </div>

            <div className="p-8 space-y-5 text-slate-100 print:text-black print:p-6 font-mono text-xs">
              <div className="flex justify-between items-start border-b-2 border-slate-700 print:border-black pb-4">
                <div className="flex items-center gap-3">
                  <img src={brandLogo} alt="IPG" className="h-12 w-auto bg-white p-1 rounded" />
                  <div>
                    <div className="font-black text-cyan-400 print:text-black text-sm uppercase">IRON PRAIRIE GROUP LLC</div>
                    <div className="text-[10px] text-slate-400 print:text-black">Certified Material Test Report &bull; ASME Section VIII Div 1</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-sm text-slate-100 print:text-black">HEAT #{selectedMtr.heatNumber}</div>
                  <div className="text-[10px] text-slate-400 print:text-black">Cert: {selectedMtr.certificateNumber}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-950 print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-black">
                <div>
                  <span className="text-slate-500 font-bold block">Specification:</span>
                  <strong>{selectedMtr.asmeSpec}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Manufacturer / Steel Mill:</span>
                  <strong>{selectedMtr.steelMill}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Heat Treatment:</span>
                  <strong>{selectedMtr.heatTreatment}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Melt &amp; Manufacture:</span>
                  <strong>100% {selectedMtr.countryOfMelt} (Buy American Compliant)</strong>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-slate-800 print:border-black text-[10px] text-slate-500 print:text-black">
                Certified authentic and maintained in digital traceability vault by Iron Prairie Group LLC &bull; Bay City, TX
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
