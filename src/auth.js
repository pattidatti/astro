import { signInAnonymously, signInWithPopup, GoogleAuthProvider, linkWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase.js';

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

export async function upgradeToGoogle() {
  if (!auth || !auth.currentUser) return null;
  const provider = new GoogleAuthProvider();
  try {
    // Try to link anonymous account to Google
    const result = await linkWithPopup(auth.currentUser, provider);
    return result.user;
  } catch (e) {
    if (e.code === 'auth/credential-already-in-use') {
      // Account already exists — sign in directly
      try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
      } catch (e2) {
        console.warn('Google sign-in failed:', e2);
        return null;
      }
    }
    console.warn('Account linking failed:', e);
    return null;
  }
}
