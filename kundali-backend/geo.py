"""
Geocoding and timezone resolution with aggressive caching.

Design goals
------------
1. Never hit an external API for a place we can resolve locally. The city
   table below covers the overwhelming majority of real lookups, so the
   common path costs ~0 ms and makes zero network calls.
2. Respect Nominatim's usage policy (max ~1 req/s, identifiable User-Agent).
   Caching plus the local table keeps us far below any limit.
3. Resolve timezones locally. Returning a real IANA zone name (not a fixed
   UTC offset) matters because pytz then applies the correct historical DST
   rules for the birth date — a one-hour error changes the ascendant.
"""

import logging
import os
import threading
from functools import lru_cache

import pytz
from geopy.geocoders import Nominatim, Photon

log = logging.getLogger(__name__)

# Nominatim requires a User-Agent that identifies the application and gives
# a contact address. Override via env var if the support address changes.
_USER_AGENT = os.environ.get(
    "GEOCODER_USER_AGENT",
    "PujaHavan-Kundali/1.0 (+https://poojahawan.com; support@poojahawan.com)",
)

_nominatim = Nominatim(user_agent=_USER_AGENT, timeout=8)
_photon = Photon(user_agent=_USER_AGENT, timeout=8)

# Serialises outbound geocoder calls so we never exceed ~1 request/second
# across threads, per Nominatim's usage policy.
_geocode_lock = threading.Lock()


