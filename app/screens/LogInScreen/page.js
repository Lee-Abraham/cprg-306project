"use clients";

import React from 'react';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '@/lib/firebase';


//Log In Screen that directs towards sign up screen or HomeScreen
export default function LogInScreen() {
    //Constant that will hold value
    const [email, setEmail] = useState('');
    const [password, setPassword] =  useState('');
    const router = useRouter();

    //Show cards
    const [showSignUp, setShowSignUp] = useState(false)

    //Log In
    const LoginHandler = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            router.push('/HomeScreen.js')
        }
        catch  (error) {
            alert('Login failed: ' +  error.message)
        }
    }

    const LogButtHandler = async ()  => {
        setShowSignUp(false)
    }

    //Sing Up handler
    const SignUpHandler = async () => {
        setShowSignUp(true)
    }

    //
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

    //Guess
    const GuessHandler = () => {
        router.push('screens/HomeScreen')
    }

    return (
        <main className="flex flex-col bg-gray-600 text-black min-h-screen">
            {/*Header */}
            <div className="justify-center items-center hidden lg:flex flex-col bg-blue-600 w-full text-white p-8 mb-10">
                <h1>Hello</h1>
            </div>

            {/*Middle Section */}

            {/*Card 1*/}
            <div className='grow flex flex-col lg:flex-row items-center justify-center space-y-5 lg:space-y-0 lg:space-x-5'>
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
                                className="text-3xl w-[90%] h-12 border bg-white border-gray-300 shadow-lg text-center rounded-md mb-5 mr-3 ml-3"
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
            </div>  
        </main>
    );
}