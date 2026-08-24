// paddleBlindMasterData.ts
// Complete ASME B16.48 Master Dataset & JobTrax Pricing Engine
// Iron Prairie Fabrication Group LLC (ironprairiefabrication.com)

export type PressureClass = 150 | 300 | 600 | 900 | 1500;
export type MaterialCode = 'SA-36' | 'SA-516-70' | '304' | '304L' | '316L' | 'AL-6061';
export type MaterialName =
  | 'Carbon Steel SA-36 (Structural / Utility)'
  | 'Carbon Steel SA-516 Gr. 70 (PVQ Boiler)'
  | 'Stainless Steel 304 (Commercial Grade)'
  | 'Stainless Steel 304/304L (Dual-Certified Low Carbon)'
  | 'Stainless Steel 316L (Acid & Marine Refinery Grade)'
  | 'Aluminum 6061-T6 (Structural Industrial Plate)';
export type FacingType = 'Flat Face (FF) - Standard (No Machining)' | 'Machined Gasket Finish (Special Order)';

export interface MaterialCostConfig {
  code: MaterialCode;
  name: MaterialName;
  density1InchSqFt: number; // lbs per sq ft at 1" thickness
  pricePerLb: number;       // Base estimating rate $/lb
  scrapMultiplier: number;  // 1.40 standard (40% burn skeleton scrap)
}

export interface LaborTier {
  sizeRange: string;
  laborHours: number;
  laborRatePerHour: number;
  laborPrice: number;
}

export interface FlangeGeometry {
  nps: string;
  nominalSizeInches: number;
  od: number;
  boltCircle: number;
  boltSize: number;
  laborHours: number;
}

export interface PaddleBlindMasterRecord {
  partNumber: string;
  pressureClass: PressureClass;
  nps: string;
  nominalSizeInches: number;
  thickness: number;
  thicknessLabel: string;
  materialCode: MaterialCode;
  od: number;
  boltCircle: number;
  boltSize: number;
  laborHours: number;
  actualWeightLbs: number;
  adjustedWeightLbs: number;
  materialPrice: number;
  laborPrice: number;
  totalPrice: number;
}

export interface AccessoryItem {
  id: string;
  itemType: 'Lifting Lug' | 'Plate Dog' | 'Wedge' | 'T-Handle';
  material: string;
  thickness: string;
  unitPrice: number;
}

// --------------------------------------------------------------------------
// 1. SHOP PARAMETERS & RATES
// --------------------------------------------------------------------------
export const SHOP_CONFIG = {
  shopLaborRate: 83.85,
  tHandleAdderPrice: 5.75,
  baseHandlingFee: 5.00,
  defaultScrapMultiplier: 1.40,
};

export const MATERIAL_CONFIGS: Record<MaterialCode, MaterialCostConfig> = {
  'SA-36': {
    code: 'SA-36',
    name: 'Carbon Steel SA-36 (Structural / Utility)',
    density1InchSqFt: 40.84,
    pricePerLb: 1.85,
    scrapMultiplier: 1.40,
  },
  'SA-516-70': {
    code: 'SA-516-70',
    name: 'Carbon Steel SA-516 Gr. 70 (PVQ Boiler)',
    density1InchSqFt: 40.84,
    pricePerLb: 2.15,
    scrapMultiplier: 1.40,
  },
  '304': {
    code: '304',
    name: 'Stainless Steel 304 (Commercial Grade)',
    density1InchSqFt: 42.665,
    pricePerLb: 5.50,
    scrapMultiplier: 1.40,
  },
  '304L': {
    code: '304L',
    name: 'Stainless Steel 304/304L (Dual-Certified Low Carbon)',
    density1InchSqFt: 42.665,
    pricePerLb: 5.95,
    scrapMultiplier: 1.40,
  },
  '316L': {
    code: '316L',
    name: 'Stainless Steel 316L (Acid & Marine Refinery Grade)',
    density1InchSqFt: 43.15,
    pricePerLb: 7.40,
    scrapMultiplier: 1.40,
  },
  'AL-6061': {
    code: 'AL-6061',
    name: 'Aluminum 6061-T6 (Structural Industrial Plate)',
    density1InchSqFt: 14.39,
    pricePerLb: 5.00,
    scrapMultiplier: 1.40,
  },
};

