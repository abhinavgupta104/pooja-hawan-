def calculate_houses(lagna_rashi, planets_data, RASHIS):
    """
    Assign a house number (1-12) to each planet using the Whole Sign house system.
    Lagna Rashi is always House 1.
    """
    lagna_idx = RASHIS.index(lagna_rashi)
    
    for planet, data in planets_data.items():
        planet_rashi = data['rashi']
        planet_idx = RASHIS.index(planet_rashi)
        
        # Calculate house number (1-indexed)
        # e.g., if Lagna is Leo (index 4) and Planet is Scorpio (index 7)
        # house = (7 - 4) % 12 + 1 = 3 % 12 + 1 = 4th house
        house_num = (planet_idx - lagna_idx) % 12 + 1
        
        data['house'] = house_num
        
    return planets_data
