import React from 'react';

/**
 * Modern, Highly Accurate North Indian Kundali Chart
 * 
 * Includes precise coordinate mapping to ensure Rashi numbers and Planets
 * never overlap. Built with elegant UI styling consistent with Vedic astrology tools.
 */

const W = 400;
const H = 400;

// Center of each house for Planet text wrapping (Perfectly calculated centroids)
const HOUSE_CENTERS = [
  { x: 200, y: 85  }, // H1
  { x: 100, y: 40  }, // H2
  { x: 45,  y: 100 }, // H3
  { x: 100, y: 200 }, // H4
  { x: 45,  y: 300 }, // H5
  { x: 100, y: 360 }, // H6
  { x: 200, y: 315 }, // H7
  { x: 300, y: 360 }, // H8
  { x: 355, y: 300 }, // H9
  { x: 300, y: 200 }, // H10
  { x: 355, y: 100 }, // H11
  { x: 300, y: 40  }, // H12
];

// Rashi number label positions (Tucked neatly into the inner corners/junctions)
const RASHI_LABEL_POS = [
  { x: 200, y: 175 }, // H1
  { x: 100, y: 80  }, // H2
  { x: 80,  y: 100 }, // H3
  { x: 125, y: 200 }, // H4
  { x: 80,  y: 300 }, // H5
  { x: 100, y: 320 }, // H6
  { x: 200, y: 225 }, // H7
  { x: 300, y: 320 }, // H8
  { x: 320, y: 300 }, // H9
  { x: 275, y: 200 }, // H10
  { x: 320, y: 100 }, // H11
  { x: 300, y: 80  }, // H12
];

const PLANET_ABBR = {
  'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
  'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa',
  'Rahu': 'Ra', 'Ketu': 'Ke', 'Ascendant': 'As',
  'Lagna': 'La'
};

const RASHI_NUMBERS = {
  'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4,
  'Leo': 5, 'Virgo': 6, 'Libra': 7, 'Scorpio': 8,
  'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
};

const RETROGRADE_PLANETS = new Set(['Rahu', 'Ketu']);

// Wrap planets nicely depending on the amount to prevent line collision
function wrapPlanets(planetList) {
  const maxPerLine = planetList.length <= 4 ? 2 : 3;
  const lines = [];
  for (let i = 0; i < planetList.length; i += maxPerLine) {
    lines.push(planetList.slice(i, i + maxPerLine).join(' '));
  }
  return lines;
}