export const LABOR_SCALE: Record<string, number> = {
  '1/2"': 0.35,
  '3/4"': 0.35,
  '1"': 0.35,
  '1-1/4"': 0.35,
  '1-1/2"': 0.35,
  '2"': 0.35,
  '2-1/2"': 0.35,
  '3"': 0.35,
  '4"': 0.35,
  '6"': 0.35,
  '8"': 0.35,
  '10"': 0.35,
  '12"': 0.38,
  '14"': 0.42,
  '16"': 0.47,
  '18"': 0.52,
  '20"': 0.56,
  '24"': 0.61,
};

// --------------------------------------------------------------------------
// 2. EXTRAS & FABRICATION ACCESSORIES
// --------------------------------------------------------------------------
export const ACCESSORIES_CATALOG: AccessoryItem[] = [
  // Lifting Lugs
  { id: 'LUG-CS-0.250', itemType: 'Lifting Lug', material: 'Carbon Steel', thickness: '1/4"', unitPrice: 32.00 },
  { id: 'LUG-CS-0.500', itemType: 'Lifting Lug', material: 'Carbon Steel', thickness: '1/2"', unitPrice: 34.00 },
  { id: 'LUG-CS-0.750', itemType: 'Lifting Lug', material: 'Carbon Steel', thickness: '3/4"', unitPrice: 36.00 },
  { id: 'LUG-304-0.250', itemType: 'Lifting Lug', material: '304/304L', thickness: '1/4"', unitPrice: 37.00 },
  { id: 'LUG-304-0.500', itemType: 'Lifting Lug', material: '304/304L', thickness: '1/2"', unitPrice: 44.00 },
  { id: 'LUG-304-0.750', itemType: 'Lifting Lug', material: '304/304L', thickness: '3/4"', unitPrice: 50.00 },
  { id: 'LUG-316-0.250', itemType: 'Lifting Lug', material: '316/316L', thickness: '1/4"', unitPrice: 39.00 },
  { id: 'LUG-316-0.500', itemType: 'Lifting Lug', material: '316/316L', thickness: '1/2"', unitPrice: 46.00 },
  { id: 'LUG-316-0.750', itemType: 'Lifting Lug', material: '316/316L', thickness: '3/4"', unitPrice: 52.00 },

  // Plate Dogs (1/2")
  { id: 'DOG-CS-0.500', itemType: 'Plate Dog', material: 'Carbon Steel', thickness: '1/2"', unitPrice: 35.00 },
  { id: 'DOG-304-0.500', itemType: 'Plate Dog', material: '304/304L', thickness: '1/2"', unitPrice: 48.00 },
  { id: 'DOG-316-0.500', itemType: 'Plate Dog', material: '316/316L', thickness: '1/2"', unitPrice: 50.00 },

  // Fit-Up Wedges (3/4")
  { id: 'WDG-CS-0.750', itemType: 'Wedge', material: 'Carbon Steel', thickness: '3/4"', unitPrice: 34.00 },
  { id: 'WDG-304-0.750', itemType: 'Wedge', material: '304/304L', thickness: '3/4"', unitPrice: 35.00 },
  { id: 'WDG-316-0.750', itemType: 'Wedge', material: '316/316L', thickness: '3/4"', unitPrice: 37.00 },

  // T-Handle Add-On
  { id: 'OPT-THANDLE', itemType: 'T-Handle', material: 'Universal', thickness: 'Universal', unitPrice: 5.75 },
];

