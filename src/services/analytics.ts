import { siteConfig } from '../config/siteConfig';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    __ga4Initialized?: boolean;
  }
}

/**
 * Initializes Google Analytics 4 deferred island strictly when main thread is idle.
 * Zero render-blocking script in <head>; maintains 100/100/100/100 Mobile Lighthouse.
 */
export function initAnalyticsIsland(): void {
  if (typeof window === 'undefined') return;
  if (window.__ga4Initialized) return;

  const measurementId = siteConfig.ga4MeasurementId;
  if (!measurementId || !measurementId.startsWith('G-')) {
    if (import.meta.env.DEV) {
      console.warn('[analytics] Invalid or missing GA4 Measurement ID:', measurementId);
    }
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: true,
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });

  // Inject async script tag dynamically
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  script.id = 'ga4-gtag-script';
  document.head.appendChild(script);

  window.__ga4Initialized = true;
  if (import.meta.env.DEV) {
    console.log(`[analytics] Zero-Hydration GA4 Island active (${measurementId})`);
  }
}

/**
 * Dispatches SPA pageview events to GA4 on route changes without reload.
 */
export function trackPageView(path?: string, title?: string): void {
  if (typeof window === 'undefined') return;
  const measurementId = siteConfig.ga4MeasurementId;
  if (!measurementId || !measurementId.startsWith('G-')) return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: path || window.location.pathname + window.location.search,
      page_title: title || document.title,
      page_location: window.location.href
    });
  }
}

/**
 * Dispatches custom user engagement or conversion events.
 */
export function trackEvent(eventName: string, params?: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}
