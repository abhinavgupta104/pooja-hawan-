import React from 'react'
import { Link } from 'react-router-dom'
import SectionLabel from '../common/SectionLabel'

export default function ComingSoonSection({ title, label, description, link, icon, buttonText = "Explore Now" }) {
  return (
    <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-section-alt)', borderTop: '1px solid var(--border)' }}>
      <div className="container-max" style={{ textAlign: 'center' }}>
        <SectionLabel>{label}</SectionLabel>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
        <h2 className="section-heading" style={{ marginBottom: '1rem' }}>{title}</h2>
        <p style={{ 
          fontFamily: 'var(--font-body)', 
          fontSize: '1rem', 
          color: 'var(--text-body)', 
          maxWidth: '600px', 
          margin: '0 auto 2rem',
          lineHeight: 1.7
        }}>
          {description}
        </p>
        <Link to={link} className="btn-gold-outline">
          {buttonText}
        </Link>
      </div>
    </section>
  )
}
