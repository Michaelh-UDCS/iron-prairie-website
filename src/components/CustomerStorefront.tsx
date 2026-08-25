import React, { useState, useMemo } from 'react';
import {
  NPSSize,
  PressureClass,
  MaterialId,
  FacingType,
  ConfiguredBlind,
  ShopJob
} from '../types';
import {
  NPS_SIZES,
  PRESSURE_CLASSES,
  MATERIALS,
  FACING_OPTIONS,
  ADD_ON_OPTIONS,
  calculateBlindConfig,
  calculateShipping,
  parseNpsToInches,
  generateSku
} from '../data/paddleBlindData';
import { LaserPaddlePreview } from './LaserPaddlePreview';
import { AmazonFlatFileModal } from './AmazonFlatFileModal';
import { FastPOCheckoutModal } from './FastPOCheckoutModal';
import { InstantProposalModal } from './InstantProposalModal';
import { StripeInstantCheckoutModal } from './StripeInstantCheckoutModal';
import {
  Flame,
  ShieldCheck,
  Truck,
  FileSpreadsheet,
  ShoppingCart,
  Check,
  Plus,
  Minus,
  Trash2,
  Lock,
  Unlock,
  AlertTriangle,
  ArrowRight,
  Info,
  CheckCircle2,
  Wrench,
  PackageCheck,
  Sparkles,
  FileText,
  CreditCard,
  Zap
} from 'lucide-react';

interface CustomerStorefrontProps {
  cart: ConfiguredBlind[];
  setCart: React.Dispatch<React.SetStateAction<ConfiguredBlind[]>>;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isB2BAuthenticated: boolean;
  setIsB2BAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  onOrderSubmitted: (newJob: ShopJob) => void;
  onViewShopBoard: () => void;
}

