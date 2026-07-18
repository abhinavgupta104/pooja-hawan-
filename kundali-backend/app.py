import os
import time
import requests
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from geopy.geocoders import Nominatim, Photon
import pytz
import swisseph as swe

from calculations.planets import calculate_planets, RASHIS
from calculations.houses import calculate_houses
from calculations.nakshatra import assign_nakshatras
from calculations.dasha import calculate_dasha
from calculations.doshas import calculate_doshas, calculate_sade_sati
from calculations.yogas import calculate_yogas
from calculations.divisional import calculate_navamsa
from calculations.ashtakavarga import calculate_ashtakavarga
from calculations.panchang import calculate_panchang, calculate_avakhada_chakra

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins

import ssl
import certifi
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Point Python's SSL (urllib) and requests to certifi's Mozilla CA bundle
# This fixes "certificate verify failed" on MSYS2 which lacks the Windows cert store
os.environ['SSL_CERT_FILE'] = certifi.where()
os.environ['REQUESTS_CA_BUNDLE'] = certifi.where()

geolocator = Nominatim(user_agent="kundali_generator_app_v2")
geolocator_fallback = Photon(user_agent="kundali_generator_app_v2")

# ---------------------------------------------------------------------------
# Timezone helper: replaces timezonefinder (which requires cffi/C compilation)
# Strategy:
#   1. Try the free timeapi.io REST API (fast, no install needed)
#   2. Fall back to a longitude-based UTC offset (±lon/15 hours), then snap
#      to the nearest standard IANA zone using pytz
# ---------------------------------------------------------------------------

# Common lat/lon → IANA timezone for popular Indian & global cities
_COMMON_TZ = {
    # India (most users)
    "Asia/Kolkata": {"lat": (6, 37), "lon": (68, 98)},
}

def _tz_from_lon(lon: float) -> str:
    """Rough IANA timezone from longitude (fallback only)."""
    offset_hours = round(lon / 15)
    # Build a sign-corrected key like "Etc/GMT+5" (note: pytz uses inverted sign)
    # pytz "Etc/GMT+X" is actually UTC-X  (POSIX convention)
    pytz_key = f"Etc/GMT{-offset_hours:+d}" if offset_hours != 0 else "UTC"
    try:
        pytz.timezone(pytz_key)
        return pytz_key
    except Exception:
        return "UTC"


def get_timezone_for_coords(lat: float, lon: float) -> str:
    """
    Get IANA timezone string for a lat/lon pair.
    1) India bounding box -> Asia/Kolkata (covers most users; avoids the
       longitude fallback which would be off by 30 min for India)
    2) Try timeapi.io (free, no key needed)
    3) Fall back to longitude-based estimate
    """
    india = _COMMON_TZ["Asia/Kolkata"]
    if india["lat"][0] <= lat <= india["lat"][1] and india["lon"][0] <= lon <= india["lon"][1]:
        print("[TZ] Resolved via India bounding box: Asia/Kolkata")
        return "Asia/Kolkata"

    try:
        resp = requests.get(
            "https://timeapi.io/api/timezone/coordinate",
            params={"latitude": lat, "longitude": lon},
            timeout=5,
            verify=False
        )
        if resp.status_code == 200:
            data = resp.json()
            tz_name = data.get("timeZone") or data.get("timezone")
            if tz_name:
                # Validate it's a real pytz zone
                pytz.timezone(tz_name)
                print(f"[TZ] Resolved via timeapi.io: {tz_name}")
                return tz_name
    except Exception as e:
        print(f"[TZ] timeapi.io failed ({e}), using longitude fallback.")

    # Fallback: longitude-based estimation
    tz_name = _tz_from_lon(lon)
    print(f"[TZ] Using longitude fallback: {tz_name}")
    return tz_name


@app.route('/', methods=['GET'])
def index():
    return jsonify({"status": "ok", "message": "Kundali API is running. Use /api/kundali or /api/panchang."})

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "timezone_method": "timeapi.io + lon-fallback"})


