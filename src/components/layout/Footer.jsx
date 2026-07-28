import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { Phone, Mail, Clock, MapPin, ArrowRight } from 'lucide-react'
import MandalaBg from '../common/MandalaBg'

// Inline social SVGs (brand icons removed from lucide-react v1+)
const FacebookIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
const InstagramIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const YoutubeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#1F1108"/>
  </svg>
)

const SERVICES_LINKS = [
  { label: 'Satyanarayan Puja', href: '/service/satyanarayan-puja' },
  { label: 'Griha Pravesh', href: '/service/griha-pravesh' },
  { label: 'Ganesh Puja', href: '/service/ganesh-puja' },
  { label: 'Rudrabhishek', href: '/service/rudrabhishek' },
  { label: 'Navgraha Havan', href: '/service/navgraha-havan' },
  { label: 'Vivah Puja', href: '/service/vivah-puja' },
]

const QUICK_LINKS = [
  { label: 'Find a Pandit', href: '/pandits' },
  { label: 'Puja Services', href: '/puja' },
  { label: 'E-Puja (Online)', href: '/e-puja' },
  { label: 'Virtual Puja', href: '/virtual-puja' },
  { label: 'Daily Panchang', href: '/panchang' },
  { label: 'Samagri Shop', href: '/shop' },
]

// `to` = real internal route (rendered as a crawlable <Link>);
// items without `to` are upcoming and render as plain text (no dead links).
const SEO_LINKS = [
  { label: 'Pandits in Bangalore', to: '/pandits' },
  { label: 'Pandits in Delhi', to: '/pandits' },
  { label: 'Online Puja Booking', to: '/puja' },
  { label: 'Satyanarayan Puja', to: '/service/satyanarayan-puja' },
  { label: 'Griha Pravesh Puja', to: '/service/griha-pravesh' },
  { label: 'Pandits in Mumbai (Coming Soon)' },
  { label: 'Pandits in Hyderabad (Coming Soon)' },
  { label: 'Pandits in Chennai (Coming Soon)' },
]

const OFFICES = [
  {
    label: 'Registered Office',
    lines: [
      'NUCLEUSAI Automation Pvt. Ltd.',
      'Unit 603-604, 6th Floor, Tower B, Bhutani Alphathum',
      'Sector 90, NEPZ Post Office, Noida',
      'Gautam Buddha Nagar 201305, Uttar Pradesh',
    ],
  },
]

const headingStyle = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.72rem',
  letterSpacing: '0.24em',
  textTransform: 'uppercase',
  color: 'var(--gold-light)',
  fontWeight: 600,
  marginBottom: '1.4rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
}

const HeadingRule = () => (
  <span aria-hidden style={{ width: '22px', height: '1px', background: 'linear-gradient(90deg, var(--gold), transparent)', display: 'inline-block' }} />
)

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="footer-link"
      style={{
        color: 'rgba(248, 239, 220, 0.6)',
        textDecoration: 'none',
        fontSize: '0.93rem',
        display: 'inline-block',
        transition: 'color 0.25s ease, transform 0.25s ease',
      }}
    >
      {children}
    </Link>
  )
}