// --------------------------------------------------------------------------
// 3. MASTER FLANGE GEOMETRY (ASME B16.48)
// --------------------------------------------------------------------------
export const MASTER_GEOMETRY: Record<PressureClass, Record<string, { od: number; boltCircle: number; boltSize: number }>> = {
  150: {
    '1/2"':   { od: 1.755, boltCircle: 2.380, boltSize: 0.500 },
    '3/4"':   { od: 2.125, boltCircle: 2.750, boltSize: 0.500 },
    '1"':     { od: 2.495, boltCircle: 3.120, boltSize: 0.500 },
    '1-1/4"': { od: 2.875, boltCircle: 3.500, boltSize: 0.500 },
    '1-1/2"': { od: 3.255, boltCircle: 3.880, boltSize: 0.500 },
    '2"':     { od: 4.000, boltCircle: 4.750, boltSize: 0.625 },
    '2-1/2"': { od: 4.750, boltCircle: 5.500, boltSize: 0.625 },
    '3"':     { od: 5.250, boltCircle: 6.000, boltSize: 0.625 },
    '4"':     { od: 6.750, boltCircle: 7.500, boltSize: 0.625 },
    '6"':     { od: 8.625, boltCircle: 9.500, boltSize: 0.750 },
    '8"':     { od: 10.875, boltCircle: 11.750, boltSize: 0.750 },
    '10"':    { od: 13.250, boltCircle: 14.250, boltSize: 0.875 },
    '12"':    { od: 16.000, boltCircle: 17.000, boltSize: 0.875 },
    '14"':    { od: 17.625, boltCircle: 18.750, boltSize: 1.000 },
    '16"':    { od: 20.125, boltCircle: 21.250, boltSize: 1.000 },
    '18"':    { od: 21.500, boltCircle: 22.750, boltSize: 1.125 },
    '20"':    { od: 23.750, boltCircle: 25.000, boltSize: 1.125 },
    '24"':    { od: 28.125, boltCircle: 29.500, boltSize: 1.250 },
  },
  300: {
    '1/2"':   { od: 1.995, boltCircle: 2.620, boltSize: 0.500 },
    '3/4"':   { od: 2.500, boltCircle: 3.250, boltSize: 0.625 },
    '1"':     { od: 2.750, boltCircle: 3.500, boltSize: 0.625 },
    '1-1/4"': { od: 3.125, boltCircle: 3.880, boltSize: 0.625 },
    '1-1/2"': { od: 3.625, boltCircle: 4.500, boltSize: 0.750 },
    '2"':     { od: 4.250, boltCircle: 5.000, boltSize: 0.625 },
    '2-1/2"': { od: 5.005, boltCircle: 5.880, boltSize: 0.750 },
    '3"':     { od: 5.745, boltCircle: 6.620, boltSize: 0.750 },
    '4"':     { od: 7.005, boltCircle: 7.880, boltSize: 0.750 },
    '6"':     { od: 9.745, boltCircle: 10.620, boltSize: 0.750 },
    '8"':     { od: 12.000, boltCircle: 13.000, boltSize: 0.875 },
    '10"':    { od: 14.125, boltCircle: 15.250, boltSize: 1.000 },
    '12"':    { od: 16.500, boltCircle: 17.750, boltSize: 1.125 },
    '14"':    { od: 19.000, boltCircle: 20.250, boltSize: 1.125 },
    '16"':    { od: 21.125, boltCircle: 22.500, boltSize: 1.250 },
    '18"':    { od: 23.375, boltCircle: 24.750, boltSize: 1.250 },
    '20"':    { od: 25.625, boltCircle: 27.000, boltSize: 1.250 },
    '24"':    { od: 30.375, boltCircle: 32.000, boltSize: 1.500 },
  },
  600: {
    '1/2"':   { od: 1.995, boltCircle: 2.620, boltSize: 0.500 },
    '3/4"':   { od: 2.500, boltCircle: 3.250, boltSize: 0.625 },
    '1"':     { od: 2.750, boltCircle: 3.500, boltSize: 0.625 },
    '1-1/4"': { od: 3.125, boltCircle: 3.880, boltSize: 0.625 },
    '1-1/2"': { od: 3.625, boltCircle: 4.500, boltSize: 0.750 },
    '2"':     { od: 4.250, boltCircle: 5.000, boltSize: 0.625 },
    '2-1/2"': { od: 5.005, boltCircle: 5.880, boltSize: 0.750 },
    '3"':     { od: 5.745, boltCircle: 6.620, boltSize: 0.750 },
    '4"':     { od: 7.500, boltCircle: 8.500, boltSize: 0.875 },
    '6"':     { od: 10.375, boltCircle: 11.500, boltSize: 1.000 },
    '8"':     { od: 12.500, boltCircle: 13.750, boltSize: 1.125 },
    '10"':    { od: 15.625, boltCircle: 17.000, boltSize: 1.250 },
    '12"':    { od: 17.875, boltCircle: 19.250, boltSize: 1.250 },
    '14"':    { od: 19.250, boltCircle: 20.750, boltSize: 1.375 },
    '16"':    { od: 22.125, boltCircle: 23.750, boltSize: 1.500 },
    '18"':    { od: 24.000, boltCircle: 25.750, boltSize: 1.625 },
    '20"':    { od: 26.750, boltCircle: 28.500, boltSize: 1.625 },
    '24"':    { od: 31.000, boltCircle: 33.000, boltSize: 1.875 },
  },
  900: {
    '1/2"':   { od: 2.375, boltCircle: 3.250, boltSize: 0.750 },
    '3/4"':   { od: 2.625, boltCircle: 3.500, boltSize: 0.750 },
    '1"':     { od: 3.000, boltCircle: 4.000, boltSize: 0.875 },
    '1-1/4"': { od: 3.375, boltCircle: 4.380, boltSize: 0.875 },
    '1-1/2"': { od: 3.755, boltCircle: 4.880, boltSize: 1.000 },
    '2"':     { od: 5.500, boltCircle: 6.500, boltSize: 0.875 },
    '2-1/2"': { od: 6.375, boltCircle: 7.500, boltSize: 1.000 },
    '3"':     { od: 6.500, boltCircle: 7.500, boltSize: 0.875 },
    '4"':     { od: 8.000, boltCircle: 9.250, boltSize: 1.125 },
    '6"':     { od: 11.250, boltCircle: 12.500, boltSize: 1.125 },
    '8"':     { od: 14.000, boltCircle: 15.500, boltSize: 1.375 },
    '10"':    { od: 17.000, boltCircle: 18.500, boltSize: 1.375 },
    '12"':    { od: 19.500, boltCircle: 21.000, boltSize: 1.375 },
    '14"':    { od: 20.375, boltCircle: 22.000, boltSize: 1.500 },
    '16"':    { od: 22.500, boltCircle: 24.250, boltSize: 1.625 },
    '18"':    { od: 25.000, boltCircle: 27.000, boltSize: 1.875 },
    '20"':    { od: 27.375, boltCircle: 29.500, boltSize: 2.000 },
    '24"':    { od: 32.875, boltCircle: 35.500, boltSize: 2.500 },
  },
  1500: {
    '1/2"':   { od: 2.375, boltCircle: 3.250, boltSize: 0.750 },
    '3/4"':   { od: 2.625, boltCircle: 3.500, boltSize: 0.750 },
    '1"':     { od: 3.000, boltCircle: 4.000, boltSize: 0.875 },
    '1-1/4"': { od: 3.375, boltCircle: 4.380, boltSize: 0.875 },
    '1-1/2"': { od: 3.755, boltCircle: 4.880, boltSize: 1.000 },
    '2"':     { od: 5.500, boltCircle: 6.500, boltSize: 0.875 },
    '2-1/2"': { od: 6.375, boltCircle: 7.500, boltSize: 1.000 },
    '3"':     { od: 6.750, boltCircle: 8.000, boltSize: 1.125 },
    '4"':     { od: 8.125, boltCircle: 9.500, boltSize: 1.250 },
    '6"':     { od: 11.000, boltCircle: 12.500, boltSize: 1.375 },
    '8"':     { od: 13.750, boltCircle: 15.500, boltSize: 1.625 },
    '10"':    { od: 17.000, boltCircle: 19.000, boltSize: 1.875 },
    '12"':    { od: 20.375, boltCircle: 22.500, boltSize: 2.000 },
    '14"':    { od: 22.625, boltCircle: 25.000, boltSize: 2.250 },
    '16"':    { od: 25.125, boltCircle: 27.750, boltSize: 2.500 },
    '18"':    { od: 27.625, boltCircle: 30.500, boltSize: 2.750 },
    '20"':    { od: 29.625, boltCircle: 32.750, boltSize: 3.000 },
    '24"':    { od: 35.375, boltCircle: 39.000, boltSize: 3.500 },
  },
};

