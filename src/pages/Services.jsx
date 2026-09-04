import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight, ShieldCheck, Zap, Truck, PackageCheck, MapPin, CheckCircle2, Clock, Phone, Factory, Landmark, Shield, Cpu } from 'lucide-react';
import { trackCustomFabInterest } from '../services/analytics';

const sections = [
  {
    id: 'cnc-plasma',
    title: 'CNC Plasma Cutting & Precision Plate Fabrication',
    badge: 'Section 01 &bull; High-Definition Plasma',
    summary:
      'High-definition CNC plasma plate cutting for domestic carbon and stainless steel plate, custom shapes, baseplates, gussets, and rapid-turn blanks.',
    logistics: 'Daily Nationwide Parcel & LTL Freight Shipping',
    items: [
      'High-definition CNC plasma cutting up to 1-1/2" plate thickness',
      'SA-516 Grade 70 PVQ, A36 carbon steel, 304L & 316L stainless plate',
      'Production blanking runs, custom bracket packages, and one-off parts',
      'Rapid CAD / DXF drawing processing and precision material nesting',
      'Beveling, precision hole piercing, clean edge finishing, and fit-up prep',
      'Same-day emergency burn dispatch for urgent plant maintenance',
    ],
    primaryLink: '/contact',
    primaryText: 'Request Cutting Quote',
    dataGaLocation: 'services_cnc_plasma',
  },
  {
    id: 'ranch-ag',
    title: 'Custom Ranch & Agricultural Steel (Gates, livestock pens, boundary pickets)',
    badge: 'Section 02 &bull; Working Ranch Tough',
    summary:
      'Heavy-duty ranch equipment and perimeter steel built in Texas to endure hard livestock pressure, aggressive weather, and continuous daily work.',
    logistics: 'Texas Site Drop-Off & Nationwide Flatbed / Freight',
    items: [
      'Custom ranch entrance gates, overhead archways, and boundary steel',
      'Heavy-duty livestock pens, crowding alleys, sweep tubs, and working chutes',
      'Welded wire panels, continuous fence panels, and decorative ranch pickets',
      'Cattle guards, crossing barriers, and reinforced hinge assemblies',
      'Tractor implement repair, bucket hardfacing, and equipment reinforcement',
      'Custom heavy-gauge hay rings, feed bunks, and livestock trailer ramps',
    ],
    primaryLink: '/contact',
    primaryText: 'Request Ranch Quote',
    dataGaLocation: 'services_ranch_ag',
  },
  {
    id: 'industrial-structural',
    title: 'Industrial & Structural Steel Fabrication',
    badge: 'Section 03 &bull; Plant & Structural Specs',
    summary:
      'Engineered structural weldments, equipment skids, heavy pipe supports, and industrial assemblies built to rigid shop specifications.',
    logistics: 'Texas Emergency Hot-Shot & Dedicated Flatbed',
    items: [
      'Industrial equipment skid bases, equipment stands, and machine frames',
      'Heavy pipe saddles, shoe supports, structural gussets, and embed plates',
      'Facility catwalks, safety handrails, stair stringers, and bollards',
      'Certified SMAW/GMAW/FCAW welding on carbon and stainless assemblies',
      'Plant maintenance replacement parts and emergency turnaround rebuilds',
      'Pre-assembly bolt-up verification, weld inspection, and surface prep',
    ],
    primaryLink: '/contact',
    primaryText: 'Request Structural Quote',
    dataGaLocation: 'services_industrial_structural',
  },
  {
    id: 'asme-blinds',
    title: 'ASME B16.48 Paddle Blinds & Spacers (In-House Manufactured Line)',
    badge: 'Section 04 &bull; In-House Product Line',
    summary:
      'Standard and custom positive isolation line blinds, slip blinds, and ring spacers manufactured in-house with full mill test traceability.',
    logistics: 'Same-Day Texas Courier & Nationwide Daily Parcel/Freight',
    items: [
      'ASME B16.48 Class 150#, 300#, 600#, 900#, 1500# (Class 2500# on RFQ)',
      '1/2" through 24" pipe sizes standard (custom diameters up to 60"+ on RFQ)',
      'In-stock domestic SA-516 Gr 70 PVQ carbon steel & 304L/316L stainless',
      'Certified EN 10204 3.1 Mill Test Reports (MTRs) with complete heat tracking',
      'Smooth/serrated Raised Face (RF) and Ring Type Joint (RTJ) configurations',
      'Emergency 2-4 hr hot-shot courier across Texas petrochemical corridors',
    ],
    primaryLink: '/paddle-blinds',
    primaryText: 'Launch Blind Catalog',
    secondaryLink: '/contact',
    secondaryText: 'Custom RFQ',
    dataGaLocation: 'services_asme_blinds',
  },
  {
    id: 'public-agencies',
    title: 'Public Agencies & Municipalities',
    badge: 'Section 05 &bull; SAM.gov Registered Entity',
    summary:
      'Procurement-ready fabrication for Texas state parks, county road departments, TxDOT, municipal utilities, and federal public works.',
    logistics: 'Regional Jobsite Delivery & Direct Procurement Freight',
    items: [
      'Heavy-gauge park fire rings, campsite campfire grates, and site amenities',
      'Public access swing gates, vehicular barrier gates, and security fences',
      'Pedestrian handrails, ADA ramp railings, and safety guardrails',
      'Municipal drainage grates, culvert trash racks, and catch basin covers',
      'State agency scope support (TPWD, TxDOT, River Authorities)',
      'SAM.gov Active registered entity with Unique Entity Identifier (UEI)',
    ],
    primaryLink: '/contact',
    primaryText: 'Submit Agency RFQ',
    secondaryLink: '/woman-owned',
    secondaryText: 'Procurement Specs',
    dataGaLocation: 'services_public_agencies',
  },
  {
    id: 'secure-specialty',
    title: 'Secure Steel & Specialty Builds (Bunkers & Shelters)',
    badge: 'Section 06 &bull; High-Security Fabrication',
    summary:
      'Reinforced armor-plate fabrication for severe weather shelters, subterranean bunkers, secure walk-in safes, and fortified safe rooms.',
    logistics: 'Crated Freight & Direct Flatbed Delivery Nationwide',
    items: [
      'FEMA P-361 & ICC 500 compliant tornado shelter steel assemblies',
      'Custom subterranean bunker fabrication, intake vents, and hatch steel',
      'Large built-in walk-in safes, reinforced gun rooms, and vault enclosures',
      'Heavy multi-point locking doors, blast-resistant hinges, and jamb steel',
      'Reinforced plate packages for protected storage and equipment shelters',
      'Discreet crating and private flatbed transport across the United States',
    ],
    primaryLink: '/contact',
    primaryText: 'Inquire on Shelter Steel',
    dataGaLocation: 'services_secure_specialty',
  },
];

