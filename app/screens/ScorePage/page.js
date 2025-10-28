'use client';
import React from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ScorePage() {  
    //State to get score from game
    const searchParams = useSearchParams();
    const score = searchParams.get('score');
    return (
        <main className='flex flex-col justify-center items-center bg-gray-600 h-screen overflow-hidden'>
            {/*Header */}
            <div className='bg-gray-400 w-full h-20'>
                <h1>Hello</h1>
            </div>

            {/*Body */}
            <div className='grow border-4 flex text-center rounded-lg m-10 justify-center w-[60%] bg-purple-600'>
                {/*Player score */}
                <div className='m-5 bg-yellow-500/90 rounded-lg shadow-2xl lg:w-[30%] lg:h-30'>
                    <h1 className='text-5xl p-2'>Your Score: </h1>
                    
                <Suspense fallback={<div>Loading...</div>}>
                    <p className='text-3xl pb-2'>{score}</p>
                </Suspense>
                </div>
                {/*List of other players score */}
                <div>

                </div>
            </div>

            {/*Footer */}
            <div className='h-20 w-full bg-gray-400 text-center'>
                <h1 className='mt-5'>@Author: Lee Valera</h1>
            </div>
        </main>
    );
}