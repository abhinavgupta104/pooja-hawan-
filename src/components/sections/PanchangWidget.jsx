import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sun, Moon, Clock, Calendar, Star, Sunrise, Loader2 } from 'lucide-react'
import SectionLabel from '../common/SectionLabel'
import { fetchPanchangData, getCurrentCoordinates } from '../../utils/panchangApi'

export default function PanchangWidget() {
  const [panchang, setPanchang] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const today = new Date()
  const todayFormatted = today.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  useEffect(() => {
    const loadPanchang = async () => {
      setLoading(true)
      setError(null)
      try {
        const coords = await getCurrentCoordinates()
        const date = today.toISOString().split('T')[0]
        const data = await fetchPanchangData({ date, ...coords })
        setPanchang(data)
      } catch (err) {
        console.error("Failed to load live panchang:", err)
        setError("API Offline")
      } finally {
        setLoading(false)
      }
    }
    loadPanchang()
  }, [])

  const getFirst = (item) => Array.isArray(item) ? item[0] : item;

  const PANCHANG_ITEMS = panchang ? [
    { key: 'tithi',          label: 'Tithi',           icon: Calendar, value: getFirst(panchang.tithi)?.name || 'N/A' },
    { key: 'nakshatra',      label: 'Nakshatra',        icon: Star,     value: getFirst(panchang.nakshatra)?.name || 'N/A' },
    { key: 'yoga',           label: 'Yoga',             icon: Sun,      value: getFirst(panchang.yoga)?.name || 'N/A' },
    { key: 'karana',         label: 'Karana',           icon: Moon,     value: getFirst(panchang.karana)?.name || 'N/A' },
    { key: 'sunrise',        label: 'Sunrise',          icon: Sunrise,  value: new Date(panchang.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    { key: 'sunset',         label: 'Sunset',           icon: Moon,     value: new Date(panchang.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ] : []

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
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Loader2 className="animate-spin" size={32} color="var(--gold)" />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--maroon-bg)', borderRadius: '8px' }}>
            <p style={{ color: 'var(--maroon)', fontSize: '0.9rem' }}>{error}. Please run 'npm run server'.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                <Sun size={14} color="var(--gold)" /> Sunrise: {new Date(panchang?.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                <Moon size={14} color="var(--gold)" /> Sunset: {new Date(panchang?.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                  {getFirst(panchang?.yoga)?.name} {panchang?.paksha ? `— ${panchang.paksha.name}` : ''}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
