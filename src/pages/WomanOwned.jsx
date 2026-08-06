import React from 'react';

export default function WomanOwned() {
  return (
    <div className="container-page space-y-8">
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-brown/80">
          Woman-Owned &amp; Built to Last
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-brown md:text-4xl">
          A fabrication partner you can count on.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-800">
          Iron Prairie Fabrication Group LLC is proudly woman-owned. That&apos;s more than a line on
          a form - it&apos;s a commitment to organized projects, clear communication, and work that
          reflects on our name as much as yours.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-800">
          We are actively preparing for broader procurement participation, including SAM.gov
          registration and agency-facing qualification materials for state and federal opportunities.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-brand-brown">Certifications</h2>
          <p className="mt-2 text-xs text-slate-800">
            Space for WBE, HUB, SAM.gov status, CAGE/UEI details, and other procurement credentials
            as they are completed.
          </p>
        </div>
        <div className="rounded-2xl bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-brand-brown">Safety &amp; Training</h2>
          <p className="mt-2 text-xs text-slate-800">
            Outline safety programs, fabrication QA practices, and any plant, agency, or contract
            requirements the shop meets.
          </p>
        </div>
        <div className="rounded-2xl bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-brand-brown">Working with Public Entities</h2>
          <p className="mt-2 text-xs text-slate-800">
            Built to support city, county, state, and federal workflows including POs, quotes, bids,
            and multi-step approvals.
          </p>
        </div>
      </section>
    </div>
  );
}

