NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", 
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", 
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", 
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
]

def get_nakshatra(longitude):
    """
    Calculate Nakshatra and Pada from longitude.
    Nakshatra = 13 degrees 20 minutes (13.3333... degrees)
    Pada = 3 degrees 20 minutes (3.3333... degrees)
    """
    nakshatra_span = 360 / 27 # 13.33333...
    pada_span = nakshatra_span / 4 # 3.33333...
    
    # Calculate index (0 to 26)
    nakshatra_idx = int(longitude // nakshatra_span)
    
    # Calculate degree within the Nakshatra
    degree_in_nakshatra = longitude % nakshatra_span
    
    # Calculate Pada (1 to 4)
    pada = int(degree_in_nakshatra // pada_span) + 1
    
    return NAKSHATRAS[nakshatra_idx], pada

def assign_nakshatras(planets_data):
    """Assign Nakshatra and Pada to each planet."""
    for planet, data in planets_data.items():
        longitude = data['longitude']
        nakshatra, pada = get_nakshatra(longitude)
        data['nakshatra'] = nakshatra
        data['pada'] = pada
        
    return planets_data
