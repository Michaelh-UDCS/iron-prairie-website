/**
 * Single source of truth for Iron Prairie public site identity.
 * Hydrate UI, schema, prerender, and agent files from this config — do not hardcode NAP.
 */
export const siteConfig = {
  mode: 'A' as const,

  businessName: 'Iron Prairie Fabrication Group LLC',
  brandShort: 'Iron Prairie',
  ownerName: 'Alicia',
  ownerTitle: 'Owner & Principal Executive',

  phoneDisplay: '(979) 248-9266',
  phoneE164: '+19792489266',
  email: 'Sales@ironprairiefabrication.com',

  streetAddress: '200 County Rd 170',
  city: 'Bay City',
  state: 'TX',
  zip: '77414',
  county: 'Matagorda County',
  latitude: 28.9828,
  longitude: -95.9694,
  googleMapsUrl: 'https://maps.app.goo.gl/ipFsC9qtHyKwZZS39',
  serviceAreas: [
    'Bay City',
    'Lake Jackson',
    'Freeport',
    'Angleton',
    'Pearland',
    'Houston',
    'Matagorda County',
    'Brazoria County',
    'Texas',
    'United States'
  ],

  primaryColor: '#6b3b2a',
  secondaryColor: '#8a4d37',
  accentColor: '#522c1e',
  logoUrl: '/Logo.jpg',

  domain: 'https://ironprairiefabrication.com',
  stagingDomain: 'https://iron-prairie-website.web.app',

  // Google Ecosystem & GA4 Analytics Single Source of Truth
  ga4MeasurementId: (import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-39362MRM5F') as string,

  // Multi-Platform Attribution Standard (GBP / Apple Maps / Bing Places)
  attributionUrls: {
    gbp: 'https://ironprairiefabrication.com/?utm_source=gbp&utm_medium=organic&utm_campaign=google_maps',
    appleBusinessConnect: 'https://ironprairiefabrication.com/?utm_source=apple_maps&utm_medium=organic&utm_campaign=apple_business_connect',
    bingPlaces: 'https://ironprairiefabrication.com/?utm_source=bing_places&utm_medium=organic'
  },

  schemaType: 'HomeAndConstructionBusiness',
  samUei: 'XX7XCMGN9XD5',

  sameAs: [
    'https://maps.app.goo.gl/ipFsC9qtHyKwZZS39',
    'https://www.facebook.com/ironprairiefabrication',
    'https://www.linkedin.com/company/iron-prairie-fabrication-group',
    'https://universal-dynamic.com'
  ],

  services: [
    {
      title: 'ASME B16.48 Paddle Blinds',
      desc: 'Positive isolation paddle blinds and spacer rings with certified MTRs and nationwide shipping.',
      slug: 'paddle-blinds'
    },
    {
      title: 'CNC Plasma Cutting & Welding',
      desc: 'High-definition plasma plate cutting and practical welding for industrial and ranch assemblies.',
      slug: 'services'
    },
    {
      title: 'Agriculture & Ranch Fabrication',
      desc: 'Custom pens, ranch gates, fence panels, and hard-use farm equipment steelwork.',
      slug: 'services'
    },
    {
      title: 'Public Agency Metalwork',
      desc: 'Procurement-ready fabrication for municipalities, TPWD, National Parks, and federal buyers.',
      slug: 'woman-owned'
    },
    {
      title: 'Secure Specialty Builds',
      desc: 'Custom bunkers, tornado shelter steelwork, and large built-in safes.',
      slug: 'services'
    }
  ],

  ogImage: '/og-banner.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 630,

  hours: {
    monday: '7:00 AM – 6:00 PM',
    tuesday: '7:00 AM – 6:00 PM',
    wednesday: '7:00 AM – 6:00 PM',
    thursday: '7:00 AM – 6:00 PM',
    friday: '7:00 AM – 6:00 PM',
    saturday: '8:00 AM – 2:00 PM',
    sunday: 'Closed'
  }
} as const;

export type SiteConfig = typeof siteConfig;
