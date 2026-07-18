import math
import swisseph as swe


TITHIS = [
    "Pratipad", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",  # Shukla paksha
    "Pratipad", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"  # Krishna paksha
]

# Tithi groups (1,6,11 = Nanda; 2,7,12 = Bhadra; etc.)
TITHI_TYPES = ["Nanda", "Bhadra", "Jaya", "Rikta", "Purna"]

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

NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
]

# Vimshottari lords, repeating over the 27 nakshatras
NAKSHATRA_LORDS = ["Ketu", "Venus", "Sun", "Moon", "Mars",
                   "Rahu", "Jupiter", "Saturn", "Mercury"]

NAKSHATRA_DEITIES = [
    "Ashwini Kumaras", "Yama", "Agni", "Brahma", "Soma", "Rudra",
    "Aditi", "Brihaspati", "Nagas", "Pitris", "Bhaga", "Aryaman",
    "Savitar", "Vishwakarma", "Vayu", "Indragni", "Mitra", "Indra",
    "Nirriti", "Apas", "Vishwadevas", "Vishnu", "Vasus", "Varuna",
    "Aja Ekapada", "Ahirbudhnya", "Pushan"
]

NAK_SPAN = 360.0 / 27.0  # 13°20'

_SID_FLAG = swe.FLG_SWIEPH | swe.FLG_SIDEREAL

# Hindu sunrise convention (Drik Panchang): centre of solar disc, no refraction
_HINDU_RISE = swe.BIT_DISC_CENTER | swe.BIT_NO_REFRACTION


def _sid_lon(jd, body):
    """Sidereal (Lahiri) longitude of a body at jd (UT)."""
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    res, _ = swe.calc_ut(jd, body, _SID_FLAG)
    return res[0]


def _elongation(jd):
    """Moon - Sun elongation, 0..360 (drives tithi & karana)."""
    return (_sid_lon(jd, swe.MOON) - _sid_lon(jd, swe.SUN)) % 360


def _yoga_angle(jd):
    """Sum of nirayana Sun and Moon longitudes, 0..360 (drives yoga)."""
    return (_sid_lon(jd, swe.SUN) + _sid_lon(jd, swe.MOON)) % 360


def _moon_lon(jd):
    return _sid_lon(jd, swe.MOON)


def _find_crossing(angle_func, target, jd_start, max_days=4.0, step=0.02):
    """
    First jd > jd_start where the (monotonically increasing, mod-360)
    angle_func crosses `target` degrees. Bisection to ~0.1s precision.
    """
    def gap(jd):
        return ((angle_func(jd) - target + 180.0) % 360.0) - 180.0

    lo, g_lo = jd_start, gap(jd_start)
    hi = None
    jd = jd_start
    for _ in range(int(max_days / step) + 1):
        jd += step
        g = gap(jd)
        if g_lo < 0 <= g:
            hi = jd
            break
        lo, g_lo = jd, g
    if hi is None:
        return None
    for _ in range(40):
        mid = (lo + hi) / 2.0
        if gap(mid) < 0:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2.0


def _local_midnight_jd(jd_ut, lon):
    """UT Julian Day of local civil midnight for the day containing jd_ut.
    Uses mean solar time; sunrise is far from midnight, so the ~30 min
    error vs. the political timezone never changes the resolved date."""
    local_jd = jd_ut + lon / 360.0
    day_start_local = math.floor(local_jd + 0.5) - 0.5
    return day_start_local - lon / 360.0


def _next_sun_event(jd_start, lat, lon, rsmi):
    """Next rise/set of the Sun after jd_start (Hindu convention)."""
    try:
        res, tret = swe.rise_trans(jd_start, swe.SUN, rsmi | _HINDU_RISE,
                                   (lon, lat, 0.0))
        if res == 0:
            return tret[0]
    except Exception:
        pass
    return None


