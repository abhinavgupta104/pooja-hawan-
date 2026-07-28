"""
Privacy-first traffic counting.

Stores **aggregate counts only** — no cookies, no IP addresses, no device
identifiers, nothing that identifies a person. A row is a date plus tallies,
so there is no personal data here to export, erase or breach.

Counters are sharded because Firestore caps sustained writes at roughly one
per second per document; concurrent visitors would otherwise contend on a
single daily doc.
"""

from __future__ import annotations

import os
import re
import random
import logging
from datetime import datetime, timedelta, timezone

log = logging.getLogger("kundali.analytics")

COLLECTION = "traffic_daily"
SHARDS = int(os.environ.get("TRAFFIC_SHARDS", "5"))
RETENTION_DAYS = int(os.environ.get("TRAFFIC_RETENTION_DAYS", "400"))

_MAX_TRACKED_PATH = 120
_KEY_SAFE = re.compile(r"[^a-zA-Z0-9_-]")

# Cheap user-agent screen. Not exhaustive — it removes the obvious crawlers so
# the numbers reflect people rather than bots.
_BOT_RE = re.compile(
    r"bot|crawler|spider|crawling|slurp|bingpreview|facebookexternalhit|"
    r"whatsapp|telegram|preview|monitor|uptime|curl|wget|python-requests|"
    r"headless|lighthouse|pagespeed|gtmetrix|pingdom|semrush|ahrefs",
    re.I,
)

_db = None


def get_db():
    global _db
    if _db is None:
        from google.cloud import firestore

        _db = firestore.Client()
    return _db


def is_bot(user_agent: str | None) -> bool:
    if not user_agent or len(user_agent) < 10:
        return True  # no/absurd UA is almost always automated
    return bool(_BOT_RE.search(user_agent))


def _today() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def _safe_key(value: str, fallback: str = "other") -> str:
    """Firestore map keys can't contain dots or slashes — encode them."""
    if not value:
        return fallback
    key = _KEY_SAFE.sub("_", value.strip())[:60].strip("_")
    return key or fallback


def normalise_path(path: str | None) -> str:
    if not path:
        return "/"
    path = path.split("?")[0].split("#")[0].strip()[:_MAX_TRACKED_PATH]
    if not path.startswith("/"):
        path = "/" + path
    # Collapse dynamic segments so the report stays readable.
    path = re.sub(r"^/service/[^/]+$", "/service/:slug", path)
    path = re.sub(r"^/pandit/[^/]+$", "/pandit/:id", path)
    return path.rstrip("/") or "/"


def referrer_host(referrer: str | None) -> str:
    """Bare hostname only — never the full referring URL."""
    if not referrer:
        return "direct"
    m = re.match(r"https?://([^/:?#]+)", referrer.strip(), re.I)
    if not m:
        return "direct"
    host = m.group(1).lower()
    if host.startswith("www."):
        host = host[4:]
    if "poojahawan" in host or "localhost" in host:
        return "internal"
    return host[:60]


def record_view(path: str, referrer: str | None, new_session: bool) -> None:
    """Increment today's counters. Never raises — traffic stats are best-effort."""
    from google.cloud import firestore

    date = _today()
    shard = random.randrange(SHARDS)
    doc_id = f"{date}#{shard}"

    payload = {
        "date": date,
        "views": firestore.Increment(1),
        "paths": {_safe_key(normalise_path(path), "root"): firestore.Increment(1)},
        "referrers": {_safe_key(referrer_host(referrer), "direct"): firestore.Increment(1)},
        "expiresAt": datetime.now(timezone.utc) + timedelta(days=RETENTION_DAYS),
    }
    if new_session:
        payload["sessions"] = firestore.Increment(1)

    try:
        get_db().collection(COLLECTION).document(doc_id).set(payload, merge=True)
    except Exception:
        log.exception("traffic counter write failed")


def _blank():
    return {"views": 0, "sessions": 0, "paths": {}, "referrers": {}}


def summary(days: int = 30) -> dict:
    """Totals, a per-day series, and top paths/referrers for the window."""
    from google.cloud.firestore_v1 import FieldFilter

    end = datetime.now(timezone.utc).date()
    start = end - timedelta(days=max(days, 1) - 1)
    start_s, end_s = start.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d")

    per_day: dict[str, dict] = {}
    totals = _blank()

    query = (
        get_db()
        .collection(COLLECTION)
        .where(filter=FieldFilter("date", ">=", start_s))
        .where(filter=FieldFilter("date", "<=", end_s))
    )

    for doc in query.stream():
        d = doc.to_dict() or {}
        date = d.get("date")
        if not date:
            continue
        bucket = per_day.setdefault(date, _blank())
        for field in ("views", "sessions"):
            n = int(d.get(field) or 0)
            bucket[field] += n
            totals[field] += n
        for field in ("paths", "referrers"):
            for key, n in (d.get(field) or {}).items():
                n = int(n or 0)
                bucket[field][key] = bucket[field].get(key, 0) + n
                totals[field][key] = totals[field].get(key, 0) + n

    # Dense series so the chart has no gaps on quiet days.
    series = []
    for i in range(max(days, 1)):
        day = (start + timedelta(days=i)).strftime("%Y-%m-%d")
        b = per_day.get(day) or _blank()
        series.append({"date": day, "views": b["views"], "sessions": b["sessions"]})

    def top(mapping, limit=8):
        return [
            {"name": k, "count": v}
            for k, v in sorted(mapping.items(), key=lambda kv: kv[1], reverse=True)[:limit]
        ]

    return {
        "days": days,
        "views": totals["views"],
        "sessions": totals["sessions"],
        "series": series,
        "topPaths": top(totals["paths"]),
        "topReferrers": top(totals["referrers"]),
    }
