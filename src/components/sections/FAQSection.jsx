import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import SectionLabel from '../common/SectionLabel'

export const FAQS = [
  {
    q: 'How do I book a pandit?',
    a: 'Simply select your puja type and city on our homepage, choose a date, and click "Find Pandit". Browse available pandits, view their profiles, and book instantly online. You\'ll receive a WhatsApp confirmation within minutes.',
  },
  {
    q: 'Are all the pandits verified?',
    a: 'Yes. Every pandit on our platform is verified before being listed — we check government-issued photo ID, confirm their Vedic academic credentials, and review their experience and references before approving them.',
  },
  {
    q: 'What if I need a pandit who speaks my language?',
    a: 'We have pandits fluent in Hindi, Tamil, Telugu, Kannada, Marathi, Bengali, Gujarati, Bihari (Bhojpuri), and Maithili. Use our "Find by Language" filter to find pandit who performs rituals in your mother tongue.',
  },
  {
    q: 'Is the puja samagri included in the price?',
    a: 'It depends on the package you choose. Our Standard and Premium packages include all necessary samagri (ritual materials). The Basic package requires you to arrange your own samagri, though we provide a detailed list. You can also order samagri separately from our shop.',
  },
  {
    q: 'Can I book a pandit for the same day?',
    a: 'Yes! We offer same-day bookings (subject to availability). Bookings made before 10 AM usually get confirmed for same-day. You can also check real-time availability of pandits in your city on the Pandits page.',
  },
  {
    q: 'How does the puja work?',
    a: 'After booking a puja, we arrange delivery of a samagri kit to your home 1–2 days before the puja. On the day, the pandit connects via a live video call (WhatsApp or Zoom). You participate from wherever you are while the pandit guides you through the ceremony. These pujas are perfect for NRIs and families separated by distance.',
  },
  {
    q: 'What is your cancellation and refund policy?',
    a: 'Cancellations made 24+ hours before the puja receive a 100% refund. Cancellations within 12–24 hours receive a 50% refund. Cancellations within 12 hours are non-refundable unless the pandit fails to arrive. If the pandit doesn\'t arrive, you receive a 100% refund plus a ₹200 credit.',
  },
  {
    q: 'Do you serve my city?',
    a: 'We currently serve 50+ cities across India, including all metro cities and major Tier 2 cities. Our Cities page has the full list. If your city isn\'t listed, contact us via WhatsApp — we may be able to arrange a pandit for you through our network.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section style={{ backgroundColor: 'var(--bg-section-alt)', padding: '5rem 0' }}>
      <div className="container-max">
        <SectionLabel>FAQ</SectionLabel>
        <h2 className="section-heading" style={{ marginBottom: '2.5rem' }}>
          Common Questions
        </h2>

        <div style={{ maxWidth: '780px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: `1px solid ${isOpen ? 'var(--border-gold)' : 'var(--border)'}`,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease',
                  boxShadow: isOpen ? 'var(--shadow-card)' : 'none',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: '1rem',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.95rem',
                    color: isOpen ? 'var(--maroon)' : 'var(--text-primary)',
                    fontWeight: 400,
                    flex: 1,
                    lineHeight: 1.4,
                  }}>
                    {faq.q}
                  </span>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: isOpen ? 'var(--gold-bg)' : 'transparent',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: isOpen ? 'var(--gold)' : 'var(--text-muted)',
                    transition: 'all 0.2s',
                  }}>
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 1.5rem 1.25rem',
                    animation: 'fadeIn 0.2s ease',
                  }}>
                    <div style={{ height: '1px', backgroundColor: 'var(--border)', marginBottom: '1rem' }} />
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem',
                      color: 'var(--text-body)',
                      lineHeight: 1.8,
                    }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
