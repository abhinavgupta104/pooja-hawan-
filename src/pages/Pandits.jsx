import React, { useState } from 'react'
import Seo from '../components/Seo'
import { PAGES, breadcrumbSchema } from '../seo/seoConfig'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'
import SectionLabel from '../components/common/SectionLabel'
import PanditCard from '../components/cards/PanditCard'
import panditsData from '../data/pandits.json'
import citiesData from '../data/cities.json'

const ALL_LANGUAGES = ['All', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Marathi', 'Bengali', 'Gujarati', 'Bihari', 'Maithil']
const ALL_SPECS = ['All', 'Satyanarayan Puja', 'Griha Pravesh', 'Rudrabhishek', 'Navgraha Havan', 'Kaal Sarp Dosh', 'Vivah Puja']

export default function Pandits() {
  const [filterCity, setFilterCity] = useState('All')
  const [filterLang, setFilterLang] = useState('All')
  const [filterSpec, setFilterSpec] = useState('All')
  const [filterRating, setFilterRating] = useState(0)

  const filtered = panditsData.filter(p => {
    if (filterCity !== 'All' && p.city !== filterCity) return false
    if (filterLang !== 'All' && !p.languages.includes(filterLang)) return false
    if (filterSpec !== 'All' && !p.specializations.includes(filterSpec)) return false
    if (p.rating < filterRating) return false
    return true
  })

  return (
    <>
      <Seo
        {...PAGES.pandits}
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Pandits', path: '/pandits' },
        ])}
      />
      <Navbar />
      <main style={{ paddingTop: 'var(--nav-h)', minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
        {/* Header */}
        <div style={{ backgroundColor: 'var(--bg-section-alt)', padding: '4rem 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container-max">
            <SectionLabel>OUR PANDITS</SectionLabel>
            <h1 className="section-heading">Find Your Perfect Pandit</h1>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)', fontSize: '1rem', marginTop: '0.75rem' }}>
              {panditsData.length} verified pandits across 50+ cities and 10+ languages.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ backgroundColor: 'var(--gold-bg)', borderBottom: '1px solid var(--border)', padding: '1.25rem 0' }}>
          <div className="container-max" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              className="form-input form-select"
              style={{ minWidth: '140px' }}
              value={filterCity}
              onChange={e => setFilterCity(e.target.value)}
            >
              <option value="All">All Cities</option>
              {citiesData.slice(0, 12).map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <select
              className="form-input form-select"
              style={{ minWidth: '150px' }}
              value={filterLang}
              onChange={e => setFilterLang(e.target.value)}
            >
              {ALL_LANGUAGES.map(l => (
                <option key={l} value={l}>{l === 'All' ? 'All Languages' : l}</option>
              ))}
            </select>
            <select
              className="form-input form-select"
              style={{ minWidth: '180px' }}
              value={filterSpec}
              onChange={e => setFilterSpec(e.target.value)}
            >
              {ALL_SPECS.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Specializations' : s}</option>
              ))}
            </select>
            <select
              className="form-input form-select"
              style={{ minWidth: '130px' }}
              value={filterRating}
              onChange={e => setFilterRating(Number(e.target.value))}
            >
              <option value={0}>Any Rating</option>
              <option value={4.5}>4.5★ & above</option>
              <option value={4.8}>4.8★ & above</option>
            </select>
            {(filterCity !== 'All' || filterLang !== 'All' || filterSpec !== 'All' || filterRating > 0) && (
              <button
                onClick={() => { setFilterCity('All'); setFilterLang('All'); setFilterSpec('All'); setFilterRating(0) }}
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--maroon)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="container-max" style={{ padding: '3rem 2rem' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Showing {filtered.length} pandit{filtered.length !== 1 ? 's' : ''}
          </p>
          {filtered.length > 0 ? (
            <div className="card-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
              {filtered.map(p => <PanditCard key={p.id} pandit={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                No pandits found
              </p>
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Try adjusting your filters
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
