import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const templatePath = path.resolve(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('❌ dist/index.html not found! Run `vite build` first.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

const DOMAIN = 'https://ironprairiefabrication.com';
const OG_IMAGE = `${DOMAIN}/og-banner.jpg`;

const routes = [
  {
    path: '/',
    title: 'Custom Metal Fabrication Shop Bay City & Houston TX | Iron Prairie',
    description: 'Custom metal fabrication shop serving Bay City & Houston TX. Structural steel fabrication, CNC plasma cutting, ranch gates, ASME paddle blinds & custom parts.',
    canonical: `${DOMAIN}/`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` }
    ],
    extraSchema: {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What custom metal fabrication services does Iron Prairie Fabrication Group provide?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Iron Prairie Fabrication Group LLC provides structural steel fabrication, high-definition CNC plasma plate cutting, custom ranch entrance gates, agriculture and livestock equipment (pens, chutes, traps), ASME B16.48 positive isolation paddle blinds & spacers, custom tornado shelters & underground bunkers, industrial welding, and custom part fabrication with local Texas delivery and daily shipping across all 50 states."
          }
        },
        {
          "@type": "Question",
          "name": "Where is your local metal fabrication shop located and what areas do you serve?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our fabrication facility is located at 200 County Rd 170 in Bay City, Texas (Matagorda County). We provide direct shop pickup, local delivery, and hot-shot transport across Bay City, Freeport, Lake Jackson, Angleton, Houston, Baytown, Pasadena, Corpus Christi, and the Texas Gulf Coast, alongside daily parcel and LTL freight shipping nationwide."
          }
        },
        {
          "@type": "Question",
          "name": "Do you provide structural steel fabrication and certified welding?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we specialize in structural steel fabrication and welding for commercial buildings, ranches, agricultural operations, and industrial plants. Our capabilities include beam and column framing, equipment skids, pipe welding, mezzanine platforms, and custom heavy weldments."
          }
        },
        {
          "@type": "Question",
          "name": "Can Iron Prairie build custom ranch entrance gates and livestock equipment?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we custom build architectural ranch entrance gates, cattle guards, livestock handling pens, corral systems, squeeze chutes, modular feral hog traps, and perimeter fence line steel designed specifically for tough Texas ranching environments."
          }
        },
        {
          "@type": "Question",
          "name": "What pressure classes and materials are available for ASME B16.48 paddle blinds?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We manufacture ASME B16.48 paddle blinds and spacer rings from 1/2 inch to 24+ inch NPS in Class 150#, 300#, 600#, 900#, 1500#, and 2500#. Staged domestic materials include SA-516 Grade 70 carbon steel, 304/304L stainless, and 316/316L stainless plate. All qualifying orders include certified EN 10204 3.1 Mill Test Reports (MTRs)."
          }
        },
        {
          "@type": "Question",
          "name": "Is Iron Prairie Fabrication Group a certified woman-owned government contractor?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Iron Prairie Fabrication Group LLC is a certified woman-owned enterprise and active government contractor registered on SAM.gov (Unique Entity ID: XX7XCMGN9XD5). We fulfill municipal, state (TPWD), and federal procurement contracts."
          }
        },
        {
          "@type": "Question",
          "name": "Does Iron Prairie Fabrication Group ship nationwide across the United States?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Iron Prairie Fabrication Group LLC ships daily across all 50 US states using UPS Ground and Air parcel for boxed blinds and precision parts, plus palletized LTL freight and dedicated flatbed trucking for bulk orders and heavy structural equipment."
          }
        }
      ]
    }
  },
  {
    path: '/about',
    title: 'About Iron Prairie | Custom Metal Fabrication Shop Bay City TX',
    description: 'Certified woman-owned custom metal fabrication shop in Bay City, TX. Structural steel, CNC plasma cutting, ranch equipment & industrial welding nationwide.',
    canonical: `${DOMAIN}/about`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'About Us', url: `${DOMAIN}/about` }
    ],
    extraSchema: {
      "@type": "AboutPage",
      "@id": `${DOMAIN}/about#aboutpage`,
      "name": "About Iron Prairie Fabrication Group LLC",
      "description": "Company history, ownership, credentials, and custom metal fabrication capabilities of Iron Prairie Fabrication Group LLC in Bay City, Texas.",
      "mainEntity": {
        "@type": "Person",
        "@id": `${DOMAIN}/about#person`,
        "name": "Alicia",
        "jobTitle": "Owner & Principal Executive",
        "worksFor": { "@id": `${DOMAIN}/#organization` },
        "knowsAbout": [
          "Custom Metal Fabrication Management",
          "Structural Steel Fabrication",
          "ASME B16.48 Blinds & Flange Isolation",
          "Public Agency & Municipal Procurement",
          "Woman-Owned Business Enterprise Leadership",
          "Nationwide Freight Logistics"
        ]
      }
    }
  },
  {
    path: '/services',
    title: 'Custom Metal Fabrication Services Bay City & Houston TX | Iron Prairie',
    description: 'Full-service custom metal fabrication shop: structural steel fabrication, CNC plasma cutting, ranch gates, livestock pens, ASME paddle blinds & custom shelters.',
    canonical: `${DOMAIN}/services`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Services', url: `${DOMAIN}/services` }
    ],
    extraSchema: {
      "@type": "OfferCatalog",
      "name": "Custom Metal Fabrication & Industrial Manufacturing Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom Ranch Entrance Gates & Boundary Steel",
            "description": "Architectural ranch entrance gates, cattle guards, fence line pipe, access control framing, and heavy ornamental steel builds for Texas ranches and rural estates."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Agriculture & Livestock Equipment (pens, chutes, traps)",
            "description": "Heavy-duty custom livestock handling pens, corral systems, squeeze chutes, modular feral hog traps, cattle guards, and agricultural equipment repairs."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "High-Definition CNC Plasma Plate Cutting",
            "description": "High-definition CNC plasma cutting for mild steel, SA-516-70 carbon steel, stainless steel, and aluminum plate. Precision gussets, baseplates, flanges, and custom parts."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Structural Steel Fabrication & Welding",
            "description": "Commercial and industrial structural steel fabrication, certified welding, structural skids, pipe welding, mezzanine steel, and equipment supports."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "ASME B16.48 Paddle Blinds & Spacers",
            "description": "Positive isolation paddle blinds, figure-8 spectacle blinds, and spacer rings (150# to 2500#, 1/2\" to 24\"+ NPS) with certified EN 10204 3.1 MTRs and daily nationwide shipping."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom Tornado Shelters & Underground Bunkers",
            "description": "Engineered steel tornado shelters, storm safety rooms, underground survival bunkers, and large built-in heavy security safes fabricated to project specifications."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom Part Fabrication & Prototyping",
            "description": "One-off parts, short-run manufacturing, OEM replacement parts, aluminum welding, brackets, and custom sheet metal for local shops and industrial clients."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Public Agency & Municipal Infrastructure Fabrication",
            "description": "Procurement-ready fabrication for Texas Parks & Wildlife (TPWD), municipalities, counties, and federal agencies. Park fire rings, safety handrails, and municipal steel structures."
          }
        }
      ]
    }
  },
  {
    path: '/projects',
    title: 'Metal Fabrication Projects | Custom Steel & Gates Bay City TX | Iron Prairie',
    description: 'Explore custom metal fabrication projects: architectural ranch entrance gates, heavy livestock pens, CNC plasma parts, structural steel & ASME blinds.',
    canonical: `${DOMAIN}/projects`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Projects', url: `${DOMAIN}/projects` }
    ],
    extraSchema: {
      "@type": "CollectionPage",
      "name": "Iron Prairie Fabrication Projects & Case Studies",
      "description": "Showcase of completed metal fabrication projects: ranch entry gates, modular hog traps, ASME B16.48 paddle blinds, refinery turnaround components, and park infrastructure steel."
    }
  },
  {
    path: '/woman-owned',
    title: 'Woman-Owned Fabrication Company Bay City TX | SAM.gov UEI | Iron Prairie',
    description: 'SAM.gov registered (UEI XX7XCMGN9XD5) woman-owned custom metal fabrication business in Bay City, TX. Structural steel, agency infrastructure & contract manufacturing.',
    canonical: `${DOMAIN}/woman-owned`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Woman-Owned & Procurement', url: `${DOMAIN}/woman-owned` }
    ],
    extraSchema: {
      "@type": "GovernmentPermit",
      "name": "SAM.gov Government Contractor Registration",
      "identifier": "XX7XCMGN9XD5",
      "issuedBy": {
        "@type": "GovernmentOrganization",
        "name": "System for Award Management (SAM.gov)"
      }
    }
  },
  {
    path: '/contact',
    title: 'Request Fabrication Quote | Metal Fab Shop Bay City TX | Iron Prairie',
    description: 'Request a fast custom metal fabrication quote. Structural steel, ranch gates, CNC plasma parts, ASME paddle blinds & custom builds. Direct line: (979) 248-9266.',
    canonical: `${DOMAIN}/contact`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Contact Us', url: `${DOMAIN}/contact` }
    ],
    extraSchema: {
      "@type": "ContactPage",
      "name": "Contact Iron Prairie Fabrication Group LLC",
      "description": "Request custom metal fabrication quotes, submit engineering drawings, or contact our Bay City shop directly."
    }
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy for Iron Prairie Fabrication Group LLC',
    description: 'Read how Iron Prairie Fabrication Group LLC protects inquiry data, project specs, and contact details for Texas and nationwide customers each day.',
    canonical: `${DOMAIN}/privacy-policy`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Privacy Policy', url: `${DOMAIN}/privacy-policy` }
    ]
  },
  {
    path: '/terms-of-service',
    title: 'Terms of Service for Iron Prairie Fabrication Group',
    description: 'Review Iron Prairie Fabrication Group LLC terms for custom metal fabrication quotes, specifications, payments, and project agreements across Texas.',
    canonical: `${DOMAIN}/terms-of-service`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Terms of Service', url: `${DOMAIN}/terms-of-service` }
    ]
  },
  {
    path: '/storefront',
    title: 'ASME Paddle Blind Storefront & Configurator | Iron Prairie TX',
    description: 'Configure ASME B16.48 paddle blinds with instant pricing, dimensional weights, certified MTR packets, Texas hot-shot delivery & nationwide checkout online.',
    canonical: `${DOMAIN}/storefront`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'B2B Storefront', url: `${DOMAIN}/storefront` }
    ]
  },
  {
    path: '/paddle-blinds',
    title: 'ASME B16.48 Paddle Blinds & Spacers | Iron Prairie Bay City TX',
    description: 'Order ASME B16.48 paddle blinds in SA-516-70, 304L & 316L with certified 3.1 MTRs. Bay City, TX shop with same-day pricing & daily nationwide shipping now!',
    canonical: `${DOMAIN}/paddle-blinds`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Paddle Blinds', url: `${DOMAIN}/paddle-blinds` }
    ]
  },
  {
    path: '/404',
    title: '404 Not Found | Iron Prairie Fabrication Bay City TX',
    description: 'Page not found. Return to Iron Prairie Fabrication Group LLC for custom metal fabrication and welding in Bay City, TX with nationwide shipping now.',
    canonical: `${DOMAIN}/404`,
    robots: 'noindex, follow',
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: '404 Not Found', url: `${DOMAIN}/404` }
    ]
  }
];

