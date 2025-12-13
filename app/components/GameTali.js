
'use client';

import {
  doc,
  runTransaction,
  increment,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { dbf } from '@/lib/firebase';

/**
 * Updates the user's GameTali: Individual
 * - Memory Match: write only if new score is higher than current.
 * - Tic-Tac-Toe: increment WIN / LOSE / DRAW counters.
 *
 * Firestore path: users/{uid}
 * Field schema:
 * {
 *   gameTali: {
 *     memoryMatch: { score: number },
 *     TicTacToe: { WIN: number, LOSE: number, DRAW: number }
 *   }
 * }
 *
 * @param {string} uid - Firebase Auth user ID
 * @param {{ game: 'Memory Match', score: number } |
 *         { game: 'Tic-Tac-Toe', result: 'WIN'|'LOSE'|'DRAW' }} tali
 */
export async function gameTali(uid, tali) {
  if (!uid) throw new Error('gameTali: missing uid');
  if (!tali?.game) throw new Error('gameTali: invalid input');

  const userRef = doc(dbf, 'users', uid);

  await runTransaction(dbf, async (tx) => {
    const snap = await tx.get(userRef);

    // MEMORY MATCH: Update only if higher
    if (tali.game === 'Memory Match') {
      const newScore = Number(tali.score);
      if (!Number.isFinite(newScore)) {
        throw new Error('gameTali: Memory Match requires a numeric score');
      }

      // Current score defaults to 0 if missing
      const currentScoreRaw =
        (snap.exists() ? snap.get('gameTali.memoryMatch.score') : undefined) ?? 0;
      const currentScore = Number(currentScoreRaw) || 0;

      if (newScore > currentScore) {
        tx.set(
          userRef,
          { gameTali: { memoryMatch: { score: newScore } } },
          { merge: true }
        );
      }
      return;
    }

    // TIC-TAC-TOE: Increment counters atomically
    if (tali.game === 'Tic-Tac-Toe') {
      const result = String(tali.result || '').toUpperCase();
      if (!['WIN', 'LOSE', 'DRAW'].includes(result)) {
        throw new Error('gameTali: Tic-Tac-Toe requires result = WIN | LOSE | DRAW');
      }
      const fieldPath = `gameTali.TicTacToe.${result}`;
      tx.update(userRef, { [fieldPath]: increment(1) });
      return;
    }

    throw new Error(`gameTali: unsupported game "${tali.game}"`);
  });
}



//Updates global score/game tali data
export async function globalLeader(user, userName, tali) {
  if (!user) throw new Error('Error adding to Global Leaderboard: Missing uid');
  if(!userName) throw new Error('Error adding to Global Leaderboard: Missing user name');
  if (!tali) throw new Error('Error adding to Global Leaderboard: Missing game tali');

  //Get reference
  const playerRef = doc(dbf, 'LeaderBoardData', 'global', 'players', user);

  //Runs the databse saving
  await runTransaction(dbf, async (tx) => {
    const snap = await tx.get(playerRef);

    //If its memory match
    if (tali.game === 'Memory Match') {
      const newScore = Number(tali.score);
      if (!Number.isFinite(newScore)) {
        throw new Error('Error adding score to Memory Match: Score requires numeric score')
      }

      //Get the top score as raw text
      const currentBestRaw = (snap.exists() ? snap.get('score') : undefined) ?? 0 ;
      //Convert text score to numeric
      const currentBest = Number(currentBestRaw) || 0;

      if (newScore > currentBest) {
        tx.set (
          playerRef, {
            userName,
            score: newScore,
            updatedAt: serverTimestamp(),
          },
          {merge: true}
        );
      } else {
        tx.set (playerRef, {
          userName,
          updatedAt: serverTimestamp(),
          },
          {merge: true}
        );
      }
      return;
    }

    //IF its tic-tac-toe
    if (tali.game === 'Tic-Tac-Toe') {
      //Get result in uppercase
      const result = String(tali.result).toUpperCase();

      //Error handling if result is not of this three
      if (!['WIN', 'LOSE', 'DRAW'].includes(result)) {
        throw new Error ('Error adding Tic-Tac-Toe game result');
      }

      tx.set(
        playerRef, {
          userName,
          [result]: increment(1),
          updatedAt: serverTimestamp(),
        },
        {merge: true}
      );
      return;
    }
    throw new Error('Error adding game: Unsupported game');
  });
}