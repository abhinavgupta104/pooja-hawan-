import { calculatePanchang } from './panchangCalculator.js';

// Point completely to our own Python backend (Running on port 8080 or deployed URL)
// Ensure you update BASE_URL to your production python backend URL when deploying.
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://pooja-hawan-1.onrender.com';

/**
 * Fetches Panchang data securely from our in-house Python Swiss Ephemeris engine.
 * Bypasses all Prokerala API limits & reliance.
 */
export const getPanchangDetails = async ({ date, lat, lon }) => {
  try {
    const params = new URLSearchParams({ date, lat, lon });
    
    const response = await fetch(`${BASE_URL}/api/panchang?${params.toString()}`);
    if (!response.ok) throw new Error(`Custom backend returned ${response.status}`);
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`[Panchang API] Failed to hit Python backend:`, error);
    // Ultimate fallback if backend is momentarily restarting
    return calculatePanchang(date, lat, lon);
  }
};

// Map old Prokerala-specific endpoints to our unified daily panchang data
// This prevents breaking existing React components that call fetchEndpointData
const fetchEndpointData = async (endpoint, { date, lat, lon }) => {
  const panchangData = await getPanchangDetails({ date, lat, lon });
  
  if (!panchangData) return {};

  // Simulate Prokerala's shape to appease the frontend cleanly
  switch(endpoint) {
    case 'panchang/tithi':
      return [panchangData.tithi];
    case 'panchang/nakshatra':
      return [panchangData.nakshatra];
    case 'panchang/yoga':
      return [panchangData.yoga];
    case 'panchang/karana':
      return [panchangData.karana];
    case 'astrology/planet-position':
      return []; // Defer to Kundali backend if components specifically ask for planets
    default:
      return panchangData;
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
