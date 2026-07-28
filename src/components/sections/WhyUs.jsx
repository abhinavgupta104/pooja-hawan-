import React from 'react'
import { BadgeCheck, Languages, Package, Monitor, DollarSign, Clock } from 'lucide-react'
import SectionLabel from '../common/SectionLabel'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const FEATURES = [
  {
    icon: BadgeCheck,
    title: 'Verified & Experienced Pandits',
    desc: 'Every pandit is identity-verified against government photo ID, with their Vedic credentials and experience checked before listing.',
  },
  {
    icon: Languages,
    title: 'Multilingual — 10+ Languages',
    desc: 'Find pandits who perform rituals in Hindi, Tamil, Telugu, Kannada, Marathi, Bengali, Gujarati, and more.',
  },
  {
    icon: Package,
    title: 'Complete Samagri Included',
    desc: 'Ritual-grade puja materials, flowers, and ingredients are all included in Standard and Premium packages.',
  },
  {
    icon: Monitor,
    title: 'Puja for NRIs & Remote Families',
    desc: 'Live-streamed Vedic ceremonies from anywhere in the world. Samagri kit delivered to your home.',
  },
  {
    icon: DollarSign,
    title: 'Transparent Pricing, No Hidden Costs',
    desc: 'What you see is what you pay. All prices include pandit dakshina, samagri, and travel (local).',
  },
  {
    icon: Clock,
    title: 'On-Time Guarantee or Full Refund',
    desc: 'If your pandit doesn\'t arrive on time or fails to perform the agreed puja, we issue a 100% refund.',
  },
]

export default function WhyUs() {
  const { ref, isVisible } = useScrollReveal()
  return (
    <section ref={ref} style={{ backgroundColor: 'var(--bg-section-alt)', padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Background mandala */}
      <div aria-hidden style={{
        position: 'absolute',
        right: '-120px',
        top: '50%',
        transform: 'translateY(-50%)',
        opacity: 0.04,
        pointerEvents: 'none',
      }}>
        <svg viewBox="0 0 500 500" width="500" height="500" fill="none">
          <circle cx="250" cy="250" r="240" stroke="#C9A84C" strokeWidth="2" />
          {Array.from({length:16}).map((_,i) => {
            const a = (i*22.5)*Math.PI/180
            return <line key={i} x1={250+60*Math.cos(a)} y1={250+60*Math.sin(a)} x2={250+235*Math.cos(a)} y2={250+235*Math.sin(a)} stroke="#C9A84C" strokeWidth="1" />
          })}
          <circle cx="250" cy="250" r="100" stroke="#C9A84C" strokeWidth="1" />
          <circle cx="250" cy="250" r="50" fill="#C9A84C" opacity="0.5" />
        </svg>
      </div>

      <div className="container-max" style={{ position: 'relative', zIndex: 2 }}>
        <SectionLabel>WHY CHOOSE US</SectionLabel>
        <h2 className="section-heading" style={{ marginBottom: '2.5rem' }}>
          The Puja Havan Difference
        </h2>

        <div className="why-us-grid card-grid-3" style={{
          display: 'grid',
          gap: '1.5rem',
        }}>
          {FEATURES.map((f, idx) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="card-base"
                style={{
                  padding: '1.75rem',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 0.5s ease ${idx * 80}ms, transform 0.5s ease ${idx * 80}ms`,
                }}
              >
                <div className="gold-icon-bg" style={{ width: '48px', height: '48px', marginBottom: '1rem' }}>
                  <Icon size={22} color="var(--gold)" />
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  marginBottom: '0.6rem',
                  lineHeight: 1.3,
                }}>
                  {f.title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.83rem',
                  color: 'var(--text-body)',
                  lineHeight: 1.7,
                }}>
                  {f.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
