import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getDay, getMonthAbbr } from '../../lib/utils'

export default function FestivalCard({ festival }) {
  const day = getDay(festival.date)
  const month = getMonthAbbr(festival.date)

  return (
    <div
      className="scroll-snap-item card-base"
      style={{
        width: '260px',
        minWidth: '260px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Date box */}
      <div style={{
        backgroundColor: 'var(--maroon)',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-cinzel-dec)',
            fontSize: '1.8rem',
            color: 'var(--gold)',
            fontWeight: 700,
            lineHeight: 1,
          }}>
            {day}
          </div>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.65rem',
            color: 'var(--gold-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginTop: '0.1rem',
          }}>
            {month}
          </div>
        </div>
        <div style={{ borderLeft: '1px solid rgba(201,168,76,0.3)', paddingLeft: '1rem' }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'white', fontWeight: 400, lineHeight: 1.2 }}>
            {festival.name}
          </p>
          <p style={{ fontFamily: 'var(--font-deva)', fontSize: '0.72rem', color: 'var(--gold-muted)', marginTop: '0.2rem' }}>
            {festival.hindiName}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', lineHeight: 1.6, marginBottom: '0.6rem', flex: 1 }}>
          {festival.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
            {festival.hinduMonth}
          </span>
          <Link
            to={`/service/${festival.suggestedPuja}`}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.78rem',
              color: 'var(--saffron)',
              textDecoration: 'none',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
            }}
          >
            Book Puja <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  )
}
