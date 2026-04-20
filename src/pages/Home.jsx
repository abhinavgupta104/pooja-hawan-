import React from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'
import HeroSection from '../components/sections/HeroSection'
import TrustStrip from '../components/sections/TrustStrip'
import ServicesGrid from '../components/sections/ServicesGrid'
import EPujaBanner from '../components/sections/EPujaBanner'
import HowItWorks from '../components/sections/HowItWorks'
import PanditByLanguage from '../components/sections/PanditByLanguage'
import FestivalCalendar from '../components/sections/FestivalCalendar'
import PanchangWidget from '../components/sections/PanchangWidget'
import Testimonials from '../components/sections/Testimonials'
import CitiesGrid from '../components/sections/CitiesGrid'
import SamagriCTA from '../components/sections/SamagriCTA'
import WhyUs from '../components/sections/WhyUs'
import JoinAsPanditCTA from '../components/sections/JoinAsPanditCTA'
import AppDownload from '../components/sections/AppDownload'
import FAQSection from '../components/sections/FAQSection'
import LotusDivider from '../components/common/LotusDivider'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Sec 1: Hero */}
        <HeroSection />

        {/* Sec 2: Trust Strip */}
        <TrustStrip />

        {/* Lotus divider */}
        <div style={{ backgroundColor: 'var(--bg-section-alt)', padding: '0 2rem' }}>
          <div className="container-max"><LotusDivider /></div>
        </div>

        {/* Sec 3: Services */}
        <ServicesGrid />

        {/* Sec 4: E-Puja Banner */}
        <EPujaBanner />

        {/* Sec 5: How It Works */}
        <HowItWorks />

        {/* Lotus divider */}
        <div style={{ backgroundColor: 'var(--bg-section-alt)', padding: '0 2rem' }}>
          <div className="container-max"><LotusDivider /></div>
        </div>

        {/* Sec 6: Pandit by Language */}
        <PanditByLanguage />

        {/* Sec 7: Festival Calendar */}
        <FestivalCalendar />

        {/* Sec 8: Panchang */}
        <PanchangWidget />

        {/* Lotus divider */}
        <div style={{ backgroundColor: 'var(--bg-section-alt)', padding: '0 2rem' }}>
          <div className="container-max"><LotusDivider /></div>
        </div>

        {/* Sec 9: Testimonials */}
        <Testimonials />

        {/* Sec 10: Cities */}
        <CitiesGrid />

        {/* Sec 11: Samagri CTA */}
        <SamagriCTA />

        {/* Sec 12: Why Us */}
        <WhyUs />

        {/* Sec 13: Join as Pandit */}
        <JoinAsPanditCTA />

        {/* Sec 14: App Download */}
        <AppDownload />

        {/* Sec 15: FAQ */}
        <FAQSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
