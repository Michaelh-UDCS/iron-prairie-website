import React from 'react';

export default function About() {
  return (
    <div className="container-page space-y-8">
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-brown/80">
          Our Story
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-brown md:text-4xl">
          A practical fabrication shop built for hard-use work.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-800">
          Iron Prairie Fabrication Group LLC was built to serve the jobs that keep Texas running:
          ranch operations, industrial sites, and public facilities. As a woman-owned business, we
          focus on direct communication, dependable turnaround, and fabrication that holds up in the
          field.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-800">
          Whether we&apos;re plasma-cutting parts, building custom animal pens, fabricating paddle
          blinds, or supporting agency projects like handrails and fire pits, our promise is the
          same: show up, do it right, and stand behind the work.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-brand-brown">Grounded in Safety</h2>
          <p className="mt-2 text-xs text-slate-800">
            We follow site rules, PPE requirements, and permit processes so projects stay compliant
            and move cleanly.
          </p>
        </div>
        <div className="rounded-xl bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-brand-brown">Built for Operations</h2>
          <p className="mt-2 text-xs text-slate-800">
            We support buyers across agriculture, industrial, and public sectors with clear scopes,
            pricing, and practical fabrication options.
          </p>
        </div>
        <div className="rounded-xl bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-brand-brown">Procurement Mindset</h2>
          <p className="mt-2 text-xs text-slate-800">
            We are aligning processes for state and federal procurement requirements, including
            SAM.gov registration and agency onboarding.
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center">
        <div className="rounded-2xl bg-brand-brown/95 p-6 text-brand-ivory shadow-md">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-ivory/80">
            Service Area
          </h2>
          <p className="mt-3 text-sm leading-relaxed">
            Iron Prairie serves customers across Texas with a focus on ranch and farm operations,
            industrial/O&amp;G support, and public facility work. We stay close enough to understand
            your site realities before we fabricate a single part.
          </p>
          <p className="mt-3 text-xs text-brand-ivory/85">
            We can customize this section with your exact service regions, agency footprint, and
            target contract areas.
          </p>
        </div>
        <div className="space-y-3 text-xs text-slate-800">
          <p>
            As the shop grows, this page can be expanded with certifications, qualification
            statements, and representative projects for agencies and prime contractors.
          </p>
          <p>
            This is where buyers should quickly understand the business model: practical
            manufacturing capacity, responsive communication, and reliable delivery.
          </p>
        </div>
      </section>
    </div>
  );
}

