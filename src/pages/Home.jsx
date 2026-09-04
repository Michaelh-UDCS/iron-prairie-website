import React from 'react';
import { Link } from 'react-router-dom';
import gatePhoto from '../assets/front-gate-no-trailer-v2~2.png';
import { Truck, MapPin, ShieldCheck, PackageCheck, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-0 w-full">
      {/* FULL-BLEED HERO — Edge-to-edge custom fabrication showcase with perfectly scaled gate media */}
      <section className="home-hero border-b border-brand-border" aria-label="Iron Prairie Fabrication Group hero">
        {/* Right-aligned edge-to-edge media plane */}
        <div className="home-hero__media-wrapper" aria-hidden="true">
          <picture className="w-full h-full block">
            <source media="(max-width: 640px)" srcSet="/images/hero-gate-mobile.webp" type="image/webp" />
            <source srcSet="/images/hero-gate.webp" type="image/webp" />
            <img
              src="/images/hero-gate.webp"
              alt="Custom fabricated ranch gate and fence installation by Iron Prairie Fabrication Group LLC"
              width="1024"
              height="768"
              fetchpriority="high"
              decoding="async"
              className="home-hero__media"
            />
          </picture>
          <div className="home-hero__media-fade" />
        </div>

        {/* Hero Content Container */}
        <div className="home-hero__content">
          <div className="max-w-xl xl:max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-brand-brown/20 border border-brand-brown/40 text-brand-bone text-xs font-mono font-bold uppercase tracking-wider">
              <MapPin className="h-3.5 w-3.5 text-brand-brown-light shrink-0" aria-hidden="true" />
              <span>Custom Fabrication Shop · Bay City, TX · Ships All 50 States</span>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-brown-light font-mono">
                Iron Prairie Fabrication Group LLC
              </p>
              <h1 className="home-hero__brand">
                Custom Metal Fabrication &amp; Precision Steelwork
              </h1>
            </div>

            <p className="home-hero__support">
              Built-to-last metal for ranches, agriculture, commercial builders, and agencies. From architectural entrance gates and livestock handling systems to CNC plasma cutting, structural steel, and ASME components from Bay City, TX.
            </p>

            <div className="home-hero__ctas">
              <Link to="/contact" className="btn-primary">
                <ShieldCheck className="h-4 w-4 fill-white text-brand-brown" aria-hidden="true" />
                <span>Request Custom Quote</span>
              </Link>
              <Link to="/services" className="btn-secondary">
                <span>View Custom Capabilities</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {/* B2B Catalog Secondary Link */}
            <div className="pt-0.5">
              <Link to="/paddle-blinds" className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-300 hover:text-brand-ivory transition-colors">
                <Zap className="h-3.5 w-3.5 text-brand-brown-light shrink-0" aria-hidden="true" />
                <span>Also manufacturing ASME B16.48 Paddle Blinds &amp; Spacers — View Catalog &rarr;</span>
              </Link>
            </div>

            {/* Capability highlights — Core Custom Fabrication */}
            <div className="pt-4 border-t border-brand-border/60 grid grid-cols-3 gap-2 text-xs font-mono text-stone-300">
              <div>
                <span className="text-brand-brown-light font-bold">Custom</span> Ranch Gates
              </div>
              <div>
                <span className="text-brand-brown-light font-bold">Ag &amp; Livestock</span> Steel
              </div>
              <div>
                <span className="text-brand-brown-light font-bold">CNC Plasma</span> &amp; Welding
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page space-y-10">
        {/* Core Custom Capabilities & Markets */}
        <section className="section-reveal grid gap-4 text-xs text-slate-800 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-4 shadow-sm border border-stone-200/80">
            <div className="font-bold text-brand-brown">Ranch &amp; Agricultural Steel</div>
            <p className="mt-1 text-slate-600">
              Custom entrance gates, livestock handling pens, cattle guards, hog traps, farm equipment repairs, and fence-line steel.
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm border border-stone-200/80">
            <div className="font-bold text-brand-brown">Industrial &amp; Structural Fabrication</div>
            <p className="mt-1 text-slate-600">
              High-definition CNC plasma plate cutting, structural weldments, pipe welding, equipment skids, and custom assemblies.
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm border border-stone-200/80">
            <div className="font-bold text-brand-brown">Public Agencies &amp; Municipalities</div>
            <p className="mt-1 text-slate-600">
              Park infrastructure, fire rings, pedestrian handrails, and municipal steel structures for TPWD, county, and state entities.
            </p>
          </div>
          <Link to="/paddle-blinds" className="rounded-xl bg-brand-brown/5 border border-brand-brown/30 p-4 shadow-sm block hover:bg-brand-brown/10 transition-colors group sm:col-span-2">
            <div className="font-bold text-brand-brown flex items-center justify-between">
              <span>Manufactured Product Line: ASME B16.48 Paddle Blinds &amp; Spacers</span>
              <span className="text-[10px] bg-brand-brown text-white px-2 py-0.5 rounded font-mono font-bold">ONLINE CATALOG</span>
            </div>
            <p className="mt-1 text-slate-700">
              In-house manufactured positive isolation paddle blinds &amp; spacers (150# - 2500#). Fast turnaround matrix ordering, certified MTRs, and direct shipping nationwide.
            </p>
          </Link>
          <div className="rounded-xl bg-white p-4 shadow-sm border border-stone-200/80">
            <div className="font-bold text-brand-brown">Secure Specialty Builds</div>
            <p className="mt-1 text-slate-600">
              Custom storm shelters, underground bunkers, and heavy-gauge steel safe construction for properties.
            </p>
          </div>
        </section>

        {/* DUAL-SCOPE GEOGRAPHIC DOMINANCE */}
        <section className="section-reveal rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-sm">
          <div className="max-w-4xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-brown/10 text-brand-brown border border-brand-brown/20 text-xs font-mono font-bold uppercase tracking-wider">
              <MapPin className="h-3.5 w-3.5 text-brand-brown" aria-hidden="true" /> Geographic Coverage &bull; Local &amp; Nationwide
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-brown font-display">
              Local Texas Regional Delivery &amp; Nationwide Freight Dispatch
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Iron Prairie Fabrication Group LLC ships same-day Texas Gulf Coast hot-shots and daily nationwide freight from Bay City, TX. Boxed ASME paddle blinds move by parcel; heavy assemblies ship LTL or flatbed to all 50 states on buyer schedules.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-brand-brown/10 border border-brand-brown/20 flex items-center justify-center text-brand-brown">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Texas Regional Service Area</h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-brand-brown/10 text-brand-brown border border-brand-brown/30 px-2 py-0.5 rounded">
                    Local Priority
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Direct shop manufacturing and rapid order fulfillment for agricultural operators, refineries, chemical plants, and municipal entities across the Texas Gulf Coast and statewide.
                </p>
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Core Local Service Regions:</div>
                  <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" /> Bay City &amp; Matagorda County</div>
                    <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" /> Freeport Petrochemical Hub</div>
                    <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" /> Lake Jackson &amp; Angleton</div>
                    <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" /> Houston &amp; Texas City Plants</div>
                    <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" /> Sweeny &amp; Old Ocean Refineries</div>
                    <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" /> Statewide Texas Delivery</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs text-slate-600 font-mono">
                <span>2-4 Hr Hot-Shot Courier Available</span>
                <Link to="/contact" className="text-brand-brown hover:text-brand-brown-light font-bold flex items-center gap-1">
                  Local Quote <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-brand-brown/10 border border-brand-brown/20 flex items-center justify-center text-brand-brown">
                      <Truck className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Nationwide Shipping (All 50 States)</h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-brand-brown/10 text-brand-brown border border-brand-brown/30 px-2 py-0.5 rounded">
                    Daily Dispatch
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  We crate, package, and ship ASME B16.48 paddle blinds, CNC plasma cut plate components, custom steel hardware, and modular assemblies anywhere in the United States.
                </p>
                <div className="space-y-2 pt-2 border-t border-stone-200">
                  <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Multi-Tier Nationwide Freight Logistics:</div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <PackageCheck className="h-3.5 w-3.5 text-brand-brown shrink-0 mt-0.5" aria-hidden="true" />
                      <span><strong>UPS Ground &amp; Express Parcel:</strong> Foam-wrapped and reinforced boxed dispatch for items under 150 lbs.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Truck className="h-3.5 w-3.5 text-brand-brown shrink-0 mt-0.5" aria-hidden="true" />
                      <span><strong>Palletized LTL Freight:</strong> Banded, shrink-wrapped, and protected pallet transport with liftgate delivery nationwide.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span><strong>Traceable Paperwork:</strong> EN 10204 3.1 MTRs and packing slips included with every out-of-state order.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs text-slate-600 font-mono">
                <span>Daily UPS &amp; Freight Carrier Pickups</span>
                <Link to="/paddle-blinds" className="text-brand-brown hover:text-brand-brown-light font-bold flex items-center gap-1">
                  ASME Paddle Blinds <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CAPABILITY SNAPSHOT */}
        <section className="section-reveal rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-brown/80 font-mono">
                Capability Snapshot
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-brand-brown md:text-3xl">
                Professional delivery for private and public buyers
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700">
                Iron Prairie Fabrication Group LLC provides structural steel fabrication, high-definition CNC plasma plate cutting, custom livestock pens, tornado shelters, custom bunkers, and municipal infrastructure metalwork across Bay City, Matagorda County, the Texas Gulf Coast, and statewide Texas with schedule discipline, plus seamless nationwide logistics across the United States.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex rounded-full border border-brand-brown/40 px-4 py-2 text-sm font-semibold text-brand-brown hover:bg-brand-brown/5 transition-all"
            >
              Discuss Scope
            </Link>
          </div>

          <div className="mt-5 grid gap-4 text-sm md:grid-cols-4">
            <div className="rounded-xl border border-stone-200/80 bg-stone-50/50 p-4">
              <h3 className="font-semibold text-slate-900">Quality Fabrication</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-700">
                CNC plasma cutting, weldment, gates, fences, bunkers, shelters, safes, and custom steel
                builds designed for long service life.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200/80 bg-stone-50/50 p-4">
              <h3 className="font-semibold text-slate-900">Schedule Discipline</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-700">
                Clear scope confirmation, practical lead times, and status updates to reduce project
                uncertainty locally and nationwide.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200/80 bg-stone-50/50 p-4">
              <h3 className="font-semibold text-slate-900">Procurement Alignment</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-700">
                Support for PO, bid, and agency workflow expectations from local Texas public work through
                federal-ready growth.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200/80 bg-stone-50/50 p-4">
              <h3 className="font-semibold text-slate-900">Nationwide Logistics</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-700">
                Daily UPS Ground parcel, LTL freight, and hot-shot delivery across Texas and all 50 states with certified MTR compliance.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-reveal rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-brown/80 font-mono">
              Direct Answers
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-brand-brown md:text-3xl">
              Fabrication questions buyers ask first
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700">
              Iron Prairie Fabrication Group LLC answers scope, ownership, and shipping questions upfront so procurement teams and ranch buyers can decide fast without waiting on a sales call.
            </p>
          </div>
          <div className="space-y-3">
            <details className="rounded-xl border border-stone-200 bg-stone-50/60 p-4" name="home-faq">
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                What custom metal fabrication services does Iron Prairie Fabrication Group provide?
              </summary>
              <p className="mt-2 text-xs leading-relaxed text-slate-700">
                Iron Prairie Fabrication Group LLC provides structural steel fabrication, high-precision CNC plasma plate cutting, ASME B16.48 positive isolation paddle blinds, custom agricultural and ranch equipment, pipe welding, municipal infrastructure components, tornado shelters, custom bunkers, and large built-in safes with nationwide shipping.
              </p>
            </details>
            <details className="rounded-xl border border-stone-200 bg-stone-50/60 p-4" name="home-faq">
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                Is Iron Prairie Fabrication Group a certified woman-owned business?
              </summary>
              <p className="mt-2 text-xs leading-relaxed text-slate-700">
                Yes, Iron Prairie Fabrication Group LLC is a certified woman-owned metal fabrication enterprise based in Bay City, Texas, serving industrial plants, agricultural operators, and state and federal public agencies locally and nationwide.
              </p>
            </details>
            <details className="rounded-xl border border-stone-200 bg-stone-50/60 p-4" name="home-faq">
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                Does Iron Prairie Fabrication Group ship nationwide across the United States?
              </summary>
              <p className="mt-2 text-xs leading-relaxed text-slate-700">
                Yes, Iron Prairie Fabrication Group LLC ships daily across all 50 US states using UPS Ground parcel for boxed blinds and precision parts, plus palletized LTL freight and dedicated flatbed trucking for bulk orders and heavy equipment.
              </p>
            </details>
          </div>
        </section>
      </div>
    </div>
  );
}
