// src/operations/components/LaserCuttingKanban.tsx
// 5-Stage Shop Floor Kanban with ASME UG-77 Heat Assignment & QC Traveler

import React, { useState, useMemo } from 'react';
import { CustomerOrder, MaterialTestReport } from '../../types';
import { HeatMatcherPanel } from './HeatMatcherPanel';
import { chimeManager } from '../services/AudioChimeManager';
import {
  Clock,
  Flame,
  Wrench,
  Truck,
  CheckCircle2,
  FileText,
  Search,
  Zap,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  Edit2,
  Check
} from 'lucide-react';

interface LaserCuttingKanbanProps {
  orders: CustomerOrder[];
  setOrders: React.Dispatch<React.SetStateAction<CustomerOrder[]>>;
  onOpenTraveler: (order: CustomerOrder) => void;
  onPreviewMtr: (mtr: MaterialTestReport) => void;
}

export const LaserCuttingKanban: React.FC<LaserCuttingKanbanProps> = ({
  orders,
  setOrders,
  onOpenTraveler,
  onPreviewMtr,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingHeatOrderId, setEditingHeatOrderId] = useState<string | null>(null);
  const [heatInputValue, setHeatInputValue] = useState('');

  // 5 Kanban Columns
  const stages: {
    key: CustomerOrder['status'];
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    borderAccent: string;
    headerBg: string;
  }[] = [
    {
      key: 'queued',
      title: '1. Queued to Burn',
      icon: Clock,
      accentColor: 'text-amber-400',
      borderAccent: 'border-amber-500/40',
      headerBg: 'bg-amber-950/20',
    },
    {
      key: 'laser_cutting',
      title: '2. At Laser Table',
      icon: Flame,
      accentColor: 'text-orange-400',
      borderAccent: 'border-orange-500/40',
      headerBg: 'bg-orange-950/20',
    },
    {
      key: 'deburred_stamped',
      title: '3. Deburred & Stamped',
      icon: Wrench,
      accentColor: 'text-sky-400',
      borderAccent: 'border-sky-500/40',
      headerBg: 'bg-sky-950/20',
    },
    {
      key: 'ready_to_ship',
      title: '4. Ready to Ship',
      icon: Truck,
      accentColor: 'text-indigo-400',
      borderAccent: 'border-indigo-500/40',
      headerBg: 'bg-indigo-950/20',
    },
    {
      key: 'shipped',
      title: '5. Shipped / Complete',
      icon: CheckCircle2,
      accentColor: 'text-emerald-400',
      borderAccent: 'border-emerald-500/40',
      headerBg: 'bg-emerald-950/20',
    },
  ];

  // Stage Advancement Handler
  const advanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.orderId !== orderId) return order;

        if (order.status === 'queued') {
          return { ...order, status: 'laser_cutting' };
        }
        if (order.status === 'laser_cutting') {
          return { ...order, status: 'deburred_stamped' };
        }
        if (order.status === 'deburred_stamped') {
          return { ...order, status: 'ready_to_ship' };
        }
        if (order.status === 'ready_to_ship') {
          chimeManager.playOrderShippedDing();
          return {
            ...order,
            status: 'shipped',
            carrierName: order.shippingMethod.includes('LTL') ? 'R+L Carriers (Freeport Dock)' : 'UPS Freight Express',
            trackingNumber: `1Z-IPF-${Math.floor(100000000 + Math.random() * 900000000)}`,
          };
        }
        return order;
      })
    );
  };

  // Assign Heat Handler
  const handleAssignHeat = (orderId: string, heatNumber: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, millHeatNumber: heatNumber } : o))
    );
    setEditingHeatOrderId(null);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchQuery.toLowerCase();
      return (
        o.poNumber.toLowerCase().includes(q) ||
        o.companyName.toLowerCase().includes(q) ||
        o.orderId.toLowerCase().includes(q) ||
        (o.millHeatNumber && o.millHeatNumber.toLowerCase().includes(q))
      );
    });
  }, [orders, searchQuery]);

  return (
    <div className="space-y-4 font-mono text-xs">
      
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search PO #, Client, Mill Heat, Order ID..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-10 pr-4 text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="text-slate-400 text-[11px] hidden sm:block">
          Active WIP Orders: <strong className="text-amber-400">{orders.filter(o => o.status !== 'shipped').length}</strong> &bull; Completed: <strong className="text-emerald-400">{orders.filter(o => o.status === 'shipped').length}</strong>
        </div>
      </div>

      {/* 5-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-start">
        {stages.map((stage) => {
          const colOrders = filteredOrders.filter((o) => o.status === stage.key);
          const Icon = stage.icon;

          return (
            <div
              key={stage.key}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden min-h-[550px]"
            >
              {/* Column Header */}
              <div className={`p-3.5 border-b border-slate-800 flex items-center justify-between ${stage.headerBg}`}>
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${stage.accentColor}`} />
                  <span className="font-bold text-slate-100 text-xs tracking-tight font-sans">
                    {stage.title}
                  </span>
                </div>
                <span className="h-5 w-5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] font-black text-slate-300">
                  {colOrders.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="p-2.5 space-y-3 overflow-y-auto max-h-[700px]">
                {colOrders.length === 0 ? (
                  <div className="p-8 text-center text-[11px] text-slate-600 font-sans">
                    No orders staged
                  </div>
                ) : (
                  colOrders.map((order) => {
                    const primary = order.items[0];
                    const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);

                    return (
                      <div
                        key={order.orderId}
                        className={`rounded-xl border bg-slate-950 p-3.5 space-y-2.5 shadow-md transition-all hover:border-slate-700 ${stage.borderAccent}`}
                      >
                        {/* Card Top: PO # & Badges */}
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="text-xs font-bold text-amber-400 block">{order.poNumber}</span>
                            <span className="text-[11px] font-bold text-slate-200 truncate block max-w-[160px] font-sans">
                              {order.companyName}
                            </span>
                          </div>

                          {order.isHotShot && (
                            <span className="rounded bg-rose-500/20 text-rose-400 text-[9px] font-black px-1.5 py-0.5 border border-rose-500/40 animate-pulse">
                              HOT SHOT
                            </span>
                          )}
                        </div>

                        {/* Items Summary */}
                        <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] space-y-1">
                          <div className="text-slate-300 font-bold">
                            {totalQty}x Blinds &bull; {primary ? `${primary.nps} ${primary.pressureClass}# ${primary.materialCode}` : ''}
                          </div>
                          <div className="text-slate-500 text-[10px]">
                            Ship Date: <strong className="text-slate-300">{order.scheduledShipDate}</strong> &bull; {order.totalWeightLbs} lbs
                          </div>
                        </div>

                        {/* Mill Heat Number Tag / Inline Editor */}
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-500 uppercase font-bold">Mill Heat #:</span>
                            {editingHeatOrderId !== order.orderId && (
                              <button
                                onClick={() => {
                                  setEditingHeatOrderId(order.orderId);
                                  setHeatInputValue(order.millHeatNumber || '');
                                }}
                                className="text-slate-500 hover:text-amber-400"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>

                          {editingHeatOrderId === order.orderId ? (
                            <div className="flex gap-1">
                              <input
                                type="text"
                                value={heatInputValue}
                                onChange={(e) => setHeatInputValue(e.target.value.toUpperCase())}
                                className="w-full bg-slate-900 border border-amber-500 px-2 py-0.5 rounded text-[11px] text-amber-300 font-bold focus:outline-none"
                              />
                              <button
                                onClick={() => handleAssignHeat(order.orderId, heatInputValue)}
                                className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-bold hover:bg-amber-400"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                              <span className="font-black text-amber-300 text-[11px]">
                                {order.millHeatNumber || 'PENDING ASSIGN'}
                              </span>
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                            </div>
                          )}
                        </div>

                        {/* Auto-Matcher Panel when at Laser Table stage */}
                        {stage.key === 'laser_cutting' && !order.millHeatNumber && (
                          <HeatMatcherPanel
                            order={order}
                            onAssignHeat={(heat) => handleAssignHeat(order.orderId, heat)}
                            onPreviewMtr={onPreviewMtr}
                          />
                        )}

                        {/* Tracking Number if Shipped */}
                        {stage.key === 'shipped' && order.trackingNumber && (
                          <div className="bg-emerald-950/20 border border-emerald-500/30 p-2 rounded-lg text-[10px] space-y-0.5">
                            <div className="text-slate-400">{order.carrierName}</div>
                            <div className="text-emerald-400 font-bold truncate">{order.trackingNumber}</div>
                          </div>
                        )}

                        {/* Actions Row */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                          <button
                            onClick={() => onOpenTraveler(order)}
                            title="Print ASME Job Traveler & UG-77 Log"
                            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-amber-400 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg transition-colors"
                          >
                            <FileText className="h-3 w-3" />
                            <span>Traveler</span>
                          </button>

                          {stage.key !== 'shipped' && (
                            <button
                              onClick={() => advanceOrderStatus(order.orderId)}
                              className="flex items-center gap-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] px-2.5 py-1 transition-all shadow active:scale-95 ml-auto"
                            >
                              <span>Advance</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}
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

    </div>
  );
};
