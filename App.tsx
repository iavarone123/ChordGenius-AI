
import React, { useState } from 'react';
import { Genre, MusicalKey, MusicalMode, SongStructure, SongSection } from './types';
import { generateChordProgressions, generateSingleSection } from './services/geminiService';
import SongSectionView from './components/SongSectionView';
import { Music, Loader2, Sparkles, Guitar, RotateCcw, Share2, Smartphone } from 'lucide-react';

const App: React.FC = () => {
  const [genre, setGenre] = useState<Genre>(Genre.Pop);
  const [key, setKey] = useState<MusicalKey>(MusicalKey.C);
  const [mode, setMode] = useState<MusicalMode>(MusicalMode.Major);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SongStructure | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sectionLoading, setSectionLoading] = useState<Record<string, boolean>>({});

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateChordProgressions(genre, key, mode);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const text = `Check out my ${genre} song in ${key} ${mode} generated with ChordGenius AI!`;
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ChordGenius AI Progression',
          text: text,
          url: url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert("Link and details copied to clipboard!");
    }
  };

  const handleRerollSection = async (sectionKey: keyof SongStructure) => {
    if (!result) return;
    
    setSectionLoading(prev => ({ ...prev, [sectionKey]: true }));
    try {
      const newSection = await generateSingleSection(genre, key, mode, sectionKey);
      setResult(prev => prev ? ({
        ...prev,
        [sectionKey]: newSection
      }) : null);
    } catch (err: any) {
      console.error(`Error rerolling ${sectionKey}:`, err);
    } finally {
      setSectionLoading(prev => ({ ...prev, [sectionKey]: false }));
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 pb-20 selection:bg-indigo-500/30">
      {/* Decorative Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <Music className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              ChordGenius AI
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {result && (
              <>
                <button 
                  className="flex text-xs md:text-sm font-medium text-slate-400 hover:text-white items-center gap-1.5 transition-colors px-2 md:px-3 py-1.5 rounded-lg hover:bg-slate-800 border border-transparent hover:border-slate-700"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Share</span>
                </button>
                <button 
                  onClick={handleReset}
                  className="text-xs md:text-sm font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors px-2 md:px-3 py-1.5 rounded-lg hover:bg-slate-800"
                >
                  <RotateCcw className="w-4 h-4" /> <span className="hidden sm:inline">Reset</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {!result ? (
          <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Unlock your <br/> next <span className="text-indigo-400">masterpiece.</span>
              </h2>
              <p className="text-slate-400 text-base md:text-lg max-w-md mx-auto px-4">
                The perfect songwriting tool for your iPad and iPhone. Generate theory-backed chords in seconds.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-300 ml-1">Genre</label>
                  <select 
                    value={genre}
                    onChange={(e) => setGenre(e.target.value as Genre)}
                    className="w-full bg-slate-800/80 border border-slate-700/50 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all appearance-none cursor-pointer hover:bg-slate-800 shadow-inner"
                  >
                    {Object.values(Genre).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-300 ml-1">Key</label>
                    <select 
                      value={key}
                      onChange={(e) => setKey(e.target.value as MusicalKey)}
                      className="w-full bg-slate-800/80 border border-slate-700/50 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all appearance-none cursor-pointer hover:bg-slate-800 shadow-inner"
                    >
                      {Object.values(MusicalKey).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-300 ml-1">Mode</label>
                    <select 
                      value={mode}
                      onChange={(e) => setMode(e.target.value as MusicalMode)}
                      className="w-full bg-slate-800/80 border border-slate-700/50 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all appearance-none cursor-pointer hover:bg-slate-800 shadow-inner"
                    >
                      <option value={MusicalMode.Major}>Major</option>
                      <option value={MusicalMode.Minor}>Minor</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 group text-lg active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    Compose My Song
                  </>
                )}
              </button>

              {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl text-red-400 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pt-4">
              <FeatureCard icon={<Guitar />} title="4 Voicings" desc="Optimized for touch screens. Tap to see neck positions." />
              <FeatureCard icon={<Sparkles />} title="AI Theorist" desc="Includes Reggae and more. Pro music theory analysis." />
              <FeatureCard icon={<Smartphone />} title="Mobile First" desc="Add to Home Screen on iOS for the full app experience." />
            </div>
          </div>
        ) : (
          <div className="space-y-8 md:space-y-12 animate-in fade-in duration-1000 slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800/60 pb-8 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-indigo-500/20 shadow-sm shadow-indigo-500/10">
                    Generated Session
                  </span>
                  <span className="text-slate-500 text-xs">•</span>
                  <span className="text-slate-400 text-sm font-medium">{genre}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Your Song in {key} {mode}</h2>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={handleGenerate}
                  className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 px-6 py-3 rounded-xl font-bold transition-all border border-indigo-500/30 flex items-center gap-2 shadow-lg hover:shadow-indigo-500/5 active:scale-95"
                >
                  <Sparkles className="w-5 h-5" /> Remix All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:gap-10">
              <SongSectionView 
                title="Verse" 
                section={result.verse} 
                onReroll={() => handleRerollSection('verse')}
                isLoading={sectionLoading['verse']}
              />
              <SongSectionView 
                title="Pre-Chorus" 
                section={result.preChorus} 
                onReroll={() => handleRerollSection('preChorus')}
                isLoading={sectionLoading['preChorus']}
              />
              <SongSectionView 
                title="Chorus" 
                section={result.chorus} 
                onReroll={() => handleRerollSection('chorus')}
                isLoading={sectionLoading['chorus']}
              />
              <SongSectionView 
                title="Bridge" 
                section={result.bridge} 
                onReroll={() => handleRerollSection('bridge')}
                isLoading={sectionLoading['bridge']}
              />
            </div>

            <footer className="text-center pt-16 md:pt-20 border-t border-slate-800/40">
              <p className="text-slate-500 text-sm font-medium mb-6">
                On iPhone/iPad? Tap Share and select "Add to Home Screen" to use as an app!
              </p>
              <div className="flex items-center justify-center gap-6 opacity-30 grayscale contrast-125">
                 <Music className="w-5 h-5" />
                 <Guitar className="w-5 h-5" />
                 <Smartphone className="w-5 h-5" />
              </div>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex flex-col items-center text-center p-6 space-y-3 bg-slate-900/20 rounded-3xl border border-slate-800/30 hover:bg-slate-900/40 transition-all hover:scale-105 active:scale-95">
    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-inner">
      {React.cloneElement(icon as React.ReactElement, { className: "w-7 h-7" })}
    </div>
    <h4 className="font-bold text-white text-lg tracking-tight">{title}</h4>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default App;
