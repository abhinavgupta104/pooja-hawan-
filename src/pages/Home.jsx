import React from 'react'
import Seo from '../components/Seo'
import { PAGES, faqSchema } from '../seo/seoConfig'
import { FAQS } from '../components/sections/FAQSection'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFloat from '../components/layout/WhatsAppFloat'
import Reveal from '../components/common/Reveal'
import HeroSection from '../components/sections/HeroSection'
import TrustStrip from '../components/sections/TrustStrip'
import PoojaGallery from '../components/sections/PoojaGallery'
import EPujaBanner from '../components/sections/EPujaBanner'
import DigitalExperiences from '../components/sections/DigitalExperiences'
import HowItWorks from '../components/sections/HowItWorks'
import FestivalCalendar from '../components/sections/FestivalCalendar'
import PanchangWidget from '../components/sections/PanchangWidget'
import Testimonials from '../components/sections/Testimonials'
import SamagriCTA from '../components/sections/SamagriCTA'
import WhyUs from '../components/sections/WhyUs'
import FAQSection from '../components/sections/FAQSection'
import LotusDivider from '../components/common/LotusDivider'

export default function Home() {
  return (
    <>
      <Seo
        {...PAGES.home}
        jsonLd={faqSchema(FAQS.map((f) => ({ question: f.q, answer: f.a })))}
      />
      <Navbar />
      <main>
        {/* Sec 1: Hero (runs its own GSAP timeline) */}
        <HeroSection />

        {/* Sec 2: Trust Strip */}
        <TrustStrip />

        {/* Sec 3: Services (curated poster preview — full list on /services) */}
        <Reveal>
          <PoojaGallery
            eyebrow="OUR SERVICES"
            heading="Sacred Puja &amp; Havan Services"
            intro="Book authentic Vedic ceremonies performed by verified pandits — samagri included, transparent pricing. Explore our most-booked poojas below."
            limit={8}
            preferPosters
            showViewAll
            background="var(--bg-section-alt)"
          />
        </Reveal>

        {/* Sec 4: Puja Banner */}
        <Reveal><EPujaBanner /></Reveal>

        {/* Sec 5: E-Puja + Virtual Puja combined */}
        <DigitalExperiences />

        {/* Sec 6: How It Works */}
        <Reveal><HowItWorks /></Reveal>

        {/* Lotus divider */}
        <div style={{ backgroundColor: 'var(--bg-section-alt)', padding: '0 2rem' }}>
          <div className="container-max"><LotusDivider /></div>
        </div>

        {/* Sec 7: Festival Calendar */}
        <Reveal><FestivalCalendar /></Reveal>

        {/* Sec 8: Panchang */}
        <Reveal><PanchangWidget /></Reveal>

        {/* Sec 9: Testimonials */}
        <Reveal><Testimonials /></Reveal>

        {/* Sec 10: Samagri CTA */}
        <Reveal><SamagriCTA /></Reveal>

        {/* Sec 11: Why Us */}
        <Reveal><WhyUs /></Reveal>

        {/* Sec 12: FAQ */}
        <Reveal><FAQSection /></Reveal>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
