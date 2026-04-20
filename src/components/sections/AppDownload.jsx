import React from 'react'
import { Link } from 'react-router-dom'
import SectionLabel from '../common/SectionLabel'

export default function AppDownload() {
  return (
    <section style={{ backgroundColor: 'var(--bg-page)', padding: '5rem 0' }}>
      <div className="container-max">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
        }}>
          {/* Left */}
          <div>
            <SectionLabel>ON THE GO</SectionLabel>
            <h2 className="section-heading" style={{ marginBottom: '1rem' }}>
              Book Pujas from Your Phone
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              color: 'var(--text-body)',
              lineHeight: 1.7,
              marginBottom: '2rem',
              maxWidth: '380px',
            }}>
              Download the Puja Havan app for instant bookings, live puja tracking,
              daily panchang updates, and exclusive app-only offers.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {/* iOS */}
              <a
                href="#"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 1.25rem',
                  backgroundColor: 'var(--text-primary)',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <div style={{ fontSize: '0.6rem', opacity: 0.8 }}>Download on the</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600 }}>App Store</div>
                </div>
              </a>

              {/* Android */}
              <a
                href="#"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 1.25rem',
                  backgroundColor: 'var(--text-primary)',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.43c1.33.06 2.21.75 2.98.8.76-.33 1.93-1.1 3.18-.85 3.11.38 4.64 4.83 2.15 8.14-.5.66-.68 1.89-2.16 3.04A1 1 0 0 0 17.05 20.28zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <div>
                  <div style={{ fontSize: '0.6rem', opacity: 0.8 }}>Get it on</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600 }}>Google Play</div>
                </div>
              </a>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {['4.9★ App Rating', '1L+ Downloads', 'Free to Use'].map(badge => (
                <div key={badge} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                }}>
                  <span style={{ color: 'var(--gold)' }}>✓</span> {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Mock phone frame */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '240px',
              height: '480px',
              backgroundColor: 'var(--bg-card)',
              border: '8px solid var(--text-primary)',
              borderRadius: '36px',
              boxShadow: '0 24px 60px rgba(44, 21, 3, 0.18), inset 0 0 0 2px var(--border)',
              overflow: 'hidden',
              position: 'relative',
              flexShrink: 0,
            }}>
              {/* Phone notch */}
              <div style={{
                position: 'absolute',
                top: '14px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '20px',
                backgroundColor: 'var(--text-primary)',
                borderRadius: '999px',
                zIndex: 10,
              }} />

              {/* App UI — simple mock */}
              <div style={{ padding: '3rem 0.75rem 0.75rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* Header */}
                <div style={{ backgroundColor: 'var(--bg-section-alt)', borderRadius: '12px', padding: '0.75rem', marginTop: '0.5rem' }}>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.7rem', color: 'var(--maroon)' }}>🪔 Puja Havan</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.55rem', color: 'var(--text-muted)' }}>Select puja & find pandit</p>
                </div>

                {/* Mock booking cards */}
                {[
                  { name: 'Satyanarayan Puja', price: '₹1,501', icon: '⭐' },
                  { name: 'Griha Pravesh', price: '₹2,501', icon: '🏠' },
                  { name: 'Lakshmi Puja', price: '₹1,501', icon: '💛' },
                ].map(item => (
                  <div key={item.name} style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '0.5rem 0.6rem',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}>
                    <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                    <div>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.58rem', fontWeight: 500, color: 'var(--text-primary)' }}>{item.name}</p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.52rem', color: 'var(--saffron)' }}>{item.price}</p>
                    </div>
                  </div>
                ))}

                {/* CTA button mock */}
                <div style={{
                  marginTop: 'auto',
                  backgroundColor: 'var(--saffron)',
                  borderRadius: '8px',
                  padding: '0.55rem',
                  textAlign: 'center',
                }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.62rem', color: 'white', fontWeight: 600 }}>
                    Book Your Puja
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