export default function NorthIndianChart({ lagna, planets, navamsa, mode = 'rasi' }) {
  const housesMap = {};

  const sourceData = mode === 'navamsa' ? navamsa : null;

  if (mode === 'navamsa' && navamsa) {
    const navLagna = navamsa.lagna || {};
    const navPlanets = navamsa.planets || {};

    const navLagnaRashi = navLagna.rashi || 'Aries';
    const rashiOrder = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
    const lagnaIdx = rashiOrder.indexOf(navLagnaRashi);

    for (let i = 0; i < 12; i++) {
      const houseRashiIdx = (lagnaIdx + i) % 12;
      housesMap[i + 1] = { sign: rashiOrder[houseRashiIdx], planets: [] };
    }
    housesMap[1].planets.push('La');
    Object.entries(navPlanets).forEach(([pName, pData]) => {
      const pRashi = pData.navamsa_rashi;
      if (!pRashi) return;
      const pIdx = rashiOrder.indexOf(pRashi);
      if (pIdx === -1) return;
      const hNum = ((pIdx - lagnaIdx) % 12 + 12) % 12 + 1;
      if (housesMap[hNum]) {
        const abbr = PLANET_ABBR[pName] || pName.slice(0, 2);
        housesMap[hNum].planets.push(abbr);
      }
    });
  } else if (lagna && planets) {
    const rashiOrder = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
    const lagnaRashi = lagna.rashi || 'Aries';
    const lagnaIdx = rashiOrder.indexOf(lagnaRashi);

    for (let i = 0; i < 12; i++) {
      const houseRashiIdx = (lagnaIdx + i) % 12;
      housesMap[i + 1] = { sign: rashiOrder[houseRashiIdx], planets: [] };
    }
    housesMap[1].planets.push('La');
    Object.entries(planets).forEach(([pName, pData]) => {
      const hNum = pData.house;
      if (hNum >= 1 && hNum <= 12 && housesMap[hNum]) {
        // Retrograde indicator nicely placed
        const retroStr = (pData.is_retrograde && !RETROGRADE_PLANETS.has(pName)) ? '®' : '';
        const abbr = (PLANET_ABBR[pName] || pName.slice(0, 2)) + retroStr;
        housesMap[hNum].planets.push(abbr);
      }
    });
  }

  // --- UI STYLING & COLORS ---
  const gridLines = '#c0392b';     // Deep Vedic Red/Orange
  const planetColor = '#1e293b';   // Dark modern slate
  const rashiColor = '#94a3b8';    // Soft gray to stay out of the way
  const bgColor = '#fffaf0';       // Warm off-white
  const lagnaColor = '#ea580c';    // Prominent orange-red for Lagna

  return (
    <div className="relative w-full max-w-[480px] mx-auto rounded-xl overflow-hidden shadow-xl" style={{ background: bgColor }}>
      
      {/* Decorative Outer Gradient Border */}
      <div className="absolute inset-0 border-[6px] border-double border-orange-500/20 rounded-xl pointer-events-none" />

      <svg 
        viewBox={`0 0 ${W} ${H}`} 
        className="w-full h-auto block transform origin-center transition-all duration-500 ease-in-out hover:scale-[1.02]"
        style={{ padding: '8px' }}
      >
        <defs>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Outer Rect Border */}
        <rect x={4} y={4} width={W - 8} height={H - 8} fill="#ffffff" stroke={gridLines} strokeWidth={2.5} rx={4} />

        {/* Main Diagonals */}
        <line x1={4} y1={4} x2={W-4} y2={H-4} stroke={gridLines} strokeWidth={1.5} />
        <line x1={W-4} y1={4} x2={4} y2={H-4} stroke={gridLines} strokeWidth={1.5} />

        {/* Inner Diamond */}
        <polygon
          points={`${W/2},4 ${W-4},${H/2} ${W/2},${H-4} 4,${H/2}`}
          fill="none" stroke={gridLines} strokeWidth={1.5}
        />

        {/* Cell Renders */}
        {Array.from({ length: 12 }, (_, i) => {
          const houseNum = i + 1;
          const cell = housesMap[houseNum] || { sign: '', planets: [] };
          const center = HOUSE_CENTERS[i];
          const rashiPos = RASHI_LABEL_POS[i];
          const rashiNum = RASHI_NUMBERS[cell.sign] || '';
          const planetLines = wrapPlanets(cell.planets);

          return (
            <g key={houseNum} className="transition-opacity duration-300 hover:opacity-80">
              {/* Rashi Number */}
              <text
                x={rashiPos.x} y={rashiPos.y}
                textAnchor="middle" dominantBaseline="central"
                fontSize={12} fontWeight="700" fill={rashiColor}
                opacity={0.8}
                fontFamily="'Segoe UI', Roboto, sans-serif"
              >
                {rashiNum}
              </text>

              {/* Planets */}
              {planetLines.map((line, li) => {
                const isLagnaLine = li === 0 && cell.planets[0] === 'La';
                const yOffset = (li - (planetLines.length - 1) / 2) * 16;
                return (
                  <text
                    key={li}
                    x={center.x}
                    y={center.y + yOffset}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={14}
                    fontWeight={isLagnaLine ? '800' : '600'}
                    fill={isLagnaLine ? lagnaColor : planetColor}
                    fontFamily="'Inter', 'Segoe UI', sans-serif"
                    filter="url(#shadow)"
                  >
                    {line}
                  </text>
                );
              })}
            </g>
          );
        })}

        {/* Center Label Badge */}
        <g transform={`translate(${W/2}, ${H/2})`}>
          <rect x="-35" y="-14" width="70" height="28" rx="14" fill="#ffffff" stroke={gridLines} strokeWidth="1" strokeDasharray="3,3" opacity="0.85" />
          <text x="0" y="0" textAnchor="middle" dominantBaseline="central"
            fontSize={11} fontWeight="bold" fill={gridLines} letterSpacing="1" fontFamily="Arial, sans-serif">
            {mode === 'navamsa' ? 'D9 CHART' : 'D1 RASI'}
          </text>
        </g>
      </svg>
    </div>
  );
}
