import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SectionLabel from '../components/common/SectionLabel';
import { Loader2 } from 'lucide-react';

export default function Kundali() {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    lat: '',
    lon: ''
  });
  
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // States for multiple endpoints
  const [kundliData, setKundliData] = useState(null);
  const [panchangData, setPanchangData] = useState(null);
  const [planetData, setPlanetData] = useState(null);
  const [chartSvg, setChartSvg] = useState(null);

  const handleLocationSearch = async () => {
    if (!formData.location) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${formData.location}&format=json`);
      const data = await res.json();
      if (data && data.length > 0) {
        setFormData(prev => ({ ...prev, lat: data[0].lat, lon: data[0].lon }));
        alert(`Location found: ${data[0].display_name}`);
      } else {
        alert("Location not found.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const generateKundali = async (e) => {
    e.preventDefault();
    if (!formData.lat || !formData.lon) {
      alert("Please auto-detect location first.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // PROPER TIMEZONE ENCODING AND HANDLING
      // Construct date string ensuring local time format is appended with +05:30 natively
      const datetime = `${formData.date}T${formData.time}:00+05:30`;
      const coordinates = `${formData.lat},${formData.lon}`;
      
      const baseUrl = 'http://localhost:3001/api/prokerala';
      const queryStr = `?coordinates=${coordinates}&datetime=${encodeURIComponent(datetime)}`;
      
      // Fetch multiple endpoints simultaneously
      const [resKundli, resPanchang, resPlanets, resChart] = await Promise.all([
        fetch(`${baseUrl}/kundli${queryStr}`),
        fetch(`${baseUrl}/panchang/advanced${queryStr}`),
        fetch(`${baseUrl}/planet-position${queryStr}`),
        fetch(`${baseUrl}/chart${queryStr}&chart_style=north-indian&chart_type=rasi`)
      ]);
      
      const [kundli, panchang, planets, chart] = await Promise.all([
        resKundli.ok ? resKundli.json() : null,
        resPanchang.ok ? resPanchang.json() : null,
        resPlanets.ok ? resPlanets.json() : null,
        resChart.ok ? resChart.json() : null
      ]);

      if (kundli && !kundli.errors) setKundliData(kundli.data);
      if (panchang && !panchang.errors) setPanchangData(panchang.data);
      if (planets && !planets.errors) setPlanetData(planets.data);
      if (chart && !chart.errors) setChartSvg(chart.data?.svg || null);

      if (!kundli && !panchang && !planets) {
          setError("Failed to generate Kundali. Could not retrieve valid data.");
      }
      
    } catch (e) {
      console.error("API error:", e);
      setError("Network error connecting to proxy server. Please ensure it's running.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime12hr = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const renderTabs = () => (
    <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--border)', marginBottom: '2rem', overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '0.5rem' }}>
      {['basic', 'panchang', 'planets', 'chart', 'mangal'].map(tab => (
        <button 
          key={tab}
          onClick={() => setActiveTab(tab)}
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer', 
            padding: '0.5rem 1rem', fontSize: '1rem', fontFamily: 'var(--font-heading)',
            color: activeTab === tab ? 'var(--maroon)' : 'var(--text-muted)',
            borderBottom: activeTab === tab ? '2px solid var(--maroon)' : 'none',
            fontWeight: activeTab === tab ? 'bold' : 'normal',
            textTransform: 'capitalize'
          }}
        >
          {tab === 'mangal' ? 'Mangal Dosha' : tab}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '68px', backgroundColor: 'var(--bg-page)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ backgroundColor: 'var(--gold-bg)', padding: '4rem 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container-max">
            <SectionLabel>VEDIC ASTROLOGY</SectionLabel>
            <h1 style={{ fontFamily: 'var(--font-deva)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Detailed Kundali Chart
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px' }}>
              Generate your detailed birth chart with accurate planetary positions, Panchang details, and Avakhada Chakra just like professional Vedic Astrologers.
            </p>
          </div>
        </div>

        <div className="container-max" style={{ padding: '3rem 2rem', flex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'flex-start' }}>
            
            {/* Form Section */}
            <div style={{ flex: '1 1 350px', backgroundColor: 'var(--bg-card)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--maroon)', marginBottom: '1.5rem' }}>Birth Details</h2>
              <form onSubmit={generateKundali}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ marginBottom: '1rem', flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Date</label>
                    <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} style={inputStyle} />
                  </div>
                  <div style={{ marginBottom: '1rem', flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Time</label>
                    <input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} style={inputStyle} />
                  </div>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem' }}>City of Birth</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={{...inputStyle, flex: 1}} placeholder="e.g. Mumbai" />
                    <button type="button" onClick={handleLocationSearch} style={{ padding: '0 1rem', background: 'var(--gold)', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'var(--text-primary)' }}>Detect</button>
                  </div>
                </div>
                
                <button type="submit" disabled={loading} style={{ backgroundColor: 'var(--maroon)', color: 'white', width: '100%', padding: '1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  {loading ? <><Loader2 className="spinner" /> Calculating Details...</> : 'Generate Kundali'}
                </button>
              </form>
            </div>

            {/* Results Section */}
            <div style={{ flex: '2 1 600px' }}>
                {error && <div style={{ padding: '1rem', background: '#ffebee', color: 'darkred', borderRadius: '8px', marginBottom: '2rem' }}>{error} <button onClick={generateKundali} style={{marginLeft: '1rem', cursor: 'pointer'}}>Retry</button></div>}
                
                {(kundliData || panchangData || planetData) && (
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                        {renderTabs()}
                        
                        {/* TAB: BASIC */}
                        {activeTab === 'basic' && (
                            <div>
                                <h3 style={sectionHeadingStyle}>Basic Details</h3>
                                <table style={tableStyle}>
                                    <tbody>
                                        <tr><td style={tdLabelStyle}>Name</td><td style={tdValueStyle}>{formData.name}</td></tr>
                                        <tr><td style={tdLabelStyle}>Date of Birth</td><td style={tdValueStyle}>{new Date(formData.date).toLocaleDateString('en-IN', {day:'numeric', month:'long', year:'numeric'})}</td></tr>
                                        <tr><td style={tdLabelStyle}>Time of Birth</td><td style={tdValueStyle}>{formatTime12hr(formData.time)}</td></tr>
                                        <tr><td style={tdLabelStyle}>Place</td><td style={tdValueStyle}>{formData.location} (Lat: {formData.lat}, Lon: {formData.lon})</td></tr>
                                    </tbody>
                                </table>
                                
                                {panchangData && (
                                    <>
                                        <h3 style={{...sectionHeadingStyle, marginTop: '2rem'}}>Sun / Moon Information</h3>
                                        <table style={tableStyle}>
                                            <tbody>
                                                <tr><td style={tdLabelStyle}>Sunrise</td><td style={tdValueStyle}>{new Date(panchangData.sunrise).toLocaleTimeString()}</td></tr>
                                                <tr><td style={tdLabelStyle}>Sunset</td><td style={tdValueStyle}>{new Date(panchangData.sunset).toLocaleTimeString()}</td></tr>
                                                <tr><td style={tdLabelStyle}>Ayanamsha</td><td style={tdValueStyle}>{panchangData.ayanamsha || "Lahiri"}</td></tr>
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </div>
                        )}

                        {/* TAB: PANCHANG */}
                        {activeTab === 'panchang' && panchangData && kundliData && (
                            <div>
                                <h3 style={sectionHeadingStyle}>Panchang Details & Avakhada Chakra</h3>
                                <table style={tableStyle}>
                                    <tbody>
                                        <tr><td style={tdLabelStyle}>Tithi</td><td style={tdValueStyle}>{panchangData.tithi?.name}</td></tr>
                                        <tr><td style={tdLabelStyle}>Karan</td><td style={tdValueStyle}>{panchangData.karana?.name}</td></tr>
                                        <tr><td style={tdLabelStyle}>Yog</td><td style={tdValueStyle}>{panchangData.yoga?.name}</td></tr>
                                        <tr><td style={tdLabelStyle}>Sign (Rashi)</td><td style={tdValueStyle}>{kundliData.nakshatra_details?.chandra_rasi?.name}</td></tr>
                                        <tr><td style={tdLabelStyle}>Sign Lord</td><td style={tdValueStyle}>{kundliData.nakshatra_details?.chandra_rasi?.lord?.name}</td></tr>
                                        <tr><td style={tdLabelStyle}>Nakshatra</td><td style={tdValueStyle}>{kundliData.nakshatra_details?.nakshatra?.name}</td></tr>
                                        <tr><td style={tdLabelStyle}>Nakshatra-Charan (Pada)</td><td style={tdValueStyle}>{kundliData.nakshatra_details?.nakshatra?.pada}</td></tr>
                                        {Object.entries(kundliData.nakshatra_details?.additional_info || {}).map(([key, val]) => (
                                          <tr key={key}><td style={tdLabelStyle}>{key.replace(/_/g, ' ').toUpperCase()}</td><td style={tdValueStyle}>{val}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* TAB: PLANETS */}
                        {activeTab === 'planets' && planetData && (
                            <div>
                                <h3 style={sectionHeadingStyle}>Planetary Positions</h3>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{...tableStyle, width: '100%', minWidth: '600px'}}>
                                        <thead>
                                            <tr style={{ backgroundColor: 'var(--gold-bg)', color: 'var(--maroon)' }}>
                                                <th style={{padding: '1rem', textAlign: 'left'}}>Planet</th>
                                                <th style={{padding: '1rem', textAlign: 'left'}}>Sign</th>
                                                <th style={{padding: '1rem', textAlign: 'left'}}>Degree</th>
                                                <th style={{padding: '1rem', textAlign: 'left'}}>Retrograde?</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {planetData.planet_position?.map((planet) => (
                                                <tr key={planet.id}>
                                                    <td style={tdValueStyle}>{planet.name}</td>
                                                    <td style={tdValueStyle}>{planet.rasi?.name}</td>
                                                    <td style={tdValueStyle}>{planet.degree?.toFixed(2)}°</td>
                                                    <td style={tdValueStyle}>{planet.is_retrograde ? 'Yes' : 'No'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* TAB: CHART */}
                        {activeTab === 'chart' && (
                            <div>
                                <h3 style={sectionHeadingStyle}>Kundli Birth Chart (Rasi)</h3>
                                {chartSvg ? (
                                    <div dangerouslySetInnerHTML={{ __html: chartSvg }} className="astrology-chart-container" />
                                ) : (
                                    <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--gold-bg)', borderRadius: '8px' }}>
                                        <p style={{ color: 'var(--maroon)' }}>Chart SVG could not be loaded or endpoint returned empty.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB: MANGAL DOSHA */}
                        {activeTab === 'mangal' && kundliData && (
                            <div>
                                <h3 style={sectionHeadingStyle}>Mangal Dosha Analysis</h3>
                                <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: kundliData.mangal_dosha?.has_dosha ? '#ffebee' : '#e8f5e9' }}>
                                    <h4 style={{ color: kundliData.mangal_dosha?.has_dosha ? 'darkred' : 'darkgreen', marginBottom: '0.5rem' }}>
                                        {kundliData.mangal_dosha?.has_dosha ? 'Manglik Dosha Present' : 'No Manglik Dosha'}
                                    </h4>
                                    <p style={{ fontFamily: 'var(--font-body)' }}>{kundliData.mangal_dosha?.description}</p>
                                </div>
                            </div>
                        )}
                        
                    </div>
                )}
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const inputStyle = {
    width: '100%', padding: '0.8rem 1rem', borderRadius: '8px',
    border: '1px solid var(--border)', fontFamily: 'var(--font-body)',
    fontSize: '1rem', backgroundColor: 'transparent', outline: 'none'
};

const sectionHeadingStyle = {
    color: 'var(--maroon)',
    fontFamily: 'var(--font-heading)',
    fontSize: '1.2rem',
    marginBottom: '1rem',
    borderBottom: '1px solid var(--gold)',
    paddingBottom: '0.5rem'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem'
};

const tdLabelStyle = {
    padding: '0.8rem',
    borderBottom: '1px solid var(--border)',
    color: 'var(--text-muted)',
    width: '40%',
    fontWeight: '500'
};

const tdValueStyle = {
    padding: '0.8rem',
    borderBottom: '1px solid var(--border)',
    color: 'var(--text-primary)'
};