# ---------------------------------------------------------------------------
# Local city table:  name -> (lat, lon, IANA timezone, resolved label)
# Covers major Indian population centres, pilgrimage towns, and the cities
# where NRI users are most likely to have been born.
# ---------------------------------------------------------------------------
CITIES = {
    # ── India: metros & large cities ──
    "delhi": (28.6139, 77.2090, "Asia/Kolkata", "Delhi, India"),
    "new delhi": (28.6139, 77.2090, "Asia/Kolkata", "New Delhi, India"),
    "mumbai": (19.0760, 72.8777, "Asia/Kolkata", "Mumbai, Maharashtra, India"),
    "bombay": (19.0760, 72.8777, "Asia/Kolkata", "Mumbai, Maharashtra, India"),
    "bangalore": (12.9716, 77.5946, "Asia/Kolkata", "Bengaluru, Karnataka, India"),
    "bengaluru": (12.9716, 77.5946, "Asia/Kolkata", "Bengaluru, Karnataka, India"),
    "hyderabad": (17.3850, 78.4867, "Asia/Kolkata", "Hyderabad, Telangana, India"),
    "chennai": (13.0827, 80.2707, "Asia/Kolkata", "Chennai, Tamil Nadu, India"),
    "madras": (13.0827, 80.2707, "Asia/Kolkata", "Chennai, Tamil Nadu, India"),
    "kolkata": (22.5726, 88.3639, "Asia/Kolkata", "Kolkata, West Bengal, India"),
    "calcutta": (22.5726, 88.3639, "Asia/Kolkata", "Kolkata, West Bengal, India"),
    "pune": (18.5204, 73.8567, "Asia/Kolkata", "Pune, Maharashtra, India"),
    "ahmedabad": (23.0225, 72.5714, "Asia/Kolkata", "Ahmedabad, Gujarat, India"),
    "surat": (21.1702, 72.8311, "Asia/Kolkata", "Surat, Gujarat, India"),
    "jaipur": (26.9124, 75.7873, "Asia/Kolkata", "Jaipur, Rajasthan, India"),
    "lucknow": (26.8467, 80.9462, "Asia/Kolkata", "Lucknow, Uttar Pradesh, India"),
    "kanpur": (26.4499, 80.3319, "Asia/Kolkata", "Kanpur, Uttar Pradesh, India"),
    "nagpur": (21.1458, 79.0882, "Asia/Kolkata", "Nagpur, Maharashtra, India"),
    "indore": (22.7196, 75.8577, "Asia/Kolkata", "Indore, Madhya Pradesh, India"),
    "bhopal": (23.2599, 77.4126, "Asia/Kolkata", "Bhopal, Madhya Pradesh, India"),
    "patna": (25.5941, 85.1376, "Asia/Kolkata", "Patna, Bihar, India"),
    "varanasi": (25.3176, 82.9739, "Asia/Kolkata", "Varanasi, Uttar Pradesh, India"),
    "banaras": (25.3176, 82.9739, "Asia/Kolkata", "Varanasi, Uttar Pradesh, India"),
    "kashi": (25.3176, 82.9739, "Asia/Kolkata", "Varanasi, Uttar Pradesh, India"),
    "noida": (28.5355, 77.3910, "Asia/Kolkata", "Noida, Uttar Pradesh, India"),
    "greater noida": (28.4744, 77.5040, "Asia/Kolkata", "Greater Noida, Uttar Pradesh, India"),
    "gurgaon": (28.4595, 77.0266, "Asia/Kolkata", "Gurugram, Haryana, India"),
    "gurugram": (28.4595, 77.0266, "Asia/Kolkata", "Gurugram, Haryana, India"),
    "ghaziabad": (28.6692, 77.4538, "Asia/Kolkata", "Ghaziabad, Uttar Pradesh, India"),
    "faridabad": (28.4089, 77.3178, "Asia/Kolkata", "Faridabad, Haryana, India"),
    "thane": (19.2183, 72.9781, "Asia/Kolkata", "Thane, Maharashtra, India"),
    "navi mumbai": (19.0330, 73.0297, "Asia/Kolkata", "Navi Mumbai, Maharashtra, India"),
    "visakhapatnam": (17.6868, 83.2185, "Asia/Kolkata", "Visakhapatnam, Andhra Pradesh, India"),
    "vizag": (17.6868, 83.2185, "Asia/Kolkata", "Visakhapatnam, Andhra Pradesh, India"),
    "vadodara": (22.3072, 73.1812, "Asia/Kolkata", "Vadodara, Gujarat, India"),
    "baroda": (22.3072, 73.1812, "Asia/Kolkata", "Vadodara, Gujarat, India"),
    "ludhiana": (30.9010, 75.8573, "Asia/Kolkata", "Ludhiana, Punjab, India"),
    "agra": (27.1767, 78.0081, "Asia/Kolkata", "Agra, Uttar Pradesh, India"),
    "nashik": (19.9975, 73.7898, "Asia/Kolkata", "Nashik, Maharashtra, India"),
    "rajkot": (22.3039, 70.8022, "Asia/Kolkata", "Rajkot, Gujarat, India"),
    "meerut": (28.9845, 77.7064, "Asia/Kolkata", "Meerut, Uttar Pradesh, India"),
    "coimbatore": (11.0168, 76.9558, "Asia/Kolkata", "Coimbatore, Tamil Nadu, India"),
    "madurai": (9.9252, 78.1198, "Asia/Kolkata", "Madurai, Tamil Nadu, India"),
    "jodhpur": (26.2389, 73.0243, "Asia/Kolkata", "Jodhpur, Rajasthan, India"),
    "amritsar": (31.6340, 74.8723, "Asia/Kolkata", "Amritsar, Punjab, India"),
    "prayagraj": (25.4358, 81.8463, "Asia/Kolkata", "Prayagraj, Uttar Pradesh, India"),
    "allahabad": (25.4358, 81.8463, "Asia/Kolkata", "Prayagraj, Uttar Pradesh, India"),
    "ranchi": (23.3441, 85.3096, "Asia/Kolkata", "Ranchi, Jharkhand, India"),
    "guwahati": (26.1445, 91.7362, "Asia/Kolkata", "Guwahati, Assam, India"),
    "chandigarh": (30.7333, 76.7794, "Asia/Kolkata", "Chandigarh, India"),
    "mysore": (12.2958, 76.6394, "Asia/Kolkata", "Mysuru, Karnataka, India"),
    "mysuru": (12.2958, 76.6394, "Asia/Kolkata", "Mysuru, Karnataka, India"),
    "kochi": (9.9312, 76.2673, "Asia/Kolkata", "Kochi, Kerala, India"),
    "cochin": (9.9312, 76.2673, "Asia/Kolkata", "Kochi, Kerala, India"),
    "thiruvananthapuram": (8.5241, 76.9366, "Asia/Kolkata", "Thiruvananthapuram, Kerala, India"),
    "trivandrum": (8.5241, 76.9366, "Asia/Kolkata", "Thiruvananthapuram, Kerala, India"),
    "bhubaneswar": (20.2961, 85.8245, "Asia/Kolkata", "Bhubaneswar, Odisha, India"),
    "dehradun": (30.3165, 78.0322, "Asia/Kolkata", "Dehradun, Uttarakhand, India"),
    "srinagar": (34.0837, 74.7973, "Asia/Kolkata", "Srinagar, Jammu and Kashmir, India"),
    "jammu": (32.7266, 74.8570, "Asia/Kolkata", "Jammu, Jammu and Kashmir, India"),
    "raipur": (21.2514, 81.6296, "Asia/Kolkata", "Raipur, Chhattisgarh, India"),
    "jamshedpur": (22.8046, 86.2029, "Asia/Kolkata", "Jamshedpur, Jharkhand, India"),
    "gwalior": (26.2183, 78.1828, "Asia/Kolkata", "Gwalior, Madhya Pradesh, India"),
    "aurangabad": (19.8762, 75.3433, "Asia/Kolkata", "Aurangabad, Maharashtra, India"),
    "jabalpur": (23.1815, 79.9864, "Asia/Kolkata", "Jabalpur, Madhya Pradesh, India"),
    "bareilly": (28.3670, 79.4304, "Asia/Kolkata", "Bareilly, Uttar Pradesh, India"),
    "gorakhpur": (26.7606, 83.3732, "Asia/Kolkata", "Gorakhpur, Uttar Pradesh, India"),
    "siliguri": (26.7271, 88.3953, "Asia/Kolkata", "Siliguri, West Bengal, India"),
    "howrah": (22.5958, 88.2636, "Asia/Kolkata", "Howrah, West Bengal, India"),
    "hooghly": (22.9089, 88.3967, "Asia/Kolkata", "Hooghly, West Bengal, India"),
    "rishra": (22.7100, 88.3500, "Asia/Kolkata", "Rishra, Hooghly, West Bengal, India"),
    "durgapur": (23.5204, 87.3119, "Asia/Kolkata", "Durgapur, West Bengal, India"),
    "asansol": (23.6739, 86.9524, "Asia/Kolkata", "Asansol, West Bengal, India"),
    "cuttack": (20.4625, 85.8830, "Asia/Kolkata", "Cuttack, Odisha, India"),
    "ajmer": (26.4499, 74.6399, "Asia/Kolkata", "Ajmer, Rajasthan, India"),
    "udaipur": (24.5854, 73.7125, "Asia/Kolkata", "Udaipur, Rajasthan, India"),
    "kota": (25.2138, 75.8648, "Asia/Kolkata", "Kota, Rajasthan, India"),
    "bikaner": (28.0229, 73.3119, "Asia/Kolkata", "Bikaner, Rajasthan, India"),
    "salem": (11.6643, 78.1460, "Asia/Kolkata", "Salem, Tamil Nadu, India"),
    "tiruchirappalli": (10.7905, 78.7047, "Asia/Kolkata", "Tiruchirappalli, Tamil Nadu, India"),
    "trichy": (10.7905, 78.7047, "Asia/Kolkata", "Tiruchirappalli, Tamil Nadu, India"),
    "vijayawada": (16.5062, 80.6480, "Asia/Kolkata", "Vijayawada, Andhra Pradesh, India"),
    "guntur": (16.3067, 80.4365, "Asia/Kolkata", "Guntur, Andhra Pradesh, India"),
    "warangal": (17.9689, 79.5941, "Asia/Kolkata", "Warangal, Telangana, India"),
    "hubli": (15.3647, 75.1240, "Asia/Kolkata", "Hubli, Karnataka, India"),
    "mangalore": (12.9141, 74.8560, "Asia/Kolkata", "Mangaluru, Karnataka, India"),
    "belgaum": (15.8497, 74.4977, "Asia/Kolkata", "Belagavi, Karnataka, India"),
    "solapur": (17.6599, 75.9064, "Asia/Kolkata", "Solapur, Maharashtra, India"),
    "kolhapur": (16.7050, 74.2433, "Asia/Kolkata", "Kolhapur, Maharashtra, India"),
    "amravati": (20.9374, 77.7796, "Asia/Kolkata", "Amravati, Maharashtra, India"),
    "jamnagar": (22.4707, 70.0577, "Asia/Kolkata", "Jamnagar, Gujarat, India"),
    "bhavnagar": (21.7645, 72.1519, "Asia/Kolkata", "Bhavnagar, Gujarat, India"),
    "gandhinagar": (23.2156, 72.6369, "Asia/Kolkata", "Gandhinagar, Gujarat, India"),
    "jalandhar": (31.3260, 75.5762, "Asia/Kolkata", "Jalandhar, Punjab, India"),
    "patiala": (30.3398, 76.3869, "Asia/Kolkata", "Patiala, Punjab, India"),
    "panipat": (29.3909, 76.9635, "Asia/Kolkata", "Panipat, Haryana, India"),
    "rohtak": (28.8955, 76.6066, "Asia/Kolkata", "Rohtak, Haryana, India"),
    "hisar": (29.1492, 75.7217, "Asia/Kolkata", "Hisar, Haryana, India"),
    "aligarh": (27.8974, 78.0880, "Asia/Kolkata", "Aligarh, Uttar Pradesh, India"),
    "moradabad": (28.8386, 78.7733, "Asia/Kolkata", "Moradabad, Uttar Pradesh, India"),
    "saharanpur": (29.9680, 77.5552, "Asia/Kolkata", "Saharanpur, Uttar Pradesh, India"),
    "firozabad": (27.1592, 78.3957, "Asia/Kolkata", "Firozabad, Uttar Pradesh, India"),
    "jhansi": (25.4484, 78.5685, "Asia/Kolkata", "Jhansi, Uttar Pradesh, India"),
    "muzaffarpur": (26.1209, 85.3647, "Asia/Kolkata", "Muzaffarpur, Bihar, India"),
    "bhagalpur": (25.2425, 86.9842, "Asia/Kolkata", "Bhagalpur, Bihar, India"),
    "darbhanga": (26.1542, 85.8918, "Asia/Kolkata", "Darbhanga, Bihar, India"),
    "imphal": (24.8170, 93.9368, "Asia/Kolkata", "Imphal, Manipur, India"),
    "shillong": (25.5788, 91.8933, "Asia/Kolkata", "Shillong, Meghalaya, India"),
    "agartala": (23.8315, 91.2868, "Asia/Kolkata", "Agartala, Tripura, India"),
    "shimla": (31.1048, 77.1734, "Asia/Kolkata", "Shimla, Himachal Pradesh, India"),
    "panaji": (15.4909, 73.8278, "Asia/Kolkata", "Panaji, Goa, India"),
    "goa": (15.2993, 74.1240, "Asia/Kolkata", "Goa, India"),
    "pondicherry": (11.9416, 79.8083, "Asia/Kolkata", "Puducherry, India"),
    "puducherry": (11.9416, 79.8083, "Asia/Kolkata", "Puducherry, India"),
    # ── India: pilgrimage / temple towns ──
    "ayodhya": (26.7922, 82.1998, "Asia/Kolkata", "Ayodhya, Uttar Pradesh, India"),
    "mathura": (27.4924, 77.6737, "Asia/Kolkata", "Mathura, Uttar Pradesh, India"),
    "vrindavan": (27.5820, 77.7000, "Asia/Kolkata", "Vrindavan, Uttar Pradesh, India"),
    "haridwar": (29.9457, 78.1642, "Asia/Kolkata", "Haridwar, Uttarakhand, India"),
    "rishikesh": (30.0869, 78.2676, "Asia/Kolkata", "Rishikesh, Uttarakhand, India"),
    "ujjain": (23.1765, 75.7885, "Asia/Kolkata", "Ujjain, Madhya Pradesh, India"),
    "puri": (19.8135, 85.8312, "Asia/Kolkata", "Puri, Odisha, India"),
    "tirupati": (13.6288, 79.4192, "Asia/Kolkata", "Tirupati, Andhra Pradesh, India"),
    "shirdi": (19.7645, 74.4769, "Asia/Kolkata", "Shirdi, Maharashtra, India"),
    "dwarka": (22.2394, 68.9678, "Asia/Kolkata", "Dwarka, Gujarat, India"),
    "somnath": (20.8880, 70.4012, "Asia/Kolkata", "Somnath, Gujarat, India"),
    "gaya": (24.7955, 85.0002, "Asia/Kolkata", "Gaya, Bihar, India"),
    "bodh gaya": (24.6961, 84.9869, "Asia/Kolkata", "Bodh Gaya, Bihar, India"),
    "pushkar": (26.4899, 74.5511, "Asia/Kolkata", "Pushkar, Rajasthan, India"),
    "rameswaram": (9.2876, 79.3129, "Asia/Kolkata", "Rameswaram, Tamil Nadu, India"),
    "kanyakumari": (8.0883, 77.5385, "Asia/Kolkata", "Kanyakumari, Tamil Nadu, India"),
    "kedarnath": (30.7346, 79.0669, "Asia/Kolkata", "Kedarnath, Uttarakhand, India"),
    "badrinath": (30.7433, 79.4938, "Asia/Kolkata", "Badrinath, Uttarakhand, India"),
    "amarnath": (34.2130, 75.5010, "Asia/Kolkata", "Amarnath, Jammu and Kashmir, India"),
    "vaishno devi": (33.0308, 74.9497, "Asia/Kolkata", "Katra (Vaishno Devi), Jammu and Kashmir, India"),
    "katra": (32.9917, 74.9319, "Asia/Kolkata", "Katra, Jammu and Kashmir, India"),
    "chitrakoot": (25.2000, 80.8333, "Asia/Kolkata", "Chitrakoot, Uttar Pradesh, India"),
    "nathdwara": (24.9366, 73.8236, "Asia/Kolkata", "Nathdwara, Rajasthan, India"),
    "kurukshetra": (29.9695, 76.8783, "Asia/Kolkata", "Kurukshetra, Haryana, India"),
    # ── South Asia ──
    "kathmandu": (27.7172, 85.3240, "Asia/Kathmandu", "Kathmandu, Nepal"),
    "pokhara": (28.2096, 83.9856, "Asia/Kathmandu", "Pokhara, Nepal"),
    "colombo": (6.9271, 79.8612, "Asia/Colombo", "Colombo, Sri Lanka"),
    "kandy": (7.2906, 80.6337, "Asia/Colombo", "Kandy, Sri Lanka"),
    "dhaka": (23.8103, 90.4125, "Asia/Dhaka", "Dhaka, Bangladesh"),
    "chittagong": (22.3569, 91.7832, "Asia/Dhaka", "Chattogram, Bangladesh"),
    "karachi": (24.8607, 67.0011, "Asia/Karachi", "Karachi, Pakistan"),
    "lahore": (31.5204, 74.3587, "Asia/Karachi", "Lahore, Pakistan"),
    "islamabad": (33.6844, 73.0479, "Asia/Karachi", "Islamabad, Pakistan"),
    "thimphu": (27.4728, 89.6390, "Asia/Thimphu", "Thimphu, Bhutan"),
    "male": (4.1755, 73.5093, "Indian/Maldives", "Malé, Maldives"),
    # ── Gulf (large Indian diaspora) ──
    "dubai": (25.2048, 55.2708, "Asia/Dubai", "Dubai, United Arab Emirates"),
    "abu dhabi": (24.4539, 54.3773, "Asia/Dubai", "Abu Dhabi, United Arab Emirates"),
    "sharjah": (25.3463, 55.4209, "Asia/Dubai", "Sharjah, United Arab Emirates"),
    "doha": (25.2854, 51.5310, "Asia/Qatar", "Doha, Qatar"),
    "kuwait city": (29.3759, 47.9774, "Asia/Kuwait", "Kuwait City, Kuwait"),
    "muscat": (23.5880, 58.3829, "Asia/Muscat", "Muscat, Oman"),
    "manama": (26.2285, 50.5860, "Asia/Bahrain", "Manama, Bahrain"),
    "riyadh": (24.7136, 46.6753, "Asia/Riyadh", "Riyadh, Saudi Arabia"),
    "jeddah": (21.4858, 39.1925, "Asia/Riyadh", "Jeddah, Saudi Arabia"),
    # ── Rest of world (common diaspora birthplaces) ──
    "london": (51.5074, -0.1278, "Europe/London", "London, United Kingdom"),
    "birmingham": (52.4862, -1.8904, "Europe/London", "Birmingham, United Kingdom"),
    "manchester": (53.4808, -2.2426, "Europe/London", "Manchester, United Kingdom"),
    "leicester": (52.6369, -1.1398, "Europe/London", "Leicester, United Kingdom"),
    "glasgow": (55.8642, -4.2518, "Europe/London", "Glasgow, United Kingdom"),
    "dublin": (53.3498, -6.2603, "Europe/Dublin", "Dublin, Ireland"),
    "paris": (48.8566, 2.3522, "Europe/Paris", "Paris, France"),
    "berlin": (52.5200, 13.4050, "Europe/Berlin", "Berlin, Germany"),
    "frankfurt": (50.1109, 8.6821, "Europe/Berlin", "Frankfurt, Germany"),
    "munich": (48.1351, 11.5820, "Europe/Berlin", "Munich, Germany"),
    "amsterdam": (52.3676, 4.9041, "Europe/Amsterdam", "Amsterdam, Netherlands"),
    "zurich": (47.3769, 8.5417, "Europe/Zurich", "Zurich, Switzerland"),
    "rome": (41.9028, 12.4964, "Europe/Rome", "Rome, Italy"),
    "madrid": (40.4168, -3.7038, "Europe/Madrid", "Madrid, Spain"),
    "lisbon": (38.7223, -9.1393, "Europe/Lisbon", "Lisbon, Portugal"),
    "moscow": (55.7558, 37.6173, "Europe/Moscow", "Moscow, Russia"),
    "new york": (40.7128, -74.0060, "America/New_York", "New York, USA"),
    "new york city": (40.7128, -74.0060, "America/New_York", "New York, USA"),
    "jersey city": (40.7178, -74.0431, "America/New_York", "Jersey City, New Jersey, USA"),
    "edison": (40.5187, -74.4121, "America/New_York", "Edison, New Jersey, USA"),
    "boston": (42.3601, -71.0589, "America/New_York", "Boston, Massachusetts, USA"),
    "washington": (38.9072, -77.0369, "America/New_York", "Washington, D.C., USA"),
    "atlanta": (33.7490, -84.3880, "America/New_York", "Atlanta, Georgia, USA"),
    "miami": (25.7617, -80.1918, "America/New_York", "Miami, Florida, USA"),
    "philadelphia": (39.9526, -75.1652, "America/New_York", "Philadelphia, Pennsylvania, USA"),
    "detroit": (42.3314, -83.0458, "America/Detroit", "Detroit, Michigan, USA"),
    "chicago": (41.8781, -87.6298, "America/Chicago", "Chicago, Illinois, USA"),
    "houston": (29.7604, -95.3698, "America/Chicago", "Houston, Texas, USA"),
    "dallas": (32.7767, -96.7970, "America/Chicago", "Dallas, Texas, USA"),
    "austin": (30.2672, -97.7431, "America/Chicago", "Austin, Texas, USA"),
    "denver": (39.7392, -104.9903, "America/Denver", "Denver, Colorado, USA"),
    "phoenix": (33.4484, -112.0740, "America/Phoenix", "Phoenix, Arizona, USA"),
    "seattle": (47.6062, -122.3321, "America/Los_Angeles", "Seattle, Washington, USA"),
    "san francisco": (37.7749, -122.4194, "America/Los_Angeles", "San Francisco, California, USA"),
    "san jose": (37.3382, -121.8863, "America/Los_Angeles", "San Jose, California, USA"),
    "los angeles": (34.0522, -118.2437, "America/Los_Angeles", "Los Angeles, California, USA"),
    "toronto": (43.6532, -79.3832, "America/Toronto", "Toronto, Ontario, Canada"),
    "brampton": (43.7315, -79.7624, "America/Toronto", "Brampton, Ontario, Canada"),
    "mississauga": (43.5890, -79.6441, "America/Toronto", "Mississauga, Ontario, Canada"),
    "vancouver": (49.2827, -123.1207, "America/Vancouver", "Vancouver, British Columbia, Canada"),
    "calgary": (51.0447, -114.0719, "America/Edmonton", "Calgary, Alberta, Canada"),
    "montreal": (45.5017, -73.5673, "America/Toronto", "Montreal, Quebec, Canada"),
    "sydney": (-33.8688, 151.2093, "Australia/Sydney", "Sydney, Australia"),
    "melbourne": (-37.8136, 144.9631, "Australia/Melbourne", "Melbourne, Australia"),
    "brisbane": (-27.4698, 153.0251, "Australia/Brisbane", "Brisbane, Australia"),
    "perth": (-31.9505, 115.8605, "Australia/Perth", "Perth, Australia"),
    "adelaide": (-34.9285, 138.6007, "Australia/Adelaide", "Adelaide, Australia"),
    "auckland": (-36.8485, 174.7633, "Pacific/Auckland", "Auckland, New Zealand"),
    "singapore": (1.3521, 103.8198, "Asia/Singapore", "Singapore"),
    "kuala lumpur": (3.1390, 101.6869, "Asia/Kuala_Lumpur", "Kuala Lumpur, Malaysia"),
    "bangkok": (13.7563, 100.5018, "Asia/Bangkok", "Bangkok, Thailand"),
    "hong kong": (22.3193, 114.1694, "Asia/Hong_Kong", "Hong Kong"),
    "tokyo": (35.6762, 139.6503, "Asia/Tokyo", "Tokyo, Japan"),
    "seoul": (37.5665, 126.9780, "Asia/Seoul", "Seoul, South Korea"),
    "shanghai": (31.2304, 121.4737, "Asia/Shanghai", "Shanghai, China"),
    "beijing": (39.9042, 116.4074, "Asia/Shanghai", "Beijing, China"),
    "jakarta": (-6.2088, 106.8456, "Asia/Jakarta", "Jakarta, Indonesia"),
    "manila": (14.5995, 120.9842, "Asia/Manila", "Manila, Philippines"),
    "nairobi": (-1.2921, 36.8219, "Africa/Nairobi", "Nairobi, Kenya"),
    "johannesburg": (-26.2041, 28.0473, "Africa/Johannesburg", "Johannesburg, South Africa"),
    "durban": (-29.8587, 31.0218, "Africa/Johannesburg", "Durban, South Africa"),
    "lagos": (6.5244, 3.3792, "Africa/Lagos", "Lagos, Nigeria"),
    "cairo": (30.0444, 31.2357, "Africa/Cairo", "Cairo, Egypt"),
    "port louis": (-20.1609, 57.5012, "Indian/Mauritius", "Port Louis, Mauritius"),
    "suva": (-18.1416, 178.4419, "Pacific/Fiji", "Suva, Fiji"),
    "georgetown": (6.8013, -58.1551, "America/Guyana", "Georgetown, Guyana"),
    "port of spain": (10.6596, -61.5089, "America/Port_of_Spain", "Port of Spain, Trinidad and Tobago"),
    "paramaribo": (5.8520, -55.2038, "America/Paramaribo", "Paramaribo, Suriname"),
    "sao paulo": (-23.5505, -46.6333, "America/Sao_Paulo", "São Paulo, Brazil"),
    "mexico city": (19.4326, -99.1332, "America/Mexico_City", "Mexico City, Mexico"),
}


