import {
  FlangeDimension,
  MaterialId,
  MaterialInfo,
  NPSSize,
  PressureClass,
  FacingType,
  ConfiguredBlind,
  ShopJob,
  AddOnOption,
  AmazonFeedRow
} from '../types';

export const LABOR_RATE_PER_HOUR = 83.85;
export const BASE_HANDLING_FEE = 5.00;
export const SKELETON_SCRAP_FACTOR = 1.40; // 40% scrap factor

export const MATERIALS: Record<MaterialId, MaterialInfo> = {
  A516: {
    id: 'A516',
    name: 'ASTM A516 Gr. 70 Carbon Steel',
    code: 'A516',
    astmSpec: 'ASTM A516 Grade 70 / A36 Dual Certified',
    ratePerLb: 2.03,
    densityLbPerCuIn: 0.28361, // 40.84 lbs/ft² for 1"
    densityLbPerSqFt1In: 40.84,
    category: 'Carbon Steel',
    description: 'High tensile pressure vessel plate for standard refinery & chemical positive isolation.',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    colorHex: '#4b5563'
  },
  '304L': {
    id: '304L',
    name: '304 / 304L Stainless Steel',
    code: '304L',
    astmSpec: 'ASTM A240 Gr. 304/304L Dual Grade',
    ratePerLb: 6.06,
    densityLbPerCuIn: 0.29628, // 42.665 lbs/ft² for 1"
    densityLbPerSqFt1In: 42.665,
    category: 'Stainless Steel',
    description: 'Corrosion resistant austenitic alloy for water treatment, food grade, and light chemical lines.',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    colorHex: '#94a3b8'
  },
  '316L': {
    id: '316L',
    name: '316 / 316L Stainless Steel',
    code: '316L',
    astmSpec: 'ASTM A240 Gr. 316/316L Acid/Chloride Resistant',
    ratePerLb: 6.08,
    densityLbPerCuIn: 0.29628, // 42.665 lbs/ft² for 1"
    densityLbPerSqFt1In: 42.665,
    category: 'Stainless Steel',
    description: 'Molybdenum-bearing stainless for aggressive chlorides, acids, and offshore coastal exposure.',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    colorHex: '#cbd5e1'
  },
  '6061': {
    id: '6061',
    name: '6061-T6 Aluminum',
    code: '6061',
    astmSpec: 'ASTM B209 6061-T6 Structural Alloy',
    ratePerLb: 5.10,
    densityLbPerCuIn: 0.09993, // 14.39 lbs/ft² for 1"
    densityLbPerSqFt1In: 14.39,
    category: 'Aluminum',
    description: 'Ultra lightweight alloy for temporary utility blinding, blanking, and low-temperature air/gas.',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    colorHex: '#e2e8f0'
  }
};

export const PRESSURE_CLASSES: PressureClass[] = ['150#', '300#', '600#', '900#', '1500#'];

export const NPS_SIZES: NPSSize[] = [
  '1/2"',
  '3/4"',
  '1"',
  '1-1/4"',
  '1-1/2"',
  '2"',
  '2-1/2"',
  '3"',
  '4"',
  '6"',
  '8"',
  '10"',
  '12"',
  '14"',
  '16"',
  '18"',
  '20"',
  '24"'
];

export const FACING_OPTIONS: { id: FacingType; name: string; description: string; serration: string }[] = [
  {
    id: 'RF',
    name: 'Raised Face (RF)',
    description: 'Standard 1/16" raised face serrated gasket seat (125-250 AARH finish).',
    serration: 'Concentric / Spiral Serrated'
  },
  {
    id: 'FF',
    name: 'Flat Face (FF)',
    description: 'Full flat face for matching with flat face cast iron or low-pressure flanges.',
    serration: 'Smooth / Flat'
  },
  {
    id: 'RTJ',
    name: 'Ring Joint (RTJ)',
    description: 'Precision machined metallic ring groove for severe high-pressure positive isolation.',
    serration: 'Octagonal / Oval Groove'
  }
];

export const ADD_ON_OPTIONS: AddOnOption[] = [
  {
    id: 'tHandle',
    name: 'Integral CNC Cut-Out T-Handle',
    price: 5.00,
    unit: 'ea',
    description: 'Integral 1-piece CNC cut T-handle for positive turnaround grip (No Welds).',
    weightLbs: 0.5
  },
  {
    id: 'lockoutHole',
    name: '3/8" Lockout Hole in Center of Handle',
    price: 5.00,
    unit: 'ea',
    description: 'Precision CNC-pierced 3/8" (0.375") center lockout / tagout hole for safety lock isolation.',
    weightLbs: 0.0
  },
  {
    id: 'liftingLug',
    name: 'Certified Heavy Rigging Lifting Lug',
    price: 34.00,
    unit: 'ea',
    description: 'Burned hoist shackle eye. Recommended on blinds ≥10" or weight ≥60 lbs.',
    weightLbs: 2.2
  },
  {
    id: 'plateDogs',
    name: '1/2" Fit-Up Plate Dogs (Set of 2)',
    price: 35.00,
    unit: 'set',
    description: 'Heavy 1/2" alignment dogs to force flange alignment during bolt installation.',
    weightLbs: 3.5
  },
  {
    id: 'fitUpWedges',
    name: '3/4" Flange Spread Fit-Up Wedges',
    price: 34.00,
    unit: 'ea',
    description: 'Hardened steel wedge for safely prying flange faces apart without face gouging.',
    weightLbs: 2.0
  }
];

