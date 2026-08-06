import React from 'react';

const projects = [
  {
    title: 'Custom Hog Pen Buildout',
    type: 'Agriculture',
    summary:
      'Fabricated a modular pen package with gates and reinforcement points for high-use livestock operations.',
  },
  {
    title: 'Ranch Entry Gate and Fence Line Package',
    type: 'Agriculture',
    summary:
      'Built heavy-duty ranch gates with coordinated fence sections for durability, access control, and long service life.',
  },
  {
    title: 'Commercial Paddle Blind Package',
    type: 'Outdoor Products',
    summary:
      'Built and machined steel blind components for durable commercial-ready field deployment.',
  },
  {
    title: 'O&G Replacement Part Run',
    type: 'Industrial',
    summary:
      'Laser-cut and finished steel support parts for a time-sensitive oil and gas maintenance window.',
  },
  {
    title: 'Park Fire Ring and Handrail Set',
    type: 'Public Sector',
    summary:
      'Produced heavy-duty fire rings and handrail assemblies suitable for state and park installation standards.',
  },
  {
    title: 'Secure Steel Buildout',
    type: 'Specialty Fabrication',
    summary:
      'Custom bunker, tornado shelter, and large built-in safe fabrication for protected spaces and secure storage needs.',
  },
];

export default function Projects() {
  return (
    <div className="container-page space-y-8">
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-brown/80">
          Projects
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-brown md:text-4xl">
          Sample work aligned to target markets.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-800">
          This gallery shows the type of projects Iron Prairie is focused on today: agricultural
          fabrication, blind systems, industrial/O&amp;G components, secure steel buildouts, and
          public-sector infrastructure support. Replace with real project photography and job data
          as each scope closes out.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.title}
            className="flex flex-col rounded-2xl bg-white/80 p-5 shadow-sm"
          >
            <div className="h-36 rounded-xl bg-gradient-to-br from-brand-brown/80 via-brand-brown to-brand-blue/70" />
            <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-brown/80">
              {project.type}
            </div>
            <h2 className="mt-1 text-sm font-semibold text-brand-brown">{project.title}</h2>
            <p className="mt-2 text-xs text-slate-800">{project.summary}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

