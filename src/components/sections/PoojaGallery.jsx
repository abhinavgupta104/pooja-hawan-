import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SectionLabel from '../common/SectionLabel'
import PoojaPoster from '../PoojaPoster'
import { formatPrice } from '../../lib/utils'
import servicesData from '../../data/services.json'

const CATEGORIES = ['All', 'Festival', 'Dosha Nivaran', 'Sanskar', 'Daily', 'Mukti Karma']

const DEFAULT_HEADING = (
  <>Every Ritual, <em style={{ fontStyle: 'italic', color: 'var(--text-gold)', fontWeight: 440 }}>Beautifully&nbsp;Honoured</em></>
)

// ─────────────────────────────────────────────────────────────
//  Sacred Pooja Gallery — filterable listing of ceremonies shown as
//  branded posters (deity image fallback). Reused as the full /services
//  listing and as a curated preview on the home page.
// ─────────────────────────────────────────────────────────────
export default function PoojaGallery({
  eyebrow = 'SACRED CEREMONIES',
  heading = DEFAULT_HEADING,
  intro = 'From Satyanarayan Katha to Griha Pravesh, each ceremony is performed with authentic Vedic vidhi by verified pandits. Tap any pooja to see timings, packages and what’s included.',
  showFilter = true,
  showViewAll = false,
  preferPosters = false,
  limit,
  background = 'var(--bg-page)',
}) {
  const [activeCategory, setActiveCategory] = useState('All')

  let items =
    activeCategory === 'All'
      ? servicesData
      : servicesData.filter((s) => s.category === activeCategory)

  if (preferPosters) {
    // Stable sort: poster-backed poojas first (display order only).
    items = [...items].sort((a, b) => (b.poster ? 1 : 0) - (a.poster ? 1 : 0))
  }
  if (limit) items = items.slice(0, limit)

  return (
    <section style={{ backgroundColor: background, padding: '5rem 0', position: 'relative' }}>
      <div className="container-max">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
          <SectionLabel>{eyebrow}</SectionLabel>
          <h2 className="section-heading" style={{ marginBottom: intro ? '0.9rem' : 0 }}>
            {heading}
          </h2>
          {intro && (
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)', fontSize: '1rem', lineHeight: 1.75 }}>
              {intro}
            </p>
          )}
        </div>

        {showFilter && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
            {CATEGORIES.map((cat) => {
              const count = cat === 'All' ? servicesData.length : servicesData.filter((s) => s.category === cat).length
              const isActive = cat === activeCategory
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    padding: '0.45rem 1.1rem',
                    borderRadius: '999px',
                    border: isActive ? 'none' : '1px solid var(--border)',
                    backgroundColor: isActive ? 'var(--saffron)' : 'var(--bg-card)',
                    color: isActive ? '#fff' : 'var(--maroon)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat}
                  <span style={{ marginLeft: '0.4rem', opacity: 0.7, fontSize: '0.75rem' }}>({count})</span>
                </button>
              )
            })}
          </div>
        )}

        <div className="pooja-gallery-grid">
          {items.map((s) => (
            <Link
              key={s.id}
              to={`/service/${s.slug}`}
              className="pooja-gallery-card"
              aria-label={`${s.name} — view details and book`}
            >
              <PoojaPoster
                src={s.poster || s.image}
                alt={`${s.name} (${s.hindiName}) — puja booking by Puja Havan`}
                objectPosition={s.poster ? 'center top' : 'center'}
                style={{ borderRadius: '14px 14px 0 0', border: 'none' }}
              />
              <div className="pooja-gallery-caption">
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.name}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--saffron)', fontWeight: 600, marginTop: '0.2rem' }}>
                    From {formatPrice(s.startingPrice)}
                  </p>
                </div>
                <span className="pooja-gallery-arrow" aria-hidden>
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {showViewAll && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/services" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>

      <style>{`
        .pooja-gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .pooja-gallery-card {
          display: block;
          text-decoration: none;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow-card);
          transition: transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .pooja-gallery-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-hover);
          border-color: var(--border-gold);
        }
        .pooja-gallery-caption {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.95rem 1.15rem;
        }
        .pooja-gallery-arrow {
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gold-bg);
          border: 1px solid var(--border-gold);
          color: var(--maroon);
          transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease;
        }
        .pooja-gallery-card:hover .pooja-gallery-arrow {
          background: var(--saffron);
          color: #fff;
          transform: translateX(2px) scale(1.05);
        }
        @media (max-width: 860px) {
          .pooja-gallery-grid { grid-template-columns: repeat(2, 1fr); gap: 1.1rem; }
        }
        @media (max-width: 520px) {
          .pooja-gallery-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}