@app.route('/api/kundali', methods=['POST'])
def generate_kundali():
    start_time = time.time()
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400

        dob_str = data.get('dob')
        tob_str = data.get('tob')
        place_str = data.get('place')

        if not all([dob_str, tob_str, place_str]):
            return jsonify({"error": "Missing required fields: dob, tob, place"}), 400

        # 1. Geocode the place
        print(f"[{datetime.now()}] Geocoding place: {place_str}")
        location = None
        try:
            location = geolocator.geocode(place_str, timeout=10)
        except Exception as e:
            print(f"[{datetime.now()}] Nominatim exception: {e}")
            
        if not location:
            try:
                print(f"[{datetime.now()}] Trying Photon fallback for: {place_str}")
                location = geolocator_fallback.geocode(place_str, timeout=10)
            except Exception as e:
                print(f"[{datetime.now()}] Photon exception: {e}")
                return jsonify({"error": f"Geocoding error: {str(e)}"}), 400

        if not location:
            print(f"[{datetime.now()}] Geocoding failed: Place '{place_str}' not found.")
            return jsonify({"error": "Place not found"}), 400
            
        print(f"[{datetime.now()}] Resolved: {location.address} ({location.latitude}, {location.longitude})")

        lat, lon = location.latitude, location.longitude

        # 2. Find Timezone and convert to UTC
        tz_name = get_timezone_for_coords(lat, lon)
        local_tz = pytz.timezone(tz_name)

        # Parse local time  (dob: YYYY-MM-DD, tob: HH:MM)
        local_dt_str = f"{dob_str} {tob_str}"
        local_dt = datetime.strptime(local_dt_str, "%Y-%m-%d %H:%M")

        # Localize and convert to UTC
        local_dt = local_tz.localize(local_dt)
        utc_dt = local_dt.astimezone(pytz.utc)

        # Extract UTC components for Julian Day calculation
        y, m, d = utc_dt.year, utc_dt.month, utc_dt.day
        h = utc_dt.hour + utc_dt.minute / 60.0 + utc_dt.second / 3600.0

        # Calculate Julian Day in UT
        jd_ut = swe.julday(y, m, d, h)

        # 3. Calculate Astrological Data
        lagna_data, planets_data = calculate_planets(jd_ut, lat, lon)

        # Assign Houses (Whole Sign)
        planets_data = calculate_houses(lagna_data['rashi'], planets_data, RASHIS)

        # Assign Nakshatras and Padas
        planets_data = assign_nakshatras(planets_data)

        # Calculate Vimshottari Dasha
        moon_longitude = planets_data['Moon']['longitude']
        dasha_data = calculate_dasha(moon_longitude, local_dt)

        # Calculate New Advanced Features
        doshas_data = calculate_doshas(planets_data)
        sade_sati_data = calculate_sade_sati(planets_data['Moon']['longitude'])
        doshas_data.append(sade_sati_data)

        yogas_data = calculate_yogas(planets_data)
        navamsa_data = calculate_navamsa(lagna_data['longitude'], planets_data)
        ashtakavarga_data = calculate_ashtakavarga(planets_data, lagna_data['rashi'])

        # Panchang details (Tithi, Vara, Yoga, Karana, Sunrise/Sunset)
        panchang_data = calculate_panchang(jd_ut, lat, lon)

        # Avakhada Chakra (Vedic birth identifiers)
        moon_longitude = planets_data['Moon']['longitude']
        avakhada_data = calculate_avakhada_chakra(moon_longitude, lagna_data, planets_data)

        # Lucky details based on Lagna Lord
        lord = lagna_data['lord']
        lucky_details = {
            "gemstone": (
                "Ruby" if lord == "Sun" else
                "Pearl" if lord == "Moon" else
                "Red Coral" if lord == "Mars" else
                "Emerald" if lord == "Mercury" else
                "Yellow Sapphire" if lord == "Jupiter" else
                "Diamond" if lord == "Venus" else
                "Blue Sapphire"
            ),
            "colors": (
                "Red/Orange" if lord == "Sun" else
                "White/Silver" if lord == "Moon" else
                "Red" if lord == "Mars" else
                "Green" if lord == "Mercury" else
                "Yellow" if lord == "Jupiter" else
                "White/Pink" if lord == "Venus" else
                "Black/Blue"
            ),
            "number": (
                1 if lord == "Sun" else
                2 if lord == "Moon" else
                9 if lord == "Mars" else
                5 if lord == "Mercury" else
                3 if lord == "Jupiter" else
                6 if lord == "Venus" else
                8
            )
        }

        # Prepare Metadata
        utc_offset = local_dt.strftime('%z')
        utc_offset_formatted = f"{utc_offset[:3]}:{utc_offset[3:]}"

        meta = {
            "lat": round(lat, 4),
            "lon": round(lon, 4),
            "timezone": tz_name,
            "utc_offset": utc_offset_formatted,
            "place_resolved": location.address
        }

        response_data = {
            "lagna": lagna_data,
            "planets": planets_data,
            "dasha": dasha_data,
            "doshas": doshas_data,
            "yogas": yogas_data,
            "navamsa": navamsa_data,
            "ashtakavarga": ashtakavarga_data,
            "panchang": panchang_data,
            "avakhada": avakhada_data,
            "lucky_details": lucky_details,
            "meta": meta
        }

        elapsed = time.time() - start_time
        print(f"[{datetime.now()}] Kundali generated for {place_str} in {elapsed:.3f}s")

        return jsonify(response_data)

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@app.route('/api/panchang', methods=['GET'])
def get_daily_panchang():
    """Lightweight endpoint specifically for daily panchang (no heavy astrological charts)."""
    try:
        lat_str = request.args.get('lat')
        lon_str = request.args.get('lon')
        date_str = request.args.get('date') # Format: YYYY-MM-DD
        
        if not all([lat_str, lon_str, date_str]):
            return jsonify({"error": "Missing required fields: lat, lon, date"}), 400
            
        lat, lon = float(lat_str), float(lon_str)
        
        # 1. Resolve timezone to convert local 12:00 PM to UTC
        tz_name = get_timezone_for_coords(lat, lon)
        local_tz = pytz.timezone(tz_name)
        
        # We calculate Panchang for 12:00 Noon local time on the requested date
        local_dt_str = f"{date_str} 12:00"
        local_dt = datetime.strptime(local_dt_str, "%Y-%m-%d %H:%M")
        local_dt = local_tz.localize(local_dt)
        utc_dt = local_dt.astimezone(pytz.utc)
        
        # Julian Day
        y, m, d = utc_dt.year, utc_dt.month, utc_dt.day
        h = utc_dt.hour + utc_dt.minute / 60.0 + utc_dt.second / 3600.0
        jd_ut = swe.julday(y, m, d, h)
        
        # Daily panchang convention: the five limbs are the ones running at
        # local sunrise (includes nakshatra + end times for each element)
        panchang_data = calculate_panchang(jd_ut, lat, lon, at_sunrise=True)

        return jsonify({
            "status": "success",
            "data": panchang_data
        })
        
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


if __name__ == '__main__':
    # Run development server
    app.run(host='0.0.0.0', port=8080, debug=True)
