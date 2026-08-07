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
    title: 'Custom Metal Fabrication in Texas | Iron Prairie Fabrication Group LLC',
    description: 'Iron Prairie Fabrication Group LLC is a certified woman-owned Texas fabrication partner delivering structural steel, laser plate cutting, welding, and custom ranch equipment across Texas. Request a quote!',
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
            "text": "Iron Prairie Fabrication Group LLC provides structural steel fabrication, high-precision laser plate cutting, custom agricultural and ranch equipment, pipe welding, municipal infrastructure components, tornado shelters, custom bunkers, and large built-in safes."
          }
        },
        {
          "@type": "Question",
          "name": "Is Iron Prairie Fabrication Group a certified woman-owned business?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Iron Prairie Fabrication Group LLC is a certified woman-owned metal fabrication enterprise based in Texas, serving industrial plants, agricultural operators, and state and federal public agencies."
          }
        }
      ]
    }
  },
  {
    path: '/about',
    title: 'About Iron Prairie Fabrication Group | Woman-Owned Texas Metal Shop',
    description: 'Learn about Iron Prairie Fabrication Group LLC, a woman-owned metal fabrication shop built for hard-use ranch, industrial, and public-sector work across Texas.',
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
        "Public Agency Procurement",
        "Structural Steel Projects",
        "Woman-Owned Business Enterprise"
      ]
    }
  },
  {
    path: '/services',
    title: 'Metal Fabrication Services in Texas | Structural Steel & Welding | Iron Prairie',
    description: 'Explore Iron Prairie metal fabrication services: laser plate cutting, structural steel welding, custom ranch gates, livestock pens, tornado shelters, and industrial pipe work.',
    canonical: `${DOMAIN}/services`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Services', url: `${DOMAIN}/services` }
    ],
    extraSchema: {
      "@type": "OfferCatalog",
      "name": "Metal Fabrication Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Structural Steel & Metal Fabrication" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Laser Plate Cutting & Precision Machining" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Agricultural & Livestock Equipment Fabrication" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Bunkers, Tornado Shelters & Built-In Safes" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Public Agency & Municipal Infrastructure Fabrication" } }
      ]
    }
  },
  {
    path: '/projects',
    title: 'Completed Metal Fabrication Projects | Iron Prairie Fabrication Group LLC',
    description: 'View field-proven fabrication projects by Iron Prairie: heavy-duty ranch gates, industrial laser-cut components, custom tornado shelter steelwork, and public park fire rings.',
    canonical: `${DOMAIN}/projects`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Projects', url: `${DOMAIN}/projects` }
    ]
  },
  {
    path: '/woman-owned',
    title: 'Woman-Owned Certified Metal Fabricator in Texas | Iron Prairie',
    description: 'Iron Prairie Fabrication Group LLC is a certified woman-owned metal fabrication enterprise aligned with state and federal public procurement workflows.',
    canonical: `${DOMAIN}/woman-owned`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Woman-Owned & Procurement', url: `${DOMAIN}/woman-owned` }
    ]
  },
  {
    path: '/contact',
    title: 'Request a Fabrication Quote | Iron Prairie Fabrication Group LLC | Freeport TX',
    description: 'Contact Iron Prairie Fabrication Group LLC for custom metal fabrication quotes, bid proposals, and project inquiries in Freeport, Brazoria County, and statewide Texas.',
    canonical: `${DOMAIN}/contact`,
    breadcrumbs: [
      { name: 'Home', url: `${DOMAIN}/` },
      { name: 'Contact Us', url: `${DOMAIN}/contact` }
    ]
  },
  {
    path: '/404',
    title: '404 Page Not Found | Iron Prairie Fabrication Group LLC',
    description: 'The requested page could not be found. Return to Iron Prairie Fabrication Group LLC for custom metal fabrication services in Texas.',
    canonical: `${DOMAIN}/404`,
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
      "description": "Woman-owned fabrication partner for Texas schools, municipalities, ranches, and refineries.",
      "inLanguage": "en-US"
    },
    {
      "@type": "ProfessionalService",
      "@id": `${DOMAIN}/#organization`,
      "name": "Iron Prairie Fabrication Group LLC",
      "url": `${DOMAIN}/`,
      "logo": `${DOMAIN}/Logo.jpg`,
      "image": `${DOMAIN}/Logo.jpg`,
      "description": "Certified woman-owned metal fabrication business delivering high-precision structural steel, custom sheet metal, pipe fabrication, and industrial welding across Texas.",
      "telephone": "+19792489266",
      "email": "Alicia@ironprairiefabrication.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Freeport",
        "addressRegion": "TX",
        "postalCode": "77541",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 28.9541,
        "longitude": -95.3597
      },
      "areaServed": [
        { "@type": "City", "name": "Freeport", "sameAs": "https://en.wikipedia.org/wiki/Freeport,_Texas" },
        { "@type": "City", "name": "Lake Jackson", "sameAs": "https://en.wikipedia.org/wiki/Lake_Jackson,_Texas" },
        { "@type": "City", "name": "Angleton", "sameAs": "https://en.wikipedia.org/wiki/Angleton,_Texas" },
        { "@type": "City", "name": "Pearland", "sameAs": "https://en.wikipedia.org/wiki/Pearland,_Texas" },
        { "@type": "AdministrativeArea", "name": "Brazoria County, TX" },
        { "@type": "State", "name": "Texas" }
      ],
      "sameAs": [
        "https://maps.app.goo.gl/ipFsC9qtHyKwZZS39",
        "https://www.facebook.com/ironprairiefabrication",
        "https://www.linkedin.com/company/iron-prairie-fabrication-group",
        "https://universal-dynamic.com"
      ],
      "knowsAbout": [
        "Structural Steel Fabrication",
        "Custom Sheet Metal Fabrication",
        "Industrial Welding",
        "Pipe Fabrication",
        "Municipal Metalwork",
        "Custom Bunkers and Tornado Shelters",
        "Refinery Fabrication"
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

