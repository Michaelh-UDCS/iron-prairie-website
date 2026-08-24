// src/operations/OperationsApp.tsx
// Main Desktop Operations Workspace Shell for Iron Prairie Fabrication Group LLC

import React, { useState, useEffect } from 'react';
import { CustomerOrder, AbandonedCartRecord, PricingConfig, MaterialTestReport } from '../types';
import { DEFAULT_PRICING_CONFIG } from '../data/masterGeometry';
import { INDUSTRIAL_TEST_CLIENTS, pickRandom, randomInt } from '../data/testClientsData';
import { triggerOrderEmailNotification, getEmailDispatchLogs, EmailNotificationRecord } from '../services/emailService';
import { chimeManager } from './services/AudioChimeManager';

import { LaserCuttingKanban } from './components/LaserCuttingKanban';
import { AsmeMtrVault } from './components/AsmeMtrVault';
import { SupplierPoGenerator } from './components/SupplierPoGenerator';
import { JobCostingTracker } from './components/JobCostingTracker';
import { AbandonedCartRecovery } from './components/AbandonedCartRecovery';
import { AsmeQcTravelerModal } from './components/AsmeQcTravelerModal';
import { QuickbooksExportModal } from './components/QuickbooksExportModal';
import brandLogo from '../../Logo.jpg';

import {
  ShieldCheck,
  Flame,
  FolderOpen,
  Truck,
  DollarSign,
  ShoppingCart,
  Mail,
  Volume2,
  VolumeX,
  FileSpreadsheet,
  Settings,
  Sparkles,
  Layers,
  Printer,
  LogOut,
  Building
} from 'lucide-react';

interface OperationsAppProps {
  orders: CustomerOrder[];
  setOrders: React.Dispatch<React.SetStateAction<CustomerOrder[]>>;
  abandonedCarts: AbandonedCartRecord[];
  setAbandonedCarts: React.Dispatch<React.SetStateAction<AbandonedCartRecord[]>>;
  pricingConfig: PricingConfig;
  setPricingConfig: React.Dispatch<React.SetStateAction<PricingConfig>>;
}

