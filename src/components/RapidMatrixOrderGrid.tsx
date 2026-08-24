import React, { useState, useMemo } from 'react';
import {
  Flame,
  Plus,
  Minus,
  Check,
  ShoppingCart,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export type PressureClass = 150 | 300 | 600 | 900 | 1500;
export type MaterialCode = 'SA-516-70' | 'SA-36' | '304L' | '316L' | 'AL-6061';
export type ProductType = 'paddle_blind' | 'paddle_spacer' | 'bleeder_blind';

interface FlangeSpec {
  od: number;
  boltCircle: number;
  boltSize: number;
  nominalThickness: number;
  thicknessLabel: string;
}

interface RapidMatrixOrderGridProps {
  onAddBatchToCart: (items: any[]) => void;
  onOpenProposalModal: (items: any[]) => void;
  masterGeometry: Record<PressureClass, Record<string, FlangeSpec>>;
  materials: Record<MaterialCode, any>;
  calculateBlindPrice: (
    pClass: PressureClass,
    nps: string,
    matCode: MaterialCode,
    thicknessVal: number,
    thicknessLabel: string,
    facing: string,
    addTHadle: boolean,
    addLiftingLug: boolean,
    addPlateDog: boolean,
    addWedge: boolean,
    pricing: any
  ) => any;
  pricingConfig: any;
}

const ALL_NPS_SIZES = [
  '1/2"', '3/4"', '1"', '1-1/4"', '1-1/2"', '2"', '2-1/2"', '3"', '4"',
  '6"', '8"', '10"', '12"', '14"', '16"', '18"', '20"', '24"'
];

export const RapidMatrixOrderGrid: React.FC<RapidMatrixOrderGridProps> = ({
  onAddBatchToCart,
  onOpenProposalModal,
  masterGeometry,
  materials,
  calculateBlindPrice,
  pricingConfig,
}) => {
  const [selectedClass, setSelectedClass] = useState<PressureClass>(150);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialCode>('SA-516-70');
  const [productType, setProductType] = useState<ProductType>('paddle_blind');
  const [facingType] = useState<'Flat Face (FF) - Standard (No Machining)' | 'Machined Gasket Finish (Special Order)'>('Flat Face (FF) - Standard (No Machining)');
  const [sizeFilter, setSizeFilter] = useState<'all' | 'small' | 'mid' | 'large'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [requireMTR, setRequireMTR] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [handleStamps, setHandleStamps] = useState<Record<string, string>>({});
  const [batchAddedSuccess, setBatchAddedSuccess] = useState(false);

  const handleQtyChange = (nps: string, qty: number) => {
    const validQty = Math.max(0, qty);
    setQuantities(prev => ({
      ...prev,
      [nps]: validQty
    }));
  };

  const handleStampChange = (nps: string, stamp: string) => {
    setHandleStamps(prev => ({
      ...prev,
      [nps]: stamp.toUpperCase()
    }));
  };

  const filteredSizes = useMemo(() => {
    return ALL_NPS_SIZES.filter(size => {
      if (searchQuery.trim()) {
        const cleanQuery = searchQuery.replace('"', '').trim();
        const cleanSize = size.replace('"', '').trim();
        if (!cleanSize.includes(cleanQuery)) return false;
      }

      const inchVal = parseFloat(size.replace('1/2', '0.5').replace('3/4', '0.75').replace('1/4', '0.25').replace('"', ''));
      if (sizeFilter === 'small') return inchVal <= 3.0;
      if (sizeFilter === 'mid') return inchVal >= 4.0 && inchVal <= 12.0;
      if (sizeFilter === 'large') return inchVal >= 14.0;
      return true;
    });
  }, [sizeFilter, searchQuery]);

  const matrixRows = useMemo(() => {
    return filteredSizes.map(nps => {
      const geom = masterGeometry[selectedClass]?.[nps] || masterGeometry[150]['4"'];
      const qty = quantities[nps] || 0;
      const customStamp = handleStamps[nps] || '';

      const defaultThickness = geom.nominalThickness || 0.125;
      const defaultThicknessLabel = geom.thicknessLabel || '1/8"';

      const calcResult = calculateBlindPrice(
        selectedClass,
        nps,
        selectedMaterial,
        defaultThickness,
        defaultThicknessLabel,
        facingType,
        false,
        false,
        false,
        false,
        pricingConfig
      );

      let finalPartNumber = calcResult.partNumber;
      if (productType === 'paddle_spacer') {
        finalPartNumber = finalPartNumber.replace('PB', 'PS');
      } else if (productType === 'bleeder_blind') {
        finalPartNumber = finalPartNumber.replace('PB', 'PV');
      }

      return {
        nps,
        geom,
        qty,
        customStamp,
        calcResult,
        finalPartNumber,
        unitWeight: calcResult.actualWeightLbs,
        totalWeight: Math.round(calcResult.actualWeightLbs * qty * 100) / 100,
        unitPrice: calcResult.unitPrice,
        lineTotal: Math.round(calcResult.unitPrice * qty * 100) / 100,
      };
    });
  }, [filteredSizes, selectedClass, selectedMaterial, productType, facingType, quantities, handleStamps, masterGeometry, calculateBlindPrice, pricingConfig]);

  const activeSelectedItems = useMemo(() => {
    return matrixRows.filter(row => row.qty > 0).map(row => {
      const typeLabel = productType === 'paddle_spacer' ? 'Paddle Spacer (Ring)' : productType === 'bleeder_blind' ? 'Bleeder / Vented Blind' : 'Paddle Blind (Solid)';
      return {
        id: `BATCH-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        partNumber: row.finalPartNumber,
        sku: row.finalPartNumber,
        nps: row.nps,
        nominalSizeInches: parseFloat(row.nps.replace('"', '')) || 4,
        pressureClass: selectedClass,
        materialCode: selectedMaterial,
        material: selectedMaterial,
        materialName: `${materials[selectedMaterial]?.name || selectedMaterial} (${typeLabel})`,
        facing: facingType,
        thickness: row.calcResult.thickness,
        thicknessLabel: row.calcResult.thicknessLabel,
        od: row.geom.od,
        boltCircle: row.geom.boltCircle,
        boltSize: row.geom.boltSize,
        actualWeightLbs: row.unitWeight,
        finishedWeightPerUnit: row.unitWeight,
        adjustedWeightLbs: row.calcResult.adjustedWeightLbs,
        unitPrice: row.unitPrice,
        quantity: row.qty,
        lineTotal: row.lineTotal,
        handleStamp: row.customStamp || `IPF-${row.nps.replace('"', '')}-${selectedClass}#`,
        handleStamping: row.customStamp || `IPF-${row.nps.replace('"', '')}-${selectedClass}#`,
        requireMTR: requireMTR,
        includeMTR: requireMTR,
        addTHadle: false,
        addLiftingLug: false,
        addPlateDog: false,
        addWedge: false,
        productType,
      };
    });
  }, [matrixRows, productType, selectedClass, selectedMaterial, facingType, requireMTR, materials]);

  const totalSelectedCount = activeSelectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalSelectedWeight = Math.round(activeSelectedItems.reduce((sum, item) => sum + (item.actualWeightLbs * item.quantity), 0) * 10) / 10;

  const handleAddBatchToCart = () => {
    if (activeSelectedItems.length === 0) return;
    onAddBatchToCart(activeSelectedItems);
    setBatchAddedSuccess(true);
    setTimeout(() => setBatchAddedSuccess(false), 2500);
    setQuantities({});
  };

  const handleGenerateProposalForBatch = () => {
    if (activeSelectedItems.length === 0) return;
    onOpenProposalModal(activeSelectedItems);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Strategy Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        
        {/* Top Product Type Family Selector */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-700 uppercase tracking-wider mb-1">
              <Flame className="h-4 w-4 text-sky-600" /> Turnaround Rapid Matrix Ordering &bull; Freeport, TX
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              ASME B16.48 Multi-Size Turnaround Order Grid
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-0.5">
              Select your pressure class and certified metallurgy below. Rapidly enter quantities across 1/2" to 24" sizes to generate an official formal proposal or dispatch a batch PO in seconds.
            </p>
          </div>

          {/* Product Line Family Switcher */}
          <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setProductType('paddle_blind')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                productType === 'paddle_blind'
                  ? 'bg-sky-800 text-white shadow-sm font-black'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Paddle Blinds (Solid)
            </button>
            <button
              type="button"
              onClick={() => setProductType('paddle_spacer')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                productType === 'paddle_spacer'
                  ? 'bg-sky-800 text-white shadow-sm font-black'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Paddle Spacers (Open Rings)
            </button>
            <button
              type="button"
              onClick={() => setProductType('bleeder_blind')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                productType === 'bleeder_blind'
                  ? 'bg-sky-800 text-white shadow-sm font-black'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Bleeder / Vented Blinds
            </button>
          </div>
        </div>

        {/* Matrix Parametric Selectors: Class & Material */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Pressure Class Tabs (5 Cols) */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Select Flange Pressure Class (ASME B16.48)
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {([150, 300, 600, 900, 1500] as PressureClass[]).map(pClass => (
                <button
                  key={pClass}
                  type="button"
                  onClick={() => setSelectedClass(pClass)}
                  className={`py-2.5 px-1 text-center rounded-xl border font-mono transition-all ${
                    selectedClass === pClass
                      ? 'bg-sky-800 text-white border-sky-800 font-bold shadow-sm ring-2 ring-sky-600/30'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold">{pClass}#</div>
                  <div className="text-[9px] opacity-75 mt-0.5">Class</div>
                </button>
              ))}
            </div>
          </div>

          {/* Certified Plate Material Pills (7 Cols) */}
          <div className="md:col-span-7 space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              2. Select Certified Plate Metallurgy
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['SA-516-70', '304L', '316L', 'AL-6061'] as MaterialCode[]).map(code => {
                const isSelected = selectedMaterial === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSelectedMaterial(code)}
                    className={`p-2.5 text-left rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-sky-50 border-sky-700 text-slate-900 shadow-sm ring-1 ring-sky-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-mono text-xs text-slate-900">{code}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-sky-700" />}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">
                      {code === 'SA-516-70' ? 'Carbon PVQ' : code === '304L' ? 'Dual-Cert SS' : code === '316L' ? 'Acid Grade SS' : '6061-T6 AL'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Filter Strip & MTR Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs">
          
          {/* Quick Size Range Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500 font-semibold shrink-0">Filter Range:</span>
            <button
              type="button"
              onClick={() => setSizeFilter('all')}
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                sizeFilter === 'all' ? 'bg-slate-900 text-white font-bold border-slate-900' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              All (1/2"–24")
            </button>
            <button
              type="button"
              onClick={() => setSizeFilter('small')}
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                sizeFilter === 'small' ? 'bg-slate-900 text-white font-bold border-slate-900' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Small Bore (1/2"–3")
            </button>
            <button
              type="button"
              onClick={() => setSizeFilter('mid')}
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                sizeFilter === 'mid' ? 'bg-slate-900 text-white font-bold border-slate-900' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Mid-Bore (4"–12")
            </button>
            <button
              type="button"
              onClick={() => setSizeFilter('large')}
              className={`px-2.5 py-1 rounded-lg border transition-colors ${
                sizeFilter === 'large' ? 'bg-slate-900 text-white font-bold border-slate-900' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Large Header (14"–24")
            </button>
          </div>

          {/* MTR Toggle & Search Input */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="relative w-40 sm:w-48">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search NPS size..."
                className="w-full rounded-lg border border-slate-300 bg-slate-50 py-1.5 pl-8 pr-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-sky-600 focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={requireMTR}
                onChange={e => setRequireMTR(e.target.checked)}
                className="h-3.5 w-3.5 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span>Include Certified MTRs (Free)</span>
            </label>
          </div>

        </div>

      </div>

      {/* 2. Rapid Multi-Size Tabular Matrix */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-900 text-slate-200 font-sans uppercase text-[11px] tracking-wider border-b border-slate-800">
                <th className="py-3.5 px-4 font-bold">Nominal Pipe Size (NPS)</th>
                <th className="py-3.5 px-3 font-semibold">Outer Diameter (OD)</th>
                <th className="py-3.5 px-3 font-semibold">Bolt Circle (BC)</th>
                <th className="py-3.5 px-3 font-semibold">Plate Thickness</th>
                <th className="py-3.5 px-3 font-semibold">Scale Weight</th>
                <th className="py-3.5 px-3 font-semibold">Domestic Plate Status</th>
                <th className="py-3.5 px-3 font-semibold">Custom Handle Line ID</th>
                <th className="py-3.5 px-4 text-center font-bold">Turnaround Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {matrixRows.map(row => {
                const hasQty = row.qty > 0;
                return (
                  <tr
                    key={row.nps}
                    className={`transition-colors ${
                      hasQty ? 'bg-sky-50/80 font-bold' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* NPS Size */}
                    <td className="py-3 px-4 font-black text-sm text-slate-900 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-sky-600"></span>
                        <span>{row.nps} NPS</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-normal font-sans">
                        Class {selectedClass}# {selectedMaterial}
                      </div>
                    </td>

                    {/* OD */}
                    <td className="py-3 px-3 text-slate-800 font-bold">
                      {row.geom.od.toFixed(3)}"
                    </td>

                    {/* Bolt Circle */}
                    <td className="py-3 px-3 text-slate-700">
                      {row.geom.boltCircle.toFixed(3)}" <span className="text-slate-400 text-[10px]">({row.geom.boltSize}" bolt)</span>
                    </td>

                    {/* Thickness */}
                    <td className="py-3 px-3 text-slate-800">
                      <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-bold text-[11px]">
                        {row.calcResult.thicknessLabel}
                      </span>
                    </td>

                    {/* Scale Weight */}
                    <td className="py-3 px-3 text-slate-700">
                      <span className="font-bold text-slate-900">{row.unitWeight} lbs</span>
                      {hasQty ? (
                        <div className="text-[10px] text-sky-700">
                          Total: {row.totalWeight} lbs
                        </div>
                      ) : null}
                    </td>

                    {/* In-Stock Status */}
                    <td className="py-3 px-3 font-sans">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" /> In-Stock Plate
                      </span>
                    </td>

                    {/* Handle Stamping */}
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        maxLength={18}
                        value={row.customStamp}
                        onChange={e => handleStampChange(row.nps, e.target.value)}
                        placeholder={`ISO-${row.nps.replace('"', '')}`}
                        className="w-32 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-600 focus:outline-none"
                      />
                    </td>

                    {/* Quantity Stepper */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(row.nps, row.qty - 1)}
                          disabled={row.qty === 0}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <input
                          type="number"
                          min="0"
                          max="2000"
                          value={row.qty === 0 ? '' : row.qty}
                          onChange={e => handleQtyChange(row.nps, parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="h-7 w-12 rounded-lg border border-slate-300 bg-white text-center font-bold text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleQtyChange(row.nps, row.qty + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty Search State */}
        {matrixRows.length === 0 && (
          <div className="p-8 text-center text-slate-500 font-sans space-y-2">
            <AlertCircle className="h-8 w-8 mx-auto text-slate-400" />
            <p className="text-sm font-semibold">No matching pipe sizes found for "{searchQuery}"</p>
            <button
              onClick={() => { setSearchQuery(''); setSizeFilter('all'); }}
              className="text-xs text-sky-700 hover:underline font-bold"
            >
              Clear filters and view all sizes
            </button>
          </div>
        )}
      </div>

      {/* 3. Sticky Bottom Action Bar for Multi-Item Batch */}
      {totalSelectedCount > 0 && (
        <div className="sticky bottom-4 z-40 bg-slate-950 text-white rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-2xl animate-fadeIn flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="space-y-0.5 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full font-mono">
                {totalSelectedCount} {totalSelectedCount === 1 ? 'Blind' : 'Blinds'} Selected
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Across {activeSelectedItems.length} {activeSelectedItems.length === 1 ? 'size' : 'sizes'} &bull; {totalSelectedWeight} Scale Lbs
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans">
              Domestic plate in-stock in Freeport, TX. Ready for same-day CNC plasma cutting with full certified MTR packets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleGenerateProposalForBatch}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-xs sm:text-sm font-black text-slate-950 hover:bg-amber-400 transition-all shadow-lg active:scale-95"
            >
              <FileText className="h-4 w-4" />
              <span>Generate Instant Official Proposal</span>
            </button>

            <button
              type="button"
              onClick={handleAddBatchToCart}
              className="flex items-center gap-2 rounded-xl bg-sky-700 px-5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-sky-600 transition-all shadow-lg active:scale-95"
            >
              {batchAddedSuccess ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400 font-black" />
                  <span>Added {totalSelectedCount}x to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add {totalSelectedCount}x to Order Cart</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
