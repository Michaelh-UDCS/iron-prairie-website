import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-brown">
        404 — Page Not Found
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-brown sm:text-4xl">
        Looking for Custom Metal Fabrication in Texas?
      </h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-brand-muted">
        The page you are looking for has moved or does not exist. Iron Prairie Fabrication Group LLC provides structural steel, custom gates, bunkers, and welding across Texas.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-full bg-brand-brown px-5 py-2.5 text-sm font-semibold text-brand-ivory shadow-sm hover:bg-brand-brown/90"
        >
          Return Home
        </Link>
        <Link
          to="/services"
          className="rounded-full border border-brand-brown/40 px-5 py-2.5 text-sm font-semibold text-brand-brown hover:bg-brand-brown/5"
        >
          View Fabrication Services
        </Link>
        <Link
          to="/contact"
          className="rounded-full border border-brand-brown/40 px-5 py-2.5 text-sm font-semibold text-brand-brown hover:bg-brand-brown/5"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
