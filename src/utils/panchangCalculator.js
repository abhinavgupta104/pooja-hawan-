/**
 * Offline Vedic Panchang Calculator
 * Computes accurate Panchang data using astronomical algorithms (Jean Meeus)
 * without any external API dependency.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const TITHIS = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'
];

const TITHI_PAKSHA = [
  ...Array(15).fill('Shukla'), ...Array(15).fill('Krishna')
];

const TITHI_TYPES = [
  'Nanda', 'Bhadra', 'Jaya', 'Rikta', 'Purna',
  'Nanda', 'Bhadra', 'Jaya', 'Rikta', 'Purna',
  'Nanda', 'Bhadra', 'Jaya', 'Rikta', 'Purna',
  'Nanda', 'Bhadra', 'Jaya', 'Rikta', 'Purna',
  'Nanda', 'Bhadra', 'Jaya', 'Rikta', 'Purna',
  'Nanda', 'Bhadra', 'Jaya', 'Rikta', 'Purna'
];

const NAKSHATRAS = [
  { name: 'Ashwini', deity: 'Ashwini Kumaras', lord: 'Ketu' },
  { name: 'Bharani', deity: 'Yama', lord: 'Venus' },
  { name: 'Krittika', deity: 'Agni', lord: 'Sun' },
  { name: 'Rohini', deity: 'Brahma', lord: 'Moon' },
  { name: 'Mrigashira', deity: 'Soma', lord: 'Mars' },
  { name: 'Ardra', deity: 'Rudra', lord: 'Rahu' },
  { name: 'Punarvasu', deity: 'Aditi', lord: 'Jupiter' },
  { name: 'Pushya', deity: 'Brihaspati', lord: 'Saturn' },
  { name: 'Ashlesha', deity: 'Sarpa', lord: 'Mercury' },
  { name: 'Magha', deity: 'Pitru', lord: 'Ketu' },
  { name: 'Purva Phalguni', deity: 'Bhaga', lord: 'Venus' },
  { name: 'Uttara Phalguni', deity: 'Aryama', lord: 'Sun' },
  { name: 'Hasta', deity: 'Savitar', lord: 'Moon' },
  { name: 'Chitra', deity: 'Vishwakarma', lord: 'Mars' },
  { name: 'Swati', deity: 'Vayu', lord: 'Rahu' },
  { name: 'Vishakha', deity: 'Indragni', lord: 'Jupiter' },
  { name: 'Anuradha', deity: 'Mitra', lord: 'Saturn' },
  { name: 'Jyeshtha', deity: 'Indra', lord: 'Mercury' },
  { name: 'Mula', deity: 'Nirriti', lord: 'Ketu' },
  { name: 'Purva Ashadha', deity: 'Apas', lord: 'Venus' },
  { name: 'Uttara Ashadha', deity: 'Vishwedeva', lord: 'Sun' },
  { name: 'Shravana', deity: 'Vishnu', lord: 'Moon' },
  { name: 'Dhanishta', deity: 'Vasu', lord: 'Mars' },
  { name: 'Shatabhisha', deity: 'Varuna', lord: 'Rahu' },
  { name: 'Purva Bhadrapada', deity: 'Ajaikapad', lord: 'Jupiter' },
  { name: 'Uttara Bhadrapada', deity: 'Ahirbudhnya', lord: 'Saturn' },
  { name: 'Revati', deity: 'Pushan', lord: 'Mercury' }
];

const YOGAS = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
  'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
  'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
  'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
  'Indra', 'Vaidhriti'
];

const KARANAS = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara',
  'Vanija', 'Vishti', 'Bava', 'Balava', 'Kaulava',
  'Taitila'
];

const VARAS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const RASHIS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// ─── Astronomical Helpers ─────────────────────────────────────────────────────

function toRad(deg) { return deg * Math.PI / 180; }
function toDeg(rad) { return rad * 180 / Math.PI; }
function norm360(x) { return ((x % 360) + 360) % 360; }
function norm(x, range) { return ((x % range) + range) % range; }

/** Julian Day Number from calendar date */
function julianDay(year, month, day, hour = 12, tz = 5.5) {
  const utHour = hour - tz;
  if (month <= 2) { year -= 1; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day + utHour / 24 + B - 1524.5;
}

/** Sun's ecliptic longitude (degrees) */
function sunLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const L0 = norm360(280.46646 + 36000.76983 * T);
  const M = toRad(norm360(357.52911 + 35999.05029 * T - 0.0001537 * T * T));
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * M)
    + 0.000289 * Math.sin(3 * M);
  return norm360(L0 + C);
}

