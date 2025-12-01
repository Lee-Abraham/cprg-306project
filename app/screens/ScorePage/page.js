'use client';

import React, {useState, useEffect} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ScorePage() {
        //Access to search
        const searchParams = useSearchParams();
        //Navigation
        const router = useRouter();
        //Gets a score
        const score = searchParams.get('score');
        //Get winner
        const winlose = searchParams.get('winner');
        //Get draw
        const draw = searchParams.get('result');
        //Check if its a score
        const [isScore, setIsScore] = useState(false);
        //Check if its a win/draw
        const [isWinLose, setIsWinLose] = useState(false);
        //Check if its a draw
        const [isDraw, setIsDraw] = useState(false);

        //On homepage button
        const onHomePagePress = () => {
            router.push('/screens/HomeScreen')
        }

        useEffect(
            () => {
                //Give user the score -- For other games than tictac
                setIsScore(score !== null);
                //Set that user have won or lost -- For tictac or other games that has win/lose
                setIsWinLose(winlose !== null);
                //Check if the game is a draw
                setIsDraw(draw !== null);
            }
        )

    return (
        <main className='flex flex-col justify-center items-center bg-gray-600 h-screen overflow-hidden'>
            {/*Header */}
            <div className='bg-gray-400 w-full h-20'>
                <button onClick={onHomePagePress} 
                className="m-5 px-6 py-4 rounded bg-purple-500 text-white hover:bg-gray-800"
                aria-label="Go to Home Page">Home</button>
            </div>

            {/*Body */}
            <div className='grow border-4 flex flex-col rounded-lg m-10 justify-center items-center w-[60%] bg-purple-600'>
                {/*Player score */}
                <div className=' flex m-5 bg-yellow-500/80 justify-center items-center rounded-lg shadow-2xl w-[40%] lg:h-30'>
                    {!isScore? null : <div className='text-5xl text-center'> Score: <br/>{score} </div>}
                    {!isWinLose? null : <div className='text-5xl text-center'>{winlose} </div>}
                    {!isDraw? null : <div className='text-5xl text-center'>{draw} </div>}
                </div>
                {/*List of other players score */}
                <div className='flex-1 m-5 bg-yellow-500/80 justify-center items-center text-center rounded-lg shadow-2xl w-[80%] lg:h-30'>
                    
                </div>
            </div>

            {/*Footer */}
            <div className='h-20 w-full bg-gray-400 text-center'>
                <h1 className='mt-5'>@Author: Lee Valera</h1>
            </div>
        </main>
    );
}