def calculate_panchang(jd_ut, lat, lon, at_sunrise=False):
    """
    Calculate Panchang (Tithi, Vara, Nakshatra, Yoga, Karana) with end times.
    Uses Lahiri ayanamsa. If at_sunrise is True the five limbs are evaluated
    at local sunrise (the convention for a daily panchang); otherwise at
    jd_ut itself (correct for a birth chart).
    """
    swe.set_sid_mode(swe.SIDM_LAHIRI)

    # --- Sunrise / Sunset for the local civil day ---
    midnight_ut = _local_midnight_jd(jd_ut, lon)
    jd_sunrise = _next_sun_event(midnight_ut, lat, lon, swe.CALC_RISE)
    jd_sunset = _next_sun_event(jd_sunrise if jd_sunrise else midnight_ut,
                                lat, lon, swe.CALC_SET)

    jd_eval = jd_sunrise if (at_sunrise and jd_sunrise) else jd_ut

    # --- TITHI (12° segments of Moon-Sun elongation) ---
    elong = _elongation(jd_eval)
    tithi_num = min(int(elong / 12), 29)  # 0..29
    tithi_end = _find_crossing(_elongation, ((tithi_num + 1) * 12) % 360, jd_eval)
    paksha = PAKSHA[1 if tithi_num >= 15 else 0]

    # --- VARA (weekday; the Vedic day runs sunrise → sunrise) ---
    if jd_sunrise is not None:
        vara_jd_local = jd_sunrise + lon / 360.0
        if jd_ut < jd_sunrise:  # born/queried before sunrise → previous day's vara
            vara_jd_local -= 1.0
    else:
        vara_jd_local = jd_ut + lon / 360.0
    dow = swe.day_of_week(vara_jd_local)  # 0=Mon..6=Sun
    vara_idx = (dow + 1) % 7              # Sun=0..Sat=6
    vara_name = VARAS[vara_idx]

    # --- NAKSHATRA (Moon in 13°20' segments) ---
    moon = _moon_lon(jd_eval)
    nak_num = min(int(moon / NAK_SPAN), 26)
    nak_pada = int((moon % NAK_SPAN) / (NAK_SPAN / 4)) + 1
    nak_end = _find_crossing(_moon_lon, ((nak_num + 1) * NAK_SPAN) % 360, jd_eval)

    # --- YOGA (Sun+Moon in 13°20' segments) ---
    yoga_num = min(int(_yoga_angle(jd_eval) / NAK_SPAN), 26)
    yoga_end = _find_crossing(_yoga_angle, ((yoga_num + 1) * NAK_SPAN) % 360, jd_eval)

    # --- KARANA (half-tithi, 6° segments) ---
    karana_num = min(int(elong / 6), 59)  # 0..59
    karana_end = _find_crossing(_elongation, ((karana_num + 1) * 6) % 360, jd_eval)

    return {
        "tithi": {
            "number": tithi_num + 1,
            "index": tithi_num + 1,
            "name": TITHIS[tithi_num],
            "lord": _tithi_lord(tithi_num),
            "paksha": paksha,
            "type": TITHI_TYPES[tithi_num % 5],
            "end": jd_to_iso(tithi_end),
        },
        "vara": {"name": vara_name, "lord": _vara_lord(vara_idx)},
        "nakshatra": {
            "number": nak_num + 1,
            "name": NAKSHATRAS[nak_num],
            "lord": NAKSHATRA_LORDS[nak_num % 9],
            "deity": NAKSHATRA_DEITIES[nak_num],
            "pada": nak_pada,
            "end": jd_to_iso(nak_end),
        },
        "yoga": {
            "number": yoga_num + 1,
            "name": YOGAS[yoga_num],
            "end": jd_to_iso(yoga_end),
        },
        "karana": {
            "name": _karana_name(karana_num),
            "end": jd_to_iso(karana_end),
        },
        "sunrise": jd_to_iso(jd_sunrise),
        "sunset": jd_to_iso(jd_sunset),
    }


def jd_to_iso(jd):
    """Convert Julian Day to ISO string format in UTC."""
    if jd is None:
        return None
    try:
        y, m, d, h = swe.revjul(jd)
        hour = int(h)
        rem = (h - hour) * 60
        minute = int(rem)
        second = int(round((rem - minute) * 60))
        if second == 60:
            second = 0
            minute += 1
        if minute == 60:
            minute = 0
            hour += 1
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


