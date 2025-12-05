'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { addRecentGame } from '../../components/AddGame'; 

const ROWS = 20;
const COLS = 10;

const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  L: [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  J: [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
};

const getRandomShape = () => {
  const keys = Object.keys(SHAPES);
  return SHAPES[keys[Math.floor(Math.random() * keys.length)]];
};

export default function TetrisGame() {
  const router = useRouter();
  const [grid, setGrid] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [piece, setPiece] = useState(null); // Initialize on client to prevent SSR mismatch
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startGame, setStartGame] = useState(false);

  // Initialize the first piece on client
  useEffect(() => {
    if (!piece) setPiece({ shape: getRandomShape(), row: 0, col: 3 });
  }, [piece]);

  const backHome = () => router.push('/screens/HomeScreen');

  const collides = (newRow, newCol, newShape = piece.shape) => {
    for (let r = 0; r < newShape.length; r++) {
      for (let c = 0; c < newShape[r].length; c++) {
        if (newShape[r][c]) {
          const row = newRow + r;
          const col = newCol + c;
          if (row < 0 || row >= ROWS || col < 0 || col >= COLS || grid[row][col]) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const spawnNewPiece = () => {
    const newPiece = { shape: getRandomShape(), row: 0, col: 3 };
    if (collides(newPiece.row, newPiece.col, newPiece.shape)) {
      setGameOver(true);
      logTetrisGame(); 
      return;
    }
    setPiece(newPiece);
  };

  const getGridWithPiece = () => {
    const newGrid = grid.map(r => [...r]);
    piece.shape.forEach((r, rIndex) => {
      r.forEach((val, cIndex) => {
        if (val && piece.row + rIndex >= 0) {
          newGrid[piece.row + rIndex][piece.col + cIndex] = 1;
        }
      });
    });
    return newGrid;
  };

  const freezePiece = () => {
    const newGrid = getGridWithPiece();
    const filtered = newGrid.filter(row => row.some(cell => cell === 0));
    const cleared = ROWS - filtered.length;

    if (cleared > 0) {
      const points = [0, 100, 300, 500, 800];
      setScore(prev => prev + points[cleared]);
    }

    const finalGrid = [...Array.from({ length: cleared }, () => Array(COLS).fill(0)), ...filtered];
    setGrid(finalGrid);
    spawnNewPiece();
  };

  const move = dir => {
    if (gameOver || !startGame || !piece) return;
    const newCol = piece.col + dir;
    if (!collides(piece.row, newCol)) setPiece(p => ({ ...p, col: newCol }));
  };

  const rotate = () => {
    if (gameOver || !startGame || !piece) return;
    const rotated = piece.shape[0].map((_, i) => piece.shape.map(row => row[i]).reverse());
    if (!collides(piece.row, piece.col, rotated)) setPiece(p => ({ ...p, shape: rotated }));
  };

  // Auto drop
  useEffect(() => {
    if (!startGame || gameOver || !piece) return;

    const interval = setInterval(() => {
      if (!collides(piece.row + 1, piece.col)) {
        setPiece(p => ({ ...p, row: p.row + 1 }));
      } else {
        freezePiece();
      }
    }, 600);

    return () => clearInterval(interval);
  }, [piece, grid, startGame, gameOver]);

  // Key controls (no hard drop)
  useEffect(() => {
    const handleKey = e => {
      if (gameOver || !startGame || !piece) return;
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowUp") rotate();
      if (e.key === "ArrowDown") {
        if (!collides(piece.row + 1, piece.col)) setPiece(p => ({ ...p, row: p.row + 1 }));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [piece, gameOver, startGame]);

  const restart = () => {
    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    setScore(0);
    setGameOver(false);
    setPiece({ shape: getRandomShape(), row: 0, col: 3 });
    setStartGame(false);
  };

  const logTetrisGame = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      await addRecentGame(user.uid, {
        name: 'Tetris',
        img: '/assets/tetrisAssets/tetris.gif', 
      });
    } catch (err) {
      console.error('Failed to log recent game', err);
    }
  };

  if (!piece) return null; 

  const displayGrid = getGridWithPiece();
  const startMatch = () => {
    setStartGame(true);
    logTetrisGame(); 
  };

  return (
    <main className="flex flex-col bg-gray-900 text-white min-h-screen overflow-hidden items-center">
      {/* Header */}
      <div className="relative flex flex-row items-center justify-between mb-4 h-18 w-full px-4">
        <button className='z-10' onClick={backHome}>
          <img className='w-30 m-5 cursor-pointer' src='/assets/BackButton.gif' alt='Back Button' />
        </button>
        <h1 className="text-5xl font-bold lg:absolute lg:left-1/2 lg:-translate-x-1/2 text-2xl ml-auto text-purple-400">Tetris</h1>
      </div>

      {/* Score */}
      <div className='flex flex-col justify-center items-center mb-4'>
        <h1 className='text-2xl font-bold text-green-500'>Score: {score}</h1>
      </div>

      {/* Game Grid */}
      <div className='grow flex-col lg:w-[60%] w-full bg-gray-800 flex rounded-lg shadow-lg border-8 overflow-hidden items-center p-4'>
        <div
          className="grid rounded-lg border border-gray-700"
          style={{
            gridTemplateRows: `repeat(${ROWS}, 22px)`,
            gridTemplateColumns: `repeat(${COLS}, 22px)`
          }}
        >
          {displayGrid.map((row, rIndex) =>
            row.map((cell, cIndex) => (
              <div
                key={rIndex + "-" + cIndex}
                className={`w-[22px] h-[22px] border border-gray-800 ${
                  cell ? "bg-purple-700" : "bg-gray-950"
                }`}
              />
            ))
          )}
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
            <h1 className="text-3xl text-white font-bold mb-3">GAME OVER</h1>
            <button onClick={restart} className="px-5 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600">
              Restart
            </button>
          </div>
        )}

        {/* Start / End Buttons */}
        <div className="mt-4">
          {!startGame ? (
            <button className='cursor-pointer' onClick={startMatch}>
              <img className='w-30' src='/assets/StartButton.gif' alt='Start Button' />
            </button>
          ) : (
            <button className='cursor-pointer' onClick={restart}>
              <img className='w-30' src='/assets/EndButton.gif' alt='End Button' />
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 text-gray-400 text-sm">
        Use ← → ↓ ↑ to move / rotate
      </p>
    </main>
  );
}
