"use client"

import { useState } from "react";
import GuessContainer from "./Guesses";
import WinScreen from "./WinScreen";
import background_img from "../twi-logo-fancy.png";

interface GameProps {
  todaysAnswer: string, 
  allCharacterData: Map<string, string[]>,
  initialDifficulties: number[]
}

/**
 * 
 * @param param0 
 * @returns 
 */
export default function Game({todaysAnswer, allCharacterData, initialDifficulties} : GameProps) {
  //TODO: TELL ERIC HE SUCKS
  const initialHistory: string[] =[];
  const [history, setHistory] = useState(initialHistory);
  const [finished, setFinished] = useState(false);


  function handleGuess(guess: string): void {
    // Add guess to the history
    let newHistory: string[] = history.slice();
    newHistory.unshift(guess);
    setHistory(newHistory);

    // Check if game is won
    if (guess === todaysAnswer) {
      setFinished(true);
    }
  }

  return (
    <div className="game justify-center">
      <div className="flex justify-center mb-4">
        <img src={background_img.src} alt="Background" className="w-full max-w-md rounded-2xl" />
      </div>
      <GuessContainer 
        allCharacterData={allCharacterData} 
        history={history} 
        onGuess={handleGuess}
        todaysAnswer={todaysAnswer}
        finished={finished}
        difficulties={initialDifficulties}>
      </GuessContainer>
      {finished && (
        <WinScreen todaysAnswer={todaysAnswer} history={history}></WinScreen>
      )}

    </div>
  );
}

