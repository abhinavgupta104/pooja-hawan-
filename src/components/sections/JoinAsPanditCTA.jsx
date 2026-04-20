import React from 'react'
import { Link } from 'react-router-dom'

export default function JoinAsPanditCTA() {
  return (
    <section style={{ backgroundColor: 'var(--maroon)', padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Background motif */}
      <div aria-hidden style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0.05,
        pointerEvents: 'none',
      }}>
        <svg viewBox="0 0 600 600" width="600" height="600" fill="none">
          <circle cx="300" cy="300" r="290" stroke="white" strokeWidth="2" />
          {Array.from({length:12}).map((_,i) => {
            const a = (i*30)*Math.PI/180
            return <line key={i} x1={300+100*Math.cos(a)} y1={300+100*Math.sin(a)} x2={300+285*Math.cos(a)} y2={300+285*Math.sin(a)} stroke="white" strokeWidth="1" />
          })}
          <circle cx="300" cy="300" r="120" stroke="white" strokeWidth="1" />
          <circle cx="300" cy="300" r="40" fill="white" />
        </svg>
      </div>

      <div className="container-max" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.7rem',
          color: 'var(--gold)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
          fontFamily: 'var(--font-heading)',
        }}>
          JOIN OUR PLATFORM
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          color: 'white',
          fontWeight: 500,
          marginBottom: '1rem',
          lineHeight: 1.2,
        }}>
          Are You a Qualified Pandit or Purohit?
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          color: 'rgba(255, 245, 230, 0.85)',
          lineHeight: 1.7,
          maxWidth: '540px',
          margin: '0 auto 2.5rem',
        }}>
          Join India's fastest-growing puja platform. Earn more with flexible timings.
          20,000+ pandits already onboard across 50+ cities.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/pandit-registration" className="btn-gold-outline">
            Register as Pandit
          </Link>
          <Link
            to="/about"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'rgba(255,255,255,0.8)',
              textDecoration: 'none',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              paddingTop: '0.75rem',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
          >
            Learn More →
          </Link>
        </div>

        {/* Social proof */}
        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
          {[
            { number: '20,000+', label: 'Active Pandits' },
            { number: '50+', label: 'Cities' },
            { number: '₹2,000+', label: 'avg. per booking' },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-cinzel-dec)', fontSize: '1.3rem', color: 'var(--gold)', fontWeight: 700 }}>
                {item.number}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
