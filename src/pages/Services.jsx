import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight, ShieldCheck, Zap, Truck, PackageCheck, MapPin, CheckCircle2, Clock } from 'lucide-react';

const sections = [
  {
    title: 'CNC Plasma Cutting & Welding',
    summary:
      'Fast-turn plate and practical fabrication support for parts, assemblies, and field-ready repairs.',
    logistics: 'Daily Nationwide Parcel & LTL Freight Shipping',
    items: [
      'CNC plasma plate cutting for production and one-off jobs',
      'Simple welding and shop-built assemblies',
      'Custom gates and fence panel fabrication',
      'Custom brackets, plates, and structural supports',
      'Repair fabrication for damaged steel components',
      'Material prep and fit-up for install crews',
    ],
  },
  {
    title: 'Agriculture, Ranch & Blinds',
    summary:
      'Custom builds designed for hard-use environments across farms, ranches, and outdoor operations.',
    logistics: 'Texas Site Drop-Off & Nationwide Flatbed / Freight',
    items: [
      'Custom hog and livestock pens',
      'Farm and ranch equipment fabrication',
      'Farm and ranch gates with matching fence components',
      'Commercial paddle blind builds',
      'Spec blind fabrication and modifications',
      'Machining support for blind components',
    ],
  },
  {
    title: 'Public Sector & O&G Support',
    summary:
      'Procurement-ready support for Texas agencies, parks, and industrial/O&G clients nationwide.',
    logistics: 'Texas Priority Field Support & Nationwide Logistics',
    items: [
      'Fire rings and fire pits for parks and public sites',
      'Handrails and safety steel for facilities',
      'Durable gates and fencing for public access and safety zones',
      'Parts and assemblies for O&G operations',
      'Machined support pieces where needed',
      'Scope support for TPWD, National Parks, and agency projects',
    ],
  },
  {
    title: 'Secure Steel & Specialty Builds',
    summary:
      'Heavy steel fabrication for protective, secure, and purpose-built installations.',
    logistics: 'Crated Freight & Direct Flatbed Delivery Nationwide',
    items: [
      'Custom bunker fabrication and steel buildouts',
      'Tornado shelter components and reinforced assemblies',
      'Large built-in safes and secure room steelwork',
      'Heavy doors, frames, hinges, and locking support steel',
      'Custom plate packages for protected storage areas',
      'Field-ready coordination for unique site requirements',
    ],
  },
];

export default function Services() {
  return (
    <div className="container-page space-y-10">
      
      {/* FEATURED: ASME B16.48 PADDLE BLIND ONLINE CATALOG BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 border border-sky-800/40 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-mono font-bold uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5 text-amber-400" /> Featured Turnaround Capability
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-1 text-xs font-bold text-emerald-300 font-mono">
              <Truck className="h-3 w-3 text-emerald-400" /> Ships Nationwide Daily
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            ASME B16.48 Positive Isolation Paddle Blinds &amp; Spacers
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            In-house high-definition CNC cutting from domestic A516-70 carbon and 304L/316L stainless plate. Multi-size turnaround table ordering, certified EN 10204 3.1 MTRs, same-day emergency hot-shot courier across Texas, and <strong>daily UPS &amp; LTL freight shipping across all 50 states</strong>.
          </p>
          <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-300 font-mono">
            <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-emerald-400" /> 1/2" to 24" (150# - 1500#)</span>
            <span className="flex items-center gap-1"><Flame className="h-4 w-4 text-amber-400" /> Domestic Staged Plate</span>
            <span className="flex items-center gap-1"><Truck className="h-4 w-4 text-sky-400" /> UPS Parcel &amp; LTL Freight</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
          <Link
            to="/storefront"
            className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all active:scale-95 text-center"
          >
            <span>⚡ Launch Paddle Blind Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold px-6 py-3 rounded-2xl text-xs tracking-wider transition-all text-center"
          >
            Custom RFQ &amp; Drawings
          </Link>
        </div>
      </div>

      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-brown/80">
          Services &amp; Capabilities
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-brown md:text-4xl">
          Fabrication that matches real-world needs.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-800">
          Iron Prairie focuses on practical steel work that keeps operations moving. From CNC plasma-cut
          parts to custom pens, blinds, secure steel builds, and public infrastructure components,
          we support projects that are too specific for off-the-shelf solutions and too important
          to delay. All services available with local Texas field coordination or crated nationwide shipping.
        </p>
      </section>

      {/* SERVICE TILES */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col justify-between rounded-2xl bg-white/80 p-5 shadow-sm border border-slate-200/70">
            <div>
              <div className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mb-2 inline-block">
                {section.logistics}
              </div>
              <h2 className="text-sm font-semibold text-brand-brown">{section.title}</h2>
              <p className="mt-2 text-xs text-slate-700 leading-relaxed">{section.summary}</p>
              <ul className="mt-3 space-y-1 text-xs text-slate-800">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-brand-brown/70 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link to="/contact" className="text-xs font-bold text-brand-brown hover:text-brand-brown/80 flex items-center gap-1">
                Request Service Quote <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* DEDICATED LOGISTICS & NATIONWIDE SHIPPING SUMMARY */}
      <section className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Truck className="h-4 w-4" /> Full Spectrum Logistics
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              How We Deliver: Local Hot-Shot &amp; Nationwide Freight
            </h2>
          </div>
          <Link
            to="/contact"
            className="self-start md:self-auto inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all"
          >
            Inquire on Shipping Rates
          </Link>
        </div>

        <div className="grid gap-4 mt-6 sm:grid-cols-3 text-xs">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
              <Flame className="h-4 w-4 text-amber-400" />
              <span>Texas Emergency Hot-Shot</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              2-4 hour emergency burn &amp; direct truck courier service for refineries, chemical plants, and pipeline shutdowns across Lake Jackson, Freeport, Houston, Texas City, and statewide.
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-sky-400 flex items-center gap-1.5 text-sm">
              <PackageCheck className="h-4 w-4 text-sky-400" />
              <span>UPS Ground &amp; Air (Nationwide)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Standard boxed &amp; foam-wrapped parcel shipping to all 50 states. Fast transit times, online tracking, and certified MTR test report paperwork included in every box.
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
              <Truck className="h-4 w-4 text-emerald-400" />
              <span>Palletized Freight &amp; Flatbed</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Steel-banded, shrink-wrapped wooden pallet freight with liftgate delivery for heavy blind runs (&ge;150 lbs) and oversized agricultural or structural steel builds nationwide.
            </p>
          </div>
        </div>
      </section>

      {/* PROCUREMENT & AGENCY SUPPORT */}
      <section className="rounded-2xl bg-brand-brown/95 p-6 text-brand-ivory shadow-md">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-ivory/80">
          Agency and procurement support
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          We are building this site and capability stack to better support public entities at every
          level. That includes state and park work in Texas now, plus expanded nationwide federal support as SAM.gov
          registration and agency onboarding are finalized.
        </p>
        <p className="mt-3 text-xs text-brand-ivory/85">
          If you have a scope package, drawing set, or procurement requirements, we can align quote
          details, delivery timelines, and certified compliance to your process.
        </p>
      </section>
    </div>
  );
}

