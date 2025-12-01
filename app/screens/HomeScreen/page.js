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
    const [isSigned, setIsSigned] = useState(false);

    useEffect (() => {
        if (!auth.currentUser) {
            setIsSigned(false);
        }
        else {
            setIsSigned(true);
        }
    })

    //Set Memory Match
    const gameMemoryMatch = {
        src: '/assets/memoryassets/memoryCardLogo.gif',
        name: 'Memory Match',
        desc: 'Select the matching cards'
    }

    //Set Tic-Tac-Toe
    const ticTacToe = {
        src: '/assets/tictactoeassets/tictactoeCardLogo.gif',
        name: 'Tic-Tac-Toe',
        desc: 'Align three of the same symbol'
    }

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
            <div className="shadow-lg bg-gray-400 flex-row items-center justify-center w-full text-white px-4 h-24 relative">
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
            <div className="shadow-2xl flex flex-col z-20 justify-start items-center absolute right-0 bg-gray-500 min-h-full lg:w-[15%] w-[70%] p-5">
                <button
                    className="text-2xl cursor-pointer self-start mb-5"
                    onClick={showMenu}
                >
                    X
                </button>

                {/* Profile Image */}
                <img className=" cursor-pointer w-20 absolute left-1/2 transform -translate-x-1/2 rounded-full shadow-2xl" src={profile?.avatarUrl || '/assets/Profile.gif'} alt="profile Icon" />
                {/* Username */}
                <h2 className="text-white text-xl mb-4 mt-10">{profile?.username || 'Guest'}</h2>

                {/* Menu Items */}
                <ul className="flex flex-col gap-4 text-white text-lg">
                    <li className="cursor-pointer hover:text-yellow-300" onClick={profilePage}>
                    My Profile
                    </li>
                    <li className="cursor-pointer hover:text-yellow-300" onClick={leaderboardPage}>Leaderboard</li>
                    <li className="cursor-pointer hover:text-yellow-300" onClick={settingPage}>Settings</li>
                    <li className="cursor-pointer hover:text-yellow-300">Achievements</li>
                </ul>

                {/* Sign Out */}
                <button onClick={logOut} className="mt-10 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    Sign Out
                </button>
            </div>
            )}


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