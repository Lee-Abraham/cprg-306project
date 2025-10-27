'use client';
import React from 'react'
import GameCard from '../../components/GameCard'

export default function HomeScreen() {

    const gameMemoryMatch = {
        src: '/assets/memoryassets/memoryCardLogo.gif',
        name: 'Memory Match',
        desc: 'Pick the correct card that is matching'
    }

    const ticTacToe = {
        src: null,
        name: 'Tic-Tac-Toe',
        desc: 'Align three of the same symbol'
    }

    return (
        <main className="flex flex-col bg-gray-600 text-black min-w-screen min-h-screen">
            {/* Header*/}
            <div className='justify-center items-center hidden lg:flex flex-col bg-gray-400 w-full text-white p-8 mb-10"'>
                <div>
                    <img alt="profile Icon" />
                </div>
            </div>

            {/* Body */}
            <div className='grow flex flex-col lg:flex-row items-center justify-center space-y-5 lg:space-y-0 lg:space-x-5'>
                <div className='grid grid-cols-2 lg:grid-cols-4'>
                    <GameCard img={gameMemoryMatch} />
                    <GameCard img={ticTacToe} />
                </div>
            </div>

            {/*Footer */}
            <div className='bg-gray-400 text-white p-4 text-center w-full'>
            </div> 
        </main>
    );
}