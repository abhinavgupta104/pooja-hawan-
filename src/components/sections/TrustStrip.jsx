import React from 'react'
import StatsCounter from '../common/StatsCounter'

const STATS = [
  { value: 20000, suffix: '+', label: 'Verified Pandits' },
  { value: 100000, suffix: '+', label: 'Pujas Performed' },
  { value: 50, suffix: '+', label: 'Cities Covered' },
  { value: 4.9, suffix: '/5', label: 'Average Rating' },
]

export default function TrustStrip() {
  return (
    <div
      id="trust-strip"
      className="stats-dark"
      style={{
        background:
          'radial-gradient(900px 300px at 50% -60%, rgba(223, 190, 106, 0.18) 0%, transparent 70%), ' +
          'linear-gradient(135deg, #4A0E0E 0%, var(--maroon) 55%, #3C0B0B 100%)',
        borderTop: '1px solid rgba(223, 190, 106, 0.35)',
        borderBottom: '1px solid rgba(223, 190, 106, 0.35)',
        padding: '3rem 0',
      }}
    >
      <div className="container-max">
        <div
          className="trust-stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0',
          }}
        >
          {STATS.map((stat, i) => (
            <div key={stat.label} style={{ position: 'relative', padding: '0 1rem' }}>
              <StatsCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
              {i < STATS.length - 1 && (
                <div
                  className="trust-stat-divider"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '15%',
                    bottom: '15%',
                    width: '1px',
                    background: 'linear-gradient(180deg, transparent, rgba(223, 190, 106, 0.4), transparent)',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .trust-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            row-gap: 2rem !important;
          }
          .trust-stats-grid > div:nth-child(2) .trust-stat-divider {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
