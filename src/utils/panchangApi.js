import { calculatePanchang } from './panchangCalculator.js';

const BASE_URL = '/api/prokerala';

/**
 * Fetches data from a specific Prokerala endpoint.
 * Falls back to offline calculator if the API is unavailable.
 */
const fetchEndpointData = async (endpoint, { date, lat, lon }) => {
  const datetime = `${date}T12:00:00+05:30`;
  const coordinates = `${lat},${lon}`;
  const cacheKey = `pk_${endpoint.replace('/', '_')}_${date}_${String(lat).slice(0, 5)}_${String(lon).slice(0, 5)}`;

  // Return cached data if fresh (< 6 hours) and valid
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 6 * 60 * 60 * 1000 && data && typeof data === 'object') {
        return data;
      }
    }
  } catch (_) {}

  try {
    const params = new URLSearchParams({ coordinates, datetime, la: 'en' });
    const response = await fetch(`${BASE_URL}/${endpoint}?${params.toString()}`);
    if (!response.ok) throw new Error(`API returned ${response.status}`);
    const result = await response.json();
    const data = result.data;
    if (!data || typeof data !== 'object') throw new Error('Invalid API response shape');

    try {
      localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
    } catch (_) {}

    return data;
  } catch (error) {
    // Clear potentially corrupt cache entry
    try { localStorage.removeItem(cacheKey); } catch (_) {}
    console.warn(`[Panchang] API unavailable for '${endpoint}', using offline calculator. Reason: ${error.message}`);
    return null; // caller handles fallback
  }
};

/**
 * Fetches all panchang data, with offline fallback.
 */
export const fetchPanchangData = async (params) => {
  const apiData = await fetchEndpointData('panchang/advanced', params);
  if (apiData && apiData.tithi) return apiData; // validate shape

  // Offline fallback
  console.log('[Panchang] Computing offline Panchang data...');
  return calculatePanchang(params.date, parseFloat(params.lat), parseFloat(params.lon));
};

/**
 * Fetches Choghadiya data with offline fallback.
 */
export const fetchChoghadiyaData = async (params) => {
  const apiData = await fetchEndpointData('choghadiya', params);
  if (apiData && (apiData.day_choghadiya || apiData.choghadiya)) return apiData;

  const offline = calculatePanchang(params.date, parseFloat(params.lat), parseFloat(params.lon));
  return offline.choghadiya;
};

/**
 * Fetches Hora data with offline fallback.
 */
export const fetchHoraData = async (params) => {
  const apiData = await fetchEndpointData('hora', params);
  if (apiData && (apiData.day_hora || apiData.hora)) return apiData;

  const offline = calculatePanchang(params.date, parseFloat(params.lat), parseFloat(params.lon));
  return offline.hora;
};

/**
 * Gets user's current coordinates using Geolocation API.
 * Defaults to Varanasi if fails.
 */
export const getCurrentCoordinates = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: '25.3176', lon: '82.9739' }); // Varanasi default
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude.toString(),
          lon: position.coords.longitude.toString()
        });
      },
      () => {
        resolve({ lat: '25.3176', lon: '82.9739' }); // Varanasi default
      },
      { timeout: 5000 }
    );
  });
};