# ---------------------------------------------------------------------------
# Timezone resolution — local, no network.
# Bounding boxes for single-timezone countries/regions. Returning a real IANA
# zone (rather than a fixed offset) is what lets pytz apply historical DST.
# ---------------------------------------------------------------------------
# (lat_min, lat_max, lon_min, lon_max, IANA zone)
_TZ_BOXES = [
    (6.0, 37.5, 68.0, 97.5, "Asia/Kolkata"),        # India
    (26.3, 30.5, 80.0, 88.3, "Asia/Kathmandu"),     # Nepal
    (5.9, 9.9, 79.6, 81.9, "Asia/Colombo"),         # Sri Lanka
    (20.5, 26.7, 88.0, 92.7, "Asia/Dhaka"),         # Bangladesh
    (23.6, 37.1, 60.8, 77.1, "Asia/Karachi"),       # Pakistan
    (26.7, 28.4, 88.7, 92.2, "Asia/Thimphu"),       # Bhutan
    (9.4, 28.6, 92.1, 101.2, "Asia/Yangon"),        # Myanmar
    (22.0, 26.5, 51.0, 56.5, "Asia/Dubai"),         # UAE
    (16.0, 32.2, 34.5, 55.7, "Asia/Riyadh"),        # Saudi/Gulf mainland
    (49.0, 61.0, -8.7, 1.8, "Europe/London"),       # UK
    (51.4, 55.4, -10.5, -5.9, "Europe/Dublin"),     # Ireland
    (41.3, 51.1, -5.2, 9.6, "Europe/Paris"),        # France
    (47.2, 55.1, 5.8, 15.1, "Europe/Berlin"),       # Germany
    (35.4, 47.1, 6.6, 18.6, "Europe/Rome"),         # Italy
    (35.9, 43.8, -9.4, 3.4, "Europe/Madrid"),       # Spain
    (1.2, 7.4, 99.6, 119.3, "Asia/Kuala_Lumpur"),   # Malaysia/Singapore
    (5.6, 20.5, 97.3, 105.7, "Asia/Bangkok"),       # Thailand
    (30.9, 45.6, 129.0, 146.0, "Asia/Tokyo"),       # Japan
    (33.1, 38.7, 125.9, 129.6, "Asia/Seoul"),       # South Korea
    (-34.9, -8.0, 112.9, 129.0, "Australia/Perth"), # Western Australia
    (-39.2, -10.0, 140.9, 154.0, "Australia/Sydney"),  # Eastern Australia
    (-47.3, -34.0, 166.4, 178.6, "Pacific/Auckland"),  # New Zealand
    (-35.0, -22.1, 16.4, 33.0, "Africa/Johannesburg"), # South Africa
    (-4.7, 5.5, 33.9, 41.9, "Africa/Nairobi"),      # Kenya
    (22.0, 31.7, 24.7, 36.9, "Africa/Cairo"),       # Egypt
]


