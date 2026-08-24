// src/operations/components/JobCostingTracker.tsx
// Real-Time Job Costing, COGS & Gross Margin Profitability Engine

import React, { useMemo } from 'react';
import { CustomerOrder, PricingConfig, JobCosting } from '../../types';
import { DEFAULT_PRICING_CONFIG, MATERIALS, LABOR_HOURS } from '../../data/masterGeometry';
import {
  DollarSign,
  TrendingUp,
  Percent,
  PieChart,
  BarChart3,
  Flame,
  Wrench,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface JobCostingTrackerProps {
  orders: CustomerOrder[];
  pricingConfig: PricingConfig;
}

export const JobCostingTracker: React.FC<JobCostingTrackerProps> = ({ orders, pricingConfig }) => {
  // Compute job costing for every order in the shop pipeline
  const costedOrders = useMemo(() => {
    return orders.map((order) => {
      let totalMaterialCost = 0;
      let totalLaserGasCost = 0;
      let totalMachineLaborCost = 0;

      order.items.forEach((item) => {
        const mat = MATERIALS[item.materialCode] || MATERIALS['SA-516-70'];
        let activePricePerLb = pricingConfig.sa516PricePerLb;
        if (item.materialCode === 'SA-36') activePricePerLb = pricingConfig.sa36PricePerLb;
        else if (item.materialCode === '304') activePricePerLb = pricingConfig.ss304PricePerLb;
        else if (item.materialCode === '304L') activePricePerLb = pricingConfig.ss304LPricePerLb;
        else if (item.materialCode === '316L') activePricePerLb = pricingConfig.ss316LPricePerLb;
        else if (item.materialCode === 'AL-6061') activePricePerLb = pricingConfig.alPricePerLb;

        // Raw material plate cost
        const matCost = item.adjustedWeightLbs * activePricePerLb * item.quantity;
        totalMaterialCost += matCost;

        // Plasma assist gas cost (cut perimeter in inches * gas rate)
        const perimeterInches = Math.PI * item.od + (item.od * 0.25 + 6.0) * 2;
        const gasRate = pricingConfig.laserGasRatePerInch || 0.08;
        const gasCost = perimeterInches * gasRate * item.quantity;
        totalLaserGasCost += gasCost;

        // CNC Plasma & Deburring shop labor
        const laborHrs = (LABOR_HOURS[item.nps] || 0.35) * item.quantity;
        const laborCost = laborHrs * pricingConfig.laborRatePerHour;
        totalMachineLaborCost += laborCost;
      });

      const freightCost = order.shippingCost || 35.0;
      const totalCogs = Math.round((totalMaterialCost + totalLaserGasCost + totalMachineLaborCost + freightCost) * 100) / 100;
      const netMarginDollars = Math.round((order.totalAmount - totalCogs) * 100) / 100;
      const netMarginPct = order.totalAmount > 0 ? Math.round((netMarginDollars / order.totalAmount) * 100) : 0;

      let profitHealth: 'High Margin' | 'Healthy' | 'Low Margin' | 'Loss' = 'Healthy';
      if (netMarginPct >= 45) profitHealth = 'High Margin';
      else if (netMarginPct >= 30) profitHealth = 'Healthy';
      else if (netMarginPct >= 15) profitHealth = 'Low Margin';
      else profitHealth = 'Loss';

      const costing: JobCosting = {
        orderId: order.orderId,
        invoicedRevenue: order.totalAmount,
        materialPlateCost: Math.round(totalMaterialCost * 100) / 100,
        laserAssistGasCost: Math.round(totalLaserGasCost * 100) / 100,
        machineLaborCost: Math.round(totalMachineLaborCost * 100) / 100,
        freightCost: freightCost,
        totalCogs: totalCogs,
        netMarginDollars: netMarginDollars,
        netMarginPct: netMarginPct,
        profitHealth: profitHealth,
      };

      return {
        ...order,
        costing,
      };
    });
  }, [orders, pricingConfig]);

  // Aggregate shop pipeline metrics
  const summary = useMemo(() => {
    const totalRevenue = costedOrders.reduce((s, o) => s + o.costing.invoicedRevenue, 0);
    const totalPlateCost = costedOrders.reduce((s, o) => s + o.costing.materialPlateCost, 0);
    const totalGasCost = costedOrders.reduce((s, o) => s + o.costing.laserAssistGasCost, 0);
    const totalLaborCost = costedOrders.reduce((s, o) => s + o.costing.machineLaborCost, 0);
    const totalFreightCost = costedOrders.reduce((s, o) => s + o.costing.freightCost, 0);
    const totalCogs = costedOrders.reduce((s, o) => s + o.costing.totalCogs, 0);
    const totalGrossProfit = costedOrders.reduce((s, o) => s + o.costing.netMarginDollars, 0);
    const avgMarginPct = totalRevenue > 0 ? Math.round((totalGrossProfit / totalRevenue) * 100) : 0;

    return {
      totalRevenue,
      totalPlateCost,
      totalGasCost,
      totalLaborCost,
      totalFreightCost,
      totalCogs,
      totalGrossProfit,
      avgMarginPct,
    };
  }, [costedOrders]);

  return (
    <div className="space-y-6 pb-20 font-mono text-xs">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <DollarSign className="h-6 w-6 text-emerald-400" />
            <h1 className="text-2xl font-black text-slate-100 tracking-tight font-display font-sans">
              Job Costing, COGS &amp; Gross Margin Engine
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans">
            Real-time margin formula: Net Margin = Invoiced Revenue - (Plate Cost + Plasma Assist Gas + Labor + Freight).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Average Shop Margin</span>
            <span className="text-lg font-black text-emerald-400">
              {summary.avgMarginPct}% Net Margin
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
          <div className="text-slate-400 text-[10px] font-bold uppercase">Total Invoiced Revenue</div>
          <div className="text-xl font-black text-slate-100 mt-1">${summary.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{orders.length} Total Orders</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
          <div className="text-slate-400 text-[10px] font-bold uppercase">Total COGS (Plate + Gas + Labor)</div>
          <div className="text-xl font-black text-rose-400 mt-1">${summary.totalCogs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{((summary.totalCogs / (summary.totalRevenue || 1)) * 100).toFixed(0)}% of Revenue</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
          <div className="text-slate-400 text-[10px] font-bold uppercase">Net Gross Profit</div>
          <div className="text-xl font-black text-emerald-400 mt-1">${summary.totalGrossProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-[10px] text-emerald-500 mt-0.5">{summary.avgMarginPct}% Gross Margin</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg">
          <div className="text-slate-400 text-[10px] font-bold uppercase">Plasma Assist Gas Cost</div>
          <div className="text-xl font-black text-sky-400 mt-1">${summary.totalGasCost.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">LN2 &amp; O2 Assist</div>
        </div>
      </div>

      {/* COGS Breakdown Share Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between text-xs font-bold text-slate-200">
          <span>Cost of Goods Sold (COGS) Expense Share</span>
          <span className="text-slate-400">Total: ${summary.totalCogs.toFixed(2)}</span>
        </div>

        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-amber-500"
            title={`Raw Steel Plate: $${summary.totalPlateCost.toFixed(0)}`}
            style={{ width: `${(summary.totalPlateCost / (summary.totalCogs || 1)) * 100}%` }}
          />
          <div
            className="h-full bg-sky-500"
            title={`Shop Labor: $${summary.totalLaborCost.toFixed(0)}`}
            style={{ width: `${(summary.totalLaborCost / (summary.totalCogs || 1)) * 100}%` }}
          />
          <div
            className="h-full bg-indigo-500"
            title={`Plasma Gas: $${summary.totalGasCost.toFixed(0)}`}
            style={{ width: `${(summary.totalGasCost / (summary.totalCogs || 1)) * 100}%` }}
          />
          <div
            className="h-full bg-emerald-500"
            title={`Freight: $${summary.totalFreightCost.toFixed(0)}`}
            style={{ width: `${(summary.totalFreightCost / (summary.totalCogs || 1)) * 100}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500"></span> Steel Plate (${summary.totalPlateCost.toFixed(0)})</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-500"></span> CNC Shop Labor (${summary.totalLaborCost.toFixed(0)})</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-500"></span> Plasma Assist Gas (${summary.totalGasCost.toFixed(0)})</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Freight Dispatch (${summary.totalFreightCost.toFixed(0)})</span>
        </div>
      </div>

      {/* Itemized Order Margin Table */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-emerald-400" />
          Itemized Job Margin Analysis
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">
          <table className="w-full text-center text-xs">
            <thead className="bg-slate-950 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 text-left">PO # &amp; Customer</th>
                <th className="py-3 px-2">Revenue</th>
                <th className="py-3 px-2">Steel Plate</th>
                <th className="py-3 px-2">Assist Gas</th>
                <th className="py-3 px-2">Labor</th>
                <th className="py-3 px-2">Freight</th>
                <th className="py-3 px-2">Total COGS</th>
                <th className="py-3 px-2">Gross Profit</th>
                <th className="py-3 px-3 text-right">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {costedOrders.map((order) => {
                const c = order.costing;

                return (
                  <tr key={order.orderId} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-3 text-left">
                      <div className="font-bold text-amber-400">{order.poNumber}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{order.companyName}</div>
                    </td>
                    <td className="py-3 px-2 font-bold text-slate-100">${c.invoicedRevenue.toFixed(2)}</td>
                    <td className="py-3 px-2 text-slate-300">${c.materialPlateCost.toFixed(2)}</td>
                    <td className="py-3 px-2 text-slate-400">${c.laserAssistGasCost.toFixed(2)}</td>
                    <td className="py-3 px-2 text-slate-300">${c.machineLaborCost.toFixed(2)}</td>
                    <td className="py-3 px-2 text-slate-400">${c.freightCost.toFixed(2)}</td>
                    <td className="py-3 px-2 font-bold text-rose-400">${c.totalCogs.toFixed(2)}</td>
                    <td className="py-3 px-2 font-black text-emerald-400">${c.netMarginDollars.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-black text-[11px] ${
                          c.netMarginPct >= 45
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : c.netMarginPct >= 30
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        {c.netMarginPct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
