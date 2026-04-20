import React from 'react'
import { Link } from 'react-router-dom'
import { Globe, Smartphone, Package } from 'lucide-react'

export default function EPujaBanner() {
  return (
    <section style={{ backgroundColor: 'var(--maroon)', padding: '4.5rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle mandala watermark */}
      <div aria-hidden style={{
        position: 'absolute',
        right: '-100px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '400px',
        height: '400px',
        opacity: 0.05,
        pointerEvents: 'none',
      }}>
        <svg viewBox="0 0 400 400" fill="none" width="400" height="400">
          <circle cx="200" cy="200" r="190" stroke="white" strokeWidth="1" />
          <circle cx="200" cy="200" r="150" stroke="white" strokeWidth="0.6" strokeDasharray="6 6" />
          <circle cx="200" cy="200" r="100" stroke="white" strokeWidth="1" />
          <circle cx="200" cy="200" r="50" stroke="white" strokeWidth="0.6" />
          {Array.from({length:12}).map((_,i) => {
            const a = (i*30)*Math.PI/180
            return <line key={i} x1={200+60*Math.cos(a)} y1={200+60*Math.sin(a)} x2={200+185*Math.cos(a)} y2={200+185*Math.sin(a)} stroke="white" strokeWidth="0.6" />
          })}
        </svg>
      </div>

      <div className="container-max" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        {/* Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          border: '1px solid rgba(201,168,76,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '1.8rem',
        }}>
          📿
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 500,
            color: 'white',
            marginBottom: '1rem',
            lineHeight: 1.2,
          }}
        >
          Can't be present? Book an E-Puja
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          color: 'rgba(255, 245, 230, 0.85)',
          lineHeight: 1.7,
          maxWidth: '540px',
          margin: '0 auto 2rem',
        }}>
          Live-streamed Vedic ceremonies from anywhere in the world.
          Our pandits guide you through every step remotely.
          Samagri kit delivered to your doorstep.
        </p>

        <Link to="/e-puja" className="btn-gold-outline" style={{ marginBottom: '2.5rem' }}>
          Explore E-Puja Services
        </Link>

        {/* Feature icons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {[
            { icon: Globe, text: 'Available Worldwide' },
            { icon: Smartphone, text: 'WhatsApp Updates' },
            { icon: Package, text: 'Samagri Kit Delivered' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,245,230,0.75)', fontSize: '0.85rem', fontFamily: 'var(--font-body)' }}>
              <Icon size={18} color="var(--gold)" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
