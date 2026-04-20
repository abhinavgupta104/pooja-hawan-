import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SectionLabel from '../common/SectionLabel'
import FestivalCard from '../cards/FestivalCard'
import festivalsData from '../../data/festivals.json'

export default function FestivalCalendar() {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' })
    }
  }

  // Sort by date
  const sorted = [...festivalsData].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <section style={{ backgroundColor: 'var(--bg-page)', padding: '5rem 0' }}>
      <div className="container-max">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <SectionLabel>FESTIVAL CALENDAR</SectionLabel>
            <h2 className="section-heading">
              Upcoming Pujas &amp; Auspicious Dates
            </h2>
          </div>

          {/* Scroll buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => scroll(-1)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1.5px solid var(--border-gold)',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--maroon)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--gold-bg)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(1)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1.5px solid var(--border-gold)',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--maroon)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--gold-bg)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="scroll-container"
          style={{ paddingBottom: '1.25rem' }}
        >
          {sorted.map(festival => (
            <FestivalCard key={festival.id} festival={festival} />
          ))}
        </div>
      </div>
    </section>
  )
}
