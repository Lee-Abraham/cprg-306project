"use client";

import React, { useState, Fragment, useEffect } from 'react';
import {useRouter} from 'next/navigation';

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
    const [seconds, setSeconds] = useState(60);

    //Game Started
    const [start, setStart]  = useState(false)

    //-----------------------------------------------------------------------------//
    //Functions

    //Renders the cell of our tic tac toe game
    const renderCell = (row, col) => {
        return (
            <button
                disabled={loading || status !== "ongoing"}
                onClick={() => cellClick(row,col)}
                className="w-24 lg:w-48 h-24 lg:h-48 bg-blue-300 border-2 border-black flex font-bold"
            >   
            
                {board[row][col] === "X" && <img src='/assets/tictactoeassets/X.gif'/>}
                {board[row][col] === "O" && <img src='/assets/tictactoeassets/O.gif'/>}
            </button>
        )
    }

    //Handles when one of the cell is pressed
    const cellClick = (row, col) => {
        if (board[row][col] === "" && currentPlayer ==="X" && status === "ongoing" && start) {
            board[row][col] = "X";
            setBoard([...board])
            setCurrentPlayer("O")
        }
        else if (board[row][col] === "" && currentPlayer ==="O" && status === "ongoing" && start) {
            board[row][col] = "O";
            setBoard([...board])
            setCurrentPlayer("X")
        }
    }

    //Handles game ends
    const endGame  = () => {
        if (status === "ongoing") return;
        const score = calculateScore();

        //If score is bellow zero.
        if (score < 0) {
        const score = 0;
        router.push(`/screens/ScorePage?score=${score}`);
        return;
        }
        router.push(`/screens/ScorePage?score=${score}`);
    };

    //Handles end button
    const endButton  = ()  => {
        setStatus('ended');
        endGame
    }

    //Handles score calculation
    const calculateScore = () => {

        return seconds;
    }

      //Handles match start
    const startMatch = () => {
        setStart(true);
    };

    //Handles timer and end of game when timer hit 0
    useEffect(() => {

        let interval;

        if (seconds === 0) {
        setStatus('ended');
        endGame
        }

        if (currentPlayer === "X" && status === "ongoing" && start) {
            interval = setInterval(
                () => {
                    setSeconds(prev => prev - 1);
                }, 1000
            );
        }
        

        return () => clearInterval(interval);
    }, [currentPlayer][status]);
    return (
        <main className="flex flex-col bg-gray-600 text-black min-h-screen overflow-hidden items-center">
            {/* Header */}
            <div className="relative flex flex-row items-center justify-between text-white mb-4 h-18 w-full px-4">
                <button className='z-10' onClick={backHome}>
                <img className='w-30 m-5 cursor-pointer' src='/assets/BackButton.gif' alt='Back Button' />
                </button>
                <h1 className="lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 ml-auto text-right lg:text-5xl text-2xl font-bold">Tic-Tac-Toe</h1>
            </div>

            <div className='grow lg:w-[60%] w-full bg-purple-600 rounded-lg shadow-lg border-8 overflow-hidden text-center justify-center items-center'>
                <div className='flex flex-col justify-center bg-green-200  items-center'>
                    <img className='w-20' src="/assets/GameTimer.gif" alt="Game Timer" />
                    <p className='lg:text-7xl text-3xl'>
                        {seconds}
                    </p>
                </div>
                <div
                className="bg-white grid grid-cols-3 justify-center items-center lg:ml-68 lg:w-xl w-72"
                style={{
                    backgroundImage: "url('/assets/tictactoeassets/board-bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
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