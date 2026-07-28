import React, { useState } from 'react'
import { submitLead } from '../../utils/leadsApi'

export default function HeroOptInForm() {
  // Consent must start UNCHECKED — DPDP Act s.6(1) requires a clear
  // affirmative action; a pre-ticked box is not valid consent.
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    interest: '',
    consent: false
  })

  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      await submitLead('enquiry', formData)
      setSubmitted(true)
      setFormData({ name: '', phone: '', interest: '', consent: false })
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 254, 250, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid var(--border-gold)',
        borderRadius: 'var(--radius-card)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-warm)',
        marginBottom: '1.5rem',
        maxWidth: '560px',
      }}
    >
      <p className="section-label" style={{ marginBottom: '1rem' }}>
        Get Free Vedic Consultation
      </p>

      {submitted ? (
        <div style={{ padding: '2rem 1rem', textAlign: 'center', backgroundColor: 'var(--gold-bg)', borderRadius: '8px', border: '1px solid var(--border-gold)' }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--saffron)', marginBottom: '0.5rem' }}>🙏 Thank You!</p>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)', fontSize: '0.95rem' }}>
            We&rsquo;ve received your request — our team will call you shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="optin-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div className="form-field">
              <label className="form-label" htmlFor="optin-name">Full Name</label>
              <input
                type="text"
                id="optin-name"
                required
                className="form-input"
                placeholder="Enter your name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="optin-phone">Phone Number</label>
              <input
                type="tel"
                id="optin-phone"
                required
                className="form-input"
                placeholder="WhatsApp number"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          
          <div className="optin-row" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'end', marginBottom: '1rem' }}>
            <div className="form-field">
              <label className="form-label" htmlFor="optin-interest">I am interested in</label>
              <select
                id="optin-interest"
                required
                className="form-input form-select"
                value={formData.interest}
                onChange={e => setFormData({ ...formData, interest: e.target.value })}
              >
                <option value="">Select an option</option>
                <option value="astrology">Kundli & Astrology</option>
                <option value="puja">Puja Services</option>
                <option value="vastu">Vastu Consultation</option>
                <option value="other">Other Inquiry</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={sending}
              style={{ height: '42px', padding: '0 1.5rem', whiteSpace: 'nowrap', opacity: sending ? 0.7 : 1, cursor: sending ? 'wait' : 'pointer' }}
            >
              {sending ? 'Sending…' : 'Request Callback'}
            </button>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              required
              checked={formData.consent}
              onChange={e => setFormData({ ...formData, consent: e.target.checked })}
              style={{ accentColor: 'var(--maroon)', cursor: 'pointer', width: '16px', height: '16px' }}
            />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              I agree to receive communication from Puja Havan via RCS, SMS, WhatsApp, Email, or Call. I understand I can opt out anytime.
            </span>
          </label>

          {error && (
            <p role="alert" style={{ marginTop: '0.75rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--maroon)', lineHeight: 1.5 }}>
              {error}
            </p>
          )}
        </form>
      )}

      <style>{`
        @media (max-width: 480px) {
          .optin-row {
            grid-template-columns: 1fr !important;
          }
          .optin-row .btn-primary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}
