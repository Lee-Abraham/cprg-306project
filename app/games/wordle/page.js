'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { addRecentGame } from '../../components/AddGame';

// WORDS list
const WORDS = `
ABOUT ACTOR ACUTE ADMIT AGREE ALERT ALIVE ALLOW ALONE AMONG ANGEL
ANGRY APART APPLE APPLY ARENA ARGUE ARISE ARROW ASIDE ASSET AUDIO
AWARD AWARE BADGE BASIC BEACH BEGIN BELLY BELOW BENCH BIRTH
BLACK BLOCK BOARD BOOST BRAIN BRAND BRAVE BREAD BREAK BRICK BRIDE
BRING BROAD BROKE BROWN BUNCH BUYER CANAL CANDY CARVE CATCH CAUSE
CHAIN CHAIR CHALK CHAMP CHART CHASE CHEAP CHECK CHEER CHEST CHIEF
CHILD CHILI CHINA CHOKE CHOIR CIVIL CLAIM CLASS CLEAN CLEAR CLIMB
CLOCK CLOSE CLOUD COACH COAST COUNT COURT COVER CRAFT CREAM CREST
CRIME CROSS CROWD CROWN DAILY DANCE DAIRY DEALT DEATH DEBUT DELAY
DEPTH DEVIL DIARY DIRTY DOUBT DREAM DRINK DRIVE EARLY EARTH EIGHT
ELBOW ELDER ELECT ELITE EMPTY ENJOY ENTER ENTRY EQUAL ERROR EVENT
EVERY EXACT EXAM EXTRA FALSE FEAST FEMALE FEVER FIELD FIGHT FILED
FINAL FINCH FIRST FLAME FLASH FLEET FLOOR FOAMY FORCE FRESH FRONT
FRUIT GHOST GIANT GIVEN GLASS GLOBE GRACE GRADE GRAIN GRANT GRAPE
GRASS GREAT GREEN GUARD GUEST GUIDE HAPPY HARDY HEART HEAVY HONEY
HOVER HUMAN HUNGRY IDEAL IMAGE INDEX INNER INPUT ISSUE JELLY JEWEL
JOINT JUDGE KNIFE KNOWN LABEL LABOR LARGE LASER LAUGH LAYER LEARN
LEAST LEAVE LEVEL LIGHT LIMIT LOCAL LOFTY LOGIC LOOSE MAGIC MAJOR
MAKER MARCH MATCH METAL MIGHT MINOR MODEL MONEY MONTH MORAL MOUSE
MUSIC NERVE NIGHT NOBLE NORTH OCEAN OLIVE ONION OPERA OTHER OUNCE
OUTER OWNER PANEL PANTS PARTY PEACE PHASE PHONE PIANO PIECE PILOT
PLACE PLANT PLATE POINT POWER PRESS PRICE PRIME PRIZE PROUD QUEEN
QUICK QUIET RADIO RAISE RANGE REACT READY REALM REPLY RIGHT RIVER
ROBIN ROUGH ROUND ROYAL RUGBY RULED SCENE SCORE SCOUT SENSE SERVE
SHARE SHEEP SHELL SHIFT SHINE SHOOT SHORT SHOWN SIGHT SKILL SKIRT
SLICE SLIDE SMALL SMART SMILE SMOKE SNAKE SOLID SOUND SPACE SPARE
SPEAK SPEED SPICE SPITE SPORT STAGE STAIR START STEEL STICK STONE
STORE STORM STORY STUDY STYLE SUGAR SWEET TABLE TEACH THEME THICK
THIEF THING THIRD THORN THREE THUMB TIRED TITLE TOAST TODAY TOKEN
TOUCH TOWER TRACE TRADE TRAIN TRIAL TRIBE TRUCK TRUST TRUTH UNDER
UNSET UNITY VALUE VIDEO VIRUS VISIT VOCAL VOICE WATER WHEEL WHERE
WHITE WHOLE WOMAN WORLD WORRY WRITE YIELD YOUTH ZEBRA
`.split(/\s+/).filter(Boolean).map(w => w.toUpperCase());

const ALPHABET = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");

// Pick random word
function pickWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

// Evaluate guess
function evaluateGuess(guess, solution) {
  const result = Array(5).fill("absent");
  const solArr = solution.split("");
  const gArr = guess.split("");

  // Correct letters
  for (let i = 0; i < 5; i++) {
    if (gArr[i] === solArr[i]) {
      result[i] = "correct";
      solArr[i] = null;
      gArr[i] = null;
    }
  }

  // Present letters
  for (let i = 0; i < 5; i++) {
    if (gArr[i]) {
      const idx = solArr.indexOf(gArr[i]);
      if (idx !== -1) {
        result[i] = "present";
        solArr[idx] = null;
      }
    }
  }

  return result;
}

