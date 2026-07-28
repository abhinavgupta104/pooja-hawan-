// ─────────────────────────────────────────────────────────────
//  Firebase Auth — admin sign-in only.
//
//  These config values are NOT secrets: Firebase web config is
//  public by design. Security comes from the backend verifying
//  the ID token and checking the email against ADMIN_EMAILS, plus
//  Firebase's own authorised-domains list.
//
//  Loaded lazily so the SDK is only fetched when /admin is opened,
//  keeping it out of the main site bundle.
// ─────────────────────────────────────────────────────────────

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isConfigured = Boolean(config.apiKey && config.authDomain && config.projectId)

let authPromise = null

/** Returns the Firebase Auth instance, initialising on first use. */
export function getFirebaseAuth() {
  if (!isConfigured) {
    return Promise.reject(
      new Error(
        'Firebase is not configured. Set VITE_FIREBASE_* variables in .env and rebuild.',
      ),
    )
  }
  if (!authPromise) {
    authPromise = (async () => {
      const [{ initializeApp, getApps }, authModule] = await Promise.all([
        import('firebase/app'),
        import('firebase/auth'),
      ])
      const app = getApps().length ? getApps()[0] : initializeApp(config)
      const auth = authModule.getAuth(app)
      // Session ends when the browser closes — safer for a shared machine.
      await authModule.setPersistence(auth, authModule.browserSessionPersistence)
      return { auth, ...authModule }
    })()
  }
  return authPromise
}
