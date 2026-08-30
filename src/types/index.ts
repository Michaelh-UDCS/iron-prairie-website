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
  publicListBufferPct?: number;
  commercialDiscountPct?: number;
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
  baseMachiningSetupFee?: number;
  machiningRatePerInch?: number;
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
  addLockoutHole: boolean;
  addLiftingLug: boolean;
  addPlateDog: boolean;
  addWedge: boolean;
  blindType?: 'Paddle Blind' | 'Figure 8 (Spectacle Blind)' | 'Paddle Spacer' | 'Bleeder Blind';
  productType?: string;
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
  lastActiveStep: 'Cart Drawer' | 'Checkout Opened' | 'Payment Selection' | 'Stripe Checkout Cancelled';
  quoteSentAt?: string;
}

export type StorefrontCheckoutStatus = 'open' | 'cancelled' | 'expired' | 'completed' | 'paid';

export interface StorefrontCheckoutLine {
  partNumber: string;
  nps?: string | number;
  pressureClass?: string | number;
  material?: string;
  facing?: string;
  thickness?: string | number;
  quantity: number;
  unitPrice?: number;
  lineTotal?: number;
}

export interface StorefrontCheckoutRecord {
  id: string;
  orderRefId: string;
  stripeSessionId?: string;
  stripeStatus?: string;
  stripePaymentStatus?: string;
  status: StorefrontCheckoutStatus;
  companyName: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  deliveryAddress?: string;
  paymentType?: string;
  cartItems: StorefrontCheckoutLine[];
  itemsSubtotal?: number;
  shippingCost?: number;
  hotShotFee?: number;
  totalAmount: number;
  createdAt: string | null;
  updatedAt?: string | null;
  cancelledAt?: string | null;
  source?: string;
  sources?: string[];
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
  id: 'tHandle' | 'lockoutHole' | 'liftingLug' | 'plateDogs' | 'fitUpWedges';
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

// ============================================================================
// 7. COMPREHENSIVE ERP SYSTEM TYPES & DATA MODELS
// ============================================================================

export type ErpWorkOrderStage =
  | 'Order Received'
  | 'Material Staged & Heat Verified'
  | 'Laser / Plasma Cutting'
  | 'Machining & Deburring'
  | 'QA / QC & MTR Attached'
  | 'Packaged & Shipped'
  | 'Invoiced & Completed';

export interface ErpWorkOrder {
  jobNumber: string; // e.g. "IPG-WO-2026-0101"
  customerPoNumber: string;
  orderSource: 'Website B2B' | 'Sales Email Trigger' | 'Direct PO' | 'Shop Walk-In' | 'Amazon Business';
  createdAt: string;
  clientCompanyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  jobsiteAddress: string;
  projectName: string;
  items: ConfiguredItem[];
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
  stage: ErpWorkOrderStage;
  priority: 'Standard' | 'Urgent / Hot Shot' | 'Shutdown Outage';
  assignedTechnician: string;
  scheduledShipDate: string;
  carrierName: string;
  trackingNumber: string;
  allocatedHeatNumbers: string[];
  associatedMtrIds: string[];
  qcInspectionPassed: boolean;
  qcInspectorName?: string;
  qcSignOffDate?: string;
  notes?: string;
  drawingNumber?: string;
  drawingRev?: string;
  googleDriveFolderUrl?: string;
  costing?: JobCosting;
}

export interface SalesEmailTrigger {
  id: string;
  timestamp: string;
  senderEmail: string;
  senderName: string;
  subject: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  jobsiteAddress: string;
  poNumber: string;
  projectName: string;
  requestedDeliveryDate: string;
  isHotShot: boolean;
  rawBody: string;
  items: {
    partDescription: string;
    materialGrade: MaterialCode;
    nps: string;
    pressureClass: number;
    thicknessLabel: string;
    quantity: number;
    unitPrice: number;
  }[];
  totalAmount: number;
  status: 'New / Unprocessed' | 'Processed / Job Created' | 'Archived';
  generatedJobNumber?: string;
}

export type StockMaterialCategory =
  | 'Plate'
  | 'Pipe'
  | 'Structural Components'
  | 'Round Bar'
  | 'Flanges';

export interface StockMaterialItem {
  id: string;
  stockSku: string; // e.g. "STK-PLT-51670-0500-01"
  heatNumber: string; // e.g. "K49201-B"
  category: StockMaterialCategory;
  subType: string; // e.g. "PVQ Boiler Plate", "Schedule 80 Seamless", "Square Tubing 4x4x1/4", "W8x31 Beam", "Equal Leg Angle 3x3x3/8"
  materialCode: MaterialCode;
  materialGrade: string; // e.g. "ASME SA-516 Gr. 70"
  dimensions: {
    thicknessInches?: number;
    thicknessLabel?: string;
    widthInches?: number;
    lengthInches?: number;
    pipeNps?: string;
    pipeSchedule?: string;
    odInches?: number;
    wallThicknessInches?: number;
    weightPerFootLbs?: number;
  };
  quantityOnHand: number;
  allocatedQuantity: number;
  availableQuantity: number;
  unitOfMeasure: 'Plates' | 'Linear Ft' | 'Pcs' | 'Lbs' | 'Lengths';
  unitCost: number;
  minReorderThreshold: number;
  storageLocation: string; // e.g. "Rack A-12 (Bay 1)", "Outdoor Pipe Yard - Stanchion 4", "Plate Tree #2"
  millSupplier: string;
  countryOfMelt: string;
  linkedMtrId?: string;
  allocatedJobNumbers: string[];
}

export interface SupplierProfile {
  id: string;
  name: string;
  category: 'Steel Plate & Pipe Mill' | 'Structural Distributor' | 'Laser / Plasma Gas' | 'Consumables & Hardware' | 'Outside Machining / NDT';
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: 'Net 30' | 'Net 15' | 'Credit Card' | 'Wire / ACH' | 'Prepaid';
  leadTimeAvgDays: number;
  isoCertified: boolean;
  notes?: string;
  rating: 1 | 2 | 3 | 4 | 5;
}

export interface ErpPurchaseOrder {
  poNumber: string; // e.g. "IPG-PO-2026-0201"
  supplierId: string;
  supplierName: string;
  category: 'Raw Steel Plate' | 'Pipe & Flanges' | 'Structural Shapes' | 'Laser Assist Gas' | 'Shop Consumables';
  orderDate: string;
  requestedDeliveryDate: string;
  paymentTerms: string;
  items: {
    id: string;
    description: string;
    materialCode?: MaterialCode;
    dimensions?: string;
    quantity: number;
    unitOfMeasure: string;
    unitPrice: number;
    totalPrice: number;
    expectedHeatNumber?: string;
    targetJobNumber?: string;
    receivedQuantity: number;
  }[];
  subtotal: number;
  taxAmount: number;
  freightAmount: number;
  totalAmount: number;
  status: 'Draft' | 'Issued to Vendor' | 'Confirmed' | 'Partially Received' | 'Received & Fulfilled' | 'Cancelled';
  deliveryStatus: 'Pending' | 'Shipped / In Transit' | 'Received On Floor';
  carrierTracking?: string;
  destination: string;
  specialInstructions?: string;
  approvedBy: string;
  googleDrivePoUrl?: string;
}

export interface NcrRecord {
  ncrNumber: string; // e.g. "IPG-NCR-2026-001"
  dateLogged: string;
  linkedJobNumber?: string;
  partNumber?: string;
  heatNumber?: string;
  source: 'Internal Laser Cutting' | 'Machining Shop' | 'Receiving Inspection' | 'Customer Return' | 'Final QC';
  defectCategory: 'Dimensional Out of Tolerance' | 'Material Surface Flaw' | 'Laser Kerf / Taper' | 'Bevel Angle Incorrect' | 'Missing MTR / Traceability' | 'Damage in Transit';
  severity: 'Minor (Reworkable)' | 'Major (Scrap Required)' | 'Critical';
  defectDescription: string;
  rootCauseAnalysis: string;
  disposition: 'Scrap' | 'Rework to Spec' | 'Return to Supplier' | 'Use As-Is (Engineer Approval)';
  correctiveAction: string;
  preventiveAction: string;
  assignedPerson: string;
  targetClosureDate: string;
  qaManagerSignOff: boolean;
  qaManagerName?: string;
  closureDate?: string;
  status: 'Open' | 'Under Review' | 'CAPA Implemented' | 'Closed';
  photoUrls?: string[];
}

export interface ErpInvoice {
  invoiceNumber: string; // e.g. "IPG-INV-2026-0501" or "BILL-SSS-2026-88"
  type: 'AR_Invoice' | 'AP_Bill';
  counterpartyName: string; // Client Name for AR, Supplier for AP
  linkedJobNumber?: string;
  linkedPoNumber?: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  freight: number;
  tax: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  paymentTerms: 'Net 30' | 'Net 15' | 'Due on Receipt' | 'Credit Card' | 'ACH';
  paymentStatus: 'Draft' | 'Sent / Pending Payment' | 'Partially Paid' | 'Paid in Full' | 'Overdue';
  agingBucket: 'Current' | '1-30 Days' | '31-60 Days' | '60+ Days Overdue';
  paymentMethodUsed?: string;
  notes?: string;
}

export interface DocControlItem {
  id: string;
  docNumber: string; // e.g. "DWG-IPG-2026-042"
  title: string;
  category: 'CAD Drawing (DWG/DXF)' | 'Fabrication Blueprint (PDF)' | 'WPS/PQR Procedure' | 'Inspection Report' | 'Customer Spec Sheet';
  revision: string; // e.g. "Rev 0", "Rev A", "Rev B"
  linkedJobNumber?: string;
  clientName?: string;
  fileFormat: 'DWG' | 'DXF' | 'PDF' | 'STEP' | 'DOCX';
  fileSizeMb: number;
  googleDriveUrl: string;
  uploadDate: string;
  uploadedBy: string;
  approvedBy: string;
  status: 'Active / Approved for Cutting' | 'Pending Engineering Review' | 'Superseded / Obsolete';
  tags: string[];
}

export interface ErpBackupSnapshot {
  version: string;
  timestamp: string;
  shopLocation: string;
  workOrders: ErpWorkOrder[];
  mtrDatabase: MaterialTestReport[];
  stockInventory: StockMaterialItem[];
  purchaseOrders: ErpPurchaseOrder[];
  ncrRecords: NcrRecord[];
  invoices: ErpInvoice[];
  docControlItems: DocControlItem[];
  suppliers: SupplierProfile[];
  clients: ClientAccount[];
  salesEmailTriggers: SalesEmailTrigger[];
}

export interface ErpModuleDefinition {
  id: string;
  name: string;
  category: 'Operations' | 'Quality & Materials' | 'Supply Chain & Finance' | 'Engineering & System';
  description: string;
  iconName: string;
  badgeCount?: number;
  isCustom?: boolean;
  enabled: boolean;
}

