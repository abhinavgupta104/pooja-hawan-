import swisseph as swe
from datetime import datetime


TITHIS = [
    "Pratipad", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",  # Shukla paksha
    "Pratipad", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"  # Krishna paksha
]

KARANAS = [
    "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",  # 7 movable
    "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
    "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
    "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
    "Shakuni", "Chatushpada", "Naga", "Kinstughna"  # 4 fixed
]

YOGAS = [
    "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
    "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda",
    "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
    "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva",
    "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
    "Mahendra", "Vaidhriti"
]

VARAS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

PAKSHA = ["Shukla", "Krishna"]


def calculate_panchang(jd_ut, lat, lon):
    """
    Calculate Panchang (Tithi, Vara, Yoga, Karana, Paksha) from Julian Day UT.
    Uses Lahiri ayanamsa (sidereal).
    """
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    calc_flag = swe.FLG_SWIEPH | swe.FLG_SIDEREAL

    # Sun and Moon sidereal longitudes
    sun_res, _ = swe.calc_ut(jd_ut, swe.SUN, calc_flag)
    moon_res, _ = swe.calc_ut(jd_ut, swe.MOON, calc_flag)

    sun_lon = sun_res[0]
    moon_lon = moon_res[0]

    # --- TITHI ---
    # Tithi = difference / 12 degrees per tithi
    tithi_angle = (moon_lon - sun_lon) % 360
    tithi_num = int(tithi_angle / 12)   # 0..29
    tithi_num = max(0, min(29, tithi_num))
    tithi_name = TITHIS[tithi_num]
    tithi_lord = _tithi_lord(tithi_num)
    paksha = PAKSHA[1 if tithi_num >= 15 else 0]

    # --- VARA (Weekday) ---
    # JD 0 = Monday, offset accordingly
    # swe.day_of_week returns 0=Mon ... 6=Sun
    dow = swe.day_of_week(jd_ut)  # 0=Mon..6=Sun
    # Map to Sun=0..Sat=6
    vara_idx = (dow + 1) % 7  # Sun=0,Mon=1,...,Sat=6
    vara_name = VARAS[vara_idx]
    vara_lord = _vara_lord(vara_idx)

    # --- YOGA ---
    # Yoga = (Sun longitude + Moon longitude) / (360/27)
    yoga_angle = (sun_lon + moon_lon) % 360
    yoga_num = int(yoga_angle / (360 / 27)) % 27
    yoga_name = YOGAS[yoga_num]

    # --- KARANA ---
    # Karana = half tithi, so 2 karanas per tithi (60 per cycle)
    karana_num = int(tithi_angle / 6) % 60
    karana_name = _get_karana(karana_num)

    # --- Sunrise/Sunset (local) ---
    jd_rise = _get_sunrise(jd_ut, lat, lon)
    jd_set = _get_sunset(jd_ut, lat, lon)

    return {
        "tithi": {"number": tithi_num + 1, "name": tithi_name, "lord": tithi_lord, "paksha": paksha},
        "vara": {"name": vara_name, "lord": vara_lord},
        "yoga": {"number": yoga_num + 1, "name": yoga_name},
        "karana": {"name": karana_name},
        "sunrise": jd_to_iso(jd_rise),
        "sunset": jd_to_iso(jd_set),
    }


def _get_sunrise(jd_ut, lat, lon):
    """Get sunrise Julian Day."""
    try:
        jd_rise, _ = swe.rise_trans(jd_ut - 0.5, swe.SUN, lon, lat, 0, 0,
                                     swe.CALC_RISE | swe.BIT_DISC_CENTER)
        return jd_rise
    except Exception:
        return jd_ut


def _get_sunset(jd_ut, lat, lon):
    """Get sunset Julian Day."""
    try:
        jd_set, _ = swe.rise_trans(jd_ut - 0.5, swe.SUN, lon, lat, 0, 0,
                                    swe.CALC_SET | swe.BIT_DISC_CENTER)
        return jd_set
    except Exception:
        return jd_ut + 0.5


def jd_to_iso(jd):
    """Convert Julian Day to ISO string format in UTC."""
    try:
        y, m, d, h = swe.revjul(jd)
        hour = int(h)
        rem = (h - hour) * 60
        minute = int(rem)
        second = int((rem - minute) * 60)
        return f"{y:04d}-{m:02d}-{d:02d}T{hour:02d}:{minute:02d}:{second:02d}Z"
    except Exception:
        return None


def _tithi_lord(tithi_num):
    """Lord for each tithi."""
    lords = ["Moon", "Sun", "Mars", "Mercury", "Jupiter",
             "Venus", "Saturn", "Moon", "Sun", "Mars",
             "Mercury", "Jupiter", "Venus", "Saturn", "Moon"]
    return lords[tithi_num % 15]


def _vara_lord(vara_idx):
    """Lord for each weekday."""
    lords = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
    return lords[vara_idx]


def _get_karana(idx):
    """Get Karana name from sequence index."""
    # First 4 karanas are fixed (Kinstughna, Chatushpada, Naga, Shakuni)
    # But they only occur at specific tithis (start/end of month)
    # Simplified: use the repeating 7-karana cycle for indices 0..56
    movable = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"]
    if idx < 56:
        return movable[idx % 7]
    fixed = ["Shakuni", "Chatushpada", "Naga", "Kinstughna"]
    return fixed[(idx - 56) % 4]


