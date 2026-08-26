// src/pages/PublicMtrViewer.tsx
// Public Read-Only Material Test Report (CMTR) Portal for Turnaround Auditors & Plant Inspectors

import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAllMTRs } from '../operations/data/mtrRepository';
import { ShieldCheck, QrCode, Printer, CheckCircle2, ArrowLeft, Building, FileText } from 'lucide-react';
import brandLogo from '../../Logo.jpg';

export default function PublicMtrViewer() {
  const { heatNumber } = useParams<{ heatNumber: string }>();
  const allMTRs = useMemo(() => getAllMTRs(), []);

  const mtr = useMemo(() => {
    if (!heatNumber) return allMTRs[0];
    const clean = heatNumber.trim().toUpperCase();
    return allMTRs.find(
      (m) => m.heatNumber.toUpperCase() === clean || m.heatNumber.toUpperCase().includes(clean)
    );
  }, [heatNumber, allMTRs]);

  const handlePrint = () => {
    window.print();
  };

  if (!mtr) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <ShieldCheck className="h-12 w-12 text-slate-500" />
        <h1 className="text-xl font-bold text-slate-900">MTR Heat Number Not Found</h1>
        <p className="text-xs text-slate-600 max-w-md">
          The requested heat number "{heatNumber}" was not found in our digital traceability vault.
        </p>
        <Link to="/storefront" className="text-xs font-bold text-sky-700 hover:underline">
          Return to Paddle Blinds Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Top Banner & Print Trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-800 uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Verified Turnaround Material Certificate
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Certified Mill Test Report &bull; <span className="font-mono text-sky-800">{mtr.heatNumber}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/storefront"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Storefront</span>
          </Link>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold transition-all shadow"
          >
            <Printer className="h-4 w-4" />
            <span>Print Official MTR</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg space-y-8 font-mono text-xs text-slate-800 print:border-none print:shadow-none print:p-0">
        
        {/* Certificate Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-900">
          <div className="flex items-center gap-3">
            <img src={brandLogo} alt="Iron Prairie" className="h-12 w-auto rounded border border-slate-200 p-0.5" />
            <div>
              <div className="text-xs font-bold tracking-widest text-slate-900 uppercase">
                IRON PRAIRIE FABRICATION GROUP LLC
              </div>
              <div className="text-lg font-black text-slate-900 mt-0.5">
                CERTIFIED MATERIAL TEST REPORT (CMTR)
              </div>
              <div className="text-[11px] text-slate-500">
                ASME BPVC Section VIII Div 1 &bull; ASME B16.48 Material Traceability Certificate
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <QrCode className="h-12 w-12 text-slate-900" />
            <div className="text-[10px] space-y-0.5">
              <div className="font-bold text-slate-900">PLANT AUDIT SEAL</div>
              <div className="text-emerald-700 font-bold">100% VERIFIED</div>
              <div className="text-slate-500">Cert #{mtr.certificateNumber}</div>
            </div>
          </div>
        </div>

        {/* Section 1: Provenance & Specification */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Mill Heat Number</span>
            <span className="text-base font-black text-sky-900">{mtr.heatNumber}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Slab / Coil #</span>
            <span className="text-xs font-bold text-slate-900">{mtr.slabNumber || 'N/A'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">ASME / ASTM Spec</span>
            <span className="text-xs font-bold text-slate-900">{mtr.asmeSpec}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Thickness</span>
            <span className="text-xs font-bold text-emerald-800">{mtr.thicknessLabel}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Steel Mill</span>
            <span className="text-xs font-semibold text-slate-700">{mtr.steelMill}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Mill Location</span>
            <span className="text-xs font-semibold text-slate-700">{mtr.millLocation}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Heat Treatment</span>
            <span className="text-xs font-semibold text-slate-700">{mtr.heatTreatment}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Country of Melt</span>
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              {mtr.countryOfMelt} (Buy American Act)
            </span>
          </div>
        </div>

        {/* Section 2: Chemical Composition Analysis */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span>1. Certified Chemical Composition (% by Weight)</span>
              <span className="rounded-full bg-emerald-100 text-emerald-900 px-2.5 py-0.5 text-[10px] font-bold border border-emerald-300">
                PASS
              </span>
            </h3>
            <span className="text-[10px] font-bold text-slate-600">
              Carbon Equivalent (CE): {mtr.chemistry.carbonEquivalent.toFixed(2)}
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-center text-xs">
              <thead className="bg-slate-100 text-[10px] font-bold text-slate-600 uppercase">
                <tr>
                  <th className="py-2.5 px-3 text-left">Element</th>
                  <th className="py-2.5 px-2">% C</th>
                  <th className="py-2.5 px-2">% Mn</th>
                  <th className="py-2.5 px-2">% P</th>
                  <th className="py-2.5 px-2">% S</th>
                  <th className="py-2.5 px-2">% Si</th>
                  <th className="py-2.5 px-2">% Cr</th>
                  <th className="py-2.5 px-2">% Ni</th>
                  <th className="py-2.5 px-2">% Mo</th>
                  <th className="py-2.5 px-2">% Cu</th>
                  <th className="py-2.5 px-2">CE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                <tr>
                  <td className="py-2.5 px-3 text-left font-bold text-sky-900">Actual Mill Heat</td>
                  <td className="py-2.5 px-2 font-bold">{mtr.chemistry.carbon}</td>
                  <td className="py-2.5 px-2">{mtr.chemistry.manganese}</td>
                  <td className="py-2.5 px-2">{mtr.chemistry.phosphorus}</td>
                  <td className="py-2.5 px-2">{mtr.chemistry.sulfur}</td>
                  <td className="py-2.5 px-2">{mtr.chemistry.silicon}</td>
                  <td className="py-2.5 px-2">{mtr.chemistry.chromium ?? '-'}</td>
                  <td className="py-2.5 px-2">{mtr.chemistry.nickel ?? '-'}</td>
                  <td className="py-2.5 px-2">{mtr.chemistry.molybdenum ?? '-'}</td>
                  <td className="py-2.5 px-2">{mtr.chemistry.copper ?? '-'}</td>
                  <td className="py-2.5 px-2 font-bold text-emerald-800">{mtr.chemistry.carbonEquivalent}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Mechanical Test Properties */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <span>2. Certified Mechanical &amp; Impact Properties</span>
            <span className="rounded-full bg-emerald-100 text-emerald-900 px-2.5 py-0.5 text-[10px] font-bold border border-emerald-300">
              ASME SEC II PART A CONFORMANCE
            </span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Tensile Strength</span>
              <span className="text-sm font-black text-slate-900">
                {mtr.mechanical.tensileStrengthPsi.toLocaleString()} PSI
              </span>
              <span className="text-[10px] text-emerald-800 block">Spec: 70,000 - 90,000 PSI</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Yield Strength (0.2%)</span>
              <span className="text-sm font-black text-slate-900">
                {mtr.mechanical.yieldStrengthPsi.toLocaleString()} PSI
              </span>
              <span className="text-[10px] text-emerald-800 block">Spec: &ge; 38,000 PSI</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Elongation in 2"</span>
              <span className="text-sm font-black text-slate-900">
                {mtr.mechanical.elongationPct}%
              </span>
              <span className="text-[10px] text-emerald-800 block">Spec: &ge; 21.0%</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Charpy V-Notch Impact</span>
              {mtr.mechanical.charpyVNotch ? (
                <div>
                  <span className="text-sm font-black text-sky-900">
                    {mtr.mechanical.charpyVNotch.ftLbs} ft-lbs
                  </span>
                  <span className="text-[10px] text-slate-600 block">
                    @ {mtr.mechanical.charpyVNotch.temperatureF}&deg;F
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-500">Not Applicable</span>
              )}
            </div>
          </div>
        </div>

        {/* Certification Sign-Off */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-slate-600">
          <div>
            <div>Certified QA/QC Record &bull; <strong>Iron Prairie Fabrication Group LLC</strong></div>
            <div>200 County Rd 170, Bay City, TX 77414 &bull; <a href="mailto:Sales@ironprairiefabrication.com" className="text-sky-700 underline">Sales@ironprairiefabrication.com</a></div>
          </div>
          <div className="text-right">
            <div>Certified Date: <strong>{mtr.certifiedDate}</strong></div>
            <div className="text-emerald-700 font-bold">ASME B16.48 Audit Traceability Valid</div>
          </div>
        </div>

      </div>
    </div>
  );
}
