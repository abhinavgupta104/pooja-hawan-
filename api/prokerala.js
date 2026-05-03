const axios = require('axios');

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

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Extract endpoint from the path
    // The rewrite rule in vercel.json will send /api/prokerala/some-endpoint to this function
    // We can use req.query.path or similar if we configure it, 
    // but here we'll just extract it from the URL
    const url = new URL(req.url, `http://${req.headers.host}`);
    const endpoint = url.pathname.replace('/api/prokerala/', '');
    
    const query = { ...req.query };
    
    if (query.datetime && typeof query.datetime === 'string') {
        query.datetime = query.datetime.replace(' ', '+');
    }

    try {
        const token = await getProkeralaToken();
        
        const response = await axios.get(`https://api.prokerala.com/v2/astrology/${endpoint}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { ayanamsa: 1, ...query }
        });

        // Special case: For panchang/advanced, merge basic info
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
                console.warn("Failed to merge basic panchang:", e.message);
            }
        }

        res.status(200).json(response.data);
    } catch (error) {
        console.error(`Prokerala API Error on ${endpoint}:`, error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { error: `Failed to fetch ${endpoint}` });
    }
};
