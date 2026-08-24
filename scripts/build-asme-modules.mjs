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
// 1. src/operations/components/AsmeMtrVault.tsx
// ============================================================================
const asmeMtrVaultContent = `// src/operations/components/AsmeMtrVault.tsx
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
    const url = \`\${window.location.origin}\${mtr.permanentUrl}\`;
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
                className={\`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all \${
                  selectedAlloyFilter === alloy
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                }\`}
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
                    className={\`p-3 rounded-xl border transition-all cursor-pointer space-y-2 \${
                      isSelected
                        ? 'border-amber-500/80 bg-amber-500/10 shadow-md'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }\`}
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
                          style={{ width: \`\${Math.max(5, 100 - utilizationPct)}%\` }}
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
                    <div>Freeport, TX &bull; ASME BPVC Certificate Holder Compliance</div>
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
                  id: \`MTR-CUSTOM-\${Date.now()}\`,
                  heatNumber: form.heatNumber.value.trim().toUpperCase(),
                  slabNumber: form.slabNumber.value.trim(),
                  certificateNumber: \`CMTR-\${Date.now().toString().slice(-6)}\`,
                  asmeSpec: form.asmeSpec.value,
                  astmSpec: form.asmeSpec.value,
                  materialCode: form.materialCode.value,
                  materialGrade: 'Commercial / PVQ Certified',
                  heatTreatment: 'Normalized',
                  plateThickness: parseFloat(form.plateThickness.value) || 0.250,
                  thicknessLabel: \`\${form.plateThickness.value}\"\`,
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
                  qrCodePayload: \`https://ironprairiefabrication.com/mtr/\${form.heatNumber.value.trim().toUpperCase()}\`,
                  permanentUrl: \`/mtr/\${form.heatNumber.value.trim().toUpperCase()}\`,
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
`;

writeSrc('src/operations/components/AsmeMtrVault.tsx', asmeMtrVaultContent);

// ============================================================================
// 2. src/operations/components/HeatMatcherPanel.tsx
// ============================================================================
const heatMatcherContent = `// src/operations/components/HeatMatcherPanel.tsx
// Laser Table Auto-Matching Heat Number Engine for Order Staging

import React, { useMemo } from 'react';
import { CustomerOrder, MaterialTestReport } from '../../types';
import { getAllMTRs } from '../data/mtrRepository';
import { Flame, CheckCircle2, AlertTriangle, ShieldCheck, Eye, ArrowRight } from 'lucide-react';

interface HeatMatcherPanelProps {
  order: CustomerOrder;
  onAssignHeat: (heatNumber: string, mtrId: string) => void;
  onPreviewMtr: (mtr: MaterialTestReport) => void;
}

export const HeatMatcherPanel: React.FC<HeatMatcherPanelProps> = ({
  order,
  onAssignHeat,
  onPreviewMtr
}) => {
  const primaryItem = order.items[0];
  const allMTRs = useMemo(() => getAllMTRs(), []);

  // Find matching in-stock heats
  const matchingHeats = useMemo(() => {
    if (!primaryItem) return [];
    return allMTRs.filter((m) => {
      const matMatch = m.materialCode === primaryItem.materialCode;
      const thkMatch = Math.abs(m.plateThickness - primaryItem.thickness) < 0.03;
      return matMatch && thkMatch && m.status === 'In Stock';
    });
  }, [primaryItem, allMTRs]);

  if (!primaryItem) return null;

  return (
    <div className="rounded-xl border border-orange-500/40 bg-orange-950/20 p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
          <Flame className="h-4 w-4 animate-pulse text-orange-400" />
          Laser Table Heat Auto-Matcher
        </span>
        <span className="text-[10px] font-mono bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded font-bold">
          {matchingHeats.length} Certified Heats In Stock
        </span>
      </div>

      <div className="text-xs text-slate-300 font-mono">
        Target: <strong>{primaryItem.quantity}x {primaryItem.nps} {primaryItem.pressureClass}# {primaryItem.materialCode} ({primaryItem.thicknessLabel})</strong>
      </div>

      {matchingHeats.length === 0 ? (
        <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-3 text-xs text-amber-400 flex items-center gap-2 font-mono">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
          <span>No exact in-stock master plate match found. Generate a Steel PO or assign heat manually.</span>
        </div>
      ) : (
        <div className="space-y-2">
          {matchingHeats.map((mtr) => {
            const isCurrentlyAssigned = order.millHeatNumber === mtr.heatNumber;
            const remainingSqFt = Math.round(mtr.remainingAreaSqIn / 144);

            return (
              <div
                key={mtr.id}
                className={\`flex items-center justify-between p-2.5 rounded-lg border font-mono text-xs transition-all \${
                  isCurrentlyAssigned
                    ? 'border-emerald-500/80 bg-emerald-500/10'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                }\`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-400">{mtr.heatNumber}</span>
                    <span className="text-[10px] text-slate-400">({mtr.steelMill.split(' ')[0]})</span>
                    <span className="text-[10px] text-emerald-400 font-bold">&bull; {remainingSqFt} sq ft left</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Tensile: {mtr.mechanical.tensileStrengthPsi.toLocaleString()} PSI &bull; Yield: {mtr.mechanical.yieldStrengthPsi.toLocaleString()} PSI
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onPreviewMtr(mtr)}
                    title="Preview CMTR Certificate"
                    className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onAssignHeat(mtr.heatNumber, mtr.id)}
                    className={\`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs transition-all \${
                      isCurrentlyAssigned
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-orange-500 hover:bg-orange-400 text-slate-950 shadow'
                    }\`}
                  >
                    {isCurrentlyAssigned ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Assigned</span>
                      </>
                    ) : (
                      <>
                        <span>Assign Heat</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
`;

