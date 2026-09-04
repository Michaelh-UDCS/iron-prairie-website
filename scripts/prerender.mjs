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
    title: 'Metal Fabrication Shop Bay City & Houston | Iron Prairie',
    description: 'Fast custom metal fabrication, CNC plasma & ASME paddle blinds in Bay City & Houston area. Direct shop pricing & fast quotes. Call (979) 248-9266 today!',
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
    title: 'Fabrication Services Bay City & Houston | Iron Prairie',
    description: 'Expert Texas metal fabrication: ASME paddle blinds, CNC plasma, structural steel, ranch gates & shelters. Local delivery plus nationwide freight today.',
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
    title: 'ASME B16.48 Paddle Blinds & Spacers | Iron Prairie TX',
    description: 'Order ASME B16.48 paddle blinds in SA-516-70, 304L & 316L with certified MTRs. Bay City, TX shop with same-day pricing & daily nationwide shipping now!',
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
        { "@type": "City", "name": "Baytown", "sameAs": "https://en.wikipedia.org/wiki/Baytown,_Texas" },
        { "@type": "City", "name": "Pasadena", "sameAs": "https://en.wikipedia.org/wiki/Pasadena,_Texas" },
        { "@type": "City", "name": "Corpus Christi", "sameAs": "https://en.wikipedia.org/wiki/Corpus_Christi,_Texas" },
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

function buildStaticBody(route) {
  const isPaddleBlinds = route.path === '/paddle-blinds' || route.path === '/storefront';
  const isHome = route.path === '/';
  return `
    <header style="padding:1rem 1.5rem;background:#241d1a;color:#f7f5f0;font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;">
      <div style="max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
        <div>
          <span style="font-size:1.1rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#f7f5f0;">Iron Prairie Fabrication Group LLC</span>
          <span style="display:block;font-size:0.8rem;color:#d7ccc8;">Bay City, TX &bull; ASME B16.48 Paddle Blinds &bull; Custom Metal Fabrication</span>
        </div>
        <div style="font-size:0.9rem;">
          <a href="tel:+19792489266" style="color:#6ee7b7;font-weight:700;text-decoration:none;">Call Shop: (979) 248-9266</a>
        </div>
      </div>
    </header>
    <main style="max-width:1100px;margin:2rem auto;padding:0 1.5rem;font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;color:#1e293b;">
      ${isHome ? `
      <section style="margin-bottom:2rem;border-radius:16px;overflow:hidden;background:#161413;">
        <picture>
          <source media="(max-width: 640px)" srcset="/images/hero-gate-mobile.webp" type="image/webp" />
          <source srcset="/images/hero-gate.webp" type="image/webp" />
          <img
            src="/images/hero-gate.webp"
            alt="Custom fabricated ranch gate and fence installation by Iron Prairie Fabrication Group LLC"
            width="1024"
            height="768"
            fetchpriority="high"
            decoding="async"
            style="width:100%;height:auto;max-height:480px;object-fit:cover;display:block;"
          />
        </picture>
      </section>
      ` : ''}
      <h1 style="font-size:2.2rem;font-weight:800;color:#241d1a;margin-bottom:1rem;line-height:1.2;">${route.title}</h1>
      <p style="font-size:1.15rem;line-height:1.6;color:#334155;max-width:850px;margin-bottom:1.5rem;">${route.description}</p>
      
      <nav aria-label="Quick links" style="margin-bottom:2rem;padding:0.85rem 1.2rem;background:#f1f5f9;border-radius:12px;display:flex;flex-wrap:wrap;gap:0.75rem;font-size:0.9rem;">
        <strong style="color:#0f172a;">Quick Navigation:</strong>
        <a href="/" style="color:#241d1a;font-weight:600;">Home</a>
        <a href="/about" style="color:#241d1a;font-weight:600;">About</a>
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
        <h2 style="font-size:1.4rem;color:#241d1a;margin-bottom:0.75rem;">Fabrication Capabilities &amp; Service Highlights</h2>
        <ul style="font-size:0.95rem;line-height:1.8;color:#475569;">
          <li><strong>CNC Plasma Plate Cutting:</strong> Precision plate cutting from gauge sheet up to heavy structural steel plate.</li>
          <li><strong>ASME B16.48 Paddle Blinds:</strong> Positive isolation blinds and spacer rings with certified 3.1 MTR paperwork.</li>
          <li><strong>Ranch &amp; Agricultural Equipment:</strong> Heavy-duty custom gates, livestock pens, cattle guards, and field equipment.</li>
          <li><strong>Protective Steel Builds:</strong> Tornado shelter components, custom bunkers, and heavy built-in security safes.</li>
          <li><strong>Public Agency &amp; Municipal Metalwork:</strong> TPWD park infrastructure, fire rings, railings, and municipal steel components.</li>
        </ul>
      </section>
      `}

      <footer style="margin-top:3rem;padding:1.5rem 0;border-top:1px solid #e2e8f0;font-size:0.85rem;color:#64748b;line-height:1.6;">
        <p><strong>Iron Prairie Fabrication Group LLC</strong> &bull; 200 County Rd 170, Bay City, TX 77414</p>
        <p>Direct Inquiries: <a href="tel:+19792489266" style="color:#0f172a;font-weight:700;">(979) 248-9266</a> | Email: <a href="mailto:Sales@ironprairiefabrication.com" style="color:#0f172a;">Sales@ironprairiefabrication.com</a></p>
        <p>Serving Bay City, Matagorda County, Brazoria County, Freeport, Lake Jackson, Angleton, Houston, Baytown, Pasadena, Corpus Christi, Texas statewide, and nationwide freight shipping across all 50 US states.</p>
      </footer>
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
    :root { --brand-ink: #161413; --brand-bone: #f7f5f0; --brand-brown: #6b3b2a; --brand-panel: #1f1c1a; }
    body { background: #161413; color: #f7f5f0; margin: 0; font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif; }
    .home-hero { position: relative; background: #161413; min-height: 380px; display: block; overflow: hidden; }
    .home-hero__media { width: 100%; height: auto; max-height: 600px; object-fit: cover; display: block; }
    input, select, textarea { color: #f7f5f0; }
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
