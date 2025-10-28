'use client';

import React, { useState, useEffect } from 'react';
import {useRouter} from 'next/navigation'

export default function MemoryGame() {
  const timeOfGame = 60;
  const router =  useRouter();

  // Initial card list
  const arrOfCard = [
    { id: 1, title: "Orange Card", imgSrc: "/assets/memoryassets/orange.gif", isPick: false },
    { id: 2, title: "Orange Card", imgSrc: "/assets/memoryassets/orange.gif", isPick: false },
    { id: 3, title: "Banana Card", imgSrc: "/assets/memoryassets/banana.gif", isPick: false },
    { id: 4, title: "Banana Card", imgSrc: "/assets/memoryassets/banana.gif", isPick: false },
    { id: 5, title: "Eggplant Card", imgSrc: "/assets/memoryassets/eggplant.gif", isPick: false },
    { id: 6, title: "Eggplant Card", imgSrc: "/assets/memoryassets/eggplant.gif", isPick: false },
    { id: 7, title: "Cactus Card", imgSrc: "/assets/memoryassets/cactus.gif", isPick: false },
    { id: 8, title: "Cactus Card", imgSrc: "/assets/memoryassets/cactus.gif", isPick: false },
    { id: 9, title: "Grape Card", imgSrc: "/assets/memoryassets/grape.gif", isPick: false },
    { id: 10, title: "Grape Card", imgSrc: "/assets/memoryassets/grape.gif", isPick: false },
    { id: 11, title: "Nut Card", imgSrc: "/assets/memoryassets/nut.gif", isPick: false },
    { id: 12, title: "Nut Card", imgSrc: "/assets/memoryassets/nut.gif", isPick: false },
  ];

  // Shuffle function
  const randomCardOrder = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // State
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [timeLeft, setTimeLeft] = useState(timeOfGame);
  const [gameEnded, setGameEnded] = useState(false);
  const [startGame, setStartGame] = useState(false);

  //Timer Count
  useEffect(
    //Check if time ends
      () => {
        if (timeLeft <= 0) {
          endGame();
          return;
        }

      //Count a second. and remove a second from time.
      const timer = setInterval(
        () => {
          if (startGame) {
            setTimeLeft (
              (prev) => prev-1
            ) ;
          }
        }, 1000);

      return () => clearInterval(timer);
    },  [timeLeft] [startGame]);

    //Check if all cards have been pick.
    useEffect (
      () => {
        if (cards.length ===0) return;

        const allPicked = cards.every(card => card.isPick)

        if (allPicked) {
          endGame()
        }
      }, [cards]
    );

  // Handle card press
  const cardPressedHandler = (index) => {
    if (startGame) {
          if (selectedCards.length === 2 || selectedCards.includes(index)) return;
    setSelectedCards([...selectedCards, index]);
    }
  };

  //Handles Scoring
  const calculateScore = () => {
    const pickedCount = cards.filter(card => card.isPick).length;
    return pickedCount *10 - (timeOfGame - timeLeft)
  };

    //Handles game ends
  const endGame  = () => {
    if (gameEnded) return;
    setGameEnded(true);
    router.push(`/screens/ScorePage?score=${calculateScore()}`
    );
  };

  //Handles back button
  const backHome = () => {
    router.push('/screens/HomeScreen');
  };

  //Handles match start
  const startMatch = () => {
    setStartGame(true);
  };

  //--------------------------------------------------------------------//
  //Use Effect
  //--------------------------------------------------------------------//


  // Shuffle cards on mount
  useEffect(() => {
    setCards(randomCardOrder(arrOfCard));
  }, []);

  // Check for match
  useEffect(() => {
    if (selectedCards.length === 2) {
      const [first, second] = selectedCards;
      const firstCard = cards[first];
      const secondCard = cards[second];

      if (firstCard.imgSrc === secondCard.imgSrc) {
        const updatedCards = cards.map((card, idx) =>
          idx === first || idx === second ? { ...card, isPick: true } : card
        );
        setCards(updatedCards);
      }

      // Reset selection after short delay
      setTimeout(() => {
        setSelectedCards([]);
      }, 1000);
    }
  }, [selectedCards]);

  return (
    <main className="flex flex-col bg-gray-600 text-black min-h-screen overflow-y-hidden justify-center items-center">
      {/* Header */}
      <div className="relative flex flex-row items-center justify-between text-white mb-4 h-18 w-full px-4">
        <button className='z-10' onClick={backHome}>
          <img className='w-30 m-5 cursor-pointer' src='/assets/BackButton.gif' alt='Back Button' />
        </button>
        <h1 className="lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 ml-auto text-right lg:text-5xl text-2xl font-bold">Memory Game</h1>
      </div>

        {/* Game Board */}
      <div className=' grow flex-col lg:w-[60%] w-full bg-purple-600 flex rounded-lg shadow-lg border-8 justify-center items-center'>

        {/*Timer */}
        <div className='flex flex-col justify-center  items-center'>
          <img className='lg:w-30 w-20' src="/assets/GameTimer.gif" alt="Game Timer" />
          <h1 className='text-7xl'>{timeLeft}</h1>
        </div>

        {/*List of cards */}
        <div className="grid grid-cols-4 lg:grid-cols-6 gap-2 lg:mr-10 mr-0">
            {cards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => cardPressedHandler(index)}
                className="cursor-pointer lg:w-full m-5"
              >
                <img
                  src={card.isPick || selectedCards.includes(index) ? card.imgSrc : '/assets/memoryassets/backCard.gif'}
                  alt={card.title}
                  className="w-full"
                />
              </div>
          ))}
          </div>

          {/*Button to start, replace with back to home screen button, and end button*/}
          <div>
            {!startGame ? (            
              <button className='cursor-pointer' onClick={() => startMatch()}>
                <img className='w-40 lg:w-full' src='/assets/StartButton.gif' alt='Start button' />
              </button>) : (
                <div>
                  <button className='cursor-pointer' onClick={endGame}>
                    <img className='w-40 lg:w-full' src='/assets/EndButton.gif' alt='End Button' />
                  </button>
                </div>
            )}
          </div>

        </div>

      {/* Footer */}
      <div className="bg-gray-400 w-full text-center text-white mt-4">
        <h1>@Author: Lee Valera</h1>
      </div>
    </main>
  );
}