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

const routes = [
  {
    path: '/',
    title: 'Custom Metal Fabrication in Texas & Nationwide Shipping | Iron Prairie',
    description: 'Certified woman-owned metal fabrication in Texas. Specializing in ASME paddle blinds, structural steel, custom gates, and CNC plasma cutting. Texas site dispatch & nationwide shipping across all 50 states.',
    canonical: `${DOMAIN}/`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` }
    ],
    schemaType: 'ProfessionalService',
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
            "text": "Yes, Iron Prairie Fabrication Group LLC is a certified woman-owned metal fabrication enterprise based in Texas, serving industrial plants, agricultural operators, and state and federal public agencies locally and nationwide."
          }
        },
        {
          "@type": "Question",
          "name": "Does Iron Prairie Fabrication Group ship nationwide across the United States?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Iron Prairie ships daily across all 50 US states using UPS Ground parcel for boxed blinds and precision parts, plus palletized LTL freight and dedicated flatbed trucking for bulk orders and heavy equipment."
          }
        }
      ]
    }
  },
  {
    path: '/about',
    title: 'About Our Texas Metal Fabrication Shop & Nationwide Shipping | Iron Prairie',
    description: 'Learn about Iron Prairie Fabrication Group, a woman-owned Texas metal shop built for durable ranch, industrial, and public-sector work with regional Texas delivery and nationwide shipping.',
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
    title: 'Metal Fabrication Services in Texas & Nationwide Shipping | Iron Prairie',
    description: 'Expert Texas metal fabrication: ASME B16.48 paddle blinds, CNC plasma cutting, structural steel welding, custom ranch gates, animal pens, tornado shelters, and nationwide logistics.',
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
    title: 'Custom Metal Fabrication Projects | Texas & Nationwide | Iron Prairie',
    description: 'View proven Texas metal fabrication projects: heavy-duty ranch gates, industrial CNC plasma-cut components, ASME paddle blinds, and nationwide freight shipments.',
    canonical: `${DOMAIN}/projects`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Projects', url: `${DOMAIN}/projects` }
    ]
  },
  {
    path: '/woman-owned',
    title: 'Registered Government Contractor & Woman-Owned Fabricator | UEI: XX7XCMGN9XD5 | Iron Prairie',
    description: 'Iron Prairie Fabrication Group LLC is a SAM.gov Registered Government Contractor (UEI: XX7XCMGN9XD5) and certified woman-owned metal fabricator in Texas ready for local, state, and federal public procurement contracts.',
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
    title: 'Request a Metal Fabrication Quote | Texas Shop & Nationwide Shipping',
    description: 'Get a quote for custom metal fabrication, structural steel, ASME paddle blinds, or public procurement. Local Texas jobsite delivery and nationwide freight dispatch.',
    canonical: `${DOMAIN}/contact`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Contact Us', url: `${DOMAIN}/contact` }
    ]
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy | Iron Prairie Fabrication Group LLC',
    description: 'Read the privacy policy for Iron Prairie Fabrication Group LLC. Learn how we handle customer project inquiries, contact submissions, and site data.',
    canonical: `${DOMAIN}/privacy-policy`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Privacy Policy', url: `${DOMAIN}/privacy-policy` }
    ]
  },
  {
    path: '/terms-of-service',
    title: 'Terms of Service | Iron Prairie Fabrication Group LLC',
    description: 'Review the terms of service for Iron Prairie Fabrication Group LLC regarding custom metal fabrication quotes, specifications, and project agreements.',
    canonical: `${DOMAIN}/terms-of-service`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Terms of Service', url: `${DOMAIN}/terms-of-service` }
    ]
  },
  {
    path: '/storefront',
    title: 'ASME B16.48 Paddle Blind Configurator | Texas Shop & Nationwide Shipping | Iron Prairie',
    description: 'Configure and order ASME B16.48 paddle blinds with instant pricing, weight calculation, MTR compliance packets, same-day Texas hot-shot, and nationwide shipping.',
    canonical: `${DOMAIN}/storefront`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'B2B Storefront', url: `${DOMAIN}/storefront` }
    ]
  },
  {
    path: '/paddle-blinds',
    title: 'ASME B16.48 Paddle Blinds & Spacer Rings | Ships Nationwide Daily | Iron Prairie',
    description: 'Turnaround-grade ASME B16.48 paddle blinds in SA-516 Gr. 70, SA-36, 304L, 316L, and 6061-T6 aluminum with certified MTRs, local Texas hot-shot, and daily nationwide shipping.',
    canonical: `${DOMAIN}/paddle-blinds`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Paddle Blinds', url: `${DOMAIN}/paddle-blinds` }
    ]
  },
  {
    path: '/operations',
    title: 'Shop Operations Workspace | Iron Prairie Fabrication',
    description: 'Owner and shop floor operations platform for Iron Prairie Fabrication Group LLC in Texas.',
    canonical: `${DOMAIN}/operations`,
    robots: 'noindex, nofollow',
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Operations', url: `${DOMAIN}/operations` }
    ]
  },
  {
    path: '/shop-floor',
    title: 'Shop Floor Production Whiteboard | Iron Prairie Fabrication',
    description: 'Owner operations and CNC plasma production board for Iron Prairie Fabrication Group LLC in Texas.',
    canonical: `${DOMAIN}/shop-floor`,
    robots: 'noindex, nofollow',
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Shop Floor Operations', url: `${DOMAIN}/shop-floor` }
    ]
  },
  {
    path: '/404',
    title: '404 Page Not Found | Iron Prairie Fabrication Group',
    description: 'The requested page could not be found. Return to Iron Prairie Fabrication Group LLC for custom metal fabrication, structural steel, and welding in Texas.',
    canonical: `${DOMAIN}/404`,
    robots: 'noindex, follow',
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: '404 Not Found', url: `${DOMAIN}/404` }
    ]
  }
];

function buildJsonLd(route) {
  const graph = [
    {
      "@type": "WebSite",
      "@id": `${DOMAIN}/#website`,
      "url": `${DOMAIN}/`,
      "name": "Iron Prairie Fabrication Group LLC",
      "description": "Certified woman-owned fabrication partner for Texas schools, municipalities, ranches, refineries, and industrial buyers nationwide.",
      "inLanguage": "en-US"
    },
    {
      "@type": "ProfessionalService",
      "@id": `${DOMAIN}/#organization`,
      "name": "Iron Prairie Fabrication Group LLC",
      "url": `${DOMAIN}/`,
      "logo": `${DOMAIN}/Logo.jpg`,
      "image": `${DOMAIN}/Logo.jpg`,
      "description": "Certified woman-owned metal fabrication business delivering high-precision structural steel, ASME B16.48 paddle blinds, custom sheet metal, pipe fabrication, and industrial welding across Texas and shipped nationwide across all 50 states.",
      "telephone": "+19792489266",
      "email": "Sales@ironprairiefabrication.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Lake Jackson",
        "addressRegion": "TX",
        "postalCode": "77566",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 29.0339,
        "longitude": -95.4344
      },
      "areaServed": [
        { "@type": "City", "name": "Lake Jackson", "sameAs": "https://en.wikipedia.org/wiki/Lake_Jackson,_Texas" },
        { "@type": "City", "name": "Freeport", "sameAs": "https://en.wikipedia.org/wiki/Freeport,_Texas" },
        { "@type": "City", "name": "Angleton", "sameAs": "https://en.wikipedia.org/wiki/Angleton,_Texas" },
        { "@type": "City", "name": "Pearland", "sameAs": "https://en.wikipedia.org/wiki/Pearland,_Texas" },
        { "@type": "City", "name": "Houston", "sameAs": "https://en.wikipedia.org/wiki/Houston" },
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

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/s, `<title>${route.title}</title>`);

  // Replace Description
  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/s,
    `<meta name="description" content="${route.description}" />`
  );

  // Replace Canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/s,
    `<link rel="canonical" href="${route.canonical}" />`
  );

  // Replace OG Title, Description, URL
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

  // Replace Twitter Title, Description
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/s,
    `<meta name="twitter:title" content="${route.title}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/s,
    `<meta name="twitter:description" content="${route.description}" />`
  );

  // Replace Robots meta if custom
  if (route.robots) {
    html = html.replace(
      /<meta\s+name="robots"\s+content=".*?"\s*\/?>/s,
      `<meta name="robots" content="${route.robots}" />`
    );
  }

  // Replace JSON-LD
  const jsonLdData = buildJsonLd(route);
  const jsonLdScript = `<script type="application/ld+json">\n${JSON.stringify(jsonLdData, null, 2)}\n</script>`;

  html = html.replace(
    /<script\s+type="application\/ld\+json">.*?<\/script>/s,
    jsonLdScript
  );

  // Write output file(s)
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

