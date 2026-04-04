import { 
  signOut as firebaseSignOut,
  GoogleAuthProvider, 
  getRedirectResult, 
  onAuthStateChanged, 
  signInWithRedirect,
  signInWithPopup
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase.js';

let authError = null;
let isRedirecting = false;

export function getAuthError() {
  return authError;
}

export function clearAuthError() {
  authError = null;
}

/**
 * Returns true if we are currently awaiting or triggering an auth redirect.
 */
export function isRedirectInProgress() {
  return isRedirecting;
}

export function onAuthReady(callback) {
  if (!isFirebaseConfigured() || !auth) {
    callback(null);
    return;
  }
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

export function getCurrentUser() {
  return auth ? auth.currentUser : null;
}

export function signOut() {
  if (!auth) return;
  return firebaseSignOut(auth);
}

export function isGoogleUser() {
  const user = getCurrentUser();
  if (!user) return false;
  return user.providerData.some(p => p.providerId === 'google.com');
}

/**
 * Handle the result of a redirect sign-in/link operation.
 * Should be called during app boot.
 */
export async function handleAuthRedirect() {
  if (!auth) return null;
  
  const hasRedirectParams = window.location.hash.includes('access_token') || 
                            window.location.search.includes('code') || 
                            window.location.search.includes('state');

  console.log('[Auth] Checking for redirect result...');
  console.log('[Auth] URL location:', window.location.href);
  console.log('[Auth] URL params detected:', hasRedirectParams);
  
  isRedirecting = true;
  
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log('[Auth] Redirect success! User:', result.user.email);
      isRedirecting = false;
      return result.user;
    }
    console.log(hasRedirectParams ? '[Auth] Redirect result was null despite URL params.' : '[Auth] No redirect result found (standard load).');
  } catch (e) {
    console.error('[Auth] Redirect error:', e.code);
    authError = mapAuthError(e);
  }
  
  isRedirecting = false;
  return null;
}

/**
 * Simple Google sign-in. No linking involved anymore.
 */
export async function signInWithGoogle() {
  if (!auth) return null;
  const provider = new GoogleAuthProvider();
  clearAuthError();
  
  console.log('[Auth] Attempting Google sign-in via Popup...');
  
  try {
    const result = await signInWithPopup(auth, provider);
    console.log('[Auth] Popup sign-in success!', result.user.email);
    return result.user;
  } catch (e) {
    console.warn(`[Auth] Popup failed with code: ${e.code}`, e);
    
    // Fallback on most blockers or technical failures to Redirect
    if (e.code === 'auth/popup-blocked' || e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') {
      console.log(`[Auth] Popup issue (${e.code}), falling back to Redirect...`);
      isRedirecting = true;
      try {
        await signInWithRedirect(auth, provider);
      } catch (re) {
        console.error('[Auth] Redirect trigger failed:', re.code);
        isRedirecting = false;
        authError = mapAuthError(re);
      }
      return null;
    }
    
    authError = mapAuthError(e);
    return null;
  }
}

function mapAuthError(e) {
  switch (e.code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign-in cancelled';
    case 'auth/credential-already-in-use':
      return 'Account already linked to another player';
    case 'auth/popup-blocked':
      return 'Popup blocked by browser security';
    case 'auth/network-request-failed':
      return 'Network error — check your connection';
    case 'auth/internal-error':
      return 'Authentication service error';
    case 'auth/operation-not-allowed':
      return 'Google sign-in is not enabled in Firebase';
    default:
      return e.message || 'An unknown authentication error occurred';
  }
}
