const BASE_URL = '/api/prokerala';

/**
 * Fetches data from a specific Prokerala endpoint.
 */
const fetchEndpointData = async (endpoint, { date, lat, lon }) => {
  const datetime = `${date}T12:00:00+05:30`;
  const coordinates = `${lat},${lon}`;
  const cacheKey = `${endpoint}_${date}_${lat.slice(0, 5)}_${lon.slice(0, 5)}`;

  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < 24 * 60 * 60 * 1000) return data;
  }

  try {
    const params = new URLSearchParams({ coordinates, datetime, la: 'en' });
    const response = await fetch(`${BASE_URL}/${endpoint}?${params.toString()}`);
    if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
    const result = await response.json();
    
    localStorage.setItem(cacheKey, JSON.stringify({
      data: result.data,
      timestamp: Date.now()
    }));

    return result.data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

export const fetchPanchangData = (params) => fetchEndpointData('panchang/advanced', params);
export const fetchChoghadiyaData = (params) => fetchEndpointData('choghadiya', params);
export const fetchHoraData = (params) => fetchEndpointData('hora', params);

/**
 * Gets user's current coordinates using Geolocation API.
 * Defaults to Delhi if fails.
 */
export const getCurrentCoordinates = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: '28.6139', lon: '77.2090' }); // Delhi default
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
        resolve({ lat: '28.6139', lon: '77.2090' }); // Delhi default
      }
    );
  });
};
