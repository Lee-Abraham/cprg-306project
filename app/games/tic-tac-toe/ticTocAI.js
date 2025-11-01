import React from 'react';

export function bestMove(board) {
  const findMove = (symbol) => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i].filter(cell => cell === symbol).length === 2 && board[i].includes("")) {
        return [i, board[i].indexOf("")];
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      const col = [board[0][i], board[1][i], board[2][i]];
      if (col.filter(cell => cell === symbol).length === 2 && col.includes("")) {
        return [col.indexOf(""), i];
      }
    }

    // Check diagonal 1
    const diag1 = [board[0][0], board[1][1], board[2][2]];
    if (diag1.filter(cell => cell === symbol).length === 2 && diag1.includes("")) {
      const idx = diag1.indexOf("");
      return [idx, idx];
    }

    // Check diagonal 2
    const diag2 = [board[0][2], board[1][1], board[2][0]];
    if (diag2.filter(cell => cell === symbol).length === 2 && diag2.includes("")) {
      const idx = diag2.indexOf("");
      return [idx, 2 - idx];
    }

    return null;
  };

  // Try to win
  let move = findMove("O");
  if (move) return move;

  // Try to block
  move = findMove("X");
  if (move) return move;

  // Pick random empty cell
  const emptyCells = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === "") {
        emptyCells.push([i, j]);
      }
    }
  }

  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}