// --------------------------------------------------------------------------
// 4. CALCULATION ENGINE
// --------------------------------------------------------------------------
export function calculateJobTraxRecord(params: {
  pressureClass: PressureClass;
  nps: string;
  thickness: number;
  thicknessLabel: string;
  materialCode: MaterialCode;
}): PaddleBlindMasterRecord {
  const { pressureClass, nps, thickness, thicknessLabel, materialCode } = params;
  const geom = MASTER_GEOMETRY[pressureClass][nps] || { od: 4.0, boltCircle: 4.75, boltSize: 0.625 };
  const matConfig = MATERIAL_CONFIGS[materialCode];
  const laborHours = LABOR_SCALE[nps] || 0.35;

  // Handle standard dimension projection
  const handleWidth = Math.max(1.0, geom.od * 0.25);
  const handleLength = Math.max(3.5, geom.boltCircle - geom.od / 2 + 1.5);
  
  // Surface area calculation (Circle plate + Handle rectangle) in sq. ft
  const circleAreaSqIn = Math.PI * Math.pow(geom.od / 2, 2);
  const handleAreaSqIn = handleWidth * handleLength;
  const totalAreaSqFt = (circleAreaSqIn + handleAreaSqIn) / 144.0;

  // Weight calculation
  const weightPerSqFtAtThick = matConfig.density1InchSqFt * thickness;
  const actualWeight = Math.round(totalAreaSqFt * weightPerSqFtAtThick * 100) / 100;
  const adjustedWeight = Math.round(actualWeight * matConfig.scrapMultiplier * 100) / 100;

  // Cost & Price structure
  const materialPrice = Math.round(adjustedWeight * matConfig.pricePerLb * 100) / 100;
  const laborPrice = Math.round(laborHours * SHOP_CONFIG.shopLaborRate * 100) / 100;
  const totalPrice = Math.round((materialPrice + laborPrice + SHOP_CONFIG.baseHandlingFee) * 100) / 100;

  // Part Number Builder
  const classCode = pressureClass === 1500 ? 'C1500' : `CX${pressureClass}`;
  const sizeCode = `S${nps.replace('"', '')}`;
  const partNumber = `PB${materialCode}-${classCode}T${thicknessLabel}${sizeCode}`;

  return {
    partNumber,
    pressureClass,
    nps,
    nominalSizeInches: parseFloat(nps.replace('"', '').replace('-1/2', '.5').replace('-1/4', '.25').replace('-3/4', '.75')) || 1.0,
    thickness,
    thicknessLabel,
    materialCode,
    od: geom.od,
    boltCircle: geom.boltCircle,
    boltSize: geom.boltSize,
    laborHours,
    actualWeightLbs: actualWeight,
    adjustedWeightLbs: adjustedWeight,
    materialPrice,
    laborPrice,
    totalPrice,
  };
}

