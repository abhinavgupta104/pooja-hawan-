import { useEffect } from 'react'
import { SITE, absoluteUrl } from '../seo/seoConfig'

// ─────────────────────────────────────────────────────────────
//  <Seo /> — per-route document metadata.
//
//  Imperatively upserts <title>, <meta>, <link rel="canonical"> and
//  Open Graph / Twitter tags so there is exactly ONE of each (no
//  duplicates against the static defaults in index.html), and injects
//  page-specific JSON-LD. Renders nothing.
//
//  Works on every client-side route change and is fully read by
//  Googlebot, which renders JavaScript.
// ─────────────────────────────────────────────────────────────

function upsertMeta(attr, key, content) {
  if (content == null) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', String(content))
}

function upsertLink(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function Seo({
  title,
  description,
  path,
  image,
  type = 'website',
  keywords,
  noindex = false,
  jsonLd,
}) {
  const canonical = absoluteUrl(path || (typeof window !== 'undefined' ? window.location.pathname : '/'))
  const ogImage = image ? absoluteUrl(image) : SITE.defaultImage
  const robots = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
  // Serialize so the effect only re-runs when the structured data actually
  // changes — not on every parent re-render (jsonLd is a fresh object each render).
  const jsonLdString = jsonLd ? JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : ''

  useEffect(() => {
    if (title) document.title = title

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'keywords', keywords)
    upsertMeta('name', 'robots', robots)
    upsertLink('canonical', canonical)

    // Open Graph
    upsertMeta('property', 'og:site_name', SITE.name)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('property', 'og:image', ogImage)
    upsertMeta('property', 'og:locale', SITE.locale)

    // Twitter
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', ogImage)

    // Page-specific JSON-LD (replace any previously injected by <Seo />)
    document.head
      .querySelectorAll('script[data-seo-jsonld="true"]')
      .forEach((n) => n.remove())

    if (jsonLdString) {
      const blocks = JSON.parse(jsonLdString)
      blocks.forEach((block) => {
        if (!block) return
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.setAttribute('data-seo-jsonld', 'true')
        script.textContent = JSON.stringify(block)
        document.head.appendChild(script)
      })
    }

    return () => {
      document.head
        .querySelectorAll('script[data-seo-jsonld="true"]')
        .forEach((n) => n.remove())
    }
  }, [title, description, keywords, robots, canonical, ogImage, type, jsonLdString])

  return null
}
