import React, { useState } from 'react';
import { Truck, MapPin, Phone, Mail, Clock, Flame, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="container-page grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <section>
        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-brown/80">
            Request a Quote &bull; Local &amp; Nationwide
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-300 px-2 py-0.5 text-[10px] font-bold text-slate-700 font-mono">
            Direct Estimating
          </span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-brand-brown md:text-4xl">
          Tell us what you need built or shipped.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-800">
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
                  className="mt-1 w-full rounded-md border border-brand-brown/30 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown/40"
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
                  className="mt-1 w-full rounded-md border border-brand-brown/30 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown/40"
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
                  className="mt-1 w-full rounded-md border border-brand-brown/30 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown/40"
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
                  className="mt-1 w-full rounded-md border border-brand-brown/30 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown/40"
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
                  className="mt-1 w-full rounded-md border border-brand-brown/30 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown/40"
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
                  className="mt-1 w-full rounded-md border border-brand-brown/30 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown/40"
                >
                  <option>Local Texas Field Drop-Off / Jobsite Delivery</option>
                  <option>Local Shop Pickup (Lake Jackson, TX)</option>
                  <option>🔥 Texas Emergency Hot-Shot Courier (2-4 Hr Burn)</option>
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
                  className="mt-1 w-full rounded-md border border-brand-brown/30 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown/40"
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
                  className="mt-1 w-full rounded-md border border-brand-brown/30 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown/40"
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
                className="mt-1 w-full rounded-md border border-brand-brown/30 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown/40"
                placeholder="Sizes, plate thicknesses, materials (A516-70, 304L, 316L), target dates, and shipping destination details."
              />
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              This form connects directly with our shop estimators for rapid scope confirmation, pricing, and freight logistics.
            </p>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-brown px-6 py-3 text-sm font-semibold text-brand-ivory shadow-sm hover:bg-brand-brown/90 focus:outline-none focus:ring-2 focus:ring-brand-brown/50 active:scale-95 transition-all"
            >
              Submit Quote Request
            </button>
          </form>
        )}
      </section>

      {/* SIDEBAR */}
      <aside className="space-y-6">
        <div className="rounded-2xl bg-white/80 p-5 shadow-sm border border-slate-200/70 space-y-3">
          <h2 className="text-sm font-bold text-brand-brown uppercase tracking-wide">Direct Shop Inquiries</h2>
          <div className="space-y-2 text-xs text-slate-800">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-sky-700 shrink-0" />
              <span>Phone: <a href="tel:+19792489266" className="font-bold text-brand-brown underline hover:text-brand-brown/80">(979) 248-9266</a></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-sky-700 shrink-0" />
              <span>Email: <a href="mailto:Sales@ironprairiefabrication.com" className="font-bold text-brand-brown underline hover:text-brand-brown/80">Sales@ironprairiefabrication.com</a></span>
            </div>
            <div className="flex items-start gap-2 pt-1">
              <MapPin className="h-4 w-4 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Facility Location:</div>
                <div className="text-slate-600">Lake Jackson, TX 77566 (Brazoria County)</div>
                <a href="https://maps.app.goo.gl/uDPSYSvFs3xX5isU7" target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold text-sky-800 underline hover:text-sky-900 block mt-0.5">
                  View on Google Maps &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 text-white p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Truck className="h-4 w-4" />
            <span>Fulfillment &amp; Shipping Reach</span>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <div>
              <strong className="text-white block">Texas Regional Service Area:</strong>
              <span>Lake Jackson, Freeport, Angleton, Pearland, Houston, Texas City, Bay City, and statewide Texas. Same-day emergency hot-shot courier available.</span>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <strong className="text-white block">Nationwide Shipping (All 50 States):</strong>
              <span>Daily UPS Ground parcel for boxed blinds and parts; palletized LTL freight and dedicated flatbed transport for bulk orders and heavy equipment.</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

