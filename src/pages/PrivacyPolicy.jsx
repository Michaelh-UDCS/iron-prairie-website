import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="container-page space-y-8">
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700 font-mono">
          Legal &amp; Trust
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-700">
          Iron Prairie Fabrication Group LLC ("Iron Prairie", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you visit our website or submit project inquiries.
        </p>
        <p className="mt-2 text-xs text-slate-600">
          Last updated: August 2026
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
          <h2 className="text-sm font-bold text-slate-900">Information We Collect</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            We collect personal information that you voluntarily provide when requesting a quote, discussing fabrication scopes, or contacting us by phone or email. This may include your name, organization, phone number, email address, and project specifications.
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
          <h2 className="text-sm font-bold text-slate-900">How We Use Your Information</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            We use your information exclusively to provide fabrication estimates, fulfill project orders, communicate about schedules and specifications, and comply with state and federal procurement requirements. We never sell or rent your information.
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
          <h2 className="text-sm font-bold text-slate-900">Data Security &amp; Retention</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            We implement administrative and technical safeguards to protect your data against unauthorized access. Project specifications and communication records are retained only as needed for project fulfillment and legal compliance.
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
          <h2 className="text-sm font-bold text-slate-900">Third-Party Services</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            Our website is hosted on secure cloud infrastructure (Firebase / Google Cloud Platform). We do not share your confidential project drawings or contact details with unauthorized third parties.
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-6 text-white shadow-md">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300 font-mono">
          Contact Us Regarding Privacy
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          If you have questions or concerns regarding our privacy practices, please contact us directly:
        </p>
        <div className="mt-4 space-y-1 text-xs text-slate-300 font-mono">
          <div className="font-bold text-white">Iron Prairie Fabrication Group LLC</div>
          <div>200 County Rd 170, Bay City, TX 77414</div>
          <div>Phone: <a href="tel:+19792489266" className="text-blue-400 underline hover:text-blue-300">(979) 248-9266</a></div>
          <div>Email: <a href="mailto:Sales@ironprairiefabrication.com" className="text-blue-400 underline hover:text-blue-300">Sales@ironprairiefabrication.com</a></div>
        </div>
      </section>
    </div>
  );
}
