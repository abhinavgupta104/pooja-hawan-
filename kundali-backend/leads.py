"""
Lead capture and admin access.

Public side  : validate + store enquiries/bookings from the website forms.
Admin side   : list / filter / update them, behind Firebase Auth.

Storage is Firestore (serverless, same region as Cloud Run). Nothing here
trusts client input: every field is whitelisted, length-capped and coerced
before it is written.
"""

from __future__ import annotations

import os
import re
import time
import logging
from datetime import datetime, timedelta, timezone

log = logging.getLogger("kundali.leads")

COLLECTION = "leads"

# Retention: leads are auto-expired this long after creation. DPDP requires
# personal data not be kept longer than the purpose needs.
RETENTION_DAYS = int(os.environ.get("LEAD_RETENTION_DAYS", "730"))  # 24 months

LEAD_TYPES = ("enquiry", "contact", "booking")
STATUSES = ("new", "contacted", "confirmed", "cancelled")

# Field -> max length. Anything not listed is dropped.
_FIELDS = {
    "name": 100,
    "phone": 20,
    "email": 120,
    "city": 80,
    "address": 300,
    "message": 2000,
    "instructions": 1000,
    "pujaId": 60,
    "pujaName": 120,
    "variant": 20,
    "date": 30,
    "time": 30,
    "language": 40,
    "interest": 40,
}

_PHONE_RE = re.compile(r"^[0-9+\-\s()]{6,20}$")
_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]{2,}$")

_db = None


def get_db():
    """Lazy Firestore client so import never blocks app startup."""
    global _db
    if _db is None:
        from google.cloud import firestore  # imported lazily: slow import

        _db = firestore.Client()
    return _db


class LeadError(ValueError):
    """Raised when submitted lead data fails validation."""


def _clean(value, limit: int) -> str:
    if value is None:
        return ""
    text = str(value).strip()
    # Strip control characters that could corrupt logs or exports.
    text = "".join(ch for ch in text if ch == "\n" or ch >= " ")
    return text[:limit]


def validate_lead(payload: dict) -> dict:
    """Whitelist, trim and sanity-check an incoming lead. Raises LeadError."""
    if not isinstance(payload, dict):
        raise LeadError("Invalid request body.")

    lead_type = _clean(payload.get("type"), 20).lower()
    if lead_type not in LEAD_TYPES:
        raise LeadError("Unknown enquiry type.")

    data = {}
    for field, limit in _FIELDS.items():
        value = _clean(payload.get(field), limit)
        if value:
            data[field] = value

    if not data.get("name"):
        raise LeadError("Please enter your name.")
    if not data.get("phone"):
        raise LeadError("Please enter a phone number.")
    if not _PHONE_RE.match(data["phone"]):
        raise LeadError("Please enter a valid phone number.")
    if data.get("email") and not _EMAIL_RE.match(data["email"]):
        raise LeadError("Please enter a valid email address.")

    if lead_type == "booking" and not data.get("pujaId"):
        raise LeadError("Please select a puja.")
    if lead_type == "contact" and not data.get("message"):
        raise LeadError("Please enter a message.")

    # Consent is only meaningful when the user actively ticked the box.
    consent = bool(payload.get("consent"))

    now = datetime.now(timezone.utc)
    return {
        **data,
        "type": lead_type,
        "consent": consent,
        "status": "new",
        "createdAt": now,
        "expiresAt": now + timedelta(days=RETENTION_DAYS),
        "source": "website",
    }


def create_lead(payload: dict) -> tuple[str, dict]:
    """Validate and persist a lead. Returns (document id, stored record)."""
    record = validate_lead(payload)
    doc_ref = get_db().collection(COLLECTION).document()
    doc_ref.set(record)
    log.info(
        "lead captured",
        extra={"extra_fields": {"id": doc_ref.id, "type": record["type"]}},
    )
    return doc_ref.id, record


def _serialise(doc) -> dict:
    raw = doc.to_dict() or {}
    out = {"id": doc.id}
    for key, value in raw.items():
        if key == "expiresAt":
            continue  # internal retention marker, not useful to the admin UI
        if hasattr(value, "isoformat"):
            out[key] = value.isoformat()
        else:
            out[key] = value
    return out


def list_leads(lead_type: str | None = None, status: str | None = None, limit: int = 200) -> list[dict]:
    """Newest-first leads, optionally filtered. Expired ones are hidden."""
    from google.cloud.firestore_v1 import FieldFilter

    query = get_db().collection(COLLECTION)
    if lead_type in LEAD_TYPES:
        query = query.where(filter=FieldFilter("type", "==", lead_type))
    if status in STATUSES:
        query = query.where(filter=FieldFilter("status", "==", status))

    query = query.order_by("createdAt", direction="DESCENDING").limit(min(max(limit, 1), 500))

    now = datetime.now(timezone.utc)
    results = []
    for doc in query.stream():
        record = doc.to_dict() or {}
        expires = record.get("expiresAt")
        if expires and expires < now:
            continue  # past retention: treat as deleted
        results.append(_serialise(doc))
    return results


def update_status(lead_id: str, status: str) -> bool:
    """Set a lead's workflow status. Returns False if it doesn't exist."""
    if status not in STATUSES:
        raise LeadError("Invalid status.")
    doc_ref = get_db().collection(COLLECTION).document(lead_id)
    if not doc_ref.get().exists:
        return False
    doc_ref.update({"status": status, "updatedAt": datetime.now(timezone.utc)})
    return True


def delete_lead(lead_id: str) -> bool:
    """Hard-delete a lead (supports DPDP right-to-erasure requests)."""
    doc_ref = get_db().collection(COLLECTION).document(lead_id)
    if not doc_ref.get().exists:
        return False
    doc_ref.delete()
    log.info("lead deleted", extra={"extra_fields": {"id": lead_id}})
    return True


def purge_expired(batch: int = 200) -> int:
    """Delete leads past their retention date. Safe to call repeatedly."""
    from google.cloud.firestore_v1 import FieldFilter

    now = datetime.now(timezone.utc)
    query = (
        get_db()
        .collection(COLLECTION)
        .where(filter=FieldFilter("expiresAt", "<", now))
        .limit(batch)
    )
    removed = 0
    for doc in query.stream():
        doc.reference.delete()
        removed += 1
    if removed:
        log.info("retention purge", extra={"extra_fields": {"deleted": removed}})
    return removed
