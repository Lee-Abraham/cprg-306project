
'use client';

import React from 'react';

export default function ProfilePage() {
  // Example recent games data
  const recentGames = [
    { id: 1, name: 'Space Adventure', img: '/assets/game1.jpg' },
    { id: 2, name: 'Puzzle Quest', img: '/assets/game2.jpg' },
    { id: 3, name: 'Battle Arena', img: '/assets/game3.jpg' },
  ];

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-800 text-white p-6">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button
          onClick={() => window.history.back()}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Back Home
        </button>
      </div>

      {/* Profile Info */}
      <div className="bg-gray-700 rounded-lg p-6 shadow-lg w-full max-w-4xl flex flex-col items-center mb-8">
        /assets/Profile.gif
        <h2 className="text-2xl font-semibold">Lee Valera</h2>
        <p className="text-gray-300">Gamer | Level 10</p>
      </div>

      {/* Recent Games */}
      <div className="w-full max-w-4xl">
        <h3 className="text-xl font-semibold mb-4">Recently Played</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentGames.map((game) => (
            <div
              key={game.id}
              className="bg-gray-700 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform"
            >
              <img src={game.img} alt={game.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h4 className="text-lg font-semibold">{game.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
