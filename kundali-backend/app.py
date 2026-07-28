import json
import logging
import os
import sys
import threading
import time
from collections import deque
from datetime import datetime

import pytz
import swisseph as swe
from flask import Flask, g, jsonify, request
from flask_cors import CORS

from calculations.planets import calculate_planets, RASHIS
from calculations.houses import calculate_houses
from calculations.nakshatra import assign_nakshatras
from calculations.dasha import calculate_dasha
from calculations.doshas import calculate_doshas, calculate_sade_sati
from calculations.yogas import calculate_yogas
from calculations.divisional import calculate_navamsa
from calculations.ashtakavarga import calculate_ashtakavarga
from calculations.panchang import calculate_panchang, calculate_avakhada_chakra
from geo import GeocodingError, cache_stats, geocode, resolve_timezone
from leads import LeadError, create_lead, delete_lead, list_leads, update_status
from admin_auth import require_admin
from notify import send_lead_alert

# ---------------------------------------------------------------------------
# Logging — JSON lines so Cloud Logging picks up severity and fields properly
# (plain print() lands as unlabelled text and can't be alerted on).
# ---------------------------------------------------------------------------
class CloudLoggingFormatter(logging.Formatter):
    def format(self, record):
        entry = {
            "severity": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
        }
        if hasattr(record, "extra_fields"):
            entry.update(record.extra_fields)
        if record.exc_info:
            entry["exception"] = self.formatException(record.exc_info)
        return json.dumps(entry)


_handler = logging.StreamHandler(sys.stdout)
_handler.setFormatter(CloudLoggingFormatter())
logging.basicConfig(level=logging.INFO, handlers=[_handler], force=True)
log = logging.getLogger("kundali")

app = Flask(__name__)

# Reject oversized bodies outright (default would buffer them into memory).
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024  # 16 KB is ample for our payloads

# ---------------------------------------------------------------------------
# CORS — restricted to our own origins. Previously CORS(app) reflected any
# Origin, which let any site on the internet use this API.
# ---------------------------------------------------------------------------
_default_origins = "https://pujahavan.com,https://www.pujahavan.com"
ALLOWED_ORIGINS = [
    o.strip() for o in os.environ.get("ALLOWED_ORIGINS", _default_origins).split(",") if o.strip()
]
if os.environ.get("ALLOW_LOCALHOST", "").lower() in ("1", "true", "yes"):
    ALLOWED_ORIGINS += ["http://localhost:5173", "http://127.0.0.1:5173"]

CORS(
    app,
    resources={r"/api/*": {"origins": ALLOWED_ORIGINS}},
    methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    max_age=3600,
)

# Ephemeris files shipped in ephe/ are the *_18.se1 set, valid 1800-2399.
# Outside that range Swiss Ephemeris silently drops to the lower-precision
# Moshier model, so we reject rather than return a chart we can't stand behind.
MIN_YEAR, MAX_YEAR = 1800, 2399

MAX_PLACE_LEN = 120


# ---------------------------------------------------------------------------
# Rate limiting — simple per-IP sliding window, in-process (no extra
# dependency, no cold-start cost). Approximate across instances, which is
# fine: it exists to stop abuse, not to meter billing.
# ---------------------------------------------------------------------------
_RATE_LIMIT = int(os.environ.get("RATE_LIMIT_PER_MIN", "30"))
_rate_state: dict[str, deque] = {}
_rate_lock = threading.Lock()


def _client_ip() -> str:
    # Cloud Run puts the real client first in X-Forwarded-For.
    fwd = request.headers.get("X-Forwarded-For", "")
    return fwd.split(",")[0].strip() if fwd else (request.remote_addr or "unknown")


def _rate_limited() -> bool:
    now = time.monotonic()
    ip = _client_ip()
    with _rate_lock:
        bucket = _rate_state.setdefault(ip, deque())
        while bucket and now - bucket[0] > 60:
            bucket.popleft()
        if len(bucket) >= _RATE_LIMIT:
            return True
        bucket.append(now)
        # Opportunistic cleanup so the dict can't grow without bound.
        if len(_rate_state) > 4096:
            for key in [k for k, v in _rate_state.items() if not v or now - v[-1] > 300]:
                _rate_state.pop(key, None)
    return False


