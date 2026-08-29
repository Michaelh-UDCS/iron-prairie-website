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
import { generateNextPoNumber, generateNextProposalNumber, generateNextWorkOrderNumber } from './utils/orderNumberGenerator';
import { BulkListRfqModal } from './components/BulkListRfqModal';
import { initiateStripeCheckout } from './services/stripeService';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

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
  orderSource: 'Website B2B' | 'Website B2B (Stripe)' | 'Amazon Business' | 'Direct PO';
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
  stripeSessionId?: string;
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

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/woman-owned', label: 'Woman-Owned' },
  { to: '/storefront', label: 'Paddle Blinds (B2B)' },
  { to: '/traceability', label: 'ASME Traceability / MTR' },
  { to: '/contact', label: 'Contact' },
];

// ============================================================================
// 3. MAIN REACT APPLICATION (WITH CLEAN CALM PALETTE & THEME TOGGLE)
// ============================================================================
export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.companyName?.toLowerCase().includes('dow') || parsed?.email?.toLowerCase().includes('dow') || parsed?.email?.includes('universal-dynamic')) {
          localStorage.removeItem('ipf_client_account');
          return null;
        }
        return parsed;
      }
      return null;
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
      } else {
        localStorage.removeItem('ipf_client_account');
      }
    } catch (e) {
      console.error(e);
    }
  }, [isClientLoggedIn, clientAccount]);

  // Instant Proposal Generator Modal State
  const [isProposalModalOpen, setIsProposalModalOpen] = useState<boolean>(false);
  const [proposalModalItems, setProposalModalItems] = useState<any[]>([]);

  // Hot Shot Emergency Dispatch Toggle
  const [isHotShotOrder, setIsHotShotOrder] = useState<boolean>(false);

  // Cart & Checkout State
  const [cart, setCart] = useState<ConfiguredItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<CustomerOrder | null>(null);
  const [checkoutIsLoading, setCheckoutIsLoading] = useState<boolean>(false);
  const [isAmazonExportOpen, setIsAmazonExportOpen] = useState<boolean>(false);

  // Controlled Checkout Form State (Always initialized to blank for every customer session)
  const [checkoutCompanyName, setCheckoutCompanyName] = useState<string>('');
  const [checkoutContactName, setCheckoutContactName] = useState<string>('');
  const [checkoutEmail, setCheckoutEmail] = useState<string>('');
  const [checkoutPhone, setCheckoutPhone] = useState<string>('');
  const [checkoutPoNumber, setCheckoutPoNumber] = useState<string>('');
  const [checkoutAddress, setCheckoutAddress] = useState<string>('');
  const [checkoutCardNumber, setCheckoutCardNumber] = useState<string>('');
  const [checkoutCardExp, setCheckoutCardExp] = useState<string>('');
  const [checkoutCardCvc, setCheckoutCardCvc] = useState<string>('');
  const [checkoutBankRouting, setCheckoutBankRouting] = useState<string>('');
  const [checkoutBankAccount, setCheckoutBankAccount] = useState<string>('');

  // Checkout Payment Method Selection (Bluevine ACH & Credit Card)
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<PaymentMethodType>('ach');
  const [achAgreementChecked, setAchAgreementChecked] = useState<boolean>(false);

  // Reset checkout fields to blank whenever checkout modal opens
  useEffect(() => {
    if (isCheckoutOpen) {
      setCheckoutPaymentMethod('ach');
      setCheckoutCompanyName('');
      setCheckoutContactName('');
      setCheckoutEmail('');
      setCheckoutPhone('');
      setCheckoutPoNumber('');
      setCheckoutAddress('');
      setCheckoutCardNumber('');
      setCheckoutCardExp('');
      setCheckoutCardCvc('');
      setCheckoutBankRouting('');
      setCheckoutBankAccount('');
      setAchAgreementChecked(false);
    }
  }, [isCheckoutOpen]);

  // Orders State
  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem('ipf_orders_pipeline');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Abandoned Carts State
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCartRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ipf_abandoned_carts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
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

  // Handle Stripe Checkout return — fires when Stripe redirects back to /?order_status=paid
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderStatus = params.get('order_status');
    const sessionId = params.get('session_id');

    if (orderStatus === 'paid' && sessionId) {
      // Restore the pending order we stashed before redirecting to Stripe
      try {
        const pendingRaw = localStorage.getItem('ipf_pending_stripe_order');
        if (pendingRaw) {
          const pending = JSON.parse(pendingRaw);
          const restoredOrder: CustomerOrder = {
            orderId: pending.poNumber,
            orderSource: 'Website B2B (Stripe)',
            createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
            companyName: pending.companyName,
            contactName: pending.contactName,
            email: pending.email,
            jobsiteAddress: pending.address,
            poNumber: pending.poNumber,
            items: pending.cart,
            subtotal: pending.subtotal,
            shippingCost: pending.shippingCost,
            hotShotFee: pending.hotShotFee || 0,
            totalAmount: pending.grandTotal,
            totalWeightLbs: pending.totalWeightLbs,
            shippingMethod: pending.shippingMethod,
            isHotShot: pending.isHotShot || false,
            isLargeOrder: pending.isLargeOrder || false,
            leadTimeEstimate: pending.leadTimeEstimate,
            paymentMethod: pending.paymentType === 'card' ? 'Credit Card' : 'ACH Direct Debit',
            paymentStatus: pending.paymentType === 'card' ? 'Paid in Full' : 'ACH Clearing',
            status: 'queued',
            millHeatNumber: 'Pending Shop Staging',
            scheduledShipDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            carrierName: pending.totalWeightLbs > 150 ? 'Southeastern Freight' : 'UPS Ground',
            trackingNumber: 'PENDING-LABEL',
            stripeSessionId: sessionId,
          };
          setOrders(prev => [restoredOrder, ...prev]);
          setConfirmedOrder(restoredOrder);
          triggerOrderEmailNotification(restoredOrder);
          localStorage.removeItem('ipf_pending_stripe_order');
        }
      } catch (err) {
        console.error('Failed to restore Stripe pending order:', err);
      }
      // Clean URL params without page reload
      window.history.replaceState({}, '', window.location.pathname);
    }

    if (orderStatus === 'cancelled') {
      setNotificationToast({ type: 'alert', message: '⚠️ Checkout cancelled. Your cart is still saved.' });
      window.history.replaceState({}, '', window.location.pathname);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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

  // Client Logout
  const handleClientLogout = () => {
    if (cart.length > 0) {
      recordAbandonedCartSession(cart, 'Cart Drawer');
    }
    setIsClientLoggedIn(false);
    setClientAccount(null);
    setCart([]);
    try {
      localStorage.removeItem('ipf_client_account');
      localStorage.removeItem('ipf_client_logged_in');
    } catch (e) {
      console.error(e);
    }
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

  // Submit Multi-Payment Checkout → Redirects to Stripe Checkout
  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCheckoutIsLoading(true);

    const companyName = checkoutCompanyName.trim() || 'Commercial Buyer';
    const contactName = checkoutContactName.trim() || 'Plant Sourcing Contact';
    const email = checkoutEmail.trim() || '';
    const phone = checkoutPhone.trim() || '';
    const address = checkoutAddress.trim() || 'Direct Facility Receiving';
    const rawPo = checkoutPoNumber.trim();
    const poNumber = rawPo || (isHotShotOrder ? generateNextPoNumber('IPF-HOT') : generateNextPoNumber('IPF-PO'));
    const paymentType = checkoutPaymentMethod === 'credit_card' ? 'card' : 'ach';
    const hasMTR = cart.some(item => item.requireMTR || item.includeMTR);
    const shippingMethod = isHotShotOrder ? 'Emergency Hot Shot Courier' : cartTotalWeight > 150 ? 'LTL Palletized Freight' : 'UPS Ground Parcel';

    // Stash full order context so we can restore it when Stripe redirects back
    const pendingOrder = {
      poNumber,
      companyName,
      contactName,
      email,
      phone,
      address,
      cart,
      subtotal: cartSubtotal,
      shippingCost: shippingEstimate,
      hotShotFee: activeHotShotFee,
      grandTotal,
      totalWeightLbs: cartTotalWeight,
      shippingMethod,
      paymentType,
      isHotShot: isHotShotOrder,
      isLargeOrder: isLargeVolumeOrder,
      leadTimeEstimate: activeLeadTimeText,
    };
    try {
      localStorage.setItem('ipf_pending_stripe_order', JSON.stringify(pendingOrder));
    } catch (_) { /* storage full or private mode — proceed anyway */ }

    // Save lead snapshot to Firestore for analytics & CRM follow-up
    if (db) {
      try {
        await addDoc(collection(db, 'checkout_leads'), {
          orderRefId: poNumber,
          buyerName: contactName,
          buyerEmail: email,
          buyerPhone: phone,
          companyName,
          deliveryAddress: address,
          paymentType,
          itemsCount: cart.length,
          totalWeightLbs: cartTotalWeight,
          cartSubtotal,
          shippingCost: shippingEstimate,
          hotShotFee: activeHotShotFee,
          grandTotal,
          cartItems: cart.map(item => ({
            sku: item.partNumber,
            nps: item.nps,
            pressureClass: item.pressureClass,
            material: item.materialName,
            facing: item.facing,
            thickness: item.thicknessLabel,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.unitPrice * item.quantity,
          })),
          source: 'storefront_stripe_checkout',
          status: 'initiated',
          createdAt: serverTimestamp(),
        });
      } catch (leadErr) {
        console.warn('Firestore lead save notice (non-fatal):', leadErr);
      }
    }

    try {
      const result = await initiateStripeCheckout({
        cartItems: cart as any,
        buyerEmail: email,
        buyerName: contactName,
        companyName,
        deliveryAddress: address,
        paymentType,
        shippingCost: shippingEstimate,
        shippingMethod,
        hasMTR,
      });

      // initiateStripeCheckout redirects the browser when successful.
      // If we are still here it means either:
      //  a) Stripe functions are not yet deployed (pre-Blaze) → result.isSimulated is true
      //  b) An unexpected error occurred.
      if (result.isSimulated || !result.redirectUrl) {
        // Pre-deployment fallback: save locally and show confirmation as before
        const payLabel: 'Credit Card' | 'ACH Direct Debit' = paymentType === 'card' ? 'Credit Card' : 'ACH Direct Debit';
        const payStatus: 'Paid in Full' | 'ACH Clearing' = paymentType === 'card' ? 'Paid in Full' : 'ACH Clearing';

        const newOrder: CustomerOrder = {
          orderId: poNumber,
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
          shippingMethod,
          isHotShot: isHotShotOrder,
          isLargeOrder: isLargeVolumeOrder,
          leadTimeEstimate: activeLeadTimeText,
          paymentMethod: payLabel,
          paymentStatus: payStatus,
          status: 'queued',
          millHeatNumber: isLargeVolumeOrder ? 'Mill Plate Allocation In Progress' : 'Pending Shop Staging',
          scheduledShipDate: isHotShotOrder
            ? `${new Date().toISOString().split('T')[0]} (TODAY RUSH)`
            : isLargeVolumeOrder ? '5-7 Business Days'
            : new Date(Date.now() + 86400000).toISOString().split('T')[0],
          carrierName: isHotShotOrder ? 'Iron Prairie Hot-Shot Dedicated' : cartTotalWeight > 150 ? 'Southeastern Freight' : 'UPS Ground',
          trackingNumber: isHotShotOrder ? 'HOT-SHOT-DIRECT-TRUCK' : 'PENDING-LABEL',
        };

        setOrders(prev => [newOrder, ...prev]);
        await triggerOrderEmailNotification(newOrder);
        setAbandonedCarts(prev => prev.map(c =>
          c.companyName === companyName || c.email === email ? { ...c, status: 'Recovered' } : c
        ));
        setCart([]);
        setIsCheckoutOpen(false);
        setIsHotShotOrder(false);
        setConfirmedOrder(newOrder);
        setNotificationToast({
          type: 'email',
          message: `✉️ Order #${newOrder.poNumber} queued! Note: live payment will be active after deployment.`,
        });
        localStorage.removeItem('ipf_pending_stripe_order');
      }
      // If redirect happened, browser navigates away — nothing else runs here.
    } catch (err) {
      console.error('Checkout error:', err);
      setNotificationToast({ type: 'alert', message: '⚠️ Checkout error. Please try again or contact us directly.' });
      localStorage.removeItem('ipf_pending_stripe_order');
    } finally {
      setCheckoutIsLoading(false);
    }
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
            <span className="hidden sm:inline">Bay City, TX Facility &bull; ASME B16.48 In-House Plasma Cutting</span>
            <span className="sm:hidden">Bay City ASME B16.48</span>
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
            </a>
          </div>
        </div>
      </div>

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
    </div>
  );


  return (
    <div className="min-h-screen bg-[#f7f5f0] text-slate-800 font-sans antialiased selection:bg-brand-brown selection:text-white flex flex-col justify-between overflow-x-hidden w-full max-w-full">
      <ScrollToTop />
      
      {/* -------------------------------------------------------------------- */}
      {/* TOP EMERGENCY DISPATCH & OWNER PRICING STATUS BAR                    */}
      {/* -------------------------------------------------------------------- */}
      <div className="border-b border-brand-border bg-brand-panel px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 text-xs text-stone-400 shadow-sm w-full min-w-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0 truncate">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] sm:text-[11px] font-semibold bg-emerald-950/60 px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-800 flex-shrink-0">
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="hidden xs:inline">Plasma Cutting Queue:</span> LIVE
            </span>
            <span className="hidden lg:inline text-brand-border flex-shrink-0">|</span>
            <span className="hidden lg:inline text-stone-400 font-medium text-[11px] truncate">
              Texas Fabrication Hub &bull; Daily Nationwide Shipping Across All 50 States &bull; Emergency Hot-Shot Logistics
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">


            <a
              href="tel:+19792489266"
              className="font-mono font-bold text-brand-bone hover:text-brand-brown-light transition-colors text-xs flex items-center gap-1.5 flex-shrink-0 py-1 px-1.5 rounded-md hover:bg-brand-panel touch-manipulation min-h-[32px]"
            >
              <Phone className="h-3.5 w-3.5 text-brand-brown-light shrink-0" />
              <span>(979) 248-9266</span>
            </a>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* HEADER & MAIN NAVIGATION                                             */}
      {/* -------------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-panel/95 backdrop-blur-md shadow-md w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          
          {/* Logo & Company Name */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group flex-shrink min-w-0">
            <img
              src={brandLogo}
              alt="Iron Prairie Fabrication Group LLC logo"
              className="h-9 sm:h-11 w-auto rounded-lg border border-brand-border bg-brand-panel-muted p-1 shadow-sm object-contain flex-shrink-0"
            />
            <div className="leading-tight min-w-0">
              <span className="text-sm sm:text-base lg:text-lg font-display font-bold uppercase tracking-wide text-brand-bone group-hover:text-brand-brown-light transition-colors whitespace-nowrap block truncate">
                Iron Prairie
              </span>
              <span className="hidden sm:block text-[10px] text-brand-muted font-sans tracking-wide whitespace-nowrap truncate">
                Fabrication Group LLC &bull; Texas Shop &bull; Nationwide Shipping
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-1 xl:gap-1.5 flex-shrink-0">
            {navLinks.map((item) => {
              const isCatalog = item.to === '/storefront' || item.to === '/paddle-blinds';
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    isCatalog
                      ? `px-2.5 xl:px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shadow-sm flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-brand-brown text-brand-ivory ring-2 ring-brand-brown-light shadow-md'
                            : 'bg-brand-brown hover:bg-brand-brown-light text-brand-ivory shadow-sm'
                        }`
                      : `px-2 xl:px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                          isActive
                            ? 'bg-brand-panel-muted text-brand-bone font-bold border border-brand-border'
                            : 'text-stone-400 hover:text-brand-bone hover:bg-brand-panel-muted'
                        }`
                  }
                >
                  {isCatalog && <Zap className="h-3.5 w-3.5 fill-current text-brand-ivory" />}
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
                  className="flex items-center gap-1.5 bg-brand-panel-muted border border-brand-border text-brand-bone px-2 sm:px-3 py-2 rounded-lg text-xs font-semibold hover:bg-brand-panel transition-colors min-h-[40px] sm:min-h-[44px] touch-manipulation"
                  title="Click to view client account details"
                >
                  <UserCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-brown-light shrink-0" />
                  <span className="hidden sm:inline max-w-[90px] xl:max-w-[130px] truncate">{clientAccount?.companyName || 'Verified Trade'}</span>
                  <span className="sm:hidden text-[11px] font-bold">Trade</span>
                </button>
                <button
                  onClick={handleClientLogout}
                  className="p-2 sm:p-2 rounded-lg bg-brand-panel-muted border border-brand-border text-stone-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center touch-manipulation"
                  title="Log out"
                >
                  <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 bg-brand-panel hover:bg-brand-panel-muted border border-brand-border text-brand-bone px-2.5 sm:px-3 py-2 rounded-lg font-bold transition-all shadow-sm active:scale-95 text-xs min-h-[40px] sm:min-h-[44px] touch-manipulation"
            >
              <ShoppingCart className="h-4 w-4 text-brand-brown-light shrink-0" />
              <span className="hidden sm:inline">Cart</span>
              {cart.length > 0 && (
                <span className="bg-brand-brown text-brand-ivory font-mono text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>

            {/* Request a Quote Button */}
            <Link
              to="/contact"
              className="hidden xl:inline-flex rounded-full bg-brand-brown hover:bg-brand-brown-light px-4 py-2 text-xs font-bold text-brand-ivory shadow-sm transition-all active:scale-95 whitespace-nowrap min-h-[40px] items-center touch-manipulation"
            >
              Request a Quote
            </Link>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 sm:p-2.5 rounded-lg border border-brand-border text-stone-300 hover:bg-brand-panel-muted lg:hidden min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center touch-manipulation"
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileOpen && (
          <nav className="border-t border-brand-border bg-brand-panel p-4 space-y-2.5 lg:hidden shadow-2xl animate-fadeIn max-h-[85vh] overflow-y-auto">
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
                      ? `block px-3.5 py-3 rounded-xl text-sm font-bold bg-brand-brown text-brand-ivory flex items-center justify-between shadow-sm min-h-[48px] touch-manipulation`
                      : `block px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center ${
                          isActive ? 'bg-brand-panel-muted text-brand-bone font-bold border border-brand-border' : 'text-stone-300 hover:bg-brand-panel-muted'
                        } touch-manipulation`
                  }
                >
                  <span>{item.label}</span>
                  {isCatalog && <span className="bg-brand-panel text-brand-ivory text-[10px] px-2 py-0.5 rounded-full font-bold border border-brand-border">CATALOG</span>}
                </NavLink>
              );
            })}
            <div className="pt-2 border-t border-brand-border space-y-2">
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center rounded-full bg-brand-brown hover:bg-brand-brown-light py-3 text-sm font-bold text-brand-ivory shadow-sm min-h-[48px] flex items-center justify-center touch-manipulation"
              >
                Request a Quote
              </Link>
              <a
                href="tel:+19792489266"
                className="block w-full text-center rounded-xl bg-brand-panel-muted border border-brand-border py-2.5 text-xs font-bold text-brand-bone min-h-[44px] flex items-center justify-center gap-2 touch-manipulation"
              >
                <Phone className="h-4 w-4 text-brand-brown-light" />
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
          <Route path="/traceability/:refId" element={<PublicMtrViewer />} />
          <Route path="/traceability" element={<PublicMtrViewer />} />
          <Route path="/mtr-lookup" element={<PublicMtrViewer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* -------------------------------------------------------------------- */}
      {/* GLOBAL WEBSITE FOOTER                                                */}
      {/* -------------------------------------------------------------------- */}
      <footer className="border-t border-brand-border bg-brand-panel text-stone-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={brandLogo}
                  alt="Iron Prairie Fabrication Group LLC"
                  className="h-10 w-auto rounded border border-brand-border bg-brand-panel-muted p-0.5"
                />
                <div>
                  <span className="font-display text-base font-bold uppercase tracking-wider text-brand-bone block">
                    Iron Prairie Fabrication Group LLC
                  </span>
                  <span className="text-[11px] text-brand-muted block">ASME B16.48 Paddle Blinds &bull; Industrial Metal Fabrication</span>
                </div>
              </div>
              <p className="text-xs text-stone-400 max-w-md leading-relaxed">
                Certified woman-owned metal fabrication enterprise based in Bay City, Texas. Precision CNC plasma plate cutting, ASME B16.48 positive isolation paddle blinds, custom ranch gates, animal pens, tornado shelters, custom bunkers, and municipal infrastructure steelwork. Serving Bay City, Matagorda County, Texas Gulf Coast, and statewide Texas with rapid site delivery, plus daily nationwide shipping across all 50 states.
              </p>
            </div>

            <div>
              <div className="text-xs font-bold text-brand-bone uppercase tracking-wider mb-3">Quick Navigation</div>
              <ul className="space-y-1.5 text-xs text-stone-400">
                <li><Link to="/about" className="hover:text-brand-bone transition-colors">About Our Shop</Link></li>
                <li><Link to="/services" className="hover:text-brand-bone transition-colors">Fabrication Services</Link></li>
                <li><Link to="/projects" className="hover:text-brand-bone transition-colors">Project Portfolio</Link></li>
                <li><Link to="/woman-owned" className="hover:text-brand-bone transition-colors">Woman-Owned Enterprise</Link></li>
                <li><Link to="/storefront" className="hover:text-brand-bone transition-colors">ASME B16.48 Paddle Blinds</Link></li>
                <li><Link to="/contact" className="hover:text-brand-bone transition-colors">Request a Quote</Link></li>
              </ul>
            </div>

            <div>
              <div className="text-xs font-bold text-brand-bone uppercase tracking-wider mb-3">Facility &amp; Inquiries</div>
              <div className="space-y-2 text-xs text-stone-400">
                <div>Phone: <a href="tel:+19792489266" className="text-brand-bone hover:text-brand-brown-light font-bold">(979) 248-9266</a></div>
                <div>Email: <a href="mailto:Sales@ironprairiefabrication.com" className="text-brand-bone hover:text-brand-brown-light underline">Sales@ironprairiefabrication.com</a></div>
                <div>Facility: 200 County Rd 170, Bay City, TX 77414 (Matagorda County)</div>
                <div>Service Area: Texas Statewide &bull; <span className="text-brand-bone font-semibold">Nationwide Shipping (All 50 States)</span></div>
                <div>Government Contractor: <span className="text-emerald-400 font-bold">SAM.gov Registered</span> &bull; <span className="font-mono text-stone-300 font-bold">UEI: XX7XCMGN9XD5</span></div>
                <div className="pt-2 flex gap-4 text-[11px] text-stone-500">
                  <Link to="/privacy-policy" className="hover:text-brand-bone underline">Privacy Policy</Link>
                  <Link to="/terms-of-service" className="hover:text-brand-bone underline">Terms of Service</Link>
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
                  <div className="p-3 bg-white border border-blue-200 rounded-xl space-y-2 shadow-sm col-span-2 sm:col-span-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] text-blue-900 font-bold uppercase">
                        ⚙️ Variable CNC Lathe Machining (Facing Adder):
                      </label>
                      <span className="text-[10px] text-blue-700 font-mono">Scales with OD ($Setup + $Rate/in)</span>
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
                        <label className="text-[9px] text-slate-500 block mb-0.5">Rate / Inch OD ($)</label>
                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                          <span className="text-slate-500">$</span>
                          <input
                            type="number"
                            step="1"
                            value={pricingConfig.machiningRatePerInchOD ?? 8}
                            onChange={e => setPricingConfig(prev => ({ ...prev, machiningRatePerInchOD: parseFloat(e.target.value) || 8 }))}
                            className="w-full bg-transparent text-slate-900 font-bold focus:outline-none"
                          />
                          <span className="text-slate-500 text-[10px]">/in</span>
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
                      placeholder="e.g. John Doe (Lead Buyer)"
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
                    placeholder="e.g. Plant Gate Receiving (Texas)"
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
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-blue-800 font-bold uppercase">
                      <Clock className="h-3.5 w-3.5 text-blue-700" /> High-Volume Mill Plate Sourcing
                    </div>
                    <p className="text-[11px] text-blue-900">
                      Order total exceeds $10,000 / 1,000 lbs. Dedicated master plate staging lead time is 5–7 business days.
                    </p>
                  </div>
                )}

                {/* Hot Shot Courier Delivery Selection in Cart */}
                {isHotShotOrder ? (
                  <div className="mt-3 bg-rose-50 border border-rose-200 rounded-xl p-3.5 space-y-1">
                    <div className="flex items-center justify-between text-rose-900 font-bold text-xs">
                      <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-rose-600" /> Dedicated Hot Shot Courier</span>
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
                      <div className="text-[11px] text-slate-500">Call out Dedicated Hot Shot courier</div>
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
                        setIsCheckoutOpen(true);
                      }}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg text-xs sm:text-sm uppercase tracking-wider transition-all active:scale-98 border border-emerald-400/30"
                    >
                      <Zap className="h-4 w-4 fill-white" /> ⚡ Instant Stripe Checkout (Card / ACH)
                    </button>

                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        handleOpenProposalForItems(cart);
                      }}
                      className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all active:scale-98"
                    >
                      <FileText className="h-4 w-4 text-blue-600" /> Generate Official Proposal (Email PDF)
                    </button>
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
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setCheckoutPaymentMethod('ach')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    checkoutPaymentMethod === 'ach'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-sm ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <Building className="h-4 w-4 text-emerald-700" /> Instant ACH
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold mt-0.5">0% Fee (Preferred)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCheckoutPaymentMethod('credit_card')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    checkoutPaymentMethod === 'credit_card'
                      ? 'bg-rose-50 border-rose-600 text-rose-950 shadow-sm ring-1 ring-rose-500'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-rose-700" /> Credit Card
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
                    value={checkoutCompanyName}
                    onChange={e => setCheckoutCompanyName(e.target.value)}
                    placeholder="e.g. Plant Site / Company Name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white font-medium min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Buyer / Project Lead</label>
                  <input
                    required
                    name="contactName"
                    value={checkoutContactName}
                    onChange={e => setCheckoutContactName(e.target.value)}
                    placeholder="e.g. John Doe (Procurement Lead)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white font-medium min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Commercial Work Email</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={checkoutEmail}
                    onChange={e => setCheckoutEmail(e.target.value)}
                    placeholder="e.g. buyer@company.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white font-medium min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Contact Phone</label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={checkoutPhone}
                    onChange={e => setCheckoutPhone(e.target.value)}
                    placeholder="e.g. (979) 555-0100"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white font-medium min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Purchase Order (PO) #</label>
                  <input
                    name="poNumber"
                    value={checkoutPoNumber}
                    onChange={e => setCheckoutPoNumber(e.target.value)}
                    placeholder="e.g. PO-2026-8849 (or blank to auto-generate)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sky-800 focus:outline-none focus:border-sky-600 focus:bg-white font-mono font-bold min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1">Jobsite Delivery / Receiving Address</label>
                <input
                  required
                  name="address"
                  value={checkoutAddress}
                  onChange={e => setCheckoutAddress(e.target.value)}
                  placeholder="e.g. Gate 4 Receiving / Laydown Yard, TX"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white"
                />
              </div>

              {/* PAYMENT DETAILS SUB-FORMS */}
              {checkoutPaymentMethod === 'credit_card' && (
                <div className="p-3.5 bg-rose-50/80 rounded-xl border border-rose-200 space-y-3">
                  <div className="flex items-center justify-between text-slate-800 font-bold">
                    <span className="flex items-center gap-1.5 text-rose-900"><CreditCard className="h-4 w-4 text-rose-700" /> Credit Card Authorization</span>
                    <span className="text-[10px] text-rose-700 font-mono font-bold bg-rose-100 px-2 py-0.5 rounded border border-rose-200">+3.5% SURCHARGE APPLIED</span>
                  </div>

                  {/* High-visibility Warning Banner with 1-Click Switch Button */}
                  <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-900 flex items-center justify-between gap-2 shadow-sm">
                    <div className="flex items-start gap-1.5">
                      <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>Notice:</strong> 3.5% card surcharge is added (+${creditCardSurcharge.toFixed(2)}).
                        <div className="text-[11px] text-slate-600">Avoid this fee by paying via Instant ACH.</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCheckoutPaymentMethod('ach')}
                      className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg shadow transition-all"
                    >
                      ⚡ Switch to ACH (Save ${creditCardSurcharge.toFixed(2)})
                    </button>
                  </div>

                  <div className="flex items-start gap-2.5 text-[11px] text-rose-900 bg-white border border-rose-200 rounded-lg p-2.5">
                    <ShieldCheck className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>Card details are entered <strong>securely on Stripe's encrypted payment page</strong> on the next step. 256-bit SSL encrypted.</span>
                  </div>
                </div>
              )}

              {checkoutPaymentMethod === 'ach' && (
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between text-slate-800 font-bold">
                    <span className="flex items-center gap-1.5"><Building className="h-4 w-4 text-emerald-700" /> ACH Direct Debit via Stripe</span>
                    <span className="text-[10px] text-emerald-700 font-mono font-semibold">0% Processing Surcharge</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-[11px] text-emerald-900 bg-white border border-emerald-200 rounded-lg p-2.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Your bank account is connected <strong>securely through Stripe</strong> on the next step. You will be redirected to enter your bank credentials — we never see or store your routing or account numbers.</span>
                  </div>
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
                    <span>Instant ACH Direct Transfer:</span>
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
                  disabled={checkoutIsLoading}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl border border-slate-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={checkoutIsLoading}
                  className="w-2/3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl shadow-lg text-xs uppercase tracking-wider disabled:opacity-60 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  {checkoutIsLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Redirecting to Stripe…
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 fill-white" /> Proceed to Secure Stripe Payment
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* CUSTOMER ORDER CONFIRMATION MODAL                                    */}
      {/* -------------------------------------------------------------------- */}
      {confirmedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Purchase Order Confirmed!</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Order Ref / PO <span className="font-mono font-bold text-sky-800">#{confirmedOrder.poNumber}</span> &bull; Dispatched to CNC Plasma Queue
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConfirmedOrder(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Email Dispatch & Lead Time Alert Banner */}
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-950 space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <Mail className="h-4 w-4 text-sky-700 shrink-0" />
                <span>Confirmation Package Dispatched:</span>
              </div>
              <p className="text-[11px] text-slate-600 pl-6 leading-relaxed">
                An itemized order receipt and specification package has been emailed to <strong className="text-slate-900 font-mono">{confirmedOrder.email}</strong> and queued directly to our Bay City, TX fabrication floor (<strong className="text-slate-900">sales@ironprairiefabrication.com</strong>).
              </p>
            </div>

            {/* Order & Delivery Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-sans">Account &amp; Contact</span>
                <div className="font-bold text-slate-900 font-sans text-sm">{confirmedOrder.companyName}</div>
                <div className="text-slate-600">{confirmedOrder.contactName}</div>
                <div className="text-slate-500 text-[11px]">{confirmedOrder.email}</div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-sans">Delivery &amp; Production</span>
                <div className="text-slate-900 font-sans text-xs">{confirmedOrder.jobsiteAddress}</div>
                <div className="text-sky-800 font-semibold text-[11px]">Carrier: {confirmedOrder.carrierName}</div>
                <div className="text-emerald-700 font-bold text-[11px]">Lead Time: {confirmedOrder.leadTimeEstimate}</div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Line Items In Order:</div>
              <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold sticky top-0">
                    <tr>
                      <th className="p-2.5">Item / Spec</th>
                      <th className="p-2.5">Material &amp; Class</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Price</th>
                      <th className="p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    {confirmedOrder.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5">
                          <div className="font-bold text-slate-900">{item.nps} ({item.thicknessLabel})</div>
                          <div className="text-[10px] text-slate-500 font-mono">{item.partNumber}</div>
                        </td>
                        <td className="p-2.5 text-slate-700">
                          {item.materialCode} &bull; {item.pressureClass}#
                        </td>
                        <td className="p-2.5 text-center font-bold text-slate-900">{item.quantity}</td>
                        <td className="p-2.5 text-right text-slate-600">${item.unitPrice.toFixed(2)}</td>
                        <td className="p-2.5 text-right font-bold text-sky-800">${(item.unitPrice * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Invoiced Total Summary */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({confirmedOrder.items.reduce((s, i) => s + i.quantity, 0)} units &bull; {confirmedOrder.totalWeightLbs} lbs):</span>
                <span className="text-slate-900">${confirmedOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping ({confirmedOrder.shippingMethod}):</span>
                <span className="text-slate-900">${confirmedOrder.shippingCost.toFixed(2)}</span>
              </div>
              {confirmedOrder.hotShotFee > 0 && (
                <div className="flex justify-between text-rose-700 font-bold">
                  <span>Emergency Hot-Shot Dispatch Fee:</span>
                  <span>+${confirmedOrder.hotShotFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Payment Terms / Method:</span>
                <span className="text-slate-900 font-semibold">{confirmedOrder.paymentMethod} ({confirmedOrder.paymentStatus})</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Invoiced Total:</span>
                <span className="text-sky-800 text-base">${confirmedOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl border border-slate-300 text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="h-4 w-4 text-sky-700" />
                <span>Print / Save Order Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setConfirmedOrder(null)}
                className="w-full sm:w-1/2 bg-sky-700 hover:bg-sky-800 text-white font-bold py-3 rounded-xl shadow-sm text-xs uppercase tracking-wider transition-all"
              >
                Done / Continue Browsing
              </button>
            </div>

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
      {/* AUTOMATED EMAIL DISPATCH PREVIEW MODAL                               */}
      {/* -------------------------------------------------------------------- */}
      {previewEmailRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                  <Mail className="h-5 w-5" />
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
          <div className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-cyan-500/20 text-cyan-400">
            {notificationToast.type === 'email' ? <Mail className="h-4 w-4" /> : notificationToast.type === 'alert' ? <AlertCircle className="h-4 w-4 text-cyan-400" /> : <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
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