// Helper to convert size string to numeric for sorting & logic
export function parseNpsToInches(nps: NPSSize): number {
  switch (nps) {
    case '1/2"': return 0.5;
    case '3/4"': return 0.75;
    case '1"': return 1.0;
    case '1-1/4"': return 1.25;
    case '1-1/2"': return 1.5;
    case '2"': return 2.0;
    case '2-1/2"': return 2.5;
    case '3"': return 3.0;
    case '4"': return 4.0;
    case '6"': return 6.0;
    case '8"': return 8.0;
    case '10"': return 10.0;
    case '12"': return 12.0;
    case '14"': return 14.0;
    case '16"': return 16.0;
    case '18"': return 18.0;
    case '20"': return 20.0;
    case '24"': return 24.0;
    default: return 1.0;
  }
}

export function getSizeCode(nps: NPSSize): string {
  const inches = parseNpsToInches(nps);
  const hundredths = Math.round(inches * 100);
  return hundredths.toString().padStart(4, '0');
}

// Master ASME B16.48 Dimensional Matrix Table
export const ASME_B16_48_DIMENSIONS: Record<PressureClass, Record<NPSSize, FlangeDimension>> = {
  '150#': {
    '1/2"': { nps: '1/2"', sizeCode: '0050', od: 1.755, boltCircle: 2.380, boltSize: 0.500, boltHoles: 4, nominalThickness: 0.125, thicknessFraction: '1/8"', handleLength: 4.0, handleWidth: 1.0 },
    '3/4"': { nps: '3/4"', sizeCode: '0075', od: 2.125, boltCircle: 2.750, boltSize: 0.500, boltHoles: 4, nominalThickness: 0.125, thicknessFraction: '1/8"', handleLength: 4.25, handleWidth: 1.0 },
    '1"': { nps: '1"', sizeCode: '0100', od: 2.500, boltCircle: 3.120, boltSize: 0.500, boltHoles: 4, nominalThickness: 0.125, thicknessFraction: '1/8"', handleLength: 4.5, handleWidth: 1.0 },
    '1-1/4"': { nps: '1-1/4"', sizeCode: '0125', od: 2.875, boltCircle: 3.500, boltSize: 0.500, boltHoles: 4, nominalThickness: 0.125, thicknessFraction: '1/8"', handleLength: 4.75, handleWidth: 1.0 },
    '1-1/2"': { nps: '1-1/2"', sizeCode: '0150', od: 3.250, boltCircle: 3.880, boltSize: 0.500, boltHoles: 4, nominalThickness: 0.125, thicknessFraction: '1/8"', handleLength: 5.0, handleWidth: 1.0 },
    '2"': { nps: '2"', sizeCode: '0200', od: 4.000, boltCircle: 4.750, boltSize: 0.625, boltHoles: 4, nominalThickness: 0.1875, thicknessFraction: '3/16"', handleLength: 5.5, handleWidth: 1.25 },
    '2-1/2"': { nps: '2-1/2"', sizeCode: '0250', od: 4.750, boltCircle: 5.500, boltSize: 0.625, boltHoles: 4, nominalThickness: 0.1875, thicknessFraction: '3/16"', handleLength: 5.75, handleWidth: 1.25 },
    '3"': { nps: '3"', sizeCode: '0300', od: 5.250, boltCircle: 6.000, boltSize: 0.625, boltHoles: 4, nominalThickness: 0.250, thicknessFraction: '1/4"', handleLength: 6.0, handleWidth: 1.25 },
    '4"': { nps: '4"', sizeCode: '0400', od: 6.750, boltCircle: 7.500, boltSize: 0.625, boltHoles: 8, nominalThickness: 0.250, thicknessFraction: '1/4"', handleLength: 6.5, handleWidth: 1.5 },
    '6"': { nps: '6"', sizeCode: '0600', od: 8.625, boltCircle: 9.500, boltSize: 0.750, boltHoles: 8, nominalThickness: 0.375, thicknessFraction: '3/8"', handleLength: 7.5, handleWidth: 1.5 },
    '8"': { nps: '8"', sizeCode: '0800', od: 10.875, boltCircle: 11.750, boltSize: 0.750, boltHoles: 8, nominalThickness: 0.500, thicknessFraction: '1/2"', handleLength: 8.5, handleWidth: 1.75 },
    '10"': { nps: '10"', sizeCode: '1000', od: 13.250, boltCircle: 14.250, boltSize: 0.875, boltHoles: 12, nominalThickness: 0.500, thicknessFraction: '1/2"', handleLength: 9.5, handleWidth: 1.75 },
    '12"': { nps: '12"', sizeCode: '1200', od: 16.000, boltCircle: 17.000, boltSize: 0.875, boltHoles: 12, nominalThickness: 0.625, thicknessFraction: '5/8"', handleLength: 10.5, handleWidth: 2.0 },
    '14"': { nps: '14"', sizeCode: '1400', od: 17.625, boltCircle: 18.750, boltSize: 1.000, boltHoles: 12, nominalThickness: 0.750, thicknessFraction: '3/4"', handleLength: 11.5, handleWidth: 2.0 },
    '16"': { nps: '16"', sizeCode: '1600', od: 20.125, boltCircle: 21.250, boltSize: 1.000, boltHoles: 16, nominalThickness: 0.750, thicknessFraction: '3/4"', handleLength: 12.5, handleWidth: 2.25 },
    '18"': { nps: '18"', sizeCode: '1800', od: 21.500, boltCircle: 22.750, boltSize: 1.125, boltHoles: 16, nominalThickness: 0.875, thicknessFraction: '7/8"', handleLength: 13.5, handleWidth: 2.25 },
    '20"': { nps: '20"', sizeCode: '2000', od: 23.750, boltCircle: 25.000, boltSize: 1.125, boltHoles: 20, nominalThickness: 0.875, thicknessFraction: '7/8"', handleLength: 14.5, handleWidth: 2.5 },
    '24"': { nps: '24"', sizeCode: '2400', od: 28.125, boltCircle: 29.500, boltSize: 1.250, boltHoles: 20, nominalThickness: 0.875, thicknessFraction: '7/8"', handleLength: 16.0, handleWidth: 2.5 }
  },
  '300#': {
    '1/2"': { nps: '1/2"', sizeCode: '0050', od: 1.995, boltCircle: 2.620, boltSize: 0.500, boltHoles: 4, nominalThickness: 0.125, thicknessFraction: '1/8"', handleLength: 4.25, handleWidth: 1.0 },
    '3/4"': { nps: '3/4"', sizeCode: '0075', od: 2.500, boltCircle: 3.250, boltSize: 0.625, boltHoles: 4, nominalThickness: 0.125, thicknessFraction: '1/8"', handleLength: 4.5, handleWidth: 1.0 },
    '1"': { nps: '1"', sizeCode: '0100', od: 2.750, boltCircle: 3.500, boltSize: 0.625, boltHoles: 4, nominalThickness: 0.125, thicknessFraction: '1/8"', handleLength: 4.75, handleWidth: 1.0 },
    '1-1/4"': { nps: '1-1/4"', sizeCode: '0125', od: 3.125, boltCircle: 3.880, boltSize: 0.625, boltHoles: 4, nominalThickness: 0.1875, thicknessFraction: '3/16"', handleLength: 5.0, handleWidth: 1.0 },
    '1-1/2"': { nps: '1-1/2"', sizeCode: '0150', od: 3.625, boltCircle: 4.500, boltSize: 0.750, boltHoles: 4, nominalThickness: 0.1875, thicknessFraction: '3/16"', handleLength: 5.25, handleWidth: 1.25 },
    '2"': { nps: '2"', sizeCode: '0200', od: 4.250, boltCircle: 5.000, boltSize: 0.625, boltHoles: 8, nominalThickness: 0.1875, thicknessFraction: '3/16"', handleLength: 5.75, handleWidth: 1.25 },
    '2-1/2"': { nps: '2-1/2"', sizeCode: '0250', od: 5.000, boltCircle: 5.880, boltSize: 0.750, boltHoles: 8, nominalThickness: 0.250, thicknessFraction: '1/4"', handleLength: 6.0, handleWidth: 1.25 },
    '3"': { nps: '3"', sizeCode: '0300', od: 5.750, boltCircle: 6.620, boltSize: 0.750, boltHoles: 8, nominalThickness: 0.250, thicknessFraction: '1/4"', handleLength: 6.5, handleWidth: 1.5 },
    '4"': { nps: '4"', sizeCode: '0400', od: 7.000, boltCircle: 7.880, boltSize: 0.750, boltHoles: 8, nominalThickness: 0.375, thicknessFraction: '3/8"', handleLength: 7.0, handleWidth: 1.5 },
    '6"': { nps: '6"', sizeCode: '0600', od: 9.750, boltCircle: 10.620, boltSize: 0.750, boltHoles: 12, nominalThickness: 0.500, thicknessFraction: '1/2"', handleLength: 8.5, handleWidth: 1.75 },
    '8"': { nps: '8"', sizeCode: '0800', od: 12.000, boltCircle: 13.000, boltSize: 0.875, boltHoles: 12, nominalThickness: 0.625, thicknessFraction: '5/8"', handleLength: 9.5, handleWidth: 1.75 },
    '10"': { nps: '10"', sizeCode: '1000', od: 14.125, boltCircle: 15.250, boltSize: 1.000, boltHoles: 16, nominalThickness: 0.750, thicknessFraction: '3/4"', handleLength: 10.5, handleWidth: 2.0 },
    '12"': { nps: '12"', sizeCode: '1200', od: 16.500, boltCircle: 17.750, boltSize: 1.125, boltHoles: 16, nominalThickness: 0.875, thicknessFraction: '7/8"', handleLength: 11.5, handleWidth: 2.0 },
    '14"': { nps: '14"', sizeCode: '1400', od: 19.000, boltCircle: 20.250, boltSize: 1.125, boltHoles: 20, nominalThickness: 1.000, thicknessFraction: '1"', handleLength: 12.5, handleWidth: 2.25 },
    '16"': { nps: '16"', sizeCode: '1600', od: 21.125, boltCircle: 22.500, boltSize: 1.250, boltHoles: 20, nominalThickness: 1.125, thicknessFraction: '1-1/8"', handleLength: 13.5, handleWidth: 2.25 },
    '18"': { nps: '18"', sizeCode: '1800', od: 23.375, boltCircle: 24.750, boltSize: 1.250, boltHoles: 24, nominalThickness: 1.250, thicknessFraction: '1-1/4"', handleLength: 14.5, handleWidth: 2.5 },
    '20"': { nps: '20"', sizeCode: '2000', od: 25.625, boltCircle: 27.000, boltSize: 1.250, boltHoles: 24, nominalThickness: 1.375, thicknessFraction: '1-3/8"', handleLength: 15.5, handleWidth: 2.5 },
    '24"': { nps: '24"', sizeCode: '2400', od: 30.375, boltCircle: 32.000, boltSize: 1.500, boltHoles: 24, nominalThickness: 1.625, thicknessFraction: '1-5/8"', handleLength: 17.0, handleWidth: 2.75 }
  },
  '600#': {
    '1/2"': { nps: '1/2"', sizeCode: '0050', od: 1.995, boltCircle: 2.620, boltSize: 0.500, boltHoles: 4, nominalThickness: 0.250, thicknessFraction: '1/4"', handleLength: 4.25, handleWidth: 1.0 },
    '3/4"': { nps: '3/4"', sizeCode: '0075', od: 2.500, boltCircle: 3.250, boltSize: 0.625, boltHoles: 4, nominalThickness: 0.250, thicknessFraction: '1/4"', handleLength: 4.5, handleWidth: 1.0 },
    '1"': { nps: '1"', sizeCode: '0100', od: 2.750, boltCircle: 3.500, boltSize: 0.625, boltHoles: 4, nominalThickness: 0.250, thicknessFraction: '1/4"', handleLength: 4.75, handleWidth: 1.0 },
    '1-1/4"': { nps: '1-1/4"', sizeCode: '0125', od: 3.125, boltCircle: 3.880, boltSize: 0.625, boltHoles: 4, nominalThickness: 0.250, thicknessFraction: '1/4"', handleLength: 5.0, handleWidth: 1.0 },
    '1-1/2"': { nps: '1-1/2"', sizeCode: '0150', od: 3.625, boltCircle: 4.500, boltSize: 0.750, boltHoles: 4, nominalThickness: 0.250, thicknessFraction: '1/4"', handleLength: 5.25, handleWidth: 1.25 },
    '2"': { nps: '2"', sizeCode: '0200', od: 4.250, boltCircle: 5.000, boltSize: 0.625, boltHoles: 8, nominalThickness: 0.250, thicknessFraction: '1/4"', handleLength: 5.75, handleWidth: 1.25 },
    '2-1/2"': { nps: '2-1/2"', sizeCode: '0250', od: 5.000, boltCircle: 5.880, boltSize: 0.750, boltHoles: 8, nominalThickness: 0.375, thicknessFraction: '3/8"', handleLength: 6.0, handleWidth: 1.25 },
    '3"': { nps: '3"', sizeCode: '0300', od: 5.750, boltCircle: 6.620, boltSize: 0.750, boltHoles: 8, nominalThickness: 0.375, thicknessFraction: '3/8"', handleLength: 6.5, handleWidth: 1.5 },
    '4"': { nps: '4"', sizeCode: '0400', od: 7.500, boltCircle: 8.500, boltSize: 0.875, boltHoles: 8, nominalThickness: 0.500, thicknessFraction: '1/2"', handleLength: 7.5, handleWidth: 1.5 },
    '6"': { nps: '6"', sizeCode: '0600', od: 10.375, boltCircle: 11.500, boltSize: 1.000, boltHoles: 12, nominalThickness: 0.750, thicknessFraction: '3/4"', handleLength: 9.0, handleWidth: 1.75 },
    '8"': { nps: '8"', sizeCode: '0800', od: 12.500, boltCircle: 13.750, boltSize: 1.125, boltHoles: 12, nominalThickness: 1.000, thicknessFraction: '1"', handleLength: 10.5, handleWidth: 2.0 },
    '10"': { nps: '10"', sizeCode: '1000', od: 15.625, boltCircle: 17.000, boltSize: 1.250, boltHoles: 16, nominalThickness: 1.250, thicknessFraction: '1-1/4"', handleLength: 12.0, handleWidth: 2.25 },
    '12"': { nps: '12"', sizeCode: '1200', od: 17.875, boltCircle: 19.250, boltSize: 1.250, boltHoles: 20, nominalThickness: 1.375, thicknessFraction: '1-3/8"', handleLength: 13.0, handleWidth: 2.25 },
    '14"': { nps: '14"', sizeCode: '1400', od: 19.250, boltCircle: 20.750, boltSize: 1.375, boltHoles: 20, nominalThickness: 1.500, thicknessFraction: '1-1/2"', handleLength: 14.0, handleWidth: 2.5 },
    '16"': { nps: '16"', sizeCode: '1600', od: 22.125, boltCircle: 23.750, boltSize: 1.500, boltHoles: 20, nominalThickness: 1.750, thicknessFraction: '1-3/4"', handleLength: 15.0, handleWidth: 2.5 },
    '18"': { nps: '18"', sizeCode: '1800', od: 24.000, boltCircle: 25.750, boltSize: 1.625, boltHoles: 20, nominalThickness: 1.875, thicknessFraction: '1-7/8"', handleLength: 16.0, handleWidth: 2.75 },
    '20"': { nps: '20"', sizeCode: '2000', od: 26.750, boltCircle: 28.500, boltSize: 1.625, boltHoles: 24, nominalThickness: 2.125, thicknessFraction: '2-1/8"', handleLength: 17.0, handleWidth: 2.75 },
    '24"': { nps: '24"', sizeCode: '2400', od: 31.000, boltCircle: 33.000, boltSize: 1.875, boltHoles: 24, nominalThickness: 2.250, thicknessFraction: '2-1/4"', handleLength: 18.5, handleWidth: 3.0 }
  },
  '900#': {
    '1/2"': { nps: '1/2"', sizeCode: '0050', od: 2.375, boltCircle: 3.250, boltSize: 0.750, boltHoles: 4, nominalThickness: 0.250, thicknessFraction: '1/4"', handleLength: 4.5, handleWidth: 1.0 },
    '3/4"': { nps: '3/4"', sizeCode: '0075', od: 2.625, boltCircle: 3.500, boltSize: 0.750, boltHoles: 4, nominalThickness: 0.250, thicknessFraction: '1/4"', handleLength: 4.75, handleWidth: 1.0 },
    '1"': { nps: '1"', sizeCode: '0100', od: 3.000, boltCircle: 4.000, boltSize: 0.875, boltHoles: 4, nominalThickness: 0.250, thicknessFraction: '1/4"', handleLength: 5.0, handleWidth: 1.25 },
    '1-1/4"': { nps: '1-1/4"', sizeCode: '0125', od: 3.375, boltCircle: 4.380, boltSize: 0.875, boltHoles: 4, nominalThickness: 0.3125, thicknessFraction: '5/16"', handleLength: 5.25, handleWidth: 1.25 },
    '1-1/2"': { nps: '1-1/2"', sizeCode: '0150', od: 3.750, boltCircle: 4.880, boltSize: 1.000, boltHoles: 4, nominalThickness: 0.375, thicknessFraction: '3/8"', handleLength: 5.5, handleWidth: 1.25 },
    '2"': { nps: '2"', sizeCode: '0200', od: 5.500, boltCircle: 6.500, boltSize: 0.875, boltHoles: 8, nominalThickness: 0.375, thicknessFraction: '3/8"', handleLength: 6.5, handleWidth: 1.5 },
    '2-1/2"': { nps: '2-1/2"', sizeCode: '0250', od: 6.375, boltCircle: 7.500, boltSize: 1.000, boltHoles: 8, nominalThickness: 0.500, thicknessFraction: '1/2"', handleLength: 7.0, handleWidth: 1.5 },
    '3"': { nps: '3"', sizeCode: '0300', od: 6.500, boltCircle: 7.500, boltSize: 0.875, boltHoles: 8, nominalThickness: 0.500, thicknessFraction: '1/2"', handleLength: 7.5, handleWidth: 1.5 },
    '4"': { nps: '4"', sizeCode: '0400', od: 8.000, boltCircle: 9.250, boltSize: 1.125, boltHoles: 8, nominalThickness: 0.625, thicknessFraction: '5/8"', handleLength: 8.5, handleWidth: 1.75 },
    '6"': { nps: '6"', sizeCode: '0600', od: 11.250, boltCircle: 12.500, boltSize: 1.125, boltHoles: 12, nominalThickness: 0.875, thicknessFraction: '7/8"', handleLength: 10.0, handleWidth: 2.0 },
    '8"': { nps: '8"', sizeCode: '0800', od: 14.000, boltCircle: 15.500, boltSize: 1.375, boltHoles: 12, nominalThickness: 1.250, thicknessFraction: '1-1/4"', handleLength: 11.5, handleWidth: 2.25 },
    '10"': { nps: '10"', sizeCode: '1000', od: 17.000, boltCircle: 18.500, boltSize: 1.375, boltHoles: 16, nominalThickness: 1.500, thicknessFraction: '1-1/2"', handleLength: 13.0, handleWidth: 2.5 },
    '12"': { nps: '12"', sizeCode: '1200', od: 19.500, boltCircle: 21.000, boltSize: 1.375, boltHoles: 20, nominalThickness: 1.750, thicknessFraction: '1-3/4"', handleLength: 14.5, handleWidth: 2.5 },
    '14"': { nps: '14"', sizeCode: '1400', od: 20.375, boltCircle: 22.000, boltSize: 1.500, boltHoles: 20, nominalThickness: 1.875, thicknessFraction: '1-7/8"', handleLength: 15.5, handleWidth: 2.75 },
    '16"': { nps: '16"', sizeCode: '1600', od: 22.500, boltCircle: 24.250, boltSize: 1.625, boltHoles: 20, nominalThickness: 2.125, thicknessFraction: '2-1/8"', handleLength: 16.5, handleWidth: 2.75 },
    '18"': { nps: '18"', sizeCode: '1800', od: 25.000, boltCircle: 27.000, boltSize: 1.875, boltHoles: 20, nominalThickness: 2.375, thicknessFraction: '2-3/8"', handleLength: 18.0, handleWidth: 3.0 },
    '20"': { nps: '20"', sizeCode: '2000', od: 27.375, boltCircle: 29.500, boltSize: 2.000, boltHoles: 20, nominalThickness: 2.500, thicknessFraction: '2-1/2"', handleLength: 19.0, handleWidth: 3.0 },
    '24"': { nps: '24"', sizeCode: '2400', od: 32.875, boltCircle: 35.500, boltSize: 2.500, boltHoles: 20, nominalThickness: 2.500, thicknessFraction: '2-1/2"', handleLength: 21.0, handleWidth: 3.5 }
  },
  '1500#': {
    '1/2"': { nps: '1/2"', sizeCode: '0050', od: 2.375, boltCircle: 3.250, boltSize: 0.750, boltHoles: 4, nominalThickness: 0.250, thicknessFraction: '1/4"', handleLength: 4.5, handleWidth: 1.0 },
    '3/4"': { nps: '3/4"', sizeCode: '0075', od: 2.625, boltCircle: 3.500, boltSize: 0.750, boltHoles: 4, nominalThickness: 0.250, thicknessFraction: '1/4"', handleLength: 4.75, handleWidth: 1.0 },
    '1"': { nps: '1"', sizeCode: '0100', od: 3.000, boltCircle: 4.000, boltSize: 0.875, boltHoles: 4, nominalThickness: 0.250, thicknessFraction: '1/4"', handleLength: 5.0, handleWidth: 1.25 },
    '1-1/4"': { nps: '1-1/4"', sizeCode: '0125', od: 3.375, boltCircle: 4.380, boltSize: 0.875, boltHoles: 4, nominalThickness: 0.375, thicknessFraction: '3/8"', handleLength: 5.25, handleWidth: 1.25 },
    '1-1/2"': { nps: '1-1/2"', sizeCode: '0150', od: 3.750, boltCircle: 4.880, boltSize: 1.000, boltHoles: 4, nominalThickness: 0.375, thicknessFraction: '3/8"', handleLength: 5.5, handleWidth: 1.25 },
    '2"': { nps: '2"', sizeCode: '0200', od: 5.500, boltCircle: 6.500, boltSize: 0.875, boltHoles: 8, nominalThickness: 0.500, thicknessFraction: '1/2"', handleLength: 6.5, handleWidth: 1.5 },
    '2-1/2"': { nps: '2-1/2"', sizeCode: '0250', od: 6.375, boltCircle: 7.500, boltSize: 1.000, boltHoles: 8, nominalThickness: 0.625, thicknessFraction: '5/8"', handleLength: 7.0, handleWidth: 1.5 },
    '3"': { nps: '3"', sizeCode: '0300', od: 6.750, boltCircle: 8.000, boltSize: 1.125, boltHoles: 8, nominalThickness: 0.750, thicknessFraction: '3/4"', handleLength: 7.5, handleWidth: 1.75 },
    '4"': { nps: '4"', sizeCode: '0400', od: 8.125, boltCircle: 9.500, boltSize: 1.250, boltHoles: 8, nominalThickness: 0.875, thicknessFraction: '7/8"', handleLength: 9.0, handleWidth: 2.0 },
    '6"': { nps: '6"', sizeCode: '0600', od: 11.000, boltCircle: 12.500, boltSize: 1.375, boltHoles: 12, nominalThickness: 1.375, thicknessFraction: '1-3/8"', handleLength: 11.0, handleWidth: 2.25 },
    '8"': { nps: '8"', sizeCode: '0800', od: 13.750, boltCircle: 15.500, boltSize: 1.625, boltHoles: 12, nominalThickness: 1.750, thicknessFraction: '1-3/4"', handleLength: 12.5, handleWidth: 2.5 },
    '10"': { nps: '10"', sizeCode: '1000', od: 17.000, boltCircle: 19.000, boltSize: 1.875, boltHoles: 12, nominalThickness: 2.125, thicknessFraction: '2-1/8"', handleLength: 14.5, handleWidth: 2.75 },
    '12"': { nps: '12"', sizeCode: '1200', od: 20.375, boltCircle: 22.500, boltSize: 2.000, boltHoles: 16, nominalThickness: 2.500, thicknessFraction: '2-1/2"', handleLength: 16.0, handleWidth: 3.0 },
    '14"': { nps: '14"', sizeCode: '1400', od: 22.625, boltCircle: 25.000, boltSize: 2.250, boltHoles: 16, nominalThickness: 2.750, thicknessFraction: '2-3/4"', handleLength: 17.5, handleWidth: 3.0 },
    '16"': { nps: '16"', sizeCode: '1600', od: 25.125, boltCircle: 27.750, boltSize: 2.500, boltHoles: 16, nominalThickness: 3.000, thicknessFraction: '3"', handleLength: 19.0, handleWidth: 3.5 },
    '18"': { nps: '18"', sizeCode: '1800', od: 27.625, boltCircle: 30.500, boltSize: 2.750, boltHoles: 16, nominalThickness: 3.250, thicknessFraction: '3-1/4"', handleLength: 20.5, handleWidth: 3.5 },
    '20"': { nps: '20"', sizeCode: '2000', od: 29.625, boltCircle: 32.750, boltSize: 3.000, boltHoles: 16, nominalThickness: 3.500, thicknessFraction: '3-1/2"', handleLength: 22.0, handleWidth: 4.0 },
    '24"': { nps: '24"', sizeCode: '2400', od: 35.375, boltCircle: 39.000, boltSize: 3.500, boltHoles: 16, nominalThickness: 3.500, thicknessFraction: '3-1/2"', handleLength: 25.0, handleWidth: 4.0 }
  }
};

