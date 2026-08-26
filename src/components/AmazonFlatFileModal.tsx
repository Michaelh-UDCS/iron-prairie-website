import React, { useState } from 'react';
import { ConfiguredBlind, AmazonFeedRow } from '../types';
import { generateAmazonFlatFileRows, formatFlatFileContent } from '../data/paddleBlindData';
import { X, Copy, Check, Download, FileSpreadsheet, ExternalLink, HelpCircle } from 'lucide-react';

interface AmazonFlatFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ConfiguredBlind[];
}

export const AmazonFlatFileModal: React.FC<AmazonFlatFileModalProps> = ({
  isOpen,
  onClose,
  items
}) => {
  const [format, setFormat] = useState<'tsv' | 'csv'>('tsv');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const rows: AmazonFeedRow[] = generateAmazonFlatFileRows(items);
  const fileContent = formatFlatFileContent(rows, format);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fileContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([fileContent], { type: format === 'tsv' ? 'text/tab-separated-values' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IronPrairie_Amazon_FlatFile_${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative flex max-h-[90vh] w-full max-w-5xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Amazon Flat-File Inventory Feed Generator
                <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-xs font-mono font-medium text-cyan-300">
                  Seller Central Ready
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                1-Click export for Amazon B2B Industrial Flat-File inventory feeds (Parent/Child variation matrix)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/80 px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-300">Format:</span>
            <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => setFormat('tsv')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  format === 'tsv'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                TSV (Amazon Standard)
              </button>
              <button
                onClick={() => setFormat('csv')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  format === 'csv'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                CSV Table
              </button>
            </div>
            <span className="ml-3 text-xs text-slate-400">
              ({rows.length} SKU {rows.length === 1 ? 'record' : 'records'} generated)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all shadow-sm active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-cyan-400" />
                  <span>Copy Feed Data</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
            >
              <Download className="h-4 w-4" />
              <span>Download .{format.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {/* Instructions Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-semibold text-cyan-400 mb-1">
              <HelpCircle className="h-4 w-4" />
              <span>Amazon Seller Central Upload Instructions</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 ml-1">
              <li>Open <strong>Amazon Seller Central</strong> &gt; <strong>Inventory</strong> &gt; <strong>Add Products via Upload</strong>.</li>
              <li>Select <strong>Upload your Inventory File</strong> &gt; File type: <em>Inventory Files for specific categories (Industrial / Pipe Blinds)</em>.</li>
              <li>Upload the downloaded <code className="font-mono text-cyan-300">.TSV</code> flat-file directly. All bullet points, ASME specs, weights, and dimensions are pre-filled.</li>
            </ol>
          </div>

          {/* Table Preview */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400">
                <tr>
                  <th className="px-4 py-2.5">item_sku</th>
                  <th className="px-4 py-2.5">item_name</th>
                  <th className="px-4 py-2.5">standard_price</th>
                  <th className="px-4 py-2.5">qty</th>
                  <th className="px-4 py-2.5">material</th>
                  <th className="px-4 py-2.5">OD</th>
                  <th className="px-4 py-2.5">weight (lbs)</th>
                  <th className="px-4 py-2.5">compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-cyan-400">{row.item_sku}</td>
                    <td className="px-4 py-3 text-slate-300 max-w-xs truncate" title={row.item_name}>
                      {row.item_name}
                    </td>
                    <td className="px-4 py-3 text-emerald-400 font-bold">${row.standard_price.toFixed(2)}</td>
                    <td className="px-4 py-3">{row.quantity}</td>
                    <td className="px-4 py-3 text-slate-400">{row.material_type}</td>
                    <td className="px-4 py-3 text-sky-400">{row.outer_diameter}</td>
                    <td className="px-4 py-3 text-cyan-300">{row.item_weight} lbs</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300 font-sans font-medium">
                        {row.compliance_certification}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Raw Text Output */}
          <div>
            <div className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Raw Feed Stream ({format.toUpperCase()}):</span>
            </div>
            <pre className="max-h-48 overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-slate-300 whitespace-pre">
              {fileContent}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-800 bg-slate-950 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Close Feed Generator
          </button>
        </div>
      </div>
    </div>
  );
};
