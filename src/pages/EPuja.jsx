import React, { useState } from 'react'
import Seo from '../components/Seo'
import { PAGES, breadcrumbSchema } from '../seo/seoConfig'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'
import SectionLabel from '../components/common/SectionLabel'
import servicesData from '../data/services.json'
import { Globe, Smartphone, Package, Video, CheckCircle2 } from 'lucide-react'

const EPUJA_SERVICES = servicesData.filter(s =>
  ['Satyanarayan Puja', 'Lakshmi Puja', 'Ganesh Puja', 'Rudrabhishek', 'Mahamrityunjay Jaap', 'Sundarkand Path'].includes(s.name)
)

export default function EPuja() {
  return (
    <>
      <Seo
        {...PAGES.puja}
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Online Puja', path: '/puja' },
        ])}
      />
      <Navbar />
      <main style={{ paddingTop: 'var(--nav-h)', backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
        {/* Hero */}
        <div style={{ backgroundColor: 'var(--maroon)', padding: '5rem 0', textAlign: 'center' }}>
          <div className="container-max">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📿</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'white', marginBottom: '1rem', fontWeight: 500 }}>
              Puja — Sacred Rituals, Performed for You
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,245,230,0.85)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 2rem', fontSize: '1rem' }}>
              Live-streamed Vedic ceremonies performed by experienced pandits. You participate from wherever you are in the world. Samagri kit delivered to your home.
            </p>
            <a href="/booking" className="btn-gold-outline">Book Puja Now</a>
          </div>
        </div>

        {/* How it works */}
        <div style={{ backgroundColor: 'var(--bg-section-alt)', padding: '5rem 0' }}>
          <div className="container-max">
            <SectionLabel>HOW PUJA WORKS</SectionLabel>
            <h2 className="section-heading" style={{ marginBottom: '2.5rem' }}>3 Simple Steps</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {[
                { step: '01', icon: Package, title: 'Book & Receive Kit', desc: 'Book your puja online. We deliver the samagri kit to your home 1-2 days before the ceremony.' },
                { step: '02', icon: Video, title: 'Join Live Stream', desc: 'Connect via WhatsApp Video or Zoom at the scheduled time. Our pandit will guide you through every step.' },
                { step: '03', icon: CheckCircle2, title: 'Receive Blessings', desc: 'Participate fully in the sacred ceremony from anywhere. Receive divine blessings and prasad preparation guidance.' },
              ].map(item => {
                const Icon = item.icon
                return (
                  <div key={item.step} className="card-base" style={{ padding: '2rem', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-cinzel-dec)', fontSize: '2rem', color: 'var(--gold)', marginBottom: '1rem', opacity: 0.6 }}>{item.step}</div>
                    <div className="gold-icon-bg" style={{ width: '52px', height: '52px', margin: '0 auto 1rem' }}>
                      <Icon size={22} color="var(--gold)" />
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.6rem' }}>{item.title}</h3>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Available services */}
        <div className="container-max" style={{ padding: '4rem 2rem' }}>
          <SectionLabel>AVAILABLE SERVICES</SectionLabel>
          <h2 className="section-heading" style={{ marginBottom: '2rem' }}>Ceremonies Available Online</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {EPUJA_SERVICES.map(s => (
              <div key={s.id} className="card-base" style={{ padding: '1.25rem' }}>
                <h3 className="card-title" style={{ marginBottom: '0.25rem' }}>{s.name}</h3>
                <p className="devanagari-sub" style={{ marginBottom: '0.75rem' }}>{s.hindiName}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--saffron)', fontWeight: 500 }}>
                    From ₹{s.startingPrice.toLocaleString('en-IN')}
                  </span>
                  <a href="/booking" style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--saffron)', textDecoration: 'none', fontWeight: 500 }}>
                    Book →
                  </a>
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
