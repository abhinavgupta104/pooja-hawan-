import React, { useMemo, useState } from 'react'
import { SERIES } from './leadChartData'

// ─────────────────────────────────────────────────────────────
//  Charts for the leads dashboard — plain inline SVG, no library.
//
//  Palette is validated (categorical, light surface #FFFEFA):
//    worst all-pairs CVD ΔE 13.4, normal-vision 27.0 — both clear.
//  Text always wears text tokens; only marks carry series colour.
// ─────────────────────────────────────────────────────────────

const INK = {
  primary: 'var(--text-primary)',
  secondary: 'var(--text-body)',
  muted: 'var(--text-muted)',
  grid: 'var(--border)',
  surface: 'var(--bg-card)',
}

const fmtDay = (d) => d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })

/** Smallest "nice" even axis top >= max, so 0 / top/2 / top are all integers. */
function niceCeilEven(max) {
  if (max <= 4) return 4
  const steps = [6, 8, 10, 20, 40, 50, 100, 200, 500, 1000]
  for (const s of steps) if (max <= s) return s
  return Math.ceil(max / 1000) * 1000
}

// ── Area chart: leads over time (single series → no legend) ───
export function TrendChart({ data, height = 190 }) {
  const [hover, setHover] = useState(null)
  const W = 720
  const H = height
  const pad = { top: 14, right: 16, bottom: 26, left: 34 }
  const plotW = W - pad.left - pad.right
  const plotH = H - pad.top - pad.bottom

  const max = Math.max(1, ...data.map((d) => d.count))
  // Axis top must be a clean number AND divisible by 2, so the mid tick is a
  // whole number (a naive ceil-to-5 gives ticks like 7.5).
  const top = niceCeilEven(max)
  const x = (i) => pad.left + (data.length === 1 ? plotW / 2 : (i * plotW) / (data.length - 1))
  const y = (v) => pad.top + plotH - (v / top) * plotH

  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(d.count)}`).join(' ')
  const area = `${line} L${x(data.length - 1)},${pad.top + plotH} L${x(0)},${pad.top + plotH} Z`
  const ticks = [0, top / 2, top]
  const color = SERIES.booking.color
  const last = data[data.length - 1]

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * W
    const i = Math.round(((px - pad.left) / plotW) * (data.length - 1))
    setHover(i >= 0 && i < data.length ? i : null)
  }

  return (
    <figure style={{ margin: 0 }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        role="img"
        aria-label={`Leads per day. Peak ${max} in the period.`}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        style={{ display: 'block', overflow: 'visible' }}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={W - pad.right} y1={y(t)} y2={y(t)} stroke={INK.grid} strokeWidth="1" />
            <text x={pad.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill={INK.muted} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {t}
            </text>
          </g>
        ))}

        <path d={area} fill={color} opacity="0.10" />
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* End marker: >=8px with a 2px surface ring */}
        <circle cx={x(data.length - 1)} cy={y(last.count)} r="5" fill={color} stroke={INK.surface} strokeWidth="2" />

        {/* x labels: first, middle, last only — never one per point */}
        {[0, Math.floor((data.length - 1) / 2), data.length - 1].map((i) => (
          <text key={i} x={x(i)} y={H - 6} textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'} fontSize="11" fill={INK.muted}>
            {fmtDay(data[i].date)}
          </text>
        ))}

        {hover !== null && (
          <g pointerEvents="none">
            <line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={pad.top + plotH} stroke={INK.muted} strokeWidth="1" />
            <circle cx={x(hover)} cy={y(data[hover].count)} r="5" fill={color} stroke={INK.surface} strokeWidth="2" />
          </g>
        )}
      </svg>

      {hover !== null && (
        <figcaption style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: INK.secondary, marginTop: '0.5rem' }}>
          <strong style={{ color: INK.primary }}>{fmtDay(data[hover].date)}</strong> ·{' '}
          {data[hover].count} {data[hover].count === 1 ? 'lead' : 'leads'}
        </figcaption>
      )}
    </figure>
  )
}

// ── Stacked bar: lead mix by type (legend + direct labels) ────
export function TypeMixChart({ counts, total }) {
  const entries = Object.entries(SERIES)
    .map(([key, meta]) => ({ key, ...meta, value: counts[key] || 0 }))
    .filter((e) => e.value > 0)

  if (!total) return <Empty>No leads in this period yet.</Empty>

  const GAP = 2 // surface gap between segments
  return (
    <div>
      <div
        style={{ display: 'flex', height: '26px', borderRadius: '6px', overflow: 'hidden', gap: `${GAP}px`, background: INK.surface }}
        role="img"
        aria-label={entries.map((e) => `${e.label} ${e.value}`).join(', ')}
      >
        {entries.map((e) => {
          const pct = (e.value / total) * 100
          // Only label inside when the text comfortably fits.
          const showLabel = pct >= 14
          return (
            <div
              key={e.key}
              title={`${e.label}: ${e.value}`}
              style={{
                width: `${pct}%`,
                background: e.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '3px',
              }}
            >
              {showLabel && (
                <span style={{ color: '#fff', fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {e.value}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend — always present for >= 2 series */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.9rem' }}>
        {Object.entries(SERIES).map(([key, meta]) => (
          <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: INK.secondary }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: meta.color, flexShrink: 0 }} />
            {meta.label}
            <strong style={{ color: INK.primary, fontVariantNumeric: 'tabular-nums' }}>{counts[key] || 0}</strong>
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Horizontal bars: most requested poojas ───────────────────
//  Nominal categories → every bar wears the same slot-1 hue.
export function TopPoojasChart({ leads, limit = 5 }) {
  const rows = useMemo(() => {
    const tally = {}
    leads.forEach((l) => {
      const name = l.pujaName || l.interest
      if (name) tally[name] = (tally[name] || 0) + 1
    })
    return Object.entries(tally)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit)
  }, [leads, limit])

  if (!rows.length) return <Empty>No puja requests yet.</Empty>

  const max = Math.max(...rows.map((r) => r.value))
  const color = SERIES.booking.color

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
      {rows.map((r) => (
        <div key={r.name} style={{ display: 'grid', gridTemplateColumns: '1fr 2.2fr auto', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: INK.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {r.name}
          </span>
          <span style={{ display: 'block', height: '14px', background: 'var(--gold-bg)', borderRadius: '3px', overflow: 'hidden' }}>
            <span
              style={{
                display: 'block',
                width: `${(r.value / max) * 100}%`,
                height: '100%',
                background: color,
                borderRadius: '0 4px 4px 0',
              }}
            />
          </span>
          <strong style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: INK.primary, fontVariantNumeric: 'tabular-nums', minWidth: '1.5rem', textAlign: 'right' }}>
            {r.value}
          </strong>
        </div>
      ))}
    </div>
  )
}

// ── Traffic: views vs sessions over time (2 series → legend) ──
export function TrafficChart({ series, height = 190 }) {
  const [hover, setHover] = useState(null)
  if (!series?.length) return <Empty>No traffic recorded yet.</Empty>

  const W = 720
  const H = height
  const pad = { top: 14, right: 16, bottom: 26, left: 38 }
  const plotW = W - pad.left - pad.right
  const plotH = H - pad.top - pad.bottom

  const max = Math.max(1, ...series.map((d) => d.views))
  const top = niceCeilEven(max)
  const x = (i) => pad.left + (series.length === 1 ? plotW / 2 : (i * plotW) / (series.length - 1))
  const y = (v) => pad.top + plotH - (v / top) * plotH
  const pathFor = (key) => series.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(d[key])}`).join(' ')

  const VIEWS = SERIES.booking.color   // slot 1
  const SESSIONS = SERIES.enquiry.color // slot 2
  const ticks = [0, top / 2, top]

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * W
    const i = Math.round(((px - pad.left) / plotW) * (series.length - 1))
    setHover(i >= 0 && i < series.length ? i : null)
  }

  const dayLabel = (s) => new Date(`${s}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })

  return (
    <figure style={{ margin: 0 }}>
      <svg
        viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img"
        aria-label={`Page views and sessions per day. Peak ${max} views.`}
        onMouseMove={onMove} onMouseLeave={() => setHover(null)}
        style={{ display: 'block', overflow: 'visible' }}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={W - pad.right} y1={y(t)} y2={y(t)} stroke={INK.grid} strokeWidth="1" />
            <text x={pad.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill={INK.muted} style={{ fontVariantNumeric: 'tabular-nums' }}>{t}</text>
          </g>
        ))}

        <path d={`${pathFor('views')} L${x(series.length - 1)},${pad.top + plotH} L${x(0)},${pad.top + plotH} Z`} fill={VIEWS} opacity="0.10" />
        <path d={pathFor('views')} fill="none" stroke={VIEWS} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <path d={pathFor('sessions')} fill="none" stroke={SESSIONS} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {[0, Math.floor((series.length - 1) / 2), series.length - 1].map((i) => (
          <text key={i} x={x(i)} y={H - 6} fontSize="11" fill={INK.muted}
            textAnchor={i === 0 ? 'start' : i === series.length - 1 ? 'end' : 'middle'}>
            {dayLabel(series[i].date)}
          </text>
        ))}

        {hover !== null && (
          <g pointerEvents="none">
            <line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={pad.top + plotH} stroke={INK.muted} strokeWidth="1" />
            <circle cx={x(hover)} cy={y(series[hover].views)} r="5" fill={VIEWS} stroke={INK.surface} strokeWidth="2" />
            <circle cx={x(hover)} cy={y(series[hover].sessions)} r="5" fill={SESSIONS} stroke={INK.surface} strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* Legend — mandatory for two series */}
      <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
        {[['Page views', VIEWS], ['Visits', SESSIONS]].map(([label, c]) => (
          <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: INK.secondary }}>
            <span style={{ width: '14px', height: '2px', background: c, flexShrink: 0 }} />{label}
          </span>
        ))}
        {hover !== null && (
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: INK.secondary, marginLeft: 'auto' }}>
            <strong style={{ color: INK.primary }}>{dayLabel(series[hover].date)}</strong>{' · '}
            {series[hover].views} views · {series[hover].sessions} visits
          </span>
        )}
      </div>
    </figure>
  )
}

// ── Simple ranked list (top pages / referrers) ───────────────
export function RankedList({ rows, emptyText, labelFor }) {
  if (!rows?.length) return <Empty>{emptyText}</Empty>
  const max = Math.max(...rows.map((r) => r.count))
  const color = SERIES.booking.color
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {rows.map((r) => (
        <div key={r.name} style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr auto', alignItems: 'center', gap: '0.7rem' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: INK.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {labelFor ? labelFor(r.name) : r.name}
          </span>
          <span style={{ display: 'block', height: '12px', background: 'var(--gold-bg)', borderRadius: '3px', overflow: 'hidden' }}>
            <span style={{ display: 'block', width: `${(r.count / max) * 100}%`, height: '100%', background: color, borderRadius: '0 4px 4px 0' }} />
          </span>
          <strong style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: INK.primary, fontVariantNumeric: 'tabular-nums', minWidth: '2rem', textAlign: 'right' }}>
            {r.count}
          </strong>
        </div>
      ))}
    </div>
  )
}

function Empty({ children }) {
  return (
    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: INK.muted, margin: 0, padding: '1.5rem 0', textAlign: 'center' }}>
      {children}
    </p>
  )
}
