// src/operations/components/QuickbooksExportModal.tsx
// 1-Click QuickBooks Online & Desktop Accounting CSV / IIF Exporter

import React, { useState } from 'react';
import { CustomerOrder } from '../../types';
import { X, Download, FileSpreadsheet, CheckCircle2, Copy } from 'lucide-react';

interface QuickbooksExportModalProps {
  orders: CustomerOrder[];
  isOpen: boolean;
  onClose: () => void;
}

export const QuickbooksExportModal: React.FC<QuickbooksExportModalProps> = ({ orders, isOpen, onClose }) => {
  const [exportFormat, setExportFormat] = useState<'qbo_csv' | 'desktop_iif'>('qbo_csv');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate QBO CSV format
  const generateQboCsv = (): string => {
    const headers = [
      'InvoiceNo',
      'Customer',
      'InvoiceDate',
      'DueDate',
      'Terms',
      'Item',
      'ItemDescription',
      'ItemQuantity',
      'ItemRate',
      'ItemAmount',
      'ShippingAmount',
      'Taxable'
    ];

    const rows: string[][] = [];

    orders.forEach((order) => {
      order.items.forEach((item, idx) => {
        rows.push([
          order.poNumber,
          `"${order.companyName.replace(/"/g, '""')}"`,
          order.createdAt.split(' ')[0] || new Date().toISOString().split('T')[0],
          order.scheduledShipDate,
          order.paymentMethod === 'Net 30 Commercial PO' ? 'Net 30' : 'Due on Receipt',
          item.partNumber,
          `"${item.nps} ${item.pressureClass}# ${item.materialCode} (${item.thicknessLabel}) - Tag: ${item.handleStamp || 'N/A'}"`,
          item.quantity.toString(),
          item.unitPrice.toFixed(2),
          (item.unitPrice * item.quantity).toFixed(2),
          idx === 0 ? order.shippingCost.toFixed(2) : '0.00',
          'NON'
        ]);
      });
    });

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  };

  const csvContent = generateQboCsv();

  const handleDownload = () => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Iron_Prairie_QuickBooks_Export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(csvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md font-mono text-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl p-6 space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">
              QuickBooks Accounting Integration Export
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-slate-300">
            Export all <strong>{orders.length} active orders</strong> formatted for QuickBooks Online (QBO) Invoices or QuickBooks Desktop CSV Batch Import.
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setExportFormat('qbo_csv')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                exportFormat === 'qbo_csv' ? 'bg-emerald-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400'
              }`}
            >
              QuickBooks Online (QBO CSV)
            </button>
            <button
              onClick={() => setExportFormat('desktop_iif')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs ${
                exportFormat === 'desktop_iif' ? 'bg-emerald-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400'
              }`}
            >
              QuickBooks Desktop Format
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 max-h-56 overflow-y-auto font-mono text-[11px] text-slate-300 whitespace-pre">
            {csvContent}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 font-bold text-slate-200 hover:bg-slate-700"
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Raw CSV'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-5 py-2 font-bold text-slate-950 hover:bg-emerald-400 shadow active:scale-95"
            >
              <Download className="h-4 w-4" />
              <span>Download QuickBooks CSV</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
