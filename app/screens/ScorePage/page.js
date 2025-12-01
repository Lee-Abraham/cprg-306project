
'use client';

export const dynamic = 'force-dynamic'; // Opt out of static prerender for this page
// Alternatively: export const revalidate = 0;

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ScorePageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read query params
  const score = searchParams.get('score');
  const winlose = searchParams.get('winner');
  const draw = searchParams.get('result'); 

  // Derived booleans
  const isScore = !!(score && score.trim() !== '');
  const isWinLose = !!(winlose && winlose.trim() !== '');
  const isDraw = !!(draw && draw.trim() !== '');

  const onHomePagePress = () => {
    router.push('/screens/HomeScreen');
  };

  return (
    <main className="flex flex-col justify-center items-center bg-gray-600 min-h-screen overflow-hidden">
      {/* Header */}
      <div className="bg-gray-400 w-full h-20 flex items-center">
        <button
          onClick={onHomePagePress}
          className="m-5 px-6 py-4 rounded bg-purple-500 text-white hover:bg-gray-800"
          aria-label="Go to Home Page"
        >
          Home
        </button>
      </div>

      {/* Body */}
      <div className="grow border-4 flex flex-col rounded-lg m-10 justify-center items-center w-[60%] bg-purple-600">
        {/* Player score / result */}
        <div className="flex m-5 bg-yellow-500/80 justify-center items-center rounded-lg shadow-2xl w-[40%] lg:h-30 p-6">
          {isScore && (
            <div className="text-5xl text-center">
              Score:
              <br />
              {score}
            </div>
          )}
          {isWinLose && <div className="text-5xl text-center">{winlose}</div>}
          {isDraw && <div className="text-5xl text-center">{draw}</div>}
        </div>

        {/* List of other players' scores */}
        <div className="flex-1 m-5 bg-yellow-500/80 flex justify-center items-center text-center rounded-lg shadow-2xl w-[80%] lg:h-30 p-6">
          <span className="text-white text-xl opacity-80">Leaderboard coming soon…</span>
        </div>
      </div>

      {/* Footer */}
      <div className="h-20 w-full bg-gray-400 text-center flex items-center justify-center">
        <h1 className="mt-0">@Author: Lee Valera</h1>
      </div>
    </main>
  );
}


export default function ScorePage() {
  return (
    <Suspense
      fallback={
        <main className="flex items-center justify-center min-h-screen bg-gray-600">
          <div className="text-white">Loading result…</div>
        </main>
      }
    >
      <ScorePageInner />
    </Suspense>
  );
}

