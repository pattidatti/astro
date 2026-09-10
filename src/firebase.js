/**
 * Firebase bootstrap — loaded on demand.
 *
 * The SDK is roughly a third of the JavaScript this game ships, and the game
 * runs perfectly well without it: no project id means offline-only mode, and
 * even a configured deployment only needs Firebase for cloud saves and Google
 * sign-in. Importing it statically made every player download all of it before
 * the galaxy could render.
 *
 * So the `firebase/*` packages are pulled in by dynamic `import()` inside
 * `initFirebase()`, which puts them in their own chunk. `isFirebaseConfigured()`
 * stays synchronous — it only reads env vars — so callers can keep branching on
 * it before anything is loaded.
 */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app = null;
let auth = null;
let db = null;

/** Loaded SDK namespaces, null until `initFirebase()` resolves. */
let authSdk = null;
let firestoreSdk = null;

let initPromise = null;

export function isFirebaseConfigured() {
  return !!(firebaseConfig.apiKey && firebaseConfig.projectId);
}

/**
 * Load and initialise Firebase. Idempotent — concurrent callers share one load.
 * Resolves to `{ app, auth, db }`, all null in offline-only mode or if the SDK
 * fails to load (a blocked CDN, an offline first visit): the game continues
 * with localStorage saves rather than failing to boot.
 */
export function initFirebase() {
  if (initPromise) return initPromise;

  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured — running in offline-only mode');
    initPromise = Promise.resolve({ app: null, auth: null, db: null });
    return initPromise;
  }

  initPromise = (async () => {
    try {
      const [appSdk, loadedAuth, loadedStore] = await Promise.all([
        import('firebase/app'),
        import('firebase/auth'),
        import('firebase/firestore'),
      ]);
      authSdk = loadedAuth;
      firestoreSdk = loadedStore;
      app = appSdk.initializeApp(firebaseConfig);
      auth = loadedAuth.getAuth(app);
      db = loadedStore.getFirestore(app);
    } catch (e) {
      console.warn('Firebase failed to load — continuing offline:', e);
      app = auth = db = null;
      authSdk = firestoreSdk = null;
    }
    return { app, auth, db };
  })();

  return initPromise;
}

/** The `firebase/auth` namespace, or null if it never loaded. */
export function getAuthSdk() { return authSdk; }

/** The `firebase/firestore` namespace, or null if it never loaded. */
export function getFirestoreSdk() { return firestoreSdk; }

export { app, auth, db };
