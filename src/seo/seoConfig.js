// ─────────────────────────────────────────────────────────────
//  Central SEO configuration for Puja Havan
//  Single source of truth for site metadata, per-route <title>/
//  <meta> content, and JSON-LD structured data builders.
// ─────────────────────────────────────────────────────────────

/** Canonical production origin — no trailing slash. */
export const SITE_URL = 'https://poojahawan.com'

export const SITE = {
  name: 'Puja Havan',
  legalName: 'NucleusAi Automation Private Limited',
  url: SITE_URL,
  // Default social share image (absolute URL required by OG/Twitter).
  defaultImage: `${SITE_URL}/logo.png`,
  twitterHandle: '@pujahavan',
  locale: 'en_IN',
  themeColor: '#7B1C1C',
  phone: '+91-96709-55055',
  email: 'support@poojahawan.com',
  foundingLocation: 'India',
  sameAs: [
    // Add real profile URLs when available — these strengthen the Knowledge Graph.
    // 'https://www.facebook.com/pujahavan',
    // 'https://www.instagram.com/pujahavan',
    // 'https://www.youtube.com/@pujahavan',
  ],
}

/** Effective date shown on the legal/policy pages. Bump when they change. */
export const LAST_UPDATED = '19 July 2026'

/**
 * Operating company behind the Puja Havan brand.
 * Used by the legal/policy pages so the disclosure stays in one place.
 */
export const LEGAL_ENTITY = {
  brand: 'Puja Havan',
  domain: 'poojahawan.com',
  name: 'NucleusAi Automation Private Limited',
  shortName: 'NucleusAi Automation',
  address:
    'Unit 603-604, 6th Floor, Tower B, Bhutani Alphathum, Sector 90, NEPZ Post Office, Noida, Gautam Buddha Nagar 201305, Uttar Pradesh, India',
  email: 'support@poojahawan.com',
  phoneDisplay: '+91 96709 55055',
  phoneHref: '+919670955055',
  jurisdiction: 'Gautam Buddha Nagar, Uttar Pradesh',
}

/** Registered office — powers LocalBusiness structured data. */
export const OFFICES = [
  {
    name: 'NucleusAi Automation Private Limited',
    streetAddress: 'Unit 603-604, 6th Floor, Tower B, Bhutani Alphathum, Sector 90, NEPZ Post Office',
    addressLocality: 'Noida',
    addressRegion: 'Uttar Pradesh',
    postalCode: '201305',
    addressCountry: 'IN',
  },
]

