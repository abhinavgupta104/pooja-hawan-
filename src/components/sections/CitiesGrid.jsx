import React from 'react'
import { Link } from 'react-router-dom'
import SectionLabel from '../common/SectionLabel'
import citiesData from '../../data/cities.json'

export default function CitiesGrid() {
  const displayed = citiesData.slice(0, 24)

  return (
    <section style={{ backgroundColor: 'var(--bg-page)', padding: '5rem 0' }}>
      <div className="container-max">
        <SectionLabel>WE SERVE</SectionLabel>
        <h2 className="section-heading" style={{ marginBottom: '2.5rem' }}>
          Available Across India
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          {displayed.map(city => (
            <div
              key={city.id}
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '8px',
                border: city.isAvailable ? '1px solid var(--border)' : '1px solid var(--border-muted)',
                backgroundColor: 'var(--bg-card)',
                padding: '1.25rem 0.75rem',
                textAlign: 'center',
                display: 'block',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                boxShadow: city.isAvailable ? 'var(--shadow-card)' : 'none',
                cursor: city.isAvailable ? 'pointer' : 'default',
                opacity: city.isAvailable ? 1 : 0.6,
              }}
              onMouseEnter={e => {
                if (city.isAvailable) {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.borderColor = 'var(--border-gold)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-hover)'
                }
              }}
              onMouseLeave={e => {
                if (city.isAvailable) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-card)'
                }
              }}
              onClick={() => {
                if (city.isAvailable) window.location.href = `/pandits?city=${city.name}`
              }}
            >
              {/* Color accent top */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: city.isAvailable ? city.color : '#ccc',
              }} />

              <p style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.85rem',
                color: city.isAvailable ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: 400,
                marginBottom: '0.25rem',
              }}>
                {city.name}
              </p>
              {city.isAvailable ? (
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                }}>
                  {city.panditCount}+ pandits
                </p>
              ) : (
                <span style={{ 
                  fontSize: '0.6rem', 
                  color: 'var(--text-muted)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em' 
                }}>
                  Coming Soon
                </span>
              )}
            </div>
          ))}
        </div>

        <div>
          <Link to="/pandits" style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--maroon)',
            textDecoration: 'none',
            fontWeight: 500,
            borderBottom: '1px solid var(--border-gold)',
            paddingBottom: '2px',
          }}>
            View All Cities →
          </Link>
        </div>
      </div>
    </section>
  )
}
