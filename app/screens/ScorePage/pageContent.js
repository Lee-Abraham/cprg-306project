'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

export default function ScorePageContent() {
  const searchParams = useSearchParams();
  const score = searchParams.get('score');

  return (
    <p className='text-3xl pb-2'>{score}</p>
  );
}