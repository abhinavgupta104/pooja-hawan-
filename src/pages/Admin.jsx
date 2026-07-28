import React, { useCallback, useEffect, useState } from 'react'
import Seo from '../components/Seo'
import { getFirebaseAuth, isConfigured } from '../utils/firebaseClient'
import { fetchLeads, updateLeadStatus, deleteLead } from '../utils/leadsApi'

const TYPES = [
  { value: 'all', label: 'All' },
  { value: 'booking', label: 'Bookings' },
  { value: 'enquiry', label: 'Callbacks' },
  { value: 'contact', label: 'Messages' },
]

const STATUSES = [
  { value: 'new', label: 'New', color: '#B8892E' },
  { value: 'contacted', label: 'Contacted', color: '#3B6FB0' },
  { value: 'confirmed', label: 'Confirmed', color: '#2E7D52' },
  { value: 'cancelled', label: 'Cancelled', color: '#9A3B3B' },
]

const CSV_COLUMNS = [
  'createdAt', 'type', 'status', 'name', 'phone', 'email', 'city',
  'pujaName', 'variant', 'date', 'time', 'language', 'address',
  'interest', 'message', 'instructions', 'consent',
]

function toCsv(rows) {
  const escape = (v) => {
    const s = v == null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [
    CSV_COLUMNS.join(','),
    ...rows.map((r) => CSV_COLUMNS.map((c) => escape(r[c])).join(',')),
  ].join('\n')
}

function formatWhen(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function Admin() {
  const [user, setUser] = useState(null)
  // Only "checking" when there is actually a Firebase session to resolve.
  const [checking, setChecking] = useState(isConfigured)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [signingIn, setSigningIn] = useState(false)

  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  // ── Auth state ──────────────────────────────────────────────
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

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setLoadError('')
    try {
      const token = await user.getIdToken()
      setLeads(await fetchLeads(token, { type: typeFilter, status: statusFilter }))
    } catch (err) {
      setLoadError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user, typeFilter, statusFilter])

  // Fetch on sign-in and whenever a filter changes. `load` flips the loading
  // flag synchronously so the table shows a spinner immediately; that is the
  // intent here, so the set-state-in-effect rule is deliberately relaxed.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load() }, [load])

  const signIn = async (e) => {
    e.preventDefault()
    setAuthError('')
    setSigningIn(true)
    try {
      const { auth, signInWithEmailAndPassword } = await getFirebaseAuth()
      await signInWithEmailAndPassword(auth, email.trim(), password)
      setPassword('')
    } catch (err) {
      // Firebase returns granular codes; keep the message generic so we don't
      // reveal whether an account exists.
      setAuthError(
        err?.code === 'auth/too-many-requests'
          ? 'Too many attempts. Please wait a few minutes and try again.'
          : 'Incorrect email or password.',
      )
    } finally {
      setSigningIn(false)
    }
  }

  const signOutNow = async () => {
    const { auth, signOut } = await getFirebaseAuth()
    await signOut(auth)
    setLeads([])
  }

  const changeStatus = async (id, status) => {
    const previous = leads
    setLeads((rows) => rows.map((r) => (r.id === id ? { ...r, status } : r)))
    try {
      const token = await user.getIdToken()
      await updateLeadStatus(token, id, status)
      if (statusFilter !== 'all') load()
    } catch (err) {
      setLeads(previous) // roll back the optimistic update
      setLoadError(err.message)
    }
  }

  const removeLead = async (id) => {
    if (!window.confirm('Permanently delete this lead? This cannot be undone.')) return
    const previous = leads
    setLeads((rows) => rows.filter((r) => r.id !== id))
    try {
      const token = await user.getIdToken()
      await deleteLead(token, id)
    } catch (err) {
      setLeads(previous)
      setLoadError(err.message)
    }
  }

  const exportCsv = () => {
    const blob = new Blob([toCsv(leads)], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pujahavan-leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const seo = {
    path: '/admin',
    title: 'Admin — Puja Havan',
    description: 'Internal admin area.',
  }

  // ── Not configured ──────────────────────────────────────────
  if (!isConfigured) {
    return (
      <>
        <Seo {...seo} noindex />
        <Shell>
          <h1 style={h1Style}>Admin</h1>
          <p style={{ ...bodyStyle, color: 'var(--maroon)' }}>
            Firebase is not configured. Add the <code>VITE_FIREBASE_*</code> values to
            your <code>.env</code> file and rebuild the site.
          </p>
        </Shell>
      </>
    )
  }

  if (checking) {
    return (
      <>
        <Seo {...seo} noindex />
        <Shell><p style={bodyStyle}>Loading…</p></Shell>
      </>
    )
  }

  // ── Login ───────────────────────────────────────────────────
  if (!user) {
    return (
      <>
        <Seo {...seo} noindex />
        <Shell>
          <h1 style={h1Style}>Admin Sign In</h1>
          <p style={{ ...bodyStyle, marginBottom: '1.75rem' }}>
            Authorised staff only.
          </p>
          <form onSubmit={signIn} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div className="form-field">
              <label className="form-label" htmlFor="admin-email">Email</label>
              <input
                id="admin-email" type="email" required autoComplete="username"
                className="form-input" value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="admin-password">Password</label>
              <input
                id="admin-password" type="password" required autoComplete="current-password"
                className="form-input" value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {authError && (
              <p role="alert" style={{ color: 'var(--maroon)', fontSize: '0.85rem', fontFamily: 'var(--font-body)' }}>
                {authError}
              </p>
            )}
            <button type="submit" className="btn-primary" disabled={signingIn} style={{ justifyContent: 'center', cursor: signingIn ? 'wait' : 'pointer' }}>
              {signingIn ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </Shell>
      </>
    )
  }

  // ── Dashboard ───────────────────────────────────────────────
  const counts = STATUSES.map((s) => ({ ...s, n: leads.filter((l) => l.status === s.value).length }))

  return (
    <>
      <Seo {...seo} noindex />
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
        <header style={{ backgroundColor: 'var(--bg-dark)', padding: '1.1rem 0' }}>
          <div className="container-max" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold-light)' }}>
                Puja Havan — Leads
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(248,239,220,0.55)' }}>
                {user.email}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button onClick={load} style={ghostBtn}>Refresh</button>
              <button onClick={exportCsv} disabled={!leads.length} style={ghostBtn}>Export CSV</button>
              <button onClick={signOutNow} style={ghostBtn}>Sign Out</button>
            </div>
          </div>
        </header>

        <div className="container-max" style={{ padding: '2rem' }}>
          {/* Counters */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <Stat label="Total" value={leads.length} color="var(--maroon)" />
            {counts.map((c) => <Stat key={c.value} label={c.label} value={c.n} color={c.color} />)}
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <Filter label="Type" value={typeFilter} onChange={setTypeFilter} options={TYPES} />
            <Filter
              label="Status" value={statusFilter} onChange={setStatusFilter}
              options={[{ value: 'all', label: 'All' }, ...STATUSES.map((s) => ({ value: s.value, label: s.label }))]}
            />
          </div>

          {loadError && (
            <p role="alert" style={{ color: 'var(--maroon)', fontFamily: 'var(--font-body)', marginBottom: '1rem' }}>
              {loadError}
            </p>
          )}

          {loading ? (
            <p style={bodyStyle}>Loading leads…</p>
          ) : !leads.length ? (
            <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)' }}>
              <p style={{ ...bodyStyle, marginBottom: 0 }}>No leads match these filters yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', backgroundColor: 'var(--bg-card)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--gold-bg)' }}>
                    {['When', 'Type', 'Name', 'Phone', 'Details', 'Status', ''].map((h) => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <React.Fragment key={l.id}>
                      <tr style={{ borderTop: '1px solid var(--border)' }}>
                        <td style={tdStyle}>{formatWhen(l.createdAt)}</td>
                        <td style={tdStyle}><TypePill type={l.type} /></td>
                        <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--text-primary)' }}>{l.name || '—'}</td>
                        <td style={tdStyle}>
                          {l.phone ? <a href={`tel:${l.phone}`} style={{ color: 'var(--maroon)' }}>{l.phone}</a> : '—'}
                        </td>
                        <td style={tdStyle}>
                          {l.pujaName || l.interest || (l.message ? `${l.message.slice(0, 40)}…` : '—')}
                        </td>
                        <td style={tdStyle}>
                          <select
                            value={l.status || 'new'}
                            onChange={(e) => changeStatus(l.id, e.target.value)}
                            style={{
                              fontFamily: 'var(--font-body)', fontSize: '0.8rem', padding: '0.3rem 0.5rem',
                              borderRadius: '999px', cursor: 'pointer',
                              border: `1px solid ${STATUSES.find((s) => s.value === l.status)?.color || 'var(--border)'}`,
                              color: STATUSES.find((s) => s.value === l.status)?.color || 'var(--text-body)',
                              backgroundColor: 'transparent',
                            }}
                          >
                            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                          </select>
                        </td>
                        <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                          <button onClick={() => setExpanded(expanded === l.id ? null : l.id)} style={linkBtn}>
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
                            <button onClick={() => removeLead(l.id)} style={{ ...linkBtn, color: '#9A3B3B', marginTop: '1rem' }}>
                              Delete permanently
                            </button>
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
    </>
  )
}

// ── Small presentational helpers ──────────────────────────────
const h1Style = { fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }
const bodyStyle = { fontFamily: 'var(--font-body)', color: 'var(--text-body)', lineHeight: 1.7 }
const thStyle = { padding: '0.75rem 0.9rem', textAlign: 'left', fontWeight: 600, color: 'var(--maroon)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }
const tdStyle = { padding: '0.75rem 0.9rem', color: 'var(--text-body)', verticalAlign: 'top' }
const ghostBtn = { fontFamily: 'var(--font-body)', fontSize: '0.82rem', padding: '0.45rem 0.9rem', borderRadius: '999px', border: '1px solid rgba(223,190,106,0.35)', backgroundColor: 'transparent', color: 'var(--gold-light)', cursor: 'pointer' }
const linkBtn = { background: 'none', border: 'none', color: 'var(--maroon)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.82rem', textDecoration: 'underline', padding: 0 }

function Shell({ children }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: '2.25rem', boxShadow: 'var(--shadow-card)' }}>
        {children}
      </div>
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.85rem 1.25rem', minWidth: '110px' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color, lineHeight: 1 }}>{value}</p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{label}</p>
    </div>
  )
}

function Filter({ label, value, onChange, options }) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{label}</p>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            style={{
              fontFamily: 'var(--font-body)', fontSize: '0.8rem', padding: '0.35rem 0.85rem',
              borderRadius: '999px', cursor: 'pointer',
              border: value === o.value ? 'none' : '1px solid var(--border)',
              backgroundColor: value === o.value ? 'var(--saffron)' : 'var(--bg-card)',
              color: value === o.value ? '#fff' : 'var(--maroon)',
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function TypePill({ type }) {
  const map = { booking: '#2E7D52', enquiry: '#B8892E', contact: '#3B6FB0' }
  return (
    <span style={{
      fontSize: '0.72rem', padding: '0.2rem 0.6rem', borderRadius: '999px',
      border: `1px solid ${map[type] || 'var(--border)'}`, color: map[type] || 'var(--text-body)',
      whiteSpace: 'nowrap',
    }}>
      {type}
    </span>
  )
}
