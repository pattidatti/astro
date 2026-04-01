import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase.js';
import { gameState } from './game/GameState.js';

function saveDocRef(uid) {
  return doc(db, 'saves', uid, 'state', 'current');
}

export async function saveToFirestore(uid) {
  if (!isFirebaseConfigured() || !db || !uid) return;
  try {
    const data = gameState.serialize();
    await setDoc(saveDocRef(uid), data);
  } catch (e) {
    console.warn('Firestore save failed:', e);
  }
}

export async function loadFromFirestore(uid) {
  if (!isFirebaseConfigured() || !db || !uid) return null;
  try {
    const snap = await getDoc(saveDocRef(uid));
    if (snap.exists()) return snap.data();
  } catch (e) {
    console.warn('Firestore load failed:', e);
  }
  return null;
}

let cloudSaveInterval = null;

export function startCloudSync(uid) {
  if (!uid) return;
  if (cloudSaveInterval) clearInterval(cloudSaveInterval);
  cloudSaveInterval = setInterval(() => saveToFirestore(uid), 30000);

  // Save on tab close
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveToFirestore(uid);
  });
}

/**
 * Compare local and cloud saves, take the best one.
 * Strategy: prefer the one with the most total ore across all planet silos.
 * Falls back to most recent timestamp.
 */
export function resolveSaveConflict(local, cloud) {
  if (!local && !cloud) return null;
  if (!local) return cloud;
  if (!cloud) return local;

  const totalOre = (save) => {
    if (!save.planetState) return save.ore || 0; // v1 save fallback
    return Object.values(save.planetState).reduce((sum, ps) => sum + (ps.silos?.ore?.amount || 0), 0);
  };

  const localOre = totalOre(local);
  const cloudOre = totalOre(cloud);

  if (localOre > cloudOre) return local;
  if (cloudOre > localOre) return cloud;

  // Tie-break by timestamp
  return (local.lastSaved || 0) >= (cloud.lastSaved || 0) ? local : cloud;
}