export default function Services() {
  return (
    <div className="container-page space-y-10">
      
      {/* FEATURED: ASME B16.48 PADDLE BLIND ONLINE CATALOG BANNER */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 text-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-brown/10 text-brand-brown border border-brand-brown/20 text-xs font-mono font-bold uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5 text-brand-brown" /> Featured Turnaround Capability
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-300 px-2.5 py-1 text-xs font-bold text-emerald-800 font-mono">
              <Truck className="h-3 w-3 text-emerald-700" /> Ships Nationwide Daily
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-brown font-display">
            ASME B16.48 Positive Isolation Paddle Blinds &amp; Spacers
          </p>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            In-house high-definition CNC cutting from domestic A516-70 carbon and 304L/316L stainless plate. Multi-size turnaround table ordering, certified EN 10204 3.1 MTRs, same-day emergency hot-shot courier across Texas, and <strong>daily UPS &amp; LTL freight shipping across all 50 states</strong>.
          </p>
          <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-600 font-mono">
            <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-emerald-600" /> 1/2" to 24" (150# - 1500# &bull; 2500# on RFQ)</span>
            <span className="flex items-center gap-1"><Flame className="h-4 w-4 text-brand-brown" /> Domestic Staged Plate</span>
            <span className="flex items-center gap-1"><Truck className="h-4 w-4 text-brand-brown" /> UPS Parcel &amp; LTL Freight</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
          <Link
            to="/paddle-blinds"
            data-ga-location="services_hero_catalog"
            className="inline-flex items-center justify-center gap-2 bg-brand-brown hover:bg-brand-brown-light text-white font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-all active:scale-95 text-center"
          >
            <Zap className="h-4 w-4 fill-white" />
            <span>Launch ASME Paddle Blind Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/contact"
            data-ga-location="services_hero_rfq"
            className="inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-slate-800 font-semibold px-6 py-3 rounded-2xl text-xs tracking-wider transition-all text-center"
          >
            Custom RFQ &amp; Drawings
          </Link>
        </div>
      </div>

      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-brown/80 font-mono">
          Services &amp; Capabilities
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-brown md:text-4xl">
          Fabrication that matches real-world needs.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-800">
          Iron Prairie focuses on practical steel work that keeps operations moving. From CNC plasma-cut
          parts to custom pens, blinds, secure steel builds, and public infrastructure components,
          we support projects that are too specific for off-the-shelf solutions and too important
          to delay. All services available with local Texas regional delivery, shop pickup, or crated nationwide shipping.
        </p>
      </section>

      {/* 6 DEDICATED CUSTOM FABRICATION SERVICE TILES */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <div
            key={section.id}
            className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm border border-stone-200/90 hover:border-brand-brown/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono font-bold text-brand-brown bg-brand-brown/10 px-2 py-0.5 rounded border border-brand-brown/30">
                  {section.badge}
                </span>
                <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {section.logistics}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 leading-snug">{section.title}</h2>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">{section.summary}</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                {section.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-brown shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-5 mt-5 border-t border-stone-100 flex flex-wrap items-center gap-2.5">
              <Link
                to={section.primaryLink}
                data-ga-location={section.dataGaLocation}
                onClick={() => trackCustomFabInterest(section.title, 'services_grid')}
                className="inline-flex items-center justify-center gap-1.5 bg-brand-brown hover:bg-brand-brown-light text-white text-xs font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-sm active:scale-95 flex-1 text-center"
              >
                <span>{section.primaryText}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
              {section.secondaryLink && (
                <Link
                  to={section.secondaryLink}
                  data-ga-location={`${section.dataGaLocation}_secondary`}
                  onClick={() => trackCustomFabInterest(`${section.title} (Secondary)`, 'services_grid')}
                  className="inline-flex items-center justify-center text-xs font-semibold text-slate-700 hover:text-brand-brown bg-stone-100 hover:bg-stone-200 px-3 py-2.5 rounded-xl transition-all"
                >
                  {section.secondaryText}
                </Link>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* DEDICATED LOGISTICS & NATIONWIDE SHIPPING SUMMARY */}
      <section className="rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-brand-brown uppercase tracking-wider mb-1">
              <Truck className="h-4 w-4" /> Full Spectrum Logistics
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-brown font-display">
              How We Deliver: Local Hot-Shot &amp; Nationwide Freight
            </h2>
          </div>
          <Link
            to="/contact"
            data-ga-location="services_logistics_shipping_rates"
            className="self-start md:self-auto inline-flex items-center gap-1.5 bg-brand-brown hover:bg-brand-brown-light text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm"
          >
            Inquire on Shipping Rates
          </Link>
        </div>

        <div className="grid gap-4 mt-6 sm:grid-cols-3 text-xs">
          <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <Zap className="h-4 w-4 text-brand-brown" />
              <span>Texas Emergency Hot-Shot</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              2-4 hour emergency burn &amp; direct truck courier service for refineries, chemical plants, and pipeline shutdowns across Bay City, Freeport, Lake Jackson, Houston, Texas City, and statewide.
            </p>
          </div>

          <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <PackageCheck className="h-4 w-4 text-brand-brown" />
              <span>UPS Ground &amp; Air (Nationwide)</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Standard boxed &amp; foam-wrapped parcel shipping to all 50 states. Fast transit times, online tracking, and certified MTR test report paperwork included in every box.
            </p>
          </div>

          <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <Truck className="h-4 w-4 text-emerald-600" />
              <span>Palletized Freight &amp; Flatbed</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Steel-banded, shrink-wrapped wooden pallet freight with liftgate delivery for heavy blind runs (&ge;150 lbs) and oversized agricultural or structural steel builds nationwide.
            </p>
          </div>
        </div>
      </section>

      {/* TEXAS GULF COAST PETROCHEMICAL & REFINERY SUPPORT CORRIDOR */}
      <section className="rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-brand-brown uppercase tracking-wider">
              <Factory className="h-4 w-4 text-brand-brown" /> Texas Petrochemical Hub &bull; Emergency Turnaround Dispatch
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-brown font-display">
              Gulf Coast Refinery, Chemical Plant &amp; Pipeline Turnaround Fabrication
            </h2>
          </div>
          <a
            href="tel:(979)248-9266"
            data-ga-location="services_gulf_coast_phone"
            className="self-start md:self-auto inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all shadow-sm"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>(979) 248-9266</span>
          </a>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
          Strategically located in Bay City, Texas (Matagorda County), Iron Prairie Fabrication Group LLC delivers urgent turnaround and maintenance fabrication for the Texas Gulf Coast petrochemical belt. When unplanned outages or scheduled turnaround windows demand immediate turnaround, our CNC plasma tables burn positive isolation paddle blinds, slip blinds, spacer rings, spectacle blinds, and structural pipe supports on rapid turnarounds with complete mill test report (MTR) documentation.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div className="bg-stone-50/90 p-4 rounded-xl border border-stone-200 space-y-1.5">
            <span className="font-bold text-slate-900 block text-sm">Freeport &amp; Brazoria Corridor</span>
            <p className="text-slate-600 leading-relaxed">
              30–45 min hot-shot courier response to Freeport LNG, Dow Chemical, BASF, and Phillips 66 Sweeny Refinery.
            </p>
          </div>

          <div className="bg-stone-50/90 p-4 rounded-xl border border-stone-200 space-y-1.5">
            <span className="font-bold text-slate-900 block text-sm">Houston &amp; Baytown Complex</span>
            <p className="text-slate-600 leading-relaxed">
              Direct hot-shot truck runs to Baytown ExxonMobil, Pasadena, Deer Park, and Houston Ship Channel refining plants.
            </p>
          </div>

          <div className="bg-stone-50/90 p-4 rounded-xl border border-stone-200 space-y-1.5">
            <span className="font-bold text-slate-900 block text-sm">Texas City &amp; Galveston Bay</span>
            <p className="text-slate-600 leading-relaxed">
              Rapid courier delivery for Marathon, Valero, and coastal tank farm positive pipeline blanking projects.
            </p>
          </div>

          <div className="bg-stone-50/90 p-4 rounded-xl border border-stone-200 space-y-1.5">
            <span className="font-bold text-slate-900 block text-sm">Corpus Christi &amp; South Texas</span>
            <p className="text-slate-600 leading-relaxed">
              Direct highway route 35 delivery to Corpus Christi marine terminals, Ingleside, and regional petrochemical facilities.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Link
            to="/paddle-blinds"
            data-ga-location="services_turnaround_catalog"
            className="inline-flex items-center gap-2 bg-brand-brown hover:bg-brand-brown-light text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm"
          >
            <Zap className="h-3.5 w-3.5 fill-white" />
            <span>ASME Paddle Blind Matrix</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            to="/contact"
            data-ga-location="services_turnaround_quote"
            className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-slate-800 font-semibold px-5 py-2.5 rounded-xl text-xs tracking-wider transition-all"
          >
            Request Turnaround Quote
          </Link>
        </div>
      </section>

      {/* PROCUREMENT & AGENCY SUPPORT */}
      <section className="rounded-2xl bg-white border border-stone-200/90 p-6 text-slate-800 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-brown font-mono">
          Agency and procurement support
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          We are building this site and capability stack to better support public entities at every
          level. That includes state and park work in Texas now, plus expanded nationwide federal support as SAM.gov
          registration and agency onboarding are finalized.
        </p>
        <p className="mt-3 text-xs text-slate-500">
          If you have a scope package, drawing set, or procurement requirements, we can align quote
          details, delivery timelines, and certified compliance to your process.
        </p>
      </section>
    </div>
  );
}
