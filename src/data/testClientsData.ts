// testClientsData.ts
// Comprehensive Test Client Profiles & Random Stress Testing Engine for Iron Prairie Fabrication Group LLC

export interface IndustrialClientProfile {
  id: string;
  companyName: string;
  facilityLocation: string;
  buyerName: string;
  title: string;
  email: string;
  phone: string;
  jobsiteAddress: string;
  poPrefix: string;
  preferredPaymentMethod: 'Credit Card' | 'ACH Direct Debit' | 'Net 30 Commercial PO';
  typicalMaterials: Array<'SA-36' | 'SA-516-70' | '304' | '304L' | '316L' | 'AL-6061'>;
  industryCategory: 'Refinery' | 'Chemical & Petrochemical' | 'Industrial Contractor' | 'Offshore / Marine';
}

export const INDUSTRIAL_TEST_CLIENTS: IndustrialClientProfile[] = [
  {
    id: 'dow-texas',
    companyName: 'Dow Chemical (Texas Site)',
    facilityLocation: 'Texas',
    buyerName: 'Mark Henderson',
    title: 'Senior Turnaround Procurement Lead',
    email: 'm.henderson@dow.com',
    phone: '(979) 238-2000',
    jobsiteAddress: 'Plant Gate 14 Receiving, TX 77531',
    poPrefix: 'PO-DOW-TX-',
    preferredPaymentMethod: 'Net 30 Commercial PO',
    typicalMaterials: ['SA-516-70', '304L', '316L'],
    industryCategory: 'Chemical & Petrochemical'
  },
  {
    id: 'p66-sweeny',
    companyName: 'Phillips 66 Sweeny Refinery',
    facilityLocation: 'Old Ocean, TX',
    buyerName: 'Brian Kowalski',
    title: 'MRO Reliability Buyer',
    email: 'b.kowalski@p66.com',
    phone: '(979) 491-2200',
    jobsiteAddress: 'Highway 35 & FM 524, Gate 3 Maintenance Dock, Old Ocean, TX 77463',
    poPrefix: 'P66-SWN-',
    preferredPaymentMethod: 'Credit Card',
    typicalMaterials: ['SA-516-70', '316L'],
    industryCategory: 'Refinery'
  },
  {
    id: 'basf-texas',
    companyName: 'BASF Texas Verbund Site',
    facilityLocation: 'Texas',
    buyerName: 'David R. Vance',
    title: 'Turnaround Materials Coordinator',
    email: 'david.vance@basf.com',
    phone: '(979) 415-6000',
    jobsiteAddress: '602 Copper Rd, Warehouse Gate 2, TX 77531',
    poPrefix: 'BASF-PO-',
    preferredPaymentMethod: 'ACH Direct Debit',
    typicalMaterials: ['SA-36', 'SA-516-70', '304L', '316L'],
    industryCategory: 'Chemical & Petrochemical'
  },
  {
    id: 'lyondell-channelview',
    companyName: 'LyondellBasell Channelview Complex',
    facilityLocation: 'Channelview, TX',
    buyerName: 'Sarah Jenkins',
    title: 'Turnaround Sourcing Specialist',
    email: 's.jenkins@lyondellbasell.com',
    phone: '(281) 452-8888',
    jobsiteAddress: '8280 Sheldon Rd, Contractor Receiving Gate 5, Channelview, TX 77530',
    poPrefix: 'LYB-CV-',
    preferredPaymentMethod: 'Net 30 Commercial PO',
    typicalMaterials: ['SA-516-70', '304', '316L'],
    industryCategory: 'Chemical & Petrochemical'
  },
  {
    id: 'exxon-baytown',
    companyName: 'ExxonMobil Baytown Complex',
    facilityLocation: 'Baytown, TX',
    buyerName: 'Travis Hollingsworth',
    title: 'Turnaround Material Planner',
    email: 'travis.hollingsworth@exxonmobil.com',
    phone: '(281) 834-4000',
    jobsiteAddress: '2800 Decker Dr, North Maintenance Gate, Baytown, TX 77520',
    poPrefix: 'EM-BAY-',
    preferredPaymentMethod: 'Net 30 Commercial PO',
    typicalMaterials: ['SA-516-70', '304L', '316L'],
    industryCategory: 'Refinery'
  },
  {
    id: 'cpchem-cedarbayou',
    companyName: 'Chevron Phillips Chemical (Cedar Bayou)',
    facilityLocation: 'Baytown, TX',
    buyerName: 'Craig M. Douglas',
    title: 'Procurement Specialist',
    email: 'douglacm@cpchem.com',
    phone: '(281) 421-6500',
    jobsiteAddress: '9500 I-10 East, Material Receiving Yard, Baytown, TX 77521',
    poPrefix: 'CPC-CB-',
    preferredPaymentMethod: 'ACH Direct Debit',
    typicalMaterials: ['SA-516-70', '304L', 'AL-6061'],
    industryCategory: 'Chemical & Petrochemical'
  },
  {
    id: 'formosa-ptcomfort',
    companyName: 'Formosa Plastics Corp USA',
    facilityLocation: 'Point Comfort, TX',
    buyerName: 'Kenny Chen',
    title: 'MRO Purchasing Lead',
    email: 'kchen@ftpc.fpcusa.com',
    phone: '(361) 987-7000',
    jobsiteAddress: '201 Formosa Dr, Unit 2 Central Stores, Point Comfort, TX 77978',
    poPrefix: 'FPC-TX-',
    preferredPaymentMethod: 'Net 30 Commercial PO',
    typicalMaterials: ['304L', '316L', 'SA-516-70'],
    industryCategory: 'Chemical & Petrochemical'
  },
  {
    id: 'ineos-chocbayou',
    companyName: 'INEOS Olefins & Polymers USA',
    facilityLocation: 'Alvin / Chocolate Bayou, TX',
    buyerName: 'Amanda Richardson',
    title: 'Site Turnaround Coordinator',
    email: 'amanda.richardson@ineos.com',
    phone: '(281) 581-2160',
    jobsiteAddress: 'FM 2917, Contractor Gate 3, Alvin, TX 77511',
    poPrefix: 'INEOS-CB-',
    preferredPaymentMethod: 'Credit Card',
    typicalMaterials: ['SA-516-70', '316L'],
    industryCategory: 'Chemical & Petrochemical'
  },
  {
    id: 'marathon-galveston',
    companyName: 'Marathon Petroleum (Galveston Bay Refinery)',
    facilityLocation: 'Texas City, TX',
    buyerName: 'Robert Sterling',
    title: 'Turnaround Expeditor',
    email: 'rsterling@marathonpetroleum.com',
    phone: '(409) 945-1011',
    jobsiteAddress: '2401 5th Ave South, Gate 12 Maintenance, Texas City, TX 77590',
    poPrefix: 'MPC-GBR-',
    preferredPaymentMethod: 'Net 30 Commercial PO',
    typicalMaterials: ['SA-516-70', '304L', '316L'],
    industryCategory: 'Refinery'
  },
  {
    id: 'valero-texascity',
    companyName: 'Valero Texas City Refinery',
    facilityLocation: 'Texas City, TX',
    buyerName: 'Carlos Mendoza',
    title: 'Piping & Valve Sourcing Lead',
    email: 'carlos.mendoza@valero.com',
    phone: '(409) 945-1215',
    jobsiteAddress: '1301 Loop 197 South, Main Receiving Dock, Texas City, TX 77590',
    poPrefix: 'VLO-TC-',
    preferredPaymentMethod: 'Net 30 Commercial PO',
    typicalMaterials: ['SA-516-70', '304', '316L'],
    industryCategory: 'Refinery'
  },
  {
    id: 'turner-ind',
    companyName: 'Turner Industries Group',
    facilityLocation: 'Pasadena, TX',
    buyerName: 'Jason Miller',
    title: 'Gulf Coast Regional Procurement Director',
    email: 'purchasing@turner-ind.com',
    phone: '(281) 478-6500',
    jobsiteAddress: '4300 Highway 225, Mechanical Fabrication Yard, Pasadena, TX 77503',
    poPrefix: 'TIG-GULF-',
    preferredPaymentMethod: 'Net 30 Commercial PO',
    typicalMaterials: ['SA-36', 'SA-516-70', '304L', '316L', 'AL-6061'],
    industryCategory: 'Industrial Contractor'
  },
  {
    id: 'zachry-group',
    companyName: 'Zachry Industrial Inc.',
    facilityLocation: 'Houston, TX',
    buyerName: 'Bradley Cooper',
    title: 'Project Materials Manager',
    email: 'b.cooper@zachrygroup.com',
    phone: '(713) 641-4141',
    jobsiteAddress: 'Industrial Project Site, Gate 4 Laydown Yard, TX 77531',
    poPrefix: 'ZACH-TX-',
    preferredPaymentMethod: 'Net 30 Commercial PO',
    typicalMaterials: ['SA-516-70', '304L', '316L'],
    industryCategory: 'Industrial Contractor'
  },
  {
    id: 'bechtel-og',
    companyName: 'Bechtel Oil, Gas & Chemicals',
    facilityLocation: 'Houston / Gulf Coast, TX',
    buyerName: 'Elena Rostova',
    title: 'EPC Procurement Specialist',
    email: 'erostova@bechtel.com',
    phone: '(713) 235-2000',
    jobsiteAddress: 'Energy Corridor Warehouse 4, 3000 Post Oak Blvd, Houston, TX 77056',
    poPrefix: 'BECH-OG-',
    preferredPaymentMethod: 'Net 30 Commercial PO',
    typicalMaterials: ['SA-516-70', '316L'],
    industryCategory: 'Industrial Contractor'
  },
  {
    id: 'performance-contractors',
    companyName: 'Performance Contractors Inc.',
    facilityLocation: 'Lake Jackson, TX',
    buyerName: 'Dustin Walker',
    title: 'Turnaround Fabrication Lead',
    email: 'dwalker@performance-contractors.com',
    phone: '(979) 297-7000',
    jobsiteAddress: '102 Construction Way, Tool Room #2, Lake Jackson, TX 77566',
    poPrefix: 'PCI-LJ-',
    preferredPaymentMethod: 'Credit Card',
    typicalMaterials: ['SA-36', 'SA-516-70', '304L'],
    industryCategory: 'Industrial Contractor'
  }
];

