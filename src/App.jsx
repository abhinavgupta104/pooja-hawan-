import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/globals.css'

// Lazy load all pages
const Home                = lazy(() => import('./pages/Home'))
const Services            = lazy(() => import('./pages/Services'))
const ServiceDetail       = lazy(() => import('./pages/ServiceDetail'))
const Pandits             = lazy(() => import('./pages/Pandits'))
const PanditProfile       = lazy(() => import('./pages/PanditProfile'))
const EPuja               = lazy(() => import('./pages/EPuja'))
const Panchang            = lazy(() => import('./pages/Panchang'))
const Shop                = lazy(() => import('./pages/Shop'))
const Booking             = lazy(() => import('./pages/Booking'))
const Blog                = lazy(() => import('./pages/Blog'))
const Numerology          = lazy(() => import('./pages/Numerology'))
const PanditRegistration  = lazy(() => import('./pages/PanditRegistration'))
const About               = lazy(() => import('./pages/About'))
const Contact             = lazy(() => import('./pages/Contact'))
const ComingSoon           = lazy(() => import('./pages/ComingSoon'))
const VirtualPuja         = lazy(() => import('./pages/VirtualPuja'))

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

export default function App() {
  return (
    <BrowserRouter>
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
          <Route path="/pandit-registration" element={<PanditRegistration />} />
          <Route path="/about"               element={<About />} />
          <Route path="/contact"             element={<Contact />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
