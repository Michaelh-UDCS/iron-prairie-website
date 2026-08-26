// src/operations/data/supplierData.ts
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
    tankLocation: 'Exterior Gas Pad (North Bulkhead)',
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
    tankLocation: 'Plasma Assist Manifold Bay (Bay 1)',
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
    destination: 'North Bulkhead Pad, Texas Shop',
  },
];
