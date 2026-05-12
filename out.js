import { calculatePanchang } from "./panchangCalculator.js";
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
export const getPanchangDetails = async ({ date, lat, lon }) => {
  try {
    const params = new URLSearchParams({ date, lat, lon });
    const response = await fetch(`${BASE_URL}/api/panchang?${params.toString()}`);
    if (!response.ok) throw new Error(`Custom backend returned ${response.status}`);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`[Panchang API] Failed to hit Python backend:`, error);
    return calculatePanchang(date, lat, lon);
  }
};
const fetchEndpointData = async (endpoint, { date, lat, lon }) => {
  const panchangData = await getPanchangDetails({ date, lat, lon });
  if (!panchangData) return {};
  switch (endpoint) {
    case "panchang/tithi":
      return [panchangData.tithi];
    case "panchang/nakshatra":
      return [panchangData.nakshatra];
    case "panchang/yoga":
      return [panchangData.yoga];
    case "panchang/karana":
      return [panchangData.karana];
    case "astrology/planet-position":
      return [];
    // Defer to Kundali backend if components specifically ask for planets
    default:
      return panchangData;
  }
};
export const fetchPanchangData = async (params) => {
  const apiData = await fetchEndpointData("panchang/advanced", params);
  if (apiData && apiData.tithi) return apiData;
  console.log("[Panchang] Computing offline Panchang data...");
  return calculatePanchang(params.date, parseFloat(params.lat), parseFloat(params.lon));
};
export const fetchChoghadiyaData = async (params) => {
  const apiData = await fetchEndpointData("choghadiya", params);
  if (apiData && (apiData.day_choghadiya || apiData.choghadiya)) return apiData;
  const offline = calculatePanchang(params.date, parseFloat(params.lat), parseFloat(params.lon));
  return offline.choghadiya;
};
export const fetchHoraData = async (params) => {
  const apiData = await fetchEndpointData("hora", params);
  if (apiData && (apiData.day_hora || apiData.hora)) return apiData;
  const offline = calculatePanchang(params.date, parseFloat(params.lat), parseFloat(params.lon));
  return offline.hora;
};
export const getCurrentCoordinates = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: "25.3176", lon: "82.9739" });
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
        resolve({ lat: "25.3176", lon: "82.9739" });
      },
      { timeout: 5e3 }
    );
  });
};
