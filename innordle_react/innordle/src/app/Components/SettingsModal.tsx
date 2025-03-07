import { useState } from "react";

interface SettingsModalProps {
    onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
    const [settings, setSettings] = useState({
        enableFeature1: false,
        enableFeature2: true,
        enableFeature3: false,
    });

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, checked } = event.target;
        setSettings((prev) => ({ ...prev, [name]: checked }));
    }

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
                        name="enableFeature1"
                        checked={settings.enableFeature1}
                        onChange={handleChange}
                    />
                    <span>Enable Feature 1</span>
                </label>

                <label className="flex items-center space-x-2 mb-2">
                    <input
                        type="checkbox"
                        name="enableFeature2"
                        checked={settings.enableFeature2}
                        onChange={handleChange}
                    />
                    <span>Enable Feature 2</span>
                </label>

                <label className="flex items-center space-x-2 mb-4">
                    <input
                        type="checkbox"
                        name="enableFeature3"
                        checked={settings.enableFeature3}
                        onChange={handleChange}
                    />
                    <span>Enable Feature 3</span>
                </label>

                <div className="flex justify-between">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Export
                    </button>
                </div>
            </div>
        </div>
    );
}
