import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Seo from '../components/Seo'
import { getFirebaseAuth, isConfigured } from '../utils/firebaseClient'
import { fetchLeads, fetchTraffic, updateLeadStatus, deleteLead } from '../utils/leadsApi'
import { TrendChart, TypeMixChart, TopPoojasChart, TrafficChart, RankedList } from '../components/admin/LeadCharts'
import { SERIES, buildDailySeries, relativeTime, formatWhen } from '../components/admin/leadChartData'

const TYPES = [
  { value: 'all', label: 'All' },
  { value: 'booking', label: 'Bookings' },
  { value: 'enquiry', label: 'Callbacks' },
  { value: 'contact', label: 'Messages' },
]

// Workflow stages. Confirmed/cancelled carry real good/bad meaning, so they
// wear status tokens; the in-progress stages stay brand-neutral.
const STATUSES = [
  { value: 'new', label: 'New', color: '#B8892E' },
  { value: 'contacted', label: 'Contacted', color: '#4A3AA7' },
  { value: 'confirmed', label: 'Confirmed', color: '#0ca30c' },
  { value: 'cancelled', label: 'Cancelled', color: '#d03b3b' },
]

const RANGES = [
  { value: 7, label: '7 days' },
  { value: 30, label: '30 days' },
  { value: 90, label: '90 days' },
  { value: 0, label: 'All time' },
]

const CSV_COLUMNS = [
  'createdAt', 'type', 'status', 'name', 'phone', 'email', 'city',
  'pujaName', 'variant', 'date', 'time', 'language', 'address',
  'interest', 'message', 'instructions', 'consent',
]