export function getLaborHours(nps: NPSSize): number {
  const inches = parseNpsToInches(nps);
  if (inches <= 10.0) return 0.35;
  if (inches === 12.0) return 0.38;
  if (inches === 14.0) return 0.42;
  if (inches === 16.0) return 0.47;
  if (inches === 18.0) return 0.52;
  if (inches === 20.0) return 0.56;
  return 0.61; // 24"
}

// Calculate finished weight of a single paddle blind in lbs
export function calculateFinishedWeight(
  dims: FlangeDimension,
  material: MaterialId
): number {
  const mat = MATERIALS[material];
  // Disc area: pi * (OD/2)^2
  const discArea = Math.PI * Math.pow(dims.od / 2, 2);
  // Handle area: handleWidth * handleLength
  const handleArea = dims.handleWidth * dims.handleLength;
  const totalVolumeCuIn = (discArea + handleArea) * dims.nominalThickness;
  const weight = totalVolumeCuIn * mat.densityLbPerCuIn;
  return Math.round(weight * 100) / 100;
}

// Generate SKU: IPF-PB-[CLASS]-[SIZE_CODE]-[MATERIAL_CODE]-[FACING_CODE]
export function generateSku(
  pressureClass: PressureClass,
  nps: NPSSize,
  material: MaterialId,
  facing: FacingType
): string {
  const cleanClass = pressureClass.replace('#', '');
  const sizeCode = getSizeCode(nps);
  return `IPF-PB-${cleanClass}-${sizeCode}-${material}-${facing}`;
}

