import React, { useState } from 'react';
import FireworksCanvas from './components/FireworksCanvas';
import LoveNote from './components/LoveNote';
import { FireworkType } from './types';
import { Heart, Zap, Play, Pause } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<FireworkType>(FireworkType.HEART);
  const [autoPlay, setAutoPlay] = useState(false);

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden text-slate-100 selection:bg-pink-500/30">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0 pointer-events-none" />

      {/* The Fireworks Layer */}
      <div className="absolute inset-0 z-10">
        <FireworksCanvas fireworkType={mode} autoPlay={autoPlay} />
      </div>

      {/* Header / Title */}
      <div className="absolute top-0 left-0 w-full p-6 z-20 pointer-events-none flex justify-center">
         <h1 className="font-script text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 drop-shadow-[0_0_15px_rgba(244,63,94,0.6)] opacity-90 animate-pulse tracking-wide">
            Like Lan
         </h1>
      </div>
      
      <div className="absolute top-24 w-full text-center z-20 pointer-events-none">
          <p className="text-pink-200/60 text-sm md:text-base font-light tracking-[0.3em] uppercase drop-shadow-md">
              Spark Love in the Sky
          </p>
      </div>

      {/* Controls */}
      <div className="absolute top-6 right-6 z-30 flex flex-col gap-3">
        {/* Mode Toggle */}
        <div className="flex bg-slate-900/50 backdrop-blur-md rounded-full p-1 border border-slate-700/50">
            <button
                onClick={() => setMode(FireworkType.NORMAL)}
                className={`p-3 rounded-full transition-all duration-300 ${mode === FireworkType.NORMAL ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-white'}`}
                title="Normal Fireworks"
            >
                <Zap className="w-5 h-5" />
            </button>
            <button
                onClick={() => setMode(FireworkType.HEART)}
                className={`p-3 rounded-full transition-all duration-300 ${mode === FireworkType.HEART ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30' : 'text-slate-400 hover:text-white'}`}
                title="Heart Fireworks"
            >
                <Heart className="w-5 h-5 fill-current" />
            </button>
        </div>

        {/* Autoplay Toggle */}
        <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`flex items-center justify-center p-3 rounded-full backdrop-blur-md border transition-all duration-300 
                ${autoPlay 
                    ? 'bg-green-600/80 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                    : 'bg-slate-900/50 border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
            title={autoPlay ? "Pause Show" : "Start Auto Show"}
        >
            {autoPlay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
      </div>

      {/* Bottom Love Note Interaction */}
      <LoveNote />
      
    </div>
  );
};

export default App;