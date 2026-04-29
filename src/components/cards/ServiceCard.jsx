import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, ArrowRight } from 'lucide-react'
import { formatPrice } from '../../lib/utils'
import * as LucideIcons from 'lucide-react'

export default function ServiceCard({ service, featured = false, index = 0 }) {
  const IconComponent = LucideIcons[service.icon] || LucideIcons.Star

  if (featured) {
    return (
      <div
        className="card-base"
        style={{
          gridColumn: 'span 2',
          display: 'flex',
          flexDirection: 'row',
          gap: 0,
          overflow: 'hidden',
          position: 'relative',
          minHeight: '280px',
        }}
      >
        {/* Featured badge */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          backgroundColor: 'var(--maroon)',
          color: 'white',
          fontFamily: 'var(--font-body)',
          fontSize: '0.7rem',
          fontWeight: 500,
          padding: '0.2rem 0.75rem',
          borderRadius: '999px',
          zIndex: 2,
          letterSpacing: '0.05em',
        }}>
          ★ Most Booked
        </div>

        {/* Left: visual */}
        <div style={{
          width: '40%',
          background: service.image ? `url(${service.image}) center/cover no-repeat` : 'linear-gradient(135deg, var(--gold-bg) 0%, var(--bg-section-alt) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {service.image && (
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10, 5, 5, 0.3)' }} />
          )}
          {!service.image && (
          <div style={{
            width: '100px',
            height: '100px',
            backgroundColor: 'rgba(201, 168, 76, 0.15)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--gold-muted)',
            zIndex: 1,
          }}>
            <IconComponent size={48} color="var(--gold)" />
          </div>
          )}
          {/* Decorative circles */}
          <div style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            border: '1px solid var(--gold-muted)',
            opacity: 0.3,
          }} />
          <div style={{
            position: 'absolute',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            border: '1px solid var(--gold-muted)',
            opacity: 0.15,
          }} />
        </div>

        {/* Right: content */}
        <div style={{ flex: 1, padding: '2rem' }}>
          <span className="service-badge" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
            {service.category}
          </span>
          <h3 className="card-title" style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>
            {service.name}
          </h3>
          <p className="devanagari-sub" style={{ marginBottom: '0.9rem' }}>
            {service.hindiName}
          </p>
          <p style={{ 
            fontFamily: 'var(--font-body)', 
            fontSize: '0.9rem', 
            color: 'var(--text-body)', 
            lineHeight: 1.7,
            marginBottom: '1rem',
            maxWidth: '380px',
          }}>
            {service.description}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <Clock size={14} color="var(--gold)" />
              {service.duration}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-body)', fontWeight: 500 }}>
              Starting {formatPrice(service.startingPrice)}
            </div>
          </div>
          <Link
            to={`/service/${service.slug}`}
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', padding: '0.6rem 1.4rem' }}
          >
            Book Now <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="card-base"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        animationDelay: `calc(${index} * 80ms)`,
      }}
    >
      {/* Icon / Image */}
      {service.image ? (
        <div style={{
          width: '100%',
          height: '160px',
          marginBottom: '1rem',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid var(--gold-muted)',
          flexShrink: 0,
        }}>
          <img 
            src={service.image} 
            alt={service.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ) : (
        <div className="gold-icon-bg" style={{ width: '52px', height: '52px', marginBottom: '1rem' }}>
          <IconComponent size={22} color="var(--gold)" />
        </div>
      )}

      {/* Category badge */}
      <span className="service-badge" style={{ marginBottom: '0.6rem', alignSelf: 'flex-start' }}>
        {service.category}
      </span>

      {/* Names */}
      <h3 className="card-title" style={{ marginBottom: '0.2rem' }}>
        {service.name}
      </h3>
      <p className="devanagari-sub" style={{ marginBottom: '0.75rem' }}>
        {service.hindiName}
      </p>

      {/* Meta */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <Clock size={12} color="var(--gold-muted)" />
          {service.duration}
        </span>
        <span style={{ color: 'var(--text-body)', fontSize: '0.85rem', fontWeight: 500 }}>
          From {formatPrice(service.startingPrice)}
        </span>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <Link
          to={`/service/${service.slug}`}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            color: 'var(--saffron)',
            fontWeight: 500,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Book Now <span style={{ fontSize: '1rem' }}>→</span>
        </Link>
      </div>
    </div>
  )
}
