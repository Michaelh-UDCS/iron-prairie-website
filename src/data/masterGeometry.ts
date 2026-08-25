// src/data/masterGeometry.ts
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
  publicListBufferPct: 10,
  commercialDiscountPct: 10,
  sa36PricePerLb: 1.85,
  sa516PricePerLb: 2.15,
  ss304PricePerLb: 5.50,
  ss304LPricePerLb: 5.95,
  ss316LPricePerLb: 7.40,
  alPricePerLb: 5.00,
  laborRatePerHour: 83.85,
  baseHandlingFee: 5.00,
  scrapMultiplier: 1.40,
  hotShotEmergencyFee: 250.00,
  baseMachiningSetupFee: 25.00,
  machiningRatePerInch: 9.50,
  laserGasRatePerInch: 0.08,
};

export const ACCESSORY_PRICES = {
  tHandlePrice: 5.00,
  lockoutHolePrice: 5.00,
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
    defaultPricePerLb: 1.85,
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
    defaultPricePerLb: 2.15,
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
    defaultPricePerLb: 5.50,
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
    defaultPricePerLb: 5.95,
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
    defaultPricePerLb: 7.40,
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
    defaultPricePerLb: 5.00,
    badge: 'Lightweight Industrial',
    colorHex: '#f1f5f9',
  },
};

export const THICKNESS_OPTIONS: ThicknessOption[] = [
  { label: '11 Gauge', thickness: 0.1196, fractionLabel: '11 Ga (0.120")', isDefault: true, description: 'Standard Turnaround Utility Isolation Blind (Owner Spec - Default)' },
  { label: '1/8"', thickness: 0.125, fractionLabel: '1/8" (0.125")', description: '1/8" Nominal Plate' },
  { label: '3/16"', thickness: 0.1875, fractionLabel: '3/16" (0.188")', description: 'Medium Duty Isolation' },
  { label: '1/4"', thickness: 0.250, fractionLabel: '1/4" (0.250")', description: 'Heavy Duty Structural' },
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

export function getVariableMachiningCost(od: number, pricing: PricingConfig): number {
  const setup = pricing.baseMachiningSetupFee ?? 25.00;
  const rate = pricing.machiningRatePerInch ?? 9.50;
  return Math.round(setup + (od * rate));
}

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
  pricing: PricingConfig,
  addLockoutHole: boolean = false,
  blindType: 'Paddle Blind' | 'Figure 8 (Spectacle Blind)' | 'Paddle Spacer' | 'Bleeder Blind' = 'Paddle Blind'
) {
  const geom = MASTER_GEOMETRY[pClass]?.[nps] || MASTER_GEOMETRY[150]['4"'];
  const mat = MATERIALS[matCode] || MATERIALS['SA-516-70'];
  const isFigure8 = blindType === 'Figure 8 (Spectacle Blind)';
  const geometryMultiplier = isFigure8 ? 2.0 : 1.0;

  const baseLaborHrs = LABOR_HOURS[nps] || 0.35;
  const laborHrs = baseLaborHrs * geometryMultiplier;

  const handleWidth = Math.max(1.0, geom.od * 0.25);
  const handleLength = Math.max(3.5, geom.boltCircle - geom.od / 2 + 1.5);
  // Area in sq ft (Figure 8 has dual discs connected by center bridge)
  const singleDiscArea = (Math.PI * Math.pow(geom.od / 2, 2)) + (handleWidth * handleLength);
  const totalAreaSqFt = (singleDiscArea * geometryMultiplier) / 144.0;

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
  
  // Variable machining cost based on OD (Figure 8 has dual faces to machine)
  const singleFacingAdder = facing === 'Machined Gasket Finish (Special Order)'
    ? getVariableMachiningCost(geom.od, pricing)
    : 0;
  const facingAdder = singleFacingAdder * geometryMultiplier;

  let extrasTotal = 0;
  if (addTHadle) extrasTotal += ACCESSORY_PRICES.tHandlePrice;
  if (addLockoutHole) extrasTotal += ACCESSORY_PRICES.lockoutHolePrice;
  if (addLiftingLug) extrasTotal += ACCESSORY_PRICES.liftingLugPrice;
  if (addPlateDog) extrasTotal += ACCESSORY_PRICES.plateDogPrice;
  if (addWedge) extrasTotal += ACCESSORY_PRICES.fitUpWedgePrice;

  const subtotalBeforeMarkup = matPrice + laborPrice + (pricing.baseHandlingFee * geometryMultiplier) + facingAdder + extrasTotal;
  const markupMultiplier = 1 + (pricing.globalMarkupPct / 100);
  const wholesaleTotal = Math.max(isFigure8 ? 45 : 25, Math.ceil(subtotalBeforeMarkup * markupMultiplier));
  
  // Public Catalog & Amazon List Buffer (Default +10% protection margin)
  const listBuffer = 1 + ((pricing.publicListBufferPct ?? 10) / 100);
  const listTotal = Math.max(wholesaleTotal, Math.ceil(wholesaleTotal * listBuffer));

  const classCode = pClass === 1500 ? 'C1500' : `CX${pClass}`;
  const sizeCode = `S${nps.replace('"', '')}`;
  const thkClean = thicknessLabel.replace(/["\s()]/g, '').replace('Gauge', 'GA');
  const typePrefix = isFigure8 ? 'F8' : blindType === 'Paddle Spacer' ? 'PS' : blindType === 'Bleeder Blind' ? 'PV' : 'PB';
  const partNumber = `${typePrefix}${matCode.replace('-', '')}-${classCode}T${thkClean}${sizeCode}`;

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
    facingAdder,
    singleFacingAdder,
    unitPrice: wholesaleTotal,
    wholesalePrice: wholesaleTotal,
    listPrice: listTotal,
    discountAmount: listTotal - wholesaleTotal,
    discountPct: pricing.commercialDiscountPct ?? 10,
    isFigure8,
    blindType
  };
}
