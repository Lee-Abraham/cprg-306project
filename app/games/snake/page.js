'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { addRecentGame } from '../../components/AddGame';

const CELL_SIZE = 20; 
const WIDTH = 20; 
const HEIGHT = 20; 
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};

export default function SnakeGame() {
  const router = useRouter();
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState(DIRECTIONS.ArrowRight);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const moveRef = useRef(dir);
  const loggedRef = useRef(false); // prevent multiple logging

  useEffect(() => {
    moveRef.current = dir;
  }, [dir]);

  const spawnFood = (snakeCells) => {
    let x, y;
    do {
      x = Math.floor(Math.random() * WIDTH);
      y = Math.floor(Math.random() * HEIGHT);
    } while (snakeCells.some(seg => seg.x === x && seg.y === y));
    setFood({ x, y });
  };

  const backHome = () => router.push('/screens/HomeScreen');

  const logSnakeGame = async () => {
    if (loggedRef.current) return; // prevent double logging
    loggedRef.current = true;
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      await addRecentGame(user.uid, {
        name: 'Snake',
        img: '/assets/snakeAssets/snake.gif',
        score: score
      });
    } catch (err) {
      console.error('Failed to log recent game', err);
    }
  };

  // Handle keyboard
  useEffect(() => {
    const handleKey = (e) => {
      if (DIRECTIONS[e.key]) {
        const newDir = DIRECTIONS[e.key];
        if (snake.length > 1) {
          const head = snake[0];
          const neck = snake[1];
          if (head.x + newDir.x === neck.x && head.y + newDir.y === neck.y) return;
        }
        setDir(newDir);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [snake]);

  // Game loop
  useEffect(() => {
    if (gameOver) {
      logSnakeGame(); // log game when over
      return;
    }
    const interval = setInterval(() => {
      setSnake(prev => {
        const newHead = { x: prev[0].x + moveRef.current.x, y: prev[0].y + moveRef.current.y };

        // Check collisions
        if (
          newHead.x < 0 || newHead.x >= WIDTH ||
          newHead.y < 0 || newHead.y >= HEIGHT ||
          prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)
        ) {
          setGameOver(true);
          return prev;
        }

        let newSnake = [newHead, ...prev];

        // Eat food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 1);
          spawnFood([newHead, ...prev]);
          return [newHead, ...prev];
        } else {
          newSnake.pop();
          return newSnake;
        }
      });
    }, 120);
    return () => clearInterval(interval);
  }, [food, gameOver]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDir(DIRECTIONS.ArrowRight);
    setScore(0);
    setGameOver(false);
    loggedRef.current = false; // allow logging again
  };

  return (
    <div className="flex flex-col items-center pt-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Snake</h1>
      {/* Back Home Button */}
      <button onClick={backHome} className="absolute top-4 left-4 z-50">
        <img className='w-25' src="/assets/BackButton.gif" alt="Back Button" />
      </button>

      <div className="mb-4 text-xl">Score: {score}</div>

      {gameOver && (
        <div className="mb-4 text-red-500 text-xl font-bold">Game Over!</div>
      )}

      <div
        className="relative bg-gray-800"
        style={{ width: WIDTH * CELL_SIZE, height: HEIGHT * CELL_SIZE }}
      >
        {/* Food */}
        <div
          style={{
            position: 'absolute',
            width: CELL_SIZE,
            height: CELL_SIZE,
            backgroundColor: 'white',
            top: food.y * CELL_SIZE,
            left: food.x * CELL_SIZE
          }}
        />
        {/* Snake */}
        {snake.map((seg, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: 'purple',
              top: seg.y * CELL_SIZE,
              left: seg.x * CELL_SIZE
            }}
          />
        ))}
      </div>

      <button
        onClick={resetGame}
        className="mt-4 px-4 py-2 bg-purple-700 rounded hover:bg-purple-600"
      >
        Restart Game
      </button>
    </div>
  );
}
