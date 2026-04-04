import { signInAnonymously, GoogleAuthProvider, linkWithRedirect, getRedirectResult, onAuthStateChanged, signInWithRedirect } from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase.js';

let authError = null;

export function getAuthError() {
  return authError;
}

export function clearAuthError() {
  authError = null;
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
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (e) {
    console.warn('Anonymous sign-in failed:', e);
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
  
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log('Auth redirect success:', result.user.email);
      return result.user;
    }
  } catch (e) {
    console.warn('Auth redirect error:', e);
    
    // If account already exists, we must sign in directly instead of linking
    if (e.code === 'auth/credential-already-in-use') {
      console.log('Account exists — re-triggering redirect for sign-in...');
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
      return null;
    }
    
    authError = mapAuthError(e);
    return null;
  }
  
  return null;
}

export async function upgradeToGoogle() {
  if (!auth || !auth.currentUser) return null;
  const provider = new GoogleAuthProvider();
  clearAuthError();
  
  try {
    // Start redirect flow to link account
    await linkWithRedirect(auth.currentUser, provider);
  } catch (e) {
    console.warn('Redirect trigger failed:', e);
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
