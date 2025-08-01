"use client"

import { useState, useEffect, useRef } from "react";
import GuessContainer from "./Guesses";
import WinScreen from "./WinScreen";
import background_img from "../twi-logo-fancy.png";
import buttonImage from "../infoButton.png";
import { createHash } from 'crypto';

interface GameProps {
  todaysAnswer: string;
  allCharacterData: Map<string, string[]>;
  initialDifficulties: number[];
  onReset: (newAnswer?: string, newDifficulties?: number[], newShowModal?: boolean, maxVolume?: number) => void;
  showModal: boolean;
  maxVolume: number;
  isDaily: boolean;
  setIsDaily: (state: boolean) => void;
}

interface ModalProps {
  onClose: () => void;
  resetFunc: (newAnswer?: string, newDifficulties?: number[], newShowModal?: boolean, maxVolume?: number) => void;
  setDaily: (state: boolean) => void;
  settingsModalFunc: (page: number) => void;
  allCharacterData: Map<string, string[]>;
}

// Konami Code Modal (Info)
function InfoModal({ onClose }: { onClose: () => void }) {
  const konamiCode = useRef([
    "ArrowUp", "ArrowUp",
    "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight",
    "ArrowLeft", "ArrowRight",
    "b", "a", "Enter"
  ]);
  const inputBuffer = useRef<string[]>([]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      inputBuffer.current.push(e.key);
      if (inputBuffer.current.length > konamiCode.current.length) {
        inputBuffer.current.shift();
      }

      if (inputBuffer.current.join("") === konamiCode.current.join("")) {
        alert("🎉 Konami Code activated!");
        // Insert easter egg behavior here!
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full text-left relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 hover:text-black bg-transparent p-2 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">About</h2>
        <p className="text-gray-700 text-sm leading-relaxed">
          Inndle is a daily character-guessing game featuring characters from the web serial The Wandering Inn by Pirateaba.
        </p>
        <p className="text-gray-700 text-sm leading-relaxed">
          Created by CalvinWill, SppEric, and samf25 on Github.
        </p>
      </div>
    </div>
  );
}

// Helper function for generating the daily character
function sha256ToBigInt(data: string): bigint {
  const hashHex = createHash('sha256').update(data).digest('hex');
  return BigInt('0x' + hashHex);
}

function Modal({ onClose, resetFunc, setDaily, settingsModalFunc, allCharacterData }: ModalProps) {
  const enabledLevels: number[] = [1, 2, 3];

  const filteredKeys = Array.from(allCharacterData.entries())
    .filter(([, values]) => values[11] !== undefined && enabledLevels.includes(Number(values[11])))
    .map(([key]) => key);

  const randomIndex = Math.floor(Math.random() * filteredKeys.length);
  const initialAnswer: string = filteredKeys[randomIndex];

  const daysToCheck = 14;
  const usedIndexes = new Set<number>();

  for (let i = 1; i <= daysToCheck; i++) {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - i);
    const pastDateStr = pastDate.toISOString().split("T")[0];
    const pastHashInt = sha256ToBigInt(pastDateStr);
    const keysSize = BigInt(filteredKeys.length);
    const pastIndex = Number(pastHashInt % keysSize);
    usedIndexes.add(pastIndex);
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const hardcodedAnswers: { [date: string]: string } = {
    "2025-07-31": "Belavierr",
    "2025-08-01": "Garry",
    "2025-08-02": "Flos",
    "2025-08-03": "Foliana",
    "2025-08-04": "Garen",
  };

  let dailyAnswer: string;

  if (todayStr in hardcodedAnswers) {
    dailyAnswer = hardcodedAnswers[todayStr];
  } else {
    const todayHashInt = sha256ToBigInt(todayStr);
    const keysSize = BigInt(filteredKeys.length);
    let index = Number(todayHashInt % keysSize);

    while (usedIndexes.has(index)) {
      index = (index + 1) % Number(keysSize);
    }

    dailyAnswer = filteredKeys[index];
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full text-center relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 hover:text-black bg-transparent p-2 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4">Welcome to Inndle!</h2>

        <p className="mb-6 text-sm text-gray-700 leading-relaxed">
          The <strong>Daily Challenge</strong> is the same for everyone and resets at <strong>8:00pm EST</strong>.<br /><br />
          <strong>Free Play</strong> allows you to choose from different difficulties.<br /><br />
          Visit <strong>Settings</strong> to:
          <ul className="list-disc list-inside text-left mt-2 ml-2">
            <li>Select difficulty</li>
            <li>Hide columns to prevent spoilers</li>
            <li>Read comprehensive instructions</li>
          </ul>
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => { resetFunc(dailyAnswer, enabledLevels, false); setDaily(true) }}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Daily Challenge
          </button>
          <button
            onClick={() => resetFunc(initialAnswer, enabledLevels, false)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Free Play
          </button>
          <button
            onClick={() => {
              settingsModalFunc(0);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Rules
          </button>
          <button
            onClick={() => {
              settingsModalFunc(1);
            }}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            Spoiler Controls
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Game({ todaysAnswer, allCharacterData, initialDifficulties, onReset, showModal, maxVolume, isDaily, setIsDaily }: GameProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [showTheModal, setShowTheModal] = useState(showModal);
  const [giveUp, setGiveUp] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [settingsPage, setSettingsPage] = useState(-1);

  function handleGuess(guess: string): void {
    const newHistory = [...history];
    newHistory.unshift(guess);
    setHistory(newHistory);

    if (guess === todaysAnswer) {
      setFinished(true);
    }
  }

  return (
    <div className="game flex flex-col items-center relative px-4">
      {showTheModal && (
        <Modal
          onClose={() => setShowTheModal(false)}
          resetFunc={onReset}
          setDaily={setIsDaily}
          settingsModalFunc={setSettingsPage}
          allCharacterData={allCharacterData}
        />
      )}
      {showInfoModal && <InfoModal onClose={() => setShowInfoModal(false)} />}
      <div className="flex justify-center mb-4 w-full">
        <img src={background_img.src} alt="Background" className="w-full max-w-md rounded-2xl" />
      </div>
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowInfoModal(true)}
          className="w-8 h-8 rounded-full shadow-lg bg-white hover:bg-gray-200 transition flex items-center justify-center overflow-hidden"
        >
          <img src={buttonImage.src} alt="Info" className="w-full h-full object-cover scale-125" />
        </button>
      </div>
      {(finished || giveUp) && (
        <WinScreen
          todaysAnswer={todaysAnswer}
          history={history}
          onFreePlay={onReset}
          daily={isDaily}
          characterData={allCharacterData}
          difficulties={initialDifficulties}
          gaveUp={giveUp}
          setGiveUp={setGiveUp}
          maxVolume={maxVolume}
        />
      )}
      <GuessContainer
        allCharacterData={allCharacterData}
        history={history}
        onGuess={handleGuess}
        todaysAnswer={todaysAnswer}
        difficulties={initialDifficulties}
        onReset={onReset}
        setGiveUp={setGiveUp}
        settingsStartOpen={settingsPage}
        settingsModalFunc={setSettingsPage}
        maxVolume={maxVolume}
      />
    </div>
  );
}
