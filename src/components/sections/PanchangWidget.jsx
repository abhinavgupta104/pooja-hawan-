import React from 'react'
import { Link } from 'react-router-dom'
import { Sun, Moon, Clock, Calendar, Star, Sunrise } from 'lucide-react'
import SectionLabel from '../common/SectionLabel'
import panchang from '../../data/panchang.json'

const PANCHANG_ITEMS = [
  { key: 'tithi',          label: 'Tithi',           icon: Calendar, value: panchang.tithi },
  { key: 'nakshatra',      label: 'Nakshatra',        icon: Star,     value: panchang.nakshatra },
  { key: 'yoga',           label: 'Yoga',             icon: Sun,      value: panchang.yoga },
  { key: 'karana',         label: 'Karana',           icon: Moon,     value: panchang.karana },
  { key: 'rahuKaal',       label: 'Rahu Kaal',        icon: Clock,    value: panchang.rahuKaal },
  { key: 'abhijitMuhurat', label: 'Abhijit Muhurat',  icon: Sunrise,  value: panchang.abhijitMuhurat },
]

export default function PanchangWidget() {
  const todayFormatted = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <section style={{ backgroundColor: 'var(--gold-bg)', padding: '5rem 0' }}>
      <div className="container-max">
        <SectionLabel>TODAY'S PANCHANG</SectionLabel>
        <h2
          style={{
            fontFamily: 'var(--font-deva)',
            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
            fontWeight: 500,
          }}
        >
          आज का पंचांग
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          marginBottom: '0.5rem',
        }}>
          {todayFormatted}
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
            <Sun size={14} color="var(--gold)" /> Sunrise: {panchang.sunrise}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
            <Moon size={14} color="var(--gold)" /> Sunset: {panchang.sunset}
          </span>
        </div>

        {/* Responsive Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          {PANCHANG_ITEMS.map(item => {
            const Icon = item.icon
            return (
              <div key={item.key} className="panchang-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <Icon size={16} color="var(--gold)" />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {item.label}
                  </span>
                </div>
                <p style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.92rem',
                  color: 'var(--maroon)',
                  fontWeight: 400,
                  lineHeight: 1.4,
                }}>
                  {item.value}
                </p>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <Link
            to="/panchang"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.88rem',
              color: 'var(--maroon)',
              textDecoration: 'none',
              fontWeight: 500,
              borderBottom: '1px solid var(--border-gold)',
              paddingBottom: '2px',
            }}
          >
            View Full Panchang →
          </Link>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            display: 'flex',
            gap: '0.4rem',
            alignItems: 'center',
          }}>
            <Star size={14} color="var(--gold)" />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-body)' }}>
              {panchang.yoga} — {panchang.panchakNotes.split('.')[0]}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
