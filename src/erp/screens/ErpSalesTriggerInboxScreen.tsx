// src/erp/screens/ErpSalesTriggerInboxScreen.tsx
// Sales Email Ingestion & Automated Trigger Processing Hub for IPG

import React, { useState } from 'react';
import { useErp } from '../context/ErpContext';
import {
  Mail,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Flame,
  FileText,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { SalesEmailTrigger } from '../../types';

export const ErpSalesTriggerInboxScreen: React.FC = () => {
  const {
    salesEmailTriggers,
    simulateSalesEmailTrigger,
    processSalesEmailTrigger,
    setActiveModuleId,
  } = useErp();

  const [selectedEmail, setSelectedEmail] = useState<SalesEmailTrigger | null>(salesEmailTriggers[0] || null);

  const handleSimulateNew = () => {
    const created = simulateSalesEmailTrigger();
    setSelectedEmail(created);
  };

  const handleConvertOrder = (id: string) => {
    const jobNumber = processSalesEmailTrigger(id);
    setActiveModuleId('work_orders');
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px]">
            <Mail className="h-4 w-4" />
            <span>Automated Sales Pipeline &bull; sales@iron-prairie.com</span>
          </div>
          <h1 className="text-xl font-black text-white">Sales Email Ingestion &amp; Live Triggers</h1>
        </div>

        <button
          onClick={handleSimulateNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-md shadow-cyan-500/20 transition-all active:scale-95"
        >
          <Sparkles className="h-4 w-4" />
          <span>+ Simulate Inbound Client Email</span>
        </button>
      </div>

      {/* Main Split: Email List & Email Details Parser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: Ingested Email Feed */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase pb-1">
            <span>Inbox Feed ({salesEmailTriggers.length})</span>
            <span className="text-emerald-400">Listening to Webhook</span>
          </div>

          <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
            {salesEmailTriggers.map((trig) => {
              const isSelected = selectedEmail?.id === trig.id;
              return (
                <div
                  key={trig.id}
                  onClick={() => setSelectedEmail(trig)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/80 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-100 text-xs truncate max-w-[200px]">
                      {trig.companyName}
                    </span>
                    <span className="text-[10px] text-slate-500">{trig.timestamp}</span>
                  </div>

                  <div className="text-[11px] text-cyan-400 font-semibold truncate">{trig.subject}</div>

                  <div className="flex items-center justify-between text-[10px] pt-2 border-t border-slate-900">
                    <span className="text-slate-400">PO: {trig.poNumber}</span>
                    {trig.generatedJobNumber ? (
                      <span className="text-emerald-400 font-bold">Job #{trig.generatedJobNumber}</span>
                    ) : (
                      <span className="text-cyan-400 font-bold">Unprocessed</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Email Detail & Auto-Parser Inspector */}
        <div className="lg:col-span-7 space-y-4">
          {selectedEmail ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              
              {/* Email Meta Banner */}
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div>
                  <div className="text-[10px] text-cyan-400 uppercase font-bold">From: {selectedEmail.senderEmail}</div>
                  <h2 className="text-base font-black text-white mt-1">{selectedEmail.subject}</h2>
                  <div className="text-[11px] text-slate-400 mt-1">Received: {selectedEmail.timestamp}</div>
                </div>

                <div className="text-right">
                  {selectedEmail.isHotShot && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                      EMERGENCY HOT-SHOT
                    </span>
                  )}
                  {selectedEmail.generatedJobNumber && (
                    <div className="text-emerald-400 font-black text-sm mt-1">
                      Job #{selectedEmail.generatedJobNumber}
                    </div>
                  )}
                </div>
              </div>

              {/* Parsed Fields Summary */}
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-2">Automated Field Extraction</div>
                <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-500 font-bold">Client:</span> <strong className="text-slate-200">{selectedEmail.companyName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold">Buyer Contact:</span> <strong className="text-slate-200">{selectedEmail.contactName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold">PO Number:</span> <strong className="text-cyan-400">{selectedEmail.poNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold">Ship-To Facility:</span> <strong className="text-slate-200">{selectedEmail.jobsiteAddress}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold">Target Delivery:</span> <strong className="text-emerald-400">{selectedEmail.requestedDeliveryDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold">Total Invoiced:</span> <strong className="text-white">${selectedEmail.totalAmount.toFixed(2)}</strong>
                  </div>
                </div>
              </div>

              {/* Parsed Line Items Table */}
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-2">Parsed Line Items (BOM)</div>
                <table className="w-full text-left border-collapse border border-slate-800 text-[11px]">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold">
                      <th className="p-2">Description</th>
                      <th className="p-2">Material</th>
                      <th className="p-2 text-center">Qty</th>
                      <th className="p-2 text-right">Unit Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {selectedEmail.items.map((it, idx) => (
                      <tr key={idx} className="bg-slate-950/60">
                        <td className="p-2 font-bold text-slate-200">{it.partDescription}</td>
                        <td className="p-2 text-cyan-300 font-bold">{it.materialGrade}</td>
                        <td className="p-2 text-center font-bold text-emerald-400">{it.quantity}</td>
                        <td className="p-2 text-right font-mono text-slate-300">${it.unitPrice.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Raw Ingestion Payload Preview */}
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Raw Email Body Ingestion Payload</div>
                <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[10px] text-slate-400 whitespace-pre-wrap font-mono">
                  {selectedEmail.rawBody}
                </pre>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => handleConvertOrder(selectedEmail.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-cyan-500/20 active:scale-95"
                >
                  <Flame className="h-4 w-4" />
                  <span>View in Work Order &amp; Production Flow &rarr;</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-600 bg-slate-900 border border-slate-800 rounded-2xl">
              <Mail className="h-10 w-10 mx-auto mb-2 opacity-40 text-cyan-400" />
              <p>Select an incoming email trigger on the left to inspect parsed details.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
