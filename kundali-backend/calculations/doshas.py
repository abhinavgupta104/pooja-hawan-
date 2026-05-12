import swisseph as swe
from datetime import datetime
import pytz

from calculations.planets import RASHIS

def calculate_doshas(planets_data):
    """
    Calculate Mangal Dosha and Kaal Sarp Dosha based on natal chart.
    """
    doshas = []
    
    # Mangal Dosha
    mars_house = planets_data['Mars']['house']
    if mars_house in [1, 4, 7, 8, 12]:
        doshas.append({
            "name": "Mangal Dosha",
            "presence": True,
            "description": f"Mars is placed in the {mars_house} house. This forms Manglik Dosha, indicating a need for careful relationship matching."
        })
    else:
        doshas.append({
            "name": "Mangal Dosha",
            "presence": False,
            "description": "No Mangal Dosha present in the birth chart."
        })
        
    # Kaal Sarp Dosha
    # Check if all 7 planets are between Rahu and Ketu
    # One simple way is to check the distance.
    # The maximum distance between any of the 7 planets and Rahu, and between the planets and Ketu.
    # Actually, the simplest check is: are all planets contained within one half of the zodiac split by the Rahu/Ketu axis?
    rahu_long = planets_data['Rahu']['longitude']
    
    all_hemmed = True
    for p in ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']:
        long = planets_data[p]['longitude']
        diff = (long - rahu_long) % 360
        # If any planet is more than 180 degrees away from Rahu, they are not all on the same side.
        # Wait! They must ALL be strictly < 180, OR they must ALL be strictly > 180.
        if not all_hemmed: break

    diffs = [(planets_data[p]['longitude'] - rahu_long) % 360 for p in ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']]
    
    all_less_than_180 = all(d < 180 for d in diffs)
    all_greater_than_180 = all(d > 180 for d in diffs)
    
    if all_less_than_180 or all_greater_than_180:
        doshas.append({
            "name": "Kaal Sarp Dosha",
            "presence": True,
            "description": "All planets are hemmed between Rahu and Ketu. This may cause delays and struggles, but also strong potential for success later in life."
        })
    else:
        doshas.append({
            "name": "Kaal Sarp Dosha",
            "presence": False,
            "description": "No Kaal Sarp Dosha present."
        })
        
    return doshas

def calculate_sade_sati(natal_moon_longitude):
    """
    Calculate if Sade Sati is currently active.
    Sade Sati occurs when transit Saturn is in the 12th, 1st, or 2nd house from natal Moon.
    """
    # 1. Get current UTC time and convert to Julian Day
    now_utc = datetime.now(pytz.utc)
    y, m, d = now_utc.year, now_utc.month, now_utc.day
    h = now_utc.hour + now_utc.minute / 60.0 + now_utc.second / 3600.0
    
    jd_ut = swe.julday(y, m, d, h)
    
    # 2. Calculate Current Saturn position
    calc_flag = swe.FLG_SWIEPH | swe.FLG_SPEED | swe.FLG_SIDEREAL
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    
    res, ret_flag = swe.calc_ut(jd_ut, swe.SATURN, calc_flag)
    transit_saturn_long = res[0]
    
    # 3. Determine houses relative to Natal Moon
    # Each sign is exactly 30 degrees. Whole sign houses from Moon.
    natal_moon_sign_idx = int(natal_moon_longitude // 30)
    transit_saturn_sign_idx = int(transit_saturn_long // 30)
    
    # Houses difference (1-indexed)
    house_from_moon = ((transit_saturn_sign_idx - natal_moon_sign_idx) % 12) + 1
    
    if house_from_moon in [12, 1, 2]:
        phase_map = {12: "First Phase", 1: "Peak Phase", 2: "Final Phase"}
        phase = phase_map[house_from_moon]
        return {
            "name": "Sade Sati",
            "presence": True,
            "description": f"Currently active ({phase}). Transit Saturn is moving through the {house_from_moon} house from your natal Moon.",
            "transit_saturn_rashi": RASHIS[transit_saturn_sign_idx]
        }
    else:
        return {
            "name": "Sade Sati",
            "presence": False,
            "description": "Sade Sati is not currently active.",
            "transit_saturn_rashi": RASHIS[transit_saturn_sign_idx]
        }
