// src/operations/components/HeatMatcherPanel.tsx
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
                className={`flex items-center justify-between p-2.5 rounded-lg border font-mono text-xs transition-all ${
                  isCurrentlyAssigned
                    ? 'border-emerald-500/80 bg-emerald-500/10'
                    : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                }`}
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
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                      isCurrentlyAssigned
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-orange-500 hover:bg-orange-400 text-slate-950 shadow'
                    }`}
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
