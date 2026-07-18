import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star } from 'lucide-react'

export default function PanditCard({ pandit }) {
  const stars = Math.round(pandit.rating)

  return (
    <div
      className="card-base"
      style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}
    >
      {/* Photo */}
      <div style={{ position: 'relative', marginBottom: '0.25rem' }}>
        <img
          src={pandit.photo}
          alt={`${pandit.name} — verified pandit`}
          loading="lazy"
          decoding="async"
          className="pandit-photo"
          style={{ width: '80px', height: '80px' }}
          onError={e => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        <div style={{
          display: 'none',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          border: '2px solid var(--gold)',
          boxShadow: '0 0 0 5px var(--bg-page), 0 0 0 7px var(--gold-muted)',
          backgroundColor: 'var(--gold-bg)',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-heading)',
          fontSize: '1.4rem',
          color: 'var(--gold)',
        }}>
          {pandit.name.split(' ').map(n => n[0]).slice(0,2).join('')}
        </div>
        {pandit.available && (
          <div style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            width: '14px',
            height: '14px',
            backgroundColor: '#22c55e',
            borderRadius: '50%',
            border: '2px solid var(--bg-card)',
          }} title="Available today" />
        )}
      </div>

      {/* Name */}
      <h3 className="card-title" style={{ fontSize: '0.95rem' }}>
        {pandit.name}
      </h3>

      {/* City */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        <MapPin size={12} color="var(--gold-muted)" />
        {pandit.city}
      </div>

      {/* Rating */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span className="stars" style={{ fontSize: '0.8rem' }}>
          {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
        </span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {pandit.rating} ({pandit.reviewCount})
        </span>
      </div>

      {/* Experience */}
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        {pandit.experience} years experience
      </p>

      {/* Languages */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', justifyContent: 'center' }}>
        {pandit.languages.slice(0, 3).map(lang => (
          <span key={lang} className="service-badge" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
            {lang}
          </span>
        ))}
      </div>

      {/* Price */}
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-body)', fontWeight: 500 }}>
        From ₹{pandit.pricePerPuja.toLocaleString('en-IN')}/puja
      </p>

      {/* CTA */}
      <Link
        to={`/pandit/${pandit.id}`}
        className="btn-secondary"
        style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '0.55rem 1rem', marginTop: 'auto' }}
      >
        View Profile
      </Link>
    </div>
  )
}
