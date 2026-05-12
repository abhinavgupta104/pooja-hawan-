require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

let cachedToken = null;
let tokenExpiry = null;

const getProkeralaToken = async () => {
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    try {
        const response = await axios.post('https://api.prokerala.com/token', new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.PROKERALA_CLIENT_ID,
            client_secret: process.env.PROKERALA_CLIENT_SECRET
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        cachedToken = response.data.access_token;
        tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
        return cachedToken;
    } catch (error) {
        console.error('Error fetching token:', error.response?.data || error.message);
        throw new Error('Failed to authenticate with Prokerala API');
    }
};

// Generic proxy for all astrology endpoints
// Generic proxy for all astrology endpoints
app.use('/api/prokerala', async (req, res) => {
    const endpoint = req.path.replace(/^\/+/, '');
    const query = { ...req.query };
    
    // Fail-safe: Fix space encoding in datetime
    if (query.datetime && typeof query.datetime === 'string') {
        query.datetime = query.datetime.replace(' ', '+');
    }
    
    console.log(`[Proxy] Request: ${endpoint} | Params:`, query);

    try {
        const token = await getProkeralaToken();
        
        const response = await axios.get(`https://api.prokerala.com/v2/astrology/${endpoint}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { ayanamsa: 1, ...query }
        });

        // Special case: For panchang/advanced, try to merge basic info if not present
        if (endpoint === 'panchang/advanced' && !response.data.data.vikram_samvat) {
            try {
                const basic = await axios.get(`https://api.prokerala.com/v2/astrology/panchang`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    params: { ayanamsa: 1, ...query }
                });
                response.data.data = {
                    ...response.data.data,
                    vikram_samvat: basic.data.data.vikram_samvat,
                    shaka_samvat: basic.data.data.shaka_samvat,
                    lunar_month: basic.data.data.lunar_month
                };
            } catch (e) {
                console.warn("[Proxy] Failed to merge basic panchang:", e.message);
            }
        }

        res.json(response.data);
    } catch (error) {
        console.error(`[Proxy] Prokerala API Error on ${req.path}:`, error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { error: `Failed to fetch ${req.path}` });
    }
});

// Backward compatibility points
app.get('/api/panchang', async (req, res) => {
    res.redirect(`/api/prokerala/panchang/advanced?${new URLSearchParams(req.query).toString()}`);
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/kundli', async (req, res) => {
    res.redirect(`/api/prokerala/kundli?${new URLSearchParams(req.query).toString()}`);
});

app.get('/api/kundali', async (req, res) => {
  try {
    const { DateTime } = await import('luxon');
    const vedic = await import('vedic-astro');

    const dateStr = req.query.date || '2000-01-01';
    const timeStr = req.query.time || '12:00';
    const lat = parseFloat(req.query.lat) || 28.6139;
    const lon = parseFloat(req.query.lon) || 77.2090;
    const tz = req.query.tz || 'Asia/Kolkata';
    
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, minute] = timeStr.split(':').map(Number);

    const dateTime = DateTime.fromObject(
      { year, month, day, hour, minute },
      { zone: tz }
    ).toUTC();

    const datetimeParams = { iso: dateTime.toISO() };
    const locationParams = { latitude: lat, longitude: lon };

    const positions = await vedic.getPlanetaryPositions(datetimeParams, locationParams, { ayanamsha: 'lahiri' });
    const kundali = vedic.getKundali(positions);

    res.status(200).json({
      status: 'success',
      data: {
        birth_details: { date: dateStr, time: timeStr, latitude: lat, longitude: lon, timezone: tz },
        positions: positions,
        kundali: kundali
      }
    });
  } catch (error) {
    console.error('Kundali API Error:', error);
    res.status(500).json({ error: 'Failed to calculate Kundali', details: error.message });
  }
});

app.listen(PORT, () => {
    console.log(`Backend proxy server running on http://localhost:${PORT}`);
});
