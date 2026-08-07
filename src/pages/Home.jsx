import React from 'react';
import { Link } from 'react-router-dom';
import gatePhoto from '../assets/front-gate-no-trailer-v2~2.png';

export default function Home() {
  return (
    <div className="container-page space-y-10">
      <section className="grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:items-stretch md:gap-10">
        <div className="order-2 md:order-1">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-brown/80">
            Built to Last
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-brand-brown md:text-5xl">
            Built-to-last fabrication for ranches, industry, and agencies.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-muted">
            Iron Prairie Fabrication Group LLC delivers laser plate cutting, practical welding, and
            custom fabrication for agricultural operations, O&amp;G facilities, and public-sector
            projects, including gates, fence systems, custom bunkers, tornado shelters, and large
            built-in safes. We show up, do it right, and stand behind every weld.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
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
                Custom hog and livestock pens, farm and ranch equipment, plus ranch gates and
                fence-line fabrication for daily operations.
              </p>
            </div>
            <div className="rounded-lg bg-white/70 p-4 shadow-sm">
              <div className="font-semibold text-brand-brown">O&amp;G &amp; Industrial</div>
              <p className="mt-1">
                Laser-cut parts, machining on blind systems, and job-ready support components for
                plant and field environments.
              </p>
            </div>
            <div className="rounded-lg bg-white/70 p-4 shadow-sm">
              <div className="font-semibold text-brand-brown">Public Agencies</div>
              <p className="mt-1">
                Fire rings, fire pits, handrails, and infrastructure support for TPWD, National
                Parks, and local/state projects.
              </p>
            </div>
            <div className="rounded-lg bg-white/70 p-4 shadow-sm sm:col-span-3">
              <div className="font-semibold text-brand-brown">Secure Specialty Builds</div>
              <p className="mt-1">
                Custom bunkers, tornado shelter steelwork, and large built-in safes for properties,
                facilities, and protected storage needs.
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
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-brown/80">
              Woman-Owned Fabrication Partner
            </div>
            <p className="text-sm leading-relaxed text-slate-700">
              Field-proven on ranch and industrial jobs, with communication and documentation suited
              for public-sector procurement workflows.
            </p>
            <p className="text-xs text-slate-600">
              Growing toward SAM.gov registration to support DOE, DOD, and other federal buyers.
            </p>
          </div>
        </div>
      </section>

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
              Iron Prairie Fabrication Group LLC provides structural steel fabrication, high-precision laser plate cutting, custom livestock pens, tornado shelters, custom bunkers, and municipal infrastructure metalwork across Freeport, Lake Jackson, Brazoria County, and statewide Texas with schedule discipline and safety compliance.
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
              Laser cutting, weldment, gates, fences, bunkers, shelters, safes, and custom steel
              builds designed for long service life.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Schedule Discipline</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-700">
              Clear scope confirmation, practical lead times, and status updates to reduce project
              uncertainty.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Procurement Alignment</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-700">
              Support for PO, bid, and agency workflow expectations from local public work through
              federal-ready growth.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Safety Focus</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-700">
              Built for demanding sites with practical safety and compliance requirements across
              ranch, industrial, and park environments.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

