import { ChangeEvent, useId, useState } from "react"

interface InputContainerProps {
    allCharacterData: Map<string, string[]>,
    history: string[]
    onGuess: (guess: string)=>void
  }
export default function InputContainer({allCharacterData, history, onGuess} : InputContainerProps) {
    return <div className="input-container flex items-center space-x-2 bg-transparent">
                <InputBar allCharacterData={allCharacterData} history={history} onGuess={onGuess} ></InputBar>
                <SubmitButton></SubmitButton>
            </div> 
}

function InputBar({allCharacterData, history, onGuess} : InputContainerProps) {
    const id = useId()
    const [input, setInput] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const names: string[] = Array.from(allCharacterData.keys())
    let namesLowerToUpperMap: Map<string, string> = new Map<string, string>;

    for (let i = -0; i < names.length; i++) {
        namesLowerToUpperMap.set(names[i].toLowerCase(), names[i]);
    }
    
    let options: string[] = names
    .filter(name => !history.includes(name))
    .filter(name => name.toLowerCase().includes(input.toLowerCase()));

    // Only show options that have characters we've typed in
    function handleSubmit(guess: string) {
        setInput("");
        setShowDropdown(false);
        onGuess(guess);
        console.log(`Guessed ${guess}`)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        // User wants to submit a guess
        
        if (event.key === "Enter") {
            // Submit first matching option
            if (input !== "" && options.length > 0) {
                handleSubmit(options[0]);
            }   
        }
    }    

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        setShowDropdown(event.target.value !== "");
    };    

    const handleClick = (option: string) => {
        handleSubmit(option)
      };

    return <div className="input-bar relative w-72">
        <label htmlFor={id}></label>
        <input 
            className="w-full px-4 py-2 text-white bg-gray-900 border-2 border-cyan-500 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400"
            id={id}
            value={input}
            onChange={(e) => handleInputChange(e)}
            onKeyDown={(e) => handleKeyDown(e)}
            type="text"
            placeholder = "Guess the character here!"
            spellCheck="true"
            required
        />

        {showDropdown && (
            <ul 
                className="absolute left-0 right-0 mt-1 overflow-y-auto bg-gray-800 shadow-md max-h-48 rounded-md"
                style={{ maxHeight: "200px" }}>
                {options.map((option, index) => (
                    <li
                    key={index}
                    onClick={() => handleClick(option)}
                    className="p-2 text-white cursor-pointer hover:bg-cyan-600"
                    >
                    {option}
                    </li>
                ))}
            </ul>
        )}

    </div>
}
  
function SubmitButton() {
    //onClick={()=> {}}
    return <div className="submit-button"><img></img></div>
}