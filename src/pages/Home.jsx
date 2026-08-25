import React from 'react';
import { Link } from 'react-router-dom';
import gatePhoto from '../assets/front-gate-no-trailer-v2~2.png';
import { Truck, MapPin, ShieldCheck, Flame, Zap, PackageCheck, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="container-page space-y-10">
      {/* HERO SECTION */}
      <section className="grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:items-stretch md:gap-10">
        <div className="order-2 md:order-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-brown/80">
              Built in Texas &bull; Shipped Nationwide
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 font-mono">
              <Truck className="h-3 w-3 text-emerald-700" />
              <span>Ships All 50 States</span>
            </span>
          </div>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-brand-brown md:text-5xl">
            Built-to-last fabrication for ranches, industry, and agencies.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-muted">
            Iron Prairie Fabrication Group LLC delivers CNC plasma plate cutting, ASME B16.48 positive isolation paddle blinds, practical welding, and custom metal fabrication. Proudly based in Lake Jackson, Texas with fast regional delivery across the Gulf Coast, and <strong>nationwide freight &amp; parcel shipping across all 50 states</strong>.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/storefront"
              className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-black text-slate-950 shadow-md hover:bg-amber-400 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <span>⚡ Paddle Blinds Catalog</span>
            </Link>
            <Link
              to="/contact"
              className="rounded-full bg-brand-brown px-5 py-2.5 text-sm font-semibold text-brand-ivory shadow-sm hover:bg-brand-brown/90"
            >
              Request a Quote
            </Link>
            <Link
              to="/services"
              className="rounded-full border border-brand-brown/40 px-5 py-2.5 text-sm font-semibold text-brand-brown hover:bg-brand-brown/5"
            >
              View Services
            </Link>
          </div>
          <div className="mt-6 grid gap-4 text-xs text-slate-800 sm:grid-cols-3">
            <div className="rounded-lg bg-white/70 p-4 shadow-sm">
              <div className="font-semibold text-brand-brown">Agriculture &amp; Ranch</div>
              <p className="mt-1">
                Custom hog and livestock pens, farm equipment, ranch gates, and fence-line steel fabrication.
              </p>
            </div>
            <Link to="/storefront" className="rounded-lg bg-sky-50 border border-sky-200 p-4 shadow-sm block hover:bg-sky-100/70 transition-colors group">
              <div className="font-bold text-sky-900 flex items-center justify-between">
                <span>O&amp;G &amp; Paddle Blinds</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-black">FAST ORDER</span>
              </div>
              <p className="mt-1 text-slate-700">
                ASME B16.48 paddle blinds &amp; spacers. Fast turnaround grid ordering, traceable MTRs, and direct shipping.
              </p>
            </Link>
            <div className="rounded-lg bg-white/70 p-4 shadow-sm">
              <div className="font-semibold text-brand-brown">Public Agencies</div>
              <p className="mt-1">
                Fire rings, fire pits, handrails, and park infrastructure for TPWD, National Parks, and municipal entities.
              </p>
            </div>
            <div className="rounded-lg bg-white/70 p-4 shadow-sm sm:col-span-3">
              <div className="font-semibold text-brand-brown">Secure Specialty Builds</div>
              <p className="mt-1">
                Custom bunkers, tornado shelter steelwork, and large built-in safes for properties and protected storage.
              </p>
            </div>
          </div>
        </div>

        <div className="order-1 flex min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:order-2">
          <img
            src={gatePhoto}
            alt="Custom fabricated ranch gate and fence installation"
            width="800"
            height="600"
            fetchpriority="high"
            className="h-[min(52vh,22rem)] w-full min-h-[20rem] flex-1 object-cover object-center sm:h-[min(56vh,26rem)] sm:min-h-[22rem] md:min-h-[28rem] md:h-[min(78vh,40rem)]"
          />
          <div className="space-y-2 bg-white px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-brown/80">
                Registered Government Contractor
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded">
                UEI: XX7XCMGN9XD5
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-700">
              Certified woman-owned enterprise with verified SAM.gov registration, traceable MTR documentation, and proven schedule discipline for state, municipal, and federal procurement.
            </p>
            <p className="text-xs text-slate-600 font-mono">
              Ready for DOD, DOE, USACE, TPWD, and tier-1 prime contractor supplier diversity goals.
            </p>
          </div>
        </div>
      </section>

      {/* DUAL-SCOPE GEOGRAPHIC DOMINANCE: LOCAL TEXAS SERVICE AREA + NATIONWIDE SHIPPING */}
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="max-w-4xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-mono font-bold uppercase tracking-wider">
            <MapPin className="h-3.5 w-3.5 text-amber-400" /> Geographic Coverage &bull; Local &amp; Nationwide
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Local Texas Regional Delivery &amp; Nationwide Freight Dispatch
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Whether you need a same-day hot-shot emergency paddle blind dropped at a Texas Gulf Coast refinery or crated custom fabrication delivered to an industrial site anywhere in the country, Iron Prairie is equipped to fulfill your schedule.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Card 1: Local Texas Service Area */}
          <div className="rounded-2xl border border-sky-800/40 bg-slate-950/70 p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Texas Regional Service Area</h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded">
                  Local Priority
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Direct shop manufacturing and rapid order fulfillment for agricultural operators, refineries, chemical plants, and municipal entities across the Texas Gulf Coast and statewide.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-[11px] font-bold text-sky-300 uppercase tracking-wider">Core Local Service Regions:</div>
                <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Lake Jackson &amp; Brazoria County</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Freeport Petrochemical Hub</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Angleton &amp; Pearland Area</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Houston &amp; Texas City Plants</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Sweeny &amp; Bay City Corridor</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Statewide Texas Delivery</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>🔥 2-4 Hr Hot-Shot Courier Available</span>
              <Link to="/contact" className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1">
                Local Quote <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Card 2: Nationwide Shipping & Freight */}
          <div className="rounded-2xl border border-amber-500/40 bg-slate-950/70 p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Truck className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Nationwide Shipping (All 50 States)</h3>
                </div>
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                  Daily Dispatch
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                We crate, package, and ship ASME B16.48 paddle blinds, CNC plasma cut plate components, custom steel hardware, and modular assemblies anywhere in the United States.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Multi-Tier Nationwide Freight Logistics:</div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <PackageCheck className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>UPS Ground &amp; Express Parcel:</strong> Foam-wrapped and heavy-duty boxed dispatch for items under 150 lbs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Truck className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Palletized LTL Freight:</strong> Banded, shrink-wrapped, and protected pallet transport with liftgate delivery nationwide.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Traceable Paperwork:</strong> EN 10204 3.1 MTRs and packing slips included with every out-of-state order.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>⚡ Daily UPS &amp; Freight Carrier Pickups</span>
              <Link to="/storefront" className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1">
                Storefront Catalog <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CAPABILITY SNAPSHOT */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-brown/75">
              Capability Snapshot
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-brand-brown md:text-3xl">
              Professional delivery for private and public buyers
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700">
              Iron Prairie Fabrication Group LLC provides structural steel fabrication, high-definition CNC plasma plate cutting, custom livestock pens, tornado shelters, custom bunkers, and municipal infrastructure metalwork across Lake Jackson, Brazoria County, and statewide Texas with schedule discipline, plus seamless nationwide logistics across the United States.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex rounded-full border border-brand-brown/30 px-4 py-2 text-sm font-semibold text-brand-brown hover:bg-brand-brown/5"
          >
            Discuss Scope
          </Link>
        </div>

        <div className="mt-5 grid gap-4 text-sm md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Quality Fabrication</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-700">
              CNC plasma cutting, weldment, gates, fences, bunkers, shelters, safes, and custom steel
              builds designed for long service life.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Schedule Discipline</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-700">
              Clear scope confirmation, practical lead times, and status updates to reduce project
              uncertainty locally and nationwide.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Procurement Alignment</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-700">
              Support for PO, bid, and agency workflow expectations from local Texas public work through
              federal-ready growth.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Nationwide Logistics</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-700">
              Daily UPS Ground parcel, LTL freight, and hot-shot delivery across Texas and all 50 states with certified MTR compliance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

