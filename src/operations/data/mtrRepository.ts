// src/operations/data/mtrRepository.ts
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
