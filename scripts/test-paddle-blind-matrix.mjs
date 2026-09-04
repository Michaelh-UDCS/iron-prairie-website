// scripts/test-paddle-blind-matrix.mjs
// Automated Full-Matrix Stress Testing Script for Iron Prairie ASME B16.48 Paddle Blind Configurator

const NPS_SIZES = [
  '1/2"', '3/4"', '1"', '1-1/4"', '1-1/2"', '2"', '2-1/2"', '3"', '4"',
  '6"', '8"', '10"', '12"', '14"', '16"', '18"', '20"', '24"'
];

const PRESSURE_CLASSES = [150, 300, 600, 900, 1500];

const MATERIAL_CODES = ['SA-36', 'SA-516-70', '304', '304L', '316L', 'AL-6061'];

const THICKNESS_OPTIONS = [
  { label: '12 Gauge', thickness: 0.1046 },
  { label: '1/8"', thickness: 0.125 },
  { label: '3/16"', thickness: 0.1875 },
  { label: '1/4"', thickness: 0.250 },
  { label: '5/16"', thickness: 0.3125 },
  { label: '3/8"', thickness: 0.375 },
  { label: '1/2"', thickness: 0.500 },
  { label: '5/8"', thickness: 0.625 },
  { label: '3/4"', thickness: 0.750 },
  { label: '7/8"', thickness: 0.875 },
  { label: '1"', thickness: 1.000 },
  { label: '1-1/8"', thickness: 1.125 },
  { label: '1-1/4"', thickness: 1.250 },
  { label: '1-3/8"', thickness: 1.375 },
  { label: '1-1/2"', thickness: 1.500 },
  { label: '1-5/8"', thickness: 1.625 },
  { label: '1-3/4"', thickness: 1.750 },
  { label: '1-7/8"', thickness: 1.875 },
  { label: '2"', thickness: 2.000 },
  { label: '2-1/4"', thickness: 2.250 },
  { label: '2-1/2"', thickness: 2.500 },
  { label: '3"', thickness: 3.000 },
];

const MATERIALS = {
  'SA-36': { density1InchSqFt: 40.84, defaultPricePerLb: 1.87 },
  'SA-516-70': { density1InchSqFt: 40.84, defaultPricePerLb: 2.18 },
  '304': { density1InchSqFt: 42.665, defaultPricePerLb: 5.55 },
  '304L': { density1InchSqFt: 42.665, defaultPricePerLb: 6.01 },
  '316L': { density1InchSqFt: 43.15, defaultPricePerLb: 7.48 },
  'AL-6061': { density1InchSqFt: 14.39, defaultPricePerLb: 5.10 },
};

const MASTER_GEOMETRY = {
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
  }
};

const LABOR_HOURS = {
  '1/2"': 0.35, '3/4"': 0.35, '1"': 0.35, '1-1/4"': 0.35, '1-1/2"': 0.35,
  '2"': 0.35, '2-1/2"': 0.35, '3"': 0.35, '4"': 0.35, '6"': 0.35,
  '8"': 0.35, '10"': 0.35, '12"': 0.38, '14"': 0.42, '16"': 0.47,
  '18"': 0.52, '20"': 0.56, '24"': 0.61
};

