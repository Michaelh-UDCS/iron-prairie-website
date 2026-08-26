import React, { useState } from 'react';
import { Truck, MapPin, Phone, Mail, Clock, Flame, ShieldCheck, CheckCircle2, Building, Award, BadgeCheck } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="container-page grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <section>
        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-brown-light font-mono">
            Request a Quote &bull; Local &amp; Nationwide
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-panel-muted border border-brand-border px-2.5 py-0.5 text-[10px] font-bold text-brand-bone font-mono">
            Direct Estimating
          </span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-brand-bone md:text-4xl">
          Tell us what you need built or shipped.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-stone-300">
          Use this form for fabrication requests, replacement parts, ASME B16.48 paddle blinds, and public procurement bids. Whether you need local jobsite delivery in Texas or crated freight shipped nationwide, we provide fast, accurate quotes.
        </p>

        {submitted ? (
          <div className="mt-6 rounded-2xl bg-brand-panel border border-emerald-500/40 p-6 text-stone-200 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-base text-emerald-400">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span>Thank you! Your quote request has been received.</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Our estimators at <strong>Sales@ironprairiefabrication.com</strong> will review your specifications, calculate material and logistics, and follow up promptly with scope confirmation and pricing.
            </p>
          </div>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-medium text-brand-bone">
                  Name *
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="mt-1 w-full rounded-lg border border-brand-border bg-brand-panel px-3 py-2 text-sm text-brand-bone placeholder-stone-500 shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-organization" className="block text-xs font-medium text-brand-bone">
                  Organization / Company
                </label>
                <input
                  id="contact-organization"
                  name="organization"
                  type="text"
                  autoComplete="organization"
                  className="mt-1 w-full rounded-lg border border-brand-border bg-brand-panel px-3 py-2 text-sm text-brand-bone placeholder-stone-500 shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"
                  placeholder="Ranch, plant, contractor, or agency"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="contact-phone" className="block text-xs font-medium text-brand-bone">
                  Phone *
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="mt-1 w-full rounded-lg border border-brand-border bg-brand-panel px-3 py-2 text-sm text-brand-bone placeholder-stone-500 shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"
                  placeholder="Best number to reach you"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-medium text-brand-bone">
                  Email *
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 w-full rounded-lg border border-brand-border bg-brand-panel px-3 py-2 text-sm text-brand-bone placeholder-stone-500 shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="contact-project-type" className="block text-xs font-medium text-brand-bone">
                  Project Type
                </label>
                <select
                  id="contact-project-type"
                  name="projectType"
                  className="mt-1 w-full rounded-lg border border-brand-border bg-brand-panel px-3 py-2 text-sm text-brand-bone shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"
                >
                  <option className="bg-brand-panel text-brand-bone">ASME B16.48 Paddle Blinds / Spacers</option>
                  <option className="bg-brand-panel text-brand-bone">CNC Plasma Cutting / Weldment</option>
                  <option className="bg-brand-panel text-brand-bone">Agriculture / Ranch Equipment</option>
                  <option className="bg-brand-panel text-brand-bone">Gates / Fences</option>
                  <option className="bg-brand-panel text-brand-bone">Custom Bunker / Tornado Shelter</option>
                  <option className="bg-brand-panel text-brand-bone">Large Built-In Safe</option>
                  <option className="bg-brand-panel text-brand-bone">O&amp;G / Industrial Replacement Parts</option>
                  <option className="bg-brand-panel text-brand-bone">Parks / Public Infrastructure</option>
                  <option className="bg-brand-panel text-brand-bone">State or Federal Agency Request</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-logistics" className="block text-xs font-medium text-brand-bone">
                  Delivery / Logistics Preference
                </label>
                <select
                  id="contact-logistics"
                  name="logisticsPreference"
                  className="mt-1 w-full rounded-lg border border-brand-border bg-brand-panel px-3 py-2 text-sm text-brand-bone shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"
                >
                  <option className="bg-brand-panel text-brand-bone">Local Texas Regional Delivery / Jobsite Drop-Off</option>
                  <option className="bg-brand-panel text-brand-bone">Local Shop Pickup (200 County Rd 170, Bay City, TX 77414)</option>
                  <option className="bg-brand-panel text-brand-bone">⚡ Texas Emergency Hot-Shot Courier (2-4 Hr Burn)</option>
                  <option className="bg-brand-panel text-brand-bone">📦 Nationwide UPS Ground Parcel (All 50 States)</option>
                  <option className="bg-brand-panel text-brand-bone">🚛 Nationwide Palletized LTL Freight with Liftgate (All 50 States)</option>
                  <option className="bg-brand-panel text-brand-bone">🚚 Dedicated Flatbed Truckload (Out-of-State / Heavy Steel)</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="contact-location" className="block text-xs font-medium text-brand-bone">
                  Jobsite City / State / ZIP
                </label>
                <input
                  id="contact-location"
                  name="location"
                  type="text"
                  className="mt-1 w-full rounded-lg border border-brand-border bg-brand-panel px-3 py-2 text-sm text-brand-bone placeholder-stone-500 shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"
                  placeholder="e.g. Freeport TX 77541 or Denver CO 80202"
                />
              </div>
              <div>
                <label htmlFor="contact-bid-ref" className="block text-xs font-medium text-brand-bone">
                  Bid / Solicitation / PO Reference
                </label>
                <input
                  id="contact-bid-ref"
                  name="bidReference"
                  type="text"
                  className="mt-1 w-full rounded-lg border border-brand-border bg-brand-panel px-3 py-2 text-sm text-brand-bone placeholder-stone-500 shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"
                  placeholder="RFP, IFB, internal project code, or PO#"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-details" className="block text-xs font-medium text-brand-bone">
                Project Details &amp; Specifications
              </label>
              <textarea
                id="contact-details"
                name="projectDetails"
                rows={4}
                className="mt-1 w-full rounded-lg border border-brand-border bg-brand-panel px-3 py-2 text-sm text-brand-bone placeholder-stone-500 shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"
                placeholder="Sizes, plate thicknesses, materials (516-70, SA-516-70, 304L, 316L), target dates, and shipping destination details."
              />
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed">
              This form connects directly with our shop estimators for rapid scope confirmation, pricing, and freight logistics.
            </p>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-brown hover:bg-brand-brown-light px-6 py-3 text-sm font-bold text-brand-ivory shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-brown active:scale-95 transition-all"
            >
              Submit Quote Request
            </button>
          </form>
        )}
      </section>

      {/* SIDEBAR */}
      <aside className="space-y-6">
        <div className="rounded-2xl bg-brand-panel p-5 shadow-sm border border-brand-border space-y-3">
          <h2 className="text-sm font-bold text-brand-bone uppercase tracking-wide">Direct Shop Inquiries</h2>
          <div className="space-y-2 text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-brown-light shrink-0" />
              <span>Phone: <a href="tel:+19792489266" className="font-bold text-brand-bone underline hover:text-brand-brown-light">(979) 248-9266</a></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand-brown-light shrink-0" />
              <span>Email: <a href="mailto:Sales@ironprairiefabrication.com" className="font-bold text-brand-bone underline hover:text-brand-brown-light">Sales@ironprairiefabrication.com</a></span>
            </div>
            <div className="flex items-start gap-2 pt-1">
              <MapPin className="h-4 w-4 text-brand-brown-light shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-brand-bone">Facility Location:</div>
                <div className="text-stone-400">200 County Rd 170, Bay City, TX 77414 (Matagorda County)</div>
                <a href="https://www.google.com/maps/search/?api=1&query=200+County+Rd+170,+Bay+City,+TX+77414" target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold text-brand-brown-light underline hover:text-brand-bone block mt-0.5">
                  View on Google Maps &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-brand-panel-muted border border-brand-border p-5 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 text-brand-bone font-bold text-xs uppercase tracking-wider">
            <BadgeCheck className="h-4 w-4 text-brand-brown-light" />
            <span>Government &amp; Agency Procurement</span>
          </div>
          <div className="text-xs text-stone-300 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-400">Contractor Status:</span>
              <span className="bg-brand-panel text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">SAM.gov Active</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">Unique Entity Identifier (UEI):</span>
              <span className="font-mono text-xs font-black text-brand-bone bg-brand-panel px-2.5 py-1 rounded-md border border-brand-border inline-block tracking-wider mt-0.5">
                XX7XCMGN9XD5
              </span>
            </div>
            <p className="text-[11px] text-stone-400 pt-1 leading-relaxed">
              Procurement-ready for municipal, state (TPWD, TxDOT), and federal prime/subcontracts nationwide.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-brand-border bg-brand-panel text-stone-300 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-brand-brown-light font-bold text-xs uppercase tracking-wider">
            <Truck className="h-4 w-4 text-brand-brown-light" />
            <span>Fulfillment &amp; Shipping Reach</span>
          </div>
          <div className="space-y-2 text-xs text-stone-400">
            <div>
              <strong className="text-brand-bone block">Texas Regional Service Area:</strong>
              <span>Bay City, Matagorda, Freeport, Lake Jackson, Angleton, Pearland, Houston, Texas City, and statewide Texas. Same-day emergency hot-shot courier available.</span>
            </div>
            <div className="pt-2 border-t border-brand-border">
              <strong className="text-brand-bone block">Nationwide Shipping (All 50 States):</strong>
              <span>Daily UPS Ground parcel for boxed blinds and parts; palletized LTL freight and dedicated flatbed transport for bulk orders and heavy equipment.</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

