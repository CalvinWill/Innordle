import { Underdog } from "next/font/google"
import InputContainer from "./Input"

//// Interfaces for Guesses Components
interface GuessContainerProps {
  allCharacterData: Map<string, string[]>,
  history: string[],
  onGuess: (guess: string) => void,
  todaysAnswer: string
  finished: boolean
}
interface GuessBoxProps {
  allCharacterData: Map<string, string[]>,
  history: string[],
  onGuess: (guess: string) => void,
}

interface GuessesProps {
  allCharacterData: Map<string, string[]>,
  history: string[],
  todaysAnswer: string
}

interface GuessProps {
  allCharacterData: Map<string, string[]>,
  guess: string,
  todaysAnswer: string
}

//// Declaring useful constants
const CATEGORIES = [
  "id",
  "Aliases",
  "Gender",
  "Age",
  "Species",
  "Status",
  "Affiliation",
  "Continent",
  "Residence",
  "Occupation",
  "Fighting Type",
  "Image",
  "Difficulty",
  "Mentions",
  "Introduced"
]

const DISPLAYED_CATEGORIES = [
  "Image",
  "Mentions",
  "Introduced",
  "Gender",
  "Species",
  "Status",
  "Affiliation",
  "Continent",
  "Residence",
  "Occupation",
  "Fighting Type"
]

// const CATEGORY_TO_TYPE = {
//   "Image": "Image",
//   "Mentions": "Scalar",
//   "Introduced": "Scalar",
//   "Gender": "Binary",
//   "Species": "Binary",
//   "Status": "Binary",
//   "Affiliation": "Categorical",
//   "Continent": "Categorical",
//   "Residence": "Categorical",
//   "Occupation": "Categorical",
//   "Fighting Type": "Categorical"
// }

let categoryTypeMap: Map<string, string> = new Map<string, string>;
categoryTypeMap.set("Image", "Image");
categoryTypeMap.set("Mentions", "Scalar");
categoryTypeMap.set("Introduced", "Scalar");
categoryTypeMap.set("Gender", "Binary");
categoryTypeMap.set("Species", "Category");
categoryTypeMap.set("Status", "Binary");
categoryTypeMap.set("Affiliation", "Category");
categoryTypeMap.set("Continent", "Category");
categoryTypeMap.set("Residence", "Category");
categoryTypeMap.set("Occupation", "Category");
categoryTypeMap.set("Fighting Type", "Category");

const DEBUGGING = true;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// Begin component declaration
export default function GuessContainer({ allCharacterData, history, onGuess, todaysAnswer, finished }: GuessContainerProps) {
  return (
    <div className="guess-container flex flex-col items-center justify-center w-full">
      {!finished && (
        <Guessbox allCharacterData={allCharacterData} history={history} onGuess={onGuess}></Guessbox>
      )}
      <Guesses allCharacterData={allCharacterData} history={history} todaysAnswer={todaysAnswer}></Guesses>
    </div>
  )
}

function Guessbox({ allCharacterData, history, onGuess }: GuessBoxProps) {
  return (
    <div className="guessbox flex justify-center w-full my-4">
      <InputContainer allCharacterData={allCharacterData} history={history} onGuess={onGuess}></InputContainer>
    </div>
  )
}

function Guesses({ allCharacterData, history, todaysAnswer }: GuessesProps) {

  return (
    <div className="guesses-container flex flex-col justify-center">
      <div className="category-bar grid grid-cols-11 mb-4 flex">
        {DISPLAYED_CATEGORIES.map((category, index) => (
          <div key={index} className="w-24 h-12 category-title border-0">
            <div className=" justify-center flex text-white">
              {category}
            </div>
            <hr className="w-16 h-0.5 mx-auto my-1 bg-gray-100 border-0 md:my-1 dark:bg-gray-700"></hr>
          </div>
        ))}
      </div>
      <div className="guess-history w-full flex flex-col items-center">
        <ul
          className="">
          {
            history.map((guess, index) => {

              return <li key={index}>
                <Guess
                  todaysAnswer={todaysAnswer}
                  allCharacterData={allCharacterData}
                  guess={guess}>

                </Guess>
              </li>
            })
          }
        </ul>
      </div>
    </div>

  )
}


