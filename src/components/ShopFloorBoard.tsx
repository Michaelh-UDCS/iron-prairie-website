import React, { useState, useMemo } from 'react';
import { ShopJob, KanbanStage, ConfiguredBlind } from '../types';
import { JobPacketModal } from './JobPacketModal';
import {
  Flame,
  Wrench,
  CheckSquare,
  Truck,
  CheckCircle2,
  Calendar,
  Search,
  Plus,
  ShieldCheck,
  FileText,
  Clock,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Layers,
  AlertCircle,
  Hash,
  Filter
} from 'lucide-react';
import { calculateBlindConfig } from '../data/paddleBlindData';

interface ShopFloorBoardProps {
  jobs: ShopJob[];
  setJobs: React.Dispatch<React.SetStateAction<ShopJob[]>>;
  onOpenStorefront: () => void;
}

const STAGES: { key: KanbanStage; label: string; icon: React.ReactNode; color: string; badgeBg: string }[] = [
  {
    key: 'queued',
    label: '1. Queued to Burn',
    icon: <Clock className="h-4 w-4" />,
    color: 'border-amber-500/50 bg-amber-500/5',
    badgeBg: 'bg-amber-500 text-slate-950'
  },
  {
    key: 'laser',
    label: '2. At Laser Table',
    icon: <Flame className="h-4 w-4 text-amber-400 animate-pulse" />,
    color: 'border-orange-500/50 bg-orange-500/5',
    badgeBg: 'bg-orange-500 text-slate-950'
  },
  {
    key: 'deburred',
    label: '3. Deburred & Stamped',
    icon: <Wrench className="h-4 w-4 text-sky-400" />,
    color: 'border-sky-500/50 bg-sky-500/5',
    badgeBg: 'bg-sky-500 text-slate-950'
  },
  {
    key: 'ready',
    label: '4. Ready to Ship',
    icon: <Truck className="h-4 w-4 text-indigo-400" />,
    color: 'border-indigo-500/50 bg-indigo-500/5',
    badgeBg: 'bg-indigo-500 text-white'
  },
  {
    key: 'shipped',
    label: '5. Shipped / Complete',
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
    color: 'border-emerald-500/50 bg-emerald-500/5',
    badgeBg: 'bg-emerald-500 text-slate-950'
  }
];