// --------------------------------------------------------------------------
// 5. SEED MASTER CATALOG GENERATOR
// --------------------------------------------------------------------------
export const THICKNESS_SERIES = [
  { label: '12 Gauge', value: 0.1046 },
  { label: '1/8"', value: 0.125 },
  { label: '3/16"', value: 0.1875 },
  { label: '1/4"', value: 0.250 },
  { label: '5/16"', value: 0.3125 },
  { label: '3/8"', value: 0.375 },
  { label: '1/2"', value: 0.500 },
  { label: '5/8"', value: 0.625 },
  { label: '3/4"', value: 0.750 },
  { label: '7/8"', value: 0.875 },
  { label: '1"',   value: 1.000 },
  { label: '1-1/8"', value: 1.125 },
  { label: '1-1/4"', value: 1.250 },
  { label: '1-3/8"', value: 1.375 },
  { label: '1-1/2"', value: 1.500 },
  { label: '1-5/8"', value: 1.625 },
  { label: '1-7/8"', value: 1.875 },
  { label: '2-1/4"', value: 2.250 },
  { label: '3"',   value: 3.000 },
];

export function generateFullPaddleBlindCatalog(): PaddleBlindMasterRecord[] {
  const catalog: PaddleBlindMasterRecord[] = [];
  const classes: PressureClass[] = [150, 300, 600, 900, 1500];
  const materials: MaterialCode[] = ['SA-36', 'SA-516-70', '304', '304L', '316L', 'AL-6061'];

  for (const pClass of classes) {
    const sizeKeys = Object.keys(MASTER_GEOMETRY[pClass]);
    for (const nps of sizeKeys) {
      for (const thk of THICKNESS_SERIES) {
        for (const mat of materials) {
          // Filter extreme unrealistic combinations to keep catalog lean
          if (pClass >= 900 && thk.value < 0.125) continue;
          if (thk.value > 1.500 && !['8"', '10"', '12"', '14"', '16"', '18"', '20"', '24"'].includes(nps)) continue;

          const record = calculateJobTraxRecord({
            pressureClass: pClass,
            nps,
            thickness: thk.value,
            thicknessLabel: thk.label,
            materialCode: mat,
          });
          catalog.push(record);
        }
      }
    }
  }
  return catalog;
}