def error(message: str, status: int = 400, **extra):
    """Client-safe error. Internal details are logged, never returned."""
    payload = {"error": message}
    payload.update(extra)
    return jsonify(payload), status


@app.before_request
def _guard():
    g.started = time.time()
    if request.path.startswith("/api/") and request.method != "OPTIONS":
        if _rate_limited():
            log.warning("Rate limit exceeded", extra={"extra_fields": {"ip": _client_ip()}})
            return error("Too many requests. Please wait a moment and try again.", 429)


@app.after_request
def _log_request(response):
    if request.path.startswith("/api/"):
        log.info(
            "request",
            extra={
                "extra_fields": {
                    "path": request.path,
                    "status": response.status_code,
                    "duration_ms": round((time.time() - getattr(g, "started", time.time())) * 1000, 1),
                }
            },
        )
    return response


@app.errorhandler(404)
def _not_found(_):
    return error("Not found", 404)


@app.errorhandler(405)
def _bad_method(_):
    return error("Method not allowed for this endpoint", 405)


@app.errorhandler(413)
def _too_large(_):
    return error("Request body too large", 413)


@app.errorhandler(Exception)
def _unhandled(exc):
    log.exception("Unhandled error", extra={"extra_fields": {"path": request.path}})
    return error("Something went wrong on our side. Please try again.", 500)


# ---------------------------------------------------------------------------
# Validation helpers — every user-input failure returns 400 with a message
# safe (and useful) to show a devotee, instead of a 500 with a Python trace.
# ---------------------------------------------------------------------------
def parse_birth_datetime(dob: str, tob: str):
    """Parse date/time, accepting the formats users actually type."""
    dob, tob = dob.strip(), tob.strip()

    date_formats = ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%Y/%m/%d")
    parsed_date = None
    for fmt in date_formats:
        try:
            parsed_date = datetime.strptime(dob, fmt).date()
            break
        except ValueError:
            continue
    if parsed_date is None:
        raise ValueError(
            "Date of birth must look like YYYY-MM-DD (for example 1995-08-15)."
        )

    time_formats = ("%H:%M", "%H:%M:%S", "%I:%M %p", "%I:%M%p")
    parsed_time = None
    for fmt in time_formats:
        try:
            parsed_time = datetime.strptime(tob.upper(), fmt).time()
            break
        except ValueError:
            continue
    if parsed_time is None:
        raise ValueError("Time of birth must look like HH:MM in 24-hour form (for example 10:30).")

    if not (MIN_YEAR <= parsed_date.year <= MAX_YEAR):
        raise ValueError(
            f"We can only calculate charts for birth years between {MIN_YEAR} and {MAX_YEAR}."
        )

    return datetime.combine(parsed_date, parsed_time)


def julian_day(local_dt, tz_name: str):
    """Localise a naive birth datetime and convert to Julian Day (UT)."""
    local_tz = pytz.timezone(tz_name)
    # is_dst=None would raise on ambiguous/nonexistent local times (DST edges);
    # we prefer a sane default over failing the user's chart outright.
    aware = local_tz.localize(local_dt, is_dst=True)
    utc_dt = aware.astimezone(pytz.utc)
    hours = utc_dt.hour + utc_dt.minute / 60.0 + utc_dt.second / 3600.0
    return swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, hours), aware


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.route("/", methods=["GET"])
def index():
    return jsonify(
        {"status": "ok", "message": "Kundali API is running. Use /api/kundali or /api/panchang."}
    )


@app.route("/health", methods=["GET"])
def health_check():
    """Verifies the ephemeris actually loads, not just that Flask is up."""
    try:
        swe.calc_ut(swe.julday(2026, 1, 1, 12.0), swe.SUN)
        ephemeris_ok = True
    except Exception:
        log.exception("Ephemeris self-check failed")
        ephemeris_ok = False

    body = {"status": "ok" if ephemeris_ok else "degraded", "ephemeris": ephemeris_ok}
    body.update(cache_stats())
    return jsonify(body), (200 if ephemeris_ok else 503)


