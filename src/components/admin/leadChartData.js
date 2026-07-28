// ─────────────────────────────────────────────────────────────
//  Constants and pure helpers for the leads charts.
//  Kept out of the component file so fast-refresh stays intact.
//
//  Categorical palette — validated against the card surface
//  (#FFFEFA, light): worst all-pairs CVD ΔE 13.4, normal-vision
//  27.0. Both clear the gates. Do not substitute by eye.
// ─────────────────────────────────────────────────────────────

export const SERIES = {
  booking: { label: 'Bookings', color: '#DE5A0E' },  // slot 1 — brand saffron
  enquiry: { label: 'Callbacks', color: '#0F9B80' }, // slot 2 — teal
  contact: { label: 'Messages', color: '#4A3AA7' },  // slot 3 — violet
}

/**
 * Bucket leads into one count per day for the last `days` days.
 * `nowMs` is passed in so the calculation stays pure and testable.
 */
export function buildDailySeries(leads, days, nowMs) {
  const today = new Date(nowMs)
  today.setHours(0, 0, 0, 0)
  const buckets = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    buckets.push({ date: d, count: 0 })
  }
  const first = buckets[0].date.getTime()
  leads.forEach((l) => {
    const t = new Date(l.createdAt)
    if (Number.isNaN(t.getTime())) return
    t.setHours(0, 0, 0, 0)
    if (t.getTime() < first) return
    const idx = Math.round((t.getTime() - first) / 86400000)
    if (buckets[idx]) buckets[idx].count += 1
  })
  return buckets
}

/** Human-friendly age of a timestamp, relative to `nowMs`. */
export function relativeTime(iso, nowMs) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const mins = Math.round((nowMs - d.getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`
  return `${Math.round(mins / 1440)}d ago`
}

export function formatWhen(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}
