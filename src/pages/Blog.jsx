import React, { useState } from 'react'
import Seo from '../components/Seo'
import { PAGES, breadcrumbSchema } from '../seo/seoConfig'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'
import SectionLabel from '../components/common/SectionLabel'

const ARTICLES = [
  { id: 1, category: 'Festivals', title: 'The Complete Guide to Satyanarayan Puja: Steps, Timing & Significance', excerpt: 'Everything you need to know about performing a traditional Satyanarayan Puja at home — from preparation to prasad.', date: 'April 15, 2026', readTime: '8 min read', featured: true },
  { id: 2, category: 'Mantras', title: 'Mahamrityunjay Mantra: Meaning, Benefits & Correct Pronunciation', excerpt: 'The sacred mantra dedicated to Lord Shiva for health, longevity, and liberation from the cycle of death and rebirth.', date: 'April 10, 2026', readTime: '6 min read' },
  { id: 3, category: 'Aarti', title: '10 Most Sacred Aartis Every Hindu Should Know by Heart', excerpt: 'From Om Jai Jagdish Hare to Jai Ambe Gauri — a curated guide to India\'s most beloved daily aartis.', date: 'April 8, 2026', readTime: '5 min read' },
  { id: 4, category: 'Rituals', title: 'Why Griha Pravesh Must Be Done Right: The Vastu Perspective', excerpt: 'A step-by-step explanation of the Griha Pravesh ritual and why choosing the right muhurat is critical for your new home.', date: 'April 3, 2026', readTime: '7 min read' },
  { id: 5, category: 'Astrology', title: 'Kaal Sarp Dosh: Signs, Impact & Remedies', excerpt: 'Understand what Kaal Sarp Dosh means in your horoscope and proven Vedic remedies to reduce its effects.', date: 'March 28, 2026', readTime: '9 min read' },
  { id: 6, category: 'Festivals', title: 'Navratri 2026: Complete Guide to 9 Days, 9 Colors & 9 Forms of Durga', excerpt: 'Your comprehensive guide to celebrating all nine days of Navratri with correct rituals, fasting rules, and puja timings.', date: 'March 22, 2026', readTime: '10 min read' },
]

const CATEGORIES_BLOG = ['All', 'Aarti', 'Mantras', 'Festivals', 'Rituals', 'Astrology']

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All')
  const filtered = activeCategory === 'All' ? ARTICLES.filter(a => !a.featured) : ARTICLES.filter(a => a.category === activeCategory && !a.featured)
  const featured = ARTICLES.find(a => a.featured)

  return (
    <>
      <Seo
        {...PAGES.blog}
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
        ])}
      />
      <Navbar />
      <main style={{ paddingTop: 'var(--nav-h)', backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ backgroundColor: 'var(--bg-section-alt)', padding: '4rem 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container-max">
            <SectionLabel>PUJA HAVAN BLOG</SectionLabel>
            <h1 className="section-heading">Sacred Knowledge &amp; Guides</h1>
          </div>
        </div>

        <div className="container-max" style={{ padding: '3rem 2rem' }}>
          {/* Featured article */}
          {featured && (
            <div className="card-base" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', marginBottom: '3rem', overflow: 'hidden' }}>
              <div style={{ backgroundColor: 'var(--gold-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', minHeight: '240px' }}>📿</div>
              <div style={{ padding: '2rem' }}>
                <span className="service-badge" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>{featured.category}</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.3 }}>{featured.title}</h2>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1rem' }}>{featured.excerpt}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{featured.date} · {featured.readTime}</p>
              </div>
            </div>
          )}

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {CATEGORIES_BLOG.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 500, padding: '0.4rem 1rem',
                borderRadius: '999px', border: activeCategory === cat ? 'none' : '1px solid var(--border)',
                backgroundColor: activeCategory === cat ? 'var(--saffron)' : 'var(--gold-bg)',
                color: activeCategory === cat ? 'white' : 'var(--maroon)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>{cat}</button>
            ))}
          </div>

          {/* Articles grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {filtered.map(article => (
              <div key={article.id} className="card-base" style={{ padding: '1.5rem' }}>
                <span className="service-badge" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>{article.category}</span>
                <h3 className="card-title" style={{ marginBottom: '0.6rem', lineHeight: 1.4 }}>{article.title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '1rem' }}>{article.excerpt}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{article.date} · {article.readTime}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