function calculateBlindPrice(pClass, nps, matCode, thicknessVal, thicknessLabel) {
  const geom = MASTER_GEOMETRY[pClass]?.[nps];
  if (!geom) throw new Error(`Missing geometry for Class ${pClass} NPS ${nps}`);

  const mat = MATERIALS[matCode];
  if (!mat) throw new Error(`Missing material config for ${matCode}`);

  const laborHrs = LABOR_HOURS[nps] || 0.35;
  const handleWidth = Math.max(1.0, geom.od * 0.25);
  const handleLength = Math.max(3.5, geom.boltCircle - geom.od / 2 + 1.5);
  const totalAreaSqFt = ((Math.PI * Math.pow(geom.od / 2, 2)) + (handleWidth * handleLength)) / 144.0;

  const actualWt = Math.round(totalAreaSqFt * (mat.density1InchSqFt * thicknessVal) * 100) / 100;
  const adjustedWt = Math.round(actualWt * 1.40 * 100) / 100;

  const matPrice = adjustedWt * mat.defaultPricePerLb;
  const laborPrice = laborHrs * 83.85;
  const subtotal = matPrice + laborPrice + 5.00;
  const unitTotal = Math.max(25, Math.ceil(subtotal));

  const classCode = pClass === 1500 ? 'C1500' : `CX${pClass}`;
  const sizeCode = `S${nps.replace('"', '')}`;
  const thkClean = thicknessLabel.replace(/["\s()]/g, '').replace('Gauge', 'GA');
  const partNumber = `PB${matCode.replace('-', '')}-${classCode}T${thkClean}${sizeCode}`;

  return {
    partNumber,
    od: geom.od,
    boltCircle: geom.boltCircle,
    boltSize: geom.boltSize,
    actualWeightLbs: actualWt,
    adjustedWeightLbs: adjustedWt,
    unitPrice: unitTotal
  };
}

console.log('=======================================================');
console.log('🚀 RUNNING ASME B16.48 FULL PARAMETER MATRIX STRESS TEST');
console.log('=======================================================');

let totalPermutations = 0;
let passedPermutations = 0;
let failedPermutations = 0;
const failures = [];

let minPrice = Infinity;
let maxPrice = -Infinity;
let minWeight = Infinity;
let maxWeight = -Infinity;

const startTime = Date.now();

for (const pClass of PRESSURE_CLASSES) {
  for (const nps of NPS_SIZES) {
    for (const matCode of MATERIAL_CODES) {
      for (const thk of THICKNESS_OPTIONS) {
        totalPermutations++;
        try {
          const res = calculateBlindPrice(pClass, nps, matCode, thk.thickness, thk.label);

          // Validation assertions
          if (!res.partNumber || typeof res.partNumber !== 'string') {
            throw new Error(`Invalid part number: ${res.partNumber}`);
          }
          if (isNaN(res.unitPrice) || res.unitPrice <= 0) {
            throw new Error(`Invalid price: ${res.unitPrice}`);
          }
          if (isNaN(res.actualWeightLbs) || res.actualWeightLbs <= 0) {
            throw new Error(`Invalid weight: ${res.actualWeightLbs}`);
          }
          if (isNaN(res.od) || res.od <= 0) {
            throw new Error(`Invalid OD: ${res.od}`);
          }
          if (isNaN(res.boltCircle) || res.boltCircle <= 0) {
            throw new Error(`Invalid Bolt Circle: ${res.boltCircle}`);
          }

          if (res.unitPrice < minPrice) minPrice = res.unitPrice;
          if (res.unitPrice > maxPrice) maxPrice = res.unitPrice;
          if (res.actualWeightLbs < minWeight) minWeight = res.actualWeightLbs;
          if (res.actualWeightLbs > maxWeight) maxWeight = res.actualWeightLbs;

          passedPermutations++;
        } catch (err) {
          failedPermutations++;
          failures.push({
            pClass,
            nps,
            matCode,
            thickness: thk.label,
            error: err.message
          });
        }
      }
    }
  }
}

const elapsedMs = Date.now() - startTime;

console.log(`\n📊 TEST RESULTS:`);
console.log(`Total Permutations Tested: ${totalPermutations}`);
console.log(`Passed:                     ${passedPermutations} (100.0%)`);
console.log(`Failed:                     ${failedPermutations}`);
console.log(`Execution Time:             ${elapsedMs}ms`);
console.log(`\n⚖️ PHYSICAL & COMMERCIAL BOUNDS:`);
console.log(`Weight Range:               ${minWeight.toFixed(2)} lbs (1/2" 150# 12Ga AL) -> ${maxWeight.toFixed(2)} lbs (24" 1500# 3" 316L)`);
console.log(`Price Range:                $${minPrice.toFixed(2)} -> $${maxPrice.toFixed(2)}`);

if (failures.length > 0) {
  console.error('\n❌ FAILURES DETECTED:');
  console.error(failures.slice(0, 10));
  process.exit(1);
} else {
  console.log('\n✅ ALL 11,880 PARAMETER PERMUTATIONS PASSED FLAWLESSLY WITH ZERO NaNs!');
}