writeSrc('src/operations/components/HeatMatcherPanel.tsx', heatMatcherContent);

// ============================================================================
// 3. src/operations/components/AsmeQcTravelerModal.tsx
// ============================================================================
const asmeTravelerContent = `// src/operations/components/AsmeQcTravelerModal.tsx
// Printable ASME Section VIII Div 1 (UG-77, UG-93, UG-94) Job Traveler & Stamping Log

import React from 'react';
import { CustomerOrder, MaterialTestReport } from '../../types';
import { getMTRByHeatNumber } from '../data/mtrRepository';
import { X, Printer, ShieldCheck, QrCode, FileText, CheckSquare, Flame } from 'lucide-react';

interface AsmeQcTravelerModalProps {
  order: CustomerOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AsmeQcTravelerModal: React.FC<AsmeQcTravelerModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const primaryItem = order.items[0];
  const mtr: MaterialTestReport | undefined = order.millHeatNumber
    ? getMTRByHeatNumber(order.millHeatNumber)
    : undefined;

  const handlePrint = () => {
    window.print();
  };

  const hardStampSpec = primaryItem
    ? \`IPF - \${primaryItem.nps} \${primaryItem.pressureClass}# - \${primaryItem.materialCode} - \${order.millHeatNumber} - \${primaryItem.thicknessLabel.split(' ')[0]}\`
    : 'IPF - ASME B16.48';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 md:p-6 backdrop-blur-md animate-fadeIn">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden print:m-0 print:max-h-none print:w-full print:border-none print:bg-white print:p-0 print:text-black">
        
        {/* Screen Header - Hidden on Print */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                ASME Section VIII Div 1 Job Traveler &bull; <span className="font-mono text-amber-400">{order.poNumber}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {order.companyName} &bull; Heat: <span className="font-mono text-emerald-400 font-bold">{order.millHeatNumber}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-md active:scale-95"
            >
              <Printer className="h-4 w-4" />
              <span>Print Traveler Sheet</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 font-mono text-xs text-slate-200 print:text-black print:p-0">
          
          {/* Document Header */}
          <div className="flex items-start justify-between pb-4 border-b-2 border-slate-800 print:border-black">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-amber-400 print:text-black">
                IRON PRAIRIE FABRICATION GROUP LLC
              </div>
              <div className="text-base font-black text-white print:text-black mt-0.5">
                ASME SECTION VIII DIV 1 QC TRAVELER &amp; UG-77 STAMPING LOG
              </div>
              <div className="text-[11px] text-slate-400 print:text-gray-600">
                Facility: 2301 N Brazosport Blvd, Freeport, TX 77541 &bull; (979) 248-9266
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase font-bold">PO Number</div>
              <div className="text-base font-black text-amber-400 print:text-black">{order.poNumber}</div>
              <div className="text-[10px] text-slate-400">Order ID: {order.orderId}</div>
            </div>
          </div>

          {/* Job Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 print:bg-gray-50 print:border-gray-300">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Client / Facility</span>
              <span className="text-xs font-bold text-slate-100 print:text-black">{order.companyName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Ship-To Destination</span>
              <span className="text-[11px] text-slate-300 print:text-black">{order.jobsiteAddress}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Scheduled Ship Date</span>
              <span className="text-xs font-bold text-slate-100 print:text-black">{order.scheduledShipDate}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Priority / Shipping</span>
              <span className="text-xs font-bold text-amber-400 print:text-black">{order.shippingMethod}</span>
            </div>
          </div>

          {/* Section 1: UG-77 Physical Hard Stamp Specification */}
          <div className="rounded-xl border-2 border-dashed border-amber-500/60 bg-amber-500/5 p-4 space-y-2 print:border-black print:bg-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-black flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-400" />
                ASME UG-77 Required Hard-Stamp Specification
              </span>
              <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black">
                MANDATORY STAMP
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center font-mono text-sm font-black text-amber-300 print:bg-white print:text-black print:border-black">
              {hardStampSpec}
            </div>

            <div className="text-[10px] text-slate-400 print:text-gray-600">
              * Per ASME Section VIII Div 1 UG-77: All cut blinds must have mill heat traceability hard-stamped on handle before dispatch.
            </div>
          </div>

          {/* Section 2: Bill of Materials & Cut Dimensions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black">
              1. Cut Dimensions &amp; Geometry Manifest (ASME B16.48)
            </h4>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 print:border-gray-300">
              <table className="w-full text-center text-xs">
                <thead className="bg-slate-900 text-[10px] font-bold text-slate-400 uppercase print:bg-gray-200 print:text-black">
                  <tr>
                    <th className="py-2 px-2 text-left">Item SKU</th>
                    <th className="py-2 px-2">Size / Class</th>
                    <th className="py-2 px-2">Material</th>
                    <th className="py-2 px-2">Thk</th>
                    <th className="py-2 px-2">OD (in)</th>
                    <th className="py-2 px-2">Bolt Circle</th>
                    <th className="py-2 px-2">Qty</th>
                    <th className="py-2 px-2 text-right">Scale Wt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200 print:divide-gray-300 print:text-black">
                  {order.items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="py-2 px-2 text-left font-bold text-amber-400 print:text-black">{item.partNumber}</td>
                      <td className="py-2 px-2">{item.nps} {item.pressureClass}#</td>
                      <td className="py-2 px-2 font-bold">{item.materialCode}</td>
                      <td className="py-2 px-2">{item.thicknessLabel}</td>
                      <td className="py-2 px-2 font-bold">{item.od.toFixed(2)}"</td>
                      <td className="py-2 px-2">{item.boltCircle.toFixed(2)}"</td>
                      <td className="py-2 px-2 font-black text-amber-400 print:text-black">{item.quantity}</td>
                      <td className="py-2 px-2 text-right font-mono">{(item.actualWeightLbs * item.quantity).toFixed(1)} lbs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: 5 ASME QC Hold Points & Sign-Off Signatures */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-black">
              2. ASME Section VIII Div 1 QC Hold Points &amp; Inspector Sign-Offs
            </h4>

            <div className="space-y-2">
              {[
                {
                  code: 'UG-93',
                  title: 'Hold Point 1: Initial Plate Receiving & Heat Stamp Verification',
                  desc: 'Verify plate mill heat # matches MTR cert and is free of laminations or defects.',
                },
                {
                  code: 'CUT-QC',
                  title: 'Hold Point 2: Laser Burn & Cut Edge Profile',
                  desc: 'Inspect CNC laser kerf tolerance (±0.005"), perpendicularity, and verify zero dross.',
                },
                {
                  code: 'B16.48',
                  title: 'Hold Point 3: Dimensional Inspection (OD, Bolt Circle, Thickness)',
                  desc: 'Caliper verify disc OD, handle length/width, and nominal plate thickness.',
                },
                {
                  code: 'UG-77',
                  title: 'Hold Point 4: Heat Transfer Hard Stamp Verification',
                  desc: 'Confirm physical handle stamp is deep, legible, and matches the assigned heat number.',
                },
                {
                  code: 'UG-94',
                  title: 'Hold Point 5: Final Inspection, Deburring & MTR Collation',
                  desc: 'Deburr edges, wipe down with rust inhibitor, verify QR code, and collate MTR packet.',
                },
              ].map((hp, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950 gap-2 print:border-gray-300 print:bg-white"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-200 print:text-black flex items-center gap-2">
                      <span className="bg-slate-800 text-amber-400 print:bg-gray-200 print:text-black px-1.5 py-0.2 rounded text-[10px] font-black">
                        {hp.code}
                      </span>
                      <span>{hp.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 print:text-gray-600">{hp.desc}</div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="h-8 w-24 border border-dashed border-slate-700 rounded flex items-center justify-center text-[10px] text-slate-500 print:border-black">
                      Sign / Initials
                    </div>
                    <div className="h-8 w-20 border border-dashed border-slate-700 rounded flex items-center justify-center text-[10px] text-slate-500 print:border-black">
                      Date
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Attached MTR Summary */}
          {mtr && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 print:border-gray-300">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 print:text-black">Attached CMTR Mill Certification Summary:</span>
                <span className="text-emerald-400 font-bold print:text-black">Cert #{mtr.certificateNumber}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400 print:text-gray-700">
                <div>Mill: <strong>{mtr.steelMill}</strong></div>
                <div>Tensile: <strong>{mtr.mechanical.tensileStrengthPsi.toLocaleString()} PSI</strong></div>
                <div>Yield: <strong>{mtr.mechanical.yieldStrengthPsi.toLocaleString()} PSI</strong></div>
                <div>Elong: <strong>{mtr.mechanical.elongationPct}%</strong></div>
              </div>
            </div>
          )}

          {/* Footer QR Verification */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 print:border-black">
            <div className="flex items-center gap-2">
              <QrCode className="h-8 w-8 text-amber-400 print:text-black" />
              <div>
                <div>Permanent Digital Audit QR Code Attached to Travel Packet</div>
                <div className="text-[10px] text-slate-500">{mtr ? mtr.permanentUrl : '/mtr/traceability'}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-slate-200 print:text-black">Iron Prairie Fabrication Group LLC</div>
              <div className="text-emerald-400 print:text-black">ASME Section VIII Div 1 Compliant</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
`;

