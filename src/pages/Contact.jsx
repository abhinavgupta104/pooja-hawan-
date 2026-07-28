import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Seo from '../components/Seo'
import { PAGES, breadcrumbSchema } from '../seo/seoConfig'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'
import SectionLabel from '../components/common/SectionLabel'
import { Phone, Mail, Clock, MapPin, CheckCircle2 } from 'lucide-react'
import { submitLead } from '../utils/leadsApi'

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  phone: z.string().length(10, '10-digit phone required'),
  email: z.string().email('Valid email required'),
  city: z.string().min(1, 'City required'),
  message: z.string().min(10, 'Message too short'),
})

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    setSendError('')
    setSending(true)
    try {
      await submitLead('contact', data)
      setSubmitted(true)
    } catch (err) {
      setSendError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <Seo
        {...PAGES.contact}
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />
      <Navbar />
      <main style={{ paddingTop: '68px', backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ backgroundColor: 'var(--bg-section-alt)', padding: '4rem 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container-max">
            <SectionLabel>GET IN TOUCH</SectionLabel>
            <h1 className="section-heading">Contact Us</h1>
          </div>
        </div>

        <div className="container-max" style={{ padding: '4rem 2rem' }}>
          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'start' }}>
            {/* Form */}
            <div>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-gold)' }}>
                  <CheckCircle2 size={52} color="var(--gold)" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Message Sent!</h3>
                  <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)', fontSize: '0.9rem' }}>
                    Our team will respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-field">
                      <label className="form-label">Full Name *</label>
                      <input className="form-input" {...register('name')} placeholder="Your name" />
                      {errors.name && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{errors.name.message}</p>}
                    </div>
                    <div className="form-field">
                      <label className="form-label">Phone *</label>
                      <input className="form-input" maxLength={10} {...register('phone')} placeholder="10-digit" />
                      {errors.phone && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-field">
                      <label className="form-label">Email *</label>
                      <input type="email" className="form-input" {...register('email')} placeholder="you@email.com" />
                      {errors.email && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{errors.email.message}</p>}
                    </div>
                    <div className="form-field">
                      <label className="form-label">Your City *</label>
                      <input className="form-input" {...register('city')} placeholder="e.g., Delhi" />
                      {errors.city && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{errors.city.message}</p>}
                    </div>
                  </div>
                  <div className="form-field">
                    <label className="form-label">Message *</label>
                    <textarea className="form-input" rows={5} {...register('message')} placeholder="How can we help you?" style={{ resize: 'vertical' }} />
                    {errors.message && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{errors.message.message}</p>}
                  </div>
                  {sendError && (
                    <p role="alert" style={{ color: 'var(--maroon)', fontFamily: 'var(--font-body)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                      {sendError}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={sending}
                    style={{ alignSelf: 'flex-start', padding: '0.8rem 2rem', opacity: sending ? 0.7 : 1, cursor: sending ? 'wait' : 'pointer' }}
                  >
                    {sending ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>

            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                  Contact Information
                </p>
                {[
                  { icon: Phone, text: '+91 96709 55055', sub: 'Mon–Sun, 6 AM – 10 PM', href: 'tel:+919670955055' },
                  { icon: Mail, text: 'support@pujahavan.com', sub: 'We respond within 24 hours', href: 'mailto:support@pujahavan.com' },
                  { icon: MapPin, text: 'Unit 603-604, 6th Floor, Tower B, Bhutani Alphathum, Sector 90, Noida, Gautam Buddha Nagar 201305, Uttar Pradesh', sub: 'NucleusAi Automation Pvt. Ltd. — Registered Office' },
                  { icon: Clock, text: '6:00 AM – 10:00 PM', sub: 'All days including holidays' },
                ].map(({ icon: Icon, text, sub, href }) => (
                  <div key={text} style={{ display: 'flex', gap: '0.9rem', marginBottom: '1rem' }}>
                    <div className="gold-icon-bg" style={{ width: '36px', height: '36px', flexShrink: 0 }}>
                      <Icon size={16} color="var(--gold)" />
                    </div>
                    <div>
                      {href ? (
                        <a href={href} style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-body)', fontWeight: 500, textDecoration: 'none' }}>{text}</a>
                      ) : (
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-body)', fontWeight: 500 }}>{text}</p>
                      )}
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919670955055"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  padding: '0.9rem',
                  backgroundColor: '#25D366',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.015 22l4.9-1.4A9.95 9.95 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.72 0-3.338-.489-4.705-1.336L4 20l1.368-3.236A7.956 7.956 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" fillRule="evenodd" clipRule="evenodd"/>
                </svg>
                Chat on WhatsApp
              </a>

              {/* Map placeholder */}
              <div style={{
                backgroundColor: 'var(--gold-bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                fontFamily: 'var(--font-body)',
                color: 'var(--text-muted)',
              }}>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--maroon)', fontSize: '0.85rem' }}>REGISTERED OFFICE</p>
                  📍 NucleusAi Automation Pvt. Ltd.<br />
                  Unit 603-604, 6th Floor, Tower B, Bhutani Alphathum,<br />
                  Sector 90, NEPZ Post Office, Noida,<br />
                  Gautam Buddha Nagar 201305, Uttar Pradesh
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </>
  )
}
