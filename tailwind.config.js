/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core Cobalt & Deep Blue Accents
        'brand-cobalt': '#1d4ed8',
        'brand-blue': '#2563eb',
        'brand-cobalt-light': '#3b82f6',
        'brand-sky': '#38bdf8',
        // Legacy fallback alias mapped to cobalt
        'brand-brown': '#1d4ed8',
        // Deep Dark Mode UI Surfaces (Industrial Navy / Slate)
        'brand-navy': '#0a0f1d',
        'brand-ink': '#060913',
        'brand-panel': '#0f172a',
        'brand-panel-muted': '#1e293b',
        'brand-border': '#334155',
        // Text & Contrast Elements
        'brand-bone': '#f8fafc',
        'brand-muted': '#94a3b8',
        'brand-ivory': '#ffffff',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

