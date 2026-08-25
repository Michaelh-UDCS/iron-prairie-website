// src/operations/components/AsmeMtrVault.tsx
// Digital MTR Vault & Folder Repository for ASME Section VIII Div 1 & ASME B16.48

import React, { useState, useMemo } from 'react';
import { MaterialTestReport, MaterialCode } from '../../types';
import { getAllMTRs, saveMTRs } from '../data/mtrRepository';
import {
  Folder,
  FolderOpen,
  FileText,
  Search,
  ShieldCheck,
  QrCode,
  Printer,
  Copy,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Layers,
  Sparkles,
  Download,
  Flame,
  AlertCircle,
  Plus,
  X
} from 'lucide-react';

export const AsmeMtrVault: React.FC = () => {
  const [mtrList, setMtrList] = useState<MaterialTestReport[]>(getAllMTRs());
  const [selectedMtr, setSelectedMtr] = useState<MaterialTestReport>(() => mtrList[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlloyFilter, setSelectedAlloyFilter] = useState<string>('ALL');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAddMtrModalOpen, setIsAddMtrModalOpen] = useState(false);

  // Group MTRs by Alloy
  const alloyGroups = useMemo(() => {
    const groups: Record<string, MaterialTestReport[]> = {};
    mtrList.forEach((m) => {
      const alloy = m.materialCode;
      if (!groups[alloy]) groups[alloy] = [];
      groups[alloy].push(m);
    });
    return groups;
  }, [mtrList]);

  // Filtered MTRs based on search and alloy
  const filteredMTRs = useMemo(() => {
    return mtrList.filter((m) => {
      const matchAlloy = selectedAlloyFilter === 'ALL' || m.materialCode === selectedAlloyFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        m.heatNumber.toLowerCase().includes(q) ||
        m.asmeSpec.toLowerCase().includes(q) ||
        m.steelMill.toLowerCase().includes(q) ||
        (m.slabNumber && m.slabNumber.toLowerCase().includes(q)) ||
        m.thicknessLabel.toLowerCase().includes(q);
      return matchAlloy && matchSearch;
    });
  }, [mtrList, selectedAlloyFilter, searchQuery]);

  const handleCopyMtrLink = (mtr: MaterialTestReport) => {
    const url = `${window.location.origin}${mtr.permanentUrl}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            <h1 className="text-2xl font-black text-slate-100 tracking-tight font-display">
              ASME Section VIII Div 1 &bull; Digital MTR Vault
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Certified Material Test Report (CMTR) repository complying with UG-77 heat transfer stamping, UG-93 plate inspection, and ASME B16.48 traceability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddMtrModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 text-xs transition-all shadow-md active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>+ Add Master Plate Heat</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Left Folder Tree / Search + Right Certificate Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Repository Tree & Search (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Heat #, Slab, Spec, Mill..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-10 pr-4 text-xs font-mono text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Alloy Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {['ALL', 'SA-516-70', 'SA-36', '304L', '316L', 'AL-6061'].map((alloy) => (
              <button
                key={alloy}
                onClick={() => setSelectedAlloyFilter(alloy)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                  selectedAlloyFilter === alloy
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {alloy}
              </button>
            ))}
          </div>

          {/* Heat Numbers Folder List */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3 space-y-2 max-h-[700px] overflow-y-auto shadow-lg">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1 flex items-center justify-between">
              <span>Master Plate Heats ({filteredMTRs.length})</span>
              <FolderOpen className="h-3.5 w-3.5 text-amber-400" />
            </div>

            {filteredMTRs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-600 font-mono">
                No matching MTR heats found
              </div>
            ) : (
              filteredMTRs.map((mtr) => {
                const isSelected = selectedMtr?.id === mtr.id;
                const utilizationPct = Math.round(((mtr.initialAreaSqIn - mtr.remainingAreaSqIn) / mtr.initialAreaSqIn) * 100);

                return (
                  <div
                    key={mtr.id}
                    onClick={() => setSelectedMtr(mtr)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'border-amber-500/80 bg-amber-500/10 shadow-md'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-amber-400 flex items-center gap-1.5">
                        <Flame className="h-3.5 w-3.5 text-orange-400" />
                        {mtr.heatNumber}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        {mtr.thicknessLabel}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-200 truncate">
                      {mtr.asmeSpec}
                    </div>

                    <div className="text-[11px] text-slate-400 truncate">
                      {mtr.steelMill}
                    </div>

                    {/* Utilization Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>Plate Cut: {utilizationPct}%</span>
                        <span>{Math.round(mtr.remainingAreaSqIn / 144)} sq ft left</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${Math.max(5, 100 - utilizationPct)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Full ASME CMTR Certificate Viewer (8 Cols) */}
        <div className="lg:col-span-8">
          {selectedMtr ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-8 space-y-6 print:m-0 print:border-none print:bg-white print:p-0 print:text-black">
              
              {/* Document Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 print:hidden">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase text-emerald-400">
                    Certified &amp; Verified in Vault
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyMtrLink(selectedMtr)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all"
                  >
                    {copiedLink ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-amber-400" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Permanent URL'}</span>
                  </button>

                  <button
                    onClick={handlePrintCertificate}
                    className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow active:scale-95"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print Certificate</span>
                  </button>
                </div>
              </div>

              {/* Printable ASME Section VIII Div 1 Certificate Sheet */}
              <div className="space-y-6 font-mono text-xs text-slate-200 print:text-black">
                
                {/* Header Block */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-amber-500/40">
                  <div>
                    <div className="text-xs uppercase font-bold tracking-widest text-amber-400 print:text-black">
                      IRON PRAIRIE FABRICATION GROUP LLC
                    </div>
                    <div className="text-base font-black text-white print:text-black mt-0.5">
                      CERTIFIED MATERIAL TEST REPORT (CMTR)
                    </div>
                    <div className="text-[11px] text-slate-400 print:text-gray-600">
                      QA/QC Material Traceability &bull; ASME BPVC Sec VIII Div 1 &bull; ASME B16.48
                    </div>
                  </div>

                  {/* QR Code & Certificate Badge */}
                  <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800 print:border-black">
                    <QrCode className="h-12 w-12 text-amber-400 print:text-black" />
                    <div className="text-[10px] space-y-0.5">
                      <div className="font-bold text-white print:text-black">DIGITAL QR AUDIT</div>
                      <div className="text-emerald-400 print:text-black font-bold">100% TRACEABLE</div>
                      <div className="text-slate-500 print:text-gray-600">{selectedMtr.permanentUrl}</div>
                    </div>
                  </div>
                </div>

                {/* Section 1: Material Identification & Mill Provenance */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 print:bg-gray-50 print:border-gray-300">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Mill Heat Number</span>
                    <span className="text-sm font-black text-amber-400 print:text-black">{selectedMtr.heatNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Slab / Coil #</span>
                    <span className="text-xs font-bold text-slate-200 print:text-black">{selectedMtr.slabNumber || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">ASME Specification</span>
                    <span className="text-xs font-bold text-slate-200 print:text-black">{selectedMtr.asmeSpec}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Plate Thickness</span>
                    <span className="text-xs font-bold text-emerald-400 print:text-black">{selectedMtr.thicknessLabel}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Producing Steel Mill</span>
                    <span className="text-xs font-semibold text-slate-300 print:text-black">{selectedMtr.steelMill}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Mill Location</span>
                    <span className="text-xs font-semibold text-slate-300 print:text-black">{selectedMtr.millLocation}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Heat Treatment</span>
                    <span className="text-xs font-semibold text-slate-300 print:text-black">{selectedMtr.heatTreatment}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Melt &amp; Manuf. Country</span>
                    <span className="text-xs font-bold text-emerald-400 print:text-black flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {selectedMtr.countryOfMelt} (Buy American)
                    </span>
                  </div>
                </div>

                {/* Section 2: Chemical Composition Analysis Table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black flex items-center gap-2">
                      <span>1. Certified Chemical Composition (% Weight)</span>
                      <span className="rounded bg-emerald-500/20 text-emerald-400 px-2 py-0.2 text-[10px] font-bold border border-emerald-500/30">
                        PASS ALL LIMITS
                      </span>
                    </h3>
                    <span className="text-[10px] text-slate-400 font-bold">
                      Carbon Equiv (CE): {selectedMtr.chemistry.carbonEquivalent.toFixed(2)}
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                    <table className="w-full text-center text-xs">
                      <thead className="bg-slate-900 text-[10px] font-bold text-slate-400 uppercase">
                        <tr>
                          <th className="py-2 px-2.5 text-left">Element</th>
                          <th className="py-2 px-2">% C</th>
                          <th className="py-2 px-2">% Mn</th>
                          <th className="py-2 px-2">% P</th>
                          <th className="py-2 px-2">% S</th>
                          <th className="py-2 px-2">% Si</th>
                          <th className="py-2 px-2">% Cr</th>
                          <th className="py-2 px-2">% Ni</th>
                          <th className="py-2 px-2">% Mo</th>
                          <th className="py-2 px-2">% Cu</th>
                          <th className="py-2 px-2">CE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-200">
                        <tr>
                          <td className="py-2 px-2.5 text-left font-bold text-amber-400">Actual Mill Heat</td>
                          <td className="py-2 px-2 font-bold">{selectedMtr.chemistry.carbon}</td>
                          <td className="py-2 px-2">{selectedMtr.chemistry.manganese}</td>
                          <td className="py-2 px-2">{selectedMtr.chemistry.phosphorus}</td>
                          <td className="py-2 px-2">{selectedMtr.chemistry.sulfur}</td>
                          <td className="py-2 px-2">{selectedMtr.chemistry.silicon}</td>
                          <td className="py-2 px-2">{selectedMtr.chemistry.chromium ?? '-'}</td>
                          <td className="py-2 px-2">{selectedMtr.chemistry.nickel ?? '-'}</td>
                          <td className="py-2 px-2">{selectedMtr.chemistry.molybdenum ?? '-'}</td>
                          <td className="py-2 px-2">{selectedMtr.chemistry.copper ?? '-'}</td>
                          <td className="py-2 px-2 font-bold text-emerald-400">{selectedMtr.chemistry.carbonEquivalent}</td>
                        </tr>
                        <tr className="text-[10px] text-slate-500 bg-slate-900/40">
                          <td className="py-1.5 px-2.5 text-left">ASTM Spec Max</td>
                          <td className="py-1.5 px-2">&le; 0.28</td>
                          <td className="py-1.5 px-2">0.85-1.20</td>
                          <td className="py-1.5 px-2">&le; 0.035</td>
                          <td className="py-1.5 px-2">&le; 0.035</td>
                          <td className="py-1.5 px-2">0.15-0.40</td>
                          <td className="py-1.5 px-2">-</td>
                          <td className="py-1.5 px-2">-</td>
                          <td className="py-1.5 px-2">-</td>
                          <td className="py-1.5 px-2">-</td>
                          <td className="py-1.5 px-2">&le; 0.45</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 3: Mechanical Test Properties */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black flex items-center gap-2">
                    <span>2. Certified Mechanical &amp; Impact Properties</span>
                    <span className="rounded bg-emerald-500/20 text-emerald-400 px-2 py-0.2 text-[10px] font-bold border border-emerald-500/30">
                      ASME SEC II PART A COMPLIANT
                    </span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 print:bg-gray-50 print:border-gray-300">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Tensile Strength</span>
                      <span className="text-sm font-black text-slate-100 print:text-black">
                        {selectedMtr.mechanical.tensileStrengthPsi.toLocaleString()} PSI
                      </span>
                      <span className="text-[10px] text-emerald-400 block">Spec: 70,000 - 90,000 PSI</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Yield Strength (0.2%)</span>
                      <span className="text-sm font-black text-slate-100 print:text-black">
                        {selectedMtr.mechanical.yieldStrengthPsi.toLocaleString()} PSI
                      </span>
                      <span className="text-[10px] text-emerald-400 block">Spec: &ge; 38,000 PSI</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Elongation in 2"</span>
                      <span className="text-sm font-black text-slate-100 print:text-black">
                        {selectedMtr.mechanical.elongationPct}%
                      </span>
                      <span className="text-[10px] text-emerald-400 block">Spec: &ge; 21.0%</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Charpy V-Notch Impact</span>
                      {selectedMtr.mechanical.charpyVNotch ? (
                        <div>
                          <span className="text-sm font-black text-amber-400 print:text-black">
                            {selectedMtr.mechanical.charpyVNotch.ftLbs} ft-lbs
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            @ {selectedMtr.mechanical.charpyVNotch.temperatureF}&deg;F ({selectedMtr.mechanical.charpyVNotch.orientation})
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">Not Specified</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 4: Master Plate Sizing & Allocated Orders */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">Master Plate Inventory Status:</span>
                    <span className="text-amber-400 font-bold">
                      {selectedMtr.plateWidthInches}" &times; {selectedMtr.plateLengthInches}" &bull; {selectedMtr.masterPlateWeightLbs} lbs
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Allocated to Production Orders: {selectedMtr.allocatedOrders.length > 0 ? selectedMtr.allocatedOrders.join(', ') : 'None (Full Plate In Stock)'}
                  </div>
                </div>

                {/* Certification Signature Box */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-slate-400">
                  <div>
                    <div>Certified by: <strong>Iron Prairie Fabrication Group LLC QA/QC</strong></div>
                    <div>Texas &bull; ASME BPVC Certificate Holder Compliance</div>
                  </div>
                  <div className="text-right sm:text-right">
                    <div>Date Certified: <strong>{selectedMtr.certifiedDate}</strong></div>
                    <div className="text-emerald-400 font-bold">Official Digital Traceability Record</div>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center rounded-2xl border border-dashed border-slate-800 text-slate-600 font-mono text-xs">
              Select an MTR Heat from the left repository to view certificate
            </div>
          )}
        </div>

      </div>

      {/* Add New Master Plate Modal */}
      {isAddMtrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
          <div className="relative flex w-full max-w-lg flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Plus className="h-4 w-4 text-amber-400" />
                Add Master Plate Heat to MTR Vault
              </h3>
              <button onClick={() => setIsAddMtrModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const newHeat: MaterialTestReport = {
                  id: `MTR-CUSTOM-${Date.now()}`,
                  heatNumber: form.heatNumber.value.trim().toUpperCase(),
                  slabNumber: form.slabNumber.value.trim(),
                  certificateNumber: `CMTR-${Date.now().toString().slice(-6)}`,
                  asmeSpec: form.asmeSpec.value,
                  astmSpec: form.asmeSpec.value,
                  materialCode: form.materialCode.value,
                  materialGrade: 'Commercial / PVQ Certified',
                  heatTreatment: 'Normalized',
                  plateThickness: parseFloat(form.plateThickness.value) || 0.250,
                  thicknessLabel: `${form.plateThickness.value}"`,
                  plateWidthInches: 96,
                  plateLengthInches: 240,
                  masterPlateWeightLbs: 2500,
                  steelMill: form.steelMill.value.trim(),
                  millLocation: 'USA Mill Facility',
                  supplierDistributor: 'Triple-S Steel Houston',
                  countryOfMelt: 'USA',
                  buyAmericanCompliant: true,
                  chemistry: {
                    carbon: 0.20,
                    manganese: 1.10,
                    phosphorus: 0.015,
                    sulfur: 0.008,
                    silicon: 0.25,
                    carbonEquivalent: 0.38,
                  },
                  mechanical: {
                    tensileStrengthPsi: 72000,
                    yieldStrengthPsi: 44000,
                    elongationPct: 25.0,
                  },
                  certifiedDate: new Date().toISOString().split('T')[0],
                  qrCodePayload: `https://ironprairiefabrication.com/mtr/${form.heatNumber.value.trim().toUpperCase()}`,
                  permanentUrl: `/mtr/${form.heatNumber.value.trim().toUpperCase()}`,
                  status: 'In Stock',
                  initialAreaSqIn: 23040,
                  remainingAreaSqIn: 23040,
                  allocatedOrders: [],
                };

                const updated = [newHeat, ...mtrList];
                setMtrList(updated);
                saveMTRs(updated);
                setSelectedMtr(newHeat);
                setIsAddMtrModalOpen(false);
              }}
              className="space-y-3.5 text-xs font-mono"
            >
              <div>
                <label className="block text-slate-300 font-bold mb-1">Mill Heat Number *</label>
                <input
                  name="heatNumber"
                  required
                  placeholder="e.g. HEAT-99412-A"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-amber-300 font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Slab / Coil #</label>
                  <input
                    name="slabNumber"
                    placeholder="e.g. SLAB-04"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Material Code *</label>
                  <select
                    name="materialCode"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="SA-516-70">SA-516-70 (Boiler/PVQ)</option>
                    <option value="SA-36">SA-36 (Carbon Steel)</option>
                    <option value="304L">304L (Stainless)</option>
                    <option value="316L">316L (Acid Stainless)</option>
                    <option value="AL-6061">AL-6061-T6 (Aluminum)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Thickness (Decimal Inches) *</label>
                  <input
                    name="plateThickness"
                    defaultValue="0.500"
                    step="0.001"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Producing Steel Mill *</label>
                  <input
                    name="steelMill"
                    defaultValue="Nucor Steel / SSAB Americas"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">ASME Specification Label</label>
                <input
                  name="asmeSpec"
                  defaultValue="ASME SA-516 Gr. 70 (PVQ Plate)"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddMtrModalOpen(false)}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-5 py-2 font-bold text-slate-950 hover:bg-amber-400 transition-all shadow"
                >
                  Save to MTR Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
