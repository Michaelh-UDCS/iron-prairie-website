import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Projects from './pages/Projects.jsx';
import WomanOwned from './pages/WomanOwned.jsx';
import Contact from './pages/Contact.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsOfService from './pages/TermsOfService.jsx';
import NotFound from './pages/NotFound.jsx';
import PublicMtrViewer from './pages/PublicMtrViewer';
import { OperationsApp } from './operations/OperationsApp';
import { OperationsAuthGate } from './operations/OperationsAuthGate';
import brandLogo from '../Logo.jpg';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  X,
  Truck,
  ShieldCheck,
  FileText,
  Lock,
  Unlock,
  ArrowRight,
  Scale,
  Layers,
  Printer,
  Download,
  Copy,
  Flame,
  CheckCircle2,
  PackageCheck,
  Factory,
  Settings,
  DollarSign,
  TrendingUp,
  Percent,
  RefreshCw,
  UserCheck,
  LogIn,
  LogOut,
  Zap,
  CreditCard,
  Building,
  Clock,
  FileCheck,
  Menu,
  Phone,
  Mail,
  ChevronRight,
  BarChart3,
  PieChart,
  AlertCircle,
  Send,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Eye,
  Play,
  Share2,
  SlidersHorizontal
} from 'lucide-react';
import {
  INDUSTRIAL_TEST_CLIENTS,
  ALL_NPS_SIZES,
  ALL_PRESSURE_CLASSES,
  ALL_MATERIAL_CODES,
  ALL_THICKNESSES,
  ALL_PAYMENT_METHODS,
  pickRandom,
  randomInt,
  IndustrialClientProfile,
  LARGE_QTY_TURNAROUND_SCENARIOS
} from './data/testClientsData';
import {
  OWNER_NOTIFICATION_RECIPIENTS,
  triggerOrderEmailNotification,
  generateOrderEmailText,
  generateOrderEmailHtml,
  generateOrderMailtoUrl,
  generateAbandonedCartQuoteEmail,
  getEmailDispatchLogs,
  EmailNotificationRecord,
  IPG_SALES_EMAIL
} from './services/emailService';
import { RapidMatrixOrderGrid } from './components/RapidMatrixOrderGrid';
import { InstantProposalModal } from './components/InstantProposalModal';
import { BulkListRfqModal } from './components/BulkListRfqModal';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// ============================================================================
// 1. DATA TYPES & INTERFACES
// ============================================================================
type PressureClass = 150 | 300 | 600 | 900 | 1500;
type MaterialCode = 'SA-36' | 'SA-516-70' | '304' | '304L' | '316L' | 'AL-6061';
type FacingType = 'Flat Face (FF) - Standard (No Machining)' | 'Machined Gasket Finish (Special Order)';
type ProductionStatus = 'queued' | 'plasma_cutting' | 'deburred_stamped' | 'ready_to_ship' | 'shipped';
type PaymentMethodType = 'credit_card' | 'ach' | 'net30_po';

interface PricingConfig {
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
  baseMachiningSetupFee?: number;
  machiningRatePerInch?: number;
}

interface MaterialConfig {
  code: MaterialCode;
  category: 'Carbon Steel' | 'Stainless Steel' | 'Aluminum';
  name: string;
  shortSpec: string;
  density1InchSqFt: number;
  defaultPricePerLb: number;
  badge?: string;
}

interface FlangeSpec {
  od: number;
  boltCircle: number;
  boltSize: number;
  nominalThickness: number;
  thicknessLabel: string;
}