// Complete JobTrax Configurator Calculation Engine
export function calculateBlindConfig(params: {
  nps: NPSSize;
  pressureClass: PressureClass;
  material: MaterialId;
  facing: FacingType;
  handleStamping: string;
  includeMTR: boolean;
  addOns: {
    tHandle?: boolean;
    lockoutHole?: boolean;
    liftingLug?: boolean;
    plateDogs?: boolean;
    fitUpWedges?: boolean;
  };
  quantity: number;
  blindType?: 'Paddle Blind' | 'Figure 8 (Spectacle Blind)' | 'Paddle Spacer' | 'Bleeder Blind';
}): ConfiguredBlind {
  const { nps, pressureClass, material, facing, handleStamping, includeMTR, addOns, quantity, blindType } = params;
  const isFigure8 = blindType === 'Figure 8 (Spectacle Blind)';
  const geometryMultiplier = isFigure8 ? 2.0 : 1.0;
  const dimensions = ASME_B16_48_DIMENSIONS[pressureClass]?.[nps] || ASME_B16_48_DIMENSIONS['150#']['4"'];
  const mat = MATERIALS[material];

  const finishedWeightPerUnit = Math.round(calculateFinishedWeight(dimensions, material) * geometryMultiplier * 100) / 100;
  const adjustedWeightPerUnit = Math.round(finishedWeightPerUnit * SKELETON_SCRAP_FACTOR * 100) / 100;

  const laborHoursPerUnit = getLaborHours(nps) * geometryMultiplier;
  const laborCostPerUnit = Math.round(laborHoursPerUnit * LABOR_RATE_PER_HOUR * 100) / 100;
  const materialCostPerUnit = Math.round(adjustedWeightPerUnit * mat.ratePerLb * 100) / 100;

  // Base Unit Price = (Adjusted Weight * Material Rate) + (Labor Hours * $83.85) + $5.00 Base Handling
  const basePricePerUnit = Math.round((materialCostPerUnit + laborCostPerUnit + (BASE_HANDLING_FEE * geometryMultiplier)) * 100) / 100;

  // Add-ons total
  let addOnsTotalPerUnit = 0;
  let addOnsWeightPerUnit = 0;
  if (addOns?.tHandle) {
    addOnsTotalPerUnit += 5.00;
    addOnsWeightPerUnit += 0.5;
  }
  if (addOns?.lockoutHole) {
    addOnsTotalPerUnit += 5.00;
    addOnsWeightPerUnit += 0.0;
  }
  if (addOns?.liftingLug) {
    addOnsTotalPerUnit += 34.00;
    addOnsWeightPerUnit += 2.2;
  }
  if (addOns?.plateDogs) {
    addOnsTotalPerUnit += 35.00;
    addOnsWeightPerUnit += 3.5;
  }
  if (addOns?.fitUpWedges) {
    addOnsTotalPerUnit += 34.00;
    addOnsWeightPerUnit += 2.0;
  }

  const unitPrice = Math.round((basePricePerUnit + addOnsTotalPerUnit) * 100) / 100;
  const lineTotal = Math.round(unitPrice * quantity * 100) / 100;
  const totalFinishedWeight = Math.round((finishedWeightPerUnit + addOnsWeightPerUnit) * quantity * 100) / 100;
  const sku = generateSku(pressureClass, nps, material, facing);

  return {
    id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    nps,
    pressureClass,
    material,
    facing,
    handleStamping: handleStamping || `IPF-${cleanNps(nps)}-${pressureClass}`,
    includeMTR,
    addOns,
    quantity,
    dimensions,
    finishedWeightPerUnit,
    adjustedWeightPerUnit,
    laborHoursPerUnit,
    laborCostPerUnit,
    materialCostPerUnit,
    basePricePerUnit,
    addOnsTotalPerUnit,
    unitPrice,
    lineTotal,
    totalFinishedWeight,
    sku
  };
}

