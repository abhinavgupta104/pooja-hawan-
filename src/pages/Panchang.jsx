import React, { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import SectionLabel from '../components/common/SectionLabel'
import festivalsData from '../data/festivals.json'
import { Sun, Moon, Clock, Calendar, Star, Sunrise, Sunset, Loader2, MapPin, Search, ChevronRight, Info, Share2, Compass } from 'lucide-react'
import { fetchPanchangData, fetchChoghadiyaData, fetchHoraData, getCurrentCoordinates } from '../utils/panchangApi'

const NAKSHATRA_MANTRAS = {
  // ... existing mantras
  'Ashwini': 'ॐ अश्विनी कुमारया नमः',
  'Bharani': 'ॐ धरणी पुत्राय नमः',
  'Krittika': 'ॐ अग्नये नमः',
  'Rohini': 'ॐ ब्रह्मये नमः',
  'Mrigashira': 'ॐ चन्द्राय नमः',
  'Ardra': 'ॐ रुद्राय नमः',
  'Punarvasu': 'ॐ अदित्याये नमः',
  'Pushya': 'ॐ बृहस्पतये नमः',
  'Ashlesha': 'ॐ नागभूषणाय नमः',
  'Magha': 'ॐ पितृभ्यो नमः',
  'Purva Phalguni': 'ॐ भगा नमः',
  'Uttara Phalguni': 'ॐ अर्यमणये नमः',
  'Hasta': 'ॐ सवित्रे नमः',
  'Chitra': 'ॐ विश्वकर्मा नमः',
  'Swati': 'ॐ वायवे नमः',
  'Vishakha': 'ॐ इन्द्राग्नी नमः',
  'Anuradha': 'ॐ मित्राय नमः',
  'Jyeshtha': 'ॐ इन्द्राय नमः',
  'Mula': 'ॐ निरृतये नमः',
  'Purva Ashadha': 'ॐ अपः नमः',
  'Uttara Ashadha': 'ॐ विश्वदेवाय नमः',
  'Shravana': 'ॐ विष्णवे नमः',
  'Dhanishta': 'ॐ वसुभ्यो नमः',
  'Shatabhisha': 'ॐ वरुणाय नमः',
  'Purva Bhadrapada': 'ॐ अजैकपादे नमः',
  'Uttara Bhadrapada': 'ॐ अहिर्बुध्न्याय नमः',
  'Revati': 'ॐ पूषणे नमः'
};

const Sparkles = ({ active }) => {
  if (!active) return null;
  return (
    <div className="sparkle-container">
      {Array.from({ length: 30 }).map((_, i) => (
        <div 
          key={i} 
          className="sparkle-particle" 
          style={{ 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 5 + 2}px`,
            height: `${Math.random() * 5 + 2}px`,
            '--tx': `${(Math.random() - 0.5) * 400}px`,
            '--ty': `${(Math.random() - 0.5) * 400}px`,
            animationDelay: `${Math.random() * 0.5}s`
          }} 
        />
      ))}
    </div>
  );
};

const ZodiacWheel = ({ planets }) => {
  if (!planets) return null;
  const rashis = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const getCoords = (rashi, deg) => {
    const idx = rashis.indexOf(rashi);
    const angle = (idx * 30 + deg - 90) * (Math.PI / 180);
    return { x: 100 + 82 * Math.cos(angle), y: 100 + 82 * Math.sin(angle) };
  };
  return (
    <div style={{ width: '100%', maxWidth: '350px', margin: '0 auto', position: 'relative' }}>
      <svg viewBox="0 0 200 200" className="cosmic-bg-rotate">
        <circle cx="100" cy="100" r="98" fill="rgba(212, 175, 55, 0.03)" stroke="var(--border-gold)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="75" fill="none" stroke="var(--border-gold)" strokeWidth="0.5" opacity="0.3" />
        {rashis.map((r, i) => (
          <g key={r}>
            <line x1="100" y1="100" x2={100 + 98 * Math.cos((i * 30 - 90) * Math.PI / 180)} y2={100 + 98 * Math.sin((i * 30 - 90) * Math.PI / 180)} stroke="var(--border-gold)" strokeWidth="0.5" opacity="0.2" />
            <text x={100 + 88 * Math.cos((i * 30 + 15 - 90) * Math.PI / 180)} y={100 + 88 * Math.sin((i * 30 + 15 - 90) * Math.PI / 180)} fontSize="4" textAnchor="middle" fill="var(--gold)" opacity="0.5" fontFamily="var(--font-cinzel-dec)">{r.substring(0, 3)}</text>
          </g>
        ))}
        {planets.map((p, i) => {
          const { x, y } = getCoords(p.zodiac.name, p.degree);
          return (
            <g key={i} className="planet-dot">
              <circle cx={x} cy={y} r="3.5" fill="var(--maroon)" stroke="var(--gold)" strokeWidth="0.8" />
              <text x={x} y={y - 6} fontSize="4.5" textAnchor="middle" fill="var(--maroon)" fontWeight="bold" fontFamily="var(--font-heading)">{p.name.substring(0, 2)}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default function Panchang() {
  const [formData, setFormData] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    location: 'Delhi', 
    lat: '28.6139', 
    lon: '77.2090' 
  });
  const [apiData, setApiData] = useState(null);
  const [choghadiya, setChoghadiya] = useState(null);
  const [hora, setHora] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('panchang'); // panchang, choghadiya, hora
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSparkles, setShowSparkles] = useState(false);

  const triggerSparkles = () => {
    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 1500);
  };

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        const coords = await getCurrentCoordinates();
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lon}&format=json`);
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.village || 'Your Location';
          const updatedFormData = { ...formData, ...coords, location: city };
          setFormData(updatedFormData);
          loadAllData(updatedFormData);
        } catch (e) {
          const updatedFormData = { ...formData, ...coords };
          setFormData(updatedFormData);
          loadAllData(updatedFormData);
        }
      } catch (e) {
        loadAllData(formData);
      }
    };
    init();
  }, []);

  const loadAllData = async (params = formData) => {
    setLoading(true);
    setError(null);
    try {
      const [pData, cData, hData] = await Promise.all([
        fetchPanchangData(params),
        fetchChoghadiyaData(params),
        fetchHoraData(params)
      ]);
      // Show offline banner if any data came from offline calculator
      const offline = !!(pData?._offline || !pData?.tithi?.length);
      setIsOffline(offline);
      setApiData(pData);
      setChoghadiya(cData);
      setHora(hData);
      triggerSparkles();
    } catch (e) {
      console.error(e);
      setError('Unable to compute Panchang data. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = async () => {
    if (!formData.location) return;
    setSearching(true);
    setError(null);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${formData.location}&format=json`);
      const data = await res.json();
      if (data && data.length > 0) {
        const newCoords = { lat: data[0].lat, lon: data[0].lon };
        const updatedFormData = { ...formData, ...newCoords, location: data[0].display_name.split(',')[0] };
        setFormData(updatedFormData);
        loadAllData(updatedFormData);
      } else {
        setError("Location not found");
      }
    } catch (e) {
      setError("Location search failed");
    } finally {
      setSearching(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    loadAllData();
  }

  const formatTime = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  const calculateBrahmaMuhurat = (sunrise) => {
    if (!sunrise) return null;
    const date = new Date(sunrise);
    date.setMinutes(date.getMinutes() - 96); // 96 minutes before sunrise
    return date.toISOString();
  };

  const getFirst = (item) => Array.isArray(item) ? item[0] : item;

  const todayFormatted = new Date(formData.date).toLocaleDateString('en-IN', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  const PANCHANG_BASICS = apiData ? [
    { label: 'Tithi', hindiLabel: 'तिथि', value: getFirst(apiData.tithi)?.name, end: getFirst(apiData.tithi)?.end, icon: Calendar },
    { label: 'Nakshatra', hindiLabel: 'नक्षत्र', value: getFirst(apiData.nakshatra)?.name, end: getFirst(apiData.nakshatra)?.end, icon: Star },
    { label: 'Yoga', hindiLabel: 'योग', value: getFirst(apiData.yoga)?.name, end: getFirst(apiData.yoga)?.end, icon: Sun },
    { label: 'Karana', hindiLabel: 'करण', value: Array.isArray(apiData.karana) ? apiData.karana.map(k => k.name).join(', ') : apiData.karana?.name, end: getFirst(apiData.karana)?.end, icon: Moon },
    { label: 'Weekday', hindiLabel: 'वार', value: apiData.vaara || apiData.vara?.name, icon: Clock },
    { label: 'Paksha', hindiLabel: 'पक्ष', value: getFirst(apiData.tithi)?.paksha || apiData.paksha?.name, icon: Calendar },
  ] : [];

  const upcomingFestivals = [...festivalsData]
    .filter(f => new Date(f.date) >= new Date(formData.date))
    .sort((a,b) => new Date(a.date) - new Date(b.date))
    .slice(0, 8);

  const getAuspiciousColor = (name) => {
    const good = ['Amrit', 'Shubh', 'Labh', 'Chanchal', 'Amrita'];
    const bad = ['Rog', 'Kaal', 'Udveg'];
    if (good.some(g => name.includes(g))) return 'var(--gold)';
    if (bad.some(b => name.includes(b))) return 'var(--maroon)';
    return 'var(--text-body)';
  };

  const isCurrentPeriod = (start, end) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    // Normalize to current date for comparison if only time is relevant, 
    // but Prokerala provides full ISO strings.
    return now >= startDate && now <= endDate;
  };

  const getMoonPhaseStyle = (tithiIndex) => {
    if (!tithiIndex) return { width: '100%', left: '0' };
    
    // Tithi 1-15: Waxing, 16-30: Waning
    // 15 = Full, 30 = New
    let phase; 
    if (tithiIndex <= 15) {
      phase = tithiIndex / 15; // 0 to 1
    } else {
      phase = 1 - (tithiIndex - 15) / 15; // 1 to 0
    }
    
    // Simplified shadow: covers from left
    const shadowWidth = (1 - phase) * 100;
    return {
      width: `${shadowWidth}%`,
      left: `${phase * 100}%`
    };
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Daily Panchang | Puja Havan',
      text: `Panchang for ${todayFormatted} in ${formData.location}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Panchang link copied to clipboard!");
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px', backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
        {/* Hero Section */}
        <div style={{ 
          background: 'linear-gradient(to bottom, var(--gold-bg), var(--bg-page))', 
          padding: '4rem 0', 
          borderBottom: '1px solid var(--border)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative Mandala Background */}
          <div className="mandala-bg">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="var(--gold)" d="M100 0 A100 100 0 0 1 200 100 A100 100 0 0 1 100 200 A100 100 0 0 1 0 100 A100 100 0 0 1 100 0 M100 20 A80 80 0 0 0 20 100 A80 80 0 0 0 100 180 A80 80 0 0 0 180 100 A80 80 0 0 0 100 20 M100 40 A60 60 0 0 1 160 100 A60 60 0 0 1 100 160 A60 60 0 0 1 40 100 A60 60 0 0 1 100 40" opacity="0.2"/>
              <path fill="var(--maroon)" d="M100 60 A40 40 0 0 0 60 100 A40 40 0 0 0 100 140 A40 40 0 0 0 140 100 A40 40 0 0 0 100 60" opacity="0.3"/>
            </svg>
          </div>

          <div className="container-max" style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <SectionLabel>DIVINE CALENDAR</SectionLabel>
              <h1 style={{ 
                fontFamily: 'var(--font-cinzel-dec)', 
                fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', 
                color: 'var(--maroon)', 
                marginBottom: '1rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                Daily Panchang
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid var(--border-gold)', fontSize: '0.9rem' }}>
                  <MapPin size={16} color="var(--gold)" /> <span>{formData.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid var(--border-gold)', fontSize: '0.9rem' }}>
                  <Calendar size={16} color="var(--gold)" /> <span>{todayFormatted}</span>
                </div>
              </div>
            </div>

            <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '280px' }}>
              <div className="moon-container">
                <div className="moon-glow"></div>
                <div className="moon-sphere">
                  <div className="moon-texture"></div>
                  <div className="moon-shadow" style={getMoonPhaseStyle(getFirst(apiData?.tithi)?.index)}></div>
                </div>
                <div className="tithi-label">
                  {getFirst(apiData?.tithi)?.name || 'Amavasya'}
                </div>
              </div>
            </div>
            
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.7)', 
              backdropFilter: 'blur(10px)',
              padding: '2rem', 
              borderRadius: '20px', 
              border: '1px solid rgba(212, 175, 55, 0.3)', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              minWidth: '320px'
            }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Select Date</label>
                      <input 
                        type="date" 
                        required 
                        value={formData.date} 
                        onChange={e => setFormData({ ...formData, date: e.target.value })} 
                        style={{ padding: '0.75rem', width: '100%', borderRadius: '10px', border: '1px solid var(--border)', background: 'white' }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Location</label>
                      <div style={{ display: 'flex' }}>
                        <input 
                          type="text" 
                          placeholder="Search..."
                          value={formData.location} 
                          onChange={e => setFormData({ ...formData, location: e.target.value })} 
                          style={{ padding: '0.75rem', width: '100%', borderRadius: '10px 0 0 10px', border: '1px solid var(--border)', borderRight: 'none', background: 'white' }} 
                        />
                        <button 
                          type="button" 
                          onClick={handleLocationSearch} 
                          disabled={searching}
                          style={{ padding: '0 1rem', background: 'var(--gold)', color: 'white', border: 'none', borderRadius: '0 10px 10px 0', cursor: 'pointer' }}
                        >
                          {searching ? <Loader2 size={16} className="animate-spin" /> : <Search size={18} />}
                        </button>
                      </div>
                    </div>
                 </div>
                 <button 
                   type="submit" 
                   disabled={loading} 
                   style={{ 
                     padding: '1rem', 
                     background: 'linear-gradient(135deg, var(--maroon), #800000)', 
                     color: 'white', 
                     border: 'none', 
                     borderRadius: '10px', 
                     cursor: 'pointer', 
                     fontWeight: 700,
                     letterSpacing: '0.1em',
                     textTransform: 'uppercase',
                     boxShadow: '0 4px 15px rgba(128, 0, 0, 0.2)',
                     transition: 'all 0.3s'
                   }}
                 >
                   {loading ? <Loader2 className="animate-spin" size={20} style={{ margin: '0 auto' }} /> : 'Refresh Panchang'}
                 </button>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '-0.5rem' }}>
                    * Live data might take a moment to load due to high precision calculations.
                  </p>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      type="button"
                      onClick={handleShare}
                      style={{ 
                        flex: 1,
                        padding: '0.75rem', 
                        background: 'white', 
                        color: 'var(--gold)', 
                        border: '1px solid var(--gold)', 
                        borderRadius: '10px', 
                        cursor: 'pointer', 
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.3s'
                      }}
                    >
                      <Share2 size={16} /> Share Panchang
                    </button>
                    <button 
                      type="button"
                      onClick={() => window.print()}
                      style={{ 
                        flex: 1,
                        padding: '0.75rem', 
                        background: 'transparent', 
                        color: 'var(--text-muted)', 
                        border: '1px solid var(--border)', 
                        borderRadius: '10px', 
                        cursor: 'pointer', 
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        transition: 'all 0.3s'
                      }}
                    >
                      Print View
                    </button>
                  </div>
              </form>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div style={{ background: 'white', borderBottom: '1px solid var(--border)', position: 'sticky', top: '68px', zIndex: 10 }}>
          <div className="container-max" style={{ display: 'flex', gap: '3rem', padding: '0 2rem' }}>
            {[
              { id: 'panchang', label: 'Basics & Muhurat' },
              { id: 'choghadiya', label: 'Choghadiya' },
              { id: 'hora', label: 'Hora (Planetary Hours)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '1.25rem 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '3px solid var(--maroon)' : '3px solid transparent',
                  color: activeTab === tab.id ? 'var(--maroon)' : 'var(--text-muted)',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="container-max" style={{ padding: '4rem 2rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <Loader2 className="animate-spin" size={64} color="var(--gold)" style={{ margin: '0 auto 1.5rem' }} />
              <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>Calculating Vedic alignments...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: '#fff5f5', borderRadius: '20px', border: '1px solid #feb2b2' }}>
              <p style={{ color: '#c53030', fontWeight: 600, fontSize: '1.1rem', marginBottom: '1.5rem' }}>{error}</p>
              <button onClick={() => loadAllData()} style={{ padding: '0.8rem 2rem', background: 'var(--maroon)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Retry</button>
            </div>
          ) : (
            <>
              {/* Offline Mode Banner */}
              {isOffline && (
                <div style={{
                  marginBottom: '2rem',
                  padding: '1rem 1.5rem',
                  background: 'linear-gradient(135deg, #FFF8E1, #FFF3CD)',
                  border: '1px solid #F6C90E',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.9rem',
                  color: '#7B6000'
                }}>
                  <Info size={18} color="#F6A623" style={{ flexShrink: 0 }} />
                  <span>
                    <strong>Offline Vedic Calculation</strong> — Live API data is currently unavailable. 
                    Showing locally computed Panchang using precise astronomical algorithms. 
                    Data is accurate for ritual planning.
                  </span>
                </div>
              )}
              {/* TAB 1: PANCHANG BASICS */}
              {activeTab === 'panchang' && (
                <div className="fade-in">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                    {PANCHANG_BASICS.map(item => {
                      const Icon = item.icon
                      return (
                        <div key={item.label} className="panchang-box sacred-hover" style={{ 
                          padding: '1.5rem', 
                          background: 'white', 
                          borderRadius: '20px', 
                          border: '1px solid var(--border)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                          transition: 'transform 0.3s',
                          borderLeft: '4px solid var(--gold)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{ background: 'var(--gold-bg)', padding: '0.5rem', borderRadius: '10px' }}>
                              <Icon size={18} color="var(--maroon)" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1 }}>
                                {item.label}
                              </span>
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-deva)' }}>{item.hindiLabel}</span>
                            </div>
                          </div>
                          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>{item.value}</h3>
                          {item.end && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Clock size={10} /> Ends at {formatTime(item.end)}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Celestial Events Card */}
                  <div style={{ 
                    marginBottom: '4rem', 
                    padding: '2.5rem', 
                    background: 'linear-gradient(135deg, #2C1503 0%, #4A2508 100%)', 
                    borderRadius: '24px', 
                    color: 'white',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2.5rem',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(44, 21, 3, 0.15)'
                  }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Sunrise color="var(--gold-light)" size={32} />
                        <div>
                          <p style={{ fontSize: '0.7rem', color: 'var(--gold-light)', fontWeight: 700, textTransform: 'uppercase' }}>Sunrise & Sunset</p>
                          <p style={{ fontSize: '1.4rem', fontWeight: 600 }}>{formatTime(apiData.sunrise)} — {formatTime(apiData.sunset)}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Moon color="var(--gold-light)" size={32} />
                        <div>
                          <p style={{ fontSize: '0.7rem', color: 'var(--gold-light)', fontWeight: 700, textTransform: 'uppercase' }}>Moonrise & Moonset</p>
                          <p style={{ fontSize: '1.4rem', fontWeight: 600 }}>{formatTime(apiData.moonrise)} — {formatTime(apiData.moonset)}</p>
                        </div>
                      </div>
                    </div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Compass color="var(--gold-light)" size={32} />
                        <div>
                          <p style={{ fontSize: '0.7rem', color: 'var(--gold-light)', fontWeight: 700, textTransform: 'uppercase' }}>Sun Sign (Rashi)</p>
                          <p style={{ fontSize: '1.4rem', fontWeight: 600 }}>{apiData.planet_position?.find(p => p.name === 'Sun')?.zodiac?.name || 'Leo'}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Star color="var(--gold-light)" size={32} />
                        <div>
                          <p style={{ fontSize: '0.7rem', color: 'var(--gold-light)', fontWeight: 700, textTransform: 'uppercase' }}>Moon Sign (Rashi)</p>
                          <p style={{ fontSize: '1.4rem', fontWeight: 600 }}>{apiData.planet_position?.find(p => p.name === 'Moon')?.zodiac?.name || 'Taurus'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Decorative Element */}
                    <div style={{ position: 'absolute', right: '-50px', top: '-50px', opacity: 0.1 }}>
                      <Sun size={240} />
                    </div>
                  </div>

                  {/* Prime Muhurats Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    <div className="sacred-hover" style={{ background: 'linear-gradient(135deg, var(--gold-bg), white)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-gold)', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '-12px', left: '2rem', background: 'var(--gold)', color: 'white', padding: '0.2rem 1rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Most Sacred</div>
                      <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon)', fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Sunrise size={20} color="var(--gold)" /> Brahma Muhurat
                      </h3>
                      <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        {formatTime(calculateBrahmaMuhurat(apiData.sunrise))} — {formatTime(apiData.sunrise)}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Ideal for meditation, worship, and spiritual practices.</p>
                    </div>

                    <div className="sacred-hover" style={{ background: 'linear-gradient(135deg, #FFF9E6, white)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-gold)', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '-12px', left: '2rem', background: 'var(--maroon)', color: 'white', padding: '0.2rem 1rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Highly Auspicious</div>
                      <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon)', fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Sun size={20} color="var(--gold)" /> Abhijit Muhurat
                      </h3>
                      <p style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        {apiData.auspicious_period?.find(p => p.name.includes('Abhijit'))?.period[0]?.start ? 
                          `${formatTime(apiData.auspicious_period.find(p => p.name.includes('Abhijit')).period[0].start)} — ${formatTime(apiData.auspicious_period.find(p => p.name.includes('Abhijit')).period[0].end)}` : 
                          'No Abhijit Today'}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>The most favorable window for starting any new venture.</p>
                    </div>
                  </div>

                  {/* Vedic Guidance Card */}
                  <div className="sacred-hover" style={{ background: 'var(--bg-card)', padding: '3rem', borderRadius: '30px', border: '1px solid var(--border)', marginBottom: '4rem', display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: '1', minWidth: '300px' }}>
                      <SectionLabel>VEDIC GUIDANCE</SectionLabel>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--maroon)', margin: '1rem 0' }}>Spiritual Significance</h2>
                      <p style={{ fontSize: '1.1rem', color: 'var(--text-body)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                        Today's alignment of <strong>{getFirst(apiData.tithi)?.name} Tithi</strong> and <strong>{getFirst(apiData.nakshatra)?.name} Nakshatra</strong> creates a unique cosmic portal. 
                        {getFirst(apiData.tithi)?.name.includes('Ekadashi') ? ' This is an exceptionally powerful day for fasting and Vishnu worship.' : 
                         getFirst(apiData.tithi)?.name.includes('Purnima') ? ' The full moon energy is perfect for Satyanarayan Puja and meditation.' :
                         ' It is a balanced period suitable for regular spiritual activities and community service.'}
                      </p>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                         <div style={{ background: 'var(--gold-bg)', padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--maroon)' }}>Tithi: {getFirst(apiData.tithi)?.type || 'Nanda'}</div>
                         <div style={{ background: 'var(--gold-bg)', padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--maroon)' }}>Nakshatra Deity: {getFirst(apiData.nakshatra)?.deity || 'Vishnu'}</div>
                      </div>
                    </div>
                    <div style={{ width: '200px', height: '200px', borderRadius: '50%', background: 'var(--gold-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--gold)' }}>
                       <div style={{ textAlign: 'center' }}>
                         <Star size={48} color="var(--maroon)" style={{ marginBottom: '1rem' }} />
                         <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase' }}>Current Alignment</p>
                         <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--maroon)' }}>{getFirst(apiData.nakshatra)?.name}</p>
                       </div>
                    </div>
                  </div>

                  {/* Daily Sadhana Card */}
                  <div style={{ 
                    marginBottom: '4rem', 
                    padding: '3rem', 
                    background: 'linear-gradient(135deg, var(--maroon), #4A0404)', 
                    borderRadius: '30px', 
                    color: 'white',
                    textAlign: 'center',
                    boxShadow: '0 20px 50px rgba(123, 28, 28, 0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <SectionLabel style={{ color: 'var(--gold-light)' }}>DAILY SADHANA</SectionLabel>
                      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--gold-light)', margin: '1rem 0' }}>Nakshatra Shanti Mantra</h2>
                      <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>Chant this mantra 108 times to align with today's cosmic energy:</p>
                      <div style={{ 
                        background: 'rgba(255,255,255,0.1)', 
                        padding: '2rem', 
                        borderRadius: '20px', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        display: 'inline-block',
                        minWidth: '300px'
                      }}>
                        <p style={{ fontFamily: 'var(--font-deva)', fontSize: '2.2rem', marginBottom: '1rem' }}>
                          {NAKSHATRA_MANTRAS[getFirst(apiData.nakshatra)?.name] || 'ॐ नमो नारायणाय नमः'}
                        </p>
                        <p style={{ fontSize: '1rem', fontStyle: 'italic', opacity: 0.8 }}>
                          "{NAKSHATRA_MANTRAS[getFirst(apiData.nakshatra)?.name] || 'Om Namo Narayanaya Namah'}"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '4rem' }}>
                    <h2 className="section-heading" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>Graha Sthiti (Planetary Positions)</h2>
                    <div style={{ background: 'white', borderRadius: '30px', border: '1px solid var(--border)', overflowX: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                      <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: 'var(--bg-section-alt)', borderBottom: '2px solid var(--border)' }}>
                            <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--maroon)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem' }}>Planet</th>
                            <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--maroon)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem' }}>Rashi (Zodiac)</th>
                            <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--maroon)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem' }}>Degree</th>
                            <th style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--maroon)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {apiData.planet_position?.map((p, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f7fafc' }}>
                              <td style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gold-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--maroon)', fontWeight: 700, fontSize: '0.8rem' }}>
                                  {p.name.charAt(0)}
                                </div>
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</span>
                              </td>
                              <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-body)' }}>{p.zodiac?.name}</td>
                              <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-body)', fontFamily: 'monospace' }}>{p.degree?.toFixed(2)}°</td>
                              <td style={{ padding: '1.25rem 1.5rem' }}>
                                <span style={{ 
                                  padding: '0.3rem 0.75rem', 
                                  borderRadius: '50px', 
                                  fontSize: '0.7rem', 
                                  fontWeight: 700,
                                  background: p.is_retrograde ? '#FFF5F5' : '#F0FFF4',
                                  color: p.is_retrograde ? '#C53030' : '#2F855A'
                                }}>
                                  {p.is_retrograde ? 'Retrograde' : 'Direct'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Sun color="var(--gold)" /> Auspicious Muhurats
                      </h3>
                      {apiData.auspicious_period?.map((t, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.25rem 0', borderBottom: '1px solid #f7fafc' }}>
                          <div>
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>{t.name}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            {t.period.map((p, pidx) => (
                              <div key={pidx} style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.9rem' }}>
                                {formatTime(p.start)} — {formatTime(p.end)}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon)', fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Moon color="var(--maroon)" /> Inauspicious Times
                      </h3>
                      {apiData.inauspicious_period?.map((t, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.25rem 0', borderBottom: '1px solid #f7fafc' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</span>
                          <div style={{ textAlign: 'right' }}>
                            {t.period.map((p, pidx) => (
                              <div key={pidx} style={{ color: 'var(--maroon)', fontWeight: 600, fontSize: '0.9rem' }}>
                                {formatTime(p.start)} — {formatTime(p.end)}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CHOGHADIYA */}
              {activeTab === 'choghadiya' && choghadiya && (
                <div className="fade-in">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2.5rem' }}>
                    {['Day Choghadiya', 'Night Choghadiya'].map((title, sectionIdx) => {
                      const data = sectionIdx === 0 ? choghadiya.day_choghadiya : choghadiya.night_choghadiya;
                      if (!data) return null;
                      return (
                        <div key={title}>
                          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--maroon)', marginBottom: '1.5rem', textAlign: 'center' }}>{title}</h3>
                          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr style={{ background: 'var(--gold-bg)', borderBottom: '2px solid var(--border-gold)' }}>
                                  <th style={{ padding: '1.25rem', textAlign: 'left', color: 'var(--maroon)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>Time Period</th>
                                  <th style={{ padding: '1.25rem', textAlign: 'left', color: 'var(--maroon)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>Choghadiya</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data.map((item, idx) => {
                                  const isCurrent = isCurrentPeriod(item.start, item.end);
                                  return (
                                    <tr key={idx} style={{ 
                                      borderBottom: '1px solid #f0f0f0',
                                      background: isCurrent ? 'var(--gold-bg)' : 'transparent'
                                    }}>
                                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        {formatTime(item.start)} — {formatTime(item.end)}
                                        {isCurrent && (
                                          <span className="live-indicator" style={{ marginLeft: '1rem' }}>
                                            <span className="live-dot"></span> Live
                                          </span>
                                        )}
                                      </td>
                                      <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: getAuspiciousColor(item.name), fontSize: '1rem' }}>
                                        {item.name}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'var(--gold-bg)', borderRadius: '15px', border: '1px solid var(--border-gold)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <Info color="var(--gold)" size={20} />
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
                      <strong>Tip:</strong> Amrit, Shubh, Labh, and Chanchal are considered auspicious periods. Kaal, Udveg, and Rog should generally be avoided for important work.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: HORA */}
              {activeTab === 'hora' && hora && (
                <div className="fade-in">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2.5rem' }}>
                    {['Day Hora', 'Night Hora'].map((title, sectionIdx) => {
                      const data = sectionIdx === 0 ? hora.day_hora : hora.night_hora;
                      if (!data || data.length === 0) return null;
                      return (
                        <div key={title}>
                          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--gold)', marginBottom: '1.5rem', textAlign: 'center' }}>{title}</h3>
                          <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr style={{ background: 'var(--maroon-bg)', borderBottom: '2px solid var(--border)' }}>
                                  <th style={{ padding: '1.25rem', textAlign: 'left', color: 'var(--maroon)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>Time Range</th>
                                  <th style={{ padding: '1.25rem', textAlign: 'left', color: 'var(--maroon)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>Ruling Planet</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data.map((item, idx) => {
                                  const isCurrent = isCurrentPeriod(item.start, item.end);
                                  return (
                                    <tr key={idx} style={{ 
                                      borderBottom: '1px solid #f0f0f0',
                                      background: isCurrent ? 'var(--gold-bg)' : 'transparent'
                                    }}>
                                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        {formatTime(item.start)} — {formatTime(item.end)}
                                        {isCurrent && (
                                          <span className="live-indicator" style={{ marginLeft: '1rem' }}>
                                            <span className="live-dot"></span> Live
                                          </span>
                                        )}
                                      </td>
                                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold)' }}></div>
                                        {item.name}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Samvat Footer Info */}
              {apiData && activeTab === 'panchang' && (
                <div style={{ 
                  marginTop: '4rem', 
                  padding: '3rem', 
                  background: 'linear-gradient(135deg, var(--bg-card), white)', 
                  borderRadius: '30px', 
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                  position: 'relative'
                }}>
                  <div style={{ 
                    position: 'absolute', 
                    top: '-15px', 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    background: 'var(--maroon)', 
                    color: 'var(--gold)', 
                    padding: '0.4rem 1.5rem', 
                    borderRadius: '50px', 
                    fontSize: '0.75rem', 
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}>
                    VARANASI (KASHI) SYSTEM COMPATIBLE
                  </div>
                  
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--maroon)', fontSize: '1.6rem', marginBottom: '2.5rem', marginTop: '1rem' }}>Traditional Vedic Reckoning</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    {[
                      { label: 'Vikram Samvat', val: apiData.vikram_samvat?.name },
                      { label: 'Shaka Samvat', val: apiData.shaka_samvat?.name },
                      { label: 'Ritu (Season)', val: apiData.ritu?.name || 'Grishma' },
                      { label: 'Ayana', val: apiData.ayana?.name || 'Uttarayana' },
                      { label: 'Amanta Month', val: apiData.lunar_month?.amanta?.name },
                      { label: 'Purnimanta Month', val: apiData.lunar_month?.purnimanta?.name }
                    ].map(item => (
                      <div key={item.label}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{item.label}</p>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 600 }}>{item.val || 'N/A'}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ 
                    padding: '1.5rem', 
                    background: 'var(--gold-bg)', 
                    borderRadius: '20px', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '3rem', 
                    flexWrap: 'wrap',
                    border: '1px dashed var(--border-gold)'
                  }}>
                    <div>
                      <p style={{ fontSize: '0.65rem', color: 'var(--maroon)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Calculation Method</p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>Drik Siddhanta (Precise)</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.65rem', color: 'var(--maroon)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Ayanamsha</p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>Lahiri (Chitra Paksha)</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.65rem', color: 'var(--maroon)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Sunriser Setting</p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>Lagnasura (Local Sunrise)</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Festivals Grid (Always Visible) */}
          <div style={{ marginTop: '6rem' }}>
             <h2 className="section-heading" style={{ marginBottom: '2.5rem', fontSize: '2.2rem', textAlign: 'center' }}>Upcoming Festivals</h2>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
               {upcomingFestivals.map(f => (
                 <div key={f.id} style={{ 
                   backgroundColor: 'white', 
                   border: '1px solid var(--border)', 
                   borderRadius: '20px', 
                   padding: '1.5rem', 
                   display: 'flex', 
                   gap: '1.5rem', 
                   alignItems: 'center',
                   boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                   transition: 'all 0.3s'
                 }}>
                   <div style={{ 
                     background: 'linear-gradient(135deg, var(--maroon), #800000)', 
                     borderRadius: '15px', 
                     padding: '1rem', 
                     textAlign: 'center', 
                     minWidth: '70px',
                     boxShadow: '0 4px 10px rgba(128, 0, 0, 0.2)'
                   }}>
                     <p style={{ fontFamily: 'var(--font-cinzel-dec)', fontSize: '1.5rem', color: 'var(--gold)', lineHeight: 1 }}>{new Date(f.date).getDate()}</p>
                     <p style={{ fontSize: '0.7rem', color: 'white', textTransform: 'uppercase', fontWeight: 600 }}>{new Date(f.date).toLocaleString('en', { month: 'short' })}</p>
                   </div>
                   <div>
                     <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{f.name}</p>
                     <p style={{ fontFamily: 'var(--font-deva)', fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 500 }}>{f.hindiName}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </main>
      <Footer />
      <Sparkles active={showSparkles} />
    </>
  )
}
