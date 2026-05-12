import axios from 'axios';

// Search locations using OpenStreetMap Nominatim
export const searchLocations = async (query) => {
  if (!query || query.length < 3) return [];
  
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        limit: 5,
        addressdetails: 1,
      },
      headers: {
        'Accept-Language': 'en'
      }
    });
    
    return response.data.map(item => ({
      name: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      city: item.address?.city || item.address?.town || item.address?.village || '',
      state: item.address?.state || '',
      country: item.address?.country || ''
    }));
  } catch (error) {
    console.error("Error searching locations:", error);
    return [];
  }
};

// Fetch Kundali data from our serverless function
export const getKundaliData = async ({ date, time, lat, lon }) => {
  try {
    const response = await axios.get('/api/kundali', {
      params: { date, time, lat, lon },
      timeout: 5000 // 5 seconds timeout
    });
    
    return response.data.data;
  } catch (error) {
    console.error("Error fetching kundali data:", error);
    throw error;
  }
};
