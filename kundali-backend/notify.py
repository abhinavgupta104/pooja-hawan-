"""
New-lead email alerts.

Optional by design: if RESEND_API_KEY is unset the send is skipped silently,
so lead capture never fails just because email is not configured yet.
Sending happens on a background thread — the visitor's form submission must
not wait on an external API.
"""

from __future__ import annotations

import os
import html
import logging
import threading

import requests

log = logging.getLogger("kundali.notify")

_API = "https://api.resend.com/emails"
_TIMEOUT = 10

# Fields worth showing in the alert, in display order.
_SHOW = [
    ("type", "Type"),
    ("name", "Name"),
    ("phone", "Phone"),
    ("email", "Email"),
    ("city", "City"),
    ("pujaName", "Puja"),
    ("variant", "Package"),
    ("date", "Date"),
    ("time", "Time"),
    ("language", "Language"),
    ("address", "Address"),
    ("interest", "Interest"),
    ("message", "Message"),
    ("instructions", "Instructions"),
]


def _build_html(lead: dict) -> str:
    rows = []
    for key, label in _SHOW:
        value = lead.get(key)
        if not value:
            continue
        rows.append(
            f'<tr><td style="padding:6px 12px;color:#8F6C46;white-space:nowrap">{label}</td>'
            f'<td style="padding:6px 12px;color:#221204"><strong>{html.escape(str(value))}</strong></td></tr>'
        )
    consent = "Yes" if lead.get("consent") else "No"
    rows.append(
        f'<tr><td style="padding:6px 12px;color:#8F6C46">Marketing consent</td>'
        f'<td style="padding:6px 12px;color:#221204">{consent}</td></tr>'
    )
    return (
        '<div style="font-family:system-ui,sans-serif;max-width:560px">'
        '<h2 style="color:#6B1414;margin:0 0 4px">New '
        f'{html.escape(str(lead.get("type", "lead")))} on Puja Havan</h2>'
        '<p style="color:#8F6C46;font-size:13px;margin:0 0 16px">'
        "Open the admin panel to update its status.</p>"
        '<table style="border-collapse:collapse;font-size:14px">'
        + "".join(rows)
        + "</table></div>"
    )


def _send(lead: dict, lead_id: str):
    api_key = os.environ.get("RESEND_API_KEY")
    to = [e.strip() for e in os.environ.get("ALERT_EMAIL_TO", "").split(",") if e.strip()]
    sender = os.environ.get("ALERT_EMAIL_FROM", "Puja Havan <onboarding@resend.dev>")
    if not api_key or not to:
        return

    subject = f"New {lead.get('type', 'lead')}: {lead.get('name', 'Unknown')}"
    if lead.get("pujaName"):
        subject += f" — {lead['pujaName']}"

    try:
        resp = requests.post(
            _API,
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={"from": sender, "to": to, "subject": subject, "html": _build_html(lead)},
            timeout=_TIMEOUT,
        )
        if resp.status_code >= 300:
            log.warning(
                "lead alert failed",
                extra={"extra_fields": {"status": resp.status_code, "id": lead_id}},
            )
    except Exception as exc:  # noqa: BLE001 — alerts must never break capture
        log.warning(
            "lead alert error",
            extra={"extra_fields": {"error": type(exc).__name__, "id": lead_id}},
        )


def send_lead_alert(lead: dict, lead_id: str):
    """Fire-and-forget: never blocks or fails the caller."""
    if not os.environ.get("RESEND_API_KEY"):
        return
    threading.Thread(target=_send, args=(lead, lead_id), daemon=True).start()