export default function Footer() {
  return (
    <footer
      id="footer"
      style={{
        background:
          'radial-gradient(1000px 420px at 85% 0%, rgba(184, 137, 46, 0.12) 0%, transparent 60%), ' +
          'linear-gradient(180deg, #241407 0%, var(--bg-dark) 45%, #170C04 100%)',
        color: 'rgba(248, 239, 220, 0.75)',
        fontFamily: 'var(--font-body)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gold hairline across the very top */}
      <div aria-hidden style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, var(--gold) 50%, transparent 100%)', opacity: 0.7 }} />

      {/* Decorative mandala */}
      <div style={{ position: 'absolute', top: '-120px', right: '-140px', opacity: 0.05, pointerEvents: 'none' }}>
        <MandalaBg size={640} />
      </div>

      {/* ── Top CTA strip ─────────────────────────────── */}
      <div style={{ borderBottom: '1px solid rgba(223, 190, 106, 0.14)', padding: '3.25rem 0', position: 'relative', zIndex: 1 }}>
        <div className="container-max footer-cta-strip" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ maxWidth: '560px' }}>
            <p style={{ ...headingStyle, marginBottom: '0.8rem' }}>
              <HeadingRule /> Begin Your Sacred Journey
            </p>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.7rem, 3vw, 2.3rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.015em',
                color: '#FAF3E3',
                fontWeight: 480,
                marginBottom: '0.6rem',
              }}
            >
              Ready to seek <em style={{ fontStyle: 'italic', color: 'var(--gold-light)', fontWeight: 440 }}>divine blessings?</em>
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'rgba(248, 239, 220, 0.55)', lineHeight: 1.7 }}>
              Connect with India's most trusted Vedic scholars and pandits instantly.
            </p>
          </div>
          <Link to="/booking" className="btn-primary" style={{ flexShrink: 0, padding: '1rem 2.4rem', fontSize: '1rem' }}>
            Book a Puja Now <ArrowRight size={17} />
          </Link>
        </div>
      </div>

      {/* ── Main columns ─────────────────────────────── */}
      <div
        className="container-max footer-grid"
        style={{ padding: '4.5rem 2rem 4rem', display: 'grid', gap: '3.5rem', position: 'relative', zIndex: 1 }}
      >
        {/* Col 1: Brand */}
        <div className="footer-col-1">
          <Link to="/" style={{ display: 'inline-block', marginBottom: '1.4rem' }} aria-label="Puja Havan — Home">
            <img
              src={logo}
              alt="Puja Havan"
              style={{
                height: '60px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                filter: 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(5deg)',
              }}
            />
          </Link>
          <p
            style={{
              fontFamily: 'var(--font-deva)',
              fontSize: '1rem',
              color: 'var(--gold-light)',
              opacity: 0.85,
              marginBottom: '1rem',
              letterSpacing: '0.05em',
            }}
          >
            ॥ शुभं भवतु ॥
          </p>
          <p style={{ fontSize: '0.93rem', color: 'rgba(248, 239, 220, 0.55)', lineHeight: 1.85, marginBottom: '2rem', maxWidth: '360px' }}>
            Elevating your spiritual journey through authentic Vedic rituals.
            We connect families with certified Jyotishacharyas and experienced
            pandits, so every ceremony is performed with devotion and precision.
          </p>

          <div style={{ display: 'flex', gap: '0.8rem' }}>
            {[
              { icon: FacebookIcon, href: '#', label: 'Facebook' },
              { icon: InstagramIcon, href: '#', label: 'Instagram' },
              { icon: YoutubeIcon, href: '#', label: 'YouTube' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="footer-social"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(223, 190, 106, 0.07)',
                  border: '1px solid rgba(223, 190, 106, 0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-muted)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 style={headingStyle}><HeadingRule /> Explore</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {QUICK_LINKS.map(l => (
              <li key={l.href}><FooterLink to={l.href}>{l.label}</FooterLink></li>
            ))}
          </ul>
        </div>

        {/* Col 3: Popular Services */}
        <div>
          <h4 style={headingStyle}><HeadingRule /> Popular Pujas</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {SERVICES_LINKS.map(l => (
              <li key={l.href}><FooterLink to={l.href}>{l.label}</FooterLink></li>
            ))}
          </ul>
        </div>

        {/* Col 4: Contact */}
        <div>
          <h4 style={headingStyle}><HeadingRule /> Reach Us</h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', marginBottom: '1.5rem' }}>
            {OFFICES.map(office => (
              <div key={office.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.88rem', lineHeight: 1.6 }}>
                <MapPin size={16} color="var(--gold-muted)" style={{ marginTop: '3px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 600, color: 'rgba(248, 239, 220, 0.85)', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.15rem' }}>
                    {office.label}
                  </p>
                  <span style={{ color: 'rgba(248, 239, 220, 0.5)' }}>
                    {office.lines.map((line, i) => (
                      <React.Fragment key={i}>{line}{i < office.lines.length - 1 && <br />}</React.Fragment>
                    ))}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(223, 190, 106, 0.12)' }}>
            <a href="tel:+919670955055" className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', color: 'rgba(248, 239, 220, 0.7)', textDecoration: 'none', fontSize: '0.93rem', transition: 'color 0.25s ease' }}>
              <Phone size={15} color="var(--gold-muted)" /> +91 96709 55055
            </a>
            <a href="mailto:support@pujahavan.com" className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', color: 'rgba(248, 239, 220, 0.7)', textDecoration: 'none', fontSize: '0.93rem', transition: 'color 0.25s ease' }}>
              <Mail size={15} color="var(--gold-muted)" /> support@pujahavan.com
            </a>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '0.9rem', color: 'rgba(248, 239, 220, 0.5)', margin: 0 }}>
              <Clock size={15} color="var(--gold-muted)" /> Mon–Sun, 6:00 AM – 10:00 PM
            </p>
          </div>

          <div
            style={{
              marginTop: '1.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(223, 190, 106, 0.06)',
              border: '1px solid rgba(223, 190, 106, 0.16)',
              borderRadius: '999px',
              padding: '0.45rem 1.1rem',
              fontSize: '0.78rem',
              color: 'rgba(248, 239, 220, 0.55)',
            }}
          >
            🔒 Secured &amp; Powered by Razorpay
          </div>
        </div>
      </div>

      {/* ── SEO links ─────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(223, 190, 106, 0.1)', background: 'rgba(0, 0, 0, 0.22)', padding: '1.4rem 0', position: 'relative', zIndex: 1 }}>
        <div className="container-max">
          <p style={{ fontSize: '0.78rem', lineHeight: 2.1, textAlign: 'center', margin: 0 }}>
            {SEO_LINKS.map((item, i) => (
              <React.Fragment key={item.label}>
                {item.to ? (
                  <Link to={item.to} className="footer-seo-link" style={{ color: 'rgba(205, 175, 116, 0.6)', textDecoration: 'none', transition: 'color 0.2s' }}>
                    {item.label}
                  </Link>
                ) : (
                  <span style={{ color: 'rgba(205, 175, 116, 0.45)' }}>{item.label}</span>
                )}
                {i < SEO_LINKS.length - 1 && <span style={{ margin: '0 0.75rem', color: 'rgba(223, 190, 106, 0.18)' }}>·</span>}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>

      {/* ── Bottom bar ─────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(223, 190, 106, 0.08)', padding: '1.4rem 0', backgroundColor: '#140A03', position: 'relative', zIndex: 1 }}>
        <div className="container-max footer-bottom-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.83rem', color: 'rgba(248, 239, 220, 0.35)', margin: 0, lineHeight: 1.7 }}>
            © {new Date().getFullYear()} Puja Havan. All rights reserved. &nbsp;·&nbsp; Crafted with 🪔 in India
            <br />
            A brand of <strong style={{ color: 'rgba(248, 239, 220, 0.5)', fontWeight: 600 }}>NucleusAi Automation Pvt. Ltd.</strong>
          </p>
          <div className="footer-bottom-links" style={{ display: 'flex', gap: '1.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Privacy Policy', to: '/privacy-policy' },
              { label: 'Terms of Service', to: '/terms-of-service' },
              { label: 'Refund Policy', to: '/refund-policy' },
              { label: 'Cookie Policy', to: '/cookie-policy' },
              { label: 'Responsible Disclosure', to: '/responsible-disclosure' },
            ].map(({ label, to }) => (
              <Link key={to} to={to} className="footer-seo-link" style={{ fontSize: '0.83rem', color: 'rgba(248, 239, 220, 0.38)', textDecoration: 'none', transition: 'color 0.2s' }}>
                {label}
              </Link>
            ))}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              title="Back to top"
              aria-label="Back to top"
              className="footer-social"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid rgba(223, 190, 106, 0.3)',
                backgroundColor: 'rgba(223, 190, 106, 0.07)',
                color: 'var(--gold-muted)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                flexShrink: 0,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .footer-grid {
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }
        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1.7fr 0.9fr 0.9fr 1.5fr !important;
          }
          .footer-col-1 {
            padding-right: 2rem;
          }
        }
        .footer-link:hover {
          color: var(--gold-light) !important;
          transform: translateX(4px);
        }
        .footer-seo-link:hover {
          color: var(--gold-light) !important;
        }
        .footer-social:hover {
          background-color: var(--gold) !important;
          color: #1F1108 !important;
          transform: translateY(-3px);
        }
      `}</style>
    </footer>
  )
}
