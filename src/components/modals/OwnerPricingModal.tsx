// src/components/modals/OwnerPricingModal.tsx
// Owner Pricing & Steel Surcharge Matrix Modal

import React from 'react';
import { PricingConfig } from '../../types';
import { DEFAULT_PRICING_CONFIG } from '../../data/masterGeometry';
import { X, DollarSign, RefreshCw, CheckCircle2 } from 'lucide-react';

interface OwnerPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pricingConfig: PricingConfig;
  setPricingConfig: React.Dispatch<React.SetStateAction<PricingConfig>>;
}

export const OwnerPricingModal: React.FC<OwnerPricingModalProps> = ({
  isOpen,
  onClose,
  pricingConfig,
  setPricingConfig,
}) => {
  if (!isOpen) return null;

  const handleReset = () => {
    setPricingConfig(DEFAULT_PRICING_CONFIG);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md font-mono text-xs animate-fadeIn">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl p-6 space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">
              Owner Pricing &amp; Steel Surcharge Matrix
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto pr-1">
          
          {/* Global Markup */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-200">Global Storefront Markup:</span>
              <span className="text-base font-black text-amber-400">{pricingConfig.globalMarkupPct}%</span>
            </div>
            <input
              type="range"
              min="-20"
              max="50"
              step="1"
              value={pricingConfig.globalMarkupPct}
              onChange={(e) => setPricingConfig({ ...pricingConfig, globalMarkupPct: parseInt(e.target.value) })}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Raw Plate Rates per Lb */}
          <div className="space-y-2">
            <span className="font-bold text-slate-300 block uppercase text-[11px]">Raw Plate Rates ($/lb):</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">SA-516 Gr. 70</label>
                <input
                  type="number"
                  step="0.05"
                  value={pricingConfig.sa516PricePerLb}
                  onChange={(e) => setPricingConfig({ ...pricingConfig, sa516PricePerLb: parseFloat(e.target.value) || 2.15 })}
                  className="w-full bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">SA-36 Carbon</label>
                <input
                  type="number"
                  step="0.05"
                  value={pricingConfig.sa36PricePerLb}
                  onChange={(e) => setPricingConfig({ ...pricingConfig, sa36PricePerLb: parseFloat(e.target.value) || 1.85 })}
                  className="w-full bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">304 Stainless</label>
                <input
                  type="number"
                  step="0.10"
                  value={pricingConfig.ss304PricePerLb}
                  onChange={(e) => setPricingConfig({ ...pricingConfig, ss304PricePerLb: parseFloat(e.target.value) || 5.50 })}
                  className="w-full bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">304L Stainless</label>
                <input
                  type="number"
                  step="0.10"
                  value={pricingConfig.ss304LPricePerLb}
                  onChange={(e) => setPricingConfig({ ...pricingConfig, ss304LPricePerLb: parseFloat(e.target.value) || 5.95 })}
                  className="w-full bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">316L Moly SS</label>
                <input
                  type="number"
                  step="0.10"
                  value={pricingConfig.ss316LPricePerLb}
                  onChange={(e) => setPricingConfig({ ...pricingConfig, ss316LPricePerLb: parseFloat(e.target.value) || 7.40 })}
                  className="w-full bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">6061-T6 Aluminum</label>
                <input
                  type="number"
                  step="0.10"
                  value={pricingConfig.alPricePerLb}
                  onChange={(e) => setPricingConfig({ ...pricingConfig, alPricePerLb: parseFloat(e.target.value) || 5.00 })}
                  className="w-full bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Shop Labor & Handling */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Shop Labor Rate ($/hr)</label>
              <input
                type="number"
                step="1"
                value={pricingConfig.laborRatePerHour}
                onChange={(e) => setPricingConfig({ ...pricingConfig, laborRatePerHour: parseFloat(e.target.value) || 83.85 })}
                className="w-full bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Hot Shot Courier Fee ($)</label>
              <input
                type="number"
                step="10"
                value={pricingConfig.hotShotEmergencyFee}
                onChange={(e) => setPricingConfig({ ...pricingConfig, hotShotEmergencyFee: parseFloat(e.target.value) || 250.00 })}
                className="w-full bg-slate-950 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

        </div>

        <div className="flex justify-between items-center pt-3 border-t border-slate-800">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-amber-500 px-5 py-2 font-bold text-slate-950 hover:bg-amber-400 transition-all shadow"
          >
            Apply Matrix Changes
          </button>
        </div>

      </div>
    </div>
  );
};
