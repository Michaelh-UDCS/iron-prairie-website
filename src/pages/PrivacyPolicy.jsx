import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="container-page space-y-8">
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-brown/80">
          Legal &amp; Trust
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-brown md:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-800">
          Iron Prairie Fabrication Group LLC ("Iron Prairie", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you visit our website or submit project inquiries.
        </p>
        <p className="mt-2 text-xs text-slate-600">
          Last updated: August 2026
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-brand-brown">Information We Collect</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-800">
            We collect personal information that you voluntarily provide when requesting a quote, discussing fabrication scopes, or contacting us by phone or email. This may include your name, organization, phone number, email address, and project specifications.
          </p>
        </div>

        <div className="rounded-xl bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-brand-brown">How We Use Your Information</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-800">
            We use your information exclusively to provide fabrication estimates, fulfill project orders, communicate about schedules and specifications, and comply with state and federal procurement requirements. We never sell or rent your information.
          </p>
        </div>

        <div className="rounded-xl bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-brand-brown">Data Security &amp; Retention</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-800">
            We implement administrative and technical safeguards to protect your data against unauthorized access. Project specifications and communication records are retained only as needed for project fulfillment and legal compliance.
          </p>
        </div>

        <div className="rounded-xl bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-brand-brown">Third-Party Services</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-800">
            Our website is hosted on secure cloud infrastructure (Firebase / Google Cloud Platform). We do not share your confidential project drawings or contact details with unauthorized third parties.
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-brand-brown/95 p-6 text-brand-ivory shadow-md">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-ivory/80">
          Contact Us Regarding Privacy
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          If you have questions or concerns regarding our privacy practices, please contact us directly:
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
