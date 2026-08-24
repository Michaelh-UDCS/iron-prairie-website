import React from 'react';

export default function Contact() {
  return (
    <div className="container-page grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-brown/80">
          Request a Quote
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-brown md:text-4xl">
          Tell us what you need built.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-800">
          Use this form as a starting point for fabrication requests, replacement parts, and
          procurement opportunities. Share scope, location, and schedule needs so we can align next
          steps quickly.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            alert('Thank you for your request! Iron Prairie Fabrication Group will contact you promptly.');
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-medium text-slate-800">
                Name
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
                Organization
              </label>
              <input
                id="contact-organization"
                name="organization"
                type="text"
                autoComplete="organization"
                className="mt-1 w-full rounded-md border border-brand-brown/30 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown/40"
                placeholder="Ranch, agency, plant, or business name"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="contact-phone" className="block text-xs font-medium text-slate-800">
                Phone
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
                Email
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

          <div>
            <label htmlFor="contact-project-type" className="block text-xs font-medium text-slate-800">
              Project Type
            </label>
            <select
              id="contact-project-type"
              name="projectType"
              className="mt-1 w-full rounded-md border border-brand-brown/30 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown/40"
            >
              <option>CNC Plasma Cutting / Weldment</option>
              <option>Agriculture / Ranch Equipment</option>
              <option>Gates / Fences</option>
              <option>Custom Bunker / Tornado Shelter</option>
              <option>Large Built-In Safe</option>
              <option>Paddle Blind / Spec Blind</option>
              <option>O&amp;G / Industrial Parts</option>
              <option>Parks / Public Infrastructure</option>
              <option>State or Federal Agency Request</option>
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="contact-agency" className="block text-xs font-medium text-slate-800">
                Agency / Department (if applicable)
              </label>
              <input
                id="contact-agency"
                name="agency"
                type="text"
                className="mt-1 w-full rounded-md border border-brand-brown/30 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown/40"
                placeholder="TPWD, National Park Service, DOE, DOD, etc."
              />
            </div>
            <div>
              <label htmlFor="contact-bid-ref" className="block text-xs font-medium text-slate-800">
                Bid / Solicitation Reference
              </label>
              <input
                id="contact-bid-ref"
                name="bidReference"
                type="text"
                className="mt-1 w-full rounded-md border border-brand-brown/30 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown/40"
                placeholder="RFP, IFB, or internal project code"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-details" className="block text-xs font-medium text-slate-800">
              Project Details
            </label>
            <textarea
              id="contact-details"
              name="projectDetails"
              rows={4}
              className="mt-1 w-full rounded-md border border-brand-brown/30 bg-white/80 px-3 py-2 text-sm shadow-sm outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown/40"
              placeholder="Where is it, what needs to be built or repaired, and any key dates or constraints."
            />
          </div>

          <p className="text-[11px] text-slate-700">
            This form connects directly with our estimators for rapid scope confirmation, pricing, and site coordination.
          </p>

          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-brown px-6 py-3 text-sm font-semibold text-brand-ivory shadow-sm hover:bg-brand-brown/90 focus:outline-none focus:ring-2 focus:ring-brand-brown/50"
          >
            Submit Request
          </button>
        </form>
      </section>

      <aside className="space-y-4 rounded-2xl bg-white/80 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-brand-brown">Other ways to reach us</h2>
        <div className="space-y-2 text-xs text-slate-800">
          <div>Phone: <a href="tel:+19792489266" className="font-semibold text-brand-brown underline hover:text-brand-brown/80">979-248-9266</a></div>
          <div>Email: <a href="mailto:Sales@ironprairiefabrication.com" className="font-semibold text-brand-brown underline hover:text-brand-brown/80">Sales@ironprairiefabrication.com</a></div>
          <div>Location: <a href="https://maps.app.goo.gl/uDPSYSvFs3xX5isU7" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-brown underline hover:text-brand-brown/80">View on Google Maps</a></div>
        </div>
        <p className="text-[11px] text-slate-700">
          We can also publish procurement contact details, SAM.gov profile data, and a capability
          statement download once finalized.
        </p>
      </aside>
    </div>
  );
}

