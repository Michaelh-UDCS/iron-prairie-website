// src/erp/screens/ErpNcrLogScreen.tsx
// ISO 9001 & ASME Quality Non-Conformance Report (NCR) Log & CAPA Hub for IPG

import React, { useState } from 'react';
import { useErp } from '../context/ErpContext';
import {
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  ShieldCheck,
  Flame,
  FileText,
  UserCheck,
  X
} from 'lucide-react';
import { NcrRecord } from '../../types';

export const ErpNcrLogScreen: React.FC = () => {
  const { ncrRecords, addNcrRecord, updateNcrRecord, signOffNcr, workOrders } = useErp();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedNcr, setSelectedNcr] = useState<NcrRecord | null>(ncrRecords[0] || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New NCR Form State
  const [linkedJob, setLinkedJob] = useState(workOrders[0]?.jobNumber || '');
  const [partNumber, setPartNumber] = useState('PBSA51670-C150T0120S4');
  const [heatNumber, setHeatNumber] = useState('K49201-B');
  const [source, setSource] = useState<NcrRecord['source']>('Internal Laser Cutting');
  const [category, setCategory] = useState<NcrRecord['defectCategory']>('Laser Kerf / Taper');
  const [severity, setSeverity] = useState<NcrRecord['severity']>('Minor (Reworkable)');
  const [description, setDescription] = useState('Handle edge showed minor dross accumulation.');
  const [rootCause, setRootCause] = useState('Laser nozzle tip wear.');
  const [disposition, setDisposition] = useState<NcrRecord['disposition']>('Rework to Spec');
  const [correctiveAction, setCorrectiveAction] = useState('Deburred with ceramic disc; replaced laser nozzle.');
  const [preventiveAction, setPreventiveAction] = useState('Inspect nozzle tip on daily 40-hour checklist.');
  const [assignedPerson, setAssignedPerson] = useState('Cody W. (Laser Tech)');

  const filteredNcrs = ncrRecords.filter((ncr) => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return true;
    return (
      ncr.ncrNumber.toLowerCase().includes(q) ||
      ncr.defectCategory.toLowerCase().includes(q) ||
      ncr.defectDescription.toLowerCase().includes(q) ||
      (ncr.linkedJobNumber && ncr.linkedJobNumber.toLowerCase().includes(q)) ||
      (ncr.heatNumber && ncr.heatNumber.toLowerCase().includes(q))
    );
  });

  const handleCreateNcr = (e: React.FormEvent) => {
    e.preventDefault();
    const newNcrNumber = addNcrRecord({
      linkedJobNumber: linkedJob,
      partNumber,
      heatNumber,
      source,
      defectCategory: category,
      severity,
      defectDescription: description,
      rootCauseAnalysis: rootCause,
      disposition,
      correctiveAction,
      preventiveAction,
      assignedPerson,
      status: 'Open',
    });

    setIsAddModalOpen(false);
  };

  const handleSignOff = (ncrNumber: string) => {
    signOffNcr(ncrNumber, 'Michael Huerta (QA Manager)');
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-red-400 font-bold uppercase text-[11px]">
            <AlertTriangle className="h-4 w-4" />
            <span>Quality Assurance &amp; CAPA Root Cause Analysis</span>
          </div>
          <h1 className="text-xl font-black text-white">NCR Non-Conformance Quality Log</h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>+ Log Quality NCR</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <Search className="h-4 w-4 text-amber-400 shrink-0" />
        <input
          type="text"
          placeholder="Search NCR # (e.g. IPG-NCR-2026-001), Job #, Heat #, or Defect..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: NCR List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase pb-1">
            <span>Quality Reports ({filteredNcrs.length})</span>
            <span className="text-amber-400">ASME / ISO 9001</span>
          </div>

          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {filteredNcrs.map((ncr) => {
              const isSelected = selectedNcr?.ncrNumber === ncr.ncrNumber;
              const isClosed = ncr.status === 'Closed';
              return (
                <div
                  key={ncr.ncrNumber}
                  onClick={() => setSelectedNcr(ncr)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/80 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-black text-amber-400 text-xs">
                      {ncr.ncrNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      isClosed
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border-red-500/40'
                    }`}>
                      {ncr.status}
                    </span>
                  </div>

                  <div className="font-bold text-slate-200 truncate">{ncr.defectCategory}</div>
                  <div className="text-[11px] text-slate-400 truncate">
                    Job: {ncr.linkedJobNumber || 'N/A'} &bull; HT#: {ncr.heatNumber || 'N/A'}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                    <span>Logged: {ncr.dateLogged}</span>
                    <span className="text-amber-300 font-bold">Disp: {ncr.disposition}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Detailed NCR Investigation */}
        <div className="lg:col-span-7 space-y-4">
          {selectedNcr ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div>
                  <div className="text-[10px] text-red-400 font-bold uppercase">Non-Conformance Investigation</div>
                  <h2 className="text-base font-black text-white mt-0.5">{selectedNcr.ncrNumber}</h2>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Logged Date: {selectedNcr.dateLogged} &bull; Origin: {selectedNcr.source}
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    selectedNcr.status === 'Closed'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-red-500/20 text-red-400 border-red-500/40'
                  }`}>
                    {selectedNcr.status}
                  </span>
                </div>
              </div>

              {/* Cross-References */}
              <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-500 font-bold">Linked Job #:</span>
                  <div className="font-bold text-amber-400">{selectedNcr.linkedJobNumber || 'General Stock'}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">Heat Number (HT#):</span>
                  <div className="font-mono text-sky-400">{selectedNcr.heatNumber || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">Severity:</span>
                  <div className="font-bold text-red-400">{selectedNcr.severity}</div>
                </div>
              </div>

              {/* Defect Description */}
              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Defect Description</div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
                  {selectedNcr.defectDescription}
                </div>
              </div>

              {/* Root Cause Analysis */}
              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Root Cause Analysis</div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
                  {selectedNcr.rootCauseAnalysis}
                </div>
              </div>

              {/* Disposition & CAPA */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Disposition</div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-bold text-amber-400">
                    {selectedNcr.disposition}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Assigned Tech</div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-bold text-slate-200">
                    {selectedNcr.assignedPerson}
                  </div>
                </div>
              </div>

              {/* Corrective & Preventive Action */}
              <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px]">
                <div>
                  <strong className="text-emerald-400">Corrective Action (CAPA): </strong>
                  <span className="text-slate-300">{selectedNcr.correctiveAction}</span>
                </div>
                <div className="pt-2 border-t border-slate-900">
                  <strong className="text-sky-400">Preventive Action: </strong>
                  <span className="text-slate-300">{selectedNcr.preventiveAction}</span>
                </div>
              </div>

              {/* QA Sign-off */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <div>
                  {selectedNcr.qaManagerSignOff ? (
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Approved &amp; Signed Off by {selectedNcr.qaManagerName} ({selectedNcr.closureDate})</span>
                    </div>
                  ) : (
                    <div className="text-amber-400 text-xs font-semibold">
                      Pending QA Manager Sign-Off
                    </div>
                  )}
                </div>

                {!selectedNcr.qaManagerSignOff && (
                  <button
                    onClick={() => handleSignOff(selectedNcr.ncrNumber)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow"
                  >
                    <UserCheck className="h-4 w-4" />
                    <span>Sign Off &amp; Close NCR</span>
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-600 bg-slate-900 border border-slate-800 rounded-2xl">
              <AlertTriangle className="h-10 w-10 mx-auto mb-2 opacity-40 text-red-400" />
              <p>Select an NCR record on the left to view root cause analysis and corrective action.</p>
            </div>
          )}
        </div>

      </div>

      {/* Add New NCR Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="font-bold text-white text-sm">LOG NEW NON-CONFORMANCE REPORT (NCR)</div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateNcr} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Linked Job #</label>
                  <select
                    value={linkedJob}
                    onChange={(e) => setLinkedJob(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-bold focus:outline-none"
                  >
                    <option value="">N/A (Stock/Receiving)</option>
                    {workOrders.map((wo) => (
                      <option key={wo.jobNumber} value={wo.jobNumber}>{wo.jobNumber} - {wo.clientCompanyName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Heat Number (HT#)</label>
                  <input
                    type="text"
                    value={heatNumber}
                    onChange={(e) => setHeatNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-amber-400 font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Defect Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="Dimensional Out of Tolerance">Dimensional Out of Tolerance</option>
                    <option value="Material Surface Flaw">Material Surface Flaw</option>
                    <option value="Laser Kerf / Taper">Laser Kerf / Taper</option>
                    <option value="Bevel Angle Incorrect">Bevel Angle Incorrect</option>
                    <option value="Missing MTR / Traceability">Missing MTR / Traceability</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Disposition</label>
                  <select
                    value={disposition}
                    onChange={(e) => setDisposition(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="Rework to Spec">Rework to Spec</option>
                    <option value="Scrap">Scrap</option>
                    <option value="Return to Supplier">Return to Supplier</option>
                    <option value="Use As-Is (Engineer Approval)">Use As-Is (Engineer Approval)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Defect Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Root Cause Analysis</label>
                <textarea
                  rows={2}
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  required
                />
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
                  Log NCR Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
