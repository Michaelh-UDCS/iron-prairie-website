import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Award, Building, FileCheck, ArrowRight, CheckCircle2, Lock, FileText, BadgeCheck } from 'lucide-react';

export default function WomanOwned() {
  return (
    <div className="container-page space-y-10">
      {/* HEADER */}
      <section className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700 font-mono">
            Woman-Owned &bull; Government Contracting
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 font-mono">
            <BadgeCheck className="h-3.5 w-3.5 text-emerald-700" />
            <span>SAM.gov Registered Contractor</span>
          </span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Registered Government Contractor &amp; Woman-Owned Fabrication Partner
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-700">
          Iron Prairie Fabrication Group LLC is an officially registered government contractor on SAM.gov (Unique Entity ID: <strong>XX7XCMGN9XD5</strong>) and a certified woman-owned enterprise. We provide high-precision structural steel fabrication, ASME B16.48 paddle blinds, CNC plasma plate cutting, custom security enclosures, and municipal infrastructure components.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          We support local Texas public agencies (ISDs, cities, counties, TPWD) with direct shop fabrication and regional delivery, while fulfilling tier-1 prime contractor supplier diversity goals, DOD, DOE, and federal agency solicitations nationwide.
        </p>
      </section>

      {/* OFFICIAL GOVERNMENT CONTRACTOR CREDENTIALS CARD */}
      <section className="rounded-3xl border border-slate-800 bg-slate-950 text-white p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold uppercase tracking-wider">
              <Building className="h-3.5 w-3.5 text-blue-400" /> Official Procurement Data
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Federal &amp; State Contractor Identification
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Active SAM.gov Status
            </span>
          </div>
        </div>

        <div className="grid gap-6 mt-6 md:grid-cols-3">
          {/* Box 1: UEI & Entity */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Unique Entity Identifier (UEI)</div>
            <div className="font-mono text-lg font-black text-blue-400 bg-slate-950 px-3 py-2 rounded-xl border border-blue-500/30 tracking-widest">
              XX7XCMGN9XD5
            </div>
            <div className="text-xs text-slate-300 space-y-1 pt-1 font-mono">
              <div><strong>Legal Business:</strong> Iron Prairie Fabrication Group LLC</div>
              <div><strong>Structure:</strong> Certified Woman-Owned Enterprise</div>
              <div><strong>Physical Shop:</strong> 200 County Rd 170, Bay City, TX 77414 (Matagorda County)</div>
            </div>
          </div>

          {/* Box 2: NAICS Codes */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Core NAICS Classifications</div>
            <ul className="space-y-1 text-xs text-slate-300 font-mono">
              <li><strong className="text-blue-300">332312</strong> &ndash; Fabricated Structural Metal</li>
              <li><strong className="text-blue-300">332313</strong> &ndash; Plate Work Manufacturing</li>
              <li><strong className="text-blue-300">332710</strong> &ndash; Machine Shops &amp; CNC Plasma</li>
              <li><strong className="text-blue-300">332996</strong> &ndash; Fabricated Pipe &amp; Fittings</li>
              <li><strong className="text-blue-300">332323</strong> &ndash; Ornamental &amp; Architectural Metal</li>
            </ul>
          </div>

          {/* Box 3: Target Procurement Buyers */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Procurement Programs Supported</div>
            <ul className="space-y-1 text-xs text-slate-300">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Federal Agency Solicitations (DOD, DOE, NPS)</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> State Procurement (TPWD, TxDOT)</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Municipal &amp; ISD Facility Infrastructure</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Tier-1 Prime Contractor Supplier Diversity (WBE/SBE)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Award className="h-4 w-4 text-blue-600" />
            <h2>Diversity &amp; Procurement Alignment</h2>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Positioned to help prime contractors and public agencies fulfill small business enterprise (SBE), woman-owned (WBE), and state HUB supplier diversity participation goals with verified SAM.gov credentials.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <FileCheck className="h-4 w-4 text-emerald-600" />
            <h2>Quality &amp; Traceability</h2>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Full heat number stamping, certified EN 10204 3.1 Material Test Reports (MTRs), and rigorous QA inspection prior to local pickup or nationwide shipping dispatch.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Truck className="h-4 w-4 text-blue-600" />
            <h2>Nationwide Fulfillment</h2>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Direct parcel and palletized LTL freight shipping across all 50 states, ensuring reliable jobsite delivery for regional and national infrastructure projects.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <h2 className="text-lg font-bold">Partner on an upcoming bid or procurement package</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Need a qualified woman-owned, SAM.gov registered manufacturing partner (UEI: <strong>XX7XCMGN9XD5</strong>) for your state or federal contract? Send us your specification sheets, drawings, or RFQ package for fast turnaround pricing.
          </p>
        </div>
        <Link
          to="/contact"
          className="self-start md:self-auto inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-600/20 active:scale-95"
        >
          <span>Submit Scope Package</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}

