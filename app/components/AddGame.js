'use client';

import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { dbf } from '@/lib/firebase';

/**
 * Add the game to the user's recentGames.
 * - Prepends the new game
 * - De-duplicates by name
 * - Limits list to 5 items
 */
export async function addRecentGame(uid, game) {
  if (!uid) throw new Error('addRecentGame: missing uid');
  if (!game?.name || !game?.img) throw new Error('addRecentGame: invalid game');

  const userRef = doc(dbf, 'users', uid);
  const snap = await getDoc(userRef);

  const playedAt = Date.now();
  const newEntry = { ...game, playedAt };

  if (!snap.exists()) {
    // Create doc if missing
    await setDoc(userRef, { recentGames: [newEntry] }, { merge: true });
    return;
  }

  const data = snap.data() || {};
  const current = Array.isArray(data.recentGames) ? data.recentGames : [];

  // De-duplicate by name, keep newest first
  const filtered = current.filter((g) => g.name !== newEntry.name);

  // Prepend and cap to 5
  const updated = [newEntry, ...filtered].slice(0, 4);

  await updateDoc(userRef, { recentGames: updated });
}

