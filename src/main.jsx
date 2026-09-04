import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

// Zero-Hydration GA4 Island: loaded strictly upon user interaction or long fallback
if (typeof window !== 'undefined') {
  let analyticsLoaded = false;
  const launchAnalytics = () => {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((event) => {
      window.removeEventListener(event, launchAnalytics);
    });
    import('./services/analytics')
      .then(({ initAnalyticsIsland }) => {
        initAnalyticsIsland();
      })
      .catch((err) => {
        if (import.meta.env.DEV) {
          console.warn('[analytics] Deferred island initialization skipped:', err);
        }
      });
  };

  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((event) => {
    window.addEventListener(event, launchAnalytics, { once: true, passive: true });
  });

  // 10s fallback for headless or non-scrolling viewers
  setTimeout(launchAnalytics, 10000);
}

