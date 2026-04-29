import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { Phone, Mail, Clock, MapPin, ChevronRight } from 'lucide-react'
import MandalaBg from '../common/MandalaBg'

// Inline social SVGs (brand icons removed from lucide-react v1+)
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
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
  { label: 'E-Puja (Online)', href: '/e-puja' },
  { label: 'Daily Panchang', href: '/panchang' },
  { label: 'Samagri Shop', href: '/shop' },
  { label: 'Vedic Blog', href: '/blog' },
  { label: 'Join as Pandit', href: '/pandit-registration' },
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
    <footer id="footer" style={{ 
      backgroundColor: 'var(--bg-dark)', 
      color: 'rgba(255,255,255,0.8)', 
      fontFamily: 'var(--font-body)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Decorative Background */}
      <div style={{ position: 'absolute', top: 0, right: '-10%', opacity: 0.05, pointerEvents: 'none' }}>
        <MandalaBg size={600} />
      </div>

      {/* Top CTA strip */}
      <div style={{ 
        background: 'linear-gradient(90deg, rgba(201,168,76,0.05) 0%, rgba(201,168,76,0.15) 50%, rgba(201,168,76,0.05) 100%)',
        borderBottom: '1px solid rgba(201,168,76,0.2)', 
        padding: '2.5rem 0' 
      }}>
        <div className="container-max" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--gold)', marginBottom: '0.4rem', fontWeight: 600 }}>
              Ready to seek divine blessings?
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>
              Connect with India's most trusted Vedic scholars and pandits instantly.
            </p>
          </div>
          <Link to="/booking" className="btn-primary" style={{ flexShrink: 0, padding: '1rem 2.5rem', fontSize: '1.05rem', boxShadow: '0 4px 15px rgba(201,168,76,0.3)' }}>
            Book a Puja Now →
          </Link>
        </div>
      </div>

      {/* Main columns */}
      <div className="container-max footer-grid" style={{ 
        padding: '5rem 2rem 4rem', 
        display: 'grid', 
        gap: '4rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Col 1: Brand & About */}
        <div className="footer-col-1">
          <Link to="/" style={{ display: 'inline-block', marginBottom: '1.25rem' }} aria-label="Puja Havan — Home">
            <img
              src={logo}
              alt="Puja Havan"
              style={{
                height: '64px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                filter: 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(5deg)',
              }}
            />
          </Link>
          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: '2rem', maxWidth: '380px' }}>
            Elevating your spiritual journey through authentic Vedic rituals. We connect families with certified Jyotishacharyas and experienced pandits to ensure your ceremonies are performed with utmost devotion and precision.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
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
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(201,168,76,0.08)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-muted)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => { 
                  e.currentTarget.style.backgroundColor = 'var(--gold)'; 
                  e.currentTarget.style.color = 'var(--bg-dark)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => { 
                  e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.08)'; 
                  e.currentTarget.style.color = 'var(--gold-muted)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--gold)', marginBottom: '1.5rem', fontWeight: 600 }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {QUICK_LINKS.map(l => (
              <li key={l.href}>
                <Link
                  to={l.href}
                  style={{ 
                    color: 'rgba(255,255,255,0.65)', 
                    textDecoration: 'none', 
                    fontSize: '0.95rem', 
                    transition: 'color 0.2s, transform 0.2s',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.transform = 'translateX(5px)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.transform = 'translateX(0)' }}
                >
                  <ChevronRight size={14} style={{ opacity: 0.5 }} /> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Popular Pujas */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--gold)', marginBottom: '1.5rem', fontWeight: 600 }}>
            Popular Services
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {SERVICES_LINKS.map(l => (
              <li key={l.href}>
                <Link
                  to={l.href}
                  style={{ 
                    color: 'rgba(255,255,255,0.65)', 
                    textDecoration: 'none', 
                    fontSize: '0.95rem', 
                    transition: 'color 0.2s, transform 0.2s',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.transform = 'translateX(5px)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.transform = 'translateX(0)' }}
                >
                  <ChevronRight size={14} style={{ opacity: 0.5 }} /> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Contact Us */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--gold)', marginBottom: '1.5rem', fontWeight: 600 }}>
            Contact Us
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              <MapPin size={18} color="var(--gold)" style={{ marginTop: '2px', flexShrink: 0 }} /> 
              <div>
                <p style={{ fontWeight: 600, color: 'var(--gold)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>SOUTH INDIA OFFICE</p>
                <span>119/2 CK Nagar, Parappana Agrahara<br/>Bengaluru, Karnataka 560100</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              <MapPin size={18} color="var(--gold)" style={{ marginTop: '2px', flexShrink: 0 }} /> 
              <div>
                <p style={{ fontWeight: 600, color: 'var(--gold)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>NORTH INDIA OFFICE</p>
                <span>D-9, Vyapar Marg, Sector 3<br/>Noida, Uttar Pradesh 201301</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>
              <Phone size={18} color="var(--gold)" style={{ flexShrink: 0 }} /> +91 99999 99999
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>
              <Mail size={18} color="var(--gold)" style={{ flexShrink: 0 }} /> support@pujahavan.com
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>
              <Clock size={18} color="var(--gold)" style={{ flexShrink: 0 }} /> Mon–Sun, 6:00 AM – 10:00 PM
            </div>
          </div>
          
          <div style={{
            marginTop: '2rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.5)',
          }}>
            🔒 Secured & Powered by Razorpay
          </div>
        </div>
      </div>

      {/* SEO links */}
      <div style={{ 
        borderTop: '1px solid rgba(201,168,76,0.15)', 
        background: 'rgba(0,0,0,0.2)',
        padding: '1.5rem 0' 
      }}>
        <div className="container-max">
          <p style={{ fontSize: '0.8rem', color: 'var(--gold-muted)', lineHeight: 2, textAlign: 'center' }}>
            {SEO_LINKS.map((text, i) => (
              <React.Fragment key={text}>
                <a
                  href="#"
                  style={{ color: 'var(--gold-muted)', textDecoration: 'none', transition: 'color 0.2s', opacity: 0.8 }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--gold-muted)'}
                >
                  {text}
                </a>
                {i < SEO_LINKS.length - 1 && <span style={{ margin: '0 0.8rem', opacity: 0.2 }}>|</span>}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ 
        borderTop: '1px solid rgba(201,168,76,0.1)', 
        padding: '1.5rem 0',
        backgroundColor: '#111'
      }}>
        <div className="container-max" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} Puja Havan. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(text => (
              <a
                key={text}
                href="#"
                style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--gold-muted)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              >
                {text}
              </a>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        .footer-grid {
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }
        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr 1.5fr !important;
          }
          .footer-col-1 {
            padding-right: 2rem;
          }
        }
      `}</style>
    </footer>
  )
}
