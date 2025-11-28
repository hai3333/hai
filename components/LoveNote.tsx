import React, { useState } from 'react';
import { Heart, Sparkles, RefreshCw } from 'lucide-react';
import { generateLoveNote } from '../services/geminiService';

const LoveNote: React.FC = () => {
  const [note, setNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const data = await generateLoveNote();
    setNote(data.message);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4">
      <div className="bg-slate-900/40 backdrop-blur-md border border-pink-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(236,72,153,0.2)] text-center transition-all duration-500">
        
        {!note && !loading && (
          <div className="flex flex-col items-center gap-3">
             <h3 className="text-pink-200 text-lg font-light">Make a wish...</h3>
             <button 
                onClick={handleGenerate}
                className="group relative inline-flex items-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-full transition-all shadow-lg hover:shadow-pink-500/50"
             >
                <Sparkles className="w-4 h-4" />
                <span>Generate Love Note</span>
             </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-3 animate-pulse">
            <Heart className="w-8 h-8 text-pink-500 animate-bounce" fill="currentColor" />
            <span className="text-pink-300 text-sm tracking-widest uppercase">Consulting the stars...</span>
          </div>
        )}

        {note && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="font-script text-3xl md:text-4xl text-pink-100 leading-relaxed drop-shadow-md mb-6">
              "{note}"
            </p>
            <button 
              onClick={handleGenerate}
              className="text-xs text-pink-400/70 hover:text-pink-300 uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              New Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoveNote;
