import React from 'react'
import { useParams, Link } from 'react-router-dom'
import Seo from '../components/Seo'
import PoojaPoster from '../components/PoojaPoster'
import { serviceSchema, breadcrumbSchema } from '../seo/seoConfig'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'
import PanditCard from '../components/cards/PanditCard'
import servicesData from '../data/services.json'
import panditsData from '../data/pandits.json'
import { formatPrice } from '../lib/utils'
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react'

const PRICING_TIERS = [
  {
    tier: 'Basic',
    desc: 'Pandit + all mantras',
    includes: ['Experienced pandit', 'All Vedic mantras', 'Puja guidance'],
    excludes: ['Samagri not included', 'No flowers'],
    multiplier: 1,
  },
  {
    tier: 'Standard',
    desc: 'Pandit + samagri included',
    includes: ['Experienced pandit', 'All Vedic mantras', 'Complete samagri', 'Flowers & decoration', 'Prasad preparation'],
    excludes: [],
    multiplier: 1.5,
    featured: true,
  },
  {
    tier: 'Premium',
    desc: 'Full ceremony experience',
    includes: ['Senior pandit', 'All Vedic mantras', 'Complete samagri', 'Premium decoration', 'Prasad preparation', 'Post-puja cleanup', 'WhatsApp follow-up'],
    excludes: [],
    multiplier: 2,
  },
]

export default function ServiceDetail() {
  const { slug } = useParams()
  const service = servicesData.find(s => s.slug === slug)

  if (!service) {
    return (
      <>
        <Seo
          title="Puja Not Found | Puja Havan"
          description="This puja could not be found. Browse all Vedic puja and havan services on Puja Havan."
          path="/services"
          noindex
        />
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '68px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--maroon)', marginBottom: '1rem' }}>
              Puja not found
            </p>
            <Link to="/services" className="btn-primary">Browse All Services</Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const availablePandits = panditsData
    .filter(p => p.specializations.includes(service.name))
    .slice(0, 3)

  const relatedServices = servicesData
    .filter(s => s.category === service.category && s.id !== service.id)
    .slice(0, 4)

  const serviceTitle = `${service.name} — Book Online from ₹${service.startingPrice} | Puja Havan`
  const serviceDesc = `${service.shortDesc}. Book ${service.name} (${service.duration}) online with verified pandits from ₹${service.startingPrice}. Samagri included, transparent pricing.`

  return (
    <>
      <Seo
        title={serviceTitle}
        description={serviceDesc}
        path={`/service/${service.slug}`}
        image={service.poster || service.image}
        type="product"
        keywords={`${service.name}, book ${service.name} online, ${service.category} puja, ${service.hindiName}`}
        jsonLd={[
          serviceSchema(service),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: service.name, path: `/service/${service.slug}` },
          ]),
        ]}
      />
      <Navbar />
      <style>{`
        @media (max-width: 860px) {
          .service-hero-grid { grid-template-columns: 1fr !important; gap: 2.25rem !important; }
          .service-hero-poster { order: -1; max-width: 400px !important; }
        }
      `}</style>
      <main style={{ paddingTop: '68px', backgroundColor: 'var(--bg-page)' }}>
        {/* Hero */}
        <div style={{ backgroundColor: 'var(--bg-section-alt)', padding: '4rem 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container-max">
            <div
              className="service-hero-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: service.poster ? 'minmax(0, 1.05fr) minmax(0, 0.95fr)' : '1fr',
                gap: '3.5rem',
                alignItems: 'center',
              }}
            >
              {/* Text column */}
              <div>
                <span className="service-badge" style={{ marginBottom: '1rem', display: 'inline-flex' }}>{service.category}</span>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)', marginBottom: '0.4rem', lineHeight: 1.1 }}>
                  {service.name}
                </h1>
                <p className="devanagari-sub" style={{ fontSize: '1rem', marginBottom: '1rem' }}>{service.hindiName}</p>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)', fontSize: '1rem', maxWidth: '560px', lineHeight: 1.7 }}>
                  {service.description}
                </p>
                <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <Clock size={16} color="var(--gold)" /> Duration: {service.duration}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--saffron)', fontWeight: 600 }}>
                    Starting from {formatPrice(service.startingPrice)}
                  </div>
                </div>
                <Link
                  to="/booking"
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginTop: '1.75rem' }}
                >
                  Book This Puja <ArrowRight size={16} />
                </Link>
              </div>

              {/* Poster column */}
              {service.poster && (
                <div className="service-hero-poster" style={{ maxWidth: '460px', justifySelf: 'center', width: '100%' }}>
                  <PoojaPoster
                    src={service.poster}
                    alt={`${service.name} (${service.hindiName}) — puja booking by Puja Havan`}
                    eager
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pricing tiers */}
        <div style={{ backgroundColor: 'var(--bg-page)', padding: '4rem 0' }}>
          <div className="container-max">
            <p className="section-label" style={{ marginBottom: '0.6rem' }}>PRICING PLANS</p>
            <h2 className="section-heading" style={{ marginBottom: '2.5rem' }}>Choose Your Package</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
              {PRICING_TIERS.map(tier => (
                <div
                  key={tier.tier}
                  className={tier.featured ? 'pricing-featured' : ''}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: `1px solid ${tier.featured ? 'var(--gold)' : 'var(--border)'}`,
                    borderRadius: '8px',
                    padding: '2rem 1.5rem',
                    boxShadow: tier.featured ? 'var(--shadow-hover)' : 'var(--shadow-card)',
                    position: 'relative',
                  }}
                >
                  {tier.featured && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'var(--maroon)',
                      color: 'white',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      padding: '0.2rem 0.8rem',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                    }}>
                      ★ Most Popular
                    </div>
                  )}
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                    {tier.tier}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    {tier.desc}
                  </p>
                  <p style={{ fontFamily: 'var(--font-cinzel-dec)', fontSize: '1.8rem', color: 'var(--saffron)', marginBottom: '1.25rem' }}>
                    {formatPrice(Math.round(service.startingPrice * tier.multiplier))}
                  </p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {tier.includes.map(item => (
                      <li key={item} style={{ display: 'flex', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-body)', fontFamily: 'var(--font-body)' }}>
                        <CheckCircle2 size={14} color="var(--gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link to="/booking" className={tier.featured ? 'btn-primary' : 'btn-secondary'} style={{ width: '100%', justifyContent: 'center' }}>
                    Book {tier.tier}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Available pandits */}
        {availablePandits.length > 0 && (
          <div style={{ backgroundColor: 'var(--bg-section-alt)', padding: '4rem 0' }}>
            <div className="container-max">
              <p className="section-label" style={{ marginBottom: '0.6rem' }}>SPECIALISTS</p>
              <h2 className="section-heading" style={{ marginBottom: '2rem' }}>Available Pandits</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
                {availablePandits.map(p => <PanditCard key={p.id} pandit={p} />)}
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <Link to="/pandits" style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--maroon)', textDecoration: 'none', fontWeight: 500, borderBottom: '1px solid var(--border-gold)' }}>
                  View All Pandits →
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
