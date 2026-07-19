import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { RELOAD_FLAG } from './App.jsx'
import { startBackendWarmup } from './utils/warmBackend.js'

// Wake the Cloud Run backend while the user is still on the homepage,
// so Kundali/Panchang don't pay the cold start when opened.
startBackendWarmup()

// Vite fires this when a dynamically imported chunk fails to preload —
// typically a tab left open across a redeploy (old chunk hashes are gone).
// Reload once to pick up the fresh index.html; the guard prevents loops.
window.addEventListener('vite:preloadError', (event) => {
  if (!sessionStorage.getItem(RELOAD_FLAG)) {
    sessionStorage.setItem(RELOAD_FLAG, '1')
    event.preventDefault()
    window.location.reload()
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
