// src/erp/screens/ErpWorkOrdersScreen.tsx
// Work Orders Hub, Job # Generator, Production Kanban, Analytics & Client Order History for IPG

import React, { useState, useMemo } from 'react';
import { useErp } from '../context/ErpContext';
import {
  Flame,
  Plus,
  Search,
  Filter,
  BarChart3,
  Users,
  ShieldCheck,
  Printer,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  DollarSign,
  Layers,
  Copy,
  Trash2,
  Edit,
  SlidersHorizontal
} from 'lucide-react';
import { ErpWorkOrder, ErpWorkOrderStage, MaterialCode } from '../../types';
import { JobPacketModal } from '../components/JobPacketModal';

const WORK_ORDER_STAGES: ErpWorkOrderStage[] = [
  'Order Received',
  'Material Staged & Heat Verified',
  'Laser / Plasma Cutting',
  'Machining & Deburring',
  'QA / QC & MTR Attached',
  'Packaged & Shipped',
  'Invoiced & Completed',
];

export const ErpWorkOrdersScreen: React.FC = () => {
  const {
    workOrders,
    addWorkOrder,
    updateWorkOrderStage,
    deleteWorkOrder,
    mtrDatabase,
    clients,
  } = useErp();

  const [activeTab, setActiveTab] = useState<'kanban' | 'table' | 'analytics' | 'clients'>('kanban');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedOrderForPacket, setSelectedOrderForPacket] = useState<ErpWorkOrder | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Work Order Form State
  const [newClientName, setNewClientName] = useState('ExxonMobil Baytown Complex');
  const [newPoNumber, setNewPoNumber] = useState('PO-2026-8849');
  const [newProjectName, setNewProjectName] = useState('Refinery Outage Spool Blinds');
  const [newPriority, setNewPriority] = useState<ErpWorkOrder['priority']>('Standard');
  const [newNps, setNewNps] = useState('4"');
  const [newClass, setNewClass] = useState<150 | 300 | 600>(150);
  const [newMat, setNewMat] = useState<MaterialCode>('SA-516-70');
  const [newQty, setNewQty] = useState(8);
  const [newUnitPrice, setNewUnitPrice] = useState(75);

  const filteredOrders = useMemo(() => {
    return workOrders.filter((wo) => {
      const q = searchFilter.toLowerCase().trim();
      if (!q) return true;
      return (
        wo.jobNumber.toLowerCase().includes(q) ||
        wo.customerPoNumber.toLowerCase().includes(q) ||
        wo.clientCompanyName.toLowerCase().includes(q) ||
        wo.projectName.toLowerCase().includes(q) ||
        wo.allocatedHeatNumbers.some((h) => h.toLowerCase().includes(q))
      );
    });
  }, [workOrders, searchFilter]);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const subtotal = newUnitPrice * newQty;
    const shipping = 85.0;
    
    addWorkOrder({
      clientCompanyName: newClientName,
      customerPoNumber: newPoNumber,
      projectName: newProjectName,
      priority: newPriority,
      items: [
        {
          id: `ITEM-${Date.now()}`,
          partNumber: `PB${newMat.replace('-', '')}-C${newClass}S${newNps.replace('"', '')}`,
          nps: newNps,
          nominalSizeInches: parseInt(newNps) || 4,
          pressureClass: newClass,
          materialCode: newMat,
          materialName: newMat,
          facing: 'Flat Face (FF) - Standard (No Machining)',
          thickness: newClass === 150 ? 0.1196 : 0.500,
          thicknessLabel: newClass === 150 ? '11 Gauge (0.120")' : '1/2" (0.500")',
          od: 7.5,
          boltCircle: 7.88,
          boltSize: 0.75,
          actualWeightLbs: 6.5,
          adjustedWeightLbs: 8.2,
          unitPrice: newUnitPrice,
          quantity: newQty,
          handleStamp: `ISO-${newClientName.split(' ')[0].toUpperCase()}-${newNps}`,
          requireMTR: true,
          addTHadle: true,
          addLockoutHole: false,
          addLiftingLug: newQty > 5,
          addPlateDog: false,
          addWedge: false,
          blindType: 'Paddle Blind',
        }
      ],
      subtotal,
      shippingCost: shipping,
      totalAmount: subtotal + shipping,
      stage: 'Order Received',
    });

    setIsAddModalOpen(false);
  };

  const handleCloneOrder = (wo: ErpWorkOrder) => {
    addWorkOrder({
      clientCompanyName: wo.clientCompanyName,
      customerPoNumber: `${wo.customerPoNumber}-REPEAT`,
      projectName: `${wo.projectName} (Repeat Job)`,
      items: wo.items,
      subtotal: wo.subtotal,
      shippingCost: wo.shippingCost,
      totalAmount: wo.totalAmount,
      stage: 'Order Received',
      priority: wo.priority,
    });
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px]">
            <Flame className="h-4 w-4" />
            <span>Job # Generator &amp; Production Flow</span>
          </div>
          <h1 className="text-xl font-black text-white">Work Orders &amp; Fabrication Hub</h1>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'kanban' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'table' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              Orders Table ({filteredOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'analytics' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              WO Analytics
            </button>
            <button
              onClick={() => setActiveTab('clients')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'clients' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              Clients CRM
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>New Work Order</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <Search className="h-4 w-4 text-cyan-400 shrink-0" />
        <input
          type="text"
          placeholder="Filter by Job # (IPG-WO-2026-XXXX), PO #, Client Name, Project, or Heat #..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
        />
        {searchFilter && (
          <button
            onClick={() => setSearchFilter('')}
            className="text-slate-400 hover:text-white text-[11px]"
          >
            Clear
          </button>
        )}
      </div>

      {/* TAB 1: KANBAN PRODUCTION STAGE VIEW */}
      {activeTab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
          {WORK_ORDER_STAGES.slice(0, 4).map((stage) => {
            const stageOrders = filteredOrders.filter((wo) => wo.stage === stage);
            return (
              <div key={stage} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-3 flex flex-col">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-slate-200 text-xs">{stage}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-black text-[10px] border border-slate-700">
                    {stageOrders.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px]">
                  {stageOrders.length === 0 ? (
                    <div className="p-6 text-center text-slate-600 text-[11px]">No active jobs in this stage</div>
                  ) : (
                    stageOrders.map((wo) => (
                      <div
                        key={wo.jobNumber}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2 shadow"
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-black text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded text-[10px] border border-cyan-500/30">
                            {wo.jobNumber}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">${wo.totalAmount.toFixed(0)}</span>
                        </div>

                        <div>
                          <div className="font-bold text-slate-100 truncate">{wo.clientCompanyName}</div>
                          <div className="text-[10px] text-slate-400 truncate">PO: {wo.customerPoNumber}</div>
                        </div>

                        <div className="text-[10px] text-slate-300">
                          {wo.items.map((i) => `${i.quantity}x ${i.nps} ${i.materialCode}`).join(', ')}
                        </div>

                        {wo.allocatedHeatNumbers.length > 0 && (
                          <div className="text-[10px] text-sky-400 font-mono">
                            HT: {wo.allocatedHeatNumbers.join(', ')}
                          </div>
                        )}

                        {/* Stage Progression Buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[10px]">
                          <button
                            onClick={() => setSelectedOrderForPacket(wo)}
                            className="text-cyan-400 hover:underline font-bold"
                          >
                            Traveler
                          </button>

                          <select
                            value={wo.stage}
                            onChange={(e) => updateWorkOrderStage(wo.jobNumber, e.target.value as any)}
                            className="bg-slate-900 text-slate-300 border border-slate-800 rounded px-1 py-0.5 text-[10px] focus:outline-none"
                          >
                            {WORK_ORDER_STAGES.map((stg) => (
                              <option key={stg} value={stg}>{stg}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: FULL DATA TABLE VIEW */}
      {activeTab === 'table' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold">
                <th className="p-3">Job #</th>
                <th className="p-3">Client &amp; PO</th>
                <th className="p-3">Project / Items</th>
                <th className="p-3">Target Ship</th>
                <th className="p-3">Heat #s</th>
                <th className="p-3">Stage</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOrders.map((wo) => (
                <tr key={wo.jobNumber} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-black text-cyan-400">{wo.jobNumber}</td>
                  <td className="p-3">
                    <div className="font-bold text-slate-100">{wo.clientCompanyName}</div>
                    <div className="text-[11px] text-slate-400">{wo.customerPoNumber}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-slate-200 truncate max-w-xs">{wo.projectName}</div>
                    <div className="text-[10px] text-slate-400">
                      {wo.items.map((i) => `${i.quantity}x ${i.nps} ${i.materialCode}`).join(', ')}
                    </div>
                  </td>
                  <td className="p-3 font-bold text-slate-300">{wo.scheduledShipDate}</td>
                  <td className="p-3 font-mono text-sky-400">
                    {wo.allocatedHeatNumbers.length > 0 ? wo.allocatedHeatNumbers.join(', ') : 'Pending'}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-300">
                      {wo.stage}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-400">
                    ${wo.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedOrderForPacket(wo)}
                        title="Print ASME QC Traveler"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleCloneOrder(wo)}
                        title="Clone Repeat Order"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: WORK ORDER ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Average Margin %</div>
              <div className="text-2xl font-black text-emerald-400">56.2%</div>
              <div className="text-[10px] text-slate-500">Based on plate, labor, and laser gas costing</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold">On-Time Delivery Rate</div>
              <div className="text-2xl font-black text-cyan-400">98.4%</div>
              <div className="text-[10px] text-slate-500">Bay City daily hot-shot &amp; LTL freight</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Scrap / NCR Rate</div>
              <div className="text-2xl font-black text-sky-400">0.8%</div>
              <div className="text-[10px] text-slate-500">ISO/ASME Section VIII QA metrics</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase">Costing &amp; Profit Breakdown by Work Order</h3>
            <div className="divide-y divide-slate-800">
              {workOrders.filter(w => w.costing).map((wo) => (
                <div key={wo.jobNumber} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-cyan-400">{wo.jobNumber}</span> &bull; {wo.clientCompanyName}
                    <div className="text-[11px] text-slate-400">
                      Rev: ${wo.costing?.invoicedRevenue} &bull; Plate COGS: ${wo.costing?.materialPlateCost} &bull; Labor: ${wo.costing?.machineLaborCost}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400">${wo.costing?.netMarginDollars}</span>
                    <div className="text-[10px] text-slate-400">({wo.costing?.netMarginPct}%)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CLIENT CRM & ORDER HISTORY */}
      {activeTab === 'clients' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clients.map((cli) => {
            const clientOrders = workOrders.filter((w) => w.clientCompanyName === cli.companyName);
            const totalSpend = clientOrders.reduce((sum, w) => sum + w.totalAmount, 0);

            return (
              <div key={cli.companyName} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-white text-sm">{cli.companyName}</div>
                    <div className="text-[11px] text-slate-400">{cli.buyerName} &bull; {cli.email}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-bold text-[10px] border border-slate-700">
                    {clientOrders.length} Orders
                  </span>
                </div>

                <div className="text-[11px] text-slate-300">
                  📍 {cli.facilityLocation}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-[11px]">
                  <span className="text-slate-400">Lifetime Spend: <strong className="text-emerald-400">${totalSpend.toLocaleString()}</strong></span>
                  <span className="text-slate-400">ACH Authorized: <strong className="text-slate-200">{cli.achAuthorized ? 'Yes' : 'No'}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Work Order Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="font-bold text-white text-sm">CREATE NEW WORK ORDER (JOB # AUTO-GENERATED)</div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Client Company</label>
                  <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Customer PO #</label>
                  <input
                    type="text"
                    value={newPoNumber}
                    onChange={(e) => setNewPoNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold">Project Name / Description</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">NPS Size</label>
                  <select
                    value={newNps}
                    onChange={(e) => setNewNps(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none"
                  >
                    {['2"', '3"', '4"', '6"', '8"', '10"', '12"', '16"', '20"', '24"'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Class</label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(parseInt(e.target.value) as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none"
                  >
                    <option value={150}>150#</option>
                    <option value={300}>300#</option>
                    <option value={600}>600#</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Material</label>
                  <select
                    value={newMat}
                    onChange={(e) => setNewMat(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none"
                  >
                    <option value="SA-516-70">SA-516-70 (PVQ)</option>
                    <option value="304L">304L Stainless</option>
                    <option value="316L">316L Stainless</option>
                    <option value="SA-36">SA-36 Carbon</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newQty}
                    onChange={(e) => setNewQty(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Unit Price ($)</label>
                  <input
                    type="number"
                    min="1"
                    value={newUnitPrice}
                    onChange={(e) => setNewUnitPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Urgent / Hot Shot">Urgent / Hot-Shot</option>
                    <option value="Shutdown Outage">Shutdown Outage</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black hover:bg-cyan-400 shadow-md shadow-cyan-500/20"
                >
                  Generate Job # &amp; Create WO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable ASME QC Traveler Modal */}
      <JobPacketModal
        order={selectedOrderForPacket}
        isOpen={Boolean(selectedOrderForPacket)}
        onClose={() => setSelectedOrderForPacket(null)}
      />

    </div>
  );
};
