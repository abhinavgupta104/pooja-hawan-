import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { Phone, Mail, Clock } from 'lucide-react'

// Inline social SVGs (brand icons removed from lucide-react v1+)
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
)

const SERVICES_LINKS = [
  { label: 'Satyanarayan Puja', href: '/service/satyanarayan-puja' },
  { label: 'Griha Pravesh', href: '/service/griha-pravesh' },
  { label: 'Ganesh Puja', href: '/service/ganesh-puja' },
  { label: 'Rudrabhishek', href: '/service/rudrabhishek' },
  { label: 'Navgraha Havan', href: '/service/navgraha-havan' },
  { label: 'Lakshmi Puja', href: '/service/lakshmi-puja' },
  { label: 'Mahamrityunjay Jaap', href: '/service/mahamrityunjay-jaap' },
  { label: 'Kaal Sarp Dosh', href: '/service/kaal-sarp-dosh' },
  { label: 'Vivah Puja', href: '/service/vivah-puja' },
  { label: 'Durga Puja', href: '/service/durga-puja' },
  { label: 'Diwali Puja', href: '/service/diwali-puja' },
  { label: 'Vastu Shanti', href: '/service/vastu-shanti' },
]

const QUICK_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Find a Pandit', href: '/pandits' },
  { label: 'E-Puja (Online)', href: '/e-puja' },
  { label: 'Panchang', href: '/panchang' },
  { label: 'Samagri Shop', href: '/shop' },
  { label: 'Blog', href: '/blog' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Pandit Registration', href: '/pandit-registration' },
]

const SEO_LINKS = [
  'Hindi Pandits in Bangalore',
  'Telugu Pandits in Hyderabad',
  'Tamil Pandits in Chennai',
  'Marathi Pandits in Mumbai',
  'Bengali Pandits in Kolkata',
  'Gujarati Pandits in Ahmedabad',
  'Pandits in Delhi',
  'Pandits in Pune',
  'Online Puja Booking',
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--bg-dark)', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)' }}>
      {/* Top CTA strip */}
      <div style={{ borderBottom: '1px solid rgba(201,168,76,0.2)', padding: '1.75rem 0' }}>
        <div className="container-max" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'white', marginBottom: '0.25rem' }}>
              Ready to perform your puja?
            </p>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
              Book a verified pandit in your city within minutes.
            </p>
          </div>
          <Link to="/booking" className="btn-primary" style={{ flexShrink: 0 }}>
            Book a Puja Now →
          </Link>
        </div>
      </div>

      {/* Main columns */}
      <div className="container-max" style={{ padding: '3rem 2rem', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '3rem' }}>
        {/* Col 1 */}
        <div>
          <Link to="/" style={{ display: 'inline-block', marginBottom: '0.75rem' }} aria-label="Puja Havan — Home">
            <img
              src={logo}
              alt="Puja Havan"
              style={{
                height: '56px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                filter: 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(5deg)',
              }}
            />
          </Link>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: '1.5rem', maxWidth: '320px' }}>
            India's most trusted platform for booking verified, experienced pandits across 50+ cities. Traditional rituals, modern accessibility.
          </p>
          {/* Razorpay badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '6px',
            padding: '0.4rem 0.9rem',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '1.5rem',
          }}>
            🔒 Secured & Powered by Razorpay
          </div>
          {/* Social icons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[
              { icon: FacebookIcon, href: '#', label: 'Facebook' },
              { icon: InstagramIcon, href: '#', label: 'Instagram' },
              { icon: YoutubeIcon, href: '#', label: 'YouTube' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(201,168,76,0.15)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-muted)',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--bg-dark)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.15)'; e.currentTarget.style.color = 'var(--gold-muted)' }}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            Quick Links
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {QUICK_LINKS.map(l => (
              <li key={l.href}>
                <Link
                  to={l.href}
                  style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            Popular Pujas
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
            {SERVICES_LINKS.map(l => (
              <li key={l.href}>
                <Link
                  to={l.href}
                  style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Contact Us
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
              <Phone size={14} color="var(--gold-muted)" /> +91 99999 99999
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
              <Mail size={14} color="var(--gold-muted)" /> support@pujahavan.com
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
              <Clock size={14} color="var(--gold-muted)" /> Mon–Sun, 6 AM – 10 PM
            </div>
          </div>
        </div>
      </div>

      {/* SEO links */}
      <div style={{ borderTop: '1px solid rgba(201,168,76,0.15)', padding: '1rem 0' }}>
        <div className="container-max">
          <p style={{ fontSize: '0.72rem', color: 'var(--gold-muted)', lineHeight: 2 }}>
            {SEO_LINKS.map((text, i) => (
              <React.Fragment key={text}>
                <a
                  href="#"
                  style={{ color: 'var(--gold-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--gold-muted)'}
                >
                  {text}
                </a>
                {i < SEO_LINKS.length - 1 && <span style={{ margin: '0 0.5rem', opacity: 0.4 }}>|</span>}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(201,168,76,0.1)', padding: '1.25rem 0' }}>
        <div className="container-max" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
            © 2026 Puja Havan. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(text => (
              <a
                key={text}
                href="#"
                style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--gold-muted)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              >
                {text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
