import swisseph as swe
import os

# Set ephemeris path
EPHE_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ephe')
swe.set_ephe_path(EPHE_PATH)

RASHIS = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

PLANET_MAP = {
    'Sun': swe.SUN,
    'Moon': swe.MOON,
    'Mars': swe.MARS,
    'Mercury': swe.MERCURY,
    'Jupiter': swe.JUPITER,
    'Venus': swe.VENUS,
    'Saturn': swe.SATURN,
    'Rahu': swe.MEAN_NODE
}

def get_rashi(longitude):
    """Return Rashi name and remaining degree in that Rashi."""
    rashi_idx = int(longitude // 30)
    degree = longitude % 30
    return RASHIS[rashi_idx], round(degree, 4)

def calculate_planets(jd_ut, lat, lon):
    """
    Calculate Lagna and 9 planets (Sun to Ketu).
    Uses Lahiri Ayanamsa (Sidereal).
    """
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    
    # Calculate Lagna (Ascendant)
    # The flag swe.FLG_SIDEREAL is needed for sidereal houses
    cusps, ascmc = swe.houses_ex(jd_ut, lat, lon, b'W', swe.FLG_SIDEREAL)
    lagna_longitude = ascmc[0] # Ascendant is the first item in ascmc
    lagna_rashi, lagna_degree = get_rashi(lagna_longitude)
    
    lagna_data = {
        'rashi': lagna_rashi,
        'degree': lagna_degree,
        'longitude': round(lagna_longitude, 4)
    }
    
    planets_data = {}
    calc_flag = swe.FLG_SWIEPH | swe.FLG_SPEED | swe.FLG_SIDEREAL
    
    # Calculate 7 main planets + Rahu
    for name, p_id in PLANET_MAP.items():
        # swe.calc_ut returns (longitude, latitude, distance, speed_long, speed_lat, speed_dist), ret_flag
        res, ret_flag = swe.calc_ut(jd_ut, p_id, calc_flag)
        longitude = res[0]
        speed = res[3]
        
        rashi_name, degree_in_sign = get_rashi(longitude)
        
        # Rahu is always retrograde. Other planets are retrograde if speed < 0
        is_retrograde = True if name == 'Rahu' else (speed < 0)
        
        planets_data[name] = {
            'longitude': round(longitude, 4),
            'rashi': rashi_name,
            'degree': degree_in_sign,
            'is_retrograde': is_retrograde
        }
        
    # Calculate Ketu (exactly 180 degrees from Rahu)
    rahu_long = planets_data['Rahu']['longitude']
    ketu_long = (rahu_long + 180) % 360
    ketu_rashi, ketu_degree = get_rashi(ketu_long)
    
    planets_data['Ketu'] = {
        'longitude': round(ketu_long, 4),
        'rashi': ketu_rashi,
        'degree': ketu_degree,
        'is_retrograde': True # Ketu is always retrograde
    }
    
    # Sign Rulerships for Lagna Lord
    RULERS = {
        'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
        'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
        'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
    }
    lagna_lord = RULERS.get(lagna_rashi)
    lagna_data['lord'] = lagna_lord
    
    # Determine Planet Status
    STATUS_RULES = {
        'Sun': {'Exalted': 'Aries', 'Debilitated': 'Libra', 'Own': ['Leo']},
        'Moon': {'Exalted': 'Taurus', 'Debilitated': 'Scorpio', 'Own': ['Cancer']},
        'Mars': {'Exalted': 'Capricorn', 'Debilitated': 'Cancer', 'Own': ['Aries', 'Scorpio']},
        'Mercury': {'Exalted': 'Virgo', 'Debilitated': 'Pisces', 'Own': ['Gemini', 'Virgo']},
        'Jupiter': {'Exalted': 'Cancer', 'Debilitated': 'Capricorn', 'Own': ['Sagittarius', 'Pisces']},
        'Venus': {'Exalted': 'Pisces', 'Debilitated': 'Virgo', 'Own': ['Taurus', 'Libra']},
        'Saturn': {'Exalted': 'Libra', 'Debilitated': 'Aries', 'Own': ['Capricorn', 'Aquarius']},
        'Rahu': {'Exalted': 'Taurus', 'Debilitated': 'Scorpio', 'Own': []},
        'Ketu': {'Exalted': 'Scorpio', 'Debilitated': 'Taurus', 'Own': []}
    }
    
    for p_name, p_info in planets_data.items():
        rules = STATUS_RULES.get(p_name)
        status = "Neutral"
        if rules:
            if p_info['rashi'] == rules['Exalted']:
                status = "Exalted"
            elif p_info['rashi'] == rules['Debilitated']:
                status = "Debilitated"
            elif p_info['rashi'] in rules['Own']:
                status = "Own Sign"
        p_info['status'] = status

    return lagna_data, planets_data

