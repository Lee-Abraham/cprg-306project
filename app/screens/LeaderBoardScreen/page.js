
'use client';

import React from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { dbf } from '@/lib/firebase';

export default function Leaderboard() {
  const [players, setPlayers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const router = useRouter();

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const col = collection(dbf, 'LeaderBoardData', 'global', 'players');
        const snap = await getDocs(col);
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (mounted) setPlayers(rows);
      } catch (e) {
        console.error('Failed to load leaderboard:', e);
        if (mounted) setError(e?.message ?? 'Unknown error');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <p className="text-center text-white py-10">Loading Leaderboard…</p>;
  if (error) return <p className="text-center text-red-400 py-10">Error: {error}</p>;
  if (!players.length) return <p className="text-center text-gray-300 py-10">No players yet!</p>;

  // Sort lists
  const memoryTop10 = [...players]
    .sort((a, b) => Number(b.score ?? 0) - Number(a.score ?? 0))
    .slice(0, 10);

  const tttTopWinners = [...players]
    .sort((a, b) => {
      const aw = Number(a.WIN ?? 0), bw = Number(b.WIN ?? 0);
      if (bw !== aw) return bw - aw;
      const al = Number(a.LOSE ?? 0), bl = Number(b.LOSE ?? 0);
      if (al !== bl) return al - bl;
      const ad = Number(a.DRAW ?? 0), bd = Number(b.DRAW ?? 0);
      if (ad !== bd) return ad - bd;
      const as = Number(a.score ?? 0), bs = Number(b.score ?? 0);
      return bs - as;
    })
    .slice(0, 10);

  const onHomePagePress = () => {
    router.push('/screens/HomeScreen');
  };

  return (
    <div className="min-h-screen bg-gray-800 py-10 px-4">
        <button
          onClick={onHomePagePress}
          className="m-5 px-6 py-4 rounded bg-purple-500 text-white hover:bg-gray-800"
          aria-label="Go to Home Page"
        >
          Home
        </button>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Memory Game Top 10 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Memory Game Top 10</h2>
          <ol className="space-y-2">
            {memoryTop10.map((p, idx) => (
              <li
                key={p.id}
                className="flex justify-between items-center bg-gray-100 rounded px-3 py-2"
              >
                <span className="font-medium text-gray-700">
                  {idx + 1}. {p.userName ?? 'Unknown'}
                </span>
                <span className="text-indigo-600 font-semibold">{p.score ?? 0}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Tic-Tac-Toe Top Winners */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Tic-Tac-Toe Top Winners</h2>
          <ol className="space-y-2">
            {tttTopWinners.map((p, idx) => (
              <li
                key={p.id}
                className="flex justify-between items-center bg-gray-100 rounded px-3 py-2"
              >
                <span className="font-medium text-gray-700">
                  {idx + 1}. {p.userName ?? 'Unknown'}
                </span>
                <div className="flex gap-3 text-sm">
                  <span className="text-green-600 font-semibold">WIN: {p.WIN ?? 0}</span>
                  <span className="text-blue-600">DRAW: {p.DRAW ?? 0}</span>
                  <span className="text-red-600">LOSE: {p.LOSE ?? 0}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
