import React, { useState } from 'react'

export default function WhatsAppFloat() {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      {/* Tooltip */}
      {hovered && (
        <div style={{
          backgroundColor: 'var(--bg-dark)',
          color: 'white',
          fontFamily: 'var(--font-body)',
          fontSize: '0.78rem',
          padding: '0.4rem 0.8rem',
          borderRadius: '6px',
          whiteSpace: 'nowrap',
          boxShadow: 'var(--shadow-warm)',
          animation: 'fadeIn 0.15s ease',
        }}>
          Chat with us
        </div>
      )}

      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          backgroundColor: 'var(--gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-hover)',
          textDecoration: 'none',
          transition: 'transform 0.2s ease, background-color 0.2s ease',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
        }}
        aria-label="Chat with us on WhatsApp"
      >
        {/* Pulse ring */}
        <span
          style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '50%',
            backgroundColor: 'var(--gold)',
            opacity: 0.35,
            animation: 'pulseRing 2s ease-out infinite',
            zIndex: -1,
          }}
        />
        <span
          style={{
            position: 'absolute',
            inset: '-10px',
            borderRadius: '50%',
            backgroundColor: 'var(--gold)',
            opacity: 0.15,
            animation: 'pulseRing 2s ease-out infinite',
            animationDelay: '0.6s',
            zIndex: -1,
          }}
        />

        {/* WhatsApp SVG */}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.015 22l4.9-1.4A9.95 9.95 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.72 0-3.338-.489-4.705-1.336L4 20l1.368-3.236A7.956 7.956 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" fillRule="evenodd" clipRule="evenodd" />
        </svg>
      </a>
    </div>
  )
}
