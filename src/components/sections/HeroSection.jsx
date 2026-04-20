import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, CheckCircle2 } from 'lucide-react'
import MandalaBg from '../common/MandalaBg'
import services from '../../data/services.json'
import cities from '../../data/cities.json'

export default function HeroSection() {
  const [selectedPuja, setSelectedPuja] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const navigate = useNavigate()

  const handleFind = () => {
    navigate('/pandits')
  }

  return (
    <section
      id="hero"
      style={{
        backgroundColor: 'var(--bg-page)',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '100px',
        paddingBottom: '5rem',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: '60% 40%',
          gap: '2rem',
          alignItems: 'center',
        }}>
          {/* LEFT COLUMN */}
          <div>
            {/* Trust badge */}
            <div
              className="anim-fade-up"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--gold-bg)',
                border: '1px solid var(--gold-muted)',
                borderRadius: '999px',
                padding: '0.35rem 1rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                marginBottom: '1.5rem',
                fontWeight: 500,
              }}
            >
              🪔 India's Trusted Puja Platform
            </div>

            {/* H1 */}
            <h1
              className="hero-headline anim-fade-up anim-delay-1"
              style={{ marginBottom: '1.25rem' }}
            >
              Book Verified Pandits<br />
              for Puja, Havan<br />
              <span style={{ color: 'var(--saffron)' }}>&amp; Homa</span>
            </h1>

            {/* Sub */}
            <p
              className="anim-fade-up anim-delay-2"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.05rem',
                color: 'var(--text-body)',
                lineHeight: 1.7,
                maxWidth: '480px',
                marginBottom: '2rem',
              }}
            >
              Connecting 1 Lakh+ families with experienced, multilingual pandits
              across 50+ cities in India.
            </p>

            {/* Booking Widget */}
            <div
              className="anim-fade-up anim-delay-3"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1.5px solid var(--gold-muted)',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-warm)',
                marginBottom: '1.5rem',
                maxWidth: '560px',
              }}
            >
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', letterSpacing: '0.12em', color: 'var(--text-gold)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Find the Right Pandit
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div className="form-field">
                  <label className="form-label" htmlFor="hero-puja-type">Puja Type</label>
                  <select
                    id="hero-puja-type"
                    className="form-input form-select"
                    value={selectedPuja}
                    onChange={e => setSelectedPuja(e.target.value)}
                  >
                    <option value="">Select Puja</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="hero-city">City</label>
                  <select
                    id="hero-city"
                    className="form-input form-select"
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                  >
                    <option value="">Select City</option>
                    {cities.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'end' }}>
                <div className="form-field">
                  <label className="form-label" htmlFor="hero-date">Date</label>
                  <input
                    type="date"
                    id="hero-date"
                    className="form-input"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <button
                  onClick={handleFind}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', height: '42px' }}
                >
                  <Search size={16} />
                  Find Pandit
                </button>
              </div>
            </div>

            {/* Trust badges */}
            <div
              className="anim-fade-up anim-delay-4"
              style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}
            >
              {[
                'Verified Pandits',
                'Samagri Included',
                'On-Time Guarantee',
              ].map(text => (
                <div
                  key={text}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.82rem',
                    color: 'var(--text-body)',
                    fontWeight: 500,
                  }}
                >
                  <CheckCircle2 size={16} color="var(--gold)" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN — Mandala + floating cards */}
          <div
            style={{
              position: 'relative',
              height: '540px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Rotating mandala */}
            <div
              className="mandala-rotate"
              style={{
                position: 'absolute',
                right: '-80px',
                width: '540px',
                height: '540px',
              }}
            >
              <MandalaBg
                size={540}
                opacity={0.25}
                style={{ position: 'relative', width: '100%', height: '100%' }}
              />
            </div>

            {/* Floating info cards */}
            {/* Card 1: Rating */}
            <div
              className="float-card-1"
              style={{
                position: 'absolute',
                top: '60px',
                left: '20px',
                backgroundColor: 'var(--bg-card)',
                border: '1.5px solid var(--gold-muted)',
                borderRadius: '10px',
                padding: '0.8rem 1.1rem',
                boxShadow: 'var(--shadow-hover)',
                zIndex: 10,
                minWidth: '130px',
              }}
            >
              <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>⭐</div>
              <p style={{ fontFamily: 'var(--font-cinzel-dec)', fontSize: '1.2rem', color: 'var(--gold)', fontWeight: 700, lineHeight: 1 }}>4.9★</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Average Rating</p>
            </div>

            {/* Card 2: Price */}
            <div
              className="float-card-2"
              style={{
                position: 'absolute',
                right: '30px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'var(--bg-card)',
                border: '1.5px solid var(--gold-muted)',
                borderRadius: '10px',
                padding: '0.8rem 1.1rem',
                boxShadow: 'var(--shadow-hover)',
                zIndex: 10,
                minWidth: '130px',
              }}
            >
              <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>🪔</div>
              <p style={{ fontFamily: 'var(--font-cinzel-dec)', fontSize: '1.2rem', color: 'var(--saffron)', fontWeight: 700, lineHeight: 1 }}>₹999</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Onwards per Puja</p>
            </div>

            {/* Card 3: Same day */}
            <div
              className="float-card-3"
              style={{
                position: 'absolute',
                bottom: '70px',
                left: '30px',
                backgroundColor: 'var(--bg-card)',
                border: '1.5px solid var(--gold-muted)',
                borderRadius: '10px',
                padding: '0.8rem 1.1rem',
                boxShadow: 'var(--shadow-hover)',
                zIndex: 10,
                minWidth: '140px',
              }}
            >
              <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>⚡</div>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.92rem', color: 'var(--maroon)', fontWeight: 700, lineHeight: 1.2 }}>Same Day</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Booking Available</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #hero > div > div {
            grid-template-columns: 1fr !important;
          }
          #hero > div > div > div:last-child {
            display: none !important;
          }
        }
      `}</style>
    </section>
  )
}
