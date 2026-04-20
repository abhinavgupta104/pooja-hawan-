import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import cities from '../../data/cities.json'

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Pandits', href: '/pandits' },
  { label: 'E-Puja', href: '/e-puja' },
  { label: 'Panchang', href: '/panchang' },
  { label: 'Shop', href: '/shop' },
  { label: 'Blog', href: '/blog' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState('Delhi')
  const [cityDropOpen, setCityDropOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          transition: 'all 0.3s ease',
          backgroundColor: scrolled ? 'rgba(253, 246, 236, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border-gold)' : '1px solid transparent',
          boxShadow: scrolled ? 'var(--shadow-warm)' : 'none',
        }}
      >
        <div className="container-max" style={{ display: 'flex', alignItems: 'center', height: '68px', gap: '1.5rem' }}>
          {/* Brand */}
          <Link
            to="/"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              color: 'var(--maroon)',
              textDecoration: 'none',
              fontWeight: 700,
              letterSpacing: '0.03em',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            🪔 Puja Havan
          </Link>

          {/* Center: City selector */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div
              style={{ position: 'relative' }}
              onMouseLeave={() => setCityDropOpen(false)}
            >
              <button
                onClick={() => setCityDropOpen(o => !o)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                  color: 'var(--text-body)',
                  background: 'var(--gold-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '0.45rem 0.9rem',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                📍 {selectedCity}
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {cityDropOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-hover)',
                  zIndex: 1000,
                  maxHeight: '280px',
                  overflowY: 'auto',
                  minWidth: '180px',
                }}>
                  {cities.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { setSelectedCity(c.name); setCityDropOpen(false) }}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 1rem',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.85rem',
                        color: selectedCity === c.name ? 'var(--saffron)' : 'var(--text-body)',
                        background: selectedCity === c.name ? 'var(--gold-bg)' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--gold-bg)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = selectedCity === c.name ? 'var(--gold-bg)' : 'transparent'}
                    >
                      {c.name}
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginLeft: '0.5rem' }}>{c.state}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="hidden-mobile">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                  color: 'var(--text-body)',
                  textDecoration: 'none',
                  fontWeight: 400,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--maroon)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-body)'}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            {/* WhatsApp */}
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#25D366',
                color: 'white',
                textDecoration: 'none',
                flexShrink: 0,
              }}
              title="Chat on WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.015 22l4.9-1.4A9.95 9.95 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.72 0-3.338-.489-4.705-1.336L4 20l1.368-3.236A7.956 7.956 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            </a>

            <Link to="/booking" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.55rem 1.2rem', display: 'none' }} id="cta-desktop">
              Book a Puja
            </Link>
            <Link to="/booking" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.55rem 1.2rem' }}>
              Book a Puja
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--text-body)',
              }}
              className="show-mobile"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sheet */}
      <div
        className={`mobile-sheet ${mobileOpen ? 'open' : ''}`}
        style={{ display: mobileOpen ? 'block' : 'none' }}
      >
        <div className="mobile-sheet-overlay" onClick={() => setMobileOpen(false)} />
        <div className="mobile-sheet-panel" style={{ display: 'block' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--maroon)' }}>
              🪔 Puja Havan
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={22} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  color: 'var(--text-body)',
                  textDecoration: 'none',
                  padding: '0.75rem 0.5rem',
                  borderBottom: '1px solid var(--border)',
                  display: 'block',
                  transition: 'color 0.2s',
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/about"
              onClick={() => setMobileOpen(false)}
              style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-body)', textDecoration: 'none', padding: '0.75rem 0.5rem', borderBottom: '1px solid var(--border)', display: 'block' }}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-body)', textDecoration: 'none', padding: '0.75rem 0.5rem', borderBottom: '1px solid var(--border)', display: 'block' }}
            >
              Contact
            </Link>
            <Link
              to="/pandit-registration"
              onClick={() => setMobileOpen(false)}
              style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-body)', textDecoration: 'none', padding: '0.75rem 0.5rem', borderBottom: '1px solid var(--border)', display: 'block' }}
            >
              Join as Pandit
            </Link>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/booking" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ justifyContent: 'center', textAlign: 'center' }}>
              Book a Puja
            </Link>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.65rem',
                backgroundColor: '#25D366',
                color: 'white',
                borderRadius: '4px',
                textDecoration: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
              }}
            >
              <Phone size={16} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </>
  )
}
