import React from 'react'
import SectionLabel from '../common/SectionLabel'
import TestimonialCard from '../cards/TestimonialCard'
import testimonialsData from '../../data/testimonials.json'

export default function Testimonials() {
  return (
    <section style={{ backgroundColor: 'var(--bg-section-alt)', padding: '5rem 0', overflow: 'hidden' }}>
      <div className="container-max">
        <SectionLabel>TESTIMONIALS</SectionLabel>
        <h2 className="section-heading" style={{ marginBottom: '2.5rem' }}>
          Trusted by Families Across India
        </h2>

        {/* Responsive grid — card-grid-3 collapses to 2-col on tablet, 1-col on mobile */}
        <div
          className="card-grid-3"
          style={{
            display: 'grid',
            gap: '1.5rem',
            paddingBottom: '1rem',
          }}
        >
          {testimonialsData.slice(0, 6).map((t, i) => (
            <div
              key={t.id}
              style={{
                animation: `fadeSlideUp 0.5s ease forwards`,
                animationDelay: `${i * 80}ms`,
                opacity: 0,
              }}
            >
              <TestimonialCard testimonial={t} index={i} />
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Join 1 Lakh+ happy families who have performed their pujas with Puja Havan
          </p>
        </div>
      </div>
    </section>
  )
}
