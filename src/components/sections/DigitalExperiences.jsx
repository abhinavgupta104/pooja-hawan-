import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MonitorPlay, Video } from 'lucide-react'
import SectionLabel from '../common/SectionLabel'
import Reveal from '../common/Reveal'

const EXPERIENCES = [
  {
    icon: MonitorPlay,
    tag: 'Coming Soon',
    title: 'E-Puja: Digital Rituals',
    description:
      'Participate in sacred ceremonies from anywhere. Watch your sankalpa performed live at renowned temples, with prasad delivered home.',
    link: '/e-puja',
    cta: 'Notify Me',
  },
  {
    icon: Video,
    tag: 'Exclusive',
    title: 'Virtual Puja: One-to-One',
    description:
      'A fully private, real-time Vedic ceremony tailored exclusively for you — connect face-to-face with India’s most learned Acharyas.',
    link: '/virtual-puja',
    cta: 'Book Private Session',
  },
]

export default function DigitalExperiences() {
  return (
    <section style={{ padding: '5.5rem 0', backgroundColor: 'var(--bg-page)', borderTop: '1px solid var(--border)' }}>
      <div className="container-max">
        <Reveal style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <SectionLabel>Beyond the Doorstep</SectionLabel>
          <h2 className="section-heading" style={{ marginTop: '0.6rem' }}>
            Sacred Rituals, <em style={{ fontStyle: 'italic', color: 'var(--saffron)', fontWeight: 440 }}>Anywhere</em>
          </h2>
        </Reveal>

        <Reveal selector="[data-exp-card]" stagger={0.15} className="grid-2col" style={{ gap: '1.5rem' }}>
          {EXPERIENCES.map(exp => {
            const Icon = exp.icon
            return (
              <div
                key={exp.title}
                data-exp-card
                className="card-base"
                style={{
                  padding: '2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '1.1rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    top: '-60px',
                    right: '-60px',
                    width: '190px',
                    height: '190px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(223, 190, 106, 0.22) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  <span
                    className="gold-icon-bg"
                    style={{ width: '52px', height: '52px' }}
                  >
                    <Icon size={24} strokeWidth={1.8} />
                  </span>
                  <span className="service-badge">{exp.tag}</span>
                </div>
                <h3 className="card-title" style={{ fontSize: '1.45rem' }}>{exp.title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.97rem', color: 'var(--text-body)', lineHeight: 1.7 }}>
                  {exp.description}
                </p>
                <Link
                  to={exp.link}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    marginTop: 'auto',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    color: 'var(--maroon)',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--border-gold)',
                    paddingBottom: '2px',
                  }}
                >
                  {exp.cta} <ArrowRight size={15} />
                </Link>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
