import React, { useState } from 'react'
import Seo from '../components/Seo'
import { PAGES, breadcrumbSchema } from '../seo/seoConfig'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'
import SectionLabel from '../components/common/SectionLabel'
import ServiceCard from '../components/cards/ServiceCard'
import servicesData from '../data/services.json'

const CATEGORIES = ['All', 'Festival', 'Dosha Nivaran', 'Sanskar', 'Daily', 'Mukti Karma']

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? servicesData
    : servicesData.filter(s => s.category === activeCategory)

  return (
    <>
      <Seo
        {...PAGES.services}
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
        ])}
      />
      <Navbar />
      <main style={{ paddingTop: '68px', minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
        {/* Header */}
        <div style={{ backgroundColor: 'var(--bg-section-alt)', padding: '4rem 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container-max">
            <SectionLabel>ALL SERVICES</SectionLabel>
            <h1 className="section-heading">Puja &amp; Havan Services</h1>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)', fontSize: '1rem', marginTop: '0.75rem', maxWidth: '560px' }}>
              Browse our complete catalog of 20+ Vedic ceremonies and pujas. All services include verified pandits and transparent pricing.
            </p>
          </div>
        </div>

        {/* Filter + Grid */}
        <div className="container-max" style={{ padding: '3rem 2rem' }}>
          {/* Category tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  padding: '0.5rem 1.2rem',
                  borderRadius: '999px',
                  border: activeCategory === cat ? 'none' : '1px solid var(--border)',
                  backgroundColor: activeCategory === cat ? 'var(--saffron)' : 'var(--bg-card)',
                  color: activeCategory === cat ? 'white' : 'var(--maroon)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {cat}
                <span style={{ marginLeft: '0.4rem', opacity: 0.7, fontSize: '0.75rem' }}>
                  ({cat === 'All' ? servicesData.length : servicesData.filter(s => s.category === cat).length})
                </span>
              </button>
            ))}
          </div>

          {/* Services grid — all standard size */}
          <div className="card-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {filtered.map((service, i) => (
              <ServiceCard key={service.id} service={service} featured={false} index={i} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
