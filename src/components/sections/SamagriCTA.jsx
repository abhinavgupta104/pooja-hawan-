import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'

export default function SamagriCTA() {
  return (
    <section className="samagri-gradient" style={{ padding: '3.5rem 0' }}>
      <div className="container-max">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <ShoppingBag size={28} color="white" />
            </div>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                color: 'white',
                fontWeight: 500,
                marginBottom: '0.4rem',
                lineHeight: 1.2,
              }}>
                Order Puja Samagri — Delivered to Your Doorstep
              </h2>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
                color: 'rgba(255,255,255,0.85)',
              }}>
                Authentic, ritual-grade puja items. Curated kits for every ceremony.
              </p>
            </div>
          </div>

          <Link
            to="/shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.8rem 2rem',
              backgroundColor: 'white',
              color: 'var(--saffron)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: '4px',
              textDecoration: 'none',
              flexShrink: 0,
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Shop Samagri →
          </Link>
        </div>
      </div>
    </section>
  )
}