function toCsv(rows) {
  const esc = (v) => {
    const s = v == null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [CSV_COLUMNS.join(','), ...rows.map((r) => CSV_COLUMNS.map((c) => esc(r[c])).join(','))].join('\n')
}

export default function Admin() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(isConfigured)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [signingIn, setSigningIn] = useState(false)
  const [resetNotice, setResetNotice] = useState('')

  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [range, setRange] = useState(30)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  // One timestamp per load keeps every derived value pure and consistent.
  const [now, setNow] = useState(() => Date.now())
  const [traffic, setTraffic] = useState(null)

  useEffect(() => {
    if (!isConfigured) return
    let unsub = () => {}
    getFirebaseAuth()
      .then(({ auth, onAuthStateChanged }) => {
        unsub = onAuthStateChanged(auth, (u) => { setUser(u); setChecking(false) })
      })
      .catch(() => setChecking(false))
    return () => unsub()
  }, [])

  // Always fetch the full set; filtering happens client-side so the charts and
  // the table always describe the same slice.
  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setLoadError('')
    try {
      const token = await user.getIdToken()
      const [leadRows, trafficSummary] = await Promise.all([
        fetchLeads(token, { limit: 500 }),
        // Traffic is a bonus panel — never let it break the leads view.
        fetchTraffic(token, range || 30).catch(() => null),
      ])
      setLeads(leadRows)
      setTraffic(trafficSummary)
      setNow(Date.now())
    } catch (err) {
      setLoadError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user, range])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load() }, [load])

  const signIn = async (e) => {
    e.preventDefault()
    setAuthError(''); setSigningIn(true)
    try {
      const { auth, signInWithEmailAndPassword } = await getFirebaseAuth()
      await signInWithEmailAndPassword(auth, email.trim(), password)
      setPassword('')
    } catch (err) {
      setAuthError(
        err?.code === 'auth/too-many-requests'
          ? 'Too many attempts. Please wait a few minutes and try again.'
          : 'Incorrect email or password.',
      )
    } finally { setSigningIn(false) }
  }

  const sendReset = async () => {
    setAuthError(''); setResetNotice('')
    if (!email.trim()) { setAuthError('Enter your email address first, then click “Forgot password?”.'); return }
    try {
      const { auth, sendPasswordResetEmail } = await getFirebaseAuth()
      await sendPasswordResetEmail(auth, email.trim())
    } catch { /* same notice either way — don't reveal which emails exist */ }
    setResetNotice('If that email has an account, a reset link is on its way. Check your inbox and spam folder.')
  }

  const signOutNow = async () => {
    const { auth, signOut } = await getFirebaseAuth()
    await signOut(auth)
    setLeads([])
  }

  const changeStatus = async (id, status) => {
    const prev = leads
    setLeads((rows) => rows.map((r) => (r.id === id ? { ...r, status } : r)))
    try {
      const token = await user.getIdToken()
      await updateLeadStatus(token, id, status)
    } catch (err) { setLeads(prev); setLoadError(err.message) }
  }

  const removeLead = async (id) => {
    if (!window.confirm('Permanently delete this lead? This cannot be undone.')) return
    const prev = leads
    setLeads((rows) => rows.filter((r) => r.id !== id))
    try {
      const token = await user.getIdToken()
      await deleteLead(token, id)
    } catch (err) { setLeads(prev); setLoadError(err.message) }
  }

  // ── One filtered slice drives every chart and the table ─────
  const visible = useMemo(() => {
    const cutoff = range ? now - range * 86400000 : 0
    const q = search.trim().toLowerCase()
    return leads.filter((l) => {
      if (range && new Date(l.createdAt).getTime() < cutoff) return false
      if (typeFilter !== 'all' && l.type !== typeFilter) return false
      if (statusFilter !== 'all' && (l.status || 'new') !== statusFilter) return false
      if (q) {
        const hay = [l.name, l.phone, l.email, l.city, l.pujaName, l.message, l.interest]
          .filter(Boolean).join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [leads, now, range, typeFilter, statusFilter, search])

  const typeCounts = useMemo(() => {
    const c = {}
    visible.forEach((l) => { c[l.type] = (c[l.type] || 0) + 1 })
    return c
  }, [visible])

  const statusCounts = useMemo(() => {
    const c = {}
    visible.forEach((l) => { const s = l.status || 'new'; c[s] = (c[s] || 0) + 1 })
    return c
  }, [visible])

  const trendData = useMemo(() => buildDailySeries(visible, range || 30, now), [visible, range, now])

  const exportCsv = () => {
    const blob = new Blob([toCsv(visible)], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pujahavan-leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const seo = { path: '/admin', title: 'Admin — Puja Havan', description: 'Internal admin area.' }

  if (!isConfigured) {
    return (<><Seo {...seo} noindex /><Shell>
      <h1 style={S.h1}>Admin</h1>
      <p style={{ ...S.body, color: 'var(--maroon)' }}>
        Firebase is not configured. Add the <code>VITE_FIREBASE_*</code> values to <code>.env</code> and rebuild.
      </p>
    </Shell></>)
  }

  if (checking) {
    return (<><Seo {...seo} noindex /><Shell><p style={S.body}>Loading…</p></Shell></>)
  }

  if (!user) {
    return (<><Seo {...seo} noindex /><Shell>
      <h1 style={S.h1}>Admin Sign In</h1>
      <p style={{ ...S.body, marginBottom: '1.75rem' }}>Authorised staff only.</p>
      <form onSubmit={signIn} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        <div className="form-field">
          <label className="form-label" htmlFor="admin-email">Email</label>
          <input id="admin-email" type="email" required autoComplete="username" className="form-input"
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="admin-password">Password</label>
          <input id="admin-password" type="password" required autoComplete="current-password" className="form-input"
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {authError && <p role="alert" style={{ color: 'var(--maroon)', fontSize: '0.85rem', fontFamily: 'var(--font-body)' }}>{authError}</p>}
        {resetNotice && <p role="status" style={{ color: 'var(--text-gold)', fontSize: '0.85rem', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>{resetNotice}</p>}
        <button type="submit" className="btn-primary" disabled={signingIn} style={{ justifyContent: 'center', cursor: signingIn ? 'wait' : 'pointer' }}>
          {signingIn ? 'Signing in…' : 'Sign In'}
        </button>
        <button type="button" onClick={sendReset} style={S.linkBtn}>Forgot password?</button>
      </form>
    </Shell></>)
  }

  const conversion = visible.length ? Math.round(((statusCounts.confirmed || 0) / visible.length) * 100) : 0

  return (
    <>
      <Seo {...seo} noindex />
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
        {/* Header */}
        <header style={{ backgroundColor: 'var(--bg-dark)', padding: '1.1rem 0' }}>
          <div className="container-max" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-light)' }}>Puja Havan — Leads</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(248,239,220,0.55)' }}>{user.email}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button onClick={load} style={S.ghost}>Refresh</button>
              <button onClick={exportCsv} disabled={!visible.length} style={S.ghost}>Export CSV</button>
              <button onClick={signOutNow} style={S.ghost}>Sign Out</button>
            </div>
          </div>
        </header>

        <div className="container-max" style={{ padding: '1.75rem 2rem 3rem', opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
          {/* ── One filter row, above everything it scopes ── */}
          <div className="admin-filters" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '1.75rem' }}>
            <Filter label="Period" value={range} onChange={setRange} options={RANGES} />
            <Filter label="Type" value={typeFilter} onChange={setTypeFilter} options={TYPES} />
            <Filter label="Status" value={statusFilter} onChange={setStatusFilter}
              options={[{ value: 'all', label: 'All' }, ...STATUSES.map((s) => ({ value: s.value, label: s.label }))]} />
            <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
              <p style={S.filterLabel}>Search</p>
              <input
                type="search" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, phone, city, puja…"
                className="form-input" style={{ height: '34px', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {loadError && <p role="alert" style={{ color: 'var(--maroon)', fontFamily: 'var(--font-body)', marginBottom: '1rem' }}>{loadError}</p>}

          {/* ── KPI row ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.9rem', marginBottom: '1.25rem' }}>
            <Stat label="Total leads" value={visible.length} hero />
            {STATUSES.map((s) => <Stat key={s.value} label={s.label} value={statusCounts[s.value] || 0} color={s.color} />)}
            <Stat label="Confirmed rate" value={`${conversion}%`} />
          </div>

          {/* ── Traffic ── */}
          <div className="admin-chart-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
            <Card title="Site traffic" sub={`Anonymous counts · last ${range || 30} days`}>
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '0.9rem', flexWrap: 'wrap' }}>
                <InlineStat label="Page views" value={traffic ? traffic.views.toLocaleString('en-IN') : '—'} />
                <InlineStat label="Visits" value={traffic ? traffic.sessions.toLocaleString('en-IN') : '—'} />
                <InlineStat
                  label="Leads per 100 visits"
                  value={traffic && traffic.sessions ? ((visible.length / traffic.sessions) * 100).toFixed(1) : '—'}
                />
              </div>
              <TrafficChart series={traffic?.series || []} />
            </Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Card title="Top pages" sub="Most visited">
                <RankedList rows={traffic?.topPaths || []} emptyText="No page views yet." labelFor={prettyPath} />
              </Card>
              <Card title="Traffic sources" sub="Where visitors came from">
                <RankedList rows={traffic?.topReferrers || []} emptyText="No referrers yet." labelFor={prettyRef} />
              </Card>
            </div>
          </div>

          {/* ── Charts ── */}
          <div className="admin-chart-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
            <Card title="Leads over time" sub={range ? `Last ${range} days` : 'Last 30 days'}>
              <TrendChart data={trendData} />
            </Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Card title="Lead mix" sub="Share by enquiry type">
                <TypeMixChart counts={typeCounts} total={visible.length} />
              </Card>
              <Card title="Most requested" sub="Top pujas in this period">
                <TopPoojasChart leads={visible} />
              </Card>
            </div>
          </div>

          {/* ── Table (also the accessible view of every chart value) ── */}
          {!visible.length ? (
            <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)' }}>
              <p style={{ ...S.body, margin: 0 }}>
                {leads.length ? 'No leads match these filters.' : 'No leads yet — submissions will appear here.'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', backgroundColor: 'var(--bg-card)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--gold-bg)' }}>
                    {['When', 'Type', 'Name', 'Phone', 'Details', 'Status', ''].map((h) => <th key={h} style={S.th}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((l) => (
                    <React.Fragment key={l.id}>
                      <tr style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={S.td}>
                          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatWhen(l.createdAt)}</span>
                          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{relativeTime(l.createdAt, now)}</span>
                        </td>
                        <td style={S.td}><TypePill type={l.type} /></td>
                        <td style={{ ...S.td, fontWeight: 600, color: 'var(--text-primary)' }}>{l.name || '—'}</td>
                        <td style={S.td}>{l.phone ? <a href={`tel:${l.phone}`} style={{ color: 'var(--maroon)' }}>{l.phone}</a> : '—'}</td>
                        <td style={S.td}>{l.pujaName || l.interest || (l.message ? `${l.message.slice(0, 40)}…` : '—')}</td>
                        <td style={S.td}>
                          <select
                            value={l.status || 'new'}
                            onChange={(e) => changeStatus(l.id, e.target.value)}
                            aria-label={`Status for ${l.name}`}
                            style={{
                              fontFamily: 'var(--font-body)', fontSize: '0.8rem', padding: '0.3rem 0.5rem',
                              borderRadius: '999px', cursor: 'pointer', backgroundColor: 'transparent',
                              border: `1px solid ${STATUSES.find((s) => s.value === (l.status || 'new'))?.color || 'var(--border)'}`,
                              color: STATUSES.find((s) => s.value === (l.status || 'new'))?.color || 'var(--text-body)',
                            }}
                          >
                            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                          </select>
                        </td>
                        <td style={{ ...S.td, whiteSpace: 'nowrap' }}>
                          <button onClick={() => setExpanded(expanded === l.id ? null : l.id)} style={S.linkBtnInline}>
                            {expanded === l.id ? 'Hide' : 'View'}
                          </button>
                        </td>
                      </tr>
                      {expanded === l.id && (
                        <tr style={{ backgroundColor: 'var(--bg-section-alt)' }}>
                          <td colSpan={7} style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                              {[
                                ['Email', l.email], ['City', l.city], ['Address', l.address],
                                ['Puja', l.pujaName], ['Package', l.variant], ['Date', l.date],
                                ['Time', l.time], ['Language', l.language], ['Interest', l.interest],
                                ['Message', l.message], ['Instructions', l.instructions],
                                ['Marketing consent', l.consent ? 'Yes' : 'No'],
                              ].filter(([, v]) => v).map(([k, v]) => (
                                <div key={k}>
                                  <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>{k}</p>
                                  <p style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>{v}</p>
                                </div>
                              ))}
                            </div>
                            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                              {l.phone && <a href={`https://wa.me/91${String(l.phone).replace(/\D/g, '').slice(-10)}`} target="_blank" rel="noreferrer" style={S.linkBtnInline}>WhatsApp</a>}
                              {l.email && <a href={`mailto:${l.email}`} style={S.linkBtnInline}>Email</a>}
                              <button onClick={() => removeLead(l.id)} style={{ ...S.linkBtnInline, color: '#d03b3b' }}>Delete permanently</button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-chart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}

// ── Presentational helpers ────────────────────────────────────
const S = {
  h1: { fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.5rem' },
  body: { fontFamily: 'var(--font-body)', color: 'var(--text-body)', lineHeight: 1.7 },
  th: { padding: '0.75rem 0.9rem', textAlign: 'left', fontWeight: 600, color: 'var(--maroon)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' },
  td: { padding: '0.75rem 0.9rem', color: 'var(--text-body)', verticalAlign: 'top' },
  ghost: { fontFamily: 'var(--font-body)', fontSize: '0.82rem', padding: '0.45rem 0.9rem', borderRadius: '999px', border: '1px solid rgba(223,190,106,0.35)', backgroundColor: 'transparent', color: 'var(--gold-light)', cursor: 'pointer' },
  linkBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: '0.82rem', textDecoration: 'underline', cursor: 'pointer', padding: 0, alignSelf: 'center' },
  linkBtnInline: { background: 'none', border: 'none', color: 'var(--maroon)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.82rem', textDecoration: 'underline', padding: 0 },
  filterLabel: { fontFamily: 'var(--font-body)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.4rem' },
}

// Backend stores map keys sanitised (slashes/dots are illegal) — restore them.
function prettyPath(key) {
  if (key === 'root' || key === '_') return '/ (home)'
  // Runs of underscores stand in for a separator, so collapse them to one slash
  // (otherwise "service__slug" renders as "/service//slug").
  return '/' + key.replace(/^_+|_+$/g, '').replace(/_+/g, '/')
}
function prettyRef(key) {
  if (key === 'direct') return 'Direct / typed'
  if (key === 'internal') return 'Own site'
  return key.replace(/_/g, '.')
}

function InlineStat({ label, value }) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{value}</p>
    </div>
  )
}

function Shell({ children }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '2.25rem', boxShadow: 'var(--shadow-card)' }}>
        {children}
      </div>
    </div>
  )
}

function Card({ title, sub, children }) {
  return (
    <section style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '1.25rem 1.4rem' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.02rem', color: 'var(--text-primary)', fontWeight: 500 }}>{title}</h2>
      {sub && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '1.1rem' }}>{sub}</p>}
      {children}
    </section>
  )
}

function Stat({ label, value, color, hero }) {
  return (
    <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.9rem 1.1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        {color && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>{label}</p>
      </div>
      {/* Proportional figures — tabular-nums only in columns */}
      <p style={{ fontFamily: 'var(--font-body)', fontSize: hero ? '2rem' : '1.5rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1, marginTop: '0.3rem' }}>
        {value}
      </p>
    </div>
  )
}

function Filter({ label, value, onChange, options }) {
  return (
    <div>
      <p style={S.filterLabel}>{label}</p>
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        {options.map((o) => {
          const active = value === o.value
          return (
            <button
              key={o.value}
              onClick={() => onChange(o.value)}
              aria-pressed={active}
              style={{
                fontFamily: 'var(--font-body)', fontSize: '0.8rem', padding: '0.35rem 0.8rem',
                borderRadius: '999px', cursor: 'pointer',
                border: active ? 'none' : '1px solid var(--border)',
                backgroundColor: active ? 'var(--saffron)' : 'var(--bg-card)',
                color: active ? '#fff' : 'var(--maroon)',
              }}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function TypePill({ type }) {
  const meta = SERIES[type]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
      fontSize: '0.75rem', color: 'var(--text-body)', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: meta?.color || 'var(--border)', flexShrink: 0 }} />
      {meta?.label || type}
    </span>
  )
}