// All Possible Variation Enums
export const ALL_NPS_SIZES = [
  '1/2"', '3/4"', '1"', '1-1/4"', '1-1/2"', '2"', '2-1/2"', '3"', '4"',
  '6"', '8"', '10"', '12"', '14"', '16"', '18"', '20"', '24"'
] as const;

export const ALL_PRESSURE_CLASSES = [150, 300, 600, 900, 1500] as const;

export const ALL_MATERIAL_CODES = [
  'SA-36', 'SA-516-70', '304', '304L', '316L', 'AL-6061'
] as const;

export const ALL_THICKNESSES = [
  { label: '11 Gauge', thickness: 0.1196, fractionLabel: '11 Ga (0.120")' },
  { label: '1/8"', thickness: 0.125, fractionLabel: '1/8" (0.125")' },
  { label: '3/16"', thickness: 0.1875, fractionLabel: '3/16" (0.188")' },
  { label: '1/4"', thickness: 0.250, fractionLabel: '1/4" (0.250")' },
  { label: '5/16"', thickness: 0.3125, fractionLabel: '5/16" (0.313")' },
  { label: '3/8"', thickness: 0.375, fractionLabel: '3/8" (0.375")' },
  { label: '1/2"', thickness: 0.500, fractionLabel: '1/2" (0.500")' },
  { label: '5/8"', thickness: 0.625, fractionLabel: '5/8" (0.625")' },
  { label: '3/4"', thickness: 0.750, fractionLabel: '3/4" (0.750")' },
  { label: '7/8"', thickness: 0.875, fractionLabel: '7/8" (0.875")' },
  { label: '1"', thickness: 1.000, fractionLabel: '1" (1.000")' },
  { label: '1-1/8"', thickness: 1.125, fractionLabel: '1-1/8" (1.125")' },
  { label: '1-1/4"', thickness: 1.250, fractionLabel: '1-1/4" (1.250")' },
  { label: '1-3/8"', thickness: 1.375, fractionLabel: '1-3/8" (1.375")' },
  { label: '1-1/2"', thickness: 1.500, fractionLabel: '1-1/2" (1.500")' },
  { label: '1-5/8"', thickness: 1.625, fractionLabel: '1-5/8" (1.625")' },
  { label: '1-3/4"', thickness: 1.750, fractionLabel: '1-3/4" (1.750")' },
  { label: '1-7/8"', thickness: 1.875, fractionLabel: '1-7/8" (1.875")' },
  { label: '2"', thickness: 2.000, fractionLabel: '2" (2.000")' },
  { label: '2-1/4"', thickness: 2.250, fractionLabel: '2-1/4" (2.250")' },
  { label: '2-1/2"', thickness: 2.500, fractionLabel: '2-1/2" (2.500")' },
  { label: '3"', thickness: 3.000, fractionLabel: '3" (3.000")' },
] as const;

