import React from 'react'

export default function SectionLabel({ children, className = '' }) {
  return (
    <p className={`section-label ${className}`} style={{ marginBottom: '0.6rem' }}>
      {children}
    </p>
  )
}
