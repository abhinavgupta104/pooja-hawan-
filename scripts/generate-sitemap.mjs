// ─────────────────────────────────────────────────────────────
//  Generates public/sitemap.xml from the known routes + services
//  data. Runs automatically before `npm run build` (prebuild hook).
//    node scripts/generate-sitemap.mjs
// ─────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SITE_URL = 'https://pujahavan.com'
const today = new Date().toISOString().split('T')[0]

// Static, indexable routes (path, priority, changefreq)
const staticRoutes = [
  ['/', '1.0', 'daily'],
  ['/services', '0.9', 'weekly'],
  ['/pandits', '0.9', 'weekly'],
  ['/puja', '0.9', 'weekly'],
  ['/panchang', '0.8', 'daily'],
  ['/kundali', '0.8', 'monthly'],
  ['/numerology', '0.8', 'monthly'],
  ['/virtual-puja', '0.7', 'monthly'],
  ['/shop', '0.7', 'weekly'],
  ['/blog', '0.6', 'weekly'],
  ['/booking', '0.6', 'monthly'],
  ['/about', '0.6', 'yearly'],
  ['/contact', '0.6', 'yearly'],
  ['/pandit-registration', '0.6', 'monthly'],
]

// Service detail pages from the services dataset
const services = JSON.parse(
  readFileSync(resolve(ROOT, 'src/data/services.json'), 'utf-8'),
)
const serviceRoutes = services.map((s) => [`/service/${s.slug}`, '0.8', 'monthly'])

const urls = [...staticRoutes, ...serviceRoutes]

const body = urls
  .map(
    ([path, priority, changefreq]) => `  <url>
    <loc>${SITE_URL}${path === '/' ? '/' : path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`

writeFileSync(resolve(ROOT, 'public/sitemap.xml'), xml)
console.log(`✓ sitemap.xml generated with ${urls.length} URLs`)
