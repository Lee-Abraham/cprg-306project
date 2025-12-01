
'use client';

import React, { useState } from 'react';

export default function LeaderboardsPage() {
    //Set Tic-Tac-Toe
    const ticTacToe = {
        src: '/assets/tictactoeassets/tictactoeCardLogo.gif',
        name: 'Tic-Tac-Toe',
        desc: 'Align three of the same symbol'
    }

    //Set Memory Match
    const gameMemoryMatch = {
        src: '/assets/memoryassets/memoryCardLogo.gif',
        name: 'Memory Match',
        desc: 'Select the matching cards'
    }

  // Example leaderboard data for two games
  const gameData = {
    game1: [
      { name: 'Lee', score: 150 },
      { name: 'Alex', score: 120 },
      { name: 'Sam', score: 100 },
    ],
    game2: [
      { name: 'Chris', score: 200 },
      { name: 'Taylor', score: 180 },
      { name: 'Jordan', score: 160 },
    ],
  };

  const [selectedGame, setSelectedGame] = useState('game1');

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-800 text-white p-6">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Leaderboards</h1>
        <button
          onClick={() => window.history.back()}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Back Home
        </button>
      </div>

      {/* Game Selector Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedGame('game1')}
          className={`px-4 py-2 rounded ${
            selectedGame === 'game1' ? 'bg-purple-600' : 'bg-gray-600'
          } hover:bg-purple-500`}
        >
          Tic-Tac-Toe
        </button>
        <button
          onClick={() => setSelectedGame('game2')}
          className={`px-4 py-2 rounded ${
            selectedGame === 'game2' ? 'bg-purple-600' : 'bg-gray-600'
          } hover:bg-purple-500`}
        >
          Game 2
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-gray-700 rounded-lg shadow-lg w-full max-w-4xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          {selectedGame === 'game1' ? 'Game 1 Leaderboard' : 'Game 2 Leaderboard'}
        </h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="pb-2">Rank</th>
              <th className="pb-2">Player</th>
              <th className="pb-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {gameData[selectedGame].map((player, index) => (
              <tr key={index} className="border-t border-gray-600">
                <td className="py-2">{index + 1}</td>
                <td>{player.name}</td>
                <td>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
