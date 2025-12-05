'use client';
import React from 'react'
import GameCard from '../../components/GameCard'
import {useRouter} from 'next/navigation'
import { useState, useEffect } from 'react';
import {signOut} from 'firebase/auth';
import {auth} from '../../../lib/firebase'
import { IoLogIn, IoMenu } from 'react-icons/io5';
import { useUser } from '../../components/UserProvider';


export default function HomeScreen() {
    //Instance of useUser
    const {profile, loading} = useUser();
    
    useEffect(() => {
    console.log('loading:', loading, 'profile:', profile);
    }, [loading, profile]);

    //Navigation
    const router =  useRouter();
    //Check if user check menu
    const [menu, setMenu] = useState(false);
    //Check if user signed in
    const isSigned = !!auth.currentUser;

    //Set Memory Match
    const gameMemoryMatch = {
        src: '/assets/memoryassets/memoryCardLogo.gif',
        name: 'Memory Match',
        desc: 'Select the matching cards',
    };

    //Set Tic-Tac-Toe
    const ticTacToe = {
        src: '/assets/tictactoeassets/tictactoeCardLogo.gif',
        name: 'Tic-Tac-Toe',
        desc: 'Align three of the same symbol'
    };

    // Set Tetris
    const tetris = {
    src: '/assets/tetrisAssets/tetris.gif',
    name: 'Tetris',
    desc: 'Stack blocks to score'
    };

    // Set Wordle
    const wordle = {
    src: '/assets/wordleAssets/wordle.gif',
    name: 'Wordle',
    desc: 'Guess the 5-letter word',
    };

    // Set Snake
    const snake = {
    src: '/assets/snakeAssets/snake.gif', 
    name: 'Snake',
    desc: 'Eat food and grow'
    };

    // Set PingPong
    const pingpong = {
    src: '/assets/pingpongAssets/pingpong.gif', 
    name: 'PingPong',
    desc: 'Rally the ball back and forth'
    };



    //Go to profile page
    const profilePage = () => {
        if (!auth.currentUser) {
            alert('No user signed in');
            return;
        }
        router.push('/screens/ProfileScreen');
    }

    //Go to setting page
    const settingPage = () => {
        router.push('/screens/SettingScreen');
    }

    //Go to leaderboards
    const leaderboardPage = () => {
            if (!auth.currentUser) {
                alert('No user signed in');
                return;
            }
        router.push('/screens/LeaderBoardScreen')
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

    //Handles press to go back to log in
    const logIn = () => {
        // incase user is log in and sees this
        if (auth.currentUser) {
            return;
        }

        router.push('/screens/LogInScreen')
    }

    //Handles press on log out
    const logOut = async () => {
        try {
            if (!auth.currentUser) {
                alert('No user signed in');
                return;
            }
            await signOut(auth);
            router.push('/screens/LogInScreen');
        }
        catch(error) {
            console.error('Problem trying to log out: ', error)
        }
    }

    return (
        <main className="flex flex-col bg-gray-600 text-black min-h-screen overflow-hidden">
            {/* Header*/}
            <div className="shadow-lg bg-purple-700 flex-row items-center justify-center w-full text-white px-4 h-24 relative">
                <h1 className="mt-5 absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:text-5xl text-3xl font-bold">My Game</h1>
                
                {/* Show menu if log in/ Show log button when not signed in */}
                {!isSigned? 
                // When user is not log in
                (<button onClick={logIn} className='bg-purple-500 w-15 rounded-xl absolute right-1 m-5' >
                    <IoLogIn className='ml-2' size={40} color="black" />
                </button>)
                 : 
                // When user is not log in
                (<button onClick={showMenu} className='bg-purple-500 w-15 rounded-xl absolute right-1 m-5'>
                    <IoMenu className='ml-2' size={40} color="black" />
                </button>)}

            </div>

            {/* If user click menu */}
            {!menu ? (
                null
            ) : ( 
                <div className="fixed top-0 right-0 z-50 flex flex-col items-center bg-gray-800/90 backdrop-blur-md shadow-2xl min-h-full lg:w-[15%] w-[70%] p-6 rounded-l-3xl transition-transform duration-300">
                {/* Close Button */}
                <button
                    className="self-end text-2xl font-bold text-white hover:text-yellow-400 transition"
                    onClick={showMenu}
                >
                    ✕
                </button>

                {/* Profile Image */}
                <div className="relative w-full flex justify-center mt-6 mb-4">
                <img
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                    src="/assets/Profile.gif" 
                    alt="Profile"
                />
                </div>


                {/* Username */}
                <h2 className="text-white text-xl font-semibold mb-6">{profile?.username || 'Guest'}</h2>

                {/* Menu Items */}
                <ul className="flex flex-col w-full gap-4 text-white text-lg font-medium">
                    <li
                    className="cursor-pointer hover:text-purple-400 hover:scale-105 transition-transform duration-200"
                    onClick={profilePage}
                    >
                    My Profile
                    </li>
                    <li
                    className="cursor-pointer hover:text-purple-400 hover:scale-105 transition-transform duration-200"
                    onClick={leaderboardPage}
                    >
                    Leaderboard
                    </li>
                    <li
                    className="cursor-pointer hover:text-purple-400 hover:scale-105 transition-transform duration-200"
                    onClick={settingPage}
                    >
                    Settings
                    </li>
                </ul>

                {/* Sign Out */}
                <button
                    onClick={logOut}
                    className="mt-auto mb-6 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-full shadow-lg transition-colors duration-200"
                >
                    Sign Out
                </button>
                </div>
    
            )}


            {/* Body */}
            <div className='grow flex flex-col lg:flex-row items-center justify-center space-y-5 lg:space-y-0 lg:space-x-5'>
                <div className='grid grid-cols-1 lg:grid-cols-2'>
                    <GameCard img={gameMemoryMatch} />
                    <GameCard img={ticTacToe} />
                    <GameCard img={tetris} />
                    <GameCard img={wordle} />
                    <GameCard img={snake} />
                    <GameCard img={pingpong} />
                </div>
            </div>

            {/*Footer */}
            <div className='bg-purple-700 shadow-lg text-white p-4 text-center w-full'>
                <h1>@Author: Lee Valera, Aileen Pearl, Kevin Yabut </h1>
            </div> 
        </main>
    );
}