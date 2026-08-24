// src/types/index.ts
// Unified Canonical Type Definitions for Iron Prairie Fabrication Group LLC
// Supports Public B2B Storefront & Dedicated Desktop Operations Platform (ASME Section VIII Div 1 & ASME B16.48)

export type PressureClass = 150 | 300 | 600 | 900 | 1500;
export type MaterialCode = 'SA-36' | 'SA-516-70' | '304' | '304L' | '316L' | 'AL-6061';
export type FacingType = 'Flat Face (FF) - Standard (No Machining)' | 'Machined Gasket Finish (Special Order)';
export type ProductionStatus = 'queued' | 'plasma_cutting' | 'laser_cutting' | 'deburred_stamped' | 'ready_to_ship' | 'shipped';
export type PaymentMethodType = 'net30_po' | 'ach' | 'credit_card';

export type NPSSize =
  | '1/2"'
  | '3/4"'
  | '1"'
  | '1-1/4"'
  | '1-1/2"'
  | '2"'
  | '2-1/2"'
  | '3"'
  | '4"'
  | '6"'
  | '8"'
  | '10"'
  | '12"'
  | '14"'
  | '16"'
  | '18"'
  | '20"'
  | '24"';

// Legacy compatibility aliases
export type MaterialId = 'A516' | '304L' | '316L' | '6061' | MaterialCode;
export type KanbanStage = 'queued' | 'plasma' | 'laser' | 'deburred' | 'ready' | 'shipped' | ProductionStatus;

// 1. MATERIAL & GEOMETRY CONFIGURATION
export interface PricingConfig {
  globalMarkupPct: number;
  sa36PricePerLb: number;
  sa516PricePerLb: number;
  ss304PricePerLb: number;
  ss304LPricePerLb: number;
  ss316LPricePerLb: number;
  alPricePerLb: number;
  laborRatePerHour: number;
  baseHandlingFee: number;
  scrapMultiplier: number;
  hotShotEmergencyFee: number;
  laserGasRatePerInch?: number;
  plasmaGasRatePerInch?: number;
}

export interface MaterialConfig {
  code: MaterialCode;
  category: 'Carbon Steel' | 'Stainless Steel' | 'Aluminum';
  name: string;
  shortSpec: string;
  density1InchSqFt: number; // lbs/sq ft at 1 inch thickness
  densityLbPerCuIn: number; // lbs/cu in
  defaultPricePerLb: number;
  badge?: string;
  colorHex?: string;
}

export interface ThicknessOption {
  label: string;
  thickness: number; // in inches
  fractionLabel: string;
  isDefault?: boolean;
  description: string;
}

export interface FlangeSpec {
  od: number;
  boltCircle: number;
  boltSize: number;
  nominalThickness: number;
  thicknessLabel: string;
}

// 2. CONFIGURED ITEMS, ORDERS & CLIENT ACCOUNTS
export interface ConfiguredItem {
  id: string;
  partNumber: string;
  nps: string;
  nominalSizeInches: number;
  pressureClass: PressureClass;
  materialCode: MaterialCode;
  materialName: string;
  facing: FacingType;
  thickness: number;
  thicknessLabel: string;
  od: number;
  boltCircle: number;
  boltSize: number;
  actualWeightLbs: number;
  adjustedWeightLbs: number;
  unitPrice: number;
  quantity: number;
  handleStamp: string;
  requireMTR: boolean;
  addTHadle: boolean;
  addLiftingLug: boolean;
  addPlateDog: boolean;
  addWedge: boolean;
}

export interface CustomerOrder {
  orderId: string;
  orderSource: 'Website B2B' | 'Amazon Business' | 'Direct PO' | 'Shop Walk-In';
  createdAt: string;
  companyName: string;
  contactName: string;
  email: string;
  jobsiteAddress: string;
  poNumber: string;
  items: ConfiguredItem[];
  subtotal: number;
  shippingCost: number;
  hotShotFee: number;
  totalAmount: number;
  totalWeightLbs: number;
  shippingMethod: 'UPS Ground Parcel' | 'LTL Palletized Freight' | 'Emergency Hot Shot Courier' | 'Customer Will Call';
  isHotShot: boolean;
  isLargeOrder: boolean;
  leadTimeEstimate: string;
  paymentMethod: 'Credit Card' | 'ACH Direct Debit' | 'Net 30 Commercial PO';
  paymentStatus: 'Paid in Full' | 'ACH Clearing' | 'Net 30 Authorized';
  status: ProductionStatus;
  millHeatNumber: string;
  slabNumber?: string;
  assignedMtrId?: string;
  scheduledShipDate: string;
  carrierName: string;
  trackingNumber: string;
  notes?: string;
  costing?: JobCosting;
}

export interface ClientAccount {
  companyName: string;
  buyerName: string;
  email: string;
  facilityLocation: string;
  achAuthorized?: boolean;
}

export interface AbandonedCartRecord {
  cartId: string;
  abandonedAt: string;
  companyName: string;
  buyerName: string;
  email: string;
  phone: string;
  facilityLocation: string;
  items: ConfiguredItem[];
  subtotal: number;
  shippingEstimate: number;
  totalAmount: number;
  totalWeightLbs: number;
  status: 'Abandoned' | 'Quote Sent' | 'Recovered' | 'Dismissed';
  lastActiveStep: 'Cart Drawer' | 'Checkout Opened' | 'Payment Selection';
  quoteSentAt?: string;
}

