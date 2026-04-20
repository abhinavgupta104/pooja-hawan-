import React, { useState } from 'react'
import SectionLabel from '../common/SectionLabel'
import ServiceCard from '../cards/ServiceCard'
import servicesData from '../../data/services.json'

const CATEGORIES = ['All', 'Festival', 'Dosha Nivaran', 'Sanskar', 'Daily', 'Mukti Karma']

export default function ServicesGrid() {
  const [activeTab, setActiveTab] = useState('All')

  const filtered = activeTab === 'All'
    ? servicesData
    : servicesData.filter(s => s.category === activeTab)

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <section style={{ backgroundColor: 'var(--bg-section-alt)', padding: '5rem 0', position: 'relative' }}>
      <div className="container-max">
        <div style={{ marginBottom: '2.5rem' }}>
          <SectionLabel>OUR SERVICES</SectionLabel>
          <h2 className="section-heading" style={{ marginBottom: '1.5rem' }}>
            Sacred Puja &amp; Havan Services
          </h2>

          {/* Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {CATEGORIES.map(cat => {
              const isActive = cat === activeTab
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    padding: '0.4rem 1rem',
                    borderRadius: '999px',
                    border: isActive ? 'none' : '1px solid var(--border)',
                    backgroundColor: isActive ? 'var(--saffron)' : 'var(--gold-bg)',
                    color: isActive ? 'white' : 'var(--maroon)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.25rem',
          }}
        >
          {featured && (
            <ServiceCard service={featured} featured={true} index={0} />
          )}
          {rest.map((service, i) => (
            <ServiceCard key={service.id} service={service} featured={false} index={i + 1} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <a
            href="/services"
            className="btn-secondary"
            style={{ display: 'inline-flex' }}
          >
            View All Services →
          </a>
        </div>
      </div>
    </section>
  )
}
