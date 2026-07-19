// ─────────────────────────────────────────────────────────────
//  Fire-and-forget backend warmup, started at app boot.
//
//  The Kundali/Panchang backend runs on Cloud Run and scales to
//  zero when idle; the first request then pays a cold start.
//  Pinging /health as soon as the SPA loads lets the container
//  boot while the user is still browsing, so the Tools pages feel
//  instant by the time they open them.
//
//  Also re-pings when the tab becomes visible again after being
//  hidden a while (covers "left the tab open overnight").
// ─────────────────────────────────────────────────────────────
const BACKEND =
  import.meta.env.VITE_BACKEND_URL ||
  'https://kundali-backend-408824487148.asia-south1.run.app'

const REWARM_AFTER_MS = 10 * 60 * 1000 // re-ping if idle/hidden > 10 min

let lastPingAt = 0

function ping() {
  lastPingAt = Date.now()
  fetch(`${BACKEND}/health`, { method: 'GET', cache: 'no-store' }).catch(() => {
    // Best-effort: warmup failures are invisible to the user;
    // pages that need the backend show their own status UI.
  })
}

export function startBackendWarmup() {
  ping()

  document.addEventListener('visibilitychange', () => {
    if (
      document.visibilityState === 'visible' &&
      Date.now() - lastPingAt > REWARM_AFTER_MS
    ) {
      ping()
    }
  })
}
