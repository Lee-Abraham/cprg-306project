"use client";

import React from 'react';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '@/lib/firebase';


//Log In Screen that directs towards sign up screen or HomeScreen
export default function LogInScreen() {

    //Constant that will hold value

    //Holds email and set value of email
    const [email, setEmail] = useState('');

    //Holds Password and set value to password
    const [password, setPassword] =  useState('');

    //Navigation
    const router = useRouter();

    //Show either log in card or sign up card
    const [showSignUp, setShowSignUp] = useState(false)

    //Handles process of login
    const LoginHandler = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            router.push('screens/HomeScreen')
        }
        catch  (error) {
            alert('Login failed: ' +  error.message)
        }
    }

    //Handles when user wants to log in instead of sign up
    const LogButtHandler = async ()  => {
        setShowSignUp(false)
    }

    //Handles when user wants to sign-up instead of login
    const SignUpHandler = async () => {
        setShowSignUp(true)
    }

    //Handles when user have sign-up
    const SignHandler = async ()  => {
        try{
            await createUserWithEmailAndPassword(auth, email, password)
            setShowSignUp(false)
            alert('Sign-up successful!')
        }
        catch (error) {
            alert('Sign-up failed: ' + error.message)
        }
    }

    //Handles when user don't want to log in/ sign up
    const GuessHandler = () => {
        router.push('screens/HomeScreen')
    }

    return (
        <main className="flex flex-col bg-gray-600 text-black min-h-screen overflow-hidden">
            {/*Header */}
            <div className="justify-center items-center hidden lg:flex flex-col w-full">
                <img className='pt-10' src='/assets/ThatIsMyGameBanner.gif' alt='My game banner'></img>
            </div>

            {/*Middle Section */}

            {/*Card 1*/}
            <div className='grow  flex flex-col lg:flex-row mb-10 mt-10 items-center justify-center space-y-5 lg:space-y-0 lg:space-x-10'>
                <div className="flex flex-col lg:flex-row shadow-lg rounded-lg w-full max-w-lg overflow-hidden">
                    {/* Log In*/}
                    {!showSignUp && (
                        <div className='bg-purple-600  shadow-lg rounded-lg p-12 w-full max-w-lg text-center overflow-hidden'>
                            <input
                                className='text-3xl w-[90%] h-12 border bg-white border-gray-300 shadow-lg text-center  rounded-md mr-3 ml-3 mb-3'
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="Email"  
                            />
                            <br/>
                            <input 
                                className="text-3xl w-[90%] h-12 border bg-white border-gray-300 shadow-lg text-center rounded-md mr-3 ml-3 mb-3"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                            <br/>
                            <button onClick={LoginHandler} className='border-none bg-transparent cursor-pointer'>
                                <img src="/assets/LogInButt.gif" className='w-41'></img>
                            </button>
                        </div>
                    )}
                    {/*Sign Up*/}
                    { showSignUp && (
                        <div className='bg-purple-600  shadow-lg rounded-lg p-12 w-full max-w-lg text-center overflow-hidden'>
                            <input
                                className='text-3xl w-[90%] h-12 border bg-white border-gray-300 shadow-lg text-center  rounded-md mr-3 ml-3 mb-3'
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Email'
                            />
                            <input
                                className='text-3xl w-[90%] h-12 border bg-white border-gray-300 shadow-lg text-center  rounded-md mr-3 ml-3 mb-3'
                                type='password'
                                value={password}
                                onChange={(e)=> setPassword(e.target.value)}
                                placeholder='Password'
                            />
                            <button onClick={SignHandler} className='border-none bg-transparent cursor-pointer'>
                                <img src="/assets/SignUpButt.gif" className='w-41' />
                            </button>
                        </div>
                    )}
                </div>

                {/*Card 2*/}
                <div className="flex flex-col lg:flex-row shadow-lg rounded-lg w-full max-w-lg overflow-hidden">
                    {/* Sign Up Button -- Play Button */}
                    <div className='bg-purple-600  shadow-lg rounded-lg p-12 w-full max-w-lg text-center overflow-hidden'>
                        <button onClick={LogButtHandler} className='border-none bg-transparent cursor-pointer'>
                            <img src="/assets/LogInButt.gif" alt='Back To Log In' className='w-59' />
                        </button>
                        <button onClick={SignUpHandler} className='border-none bg-transparent cursor-pointer'>
                            <img src="/assets/SignUpButt.gif" className='w-59' />
                        </button>
                        <br/>
                        <button onClick={GuessHandler} className='border-none bg-transparent cursor-pointer'>
                            <img src="/assets/PlayButt.gif" className='w-59' alt="Play Button" />
                        </button>
                    </div>
                </div>
            </div>

            {/*Footer */}
            <div className='bg-gray-400 text-white p-4 text-center w-full'>
                <h1>
                    @Author: Lee Valera, Aileen Pearl, Kevin Yabut
                </h1>
            </div>  
        </main>
    );
}