import React from 'react';
import { MapPin, Truck } from 'lucide-react';

const projects = [
  {
    title: 'Custom Hog Pen Buildout',
    type: 'Agriculture',
    scope: 'Texas Regional Ranch Delivery',
    summary:
      'Fabricated a modular pen package with gates and reinforcement points for high-use livestock operations across Texas ranches.',
  },
  {
    title: 'Ranch Entry Gate and Fence Line Package',
    type: 'Agriculture',
    scope: 'Brazoria County Site Delivery',
    summary:
      'Built heavy-duty ranch gates with coordinated fence sections for durability, access control, and long service life on Texas properties.',
  },
  {
    title: 'Commercial ASME B16.48 Paddle Blind Package',
    type: 'Industrial / Turnaround',
    scope: 'Nationwide Freight Dispatch (All 50 States)',
    summary:
      'Turnaround run of ASME B16.48 paddle blinds and spacers in SA-516-70 and 304L stainless, stamped with heat numbers and shipped with MTR packets.',
  },
  {
    title: 'O&G Replacement Part Run',
    type: 'Industrial',
    scope: 'Texas Gulf Coast Hot-Shot Delivery',
    summary:
      'CNC plasma-cut and finished steel support parts for a time-critical petrochemical refinery shutdown window in Freeport.',
  },
  {
    title: 'Park Fire Ring and Handrail Set',
    type: 'Public Sector',
    scope: 'Texas Agency & Municipal Procurement',
    summary:
      'Produced heavy-duty fire rings and handrail assemblies built to state park and public facility installation standards.',
  },
  {
    title: 'Secure Steel Bunker Buildout',
    type: 'Specialty Fabrication',
    scope: 'Crated Freight Shipped Nationwide',
    summary:
      'Custom bunker, tornado shelter, and large built-in safe fabrication for protected spaces and secure storage installations.',
  },
];

export default function Projects() {
  return (
    <div className="container-page space-y-8">
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-brown/80">
          Projects &amp; Portfolio
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-brown md:text-4xl">
          Sample work delivered locally and shipped nationwide.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-800">
          Explore representative projects executed by Iron Prairie: from local Texas field installations and emergency refinery hot-shots to bulk ASME paddle blind packages and crated secure steel assemblies shipped to industrial clients nationwide.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.title}
            className="flex flex-col justify-between rounded-2xl bg-white/80 p-5 shadow-sm border border-slate-200/70"
          >
            <div>
              <div className="h-36 rounded-xl bg-gradient-to-br from-brand-brown/80 via-brand-brown to-brand-blue/70" />
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-brown/80">
                  {project.type}
                </span>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {project.scope}
                </span>
              </div>
              <h2 className="mt-1 text-sm font-semibold text-brand-brown">{project.title}</h2>
              <p className="mt-2 text-xs text-slate-800 leading-relaxed">{project.summary}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

