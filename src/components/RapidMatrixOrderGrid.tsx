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
  AlertCircle,
  Lock,
  Unlock,
  FileSpreadsheet
} from 'lucide-react';

export type PressureClass = 150 | 300 | 600 | 900 | 1500;
export type MaterialCode = 'SA-516-70' | 'SA-36' | '304L' | '316L' | 'AL-6061';
export type ProductType = 'paddle_blind' | 'figure8_blind' | 'paddle_spacer' | 'bleeder_blind';

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
    pricing: any,
    addLockoutHole?: boolean,
    blindType?: any
  ) => any;
  pricingConfig: any;
  isClientLoggedIn?: boolean;
  onOpenLoginModal?: () => void;
  onOpenBulkRfqModal?: () => void;
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
  isClientLoggedIn = false,
  onOpenLoginModal,
  onOpenBulkRfqModal,
}) => {
  const [selectedClass, setSelectedClass] = useState<PressureClass>(150);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialCode>('SA-516-70');
  const [thicknessOption, setThicknessOption] = useState<'11GA' | '1/8' | '1/4' | 'ASME'>('11GA');
  const [productType, setProductType] = useState<ProductType>('paddle_blind');
  const [facingType] = useState<'Flat Face (FF) - Standard (No Machining)' | 'Machined Gasket Finish (Special Order)'>('Flat Face (FF) - Standard (No Machining)');
  const [sizeFilter, setSizeFilter] = useState<'all' | 'small' | 'mid' | 'large'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [requireMTR, setRequireMTR] = useState(true);
  const [batchTHandle, setBatchTHandle] = useState(false);
  const [batchLockoutHole, setBatchLockoutHole] = useState(false);
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

      let activeThickness = 0.1196;
      let activeThicknessLabel = '11 Gauge (0.120")';

      if (thicknessOption === '11GA') {
        activeThickness = 0.1196;
        activeThicknessLabel = '11 Gauge (0.120")';
      } else if (thicknessOption === '1/8') {
        activeThickness = 0.125;
        activeThicknessLabel = '1/8" (0.125")';
      } else if (thicknessOption === '1/4') {
        activeThickness = 0.250;
        activeThicknessLabel = '1/4" (0.250")';
      } else if (thicknessOption === 'ASME') {
        activeThickness = geom.nominalThickness || 0.1196;
        activeThicknessLabel = geom.thicknessLabel || '11 Gauge';
      }

      const blindType = productType === 'figure8_blind' ? 'Figure 8 (Spectacle Blind)' : 'Paddle Blind';

      const calcResult = calculateBlindPrice(
        selectedClass,
        nps,
        selectedMaterial,
        activeThickness,
        activeThicknessLabel,
        facingType,
        batchTHandle,
        false,
        false,
        false,
        pricingConfig,
        batchLockoutHole,
        blindType
      );

      let finalPartNumber = calcResult.partNumber;
      if (productType === 'paddle_spacer') {
        finalPartNumber = finalPartNumber.replace('PB', 'PS');
      } else if (productType === 'bleeder_blind') {
        finalPartNumber = finalPartNumber.replace('PB', 'PV');
      }

      const wholesalePrice = calcResult.wholesalePrice || calcResult.unitPrice;
      const listPrice = calcResult.listPrice || Math.ceil(wholesalePrice * 1.10);
      const activeUnitPrice = isClientLoggedIn ? wholesalePrice : listPrice;

      return {
        nps,
        geom,
        qty,
        customStamp,
        calcResult,
        finalPartNumber,
        unitWeight: calcResult.actualWeightLbs,
        totalWeight: Math.round(calcResult.actualWeightLbs * qty * 100) / 100,
        unitPrice: activeUnitPrice,
        wholesalePrice,
        listPrice,
        discountAmount: listPrice - wholesalePrice,
        lineTotal: Math.round(activeUnitPrice * qty * 100) / 100,
      };
    });
  }, [filteredSizes, selectedClass, selectedMaterial, thicknessOption, productType, facingType, quantities, handleStamps, masterGeometry, calculateBlindPrice, pricingConfig, batchTHandle, batchLockoutHole, isClientLoggedIn]);

  const activeSelectedItems = useMemo(() => {
    return matrixRows.filter(row => row.qty > 0).map(row => {
      const typeLabel = productType === 'figure8_blind' ? 'Figure 8 (Spectacle Blind)' : productType === 'paddle_spacer' ? 'Paddle Spacer (Ring)' : productType === 'bleeder_blind' ? 'Bleeder / Vented Blind' : 'Paddle Blind (Solid)';
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
        listPrice: row.listPrice,
        wholesalePrice: row.wholesalePrice,
        quantity: row.qty,
        lineTotal: row.lineTotal,
        handleStamp: row.customStamp || `IPF-${row.nps.replace('"', '')}-${selectedClass}#`,
        handleStamping: row.customStamp || `IPF-${row.nps.replace('"', '')}-${selectedClass}#`,
        requireMTR: requireMTR,
        includeMTR: requireMTR,
        addTHadle: batchTHandle,
        addLockoutHole: batchLockoutHole,
        addLiftingLug: false,
        addPlateDog: false,
        addWedge: false,
        blindType: productType === 'figure8_blind' ? 'Figure 8 (Spectacle Blind)' : 'Paddle Blind',
        productType,
      };
    });
  }, [matrixRows, productType, selectedClass, selectedMaterial, facingType, requireMTR, materials, batchTHandle, batchLockoutHole]);

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
    <div className="space-y-3 w-full min-w-0">
      
      {/* 0. Streamlined Bulk Discount & BOM Reorder Strip */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 text-white rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-800 shadow-md flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-3 min-w-0">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-wider shrink-0 shadow-sm">
            ⚡ 10% Wholesale
          </span>
          <div className="text-xs min-w-0">
            <span className="font-bold text-white hidden sm:inline">Have a Turnaround BOM or Amazon Reorder?</span>
            <span className="font-bold text-white sm:hidden text-[11px]">Have a BOM or Reorder?</span>{' '}
            <span className="text-slate-300 hidden xl:inline">
              Catalog pricing is live below. Enter your commercial plant email or upload your line item list for direct 10% wholesale trade rates.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 sm:gap-2 shrink-0 w-full sm:w-auto">
          {!isClientLoggedIn ? (
            <button
              type="button"
              onClick={onOpenLoginModal}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-2.5 sm:px-3 py-2 sm:py-1.5 text-xs font-black text-slate-950 transition-all shadow active:scale-95 uppercase tracking-wider min-h-[38px] touch-manipulation"
            >
              <Lock className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Unlock 10% Trade</span>
              <span className="sm:hidden text-[11px]">Unlock 10%</span>
            </button>
          ) : (
            <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2.5 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-1 truncate">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> <span className="truncate">10% Active</span>
            </span>
          )}
          <button
            type="button"
            onClick={onOpenBulkRfqModal}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-sky-700 hover:bg-sky-600 px-2.5 sm:px-3 py-2 sm:py-1.5 text-xs font-bold text-white transition-all shadow active:scale-95 min-h-[38px] touch-manipulation"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-sky-200 shrink-0" />
            <span className="hidden sm:inline">Paste / BOM</span>
            <span className="sm:hidden text-[11px]">Upload BOM</span>
          </button>
        </div>
      </div>

      {/* 1. Header & Strategy Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-sm space-y-3 min-w-0">
        
        {/* Top Product Type Family Selector */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 sm:gap-3 border-b border-slate-200 pb-3 min-w-0">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              ASME B16.48 Turnaround Order Matrix
            </h2>
            <p className="text-[11px] text-slate-500">
              Select pressure class and metallurgy below. Enter quantities across 1/2" to 24" sizes for instant PO dispatch or formal proposal.
            </p>
          </div>

          {/* Product Line Family Switcher */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0 text-xs w-full xl:w-auto">
            <button
              type="button"
              onClick={() => setProductType('paddle_blind')}
              className={`px-2.5 py-2 sm:py-1.5 rounded-md font-bold transition-all text-center touch-manipulation min-h-[38px] flex items-center justify-center ${
                productType === 'paddle_blind'
                  ? 'bg-sky-800 text-white shadow-sm font-black'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Paddle Blinds
            </button>
            <button
              type="button"
              onClick={() => setProductType('figure8_blind')}
              className={`px-2.5 py-2 sm:py-1.5 rounded-md font-bold transition-all flex items-center justify-center gap-1 touch-manipulation min-h-[38px] ${
                productType === 'figure8_blind'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>♾️ Figure 8</span>
              <span className="bg-amber-400/60 text-slate-950 text-[9px] px-1 py-0.2 rounded font-black">2x Cost</span>
            </button>
            <button
              type="button"
              onClick={() => setProductType('paddle_spacer')}
              className={`px-2.5 py-2 sm:py-1.5 rounded-md font-bold transition-all text-center touch-manipulation min-h-[38px] flex items-center justify-center ${
                productType === 'paddle_spacer'
                  ? 'bg-sky-800 text-white shadow-sm font-black'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Paddle Spacers
            </button>
            <button
              type="button"
              onClick={() => setProductType('bleeder_blind')}
              className={`px-2.5 py-2 sm:py-1.5 rounded-md font-bold transition-all text-center touch-manipulation min-h-[38px] flex items-center justify-center ${
                productType === 'bleeder_blind'
                  ? 'bg-sky-800 text-white shadow-sm font-black'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Bleeder Blinds
            </button>
          </div>
        </div>

        {/* Matrix Parametric Selectors: Class & Material */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-w-0">
          
          {/* Pressure Class Tabs (5 Cols) */}
          <div className="lg:col-span-5 space-y-1">
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
              1. Pressure Class (ASME B16.48)
            </label>
            <div className="grid grid-cols-5 gap-1">
              {([150, 300, 600, 900, 1500] as PressureClass[]).map(pClass => (
                <button
                  key={pClass}
                  type="button"
                  onClick={() => setSelectedClass(pClass)}
                  className={`py-2 px-1 text-center rounded-lg border font-mono transition-all touch-manipulation min-h-[44px] ${
                    selectedClass === pClass
                      ? 'bg-sky-800 text-white border-sky-800 font-bold shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold">{pClass}#</div>
                  <div className="text-[9px] opacity-75">Class</div>
                </button>
              ))}
            </div>
          </div>

          {/* Certified Plate Material Pills (7 Cols) */}
          <div className="lg:col-span-7 space-y-1">
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
              2. Certified Metallurgy
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-1">
              {(['SA-516-70', 'SA-36', '304L', '316L', 'AL-6061'] as MaterialCode[]).map(code => {
                const isSelected = selectedMaterial === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSelectedMaterial(code)}
                    className={`py-2 px-2 text-left rounded-lg border transition-all touch-manipulation min-h-[44px] ${
                      isSelected
                        ? 'bg-sky-50 border-sky-700 text-slate-900 shadow-sm ring-1 ring-sky-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-mono text-xs text-slate-900">{code === 'SA-36' ? 'A-36' : code}</span>
                      {isSelected && <Check className="h-3 w-3 text-sky-700 shrink-0" />}
                    </div>
                    <div className="text-[9px] text-slate-500 truncate">
                      {code === 'SA-516-70'
                        ? 'PVQ Carbon'
                        : code === 'SA-36'
                        ? 'CS Structural'
                        : code === '304L'
                        ? 'Dual SS'
                        : code === '316L'
                        ? 'Acid SS'
                        : '6061-T6 AL'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* 3. Plate Thickness Standard Selector */}
        <div className="space-y-1.5 pt-2 border-t border-slate-200 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
              3. Plate Thickness Standard:
            </label>
            <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded w-fit truncate">
              Active: {thicknessOption === '11GA' ? '11 Gauge (0.120") — Turnaround Standard' : thicknessOption === '1/8' ? '1/8" Nominal (0.125")' : thicknessOption === '1/4' ? '1/4" Plate (0.250")' : 'ASME B16.48 Heavy Wall'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => setThicknessOption('11GA')}
              className={`py-2 px-2.5 text-left rounded-lg border transition-all touch-manipulation min-h-[44px] ${
                thicknessOption === '11GA'
                  ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-sm ring-1 ring-emerald-500'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-900">⚡ 11 Ga (0.120")</span>
                <span className="text-[9px] bg-emerald-200 text-emerald-950 px-1.5 py-0.2 rounded font-bold">Standard</span>
              </div>
              <div className="text-[9px] text-slate-500">Turnaround Default</div>
            </button>

            <button
              type="button"
              onClick={() => setThicknessOption('1/8')}
              className={`py-2 px-2.5 text-left rounded-lg border transition-all touch-manipulation min-h-[44px] ${
                thicknessOption === '1/8'
                  ? 'bg-sky-50 border-sky-700 text-slate-900 shadow-sm ring-1 ring-sky-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="font-mono text-xs font-bold text-slate-900">1/8" Plate (0.125")</div>
              <div className="text-[9px] text-slate-500">Nominal Fractional</div>
            </button>

            <button
              type="button"
              onClick={() => setThicknessOption('1/4')}
              className={`py-2 px-2.5 text-left rounded-lg border transition-all touch-manipulation min-h-[44px] ${
                thicknessOption === '1/4'
                  ? 'bg-sky-50 border-sky-700 text-slate-900 shadow-sm ring-1 ring-sky-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="font-mono text-xs font-bold text-slate-900">1/4" Heavy (0.250")</div>
              <div className="text-[9px] text-slate-500">Heavy Duty Plate</div>
            </button>

            <button
              type="button"
              onClick={() => setThicknessOption('ASME')}
              className={`py-2 px-2.5 text-left rounded-lg border transition-all touch-manipulation min-h-[44px] ${
                thicknessOption === 'ASME'
                  ? 'bg-sky-50 border-sky-700 text-slate-900 shadow-sm ring-1 ring-sky-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="font-mono text-xs font-bold text-slate-900">ASME B16.48 Spec</div>
              <div className="text-[9px] text-slate-500">Heavy Wall Nominal</div>
            </button>
          </div>
        </div>

        {/* Global Batch Add-on Options: T-Handle & 3/8 Lockout Hole */}
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs min-w-0">
          <div className="flex items-center gap-1.5 text-slate-700 font-bold text-[11px] shrink-0">
            <span className="text-sky-700 font-mono">⚙️ CNC OPTIONS:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full sm:w-auto">
            {/* T-Handle Checkbox */}
            <label className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border cursor-pointer font-bold text-xs transition-all min-h-[42px] touch-manipulation ${
              batchTHandle
                ? 'bg-sky-100 border-sky-600 text-sky-950 shadow-sm'
                : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
            }`}>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={batchTHandle}
                  onChange={e => setBatchTHandle(e.target.checked)}
                  className="h-4 w-4 text-sky-600 rounded"
                />
                <span>Integral CNC T-Handle</span>
              </div>
              <span className="font-mono text-sky-700 text-[10px] bg-white px-1.5 py-0.5 rounded border border-sky-300 font-black">+$5</span>
            </label>

            {/* 3/8 Lockout Hole Checkbox */}
            <label className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border cursor-pointer font-bold text-xs transition-all min-h-[42px] touch-manipulation ${
              batchLockoutHole
                ? 'bg-amber-100 border-amber-600 text-amber-950 shadow-sm'
                : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
            }`}>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={batchLockoutHole}
                  onChange={e => setBatchLockoutHole(e.target.checked)}
                  className="h-4 w-4 text-amber-600 rounded"
                />
                <span>3/8" Center Lockout</span>
              </div>
              <span className="font-mono text-amber-800 text-[10px] bg-white px-1.5 py-0.5 rounded border border-amber-300 font-black">+$5</span>
            </label>
          </div>
        </div>

        {/* Filter Strip & MTR Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200 text-xs min-w-0">
          
          {/* Quick Size Range Filters */}
          <div className="flex flex-wrap items-center gap-1 min-w-0">
            <span className="text-slate-500 font-semibold text-[11px] shrink-0">Filter:</span>
            <button
              type="button"
              onClick={() => setSizeFilter('all')}
              className={`px-2.5 py-1.5 rounded-md border text-[11px] transition-colors touch-manipulation min-h-[32px] ${
                sizeFilter === 'all' ? 'bg-slate-900 text-white font-bold border-slate-900' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              All (1/2"–24")
            </button>
            <button
              type="button"
              onClick={() => setSizeFilter('small')}
              className={`px-2.5 py-1.5 rounded-md border text-[11px] transition-colors touch-manipulation min-h-[32px] ${
                sizeFilter === 'small' ? 'bg-slate-900 text-white font-bold border-slate-900' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Small (1/2"–3")
            </button>
            <button
              type="button"
              onClick={() => setSizeFilter('mid')}
              className={`px-2.5 py-1.5 rounded-md border text-[11px] transition-colors touch-manipulation min-h-[32px] ${
                sizeFilter === 'mid' ? 'bg-slate-900 text-white font-bold border-slate-900' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Mid (4"–12")
            </button>
            <button
              type="button"
              onClick={() => setSizeFilter('large')}
              className={`px-2.5 py-1.5 rounded-md border text-[11px] transition-colors touch-manipulation min-h-[32px] ${
                sizeFilter === 'large' ? 'bg-slate-900 text-white font-bold border-slate-900' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Large (14"–24")
            </button>
          </div>

          {/* Search & MTR Toggle */}
          <div className="flex items-center gap-2 justify-between sm:justify-end w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search NPS..."
                className="pl-8 pr-2 py-1.5 text-xs rounded-md border border-slate-300 bg-white w-full sm:w-32 focus:outline-none focus:border-sky-600 min-h-[36px]"
              />
            </div>

            <label className="flex items-center gap-1.5 text-xs text-slate-700 font-bold cursor-pointer shrink-0 min-h-[36px] px-2 rounded hover:bg-slate-100 touch-manipulation">
              <input
                type="checkbox"
                checked={requireMTR}
                onChange={e => setRequireMTR(e.target.checked)}
                className="h-4 w-4 text-emerald-600 rounded"
              />
              <span className="hidden sm:inline">Certified MTRs (Free)</span>
              <span className="sm:hidden">MTRs</span>
            </label>
          </div>

        </div>

      </div>

      {/* 2. Rapid Multi-Size Tabular Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[760px] text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-900 text-slate-200 font-sans uppercase text-[10px] sm:text-[11px] tracking-wider border-b border-slate-800">
                <th className="py-3 px-3 font-bold sticky left-0 bg-slate-900 z-10">NPS Size</th>
                <th className="py-3 px-2.5 font-semibold">OD</th>
                <th className="py-3 px-2.5 font-semibold">Bolt Circle</th>
                <th className="py-3 px-2.5 font-semibold">Thickness</th>
                <th className="py-3 px-2.5 font-semibold">Unit Weight</th>
                <th className="py-3 px-2.5 font-semibold">Specs</th>
                <th className="py-3 px-2.5 font-semibold">Line ID</th>
                <th className="py-3 px-3 text-right font-bold">
                  {isClientLoggedIn ? 'Wholesale Price (-10%)' : 'List Price ($USD)'}
                </th>
                <th className="py-3 px-3 text-center font-bold">Turnaround Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {matrixRows.map(row => {
                const hasQty = row.qty > 0;
                return (
                  <tr
                    key={row.nps}
                    className={`transition-colors ${
                      hasQty ? 'bg-sky-50/90 font-bold' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    {/* NPS Size */}
                    <td className="py-2.5 px-3 font-black text-xs sm:text-sm text-slate-900 font-mono sticky left-0 bg-inherit z-10">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-sky-600 shrink-0"></span>
                        <span>{row.nps} NPS</span>
                      </div>
                      <div className="text-[9px] text-slate-500 font-normal font-sans">
                        {selectedClass}# {selectedMaterial === 'SA-36' ? 'A-36 CS' : selectedMaterial}
                      </div>
                    </td>

                    {/* OD */}
                    <td className="py-2.5 px-2.5 text-slate-800 font-medium">
                      {row.geom.od.toFixed(3)}"
                    </td>

                    {/* Bolt Circle */}
                    <td className="py-2.5 px-2.5 text-slate-700">
                      {row.geom.boltCircle.toFixed(3)}" <span className="text-slate-400 text-[9px]">({row.geom.boltSize}")</span>
                    </td>

                    {/* Thickness */}
                    <td className="py-2.5 px-2.5 text-slate-800">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        thicknessOption === '11GA'
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          : 'bg-slate-100 border border-slate-200 text-slate-800'
                      }`}>
                        {row.calcResult.thicknessLabel}
                      </span>
                    </td>

                    {/* Scale Weight */}
                    <td className="py-2.5 px-2.5 text-slate-700">
                      <span className="font-bold text-slate-900">{row.unitWeight} lbs</span>
                      {hasQty ? (
                        <div className="text-[9px] text-sky-700">
                          Total: {row.totalWeight} lbs
                        </div>
                      ) : null}
                    </td>

                    {/* Active Configured Specs Badges */}
                    <td className="py-2.5 px-2.5 font-sans">
                      <div className="flex flex-wrap gap-1">
                        {productType === 'figure8_blind' ? (
                          <span className="text-[9px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded">
                            Figure 8
                          </span>
                        ) : null}
                        {batchTHandle && (
                          <span className="text-[9px] font-bold text-sky-900 bg-sky-100 border border-sky-300 px-1.5 py-0.5 rounded">
                            T-Handle
                          </span>
                        )}
                        {batchLockoutHole && (
                          <span className="text-[9px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded">
                            3/8" Lockout
                          </span>
                        )}
                        {!batchTHandle && !batchLockoutHole && productType !== 'figure8_blind' && (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                            Standard
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Handle Stamping */}
                    <td className="py-2 px-2.5">
                      <input
                        type="text"
                        maxLength={18}
                        value={row.customStamp}
                        onChange={e => handleStampChange(row.nps, e.target.value)}
                        placeholder={`ISO-${row.nps.replace('"', '')}`}
                        className="w-24 rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-600 focus:outline-none min-h-[32px]"
                      />
                    </td>

                    {/* Unit Price (Public List or 10% Wholesale) */}
                    <td className="py-2.5 px-3 text-right">
                      {isClientLoggedIn ? (
                        <div>
                          <div className="flex items-center justify-end gap-1 font-mono">
                            <span className="text-[10px] text-slate-400 line-through">
                              ${row.listPrice.toFixed(2)}
                            </span>
                            <span className="text-xs sm:text-sm font-black text-slate-900">
                              ${row.wholesalePrice.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-end gap-1 mt-0.5 font-mono">
                            <span className="text-[8px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-1 py-0.1 rounded">
                              SAVE 10%
                            </span>
                            {hasQty && (
                              <span className="text-[9px] font-bold text-emerald-700">
                                Line: ${row.lineTotal.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-mono text-xs sm:text-sm font-black text-slate-900">
                            ${row.listPrice.toFixed(2)}
                          </div>
                          <button
                            type="button"
                            onClick={onOpenLoginModal}
                            className="mt-0.5 inline-flex items-center gap-1 text-[9px] font-bold text-sky-800 bg-sky-50 border border-sky-300 hover:bg-sky-100 px-1.5 py-0.5 rounded shadow-sm transition-all touch-manipulation min-h-[28px]"
                            title="Register work email to unlock 10% wholesale discount"
                          >
                            <Lock className="h-2.5 w-2.5 text-sky-600 shrink-0" />
                            <span>10% Trade: ${row.wholesalePrice.toFixed(2)}</span>
                          </button>
                          {hasQty && (
                            <div className="text-[9px] font-bold text-slate-600 font-mono mt-0.5">
                              Line: ${row.lineTotal.toFixed(2)}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Quantity Stepper (WCAG 2.2 Compliant Touch Targets) */}
                    <td className="py-2 px-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(row.nps, row.qty - 1)}
                          disabled={row.qty === 0}
                          aria-label={`Decrease quantity for ${row.nps}`}
                          className="flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation active:scale-90"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <input
                          type="number"
                          min="0"
                          max="2000"
                          value={row.qty === 0 ? '' : row.qty}
                          onChange={e => handleQtyChange(row.nps, parseInt(e.target.value) || 0)}
                          placeholder="0"
                          aria-label={`Quantity for ${row.nps}`}
                          className="h-8 w-12 sm:h-7 sm:w-10 rounded-lg border border-slate-300 bg-white text-center font-bold text-xs sm:text-xs text-slate-900 focus:border-sky-600 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleQtyChange(row.nps, row.qty + 1)}
                          aria-label={`Increase quantity for ${row.nps}`}
                          className="flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 touch-manipulation active:scale-90"
                        >
                          <Plus className="h-3.5 w-3.5" />
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

      {/* 3. Sticky Bottom Action Bar for Multi-Item Batch (Safe-Area Aware) */}
      {totalSelectedCount > 0 && (
        <div className="sticky bottom-0 sm:bottom-4 z-40 bg-slate-950/95 backdrop-blur-md text-white rounded-t-2xl sm:rounded-2xl border-t sm:border border-slate-800 p-3.5 sm:p-5 shadow-2xl animate-fadeIn flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 pb-[max(14px,env(safe-area-inset-bottom))]">
          
          <div className="space-y-0.5 text-center lg:text-left min-w-0">
            <div className="flex items-center gap-2 justify-center lg:justify-start flex-wrap">
              <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full font-mono">
                {totalSelectedCount} {totalSelectedCount === 1 ? 'Blind' : 'Blinds'} Selected
              </span>
              <span className="text-xs text-slate-400 font-mono truncate">
                Across {activeSelectedItems.length} {activeSelectedItems.length === 1 ? 'size' : 'sizes'} &bull; {totalSelectedWeight} Scale Lbs
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans hidden sm:block">
              Domestic plate in-stock in Texas. Ready for same-day CNC plasma cutting with full certified MTR packets.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 shrink-0">
            {!isClientLoggedIn && (
              <button
                type="button"
                onClick={onOpenLoginModal}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 px-4 py-3 text-xs sm:text-sm font-bold text-white transition-all shadow-md active:scale-95 min-h-[48px] touch-manipulation"
              >
                <Lock className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Unlock Wholesale Rates</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleGenerateProposalForBatch}
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 sm:px-5 py-3 text-xs sm:text-sm font-black text-slate-950 hover:bg-amber-400 transition-all shadow-lg active:scale-95 min-h-[48px] touch-manipulation"
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span>Instant Proposal</span>
            </button>

            <button
              type="button"
              onClick={handleAddBatchToCart}
              className="flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 sm:px-5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-sky-600 transition-all shadow-lg active:scale-95 min-h-[48px] touch-manipulation"
            >
              {batchAddedSuccess ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400 font-black shrink-0" />
                  <span>Added {totalSelectedCount}x to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 shrink-0" />
                  <span>Add {totalSelectedCount}x to Cart</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
