// src/erp/screens/ErpModuleManagerScreen.tsx
// Modular Screen Registry & Custom Screen Builder for IPG ERP
// Enables effortless creation and registration of new operational screens

import React, { useState } from 'react';
import { useErp } from '../context/ErpContext';
import {
  Grid,
  Plus,
  CheckCircle2,
  SlidersHorizontal,
  FolderKanban,
  Sparkles,
  ShieldCheck,
  Truck,
  Boxes,
  Receipt,
  Mail,
  Flame,
  LayoutDashboard,
  Layers,
  X
} from 'lucide-react';
import { ErpModuleDefinition } from '../../types';

export const ErpModuleManagerScreen: React.FC = () => {
  const { registeredModules, toggleModule, registerCustomModule, setActiveModuleId } = useErp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleCategory, setNewModuleCategory] = useState<ErpModuleDefinition['category']>('Operations');
  const [newModuleDesc, setNewModuleDesc] = useState('');
  const [newModuleIcon, setNewModuleIcon] = useState('Flame');

  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleName) return;

    const id = newModuleName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    registerCustomModule({
      id,
      name: newModuleName,
      category: newModuleCategory,
      description: newModuleDesc || 'Custom operational workflow screen.',
      iconName: newModuleIcon,
      enabled: true,
    });

    setIsAddModalOpen(false);
    setNewModuleName('');
    setNewModuleDesc('');
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[11px]">
            <Grid className="h-4 w-4" />
            <span>Extensible Architecture &bull; Open Screen Registry</span>
          </div>
          <h1 className="text-xl font-black text-white">Module Registry &amp; Screen Builder</h1>
          <p className="text-xs text-slate-400 mt-1">
            Easily manage active ERP modules and register new specialized screens as your business grows.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>+ Register New Custom Screen</span>
        </button>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {registeredModules.map((mod) => (
          <div
            key={mod.id}
            className={`p-5 rounded-2xl border transition-all space-y-3 ${
              mod.enabled
                ? 'bg-slate-900 border-slate-800 hover:border-amber-500/50 shadow'
                : 'bg-slate-950/60 border-slate-900 opacity-60'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-white text-sm">{mod.name}</div>
                <span className="text-[10px] text-amber-400 font-semibold">{mod.category}</span>
              </div>

              <button
                onClick={() => toggleModule(mod.id)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                  mod.enabled
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {mod.enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed min-h-[36px]">
              {mod.description}
            </p>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800/80 text-[11px]">
              <span className="text-slate-500 font-mono text-[10px]">ID: {mod.id}</span>
              {mod.enabled && (
                <button
                  onClick={() => setActiveModuleId(mod.id)}
                  className="text-amber-400 hover:text-amber-300 font-bold hover:underline"
                >
                  Launch Screen &rarr;
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Screen Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="font-bold text-white text-sm">REGISTER NEW ERP SCREEN / MODULE</div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateModule} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Screen / Module Name</label>
                <input
                  type="text"
                  placeholder="e.g. Laser Nesting Queue, Weld Inspection Log, Logistics Dispatch"
                  value={newModuleName}
                  onChange={(e) => setNewModuleName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 font-bold focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Category</label>
                  <select
                    value={newModuleCategory}
                    onChange={(e) => setNewModuleCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Quality & Materials">Quality &amp; Materials</option>
                    <option value="Supply Chain & Finance">Supply Chain &amp; Finance</option>
                    <option value="Engineering & System">Engineering &amp; System</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Icon Style</label>
                  <select
                    value={newModuleIcon}
                    onChange={(e) => setNewModuleIcon(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
                  >
                    <option value="Flame">Flame (Production)</option>
                    <option value="ShieldCheck">Shield (Quality)</option>
                    <option value="Truck">Truck (Logistics)</option>
                    <option value="Boxes">Boxes (Inventory)</option>
                    <option value="Receipt">Receipt (Finance)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Screen Description / Purpose</label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe what this operational screen handles..."
                  value={newModuleDesc}
                  onChange={(e) => setNewModuleDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none"
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
                  Register Screen in ERP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
