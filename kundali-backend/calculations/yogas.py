def calculate_yogas(planets_data):
    """
    Calculate common Astrological Yogas.
    """
    yogas = []
    
    # 1. Budhaditya Yoga
    # Sun and Mercury in the same house
    if planets_data['Sun']['house'] == planets_data['Mercury']['house']:
        # They shouldn't be too close (combustion), but we will keep it simple.
        yogas.append({
            "name": "Budhaditya Yoga",
            "description": "Sun and Mercury are conjunct. Bestows intelligence, analytical skills, and success in communication/business."
        })
        
    # 2. Gajakesari Yoga
    # Jupiter in Kendra (1,4,7,10) from Moon
    moon_house = planets_data['Moon']['house']
    jup_house = planets_data['Jupiter']['house']
    
    # Houses from Moon (1-indexed)
    house_from_moon = ((jup_house - moon_house) % 12) + 1
    if house_from_moon in [1, 4, 7, 10]:
        yogas.append({
            "name": "Gaja Kesari Yoga",
            "description": "Jupiter is in a Kendra from the Moon. Brings wisdom, reputation, eloquence, and lasting prosperity."
        })
        
    # Pancha Mahapurusha Yogas
    # Must be in Kendra from Lagna (1,4,7,10) AND in Own or Exalted sign.
    pm_yogas = [
        ("Ruchaka", "Mars", "Courage, leadership, physical strength, and success in police/military."),
        ("Bhadra", "Mercury", "Intellect, quick wit, business acumen, and excellent communication."),
        ("Hamsa", "Jupiter", "Purity, wisdom, religious inclination, and respect in society."),
        ("Malavya", "Venus", "Beauty, luxury, artistic talents, and a comfortable lifestyle."),
        ("Sasa", "Saturn", "Discipline, perseverance, authority, and mass leadership.")
    ]
    
    for yoga_name, planet, desc in pm_yogas:
        p_info = planets_data[planet]
        if p_info['house'] in [1, 4, 7, 10] and p_info['status'] in ['Exalted', 'Own Sign']:
            yogas.append({
                "name": f"{yoga_name} Yoga (Pancha Mahapurusha)",
                "description": f"{planet} is strong in a Kendra. {desc}"
            })
            
    # Chandra Mangala Yoga
    # Moon and Mars conjunct
    if planets_data['Moon']['house'] == planets_data['Mars']['house']:
        yogas.append({
            "name": "Chandra Mangala Yoga",
            "description": "Moon and Mars are conjunct. Can bring strong drive and wealth, but may cause restlessness."
        })
        
    return yogas
