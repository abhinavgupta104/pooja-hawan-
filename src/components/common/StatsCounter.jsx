import React from 'react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { useCountUp } from '../../hooks/useCountUp'

export default function StatsCounter({ value, suffix = '', label, className = '' }) {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.3 })
  const count = useCountUp(value, 1500, isVisible)

  return (
    <div ref={ref} className={`text-center ${className}`}>
      <p className="stats-number">
        {count.toLocaleString('en-IN')}{suffix}
      </p>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontWeight: 300,
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        marginTop: '0.25rem',
        letterSpacing: '0.03em',
      }}>
        {label}
      </p>
    </div>
  )
}
