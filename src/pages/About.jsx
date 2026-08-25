import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Truck, ShieldCheck, Flame, CheckCircle2, Clock, PackageCheck, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="container-page space-y-10">
      {/* STORY HEADER */}
      <section className="max-w-3xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-brown/80">
            Our Story &amp; Reach
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-300 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 font-mono">
            Texas Shop &bull; Nationwide Logistics
          </span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-brand-brown md:text-4xl">
          A practical fabrication shop built for hard-use work.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-800">
          Iron Prairie Fabrication Group LLC was founded to deliver rugged, precision metal fabrication for the operations that power Texas and the nation: agricultural ranches, petrochemical refineries, pipeline operators, and public agencies. As a certified woman-owned business based in Lake Jackson, Texas, we combine hands-on craftsmanship with schedule discipline, traceable quality, and dependable delivery.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-800">
          Whether we&apos;re cutting custom CNC plasma plate parts for a local ranch, manufacturing ASME B16.48 positive isolation paddle blinds for an emergency turnaround in Freeport, or shipping palletized blind runs to industrial plants across the United States, our commitment never wavers: show up, do it right, and stand behind every weld.
        </p>
      </section>

      {/* CORE OPERATING PILLARS */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white/80 p-5 shadow-sm border border-slate-200/60">
          <h2 className="text-sm font-semibold text-brand-brown flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Grounded in Safety &amp; Quality</span>
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-700">
            We enforce rigorous QA/QC practices, full mill heat traceability on all raw plate, and certified EN 10204 3.1 Material Test Reports (MTRs) for mission-critical industrial applications.
          </p>
        </div>
        <div className="rounded-xl bg-white/80 p-5 shadow-sm border border-slate-200/60">
          <h2 className="text-sm font-semibold text-brand-brown flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-600" />
            <span>Built for High-Uptime Operations</span>
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-700">
            We support buyers across agriculture, industrial, and public sectors with transparent pricing, instant proposals, and rapid turnaround lead times designed to prevent downtime.
          </p>
        </div>
        <div className="rounded-xl bg-white/80 p-5 shadow-sm border border-slate-200/60">
          <h2 className="text-sm font-semibold text-brand-brown flex items-center gap-2">
            <Clock className="h-4 w-4 text-sky-600" />
            <span>Procurement &amp; Agency Mindset</span>
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-700">
            We streamline commercial purchasing with Net 30 PO authorization, ACH debit, credit card checkout, and alignment with municipal, state (TPWD), and federal procurement requirements.
          </p>
        </div>
      </section>

      {/* DUAL-FOCUS GEOGRAPHIC FOOTPRINT: LOCAL SERVICE AREA + NATIONWIDE SHIPPING */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-brown/80">
            Service Footprint &amp; Fulfillment Matrix
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-slate-900">
            Local Texas Field Presence &bull; Daily Nationwide Shipping
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            Our strategic facility in Lake Jackson gives us immediate highway access to the Texas Gulf Coast industrial corridor while our integrated logistics network provides daily parcel and freight dispatch across all 50 states.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Box 1: Local Texas Service Area */}
          <div className="rounded-2xl bg-brand-brown/95 p-6 text-brand-ivory shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Primary Texas Regional Service Area
                </h3>
                <span className="text-[10px] font-mono font-bold bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded border border-amber-300/30">
                  Local Field Service
                </span>
              </div>
              <p className="text-xs leading-relaxed text-brand-ivory/90">
                Direct shop coordination, on-site measurements, and fast jobsite delivery for ranches, municipal facilities, and petrochemical plants across Brazoria County, Greater Houston, and the Texas Gulf Coast.
              </p>
              <div className="space-y-1.5 pt-2 border-t border-brand-ivory/20 text-xs">
                <div className="font-semibold text-amber-300 text-[11px] uppercase tracking-wider">Dedicated Local Coverage:</div>
                <div className="grid grid-cols-2 gap-1 text-brand-ivory/85">
                  <div>&bull; Lake Jackson &amp; Clute</div>
                  <div>&bull; Freeport Industrial Area</div>
                  <div>&bull; Angleton &amp; Danbury</div>
                  <div>&bull; Pearland &amp; Alvin</div>
                  <div>&bull; Sweeny &amp; Old Ocean</div>
                  <div>&bull; Houston &amp; Texas City</div>
                  <div>&bull; Bay City &amp; Matagorda</div>
                  <div>&bull; Statewide Texas Delivery</div>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-brand-ivory/20 text-xs font-mono text-amber-200">
              🔥 2-4 Hr Same-Day Emergency Hot-Shot Courier Dispatch
            </div>
          </div>

          {/* Box 2: Nationwide Delivery */}
          <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Nationwide Shipping &amp; Freight Logistics
                </h3>
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  All 50 States
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-300">
                We package, crate, and ship ASME B16.48 paddle blinds, custom CNC plasma plate cuts, spec blinds, and custom steel components to contractors, refineries, and buyers nationwide.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="font-semibold text-amber-400 text-[11px] uppercase tracking-wider">Logistics Capabilities:</div>
                <div className="space-y-1 text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span><strong>UPS Ground &amp; Next-Day Air:</strong> Daily parcel courier dispatch.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span><strong>Palletized LTL Freight:</strong> Crating &amp; liftgate delivery for heavy orders.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span><strong>Dedicated Flatbed:</strong> Direct-to-jobsite delivery for oversized steel.</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
              <span>⚡ Seamless Online Quotes &amp; Orders</span>
              <Link to="/contact" className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1">
                Get a Quote <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

