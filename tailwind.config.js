/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core brand (rustic warm brown)
        'brand-brown': '#6b3b2a',
        'brand-brown-light': '#8a4d37',
        'brand-brown-dark': '#522c1e',
        // Canvas & Light Surfaces
        'brand-canvas': '#f7f5f0',
        'brand-ivory': '#fbfaf8',
        // Dark UI surfaces (header, footer, dark cards)
        'brand-ink': '#161413',
        'brand-panel': '#1f1c1a',
        'brand-panel-muted': '#2a2623',
        'brand-border': '#3d3834',
        // Text + accents
        'brand-bone': '#e8e4de',
        'brand-muted': '#78716c',
        'brand-blue': '#475569',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