function Guess({ todaysAnswer, allCharacterData, guess }: GuessProps) {
  // Call function to determine types in GuessDetail
  const allResponses: Map<string, string> = determineResponse({ todaysAnswer, guess, allCharacterData });
  const guessDetailsMap = getCharacterDetailsMap(guess, allCharacterData);

  // Dynamically populate the guess row with the correct response according to given guess
  return (
    <div className="guess grid grid-cols-11 gap-2 rounded-lg w-full mb-4 text-white">
      {
        DISPLAYED_CATEGORIES.map((category, index) => {
          let responseDetail = allResponses.get(category);
          let type: string;
          let content: string;
          let response: string;

          if (responseDetail === undefined) {
            type = "ERROR"
            content = "ERROR"
            response = "Error"
          }
          else {
            type = categoryTypeMap.get(category)!; // sin of exclamation mark!!
            response = responseDetail!;
            content = guessDetailsMap.get(category)!.join(", "); // sin of exclamation mark!!
          }
          return <GuessDetail guess={guess} type={type} content={content} response={response} key={index} name={category}></GuessDetail>;
        })
      }
    </div>
  )

  function GuessDetail({ guess, type, response, content, name }: { guess: string, type: string, response: string, content: string, name: string }) {
    // Determine what css to apply and how to apply content depending on the given 
    const generic_styling = "hover:brightness-90 flex items-center justify-center text-center border border-gray-600 rounded w-24 h-24 "
    switch (type) {
      case "Image":
        if (content === "") {
          return (
            <div className={generic_styling}>
              {guess}
            </div>
          );
        } else {
          return (
            <div className={`${generic_styling} relative group`}>
              <img className="w-full h-full object-cover rounded" src={content} alt="Profile Photo" />
              <div className="absolute inset-0 bg-white text-black flex items-center justify-center font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {guess}
              </div>
            </div>
          );
        }
      case "Scalar":
        let scalarStyling = "";
        switch (response) {
          case "High":
            scalarStyling = "bg-red-500 up-arrow-clip-path display:inline-block"
            break;
          case "Low":
            scalarStyling = "bg-red-500 down-arrow-clip-path display:inline-block"
            break;
          case "Correct":
            scalarStyling = "bg-green-500 display:inline-block"
            break;
        }
        if(name === "Introduced") {
          return <div className={generic_styling + scalarStyling}>
            <span>{"Vol. " + content}</span>
          </div>
        } else {
          return <div className={generic_styling + scalarStyling}>
            <span>{content}</span>
          </div>
        }
        
      case "Binary":
        let binaryStyling = "";
        switch (response) {
          case "Incorrect":
            binaryStyling = "bg-red-500"
            break;
          case "Correct":
            binaryStyling = "bg-green-500"
            break;
        }
        return <div className={generic_styling + binaryStyling}>
          <span>{content}</span>
        </div>
      case "Category":
        let categoryStyling = "";
        switch (response) {
          case "None":
            categoryStyling = "bg-red-500"
            break;
          case "Partial":
            categoryStyling = "bg-yellow-500"
            break;
          case "Match":
            categoryStyling = "bg-green-500"
            break;
        }
        switch (Math.floor(content.length / 10)) {
          case 9:
            categoryStyling += " text-[10px]"
            break;
          case 8:
            categoryStyling += " text-[11px]"
            break;
          case 7:
            categoryStyling += " text-[11px]"
            break;
          case 6:
            categoryStyling += " text-[12px]"
            break;
          case 5:
            categoryStyling += " text-[12px]"
            break;
          case 4:
            categoryStyling += " text-[14px]"
            break;
          case 3:
            categoryStyling += " text-[14px]"
            break;

        }
        return <div className={generic_styling + categoryStyling}>
          <span>{content}</span>
        </div>
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  //// Helper functions
  /**
   * Takes a guess and compares it to the correct answer for the day. Afterwards, it sends a 
   * response for the frontend to display of the form: 
   *  {
   *    Mentions : "Lower", 
   *    Affiliations : "Partial",
   *    ...
   *  }
   * @param todaysAnswer 
   * @param guess
   * returns a map of Map<string, string>
   */
  function determineResponse({ todaysAnswer, allCharacterData, guess }: GuessProps): Map<string, string> {
    // Get guess details
    const guessMap: Map<string, string[]> = getCharacterDetailsMap(guess, allCharacterData);
    // Get today's answer details
    const answerMap: Map<string, string[]> = getCharacterDetailsMap(todaysAnswer, allCharacterData);
    // Call function on details of guess and todays answer to create the response
    return compareDetails({ guessMap, answerMap });
  }

  /**
   * Creates a map of {category : detailsArray} for the specified character
   * @param characterName: name of the character to get details of
   * @param allCharacterData: Map containing the CSV of the character data
   * @returns characterDetailsMap, a Map<string, string[]> of {category : detailsArray}
   */
  function getCharacterDetailsMap(characterName: string, allCharacterData: Map<string, string[]>) {
    // Get guess details for the given character and confirm that it exists
    let characterDetails: string[] | undefined = allCharacterData.get(characterName);
    if (characterDetails === undefined) {
      console.log(`Could not find details for ${characterName}`)
      throw new Error(`Could not find details for ${characterName}`)
    }

    // Organize details of both answer and guess into maps of category : detail so it's parseable
    // Detail is a string array, looking like: ["Erin Solstice", "Sky", "Goblinfriend", etc...]
    let characterDetailsMap: Map<string, string[]> = new Map<string, string[]>

    // i starts at 1 because CATEGORIES includes id but guessDetails does not
    for (let i = 1; i < CATEGORIES.length; i++) {
      if (DEBUGGING) {
        console.log(`CATEGORIES[i]: ${CATEGORIES[i]}, characterDetails: ${characterDetails[i - 1]}`)
      }
      characterDetailsMap.set(CATEGORIES[i], parseCategory(characterDetails[i - 1]))
    }

    return characterDetailsMap;
  }
}


/**
 * Used to help clean up CSV data and turn it into an array of strings
 * @param row, a string representing a category from the CSV looking like "Erin Solstice | Sky | etc..."
 * @returns ans, an array of strings (e.g. ["Erin Solstice", "Sky", "Goblinfriend", etc...])
 */
function parseCategory(categoryString: String): string[] {
  let categoryEntries = categoryString.split(" |")
  let ans: string[] = [];

  categoryEntries.forEach((entry) => {
    ans.push(entry.trim());

    // Check if there was inconsistent entry into the CSV (i.e. inclusion of " |" or not)
    if (ans.length > 1 && ans[ans.length - 1] === "") {
      ans.pop()
    }
  })

  return ans;
}

/**
 * Takes the details of two characters and compares them, then sends the appropriate response
 * in the form:
 *  {
 *    Mentions : "Lower", 
 *    Affiliations : "Partial",
 *    ...
 *  }
 *  Responses depend on the type of comparison made and range from the following:
 *  {
 *    Image: Image URL, 
 *    Scalar: ["High", "Low", "Correct"], 
 *    Binary: ["Incorrect", "Correct"], 
 *    Category: ["None", "Partial", "Match"]
 * }
 * @param guessMap
 * @param answerMap
 * @returns a map of Map<string, string>
 */
function compareDetails({ guessMap, answerMap }:
  { guessMap: Map<string, string[]>, answerMap: Map<string, string[]> }
): Map<string, string> {

  let response: Map<string, string> = new Map<string, string>
  // Fill out the response according to the categories we have to display
  DISPLAYED_CATEGORIES.forEach((category) => {
    const guessDetail = guessMap.get(category);
    const answerDetail = answerMap.get(category);
    if (DEBUGGING) {
      console.log(`Comparing Guess (${guessDetail}) and Answer (${answerDetail})`)
    }
    // Ensure map has elements we want in it (this is mainly for typescript)
    if (guessDetail === undefined) {
      console.log(`Could not find details for ${category}`)
      throw new Error(`Could not find details for ${category}`)
    }
    if (answerDetail === undefined) {
      console.log(`Could not find details for ${category}`)
      throw new Error(`Could not find details for ${category}`)
    }


    switch (categoryTypeMap.get(category)) {
      // Respond with the image of the guessed person
      case "Image":
        response.set(category, guessDetail[0]);
        break;
      // Respond with whether the detail is larger, smaller, or equal
      case "Scalar":
        let scalarAns: string = "";

        const diff: number = parseInt(guessDetail[0]) - parseInt(answerDetail[0]);
        if (diff > 0) {
          scalarAns = "High"
        }
        else if (diff < 0) {
          scalarAns = "Low"
        }
        else {
          scalarAns = "Correct"
        }
        response.set(category, scalarAns);
        break;
      // Respond with whether the detail is correct or not
      case "Binary":
        let binaryAns: string = guessDetail[0] === answerDetail[0] ? "Correct" : "Incorrect";

        response.set(category, binaryAns)
        break;
      // Respond with whether there are some entries that overlap or not
      case "Category":
        let categoryAns: string = ""

        const guessSet = new Set(guessDetail);
        const answerSet = new Set(answerDetail);
        const elementsInCommon: number = guessSet.intersection(answerSet).size;
        console.log(elementsInCommon)
        if (elementsInCommon === 0) {
          categoryAns = "None"
        }
        else if (elementsInCommon === answerSet.size && elementsInCommon === guessSet.size) {
          categoryAns = "Match"
        }
        else {
          categoryAns = "Partial"
        }
        response.set(category, categoryAns);
        break;
    }
  })

  return response
}