// MAIN COMPONENT
export default function Wordle() {
  const router = useRouter();
  const [solution, setSolution] = useState(pickWord());
  const [guesses, setGuesses] = useState(Array(6).fill(""));
  const [evaluations, setEvaluations] = useState(Array.from({ length: 6 }, () => Array(5).fill(null)));
  const [usedKeys, setUsedKeys] = useState({});
  const [row, setRow] = useState(0);
  const [msg, setMsg] = useState("");
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [score, setScore] = useState(0);
  const [showNextWord, setShowNextWord] = useState(false);

  const flash = (message) => {
    setMsg(message);
    setTimeout(() => setMsg(""), 1800);
  };

  const addLetter = (l) => {
    setGuesses(prev => {
      if (prev[row].length >= 5) return prev;
      const copy = [...prev];
      copy[row] += l.toUpperCase();
      return copy;
    });
  };

  const backspace = () => {
    setGuesses(prev => {
      const copy = [...prev];
      copy[row] = copy[row].slice(0, -1);
      return copy;
    });
  };

  const backHome = () => router.push('/screens/HomeScreen');

  const logWordleGame = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      await addRecentGame(user.uid, {
        name: 'Wordle',
        img: '/assets/wordleAssets/wordle.gif',
        score
      });
    } catch (err) {
      console.error('Failed to log recent game', err);
    }
  };

  const startNextWord = () => {
    setSolution(pickWord());
    setGuesses(Array(6).fill(""));
    setEvaluations(Array.from({ length: 6 }, () => Array(5).fill(null)));
    setUsedKeys({});
    setRow(0);
    setWon(false);
    setLost(false);
    setMsg("");
    setShowNextWord(false);
  };

  const submitGuess = () => {
    const guess = guesses[row].toUpperCase();
    if (guess.length !== 5) return flash("Not enough letters");
    if (!WORDS.includes(guess)) return flash("Word not in list");

    const evals = evaluateGuess(guess, solution);

    // Update grid
    setEvaluations(prev => {
      const copy = prev.map(r => [...r]);
      copy[row] = evals;
      return copy;
    });

    // Update keyboard
    setUsedKeys(prev => {
      const c = { ...prev };
      const rank = s => (s === "correct" ? 3 : s === "present" ? 2 : 1);
      guess.split("").forEach((ch, i) => {
        const s = evals[i];
        if (!c[ch] || rank(s) > rank(c[ch])) c[ch] = s;
      });
      return c;
    });

    const pointsPerRow = [1000, 800, 600, 400, 200, 100];

    if (guess === solution) {
      const points = pointsPerRow[row] || 0;
      setScore(prev => prev + points);
      flash(`You WIN! 🎉 +${points} points`);
      setWon(true);
      setShowNextWord(true);
      logWordleGame();
      setTimeout(() => startNextWord(), 2000);
      return;
    }

    if (row === 5) {
      setLost(true);
      flash(`You lost — ${solution}`);
      setShowNextWord(true);
      setTimeout(() => startNextWord(), 2000);
      return;
    }

    setRow(r => r + 1);
  };

  useEffect(() => {
    const handler = (e) => {
      if (won || lost) return;
      const key = e.key.toUpperCase();
      if (key === "BACKSPACE") return backspace();
      if (key === "ENTER") return submitGuess();
      if (/^[A-Z]$/.test(key)) return addLetter(key);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [won, lost]);

  return (
    <div className="flex flex-col items-center pt-8 text-white min-h-screen bg-gray-900">
      {/* Back Home Button */}
      <button onClick={backHome} className="absolute top-4 left-4 z-50">
        <img className="w-24" src="/assets/BackButton.gif" alt="Back Button" />
      </button>

      <h1 className="text-3xl font-bold tracking-wide mb-4 text-purple-500">WORDLE</h1>

      {/* Score */}
      <div className="mb-4 text-xl font-bold text-green-500">Score: {score}</div>

      {/* Message */}
      {msg && <div className="mb-4 text-yellow-300 font-semibold text-lg animate-pulse">{msg}</div>}

      {/* Next Word Modal */}
      {showNextWord && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-800 px-6 py-4 rounded text-white text-xl font-bold animate-pulse">
            Next Word!
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-rows-6 gap-2 mb-6">
        {guesses.map((guess, rIdx) => (
          <div key={rIdx} className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, cIdx) => {
              const ch = guess[cIdx] || "";
              const status = evaluations[rIdx][cIdx];
              const colors = {
                correct: "bg-green-600 border-green-600",
                present: "bg-yellow-500 border-yellow-500",
                absent: "bg-gray-700 border-gray-700 text-gray-300",
                null: "bg-gray-800 border-gray-600",
              };
              return (
                <div
                  key={cIdx}
                  className={`h-14 w-14 flex items-center justify-center text-2xl font-bold uppercase border rounded transition-all duration-200 ${colors[status || "null"]}`}
                >
                  {ch}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Restart Button */}
      <button
        onClick={startNextWord}
        className="px-4 py-2 bg-purple-700 hover:bg-indigo-700 transition rounded font-semibold mb-6"
      >
        Restart Game
      </button>

      {/* Keyboard */}
      <div className="space-y-2">
        <div className="flex gap-1 justify-center">
          {ALPHABET.slice(0, 10).map(k => <Key key={k} k={k} used={usedKeys[k]} onClick={addLetter} />)}
        </div>
        <div className="flex gap-1 justify-center">
          {ALPHABET.slice(10, 19).map(k => <Key key={k} k={k} used={usedKeys[k]} onClick={addLetter} />)}
        </div>
        <div className="flex justify-center gap-1">
          <button onClick={submitGuess} className="px-3 py-2 bg-gray-700 rounded font-bold">ENTER</button>
          {ALPHABET.slice(19).map(k => <Key key={k} k={k} used={usedKeys[k]} onClick={addLetter} />)}
          <button onClick={backspace} className="px-3 py-2 bg-gray-700 rounded font-bold">DEL</button>
        </div>
      </div>
    </div>
  );
}

function Key({ k, used, onClick }) {
  const colors = {
    correct: "bg-green-600",
    present: "bg-yellow-500",
    absent: "bg-gray-700 text-gray-300",
    null: "bg-gray-600",
  };
  const status = used ?? "null";
  return (
    <button
      onClick={() => onClick(k)}
      className={`px-3 py-2 rounded font-semibold uppercase min-w-[42px] transition ${colors[status]}`}
    >
      {k}
    </button>
  );
}
