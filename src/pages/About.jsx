import React from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { PAGES, breadcrumbSchema } from '../seo/seoConfig'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'
import SectionLabel from '../components/common/SectionLabel'
import StatsCounter from '../components/common/StatsCounter'
import { Heart, Globe, BadgeCheck, Users, Star, Zap } from 'lucide-react'

const VALUES = [
  { icon: Heart, title: 'Devotion First', desc: 'Every ceremony deserves deep reverence. We uphold the sanctity of Vedic traditions.' },
  { icon: Globe, title: 'Inclusive Platform', desc: 'Serving all Hindu communities across languages, regions, and traditions.' },
  { icon: BadgeCheck, title: 'Quality Above All', desc: 'Rigorous verification ensures only the most qualified pandits are on our platform.' },
  { icon: Users, title: 'Community Focus', desc: 'Building bridges between families and their cultural-spiritual heritage.' },
  { icon: Star, title: 'Premium Experience', desc: 'Not just a puja — a complete, memorable spiritual experience for your family.' },
  { icon: Zap, title: 'Technology Enabled', desc: 'Modern tools to make ancient rituals accessible to every family anywhere.' },
]

export default function About() {
  return (
    <>
      <Seo
        {...PAGES.about}
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />
      <Navbar />
      <main style={{ paddingTop: 'var(--nav-h)', backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
        {/* Hero */}
        <div style={{ backgroundColor: 'var(--bg-section-alt)', padding: '5rem 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container-max" style={{ maxWidth: '720px' }}>
            <SectionLabel>OUR STORY</SectionLabel>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)', lineHeight: 1.1, fontWeight: 500, marginBottom: '1.5rem' }}>
              Connecting Families with Sacred Traditions Since 2020
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)', fontSize: '1.05rem', lineHeight: 1.8 }}>
              Puja Havan was founded with a simple belief: every family deserves access to experienced, trustworthy pandits who perform ceremonies with devotion and knowledge.
              In a world where urbanization has separated us from our spiritual roots, we built a bridge.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="container-max" style={{ padding: '4rem 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '4rem' }}>
            <div>
              <SectionLabel>OUR MISSION</SectionLabel>
              <h2 className="section-heading" style={{ marginBottom: '1rem' }}>Making Sacred Accessible</h2>
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)', lineHeight: 1.8, marginBottom: '1rem' }}>
                We believe that performing pujas and homas is not just tradition — it's the fabric that connects generations. Our mission is to make this connection seamless, authentic, and joyful.
              </p>
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)', lineHeight: 1.8 }}>
                Whether you're in Delhi or Dubai, whether you speak Hindi or Tamil, Puja Havan ensures you can perform your ceremonies with complete faith and zero compromise.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <StatsCounter value={20000} suffix="+" label="Verified Pandits" />
              <StatsCounter value={100000} suffix="+" label="Pujas Performed" />
              <StatsCounter value={50} suffix="+" label="Cities Served" />
              <StatsCounter value={4.9} suffix="/5" label="Average Rating" />
            </div>
          </div>

          {/* Team placeholder */}
          <SectionLabel>OUR TEAM</SectionLabel>
          <h2 className="section-heading" style={{ marginBottom: '2rem' }}>The Minds Behind Puja Havan</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '4rem' }}>
            {[
              { name: 'Arjun Sharma', role: 'CEO & Co-Founder', initials: 'AS' },
              { name: 'Priya Nair', role: 'Head of Pandit Network', initials: 'PN' },
              { name: 'Rahul Verma', role: 'CTO', initials: 'RV' },
              { name: 'Meera Pillai', role: 'Head of Operations', initials: 'MP' },
            ].map(member => (
              <div key={member.name} className="card-base" style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  backgroundColor: 'var(--gold-bg)', border: '2px solid var(--gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--gold)',
                }}>
                  {member.initials}
                </div>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{member.name}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{member.role}</p>
              </div>
            ))}
          </div>

          {/* Values */}
          <SectionLabel>OUR VALUES</SectionLabel>
          <h2 className="section-heading" style={{ marginBottom: '2rem' }}>What We Stand For</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {VALUES.map(v => {
              const Icon = v.icon
              return (
                <div key={v.title} className="card-base" style={{ padding: '1.5rem' }}>
                  <div className="gold-icon-bg" style={{ width: '44px', height: '44px', marginBottom: '0.75rem' }}>
                    <Icon size={20} color="var(--gold)" />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{v.title}</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-body)', lineHeight: 1.7 }}>{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
