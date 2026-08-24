import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const sections = [
  {
    title: 'CNC Plasma Cutting & Welding',
    summary:
      'Fast-turn plate and practical fabrication support for parts, assemblies, and field-ready repairs.',
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
      'Procurement-ready support for Texas agencies, parks, and industrial/O&G clients.',
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
    <div className="container-page space-y-8">
      
      {/* FEATURED: ASME B16.48 PADDLE BLIND ONLINE CATALOG BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 border border-sky-800/40 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-mono font-bold uppercase tracking-wider">
            <Zap className="h-3.5 w-3.5 text-amber-400" /> Featured Turnaround Capability &bull; Freeport, TX
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            ASME B16.48 Positive Isolation Paddle Blinds &amp; Spacers
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            In-house high-definition CNC cutting from domestic A516-70 carbon and 304L/316L stainless plate. Multi-size turnaround table ordering, certified EN 10204 3.1 MTRs, and instant automated proposals sent from <strong>Sales@ironprairiefabrication.com</strong>.
          </p>
          <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-300 font-mono">
            <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-emerald-400" /> 1/2" to 24" (150# - 1500#)</span>
            <span className="flex items-center gap-1"><Flame className="h-4 w-4 text-amber-400" /> Domestic Staged Plate</span>
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
          Services
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-brown md:text-4xl">
          Fabrication that matches real-world needs.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-800">
          Iron Prairie focuses on practical steel work that keeps operations moving. From CNC plasma-cut
          parts to custom pens, blinds, secure steel builds, and public infrastructure components,
          we support projects that are too specific for off-the-shelf solutions and too important
          to delay.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col rounded-2xl bg-white/80 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-brand-brown">{section.title}</h2>
            <p className="mt-2 text-xs text-slate-800">{section.summary}</p>
            <ul className="mt-3 space-y-1 text-xs text-slate-800">
              {section.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-brand-brown/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="rounded-2xl bg-brand-brown/95 p-6 text-brand-ivory shadow-md">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-ivory/80">
          Agency and procurement support
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          We are building this site and capability stack to better support public entities at every
          level. That includes state and park work now, plus expanded federal support as SAM.gov
          registration and agency onboarding are finalized.
        </p>
        <p className="mt-3 text-xs text-brand-ivory/85">
          If you have a scope package, drawing set, or procurement requirements, we can align quote
          details to your process and timelines.
        </p>
      </section>
    </div>
  );
}

