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
      style={{
        backgroundColor: 'var(--gold-bg)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '2rem 0',
      }}
    >
      <div className="container-max">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0',
          }}
        >
          {STATS.map((stat, i) => (
            <React.Fragment key={stat.label}>
              <div style={{ position: 'relative', padding: '0 1rem' }}>
                <StatsCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
                {i < STATS.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '15%',
                    bottom: '15%',
                    width: '1px',
                    backgroundColor: 'var(--gold-muted)',
                  }} />
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
