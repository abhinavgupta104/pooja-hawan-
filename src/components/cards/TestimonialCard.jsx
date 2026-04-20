import React from 'react'

export default function TestimonialCard({ testimonial, index = 0 }) {
  const isOdd = index % 2 === 0
  
  return (
    <div
      className={isOdd ? 'testimonial-odd' : 'testimonial-even'}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
        borderRadius: '8px',
        padding: '2rem',
        position: 'relative',
        transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease',
        minHeight: '280px',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-hover)'
        e.currentTarget.style.borderColor = 'var(--border-gold)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card)'
        e.currentTarget.style.borderColor = 'var(--border)'
      }}
    >
      {/* Giant quote mark */}
      <span style={{
        position: 'absolute',
        top: '-0.5rem',
        left: '1.25rem',
        fontFamily: 'var(--font-display)',
        fontSize: '5rem',
        color: 'var(--gold)',
        opacity: 0.3,
        lineHeight: 1,
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        "
      </span>

      {/* Stars */}
      <div className="stars" style={{ fontSize: '0.85rem', marginBottom: '0.75rem', paddingTop: '1rem' }}>
        {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
      </div>

      {/* Review text */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.88rem',
        fontStyle: 'italic',
        color: 'var(--text-body)',
        lineHeight: 1.7,
        flex: 1,
        marginBottom: '1.25rem',
      }}>
        {testimonial.review}
      </p>

      {/* Reviewer info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
        {/* Avatar */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'var(--gold-bg)',
          border: '2px solid var(--gold-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-heading)',
          fontSize: '0.75rem',
          color: 'var(--gold)',
          fontWeight: 700,
          flexShrink: 0,
        }}>
          {testimonial.photoInitials}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="card-title" style={{ fontSize: '0.85rem', marginBottom: '0.1rem' }}>
            {testimonial.name}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
            {testimonial.profession} · {testimonial.city}
          </p>
        </div>

        {/* Platform */}
        <div style={{
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-body)',
          textAlign: 'right',
          flexShrink: 0,
        }}>
          <div style={{ 
            backgroundColor: testimonial.platform === 'Google' ? '#4285f4' : '#00b67a',
            color: 'white',
            padding: '0.1rem 0.4rem',
            borderRadius: '3px',
            fontSize: '0.6rem',
            fontWeight: 600,
          }}>
            {testimonial.platform}
          </div>
          <div style={{ marginTop: '0.2rem' }}>{testimonial.date}</div>
        </div>
      </div>
    </div>
  )
}