export const CustomerStorefront: React.FC<CustomerStorefrontProps> = ({
  cart,
  setCart,
  isCartOpen,
  setIsCartOpen,
  isB2BAuthenticated,
  setIsB2BAuthenticated,
  onOrderSubmitted,
  onViewShopBoard
}) => {
  // Configurator selections
  const [selectedNps, setSelectedNps] = useState<NPSSize>('4"');
  const [selectedClass, setSelectedClass] = useState<PressureClass>('150#');
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialId>('A516');
  const [selectedFacing, setSelectedFacing] = useState<FacingType>('RF');
  const [handleStamping, setHandleStamping] = useState('UNIT-4-ISO-01');
  const [includeMTR, setIncludeMTR] = useState(true);
  const [addOns, setAddOns] = useState({
    tHandle: false,
    liftingLug: false,
    plateDogs: false,
    fitUpWedges: false
  });
  const [quantity, setQuantity] = useState(1);

  // Modals state
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [isAmazonModalOpen, setIsAmazonModalOpen] = useState(false);
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [showAddSuccess, setShowAddSuccess] = useState(false);

  // Calculate live configured blind
  const currentConfig: ConfiguredBlind = useMemo(() => {
    return calculateBlindConfig({
      nps: selectedNps,
      pressureClass: selectedClass,
      material: selectedMaterial,
      facing: selectedFacing,
      handleStamping,
      includeMTR,
      addOns,
      quantity
    });
  }, [selectedNps, selectedClass, selectedMaterial, selectedFacing, handleStamping, includeMTR, addOns, quantity]);

  // Cart calculations
  const cartShipping = useMemo(() => calculateShipping(cart), [cart]);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
  const cartTotalWeight = cart.reduce((sum, item) => sum + item.totalFinishedWeight, 0);
  const cartTotalAmount = cartSubtotal + cartShipping.cost;

  // Add to cart handler
  const handleAddToCart = () => {
    setCart((prev) => [...prev, { ...currentConfig, id: `item-${Date.now()}` }]);
    setShowAddSuccess(true);
    setTimeout(() => setShowAddSuccess(false), 2000);
  };

  // Remove from cart
  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Recommendation flags
  const isHeavyBlind = currentConfig.finishedWeightPerUnit >= 60 || parseNpsToInches(selectedNps) >= 10;

  return (
    <div className="space-y-8 pb-16">
      {/* Rapid Delivery Trust Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-5 sm:p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-mono font-semibold text-amber-400">
              <Flame className="h-3.5 w-3.5 animate-pulse text-amber-400" />
              <span>DIRECT CNC PLASMA CUTTING SHOP &bull; TEXAS</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-100 font-display">
              ASME B16.48 Positive Isolation Paddle Blinds
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Turnaround-ready spectacle &amp; paddle blinds burned direct from domestic plate. Same-day emergency burn dispatch with stamped traceable Mill Heat Numbers and MTR compliance packets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-center">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Standard Dispatch</div>
              <div className="font-mono text-sm font-bold text-amber-400">Same-Day / Next-Day</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-center">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Certified Spec</div>
              <div className="font-mono text-sm font-bold text-emerald-400">ASME B16.48 / A516-70</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: 7-Step Visual Configurator (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Pipe Size (NPS) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-black text-slate-950">
                  1
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Select Pipe Size (Nominal Pipe Size - NPS)
                </h2>
              </div>
              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                Selected: {selectedNps} NPS
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {NPS_SIZES.map((size) => {
                const isSelected = selectedNps === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedNps(size)}
                    className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-center transition-all ${
                      isSelected
                        ? 'border-2 border-amber-500 bg-amber-500/20 text-amber-300 font-bold shadow-md scale-105 ring-1 ring-amber-500'
                        : 'border border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="font-mono text-sm sm:text-base font-bold">{size}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      OD {currentConfig.dimensions.nps === size ? currentConfig.dimensions.od : (size === '4"' ? '6.75"' : '')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Pressure Rating */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-black text-slate-950">
                  2
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Select Flange Pressure Class (ASME B16.48)
                </h2>
              </div>
              <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                Rating: {selectedClass}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {PRESSURE_CLASSES.map((pClass) => {
                const isSelected = selectedClass === pClass;
                return (
                  <button
                    key={pClass}
                    type="button"
                    onClick={() => setSelectedClass(pClass)}
                    className={`flex flex-col items-center justify-center rounded-xl p-3 text-center transition-all ${
                      isSelected
                        ? 'border-2 border-amber-500 bg-amber-500/20 text-amber-300 font-bold shadow-md ring-1 ring-amber-500'
                        : 'border border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="font-mono text-base font-black">{pClass}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      {pClass === '150#' && 'Low / Utility'}
                      {pClass === '300#' && 'Standard Plant'}
                      {pClass === '600#' && 'High Pressure'}
                      {pClass === '900#' && 'Severe Service'}
                      {pClass === '1500#' && 'Extreme Pressure'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Material Selection */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-black text-slate-950">
                  3
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Select Certified Plate Material
                </h2>
              </div>
              <span className="font-mono text-xs font-bold text-amber-400">
                Rate: ${MATERIALS[selectedMaterial].ratePerLb.toFixed(2)}/lb
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(MATERIALS) as MaterialId[]).map((matId) => {
                const mat = MATERIALS[matId];
                const isSelected = selectedMaterial === matId;
                return (
                  <button
                    key={matId}
                    type="button"
                    onClick={() => setSelectedMaterial(matId)}
                    className={`flex flex-col justify-between rounded-xl p-3.5 text-left transition-all ${
                      isSelected
                        ? 'border-2 border-amber-500 bg-amber-500/15 shadow-md ring-1 ring-amber-500'
                        : 'border border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${mat.badgeColor}`}>
                          {mat.code} &bull; {mat.category}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-300">
                          ${mat.ratePerLb.toFixed(2)} / lb
                        </span>
                      </div>
                      <h3 className="mt-2 text-sm font-bold text-slate-100">{mat.name}</h3>
                      <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">{mat.description}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-slate-800/60 pt-2 text-[10px] font-mono text-slate-400">
                      <span>Density: {mat.densityLbPerSqFt1In} lbs/ft² (1")</span>
                      <span className="text-amber-400 font-semibold">{isSelected ? '✓ SELECTED' : 'SELECT'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4: Gasket Facing */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-black text-slate-950">
                  4
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Select Gasket Facing Type
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {FACING_OPTIONS.map((facingOpt) => {
                const isSelected = selectedFacing === facingOpt.id;
                return (
                  <button
                    key={facingOpt.id}
                    type="button"
                    onClick={() => setSelectedFacing(facingOpt.id)}
                    className={`rounded-xl p-3 text-left transition-all ${
                      isSelected
                        ? 'border-2 border-amber-500 bg-amber-500/20 shadow-md ring-1 ring-amber-500'
                        : 'border border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-100">{facingOpt.name}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{facingOpt.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 5: Custom Handle Stamping */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-black text-slate-950">
                  5
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Custom Turnaround Handle Stamping
                </h2>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">No Extra Charge</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Permanently engraved/stamped on handle alongside Size, Class, Material Grade, and Mill Heat #.
            </p>
            <div className="relative">
              <input
                type="text"
                value={handleStamping}
                onChange={(e) => setHandleStamping(e.target.value)}
                placeholder="e.g. UNIT-4-ISO-01 or LINE-P102"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 font-mono text-sm text-amber-300 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
              <span className="absolute right-3 top-3 text-[10px] font-mono text-slate-500">
                {handleStamping.length}/24 chars
              </span>
            </div>
          </div>

          {/* STEP 6: PLAIN-ENGLISH MTR TOGGLE (Crucial Feature) */}
          <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20 p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-black text-slate-950">
                  6
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Plain-English Material Test Report (MTR) Option
                </h2>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-400">
                Turnaround Compliance
              </span>
            </div>

            <div className="space-y-3">
              {/* Option A: Include MTR */}
              <label
                onClick={() => setIncludeMTR(true)}
                className={`flex items-start gap-3 rounded-xl p-3.5 cursor-pointer transition-all border ${
                  includeMTR
                    ? 'border-emerald-500 bg-emerald-500/15 ring-1 ring-emerald-500 shadow-md'
                    : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="mtr-toggle"
                  checked={includeMTR}
                  onChange={() => setIncludeMTR(true)}
                  className="mt-1 h-4 w-4 text-emerald-500 focus:ring-emerald-400 bg-slate-900 border-slate-700"
                />
                <div>
                  <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <span>Yes, include Certified Material Test Report (MTR) Packet</span>
                    <span className="rounded bg-emerald-500/20 text-[10px] font-mono font-bold text-emerald-300 px-1.5 py-0.5">
                      INCLUDED FREE
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Traceable Mill Heat Number stamped on handle + Digital &amp; Physical ASME B16.48 certified chemical/physical test packet attached with shipment.
                  </p>
                </div>
              </label>

              {/* Option B: No MTR */}
              <label
                onClick={() => setIncludeMTR(false)}
                className={`flex items-start gap-3 rounded-xl p-3.5 cursor-pointer transition-all border ${
                  !includeMTR
                    ? 'border-amber-500 bg-amber-500/15 ring-1 ring-amber-500 shadow-md'
                    : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="mtr-toggle"
                  checked={!includeMTR}
                  onChange={() => setIncludeMTR(false)}
                  className="mt-1 h-4 w-4 text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-700"
                />
                <div>
                  <div className="text-sm font-bold text-slate-100">
                    No MTR Required (Commercial Utility / Hydrotest Blind Only)
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Standard non-critical isolation or general piping hydrostatic pressure testing without formal certified paperwork.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* STEP 7: Quick Add-ons */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-black text-slate-950">
                  7
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Quick Rigging &amp; Fit-Up Add-Ons
                </h2>
              </div>
            </div>

            {isHeavyBlind && !addOns.liftingLug && (
              <div className="mb-3 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                <span>
                  <strong>Safety Recommendation:</strong> Blinds &ge;10" or weight &ge;60 lbs should include the Certified Heavy Rigging Lifting Lug.
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ADD_ON_OPTIONS.map((addon) => {
                const isChecked = addOns[addon.id];
                return (
                  <label
                    key={addon.id}
                    className={`flex items-start gap-3 rounded-xl p-3.5 cursor-pointer transition-all border ${
                      isChecked
                        ? 'border-amber-500 bg-amber-500/15 ring-1 ring-amber-500'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        setAddOns((prev) => ({
                          ...prev,
                          [addon.id]: e.target.checked
                        }))
                      }
                      className="mt-1 h-4 w-4 rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-100">{addon.name}</span>
                        <span className="font-mono text-xs font-bold text-amber-400">+${addon.price.toFixed(2)}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{addon.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Dynamic Specification & Price Card + 2D SVG (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 2D Interactive SVG Visualizer */}
          <LaserPaddlePreview blind={currentConfig} />

          {/* Live Engineering Specification Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100">Live Engineering Specs</h3>
                <span className="font-mono text-xs text-amber-400 font-bold">{currentConfig.sku}</span>
              </div>
              <span className="rounded-md bg-slate-800 px-2 py-1 text-[10px] font-mono font-medium text-slate-300">
                ASME B16.48
              </span>
            </div>

            {/* Spec Matrix */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Outside Diameter (OD):</span>
                <span className="font-bold text-slate-100">{currentConfig.dimensions.od.toFixed(3)}"</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Bolt Circle (BC):</span>
                <span className="font-bold text-sky-400">{currentConfig.dimensions.boltCircle.toFixed(3)}"</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Bolt Clearance Hole Size:</span>
                <span className="font-bold text-slate-200">{currentConfig.dimensions.boltSize.toFixed(3)}" ({currentConfig.dimensions.boltHoles} holes)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Plate Thickness:</span>
                <span className="font-bold text-amber-400">
                  {currentConfig.dimensions.thicknessFraction} ({currentConfig.dimensions.nominalThickness.toFixed(3)}")
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Finished Weight (Unit):</span>
                <span className="font-bold text-emerald-400">{currentConfig.finishedWeightPerUnit} lbs</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Burn Skeleton Factor:</span>
                <span className="text-slate-300">1.40 &times; (Adjusted {currentConfig.adjustedWeightPerUnit} lbs)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">MTR Packet:</span>
                <span className={`font-bold ${currentConfig.includeMTR ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {currentConfig.includeMTR ? 'Certified Heat Stamped + PDF' : 'Commercial Spec'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Freight Class:</span>
                <span className="font-bold text-amber-300">
                  {currentConfig.finishedWeightPerUnit >= 150 || parseNpsToInches(selectedNps) >= 14 ? 'Palletized LTL Freight' : 'UPS Direct Parcel'}
                </span>
              </div>
            </div>

            {/* GATED TRADE PRICING SECTION */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              {!isB2BAuthenticated ? (
                /* Gated state */
                <div className="space-y-3 text-center py-2">
                  <div className="flex items-center justify-center gap-2 text-amber-400">
                    <Lock className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Wholesale B2B Pricing Gated
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Direct shop wholesale rates and PO checkout are reserved for industrial plant mechanics, MRO buyers, and turnaround contractors.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsB2BAuthenticated(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-md active:scale-95"
                  >
                    <Unlock className="h-4 w-4" />
                    <span>Instant B2B Trade Sign-In / Unlock</span>
                  </button>
                </div>
              ) : (
                /* Authenticated state */
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Commercial Wholesale Account Active</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsB2BAuthenticated(false)}
                      className="text-[10px] text-slate-500 hover:text-slate-300 underline"
                    >
                      Lock Price
                    </button>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                    <span className="text-xs text-slate-300 font-medium">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="h-8 w-14 rounded-lg border border-slate-700 bg-slate-900 text-center font-mono text-sm font-bold text-amber-400 focus:border-amber-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="rounded-lg bg-slate-900/90 p-3 font-mono text-xs space-y-1 border border-slate-800">
                    <div className="flex justify-between text-slate-400">
                      <span>Unit Base Price (JobTrax):</span>
                      <span className="text-slate-200">${currentConfig.basePricePerUnit.toFixed(2)}</span>
                    </div>
                    {currentConfig.addOnsTotalPerUnit > 0 && (
                      <div className="flex justify-between text-slate-400">
                        <span>Selected Add-ons (ea):</span>
                        <span className="text-amber-400">+${currentConfig.addOnsTotalPerUnit.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-300 font-bold border-t border-slate-800/60 pt-1">
                      <span>Unit Commercial Price:</span>
                      <span className="text-amber-400 text-sm">${currentConfig.unitPrice.toFixed(2)} / ea</span>
                    </div>
                    <div className="flex justify-between text-slate-100 font-black text-sm pt-1 border-t border-slate-800">
                      <span>Line Subtotal ({quantity}x):</span>
                      <span className="text-emerald-400 text-base">${currentConfig.lineTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Add to Cart CTA */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-black text-slate-950 hover:bg-amber-400 transition-all shadow-lg active:scale-95"
                  >
                    {showAddSuccess ? (
                      <>
                        <Check className="h-5 w-5 text-slate-950 font-black" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" />
                        <span>Add to Order Cart (${currentConfig.lineTotal.toFixed(2)})</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SLIDE-OVER CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">Order Cart</h3>
                    <p className="text-xs text-slate-400">
                      {cart.length} {cart.length === 1 ? 'line item' : 'line items'} &bull; {cartTotalWeight.toFixed(1)} lbs
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                >
                  &times;
                </button>
              </div>

              {/* Drawer Body / Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 space-y-3">
                    <ShoppingCart className="h-12 w-12 mx-auto text-slate-600" />
                    <p className="text-sm font-medium">Your Order Cart is currently empty.</p>
                    <p className="text-xs text-slate-500">
                      Configure your ASME B16.48 paddle blinds and click "Add to Order Cart".
                    </p>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="relative rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2 shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-mono text-xs font-bold text-amber-400">{item.sku}</div>
                          <h4 className="text-sm font-bold text-slate-100">
                            {item.quantity}x {item.nps} {item.pressureClass} {item.material} ({item.facing})
                          </h4>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-xs text-slate-400 space-y-0.5 font-mono">
                        <div>OD: {item.dimensions.od.toFixed(3)}" &bull; Thk: {item.dimensions.thicknessFraction}</div>
                        <div>Stamp: <span className="text-amber-300">{item.handleStamping}</span></div>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className={`text-[10px] font-sans px-1.5 py-0.2 rounded ${item.includeMTR ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                            {item.includeMTR ? '✓ MTR Included' : 'No MTR'}
                          </span>
                          <span className="text-slate-400">Total Wt: {item.totalFinishedWeight} lbs</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-800/60 pt-2 font-mono">
                        <span className="text-xs text-slate-400">${item.unitPrice.toFixed(2)} ea</span>
                        <span className="text-sm font-bold text-emerald-400">${item.lineTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer & Actions */}
              {cart.length > 0 && (
                <div className="border-t border-slate-800 bg-slate-950 p-6 space-y-4">
                  {/* Shipping Rule Card */}
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <Truck className="h-4 w-4 text-amber-400" />
                        <span>{cartShipping.method}</span>
                      </div>
                      <span className="font-mono text-amber-400">${cartShipping.cost.toFixed(2)}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{cartShipping.carrierNote}</p>
                  </div>

                  {/* Summary Totals */}
                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Items Subtotal:</span>
                      <span className="text-slate-200 font-bold">${cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Estimated Freight:</span>
                      <span className="text-slate-200 font-bold">${cartShipping.cost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-100 border-t border-slate-800 pt-2">
                      <span className="font-sans">Estimated Total:</span>
                      <span className="text-emerald-400 text-lg font-mono">${cartTotalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* 3% ACH Discount Encouragement Banner */}
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-2.5 text-xs text-emerald-300 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-sans">
                      <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span><strong>Pay via ACH:</strong> Save 3% on items</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      -${(cartSubtotal * 0.03).toFixed(2)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2.5 pt-1">
                    {/* PRIMARY: Stripe Instant E-Commerce Checkout */}
                    <button
                      type="button"
                      onClick={() => setIsStripeModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-sm font-black text-slate-950 hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg active:scale-95 border border-emerald-400/40"
                    >
                      <Zap className="h-4 w-4" />
                      <span>⚡ Instant Stripe Checkout (Card / Apple Pay / ACH)</span>
                    </button>

                    {/* Trust Badges */}
                    <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-400 py-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">VISA</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">MC</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">AMEX</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">APPLE PAY</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">ACH (SAVE 3%)</span>
                    </div>

                    {/* SECONDARY: Commercial B2B Net 30 PO Checkout */}
                    <button
                      type="button"
                      onClick={() => setIsPOModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-800/90 py-2.5 text-xs font-bold text-sky-100 hover:bg-sky-700 transition-all shadow border border-sky-600/40 active:scale-95"
                    >
                      <ShieldCheck className="h-4 w-4 text-sky-300" />
                      <span>1-Click Industrial PO Checkout (Net 30 Terms)</span>
                    </button>

                    {/* TERTIARY: Official Proposal PDF */}
                    <button
                      type="button"
                      onClick={() => setIsProposalModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Generate Formal Proposal (Email PDF)</span>
                    </button>

                    {/* Amazon Feed Export */}
                    <button
                      type="button"
                      onClick={() => setIsAmazonModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 py-2 text-[11px] font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 text-amber-400" />
                      <span>Export Amazon Flat-File Feed (.TSV)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STRIPE INSTANT CHECKOUT MODAL */}
      <StripeInstantCheckoutModal
        isOpen={isStripeModalOpen}
        onClose={() => setIsStripeModalOpen(false)}
        cartItems={cart.length > 0 ? cart : [currentConfig]}
        onOrderSubmitted={(newJob) => {
          onOrderSubmitted(newJob);
          setCart([]);
        }}
        onViewShopBoard={onViewShopBoard}
      />

      {/* INSTANT PROPOSAL MODAL */}
      <InstantProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        items={cart.length > 0 ? cart : [currentConfig]}
      />

      {/* AMAZON FLAT-FILE MODAL */}
      <AmazonFlatFileModal
        isOpen={isAmazonModalOpen}
        onClose={() => setIsAmazonModalOpen(false)}
        items={cart.length > 0 ? cart : [currentConfig]}
      />

      {/* FAST PO CHECKOUT MODAL */}
      <FastPOCheckoutModal
        isOpen={isPOModalOpen}
        onClose={() => setIsPOModalOpen(false)}
        cartItems={cart.length > 0 ? cart : [currentConfig]}
        onOrderSubmitted={(newJob) => {
          onOrderSubmitted(newJob);
          setCart([]);
        }}
        onViewShopBoard={onViewShopBoard}
      />
    </div>
  );
};
