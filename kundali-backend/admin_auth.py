"""
Admin authentication via Firebase Auth.

The browser signs in with Firebase and sends the resulting ID token as
`Authorization: Bearer <token>`. We verify that token server-side with the
Firebase Admin SDK — the frontend is a public bundle, so it is never trusted
to decide who is an admin.

Only accounts whose email is listed in ADMIN_EMAILS may read lead data.
"""

from __future__ import annotations

import os
import logging
from functools import wraps

from flask import request, jsonify, g

log = logging.getLogger("kundali.auth")

_initialised = False


def _admin_emails() -> set[str]:
    raw = os.environ.get("ADMIN_EMAILS", "")
    return {e.strip().lower() for e in raw.split(",") if e.strip()}


def _ensure_firebase():
    """Initialise the Admin SDK once, using Cloud Run's default credentials."""
    global _initialised
    if _initialised:
        return
    import firebase_admin

    if not firebase_admin._apps:
        firebase_admin.initialize_app()
    _initialised = True


def verify_admin(token: str):
    """Return the decoded token for a valid admin, else None."""
    allowed = _admin_emails()
    if not allowed:
        log.error("ADMIN_EMAILS is not configured — refusing all admin access")
        return None

    try:
        _ensure_firebase()
        from firebase_admin import auth as fb_auth

        # check_revoked catches disabled/deleted accounts and revoked sessions.
        decoded = fb_auth.verify_id_token(token, check_revoked=True)
    except Exception as exc:  # noqa: BLE001 - any failure means "not authorised"
        log.warning("admin token rejected", extra={"extra_fields": {"reason": type(exc).__name__}})
        return None

    email = (decoded.get("email") or "").lower()
    if not decoded.get("email_verified", False):
        log.warning("admin token rejected", extra={"extra_fields": {"reason": "email_unverified"}})
        return None
    if email not in allowed:
        log.warning("non-admin sign-in attempt", extra={"extra_fields": {"email": email}})
        return None

    return decoded


def require_admin(fn):
    """Decorator: 401 unless the caller presents a valid admin ID token."""

    @wraps(fn)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return jsonify({"error": "Authentication required."}), 401

        decoded = verify_admin(header[7:].strip())
        if not decoded:
            return jsonify({"error": "Not authorised."}), 403

        g.admin_email = decoded.get("email")
        return fn(*args, **kwargs)

    return wrapper
