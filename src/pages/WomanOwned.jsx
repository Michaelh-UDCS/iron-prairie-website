import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Award, Building, FileCheck, ArrowRight } from 'lucide-react';

export default function WomanOwned() {
  return (
    <div className="container-page space-y-10">
      <section className="max-w-3xl">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-brown/80">
            Woman-Owned &bull; Built to Last
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-300 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 font-mono">
            Texas Hub &bull; Nationwide Supply
          </span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-brand-brown md:text-4xl">
          A dependable fabrication partner for local, state, and nationwide buyers.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-800">
          Iron Prairie Fabrication Group LLC is proudly woman-owned. That&apos;s more than a line on a form &mdash; it&apos;s an operational commitment to high-precision manufacturing, responsive communication, and fabrication that reflects on our reputation as much as yours.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-800">
          We serve regional Texas municipalities, school districts, and industrial plants with local field support, while providing tier-1 prime contractors and out-of-state industrial buyers with dependable, crated nationwide delivery and full MTR documentation.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white/80 p-5 shadow-sm border border-slate-200/70 space-y-2">
          <div className="flex items-center gap-2 text-brand-brown font-semibold text-sm">
            <Award className="h-4 w-4 text-amber-600" />
            <h2>Diversity &amp; Procurement Alignment</h2>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Positioned to help prime contractors and public agencies fulfill small business enterprise (SBE), woman-owned (WBE), and state HUB supplier diversity participation goals.
          </p>
        </div>
        <div className="rounded-2xl bg-white/80 p-5 shadow-sm border border-slate-200/70 space-y-2">
          <div className="flex items-center gap-2 text-brand-brown font-semibold text-sm">
            <FileCheck className="h-4 w-4 text-emerald-600" />
            <h2>Quality &amp; Traceability</h2>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Full heat number stamping, certified EN 10204 3.1 Material Test Reports (MTRs), and rigorous QA inspection prior to local pickup or nationwide shipping dispatch.
          </p>
        </div>
        <div className="rounded-2xl bg-white/80 p-5 shadow-sm border border-slate-200/70 space-y-2">
          <div className="flex items-center gap-2 text-brand-brown font-semibold text-sm">
            <Truck className="h-4 w-4 text-sky-600" />
            <h2>Nationwide Fulfillment</h2>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Direct parcel and palletized LTL freight shipping across all 50 states, ensuring reliable jobsite delivery for regional and national infrastructure projects.
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-brand-brown/95 p-6 sm:p-8 text-brand-ivory shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <h2 className="text-lg font-bold">Partner on an upcoming bid or procurement package</h2>
          <p className="text-xs sm:text-sm text-brand-ivory/90 leading-relaxed">
            Need a qualified woman-owned manufacturing partner for your state or federal contract? Send us your specification sheets, drawings, or RFQ package for fast turnaround pricing.
          </p>
        </div>
        <Link
          to="/contact"
          className="self-start md:self-auto inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
        >
          <span>Submit Scope Package</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}