// --------------------------------------------------------------------------
// 6. AMAZON FLAT-FILE EXPORT SERIALIZER
// --------------------------------------------------------------------------
export function exportToAmazonFlatFileTSV(records: PaddleBlindMasterRecord[]): string {
  const headers = [
    'sku',
    'product_name',
    'brand',
    'item_type_keyword',
    'standard_price',
    'quantity',
    'item_weight',
    'item_weight_unit',
    'material_type',
    'nominal_size',
    'pressure_rating',
    'bullet_point_1',
    'bullet_point_2',
    'bullet_point_3',
    'bullet_point_4',
  ];

  const rows = records.map((r) => {
    const brand = 'Iron Prairie Fabrication Group';
    const title = `${r.nps} NPS Class ${r.pressureClass}# Paddle Blind (${r.thicknessLabel} Thk) - ${r.materialCode === 'CS' ? 'A516 Gr. 70 Carbon Steel' : r.materialCode === 'SS' ? '304/304L Stainless' : '6061-T6 Aluminum'} - ASME B16.48`;
    const price = r.totalPrice.toFixed(2);
    const weight = r.adjustedWeightLbs.toFixed(2);
    const b1 = `Manufactured in the USA strictly compliant with ASME B16.48 standard line blind specifications.`;
    const b2 = `CNC plasma-cut from certified domestic plate with stamped heat number and full size/class stamping.`;
    const b3 = `Precision positive pipeline isolation, turnaround blinding, and hydrostatic pressure testing.`;
    const b4 = `Available with Certified Material Test Reports (MTRs) for full quality assurance and traceability.`;

    return [
      r.partNumber,
      `"${title}"`,
      `"${brand}"`,
      'pipe-fittings',
      price,
      '50',
      weight,
      'pounds',
      `"${MATERIAL_CONFIGS[r.materialCode].name}"`,
      `"${r.nps}"`,
      `"${r.pressureClass}#"`,
      `"${b1}"`,
      `"${b2}"`,
      `"${b3}"`,
      `"${b4}"`,
    ].join('\t');
  });

  return [headers.join('\t'), ...rows].join('\n');
}
