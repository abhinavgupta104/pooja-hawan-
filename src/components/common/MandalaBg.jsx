import React from 'react'

export default function MandalaBg({ className = '', size = 600, opacity = 0.045 }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
      className={className}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
      >
        {/* Outer ring */}
        <circle cx="300" cy="300" r="290" stroke="#C9A84C" strokeWidth="1.5" />
        <circle cx="300" cy="300" r="270" stroke="#C9A84C" strokeWidth="0.8" />
        {/* 16 pointed star / mandala */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16
          const rad = (angle * Math.PI) / 180
          const x1 = 300 + 90 * Math.cos(rad)
          const y1 = 300 + 90 * Math.sin(rad)
          const x2 = 300 + 270 * Math.cos(rad)
          const y2 = 300 + 270 * Math.sin(rad)
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C9A84C" strokeWidth="0.8" />
        })}
        {/* 8-pointed star */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 360) / 8
          const rad = (angle * Math.PI) / 180
          const rad2 = ((angle + 22.5) * Math.PI) / 180
          const x1 = 300 + 220 * Math.cos(rad)
          const y1 = 300 + 220 * Math.sin(rad)
          const x2 = 300 + 140 * Math.cos(rad2)
          const y2 = 300 + 140 * Math.sin(rad2)
          const x3 = 300 + 220 * Math.cos((angle * 2 * Math.PI) / 360 + Math.PI / 4)
          const y3 = 300 + 220 * Math.sin((angle * 2 * Math.PI) / 360 + Math.PI / 4)
          return (
            <polygon
              key={i}
              points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
              stroke="#C9A84C"
              strokeWidth="0.6"
              fill="none"
            />
          )
        })}
        {/* Petals */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 360) / 12
          const rad = (angle * Math.PI) / 180
          const cx = 300 + 160 * Math.cos(rad)
          const cy = 300 + 160 * Math.sin(rad)
          return <ellipse key={i} cx={cx} cy={cy} rx="22" ry="38" fill="none" stroke="#C9A84C" strokeWidth="0.6" transform={`rotate(${angle + 90} ${cx} ${cy})`} />
        })}
        {/* Inner rings */}
        <circle cx="300" cy="300" r="120" stroke="#C9A84C" strokeWidth="0.8" strokeDasharray="4 4" />
        <circle cx="300" cy="300" r="80" stroke="#C9A84C" strokeWidth="1" />
        <circle cx="300" cy="300" r="40" stroke="#C9A84C" strokeWidth="0.8" />
        <circle cx="300" cy="300" r="15" fill="#C9A84C" />
        {/* Outer decorative diamonds */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 360) / 8
          const rad = (angle * Math.PI) / 180
          const cx = 300 + 248 * Math.cos(rad)
          const cy = 300 + 248 * Math.sin(rad)
          return (
            <g key={i} transform={`rotate(${angle} ${cx} ${cy})`}>
              <polygon
                points={`${cx},${cy - 8} ${cx + 5},${cy} ${cx},${cy + 8} ${cx - 5},${cy}`}
                stroke="#C9A84C"
                strokeWidth="0.6"
                fill="none"
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
