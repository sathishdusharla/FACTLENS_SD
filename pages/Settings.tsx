import React, { useState } from 'react';

const Toggle: React.FC<{ label: string; description: string; initialChecked?: boolean }> = ({ label, description, initialChecked = false }) => {
    const [isChecked, setIsChecked] = useState(initialChecked);

    return (
        <div className="flex items-center justify-between py-4 border-b border-white/10">
            <div>
                <p className="font-semibold text-white">{label}</p>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
            <label htmlFor={label} className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    id={label}
                    className="sr-only peer"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
        </div>
    );
};

interface SettingsProps {
    onSignOut: () => void;
    isAuthenticated: boolean;
}

const Settings: React.FC<SettingsProps> = ({ onSignOut, isAuthenticated }) => {
  return (
    <main className="flex flex-col items-center justify-center flex-grow w-full text-center animate-fade-in">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-4xl md:text-5xl font-archivoblack text-white uppercase tracking-wide leading-tight drop-shadow-2xl">
          Settings
        </h1>
        <div className="w-full p-px mx-auto rounded-2xl bg-gradient-to-b from-blue-500/50 via-blue-800/20 to-transparent shadow-2xl shadow-blue-900/40">
            <div className="bg-[#0c142b]/80 backdrop-blur-2xl rounded-[15px] p-6 text-white text-left">
                <Toggle 
                    label="Auto-Highlighting"
                    description="Automatically highlight claims on web pages."
                    initialChecked={true}
                />
                <Toggle 
                    label="Browser Notifications"
                    description="Receive alerts for major misinformation events."
                    initialChecked={true}
                />
                <Toggle 
                    label="Share Anonymous Stats"
                    description="Help improve the community by sharing anonymous data."
                    initialChecked={true}
                />
                 <Toggle 
                    label="Enable Gamification"
                    description="Earn points, badges, and appear on the leaderboard."
                    initialChecked={true}
                />
            </div>
        </div>

        {isAuthenticated && (
            <div className="mt-8">
                 <button onClick={onSignOut} className="px-6 py-3 text-sm font-semibold text-red-400 transition-all duration-300 border border-red-400/20 rounded-full bg-red-500/10 backdrop-blur-sm hover:bg-red-500/20 hover:border-red-400/40">
                    SIGN OUT
                </button>
            </div>
        )}
      </div>
    </main>
  );
};

export default Settings;