// ─────────────────────────────────────────────────────────────
//  Generates public/sitemap.xml from the known routes + services
//  data, including image entries for pooja posters (Google Images).
//  Runs automatically before `npm run build` (prebuild hook).
//    node scripts/generate-sitemap.mjs
// ─────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const SITE_URL = 'https://poojahawan.com'
const today = new Date().toISOString().split('T')[0]

const xmlEscape = (s = '') =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Static, indexable routes → { path, priority, changefreq }
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
  ['/privacy-policy', '0.3', 'yearly'],
  ['/terms-of-service', '0.3', 'yearly'],
  ['/refund-policy', '0.4', 'yearly'],
  ['/cookie-policy', '0.3', 'yearly'],
  ['/responsible-disclosure', '0.3', 'yearly'],
].map(([path, priority, changefreq]) => ({ path, priority, changefreq }))

// Service detail pages from the services dataset (with poster image when present)
const services = JSON.parse(
  readFileSync(resolve(ROOT, 'src/data/services.json'), 'utf-8'),
)
const serviceRoutes = services.map((s) => ({
  path: `/service/${s.slug}`,
  priority: '0.8',
  changefreq: 'monthly',
  image: s.poster || s.image
    ? { loc: `${SITE_URL}${s.poster || s.image}`, title: `${s.name} — ${s.hindiName || 'Puja Havan'}` }
    : null,
}))

const urls = [...staticRoutes, ...serviceRoutes]

const body = urls
  .map((u) => {
    const img = u.image
      ? `\n    <image:image>\n      <image:loc>${xmlEscape(u.image.loc)}</image:loc>\n      <image:title>${xmlEscape(u.image.title)}</image:title>\n    </image:image>`
      : ''
    return `  <url>
    <loc>${SITE_URL}${u.path === '/' ? '/' : u.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${img}
  </url>`
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`

writeFileSync(resolve(ROOT, 'public/sitemap.xml'), xml)
const imgCount = urls.filter((u) => u.image).length
console.log(`✓ sitemap.xml generated with ${urls.length} URLs (${imgCount} with images)`)
