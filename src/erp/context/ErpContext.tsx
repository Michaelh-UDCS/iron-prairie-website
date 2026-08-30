// src/erp/context/ErpContext.tsx
// Local-First Resilient State & Automation Engine for Iron Prairie Group LLC (Bay City, TX)
// Unifies Work Orders, Stock Inventory, MTRs, POs, NCRs, Invoices, Doc Control, and Google Drive Sync

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  ErpWorkOrder,
  ErpWorkOrderStage,
  StockMaterialItem,
  SupplierProfile,
  ErpPurchaseOrder,
  NcrRecord,
  ErpInvoice,
  DocControlItem,
  SalesEmailTrigger,
  ClientAccount,
  MaterialTestReport,
  ErpBackupSnapshot,
  ErpModuleDefinition,
  MaterialCode,
  CustomerOrder,
  StorefrontCheckoutRecord,
} from '../../types';
import {
  SEED_ERP_CLIENTS,
  SEED_ERP_SUPPLIERS,
  SEED_STOCK_INVENTORY,
  SEED_WORK_ORDERS,
  SEED_PURCHASE_ORDERS,
  SEED_NCR_RECORDS,
  SEED_ERP_INVOICES,
  SEED_DOC_CONTROL_ITEMS,
  SEED_SALES_EMAIL_TRIGGERS
} from '../data/initialErpSeedData';
import { INITIAL_MTR_DATABASE } from '../../operations/data/mtrRepository';
import { DEFAULT_ERP_MODULES, getInitialModules } from '../registry/erpModuleRegistry';
import { chimeManager } from '../../operations/services/AudioChimeManager';
import { fetchErpStorefrontFeed, getOpsKeyFromSession } from '../../services/erpStorefrontFeed';

export interface ErpFinancialMetrics {
  totalGrossRevenue: number;
  creditCardVolume: number;
  achVolume: number;
  poVolume: number;
  creditCardPct: number;
  achPct: number;
  poPct: number;
  totalAchFeeSavings: number;
  totalCreditCardSurcharges: number;
  stripeInFlightBalance: number;
  bluevineSweptTotal: number;
  totalPaidCount: number;
  totalClearingCount: number;
}

interface ErpContextType {
  // Navigation & Modules
  activeModuleId: string;
  setActiveModuleId: (id: string) => void;
  registeredModules: ErpModuleDefinition[];
  toggleModule: (id: string) => void;
  registerCustomModule: (module: Omit<ErpModuleDefinition, 'isCustom'>) => void;

  // Network & Sync State
  isOnline: boolean;
  lastSyncedAt: string;
  pendingSyncCount: number;
  triggerManualSync: () => Promise<void>;

  // Universal Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Work Orders & Job #s
  workOrders: ErpWorkOrder[];
  addWorkOrder: (order: Partial<ErpWorkOrder>) => string;
  updateWorkOrder: (jobNumber: string, updates: Partial<ErpWorkOrder>) => void;
  updateWorkOrderStage: (jobNumber: string, stage: ErpWorkOrderStage) => void;
  deleteWorkOrder: (jobNumber: string) => void;
  getWorkOrderByJobNumber: (jobNumber: string) => ErpWorkOrder | undefined;
  releaseToPlasmaTable: (jobNumber: string) => void;

  // Automated Ingestion & Storefront Sync
  ingestStorefrontOrder: (
    orderData: Partial<CustomerOrder> | Partial<ErpWorkOrder>,
    options?: {
      paymentRef?: string;
      paymentType?: 'credit_card' | 'ach' | 'net30_po';
      paymentStatus?: 'Paid in Full' | 'ACH Clearing' | 'Net 30 Authorized';
      autoReleaseToTable?: boolean;
    }
  ) => ErpWorkOrder;
  recentStorefrontOrders: CustomerOrder[];
  incompleteCheckouts: StorefrontCheckoutRecord[];
  completedCheckouts: StorefrontCheckoutRecord[];
  storefrontFeedError: string | null;
  storefrontFeedAuthRequired: boolean;
  refreshStorefrontFeed: () => Promise<void>;
  convertIncompleteCheckout: (record: StorefrontCheckoutRecord) => ErpWorkOrder;
  dismissIncompleteCheckout: (orderRefId: string) => void;
  dismissedCheckoutIds: string[];

  // Financial Intelligence
  financialMetrics: ErpFinancialMetrics;

  // MTR Vault & Log
  mtrDatabase: MaterialTestReport[];
  addMtr: (mtr: MaterialTestReport) => void;
  updateMtr: (id: string, updates: Partial<MaterialTestReport>) => void;
  deleteMtr: (id: string) => void;
  getMtrByHeatNumber: (heatNumber: string) => MaterialTestReport | undefined;

  // Stock Material Inventory (Plate, Pipe, Structural)
  stockInventory: StockMaterialItem[];
  addStockItem: (item: Omit<StockMaterialItem, 'id'>) => void;
  updateStockItem: (id: string, updates: Partial<StockMaterialItem>) => void;
  deleteStockItem: (id: string) => void;
  allocateStockToJob: (stockId: string, jobNumber: string, qty: number) => void;

  // Suppliers & Purchase Orders
  suppliers: SupplierProfile[];
  addSupplier: (supplier: SupplierProfile) => void;
  updateSupplier: (id: string, updates: Partial<SupplierProfile>) => void;
  purchaseOrders: ErpPurchaseOrder[];
  addPurchaseOrder: (po: Partial<ErpPurchaseOrder>) => string;
  updatePurchaseOrderStatus: (poNumber: string, status: ErpPurchaseOrder['status']) => void;
  receivePurchaseOrderItems: (poNumber: string, receivedMap: Record<string, number>) => void;

  // NCR Quality Log
  ncrRecords: NcrRecord[];
  addNcrRecord: (ncr: Partial<NcrRecord>) => string;
  updateNcrRecord: (ncrNumber: string, updates: Partial<NcrRecord>) => void;
  signOffNcr: (ncrNumber: string, managerName: string) => void;

  // Accounts Payable & Receivable (Invoices)
  invoices: ErpInvoice[];
  addInvoice: (invoice: ErpInvoice) => void;
  recordInvoicePayment: (invoiceNumber: string, amount: number, method: string) => void;

  // Document Control & Drawings
  docControlItems: DocControlItem[];
  addDocControlItem: (item: Omit<DocControlItem, 'id'>) => void;
  updateDocControlItem: (id: string, updates: Partial<DocControlItem>) => void;

  // Clients
  clients: ClientAccount[];
  addClient: (client: ClientAccount) => void;

  // Sales Email Trigger & Ingestion Engine
  salesEmailTriggers: SalesEmailTrigger[];
  simulateSalesEmailTrigger: (customData?: Partial<SalesEmailTrigger>) => SalesEmailTrigger;
  processSalesEmailTrigger: (triggerId: string) => string;

