import React from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'
import panditsData from '../data/pandits.json'
import servicesData from '../data/services.json'
import { MapPin, Star, Clock, Languages } from 'lucide-react'

export default function PanditProfile() {
  const { id } = useParams()
  const pandit = panditsData.find(p => p.id === id)

  if (!pandit) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '68px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--maroon)', marginBottom: '1rem' }}>Pandit not found</p>
            <Link to="/pandits" className="btn-primary">View All Pandits</Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const services = servicesData.filter(s => pandit.specializations.includes(s.name))

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px', backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
        {/* Profile hero */}
        <div style={{ backgroundColor: 'var(--bg-section-alt)', padding: '4rem 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container-max">
            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Photo */}
              <div style={{ flexShrink: 0 }}>
                <img
                  src={pandit.photo}
                  alt={pandit.name}
                  className="pandit-photo"
                  style={{ width: '120px', height: '120px' }}
                  onError={e => e.target.style.display = 'none'}
                />
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {pandit.name}
                </h1>
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                    <MapPin size={14} color="var(--gold)" /> {pandit.city}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-body)' }}>
                    <span className="stars" style={{ fontSize: '0.85rem' }}>{'★'.repeat(Math.round(pandit.rating))}</span> {pandit.rating} ({pandit.reviewCount} reviews)
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {pandit.experience} years experience
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)', lineHeight: 1.7, maxWidth: '580px', marginBottom: '1rem' }}>
                  {pandit.bio}
                </p>
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Languages: </span>
                  {pandit.languages.map(l => (
                    <span key={l} className="service-badge" style={{ marginRight: '0.3rem', fontSize: '0.7rem' }}>{l}</span>
                  ))}
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  {pandit.education} · {pandit.certifications}
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link to="/booking" className="btn-primary">
                    Book {pandit.name.split(' ')[1]} →
                  </Link>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-body)', alignSelf: 'center' }}>
                    From ₹{pandit.pricePerPuja.toLocaleString('en-IN')}/puja
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services table */}
        <div className="container-max" style={{ padding: '3rem 2rem' }}>
          <h2 className="section-heading" style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>
            Services Offered
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {services.map(s => (
              <div key={s.id} style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{s.name}</p>
                  <p className="devanagari-sub">{s.hindiName}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--saffron)', fontSize: '0.9rem' }}>
                    ₹{Math.round(pandit.pricePerPuja * 1.1).toLocaleString('en-IN')}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{s.duration}</p>
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
