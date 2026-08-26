/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core brand (rustic anchor)
        'brand-brown': '#6b3b2a',
        // Dark UI surfaces (professional / industrial)
        'brand-ink': '#161413',
        'brand-panel': '#1f1c1a',
        'brand-panel-muted': '#2a2623',
        'brand-border': '#3d3834',
        // Text + accents — neutral bone + steel blue (no peach tones)
        'brand-bone': '#e8e4de',
        'brand-muted': '#9c9690',
        'brand-ivory': '#f5f4f2',
        'brand-blue': '#6d92a3',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

