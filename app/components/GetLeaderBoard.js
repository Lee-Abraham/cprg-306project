

import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { dbf } from '@/lib/firebase';

export async function getTop10Players() {
  try {
    const playersCol = collection(dbf, 'LeaderBoardData', 'global', 'players');

    // Primary: WIN desc, then LOSE asc, then DRAW asc
    const q = query(
      playersCol,
      orderBy('score', 'desc'),
      orderBy('WIN', 'desc'),
      orderBy('LOSE', 'asc'),
      orderBy('DRAW', 'asc'),
      limit(10)
    );

    const snap = await getDocs(q);
    const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    console.log('[getTop10Players] rows:', rows);
    return rows;
  } catch (e) {
    console.error('[getTop10Players] error:', e);
    throw e;
  }
}



