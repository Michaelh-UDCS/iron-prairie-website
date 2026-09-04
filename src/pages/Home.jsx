import React from 'react';
import { Link } from 'react-router-dom';
import gatePhoto from '../assets/front-gate-no-trailer-v2~2.png';
import { Truck, MapPin, ShieldCheck, PackageCheck, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-0">
      {/* FULL-BLEED HERO — brand + headline + support + CTAs + edge-to-edge gate media */}
      <section className="home-hero" aria-label="Iron Prairie Fabrication Group hero">
        <picture>
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
        <div className="home-hero__veil" aria-hidden="true" />
        <div className="home-hero__content">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-bone/80 font-mono mb-3">
            Bay City, Texas · Ships All 50 States
          </p>
          <h1 className="home-hero__brand">
            Iron Prairie Fabrication Group LLC
          </h1>
          <p className="home-hero__support">
            Built-to-last metal for ranches, industry, and agencies — ASME paddle blinds, CNC plasma, and custom steel from Bay City, TX.
          </p>
          <div className="home-hero__ctas">
            <Link to="/storefront" className="btn-primary">
              <Zap className="h-4 w-4 fill-white" aria-hidden="true" />
              Paddle Blinds Catalog
            </Link>
            <Link to="/contact" className="btn-secondary">
              Request a Quote
            </Link>
          </div>
        </div>
      </section>

      <div className="container-page space-y-10">
        {/* Audience lanes — below first viewport */}
        <section className="section-reveal grid gap-4 text-xs text-slate-800 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-4 shadow-sm border border-stone-200/80">
            <div className="font-bold text-brand-brown">Agriculture &amp; Ranch</div>
            <p className="mt-1 text-slate-600">
              Custom hog and livestock pens, farm equipment, ranch gates, and fence-line steel fabrication.
            </p>
          </div>
          <Link to="/paddle-blinds" className="rounded-xl bg-brand-brown/5 border border-brand-brown/30 p-4 shadow-sm block hover:bg-brand-brown/10 transition-colors group">
            <div className="font-bold text-brand-brown flex items-center justify-between">
              <span>O&amp;G &amp; Paddle Blinds</span>
              <span className="text-[10px] bg-brand-brown text-white px-1.5 py-0.5 rounded font-black">CATALOG</span>
            </div>
            <p className="mt-1 text-slate-700">
              ASME B16.48 paddle blinds &amp; spacers. Fast turnaround grid ordering, traceable MTRs, and direct shipping.
            </p>
          </Link>
          <div className="rounded-xl bg-white p-4 shadow-sm border border-stone-200/80">
            <div className="font-bold text-brand-brown">Public Agencies</div>
            <p className="mt-1 text-slate-600">
              Fire rings, fire pits, handrails, and park infrastructure for TPWD, National Parks, and municipal entities.
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm border border-stone-200/80 sm:col-span-3">
            <div className="font-bold text-brand-brown">Secure Specialty Builds</div>
            <p className="mt-1 text-slate-600">
              Custom bunkers, tornado shelter steelwork, and large built-in safes for properties and protected storage.
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
                      <span><strong>UPS Ground &amp; Express Parcel:</strong> Foam-wrapped and heavy-duty boxed dispatch for items under 150 lbs.</span>
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
