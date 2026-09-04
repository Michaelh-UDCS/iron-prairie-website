import { siteConfig } from '../config/siteConfig';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    __ga4Initialized?: boolean;
    __ga4ListenersAttached?: boolean;
  }
}

// Eagerly stub gtag and dataLayer so pre-hydration calls are queued safely
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
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
  attachAutoTrackingListeners();

  if (import.meta.env.DEV) {
    console.log(`[analytics] Zero-Hydration GA4 Island active (${measurementId})`);
  }
}

/**
 * Attaches global click delegation for high-intent conversions:
 * - Phone call clicks (tel:)
 * - Email clicks (mailto:)
 * - Custom quote CTA buttons
 */
function attachAutoTrackingListeners(): void {
  if (typeof window === 'undefined' || window.__ga4ListenersAttached) return;
  window.__ga4ListenersAttached = true;

  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement)?.closest('a, button');
    if (!target) return;

    const href = target.getAttribute('href') || '';

    // 1. Phone call clicks (Top conversion for mobile searches: "fabrication company near me")
    if (href.startsWith('tel:')) {
      const phoneNumber = href.replace('tel:', '');
      trackPhoneCall(target.getAttribute('data-ga-location') || 'unknown', phoneNumber);
      return;
    }

    // 2. Email inquiries
    if (href.startsWith('mailto:')) {
      const email = href.replace('mailto:', '');
      trackEvent('contact_email_click', {
        email_address: email,
        location: target.getAttribute('data-ga-location') || 'unknown',
      });
      return;
    }

    // 3. Custom Fabrication Quote CTA clicks
    if (href === '/contact' || target.textContent?.toLowerCase().includes('quote')) {
      trackEvent('click_quote_cta', {
        cta_text: target.textContent?.trim().slice(0, 50),
        cta_location: target.getAttribute('data-ga-location') || window.location.pathname,
        intent: 'custom_fabrication_quote',
      });
    }
  }, { passive: true });
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

/**
 * Tracks high-priority Phone Call conversions.
 * Essential for mobile local searches ("fabrication shops near me").
 */
export function trackPhoneCall(location = 'direct', phoneNumber = siteConfig.phoneDisplay): void {
  trackEvent('generate_lead', {
    lead_type: 'phone_call',
    phone_number: phoneNumber,
    touchpoint_location: location,
    core_interest: 'custom_metal_fabrication',
    page_url: typeof window !== 'undefined' ? window.location.href : '',
  });

  trackEvent('contact_phone_call', {
    phone_number: phoneNumber,
    location,
  });
}

/**
 * Tracks Custom Fabrication Quote Form Submissions.
 */
export function trackCustomQuoteSubmission(projectType: string, companyName?: string): void {
  trackEvent('generate_lead', {
    lead_type: 'custom_quote_form',
    project_type: projectType,
    company_name: companyName || 'Private/Individual',
    core_interest: 'custom_metal_fabrication',
    value: 1,
    currency: 'USD',
  });

  trackEvent('submit_custom_quote', {
    project_type: projectType,
    company: companyName,
  });
}

/**
 * Tracks User Interest in specific Custom Fabrication service categories.
 */
export function trackCustomFabInterest(serviceCategory: string, source = 'services_page'): void {
  trackEvent('view_custom_service', {
    service_category: serviceCategory,
    source,
    core_interest: 'custom_metal_fabrication',
  });
}
