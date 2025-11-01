import React from 'react';

export function ticTacWin(board, player) {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (board[i].every(cell => cell === player)) {
      return true;
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    if ([board[0][i], board[1][i], board[2][i]].every(cell => cell === player)) {
      return true;
    }
  }

  // Check diagonals
  if ([board[0][0], board[1][1], board[2][2]].every(cell => cell === player)) {
    return true;
  }

  if ([board[0][2], board[1][1], board[2][0]].every(cell => cell === player)) {
    return true;
  }

  // No win found
  return false;
}