// ─────────────────────────────────────────────────────────────
//  Lead submission + admin lead access.
//  All persistence happens server-side; the browser only ever
//  holds a short-lived Firebase ID token for admin calls.
// ─────────────────────────────────────────────────────────────

export const BACKEND =
  import.meta.env.VITE_BACKEND_URL ||
  'https://kundali-backend-408824487148.asia-south1.run.app'

/**
 * Submit a website enquiry/booking.
 * @param {'enquiry'|'contact'|'booking'} type
 * @param {object} data  form fields (whitelisted server-side)
 * @returns {Promise<{id: string}>} throws Error with a user-safe message
 */
export async function submitLead(type, data) {
  let res
  try {
    res = await fetch(`${BACKEND}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, type }),
    })
  } catch {
    // Network/DNS/CORS failure — the request never reached the server.
    throw new Error(
      "We couldn't reach our servers. Please check your connection or call us on +91 96709 55055.",
    )
  }

  let body = {}
  try {
    body = await res.json()
  } catch {
    /* empty or non-JSON body — fall through to the status check */
  }

  if (!res.ok) {
    throw new Error(
      body.error || "We couldn't submit your request. Please call us on +91 96709 55055.",
    )
  }
  return body
}

/** Admin: fetch leads. `token` is a Firebase ID token. */
export async function fetchLeads(token, { type, status, limit = 200 } = {}) {
  const params = new URLSearchParams()
  if (type && type !== 'all') params.set('type', type)
  if (status && status !== 'all') params.set('status', status)
  params.set('limit', String(limit))

  const res = await fetch(`${BACKEND}/api/admin/leads?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || 'Could not load leads.')
  return body.leads || []
}

/** Admin: anonymous traffic summary (views, sessions, top pages/referrers). */
export async function fetchTraffic(token, days = 30) {
  const res = await fetch(`${BACKEND}/api/admin/traffic?days=${days}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || 'Could not load traffic stats.')
  return body.traffic
}

/** Admin: update a lead's workflow status. */
export async function updateLeadStatus(token, id, status) {
  const res = await fetch(`${BACKEND}/api/admin/leads/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || 'Could not update the lead.')
  return body
}

/** Admin: permanently delete a lead (right-to-erasure requests). */
export async function deleteLead(token, id) {
  const res = await fetch(`${BACKEND}/api/admin/leads/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.error || 'Could not delete the lead.')
  return body
}
