import Image from "next/image"; 
import Game from "./Components/Game";
import { parse } from "csv-parse/sync"
import * as fs from 'fs'
import background_img from '../app/innordle_background.jpg'


const INPUT_PATH = './mock_data/temp_sheet.csv'
const DEBUGGING = false;

/**
 * Performs data loading outside of rendering the game so it only happens once.
 * @returns <Game>
 */
export default function Home() {
  //// Recieve correct answer of the day from API (Might need loading bar)
  // Use parser to read in data 
  let file : null | string = null;
  file = fs.readFileSync(INPUT_PATH, 'utf8');
  const tempData : null | string[][] = parse(file, {});

  // Confirm data was read in correctly
  if (tempData === null) {
    throw new Error("Didn't read in any characters")
  }

  // Organize and store data for use later
  let allCharacterData: Map<string, string[]> = new Map<string, string[]>()


  for (let i = 0; i < tempData.length; i++) {
    let row: string[] = tempData[i];
    allCharacterData.set(row[0], row.slice(1));
  }

  const maxdifficulty = 3
  

  const filteredData = new Map(
    [...allCharacterData.entries()].filter(
      ([_, values]) => values[11] !== undefined && Number(values[11]) <= maxdifficulty
    )
  );

  const keys = Array.from(filteredData.keys());
  const randomIndex = Math.floor(Math.random() * keys.length);
  const todaysAnswer: string = keys[randomIndex];
  //const todaysAnswer: string = "Rhaldon"

  console.log(todaysAnswer);
  console.log(todaysAnswer);
  console.log(todaysAnswer);

  if (DEBUGGING) {  
    const todaysAnswerDetails: string[] | undefined = allCharacterData.get(todaysAnswer);
    if (todaysAnswerDetails === undefined) {
      console.log('Selected character does not have info')
    }
    else {
      console.log(todaysAnswerDetails);
      console.log(`Today's Answer: ${todaysAnswer}`);
      console.log(`Today's Answer Aliases: ${todaysAnswerDetails[0].split(" |")}`);
      console.log(`Today's Answer Fighting Type: ${todaysAnswerDetails[todaysAnswerDetails.length-1].split(" |")}`);
    }
  }


  return <div className="background bg-cover bg-center flex justify-center"
              style={{
                height: "100vh",
                backgroundAttachment: "fixed",
                backgroundPosition: "center",
                backgroundImage: `url(https://static.wixstatic.com/media/94aeec_7f348c6465ca474aa9503b3640e76faf~mv2.jpg/v1/fill/w_1290,h_885,al_c,q_90/file.jpg)`
              }}> 
              <div className="game-container overflow-y-scroll w-full h-full">
                <Game todaysAnswer={todaysAnswer} allCharacterData={allCharacterData}></Game>
              </div>
          </div> 
}