def _karana_name(idx):
    """
    Karana name from half-tithi index 0..59.
    Kinstughna is the first half of Shukla Pratipada (idx 0); the movable
    seven (Bava..Vishti) repeat 8 times (idx 1..56); Shakuni, Chatushpada
    and Naga close the month (idx 57..59).
    """
    if idx == 0:
        return "Kinstughna"
    if idx >= 57:
        return ["Shakuni", "Chatushpada", "Naga"][idx - 57]
    movable = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"]
    return movable[(idx - 1) % 7]


def calculate_avakhada_chakra(moon_longitude, lagna_data, planets_data):
    """
    Calculate Avakhada Chakra — a summary table of a person's core Vedic identifiers.
    """
    RASHI_MAP = {
        "Aries": "Mesha", "Taurus": "Vrishabha", "Gemini": "Mithuna",
        "Cancer": "Karka", "Leo": "Simha", "Virgo": "Kanya",
        "Libra": "Tula", "Scorpio": "Vrishchika", "Sagittarius": "Dhanu",
        "Capricorn": "Makara", "Aquarius": "Kumbha", "Pisces": "Meena"
    }

    nak_idx = min(int(moon_longitude // NAK_SPAN), 26)
    pada = int((moon_longitude % NAK_SPAN) // (NAK_SPAN / 4)) + 1
    nakshatra = NAKSHATRAS[nak_idx]

    moon_rashi_eng = planets_data["Moon"]["rashi"]
    rashi_sa = RASHI_MAP.get(moon_rashi_eng, moon_rashi_eng)

    # Nadi zig-zag: Aadi..Antya then back, repeating every 6 nakshatras
    nadi = ["Aadi", "Madhya", "Antya", "Antya", "Madhya", "Aadi"][nak_idx % 6]

    # Gana of the 27 nakshatras (Deva / Manushya / Rakshasa)
    GANAS = [
        "Deva", "Manushya", "Rakshasa", "Manushya", "Deva", "Manushya",
        "Deva", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya",
        "Deva", "Rakshasa", "Deva", "Rakshasa", "Deva", "Rakshasa",
        "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa", "Rakshasa",
        "Manushya", "Manushya", "Deva"
    ]
    gana = GANAS[nak_idx]

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
        "Karka": "Jalchar", "Simha": "Vanchar", "Kanya": "Manav",
        "Tula": "Manav", "Vrishchika": "Keeta", "Dhanu": "Chatushpad",
        "Makara": "Jalchar", "Kumbha": "Manav", "Meena": "Jalchar"
    }
    vashya = VASHYA_RASHI.get(rashi_sa, "Manav")

    # Yoni (14 animal pairs across the 27 nakshatras)
    YONI_MAP = [
        "Ashwa (Horse)", "Gaja (Elephant)", "Mesh (Ram)", "Sarpa (Snake)", "Sarpa (Snake)",
        "Shwan (Dog)", "Marjar (Cat)", "Mesh (Ram)", "Marjar (Cat)", "Mushak (Rat)",
        "Mushak (Rat)", "Gau (Cow)", "Mahish (Buffalo)", "Vyaghra (Tiger)", "Mahish (Buffalo)",
        "Vyaghra (Tiger)", "Mrig (Deer)", "Mrig (Deer)", "Shwan (Dog)", "Vanar (Monkey)",
        "Nakul (Mongoose)", "Vanar (Monkey)", "Simha (Lion)", "Ashwa (Horse)", "Simha (Lion)",
        "Gau (Cow)", "Gaja (Elephant)"
    ]
    yoni = YONI_MAP[nak_idx]

    # Tara (from Janma nakshatra — repeating cycle of 9 from birth nak)
    TARA_NAMES = ["Janma", "Sampat", "Vipat", "Kshema", "Pratyari",
                  "Sadhaka", "Vadha", "Mitra", "Ati-Mitra"]
    lagna_nak_idx = int(lagna_data["longitude"] // NAK_SPAN) % 27
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
        "nakshatra_lord": NAKSHATRA_LORDS[nak_idx % 9],
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