def _tz_from_offset(lon: float) -> str:
    """Last-resort timezone from longitude. No DST — flagged to the caller."""
    offset = round(lon / 15)
    if offset == 0:
        return "UTC"
    # POSIX/pytz sign convention is inverted for Etc/GMT zones.
    key = f"Etc/GMT{-offset:+d}"
    try:
        pytz.timezone(key)
        return key
    except Exception:
        return "UTC"


def resolve_timezone(lat: float, lon: float) -> tuple[str, bool]:
    """
    Return (IANA timezone name, is_exact).

    is_exact is False when we fell back to a longitude-derived UTC offset,
    which carries no DST rules — the caller should surface that caveat.
    """
    for lat_min, lat_max, lon_min, lon_max, zone in _TZ_BOXES:
        if lat_min <= lat <= lat_max and lon_min <= lon <= lon_max:
            return zone, True
    return _tz_from_offset(lon), False


# ---------------------------------------------------------------------------
# Geocoding
# ---------------------------------------------------------------------------
class GeocodingError(Exception):
    """Raised when a place cannot be resolved to coordinates."""


def _normalise(place: str) -> str:
    return " ".join(place.lower().replace(",", " ").split())


@lru_cache(maxsize=2048)
def _geocode_remote(place_key: str):
    """
    Query the external geocoders. Cached, so a given place is fetched once
    per instance lifetime. Returns (lat, lon, label) or None.
    """
    with _geocode_lock:
        try:
            loc = _nominatim.geocode(place_key)
            if loc:
                return (loc.latitude, loc.longitude, loc.address)
        except Exception as exc:
            log.warning("Nominatim lookup failed for %r: %s", place_key, exc)

        try:
            loc = _photon.geocode(place_key)
            if loc:
                return (loc.latitude, loc.longitude, loc.address)
        except Exception as exc:
            log.warning("Photon lookup failed for %r: %s", place_key, exc)

    return None


