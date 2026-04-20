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

        {/* Cards grid with overflow peek */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
          paddingBottom: '1rem',
        }}>
          {testimonialsData.slice(0, 6).map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} index={i} />
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
