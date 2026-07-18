import { useState, useEffect, useRef } from 'react';

/**
 * Pings the backend on mount so it wakes up from Render's free-tier sleep.
 * After the backend is ready, keeps it alive with a recurring ping.
 * Returns the server's "ready" status + how long the warmup took.
 *
 * @param {string} pingUrl  - URL to GET (should respond quickly, e.g. /health or /)
 * @param {object} options
 *   timeout        - ms before we give up on warmup ping (default 60_000)
 *   skip           - set true to skip the warmup entirely (e.g. data already cached)
 *   keepAliveMs    - interval in ms for recurring keep-alive pings (default 4 min)
 *                    Set to 0 or false to disable keep-alive pings.
 */
export function useBackendWarmup(
  pingUrl,
  { timeout = 60_000, skip = false, keepAliveMs = 4 * 60 * 1000 } = {}
) {
  const [status, setStatus] = useState('idle');   // idle | warming | ready | error
  const [elapsed, setElapsed] = useState(0);       // ms since warmup started
  const startRef     = useRef(null);
  const timerRef     = useRef(null);  // elapsed counter interval
  const abortRef     = useRef(null);  // AbortController for initial ping
  const keepAliveRef = useRef(null);  // keep-alive interval

  useEffect(() => {
    if (skip || !pingUrl) return;

    let cancelled = false;
    abortRef.current = new AbortController();
    startRef.current = Date.now();
    setStatus('warming');
    setElapsed(0);

    // Tick the elapsed counter every 500 ms so the UI can animate a progress bar
    timerRef.current = setInterval(() => {
      if (!cancelled) setElapsed(Date.now() - startRef.current);
    }, 500);

    const deadline = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), timeout)
    );

    const ping = fetch(pingUrl, {
      method: 'GET',
      signal: abortRef.current.signal,
      cache: 'no-store',
    });

    Promise.race([ping, deadline])
      .then(() => {
        if (!cancelled) {
          setElapsed(Date.now() - startRef.current);
          setStatus('ready');

          // ── Keep-alive: ping every `keepAliveMs` to prevent Render from sleeping ──
          if (keepAliveMs) {
            keepAliveRef.current = setInterval(() => {
              fetch(pingUrl, { method: 'GET', cache: 'no-store' }).catch(() => {
                // Silent fail — keep-alive pings are best-effort
              });
            }, keepAliveMs);
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('error');
        }
      })
      .finally(() => {
        clearInterval(timerRef.current);
      });

    return () => {
      cancelled = true;
      clearInterval(timerRef.current);
      clearInterval(keepAliveRef.current); // Stop keep-alive on unmount
      abortRef.current?.abort();
    };
  }, [pingUrl, skip, timeout, keepAliveMs]);

  return { status, elapsed };
}
