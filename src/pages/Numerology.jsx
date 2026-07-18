import React, { useState } from 'react'
import Seo from '../components/Seo'
import { PAGES, breadcrumbSchema } from '../seo/seoConfig'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import SectionLabel from '../components/common/SectionLabel'

// Standard Lo Shu Grid positions
const LO_SHU_LAYOUT = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6]
]

// Numerology traits and tips mapped to 1-9
const NUMEROLOGY_DATA = {
  1: { planet: 'Sun (Surya)', traits: 'Leadership, independence, originality, ambition.', tip: 'Offer water to the Sun daily in a copper vessel to boost confidence.' },
  2: { planet: 'Moon (Chandra)', traits: 'Intuition, emotion, teamwork, peace-maker.', tip: 'Respect your mother and older women; drink water in a silver glass.' },
  3: { planet: 'Jupiter (Guru)', traits: 'Knowledge, discipline, creativity, optimism.', tip: 'Apply a turmeric or sandalwood tilak on your forehead for wisdom.' },
  4: { planet: 'Rahu', traits: 'Organization, practicality, wealth, unconventional.', tip: 'Feed birds and keep your surroundings organized to avoid confusion.' },
  5: { planet: 'Mercury (Buddh)', traits: 'Balance, communication, freedom, trade.', tip: 'Feed green grass to cows on Wednesdays for better communication.' },
  6: { planet: 'Venus (Shukra)', traits: 'Luxury, family, harmony, responsibility.', tip: 'Wear clean, ironed clothes and use mild perfumes for better relationships.' },
  7: { planet: 'Ketu', traits: 'Spirituality, research, analytical, introverted.', tip: 'Feed street dogs and spend time in meditation or spiritual reading.' },
  8: { planet: 'Saturn (Shani)', traits: 'Hard work, karma, abundance, authority.', tip: 'Help the poor and working-class people; light a mustard oil lamp on Saturdays.' },
  9: { planet: 'Mars (Mangal)', traits: 'Energy, courage, humanitarian, action-oriented.', tip: 'Donate blood if healthy, or offer red lentils (masoor dal) on Tuesdays.' },
}

// Chaldean Numerology Mapping
const CHALDEAN_MAP = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
}

const NAME_INTERPRETATIONS = {
  1: "Indicates a strong-willed, independent leader. You are creative and ambitious.",
  2: "Suggests a cooperative, sensitive, and diplomatic nature. You work well with others.",
  3: "Reflects creativity, self-expression, and social skills. You are optimistic and enthusiastic.",
  4: "Represents stability, hard work, and practicality. You are organized and dependable.",
  5: "Indicates a love for freedom, adventure, and change. You are versatile and quick-thinking.",
  6: "Suggests a focus on family, harmony, and service. You are responsible and artistic.",
  7: "Reflects a deep, analytical, and spiritual mind. You seek truth and knowledge.",
  8: "Represents material success, power, and authority. You have good judgment and ambition.",
  9: "Indicates a humanitarian, compassionate, and idealistic nature. You want to help the world."
}

const MOBILE_INTERPRETATIONS = {
  1: "Good for business and authority. Attracts leadership opportunities.",
  2: "Promotes peace and emotional connections. Good for counseling or creative arts.",
  3: "Boosts communication and social standing. Excellent for teachers and artists.",
  4: "Brings discipline and focus. Good for technical work and stability.",
  5: "Attracts travel and networking opportunities. Best for sales and marketing.",
  6: "Fosters love, luxury, and family harmony. Good for hospitality and fashion.",
  7: "Encourages research and spiritual growth. Good for thinkers and analysts.",
  8: "Focuses on hard work and slow but steady gains. Requires patience.",
  9: "Brings high energy and completion. Good for social service and sports."
}

// Helper function to sum digits until it's a single digit (unless it's a master number, but standard Lo Shu usually reduces to 1-9)
const reduceToSingleDigit = (num) => {
  if (!num) return 0
  let str = num.toString()
  while (str.length > 1) {
    str = str.split('').reduce((acc, digit) => acc + parseInt(digit), 0).toString()
  }
  return parseInt(str)
}

