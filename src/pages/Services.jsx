import React from 'react';

const sections = [
  {
    title: 'CNC Plasma Cutting & Welding',
    summary:
      'Fast-turn plate and practical fabrication support for parts, assemblies, and field-ready repairs.',
    items: [
      'CNC plasma plate cutting for production and one-off jobs',
      'Simple welding and shop-built assemblies',
      'Custom gates and fence panel fabrication',
      'Custom brackets, plates, and structural supports',
      'Repair fabrication for damaged steel components',
      'Material prep and fit-up for install crews',
    ],
  },
  {
    title: 'Agriculture, Ranch & Blinds',
    summary:
      'Custom builds designed for hard-use environments across farms, ranches, and outdoor operations.',
    items: [
      'Custom hog and livestock pens',
      'Farm and ranch equipment fabrication',
      'Farm and ranch gates with matching fence components',
      'Commercial paddle blind builds',
      'Spec blind fabrication and modifications',
      'Machining support for blind components',
    ],
  },
  {
    title: 'Public Sector & O&G Support',
    summary:
      'Procurement-ready support for Texas agencies, parks, and industrial/O&G clients.',
    items: [
      'Fire rings and fire pits for parks and public sites',
      'Handrails and safety steel for facilities',
      'Durable gates and fencing for public access and safety zones',
      'Parts and assemblies for O&G operations',
      'Machined support pieces where needed',
      'Scope support for TPWD, National Parks, and agency projects',
    ],
  },
  {
    title: 'Secure Steel & Specialty Builds',
    summary:
      'Heavy steel fabrication for protective, secure, and purpose-built installations.',
    items: [
      'Custom bunker fabrication and steel buildouts',
      'Tornado shelter components and reinforced assemblies',
      'Large built-in safes and secure room steelwork',
      'Heavy doors, frames, hinges, and locking support steel',
      'Custom plate packages for protected storage areas',
      'Field-ready coordination for unique site requirements',
    ],
  },
];

export default function Services() {
  return (
    <div className="container-page space-y-8">
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-brown/80">
          Services
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-brown md:text-4xl">
          Fabrication that matches real-world needs.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-800">
          Iron Prairie focuses on practical steel work that keeps operations moving. From CNC plasma-cut
          parts to custom pens, blinds, secure steel builds, and public infrastructure components,
          we support projects that are too specific for off-the-shelf solutions and too important
          to delay.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col rounded-2xl bg-white/80 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-brand-brown">{section.title}</h2>
            <p className="mt-2 text-xs text-slate-800">{section.summary}</p>
            <ul className="mt-3 space-y-1 text-xs text-slate-800">
              {section.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-brand-brown/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="rounded-2xl bg-brand-brown/95 p-6 text-brand-ivory shadow-md">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-ivory/80">
          Agency and procurement support
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          We are building this site and capability stack to better support public entities at every
          level. That includes state and park work now, plus expanded federal support as SAM.gov
          registration and agency onboarding are finalized.
        </p>
        <p className="mt-3 text-xs text-brand-ivory/85">
          If you have a scope package, drawing set, or procurement requirements, we can align quote
          details to your process and timelines.
        </p>
      </section>
    </div>
  );
}

