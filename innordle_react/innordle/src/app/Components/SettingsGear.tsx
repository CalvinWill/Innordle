import { useState } from "react";
import SettingsModal from "./SettingsModal";
import gearIcon from "../settingsGear.png"; // Store your PNG inside the assets folder

interface SettingsGearProps {
    settings: {
        difficultyCheckbox1: boolean;
        difficultyCheckbox2: boolean;
        difficultyCheckbox3: boolean;
    };
    onSettingsChange: (updatedSettings: {
        difficultyCheckbox1: boolean;
        difficultyCheckbox2: boolean;
        difficultyCheckbox3: boolean;
    }) => void;
}

export default function SettingsGear({ settings, onSettingsChange }: SettingsGearProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-full hover:bg-gray-200 transition duration-200"
            >
                <img src={gearIcon.src} alt="Settings" className="w-8 h-8" />
            </button>

            {isOpen && (
                <SettingsModal
                    onClose={() => setIsOpen(false)}
                    initialSettings={settings} // ✅ Pass down the latest settings
                    onSettingsChange={onSettingsChange} // ✅ Pass the handler up to App
                />
            )}
        </>
    );
}
