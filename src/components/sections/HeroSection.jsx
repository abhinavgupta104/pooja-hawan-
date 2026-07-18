import React, { useRef, useLayoutEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MandalaBg from '../common/MandalaBg'
import HeroOptInForm from './HeroOptInForm'

gsap.registerPlugin(ScrollTrigger)

const FLOAT_CARDS = [
  { key: 'rating', emoji: '⭐', value: '4.9★', valueColor: 'var(--text-gold)', label: 'Average Rating', pos: { top: '56px', left: '12px' } },
  { key: 'price', emoji: '🪔', value: '₹999', valueColor: 'var(--saffron)', label: 'Onwards per Puja', pos: { right: '18px', top: '46%' } },
  { key: 'sameday', emoji: '⚡', value: 'Same Day', valueColor: 'var(--maroon)', label: 'Booking Available', pos: { bottom: '64px', left: '26px' } },
]

export default function HeroSection() {
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // ---- Intro timeline ----
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo('[data-hero="badge"]', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
        .fromTo(
          '[data-hero="line"]',
          { y: 70, opacity: 0, rotateX: 18 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.14 },
          '-=0.35'
        )
        .fromTo('[data-hero="sub"]', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.55')
        .fromTo('[data-hero="form"]', { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
        .fromTo('[data-hero="checks"] > *', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, '-=0.45')
        .fromTo(
          '[data-hero="card"]',
          { scale: 0.7, opacity: 0, y: 24 },
          { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.6)', stagger: 0.12 },
          '-=0.6'
        )
        .fromTo('[data-hero="mandala"]', { scale: 0.86, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: 'power2.out' }, 0.2)

      // ---- Gentle perpetual float on the stat cards ----
      gsap.utils.toArray('[data-hero="card"]').forEach((card, i) => {
        gsap.to(card, {
          y: i % 2 === 0 ? -10 : 10,
          rotation: i % 2 === 0 ? 1.4 : -1.2,
          duration: 3.4 + i * 0.5,
          delay: 1.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      })

      // ---- Slow mandala spin ----
      gsap.to('[data-hero="mandala"]', { rotation: 360, duration: 90, repeat: -1, ease: 'none' })

      // ---- Scroll parallax: mandala drifts, content eases up ----
      gsap.to('[data-hero="mandala-wrap"]', {
        yPercent: 18,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('[data-hero="left"]', {
        yPercent: -6,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: { trigger: root, start: '30% top', end: 'bottom top', scrub: true },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      ref={rootRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '110px',
        paddingBottom: '5rem',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background:
          'radial-gradient(1100px 600px at 82% 30%, rgba(223, 190, 106, 0.22) 0%, transparent 60%), ' +
          'radial-gradient(800px 500px at 8% 85%, rgba(222, 90, 14, 0.07) 0%, transparent 55%), ' +
          'var(--bg-page)',
      }}
    >
      {/* Noise texture overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.035,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div className="container-max" style={{ width: '100%', position: 'relative', zIndex: 2 }}>
        <div
          className="hero-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '58% 42%',
            gap: '2rem',
            alignItems: 'center',
          }}
        >
          {/* LEFT COLUMN */}
          <div data-hero="left">
            {/* Trust badge */}
            <div
              data-hero="badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 254, 250, 0.75)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-gold)',
                borderRadius: '999px',
                padding: '0.4rem 1.1rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                letterSpacing: '0.06em',
                color: 'var(--text-body)',
                marginBottom: '1.75rem',
                fontWeight: 600,
                opacity: 0,
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>🪔</span> INDIA'S TRUSTED PUJA PLATFORM
            </div>

            {/* H1 — each line wrapped for staggered reveal */}
            <h1 className="hero-headline" style={{ marginBottom: '1.4rem', perspective: '600px' }}>
              <span style={{ display: 'block', overflow: 'hidden' }}>
                <span data-hero="line" style={{ display: 'block', opacity: 0 }}>Book Verified Pandits</span>
              </span>
              <span style={{ display: 'block', overflow: 'hidden' }}>
                <span data-hero="line" style={{ display: 'block', opacity: 0 }}>for Puja, Havan</span>
              </span>
              <span style={{ display: 'block', overflow: 'hidden' }}>
                <span
                  data-hero="line"
                  style={{
                    display: 'block',
                    opacity: 0,
                    fontStyle: 'italic',
                    fontWeight: 440,
                    color: 'var(--saffron)',
                  }}
                >
                  &amp; Homa
                </span>
              </span>
            </h1>

            {/* Sub */}
            <p
              data-hero="sub"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.08rem',
                color: 'var(--text-body)',
                lineHeight: 1.7,
                maxWidth: '480px',
                marginBottom: '2rem',
                opacity: 0,
              }}
            >
              Connecting 1 Lakh+ families with experienced, multilingual pandits
              across 50+ cities in India.
            </p>

            {/* Opt-In Form */}
            <div data-hero="form" style={{ opacity: 0 }}>
              <HeroOptInForm />
            </div>

            {/* Trust badges */}
            <div data-hero="checks" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {['Verified Pandits', 'Samagri Included', 'On-Time Guarantee'].map(text => (
                <div
                  key={text}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    color: 'var(--text-body)',
                    fontWeight: 600,
                    opacity: 0,
                  }}
                >
                  <CheckCircle2 size={16} color="var(--gold)" strokeWidth={2.4} />
                  {text}
                </div>
              ))}
            </div>

            {/* Mobile-only compact stats strip */}
            <div
              className="hero-mobile-stats"
              style={{
                display: 'none',
                gap: '0',
                marginTop: '2rem',
                backgroundColor: 'rgba(255, 254, 250, 0.85)',
                border: '1px solid var(--border-gold)',
                borderRadius: 'var(--radius-card)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {[
                { emoji: '⭐', value: '4.9★', label: 'Rating' },
                { emoji: '🪔', value: '₹999', label: 'Onwards' },
                { emoji: '⚡', value: 'Same Day', label: 'Booking' },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  style={{
                    flex: 1,
                    padding: '0.95rem 0.75rem',
                    textAlign: 'center',
                    borderRight: i < 2 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <div style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{stat.emoji}</div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--text-gold)', fontWeight: 600, lineHeight: 1 }}>{stat.value}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem', letterSpacing: '0.04em' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN — Mandala + floating cards */}
          <div
            className="hero-right"
            style={{
              position: 'relative',
              height: '560px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              data-hero="mandala-wrap"
              style={{ position: 'absolute', right: '-70px', width: '560px', height: '560px' }}
            >
              <div data-hero="mandala" style={{ width: '100%', height: '100%', opacity: 0 }}>
                <MandalaBg
                  size={560}
                  opacity={0.3}
                  style={{ position: 'relative', width: '100%', height: '100%' }}
                />
              </div>
            </div>

            {FLOAT_CARDS.map(card => (
              <div
                key={card.key}
                data-hero="card"
                style={{
                  position: 'absolute',
                  ...card.pos,
                  backgroundColor: 'rgba(255, 254, 250, 0.82)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: '14px',
                  padding: '0.9rem 1.2rem',
                  boxShadow: 'var(--shadow-hover)',
                  zIndex: 10,
                  minWidth: '138px',
                  opacity: 0,
                }}
              >
                <div style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>{card.emoji}</div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: card.valueColor, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.01em' }}>
                  {card.value}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontWeight: 500 }}>
                  {card.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #hero .hero-grid {
            grid-template-columns: minmax(0, 1fr) !important;
          }
          #hero .hero-right {
            display: none !important;
          }
          .hero-mobile-stats {
            display: flex !important;
          }
        }
        @media (max-width: 768px) {
          #hero {
            padding-top: 88px !important;
            padding-bottom: 3rem !important;
            min-height: auto !important;
          }
        }
        @media (max-width: 480px) {
          #hero {
            padding-top: 78px !important;
            padding-bottom: 2.5rem !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #hero [data-hero] { opacity: 1 !important; }
        }
      `}</style>
    </section>
  )
}
