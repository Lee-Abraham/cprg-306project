'use client';
import React from 'react'
import GameCard from '../../components/GameCard'
import {useRouter} from 'next/navigation'
import { useState } from 'react';

export default function HomeScreen() {
    const router =  useRouter();
    
    const [menu, setMenu] = useState(false);

    const gameMemoryMatch = {
        src: '/assets/memoryassets/memoryCardLogo.gif',
        name: 'Memory Match',
        desc: 'Select the matching cards'
    }

    const ticTacToe = {
        src: '/assets/tictactoeassets/tictactoeCardLogo.gif',
        name: 'Tic-Tac-Toe',
        desc: 'Align three of the same symbol'
    }

    const profilePage = () => {
        router.push('/screens/ProfileScreen')
    }

    //Handles press on menu
    const showMenu = () => {
        if (!menu) {
            setMenu(true);
        }
        else if (menu) {
            setMenu(false)
        }
    }

    return (
        <main className="flex flex-col bg-gray-600 text-black min-h-screen overflow-hidden">
            {/* Header*/}
            <div className="shadow-lg bg-gray-400 flex-row items-center w-full text-white px-4 h-24 relative">
                <h1 className="mt-5 absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:text-5xl text-3xl font-bold">My Game</h1>
                <button onClick={showMenu} className='bg-green-400 absolute right-1 m-5'>
                    <img alt='menu button'/> Hello
                </button>
            </div>
            {!menu ? (
                <div className='hidden'>

                </div>
            ) : (
                <div className='shadow-2xl flex-col z-20 justify-center items-center absolute right-0 bg-gray-500 min-h-full lg:w-[20%] w-[70%]'>
                    <button className='text-2xl pt-5 cursor-pointer ml-5 mt-5 z-10' onClick={showMenu} >X</button>
                    <img onClick={profilePage} className=" cursor-pointer w-20 absolute left-1/2 transform -translate-x-1/2 rounded-lg shadow-2xl" src='/assets/Profile.gif' alt="profile Icon" />
                </div>)}


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