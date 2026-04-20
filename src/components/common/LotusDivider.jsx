import React from 'react'

export default function LotusDivider({ className = '' }) {
  return (
    <div className={`flex items-center gap-4 my-6 ${className}`}>
      <div style={{ flex: 1, height: '1px', background: 'var(--gold-muted)', opacity: 0.6 }} />
      <svg width="48" height="28" viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Lotus petals */}
        <ellipse cx="24" cy="18" rx="6" ry="9" fill="none" stroke="var(--gold-muted)" strokeWidth="1.2" />
        <ellipse cx="16" cy="19" rx="5" ry="7.5" fill="none" stroke="var(--gold-muted)" strokeWidth="1" transform="rotate(-20 16 19)" />
        <ellipse cx="32" cy="19" rx="5" ry="7.5" fill="none" stroke="var(--gold-muted)" strokeWidth="1" transform="rotate(20 32 19)" />
        <ellipse cx="10" cy="21" rx="4" ry="6" fill="none" stroke="var(--gold-muted)" strokeWidth="0.8" transform="rotate(-35 10 21)" />
        <ellipse cx="38" cy="21" rx="4" ry="6" fill="none" stroke="var(--gold-muted)" strokeWidth="0.8" transform="rotate(35 38 21)" />
        {/* Center dot */}
        <circle cx="24" cy="12" r="2" fill="var(--gold-muted)" />
        {/* Base line */}
        <line x1="6" y1="24" x2="42" y2="24" stroke="var(--gold-muted)" strokeWidth="0.8" />
        {/* Small dots */}
        <circle cx="6" cy="24" r="1.5" fill="var(--gold-muted)" />
        <circle cx="42" cy="24" r="1.5" fill="var(--gold-muted)" />
      </svg>
      <div style={{ flex: 1, height: '1px', background: 'var(--gold-muted)', opacity: 0.6 }} />
    </div>
  )
}
