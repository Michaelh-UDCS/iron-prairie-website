// src/erp/ErpShell.tsx
// Master Operations Workspace Shell for Iron Prairie Group LLC (Bay City, TX)
// Unifies Navigation, Real-time Offline Resilience, Global Search & Modular Stage

import React, { useState } from 'react';
import { useErp } from './context/ErpContext';
import brandLogo from '../../Logo.jpg';
import {
  LayoutDashboard,
  Flame,
  Layers,
  Mail,
  ShieldCheck,
  Boxes,
  AlertTriangle,
  Truck,
  Receipt,
  FolderKanban,
  Sparkles,
  Grid,
  Search,
  Volume2,
  VolumeX,
  HardDrive,
  ExternalLink,
  Menu,
  X,
  CheckCircle2,
  Cloud,
  ChevronRight,
  Lock
} from 'lucide-react';
import { chimeManager } from '../operations/services/AudioChimeManager';
import { ErpDashboardScreen } from './screens/ErpDashboardScreen';
import { ErpWorkOrdersScreen } from './screens/ErpWorkOrdersScreen';
import { ErpCatalogOrdersScreen } from './screens/ErpCatalogOrdersScreen';
import { ErpSalesTriggerInboxScreen } from './screens/ErpSalesTriggerInboxScreen';
import { ErpMtrLogScreen } from './screens/ErpMtrLogScreen';
import { ErpStockMaterialScreen } from './screens/ErpStockMaterialScreen';
import { ErpPurchaseOrdersScreen } from './screens/ErpPurchaseOrdersScreen';
import { ErpNcrLogScreen } from './screens/ErpNcrLogScreen';
import { ErpApArInvoicesScreen } from './screens/ErpApArInvoicesScreen';
import { ErpDocControlScreen } from './screens/ErpDocControlScreen';
import { ErpAutoIngestionHubScreen } from './screens/ErpAutoIngestionHubScreen';
import { ErpModuleManagerScreen } from './screens/ErpModuleManagerScreen';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { BackupRestoreModal } from './components/BackupRestoreModal';

const ICON_MAP: Record<string, any> = {
  LayoutDashboard,
  Flame,
  Layers,
  Mail,
  ShieldCheck,
  Boxes,
  AlertTriangle,
  Truck,
  Receipt,
  FolderKanban,
  Sparkles,
  Grid,
};

