// src/erp/components/BackupRestoreModal.tsx
// Local-First Disaster Recovery Snapshot & Google Drive Cloud Backup Modal for IPG

import React, { useRef, useState } from 'react';
import { useErp } from '../context/ErpContext';
import {
  Download,
  Upload,
  HardDrive,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  FileJson,
  Database,
  ExternalLink
} from 'lucide-react';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({ isOpen, onClose }) => {
  const {
    exportBackupSnapshot,
    importBackupSnapshot,
    resetToDefaultSeedData,
    isOnline,
    lastSyncedAt,
    pendingSyncCount,
    triggerManualSync,
    workOrders,
    stockInventory,
    mtrDatabase,
  } = useErp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importBackupSnapshot(content);
      setImportStatus(success ? 'success' : 'error');
      setTimeout(() => setImportStatus('idle'), 4000);
    };
    reader.readAsText(file);
  };

  const handleCloudSync = async () => {
    setIsSyncing(true);
    await triggerManualSync();
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <Database className="h-5 w-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-white uppercase">Disaster Recovery &amp; Google Drive Cloud Sync</h2>
              <p className="text-[11px] text-slate-400">Local-First Persistence &bull; Bay City Shop Hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Real-Time Connectivity Status */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`h-3 w-3 rounded-full animate-pulse ${isOnline ? 'bg-emerald-500' : 'bg-cyan-500'}`} />
              <div>
                <div className="font-bold text-slate-100">
                  {isOnline ? '🟢 Online - Cloud Replicated' : '🔵 Offline Mode (Local Storage Resilient)'}
                </div>
                <div className="text-[11px] text-slate-400">
                  Last Cloud Checkpoint: {lastSyncedAt} &bull; Active Work Orders: {workOrders.length}
                </div>
              </div>
            </div>

            <button
              onClick={handleCloudSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
            </button>
          </div>

          {/* Local Snapshot Operations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Export Snapshot */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase">
                <HardDrive className="h-4 w-4" />
                <span>1-Click Local Backup</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Downloads a complete JSON snapshot containing all Work Orders, MTRs, Stock Inventory, POs, NCRs, and Invoices directly to your PC, USB, or local shop NAS.
              </p>
              <button
                onClick={exportBackupSnapshot}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-cyan-500/20 active:scale-95"
              >
                <Download className="h-4 w-4" />
                <span>Export Local Snapshot</span>
              </button>
            </div>

            {/* Restore Snapshot */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                <Upload className="h-4 w-4" />
                <span>Restore From Backup</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Instantly restore database state from any previously exported `.json` snapshot file in case of device replacement or emergency.
              </p>
              
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-bold text-xs transition-all active:scale-95"
              >
                <FileJson className="h-4 w-4 text-emerald-400" />
                <span>Select Snapshot File (.json)</span>
              </button>

              {importStatus === 'success' && (
                <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Database restored successfully!</span>
                </div>
              )}
              {importStatus === 'error' && (
                <div className="text-[11px] text-red-400 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Invalid JSON backup file structure.</span>
                </div>
              )}
            </div>

          </div>

          {/* Google Drive Hierarchy Reference */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sky-400 font-bold uppercase text-xs">
                <Cloud className="h-4 w-4" />
                <span>Google Drive Storage Architecture</span>
              </div>
              <span className="text-[10px] text-slate-500">Google Workspace Integrated</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              IPG's Google Drive is automatically structured to organize and link engineering and quality documents:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 font-mono">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                📁 <strong>01_Work_Orders/</strong> (Job folders &amp; travelers)
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                📁 <strong>02_MTR_Vault/</strong> (Mill certs by material)
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                📁 <strong>03_Purchase_Orders/</strong> (Supplier PO copies)
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                📁 <strong>04_Doc_Control/</strong> (CAD prints &amp; WPS)
              </div>
            </div>
          </div>

          {/* Factory Reset Danger Zone */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-[11px]">
            <span className="text-slate-500">Need to reset demo records?</span>
            <button
              onClick={resetToDefaultSeedData}
              className="text-red-400 hover:text-red-300 underline font-semibold transition-colors"
            >
              Reset to Default Industrial Seed Data
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
