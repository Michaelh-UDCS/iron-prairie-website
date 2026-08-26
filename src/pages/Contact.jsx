import React, { useState } from 'react';
import { Truck, MapPin, Phone, Mail, Clock, Flame, ShieldCheck, CheckCircle2, Building, Award, BadgeCheck } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="container-page grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <section>
        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-brown/80 font-mono">
            Request a Quote &bull; Local &amp; Nationwide
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-brown/10 border border-brand-brown/30 px-2.5 py-0.5 text-[10px] font-bold text-brand-brown font-mono">
            Direct Estimating
          </span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-brand-brown md:text-4xl">
          Tell us what you need built or shipped.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-700">
          Use this form for fabrication requests, replacement parts, ASME B16.48 paddle blinds, and public procurement bids. Whether you need local jobsite delivery in Texas or crated freight shipped nationwide, we provide fast, accurate quotes.
        </p>

        {submitted ? (
          <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-300 p-6 text-emerald-900 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-base">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>Thank you! Your quote request has been received.</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
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
                <label htmlFor="contact-name" className="block text-xs font-medium text-slate-800">
                  Name *
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-organization" className="block text-xs font-medium text-slate-800">
                  Organization / Company
                </label>
                <input
                  id="contact-organization"
                  name="organization"
                  type="text"
                  autoComplete="organization"
                  className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"
                  placeholder="Ranch, plant, contractor, or agency"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="contact-phone" className="block text-xs font-medium text-slate-800">
                  Phone *
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"
                  placeholder="Best number to reach you"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-medium text-slate-800">
                  Email *
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="contact-project-type" className="block text-xs font-medium text-slate-800">
                  Project Type
                </label>
                <select
                  id="contact-project-type"
                  name="projectType"
                  className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"
                >
                  <option>ASME B16.48 Paddle Blinds / Spacers</option>
                  <option>CNC Plasma Cutting / Weldment</option>
                  <option>Agriculture / Ranch Equipment</option>
                  <option>Gates / Fences</option>
                  <option>Custom Bunker / Tornado Shelter</option>
                  <option>Large Built-In Safe</option>
                  <option>O&amp;G / Industrial Replacement Parts</option>
                  <option>Parks / Public Infrastructure</option>
                  <option>State or Federal Agency Request</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-logistics" className="block text-xs font-medium text-slate-800">
                  Delivery / Logistics Preference
                </label>
                <select
                  id="contact-logistics"
                  name="logisticsPreference"
                  className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"
                >
                  <option>Local Texas Regional Delivery / Jobsite Drop-Off</option>
                  <option>Local Shop Pickup (200 County Rd 170, Bay City, TX 77414)</option>
                  <option>⚡ Texas Emergency Hot-Shot Courier (2-4 Hr Burn)</option>
                  <option>📦 Nationwide UPS Ground Parcel (All 50 States)</option>
                  <option>🚛 Nationwide Palletized LTL Freight with Liftgate (All 50 States)</option>
                  <option>🚚 Dedicated Flatbed Truckload (Out-of-State / Heavy Steel)</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="contact-location" className="block text-xs font-medium text-slate-800">
                  Jobsite City / State / ZIP
                </label>
                <input
                  id="contact-location"
                  name="location"
                  type="text"
                  className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"
                  placeholder="e.g. Freeport TX 77541 or Denver CO 80202"
                />
              </div>
              <div>
                <label htmlFor="contact-bid-ref" className="block text-xs font-medium text-slate-800">
                  Bid / Solicitation / PO Reference
                </label>
                <input
                  id="contact-bid-ref"
                  name="bidReference"
                  type="text"
                  className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"
                  placeholder="RFP, IFB, internal project code, or PO#"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-details" className="block text-xs font-medium text-slate-800">
                Project Details &amp; Specifications
              </label>
              <textarea
                id="contact-details"
                name="projectDetails"
                rows={4}
                className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"
                placeholder="Sizes, plate thicknesses, materials (516-70, SA-516-70, 304L, 316L), target dates, and shipping destination details."
              />
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              This form connects directly with our shop estimators for rapid scope confirmation, pricing, and freight logistics.
            </p>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-brown px-6 py-3 text-sm font-bold text-white shadow-md shadow-brand-brown/20 hover:bg-brand-brown-light focus:outline-none focus:ring-2 focus:ring-brand-brown active:scale-95 transition-all"
            >
              Submit Quote Request
            </button>
          </form>
        )}
      </section>

      {/* SIDEBAR */}
      <aside className="space-y-6">
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-stone-200/80 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Direct Shop Inquiries</h2>
          <div className="space-y-2 text-xs text-slate-800">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-brown shrink-0" />
              <span>Phone: <a href="tel:+19792489266" className="font-bold text-brand-brown underline hover:text-brand-brown-light">(979) 248-9266</a></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand-brown shrink-0" />
              <span>Email: <a href="mailto:Sales@ironprairiefabrication.com" className="font-bold text-brand-brown underline hover:text-brand-brown-light">Sales@ironprairiefabrication.com</a></span>
            </div>
            <div className="flex items-start gap-2 pt-1">
              <MapPin className="h-4 w-4 text-brand-brown shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">Facility Location:</div>
                <div className="text-slate-600">200 County Rd 170, Bay City, TX 77414 (Matagorda County)</div>
                <a href="https://www.google.com/maps/search/?api=1&query=200+County+Rd+170,+Bay+City,+TX+77414" target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold text-brand-brown underline hover:text-brand-brown-light block mt-0.5">
                  View on Google Maps &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-brand-brown/5 border border-brand-brown/20 p-5 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 text-brand-brown font-bold text-xs uppercase tracking-wider">
            <BadgeCheck className="h-4 w-4 text-brand-brown" />
            <span>Government &amp; Agency Procurement</span>
          </div>
          <div className="text-xs text-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Contractor Status:</span>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">SAM.gov Active</span>
            </div>
            <div>
              <span className="text-slate-600 block text-[11px]">Unique Entity Identifier (UEI):</span>
              <span className="font-mono text-xs font-black text-brand-brown bg-white px-2.5 py-1 rounded-md border border-brand-brown/30 inline-block tracking-wider mt-0.5">
                XX7XCMGN9XD5
              </span>
            </div>
            <p className="text-[11px] text-slate-600 pt-1 leading-relaxed">
              Procurement-ready for municipal, state (TPWD, TxDOT), and federal prime/subcontracts nationwide.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-brand-border bg-brand-panel text-white p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-brand-brown-light font-bold text-xs uppercase tracking-wider">
            <Truck className="h-4 w-4 text-brand-brown-light" />
            <span>Fulfillment &amp; Shipping Reach</span>
          </div>
          <div className="space-y-2 text-xs text-stone-300">
            <div>
              <strong className="text-white block">Texas Regional Service Area:</strong>
              <span>Bay City, Matagorda, Freeport, Lake Jackson, Angleton, Pearland, Houston, Texas City, and statewide Texas. Same-day emergency hot-shot courier available.</span>
            </div>
            <div className="pt-2 border-t border-brand-border">
              <strong className="text-white block">Nationwide Shipping (All 50 States):</strong>
              <span>Daily UPS Ground parcel for boxed blinds and parts; palletized LTL freight and dedicated flatbed transport for bulk orders and heavy equipment.</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
