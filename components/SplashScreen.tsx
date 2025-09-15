import React from 'react';
import { WhalefinLogo, WhaleLeft, WhaleRight } from './icons';

const SplashScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-[#060c1f] flex items-center justify-center z-50 animate-splash-container-fade-out overflow-hidden">
            <WhaleLeft className="absolute top-1/4 left-0 w-full sm:w-1/2 text-blue-400/80 animate-glide-left" />
            <WhaleRight className="absolute bottom-1/4 right-0 w-full sm:w-1/2 text-blue-400/80 animate-glide-right" />
            <div className="relative w-64 animate-splash-fade-in">
                <div className="relative overflow-hidden">
                    <WhalefinLogo />
                    <div className="absolute -top-full w-full h-full">
                        <div className="absolute top-0 w-full h-1.5 bg-white/50 blur-lg animate-scanline"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
