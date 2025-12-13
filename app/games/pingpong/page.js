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
  const aiSpeed = 1.5;

  const backHome = () => router.push('/screens/HomeScreen');

  const [ball, setBall] = useState({ x: 200, y: 150, dx: 3, dy: 3, radius: 10 });
  const [paddle1, setPaddle1] = useState({ y: 120, width: 10, height: 60 });
  const [paddle2, setPaddle2] = useState({ y: 120, width: 10, height: 60 });
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState(null);

  // Log game
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

  const restartGame = () => {
    setBall({ x: 200, y: 150, dx: 3, dy: 3, radius: 10 });
    setPaddle1({ y: 120, width: 10, height: 60 });
    setPaddle2({ y: 120, width: 10, height: 60 });
    setScore({ player: 0, ai: 0 });
    setWinner(null);
    setGameStarted(false);
  };

  // Draw game
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

  // Update logic
  const update = () => {
    if (!gameStarted || winner) return;

    let newBall = { ...ball };
    newBall.x += newBall.dx;
    newBall.y += newBall.dy;

    // Wall collision
    if (newBall.y + newBall.radius > canvasHeight || newBall.y - newBall.radius < 0) {
      newBall.dy *= -1;
    }

    // Paddle collision
    if (
      newBall.x - newBall.radius < paddle1.width &&
      newBall.y > paddle1.y &&
      newBall.y < paddle1.y + paddle1.height
    ) newBall.dx *= -1;

    if (
      newBall.x + newBall.radius > canvasWidth - paddle2.width &&
      newBall.y > paddle2.y &&
      newBall.y < paddle2.y + paddle2.height
    ) newBall.dx *= -1;

    // Scoring
    if (newBall.x < 0) {
      setScore(prev => {
        const aiScore = prev.ai + 1;
        if (aiScore >= 5) {
          setWinner("AI");
          setGameStarted(false);
        }
        return { ...prev, ai: aiScore };
      });
      newBall = { x: 200, y: 150, dx: 3, dy: 3, radius: 10 };
    }

    if (newBall.x > canvasWidth) {
      setScore(prev => {
        const playerScore = prev.player + 1;
        if (playerScore >= 5) {
          setWinner("Player");
          setGameStarted(false);
        }
        return { ...prev, player: playerScore };
      });
      newBall = { x: 200, y: 150, dx: -3, dy: 3, radius: 10 };
    }

    setBall(newBall);

    // AI paddle
    let newPaddle2 = { ...paddle2 };
    if (newBall.y > newPaddle2.y + newPaddle2.height / 2) newPaddle2.y += aiSpeed;
    if (newBall.y < newPaddle2.y + newPaddle2.height / 2) newPaddle2.y -= aiSpeed;
    newPaddle2.y = Math.max(0, Math.min(canvasHeight - newPaddle2.height, newPaddle2.y));
    setPaddle2(newPaddle2);
  };

  // Game loop
  useEffect(() => {
    if (!gameStarted) return;

    const ctx = canvasRef.current.getContext('2d');
    const loop = setInterval(() => {
      update();
      draw(ctx);
    }, 20);

    return () => clearInterval(loop);
  }, [ball, paddle1, paddle2, score, gameStarted, winner]);

  // Player controls
  useEffect(() => {
    const handleKey = (e) => {
      if (!gameStarted || winner) return;
      setPaddle1(prev => {
        let y = prev.y;
        if (e.key === 'ArrowUp') y = Math.max(0, y - paddleSpeed);
        if (e.key === 'ArrowDown') y = Math.min(canvasHeight - prev.height, y + paddleSpeed);
        return { ...prev, y };
      });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameStarted, winner]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Ping Pong</h1>

      <button onClick={backHome} className="absolute top-4 left-4 z-50">
        <img className="w-25" src="/assets/BackButton.gif" alt="Back Button" />
      </button>

      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="border border-white"
      />

      <p className="mt-2">Use ↑ and ↓ to move the paddle</p>

      {!gameStarted && !winner && (
        <button
          onClick={startGame}
          className="mt-4 px-4 py-2 bg-green-500 rounded hover:bg-green-600"
        >
          Start Game
        </button>
      )}

      {winner && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold mb-4">{winner} Wins! 🏆</h2>
          <button
            onClick={restartGame}
            className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
}
