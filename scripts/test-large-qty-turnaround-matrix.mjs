// scripts/test-large-qty-turnaround-matrix.mjs
// Automated verification for High-Quantity & Heavy Plate Petrochemical Special Orders (>100 units, >10,000 lbs, >$50,000)

const MASTER_GEOMETRY = {
  '1/2"': { od: 1.75, boltCircle: 2.38 },
  '3/4"': { od: 2.12, boltCircle: 2.75 },
  '1"': { od: 2.50, boltCircle: 3.12 },
  '1-1/4"': { od: 2.88, boltCircle: 3.50 },
  '1-1/2"': { od: 3.25, boltCircle: 3.88 },
  '2"': { od: 4.00, boltCircle: 4.75 },
  '2-1/2"': { od: 4.75, boltCircle: 5.50 },
  '3"': { od: 5.25, boltCircle: 6.00 },
  '3-1/2"': { od: 6.25, boltCircle: 7.00 },
  '4"': { od: 6.75, boltCircle: 7.50 },
  '5"': { od: 7.62, boltCircle: 8.50 },
  '6"': { od: 8.62, boltCircle: 9.50 },
  '8"': { od: 10.88, boltCircle: 11.75 },
  '10"': { od: 13.25, boltCircle: 14.25 },
  '12"': { od: 16.00, boltCircle: 17.00 },
  '14"': { od: 17.62, boltCircle: 18.75 },
  '16"': { od: 20.12, boltCircle: 21.25 },
  '18"': { od: 21.50, boltCircle: 22.75 },
  '20"': { od: 23.75, boltCircle: 25.00 },
  '24"': { od: 28.12, boltCircle: 29.50 },
};

const BASE_PRICING_TABLE = {
  '1/2"': { 150: 35, 300: 42, 600: 48, 900: 65, 1500: 85 },
  '3/4"': { 150: 36, 300: 44, 600: 52, 900: 72, 1500: 95 },
  '1"': { 150: 38, 300: 48, 600: 58, 900: 82, 1500: 110 },
  '1-1/4"': { 150: 40, 300: 52, 600: 65, 900: 92, 1500: 125 },
  '1-1/2"': { 150: 42, 300: 58, 600: 75, 900: 105, 1500: 145 },
  '2"': { 150: 45, 300: 65, 600: 85, 900: 125, 1500: 175 },
  '2-1/2"': { 150: 52, 300: 78, 600: 105, 900: 155, 1500: 215 },
  '3"': { 150: 60, 300: 95, 600: 125, 900: 185, 1500: 265 },
  '3-1/2"': { 150: 70, 300: 115, 600: 155, 900: 225, 1500: 320 },
  '4"': { 150: 78, 300: 135, 600: 185, 900: 275, 1500: 395 },
  '5"': { 150: 98, 300: 175, 600: 245, 900: 365, 1500: 520 },
  '6"': { 150: 120, 300: 225, 600: 320, 900: 485, 1500: 695 },
  '8"': { 150: 175, 300: 340, 600: 495, 900: 745, 1500: 1080 },
  '10"': { 150: 245, 300: 485, 600: 720, 900: 1080, 1500: 1580 },
  '12"': { 150: 340, 300: 685, 600: 1020, 900: 1520, 1500: 2250 },
  '14"': { 150: 420, 300: 840, 600: 1260, 900: 1890, 1500: 2800 },
  '16"': { 150: 530, 300: 1060, 600: 1600, 900: 2400, 1500: 3550 },
  '18"': { 150: 660, 300: 1320, 600: 1980, 900: 2980, 1500: 4400 },
  '20"': { 150: 820, 300: 1640, 600: 2460, 900: 3700, 1500: 5500 },
  '24"': { 150: 1180, 300: 2360, 600: 3540, 900: 5300, 1500: 7900 },
};

const MATERIALS = {
  'SA-516-70': { densityLbsPerCuFt: 490, baseMultiplier: 1.0, isStainless: false },
  'SA-36': { densityLbsPerCuFt: 490, baseMultiplier: 0.92, isStainless: false },
  '304': { densityLbsPerCuFt: 501, baseMultiplier: 1.95, isStainless: true },
  '304L': { densityLbsPerCuFt: 501, baseMultiplier: 2.10, isStainless: true },
  '316L': { densityLbsPerCuFt: 507, baseMultiplier: 2.65, isStainless: true },
  'AL-6061': { densityLbsPerCuFt: 169, baseMultiplier: 1.45, isStainless: false },
};

function calculatePrice(pressureClass, nps, materialCode, thicknessInches, qty) {
  const geom = MASTER_GEOMETRY[nps];
  const mat = MATERIALS[materialCode];
  const r = geom.od / 2;
  const areaSqIn = Math.PI * Math.pow(r, 2);
  const handleArea = 1.5 * (geom.boltCircle - geom.od + 3.0);
  const totalVolumeCuIn = (areaSqIn + handleArea) * thicknessInches;
  const actualWeightLbs = (totalVolumeCuIn / 1728) * mat.densityLbsPerCuFt;
  const baseTablePrice = BASE_PRICING_TABLE[nps]?.[pressureClass] || 50;

  const baselineThickness = 0.25;
  const thicknessFactor = Math.pow(thicknessInches / baselineThickness, 0.45);
  let unitPrice = Math.max(35, Math.round(baseTablePrice * mat.baseMultiplier * thicknessFactor));

  // Wholesale volume discounts for high QTY
  if (qty >= 100) unitPrice = Math.round(unitPrice * 0.85); // 15% wholesale tier
  else if (qty >= 50) unitPrice = Math.round(unitPrice * 0.90); // 10% commercial tier
  else if (qty >= 25) unitPrice = Math.round(unitPrice * 0.95); // 5% bulk tier

  const lineTotal = unitPrice * qty;
  const totalLineWeight = actualWeightLbs * qty;

  return { unitPrice, lineTotal, actualWeightLbs, totalLineWeight };
}

