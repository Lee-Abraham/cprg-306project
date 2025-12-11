'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { addRecentGame } from '../../components/AddGame';

export default function PingPong() {
  const router = useRouter();
  const canvasRef = useRef(null);
  const canvasWidth = 400;
  const canvasHeight = 300;
  const paddleSpeed = 40;
  const aiSpeed = 1.5; // slower AI

  const backHome = () => router.push('/screens/HomeScreen');

  const [ball, setBall] = useState({ x: 200, y: 150, dx: 3, dy: 3, radius: 10 });
  const [paddle1, setPaddle1] = useState({ y: 120, width: 10, height: 60 });
  const [paddle2, setPaddle2] = useState({ y: 120, width: 10, height: 60 });
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [gameStarted, setGameStarted] = useState(false);

  // Log the game as a recent game
  const logPingPong = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      await addRecentGame(user.uid, {
        name: 'Ping Pong',
        img: '/assets/pingpongAssets/pingpong.gif',
      });
    } catch (err) {
      console.error('Failed to log recent game', err);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    logPingPong();
  };

  // Draw everything
  const draw = (ctx) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();

    // Paddles
    ctx.fillStyle = 'purple';
    ctx.fillRect(0, paddle1.y, paddle1.width, paddle1.height);
    ctx.fillStyle = 'red';
    ctx.fillRect(canvasWidth - paddle2.width, paddle2.y, paddle2.width, paddle2.height);

    // Score
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Player: ${score.player}`, 20, 20);
    ctx.fillText(`AI: ${score.ai}`, canvasWidth - 60, 20);
  };

  // Update game state
  const update = () => {
    let newBall = { ...ball };
    newBall.x += newBall.dx;
    newBall.y += newBall.dy;

    // Bounce off walls
    if (newBall.y + newBall.radius > canvasHeight || newBall.y - newBall.radius < 0) {
      newBall.dy = -newBall.dy;
    }

    // Bounce off paddles
    if (
      newBall.x - newBall.radius < paddle1.width &&
      newBall.y > paddle1.y &&
      newBall.y < paddle1.y + paddle1.height
    ) newBall.dx = -newBall.dx;

    if (
      newBall.x + newBall.radius > canvasWidth - paddle2.width &&
      newBall.y > paddle2.y &&
      newBall.y < paddle2.y + paddle2.height
    ) newBall.dx = -newBall.dx;

    // Score
    if (newBall.x < 0) {
      setScore(prev => ({ ...prev, ai: prev.ai + 1 }));
      newBall = { x: canvasWidth / 2, y: canvasHeight / 2, dx: 3, dy: 3, radius: 10 };
    }

    if (newBall.x > canvasWidth) {
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
      newBall = { x: canvasWidth / 2, y: canvasHeight / 2, dx: -3, dy: 3, radius: 10 };
    }

    setBall(newBall);

    // AI paddle movement
    let newPaddle2 = { ...paddle2 };
    if (newBall.y > newPaddle2.y + newPaddle2.height / 2) newPaddle2.y += aiSpeed;
    if (newBall.y < newPaddle2.y + newPaddle2.height / 2) newPaddle2.y -= aiSpeed;
    newPaddle2.y = Math.max(0, Math.min(canvasHeight - newPaddle2.height, newPaddle2.y));
    setPaddle2(newPaddle2);
  };

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const gameLoop = setInterval(() => {
      update();
      draw(ctx);
    }, 20);

    return () => clearInterval(gameLoop);
  }, [ball, paddle1, paddle2, score, gameStarted]);

  // Player paddle control
  const handleKeyDown = (e) => {
    let newPaddle = { ...paddle1 };
    if (e.key === 'ArrowUp') newPaddle.y = Math.max(0, newPaddle.y - paddleSpeed);
    if (e.key === 'ArrowDown') newPaddle.y = Math.min(canvasHeight - paddle1.height, newPaddle.y + paddleSpeed);
    setPaddle1(newPaddle);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paddle1]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Ping Pong Game</h1>

      {/* Back Home */}
      <button onClick={backHome} className="absolute top-4 left-4 z-50">
        <img className="w-25" src="/assets/BackButton.gif" alt="Back Button" />
      </button>

      {/* Canvas */}
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} className="border border-white" />

      {/* Instructions */}
      <p className="mt-2">Use ↑ and ↓ to move the blue paddle</p>

      {/* Score */}
      <div className="mt-4 text-xl">Score: Player {score.player} - AI {score.ai}</div>

      {/* Start Button */}
      {!gameStarted && (
        <button
          onClick={startGame}
          className="mt-4 px-4 py-2 bg-green-500 rounded hover:bg-green-600"
        >
          Start Game
        </button>
      )}
    </div>
  );
}
