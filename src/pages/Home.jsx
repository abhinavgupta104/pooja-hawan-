import React from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'
import HeroSection from '../components/sections/HeroSection'
import TrustStrip from '../components/sections/TrustStrip'
import ServicesGrid from '../components/sections/ServicesGrid'
import EPujaBanner from '../components/sections/EPujaBanner'
import HowItWorks from '../components/sections/HowItWorks'

import FestivalCalendar from '../components/sections/FestivalCalendar'
import PanchangWidget from '../components/sections/PanchangWidget'
import Testimonials from '../components/sections/Testimonials'
import SamagriCTA from '../components/sections/SamagriCTA'
import WhyUs from '../components/sections/WhyUs'
import AcharyaProfileBanner from '../components/sections/AcharyaProfileBanner'

import FAQSection from '../components/sections/FAQSection'
import LotusDivider from '../components/common/LotusDivider'
import ComingSoonSection from '../components/sections/ComingSoonSection'

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

        {/* Sec 4: Puja Banner (previously E-Puja) */}
        <EPujaBanner />

        {/* New Sec: E-Puja Coming Soon */}
        <ComingSoonSection 
          label="NEW OFFERING"
          title="E-Puja: Digital Rituals"
          description="Experience the power of Vedic rituals digitally. We are building a platform for seamless online participation in sacred ceremonies from the comfort of your home."
          link="/e-puja"
          icon="💻"
          buttonText="Coming Soon — Notify Me"
        />

        {/* Virtual Puja Section */}
        <ComingSoonSection 
          label="EXCLUSIVE"
          title="Virtual Puja: One-to-One Experience"
          description="A fully real-time, private Vedic ceremony tailored exclusively for you. Connect with India's most learned Acharyas virtually."
          link="/virtual-puja"
          icon="👓"
          buttonText="Book Private Session"
        />

        {/* Sec 5: How It Works */}
        <HowItWorks />

        {/* Lotus divider */}
        <div style={{ backgroundColor: 'var(--bg-section-alt)', padding: '0 2rem' }}>
          <div className="container-max"><LotusDivider /></div>
        </div>


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


        {/* Sec 11: Samagri CTA */}
        <SamagriCTA />

        {/* Sec 12: Why Us */}
        <WhyUs />

        {/* Featured Pandit */}
        <AcharyaProfileBanner />


        {/* Sec 15: FAQ */}
        <FAQSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
