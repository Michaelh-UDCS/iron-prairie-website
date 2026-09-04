import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function writeSrc(relPath, content) {
  const fullPath = path.join(rootDir, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log('✓ Created ' + relPath);
}

// ============================================================================
// 1. src/data/masterGeometry.ts
// ============================================================================
const masterGeometryContent = `// src/data/masterGeometry.ts
// Master ASME B16.48 Dimensional Specifications, Material Densities & Pricing Engine

import {
  PressureClass,
  MaterialCode,
  FacingType,
  PricingConfig,
  MaterialConfig,
  ThicknessOption,
  FlangeSpec
} from '../types';

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  globalMarkupPct: 0,
  sa36PricePerLb: 1.87,
  sa516PricePerLb: 2.18,
  ss304PricePerLb: 5.55,
  ss304LPricePerLb: 6.01,
  ss316LPricePerLb: 7.48,
  alPricePerLb: 5.10,
  laborRatePerHour: 83.85,
  baseHandlingFee: 5.00,
  scrapMultiplier: 1.40,
  hotShotEmergencyFee: 250.00,
  laserGasRatePerInch: 0.08,
};

export const ACCESSORY_PRICES = {
  tHandlePrice: 5.75,
  liftingLugPrice: 34.00,
  plateDogPrice: 35.00,
  fitUpWedgePrice: 34.00,
};

export const MATERIALS: Record<MaterialCode, MaterialConfig> = {
  'SA-36': {
    code: 'SA-36',
    category: 'Carbon Steel',
    name: 'Carbon Steel SA-36 (Structural Plate)',
    shortSpec: 'ASME SA-36 / ASTM A36',
    density1InchSqFt: 40.84,
    densityLbPerCuIn: 0.28361,
    defaultPricePerLb: 1.87,
    badge: 'Utility / Line Testing',
    colorHex: '#475569',
  },
  'SA-516-70': {
    code: 'SA-516-70',
    category: 'Carbon Steel',
    name: 'Carbon Steel SA-516 Gr. 70 (PVQ Pressure Vessel)',
    shortSpec: 'ASME SA-516 Gr. 70 (PVQ Boiler)',
    density1InchSqFt: 40.84,
    densityLbPerCuIn: 0.28361,
    defaultPricePerLb: 2.18,
    badge: 'Standard Refinery Spec',
    colorHex: '#334155',
  },
  '304': {
    code: '304',
    category: 'Stainless Steel',
    name: 'Stainless Steel 304 (Commercial Grade)',
    shortSpec: 'ASTM A240 304 Commercial',
    density1InchSqFt: 42.665,
    densityLbPerCuIn: 0.290,
    defaultPricePerLb: 5.55,
    badge: 'Commercial SS',
    colorHex: '#94a3b8',
  },
  '304L': {
    code: '304L',
    category: 'Stainless Steel',
    name: 'Stainless Steel 304/304L (Dual-Certified Low Carbon)',
    shortSpec: 'ASTM A240 304/304L Dual-Cert',
    density1InchSqFt: 42.665,
    densityLbPerCuIn: 0.290,
    defaultPricePerLb: 6.01,
    badge: 'Dual Certified SS',
    colorHex: '#cbd5e1',
  },
  '316L': {
    code: '316L',
    category: 'Stainless Steel',
    name: 'Stainless Steel 316L (Acid & Marine Refinery Grade)',
    shortSpec: 'ASTM A240 316L Moly Acid Grade',
    density1InchSqFt: 43.15,
    densityLbPerCuIn: 0.290,
    defaultPricePerLb: 7.48,
    badge: 'Chemical / Marine SS',
    colorHex: '#e2e8f0',
  },
  'AL-6061': {
    code: 'AL-6061',
    category: 'Aluminum',
    name: 'Aluminum 6061-T6 (Structural Industrial Plate)',
    shortSpec: 'ASTM B209 6061-T6 High Strength',
    density1InchSqFt: 14.39,
    densityLbPerCuIn: 0.098,
    defaultPricePerLb: 5.10,
    badge: 'Lightweight Industrial',
    colorHex: '#f1f5f9',
  },
};

export const THICKNESS_OPTIONS: ThicknessOption[] = [
  { label: '12 Gauge', thickness: 0.1046, fractionLabel: '12 Ga (0.105")', isDefault: true, description: 'Standard Turnaround Utility Isolation Blind (Default)' },
  { label: '1/8"', thickness: 0.125, fractionLabel: '1/8" (0.125")', description: '11/10 Gauge Equiv' },
  { label: '3/16"', thickness: 0.1875, fractionLabel: '3/16" (0.188")', description: 'Medium Duty Isolation' },
  { label: '1/4"', thickness: 0.250, fractionLabel: '1/4" (0.250")', description: 'Solid Structural Plate' },
  { label: '5/16"', thickness: 0.3125, fractionLabel: '5/16" (0.313")', description: 'High Pressure Rating' },
  { label: '3/8"', thickness: 0.375, fractionLabel: '3/8" (0.375")', description: 'Heavy Industrial Plate' },
  { label: '1/2"', thickness: 0.500, fractionLabel: '1/2" (0.500")', description: 'ASME Heavy Wall' },
  { label: '5/8"', thickness: 0.625, fractionLabel: '5/8" (0.625")', description: 'High Pressure Line Blind' },
  { label: '3/4"', thickness: 0.750, fractionLabel: '3/4" (0.750")', description: 'Severe Service Flange' },
  { label: '7/8"', thickness: 0.875, fractionLabel: '7/8" (0.875")', description: 'Heavy Wall Flange Blind' },
  { label: '1"', thickness: 1.000, fractionLabel: '1" (1.000")', description: 'Solid 1-Inch Block Plate' },
  { label: '1-1/8"', thickness: 1.125, fractionLabel: '1-1/8" (1.125")', description: 'Extreme High Class' },
  { label: '1-1/4"', thickness: 1.250, fractionLabel: '1-1/4" (1.250")', description: 'Severe Service Heavy Plate' },
  { label: '1-3/8"', thickness: 1.375, fractionLabel: '1-3/8" (1.375")', description: 'Massive Heavy Block' },
  { label: '1-1/2"', thickness: 1.500, fractionLabel: '1-1/2" (1.500")', description: 'Critical Flange Isolation' },
  { label: '1-5/8"', thickness: 1.625, fractionLabel: '1-5/8" (1.625")', description: 'Critical Block Flange' },
  { label: '1-3/4"', thickness: 1.750, fractionLabel: '1-3/4" (1.750")', description: 'High Class Critical Plate' },
  { label: '1-7/8"', thickness: 1.875, fractionLabel: '1-7/8" (1.875")', description: 'Extreme Heavy Industrial' },
  { label: '2"', thickness: 2.000, fractionLabel: '2" (2.000")', description: 'Maximum Rating Massive Plate' },
  { label: '2-1/4"', thickness: 2.250, fractionLabel: '2-1/4" (2.250")', description: 'Special Heavy Rating' },
  { label: '2-1/2"', thickness: 2.500, fractionLabel: '2-1/2" (2.500")', description: 'Special Heavy Massive Plate' },
  { label: '3"', thickness: 3.000, fractionLabel: '3" (3.000")', description: 'Maximum Flange Isolation Block' },
];

export const NPS_SIZES = [
  '1/2"', '3/4"', '1"', '1-1/4"', '1-1/2"', '2"', '2-1/2"', '3"', '4"',
  '6"', '8"', '10"', '12"', '14"', '16"', '18"', '20"', '24"'
];

export const MASTER_GEOMETRY: Record<PressureClass, Record<string, FlangeSpec>> = {
  150: {
    '1/2"':   { od: 1.755, boltCircle: 2.380, boltSize: 0.500, nominalThickness: 0.125, thicknessLabel: '1/8"' },
    '3/4"':   { od: 2.125, boltCircle: 2.750, boltSize: 0.500, nominalThickness: 0.125, thicknessLabel: '1/8"' },
    '1"':     { od: 2.495, boltCircle: 3.120, boltSize: 0.500, nominalThickness: 0.125, thicknessLabel: '1/8"' },
    '1-1/4"': { od: 2.875, boltCircle: 3.500, boltSize: 0.500, nominalThickness: 0.125, thicknessLabel: '1/8"' },
    '1-1/2"': { od: 3.255, boltCircle: 3.880, boltSize: 0.500, nominalThickness: 0.125, thicknessLabel: '1/8"' },
    '2"':     { od: 4.000, boltCircle: 4.750, boltSize: 0.625, nominalThickness: 0.125, thicknessLabel: '1/8"' },
    '2-1/2"': { od: 4.750, boltCircle: 5.500, boltSize: 0.625, nominalThickness: 0.125, thicknessLabel: '1/8"' },
    '3"':     { od: 5.250, boltCircle: 6.000, boltSize: 0.625, nominalThickness: 0.188, thicknessLabel: '3/16"' },
    '4"':     { od: 6.750, boltCircle: 7.500, boltSize: 0.625, nominalThickness: 0.250, thicknessLabel: '1/4"' },
    '6"':     { od: 8.625, boltCircle: 9.500, boltSize: 0.750, nominalThickness: 0.250, thicknessLabel: '1/4"' },
    '8"':     { od: 10.875, boltCircle: 11.750, boltSize: 0.750, nominalThickness: 0.375, thicknessLabel: '3/8"' },
    '10"':    { od: 13.250, boltCircle: 14.250, boltSize: 0.875, nominalThickness: 0.375, thicknessLabel: '3/8"' },
    '12"':    { od: 16.000, boltCircle: 17.000, boltSize: 0.875, nominalThickness: 0.500, thicknessLabel: '1/2"' },
    '14"':    { od: 17.625, boltCircle: 18.750, boltSize: 1.000, nominalThickness: 0.500, thicknessLabel: '1/2"' },
    '16"':    { od: 20.125, boltCircle: 21.250, boltSize: 1.000, nominalThickness: 0.625, thicknessLabel: '5/8"' },
    '18"':    { od: 21.500, boltCircle: 22.750, boltSize: 1.125, nominalThickness: 0.625, thicknessLabel: '5/8"' },
    '20"':    { od: 23.750, boltCircle: 25.000, boltSize: 1.125, nominalThickness: 0.750, thicknessLabel: '3/4"' },
    '24"':    { od: 28.125, boltCircle: 29.500, boltSize: 1.250, nominalThickness: 0.875, thicknessLabel: '7/8"' },
  },
  300: {
    '1/2"':   { od: 1.995, boltCircle: 2.620, boltSize: 0.500, nominalThickness: 0.125, thicknessLabel: '1/8"' },
    '3/4"':   { od: 2.500, boltCircle: 3.250, boltSize: 0.625, nominalThickness: 0.125, thicknessLabel: '1/8"' },
    '1"':     { od: 2.750, boltCircle: 3.500, boltSize: 0.625, nominalThickness: 0.125, thicknessLabel: '1/8"' },
    '1-1/4"': { od: 3.125, boltCircle: 3.880, boltSize: 0.625, nominalThickness: 0.125, thicknessLabel: '1/8"' },
    '1-1/2"': { od: 3.625, boltCircle: 4.500, boltSize: 0.750, nominalThickness: 0.250, thicknessLabel: '1/4"' },
    '2"':     { od: 4.250, boltCircle: 5.000, boltSize: 0.625, nominalThickness: 0.250, thicknessLabel: '1/4"' },
    '2-1/2"': { od: 5.005, boltCircle: 5.880, boltSize: 0.750, nominalThickness: 0.250, thicknessLabel: '1/4"' },
    '3"':     { od: 5.745, boltCircle: 6.620, boltSize: 0.750, nominalThickness: 0.250, thicknessLabel: '1/4"' },
    '4"':     { od: 7.005, boltCircle: 7.880, boltSize: 0.750, nominalThickness: 0.375, thicknessLabel: '3/8"' },
    '6"':     { od: 9.745, boltCircle: 10.620, boltSize: 0.750, nominalThickness: 0.500, thicknessLabel: '1/2"' },
    '8"':     { od: 12.000, boltCircle: 13.000, boltSize: 0.875, nominalThickness: 0.625, thicknessLabel: '5/8"' },
    '10"':    { od: 14.125, boltCircle: 15.250, boltSize: 1.000, nominalThickness: 0.750, thicknessLabel: '3/4"' },
    '12"':    { od: 16.500, boltCircle: 17.750, boltSize: 1.125, nominalThickness: 0.875, thicknessLabel: '7/8"' },
    '14"':    { od: 19.000, boltCircle: 20.250, boltSize: 1.125, nominalThickness: 1.000, thicknessLabel: '1"' },
    '16"':    { od: 21.125, boltCircle: 22.500, boltSize: 1.250, nominalThickness: 1.125, thicknessLabel: '1-1/8"' },
    '18"':    { od: 23.375, boltCircle: 24.750, boltSize: 1.250, nominalThickness: 1.250, thicknessLabel: '1-1/4"' },
    '20"':    { od: 25.625, boltCircle: 27.000, boltSize: 1.250, nominalThickness: 1.375, thicknessLabel: '1-3/8"' },
    '24"':    { od: 30.375, boltCircle: 32.000, boltSize: 1.500, nominalThickness: 1.625, thicknessLabel: '1-5/8"' },
  },
  600: {
    '1/2"':   { od: 1.995, boltCircle: 2.620, boltSize: 0.500, nominalThickness: 0.250, thicknessLabel: '1/4"' },
    '3/4"':   { od: 2.500, boltCircle: 3.250, boltSize: 0.625, nominalThickness: 0.250, thicknessLabel: '1/4"' },
    '1"':     { od: 2.750, boltCircle: 3.500, boltSize: 0.625, nominalThickness: 0.250, thicknessLabel: '1/4"' },
    '1-1/4"': { od: 3.125, boltCircle: 3.880, boltSize: 0.625, nominalThickness: 0.250, thicknessLabel: '1/4"' },
    '1-1/2"': { od: 3.625, boltCircle: 4.500, boltSize: 0.750, nominalThickness: 0.250, thicknessLabel: '1/4"' },
    '2"':     { od: 4.250, boltCircle: 5.000, boltSize: 0.625, nominalThickness: 0.375, thicknessLabel: '3/8"' },
    '2-1/2"': { od: 5.005, boltCircle: 5.880, boltSize: 0.750, nominalThickness: 0.375, thicknessLabel: '3/8"' },
    '3"':     { od: 5.745, boltCircle: 6.620, boltSize: 0.750, nominalThickness: 0.375, thicknessLabel: '3/8"' },
    '4"':     { od: 7.500, boltCircle: 8.500, boltSize: 0.875, nominalThickness: 0.500, thicknessLabel: '1/2"' },
    '6"':     { od: 10.375, boltCircle: 11.500, boltSize: 1.000, nominalThickness: 0.625, thicknessLabel: '5/8"' },
    '8"':     { od: 12.500, boltCircle: 13.750, boltSize: 1.125, nominalThickness: 0.875, thicknessLabel: '7/8"' },
    '10"':    { od: 15.625, boltCircle: 17.000, boltSize: 1.250, nominalThickness: 1.000, thicknessLabel: '1"' },
    '12"':    { od: 17.875, boltCircle: 19.250, boltSize: 1.250, nominalThickness: 1.250, thicknessLabel: '1-1/4"' },
    '14"':    { od: 19.250, boltCircle: 20.750, boltSize: 1.375, nominalThickness: 1.375, thicknessLabel: '1-3/8"' },
    '16"':    { od: 22.125, boltCircle: 23.750, boltSize: 1.500, nominalThickness: 1.500, thicknessLabel: '1-1/2"' },
    '18"':    { od: 24.000, boltCircle: 25.750, boltSize: 1.625, nominalThickness: 1.625, thicknessLabel: '1-5/8"' },
    '20"':    { od: 26.750, boltCircle: 28.500, boltSize: 1.625, nominalThickness: 1.875, thicknessLabel: '1-7/8"' },
    '24"':    { od: 31.000, boltCircle: 33.000, boltSize: 1.875, nominalThickness: 2.250, thicknessLabel: '2-1/4"' },
  },
  900: {
    '1/2"':   { od: 2.375, boltCircle: 3.250, boltSize: 0.750, nominalThickness: 0.250, thicknessLabel: '1/4"' },
    '3/4"':   { od: 2.625, boltCircle: 3.500, boltSize: 0.750, nominalThickness: 0.250, thicknessLabel: '1/4"' },
    '1"':     { od: 3.000, boltCircle: 4.000, boltSize: 0.875, nominalThickness: 0.250, thicknessLabel: '1/4"' },
    '1-1/4"': { od: 3.375, boltCircle: 4.380, boltSize: 0.875, nominalThickness: 0.250, thicknessLabel: '1/4"' },
    '1-1/2"': { od: 3.755, boltCircle: 4.880, boltSize: 1.000, nominalThickness: 0.375, thicknessLabel: '3/8"' },
    '2"':     { od: 5.500, boltCircle: 6.500, boltSize: 0.875, nominalThickness: 0.500, thicknessLabel: '1/2"' },
    '2-1/2"': { od: 6.375, boltCircle: 7.500, boltSize: 1.000, nominalThickness: 0.500, thicknessLabel: '1/2"' },
    '3"':     { od: 6.500, boltCircle: 7.500, boltSize: 0.875, nominalThickness: 0.500, thicknessLabel: '1/2"' },
    '4"':     { od: 8.000, boltCircle: 9.250, boltSize: 1.125, nominalThickness: 0.625, thicknessLabel: '5/8"' },
    '6"':     { od: 11.250, boltCircle: 12.500, boltSize: 1.125, nominalThickness: 0.875, thicknessLabel: '7/8"' },
    '8"':     { od: 14.000, boltCircle: 15.500, boltSize: 1.375, nominalThickness: 1.125, thicknessLabel: '1-1/8"' },
    '10"':    { od: 17.000, boltCircle: 18.500, boltSize: 1.375, nominalThickness: 1.375, thicknessLabel: '1-3/8"' },
    '12"':    { od: 19.500, boltCircle: 21.000, boltSize: 1.375, nominalThickness: 1.625, thicknessLabel: '1-5/8"' },
    '14"':    { od: 20.375, boltCircle: 22.000, boltSize: 1.500, nominalThickness: 1.750, thicknessLabel: '1-3/4"' },
    '16"':    { od: 22.500, boltCircle: 24.250, boltSize: 1.625, nominalThickness: 2.000, thicknessLabel: '2"' },
    '18"':    { od: 25.000, boltCircle: 27.000, boltSize: 1.875, nominalThickness: 2.250, thicknessLabel: '2-1/4"' },
    '20"':    { od: 27.375, boltCircle: 29.500, boltSize: 2.000, nominalThickness: 2.500, thicknessLabel: '2-1/2"' },
    '24"':    { od: 32.875, boltCircle: 35.500, boltSize: 2.500, nominalThickness: 2.875, thicknessLabel: '2-7/8"' },
  },
  1500: {
    '1/2"':   { od: 2.375, boltCircle: 3.250, boltSize: 0.750, nominalThickness: 0.250, thicknessLabel: '1/4"' },
    '3/4"':   { od: 2.625, boltCircle: 3.500, boltSize: 0.750, nominalThickness: 0.250, thicknessLabel: '1/4"' },
    '1"':     { od: 3.000, boltCircle: 4.000, boltSize: 0.875, nominalThickness: 0.250, thicknessLabel: '1/4"' },
    '1-1/4"': { od: 3.375, boltCircle: 4.380, boltSize: 0.875, nominalThickness: 0.250, thicknessLabel: '1/4"' },
    '1-1/2"': { od: 3.755, boltCircle: 4.880, boltSize: 1.000, nominalThickness: 0.375, thicknessLabel: '3/8"' },
    '2"':     { od: 5.500, boltCircle: 6.500, boltSize: 0.875, nominalThickness: 0.500, thicknessLabel: '1/2"' },
    '2-1/2"': { od: 6.375, boltCircle: 7.500, boltSize: 1.000, nominalThickness: 0.625, thicknessLabel: '5/8"' },
    '3"':     { od: 6.750, boltCircle: 8.000, boltSize: 1.125, nominalThickness: 0.750, thicknessLabel: '3/4"' },
    '4"':     { od: 8.125, boltCircle: 9.500, boltSize: 1.250, nominalThickness: 0.875, thicknessLabel: '7/8"' },
    '6"':     { od: 11.000, boltCircle: 12.500, boltSize: 1.375, nominalThickness: 1.375, thicknessLabel: '1-3/8"' },
    '8"':     { od: 13.750, boltCircle: 15.500, boltSize: 1.625, nominalThickness: 1.625, thicknessLabel: '1-5/8"' },
    '10"':    { od: 17.000, boltCircle: 19.000, boltSize: 1.875, nominalThickness: 2.000, thicknessLabel: '2"' },
    '12"':    { od: 20.375, boltCircle: 22.500, boltSize: 2.000, nominalThickness: 2.375, thicknessLabel: '2-3/8"' },
    '14"':    { od: 22.625, boltCircle: 25.000, boltSize: 2.250, nominalThickness: 2.625, thicknessLabel: '2-5/8"' },
    '16"':    { od: 25.125, boltCircle: 27.750, boltSize: 2.500, nominalThickness: 3.000, thicknessLabel: '3"' },
    '18"':    { od: 27.625, boltCircle: 30.500, boltSize: 2.750, nominalThickness: 3.250, thicknessLabel: '3-1/4"' },
    '20"':    { od: 29.625, boltCircle: 32.750, boltSize: 3.000, nominalThickness: 3.625, thicknessLabel: '3-5/8"' },
    '24"':    { od: 35.375, boltCircle: 39.000, boltSize: 3.500, nominalThickness: 4.250, thicknessLabel: '4-1/4"' },
  }
};

export const LABOR_HOURS: Record<string, number> = {
  '1/2"': 0.35, '3/4"': 0.35, '1"': 0.35, '1-1/4"': 0.35, '1-1/2"': 0.35,
  '2"': 0.35, '2-1/2"': 0.35, '3"': 0.35, '4"': 0.35, '6"': 0.35,
  '8"': 0.35, '10"': 0.35, '12"': 0.38, '14"': 0.42, '16"': 0.47,
  '18"': 0.52, '20"': 0.56, '24"': 0.61
};

export function calculateDynamicBlindPrice(
  pClass: PressureClass,
  nps: string,
  matCode: MaterialCode,
  thicknessVal: number,
  thicknessLabel: string,
  facing: FacingType,
  addTHadle: boolean,
  addLiftingLug: boolean,
  addPlateDog: boolean,
  addWedge: boolean,
  pricing: PricingConfig
) {
  const geom = MASTER_GEOMETRY[pClass]?.[nps] || MASTER_GEOMETRY[150]['4"'];
  const mat = MATERIALS[matCode] || MATERIALS['SA-516-70'];
  const laborHrs = LABOR_HOURS[nps] || 0.35;

  const handleWidth = Math.max(1.0, geom.od * 0.25);
  const handleLength = Math.max(3.5, geom.boltCircle - geom.od / 2 + 1.5);
  const totalAreaSqFt = ((Math.PI * Math.pow(geom.od / 2, 2)) + (handleWidth * handleLength)) / 144.0;

  const actualWt = Math.round(totalAreaSqFt * (mat.density1InchSqFt * thicknessVal) * 100) / 100;
  const adjustedWt = Math.round(actualWt * pricing.scrapMultiplier * 100) / 100;

  let activeMatPricePerLb = pricing.sa516PricePerLb;
  if (matCode === 'SA-36') activeMatPricePerLb = pricing.sa36PricePerLb;
  else if (matCode === 'SA-516-70') activeMatPricePerLb = pricing.sa516PricePerLb;
  else if (matCode === '304') activeMatPricePerLb = pricing.ss304PricePerLb;
  else if (matCode === '304L') activeMatPricePerLb = pricing.ss304LPricePerLb;
  else if (matCode === '316L') activeMatPricePerLb = pricing.ss316LPricePerLb;
  else if (matCode === 'AL-6061') activeMatPricePerLb = pricing.alPricePerLb;

  const matPrice = adjustedWt * activeMatPricePerLb;
  const laborPrice = laborHrs * pricing.laborRatePerHour;
  const facingAdder = facing === 'Machined Gasket Finish (Special Order)' ? 45.00 : 0;

  let extrasTotal = 0;
  if (addTHadle) extrasTotal += ACCESSORY_PRICES.tHandlePrice;
  if (addLiftingLug) extrasTotal += ACCESSORY_PRICES.liftingLugPrice;
  if (addPlateDog) extrasTotal += ACCESSORY_PRICES.plateDogPrice;
  if (addWedge) extrasTotal += ACCESSORY_PRICES.fitUpWedgePrice;

  const subtotalBeforeMarkup = matPrice + laborPrice + pricing.baseHandlingFee + facingAdder + extrasTotal;
  const markupMultiplier = 1 + (pricing.globalMarkupPct / 100);
  const unitTotal = Math.max(25, Math.ceil(subtotalBeforeMarkup * markupMultiplier));

  const classCode = pClass === 1500 ? 'C1500' : \`CX\${pClass}\`;
  const sizeCode = \`S\${nps.replace('"', '')}\`;
  const thkClean = thicknessLabel.replace(/["\\s()]/g, '').replace('Gauge', 'GA');
  const partNumber = \`PB\${matCode.replace('-', '')}-\${classCode}T\${thkClean}\${sizeCode}\`;

  return {
    partNumber,
    od: geom.od,
    boltCircle: geom.boltCircle,
    boltSize: geom.boltSize,
    thickness: thicknessVal,
    thicknessLabel: thicknessLabel,
    actualWeightLbs: Math.max(0.1, actualWt),
    adjustedWeightLbs: Math.max(0.15, adjustedWt),
    activeMatPricePerLb,
    unitPrice: unitTotal,
  };
}
`;

writeSrc('src/data/masterGeometry.ts', masterGeometryContent);

// ============================================================================
// 2. src/operations/data/mtrRepository.ts
// ============================================================================
const mtrRepositoryContent = `// src/operations/data/mtrRepository.ts
// Certified Material Test Report (CMTR) Repository for ASME Section VIII Div 1 (UG-77, UG-93, UG-94)
// & ASME B16.48 Paddle Blind Material Traceability

import { MaterialTestReport, MaterialCode } from '../../types';

export const INITIAL_MTR_DATABASE: MaterialTestReport[] = [
  {
    id: 'MTR-A516-70-K49201',
    heatNumber: 'K49201-B',
    slabNumber: 'SL-8849-01',
    certificateNumber: 'CMTR-NUC-2026-88492',
    asmeSpec: 'ASME SA-516 Gr. 70',
    astmSpec: 'ASTM A516/A516M-17 Gr. 70 (PVQ Boiler Plate)',
    materialCode: 'SA-516-70',
    materialGrade: 'Grade 70 Pressure Vessel Quality',
    heatTreatment: 'Normalized',
    plateThickness: 0.1046,
    thicknessLabel: '12 Gauge (0.105")',
    plateWidthInches: 96,
    plateLengthInches: 240,
    masterPlateWeightLbs: 686.1,
    steelMill: 'Nucor Steel Hertford County',
    millLocation: 'Cofield, NC, USA',
    supplierDistributor: 'Triple-S Steel Houston',
    countryOfMelt: 'USA',
    buyAmericanCompliant: true,
    chemistry: {
      carbon: 0.22,
      manganese: 1.15,
      phosphorus: 0.012,
      sulfur: 0.008,
      silicon: 0.28,
      chromium: 0.04,
      nickel: 0.03,
      molybdenum: 0.01,
      copper: 0.02,
      vanadium: 0.003,
      columbium: 0.002,
      aluminum: 0.032,
      nitrogen: 0.007,
      carbonEquivalent: 0.42, // CE = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15
    },
    mechanical: {
      tensileStrengthPsi: 74500,
      yieldStrengthPsi: 46200,
      elongationPct: 27.5,
      reductionOfAreaPct: 62.0,
      hardnessBrinell: 143,
      charpyVNotch: {
        temperatureF: -20,
        ftLbs: 68,
        orientation: 'Transverse',
      },
    },
    certifiedDate: '2026-05-14',
    qrCodePayload: 'https://ironprairiefabrication.com/mtr/K49201-B',
    permanentUrl: '/mtr/K49201-B',
    status: 'In Stock',
    initialAreaSqIn: 23040,
    remainingAreaSqIn: 18450,
    allocatedOrders: ['PO-2026-8849'],
    notes: 'Certified for low-temperature service (-20°F). Fully normalized fine grain practice.',
  },
  {
    id: 'MTR-A516-70-M7782',
    heatNumber: 'M7782-A',
    slabNumber: 'SL-9912-04',
    certificateNumber: 'CMTR-SSAB-2026-99120',
    asmeSpec: 'ASME SA-516 Gr. 70',
    astmSpec: 'ASTM A516/A516M-17 Gr. 70 (PVQ)',
    materialCode: 'SA-516-70',
    materialGrade: 'Grade 70 Normalized',
    heatTreatment: 'Normalized',
    plateThickness: 0.500,
    thicknessLabel: '1/2" (0.500")',
    plateWidthInches: 96,
    plateLengthInches: 240,
    masterPlateWeightLbs: 3270.0,
    steelMill: 'SSAB Americas (Montpelier Mill)',
    millLocation: 'Muscatine, IA, USA',
    supplierDistributor: 'Ryerson Houston',
    countryOfMelt: 'USA',
    buyAmericanCompliant: true,
    chemistry: {
      carbon: 0.24,
      manganese: 1.20,
      phosphorus: 0.014,
      sulfur: 0.006,
      silicon: 0.32,
      chromium: 0.05,
      nickel: 0.04,
      molybdenum: 0.02,
      copper: 0.03,
      vanadium: 0.004,
      columbium: 0.002,
      aluminum: 0.028,
      nitrogen: 0.008,
      carbonEquivalent: 0.45,
    },
    mechanical: {
      tensileStrengthPsi: 76800,
      yieldStrengthPsi: 48900,
      elongationPct: 26.0,
      reductionOfAreaPct: 58.5,
      hardnessBrinell: 152,
      charpyVNotch: {
        temperatureF: -50,
        ftLbs: 52,
        orientation: 'Transverse',
      },
    },
    certifiedDate: '2026-06-20',
    qrCodePayload: 'https://ironprairiefabrication.com/mtr/M7782-A',
    permanentUrl: '/mtr/M7782-A',
    status: 'In Stock',
    initialAreaSqIn: 23040,
    remainingAreaSqIn: 14200,
    allocatedOrders: ['PO-2026-8852', 'PO-2026-8840'],
    notes: 'Heavy plate certified for severe sour service & refinery distillation towers.',
  },
  {
    id: 'MTR-304L-OUT-8812',
    heatNumber: 'K304-88124',
    slabNumber: 'SL-OUT-8812-C',
    certificateNumber: 'CMTR-OUT-2026-304L',
    asmeSpec: 'ASME SA-240 304/304L',
    astmSpec: 'ASTM A240/A240M Dual Certified Low-Carbon',
    materialCode: '304L',
    materialGrade: 'Grade 304/304L Stainless Steel',
    heatTreatment: 'Solution Annealed',
    plateThickness: 0.500,
    thicknessLabel: '1/2" (0.500")',
    plateWidthInches: 96,
    plateLengthInches: 240,
    masterPlateWeightLbs: 3413.0,
    steelMill: 'Outokumpu Stainless USA LLC',
    millLocation: 'Calvert, AL, USA',
    supplierDistributor: 'Triple-S Steel Houston',
    countryOfMelt: 'USA',
    buyAmericanCompliant: true,
    chemistry: {
      carbon: 0.024,
      manganese: 1.65,
      phosphorus: 0.028,
      sulfur: 0.002,
      silicon: 0.45,
      chromium: 18.25,
      nickel: 8.12,
      molybdenum: 0.22,
      copper: 0.18,
      nitrogen: 0.065,
      carbonEquivalent: 0.38,
    },
    mechanical: {
      tensileStrengthPsi: 88500,
      yieldStrengthPsi: 41200,
      elongationPct: 54.0,
      hardnessBrinell: 165,
    },
    certifiedDate: '2026-04-10',
    qrCodePayload: 'https://ironprairiefabrication.com/mtr/K304-88124',
    permanentUrl: '/mtr/K304-88124',
    status: 'In Stock',
    initialAreaSqIn: 23040,
    remainingAreaSqIn: 20500,
    allocatedOrders: ['HOT-2026-9901'],
    notes: 'Dual certified 304/304L. Intergranular corrosion test ASTM A262 Practice E PASSED.',
  },
  {
    id: 'MTR-316L-OUT-9941',
    heatNumber: 'K316-99410',
    slabNumber: 'SL-OUT-9941-B',
    certificateNumber: 'CMTR-OUT-2026-316L-MOLY',
    asmeSpec: 'ASME SA-240 316/316L',
    astmSpec: 'ASTM A240/A240M Molybdenum Acid Grade',
    materialCode: '316L',
    materialGrade: 'Grade 316L Moly Stainless Steel',
    heatTreatment: 'Solution Annealed',
    plateThickness: 0.1046,
    thicknessLabel: '12 Gauge (0.105")',
    plateWidthInches: 96,
    plateLengthInches: 240,
    masterPlateWeightLbs: 725.0,
    steelMill: 'Outokumpu Stainless USA LLC',
    millLocation: 'Calvert, AL, USA',
    supplierDistributor: 'Ryerson Houston',
    countryOfMelt: 'USA',
    buyAmericanCompliant: true,
    chemistry: {
      carbon: 0.021,
      manganese: 1.55,
      phosphorus: 0.026,
      sulfur: 0.001,
      silicon: 0.48,
      chromium: 16.85,
      nickel: 10.40,
      molybdenum: 2.15,
      copper: 0.15,
      nitrogen: 0.058,
      carbonEquivalent: 0.36,
    },
    mechanical: {
      tensileStrengthPsi: 86400,
      yieldStrengthPsi: 42500,
      elongationPct: 52.5,
      hardnessBrinell: 160,
    },
    certifiedDate: '2026-07-08',
    qrCodePayload: 'https://ironprairiefabrication.com/mtr/K316-99410',
    permanentUrl: '/mtr/K316-99410',
    status: 'In Stock',
    initialAreaSqIn: 23040,
    remainingAreaSqIn: 22100,
    allocatedOrders: ['PO-2026-8840'],
    notes: 'High molybdenum 316L for hydrochloric & chloride pitting resistance in coastal plants.',
  },
  {
    id: 'MTR-SA36-CLIFFS-7721',
    heatNumber: 'A36-77218',
    slabNumber: 'SL-CLF-7721-01',
    certificateNumber: 'CMTR-CLF-2026-A36',
    asmeSpec: 'ASME SA-36 / ASTM A36',
    astmSpec: 'ASTM A36/A36M-19 Structural Carbon Steel',
    materialCode: 'SA-36',
    materialGrade: 'Standard Structural Carbon Steel',
    heatTreatment: 'As-Rolled',
    plateThickness: 0.375,
    thicknessLabel: '3/8" (0.375")',
    plateWidthInches: 96,
    plateLengthInches: 240,
    masterPlateWeightLbs: 2450.4,
    steelMill: 'Cleveland-Cliffs Burns Harbor',
    millLocation: 'Burns Harbor, IN, USA',
    supplierDistributor: 'Triple-S Steel Houston',
    countryOfMelt: 'USA',
    buyAmericanCompliant: true,
    chemistry: {
      carbon: 0.18,
      manganese: 0.90,
      phosphorus: 0.015,
      sulfur: 0.010,
      silicon: 0.22,
      copper: 0.20,
      carbonEquivalent: 0.34,
    },
    mechanical: {
      tensileStrengthPsi: 68400,
      yieldStrengthPsi: 41200,
      elongationPct: 24.0,
      hardnessBrinell: 137,
    },
    certifiedDate: '2026-03-18',
    qrCodePayload: 'https://ironprairiefabrication.com/mtr/A36-77218',
    permanentUrl: '/mtr/A36-77218',
    status: 'In Stock',
    initialAreaSqIn: 23040,
    remainingAreaSqIn: 16800,
    allocatedOrders: ['PO-2026-8852'],
    notes: 'Structural grade carbon steel plate. Line testing, blinds, utility isolation.',
  },
  {
    id: 'MTR-AL6061-ALCOA-5541',
    heatNumber: 'AL6-55412',
    slabNumber: 'SL-ALC-5541-T6',
    certificateNumber: 'CMTR-ALC-2026-6061T6',
    asmeSpec: 'ASME SB-209 6061-T6',
    astmSpec: 'ASTM B209-20 6061-T6 Aluminum Alloy Plate',
    materialCode: 'AL-6061',
    materialGrade: '6061-T6 High Strength Structural',
    heatTreatment: 'T6 Heat Treated',
    plateThickness: 0.250,
    thicknessLabel: '1/4" (0.250")',
    plateWidthInches: 96,
    plateLengthInches: 240,
    masterPlateWeightLbs: 575.6,
    steelMill: 'Alcoa Warrick Operations',
    millLocation: 'Newburgh, IN, USA',
    supplierDistributor: 'Ryerson Houston',
    countryOfMelt: 'USA',
    buyAmericanCompliant: true,
    chemistry: {
      carbon: 0.0,
      manganese: 0.12,
      phosphorus: 0.0,
      sulfur: 0.0,
      silicon: 0.65,
      chromium: 0.22,
      copper: 0.28,
      aluminum: 97.2,
      carbonEquivalent: 0.0,
    },
    mechanical: {
      tensileStrengthPsi: 45200,
      yieldStrengthPsi: 40100,
      elongationPct: 14.5,
      hardnessBrinell: 95,
    },
    certifiedDate: '2026-05-30',
    qrCodePayload: 'https://ironprairiefabrication.com/mtr/AL6-55412',
    permanentUrl: '/mtr/AL6-55412',
    status: 'In Stock',
    initialAreaSqIn: 23040,
    remainingAreaSqIn: 21400,
    allocatedOrders: [],
    notes: 'Lightweight high-strength aircraft & marine aluminum plate.',
  },
];

// Helper Functions
export function getAllMTRs(): MaterialTestReport[] {
  try {
    const saved = localStorage.getItem('ipf_mtr_repository');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_MTR_DATABASE;
}

export function saveMTRs(mtrs: MaterialTestReport[]): void {
  try {
    localStorage.setItem('ipf_mtr_repository', JSON.stringify(mtrs));
  } catch (e) {
    console.error(e);
  }
}

export function getMTRByHeatNumber(heatNumber: string): MaterialTestReport | undefined {
  const mtrs = getAllMTRs();
  const cleanHeat = heatNumber.trim().toUpperCase();
  return mtrs.find(m => m.heatNumber.toUpperCase() === cleanHeat || m.heatNumber.toUpperCase().includes(cleanHeat));
}

export function getMatchingMTRs(materialCode: MaterialCode, thickness: number): MaterialTestReport[] {
  const mtrs = getAllMTRs();
  return mtrs.filter(m => {
    const matMatch = m.materialCode === materialCode;
    const thkMatch = Math.abs(m.plateThickness - thickness) < 0.02;
    return matMatch && thkMatch && m.status === 'In Stock';
  });
}

export function allocatePlateArea(heatNumber: string, orderId: string, areaSqIn: number): boolean {
  const mtrs = getAllMTRs();
  const index = mtrs.findIndex(m => m.heatNumber.toUpperCase() === heatNumber.trim().toUpperCase());
  if (index === -1) return false;

  const mtr = mtrs[index];
  mtr.remainingAreaSqIn = Math.max(0, mtr.remainingAreaSqIn - areaSqIn);
  if (!mtr.allocatedOrders.includes(orderId)) {
    mtr.allocatedOrders.push(orderId);
  }
  if (mtr.remainingAreaSqIn <= 100) {
    mtr.status = 'Depleted';
  }
  saveMTRs(mtrs);
  return true;
}
`;

writeSrc('src/operations/data/mtrRepository.ts', mtrRepositoryContent);

// ============================================================================
// 3. src/operations/data/supplierData.ts
// ============================================================================
const supplierDataContent = `// src/operations/data/supplierData.ts
// Steel Mills, Distributors & Industrial Gas Supplier Directory

import { GasTankTelemetry, SupplierPO } from '../../types';

export interface SupplierProfile {
  id: string;
  name: string;
  category: 'Steel Plate Mill / Distributor' | 'Laser Assist Gas' | 'Fasteners & Tooling';
  contactPerson: string;
  email: string;
  phone: string;
  cityState: string;
  typicalLeadTimeDays: number;
  paymentTerms: string;
  requiresMtrCert: boolean;
}

export const STEEL_SUPPLIERS: SupplierProfile[] = [
  {
    id: 'triples-houston',
    name: 'Triple-S Steel Supply Co.',
    category: 'Steel Plate Mill / Distributor',
    contactPerson: 'Clayton Miller (Heavy Plate Sourcing)',
    email: 'clayton.miller@sss-steel.com',
    phone: '(713) 697-7105',
    cityState: 'Houston, TX',
    typicalLeadTimeDays: 1,
    paymentTerms: 'Net 30',
    requiresMtrCert: true,
  },
  {
    id: 'ryerson-houston',
    name: 'Ryerson Metals (Gulf Coast Service Center)',
    category: 'Steel Plate Mill / Distributor',
    contactPerson: 'Danielle Brooks (Stainless & PVQ Plate)',
    email: 'danielle.brooks@ryerson.com',
    phone: '(713) 635-1500',
    cityState: 'Houston, TX',
    typicalLeadTimeDays: 2,
    paymentTerms: 'Net 30',
    requiresMtrCert: true,
  },
  {
    id: 'ssab-americas',
    name: 'SSAB Americas (Direct Mill Allocation)',
    category: 'Steel Plate Mill / Distributor',
    contactPerson: 'Richard Hamilton (Mill Account Exec)',
    email: 'orders.americas@ssab.com',
    phone: '(630) 810-4800',
    cityState: 'Muscatine, IA',
    typicalLeadTimeDays: 7,
    paymentTerms: 'Net 30 Commercial',
    requiresMtrCert: true,
  },
  {
    id: 'nucor-plate',
    name: 'Nucor Steel Hertford County',
    category: 'Steel Plate Mill / Distributor',
    contactPerson: 'Inside Sales (Boiler & PVQ Plate)',
    email: 'plate.orders@nucor.com',
    phone: '(252) 356-3700',
    cityState: 'Cofield, NC',
    typicalLeadTimeDays: 5,
    paymentTerms: 'Net 30 Commercial',
    requiresMtrCert: true,
  },
];

export const GAS_SUPPLIERS: SupplierProfile[] = [
  {
    id: 'airgas-texas',
    name: 'Airgas USA LLC (Texas Branch)',
    category: 'Laser Assist Gas',
    contactPerson: 'Travis Sterling (Bulk Gas Dispatch)',
    email: 'texas.bulk@airgas.com',
    phone: '(979) 233-5524',
    cityState: 'Texas',
    typicalLeadTimeDays: 1,
    paymentTerms: 'Net 30 Direct',
    requiresMtrCert: false,
  },
  {
    id: 'linde-texas-city',
    name: 'Linde Gas & Equipment (Texas City Plant)',
    category: 'Laser Assist Gas',
    contactPerson: 'David Morales (Industrial Gas)',
    email: 'texascity.sales@linde.com',
    phone: '(409) 948-4444',
    cityState: 'Texas City, TX',
    typicalLeadTimeDays: 1,
    paymentTerms: 'Net 30',
    requiresMtrCert: false,
  },
];

export const INITIAL_GAS_TELEMETRY: GasTankTelemetry[] = [
  {
    gasType: 'Liquid Nitrogen (LN2)',
    supplier: 'Airgas Texas',
    tankCapacity: '1,500 Gallon MicroBulk Cryogenic Tank',
    currentLevelPct: 68,
    currentPsi: 450,
    reorderThresholdPct: 25,
    dailyConsumptionAvg: '42 Gal / Shift (Stainless/Clean Edge)',
    estimatedDaysRemaining: 18,
    lastFillDate: '2026-08-05',
    tankLocation: 'Exterior Gas Pad (North Laser Bulkhead)',
    status: 'Normal',
  },
  {
    gasType: 'Oxygen (O2 High-Purity)',
    supplier: 'Airgas Texas',
    tankCapacity: '16-Cylinder High-Pressure Manifold Pack',
    currentLevelPct: 32,
    currentPsi: 1850,
    reorderThresholdPct: 20,
    dailyConsumptionAvg: '3 Cylinders / Week (Thick Carbon Steel)',
    estimatedDaysRemaining: 9,
    lastFillDate: '2026-08-12',
    tankLocation: 'Laser Assist Manifold Bay (Bay 1)',
    status: 'Normal',
  },
  {
    gasType: 'Compressed Air',
    supplier: 'Kaeser 50 HP Rotary Screw Compressor',
    tankCapacity: '240 Gallon Vertical Receiver + Desiccant Dryer',
    currentLevelPct: 100,
    currentPsi: 175,
    reorderThresholdPct: 80,
    dailyConsumptionAvg: 'Continuous Duty Cycle',
    estimatedDaysRemaining: 999,
    lastFillDate: 'Active Shop Air',
    tankLocation: 'Compressor Room (West Wall)',
    status: 'Normal',
  },
];

export const INITIAL_SUPPLIER_POS: SupplierPO[] = [
  {
    poNumber: 'PO-STEEL-2026-0412',
    supplierName: 'Triple-S Steel Supply Co.',
    supplierContact: 'Clayton Miller',
    supplierEmail: 'clayton.miller@sss-steel.com',
    orderDate: '2026-08-15',
    requestedDeliveryDate: '2026-08-22',
    category: 'Master Steel Plate',
    items: [
      {
        id: 'POI-1',
        materialCode: 'SA-516-70',
        asmeSpec: 'ASME SA-516 Gr. 70 PVQ',
        thickness: 0.500,
        thicknessLabel: '1/2" (0.500")',
        widthInches: 96,
        lengthInches: 240,
        quantity: 2,
        unitWeightLbs: 3270,
        totalWeightLbs: 6540,
        pricePerLb: 2.15,
        totalCost: 14061.00,
      }
    ],
    totalAmount: 14061.00,
    status: 'Confirmed',
    deliveryStatus: 'In Transit via Flatbed Carrier',
    requireMTR: true,
    destination: 'Iron Prairie Fabrication Group LLC, Texas',
    specialInstructions: 'Must include certified mill test reports (CMTR) with shipment and Buy American certification.',
  },
  {
    poNumber: 'PO-GAS-2026-0188',
    supplierName: 'Airgas USA LLC',
    supplierContact: 'Travis Sterling',
    supplierEmail: 'texas.bulk@airgas.com',
    orderDate: '2026-08-10',
    requestedDeliveryDate: '2026-08-14',
    category: 'Laser Assist Gas',
    items: [
      {
        id: 'POG-1',
        materialCode: 'SA-36',
        asmeSpec: 'Liquid Nitrogen MicroBulk',
        thickness: 0,
        thicknessLabel: 'N/A',
        widthInches: 0,
        lengthInches: 0,
        quantity: 800,
        unitWeightLbs: 1,
        totalWeightLbs: 800,
        pricePerLb: 1.65,
        totalCost: 1320.00,
      }
    ],
    totalAmount: 1320.00,
    status: 'Delivered',
    deliveryStatus: 'Tank Filled & Signed Off by Russell',
    requireMTR: false,
    destination: 'North Laser Bulkhead Pad, Texas Shop',
  },
];
`;

writeSrc('src/operations/data/supplierData.ts', supplierDataContent);

// ============================================================================
// 4. src/operations/services/AudioChimeManager.ts
// ============================================================================
const audioChimeManagerContent = `// src/operations/services/AudioChimeManager.ts
// Web Audio API Synthesized Chimes for Shop Floor & Owner Alerts
// Zero external audio files — 100% browser-native synthesized frequencies

class AudioChimeManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    this.soundEnabled = localStorage.getItem('ipf_audio_chimes_enabled') !== 'false';
  }

  private initCtx(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    localStorage.setItem('ipf_audio_chimes_enabled', String(enabled));
  }

  // 1. New Order Arrival Chime (Ascending C5 -> E5 -> G5)
  public playNewOrderChime(): void {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.25, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.4);
      });
    } catch (e) {
      console.warn('Audio chime failed:', e);
    }
  }

  // 2. Hot Shot Emergency Alarm (Fast Triple High Pulse A5)
  public playHotShotAlarm(): void {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      const freq = 880; // A5

      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + i * 0.14);

        gain.gain.setValueAtTime(0.3, now + i * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.14 + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.14);
        osc.stop(now + i * 0.14 + 0.13);
      }
    } catch (e) {
      console.warn('Hot shot chime failed:', e);
    }
  }

  // 3. Low Gas Alert (Deep warning tone C3)
  public playLowGasAlert(): void {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(130.81, now); // C3

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.85);
    } catch (e) {
      console.warn('Low gas alert chime failed:', e);
    }
  }

  // 4. Order Dispatched Ding (Crisp Ding G5)
  public playOrderShippedDing(): void {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(783.99, now); // G5

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.55);
    } catch (e) {
      console.warn('Order shipped chime failed:', e);
    }
  }
}

export const chimeManager = new AudioChimeManager();
`;

writeSrc('src/operations/services/AudioChimeManager.ts', audioChimeManagerContent);

console.log('✓ All Data Layer & Audio modules written successfully');

