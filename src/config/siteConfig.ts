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
  latitude: 28.9227707,
  longitude: -95.8318058,
  googleCid: '12180860875323553231',
  googleKgMid: '/g/11ys96k9kl',
  googleMapsUrl: 'https://www.google.com/maps?cid=12180860875323553231',
  googleMapsShortUrl: 'https://maps.app.goo.gl/ipFsC9qtHyKwZZS39',
  serviceAreas: [
    'Bay City',
    'Matagorda County',
    'Freeport',
    'Lake Jackson',
    'Angleton',
    'Houston',
    'Baytown',
    'Pearland',
    'Pasadena',
    'Corpus Christi',
    'Brazoria County',
    'Texas Gulf Coast',
    'Statewide Texas',
    'All 50 States (Nationwide)'
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

  // Big 3 Off-Page Identity Status: Google Claimed (CID 12180860875323553231); Apple In Review (Location ID 1545151277392992454, Org 996979639062); Bing In Progress (BizID c8b0d161-6b1a-4888-bbdc-f3e441146c56)
  applePlaceId: '1545151277392992454',
  appleOrgId: '996979639062',
  bingBizId: 'c8b0d161-6b1a-4888-bbdc-f3e441146c56',
  bingYpid: null as string | null,

  schemaType: 'HomeAndConstructionBusiness',
  samUei: 'XX7XCMGN9XD5',

  sameAs: [
    'https://www.google.com/maps?cid=12180860875323553231',
    'https://maps.app.goo.gl/ipFsC9qtHyKwZZS39',
    'https://www.facebook.com/ironprairiefabrication',
    'https://www.linkedin.com/company/iron-prairie-fabrication-group',
    'https://universal-dynamic.com'
  ],

  services: [
    {
      title: 'Custom Metal Fabrication & Structural Steel',
      desc: 'Architectural ranch gates, boundary steel, structural welding, equipment skids, and custom part fabrication.',
      slug: 'services'
    },
    {
      title: 'High-Definition CNC Plasma Plate Cutting',
      desc: 'Precision plate cutting from gauge sheet up to heavy structural plate in carbon, stainless, and aluminum.',
      slug: 'services'
    },
    {
      title: 'Agriculture & Livestock Equipment',
      desc: 'Custom pens, squeeze chutes, modular hog traps, cattle guards, and hard-use ranch equipment.',
      slug: 'services'
    },
    {
      title: 'ASME B16.48 Paddle Blinds & Spacers',
      desc: 'Positive isolation paddle blinds and spacer rings with certified MTRs, hot-shot turnaround, and nationwide shipping.',
      slug: 'paddle-blinds'
    },
    {
      title: 'Custom Tornado Shelters & Underground Bunkers',
      desc: 'Engineered protective steel storm shelters, underground survival bunkers, and heavy built-in security safes.',
      slug: 'services'
    },
    {
      title: 'Public Agency & Municipal Metalwork',
      desc: 'Procurement-ready fabrication for municipalities, TPWD, National Parks, and federal buyers (SAM.gov UEI: XX7XCMGN9XD5).',
      slug: 'woman-owned'
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
