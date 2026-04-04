import { signInAnonymously, GoogleAuthProvider, linkWithRedirect, getRedirectResult, onAuthStateChanged, signInWithRedirect } from 'firebase/auth';
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

export async function signInAnon() {
  if (!auth) return null;
  try {
    console.log('[Auth] Attempting anonymous sign-in...');
    const result = await signInAnonymously(auth);
    console.log('[Auth] Anonymous sign-in success:', result.user.uid);
    return result.user;
  } catch (e) {
    console.warn('[Auth] Anonymous sign-in failed:', e);
    return null;
  }
}

export function getCurrentUser() {
  return auth ? auth.currentUser : null;
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
  
  console.log('[Auth] Checking for redirect result...');
  console.log('[Auth] URL location:', window.location.href);
  console.log('[Auth] URL params check:', window.location.hash.includes('access_token') || window.location.search.includes('code'));
  
  isRedirecting = true;
  
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log('[Auth] Redirect success! User:', result.user.email);
      isRedirecting = false;
      return result.user;
    }
    console.log('[Auth] No redirect result found.');
  } catch (e) {
    console.error('[Auth] Redirect error:', e.code, e.message);
    
    // If account already exists, we must sign in directly instead of linking
    if (e.code === 'auth/credential-already-in-use') {
      console.log('[Auth] Conflict: Account already exists. Switching to direct sign-in redirect...');
      const provider = new GoogleAuthProvider();
      // Keep isRedirecting = true because page will reload
      await signInWithRedirect(auth, provider);
      return null;
    }
    
    authError = mapAuthError(e);
  }
  
  isRedirecting = false;
  return null;
}

export async function upgradeToGoogle() {
  if (!auth || !auth.currentUser) return null;
  const provider = new GoogleAuthProvider();
  clearAuthError();
  
  console.log('[Auth] Starting Google link redirect...');
  isRedirecting = true;
  
  try {
    // Start redirect flow to link account
    await linkWithRedirect(auth.currentUser, provider);
  } catch (e) {
    console.error('[Auth] Redirect trigger failed:', e);
    isRedirecting = false;
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
