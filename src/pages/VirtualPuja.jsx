import React from 'react'
import Seo from '../components/Seo'
import { PAGES, breadcrumbSchema } from '../seo/seoConfig'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'
import SectionLabel from '../components/common/SectionLabel'
import { Video, User, Zap, Sparkles, Shield, Clock } from 'lucide-react'
import virtualBg from '../assets/virtual_puja_bg.png'

export default function VirtualPuja() {
  return (
    <>
      <Seo
        {...PAGES['virtual-puja']}
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Virtual Puja', path: '/virtual-puja' },
        ])}
      />
      <Navbar />
      <main style={{ paddingTop: '68px', backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
        {/* Hero Section */}
        <section style={{ 
          background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${virtualBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '8rem 0',
          textAlign: 'center',
          color: 'white',
          position: 'relative'
        }}>
          <div className="container-max" style={{ position: 'relative', zIndex: 2 }}>
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(8px)',
              padding: '3rem 2rem',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'inline-block',
              maxWidth: '900px'
            }}>
              <SectionLabel color="var(--gold)">PREMIUM EXPERIENCE</SectionLabel>
              <h1 style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
                marginBottom: '1.5rem',
                fontWeight: 500,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}>
                Virtual Puja — One-to-One Sacred Connection
              </h1>
              <p style={{ 
                fontFamily: 'var(--font-body)', 
                fontSize: '1.2rem', 
                color: 'rgba(255,255,255,0.9)', 
                maxWidth: '700px', 
                margin: '0 auto 2.5rem',
                lineHeight: 1.8
              }}>
                Experience a fully real-time, private Vedic ceremony tailored exclusively for you. 
                Connect with India's most learned Acharyas in a high-definition virtual environment.
              </p>
              <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/booking" className="btn-primary" style={{ padding: '1rem 2.5rem' }}>Book Private Session</a>
                <a href="#how-it-works" className="btn-gold-outline" style={{ border: '1.5px solid white', color: 'white' }}>How it Works</a>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section style={{ padding: '6rem 0', backgroundColor: 'var(--bg-section-alt)' }}>
          <div className="container-max">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <SectionLabel>THE VIRTUAL DIFFERENCE</SectionLabel>
              <h2 className="section-heading">Beyond Ordinary Streams</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {[
                {
                  icon: User,
                  title: '1:1 Private Session',
                  desc: 'A dedicated pandit performs the ritual exclusively for you and your family, ensuring undivided attention and spiritual precision.'
                },
                {
                  icon: Zap,
                  title: 'Fully Real-time Interaction',
                  desc: 'Zero-latency interaction allows you to perform mudras and chant mantras alongside the pandit as if you were in the same room.'
                },
                {
                  icon: Sparkles,
                  title: 'Immersive Visuals',
                  desc: 'Multiple high-definition camera angles capture every sacred detail, from the Agni-kund to the intricate floral decorations.'
                },
                {
                  icon: Shield,
                  title: 'Personalized Sankalpa',
                  desc: 'Every session begins with a personalized Sankalpa, identifying your Gothra, Rashi, and specific spiritual intent.'
                }
              ].map((feature, i) => (
                <div key={i} className="card-base" style={{ padding: '2.5rem', transition: 'transform 0.3s ease' }}>
                  <div className="gold-icon-bg" style={{ width: '56px', height: '56px', marginBottom: '1.5rem' }}>
                    <feature.icon size={24} color="var(--gold)" />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--maroon)' }}>{feature.title}</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: 1.7 }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Immersive CTA */}
        <section style={{ 
          padding: '8rem 0', 
          backgroundColor: 'var(--maroon)', 
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative SVG background element */}
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', opacity: 0.1 }}>
            <svg width="400" height="400" viewBox="0 0 400 400">
              <circle cx="200" cy="200" r="180" stroke="white" strokeWidth="1" fill="none" />
              <path d="M200 20 L200 380 M20 200 L380 200" stroke="white" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="container-max" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <h2 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: 'clamp(2rem, 5vw, 3rem)', 
              marginBottom: '1.5rem' 
            }}>
              Ready for a Spiritual Awakening?
            </h2>
            <p style={{ 
              fontFamily: 'var(--font-body)', 
              fontSize: '1.1rem', 
              maxWidth: '600px', 
              margin: '0 auto 3rem',
              color: 'rgba(255,255,255,0.8)'
            }}>
              Select your preferred ceremony and schedule a private virtual session with our senior Acharyas today.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              {['Mahamrityunjay Jaap', 'Rudrabhishek', 'Vastu Shanti', 'Navgrah Shanti'].map(puja => (
                <div key={puja} style={{ 
                  padding: '1.5rem', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--gold)' }}>{puja}</h4>
                </div>
              ))}
            </div>
            <a href="/booking" className="btn-primary" style={{ 
              backgroundColor: 'var(--gold)', 
              color: 'var(--maroon)', 
              padding: '1rem 3rem',
              fontWeight: 700
            }}>
              Start Your Journey
            </a>
          </div>
        </section>

        {/* Schedule */}
        <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-page)' }}>
          <div className="container-max" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              <Clock size={18} />
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>SESSIONS AVAILABLE 24/7 FOR INTERNATIONAL DEVOTEES</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
