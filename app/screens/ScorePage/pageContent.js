'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import {Suspense} from 'react'

export default function ScorePageContent() {
  const searchParams = useSearchParams();
  const score = searchParams.get('score');

  return (
        <Suspense fallback={<div>Loading...</div>}>
            <p className='text-3xl pb-2'>{score}</p>
        </Suspense>
  );
}