export const OperationsApp: React.FC<OperationsAppProps> = ({
  orders,
  setOrders,
  abandonedCarts,
  setAbandonedCarts,
  pricingConfig,
  setPricingConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'kanban' | 'mtr_vault' | 'supplier_pos' | 'job_costing' | 'abandoned' | 'emails'>('kanban');
  const [audioEnabled, setAudioEnabled] = useState(chimeManager.isEnabled());
  const [selectedTravelerOrder, setSelectedTravelerOrder] = useState<CustomerOrder | null>(null);
  const [isQbModalOpen, setIsQbModalOpen] = useState(false);
  const [emailLogs, setEmailLogs] = useState<EmailNotificationRecord[]>(getEmailDispatchLogs());

  const handleToggleAudio = () => {
    const next = !audioEnabled;
    chimeManager.setEnabled(next);
    setAudioEnabled(next);
    if (next) chimeManager.playNewOrderChime();
  };

  // 1-Click Simulator Generator for Demo & Stress Testing
  const handleSimulateRandomOrder = () => {
    const client = pickRandom(INDUSTRIAL_TEST_CLIENTS);
    const npsOptions = ['2"', '3"', '4"', '6"', '8"', '10"', '12"'];
    const pClassOptions: (150 | 300 | 600)[] = [150, 300, 600];
    const matOptions: ('SA-516-70' | '304L' | '316L')[] = ['SA-516-70', '304L', '316L'];

    const chosenNps = pickRandom(npsOptions);
    const chosenClass = pickRandom(pClassOptions);
    const chosenMat = pickRandom(matOptions);
    const qty = randomInt(4, 35);

    const newSimulatedOrder: CustomerOrder = {
      orderId: `PO-SIM-${Math.floor(1000 + Math.random() * 9000)}`,
      orderSource: 'Website B2B',
      createdAt: new Date().toLocaleString(),
      companyName: client.company,
      contactName: client.buyer,
      email: client.email,
      jobsiteAddress: client.jobsiteAddress,
      poNumber: `${client.poPrefix}-${Math.floor(10000 + Math.random() * 90000)}`,
      items: [
        {
          id: `ITEM-${Date.now()}`,
          partNumber: `PB${chosenMat.replace('-', '')}-C${chosenClass}T0105S${chosenNps.replace('"', '')}`,
          nps: chosenNps,
          nominalSizeInches: 4,
          pressureClass: chosenClass,
          materialCode: chosenMat,
          materialName: chosenMat,
          facing: 'Flat Face (FF) - Standard (No Machining)',
          thickness: 0.1046,
          thicknessLabel: '12 Gauge (0.105")',
          od: 6.75,
          boltCircle: 7.5,
          boltSize: 0.625,
          actualWeightLbs: 5.2,
          adjustedWeightLbs: 7.3,
          unitPrice: chosenMat === '316L' ? 145 : 68,
          quantity: qty,
          handleStamp: `ISO-${client.company.split(' ')[0].toUpperCase()}-01`,
          requireMTR: true,
          addTHadle: qty > 10,
          addLiftingLug: false,
          addPlateDog: false,
          addWedge: false,
        }
      ],
      subtotal: (chosenMat === '316L' ? 145 : 68) * qty,
      shippingCost: qty > 15 ? 245.0 : 45.0,
      hotShotFee: 0,
      totalAmount: (chosenMat === '316L' ? 145 : 68) * qty + (qty > 15 ? 245.0 : 45.0),
      totalWeightLbs: Math.round(5.2 * qty),
      shippingMethod: qty > 15 ? 'LTL Palletized Freight' : 'UPS Ground Parcel',
      isHotShot: false,
      isLargeOrder: qty > 20,
      leadTimeEstimate: '2-3 Business Days',
      paymentMethod: 'Net 30 Commercial PO',
      paymentStatus: 'Net 30 Authorized',
      status: 'queued',
      millHeatNumber: 'K49201-B',
      scheduledShipDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      carrierName: 'UPS Ground Express',
      trackingNumber: '',
    };

    setOrders([newSimulatedOrder, ...orders]);
    chimeManager.playNewOrderChime();
    triggerOrderEmailNotification(newSimulatedOrder);
    setEmailLogs(getEmailDispatchLogs());
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono">
      
      {/* Top Operations Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-7xl mx-auto">
          
          <div className="flex items-center gap-3">
            <img
              src={brandLogo}
              alt="Iron Prairie Fabrication Group LLC"
              className="h-10 w-auto rounded-lg border border-slate-700 bg-white p-0.5 object-contain"
            />
            <div>
              <div className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                IRON PRAIRIE FABRICATION GROUP LLC
              </div>
              <div className="text-sm font-black text-slate-100">
                Desktop Operations &amp; ASME Section VIII Div 1 Platform
              </div>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleToggleAudio}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                audioEnabled
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-800 bg-slate-950 text-slate-500'
              }`}
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              <span>{audioEnabled ? 'Audio Chimes ON' : 'Muted'}</span>
            </button>

            <button
              onClick={() => setIsQbModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              <span>QuickBooks Export</span>
            </button>

            <button
              onClick={handleSimulateRandomOrder}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>+ Simulate Outage PO</span>
            </button>
          </div>

        </div>

        {/* Sub-Navigation Tabs */}
        <div className="max-w-7xl mx-auto pt-3 flex flex-wrap gap-2 border-t border-slate-800/80 mt-3">
          {[
            { key: 'kanban', label: '1. Production Kanban', icon: Flame },
            { key: 'mtr_vault', label: '2. ASME MTR Vault', icon: ShieldCheck },
            { key: 'supplier_pos', label: '3. Supplier Steel & Gas POs', icon: Truck },
            { key: 'job_costing', label: '4. Job Costing & Margins', icon: DollarSign },
            { key: 'abandoned', label: '5. Abandoned Cart Recovery', icon: ShoppingCart },
            { key: 'emails', label: '6. Email Notification Logs', icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Workspace Stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        {activeTab === 'kanban' && (
          <LaserCuttingKanban
            orders={orders}
            setOrders={setOrders}
            onOpenTraveler={(order) => setSelectedTravelerOrder(order)}
            onPreviewMtr={() => setActiveTab('mtr_vault')}
          />
        )}

        {activeTab === 'mtr_vault' && <AsmeMtrVault />}

        {activeTab === 'supplier_pos' && <SupplierPoGenerator />}

        {activeTab === 'job_costing' && (
          <JobCostingTracker orders={orders} pricingConfig={pricingConfig} />
        )}

        {activeTab === 'abandoned' && (
          <AbandonedCartRecovery
            abandonedCarts={abandonedCarts}
            setAbandonedCarts={setAbandonedCarts}
            orders={orders}
            setOrders={setOrders}
          />
        )}

        {activeTab === 'emails' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase text-slate-300">Order Dispatch Email Logs</h2>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 divide-y divide-slate-800 text-xs">
              {emailLogs.map((log, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-amber-400">{log.subject}</div>
                    <div className="text-[11px] text-slate-400">To: {log.recipients.map(r => r.email).join(', ')} &bull; {log.timestamp}</div>
                  </div>
                  <span className="text-emerald-400 font-bold">Dispatched</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Printable ASME QC Traveler Modal */}
      <AsmeQcTravelerModal
        order={selectedTravelerOrder}
        isOpen={Boolean(selectedTravelerOrder)}
        onClose={() => setSelectedTravelerOrder(null)}
      />

      {/* QuickBooks Integration Modal */}
      <QuickbooksExportModal
        orders={orders}
        isOpen={isQbModalOpen}
        onClose={() => setIsQbModalOpen(false)}
      />

    </div>
  );
};
