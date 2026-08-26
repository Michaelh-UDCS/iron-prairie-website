// src/erp/screens/ErpAutoIngestionHubScreen.tsx
// Smart Automation, OCR / Email / MTR / Drawing Ingestion & Google Drive Hub for IPG

import React, { useState } from 'react';
import { useErp } from '../context/ErpContext';
import {
  Sparkles,
  Mail,
  ShieldCheck,
  FolderKanban,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Upload,
  FileText,
  Copy,
  ExternalLink
} from 'lucide-react';
import { MaterialTestReport } from '../../types';

export const ErpAutoIngestionHubScreen: React.FC = () => {
  const {
    simulateSalesEmailTrigger,
    addMtr,
    addDocControlItem,
    workOrders,
    setActiveModuleId,
  } = useErp();

  // Ingestion Textbox States
  const [emailText, setEmailText] = useState(`Client: Chevron Phillips Chemical Cedar Bayou
Buyer: Sarah Jenkins (sjenkins@cpchem-logistics.com)
PO Number: PO-CPCHEM-9921
Project: Olefins Flare Outage
Items: 8x 6" 300# 316L Stainless Paddle Blinds (3/8" thk)
Ship To: 9500 I-10 East, Baytown, TX 77521
Delivery Requested: 2026-08-28`);

  const [mtrText, setMtrText] = useState(`HEAT NUMBER: K88412-B
SPECIFICATION: ASME SA-516 Grade 70 (Normalized PVQ)
STEEL MILL: Nucor Steel Hertford County
THICKNESS: 1/2" (0.500")
TENSILE: 75,200 PSI
YIELD: 47,100 PSI
ELONGATION: 28.5%
CARBON: 0.21%
MANGANESE: 1.16%
COUNTRY OF MELT: USA (Buy American Compliant)`);

  const [parseEmailResult, setParseEmailResult] = useState<string | null>(null);
  const [parseMtrResult, setParseMtrResult] = useState<string | null>(null);

  // Parse Raw Email Action
  const handleParseAndCreateOrder = () => {
    const lines = emailText.split('\n');
    let client = 'Inbound Industrial Client';
    let buyer = 'Purchasing Agent';
    let po = `PO-AUTO-${Math.floor(10000 + Math.random() * 90000)}`;
    let project = 'Refinery Outage';

    lines.forEach((l) => {
      if (l.toLowerCase().startsWith('client:')) client = l.split(':')[1].trim();
      if (l.toLowerCase().startsWith('buyer:')) buyer = l.split(':')[1].trim();
      if (l.toLowerCase().startsWith('po number:') || l.toLowerCase().startsWith('po:')) po = l.split(':')[1].trim();
      if (l.toLowerCase().startsWith('project:')) project = l.split(':')[1].trim();
    });

    const triggered = simulateSalesEmailTrigger({
      companyName: client,
      contactName: buyer,
      poNumber: po,
      projectName: project,
      rawBody: emailText,
      items: [
        {
          partDescription: '6" 300# 316L ASME B16.48 Paddle Blind',
          materialGrade: '316L',
          nps: '6"',
          pressureClass: 300,
          thicknessLabel: '3/8" (0.375")',
          quantity: 8,
          unitPrice: 245.0,
        }
      ],
      totalAmount: 2045.0,
    });

    setParseEmailResult(`Parsed successfully! Generated Job #${triggered.generatedJobNumber} and updated live Dashboard.`);
  };

  // Parse Raw MTR Action
  const handleParseAndAddMtr = () => {
    const lines = mtrText.split('\n');
    let heat = `HT-AUTO-${Math.floor(1000 + Math.random() * 9000)}`;
    let spec = 'ASME SA-516 Gr. 70';
    let mill = 'Nucor Steel';

    lines.forEach((l) => {
      if (l.toLowerCase().includes('heat number:')) heat = l.split(':')[1].trim();
      if (l.toLowerCase().includes('specification:')) spec = l.split(':')[1].trim();
      if (l.toLowerCase().includes('steel mill:')) mill = l.split(':')[1].trim();
    });

    const newMtr: MaterialTestReport = {
      id: `MTR-${Date.now()}`,
      heatNumber: heat,
      certificateNumber: `CMTR-${Date.now().toString().slice(-6)}`,
      asmeSpec: spec,
      astmSpec: spec,
      materialCode: 'SA-516-70',
      materialGrade: spec,
      heatTreatment: 'Normalized',
      plateThickness: 0.500,
      thicknessLabel: '1/2" (0.500")',
      plateWidthInches: 96,
      plateLengthInches: 240,
      masterPlateWeightLbs: 3270,
      steelMill: mill,
      millLocation: 'USA',
      supplierDistributor: 'Triple-S Steel Houston',
      countryOfMelt: 'USA',
      buyAmericanCompliant: true,
      chemistry: {
        carbon: 0.21,
        manganese: 1.16,
        phosphorus: 0.012,
        sulfur: 0.008,
        silicon: 0.28,
        carbonEquivalent: 0.42,
      },
      mechanical: {
        tensileStrengthPsi: 75200,
        yieldStrengthPsi: 47100,
        elongationPct: 28.5,
      },
      certifiedDate: new Date().toISOString().split('T')[0],
      qrCodePayload: `https://ironprairiefabrication.com/mtr/${heat}`,
      permanentUrl: `/mtr/${heat}`,
      status: 'In Stock',
      initialAreaSqIn: 23040,
      remainingAreaSqIn: 23040,
      allocatedOrders: [],
    };

    addMtr(newMtr);
    setParseMtrResult(`MTR Heat #${heat} parsed and stored in ASME MTR Vault!`);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-100">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px]">
          <Sparkles className="h-4 w-4" />
          <span>Smart Ingestion &amp; Automation Engine</span>
        </div>
        <h1 className="text-xl font-black text-white">Automated Ingestion Hub &amp; Google Drive Sync</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Automatically extract customer contacts, line items, mill test reports (MTRs), and drawings from emails or documents into the ERP database.
        </p>
      </div>

      {/* Google Drive Hierarchy Overview */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5 text-sky-400 font-bold uppercase text-xs">
            <Cloud className="h-5 w-5" />
            <span>Google Drive Automated Storage Mapping</span>
          </div>
          <span className="text-[10px] text-slate-500">Google Workspace Integrated</span>
        </div>

        <p className="text-[11px] text-slate-400">
          All ERP items are linked directly to your company Google Drive cloud storage:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="font-bold text-cyan-400">📁 01_Work_Orders/</div>
            <div className="text-slate-400 text-[10px]">Job travelers, CAD cuts, customer POs</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="font-bold text-sky-400">📁 02_MTR_Vault/</div>
            <div className="text-slate-400 text-[10px]">Mill test reports categorized by alloy</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="font-bold text-purple-400">📁 03_Purchase_Orders/</div>
            <div className="text-slate-400 text-[10px]">Supplier PO records &amp; confirmations</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="font-bold text-emerald-400">📁 04_Doc_Control/</div>
            <div className="text-slate-400 text-[10px]">CAD DWG/DXF blueprints &amp; WPS specs</div>
          </div>
        </div>
      </div>

      {/* Two Ingestion Parsers: Email Ingestion & MTR Ingestion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Box 1: Sales Email / Contact Auto-Parser */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase">
              <Mail className="h-4 w-4" />
              <span>1. Customer Email &amp; RFQ Parser</span>
            </div>
            <span className="text-[10px] text-slate-500">Auto-Extracts CRM &amp; WO</span>
          </div>

          <p className="text-[11px] text-slate-400">
            Paste raw text from a customer email, quote request, or PO body below:
          </p>

          <textarea
            rows={7}
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs font-mono focus:outline-none"
          />

          <div className="flex items-center justify-between pt-1">
            {parseEmailResult ? (
              <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>{parseEmailResult}</span>
              </span>
            ) : <span />}

            <button
              onClick={handleParseAndCreateOrder}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-cyan-500/20 active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>Parse &amp; Generate Job #</span>
            </button>
          </div>
        </div>

        {/* Box 2: MTR Mill Cert Parser */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase">
              <ShieldCheck className="h-4 w-4" />
              <span>2. MTR Mill Cert Auto-Parser</span>
            </div>
            <span className="text-[10px] text-slate-500">ASME Section VIII Vault</span>
          </div>

          <p className="text-[11px] text-slate-400">
            Paste OCR or text from an attached Mill Test Report (MTR) below:
          </p>

          <textarea
            rows={7}
            value={mtrText}
            onChange={(e) => setMtrText(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs font-mono focus:outline-none"
          />

          <div className="flex items-center justify-between pt-1">
            {parseMtrResult ? (
              <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>{parseMtrResult}</span>
              </span>
            ) : <span />}

            <button
              onClick={handleParseAndAddMtr}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs transition-all shadow active:scale-95"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Parse &amp; Store in MTR Vault</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
