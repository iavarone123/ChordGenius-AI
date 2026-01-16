
import React, { useState } from 'react';
import { Genre, MusicalKey, MusicalMode, SongStructure } from './types.ts';
import { generateChordProgressions, generateSingleSection } from './services/geminiService.ts';
import SongSectionView from './components/SongSectionView.tsx';
import { Music, Loader2, Sparkles, Guitar, RotateCcw, Share2, Smartphone, Send, Users, ShieldAlert } from 'lucide-react';

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
      console.error("Generation error:", err);
      // Capture the actual error message to help the user understand what's wrong.
      const errorMessage = err.message || "An unexpected error occurred while connecting to the AI.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareSong = async () => {
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
        if ((err as Error).name !== 'AbortError') console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert("Song details and link copied to clipboard!");
    }
  };

  const handleShareApp = async () => {
    const shareData = {
      title: 'ChordGenius AI',
      text: 'Check out this AI songwriting tool. It generates professional chord progressions in seconds!',
      url: window.location.origin,
    };

    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { }
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert("App link copied!");
    }
  };

  const handleRerollSection = async (sectionKey: keyof SongStructure) => {
    if (!result) return;
    setSectionLoading(prev => ({ ...prev, [sectionKey]: true }));
    try {
      const newSection = await generateSingleSection(genre, key, mode, sectionKey);
      setResult(prev => prev ? ({ ...prev, [sectionKey]: newSection }) : null);
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
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 pt-[env(safe-area-inset-top)]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <Music className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              ChordGenius AI
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleShareApp}
              className="flex text-xs font-bold text-indigo-400 items-center gap-1.5 transition-all px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Invite</span>
            </button>
            {result && (
              <button 
                onClick={handleReset}
                className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800"
              >
                <RotateCcw className="w-4 h-4" /> <span className="hidden sm:inline">Reset</span>
              </button>
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
                The professional songwriting tool for musicians. Generate theory-backed chords in seconds.
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
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-5 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 text-indigo-200 group-hover:rotate-12 transition-transform" />
                    <span className="text-lg">Compose Progression</span>
                  </>
                )}
              </button>

              {error && (
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{error}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 px-2">
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <Guitar className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Tabs & Diagrams</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <Smartphone className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Mobile Optimized</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <Users className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Solo Artist Tool</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <Sparkles className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">AI Driven</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-[0.2em]">
                  <Sparkles className="w-4 h-4" />
                  <span>Progression Crafted</span>
                </div>
                <h2 className="text-4xl font-extrabold text-white">
                  {genre} in {key} {mode}
                </h2>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleShareSong}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-2xl transition-all active:scale-95 border border-slate-700"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share Song</span>
                </button>
                <button 
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-2xl transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                >
                  <RotateCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Regenerate All</span>
                </button>
              </div>
            </div>

            <div className="space-y-10">
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

            <div className="text-center pt-8">
              <button 
                onClick={handleReset}
                className="text-slate-500 hover:text-indigo-400 font-bold uppercase tracking-[0.3em] text-xs transition-colors py-4 px-8 border border-transparent hover:border-indigo-500/20 rounded-full"
              >
                ← Back to Studio
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