export const ALL_PAYMENT_METHODS = [
  'Net 30 Commercial PO',
  'Credit Card',
  'ACH Direct Debit'
] as const;

/**
 * Pre-engineered High-Quantity Turnaround Packages (Special Order / High-Tonnage / >$10k)
 */
export interface TurnaroundScenario {
  id: string;
  name: string;
  description: string;
  clientIndex: number;
  paymentMethod: string;
  isSpecialOrder: boolean;
  leadTime: string;
  items: Array<{
    nps: typeof ALL_NPS_SIZES[number];
    pressureClass: typeof ALL_PRESSURE_CLASSES[number];
    materialCode: typeof ALL_MATERIAL_CODES[number];
    thickness: number;
    thicknessLabel: string;
    quantity: number;
    handleStamp: string;
    requireMTR: boolean;
  }>;
}

export const LARGE_QTY_TURNAROUND_SCENARIOS: TurnaroundScenario[] = [
  {
    id: 'turnaround-dow-unit4',
    name: 'Major Ethylene Unit 4 Turnaround Package',
    description: '145x ASME B16.48 blinds for positive battery limit isolation during 30-day turnaround.',
    clientIndex: 0, // Dow Chemical Texas
    paymentMethod: 'Net 30 Commercial PO',
    isSpecialOrder: true,
    leadTime: '5-7 Business Days (Mill Plate Rolling & Multi-Sheet Nesting)',
    items: [
      { nps: '2"', pressureClass: 150, materialCode: 'SA-516-70', thickness: 0.25, thicknessLabel: '1/4"', quantity: 40, handleStamp: 'DOW-U4-ISO-01', requireMTR: true },
      { nps: '4"', pressureClass: 150, materialCode: 'SA-516-70', thickness: 0.375, thicknessLabel: '3/8"', quantity: 35, handleStamp: 'DOW-U4-ISO-02', requireMTR: true },
      { nps: '6"', pressureClass: 300, materialCode: 'SA-516-70', thickness: 0.50, thicknessLabel: '1/2"', quantity: 30, handleStamp: 'DOW-U4-ISO-03', requireMTR: true },
      { nps: '8"', pressureClass: 300, materialCode: 'SA-516-70', thickness: 0.625, thicknessLabel: '5/8"', quantity: 20, handleStamp: 'DOW-U4-ISO-04', requireMTR: true },
      { nps: '12"', pressureClass: 300, materialCode: 'SA-516-70', thickness: 0.875, thicknessLabel: '7/8"', quantity: 15, handleStamp: 'DOW-U4-ISO-05', requireMTR: true },
      { nps: '16"', pressureClass: 300, materialCode: 'SA-516-70', thickness: 1.125, thicknessLabel: '1-1/8"', quantity: 5, handleStamp: 'DOW-U4-ISO-06', requireMTR: true }
    ]
  },
  {
    id: 'refinery-p66-crude-flare',
    name: 'Crude Vacuum Unit & Flare Heavy Plate Package',
    description: 'Heavy plate blinds (up to 24" NPS / 2" thick) requiring dedicated mill master plate allocation.',
    clientIndex: 1, // Phillips 66 Sweeny
    paymentMethod: 'Net 30 Commercial PO',
    isSpecialOrder: true,
    leadTime: '7-10 Business Days (Dedicated Heavy Mill Plate)',
    items: [
      { nps: '10"', pressureClass: 600, materialCode: 'SA-516-70', thickness: 1.00, thicknessLabel: '1"', quantity: 15, handleStamp: 'P66-CRUDE-01', requireMTR: true },
      { nps: '14"', pressureClass: 300, materialCode: 'SA-516-70', thickness: 1.25, thicknessLabel: '1-1/4"', quantity: 12, handleStamp: 'P66-CRUDE-02', requireMTR: true },
      { nps: '18"', pressureClass: 300, materialCode: 'SA-516-70', thickness: 1.50, thicknessLabel: '1-1/2"', quantity: 8, handleStamp: 'P66-FLARE-01', requireMTR: true },
      { nps: '20"', pressureClass: 600, materialCode: 'SA-516-70', thickness: 1.875, thicknessLabel: '1-7/8"', quantity: 6, handleStamp: 'P66-FLARE-02', requireMTR: true },
      { nps: '24"', pressureClass: 300, materialCode: 'SA-516-70', thickness: 2.00, thicknessLabel: '2"', quantity: 4, handleStamp: 'P66-VAC-01', requireMTR: true }
    ]
  },
  {
    id: 'acid-basf-316l-alloy',
    name: 'Acid Plant Corrosive 316L Stainless Bulk Package',
    description: '85x 316L acid-grade paddle blinds for chlorine & sulfuric acid line turnaround.',
    clientIndex: 2, // BASF Verbund Texas
    paymentMethod: 'ACH Direct Debit',
    isSpecialOrder: true,
    leadTime: '5-7 Business Days (316L Plate Allocation & Stamping)',
    items: [
      { nps: '2"', pressureClass: 300, materialCode: '316L', thickness: 0.375, thicknessLabel: '3/8"', quantity: 30, handleStamp: 'BASF-ACID-01', requireMTR: true },
      { nps: '3"', pressureClass: 300, materialCode: '316L', thickness: 0.500, thicknessLabel: '1/2"', quantity: 25, handleStamp: 'BASF-ACID-02', requireMTR: true },
      { nps: '6"', pressureClass: 300, materialCode: '316L', thickness: 0.750, thicknessLabel: '3/4"', quantity: 20, handleStamp: 'BASF-ACID-03', requireMTR: true },
      { nps: '8"', pressureClass: 600, materialCode: '316L', thickness: 1.250, thicknessLabel: '1-1/4"', quantity: 10, handleStamp: 'BASF-ACID-04', requireMTR: true }
    ]
  },
  {
    id: 'mega-outage-turner-contractors',
    name: 'Contractor Mega-Turnaround Blanket Outage (300 Blinds)',
    description: 'High-volume contractor staging package of 300 paddle blinds across utility & hydrocarbon lines.',
    clientIndex: 10, // Turner Industries
    paymentMethod: 'Net 30 Commercial PO',
    isSpecialOrder: true,
    leadTime: '7-10 Business Days (Full Mill Plate Nesting)',
    items: [
      { nps: '1-1/2"', pressureClass: 150, materialCode: 'SA-36', thickness: 0.25, thicknessLabel: '1/4"', quantity: 80, handleStamp: 'TURNER-MRO-01', requireMTR: false },
      { nps: '3"', pressureClass: 150, materialCode: 'SA-516-70', thickness: 0.375, thicknessLabel: '3/8"', quantity: 70, handleStamp: 'TURNER-MRO-02', requireMTR: true },
      { nps: '4"', pressureClass: 300, materialCode: 'SA-516-70', thickness: 0.500, thicknessLabel: '1/2"', quantity: 60, handleStamp: 'TURNER-MRO-03', requireMTR: true },
      { nps: '6"', pressureClass: 150, materialCode: '304L', thickness: 0.500, thicknessLabel: '1/2"', quantity: 50, handleStamp: 'TURNER-MRO-04', requireMTR: true },
      { nps: '10"', pressureClass: 300, materialCode: 'SA-516-70', thickness: 0.750, thicknessLabel: '3/4"', quantity: 40, handleStamp: 'TURNER-MRO-05', requireMTR: true }
    ]
  }
];

/**
 * Pick a random element from an array
 */
export function pickRandom<T>(array: readonly T[] | T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate a random integer between min and max inclusive
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