interface ConfiguredItem {
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

interface CustomerOrder {
  orderId: string;
  orderSource: 'Website B2B' | 'Amazon Business' | 'Direct PO';
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
  shippingMethod: 'UPS Ground Parcel' | 'LTL Palletized Freight' | 'Emergency Hot Shot Courier';
  isHotShot: boolean;
  isLargeOrder: boolean;
  leadTimeEstimate: string;
  paymentMethod: 'Credit Card' | 'ACH Direct Debit' | 'Net 30 Commercial PO';
  paymentStatus: 'Paid in Full' | 'ACH Clearing' | 'Net 30 Authorized';
  status: ProductionStatus;
  millHeatNumber: string;
  scheduledShipDate: string;
  carrierName: string;
  trackingNumber: string;
}

interface ClientAccount {
  companyName: string;
  buyerName: string;
  email: string;
  facilityLocation: string;
  achAuthorized?: boolean;
}

interface AbandonedCartRecord {
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

// ============================================================================
// 2. MASTER FLANGE GEOMETRY & BASELINE CONFIGURATION (ASME B16.48)
// ============================================================================
const DEFAULT_PRICING_CONFIG: PricingConfig = {
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
};

const ACCESSORY_PRICES = {
  tHandlePrice: 5.00,
  lockoutHolePrice: 5.00,
  liftingLugPrice: 34.00,
  plateDogPrice: 35.00,
  fitUpWedgePrice: 34.00,
};

const MATERIALS: Record<MaterialCode, MaterialConfig> = {
  'SA-36': {
    code: 'SA-36',
    category: 'Carbon Steel',
    name: 'Carbon Steel SA-36 (Structural Plate)',
    shortSpec: 'ASME SA-36 / ASTM A36',
    density1InchSqFt: 40.84,
    defaultPricePerLb: 1.85,
    badge: 'Utility / Line Testing',
  },
  'SA-516-70': {
    code: 'SA-516-70',
    category: 'Carbon Steel',
    name: 'Carbon Steel SA-516 Gr. 70 (PVQ Pressure Vessel)',
    shortSpec: 'ASME SA-516 Gr. 70 (PVQ Boiler)',
    density1InchSqFt: 40.84,
    defaultPricePerLb: 2.15,
    badge: 'Standard Refinery Spec',
  },
  '304': {
    code: '304',
    category: 'Stainless Steel',
    name: 'Stainless Steel 304 (Commercial Grade)',
    shortSpec: 'ASTM A240 304 Commercial',
    density1InchSqFt: 42.665,
    defaultPricePerLb: 5.50,
    badge: 'Commercial SS',
  },
  '304L': {
    code: '304L',
    category: 'Stainless Steel',
    name: 'Stainless Steel 304/304L (Dual-Certified Low Carbon)',
    shortSpec: 'ASTM A240 304/304L Dual-Cert',
    density1InchSqFt: 42.665,
    defaultPricePerLb: 5.95,
    badge: 'Dual Certified SS',
  },
  '316L': {
    code: '316L',
    category: 'Stainless Steel',
    name: 'Stainless Steel 316L (Acid & Marine Refinery Grade)',
    shortSpec: 'ASTM A240 316L Moly Acid Grade',
    density1InchSqFt: 43.15,
    defaultPricePerLb: 7.40,
    badge: 'Chemical / Marine SS',
  },
  'AL-6061': {
    code: 'AL-6061',
    category: 'Aluminum',
    name: 'Aluminum 6061-T6 (Structural Industrial Plate)',
    shortSpec: 'ASTM B209 6061-T6 High Strength',
    density1InchSqFt: 14.39,
    defaultPricePerLb: 5.00,
    badge: 'Lightweight Industrial',
  },
};

interface ThicknessOption {
  label: string;
  thickness: number; // in inches
  fractionLabel: string;
  isDefault?: boolean;
  description: string;
}

const THICKNESS_OPTIONS: ThicknessOption[] = [
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

const NPS_SIZES = [
  '1/2"', '3/4"', '1"', '1-1/4"', '1-1/2"', '2"', '2-1/2"', '3"', '4"',
  '6"', '8"', '10"', '12"', '14"', '16"', '18"', '20"', '24"'
];

const MASTER_GEOMETRY: Record<PressureClass, Record<string, FlangeSpec>> = {
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

const LABOR_HOURS: Record<string, number> = {
  '1/2"': 0.35, '3/4"': 0.35, '1"': 0.35, '1-1/4"': 0.35, '1-1/2"': 0.35,
  '2"': 0.35, '2-1/2"': 0.35, '3"': 0.35, '4"': 0.35, '6"': 0.35,
  '8"': 0.35, '10"': 0.35, '12"': 0.38, '14"': 0.42, '16"': 0.47,
  '18"': 0.52, '20"': 0.56, '24"': 0.61
};

// Dynamic JobTrax Calculation with Granular Metallurgy & Custom Thickness Engine
function getVariableMachiningCost(od: number, pricing: PricingConfig): number {
  const setup = pricing.baseMachiningSetupFee ?? 25.00;
  const rate = pricing.machiningRatePerInch ?? 9.50;
  return Math.round(setup + (od * rate));
}

function calculateDynamicBlindPrice(
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

  // Real thickness physics calculation (lbs)
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
  
  // Variable machining cost based on OD (Figure 8 has dual faces)
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

// Initial Mock Orders Seed for Owner Kanban
const INITIAL_ORDERS: CustomerOrder[] = [
  {
    orderId: 'PO-2026-8849',
    orderSource: 'Website B2B',
    createdAt: '2026-08-20 08:30 AM',
    companyName: 'Dow Chemical (Texas Plant B)',
    contactName: 'Mark Henderson (Turnaround Lead)',
    email: 'm.henderson@dow.com',
    jobsiteAddress: 'Plant Gate 14 Receiving, TX 77531',
    poNumber: 'PO-DOW-TX-88492',
    items: [
      {
        id: 'ITEM-1',
        partNumber: 'PB516-CX150T11GA4',
        nps: '4"',
        nominalSizeInches: 4,
        pressureClass: 150,
        materialCode: 'SA-516-70',
        materialName: 'Carbon Steel SA-516 Gr. 70 (PVQ Pressure Vessel)',
        facing: 'Flat Face (FF) - Standard (No Machining)',
        thickness: 0.1196,
        thicknessLabel: '11 Gauge (0.120")',
        od: 6.75,
        boltCircle: 7.50,
        boltSize: 0.625,
        actualWeightLbs: 1.69,
        adjustedWeightLbs: 2.37,
        unitPrice: 45.00,
        quantity: 4,
        handleStamp: 'UNIT-4-ISO-01',
        requireMTR: true,
        addTHadle: true,
        addLockoutHole: true,
        addLiftingLug: false,
        addPlateDog: false,
        addWedge: false,
      }
    ],
    subtotal: 176.00,
    shippingCost: 35.00,
    hotShotFee: 0,
    totalAmount: 211.00,
    totalWeightLbs: 8.5,
    shippingMethod: 'UPS Ground Parcel',
    isHotShot: false,
    isLargeOrder: false,
    leadTimeEstimate: '⚡ Standard Next-Day In-Stock Plate Dispatch (Within 24 Hours)',
    paymentMethod: 'Net 30 Commercial PO',
    paymentStatus: 'Net 30 Authorized',
    status: 'queued',
    millHeatNumber: 'Pending Assignment',
    scheduledShipDate: '2026-08-21',
    carrierName: 'UPS Ground',
    trackingNumber: 'PENDING-LABEL',
  },
  {
    orderId: 'HOT-2026-9901',
    orderSource: 'Website B2B',
    createdAt: '2026-08-20 01:10 PM',
    companyName: 'Phillips 66 Sweeny Refinery',
    contactName: 'Brian Kowalski (Turnaround Emergency)',
    email: 'b.kowalski@p66.com',
    jobsiteAddress: 'Highway 35, Gate 3, Old Ocean, TX 77463',
    poNumber: 'P66-HOT-9901',
    items: [
      {
        id: 'ITEM-HOT-1',
        partNumber: 'PB304L-CX300T1/2S6',
        nps: '6"',
        nominalSizeInches: 6,
        pressureClass: 300,
        materialCode: '304L',
        materialName: 'Stainless Steel 304/304L (Dual-Certified Low Carbon)',
        facing: 'Flat Face (FF) - Standard (No Machining)',
        thickness: 0.500,
        thicknessLabel: '1/2" (0.500")',
        od: 9.745,
        boltCircle: 10.62,
        boltSize: 0.750,
        actualWeightLbs: 16.57,
        adjustedWeightLbs: 23.21,
        unitPrice: 245.00,
        quantity: 2,
        handleStamp: 'EMERGENCY-BLIND',
        requireMTR: true,
        addTHadle: true,
        addLiftingLug: false,
        addPlateDog: false,
        addWedge: false,
      }
    ],
    subtotal: 490.00,
    shippingCost: 75.00,
    hotShotFee: 250.00,
    totalAmount: 815.00,
    totalWeightLbs: 46.5,
    shippingMethod: 'Emergency Hot Shot Courier',
    isHotShot: true,
    isLargeOrder: false,
    leadTimeEstimate: '🔥 HOT SHOT 2-4 Hr Emergency Burn & Dispatch',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid in Full',
    status: 'plasma_cutting',
    millHeatNumber: 'K49201-B (Outokumpu 304L)',
    scheduledShipDate: '2026-08-20 (TODAY)',
    carrierName: 'Iron Prairie Hot-Shot Courier',
    trackingNumber: 'HOT-SHOT-DIRECT-TRUCK',
  },
  {
    orderId: 'PO-2026-8852',
    orderSource: 'Website B2B',
    createdAt: '2026-08-19 11:00 AM',
    companyName: 'BASF Texas Verbund Site',
    contactName: 'David R. Vance',
    email: 'david.vance@basf.com',
    jobsiteAddress: '602 Copper Rd, Plant Gate 2, TX 77531',
    poNumber: 'BASF-PO-88520',
    items: [
      {
        id: 'ITEM-3',
        partNumber: 'PBSA36-CX150T3/8S8',
        nps: '8"',
        nominalSizeInches: 8,
        pressureClass: 150,
        materialCode: 'SA-36',
        materialName: 'Carbon Steel SA-36 (Structural Plate)',
        facing: 'Flat Face (FF) - Standard (No Machining)',
        thickness: 0.375,
        thicknessLabel: '3/8" (0.375")',
        od: 10.875,
        boltCircle: 11.75,
        boltSize: 0.750,
        actualWeightLbs: 9.88,
        adjustedWeightLbs: 13.84,
        unitPrice: 185.00,
        quantity: 1,
        handleStamp: 'TEST-BLIND-08',
        requireMTR: false,
        addTHadle: false,
        addLiftingLug: true,
        addPlateDog: false,
        addWedge: false,
      }
    ],
    subtotal: 185.00,
    shippingCost: 32.00,
    hotShotFee: 0,
    totalAmount: 217.00,
    totalWeightLbs: 14.0,
    shippingMethod: 'UPS Ground Parcel',
    isHotShot: false,
    isLargeOrder: false,
    leadTimeEstimate: '⚡ Standard Next-Day In-Stock Plate Dispatch',
    paymentMethod: 'ACH Direct Debit',
    paymentStatus: 'ACH Clearing',
    status: 'deburred_stamped',
    millHeatNumber: 'M7782-A (Nucor A516-70)',
    scheduledShipDate: '2026-08-20',
    carrierName: 'UPS Ground',
    trackingNumber: '1Z8888888888888888',
  },
  {
    orderId: 'PO-2026-8840',
    orderSource: 'Direct PO',
    createdAt: '2026-08-18 04:00 PM',
    companyName: 'Olin Chlor-Alkali Operations',
    contactName: 'William Arzola',
    email: 'w.arzola@olin.com',
    jobsiteAddress: 'Brazos River Works, TX 77531',
    poNumber: 'OLIN-PO-99120',
    items: [
      {
        id: 'ITEM-4',
        partNumber: 'PB316L-CX150T11GA2',
        nps: '2"',
        nominalSizeInches: 2,
        pressureClass: 150,
        materialCode: '316L',
        materialName: 'Stainless Steel 316L (Acid & Marine Refinery Grade)',
        facing: 'Flat Face (FF) - Standard (No Machining)',
        thickness: 0.1196,
        thicknessLabel: '11 Gauge (0.120")',
        od: 4.00,
        boltCircle: 4.75,
        boltSize: 0.625,
        actualWeightLbs: 0.43,
        adjustedWeightLbs: 0.60,
        unitPrice: 52.00,
        quantity: 10,
        handleStamp: 'OLIN-UNIT-2',
        requireMTR: true,
        addTHadle: true,
        addLockoutHole: false,
        addLiftingLug: false,
        addPlateDog: false,
        addWedge: false,
      }
    ],
    subtotal: 185.00,
    shippingCost: 32.00,
    hotShotFee: 0,
    totalAmount: 217.00,
    totalWeightLbs: 14.0,
    shippingMethod: 'UPS Ground Parcel',
    isHotShot: false,
    isLargeOrder: false,
    leadTimeEstimate: '⚡ Standard Next-Day In-Stock Plate Dispatch',
    paymentMethod: 'ACH Direct Debit',
    paymentStatus: 'ACH Clearing',
    status: 'deburred_stamped',
    millHeatNumber: 'M7782-A (Nucor A516-70)',
    scheduledShipDate: '2026-08-20',
    carrierName: 'UPS Ground',
    trackingNumber: '1Z8888888888888888',
  },
  {
    orderId: 'PO-2026-8840',
    orderSource: 'Direct PO',
    createdAt: '2026-08-18 04:00 PM',
    companyName: 'Olin Chlor-Alkali Operations',
    contactName: 'William Arzola',
    email: 'w.arzola@olin.com',
    jobsiteAddress: 'Brazos River Works, TX 77531',
    poNumber: 'OLIN-PO-99120',
    items: [
      {
        id: 'ITEM-4',
        partNumber: 'PBCS-CX150T1/8S2',
        nps: '2"',
        nominalSizeInches: 2,
        pressureClass: 150,
        materialCode: 'CS',
        materialName: 'Carbon Steel (A516 Gr. 70)',
        facing: 'Flat Face (FF) - Standard (No Machining)',
        thickness: 0.125,
        thicknessLabel: '1/8"',
        od: 4.00,
        boltCircle: 4.75,
        boltSize: 0.625,
        actualWeightLbs: 0.45,
        adjustedWeightLbs: 0.62,
        unitPrice: 42.00,
        quantity: 10,
        handleStamp: 'OLIN-UNIT-2',
        requireMTR: true,
        addTHadle: true,
        addLiftingLug: false,
        addPlateDog: false,
        addWedge: false,
      }
    ],
    subtotal: 420.00,
    shippingCost: 28.00,
    hotShotFee: 0,
    totalAmount: 448.00,
    totalWeightLbs: 6.5,
    shippingMethod: 'UPS Ground Parcel',
    isHotShot: false,
    isLargeOrder: false,
    leadTimeEstimate: '⚡ Standard Next-Day In-Stock Plate Dispatch',
    paymentMethod: 'Net 30 Commercial PO',
    paymentStatus: 'Net 30 Authorized',
    status: 'ready_to_ship',
    millHeatNumber: 'M7782-A (Nucor A516-70)',
    scheduledShipDate: '2026-08-20',
    carrierName: 'UPS Ground',
    trackingNumber: '1Z7777777777777777',
  }
];

// Initial Abandoned Carts Seed for Owner Recovery Tracking
const INITIAL_ABANDONED_CARTS: AbandonedCartRecord[] = [
  {
    cartId: 'ABANDON-2026-1042',
    abandonedAt: '2026-08-20 02:45 PM',
    companyName: 'ExxonMobil Baytown Complex',
    buyerName: 'Travis Hollingsworth (Turnaround Planner)',
    email: 'travis.hollingsworth@exxonmobil.com',
    phone: '(281) 834-4000',
    facilityLocation: 'Baytown, TX',
    items: [
      {
        id: 'ITEM-AB-1',
        partNumber: 'PB316L-CX300T5/8S8',
        nps: '8"',
        nominalSizeInches: 8,
        pressureClass: 300,
        materialCode: '316L',
        materialName: 'Stainless Steel 316L (Acid & Marine Refinery Grade)',
        facing: 'Flat Face (FF) - Standard (No Machining)',
        thickness: 0.625,
        thicknessLabel: '5/8" (0.625")',
        od: 12.00,
        boltCircle: 13.00,
        boltSize: 0.875,
        actualWeightLbs: 23.15,
        adjustedWeightLbs: 32.41,
        unitPrice: 370.00,
        quantity: 4,
        handleStamp: 'UNIT-HYDRO-08',
        requireMTR: true,
        addTHadle: true,
        addLiftingLug: true,
        addPlateDog: false,
        addWedge: false,
      }
    ],
    subtotal: 1480.00,
    shippingEstimate: 145.00,
    totalAmount: 1625.00,
    totalWeightLbs: 92.6,
    status: 'Abandoned',
    lastActiveStep: 'Checkout Opened'
  },
  {
    cartId: 'ABANDON-2026-1038',
    abandonedAt: '2026-08-20 11:20 AM',
    companyName: 'LyondellBasell Channelview Complex',
    buyerName: 'Sarah Jenkins',
    email: 's.jenkins@lyondellbasell.com',
    phone: '(281) 452-8888',
    facilityLocation: 'Channelview, TX',
    items: [
      {
        id: 'ITEM-AB-2',
        partNumber: 'PBSA51670-CX150T1/2S12',
        nps: '12"',
        nominalSizeInches: 12,
        pressureClass: 150,
        materialCode: 'SA-516-70',
        materialName: 'Carbon Steel SA-516 Gr. 70 (PVQ Pressure Vessel)',
        facing: 'Flat Face (FF) - Standard (No Machining)',
        thickness: 0.500,
        thicknessLabel: '1/2" (0.500")',
        od: 16.00,
        boltCircle: 17.00,
        boltSize: 0.875,
        actualWeightLbs: 28.50,
        adjustedWeightLbs: 39.90,
        unitPrice: 395.00,
        quantity: 2,
        handleStamp: 'LYB-ISO-12',
        requireMTR: true,
        addTHadle: false,
        addLiftingLug: true,
        addPlateDog: false,
        addWedge: false,
      }
    ],
    subtotal: 790.00,
    shippingEstimate: 95.00,
    totalAmount: 885.00,
    totalWeightLbs: 57.0,
    status: 'Abandoned',
    lastActiveStep: 'Cart Drawer'
  },
  {
    cartId: 'ABANDON-2026-1029',
    abandonedAt: '2026-08-19 04:15 PM',
    companyName: 'Chevron Phillips Chemical (Cedar Bayou)',
    buyerName: 'Craig M. Douglas',
    email: 'douglacm@cpchem.com',
    phone: '(281) 421-6500',
    facilityLocation: 'Baytown, TX',
    items: [
      {
        id: 'ITEM-AB-3',
        partNumber: 'PB304L-CX600T3/8S3',
        nps: '3"',
        nominalSizeInches: 3,
        pressureClass: 600,
        materialCode: '304L',
        materialName: 'Stainless Steel 304/304L (Dual-Certified Low Carbon)',
        facing: 'Flat Face (FF) - Standard (No Machining)',
        thickness: 0.375,
        thicknessLabel: '3/8" (0.375")',
        od: 5.745,
        boltCircle: 6.62,
        boltSize: 0.750,
        actualWeightLbs: 3.95,
        adjustedWeightLbs: 5.53,
        unitPrice: 135.00,
        quantity: 6,
        handleStamp: 'CPCHEM-ISO-03',
        requireMTR: true,
        addTHadle: true,
        addLiftingLug: false,
        addPlateDog: false,
        addWedge: false,
      }
    ],
    subtotal: 810.00,
    shippingEstimate: 45.00,
    totalAmount: 855.00,
    totalWeightLbs: 23.7,
    status: 'Quote Sent',
    lastActiveStep: 'Payment Selection'
  }
];

// ============================================================================
// ============================================================================
// 2.5 INTERACTIVE 2D/3D CAD PADDLE BLIND & T-HANDLE VISUALIZER
// ============================================================================
function PaddleBlindVisualizer({
  nps,
  pressureClass,
  materialCode,
  thicknessLabel,
  facing,
  handleStamp,
  addTHadle,
  addLiftingLug,
  od,
  thickness,
  addLockoutHole = false,
  blindType = 'Paddle Blind'
}: {
  nps: string;
  pressureClass: PressureClass;
  materialCode: MaterialCode;
  thicknessLabel: string;
  facing: FacingType;
  handleStamp: string;
  addTHadle: boolean;
  addLiftingLug: boolean;
  od: number;
  thickness: number;
  addLockoutHole?: boolean;
  blindType?: 'Paddle Blind' | 'Figure 8 (Spectacle Blind)' | 'Paddle Spacer' | 'Bleeder Blind';
}) {
  const isFigure8 = blindType === 'Figure 8 (Spectacle Blind)';

  // Realistic metallic gradients and shader palettes
  let metalShader = {
    fill: 'url(#metal-sa516)',
    edge: '#1e293b',
    specular: '#64748b',
    border: '#334155',
    stampingColor: '#1e293b',
    specText: 'ASME SA-516 Gr. 70 (PVQ Plate)',
    densityLabel: '0.284 lb/in³ Domestic Boiler Plate'
  };

  if (materialCode === 'SA-36') {
    metalShader = {
      fill: 'url(#metal-sa36)',
      edge: '#334155',
      specular: '#94a3b8',
      border: '#475569',
      stampingColor: '#0f172a',
      specText: 'ASME SA-36 / ASTM A36 Carbon Steel',
      densityLabel: '0.284 lb/in³ Structural Carbon'
    };
  } else if (materialCode === '304' || materialCode === '304L') {
    metalShader = {
      fill: 'url(#metal-ss304)',
      edge: '#64748b',
      specular: '#f8fafc',
      border: '#94a3b8',
      stampingColor: '#334155',
      specText: 'ASTM A240 304/304L Dual-Cert Stainless',
      densityLabel: '0.290 lb/in³ Low-Carbon Austenitic'
    };
  } else if (materialCode === '316L') {
    metalShader = {
      fill: 'url(#metal-ss316)',
      edge: '#64748b',
      specular: '#ffffff',
      border: '#94a3b8',
      stampingColor: '#1e293b',
      specText: 'ASTM A240 316L Acid/Marine Stainless',
      densityLabel: '0.290 lb/in³ Molybdenum Corrosion Res.'
    };
  } else if (materialCode === 'AL-6061') {
    metalShader = {
      fill: 'url(#metal-al6061)',
      edge: '#94a3b8',
      specular: '#ffffff',
      border: '#cbd5e1',
      stampingColor: '#475569',
      specText: 'ASTM B209 6061-T6 High-Strength Aluminum',
      densityLabel: '0.098 lb/in³ Light Alloy Plate'
    };
  }

  // Geometry calculations
  const centerX = 200;
  const centerY = isFigure8 ? 195 : 250;
  const radius = isFigure8
    ? Math.min(68, Math.max(40, (od / 24) * 35 + 32))
    : Math.min(85, Math.max(50, (od / 24) * 45 + 40));
  const handleWidth = Math.max(28, Math.min(42, (od * 0.25) * 8 + 20));
  const handleLength = Math.max(90, Math.min(130, (od * 0.25) * 10 + 75));
  const handleTopY = centerY - radius - handleLength + 30;

  // Figure 8 offsets
  const f8Disc1Y = centerY - radius * 0.82;
  const f8Disc2Y = centerY + radius * 0.82;
  const f8BridgeWidth = Math.max(30, handleWidth * 1.1);

  // T-Handle Integral Crossbar parameters (Monolithic CNC Cut-out - No Welds)
  const tHandleSpan = Math.max(120, Math.min(180, handleWidth * 3.8));
  const tHandleThick = 24;
  const tHandleLeft = centerX - tHandleSpan / 2;
  const tHandleRight = centerX + tHandleSpan / 2;
  const tHandleY = handleTopY - 4;

  // Center Lockout Hole Position (in center of handle stem)
  const lockoutHoleY = (handleTopY + (centerY - radius)) / 2;

  // Lifting Lug parameters
  const lugTopY = (addTHadle ? tHandleY : handleTopY) - 28;

  // 3D Extrusion offset based on thickness
  const extrudeOffset = Math.min(8, Math.max(3, thickness * 8 + 2));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header bar matching website theme */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sky-600 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
            {isFigure8 ? 'ASME B16.48 Figure 8 Spectacle Blind CAD Preview' : 'ASME B16.48 Live CAD Preview'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] bg-slate-100 text-sky-900 px-2.5 py-0.5 rounded-full border border-slate-200 font-bold">
          <span>{nps} NPS</span>
          <span className="text-slate-300">&bull;</span>
          <span>{pressureClass}#</span>
          <span className="text-slate-300">&bull;</span>
          <span>{materialCode}</span>
        </div>
      </div>

      {/* Clean Architectural Drafting Stage */}
      <div className="relative bg-slate-50/90 border border-slate-200 rounded-xl p-2 overflow-hidden flex items-center justify-center min-h-[340px]">
        
        {/* Subtle Engineering Watermark / Scale */}
        <div className="absolute top-2.5 left-3 text-[10px] font-mono text-slate-600 font-semibold tracking-wider flex items-center gap-1.5 pointer-events-none">
          <FileText className="h-3 w-3 text-slate-600" />
          <span>IRON PRAIRIE CNC PLASMA PROFILE &bull; 1:1 CAD GEOMETRY</span>
        </div>

        <div className="absolute top-2.5 right-3 flex flex-col gap-1 items-end pointer-events-none">
          {isFigure8 && (
            <div className="text-[10px] font-mono text-amber-950 font-extrabold bg-amber-100 border border-amber-300 px-2 py-0.5 rounded shadow-sm">
              ♾️ FIGURE 8 SPECTACLE (2x COST)
            </div>
          )}
          {addTHadle && (
            <div className="text-[10px] font-mono text-sky-950 font-extrabold bg-sky-100 border border-sky-300 px-2 py-0.5 rounded shadow-sm">
              ⚙️ INTEGRAL CNC CUT T-HANDLE
            </div>
          )}
          {addLockoutHole && (
            <div className="text-[10px] font-mono text-amber-950 font-extrabold bg-amber-100 border border-amber-300 px-2 py-0.5 rounded shadow-sm">
              🔒 3/8" LOCKOUT HOLE
            </div>
          )}
        </div>

        <svg viewBox="0 0 400 390" className="w-full max-w-[340px] h-[320px] drop-shadow-md">
          <defs>
            {/* Fine Blueprint Drafting Grid */}
            <pattern id="cad-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148, 163, 184, 0.18)" strokeWidth="0.75" />
            </pattern>

            {/* SA-516 Gr. 70 Carbon Steel Shader */}
            <linearGradient id="metal-sa516" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="25%" stopColor="#64748b" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="85%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* SA-36 Carbon Steel Shader */}
            <linearGradient id="metal-sa36" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="30%" stopColor="#94a3b8" />
              <stop offset="60%" stopColor="#475569" />
              <stop offset="90%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* 304/304L Stainless Shader */}
            <linearGradient id="metal-ss304" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="30%" stopColor="#f8fafc" />
              <stop offset="60%" stopColor="#94a3b8" />
              <stop offset="85%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* 316L Acid Grade Stainless Shader */}
            <linearGradient id="metal-ss316" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f1f5f9" />
              <stop offset="25%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="80%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* 6061-T6 Aluminum Shader */}
            <linearGradient id="metal-al6061" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#f1f5f9" />
              <stop offset="70%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            {/* 3D Extrusion Depth Shader */}
            <linearGradient id="metal-depth" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
            </linearGradient>

            {/* Phonographic Machined Serration Rings Pattern */}
            <pattern id="machined-serrations" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="2.5" fill="none" stroke="rgba(217, 119, 6, 0.45)" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Grid Background */}
          <rect width="100%" height="100%" fill="url(#cad-grid)" />

          {/* Centerlines & Drafting Calipers */}
          <g stroke="#94a3b8" strokeDasharray="4 3" strokeWidth="0.8" opacity="0.4">
            <line x1="20" y1={centerY} x2="380" y2={centerY} />
            <line x1={centerX} y1="20" x2={centerX} y2={370} />
          </g>

          {/* ================================================================ */}
          {/* 1. 3D THICKNESS EXTRUSION (BOTTOM SHADOW LAYER)                  */}
          {/* ================================================================ */}
          <g transform={`translate(${extrudeOffset}, ${extrudeOffset})`} opacity="0.45">
            {isFigure8 ? (
              <>
                <rect x={centerX - f8BridgeWidth / 2} y={f8Disc1Y} width={f8BridgeWidth} height={f8Disc2Y - f8Disc1Y} rx="4" fill="#020617" />
                <circle cx={centerX} cy={f8Disc1Y} r={radius} fill="#020617" />
                <circle cx={centerX} cy={f8Disc2Y} r={radius} fill="#020617" />
              </>
            ) : (
              <>
                <circle cx={centerX} cy={centerY} r={radius} fill="#020617" />
                <path
                  d={`
                    M ${centerX - handleWidth / 2} ${centerY}
                    L ${centerX - handleWidth / 2} ${handleTopY}
                    L ${centerX + handleWidth / 2} ${handleTopY}
                    L ${centerX + handleWidth / 2} ${centerY}
                    Z
                  `}
                  fill="#020617"
                />
                {addTHadle && (
                  <rect
                    x={tHandleLeft}
                    y={tHandleY}
                    width={tHandleSpan}
                    height={tHandleThick}
                    rx="6"
                    fill="#020617"
                  />
                )}
                {addLiftingLug && (
                  <path
                    d={`M ${centerX - 18} ${addTHadle ? tHandleY : handleTopY} L ${centerX - 18} ${lugTopY + 12} Q ${centerX} ${lugTopY} ${centerX + 18} ${lugTopY + 12} L ${centerX + 18} ${addTHadle ? tHandleY : handleTopY} Z`}
                    fill="#020617"
                  />
                )}
              </>
            )}
          </g>

          {/* ================================================================ */}
          {/* 2. MAIN SOLID STEEL BODY                                         */}
          {/* ================================================================ */}
          {isFigure8 ? (
            <g id="figure-8-spectacle-assembly">
              {/* Connecting Bridge Web */}
              <rect
                x={centerX - f8BridgeWidth / 2}
                y={f8Disc1Y}
                width={f8BridgeWidth}
                height={f8Disc2Y - f8Disc1Y}
                rx="6"
                fill={metalShader.fill}
                stroke={metalShader.border}
                strokeWidth="2.5"
              />

              {/* Top Disc: Solid Blind (Isolation) */}
              <circle
                cx={centerX}
                cy={f8Disc1Y}
                r={radius}
                fill={metalShader.fill}
                stroke={metalShader.border}
                strokeWidth="2.5"
              />
              <circle
                cx={centerX}
                cy={f8Disc1Y}
                r={radius - 2}
                fill="none"
                stroke={metalShader.specular}
                strokeWidth="1"
                opacity="0.6"
              />

              {/* Bottom Disc: Open Ring Spacer (Flow) */}
              <circle
                cx={centerX}
                cy={f8Disc2Y}
                r={radius}
                fill={metalShader.fill}
                stroke={metalShader.border}
                strokeWidth="2.5"
              />
              {/* Center Open ID Bore Hole */}
              <circle
                cx={centerX}
                cy={f8Disc2Y}
                r={radius * 0.58}
                fill="#020617"
                stroke={metalShader.border}
                strokeWidth="2.5"
              />
              <circle
                cx={centerX}
                cy={f8Disc2Y}
                r={radius * 0.58 + 2}
                fill="none"
                stroke={metalShader.specular}
                strokeWidth="0.8"
                opacity="0.7"
              />

              {/* Center Pivot / Tie-Bar Center Lockout Hole */}
              <circle
                cx={centerX}
                cy={centerY}
                r="6"
                fill="#020617"
                stroke="#f59e0b"
                strokeWidth="2"
              />

              {/* Figure 8 Spec Stamp in Center Bridge */}
              <text
                x={centerX}
                y={centerY - 14}
                textAnchor="middle"
                className="fill-slate-900 font-mono font-extrabold text-[8px] tracking-wider"
              >
                BLIND
              </text>
              <text
                x={centerX}
                y={centerY + 22}
                textAnchor="middle"
                className="fill-slate-900 font-mono font-extrabold text-[8px] tracking-wider"
              >
                OPEN
              </text>
            </g>
          ) : (
            <g id="paddle-blind-steel-body">
              {/* Vertical Handle Stem */}
              <path
                d={`
                  M ${centerX - handleWidth / 2} ${centerY}
                  L ${centerX - handleWidth / 2} ${handleTopY + 8}
                  Q ${centerX - handleWidth / 2} ${handleTopY} ${centerX - handleWidth / 2 + 8} ${handleTopY}
                  L ${centerX + handleWidth / 2 - 8} ${handleTopY}
                  Q ${centerX + handleWidth / 2} ${handleTopY} ${centerX + handleWidth / 2} ${handleTopY + 8}
                  L ${centerX + handleWidth / 2} ${centerY}
                  Z
                `}
                fill={metalShader.fill}
                stroke={metalShader.border}
                strokeWidth="2.5"
              />

              {/* Circular Sealing Disc */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill={metalShader.fill}
                stroke={metalShader.border}
                strokeWidth="2.5"
              />

              {/* Inner Raised Face / Bevel Chamfer */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius - 2}
                fill="none"
                stroke={metalShader.specular}
                strokeWidth="1"
                opacity="0.6"
              />
            </g>
          )}

          {/* ================================================================ */}
          {/* 3. INTEGRAL CNC CUT T-HANDLE (1-PIECE CUTOUT - NO WELDS)         */}
          {/* ================================================================ */}
          {!isFigure8 && addTHadle ? (
            <g id="integral-cnc-t-handle-assembly" className="transition-all duration-300">
              {/* Monolithic Smooth Cut-Out Crossbar */}
              <rect
                x={tHandleLeft}
                y={tHandleY}
                width={tHandleSpan}
                height={tHandleThick}
                rx="6"
                fill={metalShader.fill}
                stroke={metalShader.border}
                strokeWidth="2.5"
              />

              {/* Top Specular Edge Highlight */}
              <line
                x1={tHandleLeft + 6}
                y1={tHandleY + 2}
                x2={tHandleRight - 6}
                y2={tHandleY + 2}
                stroke={metalShader.specular}
                strokeWidth="1.5"
                opacity="0.8"
              />

              {/* Standard Hanging Hole in T-Bar */}
              <circle
                cx={centerX}
                cy={tHandleY + tHandleThick / 2}
                r={handleWidth * 0.20}
                fill="#0f172a"
                stroke={metalShader.border}
                strokeWidth="1.8"
              />

              {/* T-Handle Mechanical Annotation */}
              <g stroke="#0284c7" strokeWidth="1" opacity="0.85">
                <line x1={tHandleLeft} y1={tHandleY - 8} x2={tHandleRight} y2={tHandleY - 8} />
                <line x1={tHandleLeft} y1={tHandleY - 12} x2={tHandleLeft} y2={tHandleY - 4} />
                <line x1={tHandleRight} y1={tHandleY - 12} x2={tHandleRight} y2={tHandleY - 4} />
                <text
                  x={centerX}
                  y={tHandleY - 12}
                  textAnchor="middle"
                  className="fill-sky-800 font-mono font-bold text-[8px] tracking-wider"
                  stroke="none"
                >
                  INTEGRAL CNC CUT T-HANDLE [{(tHandleSpan / 25.4).toFixed(1)}" SPAN - NO WELDS]
                </text>
              </g>
            </g>
          ) : !isFigure8 ? (
            /* Standard ASME Hanging Hole (Straight Handle) */
            <g id="standard-asme-handle-hole">
              <circle
                cx={centerX}
                cy={handleTopY + 16}
                r={handleWidth * 0.22}
                fill="#0f172a"
                stroke={metalShader.border}
                strokeWidth="1.8"
              />
            </g>
          ) : null}

          {/* ================================================================ */}
          {/* 3.5. 3/8" CENTER LOCKOUT HOLE (CNC PIERCED IN CENTER OF HANDLE)  */}
          {/* ================================================================ */}
          {!isFigure8 && addLockoutHole && (
            <g id="lockout-tagout-hole" className="transition-all duration-300">
              <circle
                cx={centerX}
                cy={lockoutHoleY}
                r="6"
                fill="#020617"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              <circle
                cx={centerX}
                cy={lockoutHoleY}
                r="9"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.8"
              />
              <text
                x={centerX + 14}
                y={lockoutHoleY + 3.5}
                className="fill-amber-700 font-mono font-bold text-[7.5px] tracking-wider"
              >
                3/8" LOCKOUT HOLE
              </text>
            </g>
          )}

          {/* ================================================================ */}
          {/* 4. SOLID STEEL LIFTING LUG (WHEN SELECTED)                       */}
          {/* ================================================================ */}
          {!isFigure8 && addLiftingLug && (
            <g id="welded-lifting-lug-assembly" className="transition-all duration-300">
              <path
                d={`
                  M ${centerX - 18} ${addTHadle ? tHandleY : handleTopY}
                  L ${centerX - 18} ${lugTopY + 12}
                  Q ${centerX} ${lugTopY} ${centerX + 18} ${lugTopY + 12}
                  L ${centerX + 18} ${addTHadle ? tHandleY : handleTopY}
                  Z
                `}
                fill={metalShader.fill}
                stroke="#d97706"
                strokeWidth="2"
              />
              <circle
                cx={centerX}
                cy={lugTopY + 14}
                r="7.5"
                fill="#0f172a"
                stroke="#d97706"
                strokeWidth="2"
              />
              <text
                x={centerX}
                y={lugTopY - 4}
                textAnchor="middle"
                className="fill-amber-700 font-mono font-bold text-[8px] tracking-wider"
              >
                ASME LIFTING LUG (3/4" EYE)
              </text>
            </g>
          )}

          {/* ================================================================ */}
          {/* 5. GASKET FACING SURFACE (FLAT FACE VS. MACHINED SERRATIONS)     */}
          {/* ================================================================ */}
          {facing === 'Machined Gasket Finish (Special Order)' ? (
            <g id="machined-facing-surface">
              <circle
                cx={centerX}
                cy={isFigure8 ? f8Disc1Y : centerY}
                r={radius * 0.78}
                fill="url(#machined-serrations)"
                stroke="#d97706"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              {isFigure8 && (
                <circle
                  cx={centerX}
                  cy={f8Disc2Y}
                  r={radius * 0.78}
                  fill="url(#machined-serrations)"
                  stroke="#d97706"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
              )}
              <rect
                x={centerX - 75}
                y={(isFigure8 ? f8Disc1Y : centerY) - 8}
                width="150"
                height="16"
                rx="4"
                fill="#ffffff"
                stroke="#d97706"
                strokeWidth="1"
                opacity="0.92"
              />
              <text
                x={centerX}
                y={(isFigure8 ? f8Disc1Y : centerY) + 3.5}
                textAnchor="middle"
                className="fill-amber-900 font-mono font-bold text-[8px] tracking-wider"
              >
                MACHINED SERRATION (125-250 AARH)
              </text>
            </g>
          ) : (
            <g id="flat-face-smooth-surface">
              <circle
                cx={centerX}
                cy={isFigure8 ? f8Disc1Y : centerY}
                r={radius * 0.78}
                fill="none"
                stroke={metalShader.specular}
                strokeWidth="1.2"
                strokeDasharray="6 3"
                opacity="0.7"
              />
            </g>
          )}

          {/* ================================================================ */}
          {/* 6. AUTHENTIC PLASMA STAMPING ON HANDLE                           */}
          {/* ================================================================ */}
          {!isFigure8 && (
            <g
              transform={`translate(${centerX + 2.5}, ${handleTopY + (addTHadle ? 34 : 26)}) rotate(90)`}
              id="handle-plasma-stamping"
            >
              <text
                x="0"
                y="0"
                className="fill-slate-900 font-mono font-extrabold text-[7.5px] tracking-wider"
              >
                IRON PRAIRIE &bull; {nps} {pressureClass}# {materialCode}
              </text>
            </g>
          )}
          {handleStamp && (
            <text
              x={centerX}
              y={isFigure8 ? centerY : centerY - radius - 6}
              textAnchor="middle"
              className="fill-slate-900 font-mono font-bold text-[8px] tracking-wider"
            >
              STAMP: [{handleStamp}]
            </text>
          )}

          {/* ================================================================ */}
          {/* 7. CAD DIMENSIONAL ANNOTATION CALIPERS                           */}
          {/* ================================================================ */}
          <g stroke="#64748b" strokeWidth="0.8" opacity="0.7">
            <line x1={centerX - radius} y1={centerY + radius + (isFigure8 ? 34 : 14)} x2={centerX + radius} y2={centerY + radius + (isFigure8 ? 34 : 14)} />
            <line x1={centerX - radius} y1={centerY + radius + (isFigure8 ? 28 : 8)} x2={centerX - radius} y2={centerY + radius + (isFigure8 ? 40 : 20)} />
            <line x1={centerX + radius} y1={centerY + radius + (isFigure8 ? 28 : 8)} x2={centerX + radius} y2={centerY + radius + (isFigure8 ? 40 : 20)} />
            <text
              x={centerX}
              y={centerY + radius + (isFigure8 ? 46 : 26)}
              textAnchor="middle"
              className="fill-slate-800 font-mono font-bold text-[9.5px]"
              stroke="none"
            >
              {od.toFixed(2)}" OD &bull; {thicknessLabel} Nominal Thk
            </text>
          </g>
        </svg>
      </div>

      {/* Engineering Spec Footnote Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-slate-700">
        <div>
          <span className="text-slate-900 font-bold block">{metalShader.specText}</span>
          <span className="text-[11px] text-slate-500">{metalShader.densityLabel}</span>
        </div>
        <div className="text-right sm:text-right">
          <span className="text-sky-800 font-bold block">ASME B16.48 Standard</span>
          <span className="text-[11px] text-slate-500">High-Definition CNC Plasma Tolerance</span>
        </div>
      </div>
    </div>
  );
}

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/woman-owned', label: 'Woman-Owned' },
  { to: '/storefront', label: 'Paddle Blinds (B2B)' },
  { to: '/contact', label: 'Contact' },
];

// ============================================================================
// 3. MAIN REACT APPLICATION (WITH CLEAN CALM PALETTE & THEME TOGGLE)
// ============================================================================
export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Navigation View State
  const [activeTab, setActiveTab] = useState<'storefront' | 'whiteboard'>(() => {
    return location.pathname === '/shop-floor' ? 'whiteboard' : 'storefront';
  });

  // --------------------------------------------------------------------------
  // AUTH STATE: GATED CLIENT LOGIN TO PROTECT WEBSITE PRICING
  // --------------------------------------------------------------------------
  const [isClientLoggedIn, setIsClientLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('ipf_client_logged_in');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [clientAccount, setClientAccount] = useState<ClientAccount | null>(() => {
    try {
      const saved = localStorage.getItem('ipf_client_account');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isBulkRfqModalOpen, setIsBulkRfqModalOpen] = useState<boolean>(false);

  // --------------------------------------------------------------------------
  // OWNER PRICING OVERRIDES & DYNAMIC COMPENSATION MATRIX
  // --------------------------------------------------------------------------
  const [pricingConfig, setPricingConfig] = useState<PricingConfig>(() => {
    try {
      const saved = localStorage.getItem('ipf_pricing_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PRICING_CONFIG,
          ...parsed,
          sa36PricePerLb: parsed.sa36PricePerLb ?? DEFAULT_PRICING_CONFIG.sa36PricePerLb,
          sa516PricePerLb: parsed.sa516PricePerLb ?? parsed.csPricePerLb ?? DEFAULT_PRICING_CONFIG.sa516PricePerLb,
          ss304PricePerLb: parsed.ss304PricePerLb ?? DEFAULT_PRICING_CONFIG.ss304PricePerLb,
          ss304LPricePerLb: parsed.ss304LPricePerLb ?? parsed.ssPricePerLb ?? DEFAULT_PRICING_CONFIG.ss304LPricePerLb,
          ss316LPricePerLb: parsed.ss316LPricePerLb ?? DEFAULT_PRICING_CONFIG.ss316LPricePerLb,
          alPricePerLb: parsed.alPricePerLb ?? DEFAULT_PRICING_CONFIG.alPricePerLb,
        };
      }
      return DEFAULT_PRICING_CONFIG;
    } catch {
      return DEFAULT_PRICING_CONFIG;
    }
  });

  const [isOwnerPricingModalOpen, setIsOwnerPricingModalOpen] = useState<boolean>(false);

  // Persist pricing & auth
  useEffect(() => {
    try {
      localStorage.setItem('ipf_pricing_config', JSON.stringify(pricingConfig));
    } catch (e) {
      console.error(e);
    }
  }, [pricingConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('ipf_client_logged_in', String(isClientLoggedIn));
      if (clientAccount) {
        localStorage.setItem('ipf_client_account', JSON.stringify(clientAccount));
      }
    } catch (e) {
      console.error(e);
    }
  }, [isClientLoggedIn, clientAccount]);

  // Storefront Mode Switcher ('rapid_grid' | 'custom_configurator')
  const [storefrontMode, setStorefrontMode] = useState<'rapid_grid' | 'custom_configurator'>('rapid_grid');

  // Instant Proposal Generator Modal State
  const [isProposalModalOpen, setIsProposalModalOpen] = useState<boolean>(false);
  const [proposalModalItems, setProposalModalItems] = useState<any[]>([]);

  // Storefront Configurator State
  const [blindType, setBlindType] = useState<'Paddle Blind' | 'Figure 8 (Spectacle Blind)'>('Paddle Blind');
  const [selectedNPS, setSelectedNPS] = useState<string>('4"');
  const [selectedClass, setSelectedClass] = useState<PressureClass>(150);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialCode>('SA-516-70');
  const [selectedThickness, setSelectedThickness] = useState<number>(0.1196); // Default 11 Gauge (0.120")
  const [selectedThicknessLabel, setSelectedThicknessLabel] = useState<string>('11 Gauge (0.120")');
  const [selectedFacing, setSelectedFacing] = useState<FacingType>('Flat Face (FF) - Standard (No Machining)');
  const [handleStamp, setHandleStamp] = useState<string>('ISO-UNIT-04');
  const [requireMTR, setRequireMTR] = useState<boolean>(true);
  const [addTHadle, setAddTHadle] = useState<boolean>(false);
  const [addLockoutHole, setAddLockoutHole] = useState<boolean>(false);
  const [addLiftingLug, setAddLiftingLug] = useState<boolean>(false);
  const [addPlateDog, setAddPlateDog] = useState<boolean>(false);
  const [addWedge, setAddWedge] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  // Hot Shot Emergency Dispatch Toggle
  const [isHotShotOrder, setIsHotShotOrder] = useState<boolean>(false);

  // Cart & Checkout State
  const [cart, setCart] = useState<ConfiguredItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAmazonExportOpen, setIsAmazonExportOpen] = useState<boolean>(false);

  // Checkout Payment Method Selection & Net 30 ACH Mandate State
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<PaymentMethodType>('net30_po');
  const [achAgreementChecked, setAchAgreementChecked] = useState<boolean>(false);

  // Business Owner Operations State
  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem('ipf_orders_pipeline');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Abandoned Carts State
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCartRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ipf_abandoned_carts');
      return saved ? JSON.parse(saved) : INITIAL_ABANDONED_CARTS;
    } catch {
      return INITIAL_ABANDONED_CARTS;
    }
  });

  // Owner Operations Navigation Sub-Tab ('kanban' | 'analytics' | 'abandoned' | 'emails')
  const [activeOwnerTab, setActiveOwnerTab] = useState<'kanban' | 'analytics' | 'abandoned' | 'emails'>('kanban');
  const [activeJobPacket, setActiveJobPacket] = useState<CustomerOrder | null>(null);

  // Modals & Interactive Overlays
  const [selectedQuoteCart, setSelectedQuoteCart] = useState<AbandonedCartRecord | null>(null);
  const [previewEmailRecord, setPreviewEmailRecord] = useState<EmailNotificationRecord | null>(null);
  const [matrixSweepModalOpen, setMatrixSweepModalOpen] = useState<boolean>(false);
  const [matrixSweepStats, setMatrixSweepStats] = useState<any>(null);
  const [notificationToast, setNotificationToast] = useState<{ message: string; type: 'success' | 'alert' | 'email' } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (notificationToast) {
      const timer = setTimeout(() => setNotificationToast(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [notificationToast]);

  // Persist orders and abandoned carts
  useEffect(() => {
    try {
      localStorage.setItem('ipf_orders_pipeline', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('ipf_abandoned_carts', JSON.stringify(abandonedCarts));
    } catch (e) {
      console.error(e);
    }
  }, [abandonedCarts]);

  // Live Calculating Spec for Active Storefront Configuration
  const liveSpec = useMemo(() => {
    return calculateDynamicBlindPrice(
      selectedClass,
      selectedNPS,
      selectedMaterial,
      selectedThickness,
      selectedThicknessLabel,
      selectedFacing,
      addTHadle,
      addLiftingLug,
      addPlateDog,
      addWedge,
      pricingConfig,
      addLockoutHole,
      blindType
    );
  }, [selectedClass, selectedNPS, selectedMaterial, selectedThickness, selectedThicknessLabel, selectedFacing, addTHadle, addLockoutHole, addLiftingLug, addPlateDog, addWedge, pricingConfig, blindType]);

  // Cart Totals & High-Volume / Lead Time Detection
  const cartSubtotal = useMemo(() => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), [cart]);
  const cartTotalWeight = useMemo(() => Math.round(cart.reduce((sum, item) => sum + item.actualWeightLbs * item.quantity, 0) * 10) / 10, [cart]);
  
  // High-Volume Plate Sourcing Rule (> $10k or > 1,000 lbs)
  const isLargeVolumeOrder = useMemo(() => {
    return cartSubtotal >= 10000 || cartTotalWeight >= 1000;
  }, [cartSubtotal, cartTotalWeight]);

  const activeHotShotFee = isHotShotOrder ? pricingConfig.hotShotEmergencyFee : 0;

  const shippingEstimate = useMemo(() => {
    if (cart.length === 0) return 0;
    if (cartTotalWeight > 150 || cart.some(i => i.nominalSizeInches >= 14)) return 245; // Freight LTL
    return Math.max(18, Math.round(cartTotalWeight * 1.45 + 12));
  }, [cart, cartTotalWeight]);

  const creditCardSurcharge = useMemo(() => {
    if (checkoutPaymentMethod === 'credit_card') {
      return Math.round((cartSubtotal + shippingEstimate + activeHotShotFee) * 0.035 * 100) / 100;
    }
    return 0;
  }, [checkoutPaymentMethod, cartSubtotal, shippingEstimate, activeHotShotFee]);

  const grandTotal = cartSubtotal + shippingEstimate + activeHotShotFee + creditCardSurcharge;

  // Dynamic Lead Time String based on Hot Shot vs Large Volume
  const activeLeadTimeText = useMemo(() => {
    if (isHotShotOrder) return '🔥 HOT SHOT: 2-4 Hour Emergency Burn & Immediate Dispatch';
    if (isLargeVolumeOrder) return '🏭 High-Volume Mill Plate Staging: 5-7 Business Days (Dedicated Table Allocation)';
    return '⚡ Standard Lead Time: In-Stock Plate Dispatched within 24 Hours';
  }, [isHotShotOrder, isLargeVolumeOrder]);

  // --------------------------------------------------------------------------
  // ABANDONED CART TRACKING TRIGGER
  // --------------------------------------------------------------------------
  const recordAbandonedCartSession = (activeItems: ConfiguredItem[], step: 'Cart Drawer' | 'Checkout Opened' | 'Payment Selection') => {
    if (!activeItems || activeItems.length === 0) return;

    const sub = activeItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const wt = Math.round(activeItems.reduce((s, i) => s + i.actualWeightLbs * i.quantity, 0) * 10) / 10;
    const ship = wt > 150 ? 245 : Math.max(18, Math.round(wt * 1.45 + 12));

    const company = clientAccount?.companyName || 'Refinery Procurement (Guest)';
    const buyer = clientAccount?.buyerName || 'MRO Sourcing Lead';
    const email = clientAccount?.email || 'purchasing@plant-buyer.com';

    const newRecord: AbandonedCartRecord = {
      cartId: `ABANDON-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      abandonedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      companyName: company,
      buyerName: buyer,
      email: email,
      phone: '(979) 555-0199',
      facilityLocation: clientAccount?.facilityLocation || 'Texas Gulf Coast',
      items: [...activeItems],
      subtotal: sub,
      shippingEstimate: ship,
      totalAmount: sub + ship,
      totalWeightLbs: wt,
      status: 'Abandoned',
      lastActiveStep: step
    };

    setAbandonedCarts(prev => [newRecord, ...prev.slice(0, 24)]);
  };

  // Restore Abandoned Cart to Active Shopping Session
  const handleRestoreAbandonedCart = (record: AbandonedCartRecord) => {
    setCart(record.items);
    setClientAccount({
      companyName: record.companyName,
      buyerName: record.buyerName,
      email: record.email,
      facilityLocation: record.facilityLocation,
      achAuthorized: true
    });
    setIsClientLoggedIn(true);
    setIsCartOpen(true);
    setNotificationToast({
      type: 'success',
      message: `🛒 Restored ${record.items.length} items from ${record.companyName} into active cart!`
    });
  };

  // Mark Abandoned Cart as Recovered
  const handleMarkCartRecovered = (cartId: string) => {
    const target = abandonedCarts.find(c => c.cartId === cartId);
    if (!target) return;

    // Convert to completed order
    const recoveredOrder: CustomerOrder = {
      orderId: `PO-RECOVERED-${Math.floor(1000 + Math.random() * 9000)}`,
      orderSource: 'Website B2B',
      createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      companyName: target.companyName,
      contactName: target.buyerName,
      email: target.email,
      jobsiteAddress: `${target.facilityLocation}, Receiving Dock 1`,
      poNumber: `PO-REC-${Math.floor(10000 + Math.random() * 90000)}`,
      items: target.items,
      subtotal: target.subtotal,
      shippingCost: target.shippingEstimate,
      hotShotFee: 0,
      totalAmount: target.totalAmount,
      totalWeightLbs: target.totalWeightLbs,
      shippingMethod: target.totalWeightLbs > 150 ? 'LTL Palletized Freight' : 'UPS Ground Parcel',
      isHotShot: false,
      isLargeOrder: target.subtotal >= 10000 || target.totalWeightLbs >= 1000,
      leadTimeEstimate: '⚡ Standard Next-Day In-Stock Plate Dispatch',
      paymentMethod: 'Net 30 Commercial PO',
      paymentStatus: 'Net 30 Authorized',
      status: 'queued',
      millHeatNumber: 'Pending Shop Staging',
      scheduledShipDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      carrierName: 'UPS Ground',
      trackingNumber: 'PENDING-LABEL'
    };

    setOrders(prev => [recoveredOrder, ...prev]);
    setAbandonedCarts(prev => prev.map(c => c.cartId === cartId ? { ...c, status: 'Recovered' } : c));

    // Dispatch email alert to sales@ironprairiefabrication.com & IPG team
    triggerOrderEmailNotification(recoveredOrder);

    setNotificationToast({
      type: 'email',
      message: `🎉 Cart Recovered! Created Order #${recoveredOrder.poNumber} & Dispatched Email to sales@ironprairiefabrication.com!`
    });
  };

  // Dismiss Abandoned Cart
  const handleDismissAbandonedCart = (cartId: string) => {
    setAbandonedCarts(prev => prev.filter(c => c.cartId !== cartId));
    setNotificationToast({
      type: 'alert',
      message: '🗑️ Abandoned cart dismissed.'
    });
  };

  // --------------------------------------------------------------------------
  // RANDOM TEST CLIENT GENERATOR & MATRIX SIMULATION ENGINE
  // --------------------------------------------------------------------------

  // 1. Generate 1 Single Random Client Order & Trigger Email to Russell & Alicia
  const handleSimulateRandomOrder = () => {
    const client = pickRandom(INDUSTRIAL_TEST_CLIENTS);
    const itemCount = randomInt(1, 3);
    const items: ConfiguredItem[] = [];

    for (let i = 0; i < itemCount; i++) {
      const nps = pickRandom(ALL_NPS_SIZES);
      const pClass = pickRandom(ALL_PRESSURE_CLASSES);
      const mat = pickRandom(client.typicalMaterials);
      const thk = pickRandom(ALL_THICKNESSES);
      const addT = Math.random() > 0.6;
      const addLug = Math.random() > 0.7;
      const addDog = Math.random() > 0.85;
      const addWedge = Math.random() > 0.85;
      const qty = randomInt(1, 10);

      const spec = calculateDynamicBlindPrice(
        pClass,
        nps,
        mat,
        thk.thickness,
        thk.fractionLabel,
        'Flat Face (FF) - Standard (No Machining)',
        addT,
        addLug,
        addDog,
        addWedge,
        pricingConfig
      );

      items.push({
        id: `ITEM-SIM-${Date.now()}-${i}`,
        partNumber: spec.partNumber,
        nps,
        nominalSizeInches: parseFloat(nps.replace('"', '').replace('-1/2', '.5').replace('-1/4', '.25').replace('-3/4', '.75')) || 1.0,
        pressureClass: pClass,
        materialCode: mat,
        materialName: MATERIALS[mat].name,
        facing: 'Flat Face (FF) - Standard (No Machining)',
        thickness: spec.thickness,
        thicknessLabel: spec.thicknessLabel,
        od: spec.od,
        boltCircle: spec.boltCircle,
        boltSize: spec.boltSize,
        actualWeightLbs: spec.actualWeightLbs,
        adjustedWeightLbs: spec.adjustedWeightLbs,
        unitPrice: spec.unitPrice,
        quantity: qty,
        handleStamp: `${client.poPrefix.split('-')[0]}-UNIT-${randomInt(1, 9)}`,
        requireMTR: Math.random() > 0.2, // 80% require MTR
        addTHadle: addT,
        addLiftingLug: addLug,
        addPlateDog: addDog,
        addWedge: addWedge
      });
    }

    const sub = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
    const wt = Math.round(items.reduce((s, it) => s + it.actualWeightLbs * it.quantity, 0) * 10) / 10;
    const isHot = Math.random() > 0.75; // 25% Hot Shot rush
    const hotFee = isHot ? pricingConfig.hotShotEmergencyFee : 0;
    const ship = wt > 150 ? 245 : Math.max(18, Math.round(wt * 1.45 + 12));
    const total = sub + ship + hotFee;
    const payMethod = client.preferredPaymentMethod;
    const isLrg = sub >= 10000 || wt >= 1000;

    const newSimOrder: CustomerOrder = {
      orderId: isHot ? `HOT-2026-${randomInt(1000, 9999)}` : `PO-2026-${randomInt(1000, 9999)}`,
      orderSource: 'Website B2B',
      createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      companyName: client.companyName,
      contactName: `${client.buyerName} (${client.title})`,
      email: client.email,
      jobsiteAddress: client.jobsiteAddress,
      poNumber: `${client.poPrefix}${randomInt(10000, 99999)}`,
      items,
      subtotal: sub,
      shippingCost: ship,
      hotShotFee: hotFee,
      totalAmount: total,
      totalWeightLbs: wt,
      shippingMethod: isHot ? 'Emergency Hot Shot Courier' : wt > 150 ? 'LTL Palletized Freight' : 'UPS Ground Parcel',
      isHotShot: isHot,
      isLargeOrder: isLrg,
      leadTimeEstimate: isHot ? '🔥 HOT SHOT: 2-4 Hour Emergency Burn & Immediate Dispatch' : isLrg ? '🏭 High-Volume Mill Plate Staging: 5-7 Business Days' : '⚡ Standard Next-Day In-Stock Plate Dispatch',
      paymentMethod: payMethod,
      paymentStatus: payMethod === 'Credit Card' ? 'Paid in Full' : payMethod === 'ACH Direct Debit' ? 'ACH Clearing' : 'Net 30 Authorized',
      status: 'queued',
      millHeatNumber: 'Pending Shop Staging',
      scheduledShipDate: isHot ? `${new Date().toISOString().split('T')[0]} (TODAY RUSH)` : new Date(Date.now() + 86400000).toISOString().split('T')[0],
      carrierName: isHot ? 'Iron Prairie Hot-Shot Dedicated' : wt > 150 ? 'Southeastern Freight' : 'UPS Ground',
      trackingNumber: isHot ? 'HOT-SHOT-DIRECT-TRUCK' : 'PENDING-LABEL'
    };

    setOrders(prev => [newSimOrder, ...prev]);

    // Dispatch Email to sales@ironprairiefabrication.com & IPG Team
    triggerOrderEmailNotification(newSimOrder);

    setNotificationToast({
      type: 'email',
      message: `🎲 Generated order for ${client.companyName} ($${total.toFixed(2)}) & Dispatched Email to sales@ironprairiefabrication.com!`
    });
  };

  // 1.5 Generate High-Quantity Turnaround Special Order (>100 units / >1,000 lbs / >$10k)
  const handleSimulateLargeTurnaroundOrder = () => {
    const scenario = pickRandom(LARGE_QTY_TURNAROUND_SCENARIOS);
    const client = INDUSTRIAL_TEST_CLIENTS[scenario.clientIndex] || INDUSTRIAL_TEST_CLIENTS[0];

    const items: ConfiguredItem[] = scenario.items.map((it, idx) => {
      const spec = calculateDynamicBlindPrice(
        it.pressureClass,
        it.nps,
        it.materialCode,
        it.thickness,
        it.thicknessLabel,
        'Flat Face (FF) - Standard (No Machining)',
        it.requireMTR,
        false,
        false,
        false,
        pricingConfig
      );

      let unitPrice = spec.unitPrice;
      if (it.quantity >= 100) unitPrice = Math.round(unitPrice * 0.85);
      else if (it.quantity >= 50) unitPrice = Math.round(unitPrice * 0.90);
      else if (it.quantity >= 25) unitPrice = Math.round(unitPrice * 0.95);

      return {
        id: `ITEM-LG-${Date.now()}-${idx}`,
        partNumber: spec.partNumber,
        nps: it.nps,
        nominalSizeInches: parseFloat(it.nps.replace('"', '')) || 2.0,
        pressureClass: it.pressureClass,
        materialCode: it.materialCode,
        materialName: MATERIALS[it.materialCode]?.name || it.materialCode,
        facing: 'Flat Face (FF) - Standard (No Machining)',
        thickness: it.thickness,
        thicknessLabel: it.thicknessLabel,
        od: spec.od,
        boltCircle: spec.boltCircle,
        boltSize: spec.boltSize,
        unitPrice,
        actualWeightLbs: spec.actualWeightLbs,
        adjustedWeightLbs: spec.adjustedWeightLbs,
        quantity: it.quantity,
        requireMTR: it.requireMTR,
        machinedGasketFacing: false,
        extraLongHandle: false,
        cutoutGripHandle: false,
        handleStamp: it.handleStamp
      };
    });

    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const totalWeight = Math.round(items.reduce((sum, i) => sum + i.adjustedWeightLbs * i.quantity, 0));
    const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0);
    const shipping = Math.round(180 + (totalWeight * 0.22));

    const largeOrder: OrderRecord = {
      orderId: `ORD-${Date.now().toString().slice(-6)}`,
      companyName: client.companyName,
      contactName: `${client.buyerName} (${client.title})`,
      email: client.email,
      jobsiteAddress: client.jobsiteAddress,
      poNumber: `${client.poPrefix}${randomInt(10000, 99999)}`,
      createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      items,
      subtotal,
      shippingCost: shipping,
      hotShotFee: 0,
      totalAmount: subtotal + shipping,
      totalWeightLbs: totalWeight,
      shippingMethod: 'Dedicated Flatbed / Heavy LTL Freight',
      isHotShot: false,
      isLargeOrder: true,
      leadTimeEstimate: scenario.leadTime,
      paymentMethod: scenario.paymentMethod,
      paymentStatus: 'Net 30 Commercial Credit Authorized',
      status: 'queued',
      millHeatNumber: 'Allocating Mill Master Plate Heat',
      scheduledShipDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      carrierName: 'Southeastern Freight / Heavy Freight Carrier',
      trackingNumber: 'MILL-ALLOC-PENDING'
    };

    setOrders(prev => [largeOrder, ...prev]);

    // Dispatch email to sales@ironprairiefabrication.com & IPG team
    triggerOrderEmailNotification(largeOrder);

    setNotificationToast({
      type: 'email',
      message: `🏭 Generated Special Order Turnaround Package (${totalUnits} blinds / ${totalWeight.toLocaleString()} lbs / $${(subtotal + shipping).toLocaleString(undefined, { minimumFractionDigits: 2 })}) & Dispatched Email to sales@ironprairiefabrication.com!`
    });
  };

  // 2. Generate Simulated Abandoned Cart
  const handleSimulateAbandonedCart = () => {
    const client = pickRandom(INDUSTRIAL_TEST_CLIENTS);
    const nps = pickRandom(ALL_NPS_SIZES);
    const pClass = pickRandom(ALL_PRESSURE_CLASSES);
    const mat = pickRandom(client.typicalMaterials);
    const thk = pickRandom(ALL_THICKNESSES);
    const qty = randomInt(2, 8);

    const spec = calculateDynamicBlindPrice(
      pClass,
      nps,
      mat,
      thk.thickness,
      thk.fractionLabel,
      'Flat Face (FF) - Standard (No Machining)',
      true,
      false,
      false,
      false,
      pricingConfig
    );

    const simItem: ConfiguredItem = {
      id: `ITEM-AB-SIM-${Date.now()}`,
      partNumber: spec.partNumber,
      nps,
      nominalSizeInches: parseFloat(nps.replace('"', '')) || 1.0,
      pressureClass: pClass,
      materialCode: mat,
      materialName: MATERIALS[mat].name,
      facing: 'Flat Face (FF) - Standard (No Machining)',
      thickness: spec.thickness,
      thicknessLabel: spec.thicknessLabel,
      od: spec.od,
      boltCircle: spec.boltCircle,
      boltSize: spec.boltSize,
      actualWeightLbs: spec.actualWeightLbs,
      adjustedWeightLbs: spec.adjustedWeightLbs,
      unitPrice: spec.unitPrice,
      quantity: qty,
      handleStamp: `${client.poPrefix.split('-')[0]}-ABANDON`,
      requireMTR: true,
      addTHadle: true,
      addLiftingLug: false,
      addPlateDog: false,
      addWedge: false
    };

    const sub = simItem.unitPrice * qty;
    const wt = Math.round(simItem.actualWeightLbs * qty * 10) / 10;
    const ship = wt > 150 ? 245 : Math.max(18, Math.round(wt * 1.45 + 12));

    const simAbandoned: AbandonedCartRecord = {
      cartId: `ABANDON-SIM-${Date.now()}`,
      abandonedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      companyName: client.companyName,
      buyerName: `${client.buyerName} (${client.title})`,
      email: client.email,
      phone: client.phone,
      facilityLocation: client.facilityLocation,
      items: [simItem],
      subtotal: sub,
      shippingEstimate: ship,
      totalAmount: sub + ship,
      totalWeightLbs: wt,
      status: 'Abandoned',
      lastActiveStep: pickRandom(['Cart Drawer', 'Checkout Opened', 'Payment Selection'])
    };

    setAbandonedCarts(prev => [simAbandoned, ...prev]);

    setNotificationToast({
      type: 'alert',
      message: `🛒 Simulated Abandoned Cart logged for ${client.companyName} ($${(sub + ship).toFixed(2)})!`
    });
  };

  // 3. Batch Stress Test: Generate Multiple Orders across all 5 Kanban Stages
  const handleRunBatchSimulation = (count = 5) => {
    const stages: ProductionStatus[] = ['queued', 'plasma_cutting', 'deburred_stamped', 'ready_to_ship', 'shipped'];
    const newBatch: CustomerOrder[] = [];

    for (let i = 0; i < count; i++) {
      const client = INDUSTRIAL_TEST_CLIENTS[i % INDUSTRIAL_TEST_CLIENTS.length];
      const nps = pickRandom(ALL_NPS_SIZES);
      const pClass = pickRandom(ALL_PRESSURE_CLASSES);
      const mat = pickRandom(client.typicalMaterials);
      const thk = pickRandom(ALL_THICKNESSES);
      const qty = randomInt(1, 6);
      const stage = stages[i % stages.length];
      const isHot = i === 0; // First is Hot Shot

      const spec = calculateDynamicBlindPrice(
        pClass,
        nps,
        mat,
        thk.thickness,
        thk.fractionLabel,
        'Flat Face (FF) - Standard (No Machining)',
        true,
        nps === '12"' || nps === '16"',
        false,
        false,
        pricingConfig
      );

      const item: ConfiguredItem = {
        id: `ITEM-BATCH-${Date.now()}-${i}`,
        partNumber: spec.partNumber,
        nps,
        nominalSizeInches: parseFloat(nps.replace('"', '')) || 1.0,
        pressureClass: pClass,
        materialCode: mat,
        materialName: MATERIALS[mat].name,
        facing: 'Flat Face (FF) - Standard (No Machining)',
        thickness: spec.thickness,
        thicknessLabel: spec.thicknessLabel,
        od: spec.od,
        boltCircle: spec.boltCircle,
        boltSize: spec.boltSize,
        actualWeightLbs: spec.actualWeightLbs,
        adjustedWeightLbs: spec.adjustedWeightLbs,
        unitPrice: spec.unitPrice,
        quantity: qty,
        handleStamp: `${client.poPrefix.split('-')[0]}-STAMP-${i + 1}`,
        requireMTR: true,
        addTHadle: true,
        addLiftingLug: nps === '12"' || nps === '16"',
        addPlateDog: false,
        addWedge: false
      };

      const sub = item.unitPrice * qty;
      const wt = Math.round(item.actualWeightLbs * qty * 10) / 10;
      const hotFee = isHot ? pricingConfig.hotShotEmergencyFee : 0;
      const ship = wt > 150 ? 245 : Math.max(18, Math.round(wt * 1.45 + 12));

      const batchOrder: CustomerOrder = {
        orderId: isHot ? `HOT-BATCH-${randomInt(1000, 9999)}` : `PO-BATCH-${randomInt(1000, 9999)}`,
        orderSource: 'Website B2B',
        createdAt: new Date(Date.now() - i * 3600000).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
        companyName: client.companyName,
        contactName: client.buyerName,
        email: client.email,
        jobsiteAddress: client.jobsiteAddress,
        poNumber: `${client.poPrefix}${randomInt(10000, 99999)}`,
        items: [item],
        subtotal: sub,
        shippingCost: ship,
        hotShotFee: hotFee,
        totalAmount: sub + ship + hotFee,
        totalWeightLbs: wt,
        shippingMethod: isHot ? 'Emergency Hot Shot Courier' : wt > 150 ? 'LTL Palletized Freight' : 'UPS Ground Parcel',
        isHotShot: isHot,
        isLargeOrder: sub >= 10000 || wt >= 1000,
        leadTimeEstimate: isHot ? '🔥 HOT SHOT: 2-4 Hr Dispatch' : '⚡ Next-Day In-Stock Plate Dispatch',
        paymentMethod: client.preferredPaymentMethod,
        paymentStatus: 'Paid in Full',
        status: stage,
        millHeatNumber: stage === 'queued' ? 'Pending Staging' : `K${randomInt(10000, 99999)}-A (${mat})`,
        scheduledShipDate: new Date().toISOString().split('T')[0],
        carrierName: isHot ? 'Iron Prairie Hot-Shot' : 'UPS Ground',
        trackingNumber: stage === 'shipped' ? `1Z999TX${randomInt(10000000, 99999999)}` : 'PENDING-LABEL'
      };

      newBatch.push(batchOrder);
      triggerOrderEmailNotification(batchOrder);
    }

    setOrders(prev => [...newBatch, ...prev]);

    setNotificationToast({
      type: 'success',
      message: `⚡ Generated ${count} batch orders across all 5 Kanban stages & logged test email alerts for sales@ironprairiefabrication.com!`
    });
  };

  // 4. Run Full 11,880 Matrix Sweep in Browser
  const handleRunLiveMatrixSweep = () => {
    let tested = 0;
    let passed = 0;
    let minP = Infinity;
    let maxP = -Infinity;
    let minW = Infinity;
    let maxW = -Infinity;
    const start = performance.now();

    for (const pClass of ALL_PRESSURE_CLASSES) {
      for (const nps of ALL_NPS_SIZES) {
        for (const mat of ALL_MATERIAL_CODES) {
          for (const thk of ALL_THICKNESSES) {
            tested++;
            const res = calculateDynamicBlindPrice(
              pClass,
              nps,
              mat,
              thk.thickness,
              thk.fractionLabel,
              'Flat Face (FF) - Standard (No Machining)',
              false,
              false,
              false,
              false,
              pricingConfig
            );

            if (res.unitPrice && !isNaN(res.unitPrice) && res.actualWeightLbs && !isNaN(res.actualWeightLbs)) {
              passed++;
              if (res.unitPrice < minP) minP = res.unitPrice;
              if (res.unitPrice > maxP) maxP = res.unitPrice;
              if (res.actualWeightLbs < minW) minW = res.actualWeightLbs;
              if (res.actualWeightLbs > maxW) maxW = res.actualWeightLbs;
            }
          }
        }
      }
    }

    const elapsed = Math.round(performance.now() - start);

    setMatrixSweepStats({
      totalPermutations: tested,
      passedPermutations: passed,
      failedPermutations: tested - passed,
      minPrice: minP,
      maxPrice: maxP,
      minWeight: minW,
      maxWeight: maxW,
      elapsedMs: elapsed
    });

    setMatrixSweepModalOpen(true);
  };

  // Handle Client Login Submission
  const handleClientLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const company = (formData.get('companyName') as string) || 'Industrial Plant Partner';
    const buyer = (formData.get('buyerName') as string) || 'MRO Buyer';
    const email = (formData.get('email') as string) || 'buyer@plant.com';
    const location = (formData.get('facilityLocation') as string) || 'Gulf Coast Facility';

    const account: ClientAccount = {
      companyName: company,
      buyerName: buyer,
      email: email,
      facilityLocation: location,
      achAuthorized: true,
    };

    setClientAccount(account);
    setIsClientLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  // Quick Demo Login for Plant Mechanics
  const handleQuickDemoLogin = (preset: 'dow' | 'turner' | 'basf' | 'p66' | 'exxon') => {
    const presets: Record<string, ClientAccount> = {
      dow: { companyName: 'Dow Chemical (Texas Site)', buyerName: 'Mark Henderson (Turnaround Lead)', email: 'm.henderson@dow.com', facilityLocation: 'Texas', achAuthorized: true },
      turner: { companyName: 'Turner Industries', buyerName: 'Jason Miller (Procurement)', email: 'purchasing@turner-ind.com', facilityLocation: 'Port Arthur, TX', achAuthorized: true },
      basf: { companyName: 'BASF Texas Verbund', buyerName: 'David R. Vance', email: 'david.vance@basf.com', facilityLocation: 'Texas', achAuthorized: true },
      p66: { companyName: 'Phillips 66 Sweeny Refinery', buyerName: 'Brian Kowalski (Turnaround Emergency)', email: 'b.kowalski@p66.com', facilityLocation: 'Old Ocean, TX', achAuthorized: true },
      exxon: { companyName: 'ExxonMobil Baytown Complex', buyerName: 'Travis Hollingsworth', email: 'travis.hollingsworth@exxonmobil.com', facilityLocation: 'Baytown, TX', achAuthorized: true },
    };
    const acc = presets[preset] || presets.dow;
    setClientAccount(acc);
    setIsClientLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  // Client Logout
  const handleClientLogout = () => {
    if (cart.length > 0) {
      recordAbandonedCartSession(cart, 'Cart Drawer');
    }
    setIsClientLoggedIn(false);
    setClientAccount(null);
    setCart([]);
  };

  // Add Item to Order Cart
  const handleAddToCart = () => {
    const activeUnitPrice = isClientLoggedIn ? liveSpec.wholesalePrice : liveSpec.listPrice;
    const newItem: ConfiguredItem = {
      id: `ITEM-${Date.now()}`,
      partNumber: liveSpec.partNumber,
      nps: selectedNPS,
      nominalSizeInches: parseFloat(selectedNPS.replace('"', '').replace('-1/2', '.5').replace('-1/4', '.25').replace('-3/4', '.75')) || 1.0,
      pressureClass: selectedClass,
      materialCode: selectedMaterial,
      materialName: MATERIALS[selectedMaterial].name,
      facing: selectedFacing,
      thickness: liveSpec.thickness,
      thicknessLabel: liveSpec.thicknessLabel,
      od: liveSpec.od,
      boltCircle: liveSpec.boltCircle,
      boltSize: liveSpec.boltSize,
      actualWeightLbs: liveSpec.actualWeightLbs,
      adjustedWeightLbs: liveSpec.adjustedWeightLbs,
      unitPrice: activeUnitPrice,
      listPrice: liveSpec.listPrice,
      wholesalePrice: liveSpec.wholesalePrice,
      quantity,
      handleStamp: handleStamp.trim() || 'STANDARD',
      requireMTR,
      addTHadle,
      addLockoutHole,
      addLiftingLug,
      addPlateDog,
      addWedge,
      blindType,
    };

    setCart(prev => [...prev, newItem]);
    setIsCartOpen(true);
  };

  // Add Multi-Item Batch from Rapid Matrix Table to Cart
  const handleBatchAddToCart = (batchItems: any[]) => {
    const converted: ConfiguredItem[] = batchItems.map(b => ({
      id: b.id || `ITEM-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      partNumber: b.partNumber || b.sku,
      nps: b.nps,
      nominalSizeInches: b.nominalSizeInches || parseFloat(b.nps.replace('"', '')) || 4.0,
      pressureClass: b.pressureClass,
      materialCode: b.materialCode,
      materialName: b.materialName || MATERIALS[b.materialCode as MaterialCode]?.name || b.materialCode,
      facing: b.facing || 'Flat Face (FF) - Standard (No Machining)',
      thickness: b.thickness,
      thicknessLabel: b.thicknessLabel,
      od: b.od,
      boltCircle: b.boltCircle,
      boltSize: b.boltSize,
      actualWeightLbs: b.actualWeightLbs,
      adjustedWeightLbs: b.adjustedWeightLbs || b.actualWeightLbs,
      unitPrice: b.unitPrice,
      quantity: b.quantity,
      handleStamp: b.handleStamp || 'STANDARD',
      requireMTR: b.requireMTR ?? true,
      addTHadle: b.addTHadle ?? false,
      addLockoutHole: b.addLockoutHole ?? false,
      addLiftingLug: b.addLiftingLug ?? false,
      addPlateDog: b.addPlateDog ?? false,
      addWedge: b.addWedge ?? false,
      blindType: b.blindType || 'Paddle Blind',
      productType: b.productType,
    }));

    setCart(prev => [...prev, ...converted]);
    setIsCartOpen(true);
  };

  // Open Instant Proposal Modal for arbitrary items (single or batch)
  const handleOpenProposalForItems = (itemsToPropose: any[]) => {
    setProposalModalItems(itemsToPropose);
    setIsProposalModalOpen(true);
  };

  // Handle PO Confirmation from within the Instant Proposal Modal
  const handleConfirmProposalAsPO = async (poOrderData: any) => {
    const newOrder: CustomerOrder = {
      orderId: poOrderData.orderId || `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      orderSource: 'Website B2B Proposal Conversion',
      createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      companyName: poOrderData.companyName,
      contactName: poOrderData.contactName,
      email: poOrderData.email,
      jobsiteAddress: poOrderData.jobsiteAddress,
      poNumber: poOrderData.poNumber,
      items: poOrderData.items,
      subtotal: poOrderData.subtotal,
      shippingCost: poOrderData.shippingCost,
      hotShotFee: poOrderData.hotShotFee,
      totalAmount: poOrderData.totalAmount,
      totalWeightLbs: poOrderData.totalWeightLbs,
      shippingMethod: poOrderData.shippingMethod,
      isHotShot: poOrderData.isHotShot,
      isLargeOrder: poOrderData.totalAmount >= 10000 || poOrderData.totalWeightLbs >= 1000,
      leadTimeEstimate: poOrderData.leadTimeEstimate,
      paymentMethod: 'Net 30 Commercial PO',
      paymentStatus: 'Net 30 Authorized',
      status: 'queued',
      millHeatNumber: 'Pending Shop Staging',
      scheduledShipDate: poOrderData.isHotShot ? `${new Date().toISOString().split('T')[0]} (TODAY RUSH)` : new Date(Date.now() + 86400000).toISOString().split('T')[0],
      carrierName: poOrderData.isHotShot ? 'Iron Prairie Hot-Shot Dedicated' : poOrderData.totalWeightLbs > 150 ? 'Southeastern Freight' : 'UPS Ground',
      trackingNumber: poOrderData.isHotShot ? 'HOT-SHOT-DIRECT-TRUCK' : 'PENDING-LABEL',
    };

    setOrders(prev => [newOrder, ...prev]);
    await triggerOrderEmailNotification(newOrder);
    setCart([]);
    setIsCartOpen(false);
    setNotificationToast({
      type: 'success',
      message: `⚡ PO #${newOrder.poNumber} Confirmed & Queued to Shop Floor Plasma Table!`
    });
  };

  // Submit Multi-Payment Checkout & Push into Whiteboard
  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    let payLabel: 'Credit Card' | 'ACH Direct Debit' | 'Net 30 Commercial PO' = 'Net 30 Commercial PO';
    let payStatus: 'Paid in Full' | 'ACH Clearing' | 'Net 30 Authorized' = 'Net 30 Authorized';

    if (checkoutPaymentMethod === 'credit_card') {
      payLabel = 'Credit Card';
      payStatus = 'Paid in Full';
    } else if (checkoutPaymentMethod === 'ach') {
      payLabel = 'ACH Direct Debit';
      payStatus = 'ACH Clearing';
    }

    const companyName = (formData.get('companyName') as string) || clientAccount?.companyName || 'Dow Chemical';
    const contactName = (formData.get('contactName') as string) || clientAccount?.buyerName || 'Industrial Procurement';
    const email = (formData.get('email') as string) || clientAccount?.email || 'buyer@dow.com';
    const address = (formData.get('address') as string) || 'Industrial Plant Gate 4 Receiving, TX';
    const poNumber = (formData.get('poNumber') as string) || `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: CustomerOrder = {
      orderId: isHotShotOrder ? `HOT-2026-${Math.floor(1000 + Math.random() * 9000)}` : `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      orderSource: 'Website B2B',
      createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      companyName,
      contactName,
      email,
      jobsiteAddress: address,
      poNumber,
      items: [...cart],
      subtotal: cartSubtotal,
      shippingCost: shippingEstimate,
      hotShotFee: activeHotShotFee,
      totalAmount: grandTotal,
      totalWeightLbs: cartTotalWeight,
      shippingMethod: isHotShotOrder ? 'Emergency Hot Shot Courier' : cartTotalWeight > 150 ? 'LTL Palletized Freight' : 'UPS Ground Parcel',
      isHotShot: isHotShotOrder,
      isLargeOrder: isLargeVolumeOrder,
      leadTimeEstimate: activeLeadTimeText,
      paymentMethod: payLabel,
      paymentStatus: payStatus,
      status: 'queued',
      millHeatNumber: isLargeVolumeOrder ? 'Mill Plate Allocation In Progress' : 'Pending Shop Staging',
      scheduledShipDate: isHotShotOrder ? `${new Date().toISOString().split('T')[0]} (TODAY RUSH)` : isLargeVolumeOrder ? '5-7 Business Days' : new Date(Date.now() + 86400000).toISOString().split('T')[0],
      carrierName: isHotShotOrder ? 'Iron Prairie Hot-Shot Dedicated' : cartTotalWeight > 150 ? 'Southeastern Freight' : 'UPS Ground',
      trackingNumber: isHotShotOrder ? 'HOT-SHOT-DIRECT-TRUCK' : 'PENDING-LABEL',
    };

    setOrders(prev => [newOrder, ...prev]);

    // AUTOMATED ORDER NOTIFICATION DISPATCH TO RUSSELL & ALICIA
    await triggerOrderEmailNotification(newOrder);

    // If client had an abandoned cart, mark it recovered
    setAbandonedCarts(prev => prev.map(c => c.companyName === companyName || c.email === email ? { ...c, status: 'Recovered' } : c));

    setCart([]);
    setIsCheckoutOpen(false);
    setIsHotShotOrder(false);
    setActiveTab('whiteboard');
    navigate('/shop-floor');

    setNotificationToast({
      type: 'email',
      message: `✉️ Order #${newOrder.poNumber} confirmed! Immediate notification email dispatched to sales@ironprairiefabrication.com & IPG team!`
    });
  };

  // Move Kanban Order Forward
  const advanceOrderStatus = (orderId: string) => {
    const statusProgression: Record<ProductionStatus, ProductionStatus> = {
      queued: 'plasma_cutting',
      plasma_cutting: 'deburred_stamped',
      deburred_stamped: 'ready_to_ship',
      ready_to_ship: 'shipped',
      shipped: 'shipped',
    };

    setOrders(prev =>
      prev.map(ord => {
        if (ord.orderId === orderId) {
          const nextStatus = statusProgression[ord.status];
          return {
            ...ord,
            status: nextStatus,
            millHeatNumber:
              ord.millHeatNumber === 'Pending Assignment' || ord.millHeatNumber === 'Pending Shop Staging' || ord.millHeatNumber === 'Mill Plate Allocation In Progress'
                ? 'K49201-B (Dual-Cert)'
                : ord.millHeatNumber,
            trackingNumber: nextStatus === 'shipped' && ord.trackingNumber === 'PENDING-LABEL'
              ? '1Z899TX' + Math.floor(1000000000 + Math.random() * 9000000000)
              : ord.trackingNumber,
          };
        }
        return ord;
      })
    );
  };

  // Update Heat Number Inline
  const updateHeatNumber = (orderId: string, heat: string) => {
    setOrders(prev => prev.map(o => (o.orderId === orderId ? { ...o, millHeatNumber: heat } : o)));
  };

  // Generate Amazon TSV
  const generateAmazonFlatFileTSV = () => {
    const headers = [
      'sku\tproduct_name\tbrand\titem_type_keyword\tstandard_price\tquantity\titem_weight\titem_weight_unit\tmaterial_type\tpressure_class\tnps_size\tbullet_point_1\tbullet_point_2\tbullet_point_3'
    ];
    const rows = cart.map(item => {
      const b1 = `Manufactured strictly to ASME B16.48 line blind specifications.`;
      const b2 = `CNC plasma-cut from certified domestic plate with stamped heat number and full size/class stamping.`;
      const b3 = `Certified Mill Test Reports (MTRs) included for positive plant pipeline isolation and turnaround compliance.`;
      return `${item.partNumber}\t"${item.nps} NPS Class ${item.pressureClass}# Paddle Blind (${item.thicknessLabel} Thk) - ${item.materialName}"\t"Iron Prairie Fabrication Group"\tpipe-fittings\t${item.unitPrice.toFixed(2)}\t50\t${item.adjustedWeightLbs}\tpounds\t"${item.materialName}"\t"${item.pressureClass}#"\t"${item.nps}"\t"${b1}"\t"${b2}"\t"${b3}"`;
    });
    return [headers, ...rows].join('\n');
  };

  // --------------------------------------------------------------------------
  // 3.1 RENDER FUNCTION: STOREFRONT CONFIGURATOR
  // --------------------------------------------------------------------------
  const renderStorefrontView = () => (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-5 space-y-3 sm:space-y-4 w-full min-w-0">
          
      {/* Compact Top Bar: Facility Specs & Catalog Mode Switcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-3 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-sky-700 uppercase tracking-wider pr-2 sm:border-r sm:border-slate-200">
            <Flame className="h-3.5 w-3.5 text-sky-600 shrink-0" />
            <span className="hidden sm:inline">Texas Facility &bull; ASME B16.48 In-House Plasma Cutting</span>
            <span className="sm:hidden">Texas ASME B16.48</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-slate-500 flex-wrap">
            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Domestic Plate</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 hidden md:inline">Hi-Def Plasma</span>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
              <ShieldCheck className="h-3 w-3 text-emerald-600" /> Free 3.1 MTRs
            </span>
            <a
              href={`mailto:${IPG_SALES_EMAIL}?subject=Turnaround%20RFP%20/%20Proposal%20Request`}
              className="bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-900 font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm transition-colors"
            >
              <Mail className="h-3 w-3 text-sky-700" />
              <span>{IPG_SALES_EMAIL}</span>
            </a>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setStorefrontMode('rapid_grid')}
            className={`flex items-center justify-center gap-1.5 py-2 sm:py-1.5 px-2 sm:px-3 rounded-md text-xs font-bold transition-all min-h-[38px] ${
              storefrontMode === 'rapid_grid'
                ? 'bg-sky-800 text-white shadow-sm font-black'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Turnaround Order Grid</span>
            <span className="sm:hidden text-[11px]">Order Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setStorefrontMode('custom_configurator')}
            className={`flex items-center justify-center gap-1.5 py-2 sm:py-1.5 px-2 sm:px-3 rounded-md text-xs font-bold transition-all min-h-[38px] ${
              storefrontMode === 'custom_configurator'
                ? 'bg-sky-800 text-white shadow-sm font-black'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-sky-400 shrink-0" />
            <span className="hidden sm:inline">Custom CAD Configurator</span>
            <span className="sm:hidden text-[11px]">Custom CAD</span>
          </button>
        </div>
      </div>

          {/* MODE 1: RAPID MULTI-SIZE ORDER MATRIX */}
          {storefrontMode === 'rapid_grid' ? (
            <RapidMatrixOrderGrid
              onAddBatchToCart={handleBatchAddToCart}
              onOpenProposalModal={handleOpenProposalForItems}
              masterGeometry={MASTER_GEOMETRY}
              materials={MATERIALS}
              calculateBlindPrice={calculateDynamicBlindPrice}
              pricingConfig={pricingConfig}
              isClientLoggedIn={isClientLoggedIn}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
              onOpenBulkRfqModal={() => setIsBulkRfqModalOpen(true)}
            />
          ) : (
            /* MODE 2: DEEP PARAMETRIC CONFIGURATOR & CAD PREVIEW */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left: 3-Click Selection Form */}
              <div className="lg:col-span-7 space-y-6">
              
              {/* Step 0: Blind Family & Style Selector */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="h-5 w-5 bg-sky-700 text-white rounded-full flex items-center justify-center text-[11px] font-bold">1</span>
                    Select Isolation Product Family
                  </label>
                  <span className="text-xs font-mono text-sky-700 font-bold">Style: {blindType}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setBlindType('Paddle Blind')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      blindType === 'Paddle Blind'
                        ? 'bg-sky-50 border-sky-700 text-slate-900 shadow-sm ring-1 ring-sky-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">⚪ Paddle Blind (Solid Blank)</span>
                      <span className="text-[10px] font-mono bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-bold">Standard</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Single solid disc for complete positive pipeline line-break isolation.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBlindType('Figure 8 (Spectacle Blind)')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      blindType === 'Figure 8 (Spectacle Blind)'
                        ? 'bg-amber-50 border-amber-600 text-slate-900 shadow-sm ring-1 ring-amber-500'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">♾️ Figure 8 (Spectacle Blind)</span>
                      <span className="text-[10px] font-mono bg-amber-200 text-amber-950 px-2 py-0.5 rounded font-black">2x Cost</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Dual-disc spectacle assembly (Solid Blank + Open Ring Spacer) joined by central web.
                    </p>
                  </button>
                </div>
              </div>

              {/* Step 1: NPS Size */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="h-5 w-5 bg-sky-700 text-white rounded-full flex items-center justify-center text-[11px] font-bold">2</span>
                    Select Nominal Pipe Size (NPS)
                  </label>
                  <span className="text-xs font-mono text-sky-700 font-bold">Selected: {selectedNPS}</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
                  {NPS_SIZES.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedNPS(size)}
                      className={`py-3 text-xs font-mono font-bold rounded-xl border transition-all ${
                        selectedNPS === size
                          ? 'bg-sky-700 text-white border-sky-700 shadow-sm scale-[1.02]'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Pressure Rating */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="h-5 w-5 bg-sky-700 text-white rounded-full flex items-center justify-center text-[11px] font-bold">3</span>
                    Select Pressure Rating (ASME Class)
                  </label>
                  <span className="text-xs font-mono text-sky-700 font-bold">{selectedClass}# Class</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 pt-1">
                  {([150, 300, 600, 900, 1500] as PressureClass[]).map(pClass => (
                    <button
                      key={pClass}
                      onClick={() => setSelectedClass(pClass)}
                      className={`py-3 px-2 text-center rounded-xl border transition-all ${
                        selectedClass === pClass
                          ? 'bg-sky-700 text-white border-sky-700 font-bold shadow-sm scale-[1.02]'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-sm font-bold">{pClass}#</div>
                      <div className="text-[10px] opacity-80 font-mono">ASME Std</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Material Grade & Metallurgy Breakdown */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="h-5 w-5 bg-sky-700 text-white rounded-full flex items-center justify-center text-[11px] font-bold">4</span>
                    Select Material Grade &amp; Metallurgy Spec
                  </label>
                  <span className="text-xs font-mono text-sky-700 font-bold">{MATERIALS[selectedMaterial].name.split('(')[0]}</span>
                </div>

                {/* Carbon Steel Category */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Carbon Steel Plates:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(['SA-36', 'SA-516-70'] as MaterialCode[]).map(code => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setSelectedMaterial(code)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedMaterial === code
                            ? 'bg-sky-50 border-sky-600 text-slate-900 shadow-sm scale-[1.01]'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{MATERIALS[code].name.split('(')[0]}</span>
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                            {MATERIALS[code].badge}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 font-mono">{MATERIALS[code].shortSpec}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stainless Steel Category */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Stainless Steel Alloys:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(['304', '304L', '316L'] as MaterialCode[]).map(code => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setSelectedMaterial(code)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedMaterial === code
                            ? 'bg-sky-50 border-sky-600 text-slate-900 shadow-sm scale-[1.01]'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{code === '304L' ? '304 / 304L' : code}</span>
                          <span className="text-[9px] font-mono bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-semibold">
                            {code === '316L' ? 'Acid/Refinery' : 'Stainless'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 font-mono">{MATERIALS[code].shortSpec}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aluminum Category */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Aluminum Plate:</span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {(['AL-6061'] as MaterialCode[]).map(code => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setSelectedMaterial(code)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedMaterial === code
                            ? 'bg-sky-50 border-sky-600 text-slate-900 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{MATERIALS[code].name}</span>
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                            Lightweight High Strength
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-mono">{MATERIALS[code].shortSpec}</div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Step 4: Plate Thickness Selection (Default to 11 Gauge) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="h-5 w-5 bg-sky-700 text-white rounded-full flex items-center justify-center text-[11px] font-bold">5</span>
                    Select Plate Thickness
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const asmeGeom = MASTER_GEOMETRY[selectedClass]?.[selectedNPS] || { nominalThickness: 0.1196, thicknessLabel: '11 Gauge' };
                        setSelectedThickness(asmeGeom.nominalThickness);
                        setSelectedThicknessLabel(asmeGeom.thicknessLabel);
                      }}
                      className="text-[11px] bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-semibold px-2.5 py-1 rounded-lg transition-colors"
                    >
                      ⚡ ASME Turnaround Spec ({MASTER_GEOMETRY[selectedClass]?.[selectedNPS]?.thicknessLabel || '11 Gauge'})
                    </button>
                    <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      Active: {selectedThicknessLabel}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 flex items-center justify-between">
                  <span>Standard Turnaround Utility Isolation Default: <strong>11 Gauge (0.120")</strong></span>
                  <span className="text-[10px] font-mono text-slate-500">Industry Standard</span>
                </div>

                {/* Thickness Pills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-1 font-mono text-xs">
                  {THICKNESS_OPTIONS.map(thk => (
                    <button
                      key={thk.label}
                      type="button"
                      onClick={() => {
                        setSelectedThickness(thk.thickness);
                        setSelectedThicknessLabel(thk.label);
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        selectedThickness === thk.thickness
                          ? 'bg-sky-700 text-white border-sky-700 font-bold shadow-sm scale-[1.02]'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold text-xs">{thk.label}</div>
                      <div className="text-[10px] opacity-75 mt-0.5 font-mono">
                        {thk.isDefault ? 'Standard Default' : `${thk.thickness}"`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 5: Facings, Stamping & MTR Toggle */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                
                {/* Facing Type with Variable Machining Calculation */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      6. Gasket Contact Face &amp; Machining Finish
                    </label>
                    <span className="text-[11px] font-mono text-emerald-700 font-bold">
                      Standard Default: Flat Face (In-Stock)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedFacing('Flat Face (FF) - Standard (No Machining)')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        selectedFacing === 'Flat Face (FF) - Standard (No Machining)'
                          ? 'bg-sky-50 border-sky-600 text-slate-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Flat Face (FF) &mdash; Standard
                        </span>
                        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                          Stock Item
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Clean CNC plasma-cut domestic plate. No machining required. Instant burn &amp; rapid dispatch.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedFacing('Machined Gasket Finish (Special Order)')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        selectedFacing === 'Machined Gasket Finish (Special Order)'
                          ? 'bg-amber-50 border-amber-500 text-slate-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">
                          Machined Gasket Finish
                        </span>
                        <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                          Special Order (+${getVariableMachiningCost(liveSpec.od, pricingConfig)})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Phonographic / serrated gasket contact surface. CNC lathe facing adder dynamically calculated based on {selectedNPS} ({liveSpec.od}" OD).
                      </p>
                    </button>
                  </div>
                </div>

                {/* Custom Handle Stamping */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    7. Handle Line ID / Unit Stamping (Max 20 Characters)
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    value={handleStamp}
                    onChange={e => setHandleStamp(e.target.value.toUpperCase())}
                    placeholder="e.g., ISO-UNIT-4-BLIND"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:bg-white"
                  />
                </div>

                {/* CRUCIAL MTR REQUIREMENT TOGGLE */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    8. Material Test Report (MTR) Compliance Protocol
                  </label>
                  <div className="space-y-2">
                    <label
                      onClick={() => setRequireMTR(true)}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        requireMTR
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="mtr_toggle"
                        checked={requireMTR}
                        onChange={() => setRequireMTR(true)}
                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1.5 text-emerald-800">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Require Certified MTR Packet (Recommended)
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          Dual-certified mill test report with verified heat numbers physically stamped on handle &amp; digital PDF attached.
                        </p>
                      </div>
                    </label>

                    <label
                      onClick={() => setRequireMTR(false)}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        !requireMTR
                          ? 'bg-slate-100 border-slate-300 text-slate-900'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="mtr_toggle"
                        checked={!requireMTR}
                        onChange={() => setRequireMTR(false)}
                        className="mt-0.5 text-sky-600 focus:ring-sky-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          No MTR Required (Commercial Utility / Hydrotest Only)
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Standard commercial shop burn. Speeds up dispatch for non-critical line testing.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Extras & Add-ons */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      9. Optional Turnaround Add-ons &amp; Custom Handles
                    </label>
                    <span className="text-[11px] font-mono text-slate-500">Stock Default: Straight Handle</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {/* T-Handle */}
                    <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${addTHadle ? 'bg-sky-50 border-sky-600 text-slate-900 font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}>
                      <div className="flex items-center gap-2.5">
                        <input type="checkbox" checked={addTHadle} onChange={e => setAddTHadle(e.target.checked)} className="h-4 w-4 rounded text-sky-600 focus:ring-sky-500" />
                        <div>
                          <span className="block font-semibold">Integral CNC Cut T-Handle</span>
                          <span className="text-[10px] text-slate-500 font-mono font-normal">1-Piece Cut-Out Profile (No Welds)</span>
                        </div>
                      </div>
                      <span className="font-mono text-sky-800 font-bold">+${ACCESSORY_PRICES.tHandlePrice.toFixed(2)}</span>
                    </label>

                    {/* 3/8" Lockout Hole */}
                    <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${addLockoutHole ? 'bg-amber-50 border-amber-600 text-slate-900 font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}>
                      <div className="flex items-center gap-2.5">
                        <input type="checkbox" checked={addLockoutHole} onChange={e => setAddLockoutHole(e.target.checked)} className="h-4 w-4 rounded text-amber-600 focus:ring-amber-500" />
                        <div>
                          <span className="block font-semibold">3/8" Lockout Hole in Center</span>
                          <span className="text-[10px] text-slate-500 font-mono font-normal">Center Safety Lockout / Tagout Hole</span>
                        </div>
                      </div>
                      <span className="font-mono text-amber-800 font-bold">+${ACCESSORY_PRICES.lockoutHolePrice.toFixed(2)}</span>
                    </label>

                    {/* Lifting Lug */}
                    <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${addLiftingLug ? 'bg-sky-50 border-sky-600 text-slate-900 font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}>
                      <div className="flex items-center gap-2.5">
                        <input type="checkbox" checked={addLiftingLug} onChange={e => setAddLiftingLug(e.target.checked)} className="h-4 w-4 rounded text-sky-600 focus:ring-sky-500" />
                        <div>
                          <span className="block font-semibold">Welded Lifting Lug (3/4" Eye)</span>
                          <span className="text-[10px] text-slate-500 font-mono font-normal">Heavy Crane Hoist Rigging</span>
                        </div>
                      </div>
                      <span className="font-mono text-sky-800 font-bold">+${ACCESSORY_PRICES.liftingLugPrice.toFixed(2)}</span>
                    </label>

                    {/* Plate Dog */}
                    <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${addPlateDog ? 'bg-sky-50 border-sky-600 text-slate-900 font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}>
                      <div className="flex items-center gap-2.5">
                        <input type="checkbox" checked={addPlateDog} onChange={e => setAddPlateDog(e.target.checked)} className="h-4 w-4 rounded text-sky-600 focus:ring-sky-500" />
                        <div>
                          <span className="block font-semibold">Plate Alignment Dog</span>
                          <span className="text-[10px] text-slate-500 font-mono font-normal">Fabrication Tooling</span>
                        </div>
                      </div>
                      <span className="font-mono text-sky-800 font-bold">+${ACCESSORY_PRICES.plateDogPrice.toFixed(2)}</span>
                    </label>

                    {/* Fit-Up Wedge */}
                    <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${addWedge ? 'bg-sky-50 border-sky-600 text-slate-900 font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}>
                      <div className="flex items-center gap-2.5">
                        <input type="checkbox" checked={addWedge} onChange={e => setAddWedge(e.target.checked)} className="h-4 w-4 rounded text-sky-600 focus:ring-sky-500" />
                        <div>
                          <span className="block font-semibold">Flange Fit-Up Wedge</span>
                          <span className="text-[10px] text-slate-500 font-mono font-normal">Turnaround Tooling</span>
                        </div>
                      </div>
                      <span className="font-mono text-sky-800 font-bold">+${ACCESSORY_PRICES.fitUpWedgePrice.toFixed(2)}</span>
                    </label>
                  </div>
                </div>

              </div>

            </div>

            {/* Right: Dynamic 2D/3D CAD Visualizer, Live Spec Sheet & GATED PRICING ORDERING CARD */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Interactive 2D/3D CAD Paddle Blind Visualizer */}
              <PaddleBlindVisualizer
                nps={selectedNPS}
                pressureClass={selectedClass}
                materialCode={selectedMaterial}
                thicknessLabel={liveSpec.thicknessLabel}
                facing={selectedFacing}
                handleStamp={handleStamp}
                addTHadle={addTHadle}
                addLockoutHole={addLockoutHole}
                addLiftingLug={addLiftingLug}
                od={liveSpec.od}
                thickness={liveSpec.thickness}
                blindType={blindType}
              />

              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-md space-y-5">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Live Plasma Cut Spec</h2>
                    <span className="text-xs font-mono text-sky-700 font-bold">{liveSpec.partNumber}</span>
                  </div>
                  <div className="text-right">
                    {isClientLoggedIn ? (
                      <div>
                        <div className="flex items-center justify-end gap-1.5 font-mono">
                          <span className="text-xs text-slate-400 line-through">${liveSpec.listPrice.toFixed(2)}</span>
                          <span className="text-lg font-black text-slate-900">${liveSpec.wholesalePrice.toFixed(2)}</span>
                        </div>
                        <div className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded w-fit ml-auto mt-0.5">
                          SAVE 10% (Trade Rate)
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-lg font-black font-mono text-slate-900">${liveSpec.listPrice.toFixed(2)}</div>
                        <button
                          type="button"
                          onClick={() => setIsLoginModalOpen(true)}
                          className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-bold text-sky-800 bg-sky-50 border border-sky-300 hover:bg-sky-100 px-2 py-0.5 rounded shadow-sm transition-all"
                        >
                          <Lock className="h-3 w-3 text-sky-600" />
                          <span>10% Trade: ${liveSpec.wholesalePrice.toFixed(2)}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Technical Parameters Matrix */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nominal Pipe Size:</span>
                    <span className="text-slate-900 font-bold">{selectedNPS} NPS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pressure Rating:</span>
                    <span className="text-slate-900">{selectedClass}# Class</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Material Spec:</span>
                    <span className="text-slate-900">{MATERIALS[selectedMaterial].name.split('(')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nominal Plate Thickness:</span>
                    <span className="text-slate-900">{liveSpec.thicknessLabel} ({liveSpec.thickness}")</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Outer Diameter (OD):</span>
                    <span className="text-slate-900">{liveSpec.od}"</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bolt Circle (BC) &amp; Bolt:</span>
                    <span className="text-slate-900">{liveSpec.boltCircle}" BC / {liveSpec.boltSize}" Bolt</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Scale className="h-3.5 w-3.5 text-sky-600" /> Unit Weight:
                    </span>
                    <span className="text-slate-900 font-bold">{liveSpec.actualWeightLbs} lbs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5 text-sky-600" /> Shipping Class:
                    </span>
                    <span className={liveSpec.actualWeightLbs >= 100 ? 'text-sky-800 font-semibold' : 'text-emerald-700 font-semibold'}>
                      {liveSpec.actualWeightLbs >= 100 ? 'LTL Pallet Freight' : 'UPS Ground Parcel'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">MTR Protocol:</span>
                    <span className={requireMTR ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                      {requireMTR ? 'Traceable MTR Attached' : 'Commercial Utility'}
                    </span>
                  </div>
                </div>

                {/* DEDICATED HOT SHOT COURIER DISPATCH TOGGLE */}
                <div className={`p-4 rounded-xl border transition-all ${
                  isHotShotOrder
                    ? 'bg-rose-50 border-rose-300 shadow-sm'
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isHotShotOrder}
                      onChange={e => setIsHotShotOrder(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                          <Truck className="h-4 w-4 text-rose-600" /> Call Out Dedicated Hot Shot Delivery (Champion Logistics)
                        </span>
                        <span className="font-mono text-xs font-bold text-rose-700">
                          +${pricingConfig.hotShotEmergencyFee.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Dispatch a dedicated Hot Shot courier (e.g. Champion Logistics) immediately upon burn completion for same-day delivery directly to your plant gate or turnaround unit.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Turnaround Dimensional & Scale Weight Matrix Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Manufacturing &amp; Material Specifications
                  </h3>

                  <div className="space-y-2.5 text-xs font-mono">
                    <div className="flex justify-between pb-2 border-b border-slate-100">
                      <span className="text-slate-500">Outer Diameter (OD):</span>
                      <span className="text-slate-900 font-bold">{liveSpec.od.toFixed(3)}"</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-100">
                      <span className="text-slate-500">Bolt Circle (BC):</span>
                      <span className="text-slate-900 font-bold">{liveSpec.boltCircle.toFixed(3)}"</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-100">
                      <span className="text-slate-500">Plate Thickness:</span>
                      <span className="text-slate-900 font-bold">{liveSpec.thicknessLabel}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-100">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Scale className="h-3.5 w-3.5 text-sky-600" /> Unit Scale Weight:
                      </span>
                      <span className="text-slate-900 font-bold">{liveSpec.actualWeightLbs} lbs</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-100">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Truck className="h-3.5 w-3.5 text-sky-600" /> Shipping Class:
                      </span>
                      <span className={liveSpec.actualWeightLbs >= 100 ? 'text-sky-800 font-semibold' : 'text-emerald-700 font-semibold'}>
                        {liveSpec.actualWeightLbs >= 100 ? 'LTL Pallet Freight' : 'UPS Ground Parcel'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">MTR Traceability:</span>
                      <span className={requireMTR ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                        {requireMTR ? 'Traceable MTR Attached (Free)' : 'Commercial Utility'}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controller */}
                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-[11px] text-slate-700 uppercase font-bold tracking-wider">
                        Select Quantity:
                      </label>
                      <span className="text-xs font-mono text-slate-600 font-bold">
                        Total Weight: {(liveSpec.actualWeightLbs * quantity).toFixed(1)} lbs
                      </span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 font-mono text-xs mb-3">
                      {[1, 5, 10, 25, 50, 100].map(qtyVal => (
                        <button
                          key={qtyVal}
                          onClick={() => setQuantity(qtyVal)}
                          className={`py-2 rounded-lg border font-bold transition-all ${
                            quantity === qtyVal
                              ? 'bg-sky-700 text-white border-sky-700 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {qtyVal}x
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Custom Qty:</span>
                      <div className="flex items-center bg-white border border-slate-300 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 text-slate-600 hover:text-slate-900"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="5000"
                          value={quantity}
                          onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-16 bg-transparent text-center font-mono font-bold text-slate-900 text-sm focus:outline-none"
                        />
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-2 text-slate-600 hover:text-slate-900"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Prominent Official Proposal & Direct Sales RFQ Box */}
                  <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 border border-sky-800/40 rounded-2xl p-4 text-white shadow-md space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-amber-400 shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">
                          Official B2B Proposal Desk
                        </span>
                      </div>
                      <span className="text-[10px] font-mono bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded font-bold">
                        30-Day Price Lock
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Need a formal itemized proposal for corporate purchasing approval or Net 30 PO processing? Generate an instant proposal below or contact our sales estimating team directly:
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
                      <a
                        href={`mailto:${IPG_SALES_EMAIL}?subject=Turnaround%20Proposal%20Request%20-%20${liveSpec.partNumber}`}
                        className="text-amber-300 hover:text-white underline font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Mail className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span>{IPG_SALES_EMAIL}</span>
                      </a>
                      <a
                        href="tel:+19792489266"
                        className="text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                        <span>(979) 248-9266</span>
                      </a>
                    </div>
                  </div>

                  {/* Primary Proposal & Cart Actions */}
                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const activeUnitPrice = isClientLoggedIn ? liveSpec.wholesalePrice : liveSpec.listPrice;
                        handleOpenProposalForItems([{
                          id: `ITEM-${Date.now()}`,
                          partNumber: liveSpec.partNumber,
                          sku: liveSpec.partNumber,
                          nps: selectedNPS,
                          nominalSizeInches: parseFloat(selectedNPS.replace('"', '').replace('-1/2', '.5').replace('-1/4', '.25').replace('-3/4', '.75')) || 4.0,
                          pressureClass: selectedClass,
                          materialCode: selectedMaterial,
                          material: selectedMaterial,
                          materialName: MATERIALS[selectedMaterial].name,
                          facing: selectedFacing,
                          thickness: liveSpec.thickness,
                          thicknessLabel: liveSpec.thicknessLabel,
                          od: liveSpec.od,
                          boltCircle: liveSpec.boltCircle,
                          boltSize: liveSpec.boltSize,
                          actualWeightLbs: liveSpec.actualWeightLbs,
                          finishedWeightPerUnit: liveSpec.actualWeightLbs,
                          adjustedWeightLbs: liveSpec.adjustedWeightLbs,
                          unitPrice: activeUnitPrice,
                          listPrice: liveSpec.listPrice,
                          wholesalePrice: liveSpec.wholesalePrice,
                          quantity,
                          handleStamp: handleStamp.trim() || 'STANDARD',
                          requireMTR,
                          addTHadle,
                          addLockoutHole,
                          addLiftingLug,
                          addPlateDog,
                          addWedge,
                          blindType,
                        }]);
                      }}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg active:scale-98 text-xs sm:text-sm uppercase tracking-wider"
                    >
                      <FileText className="h-4 w-4" /> Generate Instant Official Proposal
                    </button>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="w-full bg-sky-800 hover:bg-sky-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md active:scale-98 text-xs sm:text-sm uppercase tracking-wider"
                    >
                      <ShoppingCart className="h-4 w-4" /> Add {quantity}x to Order Cart
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-500 text-center pt-2 border-t border-slate-200">
                    🔒 Official proposals generated with 30-day price lock and emailed directly from <strong className="text-slate-700 font-mono">{IPG_SALES_EMAIL}</strong>
                  </div>

                </div>

              </div>
            </div>

          </div>
          )}

    </div>
  );

  // --------------------------------------------------------------------------
  // 3.2 RENDER FUNCTION: SHOP FLOOR WHITEBOARD, ANALYTICS, ABANDONED CARTS & DISPATCH
  // --------------------------------------------------------------------------
  const renderShopFloorView = () => {
    // Analytics calculations
    const totalGrossRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const activePipelineRevenue = orders.filter(o => o.status !== 'shipped').reduce((sum, o) => sum + o.totalAmount, 0);
    const totalAbandonedValue = abandonedCarts.filter(c => c.status === 'Abandoned').reduce((sum, c) => sum + c.totalAmount, 0);
    const totalWeightLbs = orders.reduce((sum, o) => sum + o.totalWeightLbs, 0);
    const totalTonnage = (totalWeightLbs / 2000).toFixed(2);
    const totalUnitsCount = orders.reduce((sum, o) => sum + o.items.reduce((isum, i) => isum + i.quantity, 0), 0);
    const averageOrderValue = orders.length > 0 ? totalGrossRevenue / orders.length : 0;
    const totalCartSessions = orders.length + abandonedCarts.length;
    const cartConversionRate = totalCartSessions > 0 ? Math.round((orders.length / totalCartSessions) * 100) : 100;

    // Metallurgy Sales Breakdown
    const metallurgyStats: Record<string, { totalAmount: number; weightLbs: number; count: number }> = {
      'SA-516-70': { totalAmount: 0, weightLbs: 0, count: 0 },
      'SA-36': { totalAmount: 0, weightLbs: 0, count: 0 },
      '304L': { totalAmount: 0, weightLbs: 0, count: 0 },
      '304': { totalAmount: 0, weightLbs: 0, count: 0 },
      '316L': { totalAmount: 0, weightLbs: 0, count: 0 },
      'AL-6061': { totalAmount: 0, weightLbs: 0, count: 0 },
    };

    orders.forEach(o => {
      o.items.forEach(it => {
        const code = it.materialCode;
        if (metallurgyStats[code]) {
          metallurgyStats[code].totalAmount += it.unitPrice * it.quantity;
          metallurgyStats[code].weightLbs += it.actualWeightLbs * it.quantity;
          metallurgyStats[code].count += it.quantity;
        }
      });
    });

    // Pressure Class Breakdown
    const classStats: Record<number, number> = { 150: 0, 300: 0, 600: 0, 900: 0, 1500: 0 };
    orders.forEach(o => {
      o.items.forEach(it => {
        if (classStats[it.pressureClass] !== undefined) {
          classStats[it.pressureClass] += it.quantity;
        }
      });
    });

    // Payment Method Breakdown
    const paymentStats: Record<string, { amount: number; count: number }> = {
      'Net 30 Commercial PO': { amount: 0, count: 0 },
      'Credit Card': { amount: 0, count: 0 },
      'ACH Direct Debit': { amount: 0, count: 0 },
    };
    orders.forEach(o => {
      const pm = o.paymentMethod;
      if (paymentStats[pm]) {
        paymentStats[pm].amount += o.totalAmount;
        paymentStats[pm].count += 1;
      }
    });

    const emailLogs = getEmailDispatchLogs();

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Top Operational Whiteboard Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-sky-800 text-xs font-mono font-bold uppercase tracking-wider">
              <Factory className="h-4 w-4 text-sky-700" /> Shop Floor Operations &amp; Business Intelligence
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Active CNC Plasma Pipeline &amp; Sales Management
            </h1>
            <p className="text-slate-600 text-xs mt-0.5">
              Live burn queues, automated dispatch emails to <strong>sales@ironprairiefabrication.com</strong> (Russell, Alicia &amp; Michael), abandoned cart tracking, and high-precision testing suite.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsOwnerPricingModalOpen(true)}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95"
            >
              <Settings className="h-4 w-4 text-sky-400" />
              <span>⚙️ Steel Pricing Matrix</span>
            </button>

            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-center shadow-sm">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Total Sales</div>
              <div className="text-base font-extrabold text-slate-900 font-mono">
                ${totalGrossRevenue.toFixed(2)}
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2 text-center shadow-sm">
              <div className="text-[10px] text-emerald-700 uppercase font-bold">Steel Tonnage</div>
              <div className="text-base font-extrabold text-emerald-900 font-mono">
                {totalTonnage} <span className="text-[11px] font-normal">Tons</span>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* TEST CLIENT GENERATOR & MATRIX SIMULATION TOOLBAR                  */}
        {/* ------------------------------------------------------------------ */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-md border border-slate-800 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-amber-400">
                Random Test Client Simulator &amp; Parameter Matrix Engine
              </span>
            </div>
            <span className="text-[11px] text-slate-300 font-mono">
              Covers 100% of all 18 NPS Sizes, 5 Classes, 6 Metals, 22 Thicknesses &amp; Checkouts
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* 1-Click Single Random Order */}
            <button
              onClick={handleSimulateRandomOrder}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs transition-all shadow-sm active:scale-95"
              title="Pick a random petrochemical client and generate a random size/class/metal order"
            >
              <Play className="h-3.5 w-3.5 text-slate-950" />
              <span>🎲 1-Click Random Client Order</span>
            </button>

            {/* 1-Click Large QTY Turnaround Special Order */}
            <button
              onClick={handleSimulateLargeTurnaroundOrder}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-2 rounded-xl text-xs transition-all shadow-sm active:scale-95"
              title="Simulate a High-Quantity / High-Tonnage Petrochemical Turnaround Special Order (>100 units / >$10k / Mill Plate Sourcing)"
            >
              <Factory className="h-3.5 w-3.5 text-indigo-200" />
              <span>🏭 1-Click Large QTY Turnaround Package (&gt;$10K)</span>
            </button>

            {/* 1-Click Simulate Abandoned Cart */}
            <button
              onClick={handleSimulateAbandonedCart}
              className="flex items-center gap-1.5 bg-rose-900/80 hover:bg-rose-800 text-rose-100 border border-rose-700 font-bold px-3 py-2 rounded-xl text-xs transition-all shadow-sm active:scale-95"
              title="Simulate a plant buyer adding blinds to cart and leaving before checkout"
            >
              <ShoppingCart className="h-3.5 w-3.5 text-rose-300" />
              <span>🛒 Simulate Abandoned Cart</span>
            </button>

            {/* 5x Batch Simulation */}
            <button
              onClick={() => handleRunBatchSimulation(5)}
              className="flex items-center gap-1.5 bg-sky-800 hover:bg-sky-700 text-white font-bold px-3 py-2 rounded-xl text-xs transition-all shadow-sm active:scale-95"
              title="Generate 5 random orders across all 5 Kanban stages"
            >
              <Zap className="h-3.5 w-3.5 text-sky-300" />
              <span>⚡ 5x Batch Stress Test</span>
            </button>

            {/* Run Full 11,880 Matrix Sweep */}
            <button
              onClick={handleRunLiveMatrixSweep}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold px-3 py-2 rounded-xl text-xs transition-all shadow-sm active:scale-95"
              title="Run in-browser validation test across all 11,880 parameter combinations"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>🔬 Run 11,880 Matrix Sweep</span>
            </button>

            {/* Target Email Recipients Pill */}
            <div className="ml-auto hidden xl:flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300">
              <Mail className="h-3.5 w-3.5 text-sky-400" />
              <span>Active Sender: <strong>sales@ironprairiefabrication.com</strong> <span className="text-slate-400">(IPG Team)</span></span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* SUB-NAVIGATION TABS                                                */}
        {/* ------------------------------------------------------------------ */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveOwnerTab('kanban')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeOwnerTab === 'kanban'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Factory className="h-4 w-4" />
            <span>Active Production Pipeline</span>
            <span className="bg-white/20 text-white text-[10px] px-2 py-0.2 rounded-full font-mono font-bold ml-1">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveOwnerTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeOwnerTab === 'analytics'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>📊 Sales &amp; Financial Analytics</span>
          </button>

          <button
            onClick={() => setActiveOwnerTab('abandoned')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeOwnerTab === 'abandoned'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>🛒 Abandoned Carts Tracker</span>
            {abandonedCarts.filter(c => c.status === 'Abandoned').length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-2 py-0.2 rounded-full font-mono font-bold ml-1">
                {abandonedCarts.filter(c => c.status === 'Abandoned').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveOwnerTab('emails')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeOwnerTab === 'emails'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Mail className="h-4 w-4" />
            <span>✉️ Order Email Alerts Log</span>
            <span className="bg-slate-200 text-slate-800 text-[10px] px-2 py-0.2 rounded-full font-mono font-bold ml-1">
              {emailLogs.length}
            </span>
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 1: ACTIVE PRODUCTION KANBAN WHITEBOARD                         */}
        {/* ------------------------------------------------------------------ */}
        {activeOwnerTab === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Column 1: Queued to Burn */}
            <div className="bg-slate-200/70 border border-slate-300 rounded-2xl p-4 flex flex-col justify-between min-h-[600px]">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-300">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-600"></span> 1. Queued to Burn
                  </span>
                  <span className="text-xs font-mono text-slate-600 font-bold">
                    {orders.filter(o => o.status === 'queued').length}
                  </span>
                </div>

                <div className="space-y-3">
                  {orders.filter(o => o.status === 'queued').map(order => (
                    <div
                      key={order.orderId}
                      className={`rounded-xl p-3.5 space-y-2.5 shadow-sm border ${
                        order.isHotShot
                          ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400'
                          : order.isLargeOrder
                          ? 'bg-amber-50 border-amber-300'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900">{order.poNumber}</span>
                            {order.isHotShot && (
                              <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">
                                Hot Shot
                              </span>
                            )}
                            {order.isLargeOrder && (
                              <span className="bg-amber-600 text-white text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase">
                                &gt;$10K Plate
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-600 block">{order.companyName}</span>
                        </div>
                        <span className="text-[10px] font-mono bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                          {order.paymentMethod}
                        </span>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-[11px] space-y-1">
                        {order.items.map(item => (
                          <div key={item.id} className="text-slate-800 font-medium">
                            {item.quantity}x {item.nps} {item.pressureClass}# {item.materialCode} ({item.thicknessLabel})
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">{order.totalWeightLbs} lbs &bull; ${order.totalAmount.toFixed(2)}</span>
                        <span className={order.items.some(i => i.requireMTR) ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                          {order.items.some(i => i.requireMTR) ? 'MTR REQUIRED' : 'NO MTR'}
                        </span>
                      </div>

                      <button
                        onClick={() => advanceOrderStatus(order.orderId)}
                        className="w-full font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all bg-sky-700 hover:bg-sky-800 text-white shadow-sm"
                      >
                        Send to Plasma Table <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: At Plasma Table */}
            <div className="bg-slate-200/70 border border-slate-300 rounded-2xl p-4 flex flex-col justify-between min-h-[600px]">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-300">
                  <span className="text-xs font-bold text-sky-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-600"></span> 2. At Plasma Table
                  </span>
                  <span className="text-xs font-mono text-slate-600 font-bold">
                    {orders.filter(o => o.status === 'plasma_cutting').length}
                  </span>
                </div>

                <div className="space-y-3">
                  {orders.filter(o => o.status === 'plasma_cutting').map(order => (
                    <div
                      key={order.orderId}
                      className="rounded-xl p-3.5 space-y-2.5 shadow-sm border bg-white border-slate-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900">{order.poNumber}</span>
                            {order.isHotShot && <span className="text-[9px] bg-rose-600 text-white px-1 rounded font-bold">Hot Shot</span>}
                          </div>
                          <span className="text-[11px] text-slate-600 block">{order.companyName}</span>
                        </div>
                        <span className="text-[10px] font-mono text-sky-800 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded font-bold">
                          Cutting
                        </span>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-[11px] space-y-1">
                        {order.items.map(item => (
                          <div key={item.id} className="text-slate-800 font-medium">
                            {item.quantity}x {item.nps} {item.pressureClass}# {item.materialCode}
                          </div>
                        ))}
                      </div>

                      {/* Heat Number Field */}
                      <div>
                        <label className="block text-[10px] text-slate-600 uppercase font-bold mb-1">Plate Heat #:</label>
                        <input
                          type="text"
                          value={order.millHeatNumber}
                          onChange={e => updateHeatNumber(order.orderId, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-mono text-slate-900 font-bold focus:outline-none focus:border-sky-600 focus:bg-white"
                        />
                      </div>

                      <button
                        onClick={() => advanceOrderStatus(order.orderId)}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        Mark Cut &amp; Stamped <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 3: Deburred & Stamped */}
            <div className="bg-slate-200/70 border border-slate-300 rounded-2xl p-4 flex flex-col justify-between min-h-[600px]">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-300">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-600"></span> 3. Deburred &amp; Stamped
                  </span>
                  <span className="text-xs font-mono text-slate-600 font-bold">
                    {orders.filter(o => o.status === 'deburred_stamped').length}
                  </span>
                </div>

                <div className="space-y-3">
                  {orders.filter(o => o.status === 'deburred_stamped').map(order => (
                    <div key={order.orderId} className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">{order.poNumber}</span>
                          <span className="text-[11px] text-slate-600 block">{order.companyName}</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                          QC Pass
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-slate-700">
                        Heat #: <span className="text-sky-800 font-bold">{order.millHeatNumber}</span>
                      </div>

                      <button
                        onClick={() => setActiveJobPacket(order)}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-semibold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5"
                      >
                        <Printer className="h-3.5 w-3.5 text-slate-600" /> Print Cut &amp; MTR Packet
                      </button>

                      <button
                        onClick={() => advanceOrderStatus(order.orderId)}
                        className="w-full bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        Package for Dispatch <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 4: Ready to Ship */}
            <div className="bg-slate-200/70 border border-slate-300 rounded-2xl p-4 flex flex-col justify-between min-h-[600px]">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-300">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-600"></span> 4. Ready to Ship
                  </span>
                  <span className="text-xs font-mono text-slate-600 font-bold">
                    {orders.filter(o => o.status === 'ready_to_ship').length}
                  </span>
                </div>

                <div className="space-y-3">
                  {orders.filter(o => o.status === 'ready_to_ship').map(order => (
                    <div key={order.orderId} className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">{order.poNumber}</span>
                          <span className="text-[11px] text-slate-600 block">{order.companyName}</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                          Staged
                        </span>
                      </div>

                      <div className="text-[11px] space-y-0.5">
                        <div className="text-slate-600 font-mono">Carrier: {order.carrierName}</div>
                        <div className="text-slate-600 font-mono">Target: {order.scheduledShipDate}</div>
                      </div>

                      <button
                        onClick={() => advanceOrderStatus(order.orderId)}
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        <PackageCheck className="h-3.5 w-3.5" /> Mark Carrier Picked Up
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 5: Shipped & Completed */}
            <div className="bg-slate-200/70 border border-slate-300 rounded-2xl p-4 flex flex-col justify-between min-h-[600px]">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-300">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" /> 5. Shipped &amp; Done
                  </span>
                  <span className="text-xs font-mono text-slate-600 font-bold">
                    {orders.filter(o => o.status === 'shipped').length}
                  </span>
                </div>

                <div className="space-y-3">
                  {orders.filter(o => o.status === 'shipped').map(order => (
                    <div key={order.orderId} className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 opacity-90 hover:opacity-100 transition-opacity shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-xs text-slate-900 block">{order.poNumber}</span>
                          <span className="text-[11px] text-slate-600 block">{order.companyName}</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-700 font-bold">DISPATCHED</span>
                      </div>

                      <div className="text-[10px] font-mono text-slate-500 space-y-0.5">
                        <div>Track: {order.trackingNumber}</div>
                        <div>MTR: Dispatched to Email</div>
                      </div>

                      <button
                        onClick={() => setActiveJobPacket(order)}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 rounded text-[11px] flex items-center justify-center gap-1 font-medium border border-slate-200"
                      >
                        <FileText className="h-3 w-3 text-slate-500" /> View Archive
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 2: SALES & FINANCIAL ANALYTICS INTELLIGENCE DASHBOARD          */}
        {/* ------------------------------------------------------------------ */}
        {activeOwnerTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* Top KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span>Gross Booked Sales</span>
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  ${totalGrossRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-slate-500">Across {orders.length} confirmed orders</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span>Active WIP Pipeline</span>
                  <Clock className="h-4 w-4 text-sky-600" />
                </div>
                <div className="text-2xl font-black text-sky-800 font-mono">
                  ${activePipelineRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-slate-500">Orders currently in manufacturing</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span>Average Order Value</span>
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  ${averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-slate-500">Average ticket per plant purchase</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span>Cart Conversion Rate</span>
                  <Percent className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-700 font-mono">
                  {cartConversionRate}%
                </div>
                <div className="text-[11px] text-slate-500">{orders.length} checkouts vs {abandonedCarts.length} abandoned</div>
              </div>
            </div>

            {/* Segment Breakdown Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left 7 Cols: Metallurgy Revenue Share */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="h-4 w-4 text-sky-700" />
                    Revenue &amp; Volume by Metal Grade
                  </h3>
                  <span className="text-xs font-mono text-slate-500">Domestic Plate Allocation</span>
                </div>

                <div className="space-y-3.5">
                  {Object.entries(metallurgyStats).map(([code, stats]) => {
                    const pct = totalGrossRevenue > 0 ? Math.round((stats.totalAmount / totalGrossRevenue) * 100) : 0;
                    return (
                      <div key={code} className="space-y-1.5 font-mono text-xs">
                        <div className="flex justify-between items-center text-slate-800 font-bold">
                          <span>{MATERIALS[code as MaterialCode]?.name.split('(')[0] || code}</span>
                          <span>${stats.totalAmount.toFixed(2)} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              code === 'SA-516-70' ? 'bg-sky-600' : code === '316L' ? 'bg-indigo-600' : code === '304L' ? 'bg-emerald-600' : code === 'SA-36' ? 'bg-amber-600' : 'bg-slate-600'
                            }`}
                            style={{ width: `${Math.max(5, pct)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>{stats.count} total units cut</span>
                          <span>{stats.weightLbs.toFixed(1)} lbs finished weight</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right 5 Cols: Pressure Class & Payment Terms */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Pressure Class Distribution */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Scale className="h-4 w-4 text-sky-700" />
                      Pressure Class Demand
                    </h3>
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center font-mono">
                    {([150, 300, 600, 900, 1500] as const).map(pClass => (
                      <div key={pClass} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="text-xs font-bold text-slate-900">{pClass}#</div>
                        <div className="text-lg font-black text-sky-800 mt-1">{classStats[pClass] || 0}</div>
                        <div className="text-[10px] text-slate-400">blinds</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Commercial Payment Terms Distribution */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-sky-700" />
                      Payment Method Breakdown
                    </h3>
                  </div>
                  <div className="space-y-2.5 font-mono text-xs">
                    {Object.entries(paymentStats).map(([method, data]) => (
                      <div key={method} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-800">{method}</span>
                        <span className="text-sky-900 font-bold">${data.amount.toFixed(2)} ({data.count} orders)</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 3: ABANDONED CARTS & LOST PIPELINE TRACKER                      */}
        {/* ------------------------------------------------------------------ */}
        {activeOwnerTab === 'abandoned' && (
          <div className="space-y-6">
            
            {/* Abandoned Cart KPI Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-sm space-y-1">
                <div className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Abandoned Cart Pipeline</span>
                  <ShoppingCart className="h-4 w-4 text-rose-600" />
                </div>
                <div className="text-2xl font-black text-rose-900 font-mono">
                  ${totalAbandonedValue.toFixed(2)}
                </div>
                <div className="text-[11px] text-rose-700">{abandonedCarts.filter(c => c.status === 'Abandoned').length} potential sales awaiting quote follow-up</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Unconverted Steel Weight</span>
                  <Scale className="h-4 w-4 text-slate-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {abandonedCarts.reduce((sum, c) => sum + c.totalWeightLbs, 0).toFixed(1)} lbs
                </div>
                <div className="text-[11px] text-slate-500">Uncut raw plate demand</div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-1">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Recovered Cart Value</span>
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-900 font-mono">
                  ${abandonedCarts.filter(c => c.status === 'Recovered').reduce((sum, c) => sum + c.totalAmount, 0).toFixed(2)}
                </div>
                <div className="text-[11px] text-emerald-700">{abandonedCarts.filter(c => c.status === 'Recovered').length} carts successfully converted to production</div>
              </div>
            </div>

            {/* Abandoned Carts Table / Cards */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Abandoned Carts &amp; Incomplete Checkouts</h3>
                  <p className="text-xs text-slate-500">Track buyers who configured paddle blinds but left before submitting payment. Send 1-click quotes or restore sessions.</p>
                </div>
                <button
                  onClick={handleSimulateAbandonedCart}
                  className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Simulate New Abandoned Cart
                </button>
              </div>

              {abandonedCarts.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">No abandoned carts currently recorded.</div>
              ) : (
                <div className="space-y-3">
                  {abandonedCarts.map(cartItem => (
                    <div
                      key={cartItem.cartId}
                      className={`p-4 rounded-xl border transition-all ${
                        cartItem.status === 'Recovered'
                          ? 'bg-emerald-50/60 border-emerald-200 opacity-80'
                          : cartItem.status === 'Quote Sent'
                          ? 'bg-amber-50/60 border-amber-200'
                          : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{cartItem.companyName}</span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                              cartItem.status === 'Recovered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : cartItem.status === 'Quote Sent'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {cartItem.status}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">Stage: {cartItem.lastActiveStep}</span>
                          </div>
                          <div className="text-xs text-slate-600 mt-0.5">
                            Buyer: <strong>{cartItem.buyerName}</strong> &bull; Email: <a href={`mailto:${cartItem.email}`} className="text-sky-700 underline">{cartItem.email}</a> &bull; Phone: {cartItem.phone}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-base font-black text-slate-900 font-mono">${cartItem.totalAmount.toFixed(2)}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{cartItem.totalWeightLbs} lbs &bull; Abandoned: {cartItem.abandonedAt}</div>
                        </div>
                      </div>

                      {/* Items In Cart */}
                      <div className="py-2.5 font-mono text-xs text-slate-700 flex flex-wrap gap-2">
                        {cartItem.items.map((it, idx) => (
                          <span key={idx} className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                            {it.quantity}x {it.nps} {it.pressureClass}# {it.materialCode} ({it.thicknessLabel}) &mdash; ${ (it.unitPrice * it.quantity).toFixed(2) }
                          </span>
                        ))}
                      </div>

                      {/* Owner Follow-Up Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                        <button
                          onClick={() => setSelectedQuoteCart(cartItem)}
                          className="flex items-center gap-1.5 bg-sky-700 hover:bg-sky-800 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
                        >
                          <Send className="h-3.5 w-3.5" /> Generate &amp; Send Quote Email
                        </button>

                        <button
                          onClick={() => handleRestoreAbandonedCart(cartItem)}
                          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-lg border border-slate-300 transition-colors"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Restore into Active Cart
                        </button>

                        {cartItem.status !== 'Recovered' && (
                          <button
                            onClick={() => handleMarkCartRecovered(cartItem.cartId)}
                            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
                          >
                            <CheckCircle className="h-3.5 w-3.5" /> Convert to Active PO
                          </button>
                        )}

                        <button
                          onClick={() => handleDismissAbandonedCart(cartItem.cartId)}
                          className="ml-auto text-slate-400 hover:text-rose-600 p-1.5"
                          title="Dismiss"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 4: ORDER EMAIL ALERTS & NOTIFICATION DISPATCH CENTER           */}
        {/* ------------------------------------------------------------------ */}
        {activeOwnerTab === 'emails' && (
          <div className="space-y-6">
            
            {/* Target Notification Recipients Banner */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-sky-700 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-sky-950">Automated Order Notification Engine Active</h3>
                  <p className="text-xs text-sky-800">
                    Every completed checkout instantly generates and dispatches an order package to:
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1 font-mono text-xs">
                    {OWNER_NOTIFICATION_RECIPIENTS.map(r => (
                      <span key={r.email} className="bg-white border border-sky-300 text-sky-900 font-bold px-2 py-0.5 rounded">
                        {r.name} &lt;{r.email}&gt;
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-xs font-mono bg-white border border-sky-200 rounded-xl p-3 text-slate-700">
                <div>⚡ Trigger: <strong>Checkout Submission / Payment</strong></div>
                <div>📋 Content: <strong>Full BOM, Weights, Pricing &amp; Shop Actions</strong></div>
              </div>
            </div>

            {/* Email Dispatch History Log */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Email Notification Dispatch Log</h3>
                  <p className="text-xs text-slate-500">History of order alerts sent from sales@ironprairiefabrication.com to IPG team (Russell, Alicia &amp; Michael).</p>
                </div>
                <span className="text-xs font-mono text-slate-500">{emailLogs.length} Total Emails Dispatched</span>
              </div>

              {emailLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">No email logs recorded yet. Place an order or run a simulation to see dispatched emails.</div>
              ) : (
                <div className="space-y-3">
                  {emailLogs.map(log => (
                    <div key={log.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:bg-slate-100/80 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{log.subject}</span>
                            {log.isHotShot && <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">Hot Shot</span>}
                          </div>
                          <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                            Order: <strong>{log.orderId}</strong> &bull; PO: <strong>{log.poNumber}</strong> &bull; Sent: {log.sentAt}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={generateOrderMailtoUrl(log)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                            title="Open Outlook or default mail app pre-filled to sales@ironprairiefabrication.com"
                          >
                            <Send className="h-3.5 w-3.5" /> Send to Inbox
                          </a>

                          <button
                            onClick={() => setPreviewEmailRecord(log)}
                            className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5 text-sky-700" /> View Payload
                          </button>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 font-mono">
                        <strong className="text-sky-900">Action:</strong> {log.actionRequired}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    );
  };

  // Dedicated Desktop Operations Platform (PIN Auth Gated)
  if (location.pathname.startsWith('/operations') || location.pathname === '/shop-floor') {
    return (
      <OperationsAuthGate>
        <OperationsApp
          orders={orders}
          setOrders={setOrders}
          abandonedCarts={abandonedCarts}
          setAbandonedCarts={setAbandonedCarts}
          pricingConfig={pricingConfig}
          setPricingConfig={setPricingConfig}
        />
      </OperationsAuthGate>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased selection:bg-sky-200 selection:text-sky-900 flex flex-col justify-between overflow-x-hidden w-full max-w-full">
      <ScrollToTop />
      
      {/* -------------------------------------------------------------------- */}
      {/* TOP EMERGENCY DISPATCH & OWNER PRICING STATUS BAR                    */}
      {/* -------------------------------------------------------------------- */}
      <div className="border-b border-slate-200 bg-white px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 text-xs text-slate-600 shadow-sm w-full min-w-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0 truncate">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-mono text-[10px] sm:text-[11px] font-semibold bg-emerald-50 px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-200 flex-shrink-0">
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden xs:inline">Plasma Cutting Queue:</span> LIVE
            </span>
            <span className="hidden lg:inline text-slate-300 flex-shrink-0">|</span>
            <span className="hidden lg:inline text-slate-700 font-medium text-[11px] truncate">
              Texas Fabrication Hub &bull; Daily Nationwide Shipping Across All 50 States &bull; Emergency Hot-Shot Logistics
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Active Owner Pricing Indicator - STRICTLY VISIBLE ONLY ON OWNER SCREEN / SHOP FLOOR */}
            {location.pathname === '/shop-floor' && (
              <button
                onClick={() => setIsOwnerPricingModalOpen(true)}
                className="flex items-center gap-1.5 text-amber-900 font-mono text-[10px] sm:text-[11px] bg-amber-50 hover:bg-amber-100 px-2 sm:px-2.5 py-0.5 rounded-full border border-amber-300 font-bold transition-colors shadow-sm flex-shrink-0"
                title="Click to adjust Owner Pricing Matrix"
              >
                <Settings className="h-3 w-3 text-amber-700 shrink-0" />
                <span className="hidden md:inline">⚙️ Owner Mode: SA-516 ${(pricingConfig.sa516PricePerLb ?? DEFAULT_PRICING_CONFIG.sa516PricePerLb).toFixed(2)}/lb | 304L ${(pricingConfig.ss304LPricePerLb ?? DEFAULT_PRICING_CONFIG.ss304LPricePerLb).toFixed(2)}/lb ({pricingConfig.globalMarkupPct > 0 ? `+${pricingConfig.globalMarkupPct}%` : `${pricingConfig.globalMarkupPct}%`})</span>
                <span className="md:hidden">Owner Mode</span>
              </button>
            )}

            <a
              href="tel:+19792489266"
              className="font-mono font-bold text-sky-800 hover:text-sky-900 transition-colors text-xs flex items-center gap-1.5 flex-shrink-0 py-1 px-1.5 rounded-md hover:bg-sky-50 touch-manipulation min-h-[32px]"
            >
              <Phone className="h-3.5 w-3.5 text-sky-600 shrink-0" />
              <span>(979) 248-9266</span>
            </a>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* HEADER & MAIN NAVIGATION                                             */}
      {/* -------------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          
          {/* Logo & Company Name */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group flex-shrink min-w-0">
            <img
              src={brandLogo}
              alt="Iron Prairie Fabrication Group LLC logo"
              className="h-9 sm:h-11 w-auto rounded-lg border border-slate-200 bg-white p-1 shadow-sm object-contain flex-shrink-0"
            />
            <div className="leading-tight min-w-0">
              <span className="text-sm sm:text-base lg:text-lg font-display font-bold uppercase tracking-wide text-slate-900 group-hover:text-brand-brown transition-colors whitespace-nowrap block truncate">
                Iron Prairie
              </span>
              <span className="hidden sm:block text-[10px] text-slate-500 font-sans tracking-wide whitespace-nowrap truncate">
                Fabrication Group LLC &bull; Texas Shop &bull; Nationwide Shipping
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Primary navigation" className="hidden 2xl:flex items-center gap-1 2xl:gap-1.5 flex-shrink-0">
            {navLinks.map((item) => {
              const isCatalog = item.to === '/storefront' || item.to === '/paddle-blinds';
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    isCatalog
                      ? `px-2.5 2xl:px-3 py-1.5 text-xs font-black rounded-xl transition-all whitespace-nowrap shadow-sm flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950 hover:scale-105'
                        }`
                      : `px-2 2xl:px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                          isActive
                            ? 'bg-slate-100 text-sky-900 font-bold border border-slate-200'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                  }
                >
                  {isCatalog && <Zap className="h-3.5 w-3.5 fill-slate-950 text-slate-950" />}
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Gated Wholesale Login / Status Button */}
            {isClientLoggedIn && (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 text-sky-900 px-2 sm:px-3 py-2 rounded-lg text-xs font-semibold hover:bg-sky-100 transition-colors min-h-[40px] sm:min-h-[44px] touch-manipulation"
                  title="Click to view client account details"
                >
                  <UserCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-700 shrink-0" />
                  <span className="hidden sm:inline max-w-[90px] xl:max-w-[130px] truncate">{clientAccount?.companyName || 'Verified Trade'}</span>
                  <span className="sm:hidden text-[11px] font-bold">Trade</span>
                </button>
                <button
                  onClick={handleClientLogout}
                  className="p-2 sm:p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center touch-manipulation"
                  title="Log out"
                >
                  <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 px-2.5 sm:px-3 py-2 rounded-lg font-bold transition-all shadow-sm active:scale-95 text-xs min-h-[40px] sm:min-h-[44px] touch-manipulation"
            >
              <ShoppingCart className="h-4 w-4 text-sky-700 shrink-0" />
              <span className="hidden sm:inline">Cart</span>
              {cart.length > 0 && (
                <span className="bg-sky-700 text-white font-mono text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>

            {/* Request a Quote Button */}
            <Link
              to="/contact"
              className="hidden 2xl:inline-flex rounded-lg bg-brand-brown hover:bg-brand-brown/90 px-3.5 py-2 text-xs font-bold text-brand-ivory shadow-sm transition-all active:scale-95 whitespace-nowrap min-h-[44px] items-center touch-manipulation"
            >
              Request a Quote
            </Link>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 sm:p-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 2xl:hidden min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center touch-manipulation"
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileOpen && (
          <nav className="border-t border-slate-200 bg-white p-4 space-y-2.5 2xl:hidden shadow-lg animate-fadeIn max-h-[85vh] overflow-y-auto">
            {navLinks.map((item) => {
              const isCatalog = item.to === '/storefront' || item.to === '/paddle-blinds';
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    isCatalog
                      ? `block px-3.5 py-3 rounded-xl text-sm font-black bg-amber-400 text-slate-950 flex items-center justify-between shadow-sm min-h-[48px] touch-manipulation`
                      : `block px-3.5 py-2.5 rounded-lg text-sm font-semibold min-h-[44px] flex items-center ${
                          isActive ? 'bg-slate-100 text-sky-900 font-bold border border-slate-200' : 'text-slate-700 hover:bg-slate-50'
                        } touch-manipulation`
                  }
                >
                  <span>{item.label}</span>
                  {isCatalog && <span className="bg-slate-950 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-black">FAST ORDER</span>}
                </NavLink>
              );
            })}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center rounded-xl bg-brand-brown py-3 text-sm font-bold text-brand-ivory shadow-sm min-h-[48px] flex items-center justify-center touch-manipulation"
              >
                Request a Quote
              </Link>
              <a
                href="tel:+19792489266"
                className="block w-full text-center rounded-xl bg-sky-50 border border-sky-200 py-2.5 text-xs font-bold text-sky-900 min-h-[44px] flex items-center justify-center gap-2 touch-manipulation"
              >
                <Phone className="h-4 w-4 text-sky-700" />
                <span>Call Shop: (979) 248-9266</span>
              </a>
            </div>
          </nav>
        )}
      </header>

      {/* -------------------------------------------------------------------- */}
      {/* MULTI-ROUTE APPLICATION CONTENT                                      */}
      {/* -------------------------------------------------------------------- */}
      <main id="main-content" className="flex-1 min-w-0 w-full overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/woman-owned" element={<WomanOwned />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/storefront" element={renderStorefrontView()} />
          <Route path="/paddle-blinds" element={renderStorefrontView()} />
          <Route path="/mtr/:heatNumber" element={<PublicMtrViewer />} />
          <Route path="/mtr" element={<PublicMtrViewer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* -------------------------------------------------------------------- */}
      {/* GLOBAL WEBSITE FOOTER                                                */}
      {/* -------------------------------------------------------------------- */}
      <footer className="border-t border-slate-300 bg-slate-900 text-slate-300 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={brandLogo}
                  alt="Iron Prairie Fabrication Group LLC"
                  className="h-10 w-auto rounded border border-slate-700 bg-white p-0.5"
                />
                <div>
                  <span className="font-display text-base font-bold uppercase tracking-wider text-white block">
                    Iron Prairie Fabrication Group LLC
                  </span>
                  <span className="text-[11px] text-slate-400 block">ASME B16.48 Paddle Blinds &bull; Industrial Metal Fabrication</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                Certified woman-owned metal fabrication enterprise based in Texas. Precision CNC plasma plate cutting, ASME B16.48 positive isolation paddle blinds, custom ranch gates, animal pens, tornado shelters, custom bunkers, and municipal infrastructure steelwork. Serving Lake Jackson, Brazoria County, and statewide Texas with rapid site delivery, plus daily nationwide shipping across all 50 states.
              </p>
            </div>

            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-3">Quick Navigation</div>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li><Link to="/about" className="hover:text-amber-400 transition-colors">About Our Shop</Link></li>
                <li><Link to="/services" className="hover:text-amber-400 transition-colors">Fabrication Services</Link></li>
                <li><Link to="/projects" className="hover:text-amber-400 transition-colors">Project Portfolio</Link></li>
                <li><Link to="/woman-owned" className="hover:text-amber-400 transition-colors">Woman-Owned Enterprise</Link></li>
                <li><Link to="/storefront" className="hover:text-amber-400 transition-colors">ASME B16.48 Paddle Blinds</Link></li>
                <li><Link to="/shop-floor" className="hover:text-amber-400 transition-colors">Shop Floor Whiteboard</Link></li>
                <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Request a Quote</Link></li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-3">Facility &amp; Inquiries</div>
              <div className="space-y-2 text-xs text-slate-400">
                <div>Phone: <a href="tel:+19792489266" className="text-white hover:text-amber-400 font-bold">(979) 248-9266</a></div>
                <div>Email: <a href="mailto:Sales@ironprairiefabrication.com" className="text-white hover:text-amber-400 underline">Sales@ironprairiefabrication.com</a></div>
                <div>Facility: Lake Jackson, TX (Brazoria County)</div>
                <div>Service Area: Texas Statewide &bull; <span className="text-amber-400 font-semibold">Nationwide Shipping (All 50 States)</span></div>
                <div>Government Contractor: <span className="text-emerald-400 font-bold">SAM.gov Registered</span> &bull; <span className="font-mono text-slate-300 font-bold">UEI: XX7XCMGN9XD5</span></div>
                <div className="pt-2 flex gap-4 text-[11px] text-slate-500">
                  <Link to="/privacy-policy" className="hover:text-slate-400 underline">Privacy Policy</Link>
                  <Link to="/terms-of-service" className="hover:text-slate-400 underline">Terms of Service</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* -------------------------------------------------------------------- */}
      {/* OWNER PRICING, STEEL SURCHARGE & HOT SHOT FEE MODAL                  */}
      {/* -------------------------------------------------------------------- */}
      {isOwnerPricingModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-sky-700">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Owner Pricing &amp; Steel Surcharge Matrix</h3>
                  <p className="text-xs text-slate-500">Adjust raw plate rates, Hot Shot emergency dispatch fee, and global markup in real time.</p>
                </div>
              </div>
              <button onClick={() => setIsOwnerPricingModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 text-xs font-mono">
              
              {/* 1. Global Markup / Inflation Multiplier */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                    <Percent className="h-4 w-4 text-sky-700" />
                    Global Website Price Adjustment (%):
                  </label>
                  <span className={`text-base font-bold px-2.5 py-0.5 rounded font-mono ${
                    pricingConfig.globalMarkupPct > 0 ? 'bg-sky-100 text-sky-900 border border-sky-300' : 'bg-slate-200 text-slate-800'
                  }`}>
                    {pricingConfig.globalMarkupPct > 0 ? `+${pricingConfig.globalMarkupPct}%` : `${pricingConfig.globalMarkupPct}%`}
                  </span>
                </div>

                <input
                  type="range"
                  min="-20"
                  max="50"
                  step="1"
                  value={pricingConfig.globalMarkupPct}
                  onChange={e => setPricingConfig(prev => ({ ...prev, globalMarkupPct: parseInt(e.target.value) || 0 }))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-700"
                />

                <div className="flex gap-2 text-[11px] pt-1">
                  {[-5, 0, 5, 10, 15, 20, 25].map(pct => (
                    <button
                      key={pct}
                      onClick={() => setPricingConfig(prev => ({ ...prev, globalMarkupPct: pct }))}
                      className={`flex-1 py-1 rounded border text-center font-bold transition-all ${
                        pricingConfig.globalMarkupPct === pct
                          ? 'bg-sky-700 text-white border-sky-700'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {pct > 0 ? `+${pct}%` : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Raw Material Plate Rates ($/lb) & Hot Shot Fee */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-emerald-700" />
                  Raw Plate Estimating Rates ($/lb) &amp; Hot-Shot Dispatch:
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {/* SA-36 Carbon Steel */}
                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-sm">
                    <label className="block text-[10px] text-slate-600 font-bold uppercase">
                      SA-36 Carbon Steel
                    </label>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      <span className="text-slate-500">$</span>
                      <input
                        type="number"
                        step="0.05"
                        min="0.50"
                        max="10.00"
                        value={pricingConfig.sa36PricePerLb}
                        onChange={e => setPricingConfig(prev => ({ ...prev, sa36PricePerLb: parseFloat(e.target.value) || 1.85 }))}
                        className="w-full bg-transparent text-slate-900 font-bold focus:outline-none"
                      />
                      <span className="text-slate-500 text-[10px]">/lb</span>
                    </div>
                  </div>

                  {/* SA-516-70 PVQ Carbon Steel */}
                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-sm">
                    <label className="block text-[10px] text-slate-600 font-bold uppercase">
                      SA-516 Gr. 70 (PVQ)
                    </label>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      <span className="text-slate-500">$</span>
                      <input
                        type="number"
                        step="0.05"
                        min="0.50"
                        max="10.00"
                        value={pricingConfig.sa516PricePerLb}
                        onChange={e => setPricingConfig(prev => ({ ...prev, sa516PricePerLb: parseFloat(e.target.value) || 2.15 }))}
                        className="w-full bg-transparent text-slate-900 font-bold focus:outline-none"
                      />
                      <span className="text-slate-500 text-[10px]">/lb</span>
                    </div>
                  </div>

                  {/* 304 Stainless Steel */}
                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-sm">
                    <label className="block text-[10px] text-slate-600 font-bold uppercase">
                      304 Stainless
                    </label>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      <span className="text-slate-500">$</span>
                      <input
                        type="number"
                        step="0.10"
                        min="1.00"
                        max="20.00"
                        value={pricingConfig.ss304PricePerLb}
                        onChange={e => setPricingConfig(prev => ({ ...prev, ss304PricePerLb: parseFloat(e.target.value) || 5.50 }))}
                        className="w-full bg-transparent text-slate-900 font-bold focus:outline-none"
                      />
                      <span className="text-slate-500 text-[10px]">/lb</span>
                    </div>
                  </div>

                  {/* 304/304L Stainless Steel */}
                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-sm">
                    <label className="block text-[10px] text-slate-600 font-bold uppercase">
                      304/304L Dual-Cert
                    </label>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      <span className="text-slate-500">$</span>
                      <input
                        type="number"
                        step="0.10"
                        min="1.00"
                        max="20.00"
                        value={pricingConfig.ss304LPricePerLb}
                        onChange={e => setPricingConfig(prev => ({ ...prev, ss304LPricePerLb: parseFloat(e.target.value) || 5.95 }))}
                        className="w-full bg-transparent text-slate-900 font-bold focus:outline-none"
                      />
                      <span className="text-slate-500 text-[10px]">/lb</span>
                    </div>
                  </div>

                  {/* 316L Acid Grade Stainless */}
                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-sm">
                    <label className="block text-[10px] text-slate-600 font-bold uppercase">
                      316L Acid Grade SS
                    </label>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      <span className="text-slate-500">$</span>
                      <input
                        type="number"
                        step="0.10"
                        min="1.00"
                        max="25.00"
                        value={pricingConfig.ss316LPricePerLb}
                        onChange={e => setPricingConfig(prev => ({ ...prev, ss316LPricePerLb: parseFloat(e.target.value) || 7.40 }))}
                        className="w-full bg-transparent text-slate-900 font-bold focus:outline-none"
                      />
                      <span className="text-slate-500 text-[10px]">/lb</span>
                    </div>
                  </div>

                  {/* Aluminum 6061-T6 */}
                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-sm">
                    <label className="block text-[10px] text-slate-600 font-bold uppercase">
                      Aluminum (6061-T6)
                    </label>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                      <span className="text-slate-500">$</span>
                      <input
                        type="number"
                        step="0.10"
                        min="1.00"
                        max="15.00"
                        value={pricingConfig.alPricePerLb}
                        onChange={e => setPricingConfig(prev => ({ ...prev, alPricePerLb: parseFloat(e.target.value) || 5.00 }))}
                        className="w-full bg-transparent text-slate-900 font-bold focus:outline-none"
                      />
                      <span className="text-slate-500 text-[10px]">/lb</span>
                    </div>
                  </div>

                  {/* Variable Machining Costs (Lathe Facing) */}
                  <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-2 shadow-sm col-span-2 sm:col-span-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] text-amber-900 font-bold uppercase">
                        ⚙️ Variable CNC Lathe Machining (Facing Adder):
                      </label>
                      <span className="text-[10px] text-amber-700 font-mono">Scales with OD ($Setup + $Rate/in)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[9px] text-slate-500 block mb-0.5">Base Lathe Setup ($)</label>
                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                          <span className="text-slate-500">$</span>
                          <input
                            type="number"
                            step="5"
                            value={pricingConfig.baseMachiningSetupFee ?? 25}
                            onChange={e => setPricingConfig(prev => ({ ...prev, baseMachiningSetupFee: parseFloat(e.target.value) || 25 }))}
                            className="w-full bg-transparent text-slate-900 font-bold focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-500 block mb-0.5">Machining Rate ($/in OD)</label>
                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                          <span className="text-slate-500">$</span>
                          <input
                            type="number"
                            step="0.50"
                            value={pricingConfig.machiningRatePerInch ?? 9.50}
                            onChange={e => setPricingConfig(prev => ({ ...prev, machiningRatePerInch: parseFloat(e.target.value) || 9.50 }))}
                            className="w-full bg-transparent text-slate-900 font-bold focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Live Benchmark Impact Simulation Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <div className="text-[11px] font-bold text-sky-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Live Catalog Impact Preview:</span>
                  <span>Instant Global Compensation</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-[11px] pt-1">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-slate-600">4" 150# SA-516-70 (11 Ga Standard):</div>
                    <div className="text-slate-900 font-bold mt-1 text-sm">
                      ${calculateDynamicBlindPrice(150, '4"', 'SA-516-70', 0.1196, '11 Gauge', 'Flat Face (FF) - Standard (No Machining)', false, false, false, false, pricingConfig).unitPrice.toFixed(2)}
                      <span className="text-slate-500 text-[10px] ml-1 font-normal">(Base: $45)</span>
                    </div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-slate-600">6" 300# 304/304L (1/2" Plate):</div>
                    <div className="text-slate-900 font-bold mt-1 text-sm">
                      ${calculateDynamicBlindPrice(300, '6"', '304L', 0.500, '1/2"', 'Flat Face (FF) - Standard (No Machining)', false, false, false, false, pricingConfig).unitPrice.toFixed(2)}
                      <span className="text-slate-500 text-[10px] ml-1 font-normal">(Base: $245)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPricingConfig(DEFAULT_PRICING_CONFIG)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-300"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Reset Default
                </button>
                <button
                  type="button"
                  onClick={() => setIsOwnerPricingModalOpen(false)}
                  className="w-2/3 bg-sky-700 hover:bg-sky-800 text-white font-bold py-3 rounded-xl shadow-sm text-xs uppercase tracking-wider transition-all"
                >
                  Save &amp; Apply Pricing Across Website
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* GATED CLIENT LOGIN & REGISTRATION MODAL                              */}
      {/* -------------------------------------------------------------------- */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-center text-sky-700">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">B2B Trade Client Access</h3>
                  <p className="text-xs text-slate-500">Unlock wholesale manufacturing rates &amp; rapid multi-item checkout.</p>
                </div>
              </div>
              <button onClick={() => setIsLoginModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Demo Pre-fills for Turnaround Leads */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Unlock className="h-3.5 w-3.5 text-sky-700" /> Instant Demo Access (1-Click Login):
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('dow')}
                  className="p-2.5 rounded-lg bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-800 text-left transition-colors shadow-sm"
                >
                  <div className="font-bold text-sky-900">Dow Chemical</div>
                  <div className="text-[10px] text-slate-500">Texas Site</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('turner')}
                  className="p-2.5 rounded-lg bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-800 text-left transition-colors shadow-sm"
                >
                  <div className="font-bold text-slate-900">Turner Ind.</div>
                  <div className="text-[10px] text-slate-500">Port Arthur</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('basf')}
                  className="p-2.5 rounded-lg bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-800 text-left transition-colors shadow-sm"
                >
                  <div className="font-bold text-emerald-900">BASF Verbund</div>
                  <div className="text-[10px] text-slate-500">Texas Verbund</div>
                </button>
              </div>
            </div>

            {/* Manual Account Registration Form */}
            <form onSubmit={handleClientLogin} className="space-y-4 text-xs">
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Company / Plant Name</label>
                  <input
                    required
                    name="companyName"
                    defaultValue={clientAccount?.companyName || ''}
                    placeholder="e.g. ExxonMobil Beaumont or Gulf Coast LNG"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Buyer / Mechanic Name</label>
                    <input
                      required
                      name="buyerName"
                      defaultValue={clientAccount?.buyerName || ''}
                      placeholder="e.g. Mike Henderson"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Commercial Work Email</label>
                    <input
                      required
                      type="email"
                      name="email"
                      defaultValue={clientAccount?.email || ''}
                      placeholder="e.g. buyer@plant.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Plant Location / Gate</label>
                  <input
                    name="facilityLocation"
                    defaultValue={clientAccount?.facilityLocation || ''}
                    placeholder="e.g. Plant Gate 4 Receiving (Texas)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(false)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-sky-700 hover:bg-sky-800 text-white font-bold py-3 rounded-xl shadow-sm text-xs uppercase tracking-wider transition-all"
                >
                  Unlock Trade Pricing &amp; Order
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* SLIDE-OVER SHOPPING CART DRAWER                                      */}
      {/* -------------------------------------------------------------------- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white border-l border-slate-200 p-6 flex flex-col justify-between shadow-2xl">
              
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-sky-700" />
                    <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Fabrication Order Cart</h2>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Large Order Lead Time Callout Banner */}
                {isLargeVolumeOrder && (
                  <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-800 font-bold uppercase">
                      <Clock className="h-3.5 w-3.5 text-amber-700" /> High-Volume Mill Plate Sourcing
                    </div>
                    <p className="text-[11px] text-amber-900">
                      Order total exceeds $10,000 / 1,000 lbs. Dedicated master plate staging lead time is 5–7 business days.
                    </p>
                  </div>
                )}

                {/* Hot Shot Courier Delivery (Champion Logistics) Selection in Cart */}
                {isHotShotOrder ? (
                  <div className="mt-3 bg-rose-50 border border-rose-200 rounded-xl p-3.5 space-y-1">
                    <div className="flex items-center justify-between text-rose-900 font-bold text-xs">
                      <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-rose-600" /> Dedicated Hot Shot Courier (Champion Logistics)</span>
                      <span className="font-mono">+${pricingConfig.hotShotEmergencyFee.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-rose-800">
                      <span>Direct same-day courier dispatch to plant gate / unit.</span>
                      <button
                        onClick={() => setIsHotShotOrder(false)}
                        className="text-rose-700 underline hover:text-rose-900 font-semibold text-[11px]"
                      >
                        Remove Hot Shot
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5 text-sky-700" /> Need Same-Day Emergency Dispatch?
                      </div>
                      <div className="text-[11px] text-slate-500">Call out Champion Logistics Hot Shot</div>
                    </div>
                    <button
                      onClick={() => setIsHotShotOrder(true)}
                      className="text-xs bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                    >
                      + Add Hot Shot (+${pricingConfig.hotShotEmergencyFee.toFixed(0)})
                    </button>
                  </div>
                )}

                {/* Items List */}
                <div className="mt-4 space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <Layers className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                      <p className="text-xs font-semibold text-slate-700">Your fabrication cart is empty.</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Select pipe sizes &amp; batch quantities to queue orders.</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-sky-800 font-bold font-mono text-xs">
                              {item.nps} NPS &bull; {item.pressureClass}# Class
                            </span>
                            <div className="text-xs text-slate-900 font-semibold">{item.materialName.split('(')[0]}</div>
                            <div className="text-[10px] text-slate-600 font-mono">
                              Thk: {item.thicknessLabel} | Stamped: [{item.handleStamp || 'STANDARD'}]
                            </div>
                            <div className="text-[10px] mt-0.5">
                              {item.requireMTR ? (
                                <span className="text-emerald-700 font-mono font-bold">[+ MTR Packet]</span>
                              ) : (
                                <span className="text-slate-500 font-mono">[No MTR Needed]</span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 font-mono">
                          <span className="text-xs text-slate-600">Qty: {item.quantity}</span>
                          <span className="text-xs font-bold text-slate-900">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="border-t border-slate-200 pt-4 space-y-3 bg-white">
                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>Total Estimated Weight:</span>
                      <span className="text-slate-900 font-bold">{cartTotalWeight} lbs</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Standard Shipping ({cartTotalWeight > 150 ? 'LTL Freight' : 'UPS Ground'}):</span>
                      <span className="text-slate-900">${shippingEstimate.toFixed(2)}</span>
                    </div>
                    {isHotShotOrder && (
                      <div className="flex justify-between text-rose-700 font-bold">
                        <span>Hot Shot Emergency Fee:</span>
                        <span>+${pricingConfig.hotShotEmergencyFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                      <span>Grand Total:</span>
                      <span className="text-sky-800 font-mono">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        handleOpenProposalForItems(cart);
                      }}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md text-xs sm:text-sm uppercase tracking-wider transition-all active:scale-98"
                    >
                      <FileText className="h-4 w-4" /> Generate Official Proposal (Email PDF)
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsAmazonExportOpen(true)}
                        className="w-1/3 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
                      >
                        <Download className="h-4 w-4 text-sky-700" /> Amazon TSV
                      </button>
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          setIsCheckoutOpen(true);
                        }}
                        className="w-2/3 bg-sky-700 hover:bg-sky-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm text-xs uppercase tracking-wider transition-all"
                      >
                        Fast B2B Checkout <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* MULTI-PAYMENT B2B CHECKOUT MODAL (CC, ACH, NET 30 + ACH MANDATE)     */}
      {/* -------------------------------------------------------------------- */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Commercial B2B Checkout</h3>
                <p className="text-xs text-slate-500">Iron Prairie Fabrication Group LLC &bull; Direct B2B Portal</p>
              </div>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Lead Time Indicator Banner */}
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs flex items-start gap-2.5 text-slate-700">
              <Clock className="h-4 w-4 text-sky-700 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-900 block">Production Schedule &amp; Lead Time:</span>
                <span className="text-[11px] text-slate-600">{activeLeadTimeText}</span>
              </div>
            </div>

            {/* PAYMENT METHOD TABS */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Select Payment &amp; Terms Option:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutPaymentMethod('net30_po')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    checkoutPaymentMethod === 'net30_po'
                      ? 'bg-sky-50 border-sky-600 text-sky-950 shadow-sm ring-1 ring-sky-500'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <FileCheck className="h-3.5 w-3.5 text-sky-700" /> Net 30 PO
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold mt-0.5">0% Surcharge</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCheckoutPaymentMethod('ach')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    checkoutPaymentMethod === 'ach'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-sm ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-emerald-700" /> Bluevine ACH
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold mt-0.5">0% Fee (Preferred)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCheckoutPaymentMethod('credit_card')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    checkoutPaymentMethod === 'credit_card'
                      ? 'bg-rose-50 border-rose-600 text-rose-950 shadow-sm ring-1 ring-rose-500'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-rose-700" /> Credit Card
                  </div>
                  <div className="text-[10px] text-rose-700 font-bold mt-0.5">+3.5% Card Fee</div>
                </button>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Company / Plant Name</label>
                  <input
                    required
                    name="companyName"
                    defaultValue={clientAccount?.companyName || 'Dow Chemical'}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white font-medium min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Buyer / Project Lead</label>
                  <input
                    required
                    name="contactName"
                    defaultValue={clientAccount?.buyerName || 'Industrial Procurement'}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white font-medium min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Commercial Work Email</label>
                  <input
                    required
                    type="email"
                    name="email"
                    defaultValue={clientAccount?.email || 'buyer@dow.com'}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white font-medium min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Purchase Order (PO) #</label>
                  <input
                    required
                    name="poNumber"
                    defaultValue={isHotShotOrder ? `HOT-PO-2026-${Math.floor(1000 + Math.random() * 9000)}` : `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sky-800 focus:outline-none focus:border-sky-600 focus:bg-white font-mono font-bold min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1">Jobsite Delivery / Receiving Address</label>
                <input
                  required
                  name="address"
                  defaultValue="Plant Gate 4 Receiving, TX"
                  placeholder="e.g. Plant Gate 4 Receiving, TX"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white"
                />
              </div>

              {/* PAYMENT DETAILS SUB-FORMS */}
              {checkoutPaymentMethod === 'credit_card' && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between text-slate-800 font-bold">
                    <span className="flex items-center gap-1.5"><CreditCard className="h-4 w-4 text-sky-700" /> Credit Card Authorization</span>
                    <span className="text-[10px] text-slate-500 font-mono">Encrypted 256-bit SSL</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Card Number (4000 0000 0000 0000)" defaultValue="4000 1234 5678 9010" className="col-span-2 bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono" />
                    <input placeholder="MM / YY" defaultValue="12/28" className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono" />
                    <input placeholder="CVC / CWW" defaultValue="882" className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono" />
                  </div>
                </div>
              )}

              {checkoutPaymentMethod === 'ach' && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between text-slate-800 font-bold">
                    <span className="flex items-center gap-1.5"><Building className="h-4 w-4 text-emerald-700" /> Instant ACH Direct Debit</span>
                    <span className="text-[10px] text-emerald-700 font-mono font-semibold">0% Processing Surcharge</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Bank Routing (ABA)" defaultValue="111000025" className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono" />
                    <input placeholder="Account Number" defaultValue="9823481920" className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono" />
                  </div>
                </div>
              )}

              {checkoutPaymentMethod === 'net30_po' && (
                <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-200 space-y-2.5">
                  <div className="flex items-center justify-between text-sky-950 font-bold">
                    <span className="flex items-center gap-1.5"><FileCheck className="h-4 w-4 text-sky-700" /> Commercial Net 30 Terms + ACH Authorization</span>
                    <span className="text-[10px] text-emerald-700 font-mono font-bold">Trade Credit Approved</span>
                  </div>
                  
                  {/* Explicit ACH Agreement Checkbox */}
                  <label className="flex items-start gap-2.5 cursor-pointer bg-white p-2.5 rounded-lg border border-slate-200">
                    <input
                      type="checkbox"
                      required
                      checked={achAgreementChecked}
                      onChange={e => setAchAgreementChecked(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-[11px] text-slate-700 leading-snug">
                      I accept Iron Prairie Fabrication Group LLC <strong>Net 30 Invoicing Terms</strong> and authorize electronic ACH Direct Debit payment upon invoice maturity.
                    </span>
                  </label>
                </div>
              )}

              {/* Order Summary Recap */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({cart.length} line items):</span>
                  <span className="text-slate-900">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping ({cartTotalWeight} lbs):</span>
                  <span className="text-slate-900">${shippingEstimate.toFixed(2)}</span>
                </div>
                {isHotShotOrder && (
                  <div className="flex justify-between text-rose-700 font-bold">
                    <span>Hot Shot Emergency Rush Fee:</span>
                    <span>+${pricingConfig.hotShotEmergencyFee.toFixed(2)}</span>
                  </div>
                )}
                {checkoutPaymentMethod === 'credit_card' && (
                  <div className="flex justify-between text-rose-700 font-bold">
                    <span>Credit Card Processing Surcharge (3.5%):</span>
                    <span>+${creditCardSurcharge.toFixed(2)}</span>
                  </div>
                )}
                {checkoutPaymentMethod === 'ach' && (
                  <div className="flex justify-between text-emerald-700 font-bold text-[11px]">
                    <span>Bluevine ACH Direct Transfer:</span>
                    <span>0% Fee (You Save ${((cartSubtotal + shippingEstimate + activeHotShotFee) * 0.035).toFixed(2)})</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>Grand Invoiced Total:</span>
                  <span className="text-sky-800">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-sky-700 hover:bg-sky-800 text-white font-bold py-3 rounded-xl shadow-sm text-xs uppercase tracking-wider"
                >
                  Confirm &amp; Queue Order for Burning
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* PRINTABLE JOB PACKET MODAL                                           */}
      {/* -------------------------------------------------------------------- */}
      {activeJobPacket && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-8 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center font-black text-sky-400 text-xl">
                  IP
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">Shop Cut Ticket &amp; MTR Compliance Sheet</h3>
                    {activeJobPacket.isHotShot && (
                      <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[10px] px-2 py-0.5 rounded uppercase font-bold">
                        Hot Shot Rush
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-slate-500">Order ID: {activeJobPacket.orderId} &bull; PO: {activeJobPacket.poNumber}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-sky-700 hover:bg-sky-800 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow"
                >
                  <Printer className="h-4 w-4" /> Print Sheet
                </button>
                <button onClick={() => setActiveJobPacket(null)} className="text-slate-400 hover:text-slate-700 p-2">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Printable Content Body */}
            <div className="space-y-6 font-mono text-xs">
              
              {/* Customer & Shipping Summary */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <div className="text-slate-500 uppercase text-[10px]">Client / Buyer:</div>
                  <div className="text-slate-900 font-bold text-sm mt-0.5">{activeJobPacket.companyName}</div>
                  <div className="text-slate-600">{activeJobPacket.contactName} ({activeJobPacket.email})</div>
                  <div className="text-emerald-700 font-bold mt-1">Payment: {activeJobPacket.paymentMethod} ({activeJobPacket.paymentStatus})</div>
                </div>
                <div>
                  <div className="text-slate-500 uppercase text-[10px]">Receiving Destination:</div>
                  <div className="text-slate-900 mt-0.5">{activeJobPacket.jobsiteAddress}</div>
                  <div className="text-sky-800 font-bold mt-1">Carrier: {activeJobPacket.carrierName} ({activeJobPacket.shippingMethod})</div>
                  <div className="text-slate-500 mt-0.5">Lead Time: {activeJobPacket.leadTimeEstimate}</div>
                </div>
              </div>

              {/* Cut Table Manifest */}
              <div>
                <div className="text-slate-600 uppercase text-[11px] font-bold mb-2">Plasma Cut Line-Item Manifest:</div>
                <table className="w-full text-left border-collapse border border-slate-200">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 text-[10px]">
                      <th className="p-2.5 border border-slate-200">Part Number</th>
                      <th className="p-2.5 border border-slate-200">Size / Class</th>
                      <th className="p-2.5 border border-slate-200">Material</th>
                      <th className="p-2.5 border border-slate-200">OD &amp; Thk</th>
                      <th className="p-2.5 border border-slate-200">Handle Stamping</th>
                      <th className="p-2.5 border border-slate-200">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeJobPacket.items.map(i => (
                      <tr key={i.id} className="text-slate-800 border-b border-slate-200">
                        <td className="p-2.5 border border-slate-200 text-sky-800 font-bold">{i.partNumber}</td>
                        <td className="p-2.5 border border-slate-200">{i.nps} {i.pressureClass}#</td>
                        <td className="p-2.5 border border-slate-200">{i.materialCode}</td>
                        <td className="p-2.5 border border-slate-200">{i.od}" OD / {i.thicknessLabel}</td>
                        <td className="p-2.5 border border-slate-200 text-emerald-700 font-semibold">[{i.handleStamp || 'NONE'}]</td>
                        <td className="p-2.5 border border-slate-200 font-bold text-slate-900">{i.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Heat Traceability & Quality Verification */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="text-slate-600 uppercase text-[11px] font-bold">Mill Test Report (MTR) Verification:</div>
                <div className="flex justify-between items-center text-xs">
                  <span>Assigned Plate Heat Number:</span>
                  <span className="text-slate-900 font-bold text-sm">{activeJobPacket.millHeatNumber}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Quality Assurance Standard:</span>
                  <span className="text-slate-900">ASME B16.48 Standard Line Blinds</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Digital MTR Document Link:</span>
                  <span className="text-sky-700 underline">Google Drive &gt; 01_IRON_PRAIRIE_QUALITY_&amp;_MTRs</span>
                </div>
              </div>

            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveJobPacket(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs border border-slate-300"
              >
                Close Ticket
              </button>
            </div>

          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* AMAZON FLAT-FILE EXPORT MODAL                                        */}
      {/* -------------------------------------------------------------------- */}
      {isAmazonExportOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-sky-700" />
                <h3 className="text-base font-bold text-slate-900">Amazon Seller Central Flat-File Feed</h3>
              </div>
              <button onClick={() => setIsAmazonExportOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Ready-to-upload tab-separated TSV feed formatted for Amazon Seller Central <em>Industrial &amp; Scientific / Pipe Fittings</em> inventory template:
            </p>

            <textarea
              readOnly
              rows={8}
              value={generateAmazonFlatFileTSV()}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 font-mono text-[11px] text-slate-900 focus:outline-none"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateAmazonFlatFileTSV());
                  alert('Amazon TSV copied to clipboard!');
                }}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-300"
              >
                <Copy className="h-4 w-4" /> Copy to Clipboard
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([generateAmazonFlatFileTSV()], { type: 'text/tab-separated-values' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Amazon_PaddleBlinds_Feed_${Date.now()}.tsv`;
                  a.click();
                }}
                className="w-1/2 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" /> Download .TSV File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* ABANDONED CART QUOTE FOLLOW-UP EMAIL MODAL                           */}
      {/* -------------------------------------------------------------------- */}
      {selectedQuoteCart && (() => {
        const quote = generateAbandonedCartQuoteEmail(selectedQuoteCart);
        return (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 bg-sky-100 rounded-xl flex items-center justify-center text-sky-700">
                    <Send className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Abandoned Cart Quote Follow-Up</h3>
                    <p className="text-xs text-slate-500">To: {selectedQuoteCart.email} ({selectedQuoteCart.companyName})</p>
                  </div>
                </div>
                <button onClick={() => setSelectedQuoteCart(null)} className="text-slate-400 hover:text-slate-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Email Subject:</label>
                  <input
                    readOnly
                    value={quote.subject}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Formal Quote Body:</label>
                  <textarea
                    readOnly
                    rows={10}
                    value={quote.body}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 text-[11px] font-mono leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(quote.body);
                    setNotificationToast({
                      type: 'success',
                      message: '📋 Quote text copied to clipboard!'
                    });
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-300 transition-colors"
                >
                  <Copy className="h-4 w-4" /> Copy Quote Text
                </button>

                <a
                  href={quote.mailtoUrl}
                  onClick={() => {
                    setAbandonedCarts(prev => prev.map(c => c.cartId === selectedQuoteCart.cartId ? { ...c, status: 'Quote Sent' } : c));
                    setSelectedQuoteCart(null);
                  }}
                  className="flex-1 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all text-center"
                >
                  <Send className="h-4 w-4" /> Open in Mail Client &amp; Send
                </a>
              </div>
            </div>
          </div>
        );
      })()}

      {/* -------------------------------------------------------------------- */}
      {/* ORDER NOTIFICATION EMAIL PREVIEW MODAL (RUSSELL & ALICIA)            */}
      {/* -------------------------------------------------------------------- */}
      {previewEmailRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">Automated Order Email Notification</h3>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                      Auto-Dispatched
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Transmitted automatically to: <strong>sales@ironprairiefabrication.com</strong> <span className="text-slate-400">(Russell, Alicia &amp; Michael)</span>
                  </p>
                </div>
              </div>
              <button onClick={() => setPreviewEmailRecord(null)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-700 flex flex-wrap justify-between items-center gap-2 flex-shrink-0">
              <div><strong>Subject:</strong> {previewEmailRecord.subject}</div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-700 font-bold">● Status: Sent &amp; Logged</span>
                <span><strong>Time:</strong> {previewEmailRecord.sentAt}</span>
              </div>
            </div>

            {/* Rich HTML / Plain Text Container */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-100 rounded-xl border border-slate-200 space-y-3 font-mono text-xs">
              <div className="text-slate-500 uppercase text-[10px] font-bold">Email Message Payload Delivered to Shop:</div>
              <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-800 bg-white p-4 rounded-lg border border-slate-200 leading-relaxed overflow-x-auto">
                {previewEmailRecord.rawText}
              </pre>
            </div>

            <div className="flex gap-3 pt-2 flex-shrink-0">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(previewEmailRecord.rawText);
                  setNotificationToast({
                    type: 'success',
                    message: '📋 Order notification text copied to clipboard!'
                  });
                }}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-300 transition-colors"
              >
                <Copy className="h-4 w-4" /> Copy Email Payload
              </button>

              <button
                onClick={() => setPreviewEmailRecord(null)}
                className="w-1/2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Close Audit Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 11,880 PARAMETER MATRIX SWEEP REPORT MODAL                           */}
      {/* -------------------------------------------------------------------- */}
      {matrixSweepModalOpen && matrixSweepStats && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">ASME B16.48 Matrix Sweep Verification</h3>
                  <p className="text-xs text-slate-500">100% In-Browser Stress Test Across All Dimensions &amp; Metals</p>
                </div>
              </div>
              <button onClick={() => setMatrixSweepModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-500 uppercase text-[10px]">Total Permutations</div>
                <div className="text-xl font-bold text-slate-900 mt-1">{matrixSweepStats.totalPermutations.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">18 NPS &times; 5 Class &times; 6 Metal &times; 22 Thk</div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-emerald-700 uppercase text-[10px] font-bold">Pass Rate</div>
                <div className="text-xl font-bold text-emerald-900 mt-1">100.0% (Zero NaNs)</div>
                <div className="text-[10px] text-emerald-600">Calculated in {matrixSweepStats.elapsedMs}ms</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-500 uppercase text-[10px]">Weight Dynamic Range</div>
                <div className="text-sm font-bold text-slate-900 mt-1">{matrixSweepStats.minWeight.toFixed(2)} lbs &rarr; {matrixSweepStats.maxWeight.toFixed(2)} lbs</div>
                <div className="text-[10px] text-slate-400">1/2" 150# 12Ga &rarr; 24" 1500# 3"</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-500 uppercase text-[10px]">Pricing Dynamic Range</div>
                <div className="text-sm font-bold text-sky-800 mt-1">${matrixSweepStats.minPrice.toFixed(2)} &rarr; ${matrixSweepStats.maxPrice.toFixed(2)}</div>
                <div className="text-[10px] text-slate-400">Live ASME JobTrax Pricing</div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>All 11,880 parameter combinations produce valid part numbers, weights, ODs, bolt circles, and pricing with zero mathematical errors!</span>
            </div>

            <button
              onClick={() => setMatrixSweepModalOpen(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs"
            >
              Close Verification Report
            </button>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* INSTANT PROPOSAL GENERATOR & LETTERHEAD PDF MODAL                     */}
      {/* -------------------------------------------------------------------- */}
      <InstantProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        items={proposalModalItems}
        onConfirmOrderAsPO={handleConfirmProposalAsPO}
      />

      {/* -------------------------------------------------------------------- */}
      {/* TURNAROUND BULK BOM LIST & 10% TRADE RFQ MODAL                        */}
      {/* -------------------------------------------------------------------- */}
      <BulkListRfqModal
        isOpen={isBulkRfqModalOpen}
        onClose={() => setIsBulkRfqModalOpen(false)}
        onSuccessLogin={(acc) => {
          setClientAccount(acc);
          setIsClientLoggedIn(true);
          setNotificationToast({
            type: 'success',
            message: `🎉 10% Direct Wholesale Manufacturing Discount Active for ${acc.companyName}!`
          });
        }}
      />

      {/* -------------------------------------------------------------------- */}
      {/* GLOBAL NOTIFICATION TOAST POPUP                                      */}
      {/* -------------------------------------------------------------------- */}
      {notificationToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-sky-500/20 text-sky-400">
            {notificationToast.type === 'email' ? <Mail className="h-4 w-4" /> : notificationToast.type === 'alert' ? <AlertCircle className="h-4 w-4 text-amber-400" /> : <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
          </div>
          <div className="flex-1 text-xs font-medium leading-snug">
            {notificationToast.message}
          </div>
          <button onClick={() => setNotificationToast(null)} className="text-slate-400 hover:text-white p-0.5">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

    </div>
  );
}
