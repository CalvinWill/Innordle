import { useState, useEffect } from "react";

interface SettingsModalProps {
    onClose: () => void;
    initialSettings: {
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

export default function SettingsModal({ onClose, initialSettings, onSettingsChange }: SettingsModalProps) {
    // ✅ Ensure we initialize state properly from props
    const [settings, setSettings] = useState(initialSettings);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, checked } = event.target;
        console.log(`Changing ${name} to ${checked}`);

        setSettings((prev) => ({
            ...prev,
            [name]: checked,
        }));
    }

    // ✅ Sync changes with the parent
    useEffect(() => {
        onSettingsChange(settings);
    }, [settings]); // Only runs when settings actually change

    function handleExport() {
        console.log("Exporting settings:", settings);
        alert("Settings exported! (Check console)");
    }

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-lg font-semibold mb-4">Settings</h2>

                <label className="flex items-center space-x-2 mb-2">
                    <input
                        type="checkbox"
                        name="difficultyCheckbox1"
                        checked={settings.difficultyCheckbox1}
                        onChange={handleChange}
                    />
                    <span>Enable Difficulty 1</span>
                </label>

                <label className="flex items-center space-x-2 mb-2">
                    <input
                        type="checkbox"
                        name="difficultyCheckbox2"
                        checked={settings.difficultyCheckbox2}
                        onChange={handleChange}
                    />
                    <span>Enable Difficulty 2</span>
                </label>

                <label className="flex items-center space-x-2 mb-4">
                    <input
                        type="checkbox"
                        name="difficultyCheckbox3"
                        checked={settings.difficultyCheckbox3}
                        onChange={handleChange}
                    />
                    <span>Enable Difficulty 3</span>
                </label>

                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                        Close
                    </button>

                </div>
            </div>
        </div>
    );
}