export const ErpShell: React.FC = () => {
  const {
    activeModuleId,
    setActiveModuleId,
    registeredModules,
    isOnline,
    lastSyncedAt,
    workOrders,
    stockInventory,
    ncrRecords,
    salesEmailTriggers,
    simulateSalesEmailTrigger,
  } = useErp();

  const [audioEnabled, setAudioEnabled] = useState(chimeManager.isEnabled());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleAudio = () => {
    const next = !audioEnabled;
    chimeManager.setEnabled(next);
    setAudioEnabled(next);
    if (next) chimeManager.playNewOrderChime();
  };

  // Dynamic Badge Counters
  const getBadgeCount = (id: string): number | null => {
    if (id === 'work_orders') {
      const active = workOrders.filter((w) => w.stage !== 'Invoiced & Completed').length;
      return active > 0 ? active : null;
    }
    if (id === 'stock_inventory') {
      const low = stockInventory.filter((s) => s.availableQuantity <= s.minReorderThreshold).length;
      return low > 0 ? low : null;
    }
    if (id === 'ncr_log') {
      const open = ncrRecords.filter((n) => n.status !== 'Closed').length;
      return open > 0 ? open : null;
    }
    if (id === 'sales_triggers') {
      const unproc = salesEmailTriggers.filter((t) => t.status === 'New / Unprocessed').length;
      return unproc > 0 ? unproc : null;
    }
    return null;
  };

  // Active Screen Renderer
  const renderActiveScreen = () => {
    switch (activeModuleId) {
      case 'dashboard':
        return <ErpDashboardScreen />;
      case 'work_orders':
        return <ErpWorkOrdersScreen />;
      case 'catalog_orders':
        return <ErpCatalogOrdersScreen />;
      case 'sales_triggers':
        return <ErpSalesTriggerInboxScreen />;
      case 'mtr_vault':
        return <ErpMtrLogScreen />;
      case 'stock_inventory':
        return <ErpStockMaterialScreen />;
      case 'purchase_orders':
        return <ErpPurchaseOrdersScreen />;
      case 'ncr_log':
        return <ErpNcrLogScreen />;
      case 'ap_ar_invoicing':
        return <ErpApArInvoicesScreen />;
      case 'doc_control':
        return <ErpDocControlScreen />;
      case 'auto_ingestion':
        return <ErpAutoIngestionHubScreen />;
      case 'module_manager':
        return <ErpModuleManagerScreen />;
      default:
        return <ErpDashboardScreen />;
    }
  };

  // Grouped Navigation Categories
  const categories = ['Operations', 'Quality & Materials', 'Supply Chain & Finance', 'Engineering & System'] as const;

  const handleLockErp = () => {
    try {
      sessionStorage.removeItem('ipf_exec_auth_session');
      localStorage.removeItem('ipf_ops_authenticated');
      window.location.reload();
    } catch (e) {
      console.error(e);
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono flex flex-col selection:bg-cyan-500/30 selection:text-cyan-300">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-4 py-2.5">
        <div className="flex items-center justify-between gap-3 max-w-[1700px] mx-auto">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>

            <img
              src={brandLogo}
              alt="Iron Prairie Group LLC"
              className="h-9 w-auto rounded-lg border border-slate-700 bg-white p-0.5 object-contain"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-black text-cyan-400 tracking-wider">
                  IRON PRAIRIE GROUP
                </span>
                <span className="hidden sm:inline px-1.5 py-0.2 text-[9px] font-bold bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/40">
                  ERP PLATFORM
                </span>
              </div>
              <div className="text-[11px] font-bold text-slate-300 hidden md:block">
                Bay City Fabrication Facility &bull; ASME Section VIII Div 1
              </div>
            </div>
          </div>

          {/* Center Search & Cloud Status */}
          <div className="flex items-center gap-3">
            
            {/* Quick Search Shortcut Bar */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 text-xs transition-all w-64 lg:w-80"
            >
              <Search className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span className="truncate text-[11px]">Search Job #, HT#, PO#, SKU...</span>
              <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                Ctrl+K
              </kbd>
            </button>

            {/* Online / Local-Resilient Sync Status Badge */}
            <div
              onClick={() => setIsBackupOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-bold cursor-pointer hover:border-slate-700 transition-colors"
              title="Click to manage local backups & cloud sync"
            >
              <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-cyan-500'}`} />
              <span className="hidden sm:inline text-slate-300">
                {isOnline ? 'Cloud Synced' : 'Local Resilient (Offline)'}
              </span>
            </div>
          </div>

          {/* Right Header Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Audio Chime Toggle */}
            <button
              onClick={handleToggleAudio}
              className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                audioEnabled
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-800 bg-slate-950 text-slate-500'
              }`}
              title={audioEnabled ? 'Audio Chimes Enabled' : 'Chimes Muted'}
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Disaster Recovery Backup Button */}
            <button
              onClick={() => setIsBackupOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
              title="Disaster Recovery Local Snapshots"
            >
              <HardDrive className="h-4 w-4 text-cyan-400" />
              <span className="hidden sm:inline">Backup &amp; Drive</span>
            </button>

            {/* 1-Click Simulate Sales Email Trigger */}
            <button
              onClick={() => simulateSalesEmailTrigger()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-cyan-500/20 active:scale-95"
              title="Simulates an inbound sales email from sales@iron-prairie.com"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">+ Simulate Order</span>
            </button>

            {/* Lock Session Button */}
            <button
              onClick={handleLockErp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 border border-rose-500/40 text-xs font-black transition-all shadow-sm"
              title="Lock ERP Workspace & Revoke Active Session"
            >
              <Lock className="h-3.5 w-3.5 text-rose-400" />
              <span className="hidden md:inline">Lock ERP</span>
            </button>

            {/* Return to Public Website */}
            <a
              href="/"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-bold transition-colors"
              title="Return to Public Website"
            >
              <span className="hidden md:inline">Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

        </div>
      </header>

      {/* Main Layout Container with Sidebar & Stage */}
      <div className="flex-1 flex max-w-[1700px] w-full mx-auto">
        
        {/* Sidebar Navigation */}
        <aside
          className={`fixed lg:sticky top-14 left-0 z-30 h-[calc(100vh-3.5rem)] w-64 bg-slate-900 border-r border-slate-800 p-3 overflow-y-auto transition-transform duration-200 lg:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
        >
          <div className="space-y-4">
            {categories.map((cat) => {
              const catModules = registeredModules.filter((m) => m.category === cat && m.enabled);
              if (catModules.length === 0) return null;

              return (
                <div key={cat} className="space-y-1">
                  <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider px-2 py-1">
                    {cat}
                  </div>

                  <div className="space-y-0.5">
                    {catModules.map((mod) => {
                      const Icon = ICON_MAP[mod.iconName] || Flame;
                      const isActive = activeModuleId === mod.id;
                      const badge = getBadgeCount(mod.id);

                      return (
                        <button
                          key={mod.id}
                          onClick={() => {
                            setActiveModuleId(mod.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                            isActive
                              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 font-black'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                            <span className="truncate">{mod.name}</span>
                          </div>

                          {badge !== null && (
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-[9px] font-black shrink-0 ${
                                isActive
                                  ? 'bg-slate-950 text-cyan-400'
                                  : mod.id === 'ncr_log' || mod.id === 'stock_inventory'
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              }`}
                            >
                              {badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Operational Stage */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveScreen()}
        </main>

      </div>

      {/* Modals */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <BackupRestoreModal isOpen={isBackupOpen} onClose={() => setIsBackupOpen(false)} />

    </div>
  );
};