/** Moon's ecliptic longitude (degrees) */
function moonLongitude(jd) {
  const T = (jd - 2451545.0) / 36525;
  const L1 = norm360(218.3165 + 481267.8813 * T);
  const M = toRad(norm360(357.5291 + 35999.0503 * T));
  const M1 = toRad(norm360(134.9634 + 477198.8676 * T));
  const D = toRad(norm360(297.8502 + 445267.1115 * T));
  const F = toRad(norm360(93.2721 + 483202.0175 * T));
  const lon = L1
    + 6.2888 * Math.sin(M1)
    + 1.2740 * Math.sin(2 * D - M1)
    + 0.6583 * Math.sin(2 * D)
    + 0.2136 * Math.sin(2 * M1)
    - 0.1851 * Math.sin(M)
    - 0.1143 * Math.sin(2 * F)
    + 0.0588 * Math.sin(2 * D - 2 * M1)
    + 0.0572 * Math.sin(2 * D - M - M1)
    + 0.0533 * Math.sin(2 * D + M1);
  return norm360(lon);
}

/** Approximate planetary longitudes using simple mean motion */
function planetLongitudes(jd) {
  const T = (jd - 2451545.0) / 36525;
  return [
    { name: 'Sun',     lon: sunLongitude(jd), is_retrograde: false },
    { name: 'Moon',    lon: moonLongitude(jd), is_retrograde: false },
    { name: 'Mars',    lon: norm360(355.433 + 19140.299 * T), is_retrograde: false },
    { name: 'Mercury', lon: norm360(252.251 + 149472.675 * T), is_retrograde: norm(T * 3, 1) < 0.22 },
    { name: 'Jupiter', lon: norm360(34.351 + 3034.906 * T), is_retrograde: norm(T * 0.083, 1) < 0.32 },
    { name: 'Venus',   lon: norm360(181.980 + 58517.816 * T), is_retrograde: norm(T * 0.615, 1) < 0.08 },
    { name: 'Saturn',  lon: norm360(50.077 + 1222.114 * T), is_retrograde: norm(T * 0.033, 1) < 0.35 },
    { name: 'Rahu',    lon: norm360(125.045 - 1934.136 * T), is_retrograde: true },
    { name: 'Ketu',    lon: norm360(305.045 - 1934.136 * T), is_retrograde: true },
  ].map(p => ({
    ...p,
    degree: p.lon % 30,
    zodiac: { name: RASHIS[Math.floor(p.lon / 30)] }
  }));
}

/** Sunrise/sunset in UTC (returned as ISO string) for lat/lon */
function getSunriseSunset(year, month, day, lat, lon, tz = 5.5) {
  const jd = julianDay(year, month, day, 12, 0);
  const T = (jd - 2451545.0) / 36525;
  const L0 = norm360(280.46646 + 36000.76983 * T);
  const M = toRad(norm360(357.52911 + 35999.05029 * T));
  const sunDec = toDeg(Math.asin(Math.sin(toRad(23.4393)) * Math.sin(toRad(L0 + 1.9146 * Math.sin(M)))));
  const latRad = toRad(lat);
  const decRad = toRad(sunDec);
  const cosH = (Math.cos(toRad(90.833)) - Math.sin(latRad) * Math.sin(decRad))
    / (Math.cos(latRad) * Math.cos(decRad));
  if (Math.abs(cosH) > 1) return { sunrise: null, sunset: null };
  const H = toDeg(Math.acos(cosH));
  const solarNoon = (720 - 4 * lon) / 60 + tz; // local hours
  const srH = solarNoon - H / 15;
  const ssH = solarNoon + H / 15;
  const toISO = (h) => {
    const d = new Date(year, month - 1, day);
    d.setHours(Math.floor(h), Math.round((h % 1) * 60));
    return d.toISOString();
  };
  return { sunrise: toISO(srH), sunset: toISO(ssH) };
}

/** Moonrise (rough approximation) */
function getMoonriseMoonset(year, month, day, lat, lon) {
  // Moon rises ~50 minutes later each day than the previous
  const sr = getSunriseSunset(year, month, day, lat, lon);
  if (!sr.sunrise) return { moonrise: null, moonset: null };
  const jd = julianDay(year, month, day);
  const moonAge = ((moonLongitude(jd) - sunLongitude(jd) + 360) % 360) / 360;
  const offset = moonAge * 24; // hours
  const add = (iso, hrs) => {
    const d = new Date(iso);
    d.setHours(d.getHours() + Math.round(hrs));
    return d.toISOString();
  };
  return {
    moonrise: add(sr.sunrise, offset % 24),
    moonset: add(sr.sunset, (offset + 12) % 24)
  };
}