/** Resolve a path (or already-absolute URL) to an absolute canonical URL. */
export function absoluteUrl(pathOrUrl = '/') {
  if (!pathOrUrl) return SITE_URL
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${SITE_URL}${path === '/' ? '' : path.replace(/\/$/, '')}`
}

// ─────────────────────────────────────────────────────────────
//  Per-route metadata
//  title  : shown in SERP + browser tab  (aim ≤ 60 chars)
//  desc   : meta description              (aim 140–160 chars)
//  path   : canonical path
// ─────────────────────────────────────────────────────────────
export const PAGES = {
  home: {
    path: '/',
    title: 'Puja Havan — Book Verified Pandits for Puja, Havan & Homa',
    description:
      'Book verified, experienced pandits online for Puja, Havan, Homa & Samskaras across India. Transparent pricing, samagri included, same-day booking. Trusted by 1 Lakh+ families.',
    keywords:
      'book pandit online, puja booking, havan, homa, satyanarayan puja, griha pravesh, pandit near me, online puja',
  },
  services: {
    path: '/services',
    title: 'Puja & Havan Services — Book Online | Puja Havan',
    description:
      'Explore 20+ authentic Vedic puja and havan services — Satyanarayan Puja, Griha Pravesh, Rudrabhishek, Navgraha Havan & more. Verified pandits, fixed prices, samagri included.',
    keywords:
      'puja services, havan services, book puja online, vedic rituals, satyanarayan puja, griha pravesh, rudrabhishek',
  },
  pandits: {
    path: '/pandits',
    title: 'Find & Book Verified Pandits Near You | Puja Havan',
    description:
      'Browse verified, experienced and multilingual pandits by city, language and specialisation. Read reviews and book the right pandit for your puja in minutes.',
    keywords:
      'pandit booking, book pandit online, pandit near me, verified pandit, hindu priest, purohit booking',
  },
  puja: {
    path: '/puja',
    title: 'Online Puja & E-Puja Booking | Puja Havan',
    description:
      'Book online puja and e-puja performed by verified pandits on your behalf, with live video and prasad delivered to your door. Simple, authentic and transparent.',
    keywords: 'online puja, e-puja, virtual puja, puja at home, book puja',
  },
  'e-puja': {
    path: '/e-puja',
    title: 'E-Puja — Online Puja by Verified Pandits | Puja Havan',
    description:
      'E-Puja lets verified pandits perform your rituals remotely with live streaming and prasad delivery. Coming soon on Puja Havan.',
    keywords: 'e-puja, online puja, remote puja, live puja',
  },
  'virtual-puja': {
    path: '/virtual-puja',
    title: 'Virtual Puja Online — Live Video Rituals | Puja Havan',
    description:
      'Attend your puja live over video from anywhere in the world. Verified pandits perform authentic Vedic rituals virtually, with prasad delivered to your home.',
    keywords: 'virtual puja, online puja live, video puja, remote puja booking',
  },
  panchang: {
    path: '/panchang',
    title: 'Today’s Panchang — Tithi, Nakshatra & Muhurat | Puja Havan',
    description:
      'Free daily Hindu Panchang with tithi, nakshatra, yoga, karana, sunrise, sunset and auspicious muhurat timings for your city. Updated every day.',
    keywords:
      'panchang, today panchang, tithi, nakshatra, shubh muhurat, hindu calendar, aaj ka panchang',
  },
  shop: {
    path: '/shop',
    title: 'Puja Samagri Shop — Kits & Essentials Online | Puja Havan',
    description:
      'Shop authentic puja samagri kits, havan essentials, idols and pooja items online. Curated, quality-checked and delivered to your doorstep.',
    keywords: 'puja samagri, havan samagri, pooja items online, puja kit, samagri shop',
  },
  booking: {
    path: '/booking',
    title: 'Book a Puja Online | Puja Havan',
    description:
      'Book your puja or havan in a few simple steps. Choose your ritual, date and pandit, and confirm instantly with transparent pricing and samagri included.',
    keywords: 'book puja, puja booking, book pandit, online puja booking',
  },
  blog: {
    path: '/blog',
    title: 'Vedic Blog — Puja Guides, Muhurat & Festivals | Puja Havan',
    description:
      'Read guides on Hindu pujas, havans, festivals, muhurat and Vedic traditions. Learn the meaning, benefits and correct way to perform every ritual.',
    keywords: 'puja blog, vedic guides, festival dates, muhurat, hindu rituals',
  },
  numerology: {
    path: '/numerology',
    title: 'Free Numerology Calculator — Life Path & Lucky Numbers | Puja Havan',
    description:
      'Discover your numerology profile free — life path number, destiny number and lucky numbers based on your name and date of birth. Instant, accurate results.',
    keywords:
      'numerology, numerology calculator, life path number, lucky number, free numerology',
  },
  kundali: {
    path: '/kundali',
    title: 'Free Kundali & Birth Chart Online — Janam Kundali | Puja Havan',
    description:
      'Generate your free Janam Kundali (birth chart) online with accurate Vedic calculations — planetary positions, dashas, doshas and predictions in minutes.',
    keywords:
      'kundali, free kundali, janam kundali, birth chart, horoscope, vedic astrology, kundli online',
  },
  about: {
    path: '/about',
    title: 'About Puja Havan — India’s Trusted Puja Platform',
    description:
      'Puja Havan connects families with certified Jyotishacharyas and verified pandits for authentic Vedic rituals. Learn about our mission, values and promise.',
    keywords: 'about puja havan, verified pandits, vedic rituals platform',
  },
  contact: {
    path: '/contact',
    title: 'Contact Puja Havan — Support & Booking Help',
    description:
      'Get in touch with Puja Havan for booking help, custom pujas or support. Call +91 96709 55055 or email support@poojahawan.com. We’re here 6 AM–10 PM daily.',
    keywords: 'contact puja havan, puja booking support, customer care',
  },
  'privacy-policy': {
    path: '/privacy-policy',
    title: 'Privacy Policy | Puja Havan',
    description:
      'How NucleusAi Automation Private Limited collects, uses, stores and protects your personal data on Puja Havan, and the rights you have over it.',
    keywords: 'privacy policy, data protection, puja havan privacy',
  },
  'terms-of-service': {
    path: '/terms-of-service',
    title: 'Terms of Service | Puja Havan',
    description:
      'The terms governing your use of Puja Havan — bookings, pandit services, payments, user conduct, liability and dispute resolution.',
    keywords: 'terms of service, terms and conditions, puja havan terms',
  },
  'refund-policy': {
    path: '/refund-policy',
    title: 'Refund & Cancellation Policy | Puja Havan',
    description:
      'Puja Havan cancellation windows and refund amounts, pandit no-show protection, samagri and rescheduling rules, and how long refunds take.',
    keywords: 'refund policy, cancellation policy, puja booking refund',
  },
  'cookie-policy': {
    path: '/cookie-policy',
    title: 'Cookie Policy | Puja Havan',
    description:
      'What cookies and local storage Puja Havan uses, why we use them, and how you can control or disable them in your browser.',
    keywords: 'cookie policy, cookies, tracking, puja havan',
  },
  'responsible-disclosure': {
    path: '/responsible-disclosure',
    title: 'Responsible Disclosure Policy | Puja Havan',
    description:
      'Report a security vulnerability in Puja Havan safely. Our scope, safe-harbour commitment, reporting process and response timelines.',
    keywords: 'responsible disclosure, vulnerability disclosure, security policy, bug report',
  },
}

// ─────────────────────────────────────────────────────────────
//  Structured data (JSON-LD) builders
// ─────────────────────────────────────────────────────────────

/** Organization — the brand entity. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    email: SITE.email,
    telephone: SITE.phone,
    description:
      'India’s trusted platform to book verified, experienced pandits for Puja, Havan, Homa and Samskaras with transparent pricing and samagri included.',
    address: OFFICES.map((o) => ({
      '@type': 'PostalAddress',
      streetAddress: o.streetAddress,
      addressLocality: o.addressLocality,
      addressRegion: o.addressRegion,
      postalCode: o.postalCode,
      addressCountry: o.addressCountry,
    })),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE.phone,
      contactType: 'customer service',
      email: SITE.email,
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
    ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
  }
}

/** WebSite — enables sitelinks search box in Google. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE.name,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/services?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/** LocalBusiness — one node per office for local SEO. */
export function localBusinessSchema() {
  return OFFICES.map((o, i) => ({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness-${i}`,
    name: o.name,
    url: SITE_URL,
    telephone: SITE.phone,
    email: SITE.email,
    image: `${SITE_URL}/logo.png`,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: o.streetAddress,
      addressLocality: o.addressLocality,
      addressRegion: o.addressRegion,
      postalCode: o.postalCode,
      addressCountry: o.addressCountry,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '06:00',
      closes: '22:00',
    },
  }))
}

/** BreadcrumbList — pass an array of { name, path }. */
export function breadcrumbSchema(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

/** Service/Product schema for a single puja service. */
export function serviceSchema(service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    serviceType: `${service.category} Puja`,
    description: service.description,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: { '@type': 'Country', name: 'India' },
    ...(service.image ? { image: absoluteUrl(service.image) } : {}),
    offers: {
      '@type': 'Offer',
      price: service.startingPrice,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/service/${service.slug}`,
    },
  }
}

/** FAQPage — pass an array of { question, answer }. */
export function faqSchema(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}
