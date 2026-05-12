from calculations.planets import RASHIS

def calculate_ashtakavarga(planets_data):
    """
    Calculate a Simplified Sarvashtakavarga (SAV) score for each of the 12 signs.
    An accurate SAV requires evaluating hundreds of rules for 8 variables (7 planets + Lagna).
    This simplified version starts with the baseline average (28 points per sign) 
    and adjusts based on the planetary strengths residing in or aspecting the signs.
    Total points should roughly hover around 337.
    """
    # Initialize all 12 signs with a baseline average of 28 bindus
    sav_scores = {rashi: 28 for rashi in RASHIS}
    
    # Adjust based on planetary placements
    for p_name, p_info in planets_data.items():
        if p_name in ['Rahu', 'Ketu']:
            continue # Nodes don't contribute to standard Ashtakavarga
            
        rashi = p_info['rashi']
        status = p_info.get('status', 'Neutral')
        
        if status == 'Exalted':
            sav_scores[rashi] += 4
        elif status == 'Own Sign':
            sav_scores[rashi] += 2
        elif status == 'Debilitated':
            sav_scores[rashi] -= 3
            
        # Benefics vs Malefics basic adjustment
        if p_name in ['Jupiter', 'Venus', 'Mercury', 'Moon']:
            sav_scores[rashi] += 1
        elif p_name in ['Saturn', 'Mars', 'Sun']:
            sav_scores[rashi] -= 1
            
    # Normalize slightly to ensure realistic bounds (min 18, max 45 is typical)
    for rashi in RASHIS:
        if sav_scores[rashi] < 18: sav_scores[rashi] = 18
        if sav_scores[rashi] > 45: sav_scores[rashi] = 45
        
    return sav_scores
