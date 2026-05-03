import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Award, CheckCircle2 } from 'lucide-react'
import panditsData from '../../data/pandits.json'
import SectionLabel from '../common/SectionLabel'

export default function AcharyaProfileBanner() {
  const pandit = panditsData.find(p => p.id === 'acharya-prashant-pandey')
  
  if (!pandit) return null;

  return (
    <section style={{ backgroundColor: 'var(--bg-section-alt)', padding: '5rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05, background: 'radial-gradient(circle at 80% 50%, var(--saffron) 0%, transparent 50%)' }} />
      
      <div className="container-max" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '3rem' }}>
          <SectionLabel>OUR FEATURED EXPERT</SectionLabel>
          <h2 className="section-heading" style={{ marginBottom: '1rem' }}>Meet Acharya Prashant Pandey</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px' }}>
            Jyotishacharya & Vedic Consultant with over 20 years of experience guiding families toward prosperity and peace.
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-gold)',
          boxShadow: 'var(--shadow-hover)',
          padding: '3rem',
          display: 'flex',
          gap: '4rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Photo Side */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ 
              width: '240px', height: '240px', borderRadius: '50%', padding: '8px', 
              background: 'linear-gradient(135deg, var(--gold) 0%, var(--maroon) 100%)',
              marginBottom: '1.5rem'
            }}>
              <img src="/images/pandits/acharya_prashant_final.jpg" alt={pandit.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--bg-card)' }} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{pandit.name}</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.2rem', marginBottom: '1rem' }}>
              {'★★★★★'.split('').map((s, i) => <Star key={i} size={18} fill="var(--gold)" color="var(--gold)" />)}
            </div>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)', fontWeight: 500 }}>{pandit.reviewCount}+ Happy Families</p>
          </div>

          {/* Details Side */}
          <div style={{ flex: '2 1 400px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: 1.8, marginBottom: '2rem' }}>
              {pandit.bio}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--maroon)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={18} /> Education
                </h4>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{pandit.education}</p>
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--maroon)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} /> Expertise
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {pandit.specializations.slice(0, 4).map(spec => (
                    <span key={spec} style={{ backgroundColor: 'var(--gold-bg)', color: 'var(--text-body)', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid var(--border)' }}>{spec}</span>
                  ))}
                </div>
              </div>
            </div>

            <Link to={`/pandit/${pandit.id}`} className="btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem' }}>
              View Full Profile & Book
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
