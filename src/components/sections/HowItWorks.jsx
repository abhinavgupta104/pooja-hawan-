import React from 'react'
import { Search, UserCheck, CreditCard, Home } from 'lucide-react'
import SectionLabel from '../common/SectionLabel'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const STEPS = [
  {
    number: '01',
    icon: Search,
    title: 'Select Puja',
    desc: 'Choose from 50+ sacred ceremonies — from daily pujas to grand havans and samskaras.',
  },
  {
    number: '02',
    icon: UserCheck,
    title: 'Choose Pandit',
    desc: 'Filter by city, language & specialization. View profiles, ratings, and book instantly.',
  },
  {
    number: '03',
    icon: CreditCard,
    title: 'Confirm Booking',
    desc: 'Pay securely via Razorpay. Get instant WhatsApp confirmation with pandit details.',
  },
  {
    number: '04',
    icon: Home,
    title: 'Puja at Home',
    desc: 'Pandit arrives punctually with all samagri. Relax and receive divine blessings.',
  },
]

export default function HowItWorks() {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section ref={ref} style={{ backgroundColor: 'var(--bg-page)', padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Watermark mandala */}
      <div aria-hidden style={{ position: 'absolute', left: '-150px', top: '50%', transform: 'translateY(-50%)', opacity: 0.04, pointerEvents: 'none' }}>
        <svg viewBox="0 0 500 500" width="500" height="500" fill="none">
          <circle cx="250" cy="250" r="240" stroke="#C9A84C" strokeWidth="1.5" />
          {Array.from({length:8}).map((_,i) => {
            const a = (i*45)*Math.PI/180
            return <line key={i} x1={250+80*Math.cos(a)} y1={250+80*Math.sin(a)} x2={250+235*Math.cos(a)} y2={250+235*Math.sin(a)} stroke="#C9A84C" strokeWidth="1" />
          })}
          <circle cx="250" cy="250" r="100" stroke="#C9A84C" strokeWidth="1" strokeDasharray="5 5" />
          <circle cx="250" cy="250" r="40" fill="#C9A84C" />
        </svg>
      </div>

      <div className="container-max" style={{ position: 'relative', zIndex: 2 }}>
        <SectionLabel>THE PROCESS</SectionLabel>
        <h2 className="section-heading" style={{ marginBottom: '3.5rem' }}>
          Book Your Puja in 4 Simple Steps
        </h2>

        {/* Steps */}
        <div style={{ position: 'relative' }}>
          {/* Desktop connector line */}
          <div aria-hidden style={{
            position: 'absolute',
            top: '2.5rem',
            left: 'calc(12.5% + 1.5rem)',
            right: 'calc(12.5% + 1.5rem)',
            height: '2px',
            borderTop: '2px dashed var(--gold-muted)',
            zIndex: 0,
          }} className="desktop-only-line" />

          <div className="how-it-works-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem',
            position: 'relative',
            zIndex: 1,
          }}>
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div
                  key={step.number}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(28px)',
                    transition: `opacity 0.55s ease ${i * 100}ms, transform 0.55s ease ${i * 100}ms`,
                  }}
                >
                  {/* Step circle with number */}
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--gold-bg)',
                      border: '2px solid var(--gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      zIndex: 2,
                      boxShadow: 'var(--shadow-card)',
                    }}>
                      <Icon size={24} color="var(--gold)" />
                    </div>
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--maroon)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.6rem',
                      color: 'white',
                      fontWeight: 700,
                      zIndex: 3,
                    }}>
                      {i + 1}
                    </div>
                  </div>
                  
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1rem',
                      color: 'var(--text-primary)',
                      fontWeight: 600,
                      marginBottom: '0.5rem',
                    }}>
                      {step.title}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      color: 'var(--text-body)',
                      lineHeight: 1.7,
                    }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .desktop-only-line { display: none; }
          }
        `}</style>
      </div>
    </section>
  )
}