  // Local-First Backup & Disaster Recovery
  exportBackupSnapshot: () => void;
  importBackupSnapshot: (fileContent: string) => boolean;
  resetToDefaultSeedData: () => void;
}

const ErpContext = createContext<ErpContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(`ipg_erp_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch (err) {
    console.error(`Failed to load ${key} from localStorage`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`ipg_erp_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage`, err);
  }
}

export const ErpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeModuleId, setActiveModuleId] = useState<string>('dashboard');
  const [registeredModules, setRegisteredModules] = useState<ErpModuleDefinition[]>(getInitialModules);

  // Connectivity
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>(new Date().toLocaleTimeString());
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  // Search
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Primary Entities
  const [workOrders, setWorkOrders] = useState<ErpWorkOrder[]>(() =>
    loadFromStorage('work_orders', SEED_WORK_ORDERS)
  );
  const [mtrDatabase, setMtrDatabase] = useState<MaterialTestReport[]>(() =>
    loadFromStorage('mtr_database', INITIAL_MTR_DATABASE)
  );
  const [stockInventory, setStockInventory] = useState<StockMaterialItem[]>(() =>
    loadFromStorage('stock_inventory', SEED_STOCK_INVENTORY)
  );
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>(() =>
    loadFromStorage('suppliers', SEED_ERP_SUPPLIERS)
  );
  const [purchaseOrders, setPurchaseOrders] = useState<ErpPurchaseOrder[]>(() =>
    loadFromStorage('purchase_orders', SEED_PURCHASE_ORDERS)
  );
  const [ncrRecords, setNcrRecords] = useState<NcrRecord[]>(() =>
    loadFromStorage('ncr_records', SEED_NCR_RECORDS)
  );
  const [invoices, setInvoices] = useState<ErpInvoice[]>(() =>
    loadFromStorage('invoices', SEED_ERP_INVOICES)
  );
  const [docControlItems, setDocControlItems] = useState<DocControlItem[]>(() =>
    loadFromStorage('doc_control', SEED_DOC_CONTROL_ITEMS)
  );
  const [clients, setClients] = useState<ClientAccount[]>(() =>
    loadFromStorage('clients', SEED_ERP_CLIENTS)
  );
  const [salesEmailTriggers, setSalesEmailTriggers] = useState<SalesEmailTrigger[]>(() =>
    loadFromStorage('sales_emails', SEED_SALES_EMAIL_TRIGGERS)
  );

  // Storefront Orders Pipeline sync cache
  const [recentStorefrontOrders, setRecentStorefrontOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem('ipf_orders_pipeline');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [incompleteCheckouts, setIncompleteCheckouts] = useState<StorefrontCheckoutRecord[]>([]);
  const [completedCheckouts, setCompletedCheckouts] = useState<StorefrontCheckoutRecord[]>([]);
  const [storefrontFeedError, setStorefrontFeedError] = useState<string | null>(null);
  const [storefrontFeedAuthRequired, setStorefrontFeedAuthRequired] = useState(false);
  const [dismissedCheckoutIds, setDismissedCheckoutIds] = useState<string[]>(() =>
    loadFromStorage('dismissed_checkouts', [])
  );

  // Persistent storage auto-save
  useEffect(() => saveToStorage('work_orders', workOrders), [workOrders]);
  useEffect(() => saveToStorage('mtr_database', mtrDatabase), [mtrDatabase]);
  useEffect(() => saveToStorage('stock_inventory', stockInventory), [stockInventory]);
  useEffect(() => saveToStorage('suppliers', suppliers), [suppliers]);
  useEffect(() => saveToStorage('purchase_orders', purchaseOrders), [purchaseOrders]);
  useEffect(() => saveToStorage('ncr_records', ncrRecords), [ncrRecords]);
  useEffect(() => saveToStorage('invoices', invoices), [invoices]);
  useEffect(() => saveToStorage('doc_control', docControlItems), [docControlItems]);
  useEffect(() => saveToStorage('clients', clients), [clients]);
  useEffect(() => saveToStorage('sales_emails', salesEmailTriggers), [salesEmailTriggers]);
  useEffect(() => saveToStorage('registered_modules', registeredModules), [registeredModules]);
  useEffect(() => saveToStorage('dismissed_checkouts', dismissedCheckoutIds), [dismissedCheckoutIds]);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastSyncedAt(new Date().toLocaleTimeString());
      setPendingSyncCount(0);
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Poll storefront pipeline orders periodically to stay in real-time sync
  useEffect(() => {
    const syncStorefrontOrders = () => {
      try {
        const raw = localStorage.getItem('ipf_orders_pipeline');
        if (raw) {
          const parsed: CustomerOrder[] = JSON.parse(raw);
          setRecentStorefrontOrders(parsed);
        }
      } catch (e) {
        console.error('Failed to sync storefront orders', e);
      }
    };

    syncStorefrontOrders();
    const interval = setInterval(syncStorefrontOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const refreshStorefrontFeed = useCallback(async () => {
    const opsKey = getOpsKeyFromSession();
    if (!opsKey) {
      setStorefrontFeedAuthRequired(true);
      return;
    }
    setStorefrontFeedAuthRequired(false);
    try {
      const feed = await fetchErpStorefrontFeed(opsKey);
      setIncompleteCheckouts(feed.incomplete || []);
      setCompletedCheckouts(feed.completed || []);
      setStorefrontFeedError(null);
      setLastSyncedAt(new Date().toLocaleTimeString());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Storefront feed unavailable';
      setStorefrontFeedError(message);
    }
  }, []);

  useEffect(() => {
    refreshStorefrontFeed();
    const interval = setInterval(refreshStorefrontFeed, 20000);
    return () => clearInterval(interval);
  }, [refreshStorefrontFeed]);

  // Manual Sync trigger
  const triggerManualSync = useCallback(async () => {
    setLastSyncedAt(new Date().toLocaleTimeString());
    setPendingSyncCount(0);
    await refreshStorefrontFeed();
  }, [refreshStorefrontFeed]);

  // Module Management
  const toggleModule = useCallback((id: string) => {
    setRegisteredModules((prev) =>
      prev.map((mod) => (mod.id === id ? { ...mod, enabled: !mod.enabled } : mod))
    );
  }, []);

  const registerCustomModule = useCallback((module: Omit<ErpModuleDefinition, 'isCustom'>) => {
    const newMod: ErpModuleDefinition = { ...module, isCustom: true };
    setRegisteredModules((prev) => [...prev, newMod]);
  }, []);

  // Auto Job # Generator
  const generateJobNumber = useCallback((): string => {
    const year = new Date().getFullYear();
    const existingCount = workOrders.length + 101;
    return `IPG-WO-${year}-${String(existingCount).padStart(4, '0')}`;
  }, [workOrders.length]);

  // Auto PO # Generator
  const generatePoNumber = useCallback((): string => {
    const year = new Date().getFullYear();
    const existingCount = purchaseOrders.length + 201;
    return `IPG-PO-${year}-${String(existingCount).padStart(4, '0')}`;
  }, [purchaseOrders.length]);

  // Auto NCR # Generator
  const generateNcrNumber = useCallback((): string => {
    const year = new Date().getFullYear();
    const existingCount = ncrRecords.length + 1;
    return `IPG-NCR-${year}-${String(existingCount).padStart(3, '0')}`;
  }, [ncrRecords.length]);

  // Auto Invoice # Generator
  const generateInvoiceNumber = useCallback((): string => {
    const year = new Date().getFullYear();
    const existingCount = invoices.filter((i) => i.type === 'AR_Invoice').length + 501;
    return `IPG-INV-${year}-${String(existingCount).padStart(4, '0')}`;
  }, [invoices]);

  // WORK ORDER CRUD
  const addWorkOrder = useCallback((order: Partial<ErpWorkOrder>): string => {
    const jobNumber = order.jobNumber || generateJobNumber();
    const newOrder: ErpWorkOrder = {
      jobNumber,
      customerPoNumber: order.customerPoNumber || `PO-${Math.floor(10000 + Math.random() * 90000)}`,
      orderSource: order.orderSource || 'Direct PO',
      createdAt: order.createdAt || new Date().toLocaleString(),
      clientCompanyName: order.clientCompanyName || 'New Industrial Client',
      contactName: order.contactName || 'Procurement Agent',
      contactEmail: order.contactEmail || 'buyer@industrial.com',
      contactPhone: order.contactPhone || '(979) 555-0100',
      jobsiteAddress: order.jobsiteAddress || '100 Industrial Way, Bay City, TX',
      projectName: order.projectName || 'Fabrication Order',
      items: order.items || [],
      subtotal: order.subtotal || 0,
      shippingCost: order.shippingCost || 0,
      taxAmount: order.taxAmount || 0,
      totalAmount: order.totalAmount || (order.subtotal || 0) + (order.shippingCost || 0),
      stage: order.stage || 'Order Received',
      priority: order.priority || 'Standard',
      assignedTechnician: order.assignedTechnician || 'Shop Floor Tech',
      scheduledShipDate: order.scheduledShipDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      carrierName: order.carrierName || 'UPS Ground Freight',
      trackingNumber: order.trackingNumber || '',
      allocatedHeatNumbers: order.allocatedHeatNumbers || [],
      associatedMtrIds: order.associatedMtrIds || [],
      qcInspectionPassed: order.qcInspectionPassed ?? false,
      qcInspectorName: order.qcInspectorName,
      qcSignOffDate: order.qcSignOffDate,
      notes: order.notes || '',
      drawingNumber: order.drawingNumber,
      drawingRev: order.drawingRev,
      googleDriveFolderUrl: order.googleDriveFolderUrl || `https://drive.google.com/drive/folders/${jobNumber.toLowerCase()}`,
      costing: order.costing,
    };

    setWorkOrders((prev) => [newOrder, ...prev]);
    chimeManager.playNewOrderChime();
    return jobNumber;
  }, [generateJobNumber]);

  const updateWorkOrder = useCallback((jobNumber: string, updates: Partial<ErpWorkOrder>) => {
    setWorkOrders((prev) =>
      prev.map((wo) => (wo.jobNumber === jobNumber ? { ...wo, ...updates } : wo))
    );
  }, []);

  const updateWorkOrderStage = useCallback((jobNumber: string, stage: ErpWorkOrderStage) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.jobNumber === jobNumber) {
          return {
            ...wo,
            stage,
            qcInspectionPassed: stage === 'Packaged & Shipped' || stage === 'Invoiced & Completed' ? true : wo.qcInspectionPassed,
          };
        }
        return wo;
      })
    );
  }, []);

  const deleteWorkOrder = useCallback((jobNumber: string) => {
    setWorkOrders((prev) => prev.filter((wo) => wo.jobNumber !== jobNumber));
  }, []);

  const getWorkOrderByJobNumber = useCallback((jobNumber: string) => {
    return workOrders.find((wo) => wo.jobNumber.toLowerCase() === jobNumber.toLowerCase());
  }, [workOrders]);

  // 1-Click Release to Plasma Table Action
  const releaseToPlasmaTable = useCallback((jobNumber: string) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.jobNumber.toLowerCase() === jobNumber.toLowerCase()) {
          return {
            ...wo,
            stage: 'Laser / Plasma Cutting',
            assignedTechnician: 'CNC Plasma Table 1 (Running)',
            priority: wo.priority === 'Standard' ? 'Urgent / Hot Shot' : wo.priority,
            notes: (wo.notes ? wo.notes + ' | ' : '') + `Released to CNC Plasma table at ${new Date().toLocaleTimeString()}`,
          };
        }
        return wo;
      })
    );
    chimeManager.playNewOrderChime();
  }, []);

  // INGEST STOREFRONT CHECKOUT / PO INTO ERP AUTOMATION PIPELINE
  const ingestStorefrontOrder = useCallback(
    (
      orderData: any,
      options?: {
        paymentRef?: string;
        paymentType?: 'credit_card' | 'ach' | 'net30_po';
        paymentStatus?: 'Paid in Full' | 'ACH Clearing' | 'Net 30 Authorized';
        autoReleaseToTable?: boolean;
      }
    ): ErpWorkOrder => {
      const jobNumber = generateJobNumber();
      const clientName = orderData.companyName || orderData.clientCompanyName || 'Industrial Client';
      const poNum = orderData.poNumber || orderData.customerPoNumber || `PO-ONLINE-${Date.now().toString().slice(-5)}`;
      const items = orderData.items || [];
      const subtotal = orderData.subtotal || 0;
      const shippingCost = orderData.shippingCost || 0;
      const hotShotFee = orderData.hotShotFee || 0;
      const totalAmount = orderData.totalAmount || (subtotal + shippingCost + hotShotFee);
      const isHotShot = Boolean(orderData.isHotShot || hotShotFee > 0);

      // Determine Payment Method and Reference
      const payType = options?.paymentType || (orderData.paymentMethod?.toLowerCase().includes('card') ? 'credit_card' : orderData.paymentMethod?.toLowerCase().includes('ach') ? 'ach' : 'net30_po');
      const payStatus = options?.paymentStatus || (payType === 'credit_card' ? 'Paid in Full' : payType === 'ach' ? 'ACH Clearing' : 'Net 30 Authorized');
      const txnRef = options?.paymentRef || `ch_${Math.random().toString(36).substring(2, 11)}`;

      // 1. Auto-Allocate ASME Section VIII Heat Numbers & MTR Compliance
      const allocatedHeats: string[] = [];
      const associatedMtrIds: string[] = [];

      items.forEach((item: any) => {
        const matCode: MaterialCode = item.materialCode || 'SA-516-70';
        const matchingMtr = mtrDatabase.find(
          (m) => m.materialCode === matCode || m.materialGrade?.includes(matCode)
        );
        if (matchingMtr && !allocatedHeats.includes(matchingMtr.heatNumber)) {
          allocatedHeats.push(matchingMtr.heatNumber);
          associatedMtrIds.push(matchingMtr.id);
        } else if (!allocatedHeats.length) {
          const fallbackHeat = matCode === '316L' ? 'NX8842-1' : matCode === '304L' ? 'SS304-4991' : matCode === 'SA-36' ? 'A36-77821' : 'K49201-B';
          allocatedHeats.push(fallbackHeat);
        }
      });

      // 2. Auto-Deduct / Allocate Stock Inventory
      setStockInventory((prevStock) =>
        prevStock.map((stk) => {
          const matchItem = items.find((i: any) => i.materialCode === stk.materialCode);
          if (matchItem) {
            const requiredPlates = Math.max(1, Math.ceil((matchItem.quantity || 1) / 8));
            const nextAlloc = stk.allocatedQuantity + requiredPlates;
            return {
              ...stk,
              allocatedQuantity: nextAlloc,
              availableQuantity: Math.max(0, stk.quantityOnHand - nextAlloc),
              allocatedJobNumbers: stk.allocatedJobNumbers.includes(jobNumber)
                ? stk.allocatedJobNumbers
                : [...stk.allocatedJobNumbers, jobNumber],
            };
          }
          return stk;
        })
      );

      // 3. Auto-Generate Official AR Invoice
      const invoiceNumber = generateInvoiceNumber();
      const newInvoice: ErpInvoice = {
        invoiceNumber,
        type: 'AR_Invoice',
        counterpartyName: clientName,
        linkedJobNumber: jobNumber,
        linkedPoNumber: poNum,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: isHotShot ? new Date().toISOString().split('T')[0] : new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
        subtotal,
        freight: shippingCost + hotShotFee,
        tax: 0,
        totalAmount,
        paidAmount: payStatus === 'Paid in Full' ? totalAmount : payStatus === 'ACH Clearing' ? totalAmount : 0,
        balanceDue: payStatus === 'Paid in Full' || payStatus === 'ACH Clearing' ? 0 : totalAmount,
        paymentTerms: payType === 'credit_card' ? 'Credit Card' : payType === 'ach' ? 'ACH' : 'Net 30',
        paymentStatus: payStatus === 'Paid in Full' ? 'Paid in Full' : payStatus === 'ACH Clearing' ? 'Sent / Pending Payment' : 'Sent / Pending Payment',
        agingBucket: 'Current',
        paymentMethodUsed: payType === 'credit_card' ? `Stripe Card (${txnRef})` : payType === 'ach' ? `Stripe ACH Direct Debit (${txnRef})` : 'Net 30 Commercial PO',
        notes: `Auto-generated from Web Storefront Ingestion. Auth/Ref: ${txnRef}`,
      };

      setInvoices((prev) => [newInvoice, ...prev]);

      // 4. Create and Queue ErpWorkOrder
      const initialStage: ErpWorkOrderStage = options?.autoReleaseToTable || isHotShot ? 'Laser / Plasma Cutting' : 'Order Received';
      const createdWorkOrder: ErpWorkOrder = {
        jobNumber,
        customerPoNumber: poNum,
        orderSource: payType === 'credit_card' ? 'Website B2B' : payType === 'ach' ? 'Website B2B' : 'Direct PO',
        createdAt: new Date().toLocaleString(),
        clientCompanyName: clientName,
        contactName: orderData.contactName || orderData.buyerName || 'Industrial Purchasing',
        contactEmail: orderData.email || orderData.buyerEmail || 'purchasing@industrial.com',
        contactPhone: orderData.phone || '(979) 248-9266',
        jobsiteAddress: orderData.jobsiteAddress || orderData.deliveryAddress || 'Facility Receiving Gate, TX',
        projectName: orderData.projectName || `${items[0]?.nps || '4"'} ASME B16.48 Paddle Blinds`,
        items,
        subtotal,
        shippingCost: shippingCost + hotShotFee,
        taxAmount: 0,
        totalAmount,
        stage: initialStage,
        priority: isHotShot ? 'Urgent / Hot Shot' : 'Standard',
        assignedTechnician: initialStage === 'Laser / Plasma Cutting' ? 'CNC Plasma Table 1 (Running)' : 'Laser / Plasma Shop Queue',
        scheduledShipDate: isHotShot ? `${new Date().toISOString().split('T')[0]} (TODAY RUSH)` : new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        carrierName: isHotShot ? 'Iron Prairie Hot-Shot Dedicated Courier' : totalAmount > 1500 ? 'Southeastern Freight Lines' : 'UPS Ground Priority',
        trackingNumber: isHotShot ? 'HOT-SHOT-DIRECT-TRUCK' : 'PENDING-DISPATCH',
        allocatedHeatNumbers: allocatedHeats,
        associatedMtrIds: associatedMtrIds,
        qcInspectionPassed: false,
        notes: `Storefront Checkout (${payType === 'credit_card' ? 'Stripe Credit Card +3.5%' : payType === 'ach' ? 'Stripe ACH Direct Debit 0% Surcharge' : 'Net 30 Commercial PO'}) | Ref: ${txnRef}`,
        drawingNumber: `DWG-B1648-${items[0]?.nps?.replace('"', '') || '4'}IN`,
        drawingRev: 'Rev 0',
        googleDriveFolderUrl: `https://drive.google.com/drive/folders/${jobNumber.toLowerCase()}`,
      };

      setWorkOrders((prev) => [createdWorkOrder, ...prev]);
      chimeManager.playNewOrderChime();

      return createdWorkOrder;
    },
    [generateJobNumber, generateInvoiceNumber, mtrDatabase]
  );

  const convertIncompleteCheckout = useCallback((record: StorefrontCheckoutRecord): ErpWorkOrder => {
    const items = (record.cartItems || []).map((item, index) => ({
      id: `${record.orderRefId}-${index}`,
      partNumber: item.partNumber || `PB-${index + 1}`,
      nps: String(item.nps || '4"'),
      nominalSizeInches: Number(String(item.nps || '4').replace(/[^\d.]/g, '')) || 4,
      pressureClass: Number(item.pressureClass) || 150,
      materialCode: (item.material || 'SA-516-70') as MaterialCode,
      materialName: String(item.material || 'SA-516-70'),
      facing: item.facing || 'Flat Face (FF) - Standard (No Machining)',
      thickness: Number(item.thickness) || 0.375,
      thicknessLabel: String(item.thickness || '3/8"'),
      od: 0,
      boltCircle: 0,
      boltSize: 0,
      actualWeightLbs: 0,
      adjustedWeightLbs: 0,
      unitPrice: Number(item.unitPrice) || 0,
      quantity: Number(item.quantity) || 1,
      handleStamp: '',
      requireMTR: true,
      addTHadle: true,
      addLockoutHole: false,
      addLiftingLug: false,
      addPlateDog: false,
      addWedge: false,
    }));

    const created = ingestStorefrontOrder(
      {
        companyName: record.companyName || 'Web Checkout (Incomplete)',
        contactName: record.buyerName,
        email: record.buyerEmail,
        phone: record.buyerPhone,
        jobsiteAddress: record.deliveryAddress,
        poNumber: record.orderRefId,
        items,
        subtotal: record.itemsSubtotal || record.totalAmount,
        shippingCost: record.shippingCost || 0,
        hotShotFee: record.hotShotFee || 0,
        totalAmount: record.totalAmount,
        projectName: `Follow-up: incomplete web checkout ${record.orderRefId}`,
      },
      {
        paymentType: 'net30_po',
        paymentStatus: 'Net 30 Authorized',
        paymentRef: `INCOMPLETE-${record.orderRefId}`,
      }
    );

    setDismissedCheckoutIds((prev) => (
      prev.includes(record.orderRefId) ? prev : [record.orderRefId, ...prev]
    ));
    return created;
  }, [ingestStorefrontOrder]);

  const dismissIncompleteCheckout = useCallback((orderRefId: string) => {
    setDismissedCheckoutIds((prev) => (
      prev.includes(orderRefId) ? prev : [orderRefId, ...prev]
    ));
  }, []);

  // Financial Telemetry Metrics Computed Live
  const financialMetrics = useMemo<ErpFinancialMetrics>(() => {
    let totalGrossRevenue = 0;
    let creditCardVolume = 0;
    let achVolume = 0;
    let poVolume = 0;
    let totalCreditCardSurcharges = 0;
    let totalAchFeeSavings = 0;
    let totalPaidCount = 0;
    let totalClearingCount = 0;

    workOrders.forEach((wo) => {
      totalGrossRevenue += wo.totalAmount;
      const notes = (wo.notes || '').toLowerCase();
      const source = (wo.orderSource || '').toLowerCase();

      if (notes.includes('card') || notes.includes('credit card')) {
        creditCardVolume += wo.totalAmount;
        totalCreditCardSurcharges += wo.totalAmount * 0.035;
        totalPaidCount++;
      } else if (notes.includes('ach') || notes.includes('bluevine') || notes.includes('bank debit')) {
        achVolume += wo.totalAmount;
        totalAchFeeSavings += wo.totalAmount * 0.035;
        totalClearingCount++;
      } else {
        poVolume += wo.totalAmount;
      }
    });

    const totalCalculated = creditCardVolume + achVolume + poVolume || 1;
    const creditCardPct = Math.round((creditCardVolume / totalCalculated) * 100);
    const achPct = Math.round((achVolume / totalCalculated) * 100);
    const poPct = Math.round((poVolume / totalCalculated) * 100);

    const stripeInFlightBalance = Math.round(achVolume * 0.45 + creditCardVolume * 0.2);
    const bluevineSweptTotal = Math.round(totalGrossRevenue - stripeInFlightBalance);

    return {
      totalGrossRevenue: Math.round(totalGrossRevenue * 100) / 100,
      creditCardVolume: Math.round(creditCardVolume * 100) / 100,
      achVolume: Math.round(achVolume * 100) / 100,
      poVolume: Math.round(poVolume * 100) / 100,
      creditCardPct,
      achPct,
      poPct,
      totalAchFeeSavings: Math.round(totalAchFeeSavings * 100) / 100,
      totalCreditCardSurcharges: Math.round(totalCreditCardSurcharges * 100) / 100,
      stripeInFlightBalance,
      bluevineSweptTotal,
      totalPaidCount,
      totalClearingCount,
    };
  }, [workOrders]);

  // MTR VAULT CRUD
  const addMtr = useCallback((mtr: MaterialTestReport) => {
    setMtrDatabase((prev) => [mtr, ...prev]);
  }, []);

  const updateMtr = useCallback((id: string, updates: Partial<MaterialTestReport>) => {
    setMtrDatabase((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  }, []);

  const deleteMtr = useCallback((id: string) => {
    setMtrDatabase((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const getMtrByHeatNumber = useCallback((heatNumber: string) => {
    return mtrDatabase.find(
      (m) => m.heatNumber.toLowerCase().trim() === heatNumber.toLowerCase().trim()
    );
  }, [mtrDatabase]);

  // STOCK INVENTORY CRUD
  const addStockItem = useCallback((item: Omit<StockMaterialItem, 'id'>) => {
    const newItem: StockMaterialItem = {
      ...item,
      id: `STK-${Date.now()}`,
      allocatedQuantity: item.allocatedQuantity || 0,
      availableQuantity: item.quantityOnHand - (item.allocatedQuantity || 0),
    };
    setStockInventory((prev) => [newItem, ...prev]);
  }, []);

  const updateStockItem = useCallback((id: string, updates: Partial<StockMaterialItem>) => {
    setStockInventory((prev) =>
      prev.map((stk) => {
        if (stk.id === id) {
          const merged = { ...stk, ...updates };
          merged.availableQuantity = merged.quantityOnHand - merged.allocatedQuantity;
          return merged;
        }
        return stk;
      })
    );
  }, []);

  const deleteStockItem = useCallback((id: string) => {
    setStockInventory((prev) => prev.filter((stk) => stk.id !== id));
  }, []);

  const allocateStockToJob = useCallback((stockId: string, jobNumber: string, qty: number) => {
    setStockInventory((prev) =>
      prev.map((stk) => {
        if (stk.id === stockId) {
          const nextAllocated = stk.allocatedQuantity + qty;
          const nextJobNumbers = stk.allocatedJobNumbers.includes(jobNumber)
            ? stk.allocatedJobNumbers
            : [...stk.allocatedJobNumbers, jobNumber];
          return {
            ...stk,
            allocatedQuantity: nextAllocated,
            availableQuantity: Math.max(0, stk.quantityOnHand - nextAllocated),
            allocatedJobNumbers: nextJobNumbers,
          };
        }
        return stk;
      })
    );

    // Also link Heat number to the Work Order
    const item = stockInventory.find((s) => s.id === stockId);
    if (item && item.heatNumber) {
      setWorkOrders((prev) =>
        prev.map((wo) => {
          if (wo.jobNumber === jobNumber && !wo.allocatedHeatNumbers.includes(item.heatNumber)) {
            return {
              ...wo,
              allocatedHeatNumbers: [...wo.allocatedHeatNumbers, item.heatNumber],
              associatedMtrIds: item.linkedMtrId
                ? [...wo.associatedMtrIds, item.linkedMtrId]
                : wo.associatedMtrIds,
            };
          }
          return wo;
        })
      );
    }
  }, [stockInventory]);

  // SUPPLIERS & PO CRUD
  const addSupplier = useCallback((supplier: SupplierProfile) => {
    setSuppliers((prev) => [...prev, supplier]);
  }, []);

  const updateSupplier = useCallback((id: string, updates: Partial<SupplierProfile>) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }, []);

  const addPurchaseOrder = useCallback((po: Partial<ErpPurchaseOrder>): string => {
    const poNumber = po.poNumber || generatePoNumber();
    const newPo: ErpPurchaseOrder = {
      poNumber,
      supplierId: po.supplierId || 'SUPP-TRIPLE-S',
      supplierName: po.supplierName || 'Triple-S Steel Houston',
      category: po.category || 'Raw Steel Plate',
      orderDate: po.orderDate || new Date().toISOString().split('T')[0],
      requestedDeliveryDate: po.requestedDeliveryDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      paymentTerms: po.paymentTerms || 'Net 30',
      items: po.items || [],
      subtotal: po.subtotal || 0,
      taxAmount: po.taxAmount || 0,
      freightAmount: po.freightAmount || 0,
      totalAmount: po.totalAmount || (po.subtotal || 0) + (po.freightAmount || 0),
      status: po.status || 'Draft',
      deliveryStatus: po.deliveryStatus || 'Pending',
      carrierTracking: po.carrierTracking || '',
      destination: po.destination || 'IPG Shop Floor (Bay City Hub - 200 County Rd 170)',
      specialInstructions: po.specialInstructions || 'Include 2 copies of ASME Section VIII MTRs.',
      approvedBy: po.approvedBy || 'Michael Huerta (Managing Principal)',
      googleDrivePoUrl: po.googleDrivePoUrl || `https://drive.google.com/drive/folders/${poNumber.toLowerCase()}`,
    };

    setPurchaseOrders((prev) => [newPo, ...prev]);
    return poNumber;
  }, [generatePoNumber]);

  const updatePurchaseOrderStatus = useCallback(
    (poNumber: string, status: ErpPurchaseOrder['status']) => {
      setPurchaseOrders((prev) =>
        prev.map((po) => {
          if (po.poNumber === poNumber) {
            return {
              ...po,
              status,
              deliveryStatus: status === 'Received & Fulfilled' ? 'Received On Floor' : po.deliveryStatus,
            };
          }
          return po;
        })
      );
    },
    []
  );

  const receivePurchaseOrderItems = useCallback(
    (poNumber: string, receivedMap: Record<string, number>) => {
      setPurchaseOrders((prev) =>
        prev.map((po) => {
          if (po.poNumber === poNumber) {
            const updatedItems = po.items.map((item) => {
              const addQty = receivedMap[item.id] || 0;
              return {
                ...item,
                receivedQuantity: item.receivedQuantity + addQty,
              };
            });
            const allReceived = updatedItems.every((item) => item.receivedQuantity >= item.quantity);
            return {
              ...po,
              items: updatedItems,
              status: allReceived ? 'Received & Fulfilled' : 'Partially Received',
              deliveryStatus: allReceived ? 'Received On Floor' : 'Pending',
            };
          }
          return po;
        })
      );
    },
    []
  );

  // NCR QUALITY CRUD
  const addNcrRecord = useCallback((ncr: Partial<NcrRecord>): string => {
    const ncrNumber = ncr.ncrNumber || generateNcrNumber();
    const newNcr: NcrRecord = {
      ncrNumber,
      dateLogged: ncr.dateLogged || new Date().toISOString().split('T')[0],
      linkedJobNumber: ncr.linkedJobNumber,
      partNumber: ncr.partNumber || '',
      heatNumber: ncr.heatNumber || '',
      source: ncr.source || 'Internal Laser Cutting',
      defectCategory: ncr.defectCategory || 'Dimensional Out of Tolerance',
      severity: ncr.severity || 'Minor (Reworkable)',
      defectDescription: ncr.defectDescription || '',
      rootCauseAnalysis: ncr.rootCauseAnalysis || '',
      disposition: ncr.disposition || 'Rework to Spec',
      correctiveAction: ncr.correctiveAction || '',
      preventiveAction: ncr.preventiveAction || '',
      assignedPerson: ncr.assignedPerson || 'Lead QA Inspector',
      targetClosureDate: ncr.targetClosureDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      qaManagerSignOff: ncr.qaManagerSignOff ?? false,
      qaManagerName: ncr.qaManagerName,
      closureDate: ncr.closureDate,
      status: ncr.status || 'Open',
      photoUrls: ncr.photoUrls || [],
    };

    setNcrRecords((prev) => [newNcr, ...prev]);
    return ncrNumber;
  }, [generateNcrNumber]);

  const updateNcrRecord = useCallback((ncrNumber: string, updates: Partial<NcrRecord>) => {
    setNcrRecords((prev) =>
      prev.map((ncr) => (ncr.ncrNumber === ncrNumber ? { ...ncr, ...updates } : ncr))
    );
  }, []);

  const signOffNcr = useCallback((ncrNumber: string, managerName: string) => {
    setNcrRecords((prev) =>
      prev.map((ncr) =>
        ncr.ncrNumber === ncrNumber
          ? {
              ...ncr,
              qaManagerSignOff: true,
              qaManagerName: managerName,
              closureDate: new Date().toISOString().split('T')[0],
              status: 'Closed',
            }
          : ncr
      )
    );
  }, []);

  // INVOICES (AP / AR) CRUD
  const addInvoice = useCallback((invoice: ErpInvoice) => {
    setInvoices((prev) => [invoice, ...prev]);
  }, []);

  const recordInvoicePayment = useCallback(
    (invoiceNumber: string, amount: number, method: string) => {
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.invoiceNumber === invoiceNumber) {
            const nextPaid = inv.paidAmount + amount;
            const nextBalance = Math.max(0, inv.totalAmount - nextPaid);
            const isFull = nextBalance <= 0;
            return {
              ...inv,
              paidAmount: nextPaid,
              balanceDue: nextBalance,
              paymentStatus: isFull ? 'Paid in Full' : 'Partially Paid',
              paymentMethodUsed: method,
            };
          }
          return inv;
        })
      );
    },
    []
  );

  // DOCUMENT CONTROL CRUD
  const addDocControlItem = useCallback((item: Omit<DocControlItem, 'id'>) => {
    const newDoc: DocControlItem = {
      ...item,
      id: `DOC-${Date.now()}`,
    };
    setDocControlItems((prev) => [newDoc, ...prev]);
  }, []);

  const updateDocControlItem = useCallback((id: string, updates: Partial<DocControlItem>) => {
    setDocControlItems((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc))
    );
  }, []);

  // CLIENTS CRUD
  const addClient = useCallback((client: ClientAccount) => {
    setClients((prev) => [...prev, client]);
  }, []);

  // SALES EMAIL TRIGGER & AUTOMATED INTAKE
  const simulateSalesEmailTrigger = useCallback(
    (customData?: Partial<SalesEmailTrigger>): SalesEmailTrigger => {
      const client = SEED_ERP_CLIENTS[Math.floor(Math.random() * SEED_ERP_CLIENTS.length)];
      const npsChoices = ['2"', '3"', '4"', '6"', '8"', '10"', '12"'];
      const pClasses: (150 | 300 | 600)[] = [150, 300, 600];
      const matCodes: MaterialCode[] = ['SA-516-70', '304L', '316L'];

      const chosenNps = npsChoices[Math.floor(Math.random() * npsChoices.length)];
      const chosenClass = pClasses[Math.floor(Math.random() * pClasses.length)];
      const chosenMat = matCodes[Math.floor(Math.random() * matCodes.length)];
      const qty = Math.floor(Math.random() * 15) + 4;
      const unitPrice = chosenMat === '316L' ? 185 : chosenMat === '304L' ? 140 : 75;
      const totalAmount = unitPrice * qty + 95;
      const isHotShot = Math.random() > 0.6;
      const poNum = `PO-${client.companyName.split(' ')[0].toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

      const newTrigger: SalesEmailTrigger = {
        id: `EMAIL-TRIG-${Date.now()}`,
        timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        senderEmail: 'sales@ironprairiefabrication.com',
        senderName: 'IPG Automated Sales Intake Service',
        subject: `🚨 ${isHotShot ? '[OUTAGE HOT-SHOT] ' : ''}NEW INBOUND PO: ${client.companyName} (${poNum})`,
        companyName: client.companyName,
        contactName: client.buyerName,
        contactEmail: client.email,
        contactPhone: '(979) 248-9266',
        jobsiteAddress: client.facilityLocation,
        poNumber: poNum,
        projectName: `${chosenMat} Refinery Isolation Spools`,
        requestedDeliveryDate: new Date(Date.now() + 86400000 * (isHotShot ? 1 : 3)).toISOString().split('T')[0],
        isHotShot,
        rawBody: `From: sales@ironprairiefabrication.com\nTo: operations@ironprairiefabrication.com\nSubject: Inbound Order Placed\n\nClient: ${client.companyName}\nBuyer: ${client.buyerName}\nEmail: ${client.email}\nPO: ${poNum}\nItems: ${qty}x ${chosenNps} ${chosenClass}# ${chosenMat} Paddle Blinds\nUrgency: ${isHotShot ? 'EMERGENCY HOT-SHOT' : 'Standard Turnaround'}\nShip To: ${client.facilityLocation}`,
        items: [
          {
            partDescription: `${chosenNps} ${chosenClass}# ${chosenMat} ASME B16.48 Paddle Blind`,
            materialGrade: chosenMat,
            nps: chosenNps,
            pressureClass: chosenClass,
            thicknessLabel: chosenClass === 150 ? '11 Gauge (0.120")' : '1/2" (0.500")',
            quantity: qty,
            unitPrice,
          }
        ],
        totalAmount,
        status: 'New / Unprocessed',
        ...customData,
      };

      setSalesEmailTriggers((prev) => [newTrigger, ...prev]);
      chimeManager.playNewOrderChime();

      // Automatically convert trigger to active Work Order and Job #
      const jobNumber = generateJobNumber();
      const newWorkOrder: ErpWorkOrder = {
        jobNumber,
        customerPoNumber: newTrigger.poNumber,
        orderSource: 'Sales Email Trigger',
        createdAt: newTrigger.timestamp,
        clientCompanyName: newTrigger.companyName,
        contactName: newTrigger.contactName,
        contactEmail: newTrigger.contactEmail,
        contactPhone: newTrigger.contactPhone,
        jobsiteAddress: newTrigger.jobsiteAddress,
        projectName: newTrigger.projectName,
        items: newTrigger.items.map((it, idx) => ({
          id: `ITEM-${Date.now()}-${idx}`,
          partNumber: `PB${it.materialGrade.replace('-', '')}-C${it.pressureClass}S${it.nps.replace('"', '')}`,
          nps: it.nps,
          nominalSizeInches: parseInt(it.nps) || 4,
          pressureClass: it.pressureClass as any,
          materialCode: it.materialGrade,
          materialName: it.materialGrade,
          facing: 'Flat Face (FF) - Standard (No Machining)',
          thickness: it.pressureClass === 150 ? 0.1196 : 0.500,
          thicknessLabel: it.thicknessLabel,
          od: (parseInt(it.nps) || 4) * 1.75,
          boltCircle: (parseInt(it.nps) || 4) * 1.85,
          boltSize: 0.75,
          actualWeightLbs: (parseInt(it.nps) || 4) * 2.8,
          adjustedWeightLbs: (parseInt(it.nps) || 4) * 3.5,
          unitPrice: it.unitPrice,
          quantity: it.quantity,
          handleStamp: `ISO-${newTrigger.companyName.split(' ')[0].toUpperCase()}-${it.nps}`,
          requireMTR: true,
          addTHadle: true,
          addLockoutHole: false,
          addLiftingLug: it.quantity > 5,
          addPlateDog: false,
          addWedge: false,
          blindType: 'Paddle Blind',
        })),
        subtotal: newTrigger.totalAmount - (newTrigger.isHotShot ? 150 : 85),
        shippingCost: newTrigger.isHotShot ? 150 : 85,
        taxAmount: 0,
        totalAmount: newTrigger.totalAmount,
        stage: newTrigger.isHotShot ? 'Laser / Plasma Cutting' : 'Order Received',
        priority: newTrigger.isHotShot ? 'Urgent / Hot Shot' : 'Standard',
        assignedTechnician: newTrigger.isHotShot ? 'CNC Plasma Table 1 (Running)' : 'Laser / Plasma Queue',
        scheduledShipDate: newTrigger.requestedDeliveryDate,
        carrierName: newTrigger.isHotShot ? 'IPG Emergency Hot-Shot Courier' : 'UPS Freight Priority',
        trackingNumber: '',
        allocatedHeatNumbers: [chosenMat === '316L' ? 'NX8842-1' : chosenMat === '304L' ? 'SS304-4991' : 'K49201-B'],
        associatedMtrIds: ['MTR-A516-70-K49201'],
        qcInspectionPassed: false,
        notes: `Auto-ingested from Sales Email trigger (${newTrigger.subject})`,
        drawingNumber: `DWG-AUTO-${Math.floor(100 + Math.random() * 900)}`,
        drawingRev: 'Rev 0',
        googleDriveFolderUrl: `https://drive.google.com/drive/folders/${jobNumber.toLowerCase()}`,
      };

      setWorkOrders((prev) => [newWorkOrder, ...prev]);

      // Update trigger status
      newTrigger.status = 'Processed / Job Created';
      newTrigger.generatedJobNumber = jobNumber;

      return newTrigger;
    },
    [generateJobNumber]
  );

  const processSalesEmailTrigger = useCallback((triggerId: string): string => {
    const trigger = salesEmailTriggers.find((t) => t.id === triggerId);
    if (!trigger) return '';

    const jobNumber = trigger.generatedJobNumber || generateJobNumber();
    setSalesEmailTriggers((prev) =>
      prev.map((t) =>
        t.id === triggerId
          ? { ...t, status: 'Processed / Job Created', generatedJobNumber: jobNumber }
          : t
      )
    );
    return jobNumber;
  }, [generateJobNumber, salesEmailTriggers]);

  // LOCAL-FIRST BACKUP SNAPSHOT & DISASTER RECOVERY
  const exportBackupSnapshot = useCallback(() => {
    const snapshot: ErpBackupSnapshot = {
      version: '2.0-IPG-HYBRID',
      timestamp: new Date().toISOString(),
      shopLocation: 'Iron Prairie Group - Bay City, TX (200 County Rd 170)',
      workOrders,
      mtrDatabase,
      stockInventory,
      purchaseOrders,
      ncrRecords,
      invoices,
      docControlItems,
      suppliers,
      clients,
      salesEmailTriggers,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snapshot, null, 2));
    const downloadAnchor = document.createElement('a');
    const filename = `IPG_ERP_DISASTER_BACKUP_${new Date().toISOString().split('T')[0]}_${Date.now()}.json`;
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [
    workOrders,
    mtrDatabase,
    stockInventory,
    purchaseOrders,
    ncrRecords,
    invoices,
    docControlItems,
    suppliers,
    clients,
    salesEmailTriggers,
  ]);

  const importBackupSnapshot = useCallback((fileContent: string): boolean => {
    try {
      const snapshot: ErpBackupSnapshot = JSON.parse(fileContent);
      if (snapshot.workOrders) setWorkOrders(snapshot.workOrders);
      if (snapshot.mtrDatabase) setMtrDatabase(snapshot.mtrDatabase);
      if (snapshot.stockInventory) setStockInventory(snapshot.stockInventory);
      if (snapshot.purchaseOrders) setPurchaseOrders(snapshot.purchaseOrders);
      if (snapshot.ncrRecords) setNcrRecords(snapshot.ncrRecords);
      if (snapshot.invoices) setInvoices(snapshot.invoices);
      if (snapshot.docControlItems) setDocControlItems(snapshot.docControlItems);
      if (snapshot.suppliers) setSuppliers(snapshot.suppliers);
      if (snapshot.clients) setClients(snapshot.clients);
      if (snapshot.salesEmailTriggers) setSalesEmailTriggers(snapshot.salesEmailTriggers);
      return true;
    } catch (err) {
      console.error('Failed to import ERP snapshot', err);
      return false;
    }
  }, []);

  const resetToDefaultSeedData = useCallback(() => {
    if (window.confirm('Are you sure you want to reset the ERP database to default industrial seed records?')) {
      setWorkOrders(SEED_WORK_ORDERS);
      setMtrDatabase(INITIAL_MTR_DATABASE);
      setStockInventory(SEED_STOCK_INVENTORY);
      setSuppliers(SEED_ERP_SUPPLIERS);
      setPurchaseOrders(SEED_PURCHASE_ORDERS);
      setNcrRecords(SEED_NCR_RECORDS);
      setInvoices(SEED_ERP_INVOICES);
      setDocControlItems(SEED_DOC_CONTROL_ITEMS);
      setClients(SEED_ERP_CLIENTS);
      setSalesEmailTriggers(SEED_SALES_EMAIL_TRIGGERS);
      setRegisteredModules(DEFAULT_ERP_MODULES);
    }
  }, []);

  const value = useMemo<ErpContextType>(
    () => ({
      activeModuleId,
      setActiveModuleId,
      registeredModules,
      toggleModule,
      registerCustomModule,

      isOnline,
      lastSyncedAt,
      pendingSyncCount,
      triggerManualSync,

      searchQuery,
      setSearchQuery,

      workOrders,
      addWorkOrder,
      updateWorkOrder,
      updateWorkOrderStage,
      deleteWorkOrder,
      getWorkOrderByJobNumber,
      releaseToPlasmaTable,

      ingestStorefrontOrder,
      recentStorefrontOrders,
      incompleteCheckouts,
      completedCheckouts,
      storefrontFeedError,
      storefrontFeedAuthRequired,
      refreshStorefrontFeed,
      convertIncompleteCheckout,
      dismissIncompleteCheckout,
      dismissedCheckoutIds,
      financialMetrics,

      mtrDatabase,
      addMtr,
      updateMtr,
      deleteMtr,
      getMtrByHeatNumber,

      stockInventory,
      addStockItem,
      updateStockItem,
      deleteStockItem,
      allocateStockToJob,

      suppliers,
      addSupplier,
      updateSupplier,
      purchaseOrders,
      addPurchaseOrder,
      updatePurchaseOrderStatus,
      receivePurchaseOrderItems,

      ncrRecords,
      addNcrRecord,
      updateNcrRecord,
      signOffNcr,

      invoices,
      addInvoice,
      recordInvoicePayment,

      docControlItems,
      addDocControlItem,
      updateDocControlItem,

      clients,
      addClient,

      salesEmailTriggers,
      simulateSalesEmailTrigger,
      processSalesEmailTrigger,

      exportBackupSnapshot,
      importBackupSnapshot,
      resetToDefaultSeedData,
    }),
    [
      activeModuleId,
      registeredModules,
      toggleModule,
      registerCustomModule,
      isOnline,
      lastSyncedAt,
      pendingSyncCount,
      triggerManualSync,
      searchQuery,
      workOrders,
      addWorkOrder,
      updateWorkOrder,
      updateWorkOrderStage,
      deleteWorkOrder,
      getWorkOrderByJobNumber,
      releaseToPlasmaTable,
      ingestStorefrontOrder,
      recentStorefrontOrders,
      incompleteCheckouts,
      completedCheckouts,
      storefrontFeedError,
      storefrontFeedAuthRequired,
      refreshStorefrontFeed,
      convertIncompleteCheckout,
      dismissIncompleteCheckout,
      dismissedCheckoutIds,
      financialMetrics,
      mtrDatabase,
      addMtr,
      updateMtr,
      deleteMtr,
      getMtrByHeatNumber,
      stockInventory,
      addStockItem,
      updateStockItem,
      deleteStockItem,
      allocateStockToJob,
      suppliers,
      addSupplier,
      updateSupplier,
      purchaseOrders,
      addPurchaseOrder,
      updatePurchaseOrderStatus,
      receivePurchaseOrderItems,
      ncrRecords,
      addNcrRecord,
      updateNcrRecord,
      signOffNcr,
      invoices,
      addInvoice,
      recordInvoicePayment,
      docControlItems,
      addDocControlItem,
      updateDocControlItem,
      clients,
      addClient,
      salesEmailTriggers,
      simulateSalesEmailTrigger,
      processSalesEmailTrigger,
      exportBackupSnapshot,
      importBackupSnapshot,
      resetToDefaultSeedData,
    ]
  );

  return <ErpContext.Provider value={value}>{children}</ErpContext.Provider>;
};

export const useErp = (): ErpContextType => {
  const context = useContext(ErpContext);
  if (!context) {
    throw new Error('useErp must be used within an ErpProvider');
  }
  return context;
};