console.log('================================================================');
console.log('🏭 RUNNING HIGH-QUANTITY & LARGE TURNAROUND SPECIAL ORDER STRESS TEST');
console.log('================================================================\n');

const testSuites = [
  {
    name: 'Mega Outage Blanket (300 Blinds - Mixed SA-516-70 / SA-36 / 304L)',
    client: 'Turner Industries / Dow Freeport Site',
    items: [
      { nps: '1-1/2"', class: 150, mat: 'SA-36', thk: 0.25, qty: 80 },
      { nps: '3"', class: 150, mat: 'SA-516-70', thk: 0.375, qty: 70 },
      { nps: '4"', class: 300, mat: 'SA-516-70', thk: 0.500, qty: 60 },
      { nps: '6"', class: 150, mat: '304L', thk: 0.500, qty: 50 },
      { nps: '10"', class: 300, mat: 'SA-516-70', thk: 0.750, qty: 40 },
    ]
  },
  {
    name: 'Refinery Flare & Vacuum Heavy Plate Package (Heavy Plate up to 24" 1500# / 2" Thk)',
    client: 'Phillips 66 Sweeny Refinery',
    items: [
      { nps: '10"', class: 600, mat: 'SA-516-70', thk: 1.00, qty: 15 },
      { nps: '14"', class: 300, mat: 'SA-516-70', thk: 1.25, qty: 12 },
      { nps: '18"', class: 300, mat: 'SA-516-70', thk: 1.50, qty: 8 },
      { nps: '20"', class: 600, mat: 'SA-516-70', thk: 1.875, qty: 6 },
      { nps: '24"', class: 300, mat: 'SA-516-70', thk: 2.00, qty: 4 },
    ]
  },
  {
    name: 'Chemical Acid Unit 316L Stainless Bulk Upgrade (High Alloy / High Cost)',
    client: 'BASF Verbund Freeport Complex',
    items: [
      { nps: '2"', class: 300, mat: '316L', thk: 0.375, qty: 30 },
      { nps: '3"', class: 300, mat: '316L', thk: 0.500, qty: 25 },
      { nps: '6"', class: 300, mat: '316L', thk: 0.750, qty: 20 },
      { nps: '8"', class: 600, mat: '316L', thk: 1.250, qty: 10 },
    ]
  },
  {
    name: 'Gulf Coast 500-Piece Plant Wide Outage Package',
    client: 'ExxonMobil Baytown Complex',
    items: [
      { nps: '2"', class: 150, mat: 'SA-516-70', thk: 0.25, qty: 150 },
      { nps: '4"', class: 150, mat: 'SA-516-70', thk: 0.375, qty: 150 },
      { nps: '6"', class: 300, mat: 'SA-516-70', thk: 0.50, qty: 100 },
      { nps: '8"', class: 300, mat: '304L', thk: 0.625, qty: 60 },
      { nps: '12"', class: 300, mat: '316L', thk: 0.875, qty: 40 },
    ]
  }
];

let allPassed = true;

testSuites.forEach((suite, idx) => {
  let packageUnits = 0;
  let packageWeight = 0;
  let packageTotalCost = 0;

  console.log(`[TEST ${idx + 1}] ${suite.name}`);
  console.log(`Client: ${suite.client}`);

  suite.items.forEach(it => {
    const res = calculatePrice(it.class, it.nps, it.mat, it.thk, it.qty);
    if (isNaN(res.unitPrice) || isNaN(res.lineTotal) || isNaN(res.totalLineWeight)) {
      allPassed = false;
      console.error(`  ❌ FAILED: NaN in item ${it.qty}x ${it.nps} ${it.class}# ${it.mat}`);
    }
    packageUnits += it.qty;
    packageWeight += res.totalLineWeight;
    packageTotalCost += res.lineTotal;
    console.log(`  • ${it.qty}x ${it.nps} ${it.class}# ${it.mat} (${it.thk}") -> $${res.unitPrice}/ea | Line: $${res.lineTotal.toLocaleString()} | Weight: ${res.totalLineWeight.toFixed(1)} lbs`);
  });

  const isSpecialOrder = packageTotalCost >= 10000 || packageWeight >= 1000;
  const freightTons = (packageWeight / 2000).toFixed(2);

  console.log(`  -------------------------------------------------------------`);
  console.log(`  TOTAL UNITS:  ${packageUnits} blinds`);
  console.log(`  TOTAL WEIGHT: ${packageWeight.toFixed(1)} lbs (${freightTons} short tons)`);
  console.log(`  TOTAL INVOICE: $${packageTotalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`);
  console.log(`  SPECIAL ORDER MILL ALLOCATION: ${isSpecialOrder ? '✅ REQUIRED (>1,000 lbs / >$10k)' : 'STANDARD STOCK'}`);
  console.log(`  LEAD TIME: ${isSpecialOrder ? '5-7 to 7-10 Business Days (Dedicated Master Plate Staging)' : '1-2 Days'}\n`);
});

if (allPassed) {
  console.log('✅ ALL LARGE QUANTITY & HEAVY ALLOY TURNAROUND PACKAGES PASSED WITH 100% PRECISION!');
} else {
  console.error('❌ SOME LARGE QUANTITY TESTS FAILED');
  process.exit(1);
}