// ─── Core Panchang Calculation ────────────────────────────────────────────────

export function calculatePanchang(dateStr, lat = 28.6139, lon = 77.209) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const jd = julianDay(y, m, d);

  // Vara (weekday) – JD 0 = Monday
  const vara = VARAS[Math.floor(jd + 1.5) % 7];

  // Sun & Moon longitudes (Tropical; approximate Sidereal by subtracting ~23.15°)
  const sunLon  = norm360(sunLongitude(jd) - 23.15);
  const moonLon = norm360(moonLongitude(jd) - 23.15);

  // Tithi
  let moonSunDiff = norm360(moonLon - sunLon);
  const tithiIndex = Math.floor(moonSunDiff / 12); // 0–29
  const tithiDegElapsed = moonSunDiff % 12;
  const tithiDegRemaining = 12 - tithiDegElapsed;
  // Moon moves ~0.508°/hr
  const tithiHoursLeft = tithiDegRemaining / 0.508;
  const tithiEnd = new Date(y, m - 1, d, 12 + tithiHoursLeft).toISOString();

  // Nakshatra
  const nakshatraIndex = Math.floor(moonLon / (360 / 27));
  const nakDeg = moonLon % (360 / 27);
  const nakRemaining = (360 / 27) - nakDeg;
  const nakHoursLeft = nakRemaining / 0.508;
  const nakEnd = new Date(y, m - 1, d, 12 + nakHoursLeft).toISOString();

  // Yoga (Sun + Moon longitude)
  const yogaLon = norm360(sunLon + moonLon);
  const yogaIndex = Math.floor(yogaLon / (360 / 27));
  const yogaRemaining = (360 / 27) - (yogaLon % (360 / 27));
  const yogaHoursLeft = yogaRemaining / (0.985 + 0.508); // sun+moon speed
  const yogaEnd = new Date(y, m - 1, d, 12 + yogaHoursLeft).toISOString();

  // Karana (half tithi)
  const karanaIndex = Math.floor(moonSunDiff / 6) % 11;

  // Sunrise/Sunset
  const { sunrise, sunset } = getSunriseSunset(y, m, d, lat, lon);
  const { moonrise, moonset } = getMoonriseMoonset(y, m, d, lat, lon);

  // Brahma Muhurat (96 mins before sunrise)
  const brahmaMuhuratStart = sunrise ? new Date(new Date(sunrise) - 96 * 60000).toISOString() : null;

  // Planet positions
  const planets = planetLongitudes(jd);

  // Auspicious periods – Abhijit (solar noon ± 24 min)
  const sunriseDate = sunrise ? new Date(sunrise) : new Date(y, m - 1, d, 6);
  const sunsetDate  = sunset  ? new Date(sunset)  : new Date(y, m - 1, d, 18);
  const dayLen = sunsetDate - sunriseDate;
  const noon = new Date(sunriseDate.getTime() + dayLen / 2);
  const abhijitStart = new Date(noon - 24 * 60000).toISOString();
  const abhijitEnd   = new Date(noon + 24 * 60000).toISOString();

  // Inauspicious periods
  const dayMs = dayLen / 8;
  const rahukalaMap = [7, 1, 6, 4, 5, 3, 2]; // Sun-Sat index → slot
  const weekdayIdx = Math.floor(jd + 1.5) % 7;
  const rahuSlot = rahukalaMap[weekdayIdx];
  const rahuStart = new Date(sunriseDate.getTime() + rahuSlot * dayMs).toISOString();
  const rahuEnd   = new Date(sunriseDate.getTime() + (rahuSlot + 1) * dayMs).toISOString();

  const gulikaMap = [6, 5, 4, 3, 2, 1, 0];
  const gulikaSlot = gulikaMap[weekdayIdx];
  const gulikaStart = new Date(sunriseDate.getTime() + gulikaSlot * dayMs).toISOString();
  const gulikaEnd   = new Date(sunriseDate.getTime() + (gulikaSlot + 1) * dayMs).toISOString();

  const yamagandaMap = [4, 3, 2, 1, 0, 6, 5];
  const yamaSlot = yamagandaMap[weekdayIdx];
  const yamaStart = new Date(sunriseDate.getTime() + yamaSlot * dayMs).toISOString();
  const yamaEnd   = new Date(sunriseDate.getTime() + (yamaSlot + 1) * dayMs).toISOString();

  // Choghadiya (8 day + 8 night slots)
  const choghadiyaOrder = {
    0: ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg'],      // Sun
    1: ['Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit'],       // Mon
    2: ['Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'],         // Tue
    3: ['Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh'],        // Wed
    4: ['Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh'],       // Thu
    5: ['Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char'],        // Fri
    6: ['Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal'],        // Sat
  };
  const nightOrder = {
    0: ['Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh'],
    1: ['Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char'],
    2: ['Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal'],
    3: ['Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg'],
    4: ['Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit'],
    5: ['Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog'],
    6: ['Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh'],
  };
  const dayChog = (choghadiyaOrder[weekdayIdx] || choghadiyaOrder[0]).map((name, i) => ({
    name,
    start: new Date(sunriseDate.getTime() + i * dayMs).toISOString(),
    end:   new Date(sunriseDate.getTime() + (i + 1) * dayMs).toISOString(),
  }));
  const nightMs = (24 * 3600000 - dayLen) / 8;
  const nightChog = (nightOrder[weekdayIdx] || nightOrder[0]).map((name, i) => ({
    name,
    start: new Date(sunsetDate.getTime() + i * nightMs).toISOString(),
    end:   new Date(sunsetDate.getTime() + (i + 1) * nightMs).toISOString(),
  }));

  // Hora (planetary hours) — 12 day + 12 night = 24 hora
  const horaLords = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];
  // Day hora: 12 equal slots from sunrise to sunset
  const dayHoraMs = dayLen / 12;
  // Night hora: 12 equal slots from sunset to next sunrise
  const nightLen = 24 * 3600000 - dayLen;
  const nightHoraMs = nightLen / 12;
  // Starting lord depends on weekday
  const horaDay = Array.from({ length: 12 }, (_, i) => ({
    name: horaLords[(weekdayIdx + i) % 7],
    start: new Date(sunriseDate.getTime() + i * dayHoraMs).toISOString(),
    end:   new Date(sunriseDate.getTime() + (i + 1) * dayHoraMs).toISOString(),
  }));
  // Night hora starts from the lord at position 12 from the day start
  const horanight = Array.from({ length: 12 }, (_, i) => ({
    name: horaLords[(weekdayIdx + 12 + i) % 7],
    start: new Date(sunsetDate.getTime() + i * nightHoraMs).toISOString(),
    end:   new Date(sunsetDate.getTime() + (i + 1) * nightHoraMs).toISOString(),
  }));

  return {
    // panchang/advanced format
    tithi: [{
      index: tithiIndex + 1,
      name: TITHIS[tithiIndex],
      paksha: TITHI_PAKSHA[tithiIndex],
      type: TITHI_TYPES[tithiIndex],
      end: tithiEnd,
    }],
    nakshatra: [{
      index: nakshatraIndex + 1,
      name: NAKSHATRAS[nakshatraIndex].name,
      deity: NAKSHATRAS[nakshatraIndex].deity,
      lord: NAKSHATRAS[nakshatraIndex].lord,
      end: nakEnd,
    }],
    yoga: [{
      index: yogaIndex + 1,
      name: YOGAS[yogaIndex],
      end: yogaEnd,
    }],
    karana: [{
      name: KARANAS[karanaIndex],
      end: tithiEnd,
    }],
    vaara: vara,
    paksha: { name: TITHI_PAKSHA[tithiIndex] },
    sunrise,
    sunset,
    moonrise,
    moonset,
    planet_position: planets,
    auspicious_period: [
      { name: 'Brahma Muhurat', period: [{ start: brahmaMuhuratStart, end: sunrise }] },
      { name: 'Abhijit Muhurat', period: [{ start: abhijitStart, end: abhijitEnd }] },
      { name: 'Amrit Kaal', period: [{ start: abhijitEnd, end: new Date(new Date(abhijitEnd).getTime() + 48 * 60000).toISOString() }] },
    ],
    inauspicious_period: [
      { name: 'Rahu Kaal', period: [{ start: rahuStart, end: rahuEnd }] },
      { name: 'Gulika Kaal', period: [{ start: gulikaStart, end: gulikaEnd }] },
      { name: 'Yamaganda', period: [{ start: yamaStart, end: yamaEnd }] },
    ],
    _offline: true,

    // choghadiya structure (matches UI expectation)
    choghadiya: {
      day_choghadiya: dayChog,
      night_choghadiya: nightChog,
    },

    // hora structure — use day_hora/night_hora keys directly (matches UI expectation)
    hora: {
      day_hora: horaDay,
      night_hora: horanight,
    }
  };
}