export default function Numerology() {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('male')
  const [driver, setDriver] = useState(null)
  const [conductor, setConductor] = useState(null)
  const [kua, setKua] = useState(null)
  const [gridData, setGridData] = useState({})
  const [missingNumbers, setMissingNumbers] = useState([])
  const [nameResult, setNameResult] = useState(null)
  const [mobileResult, setMobileResult] = useState(null)

  const calculateNumerology = (e) => {
    e.preventDefault()
    
    // 1. Lo Shu Grid Calculation (DOB based)
    if (dob) {
      const [year, month, day] = dob.split('-')
      const driverNum = reduceToSingleDigit(parseInt(day))
      const fullDateStr = `${year}${month}${day}`
      const conductorNum = reduceToSingleDigit(fullDateStr)
      const yearSum = reduceToSingleDigit(parseInt(year))
      let kuaNum = 0
      if (gender === 'male') {
        kuaNum = 11 - yearSum
      } else {
        kuaNum = 4 + yearSum
      }
      kuaNum = reduceToSingleDigit(kuaNum)
      // Kua 5 does not exist in the classical system: males take 2, females take 8
      if (kuaNum === 5) kuaNum = gender === 'male' ? 2 : 8

      setDriver(driverNum)
      setConductor(conductorNum)
      setKua(kuaNum)

      const digitsToMap = (fullDateStr + driverNum.toString() + conductorNum.toString() + kuaNum.toString()).replace(/0/g, '')
      const occurrences = {}
      for (const digit of digitsToMap) {
        if (!occurrences[digit]) occurrences[digit] = 0
        occurrences[digit]++
      }
      setGridData(occurrences)

      const missing = []
      for (let i = 1; i <= 9; i++) {
        if (!occurrences[i.toString()]) {
          missing.push(i)
        }
      }
      setMissingNumbers(missing)
    }

    // 2. Name Numerology (Chaldean)
    if (name) {
      const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '')
      let total = 0
      for (const char of cleanName) {
        total += CHALDEAN_MAP[char] || 0
      }
      setNameResult({ compound: total, single: reduceToSingleDigit(total) })
    }

    // 3. Mobile Numerology
    if (mobile) {
      const digits = mobile.replace(/[^0-9]/g, '')
      let total = 0
      for (const digit of digits) {
        total += parseInt(digit)
      }
      setMobileResult({ total, single: reduceToSingleDigit(total) })
    }
  }

  return (
    <>
      <Seo
        {...PAGES.numerology}
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Numerology', path: '/numerology' },
        ])}
      />
      <Navbar />
      <main style={{ paddingTop: '68px', backgroundColor: 'var(--bg-page)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ backgroundColor: 'var(--gold-bg)', padding: '4rem 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container-max">
            <SectionLabel>VEDIC ASTROLOGY</SectionLabel>
            <h1 style={{ fontFamily: 'var(--font-deva)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Lo Shu Grid Numerology
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px' }}>
              Discover the missing and repeating numbers in your life chart. The Lo Shu grid reveals your planetary influences based on your date of birth.
            </p>
          </div>
        </div>

        <div className="container-max" style={{ padding: '3rem 2rem', flex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'flex-start' }}>
            
            {/* Input Section */}
            <div style={{ flex: '1 1 300px', backgroundColor: 'var(--bg-card)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--maroon)', marginBottom: '1.5rem' }}>Enter Details</h2>
              <form onSubmit={calculateNumerology}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-body)', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Rahul Sharma"
                    style={{
                      width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-primary)', backgroundColor: 'transparent', outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-body)', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="E.g. 9876543210"
                    pattern="[0-9]{10}"
                    style={{
                      width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text-primary)', backgroundColor: 'transparent', outline: 'none'
                    }}
                  />
                </div>

                {/* Gender Selection */}
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-body)', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Gender (For Kua Calculation)
                  </label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-body)', fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="gender" 
                        value="male" 
                        checked={gender === 'male'} 
                        onChange={(e) => setGender(e.target.value)} 
                        style={{ accentColor: 'var(--gold)' }}
                      />
                      Male
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-body)', fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="gender" 
                        value="female" 
                        checked={gender === 'female'} 
                        onChange={(e) => setGender(e.target.value)} 
                      />
                      Female
                    </label>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-body)', marginBottom: '0.5rem', fontWeight: 500 }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '1rem',
                      color: 'var(--text-primary)',
                      backgroundColor: 'transparent',
                      outline: 'none'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--maroon)',
                    color: 'white',
                    width: '100%',
                    padding: '1rem',
                    border: 'none',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Calculate Now
                </button>
              </form>

              {driver !== null && (
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>Name:</span>
                    <strong style={{ fontFamily: 'var(--font-body)', color: 'var(--maroon)' }}>{name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>Driver / Psychic No (Mulank):</span>
                    <strong style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '1.2rem' }}>{driver}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>Conductor / Destiny No (Bhagyank):</span>
                    <strong style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon)', fontSize: '1.2rem' }}>{conductor}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>Kua Number:</span>
                    <strong style={{ fontFamily: 'var(--font-heading)', color: 'var(--saffron)', fontSize: '1.2rem' }}>{kua}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Grid Display Section */}
            <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                backgroundColor: 'var(--gold)',
                padding: '0.5rem',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: 'var(--shadow-card)'
              }}>
                {LO_SHU_LAYOUT.map((row, rowIndex) => (
                  row.map((baseNumber, colIndex) => {
                    // Check if this number exists in our mapped data
                    const count = gridData[baseNumber.toString()] || 0
                    // Create a string with the number repeated 'count' times, e.g., '11' if 1 appears twice
                    const displayValue = count > 0 ? baseNumber.toString().repeat(count) : ''

                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        style={{
                          aspectRatio: '1 / 1',
                          backgroundColor: 'var(--bg-card)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '4px',
                          position: 'relative'
                        }}
                      >
                        <span style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-body)',
                          color: 'var(--text-muted)',
                          opacity: 0.6
                        }}>
                          {baseNumber}
                        </span>
                        
                        <span style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                          color: displayValue ? 'var(--text-primary)' : 'transparent',
                          lineHeight: 1,
                          fontWeight: 500,
                          letterSpacing: displayValue.length > 2 ? '0.05em' : '0.15em'
                        }}>
                          {displayValue || baseNumber}
                        </span>
                      </div>
                    )
                  })
                ))}
              </div>
              
              <div style={{ marginTop: '2rem', textAlign: 'center', maxWidth: '400px' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  * The small number in the corner shows the standard Lo Shu placement. The large center numbers represent the occurrences of those digits in your birth date, Mulank, Bhagyank, and Kua number.
                </p>
              </div>
            </div>
          </div>

          {/* Insights & Tips Section */}
          {driver !== null && conductor !== null && (
            <div style={{ marginTop: '4rem' }}>
              <h2 style={{ fontFamily: 'var(--font-deva)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: 'var(--text-primary)', marginBottom: '2rem', textAlign: 'center' }}>
                Your Numerological Reading
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Driver Traits */}
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    Driver Number: {driver}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-body)', marginBottom: '0.5rem' }}>
                    <strong>Ruling Planet:</strong> {NUMEROLOGY_DATA[driver].planet}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-body)', marginBottom: '1rem' }}>
                    <strong>Personality Traits:</strong> {NUMEROLOGY_DATA[driver].traits}
                  </p>
                  <div style={{ padding: '1rem', backgroundColor: 'var(--gold-bg)', borderRadius: '8px' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--maroon)' }}>
                      <strong>Tip for you:</strong> {NUMEROLOGY_DATA[driver].tip}
                    </p>
                  </div>
                </div>

                {/* Conductor Traits */}
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon)', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    Conductor Number: {conductor}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-body)', marginBottom: '0.5rem' }}>
                    <strong>Ruling Planet:</strong> {NUMEROLOGY_DATA[conductor].planet}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-body)', marginBottom: '1rem' }}>
                    <strong>Destiny Path:</strong> {NUMEROLOGY_DATA[conductor].traits}
                  </p>
                  <div style={{ padding: '1rem', backgroundColor: 'rgba(128, 0, 32, 0.05)', borderRadius: '8px' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--maroon)' }}>
                      <strong>Tip for your destiny:</strong> {NUMEROLOGY_DATA[conductor].tip}
                    </p>
                  </div>
                </div>

                {/* Kua Traits */}
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--saffron)', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    Kua Number: {kua}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-body)', marginBottom: '0.5rem' }}>
                    <strong>Ruling Energy:</strong> The Kua number determines your most favorable directions and hidden planetary strength.
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-body)', marginBottom: '1rem' }}>
                    <strong>Planet:</strong> {NUMEROLOGY_DATA[kua].planet} ({NUMEROLOGY_DATA[kua].traits})
                  </p>
                  <div style={{ padding: '1rem', backgroundColor: 'var(--gold-bg)', borderRadius: '8px' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--maroon)' }}>
                      <strong>Energy Tip:</strong> Keep the area corresponding to this planet clean in your home to attract positive energy. {NUMEROLOGY_DATA[kua].tip}
                    </p>
                  </div>
                </div>
              </div>

              {/* Missing Numbers Remedies */}
              {missingNumbers.length > 0 && (
                <div style={{ marginTop: '2.5rem', backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px dashed var(--border-gold)' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--saffron)', marginBottom: '1.5rem', textAlign: 'center' }}>
                    Missing Number Remedies
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {missingNumbers.map(num => (
                      <div key={num} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-12px', left: '1rem', backgroundColor: 'var(--bg-card)', padding: '0 0.5rem', fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontWeight: 'bold' }}>
                          Missing {num}
                        </div>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-body)', marginTop: '0.5rem' }}>
                          {NUMEROLOGY_DATA[num].tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Name & Mobile Analysis */}
              <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {nameResult && (
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--maroon)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                      Name Analysis (Chaldean)
                    </h3>
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Compound</p>
                        <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', color: 'var(--gold)' }}>{nameResult.compound}</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Single Digit</p>
                        <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--maroon)', lineHeight: 1 }}>{nameResult.single}</div>
                      </div>
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '1rem' }}>
                      {NAME_INTERPRETATIONS[nameResult.single]}
                    </p>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--gold-bg)', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--maroon)' }}>
                      <strong>Planetary Influence:</strong> {NUMEROLOGY_DATA[nameResult.single].planet}
                    </div>
                  </div>
                )}

                {mobileResult && (
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--gold)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                      Mobile Number Analysis
                    </h3>
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Total Sum</p>
                        <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', color: 'var(--maroon)' }}>{mobileResult.total}</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Destiny</p>
                        <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--gold)', lineHeight: 1 }}>{mobileResult.single}</div>
                      </div>
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '1rem' }}>
                      {MOBILE_INTERPRETATIONS[mobileResult.single]}
                    </p>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(128, 0, 32, 0.05)', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--maroon)' }}>
                      <strong>Energy:</strong> {NUMEROLOGY_DATA[mobileResult.single].traits}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}