function escapeJsonLd(value) {
  return JSON.stringify(value, null, 2).replace(/</g, '\\u003c');
}

function buildJsonLd(route) {
  const graph = [
    {
      "@type": "WebSite",
      "@id": `${DOMAIN}/#website`,
      "url": `${DOMAIN}/`,
      "name": "Iron Prairie Fabrication Group LLC",
      "alternateName": ["Iron Prairie", "Iron Prairie Fabrication", "Iron Prairie Fab"],
      "description": "Certified woman-owned custom metal fabrication shop and manufacturer delivering structural steel, CNC plasma cutting, ranch entrance gates, ASME B16.48 paddle blinds, and specialty steel builds.",
      "inLanguage": "en-US",
      "publisher": { "@id": `${DOMAIN}/#organization` }
    },
    {
      "@type": [
        "HomeAndConstructionBusiness",
        "LocalBusiness",
        "Manufacturer"
      ],
      "@id": `${DOMAIN}/#organization`,
      "name": "Iron Prairie Fabrication Group LLC",
      "alternateName": ["Iron Prairie", "Iron Prairie Fabrication", "Iron Prairie Fab"],
      "url": `${DOMAIN}/`,
      "logo": `${DOMAIN}/Logo.jpg`,
      "image": OG_IMAGE,
      "description": "Certified woman-owned custom metal fabrication shop and industrial manufacturer delivering high-precision structural steel fabrication, high-definition CNC plasma plate cutting, custom ranch entrance gates, livestock handling equipment, ASME B16.48 paddle blinds, custom tornado shelters & underground bunkers, and custom part fabrication locally across Bay City, Houston, Baytown, and the Texas Gulf Coast, with daily freight shipping nationwide across all 50 states.",
      "telephone": "+19792489266",
      "email": "Sales@ironprairiefabrication.com",
      "priceRange": "$$",
      "currenciesAccepted": "USD",
      "paymentAccepted": "Cash, Credit Card, ACH, Purchase Order, Net 30",
      "hasMap": "https://www.google.com/maps?cid=12180860875323553231",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "200 County Rd 170",
        "addressLocality": "Bay City",
        "addressRegion": "TX",
        "postalCode": "77414",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 28.9227707,
        "longitude": -95.8318058
      },
      "openingHoursSpecification": [
        { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "07:00", "closes": "18:00" },
        { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "08:00", "closes": "14:00" }
      ],
      "areaServed": [
        { "@type": "City", "name": "Bay City", "sameAs": "https://en.wikipedia.org/wiki/Bay_City,_Texas" },
        { "@type": "AdministrativeArea", "name": "Matagorda County", "sameAs": "https://en.wikipedia.org/wiki/Matagorda_County,_Texas" },
        { "@type": "City", "name": "Freeport", "sameAs": "https://en.wikipedia.org/wiki/Freeport,_Texas" },
        { "@type": "City", "name": "Lake Jackson", "sameAs": "https://en.wikipedia.org/wiki/Lake_Jackson,_Texas" },
        { "@type": "City", "name": "Angleton", "sameAs": "https://en.wikipedia.org/wiki/Angleton,_Texas" },
        { "@type": "City", "name": "Houston", "sameAs": "https://en.wikipedia.org/wiki/Houston" },
        { "@type": "City", "name": "Baytown", "sameAs": "https://en.wikipedia.org/wiki/Baytown,_Texas" },
        { "@type": "City", "name": "Pearland", "sameAs": "https://en.wikipedia.org/wiki/Pearland,_Texas" },
        { "@type": "City", "name": "Pasadena", "sameAs": "https://en.wikipedia.org/wiki/Pasadena,_Texas" },
        { "@type": "City", "name": "Corpus Christi", "sameAs": "https://en.wikipedia.org/wiki/Corpus_Christi,_Texas" },
        { "@type": "AdministrativeArea", "name": "Brazoria County", "sameAs": "https://en.wikipedia.org/wiki/Brazoria_County,_Texas" },
        { "@type": "AdministrativeArea", "name": "Texas Gulf Coast" },
        { "@type": "State", "name": "Texas", "sameAs": "https://en.wikipedia.org/wiki/Texas" },
        { "@type": "Country", "name": "United States", "sameAs": "https://en.wikipedia.org/wiki/United_States" }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Custom Metal Fabrication & Industrial Manufacturing Services",
        "itemListElement": [
          {
            "@type": "OfferCatalog",
            "name": "Custom Ranch Entrance Gates & Boundary Steel",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Custom Ranch Entrance Gates & Boundary Steel",
                  "description": "Architectural ranch entrance gates, cattle guards, fence line pipe, access control framing, and heavy ornamental steel builds for Texas ranches and rural estates.",
                  "provider": { "@id": `${DOMAIN}/#organization` }
                }
              }
            ]
          },
          {
            "@type": "OfferCatalog",
            "name": "Agriculture & Livestock Equipment (pens, chutes, traps)",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Agriculture & Livestock Equipment (pens, chutes, traps)",
                  "description": "Heavy-duty custom livestock handling pens, corral systems, squeeze chutes, modular feral hog traps, cattle guards, and agricultural equipment repairs.",
                  "provider": { "@id": `${DOMAIN}/#organization` }
                }
              }
            ]
          },
          {
            "@type": "OfferCatalog",
            "name": "High-Definition CNC Plasma Plate Cutting",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "High-Definition CNC Plasma Plate Cutting",
                  "description": "High-definition CNC plasma cutting for mild steel, SA-516-70 carbon steel, stainless steel, and aluminum plate. Precision gussets, baseplates, flanges, and custom parts.",
                  "provider": { "@id": `${DOMAIN}/#organization` }
                }
              }
            ]
          },
          {
            "@type": "OfferCatalog",
            "name": "Structural Steel Fabrication & Welding",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Structural Steel Fabrication & Welding",
                  "description": "Commercial and industrial structural steel fabrication, certified welding, structural skids, pipe welding, mezzanine steel, and equipment supports.",
                  "provider": { "@id": `${DOMAIN}/#organization` }
                }
              }
            ]
          },
          {
            "@type": "OfferCatalog",
            "name": "ASME B16.48 Paddle Blinds & Spacers",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "ASME B16.48 Paddle Blinds & Spacers",
                  "description": "Positive isolation paddle blinds, figure-8 spectacle blinds, and spacer rings (150# to 2500#, 1/2\" to 24\"+ NPS) with certified EN 10204 3.1 MTRs and daily nationwide shipping.",
                  "provider": { "@id": `${DOMAIN}/#organization` }
                }
              }
            ]
          },
          {
            "@type": "OfferCatalog",
            "name": "Custom Tornado Shelters & Underground Bunkers",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Custom Tornado Shelters & Underground Bunkers",
                  "description": "Engineered steel tornado shelters, storm safety rooms, underground survival bunkers, and large built-in heavy security safes fabricated to project specifications.",
                  "provider": { "@id": `${DOMAIN}/#organization` }
                }
              }
            ]
          },
          {
            "@type": "OfferCatalog",
            "name": "Custom Part Fabrication & Prototyping",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Custom Part Fabrication & Prototyping",
                  "description": "One-off parts, short-run manufacturing, OEM replacement parts, aluminum welding, brackets, and custom sheet metal for local shops and industrial clients.",
                  "provider": { "@id": `${DOMAIN}/#organization` }
                }
              }
            ]
          },
          {
            "@type": "OfferCatalog",
            "name": "Public Agency & Municipal Infrastructure Fabrication",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Public Agency & Municipal Infrastructure Fabrication",
                  "description": "Procurement-ready fabrication for Texas Parks & Wildlife (TPWD), municipalities, counties, and federal agencies. Park fire rings, safety handrails, and municipal steel structures.",
                  "provider": { "@id": `${DOMAIN}/#organization` }
                }
              }
            ]
          }
        ]
      },
      "sameAs": [
        "https://www.google.com/maps?cid=12180860875323553231",
        "https://maps.app.goo.gl/ipFsC9qtHyKwZZS39",
        "https://www.facebook.com/ironprairiefabrication",
        "https://www.linkedin.com/company/iron-prairie-fabrication-group",
        "https://universal-dynamic.com"
      ],
      "identifier": {
        "@type": "PropertyValue",
        "name": "SAM.gov Unique Entity Identifier (UEI)",
        "value": "XX7XCMGN9XD5"
      },
      "knowsAbout": [
        "Custom Metal Fabrication",
        "Structural Steel Fabrication",
        "Custom Part Fabrication",
        "Fabrication Company Near Me",
        "Local Fabrication Shops",
        "Metal Fabrication Companies",
        "High-Definition CNC Plasma Plate Cutting",
        "ASME B16.48 Paddle Blinds & Spacers",
        "Custom Ranch Entrance Gates & Boundary Steel",
        "Agriculture & Livestock Equipment (Pens, Chutes, Traps)",
        "Custom Tornado Shelters & Underground Bunkers",
        "Industrial Welding",
        "Pipe Fabrication",
        "Aluminum Welding",
        "Petrochemical Refinery Turnaround Blinds",
        "Nationwide Freight Logistics",
        "Government Contracting (SAM.gov Registered, UEI: XX7XCMGN9XD5)"
      ]
    }
  ];

  if (route.breadcrumbs && route.breadcrumbs.length > 0) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${route.canonical}#breadcrumb`,
      "itemListElement": route.breadcrumbs.map((b, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": b.name,
        "item": b.url
      }))
    });
  }

  if (route.extraSchema) {
    graph.push(route.extraSchema);
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}

