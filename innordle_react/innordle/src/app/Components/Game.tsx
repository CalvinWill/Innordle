"use client"

import { useState } from "react";
import HintContainer from "./Hints";
import GuessContainer from "./Guesses";
import WinScreen from "./WinScreen";

interface GameProps {
  todaysAnswer: string, 
  allCharacterData: Map<string, string[]>
}

/**
 * 
 * @param param0 
 * @returns 
 */
export default function Game({todaysAnswer, allCharacterData} : GameProps) {
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
      Definitely not a rip-off of Smashdle™
      <HintContainer></HintContainer>
      <GuessContainer 
        allCharacterData={allCharacterData} 
        history={history} 
        onGuess={handleGuess}
        todaysAnswer={todaysAnswer}
        finished={finished}>
      </GuessContainer>
      {finished && (
        <WinScreen todaysAnswer={todaysAnswer} history={history}></WinScreen>
      )}

    </div>
  );
}

