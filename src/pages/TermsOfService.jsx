import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="container-page space-y-8">
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-brown/80">
          Legal &amp; Trust
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-brown md:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-800">
          Welcome to Iron Prairie Fabrication Group LLC. By accessing our website, requesting quotes, or engaging our custom metal fabrication services, you agree to the following terms and conditions.
        </p>
        <p className="mt-2 text-xs text-slate-600">
          Last updated: August 2026
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-brand-brown">Quotes &amp; Proposals</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-800">
            Estimates and quotes provided via our website or direct communication are based on initial scope details and material pricing at the time of quotation. Final pricing is subject to formal written agreement and confirmed drawings.
          </p>
        </div>

        <div className="rounded-xl bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-brand-brown">Custom Fabrication &amp; Tolerances</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-800">
            All fabrication work—including structural steel, CNC plasma plate cutting, agricultural pens, custom bunkers, and shelter steelwork—is executed in accordance with agreed specifications, industry tolerances, and quality standards.
          </p>
        </div>

        <div className="rounded-xl bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-brand-brown">Intellectual Property &amp; Designs</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-800">
            Client-supplied drawings, schematics, and specifications remain the property of the client. Proprietary fabrication techniques and shop drawings created by Iron Prairie remain our intellectual property unless specified in a contract.
          </p>
        </div>

        <div className="rounded-xl bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-brand-brown">Limitation of Liability</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-800">
            Iron Prairie Fabrication Group LLC warrants that all completed fabrication meets agreed quality criteria. Liability for any service or product shall not exceed the contract value of the specific order.
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-brand-brown/95 p-6 text-brand-ivory shadow-md">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-ivory/80">
          Questions or Contract Inquiries
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          For procurement contracts, master services agreements, or bid documentation, please contact our principal executive:
        </p>
        <div className="mt-4 space-y-1 text-xs text-brand-ivory/90">
          <div>Iron Prairie Fabrication Group LLC</div>
          <div>Texas, United States</div>
          <div>Phone: <a href="tel:+19792489266" className="underline hover:text-white">979-248-9266</a></div>
          <div>Email: <a href="mailto:Sales@ironprairiefabrication.com" className="underline hover:text-white">Sales@ironprairiefabrication.com</a></div>
        </div>
      </section>
    </div>
  );
}
