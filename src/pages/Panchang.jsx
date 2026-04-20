import React from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'
import SectionLabel from '../components/common/SectionLabel'
import panchangData from '../data/panchang.json'
import festivalsData from '../data/festivals.json'
import { Sun, Moon, Clock, Calendar, Star, Sunrise } from 'lucide-react'

const PANCHANG_ITEMS = [
  { key: 'tithi', label: 'Tithi', icon: Calendar },
  { key: 'nakshatra', label: 'Nakshatra', icon: Star },
  { key: 'yoga', label: 'Yoga', icon: Sun },
  { key: 'karana', label: 'Karana', icon: Moon },
  { key: 'rahuKaal', label: 'Rahu Kaal', icon: Clock },
  { key: 'abhijitMuhurat', label: 'Abhijit Muhurat', icon: Sunrise },
]

const upcomingFestivals = [...festivalsData].sort((a,b) => new Date(a.date) - new Date(b.date)).slice(0, 8)

export default function Panchang() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px', backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ backgroundColor: 'var(--gold-bg)', padding: '4rem 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container-max">
            <SectionLabel>TODAY'S PANCHANG</SectionLabel>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              आज का पंचांग
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: '1rem' }}>
              {panchangData.date}
            </p>
          </div>
        </div>

        {/* Full panchang */}
        <div className="container-max" style={{ padding: '3rem 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
            {PANCHANG_ITEMS.map(item => {
              const Icon = item.icon
              return (
                <div key={item.key} className="panchang-box" style={{ boxShadow: 'var(--shadow-card)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <Icon size={16} color="var(--gold)" />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {item.label}
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', color: 'var(--maroon)' }}>
                    {panchangData[item.key]}
                  </p>
                </div>
              )
            })}
          </div>

          <h2 className="section-heading" style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Auspicious Times Today</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>
                Auspicious Muhurats
              </p>
              {panchangData.auspiciousTime.map(t => (
                <div key={t.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-body)' }}>{t.name}</span>
                  <span style={{ color: 'var(--gold)', fontWeight: 500 }}>{t.time}</span>
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: 'var(--maroon)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>
                Inauspicious Times
              </p>
              {panchangData.inauspiciousTime.map(t => (
                <div key={t.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-body)' }}>{t.name}</span>
                  <span style={{ color: 'var(--saffron)', fontWeight: 500 }}>{t.time}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 className="section-heading" style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Upcoming Festivals</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {upcomingFestivals.map(f => (
              <div key={f.id} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ backgroundColor: 'var(--maroon)', borderRadius: '8px', padding: '0.6rem 0.9rem', textAlign: 'center', flexShrink: 0 }}>
                  <p style={{ fontFamily: 'var(--font-cinzel-dec)', fontSize: '1.2rem', color: 'var(--gold)', lineHeight: 1 }}>
                    {new Date(f.date).getDate()}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--gold-muted)', textTransform: 'uppercase' }}>
                    {new Date(f.date).toLocaleString('en', { month: 'short' })}
                  </p>
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.1rem' }}>{f.name}</p>
                  <p style={{ fontFamily: 'var(--font-deva)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{f.hindiName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