// 3. ASME SECTION VIII DIV 1 MATERIAL TEST REPORT (MTR) & TRACEABILITY
export interface ChemicalComposition {
  carbon: number;
  manganese: number;
  phosphorus: number;
  sulfur: number;
  silicon: number;
  chromium?: number;
  nickel?: number;
  molybdenum?: number;
  copper?: number;
  vanadium?: number;
  columbium?: number;
  aluminum?: number;
  nitrogen?: number;
  carbonEquivalent: number;
}

export interface MechanicalProperties {
  tensileStrengthPsi: number;
  yieldStrengthPsi: number;
  elongationPct: number;
  reductionOfAreaPct?: number;
  hardnessBrinell?: number;
  charpyVNotch?: {
    temperatureF: number;
    ftLbs: number;
    orientation: 'Transverse' | 'Longitudinal';
  };
}

export interface MaterialTestReport {
  id: string;
  heatNumber: string;
  slabNumber?: string;
  certificateNumber: string;
  asmeSpec: string;
  astmSpec: string;
  materialCode: MaterialCode;
  materialGrade: string;
  heatTreatment: 'Normalized' | 'As-Rolled' | 'Solution Annealed' | 'T6 Heat Treated';
  plateThickness: number;
  thicknessLabel: string;
  plateWidthInches: number;
  plateLengthInches: number;
  masterPlateWeightLbs: number;
  steelMill: string;
  millLocation: string;
  supplierDistributor: string;
  countryOfMelt: string;
  buyAmericanCompliant: boolean;
  chemistry: ChemicalComposition;
  mechanical: MechanicalProperties;
  certifiedDate: string;
  qrCodePayload: string;
  permanentUrl: string;
  status: 'In Stock' | 'Allocated' | 'Depleted' | 'On Order';
  initialAreaSqIn: number;
  remainingAreaSqIn: number;
  allocatedOrders: string[];
  notes?: string;
}

// 4. SUPPLIER PURCHASE ORDERS & GAS INVENTORY
export interface SupplierPOItem {
  id: string;
  materialCode: MaterialCode;
  asmeSpec: string;
  thickness: number;
  thicknessLabel: string;
  widthInches: number;
  lengthInches: number;
  quantity: number;
  unitWeightLbs: number;
  totalWeightLbs: number;
  pricePerLb: number;
  totalCost: number;
}

export interface SupplierPO {
  poNumber: string;
  supplierName: string;
  supplierContact: string;
  supplierEmail: string;
  orderDate: string;
  requestedDeliveryDate: string;
  category: 'Master Steel Plate' | 'Plasma Assist Gas' | 'Laser Assist Gas' | 'Shop Consumables';
  items: SupplierPOItem[];
  totalAmount: number;
  status: 'Draft' | 'Sent to Vendor' | 'Confirmed' | 'Delivered' | 'Cancelled';
  deliveryStatus: string;
  requireMTR: boolean;
  destination: string;
  specialInstructions?: string;
}

export interface GasTankTelemetry {
  gasType: 'Liquid Nitrogen (LN2)' | 'Oxygen (O2 High-Purity)' | 'Compressed Air';
  supplier: string;
  tankCapacity: string;
  currentLevelPct: number;
  currentPsi: number;
  reorderThresholdPct: number;
  dailyConsumptionAvg: string;
  estimatedDaysRemaining: number;
  lastFillDate: string;
  tankLocation: string;
  status: 'Normal' | 'Reorder Warning' | 'Critical Low';
}

// 5. JOB COSTING & PROFITABILITY
export interface JobCosting {
  orderId: string;
  invoicedRevenue: number;
  materialPlateCost: number;
  laserAssistGasCost: number;
  plasmaAssistGasCost?: number;
  machineLaborCost: number;
  freightCost: number;
  totalCogs: number;
  netMarginDollars: number;
  netMarginPct: number;
  profitHealth: 'High Margin' | 'Healthy' | 'Low Margin' | 'Loss';
}

// 6. AMAZON B2B FEED
export interface AmazonFeedRow {
  feed_product_type: string;
  item_sku: string;
  brand_name: string;
  item_name: string;
  item_type: string;
  manufacturer: string;
  standard_price: number;
  quantity: number;
  bullet_point1: string;
  bullet_point2: string;
  bullet_point3: string;
  bullet_point4: string;
  bullet_point5: string;
  material_type: string;
  outer_diameter: string;
  thickness: string;
  pressure_rating: string;
  item_weight: number;
  item_weight_unit_of_measure: string;
  compliance_certification: string;
  country_of_origin: string;
}

export interface AddOnOption {
  id: 'tHandle' | 'liftingLug' | 'plateDogs' | 'fitUpWedges';
  name: string;
  price: number;
  unit: string;
  description: string;
  weightLbs: number;
}

export interface FlangeDimension {
  nps: NPSSize;
  sizeCode: string;
  od: number;
  boltCircle: number;
  boltSize: number;
  boltHoles: number;
  nominalThickness: number;
  thicknessFraction: string;
  handleLength: number;
  handleWidth: number;
}
