import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'
import SectionLabel from '../components/common/SectionLabel'
import { CheckCircle2, Upload } from 'lucide-react'

const LANGUAGES = ['Hindi', 'Tamil', 'Telugu', 'Kannada', 'Marathi', 'Bengali', 'Gujarati', 'Bihari', 'Maithil', 'Sanskrit', 'Oriya']
const SPECIALIZATIONS = ['Satyanarayan Puja', 'Griha Pravesh', 'Ganesh Puja', 'Rudrabhishek', 'Navgraha Havan', 'Lakshmi Puja', 'Vivah Puja', 'Vastu Shanti', 'Kaal Sarp Dosh', 'Pitru Dosh Nivaran', 'Durga Puja', 'All Ceremonies']
const CITIES_LIST = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Kolkata', 'Jaipur', 'Lucknow', 'Patna', 'Varanasi']

const schema = z.object({
  name: z.string().min(3, 'Full name required'),
  phone: z.string().length(10, 'Enter 10-digit phone'),
  email: z.string().email('Valid email required'),
  city: z.string().min(1, 'City required'),
  experience: z.string().min(1, 'Experience required'),
  education: z.string().min(5, 'Education details required'),
  certifications: z.string().optional(),
  aadhaar: z.string().length(12, 'Enter 12-digit Aadhaar'),
  bio: z.string().min(50, 'Please write at least 50 characters about yourself'),
})

export default function PanditRegistration() {
  const [selectedLanguages, setSelectedLanguages] = useState([])
  const [selectedSpecializations, setSelectedSpecializations] = useState([])
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const toggleLang = (l) => setSelectedLanguages(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])
  const toggleSpec = (s) => setSelectedSpecializations(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  const onSubmit = (data) => {
    // TODO: POST to /api/register-pandit
    console.log('Pandit registration:', { ...data, languages: selectedLanguages, specializations: selectedSpecializations })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '68px' }}>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <CheckCircle2 size={64} color="var(--gold)" style={{ margin: '0 auto 1.5rem' }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Application Submitted!</h2>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)', maxWidth: '400px', lineHeight: 1.7 }}>
              Thank you for applying to Puja Havan. Our team will review your application and contact you within 48 hours via phone and email.
            </p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px', backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ backgroundColor: 'var(--maroon)', padding: '4rem 0', textAlign: 'center' }}>
          <div className="container-max">
            <SectionLabel style={{ color: 'var(--gold)' }}>JOIN THE PLATFORM</SectionLabel>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'white', marginBottom: '0.75rem', fontWeight: 500 }}>
              Register as a Pandit
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,245,230,0.8)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
              Join 20,000+ pandits earning on Puja Havan. Flexible timings. Verified profile. No commission for first 6 months.
            </p>
          </div>
        </div>

        <div className="container-max" style={{ padding: '3rem 2rem' }}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '700px' }}>
            {/* Personal Details */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--maroon)', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                Personal Information
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-field">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" placeholder="Pandit Ramesh Kumar" {...register('name')} />
                  {errors.name && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{errors.name.message}</p>}
                </div>
                <div className="form-field">
                  <label className="form-label">Phone Number *</label>
                  <input className="form-input" placeholder="10-digit mobile" maxLength={10} {...register('phone')} />
                  {errors.phone && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{errors.phone.message}</p>}
                </div>
                <div className="form-field">
                  <label className="form-label">Email *</label>
                  <input type="email" className="form-input" {...register('email')} />
                  {errors.email && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{errors.email.message}</p>}
                </div>
                <div className="form-field">
                  <label className="form-label">Primary City *</label>
                  <select className="form-input form-select" {...register('city')}>
                    <option value="">Select City</option>
                    {CITIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.city && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{errors.city.message}</p>}
                </div>
              </div>
            </div>

            {/* Professional */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--maroon)', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                Professional Details
              </h2>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Languages Spoken *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLang(lang)}
                      style={{
                        fontFamily: 'var(--font-body)', fontSize: '0.78rem', padding: '0.3rem 0.7rem', borderRadius: '999px',
                        border: selectedLanguages.includes(lang) ? 'none' : '1px solid var(--border)',
                        backgroundColor: selectedLanguages.includes(lang) ? 'var(--saffron)' : 'var(--gold-bg)',
                        color: selectedLanguages.includes(lang) ? 'white' : 'var(--maroon)',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Specializations *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {SPECIALIZATIONS.map(spec => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => toggleSpec(spec)}
                      style={{
                        fontFamily: 'var(--font-body)', fontSize: '0.78rem', padding: '0.3rem 0.7rem', borderRadius: '999px',
                        border: selectedSpecializations.includes(spec) ? 'none' : '1px solid var(--border)',
                        backgroundColor: selectedSpecializations.includes(spec) ? 'var(--saffron)' : 'var(--gold-bg)',
                        color: selectedSpecializations.includes(spec) ? 'white' : 'var(--maroon)',
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-field">
                  <label className="form-label">Experience (years) *</label>
                  <select className="form-input form-select" {...register('experience')}>
                    <option value="">Select</option>
                    {['1-3 years', '3-5 years', '5-10 years', '10-20 years', '20+ years'].map(x => (
                      <option key={x} value={x}>{x}</option>
                    ))}
                  </select>
                  {errors.experience && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{errors.experience.message}</p>}
                </div>
              </div>
              <div className="form-field" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Vedic Education *</label>
                <input className="form-input" placeholder="e.g., Shastri from Sampurnanand University, Varanasi" {...register('education')} />
                {errors.education && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{errors.education.message}</p>}
              </div>
              <div className="form-field" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Certifications (optional)</label>
                <input className="form-input" placeholder="e.g., Jyotishacharya, HR&CE Certified" {...register('certifications')} />
              </div>
              <div className="form-field">
                <label className="form-label">About Yourself *</label>
                <textarea className="form-input" rows={4} placeholder="Tell us about your training, family tradition, and the ceremonies you specialize in..." {...register('bio')} style={{ resize: 'vertical' }} />
                {errors.bio && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{errors.bio.message}</p>}
              </div>
            </div>

            {/* Identity */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--maroon)', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                Identity Verification
              </h2>
              <div className="form-field" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Aadhaar Number *</label>
                <input className="form-input" placeholder="12-digit Aadhaar (will be masked)" maxLength={12} {...register('aadhaar')} type="password" />
                {errors.aadhaar && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{errors.aadhaar.message}</p>}
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {['Aadhaar Card', 'Educational Certificate'].map(doc => (
                  <div key={doc} style={{
                    border: '1.5px dashed var(--border)',
                    borderRadius: '8px',
                    padding: '1.25rem 1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: 'var(--bg-card)',
                    flex: 1,
                    minWidth: '180px',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <Upload size={20} color="var(--gold-muted)" style={{ margin: '0 auto 0.5rem' }} />
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Upload {doc}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>PDF or JPG, max 5MB</p>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}>
              Submit Application
            </button>
          </form>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
