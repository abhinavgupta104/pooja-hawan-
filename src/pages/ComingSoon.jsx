import React from 'react'
import Seo from '../components/Seo'
import { PAGES } from '../seo/seoConfig'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'

export default function ComingSoon() {
  return (
    <>
      <Seo {...PAGES['e-puja']} noindex />
      <Navbar />
      <main style={{ 
        paddingTop: '68px', 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--bg-page)',
        textAlign: 'center'
      }}>
        <div className="container-max">
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🕉️</div>
          <h1 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
            color: 'var(--maroon)',
            marginBottom: '1rem'
          }}>
            Coming Soon
          </h1>
          <p style={{ 
            fontFamily: 'var(--font-body)', 
            color: 'var(--text-body)', 
            fontSize: '1.2rem',
            maxWidth: '600px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6
          }}>
            We are working hard to bring you a sacred and immersive experience. 
            Stay tuned for our new spiritual offerings.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="/" className="btn-primary">Back to Home</a>
            <a href="/contact" className="btn-gold-outline">Inquire Now</a>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
