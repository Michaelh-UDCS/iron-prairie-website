import React, { useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Projects from './pages/Projects.jsx';
import WomanOwned from './pages/WomanOwned.jsx';
import Contact from './pages/Contact.jsx';
import brandLogo from '../Logo.jpg';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/woman-owned', label: 'Woman-Owned' },
  { to: '/contact', label: 'Contact' },
];

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkBase =
    'px-3 py-2 text-sm font-medium transition-colors border-b-2 border-transparent';

  return (
    <div className="flex min-h-screen flex-col bg-brand-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-md focus:bg-brand-brown focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-ivory focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>
      <header className="border-b border-brand-border bg-brand-panel">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3 md:gap-4">
            <img
              src={brandLogo}
              alt="Iron Prairie Fabrication Group LLC logo"
              width="144"
              height="144"
              className="h-24 w-auto shrink-0 rounded-lg border border-brand-border bg-brand-panel-muted p-1.5 shadow-md sm:h-28 md:h-32 lg:h-36"
            />
            <div className="leading-tight">
              <div className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted sm:block">
                Built to Last
              </div>
              <div className="font-display text-lg font-bold uppercase tracking-wide text-brand-bone sm:text-xl md:text-2xl">
                Iron Prairie
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${linkBase} ${
                    isActive
                      ? 'border-brand-blue text-brand-bone'
                      : 'text-stone-400 hover:text-brand-bone'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/contact"
              className="ml-3 rounded-full bg-brand-brown px-4 py-2 text-sm font-semibold text-brand-ivory shadow-sm hover:bg-brand-brown/90"
            >
              Request a Quote
            </NavLink>
          </nav>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-brand-border p-2 text-brand-bone md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span className="sr-only">Toggle navigation</span>
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-brand-bone" />
              <span className="block h-0.5 w-4 bg-brand-bone" />
              <span className="block h-0.5 w-3 bg-brand-bone" />
            </div>
          </button>
        </div>

        {mobileOpen && (
          <nav className="border-t border-brand-border bg-brand-panel-muted md:hidden">
            <div className="space-y-1 px-4 py-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-brand-ink text-brand-bone'
                        : 'text-stone-300 hover:bg-brand-ink/60'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-2 block rounded-full bg-brand-brown px-4 py-2 text-center text-sm font-semibold text-brand-ivory shadow-sm hover:bg-brand-brown/90"
              >
                Request a Quote
              </NavLink>
            </div>
          </nav>
        )}
      </header>

      <main id="main-content" className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/woman-owned" element={<WomanOwned />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <footer className="border-t border-brand-border bg-brand-panel">
        <div className="container-page flex flex-col gap-3 border-none pt-6 pb-8 md:flex-row md:items-center md:justify-between md:pt-4 md:pb-6">
          <div>
            <div className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-brand-muted">
              Iron Prairie Fabrication Group LLC
            </div>
            <p className="mt-1 text-xs text-stone-400">
              Woman-owned fabrication partner for agriculture, industry, and public agencies across
              Texas.
            </p>
          </div>
          <div className="text-xs text-stone-400">
            <div>Phone: <a href="tel:+19792489266" className="underline hover:text-brand-bone">979-248-9266</a></div>
            <div>Email: <a href="mailto:Alicia@ironprairiefabrication.com" className="underline hover:text-brand-bone">Alicia@ironprairiefabrication.com</a></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

