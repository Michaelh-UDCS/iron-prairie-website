import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './firebase.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

// Zero-Hydration GA4 Island: dynamically imported strictly when browser thread is idle
if (typeof window !== 'undefined') {
  const launchAnalytics = () => {
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

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(launchAnalytics, { timeout: 3500 });
  } else if (document.readyState === 'complete') {
    setTimeout(launchAnalytics, 1000);
  } else {
    window.addEventListener('load', () => setTimeout(launchAnalytics, 1000), { once: true });
  }
}

