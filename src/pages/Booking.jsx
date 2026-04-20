import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'
import servicesData from '../data/services.json'
import citiesData from '../data/cities.json'
import { ChevronRight, CheckCircle2 } from 'lucide-react'

const STEPS = ['Select Puja', 'Your Location', 'Your Details', 'Review & Pay']

const step1Schema = z.object({
  pujaId: z.string().min(1, 'Please select a puja'),
  variant: z.enum(['Basic', 'Standard', 'Premium']),
})

const step2Schema = z.object({
  city: z.string().min(1, 'Please select a city'),
  address: z.string().min(10, 'Please enter your full address'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  language: z.string().min(1, 'Please select a language'),
})

const step3Schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().length(10, 'Enter valid 10-digit phone number'),
  email: z.string().email('Enter a valid email'),
  instructions: z.string().optional(),
})

export default function Booking() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const { register: reg1, handleSubmit: hs1, formState: { errors: e1 } } = useForm({ resolver: zodResolver(step1Schema), defaultValues: formData })
  const { register: reg2, handleSubmit: hs2, formState: { errors: e2 } } = useForm({ resolver: zodResolver(step2Schema), defaultValues: formData })
  const { register: reg3, handleSubmit: hs3, formState: { errors: e3 } } = useForm({ resolver: zodResolver(step3Schema), defaultValues: formData })

  const onStep1 = (data) => { setFormData(d => ({ ...d, ...data })); setStep(2) }
  const onStep2 = (data) => { setFormData(d => ({ ...d, ...data })); setStep(3) }
  const onStep3 = (data) => { setFormData(d => ({ ...d, ...data })); setStep(4) }
  const onConfirm = () => {
    console.log('Booking data:', formData)
    setSubmitted(true)
  }

  const selectedPuja = servicesData.find(s => s.id === formData.pujaId)
  const price = selectedPuja ? Math.round(selectedPuja.startingPrice * ({ Basic: 1, Standard: 1.5, Premium: 2 }[formData.variant] || 1)) : 0

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px', minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
        {submitted ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <CheckCircle2 size={64} color="var(--gold)" style={{ margin: '0 auto 1.5rem' }} />
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                Booking Confirmed!
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)', marginBottom: '0.5rem' }}>
                Your puja has been booked. You'll receive a WhatsApp confirmation shortly.
              </p>
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                Booking ID: PH{Math.floor(100000 + Math.random() * 900000)}
              </p>
              <Link to="/" className="btn-primary">Back to Home</Link>
            </div>
          </div>
        ) : (
          <div className="container-max" style={{ padding: '3rem 2rem' }}>
            {/* Progress bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem', gap: '0.5rem' }}>
              {STEPS.map((label, i) => {
                const stepNum = i + 1
                const isActive = step === stepNum
                const isCompleted = step > stepNum
                return (
                  <React.Fragment key={label}>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        className={`step-dot ${isActive ? 'active' : isCompleted ? 'completed' : ''}`}
                        style={{ margin: '0 auto 0.4rem' }}
                      >
                        {isCompleted ? '✓' : stepNum}
                      </div>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', color: isActive ? 'var(--saffron)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {label}
                      </p>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{ width: '60px', height: '1px', backgroundColor: 'var(--border)', marginBottom: '1.25rem', flexShrink: 0 }} />
                    )}
                  </React.Fragment>
                )
              })}
            </div>

            <div style={{ maxWidth: '560px', margin: '0 auto' }}>
              {/* Step 1 */}
              {step === 1 && (
                <form onSubmit={hs1(onStep1)}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                    Select Your Puja
                  </h2>
                  <div className="form-field" style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label" htmlFor="pujaId">Puja Type *</label>
                    <select id="pujaId" className="form-input form-select" {...reg1('pujaId')}>
                      <option value="">-- Select Puja --</option>
                      {servicesData.map(s => (
                        <option key={s.id} value={s.id}>{s.name} — from ₹{s.startingPrice.toLocaleString('en-IN')}</option>
                      ))}
                    </select>
                    {e1.pujaId && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{e1.pujaId.message}</p>}
                  </div>

                  <div className="form-field" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Package *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '0.25rem' }}>
                      {['Basic', 'Standard', 'Premium'].map(v => (
                        <label key={v} style={{ cursor: 'pointer' }}>
                          <input type="radio" value={v} {...reg1('variant')} style={{ display: 'none' }} />
                          <div style={{
                            padding: '0.75rem',
                            border: '1.5px solid var(--border)',
                            borderRadius: '6px',
                            textAlign: 'center',
                            fontSize: '0.85rem',
                            fontFamily: 'var(--font-body)',
                            fontWeight: 500,
                            color: 'var(--maroon)',
                            backgroundColor: 'var(--bg-card)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}>
                            {v}
                          </div>
                        </label>
                      ))}
                    </div>
                    {e1.variant && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{e1.variant.message}</p>}
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Continue <ChevronRight size={16} />
                  </button>
                </form>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <form onSubmit={hs2(onStep2)}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                    Location &amp; Schedule
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-field">
                      <label className="form-label">City *</label>
                      <select className="form-input form-select" {...reg2('city')}>
                        <option value="">Select City</option>
                        {citiesData.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                      {e2.city && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{e2.city.message}</p>}
                    </div>
                    <div className="form-field">
                      <label className="form-label">Language Preference *</label>
                      <select className="form-input form-select" {...reg2('language')}>
                        <option value="">Select Language</option>
                        {['Hindi', 'Tamil', 'Telugu', 'Kannada', 'Marathi', 'Bengali', 'Gujarati'].map(l => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                      {e2.language && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{e2.language.message}</p>}
                    </div>
                  </div>
                  <div className="form-field" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Full Address *</label>
                    <textarea className="form-input" rows={3} placeholder="House no., Street, Area, Locality" {...reg2('address')} style={{ resize: 'vertical' }} />
                    {e2.address && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{e2.address.message}</p>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div className="form-field">
                      <label className="form-label">Date *</label>
                      <input type="date" className="form-input" min={new Date().toISOString().split('T')[0]} {...reg2('date')} />
                      {e2.date && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{e2.date.message}</p>}
                    </div>
                    <div className="form-field">
                      <label className="form-label">Preferred Time *</label>
                      <select className="form-input form-select" {...reg2('time')}>
                        <option value="">Select Time</option>
                        {['6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      {e2.time && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{e2.time.message}</p>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="button" onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>← Back</button>
                    <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Continue <ChevronRight size={16} /></button>
                  </div>
                </form>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <form onSubmit={hs3(onStep3)}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                    Your Details
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-field">
                      <label className="form-label">Full Name *</label>
                      <input className="form-input" placeholder="Your name" {...reg3('name')} />
                      {e3.name && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{e3.name.message}</p>}
                    </div>
                    <div className="form-field">
                      <label className="form-label">Phone Number *</label>
                      <input className="form-input" placeholder="10-digit mobile number" maxLength={10} {...reg3('phone')} />
                      {e3.phone && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{e3.phone.message}</p>}
                    </div>
                  </div>
                  <div className="form-field" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Email Address *</label>
                    <input type="email" className="form-input" placeholder="your@email.com" {...reg3('email')} />
                    {e3.email && <p style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{e3.email.message}</p>}
                  </div>
                  <div className="form-field" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Special Instructions (optional)</label>
                    <textarea className="form-input" rows={3} placeholder="Any specific requirements, family tradition notes..." {...reg3('instructions')} style={{ resize: 'vertical' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="button" onClick={() => setStep(2)} className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>← Back</button>
                    <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Review Booking <ChevronRight size={16} /></button>
                  </div>
                </form>
              )}

              {/* Step 4 — Review */}
              {step === 4 && (
                <div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                    Review &amp; Confirm
                  </h2>
                  <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                    {selectedPuja && (
                      <>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--maroon)', marginBottom: '1rem' }}>
                          {selectedPuja.name} — {formData.variant} Package
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {[
                            ['City', formData.city],
                            ['Date', formData.date],
                            ['Time', formData.time],
                            ['Language', formData.language],
                            ['Name', formData.name],
                            ['Phone', formData.phone],
                            ['Email', formData.email],
                          ].map(([label, value]) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontFamily: 'var(--font-body)' }}>
                              <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                              <span style={{ color: 'var(--text-body)', fontWeight: 500 }}>{value}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ borderTop: '1px solid var(--border)', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)', fontSize: '0.9rem' }}>Total Amount</span>
                          <span style={{ fontFamily: 'var(--font-cinzel-dec)', fontSize: '1.5rem', color: 'var(--saffron)' }}>
                            ₹{price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                    By confirming, you agree to our Terms of Service and Refund Policy. Payment will be processed by Razorpay.
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => setStep(3)} className="btn-secondary" style={{ flex: '0 0 auto' }}>← Edit</button>
                    <button onClick={onConfirm} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                      🔒 Confirm &amp; Pay ₹{price.toLocaleString('en-IN')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
