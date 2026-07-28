import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'
import WhatsAppFloat from '../layout/WhatsAppFloat'
import SectionLabel from '../common/SectionLabel'
import Seo from '../Seo'
import { breadcrumbSchema, LEGAL_ENTITY } from '../../seo/seoConfig'

// ─────────────────────────────────────────────────────────────
//  Shared shell for the legal / policy pages so they share one
//  layout, typography scale and "last updated" treatment.
// ─────────────────────────────────────────────────────────────
export default function LegalPage({
  eyebrow,
  title,
  intro,
  lastUpdated,
  seo,
  children,
}) {
  return (
    <>
      <Seo
        {...seo}
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: title, path: seo.path },
        ])}
      />
      <Navbar />
      <main style={{ paddingTop: 'var(--nav-h)', backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
        {/* Hero */}
        <div style={{ backgroundColor: 'var(--bg-section-alt)', padding: '4.5rem 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container-max" style={{ maxWidth: '820px' }}>
            <SectionLabel>{eyebrow}</SectionLabel>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'var(--text-primary)', lineHeight: 1.12, fontWeight: 500, marginBottom: '1rem' }}>
              {title}
            </h1>
            {intro && (
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-body)', fontSize: '1.02rem', lineHeight: 1.8 }}>
                {intro}
              </p>
            )}
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '1.5rem' }}>
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="container-max legal-prose" style={{ maxWidth: '820px', padding: '3.5rem 2rem 4rem' }}>
          {children}

          {/* Operator disclosure — shown on every policy page */}
          <div
            style={{
              marginTop: '3rem',
              padding: '1.5rem 1.75rem',
              backgroundColor: 'var(--gold-bg)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-card)',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.02rem', color: 'var(--maroon)', marginBottom: '0.6rem' }}>
              Who operates Puja Havan
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: 1.8, margin: 0 }}>
              <strong>{LEGAL_ENTITY.brand}</strong> ({LEGAL_ENTITY.domain}) is a brand owned and
              operated by <strong>{LEGAL_ENTITY.name}</strong>, a company incorporated
              under the Companies Act, 2013. In these policies, &ldquo;we&rdquo;, &ldquo;us&rdquo;
              and &ldquo;our&rdquo; refer to {LEGAL_ENTITY.name}.
              <br /><br />
              <strong>Registered office:</strong> {LEGAL_ENTITY.address}
              <br />
              <strong>Email:</strong>{' '}
              <a href={`mailto:${LEGAL_ENTITY.email}`} style={{ color: 'var(--maroon)' }}>{LEGAL_ENTITY.email}</a>
              {' · '}
              <strong>Phone:</strong>{' '}
              <a href={`tel:${LEGAL_ENTITY.phoneHref}`} style={{ color: 'var(--maroon)' }}>{LEGAL_ENTITY.phoneDisplay}</a>
            </p>
          </div>

          {/* Cross-links */}
          <nav
            aria-label="Other policies"
            style={{ marginTop: '2.5rem', paddingTop: '1.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.5rem' }}
          >
            {[
              { to: '/privacy-policy', label: 'Privacy Policy' },
              { to: '/terms-of-service', label: 'Terms of Service' },
              { to: '/refund-policy', label: 'Refund & Cancellation' },
              { to: '/cookie-policy', label: 'Cookie Policy' },
              { to: '/responsible-disclosure', label: 'Responsible Disclosure' },
            ]
              .filter(l => l.to !== seo.path)
              .map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--maroon)', textDecoration: 'none', borderBottom: '1px solid var(--border-gold)' }}
                >
                  {l.label}
                </Link>
              ))}
          </nav>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />

      <style>{`
        .legal-prose h2 {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 500;
          color: var(--text-primary);
          margin: 2.5rem 0 0.85rem;
          line-height: 1.3;
        }
        .legal-prose h2:first-child { margin-top: 0; }
        .legal-prose h3 {
          font-family: var(--font-heading);
          font-size: 1.02rem;
          font-weight: 600;
          color: var(--maroon);
          margin: 1.75rem 0 0.6rem;
        }
        .legal-prose p,
        .legal-prose li {
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: var(--text-body);
          line-height: 1.85;
        }
        .legal-prose p { margin-bottom: 1rem; }
        .legal-prose ul, .legal-prose ol { margin: 0 0 1.25rem 1.25rem; }
        .legal-prose li { margin-bottom: 0.5rem; }
        .legal-prose a { color: var(--maroon); }
        .legal-prose strong { color: var(--text-primary); font-weight: 600; }
        .legal-prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 0 0 1.5rem;
          font-family: var(--font-body);
          font-size: 0.9rem;
        }
        .legal-prose th, .legal-prose td {
          border: 1px solid var(--border);
          padding: 0.7rem 0.9rem;
          text-align: left;
          vertical-align: top;
          color: var(--text-body);
        }
        .legal-prose th {
          background-color: var(--gold-bg);
          color: var(--maroon);
          font-weight: 600;
        }
        .legal-table-wrap { overflow-x: auto; }
      `}</style>
    </>
  )
}
