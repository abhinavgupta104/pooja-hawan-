import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/globals.css'

// ── Stale-deployment recovery ─────────────────────────────────
// Routes are lazy-loaded from hashed chunks. After a redeploy the
// hashes change, so a tab still running the old bundle fails to
// import route chunks ("click does nothing"). On the first failure
// we force one full reload to fetch the fresh index.html; if it
// still fails we surface the error boundary instead of looping.
export const RELOAD_FLAG = 'pujahavan:chunk-reloaded'

function lazyWithRetry(importer) {
  return lazy(() =>
    importer()
      .then((module) => {
        sessionStorage.removeItem(RELOAD_FLAG)
        return module
      })
      .catch((error) => {
        if (!sessionStorage.getItem(RELOAD_FLAG)) {
          sessionStorage.setItem(RELOAD_FLAG, '1')
          window.location.reload()
          return new Promise(() => {}) // page is reloading — never resolves
        }
        throw error
      })
  )
}

// Lazy load all pages (with stale-chunk retry)
const Home                = lazyWithRetry(() => import('./pages/Home'))
const Services            = lazyWithRetry(() => import('./pages/Services'))
const ServiceDetail       = lazyWithRetry(() => import('./pages/ServiceDetail'))
const Pandits             = lazyWithRetry(() => import('./pages/Pandits'))
const PanditProfile       = lazyWithRetry(() => import('./pages/PanditProfile'))
const EPuja               = lazyWithRetry(() => import('./pages/EPuja'))
const Panchang            = lazyWithRetry(() => import('./pages/Panchang'))
const Shop                = lazyWithRetry(() => import('./pages/Shop'))
const Booking             = lazyWithRetry(() => import('./pages/Booking'))
const Blog                = lazyWithRetry(() => import('./pages/Blog'))
const Numerology          = lazyWithRetry(() => import('./pages/Numerology'))
const PanditRegistration  = lazyWithRetry(() => import('./pages/PanditRegistration'))
const About               = lazyWithRetry(() => import('./pages/About'))
const Contact             = lazyWithRetry(() => import('./pages/Contact'))
const ComingSoon          = lazyWithRetry(() => import('./pages/ComingSoon'))
const VirtualPuja         = lazyWithRetry(() => import('./pages/VirtualPuja'))
const Kundali             = lazyWithRetry(() => import('./pages/Kundali'))

function LoadingSpinner() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-page)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid var(--border)',
          borderTop: '3px solid var(--gold)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1rem',
        }} />
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Loading...
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// Catches lazy-load/render errors that survive the automatic reload
// and offers a manual recovery instead of a dead, unresponsive page.
class RouteErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  handleReload = () => {
    sessionStorage.removeItem(RELOAD_FLAG)
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-page)',
          padding: '2rem',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '440px' }}>
            <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }} aria-hidden>🪔</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              This page needs a quick refresh
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              The site was updated while this tab was open, so the old version
              can&rsquo;t load this page. Reload to get the latest version.
            </p>
            <button type="button" className="btn-primary" onClick={this.handleReload} style={{ cursor: 'pointer' }}>
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/"                    element={<Home />} />
            <Route path="/services"            element={<Services />} />
            <Route path="/service/:slug"       element={<ServiceDetail />} />
            <Route path="/pandits"             element={<Pandits />} />
            <Route path="/pandit/:id"          element={<PanditProfile />} />
            <Route path="/puja"                element={<EPuja />} />
            <Route path="/e-puja"              element={<ComingSoon />} />
            <Route path="/virtual-puja"        element={<VirtualPuja />} />
            <Route path="/panchang"            element={<Panchang />} />
            <Route path="/shop"                element={<Shop />} />
            <Route path="/booking"             element={<Booking />} />
            <Route path="/blog"                element={<Blog />} />
            <Route path="/numerology"          element={<Numerology />} />
            <Route path="/kundali"             element={<Kundali />} />
            <Route path="/pandit-registration" element={<PanditRegistration />} />
            <Route path="/about"               element={<About />} />
            <Route path="/contact"             element={<Contact />} />
          </Routes>
        </Suspense>
      </RouteErrorBoundary>
    </BrowserRouter>
  )
}
