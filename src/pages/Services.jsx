import React from 'react'
import Seo from '../components/Seo'
import { PAGES, breadcrumbSchema } from '../seo/seoConfig'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'
import SectionLabel from '../components/common/SectionLabel'
import PoojaGallery from '../components/sections/PoojaGallery'

export default function Services() {
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

        {/* Single filterable listing (posters where available, deity images otherwise) */}
        <PoojaGallery />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
