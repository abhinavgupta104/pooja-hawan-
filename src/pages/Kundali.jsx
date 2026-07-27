import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Seo from '../components/Seo';
import { PAGES, breadcrumbSchema } from '../seo/seoConfig';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SectionLabel from '../components/common/SectionLabel';
import NorthIndianChart from '../components/Kundali/NorthIndianChart';
import { Loader2, Star, Sun, Moon, Zap, BookOpen, BarChart3, Grid3x3, Wifi, WifiOff, CheckCircle, Download } from 'lucide-react';
import { useBackendWarmup } from '../hooks/useBackendWarmup';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'https://kundali-backend-408824487148.asia-south1.run.app';

const PLANET_SYMBOLS = {
  Sun:'☉', Moon:'☽', Mars:'♂', Mercury:'☿', Jupiter:'♃',
  Venus:'♀', Saturn:'♄', Rahu:'☊', Ketu:'☋'
};

const STATUS_COLOR = {
  'Exalted':'#16a34a', 'Debilitated':'#dc2626',
  'Own Sign':'#2563eb', 'Neutral':'#6b7280'
};

// ─── Warmup Banner ────────────────────────────────────────────────────────────
function WarmupBanner({ status, elapsed }) {
  const progress = Math.min((elapsed / 45_000) * 100, 95); // 45 s estimated max

  const STEPS = [
    { label: 'Connecting to server…',     threshold: 0    },
    { label: 'Server is waking up…',       threshold: 5000 },
    { label: 'Loading Vedic algorithms…',  threshold: 15000 },
    { label: 'Preparing chart engine…',    threshold: 28000 },
    { label: 'Almost ready…',              threshold: 38000 },
  ];
  const currentStep = [...STEPS].reverse().find(s => elapsed >= s.threshold) || STEPS[0];

  if (status === 'idle') return null;
  if (status === 'ready') return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.65rem',
      padding: '0.6rem 1rem',
      background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
      border: '1px solid #6ee7b7',
      borderRadius: 10, marginBottom: '1.25rem',
      fontSize: '0.82rem', fontFamily: 'var(--font-body)', color: '#065f46',
      animation: 'fadeIn 0.4s ease',
    }}>
      <CheckCircle size={16} color="#10b981" style={{ flexShrink: 0 }} />
      <span><strong>Server ready</strong> — Kundali calculation is available. (warmed up in {(elapsed / 1000).toFixed(1)}s)</span>
    </div>
  );
  if (status === 'error') return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.65rem',
      padding: '0.6rem 1rem',
      background: '#fff7ed', border: '1px solid #fed7aa',
      borderRadius: 10, marginBottom: '1.25rem',
      fontSize: '0.82rem', fontFamily: 'var(--font-body)', color: '#92400e',
    }}>
      <WifiOff size={16} color="#f97316" style={{ flexShrink: 0 }} />
      <span><strong>Server may be slow.</strong> You can still submit — it will respond once it finishes waking up.</span>
    </div>
  );

  return (
    <div style={{
      padding: '0.9rem 1.1rem',
      background: 'linear-gradient(135deg, var(--gold-bg), #fffdf7)',
      border: '1px solid var(--border-gold)',
      borderRadius: 12, marginBottom: '1.25rem',
      fontFamily: 'var(--font-body)',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
        <Wifi size={15} color="var(--gold)" style={{ flexShrink: 0, animation: 'pulse 1.5s ease-in-out infinite' }} />
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--maroon)' }}>
          {currentStep.label}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {(elapsed / 1000).toFixed(0)}s
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        height: 5, borderRadius: 99,
        background: 'rgba(212,175,55,0.2)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--gold), var(--saffron))',
          borderRadius: 99,
          transition: 'width 0.5s ease',
        }} />
      </div>

      {/* Sub-text */}
      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.45rem', marginBottom: 0 }}>
        Our server runs on Render's free tier and sleeps when inactive. This happens only on first load — subsequent requests are instant.
      </p>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Kundali() {
  const [form, setForm] = useState({ name:'', date:'', time:'', place:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('chart');
  // While true every tab panel is rendered, so the saved PDF contains the
  // full reading rather than only the tab that happens to be open.
  const [printing, setPrinting] = useState(false);

  const downloadPdf = () => {
    // flushSync commits the "render every panel" update synchronously, so the
    // print dialog captures the complete chart rather than the current tab.
    flushSync(() => setPrinting(true));
    window.print();
    setPrinting(false);
  };

  // Ping backend on mount so it wakes up while the user fills out the form
  const { status: warmupStatus, elapsed: warmupElapsed } = useBackendWarmup(
    `${BACKEND}/health`,
    { timeout: 60_000 }
  );
  const serverReady = warmupStatus === 'ready' || warmupStatus === 'error';

  const generate = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setData(null);
    try {
      const res = await fetch(`${BACKEND}/api/kundali`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ dob: form.date, tob: form.time, place: form.place })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Server error');
      setData(json);
    } catch(err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const TABS = [
    { id:'chart',   label:'Chart',        icon: <Grid3x3 size={14}/> },
    { id:'planets', label:'Planets',      icon: <Star size={14}/> },
    { id:'panchang',label:'Panchang',     icon: <Sun size={14}/> },
    { id:'dasha',   label:'Dasha',        icon: <Moon size={14}/> },
    { id:'avakhada',label:'Avakhada',     icon: <BookOpen size={14}/> },
    { id:'yogas',   label:'Yogas & Doshas',icon: <Zap size={14}/> },
    { id:'ashtaka', label:'Ashtakavarga', icon: <BarChart3 size={14}/> },
  ];

  return (
    <>
      <Seo
        {...PAGES.kundali}
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Free Kundali', path: '/kundali' },
        ])}
      />
      <Navbar />
      <main style={{ paddingTop:68, background:'var(--bg-page)', minHeight:'100vh' }}>
        {/* Hero */}
        <div style={{ background:'var(--gold-bg)', padding:'3.5rem 0', borderBottom:'1px solid var(--border)' }}>
          <div className="container-max">
            <SectionLabel>VEDIC ASTROLOGY</SectionLabel>
            <h1 style={{ fontFamily:'var(--font-deva)', fontSize:'clamp(1.8rem,4vw,2.8rem)', color:'var(--text-primary)', marginBottom:'0.4rem' }}>
              Free Kundali (Birth Chart)
            </h1>
            <p style={{ color:'var(--text-muted)', maxWidth:580, fontFamily:'var(--font-body)' }}>
              Accurate Vedic Kundali with Lahiri Ayanamsa — Planets, Panchang, Avakhada Chakra, Vimshottari Dasha &amp; more.
            </p>
          </div>
        </div>

        <div className="container-max tool-shell" style={{ padding:'2.5rem 1.5rem' }}>
          <div className="tool-columns" style={{ display:'flex', flexWrap:'wrap', gap:'2.5rem', alignItems:'flex-start' }}>

            {/* ── Form ── */}
            <div className="tool-card no-print" style={{ flex:'1 1 300px', background:'var(--bg-card)', padding:'2rem', borderRadius:12,
              border:'1px solid var(--border)', boxShadow:'var(--shadow-card)', position:'sticky', top:80 }}>
              {/* Server warmup status banner */}
              <WarmupBanner status={warmupStatus} elapsed={warmupElapsed} />
              <h2 style={{ fontFamily:'var(--font-heading)', color:'var(--maroon)', marginBottom:'1.5rem', fontSize:'1.25rem' }}>
                Enter Birth Details
              </h2>
              <form onSubmit={generate}>
                <Field label="Full Name">
                  <input type="text" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={inp} placeholder="e.g. Rahul Sharma" />
                </Field>
                <div style={{ display:'flex', gap:'0.8rem' }}>
                  <Field label="Date of Birth" style={{ flex:1 }}>
                    <input type="date" required value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={inp} />
                  </Field>
                  <Field label="Time of Birth" style={{ flex:1 }}>
                    <input type="time" required value={form.time} onChange={e=>setForm({...form,time:e.target.value})} style={inp} />
                  </Field>
                </div>
                <Field label="Place of Birth">
                  <input type="text" required value={form.place} onChange={e=>setForm({...form,place:e.target.value})} style={inp} placeholder="e.g. Mumbai, India" />
                </Field>
                <button type="submit" disabled={loading || warmupStatus === 'warming'} style={{
                  width:'100%', padding:'0.9rem',
                  background: warmupStatus === 'warming' ? 'var(--text-muted)' : 'var(--maroon)',
                  color:'#fff',
                  border:'none', borderRadius:8,
                  cursor: warmupStatus === 'warming' ? 'not-allowed' : 'pointer',
                  fontFamily:'var(--font-heading)',
                  fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', marginTop:'0.5rem',
                  transition: 'background 0.3s ease',
                  opacity: warmupStatus === 'warming' ? 0.7 : 1,
                }}>
                  {loading ? (
                    <><Loader2 size={16} className="spinner" />Calculating…</>
                  ) : warmupStatus === 'warming' ? (
                    <><Loader2 size={16} className="spinner" />Server Waking Up…</>
                  ) : (
                    '✦ Generate Kundali'
                  )}
                </button>
              </form>

              {data && (
                <div style={{ marginTop:'1.5rem', padding:'1rem', background:'var(--gold-bg)', borderRadius:8, fontSize:'0.88rem' }}>
                  <div style={{ fontWeight:700, color:'var(--maroon)', marginBottom:'0.4rem' }}>Summary</div>
                  <InfoRow k="Lagna" v={`${data.lagna.rashi} (${data.lagna.degree}°)`} />
                  <InfoRow k="Lagna Lord" v={data.lagna.lord} />
                  <InfoRow k="Moon Sign" v={data.planets.Moon?.rashi} />
                  <InfoRow k="Nakshatra" v={`${data.planets.Moon?.nakshatra} Pada ${data.planets.Moon?.pada}`} />
                  <InfoRow k="Lucky Stone" v={data.lucky_details?.gemstone} />
                  <InfoRow k="Lucky No." v={data.lucky_details?.number} />
                  <InfoRow k="Lucky Color" v={data.lucky_details?.colors} />
                </div>
              )}
            </div>

            {/* ── Results ── */}
            <div style={{ flex:'2 1 560px' }}>
              {error && (
                <div style={{ padding:'1rem', background:'#ffebee', color:'#b71c1c', borderRadius:8, marginBottom:'1.5rem' }}>
                  ⚠ {error}
                </div>
              )}

              {!data && !loading && (
                <div style={{ padding:'4rem 2rem', textAlign:'center', background:'var(--bg-card)', borderRadius:12,
                  border:'1px solid var(--border)', color:'var(--text-muted)' }}>
                  <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🪐</div>
                  <p>Enter your birth details and click <strong>Generate Kundali</strong></p>
                </div>
              )}

              {data && (
                <div className="print-area print-all-panels" style={{ background:'var(--bg-card)', borderRadius:12, border:'1px solid var(--border)', overflow:'hidden' }}>
                  {/* Result header — name + PDF action. The heading is hidden
                      on screen (the hero already names the page) but gives the
                      printed sheet a proper title. */}
                  <div style={{
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    gap:'1rem', flexWrap:'wrap',
                    padding:'1rem 1.25rem', borderBottom:'1px solid var(--border)',
                  }}>
                    <div style={{ minWidth:0 }}>
                      <p style={{ fontFamily:'var(--font-heading)', fontSize:'1.02rem', color:'var(--maroon)', fontWeight:600, lineHeight:1.25 }}>
                        {form.name ? `${form.name}'s Kundali` : 'Your Kundali'}
                      </p>
                      <p style={{ fontFamily:'var(--font-body)', fontSize:'0.78rem', color:'var(--text-muted)', marginTop:2 }}>
                        {[form.date, form.time, data.meta?.place_resolved].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={downloadPdf}
                      className="no-print"
                      style={{
                        display:'inline-flex', alignItems:'center', gap:'0.45rem',
                        padding:'0.6rem 1.1rem', borderRadius:999,
                        border:'1.5px solid var(--border-gold)', background:'var(--gold-bg)',
                        color:'var(--maroon)', fontFamily:'var(--font-body)', fontSize:'0.85rem',
                        fontWeight:600, cursor:'pointer', flexShrink:0, minHeight:44,
                      }}
                    >
                      <Download size={15} /> Download PDF
                    </button>
                  </div>

                  {/* Tab bar */}
                  <div className="tool-tabs" style={{ display:'flex', overflowX:'auto', borderBottom:'1px solid var(--border)', background:'var(--gold-bg)' }}>
                    {TABS.map(t => (
                      <button key={t.id} onClick={()=>setTab(t.id)} style={{
                        padding:'0.75rem 1rem', border:'none', background:'none', cursor:'pointer',
                        fontFamily:'var(--font-heading)', fontSize:'0.8rem', whiteSpace:'nowrap',
                        color: tab===t.id ? 'var(--maroon)' : 'var(--text-muted)',
                        borderBottom: tab===t.id ? '2.5px solid var(--maroon)' : '2.5px solid transparent',
                        fontWeight: tab===t.id ? 700 : 400,
                        display:'flex', alignItems:'center', gap:'0.3rem'
                      }}>
                        {t.icon}{t.label}
                      </button>
                    ))}
                  </div>

                  <div style={{ padding:'1.5rem' }}>

                    {/* CHART TAB */}
                    {(tab==='chart' || printing) && (
                      <div className="tool-panel">
                        <SH>Birth Chart (Rasi — D1)</SH>
                        <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginBottom:'1rem' }}>
                          North Indian style · Lahiri Ayanamsa · Whole Sign houses · <span style={{color:'#c0392b',fontWeight:700}}>La</span> = Lagna · ® = Retrograde
                        </p>
                        <NorthIndianChart lagna={data.lagna} planets={data.planets} mode="rasi" />
                        <div style={{ height:'1.5rem' }}/>
                        <SH>Navamsa Chart (D9)</SH>
                        <NorthIndianChart lagna={data.lagna} planets={data.planets} navamsa={data.navamsa} mode="navamsa" />
                      </div>
                    )}

                    {/* PLANETS TAB */}
                    {(tab==='planets' || printing) && (
                      <div className="tool-panel">
                        <SH>Planetary Positions</SH>
                        <div style={{ overflowX:'auto' }}>
                          <table style={tbl}>
                            <thead>
                              <tr style={{ background:'var(--gold-bg)', color:'var(--maroon)' }}>
                                {['Planet','Sign','Deg°','House','Nakshatra','Pada','Status','R?'].map(h=>(
                                  <th key={h} style={th}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(data.planets).map(([name, p]) => (
                                <tr key={name} style={{ borderBottom:'1px solid var(--border)' }}>
                                  <td style={td}><span style={{ marginRight:4 }}>{PLANET_SYMBOLS[name]||''}</span><b>{name}</b></td>
                                  <td style={td}>{p.rashi}</td>
                                  <td style={td}>{p.degree?.toFixed(2)}°</td>
                                  <td style={{...td, textAlign:'center', fontWeight:700}}>{p.house}</td>
                                  <td style={td}>{p.nakshatra}</td>
                                  <td style={{...td, textAlign:'center'}}>{p.pada}</td>
                                  <td style={{...td, color: STATUS_COLOR[p.status]||'#6b7280', fontWeight:600}}>{p.status}</td>
                                  <td style={{...td, textAlign:'center'}}>{p.is_retrograde ? '® Yes' : '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {/* Lagna row */}
                        <div style={{ marginTop:'1rem', padding:'0.8rem 1rem', background:'var(--gold-bg)', borderRadius:8, fontSize:'0.9rem' }}>
                          <b>Ascendant (Lagna):</b> {data.lagna.rashi} &nbsp;|&nbsp;
                          <b>Degree:</b> {data.lagna.longitude?.toFixed(2)}° &nbsp;|&nbsp;
                          <b>Lord:</b> {data.lagna.lord}
                        </div>
                      </div>
                    )}

                    {/* PANCHANG TAB */}
                    {(tab==='panchang' || printing) && data.panchang && (
                      <div className="tool-panel">
                        <SH>Panchang at Birth</SH>
                        <table style={tbl}>
                          <tbody>
                            <TR2 k="Tithi" v={`${data.panchang.tithi.number}. ${data.panchang.tithi.name} (${data.panchang.tithi.paksha} Paksha)`} />
                            <TR2 k="Tithi Lord" v={data.panchang.tithi.lord} />
                            <TR2 k="Vara (Weekday)" v={`${data.panchang.vara.name} — Lord: ${data.panchang.vara.lord}`} />
                            <TR2 k="Yoga" v={`${data.panchang.yoga.number}. ${data.panchang.yoga.name}`} />
                            <TR2 k="Karana" v={data.panchang.karana.name} />
                            <TR2 k="Sunrise (UTC)" v={data.panchang.sunrise} />
                            <TR2 k="Sunset (UTC)" v={data.panchang.sunset} />
                            <TR2 k="Timezone" v={data.meta.timezone} />
                            <TR2 k="UTC Offset" v={data.meta.utc_offset} />
                            <TR2 k="Resolved Place" v={data.meta.place_resolved} />
                            <TR2 k="Coordinates" v={`${data.meta.lat}°N, ${data.meta.lon}°E`} />
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* DASHA TAB */}
                    {(tab==='dasha' || printing) && data.dasha && (
                      <div className="tool-panel">
                        <SH>Vimshottari Dasha</SH>
                        {data.dasha.current_mahadasha && (
                          <div style={{ padding:'1rem', background:'#fff3e0', borderRadius:8, marginBottom:'1.5rem', border:'1px solid #ffe0b2' }}>
                            <div style={{ fontWeight:700, color:'var(--maroon)', marginBottom:'0.3rem' }}>Current Mahadasha</div>
                            <div style={{ fontSize:'1.1rem', fontWeight:700 }}>{data.dasha.current_mahadasha.planet} Dasha</div>
                            <div style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>
                              {data.dasha.current_mahadasha.start} → {data.dasha.current_mahadasha.end}
                            </div>
                          </div>
                        )}
                        <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}>
                          {data.dasha.dasha_sequence?.map((md, i) => (
                            <details key={i} style={{ border:'1px solid var(--border)', borderRadius:8, overflow:'hidden' }}>
                              <summary style={{
                                padding:'0.8rem 1rem', cursor:'pointer', listStyle:'none',
                                display:'flex', justifyContent:'space-between', alignItems:'center',
                                background: data.dasha.current_mahadasha?.planet===md.planet ? '#fff3e0' : 'var(--gold-bg)',
                                fontWeight: data.dasha.current_mahadasha?.planet===md.planet ? 700 : 400,
                                color: data.dasha.current_mahadasha?.planet===md.planet ? 'var(--maroon)' : 'var(--text-primary)'
                              }}>
                                <span>{PLANET_SYMBOLS[md.planet]||''} {md.planet} Mahadasha {data.dasha.current_mahadasha?.planet===md.planet ? '← Current' : ''}</span>
                                <span style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{md.start} → {md.end}</span>
                              </summary>
                              <div style={{ padding:'0.8rem' }}>
                                <table style={tbl}>
                                  <thead><tr style={{background:'var(--gold-bg)'}}>
                                    <th style={th}>Antardasha Planet</th><th style={th}>Start</th><th style={th}>End</th>
                                  </tr></thead>
                                  <tbody>
                                    {md.antardashas?.map((ad,j)=>(
                                      <tr key={j} style={{ borderBottom:'1px solid var(--border)' }}>
                                        <td style={td}>{PLANET_SYMBOLS[ad.planet]||''} {ad.planet}</td>
                                        <td style={td}>{ad.start}</td>
                                        <td style={td}>{ad.end}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </details>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AVAKHADA TAB */}
                    {(tab==='avakhada' || printing) && data.avakhada && (
                      <div className="tool-panel">
                        <SH>Avakhada Chakra</SH>
                        <p style={{ fontSize:'0.83rem', color:'var(--text-muted)', marginBottom:'1rem' }}>
                          Core Vedic identifiers derived from Moon's position at birth.
                        </p>
                        <table style={tbl}>
                          <tbody>
                            <TR2 k="Janma Rashi (Moon Sign)" v={data.avakhada.rashi} />
                            <TR2 k="Janma Nakshatra" v={`${data.avakhada.nakshatra} (Pada ${data.avakhada.pada})`} />
                            <TR2 k="Lagna (Ascendant Rashi)" v={data.avakhada.lagna_rashi} />
                            <TR2 k="Lagna Lord" v={data.avakhada.lagna_lord} />
                            <TR2 k="Varna" v={data.avakhada.varna} />
                            <TR2 k="Vashya" v={data.avakhada.vashya} />
                            <TR2 k="Yoni" v={data.avakhada.yoni} />
                            <TR2 k="Gana" v={data.avakhada.gana} />
                            <TR2 k="Nadi" v={data.avakhada.nadi} />
                            <TR2 k="Tara" v={data.avakhada.tara} />
                            <TR2 k="Tatwa (Element)" v={data.avakhada.tatwa} />
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* YOGAS & DOSHAS TAB */}
                    {(tab==='yogas' || printing) && (
                      <div className="tool-panel">
                        <SH>Yogas Detected</SH>
                        {data.yogas?.length ? (
                          <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem', marginBottom:'2rem' }}>
                            {data.yogas.map((y,i) => (
                              <div key={i} style={{ padding:'1rem', background:'#e8f5e9', borderRadius:8, border:'1px solid #c8e6c9' }}>
                                <div style={{ fontWeight:700, color:'#1b5e20', marginBottom:'0.3rem' }}>✓ {y.name}</div>
                                <div style={{ fontSize:'0.88rem', color:'#2e7d32' }}>{y.description}</div>
                              </div>
                            ))}
                          </div>
                        ) : <p style={{ color:'var(--text-muted)' }}>No major yogas detected.</p>}

                        <SH>Doshas</SH>
                        <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}>
                          {data.doshas?.map((d,i) => (
                            <div key={i} style={{
                              padding:'1rem', borderRadius:8, border:'1px solid',
                              background: d.has_dosha ? '#ffebee' : '#e8f5e9',
                              borderColor: d.has_dosha ? '#ffcdd2' : '#c8e6c9'
                            }}>
                              <div style={{ fontWeight:700, color: d.has_dosha ? '#b71c1c' : '#1b5e20', marginBottom:'0.3rem' }}>
                                {d.has_dosha ? '⚠ ' : '✓ '}{d.name}
                              </div>
                              <div style={{ fontSize:'0.88rem', color: d.has_dosha ? '#c62828' : '#2e7d32' }}>{d.description}</div>
                              {d.affected_houses && (
                                <div style={{ fontSize:'0.8rem', marginTop:'0.3rem', color:'var(--text-muted)' }}>
                                  Affected Houses: {d.affected_houses.join(', ')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ASHTAKAVARGA TAB */}
                    {(tab==='ashtaka' || printing) && data.ashtakavarga && (
                      <div className="tool-panel">
                        <SH>Ashtakavarga — Bindu Table</SH>
                        <p style={{ fontSize:'0.83rem', color:'var(--text-muted)', marginBottom:'1rem' }}>
                          Bindus (benefic points) for each planet across all 12 signs. Higher = stronger.
                        </p>
                        <div style={{ overflowX:'auto' }}>
                          <table style={tbl}>
                            <thead>
                              <tr style={{ background:'var(--gold-bg)', color:'var(--maroon)' }}>
                                <th style={th}>Planet</th>
                                {['Ari','Tau','Gem','Can','Leo','Vir','Lib','Sco','Sag','Cap','Aqu','Pis'].map(s=>(
                                  <th key={s} style={{...th, textAlign:'center'}}>{s}</th>
                                ))}
                                <th style={{...th, textAlign:'center'}}>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(data.ashtakavarga).map(([planet, row]) => {
                                const vals = Array.isArray(row) ? row : Object.values(row);
                                const total = vals.reduce((a,b)=>a+(b||0), 0);
                                return (
                                  <tr key={planet} style={{ borderBottom:'1px solid var(--border)' }}>
                                    <td style={{...td, fontWeight:700}}>{PLANET_SYMBOLS[planet]||''} {planet}</td>
                                    {vals.slice(0,12).map((v,i)=>(
                                      <td key={i} style={{
                                        ...td, textAlign:'center',
                                        background: v>=5 ? '#e8f5e9' : v<=2 ? '#ffebee' : 'transparent',
                                        color: v>=5 ? '#1b5e20' : v<=2 ? '#b71c1c' : 'inherit',
                                        fontWeight: v>=5||v<=2 ? 700 : 400
                                      }}>{v}</td>
                                    ))}
                                    <td style={{...td, textAlign:'center', fontWeight:700, background:'var(--gold-bg)'}}>{total}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                  </div>
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

// Helper components
function Field({ label, children, style }) {
  return (
    <div style={{ marginBottom:'1rem', ...style }}>
      <label style={{ display:'block', fontSize:'0.82rem', color:'var(--text-muted)', marginBottom:'0.4rem', fontWeight:500 }}>{label}</label>
      {children}
    </div>
  );
}
function InfoRow({ k, v }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.83rem', padding:'0.2rem 0', borderBottom:'1px solid rgba(0,0,0,0.06)' }}>
      <span style={{ color:'var(--text-muted)' }}>{k}</span>
      <span style={{ fontWeight:600 }}>{v}</span>
    </div>
  );
}
function SH({ children }) {
  return <h3 style={{ fontFamily:'var(--font-heading)', color:'var(--maroon)', fontSize:'1.05rem',
    marginBottom:'1rem', borderBottom:'1px solid var(--gold)', paddingBottom:'0.4rem' }}>{children}</h3>;
}
function TR2({ k, v }) {
  return (
    <tr style={{ borderBottom:'1px solid var(--border)' }}>
      <td style={{ padding:'0.7rem 0.8rem', color:'var(--text-muted)', fontWeight:500, width:'40%', fontSize:'0.9rem' }}>{k}</td>
      <td style={{ padding:'0.7rem 0.8rem', color:'var(--text-primary)', fontSize:'0.9rem' }}>{v}</td>
    </tr>
  );
}

const inp = {
  width:'100%', padding:'0.7rem 0.9rem', borderRadius:6,
  border:'1px solid var(--border)', fontFamily:'var(--font-body)',
  fontSize:'0.95rem', background:'transparent', outline:'none', boxSizing:'border-box'
};
const tbl = { width:'100%', borderCollapse:'collapse', fontFamily:'var(--font-body)', fontSize:'0.88rem' };
const th  = { padding:'0.6rem 0.8rem', textAlign:'left', fontWeight:700, fontSize:'0.8rem' };
const td  = { padding:'0.6rem 0.8rem', verticalAlign:'middle' };