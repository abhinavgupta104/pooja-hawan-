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

app.listen(PORT, () => {
    console.log(`Backend proxy server running on http://localhost:${PORT}`);
});
