'use client';

import React, { useState, useEffect } from 'react';

export default function MemoryGame() {
  const timeOfGame = 180;

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
  ];

  // Shuffle function
  const randomCardOrder = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // State
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);

  // Shuffle cards on mount
  useEffect(() => {
    setCards(randomCardOrder(arrOfCard));
  }, []);

  // Handle card press
  const cardPressedHandler = (index) => {
    if (selectedCards.length === 2 || selectedCards.includes(index)) return;
    setSelectedCards([...selectedCards, index]);
  };

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
    <main className="flex flex-col bg-gray-600 text-black min-h-screen justify-center items-center">
      {/* Header */}
      <div className="text-center text-white mb-4">
        <h1 className="text-2xl font-bold">Memory Match Game</h1>
      </div>

      {/* Game Board */}
    <div className=' grow lg:w-[50%] w-full bg-purple-600 flex rounded-lg shadow-lg justify-center items-center'>

      {/**Left */}
      <div>
        
      </div>

      {/*Middle */}
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

        {/*right */}
        <div>

        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-400 w-full text-center text-white mt-4">
        <p>Time Remaining: {timeOfGame} seconds</p>
      </div>
    </main>
  );
}