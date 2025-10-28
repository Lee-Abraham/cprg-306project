'use client';
import React from 'react'
import GameCard from '../../components/GameCard'
import {useRouter} from 'next/navigation'

export default function HomeScreen() {
      const router =  useRouter();

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

    const profilePage = () => {
        router.push('/screens/ProfileScreen')
    }

    return (
        <main className="flex flex-col bg-gray-600 text-black min-w-screen min-h-screen">
            {/* Header*/}
            <div className="shadow-lg bg-gray-400 hidden lg:flex flex-row items-center w-full text-white px-4 h-40 relative">
                <img onClick={profilePage} className="cursor-pointer w-34 rounded-lg shadow-2xl" src='/assets/Profile.gif' alt="profile Icon" />
                <h1 className="absolute left-1/2 transform -translate-x-1/2 text-5xl font-bold">My Game</h1>

            </div>

            {/* Body */}
            <div className='grow flex flex-col lg:flex-row items-center justify-center space-y-5 lg:space-y-0 lg:space-x-5'>
                <div className='grid grid-cols-1 lg:grid-cols-4'>
                    <GameCard img={gameMemoryMatch} />
                    <GameCard img={ticTacToe} />
                </div>
            </div>

            {/*Footer */}
            <div className='bg-gray-400 shadow-lg text-white p-4 text-center w-full'>
                <h1>@Author: Lee Valera, Aileen Pearl, Kevin Yabut </h1>
            </div> 
        </main>
    );
}