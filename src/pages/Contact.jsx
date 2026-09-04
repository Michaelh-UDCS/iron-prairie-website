import React, { useState } from 'react';
import { Truck, MapPin, Phone, Mail, Clock, Flame, ShieldCheck, CheckCircle2, Building, Award, BadgeCheck, Loader2 } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { saveContactLead } from '../services/leadService';
import { trackCustomQuoteSubmission } from '../services/analytics';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get('name')?.toString().trim() || '';
    const organization = formData.get('organization')?.toString().trim() || '';
    const phone = formData.get('phone')?.toString().trim() || '';
    const email = formData.get('email')?.toString().trim() || '';
    const projectType = formData.get('projectType')?.toString().trim() || 'Custom Metal Fabrication (General)';
    const logisticsPreference = formData.get('logisticsPreference')?.toString().trim() || '';
    const location = formData.get('location')?.toString().trim() || '';
    const bidReference = formData.get('bidReference')?.toString().trim() || '';
    const projectDetails = formData.get('projectDetails')?.toString().trim() || '';

    const leadData = {
      name,
      organization,
      phone,
      email,
      projectType,
      logisticsPreference,
      location,
      bidReference,
      projectDetails,
      source: 'contact_page',
    };

    try {
      await saveContactLead(leadData);
    } catch (err) {
      console.warn('[Contact] Error saving lead to Firestore:', err);
    }

    try {
      trackCustomQuoteSubmission(projectType, organization);
    } catch (err) {
      console.warn('[Contact] Error dispatching quote analytics:', err);
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

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
          <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-300 p-6 text-emerald-900 space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-base">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>Thank you! Your quote request has been received.</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Our estimators will review your specifications, material requirements, and logistics options. Expect direct follow-up from <a href="mailto:Sales@ironprairiefabrication.com" className="font-bold underline text-emerald-950">Sales@ironprairiefabrication.com</a> or phone call from <a href="tel:(979)248-9266" data-ga-location="contact_confirmation_phone" className="font-bold underline text-emerald-950">(979) 248-9266</a> promptly with scope confirmation and pricing.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs font-semibold text-brand-brown hover:underline"
              >
                &larr; Submit another inquiry or quote
              </button>
            </div>
          </div>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={handleSubmit}
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
                  defaultValue="Custom Metal Fabrication (General)"
                  className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown"
                >
                  <option value="Custom Metal Fabrication (General)">Custom Metal Fabrication (General)</option>
                  <option value="Custom Ranch Entrance Gates & Boundary Steel">Custom Ranch Entrance Gates &amp; Boundary Steel</option>
                  <option value="Agriculture & Livestock Equipment (Pens, Chutes, Implements)">Agriculture &amp; Livestock Equipment (Pens, Chutes, Implements)</option>
                  <option value="CNC Plasma Cutting & Plate Components">CNC Plasma Cutting &amp; Plate Components</option>
                  <option value="Structural Steel & Industrial Weldments">Structural Steel &amp; Industrial Weldments</option>
                  <option value="ASME B16.48 Paddle Blinds & Spacers">ASME B16.48 Paddle Blinds &amp; Spacers</option>
                  <option value="Custom Bunker / Tornado Shelter">Custom Bunker / Tornado Shelter</option>
                  <option value="Large Built-In Safe">Large Built-In Safe</option>
                  <option value="Municipal / Agency Infrastructure">Municipal / Agency Infrastructure</option>
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
              disabled={isSubmitting}
              data-ga-location="contact_form_submit"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand-brown px-6 py-3 text-sm font-bold text-white shadow-md shadow-brand-brown/20 hover:bg-brand-brown-light focus:outline-none focus:ring-2 focus:ring-brand-brown active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <span>Submit Quote Request</span>
              )}
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
              <span>Phone: <a href="tel:(979)248-9266" data-ga-location="contact_sidebar_phone" className="font-bold text-brand-brown underline hover:text-brand-brown-light py-1 inline-block min-h-[36px] items-center inline-flex">(979) 248-9266</a></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand-brown shrink-0" />
              <span>Email: <a href="mailto:Sales@ironprairiefabrication.com" className="font-bold text-brand-brown underline hover:text-brand-brown-light py-1 inline-block min-h-[36px] items-center inline-flex">Sales@ironprairiefabrication.com</a></span>
            </div>
            <div className="flex items-start gap-2 pt-1">
              <MapPin className="h-4 w-4 text-brand-brown shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-900">Facility Location:</div>
                <a
                  href={siteConfig.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-lg p-2 -ml-2 hover:bg-stone-50 transition-colors min-h-[44px]"
                >
                  <span className="text-slate-600 group-hover:text-brand-brown underline block leading-relaxed">
                    200 County Rd 170, Bay City, TX 77414 (Matagorda County)
                  </span>
                  <span className="text-[11px] font-semibold text-brand-brown group-hover:text-brand-brown-light underline block mt-1">
                    View on Google Maps &rarr;
                  </span>
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

        <div className="rounded-2xl border border-stone-200/80 bg-white text-slate-800 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-brand-brown font-bold text-xs uppercase tracking-wider">
            <Truck className="h-4 w-4 text-brand-brown" />
            <span>Fulfillment &amp; Shipping Reach</span>
          </div>
          <div className="space-y-2 text-xs text-slate-700">
            <div>
              <strong className="text-slate-900 block">Texas Regional Service Area:</strong>
              <span>Bay City, Matagorda, Freeport, Lake Jackson, Angleton, Pearland, Houston, Texas City, and statewide Texas. Same-day emergency hot-shot courier available.</span>
            </div>
            <div className="pt-2 border-t border-stone-200">
              <strong className="text-slate-900 block">Nationwide Shipping (All 50 States):</strong>
              <span>Daily UPS Ground parcel for boxed blinds and parts; palletized LTL freight and dedicated flatbed transport for bulk orders and heavy equipment.</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
