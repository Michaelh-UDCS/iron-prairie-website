import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700 font-mono">
        404 — Page Not Found
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Looking for Custom Metal Fabrication in Texas?
      </h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-600">
        The page you are looking for has moved or does not exist. Iron Prairie Fabrication Group LLC provides structural steel, custom gates, bunkers, and welding across Texas.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 transition-all"
        >
          Return Home
        </Link>
        <Link
          to="/services"
          className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50/50 transition-all"
        >
          View Fabrication Services
        </Link>
        <Link
          to="/contact"
          className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50/50 transition-all"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
