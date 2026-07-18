from datetime import datetime, timedelta

# Sequence of Dasha lords and their durations in years
DASHA_LORDS = [
    {"planet": "Ketu", "years": 7},
    {"planet": "Venus", "years": 20},
    {"planet": "Sun", "years": 6},
    {"planet": "Moon", "years": 10},
    {"planet": "Mars", "years": 7},
    {"planet": "Rahu", "years": 18},
    {"planet": "Jupiter", "years": 16},
    {"planet": "Saturn", "years": 19},
    {"planet": "Mercury", "years": 17}
]

TOTAL_YEARS = 120
DAYS_PER_YEAR = 365.25 # Standard Vimshottari year used by mainstream Vedic software

def calculate_dasha(moon_longitude, birth_date):
    """
    Calculate Vimshottari Mahadasha and Antardasha sequence.
    birth_date: datetime object of the birth time
    """
    nakshatra_span = 360 / 27 # 13.33333...
    
    # Calculate index (0 to 26)
    nakshatra_idx = int(moon_longitude // nakshatra_span)
    degree_in_nakshatra = moon_longitude % nakshatra_span
    
    # The starting lord is based on the Nakshatra
    start_lord_idx = nakshatra_idx % 9
    
    # Calculate proportion of the first dasha remaining
    # remaining_proportion = (Total Span - Passed Span) / Total Span
    passed_proportion = degree_in_nakshatra / nakshatra_span
    remaining_proportion = 1.0 - passed_proportion
    
    sequence = []
    current_date = birth_date
    
    # First Mahadasha (partial)
    first_lord = DASHA_LORDS[start_lord_idx]
    remaining_years = first_lord['years'] * remaining_proportion
    
    # We will build all 9 Mahadashas starting from the birth one
    # Note: A full cycle is 120 years, so we just calculate one full cycle (9 dashas)
    
    current_mahadasha_active = None
    now = datetime.now(birth_date.tzinfo) if birth_date.tzinfo else datetime.now()
    
    for i in range(9):
        lord_idx = (start_lord_idx + i) % 9
        lord = DASHA_LORDS[lord_idx]
        
        if i == 0:
            duration_years = remaining_years
            total_lord_years = lord['years']
        else:
            duration_years = lord['years']
            total_lord_years = lord['years']
            
        start_date_str = current_date.strftime("%Y-%m-%d")
        end_date = current_date + timedelta(days=duration_years * DAYS_PER_YEAR)
        end_date_str = end_date.strftime("%Y-%m-%d")
        
        # Calculate Antardashas
        antardashas = []
        ad_start_date = current_date
        
        for j in range(9):
            ad_lord_idx = (lord_idx + j) % 9
            ad_lord = DASHA_LORDS[ad_lord_idx]
            
            # Antardasha duration formula: (Mahadasha Years * Antardasha Years) / 120
            # For the very first partial Mahadasha, the Antardashas that have already passed are skipped,
            # but for simplicity and standard display, we often show the full sequence from birth,
            # appropriately scaled or just starting from the exact birth moment for the active AD.
            # To be precise, Vimshottari Antardasha is proportional.
            # AD duration in years = (MD Total Years * AD Total Years) / 120
            ad_duration_years = (total_lord_years * ad_lord['years']) / TOTAL_YEARS
            
            # If this is the first Mahadasha, we need to find which Antardasha we were born into.
            # To do this correctly, we find the passed years of the Mahadasha.
            if i == 0:
                passed_md_years = total_lord_years - remaining_years
                # Let's accumulate ADs to see where we fall
                # For simplicity in this implementation, we will just calculate the true start/end of all ADs
                # in this MD as if it started normally, but cap the start date to birth_date.
                # Actual start of this full MD would have been:
                full_md_start = current_date - timedelta(days=passed_md_years * DAYS_PER_YEAR)
                
                # We calculate AD dates based on full_md_start
                # But we only add ADs that end after the birth_date
                
                # This requires a bit of logic, let's simplify:
                pass # We handle this logic below to be accurate
        
        # Simpler approach for Antardashas:
        # Just calculate them properly
        if i == 0:
            # Full Mahadasha would have started here:
            passed_years = total_lord_years - remaining_years
            ad_current_date = current_date - timedelta(days=passed_years * DAYS_PER_YEAR)
        else:
            ad_current_date = current_date
            
        for j in range(9):
            ad_lord_idx = (lord_idx + j) % 9
            ad_lord = DASHA_LORDS[ad_lord_idx]
            
            ad_duration_years = (total_lord_years * ad_lord['years']) / TOTAL_YEARS
            ad_end_date = ad_current_date + timedelta(days=ad_duration_years * DAYS_PER_YEAR)
            
            # Only include if it ends after birth
            if ad_end_date > current_date:
                # If it started before birth, cap start to birth date
                real_ad_start = ad_current_date if ad_current_date > current_date else current_date
                
                antardashas.append({
                    "planet": ad_lord['planet'],
                    "start": real_ad_start.strftime("%Y-%m-%d"),
                    "end": ad_end_date.strftime("%Y-%m-%d")
                })
            
            ad_current_date = ad_end_date
            
        # Fix the last AD's end date to match MD end date exactly to avoid rounding floating point issues
        if antardashas:
            antardashas[-1]["end"] = end_date_str

        mahadasha_data = {
            "planet": lord['planet'],
            "start": start_date_str,
            "end": end_date_str,
            "antardashas": antardashas
        }
        
        sequence.append(mahadasha_data)
        
        # Check if this is the current active Mahadasha
        # Naive datetime.now() check might not match birth timezone perfectly, but is standard
        if current_date <= now < end_date:
            current_mahadasha_active = {
                "planet": lord['planet'],
                "start": start_date_str,
                "end": end_date_str
            }
            
        current_date = end_date
        
    # If birth is in the future, first dasha is current
    if not current_mahadasha_active and sequence:
        if now < birth_date:
            current_mahadasha_active = {
                "planet": sequence[0]['planet'],
                "start": sequence[0]['start'],
                "end": sequence[0]['end']
            }
        else:
            # Over 120 years old! Just show the last one as a fallback
            current_mahadasha_active = {
                "planet": sequence[-1]['planet'],
                "start": sequence[-1]['start'],
                "end": sequence[-1]['end']
            }

    return {
        "current_mahadasha": current_mahadasha_active,
        "dasha_sequence": sequence
    }
