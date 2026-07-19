import React from 'react'

// ─────────────────────────────────────────────────────────────
//  <PoojaPoster /> — frames a full square pooja poster.
//
//  The source creatives (1254×1254) carry a contact bar along the
//  bottom edge. We clip that band away with object-position:top +
//  a slightly-short aspect ratio, so the original files stay intact
//  and no stale contact details are shown on the site.
// ─────────────────────────────────────────────────────────────
export default function PoojaPoster({
  src,
  alt,
  cropBottom = 0.09,             // fraction of height clipped from the bottom
  objectPosition = 'center top', // 'center top' for posters (clip contact bar);
                                 // 'center' for plain deity images
  eager = false,
  style,
  imgStyle,
}) {
  const keep = 1 - cropBottom
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `1 / ${keep}`,
        overflow: 'hidden',
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--border-gold)',
        boxShadow: 'var(--shadow-warm)',
        backgroundColor: 'var(--gold-bg)',
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition,
          display: 'block',
          ...imgStyle,
        }}
      />
    </div>
  )
}