export const ShopFloorBoard: React.FC<ShopFloorBoardProps> = ({ jobs, setJobs, onOpenStorefront }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMtrOnly, setFilterMtrOnly] = useState(false);
  const [selectedJobForPacket, setSelectedJobForPacket] = useState<ShopJob | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  // New quick manual order form state
  const [manualCustomer, setManualCustomer] = useState('');
  const [manualPo, setManualPo] = useState(`PO-MANUAL-${Math.floor(1000 + Math.random() * 9000)}`);
  const [manualSize, setManualSize] = useState('4"');
  const [manualClass, setManualClass] = useState('150#');
  const [manualMat, setManualMat] = useState<'A516' | '304L' | '316L' | '6061'>('A516');
  const [manualQty, setManualQty] = useState(2);
  const [manualMtr, setManualMtr] = useState(true);

  // Metric Computations
  const metrics = useMemo(() => {
    const activeJobs = jobs.filter((j) => j.status !== 'shipped');
    const totalValue = jobs.reduce((sum, j) => sum + j.totalAmount, 0);
    const queuedCount = jobs.filter((j) => j.status === 'queued').reduce((sum, j) => sum + j.items.reduce((s, i) => s + i.quantity, 0), 0);
    const mtrPacketsNeeded = activeJobs.filter((j) => j.mtrRequired).length;
    const scheduledTodayOrTomm = jobs.filter((j) => j.status === 'ready').length;

    return {
      activeJobsCount: activeJobs.length,
      totalShopValue: totalValue,
      blindsQueued: queuedCount,
      mtrPacketsNeeded,
      scheduledShipments: scheduledTodayOrTomm
    };
  }, [jobs]);

  // Stage progression logic
  const advanceJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id !== jobId) return job;
        switch (job.status) {
          case 'queued':
            return { ...job, status: 'laser' };
          case 'laser':
            return { ...job, status: 'deburred' };
          case 'deburred':
            return { ...job, status: 'ready' };
          case 'ready':
            return { ...job, status: 'shipped', carrierTracking: job.carrierTracking || '1Z-IPF-DISPATCH-' + Date.now().toString().slice(-6) };
          default:
            return job;
        }
      })
    );
  };

  const regressedJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id !== jobId) return job;
        switch (job.status) {
          case 'laser':
            return { ...job, status: 'queued' };
          case 'deburred':
            return { ...job, status: 'laser' };
          case 'ready':
            return { ...job, status: 'deburred' };
          case 'shipped':
            return { ...job, status: 'ready' };
          default:
            return job;
        }
      })
    );
  };

  // Inline Mill Heat Number updater
  const updateHeatNumber = (jobId: string, heatNumber: string) => {
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id !== jobId) return job;
        return {
          ...job,
          millHeatNumber: heatNumber,
          heatCertNumber: heatNumber ? `MTR-${heatNumber}` : undefined
        };
      })
    );
  };

  // Inline Scheduled Ship Date updater
  const updateShipDate = (jobId: string, newDate: string) => {
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id !== jobId) return job;
        return { ...job, scheduledShipDate: newDate };
      })
    );
  };

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.millHeatNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.items.some((i) => i.sku.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesMtr = !filterMtrOnly || job.mtrRequired;
      return matchesSearch && matchesMtr;
    });
  }, [jobs, searchTerm, filterMtrOnly]);

  // Create quick manual shop order
  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCustomer.trim()) {
      alert('Please enter customer name');
      return;
    }

    const config: ConfiguredBlind = calculateBlindConfig({
      nps: manualSize as any,
      pressureClass: manualClass as any,
      material: manualMat,
      facing: 'RF',
      handleStamping: `${manualCustomer.toUpperCase().slice(0, 4)}-ISO-${manualSize.replace('"', '')}`,
      includeMTR: manualMtr,
      addOns: { tHandle: false, liftingLug: false, plateDogs: false, fitUpWedges: false },
      quantity: manualQty
    });

    const newJob: ShopJob = {
      id: `manual-job-${Date.now()}`,
      poNumber: manualPo.trim(),
      customerName: manualCustomer.trim(),
      deliveryAddress: 'Direct Facility / Shop Will Call',
      orderDate: new Date().toISOString().split('T')[0],
      scheduledShipDate: new Date().toISOString().split('T')[0],
      status: 'queued',
      items: [config],
      millHeatNumber: 'A516-HEAT-' + Math.floor(1000 + Math.random() * 9000),
      carrier: 'UPS Ground',
      totalWeightLbs: config.totalFinishedWeight,
      totalAmount: config.lineTotal + 15.0,
      mtrRequired: manualMtr,
      notes: 'Quick walk-in / phone order entered by Shop Foreman'
    };

    setJobs((prev) => [newJob, ...prev]);
    setIsNewOrderModalOpen(false);
    setManualCustomer('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Shop Floor Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h1 className="text-2xl font-black text-slate-100 font-display tracking-tight flex items-center gap-3">
              Shop Floor Digital Whiteboard
              <span className="rounded-lg bg-amber-500/20 px-2.5 py-1 text-xs font-mono font-bold text-amber-400 border border-amber-500/30">
                Russell / Shop Foreman View
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time visual CNC laser schedule, heat number traceability, and 1-click printable job packets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-md active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>+ Quick Shop Work Order</span>
          </button>

          <button
            onClick={onOpenStorefront}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all"
          >
            <Layers className="h-4 w-4 text-amber-400" />
            <span>Open B2B Configurator</span>
          </button>
        </div>
      </div>

      {/* QUICK FOREMAN METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Active Jobs in Shop</span>
            <Layers className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-black text-slate-100">
            {metrics.activeJobsCount}
          </div>
          <div className="mt-0.5 text-[10px] text-slate-400">Excludes completed shipments</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Shop Value</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-black text-emerald-400">
            ${metrics.totalShopValue.toFixed(0)}
          </div>
          <div className="mt-0.5 text-[10px] text-slate-400">Active WIP + Dispatched</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Blinds Queued for Laser</span>
            <Flame className="h-4 w-4 text-orange-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-black text-orange-400">
            {metrics.blindsQueued} <span className="text-xs font-sans font-normal text-slate-400">units</span>
          </div>
          <div className="mt-0.5 text-[10px] text-slate-400">Awaiting nest &amp; burn</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>MTRs Needed Today</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-black text-emerald-300">
            {metrics.mtrPacketsNeeded}
          </div>
          <div className="mt-0.5 text-[10px] text-slate-400">Heat Certs to attach</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Ready for Carrier</span>
            <Truck className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2 font-mono text-2xl font-black text-sky-400">
            {metrics.scheduledShipments}
          </div>
          <div className="mt-0.5 text-[10px] text-slate-400">Staged on loading dock</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-md">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by PO #, Customer, Heat #, or SKU..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
            <input
              type="checkbox"
              checked={filterMtrOnly}
              onChange={(e) => setFilterMtrOnly(e.target.checked)}
              className="h-3.5 w-3.5 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-900 border-slate-700"
            />
            <span className="text-emerald-400 font-semibold">MTR Required Only</span>
          </label>
          <span className="text-xs font-mono text-slate-400">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </span>
        </div>
      </div>

      {/* VISUAL 5-COLUMN KANBAN WHITEBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STAGES.map((stage) => {
          const stageJobs = filteredJobs.filter((j) => j.status === stage.key);

          return (
            <div
              key={stage.key}
              className={`flex flex-col rounded-2xl border ${stage.color} p-3.5 shadow-xl min-h-[620px] transition-all`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                <div className="flex items-center gap-2">
                  <div className="text-slate-200">{stage.icon}</div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
                    {stage.label}
                  </h3>
                </div>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-black font-mono ${stage.badgeBg}`}>
                  {stageJobs.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-3.5 overflow-y-auto">
                {stageJobs.length === 0 ? (
                  <div className="h-32 flex items-center justify-center rounded-xl border border-dashed border-slate-800 text-xs text-slate-600 font-mono">
                    Empty Queue
                  </div>
                ) : (
                  stageJobs.map((job) => {
                    const primaryItem = job.items[0];
                    const totalBlindsCount = job.items.reduce((s, i) => s + i.quantity, 0);

                    return (
                      <div
                        key={job.id}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 shadow-lg hover:border-slate-700 transition-all group"
                      >
                        {/* Card Header: PO & Customer */}
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              {job.poNumber}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              ${job.totalAmount.toFixed(0)}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-slate-100 mt-1 leading-tight">
                            {job.customerName}
                          </h4>
                        </div>

                        {/* Big Item Badge */}
                        <div className="rounded-lg bg-slate-900 p-2 border border-slate-800/80">
                          <div className="text-xs font-mono font-bold text-slate-200">
                            {totalBlindsCount}x &bull; {primaryItem ? `${primaryItem.nps} ${primaryItem.pressureClass} ${primaryItem.material} ${primaryItem.facing}` : 'Paddle Blind'}
                          </div>
                          {job.items.length > 1 && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              + {job.items.length - 1} more line items
                            </div>
                          )}
                          {primaryItem?.handleStamping && (
                            <div className="mt-1 text-[11px] font-mono text-amber-300 truncate">
                              Tag: {primaryItem.handleStamping}
                            </div>
                          )}
                        </div>

                        {/* Weight & Shipping Tag */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                          <span className="rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-slate-300">
                            {job.totalWeightLbs} lbs
                          </span>
                          <span className={`rounded px-2 py-0.5 font-bold ${job.carrier === 'LTL Freight' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'}`}>
                            {job.carrier}
                          </span>
                        </div>

                        {/* MTR Compliance Pill */}
                        <div>
                          {job.mtrRequired ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                              <ShieldCheck className="h-3 w-3" />
                              MTR REQUIRED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                              NO MTR NEEDED
                            </span>
                          )}
                        </div>

                        {/* Single-Field Mill Heat # Box */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                            Mill Heat # (Stamped):
                          </label>
                          <div className="relative">
                            <Hash className="absolute left-2 top-2 h-3.5 w-3.5 text-slate-500" />
                            <input
                              type="text"
                              value={job.millHeatNumber}
                              onChange={(e) => updateHeatNumber(job.id, e.target.value)}
                              placeholder="e.g. K49201-B"
                              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-1.5 pl-7 pr-2 font-mono text-xs font-bold text-emerald-400 placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Scheduled Ship Date Picker */}
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <label className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-slate-500" />
                            <span>Ship:</span>
                          </label>
                          <input
                            type="date"
                            value={job.scheduledShipDate}
                            onChange={(e) => updateShipDate(job.id, e.target.value)}
                            className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 font-mono text-[11px] text-slate-200 focus:border-amber-500 focus:outline-none"
                          />
                        </div>

                        {/* Action Buttons: View Job Packet & 1-Click Progression */}
                        <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                          {/* View Job Packet Trigger */}
                          <button
                            type="button"
                            onClick={() => setSelectedJobForPacket(job)}
                            className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                          >
                            <FileText className="h-3.5 w-3.5 text-amber-400" />
                            <span>View Job Packet</span>
                          </button>

                          {/* Progression Button */}
                          <div className="flex items-center gap-1">
                            {stage.key !== 'queued' && (
                              <button
                                type="button"
                                onClick={() => regressedJob(job.id)}
                                title="Move back one stage"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
                              >
                                <ArrowLeft className="h-3.5 w-3.5" />
                              </button>
                            )}

                            {stage.key === 'queued' && (
                              <button
                                type="button"
                                onClick={() => advanceJob(job.id)}
                                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow active:scale-95"
                              >
                                <span>Send to Laser</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            )}

                            {stage.key === 'laser' && (
                              <button
                                type="button"
                                onClick={() => advanceJob(job.id)}
                                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-orange-500 py-2 text-xs font-bold text-slate-950 hover:bg-orange-400 transition-all shadow active:scale-95"
                              >
                                <span>Mark Cut &amp; Stamped</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            )}

                            {stage.key === 'deburred' && (
                              <button
                                type="button"
                                onClick={() => advanceJob(job.id)}
                                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-sky-500 py-2 text-xs font-bold text-slate-950 hover:bg-sky-400 transition-all shadow active:scale-95"
                              >
                                <span>Stage for Packing</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            )}

                            {stage.key === 'ready' && (
                              <button
                                type="button"
                                onClick={() => advanceJob(job.id)}
                                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow active:scale-95"
                              >
                                <span>Mark Shipped ({job.carrier.split(' ')[0]})</span>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              </button>
                            )}

                            {stage.key === 'shipped' && (
                              <div className="flex-1 text-center py-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                ✓ Dispatched / Closed
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* PRINTABLE JOB PACKET MODAL */}
      <JobPacketModal
        job={selectedJobForPacket}
        isOpen={!!selectedJobForPacket}
        onClose={() => setSelectedJobForPacket(null)}
      />

      {/* QUICK MANUAL ORDER MODAL */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative flex w-full max-w-lg flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Plus className="h-4 w-4 text-amber-400" />
                Quick Shop Work Order Entry
              </h3>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Customer / Facility Name</label>
                <input
                  type="text"
                  required
                  value={manualCustomer}
                  onChange={(e) => setManualCustomer(e.target.value)}
                  placeholder="e.g. Freeport LNG or LyondellBasell"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">PO # Reference</label>
                  <input
                    type="text"
                    required
                    value={manualPo}
                    onChange={(e) => setManualPo(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-amber-300 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Quantity (Units)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={manualQty}
                    onChange={(e) => setManualQty(parseInt(e.target.value) || 1)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">NPS Size</label>
                  <select
                    value={manualSize}
                    onChange={(e) => setManualSize(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-slate-200 focus:border-amber-500 focus:outline-none"
                  >
                    {['1/2"', '3/4"', '1"', '2"', '3"', '4"', '6"', '8"', '10"', '12"', '14"', '16"', '18"', '20"', '24"'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Class</label>
                  <select
                    value={manualClass}
                    onChange={(e) => setManualClass(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-slate-200 focus:border-amber-500 focus:outline-none"
                  >
                    {['150#', '300#', '600#', '900#', '1500#'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Material</label>
                  <select
                    value={manualMat}
                    onChange={(e) => setManualMat(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-slate-200 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="A516">A516 Gr. 70</option>
                    <option value="304L">304L SS</option>
                    <option value="316L">316L SS</option>
                    <option value="6061">6061-T6 Alum</option>
                  </select>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={manualMtr}
                    onChange={(e) => setManualMtr(e.target.checked)}
                    className="h-4 w-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-950 border-slate-700"
                  />
                  <span className="text-emerald-400 font-bold">Include Certified MTR Traceability Packet</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-5 py-2 font-bold text-slate-950 hover:bg-amber-400 transition-all shadow"
                >
                  Create &amp; Queue to Burn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
