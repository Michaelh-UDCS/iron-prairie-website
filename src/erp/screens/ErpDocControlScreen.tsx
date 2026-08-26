// src/erp/screens/ErpDocControlScreen.tsx
// Document Control, CAD Drawings, Revisions & Google Drive Integration Hub for IPG

import React, { useState } from 'react';
import { useErp } from '../context/ErpContext';
import {
  FolderKanban,
  Plus,
  Search,
  FileText,
  Cloud,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  FolderOpen,
  Upload,
  X
} from 'lucide-react';
import { DocControlItem } from '../../types';

export const ErpDocControlScreen: React.FC = () => {
  const { docControlItems, addDocControlItem, workOrders, setActiveModuleId } = useErp();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<DocControlItem | null>(docControlItems[0] || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Doc Form
  const [newDocNum, setNewDocNum] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DocControlItem['category']>('CAD Drawing (DWG/DXF)');
  const [newRev, setNewRev] = useState('Rev 0');
  const [newJobRef, setNewJobRef] = useState(workOrders[0]?.jobNumber || '');
  const [newFormat, setNewFormat] = useState<DocControlItem['fileFormat']>('DXF');
  const [newDriveUrl, setNewDriveUrl] = useState('https://drive.google.com/drive/folders/ipg-drawings');

  const filteredDocs = docControlItems.filter((doc) => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return true;
    return (
      doc.docNumber.toLowerCase().includes(q) ||
      doc.title.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q) ||
      (doc.linkedJobNumber && doc.linkedJobNumber.toLowerCase().includes(q)) ||
      (doc.clientName && doc.clientName.toLowerCase().includes(q))
    );
  });

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocNum || !newTitle) return;

    addDocControlItem({
      docNumber: newDocNum,
      title: newTitle,
      category: newCategory,
      revision: newRev,
      linkedJobNumber: newJobRef,
      fileFormat: newFormat,
      fileSizeMb: 2.5,
      googleDriveUrl: newDriveUrl,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'Michael Huerta',
      approvedBy: 'Michael Huerta (Managing Principal)',
      status: 'Active / Approved for Cutting',
      tags: ['CAD', 'Cutting Print', 'B16.48'],
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px]">
            <FolderKanban className="h-4 w-4" />
            <span>Engineering Prints, CAD DWG/DXF &amp; WPS Control</span>
          </div>
          <h1 className="text-xl font-black text-white">Document Control &amp; Drawing Vault</h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>+ Upload / Register Document</span>
          </button>
        </div>
      </div>

      {/* Google Drive Workspace Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-sky-950/40 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow">
        <div className="flex items-center gap-3">
          <Cloud className="h-6 w-6 text-sky-400 shrink-0" />
          <div>
            <div className="font-bold text-white text-xs">Google Drive Master Archive Connected</div>
            <div className="text-[11px] text-slate-400">
              Synced with <span className="text-sky-300">04_Doc_Control_Drawings/</span> on Google Drive Workspace
            </div>
          </div>
        </div>

        <a
          href="https://drive.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 text-xs font-bold transition-colors w-fit"
        >
          <FolderOpen className="h-4 w-4" />
          <span>Open Google Drive Folder</span>
          <ExternalLink className="h-3 w-3 ml-0.5" />
        </a>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <Search className="h-4 w-4 text-cyan-400 shrink-0" />
        <input
          type="text"
          placeholder="Search Drawing # (e.g. DWG-IPG-2026-042), Revision, Job #, or Title..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Split Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: Document List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase pb-1">
            <span>Controlled Drawings ({filteredDocs.length})</span>
            <span className="text-emerald-400">Revision Managed</span>
          </div>

          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {filteredDocs.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/80 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-black text-cyan-400 text-xs">
                      {doc.docNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {doc.revision}
                    </span>
                  </div>

                  <div className="font-bold text-slate-200 truncate">{doc.title}</div>
                  <div className="text-[11px] text-slate-400 truncate">
                    Category: {doc.category} &bull; Format: {doc.fileFormat}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                    <span>Job Ref: {doc.linkedJobNumber || 'General'}</span>
                    <span className="text-emerald-400 font-bold">{doc.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Detailed Document Inspector */}
        <div className="lg:col-span-7 space-y-4">
          {selectedDoc ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div>
                  <div className="text-[10px] text-cyan-400 font-bold uppercase">{selectedDoc.category}</div>
                  <h2 className="text-base font-black text-white mt-0.5">{selectedDoc.docNumber} ({selectedDoc.revision})</h2>
                  <div className="text-[11px] text-slate-400 mt-1">{selectedDoc.title}</div>
                </div>

                <a
                  href={selectedDoc.googleDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs transition-all shadow"
                >
                  <Cloud className="h-3.5 w-3.5" />
                  <span>Open in Drive</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Meta Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-500 font-bold">Linked Job #:</span>
                  <div className="font-bold text-cyan-400">{selectedDoc.linkedJobNumber || 'General Vault'}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">File Format / Size:</span>
                  <div className="font-bold text-slate-200">{selectedDoc.fileFormat} &bull; {selectedDoc.fileSizeMb} MB</div>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">Revision Level:</span>
                  <div className="font-bold text-emerald-400">{selectedDoc.revision}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">Uploaded Date:</span>
                  <div className="text-slate-300">{selectedDoc.uploadDate}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">Approved By:</span>
                  <div className="text-slate-200">{selectedDoc.approvedBy}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">Status:</span>
                  <div className="font-bold text-emerald-400">{selectedDoc.status}</div>
                </div>
              </div>

              {/* Drawing Preview Frame */}
              <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-2">
                <FileText className="h-10 w-10 mx-auto text-cyan-400/80" />
                <div className="font-bold text-slate-200 text-xs">{selectedDoc.title}</div>
                <div className="text-[10px] text-slate-500">
                  Direct Google Drive Cloud Link: <span className="text-sky-400 underline">{selectedDoc.googleDriveUrl}</span>
                </div>
              </div>

              {/* Cross-Reference Navigation */}
              {selectedDoc.linkedJobNumber && (
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Associated with active production job:</span>
                  <button
                    onClick={() => setActiveModuleId('work_orders')}
                    className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold hover:bg-cyan-500/30"
                  >
                    View Job #{selectedDoc.linkedJobNumber} &rarr;
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center text-slate-600 bg-slate-900 border border-slate-800 rounded-2xl">
              <FolderKanban className="h-10 w-10 mx-auto mb-2 opacity-40 text-cyan-400" />
              <p>Select a drawing or document from the left to inspect revision and metadata.</p>
            </div>
          )}
        </div>

      </div>

      {/* Add Document Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="font-bold text-white text-sm">REGISTER PROJECT DRAWING / DOCUMENT</div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateDoc} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Drawing / Doc #</label>
                  <input
                    type="text"
                    placeholder="e.g. DWG-IPG-2026-045"
                    value={newDocNum}
                    onChange={(e) => setNewDocNum(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-cyan-400 font-bold focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Revision</label>
                  <input
                    type="text"
                    value={newRev}
                    onChange={(e) => setNewRev(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. 10in Class 300 Stainless 316L Paddle Blind Geometry"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="CAD Drawing (DWG/DXF)">CAD Drawing (DWG/DXF)</option>
                    <option value="Fabrication Blueprint (PDF)">Fabrication Blueprint (PDF)</option>
                    <option value="WPS/PQR Procedure">WPS/PQR Procedure</option>
                    <option value="Inspection Report">Inspection Report</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Format</label>
                  <select
                    value={newFormat}
                    onChange={(e) => setNewFormat(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="DXF">DXF</option>
                    <option value="DWG">DWG</option>
                    <option value="PDF">PDF</option>
                    <option value="STEP">STEP</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Linked Job #</label>
                  <select
                    value={newJobRef}
                    onChange={(e) => setNewJobRef(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="">General (No Job)</option>
                    {workOrders.map((wo) => (
                      <option key={wo.jobNumber} value={wo.jobNumber}>{wo.jobNumber} - {wo.clientCompanyName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Google Drive File Link</label>
                <input
                  type="url"
                  value={newDriveUrl}
                  onChange={(e) => setNewDriveUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sky-400 focus:outline-none"
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
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black hover:bg-cyan-400 shadow-md shadow-cyan-500/20"
                >
                  Register Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
