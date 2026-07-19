import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Phone, ChevronDown, MapPin } from 'lucide-react'
import logo from '../../assets/logo.png'
import cities from '../../data/cities.json'

// Primary links always visible in desktop nav
const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Puja', href: '/puja' },
  { label: 'E-Puja', href: '/e-puja' },
  { label: 'Shop', href: '/shop' },
]

// Grouped under a "Tools" dropdown to reduce crowding
const TOOLS_LINKS = [
  { label: 'Panchang', href: '/panchang', icon: '📅' },
  { label: 'Numerology', href: '/numerology', icon: '🔢' },
  { label: 'Kundali', href: '/kundali', icon: '♈' },
  { label: 'Virtual Puja', href: '/virtual-puja', icon: '👓' },
]

// All links for mobile sheet
const ALL_MOBILE_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Puja', href: '/puja' },
  { label: 'E-Puja', href: '/e-puja' },
  { label: 'Virtual Puja', href: '/virtual-puja' },
  { label: 'Panchang', href: '/panchang' },
  { label: 'Numerology', href: '/numerology' },
  { label: 'Kundali', href: '/kundali' },
  { label: 'Shop', href: '/shop' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState('Delhi')
  const [cityDropOpen, setCityDropOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const cityDropRef = useRef(null)
  const toolsDropRef = useRef(null)
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

  // Close city dropdown when clicking outside
  useEffect(() => {
    if (!cityDropOpen) return
    const handleClickOutside = (e) => {
      if (cityDropRef.current && !cityDropRef.current.contains(e.target)) {
        setCityDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [cityDropOpen])

  // Close tools dropdown when clicking outside
  useEffect(() => {
    if (!toolsOpen) return
    const handleClickOutside = (e) => {
      if (toolsDropRef.current && !toolsDropRef.current.contains(e.target)) {
        setToolsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [toolsOpen])

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
          {/* Brand Logo */}
          <Link
            to="/"
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
            aria-label="Puja Havan — Home"
          >
            <img
              src={logo}
              alt="Puja Havan Logo"
              style={{
                height: '48px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </Link>

          {/* Center: City selector */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }} className="hidden-mobile">
            <div
              ref={cityDropRef}
              style={{ position: 'relative' }}
            >
              <button
                onClick={() => setCityDropOpen(o => !o)}
                aria-haspopup="true"
                aria-expanded={cityDropOpen}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  background: 'rgba(255,253,247,0.95)',
                  border: cityDropOpen ? '1px solid var(--gold)' : '1px solid var(--border)',
                  borderRadius: '100px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(44,21,3,0.1)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--gold)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(44,21,3,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = cityDropOpen ? 'var(--gold)' : 'var(--border)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(44,21,3,0.1)';
                }}
              >
                <MapPin size={15} color="var(--saffron)" />
                <span style={{ color: 'var(--text-primary)' }}>{selectedCity}</span>
                <ChevronDown 
                  size={13} 
                  color="var(--text-muted)" 
                  style={{ 
                    transition: 'transform 0.25s ease',
                    transform: cityDropOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }} 
                />
              </button>

              {cityDropOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-hover)',
                  zIndex: 1000,
                  maxHeight: '320px',
                  overflowY: 'auto',
                  minWidth: '220px',
                  padding: '0.5rem',
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <div style={{ 
                    padding: '0.5rem 0.75rem', 
                    fontSize: '0.75rem', 
                    fontWeight: 600, 
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Select Location
                  </div>
                  {cities.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { 
                        if (c.isAvailable) {
                          setSelectedCity(c.name); 
                          setCityDropOpen(false) 
                        }
                      }}
                      disabled={!c.isAvailable}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.5rem 1rem',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.85rem',
                        color: !c.isAvailable ? 'var(--text-muted)' : (selectedCity === c.name ? 'var(--saffron)' : 'var(--text-body)'),
                        background: selectedCity === c.name ? 'var(--gold-bg)' : 'transparent',
                        border: 'none',
                        cursor: c.isAvailable ? 'pointer' : 'not-allowed',
                        transition: 'background 0.15s',
                        opacity: c.isAvailable ? 1 : 0.6,
                      }}
                      onMouseEnter={e => { if (c.isAvailable) e.currentTarget.style.backgroundColor = 'var(--gold-bg)' }}
                      onMouseLeave={e => { if (c.isAvailable) e.currentTarget.style.backgroundColor = selectedCity === c.name ? 'var(--gold-bg)' : 'transparent' }}
                    >
                      {c.name}
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginLeft: '0.5rem' }}>{c.state}</span>
                      {!c.isAvailable && (
                        <span style={{ 
                          float: 'right', 
                          fontSize: '0.65rem', 
                          backgroundColor: 'rgba(0,0,0,0.05)', 
                          padding: '2px 6px', 
                          borderRadius: '4px',
                          color: 'var(--text-muted)'
                        }}>
                          Coming Soon
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="hidden-mobile">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.href}
                to={link.href}
                style={({ isActive }) => ({
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                  color: isActive ? 'var(--maroon)' : 'var(--text-body)',
                  textDecoration: 'none',
                  fontWeight: isActive ? 600 : 400,
                  borderBottom: isActive ? '2px solid var(--saffron)' : '2px solid transparent',
                  paddingBottom: '2px',
                  transition: 'color 0.2s',
                })}
              >
                {link.label}
              </NavLink>
            ))}

            {/* Tools dropdown */}
            <div ref={toolsDropRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setToolsOpen(o => !o)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                  color: toolsOpen ? 'var(--maroon)' : 'var(--text-body)',
                  fontWeight: toolsOpen ? 600 : 400,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'color 0.2s',
                }}
              >
                Tools
                <ChevronDown
                  size={13}
                  color="var(--text-muted)"
                  style={{
                    transition: 'transform 0.25s ease',
                    transform: toolsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>
              {toolsOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-hover)',
                  zIndex: 1000,
                  minWidth: '180px',
                  padding: '0.5rem',
                  animation: 'fadeIn 0.18s ease-out',
                }}>
                  {TOOLS_LINKS.map(t => (
                    <NavLink
                      key={t.href}
                      to={t.href}
                      onClick={() => setToolsOpen(false)}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.55rem 0.9rem',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.88rem',
                        color: isActive ? 'var(--saffron)' : 'var(--text-body)',
                        backgroundColor: isActive ? 'var(--gold-bg)' : 'transparent',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontWeight: isActive ? 600 : 400,
                        transition: 'background 0.15s',
                      })}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--gold-bg)' }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = '' }}
                    >
                      <span>{t.icon}</span> {t.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            {/* WhatsApp */}
            <a
              href="https://wa.me/919670955055"
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

            <a
              href="#footer"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                color: 'var(--maroon)',
                textDecoration: 'none',
                padding: '0.45rem 1.1rem',
                border: '1.5px solid var(--maroon)',
                borderRadius: '6px',
                fontWeight: 600,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="hidden-mobile"
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--maroon)'; e.currentTarget.style.color = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--maroon)' }}
            >
              Contact Us
            </a>

            <Link to="/booking" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.55rem 1.2rem' }} id="cta-book-puja">
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
            <Link to="/" onClick={() => setMobileOpen(false)} aria-label="Puja Havan — Home">
              <img src={logo} alt="Puja Havan" style={{ height: '44px', width: 'auto', objectFit: 'contain' }} />
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={22} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {ALL_MOBILE_LINKS.map(link => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                style={({ isActive }) => ({
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  color: isActive ? 'var(--saffron)' : 'var(--text-body)',
                  textDecoration: 'none',
                  padding: '0.75rem 0.5rem',
                  borderBottom: '1px solid var(--border)',
                  display: 'block',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'color 0.2s',
                })}
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/about"
              onClick={() => setMobileOpen(false)}
              style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-body)', textDecoration: 'none', padding: '0.75rem 0.5rem', borderBottom: '1px solid var(--border)', display: 'block' }}
            >
              About Us
            </Link>
            <a
              href="#footer"
              onClick={() => setMobileOpen(false)}
              style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-body)', textDecoration: 'none', padding: '0.75rem 0.5rem', borderBottom: '1px solid var(--border)', display: 'block' }}
            >
              Contact Us
            </a>

            <Link
              to="/pandit-registration"
              onClick={() => setMobileOpen(false)}
              style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-body)', textDecoration: 'none', padding: '0.75rem 0.5rem', borderBottom: '1px solid var(--border)', display: 'block' }}
            >
              Join as Pandit
            </Link>

            <div style={{ marginTop: '1rem', padding: '1rem 0.5rem', background: 'var(--gold-bg)', borderRadius: '8px' }}>
              <div style={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: 'var(--text-muted)', 
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <MapPin size={12} /> Service Location
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'white',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              >
                {cities.map(c => (
                  <option key={c.id} value={c.name} disabled={!c.isAvailable}>
                    {c.name} {c.isAvailable ? `(${c.state})` : '- Coming Soon'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/booking" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ justifyContent: 'center', textAlign: 'center' }}>
              Book a Puja
            </Link>
            <a
              href="https://wa.me/919670955055"
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.015 22l4.9-1.4A9.95 9.95 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.72 0-3.338-.489-4.705-1.336L4 20l1.368-3.236A7.956 7.956 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" fillRule="evenodd" clipRule="evenodd"/></svg>
              Chat on WhatsApp
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
