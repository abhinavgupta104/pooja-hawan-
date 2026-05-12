from calculations.planets import RASHIS

def calculate_navamsa(lagna_longitude, planets_data):
    """
    Calculate the D9 Navamsa chart placements.
    Navamsa divides each sign into 9 parts.
    The sequence of Navamsa signs is continuous from Aries through the zodiac.
    """
    navamsa_data = {
        'lagna': {},
        'planets': {}
    }
    
    # Calculate D9 Lagna
    nav_absolute_lagna = int(lagna_longitude / (360.0 / 108.0))
    lagna_rashi_idx = nav_absolute_lagna % 12
    navamsa_data['lagna']['rashi'] = RASHIS[lagna_rashi_idx]
    
    # Calculate D9 placements for all planets
    for p_name, p_info in planets_data.items():
        lon = p_info['longitude']
        nav_absolute = int(lon / (360.0 / 108.0))
        rashi_idx = nav_absolute % 12
        
        # Calculate house relative to D9 Lagna
        house = ((rashi_idx - lagna_rashi_idx) % 12) + 1
        
        navamsa_data['planets'][p_name] = {
            'rashi': RASHIS[rashi_idx],
            'house': house
        }
        
    return navamsa_data