@app.route("/api/kundali", methods=["POST"])
def generate_kundali():
    started = time.time()

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return error("Request body must be JSON.")

    dob_str = (data.get("dob") or "").strip()
    tob_str = (data.get("tob") or "").strip()
    place_str = (data.get("place") or "").strip()

    missing = [f for f, v in (("dob", dob_str), ("tob", tob_str), ("place", place_str)) if not v]
    if missing:
        return error(f"Please provide: {', '.join(missing)}.")

    if len(place_str) > MAX_PLACE_LEN:
        return error(f"Place name is too long (max {MAX_PLACE_LEN} characters).")

    try:
        local_dt = parse_birth_datetime(dob_str, tob_str)
    except ValueError as exc:
        return error(str(exc))

    try:
        lat, lon, place_label, tz_name, tz_exact = geocode(place_str)
    except GeocodingError:
        return error(
            f"We couldn't find '{place_str}'. Try adding the state or country, "
            "for example 'Varanasi, Uttar Pradesh'."
        )

    try:
        jd_ut, aware_dt = julian_day(local_dt, tz_name)

        lagna_data, planets_data = calculate_planets(jd_ut, lat, lon)
        planets_data = calculate_houses(lagna_data["rashi"], planets_data, RASHIS)
        planets_data = assign_nakshatras(planets_data)

        moon_longitude = planets_data["Moon"]["longitude"]
        dasha_data = calculate_dasha(moon_longitude, aware_dt)

        doshas_data = calculate_doshas(planets_data)
        doshas_data.append(calculate_sade_sati(moon_longitude))

        yogas_data = calculate_yogas(planets_data)
        navamsa_data = calculate_navamsa(lagna_data["longitude"], planets_data)
        ashtakavarga_data = calculate_ashtakavarga(planets_data, lagna_data["rashi"])
        panchang_data = calculate_panchang(jd_ut, lat, lon)
        avakhada_data = calculate_avakhada_chakra(moon_longitude, lagna_data, planets_data)
    except Exception:
        log.exception(
            "Chart calculation failed",
            extra={"extra_fields": {"place": place_str, "dob": dob_str}},
        )
        return error("We couldn't calculate this chart. Please check the birth details.", 500)

    lord = lagna_data["lord"]
    lucky_details = {
        "gemstone": {
            "Sun": "Ruby", "Moon": "Pearl", "Mars": "Red Coral", "Mercury": "Emerald",
            "Jupiter": "Yellow Sapphire", "Venus": "Diamond",
        }.get(lord, "Blue Sapphire"),
        "colors": {
            "Sun": "Red/Orange", "Moon": "White/Silver", "Mars": "Red", "Mercury": "Green",
            "Jupiter": "Yellow", "Venus": "White/Pink",
        }.get(lord, "Black/Blue"),
        "number": {"Sun": 1, "Moon": 2, "Mars": 9, "Mercury": 5, "Jupiter": 3, "Venus": 6}.get(lord, 8),
    }

    utc_offset = aware_dt.strftime("%z")
    meta = {
        "lat": round(lat, 4),
        "lon": round(lon, 4),
        "timezone": tz_name,
        "utc_offset": f"{utc_offset[:3]}:{utc_offset[3:]}",
        "place_resolved": place_label,
    }
    if not tz_exact:
        meta["timezone_note"] = (
            "Timezone estimated from longitude; historical daylight-saving "
            "rules may not apply. Add a country for a more precise result."
        )

    elapsed_ms = round((time.time() - started) * 1000, 1)
    log.info(
        "kundali generated",
        extra={"extra_fields": {"place": place_label, "tz": tz_name, "duration_ms": elapsed_ms}},
    )

    return jsonify(
        {
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
            "meta": meta,
        }
    )