export function cleanNps(nps: string): string {
  return nps.replace(/["\/]/g, '-');
}

// Shipping estimation formula
export function calculateShipping(items: ConfiguredBlind[]): {
  method: 'UPS Ground' | 'LTL Freight';
  cost: number;
  totalWeightLbs: number;
  carrierNote: string;
  isLTL: boolean;
} {
  const totalWeightLbs = items.reduce((sum, item) => sum + item.totalFinishedWeight, 0);
  const hasLargeItem = items.some((item) => parseNpsToInches(item.nps) >= 14.0);

  if (totalWeightLbs >= 150 || hasLargeItem) {
    return {
      method: 'LTL Freight',
      cost: 245.00,
      totalWeightLbs: Math.round(totalWeightLbs * 10) / 10,
      carrierNote: hasLargeItem
        ? 'Palletized Heavy Freight (Required for NPS ≥ 14" diameter)'
        : 'Palletized LTL Freight Carrier (Shipment ≥ 150 lbs)',
      isLTL: true
    };
  }

  // UPS Ground ($12 base + $1.45/lb)
  const upsCost = Math.round((12.00 + totalWeightLbs * 1.45) * 100) / 100;
  return {
    method: 'UPS Ground',
    cost: items.length > 0 ? upsCost : 0,
    totalWeightLbs: Math.round(totalWeightLbs * 10) / 10,
    carrierNote: 'Standard Direct Parcel Courier (Boxed & Foam Wrapped)',
    isLTL: false
  };
}

// Amazon Flat-File Feed row generator
export function generateAmazonFlatFileRows(items: ConfiguredBlind[]): AmazonFeedRow[] {
  return items.map((item) => {
    const mat = MATERIALS[item.material];
    return {
      feed_product_type: 'industrial_pipe_fitting',
      item_sku: item.sku,
      brand_name: 'Iron Prairie Fabrication',
      item_name: `Iron Prairie ${item.nps} ASME B16.48 Paddle Blind ${item.pressureClass} ${mat.astmSpec} ${item.facing}`,
      item_type: 'pipe-flange-blinds',
      manufacturer: 'Iron Prairie Fabrication Group LLC',
      standard_price: item.unitPrice,
      quantity: 50,
      bullet_point1: `Precision CNC Plasma Cut from heavy plate compliant with ASME B16.48 standards.`,
      bullet_point2: `Material: ${mat.name} (${mat.astmSpec}) with mill test traceability.`,
      bullet_point3: `Dimensions: ${item.dimensions.od}" OD, ${item.dimensions.nominalThickness}" Nominal Thickness (${item.dimensions.thicknessFraction}).`,
      bullet_point4: `Full handle stamping: Size, Class, Material Grade, and Mill Heat Number.`,
      bullet_point5: `Proudly manufactured in Texas, USA by certified woman-owned Iron Prairie Fabrication Group.`,
      material_type: mat.category,
      outer_diameter: `${item.dimensions.od} inches`,
      thickness: item.dimensions.thicknessFraction,
      pressure_rating: item.pressureClass,
      item_weight: item.finishedWeightPerUnit,
      item_weight_unit_of_measure: 'pounds',
      compliance_certification: item.includeMTR ? 'ASME B16.48 / MTR EN 10204 3.1' : 'Commercial Hydrotest Spec',
      country_of_origin: 'US'
    };
  });
}

export function formatFlatFileContent(rows: AmazonFeedRow[], format: 'tsv' | 'csv' = 'tsv'): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]) as (keyof AmazonFeedRow)[];
  const delimiter = format === 'tsv' ? '\t' : ',';

  const headerLine = headers.join(delimiter);
  const dataLines = rows.map((row) =>
    headers
      .map((header) => {
        const val = row[header];
        if (typeof val === 'string') {
          if (format === 'csv' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        }
        return val;
      })
      .join(delimiter)
  );

  return [headerLine, ...dataLines].join('\n');
}

