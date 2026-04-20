import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SectionLabel from '../common/SectionLabel'
import PanditCard from '../cards/PanditCard'
import panditsData from '../../data/pandits.json'

const LANGUAGES = ['Hindi', 'Tamil', 'Telugu', 'Kannada', 'Marathi', 'Bengali', 'Gujarati', 'Bihari', 'Maithil']

export default function PanditByLanguage() {
  const [activeLang, setActiveLang] = useState('Hindi')

  const filtered = panditsData
    .filter(p => p.languages.includes(activeLang))
    .slice(0, 4)

  return (
    <section style={{ backgroundColor: 'var(--bg-section-alt)', padding: '5rem 0' }}>
      <div className="container-max">
        <SectionLabel>BY LANGUAGE</SectionLabel>
        <h2 className="section-heading" style={{ marginBottom: '1.75rem' }}>
          Find Your Pandit in Your Language
        </h2>

        {/* Language filter pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
          {LANGUAGES.map(lang => {
            const isActive = lang === activeLang
            return (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  padding: '0.45rem 1.1rem',
                  borderRadius: '999px',
                  border: isActive ? 'none' : '1px solid var(--border)',
                  backgroundColor: isActive ? 'var(--saffron)' : 'var(--gold-bg)',
                  color: isActive ? 'white' : 'var(--maroon)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {lang}
              </button>
            )
          })}
        </div>

        {/* Pandits grid */}
        {filtered.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}>
            {filtered.map(pandit => (
              <PanditCard key={pandit.id} pandit={pandit} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            marginBottom: '2rem',
          }}>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No pandits found for {activeLang}. Please try another language.
            </p>
          </div>
        )}

        <div>
          <Link to="/pandits" style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--maroon)',
            textDecoration: 'none',
            fontWeight: 500,
            borderBottom: '1px solid var(--border-gold)',
            paddingBottom: '2px',
            transition: 'color 0.2s',
          }}>
            View All Pandits →
          </Link>
        </div>
      </div>
    </section>
  )
}