@app.route("/api/panchang", methods=["GET"])
def get_daily_panchang():
    """Lightweight daily panchang (no heavy chart computation)."""
    lat_str = request.args.get("lat")
    lon_str = request.args.get("lon")
    date_str = request.args.get("date")

    missing = [f for f, v in (("lat", lat_str), ("lon", lon_str), ("date", date_str)) if not v]
    if missing:
        return error(f"Please provide: {', '.join(missing)}.")

    try:
        lat, lon = float(lat_str), float(lon_str)
    except (TypeError, ValueError):
        return error("Latitude and longitude must be numbers.")

    if not (-90 <= lat <= 90) or not (-180 <= lon <= 180):
        return error("Latitude must be between -90 and 90, longitude between -180 and 180.")

    try:
        target_date = datetime.strptime(date_str.strip(), "%Y-%m-%d").date()
    except ValueError:
        return error("Date must look like YYYY-MM-DD (for example 2026-07-27).")

    if not (MIN_YEAR <= target_date.year <= MAX_YEAR):
        return error(f"Date must be between {MIN_YEAR} and {MAX_YEAR}.")

    tz_name, _ = resolve_timezone(lat, lon)

    try:
        local_tz = pytz.timezone(tz_name)
        local_dt = local_tz.localize(datetime.combine(target_date, datetime.min.time()).replace(hour=12))
        utc_dt = local_dt.astimezone(pytz.utc)
        hours = utc_dt.hour + utc_dt.minute / 60.0 + utc_dt.second / 3600.0
        jd_ut = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, hours)
        panchang_data = calculate_panchang(jd_ut, lat, lon, at_sunrise=True)
    except Exception:
        log.exception(
            "Panchang calculation failed",
            extra={"extra_fields": {"lat": lat, "lon": lon, "date": date_str}},
        )
        return error("We couldn't calculate the panchang for that location.", 500)

    return jsonify({"status": "success", "data": panchang_data, "timezone": tz_name})


# ---------------------------------------------------------------------------
# Leads — public capture + admin review (Firebase Auth protected)
# ---------------------------------------------------------------------------


@app.route("/api/leads", methods=["POST"])
def submit_lead():
    """Public: capture a website enquiry/booking. Rate-limited by _guard()."""
    payload = request.get_json(silent=True) or {}
    try:
        lead_id, record = create_lead(payload)
    except LeadError as exc:
        return error(str(exc), 400)
    except Exception:
        log.exception("Lead capture failed")
        return error("We couldn't submit your request. Please call us instead.", 500)

    send_lead_alert(record, lead_id)
    return jsonify({"status": "success", "id": lead_id}), 201


@app.route("/api/admin/leads", methods=["GET"])
@require_admin
def admin_list_leads():
    try:
        return jsonify(
            {
                "status": "success",
                "leads": list_leads(
                    lead_type=request.args.get("type"),
                    status=request.args.get("status"),
                    limit=int(request.args.get("limit", 200)),
                ),
            }
        )
    except ValueError:
        return error("Invalid query parameter.", 400)
    except Exception:
        log.exception("Admin lead listing failed")
        return error("Could not load leads.", 500)


@app.route("/api/admin/leads/<lead_id>", methods=["PATCH"])
@require_admin
def admin_update_lead(lead_id):
    payload = request.get_json(silent=True) or {}
    try:
        if not update_status(lead_id, str(payload.get("status", "")).lower()):
            return error("Lead not found.", 404)
    except LeadError as exc:
        return error(str(exc), 400)
    except Exception:
        log.exception("Admin lead update failed")
        return error("Could not update the lead.", 500)
    return jsonify({"status": "success"})


@app.route("/api/admin/leads/<lead_id>", methods=["DELETE"])
@require_admin
def admin_delete_lead(lead_id):
    """Supports DPDP right-to-erasure requests."""
    try:
        if not delete_lead(lead_id):
            return error("Lead not found.", 404)
    except Exception:
        log.exception("Admin lead delete failed")
        return error("Could not delete the lead.", 500)
    return jsonify({"status": "success"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)), debug=False)