function buildStaticBody(route) {
  const isPaddleBlinds = route.path === '/paddle-blinds' || route.path === '/storefront';
  return `
    <header style="padding:1rem 1.5rem;background:#241d1a;color:#f7f5f0;font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;">
      <div style="max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
        <div>
          <span style="font-size:1.1rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#f7f5f0;">Iron Prairie Fabrication Group LLC</span>
          <span style="display:block;font-size:0.8rem;color:#d7ccc8;">Bay City &amp; Houston, TX &bull; Custom Metal Fabrication Shop &bull; ASME B16.48 Paddle Blinds</span>
        </div>
        <div style="font-size:0.9rem;">
          <a href="tel:(979)248-9266" data-ga-location="prerender_static_header_phone" style="color:#6ee7b7;font-weight:700;text-decoration:none;">Call Shop: (979) 248-9266</a>
        </div>
      </div>
    </header>
    <main style="max-width:1100px;margin:2rem auto;padding:0 1.5rem;min-height:950px;font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;color:#1e293b;">
      ${route.path === '/' ? `
      <section class="home-hero" style="margin-bottom:2rem;border-radius:16px;overflow:hidden;background:#161413;min-height:320px;position:relative;">
        <picture>
          <source media="(max-width: 640px)" srcset="/images/hero-gate-mobile.avif" type="image/avif" />
          <source media="(max-width: 640px)" srcset="/images/hero-gate-mobile.webp" type="image/webp" />
          <source srcset="/images/hero-gate.avif" type="image/avif" />
          <source srcset="/images/hero-gate.webp" type="image/webp" />
          <img
            class="home-hero__media"
            src="/images/hero-gate.webp"
            alt="Custom fabricated ranch entrance gate and boundary steel by Iron Prairie Fabrication Group LLC"
            width="1024"
            height="768"
            fetchpriority="high"
            decoding="sync"
            style="width:100%;height:auto;max-height:480px;object-fit:cover;display:block;"
          />
        </picture>
      </section>
      ` : ''}
      <h1 style="font-size:2.2rem;font-weight:800;color:#241d1a;margin-bottom:1rem;line-height:1.2;">${route.title}</h1>
      <p class="geo" style="font-size:1.15rem;line-height:1.6;color:#334155;max-width:850px;margin-bottom:1.5rem;">${route.description}</p>
      
      <nav aria-label="Quick links" style="margin-bottom:2rem;padding:0.85rem 1.2rem;background:#f1f5f9;border-radius:12px;display:flex;flex-wrap:wrap;gap:0.75rem;font-size:0.9rem;">
        <strong style="color:#0f172a;">Quick Navigation:</strong>
        <a href="/" style="color:#241d1a;font-weight:600;">Home</a>
        <a href="/about" style="color:#241d1a;font-weight:600;">About Us</a>
        <a href="/services" style="color:#241d1a;font-weight:600;">Services</a>
        <a href="/projects" style="color:#241d1a;font-weight:600;">Projects</a>
        <a href="/paddle-blinds" style="color:#241d1a;font-weight:600;">ASME Paddle Blinds</a>
        <a href="/woman-owned" style="color:#241d1a;font-weight:600;">Woman-Owned (SAM.gov)</a>
        <a href="/contact" style="color:#241d1a;font-weight:600;">Request Quote</a>
      </nav>

      ${isPaddleBlinds ? `
      <section style="margin:2rem 0;padding:1.5rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
        <h2 style="font-size:1.4rem;color:#241d1a;margin-bottom:0.75rem;">ASME B16.48 Positive Isolation Paddle Blinds &amp; Spacers</h2>
        <p style="font-size:0.95rem;line-height:1.6;color:#475569;margin-bottom:1rem;">
          In-house precision CNC plasma cutting for positive pipeline isolation. Fully traceable domestic SA-516-70 carbon steel, 304/304L stainless, and 316/316L stainless plate. All orders include certified EN 10204 3.1 Mill Test Reports (MTRs).
        </p>
        <ul style="font-size:0.9rem;line-height:1.8;color:#334155;">
          <li><strong>Pressure Classes:</strong> Class 150#, 300#, 600#, 900#, and 1500# standard in matrix (Class 2500# and custom pressure ratings available upon RFQ).</li>
          <li><strong>Pipe Sizes:</strong> 1/2" NPS up to 24" NPS standard catalog sizes (oversized diameters up to 60"+ available upon custom RFQ).</li>
          <li><strong>Materials &amp; Alloys:</strong> Domestic SA-516 Grade 70 PVQ Carbon Steel, 304/304L Stainless, and 316/316L Stainless (Duplex 2205, Inconel, Monel, and exotic alloys upon RFQ).</li>
          <li><strong>Gasket Facings:</strong> Raised Face (RF) smooth/serrated finish, Ring Type Joint (RTJ) male octagonal, and custom groove profiles upon RFQ.</li>
          <li><strong>Texas Turnaround Logistics:</strong> Emergency 2-4 hour hot-shot courier delivery to Freeport, Baytown, Houston, Texas City, Corpus Christi, and Beaumont/Port Arthur.</li>
          <li><strong>Nationwide Logistics:</strong> Daily UPS Ground/Air parcel for boxed blinds; palletized LTL freight and dedicated flatbeds across all 50 states.</li>
        </ul>
      </section>
      ` : `
      <section style="margin:2rem 0;padding:1.5rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
        <h2 style="font-size:1.4rem;color:#241d1a;margin-bottom:0.75rem;">Core Custom Metal Fabrication Capabilities</h2>
        <ul style="font-size:0.95rem;line-height:1.8;color:#475569;">
          <li><strong>Custom Ranch Entrance Gates &amp; Boundary Steel:</strong> Architectural ranch entrance gates, cattle guards, fence line pipe, access control framing, and heavy ornamental steel builds.</li>
          <li><strong>Agriculture &amp; Livestock Equipment:</strong> Heavy-duty custom livestock handling pens, corral systems, squeeze chutes, modular feral hog traps, cattle guards, and agricultural equipment repairs.</li>
          <li><strong>High-Definition CNC Plasma Plate Cutting:</strong> Precision plate cutting from gauge sheet up to heavy structural steel plate in carbon, stainless, and aluminum. Precision gussets, baseplates, flanges, and custom part fabrication.</li>
          <li><strong>Structural Steel Fabrication &amp; Certified Welding:</strong> Commercial and industrial structural steel fabrication, certified welding, structural skids, pipe welding, mezzanine steel, and equipment supports.</li>
          <li><strong>ASME B16.48 Paddle Blinds &amp; Spacers:</strong> In-house manufactured positive isolation paddle blinds and spacer rings with certified EN 10204 3.1 MTR paperwork.</li>
          <li><strong>Custom Tornado Shelters &amp; Underground Bunkers:</strong> Engineered steel storm safety shelters, underground survival bunkers, and heavy built-in security safes.</li>
          <li><strong>Custom Part Fabrication &amp; Prototyping:</strong> Rapid turnaround on short-run components, replacement parts, brackets, aluminum welding, and custom assemblies for local businesses.</li>
          <li><strong>Public Agency &amp; Municipal Metalwork:</strong> TPWD park infrastructure, fire rings, railings, and municipal steel components (SAM.gov UEI: XX7XCMGN9XD5).</li>
        </ul>
      </section>
      `}

      <section style="margin:2rem 0;padding:1.5rem;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;">
        <h2 style="font-size:1.2rem;color:#241d1a;margin-bottom:0.5rem;">Local Texas Shop Presence &amp; Fast Regional Delivery</h2>
        <p style="font-size:0.95rem;line-height:1.6;color:#475569;">
          Located in Bay City, Texas (Matagorda County), Iron Prairie provides local fabrication shop service, fast jobsite drop-offs, and emergency 2-4 hour hot-shot courier delivery throughout <strong>Bay City, Freeport, Lake Jackson, Angleton, Houston, Baytown, Pasadena, Corpus Christi, Pearland, Brazoria County, and the Texas Gulf Coast</strong>. Shipped orders move daily via UPS parcel, palletized LTL freight, and dedicated flatbeds across all 50 US states.
        </p>
      </section>

      <div class="prerender-footer" role="contentinfo" style="margin-top:3rem;padding:1.5rem 0;border-top:1px solid #e2e8f0;font-size:0.85rem;color:#64748b;line-height:1.6;">
        <p><strong>Iron Prairie Fabrication Group LLC</strong> &bull; 200 County Rd 170, Bay City, TX 77414 (Matagorda County)</p>
        <p>Direct Inquiries: <a href="tel:(979)248-9266" data-ga-location="prerender_static_footer_phone" style="color:#0f172a;font-weight:700;">(979) 248-9266</a> | Email: <a href="mailto:Sales@ironprairiefabrication.com" style="color:#0f172a;">Sales@ironprairiefabrication.com</a></p>
        <p>Serving Bay City, Matagorda County, Brazoria County, Freeport, Lake Jackson, Angleton, Houston, Baytown, Pasadena, Corpus Christi, Texas statewide, and nationwide freight shipping across all 50 US states.</p>
        <p>Certified Woman-Owned Business &bull; SAM.gov Unique Entity ID (UEI): <strong>XX7XCMGN9XD5</strong></p>
      </div>
    </main>
  `;
}

let generatedCount = 0;

for (const route of routes) {
  let html = template;

  html = html.replace(/<title>.*?<\/title>/s, `<title>${route.title}</title>`);

  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/s,
    `<meta name="description" content="${route.description}" />`
  );

  html = html.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/s,
    `<link rel="canonical" href="${route.canonical}" />`
  );

  html = html.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/s,
    `<meta property="og:title" content="${route.title}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/s,
    `<meta property="og:description" content="${route.description}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/s,
    `<meta property="og:url" content="${route.canonical}" />`
  );
  html = html.replace(
    /<meta\s+property="og:image"\s+content=".*?"\s*\/?>/s,
    `<meta property="og:image" content="${OG_IMAGE}" />`
  );

  html = html.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/s,
    `<meta name="twitter:title" content="${route.title}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/s,
    `<meta name="twitter:description" content="${route.description}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/s,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`
  );

  if (route.robots) {
    html = html.replace(
      /<meta\s+name="robots"\s+content=".*?"\s*\/?>/s,
      `<meta name="robots" content="${route.robots}" />`
    );
  }

  const jsonLdScript = `<script type="application/ld+json">\n${escapeJsonLd(buildJsonLd(route))}\n</script>`;

  html = html.replace(
    /<script\s+type="application\/ld\+json">.*?<\/script>/s,
    jsonLdScript
  );

  // Only preload the hero-gate LCP image on the home page
  if (route.path !== '/') {
    html = html.replace(
      /<!-- Preload LCP Hero Image[\s\S]*?-->\s*(?:<link rel="preload" href="\/images\/hero-gate[^"]+"[^>]+>\s*)+/,
      ''
    );
  }

  // Inject semantic static body fallback inside #root for crawlers, AI agents, and non-JS clients
  const staticBody = buildStaticBody(route);

  html = html.replace(
    /<div\s+id="root"><\/div>/s,
    `<div id="root">${staticBody}</div>`
  );

  // Async CSS loading via hashed script (zero CSP inline event handler violations)
  const loadCssScript = `<script>
    (function(){
      var el = document.getElementById('app-css');
      if (el) el.media = 'all';
    })();
  </script>`;

  const criticalCss = `<style id="critical-css">
    :root { --brand-ink: #161413; --brand-bone: #f7f5f0; --brand-brown: #6b3b2a; --brand-panel: #1f1c1a; --header-offset: 8.25rem; }
    body { background: #161413; color: #f7f5f0; margin: 0; font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif; }
    .home-hero {
      position: relative;
      background: #161413;
      min-height: calc(100svh - var(--header-offset));
      display: flex;
      align-items: center;
      overflow: hidden;
      width: 100%;
    }
    .home-hero__media-wrapper {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    }
    @media (min-width: 1024px) {
      .home-hero__media-wrapper { left: 40%; width: 60%; }
    }
    .home-hero__media {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 58% 32%;
      display: block;
    }
    @media (max-width: 1023px) {
      .home-hero__media { object-position: 68% 34%; }
    }
  </style>`;

  html = html.replace(
    /<link\s+rel="stylesheet"\s+crossorigin\s+href="(\/assets\/index-[^"]+\.css)">/s,
    `<link id="app-css" rel="stylesheet" crossorigin href="$1" media="print">\n    ${loadCssScript}\n    <noscript><link rel="stylesheet" crossorigin href="$1"></noscript>\n    ${criticalCss}`
  );

  if (route.path === '/') {
    fs.writeFileSync(templatePath, html, 'utf8');
    console.log(`[SSG Prerender] Generated static pre-render HTML: ${templatePath}`);
  } else {
    const routeName = route.path.slice(1);
    const htmlFilePath = path.resolve(distDir, `${routeName}.html`);
    const routeFolder = path.resolve(distDir, routeName);
    if (!fs.existsSync(routeFolder)) {
      fs.mkdirSync(routeFolder, { recursive: true });
    }
    const indexPath = path.resolve(routeFolder, 'index.html');

    fs.writeFileSync(htmlFilePath, html, 'utf8');
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log(`[SSG Prerender] Generated static pre-render HTML: ${htmlFilePath} & ${indexPath}`);
  }
  generatedCount++;
}

console.log(`[SSG Prerender] ✅ Successfully generated ${generatedCount} static route packages in dist/!`);