def calculate_avakhada_chakra(moon_longitude, lagna_data, planets_data):
    """
    Calculate Avakhada Chakra — a summary table of a person's core Vedic identifiers.
    """
    NAKSHATRAS = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
        "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
        "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
        "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
        "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ]
    RASHIS_SA = [
        "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
        "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"
    ]

    nak_span = 360 / 27
    nak_idx = int(moon_longitude // nak_span)
    pada_span = nak_span / 4
    degree_in_nak = moon_longitude % nak_span
    pada = int(degree_in_nak // pada_span) + 1
    nakshatra = NAKSHATRAS[nak_idx]

    # Moon sign (Rashi) in Sanskrit
    moon_rashi_eng = planets_data["Moon"]["rashi"]
    RASHI_MAP = {
        "Aries": "Mesha", "Taurus": "Vrishabha", "Gemini": "Mithuna",
        "Cancer": "Karka", "Leo": "Simha", "Virgo": "Kanya",
        "Libra": "Tula", "Scorpio": "Vrishchika", "Sagittarius": "Dhanu",
        "Capricorn": "Makara", "Aquarius": "Kumbha", "Pisces": "Meena"
    }
    rashi_sa = RASHI_MAP.get(moon_rashi_eng, moon_rashi_eng)

    # Nadi (3-fold cycle repeating 0→8 for each 9 nakshatras)
    NADI = ["Aadi", "Madhya", "Antya"]
    nadi = NADI[nak_idx % 3]

    # Gana (3-fold: Deva, Manushya, Rakshasa)
    GANA_MAP = {
        0: "Deva", 1: "Manushya", 2: "Rakshasa", 3: "Deva", 4: "Manushya",
        5: "Rakshasa", 6: "Deva", 7: "Manushya", 8: "Deva",
        9: "Rakshasa", 10: "Manushya", 11: "Deva", 12: "Manushya", 13: "Rakshasa",
        14: "Deva", 15: "Rakshasa", 16: "Deva", 17: "Manushya",
        18: "Rakshasa", 19: "Manushya", 20: "Deva", 21: "Deva",
        22: "Rakshasa", 23: "Deva", 24: "Manushya", 25: "Deva", 26: "Manushya"
    }
    gana = GANA_MAP.get(nak_idx, "Deva")

    # Varna (4-fold: Brahmin, Kshatriya, Vaishya, Shudra)
    VARNA_RASHI = {
        "Mesha": "Kshatriya", "Vrishabha": "Vaishya", "Mithuna": "Shudra",
        "Karka": "Brahmin", "Simha": "Kshatriya", "Kanya": "Vaishya",
        "Tula": "Shudra", "Vrishchika": "Brahmin", "Dhanu": "Kshatriya",
        "Makara": "Vaishya", "Kumbha": "Shudra", "Meena": "Brahmin"
    }
    varna = VARNA_RASHI.get(rashi_sa, "Brahmin")

    # Vashya (5-fold)
    VASHYA_RASHI = {
        "Mesha": "Chatushpad", "Vrishabha": "Chatushpad", "Mithuna": "Manav",
        "Karka": "Keeta", "Simha": "Vanchar", "Kanya": "Manav",
        "Tula": "Manav", "Vrishchika": "Keeta", "Dhanu": "Chatushpad",
        "Makara": "Jalchar", "Kumbha": "Manav", "Meena": "Jalchar"
    }
    vashya = VASHYA_RASHI.get(rashi_sa, "Manav")

    # Yoni (27 nakshatras mapped to animals)
    YONI_MAP = [
        "Ashwa (Horse)", "Gaja (Elephant)", "Mesh (Ram)", "Sarpa (Snake)", "Shwan (Dog)",
        "Shwan (Dog)", "Marjar (Cat)", "Mesh (Ram)", "Sarpa (Snake)", "Mushak (Rat)",
        "Mushak (Rat)", "Gau (Cow)", "Mahish (Buffalo)", "Vyaghra (Tiger)", "Mahish (Buffalo)",
        "Vyaghra (Tiger)", "Mrig (Deer)", "Mrig (Deer)", "Shwan (Dog)", "Vanar (Monkey)",
        "Mongoose", "Vanar (Monkey)", "Simha (Lion)", "Ashwa (Horse)", "Simha (Lion)",
        "Gau (Cow)", "Gaja (Elephant)"
    ]
    yoni = YONI_MAP[nak_idx]

    # Tara (from Janma nakshatra — repeating cycle of 9 from birth nak)
    TARA_NAMES = ["Janma", "Sampat", "Vipat", "Kshema", "Pratyari",
                  "Sadhaka", "Vadha", "Mitra", "Ati-Mitra"]
    # Lagna's nakshatra for Tara calculation
    lagna_nak_idx = int(lagna_data["longitude"] // nak_span) % 27
    tara_idx = (nak_idx - lagna_nak_idx) % 9
    tara = TARA_NAMES[tara_idx]

    # Tatwa (element) from Lagna
    TATWA_RASHI = {
        "Aries": "Agni (Fire)", "Leo": "Agni (Fire)", "Sagittarius": "Agni (Fire)",
        "Taurus": "Prithvi (Earth)", "Virgo": "Prithvi (Earth)", "Capricorn": "Prithvi (Earth)",
        "Gemini": "Vayu (Air)", "Libra": "Vayu (Air)", "Aquarius": "Vayu (Air)",
        "Cancer": "Jal (Water)", "Scorpio": "Jal (Water)", "Pisces": "Jal (Water)"
    }
    tatwa = TATWA_RASHI.get(lagna_data["rashi"], "Agni (Fire)")

    return {
        "rashi": rashi_sa,
        "nakshatra": nakshatra,
        "pada": pada,
        "nakshatra_lord": planets_data["Moon"].get("nakshatra", nakshatra),
        "gana": gana,
        "nadi": nadi,
        "varna": varna,
        "vashya": vashya,
        "yoni": yoni,
        "tara": tara,
        "tatwa": tatwa,
        "lagna_rashi": RASHI_MAP.get(lagna_data["rashi"], lagna_data["rashi"]),
        "lagna_lord": lagna_data["lord"]
    }
