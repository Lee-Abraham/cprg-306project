import React from 'react'
import GameCard from '../../components/GameCard'

export default function HomeScreen() {

    const gameMemoryMatch = {
        src: '/assets/memoryassets/memoryCardLogo.gif',
        name: 'Memory Match',
        desc: 'Pick the correct card that is matching'
    }

    return (
        <main className="flex flex-col bg-gray-600 text-black min-h-screen">
            {/* Header*/}
            <div className='justify-center items-center hidden lg:flex flex-col bg-gray-400 w-full text-white p-8 mb-10"'>
                <div>
                    <img alt="profile Icon" />
                </div>
            </div>

            {/* Body */}
            <div className='grow flex flex-col lg:flex-row items-center justify-center space-y-5 lg:space-y-0 lg:space-x-5'>
                <GameCard className='p-5' img={gameMemoryMatch} />
            </div>

            {/*Footer */}
            <div className='bg-gray-400 text-white p-4 text-center w-full'>
            </div> 
        </main>
    );
}