// Initial Mock Seed Data (4 realistic Gulf Coast Industrial Orders)
export const INITIAL_SHOP_JOBS: ShopJob[] = [
  {
    id: 'job-dow-8849',
    poNumber: 'PO-2026-8849',
    customerName: 'Dow Chemical (Texas Site)',
    buyerEmail: 'procurement@dow.com',
    deliveryAddress: 'Plant Gate 4 Receiving, TX 77531',
    orderDate: '2026-08-19',
    scheduledShipDate: '2026-08-21',
    status: 'queued',
    millHeatNumber: 'A516-HEAT-8821',
    heatCertNumber: 'MTR-TX-99042',
    carrier: 'UPS Ground',
    totalWeightLbs: 32.8,
    totalAmount: 248.50,
    mtrRequired: true,
    mtrDocumentUrl: 'https://ironprairiefabrication.com/mtr/MTR-TX-99042.pdf',
    notes: 'Urgent turnaround turnaround unit 4 shutdown. Tag: UNIT-4-ISO-01',
    items: [
      calculateBlindConfig({
        nps: '4"',
        pressureClass: '150#',
        material: 'A516',
        facing: 'RF',
        handleStamping: 'DOW-UNIT-4-ISO-01',
        includeMTR: true,
        addOns: { tHandle: false, liftingLug: false, plateDogs: false, fitUpWedges: false },
        quantity: 4
      })
    ]
  },
  {
    id: 'job-turner-amz-112',
    poNumber: 'AMZ-112-9849201',
    customerName: 'Turner Industries',
    buyerEmail: 'turner-mro@turner-industries.com',
    deliveryAddress: '4000 TX-332, Clute, TX 77531',
    orderDate: '2026-08-18',
    scheduledShipDate: '2026-08-20',
    status: 'laser',
    millHeatNumber: 'K49201-B',
    heatCertNumber: 'MTR-SS-304L-771',
    carrier: 'UPS Ground',
    totalWeightLbs: 35.6,
    totalAmount: 384.20,
    mtrRequired: true,
    mtrDocumentUrl: 'https://ironprairiefabrication.com/mtr/MTR-SS-304L-771.pdf',
    notes: '304L SS clean acid line isolation. Stamped with K49201-B.',
    items: [
      calculateBlindConfig({
        nps: '6"',
        pressureClass: '300#',
        material: '304L',
        facing: 'RF',
        handleStamping: 'TURNER-ISO-06',
        includeMTR: true,
        addOns: { tHandle: false, liftingLug: false, plateDogs: false, fitUpWedges: false },
        quantity: 2
      })
    ]
  },
  {
    id: 'job-basf-8852',
    poNumber: 'PO-2026-8852',
    customerName: 'BASF Texas Verbund',
    buyerEmail: 'orders.texas@basf.com',
    deliveryAddress: '602 Copper Rd, Plant Gate 2, TX 77531',
    orderDate: '2026-08-17',
    scheduledShipDate: '2026-08-22',
    status: 'deburred',
    millHeatNumber: 'A516-9930',
    heatCertNumber: '',
    carrier: 'UPS Ground',
    totalWeightLbs: 28.4,
    totalAmount: 188.75,
    mtrRequired: false,
    notes: 'Commercial utility hydrotest blind only - no MTR packet required.',
    items: [
      calculateBlindConfig({
        nps: '8"',
        pressureClass: '150#',
        material: 'A516',
        facing: 'FF',
        handleStamping: 'BASF-HYDRO-8',
        includeMTR: false,
        addOns: { tHandle: false, liftingLug: false, plateDogs: false, fitUpWedges: false },
        quantity: 1
      })
    ]
  },
  {
    id: 'job-olin-8840',
    poNumber: 'PO-2026-8840',
    customerName: 'Olin Chlor-Alkali',
    buyerEmail: 'mro.receiving@olin.com',
    deliveryAddress: 'Brazos River Works, TX 77531',
    orderDate: '2026-08-16',
    scheduledShipDate: '2026-08-20',
    status: 'ready',
    millHeatNumber: 'M7782-A',
    heatCertNumber: 'MTR-CS-44819',
    carrier: 'UPS Ground',
    carrierTracking: '1Z9999999999999999',
    totalWeightLbs: 38.0,
    totalAmount: 512.50,
    mtrRequired: true,
    mtrDocumentUrl: 'https://ironprairiefabrication.com/mtr/MTR-CS-44819.pdf',
    notes: 'Equipped with custom welded T-Handles for technician glove clearance.',
    items: [
      calculateBlindConfig({
        nps: '2"',
        pressureClass: '150#',
        material: 'A516',
        facing: 'RF',
        handleStamping: 'OLIN-CHLOR-2',
        includeMTR: true,
        addOns: { tHandle: true, liftingLug: false, plateDogs: false, fitUpWedges: false },
        quantity: 10
      })
    ]
  }
];
