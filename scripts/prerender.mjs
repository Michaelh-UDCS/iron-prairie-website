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
    title: 'Custom Metal Fabrication in Bay City, TX | Iron Prairie',
    description: 'Get custom metal fabrication in Bay City, TX. ASME B16.48 paddle blinds, CNC plasma, ranch steel. Ships all 50 states. Call (979) 248-9266 today!',
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
            "text": "Iron Prairie Fabrication Group LLC provides structural steel fabrication, high-precision CNC plasma plate cutting, ASME B16.48 positive isolation paddle blinds, custom agricultural and ranch equipment, pipe welding, municipal infrastructure components, tornado shelters, custom bunkers, and large built-in safes with nationwide shipping."
          }
        },
        {
          "@type": "Question",
          "name": "Is Iron Prairie Fabrication Group a certified woman-owned business?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Iron Prairie Fabrication Group LLC is a certified woman-owned metal fabrication enterprise based in Bay City, Texas, serving industrial plants, agricultural operators, and state and federal public agencies locally and nationwide."
          }
        },
        {
          "@type": "Question",
          "name": "Does Iron Prairie Fabrication Group ship nationwide across the United States?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Iron Prairie Fabrication Group LLC ships daily across all 50 US states using UPS Ground parcel for boxed blinds and precision parts, plus palletized LTL freight and dedicated flatbed trucking for bulk orders and heavy equipment."
          }
        }
      ]
    }
  },
  {
    path: '/about',
    title: 'About Iron Prairie | Fabrication Shop in Bay City, TX',
    description: 'Iron Prairie Fabrication Group LLC is a woman-owned Bay City, TX metal shop for ranch, industrial, and agency work with daily nationwide shipping.',
    canonical: `${DOMAIN}/about`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'About Us', url: `${DOMAIN}/about` }
    ],
    extraSchema: {
      "@type": "Person",
      "@id": `${DOMAIN}/about#person`,
      "name": "Alicia",
      "jobTitle": "Owner & Principal Executive",
      "worksFor": { "@id": `${DOMAIN}/#organization` },
      "knowsAbout": [
        "Metal Fabrication Management",
        "ASME B16.48 Blinds",
        "Public Agency Procurement",
        "Structural Steel Projects",
        "Woman-Owned Business Enterprise",
        "Nationwide Logistics"
      ]
    }
  },
  {
    path: '/services',
    title: 'Fabrication Services in Bay City, TX | Iron Prairie',
    description: 'Expert Texas metal fabrication: ASME paddle blinds, CNC plasma, structural steel, ranch gates, shelters. Local delivery plus nationwide freight today.',
    canonical: `${DOMAIN}/services`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Services', url: `${DOMAIN}/services` }
    ],
    extraSchema: {
      "@type": "OfferCatalog",
      "name": "Metal Fabrication Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "ASME B16.48 Paddle Blinds & Spacer Rings" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Structural Steel & Metal Fabrication" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "CNC Plasma Plate Cutting & Precision Machining" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Agricultural & Livestock Equipment Fabrication" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Bunkers, Tornado Shelters & Built-In Safes" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Public Agency & Municipal Infrastructure Fabrication" } }
      ]
    }
  },
  {
    path: '/projects',
    title: 'Fabrication Projects in Bay City, TX | Iron Prairie',
    description: 'See Iron Prairie fabrication projects: ranch gates, CNC plasma parts, ASME paddle blinds, and freight shipments from Bay City, TX nationwide daily.',
    canonical: `${DOMAIN}/projects`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Projects', url: `${DOMAIN}/projects` }
    ]
  },
  {
    path: '/woman-owned',
    title: 'Woman-Owned Fabricator in Bay City, TX | Iron Prairie',
    description: 'SAM.gov registered (UEI XX7XCMGN9XD5) woman-owned fabricator in Bay City, TX ready for municipal, state, and federal procurement contracts today.',
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
    title: 'Request Fabrication Quote in Bay City, TX | Iron Prairie',
    description: 'Request a metal fabrication quote in Bay City, TX. ASME blinds, structural steel, and ranch builds. Call (979) 248-9266 or ship nationwide today!',
    canonical: `${DOMAIN}/contact`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Contact Us', url: `${DOMAIN}/contact` }
    ]
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
    title: 'ASME Paddle Blind Configurator | Bay City Iron Prairie',
    description: 'Configure ASME B16.48 paddle blinds with instant pricing, MTR packets, Texas hot-shot options, and daily nationwide shipping checkout online now.',
    canonical: `${DOMAIN}/storefront`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'B2B Storefront', url: `${DOMAIN}/storefront` }
    ]
  },
  {
    path: '/paddle-blinds',
    title: 'ASME B16.48 Paddle Blinds | Ships Nationwide Daily',
    description: 'Order ASME B16.48 paddle blinds in SA-516-70, 304L, and 316L with certified MTRs. Bay City, TX shop with daily nationwide shipping across all USA.',
    canonical: `${DOMAIN}/paddle-blinds`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Paddle Blinds', url: `${DOMAIN}/paddle-blinds` }
    ]
  },
  {
    path: '/traceability',
    title: 'ASME MTR Traceability Portal | Bay City, TX Iron Prairie',
    description: 'Verify Iron Prairie mill test reports, UG-77 stampings, and delivery dockets for ASME B16.48 paddle blinds and isolation spacers online today now.',
    canonical: `${DOMAIN}/traceability`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'ASME Traceability & MTRs', url: `${DOMAIN}/traceability` }
    ]
  },
  {
    path: '/mtr',
    title: 'Certified Mill Test Report Vault | Iron Prairie Fab',
    description: 'Search certified ASME chemical and tensile mill test reports for Texas-cut paddle blinds and positive isolation spacer rings from Iron Prairie TX.',
    canonical: `${DOMAIN}/mtr`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'MTR Vault', url: `${DOMAIN}/mtr` }
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
      "description": "Certified woman-owned fabrication partner for Texas ranches, municipalities, refineries, and industrial buyers nationwide.",
      "inLanguage": "en-US",
      "publisher": { "@id": `${DOMAIN}/#organization` }
    },
    {
      "@type": "HomeAndConstructionBusiness",
      "@id": `${DOMAIN}/#organization`,
      "name": "Iron Prairie Fabrication Group LLC",
      "url": `${DOMAIN}/`,
      "logo": `${DOMAIN}/Logo.jpg`,
      "image": OG_IMAGE,
      "description": "Certified woman-owned metal fabrication business delivering high-precision structural steel, ASME B16.48 paddle blinds, custom sheet metal, pipe fabrication, custom bunkers, tornado shelters, and industrial welding locally across Texas and shipped nationwide across all 50 states.",
      "telephone": "+19792489266",
      "email": "Sales@ironprairiefabrication.com",
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
        "latitude": 28.9828,
        "longitude": -95.9694
      },
      "openingHoursSpecification": [
        { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "07:00", "closes": "18:00" },
        { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "08:00", "closes": "14:00" }
      ],
      "areaServed": [
        { "@type": "City", "name": "Bay City", "sameAs": "https://en.wikipedia.org/wiki/Bay_City,_Texas" },
        { "@type": "City", "name": "Lake Jackson", "sameAs": "https://en.wikipedia.org/wiki/Lake_Jackson,_Texas" },
        { "@type": "City", "name": "Freeport", "sameAs": "https://en.wikipedia.org/wiki/Freeport,_Texas" },
        { "@type": "City", "name": "Angleton", "sameAs": "https://en.wikipedia.org/wiki/Angleton,_Texas" },
        { "@type": "City", "name": "Pearland", "sameAs": "https://en.wikipedia.org/wiki/Pearland,_Texas" },
        { "@type": "City", "name": "Houston", "sameAs": "https://en.wikipedia.org/wiki/Houston" },
        { "@type": "AdministrativeArea", "name": "Matagorda County, TX" },
        { "@type": "AdministrativeArea", "name": "Brazoria County, TX" },
        { "@type": "State", "name": "Texas" },
        { "@type": "Country", "name": "United States" }
      ],
      "sameAs": [
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
        "ASME B16.48 Paddle Blinds",
        "Structural Steel Fabrication",
        "Custom Sheet Metal Fabrication",
        "Industrial Welding",
        "Pipe Fabrication",
        "Municipal Metalwork",
        "Custom Bunkers and Tornado Shelters",
        "Refinery Fabrication",
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
