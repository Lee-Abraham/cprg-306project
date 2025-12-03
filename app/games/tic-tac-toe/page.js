"use client";

import React, { useState, Fragment, useEffect } from 'react';
import {useRouter} from 'next/navigation';
import { ticTacWin } from './ticTacWin';
import {bestMove} from './ticTocAI'
import {auth} from '../../../lib/firebase';
import {addRecentGame} from '../../components/AddGame';

export default function ticTacToe() {

    //-----------------------------------------------------------------------------//
    //Navigation

    const router =  useRouter();

    //Handles back button
    const backHome = () => {
        router.push('/screens/HomeScreen');
    };

    //-----------------------------------------------------------------------------//
    //Constant

    //Array that states the board
    const [board, setBoard] = useState([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ]);

    //Player
    const [currentPlayer, setCurrentPlayer] = useState("X");

    //Status of game
    const [status, setStatus] = useState("ongoing");

    //Loading
    const [loading, setLoading] = useState(false);

    //Timer
    const [seconds, setSeconds] = useState(10);

    //Game Started
    const [start, setStart]  = useState(false);

    //Total  wins
    const [totalWin, setTotalWin] = useState(0);

    //Game data
    const game = {name: 'Tic-Tac-Toe', img: '/assets/tictactieassets/tictactoeCardLogo.gif'}
    //-----------------------------------------------------------------------------//
    //Functions

    //Renders the cell of our tic tac toe game
    const renderCell = (row, col) => {
        return (
            <button
                disabled={loading || status !== "ongoing"}
                onClick={() => cellClick(row,col)}
                className="lg:w-40 lg:h-40 h-20 w-20 bg-blue-300 border-2 border-black"
            >   
                {board[row][col] === "X" && <img src='/assets/tictactoeassets/X.gif'/>}
                {board[row][col] === "O" && <img src='/assets/tictactoeassets/O.gif'/>}
            </button>
        )
    }

    //Handles when one of the cell is pressed
    const cellClick = (row, col) => {
        if (board[row][col] === "" && currentPlayer ==="X" && status === "ongoing" && start) {
            const newBoard = [...board];
            newBoard[row][col] = "X";
            setBoard(newBoard)

            //Ends game
            if (ticTacWin(newBoard, "X")) {
                setStatus("ended");
                endGame("X");
            }
            else if (isDraw(newBoard)) {
                setStatus("ended");
                endGame("draw")
            }
            else {
                setCurrentPlayer("O")
            }
        }
    }

    //Handles game ends
    const endGame = (result) => {

        const user = auth.currentUser;
        addRecentGame(user.uid, game).catch(console.error);

        if (result === "draw") {
            router.push(`/screens/ScorePage?wins=${finalScore}&result=draw`);
        } else if (result === "X" || result === "O") {
            router.push(`/screens/ScorePage?wins=${finalScore}&winner=${result}`);
        } else {
            router.push(`/screens/ScorePage?wins=${finalScore}`);
        }
    };

    //Handles end button
    const endButton  = ()  => {
        setStatus('ended');
        endGame();
    }

      //Handles match start
    const startMatch = () => {
        setStart(true);
    };
    
    //Handles match draw
    const isDraw = (board) => {
        return board.flat().every(cell => cell  !== "");
    }

    //Handles timer and end of game when timer hit 0
    useEffect(() => {

            let interval;

            if (seconds === 0) {
                setStatus('ended');
                endGame("O");
            }

            if (currentPlayer === "X" && status === "ongoing" && start) {
                interval = setInterval(
                    () => {
                        setSeconds(prev => prev - 1);
                    }, 1000
                );
            }

        return () => clearInterval(interval);
    }, [currentPlayer, status, seconds, start]);

     //Handles opponent moves
        useEffect(() => {
        if (currentPlayer === "O" && status === "ongoing" && start) {
            const aiTimeout = setTimeout(() => {
            const [i, j] = bestMove(board) || [0, 0];
            const newBoard = [...board];
            newBoard[i][j] = "O";
            setBoard(newBoard);

            if (ticTacWin(newBoard, "O")) {
                setStatus('ended');
                endGame("O");  
            } else if (isDraw(newBoard)) {
                setStatus('ended');
                endGame("draw");
            } else {
                setCurrentPlayer("X");
            }
        }, 1000);

            return () => clearTimeout(aiTimeout);
        }
    }, [currentPlayer, board, status, start]);


    return (
        <main className="overflow-hidden min-h-screen flex flex-col bg-gray-600 text-black items-center">
            {/* Header */}
            <div className="relative flex flex-row items-center justify-between text-white mb-4 h-18 w-full px-4">
                <button className='z-10' onClick={backHome}>
                <img className='w-30 m-5 cursor-pointer' src='/assets/BackButton.gif' alt='Back Button' />
                </button>
                <h1 className="lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 ml-auto text-right lg:text-5xl text-2xl font-bold">Tic-Tac-Toe</h1>
            </div>

            <div className='grow lg:w-[60%] w-full bg-purple-600 rounded-lg shadow-lg border-8 text-center flex flex-col justify-center items-center'>
                <div className='flex flex-col justify-center  items-center'>
                    <img className='w-20' src="/assets/GameTimer.gif" alt="Game Timer" />
                    <p className='lg:text-7xl text-3xl'>
                        {seconds}
                    </p>
                </div>
                <div
                    className="bg-white grid grid-cols-3 m-10 lg:justify-center lg:items-center justify-start items-start"
                >
                {board.map((row, i) =>
                    row.map((_, j) => (
                    <Fragment key={`${i}-${j}`}>
                        {renderCell(i, j)}
                    </Fragment>
                    ))
                )}
                </div>
                {/*Button to start, replace with back to home screen button, and end button*/}
                <div>
                    {!start ? (            
                    <button className='cursor-pointer' onClick={() => startMatch()}>
                        <img className='w-30' src='/assets/StartButton.gif' alt='Start button' />
                    </button>) : (
                        <div>
                        <button className='cursor-pointer' onClick={endButton}>
                            <img className='w-30' src='/assets/EndButton.gif' alt='End Button' />
                        </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-400 w-full text-center text-white mt-4">
                <h1>@Author: Lee Valera</h1>
            </div>
        </main>
    );
}