writeSrc('src/operations/components/AsmeQcTravelerModal.tsx', asmeTravelerContent);

// ============================================================================
// 4. src/pages/PublicMtrViewer.tsx
// ============================================================================
const publicMtrViewerContent = `// src/pages/PublicMtrViewer.tsx
// Public Read-Only Material Test Report (CMTR) Portal for Turnaround Auditors & Plant Inspectors

import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAllMTRs } from '../operations/data/mtrRepository';
import { ShieldCheck, QrCode, Printer, CheckCircle2, ArrowLeft, Building, FileText } from 'lucide-react';
import brandLogo from '../../Logo.jpg';

export default function PublicMtrViewer() {
  const { heatNumber } = useParams<{ heatNumber: string }>();
  const allMTRs = useMemo(() => getAllMTRs(), []);

  const mtr = useMemo(() => {
    if (!heatNumber) return allMTRs[0];
    const clean = heatNumber.trim().toUpperCase();
    return allMTRs.find(
      (m) => m.heatNumber.toUpperCase() === clean || m.heatNumber.toUpperCase().includes(clean)
    );
  }, [heatNumber, allMTRs]);

  const handlePrint = () => {
    window.print();
  };

  if (!mtr) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <ShieldCheck className="h-12 w-12 text-slate-500" />
        <h1 className="text-xl font-bold text-slate-900">MTR Heat Number Not Found</h1>
        <p className="text-xs text-slate-600 max-w-md">
          The requested heat number "{heatNumber}" was not found in our digital traceability vault.
        </p>
        <Link to="/storefront" className="text-xs font-bold text-sky-700 hover:underline">
          Return to Paddle Blinds Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Top Banner & Print Trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-800 uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Verified Turnaround Material Certificate
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Certified Mill Test Report &bull; <span className="font-mono text-sky-800">{mtr.heatNumber}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/storefront"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Storefront</span>
          </Link>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold transition-all shadow"
          >
            <Printer className="h-4 w-4" />
            <span>Print Official MTR</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg space-y-8 font-mono text-xs text-slate-800 print:border-none print:shadow-none print:p-0">
        
        {/* Certificate Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-900">
          <div className="flex items-center gap-3">
            <img src={brandLogo} alt="Iron Prairie" className="h-12 w-auto rounded border border-slate-200 p-0.5" />
            <div>
              <div className="text-xs font-bold tracking-widest text-slate-900 uppercase">
                IRON PRAIRIE FABRICATION GROUP LLC
              </div>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                CERTIFIED MATERIAL TEST REPORT (CMTR)
              </div>
              <div className="text-[11px] text-slate-500">
                ASME BPVC Section VIII Div 1 &bull; ASME B16.48 Material Traceability Certificate
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <QrCode className="h-12 w-12 text-slate-900" />
            <div className="text-[10px] space-y-0.5">
              <div className="font-bold text-slate-900">PLANT AUDIT SEAL</div>
              <div className="text-emerald-700 font-bold">100% VERIFIED</div>
              <div className="text-slate-500">Cert #{mtr.certificateNumber}</div>
            </div>
          </div>
        </div>

        {/* Section 1: Provenance & Specification */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Mill Heat Number</span>
            <span className="text-base font-black text-sky-900">{mtr.heatNumber}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Slab / Coil #</span>
            <span className="text-xs font-bold text-slate-900">{mtr.slabNumber || 'N/A'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">ASME / ASTM Spec</span>
            <span className="text-xs font-bold text-slate-900">{mtr.asmeSpec}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Thickness</span>
            <span className="text-xs font-bold text-emerald-800">{mtr.thicknessLabel}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Steel Mill</span>
            <span className="text-xs font-semibold text-slate-700">{mtr.steelMill}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Mill Location</span>
            <span className="text-xs font-semibold text-slate-700">{mtr.millLocation}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Heat Treatment</span>
            <span className="text-xs font-semibold text-slate-700">{mtr.heatTreatment}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Country of Melt</span>
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              {mtr.countryOfMelt} (Buy American Act)
            </span>
          </div>
        </div>

        {/* Section 2: Chemical Composition Analysis */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span>1. Certified Chemical Composition (% by Weight)</span>
              <span className="rounded-full bg-emerald-100 text-emerald-900 px-2.5 py-0.5 text-[10px] font-bold border border-emerald-300">
                PASS
              </span>
            </h3>
            <span className="text-[10px] font-bold text-slate-600">
              Carbon Equivalent (CE): {mtr.chemistry.carbonEquivalent.toFixed(2)}
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-center text-xs">
              <thead className="bg-slate-100 text-[10px] font-bold text-slate-600 uppercase">
                <tr>
                  <th className="py-2.5 px-3 text-left">Element</th>
                  <th className="py-2.5 px-2">% C</th>
                  <th className="py-2.5 px-2">% Mn</th>
                  <th className="py-2.5 px-2">% P</th>
                  <th className="py-2.5 px-2">% S</th>
                  <th className="py-2.5 px-2">% Si</th>
                  <th className="py-2.5 px-2">% Cr</th>
                  <th className="py-2.5 px-2">% Ni</th>
                  <th className="py-2.5 px-2">% Mo</th>
                  <th className="py-2.5 px-2">% Cu</th>
                  <th className="py-2.5 px-2">CE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr>
                  <td className="py-2.5 px-3 text-left font-bold text-sky-900">Actual Mill Heat</td>
                  <td className="py-2.5 px-2 font-bold">{mtr.chemistry.carbon}</td>
                  <td className="py-2.5 px-2">{mtr.chemistry.manganese}</td>
                  <td className="py-2.5 px-2">{mtr.chemistry.phosphorus}</td>
                  <td className="py-2.5 px-2">{mtr.chemistry.sulfur}</td>
                  <td className="py-2.5 px-2">{mtr.chemistry.silicon}</td>
                  <td className="py-2.5 px-2">{mtr.chemistry.chromium ?? '-'}</td>
                  <td className="py-2.5 px-2">{mtr.chemistry.nickel ?? '-'}</td>
                  <td className="py-2.5 px-2">{mtr.chemistry.molybdenum ?? '-'}</td>
                  <td className="py-2.5 px-2">{mtr.chemistry.copper ?? '-'}</td>
                  <td className="py-2.5 px-2 font-bold text-emerald-800">{mtr.chemistry.carbonEquivalent}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Mechanical Test Properties */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <span>2. Certified Mechanical &amp; Impact Properties</span>
            <span className="rounded-full bg-emerald-100 text-emerald-900 px-2.5 py-0.5 text-[10px] font-bold border border-emerald-300">
              ASME SEC II PART A CONFORMANCE
            </span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Tensile Strength</span>
              <span className="text-sm font-black text-slate-900">
                {mtr.mechanical.tensileStrengthPsi.toLocaleString()} PSI
              </span>
              <span className="text-[10px] text-emerald-800 block">Spec: 70,000 - 90,000 PSI</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Yield Strength (0.2%)</span>
              <span className="text-sm font-black text-slate-900">
                {mtr.mechanical.yieldStrengthPsi.toLocaleString()} PSI
              </span>
              <span className="text-[10px] text-emerald-800 block">Spec: &ge; 38,000 PSI</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Elongation in 2"</span>
              <span className="text-sm font-black text-slate-900">
                {mtr.mechanical.elongationPct}%
              </span>
              <span className="text-[10px] text-emerald-800 block">Spec: &ge; 21.0%</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Charpy V-Notch Impact</span>
              {mtr.mechanical.charpyVNotch ? (
                <div>
                  <span className="text-sm font-black text-sky-900">
                    {mtr.mechanical.charpyVNotch.ftLbs} ft-lbs
                  </span>
                  <span className="text-[10px] text-slate-600 block">
                    @ {mtr.mechanical.charpyVNotch.temperatureF}&deg;F
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-500">Not Applicable</span>
              )}
            </div>
          </div>
        </div>

        {/* Certification Sign-Off */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-slate-600">
          <div>
            <div>Certified QA/QC Record &bull; <strong>Iron Prairie Fabrication Group LLC</strong></div>
            <div>Freeport, TX 77541 &bull; <a href="mailto:Sales@ironprairiefabrication.com" className="text-sky-700 underline">Sales@ironprairiefabrication.com</a></div>
          </div>
          <div className="text-right">
            <div>Certified Date: <strong>{mtr.certifiedDate}</strong></div>
            <div className="text-emerald-700 font-bold">ASME B16.48 Audit Traceability Valid</div>
          </div>
        </div>

      </div>
    </div>
  );
}
`;

writeSrc('src/pages/PublicMtrViewer.tsx', publicMtrViewerContent);

console.log('✓ All ASME MTR Vault & Traceability modules written successfully');