def geocode(place: str) -> tuple[float, float, str, str, bool]:
    """
    Resolve a free-text place to (lat, lon, label, timezone, tz_is_exact).

    Local table first (0 ms, no network); falls back to Nominatim then Photon,
    both cached. Raises GeocodingError if the place cannot be found.
    """
    key = _normalise(place)
    if not key:
        raise GeocodingError("Place is empty")

    hit = CITIES.get(key)
    if hit:
        lat, lon, tz, label = hit
        return lat, lon, label, tz, True

    # Try progressively shorter prefixes so "Varanasi Uttar Pradesh India"
    # still matches the "varanasi" entry before we go to the network.
    parts = key.split()
    for size in range(min(3, len(parts)), 0, -1):
        hit = CITIES.get(" ".join(parts[:size]))
        if hit:
            lat, lon, tz, label = hit
            return lat, lon, label, tz, True

    result = _geocode_remote(key)
    if not result:
        raise GeocodingError(f"Could not find the place '{place}'")

    lat, lon, label = result
    tz, exact = resolve_timezone(lat, lon)
    return lat, lon, label, tz, exact


def cache_stats() -> dict:
    info = _geocode_remote.cache_info()
    return {
        "local_cities": len(CITIES),
        "remote_cache_hits": info.hits,
        "remote_cache_misses": info.misses,
        "remote_cache_size": info.currsize,
    }
