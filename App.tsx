
import React, { useState } from 'react';
import { Genre, MusicalKey, MusicalMode, SongStructure } from './types.ts';
import { generateChordProgressions, generateSingleSection } from './services/geminiService.ts';
import SongSectionView from './components/SongSectionView.tsx';
import { Music, Loader2, Sparkles, RotateCcw, Share2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [genre, setGenre] = useState<Genre>(Genre.Pop);
  const [key, setKey] = useState<MusicalKey>(MusicalKey.C);
  const [mode, setMode] = useState<MusicalMode>(MusicalMode.Major);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SongStructure | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sectionLoading, setSectionLoading] = useState<Record<string, boolean>>({});

  const handleShare = async () => {
    const shareData = {
      title: 'ChordGenius',
      text: result 
        ? `Check out these ${genre} chords in ${key} ${mode}!`
        : 'Professional AI chord progression generator.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert("Link copied to clipboard!");
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateChordProgressions(genre, key, mode);
      setResult(data);
    } catch (err: any) {
      console.error("Generation Error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRerollSection = async (sectionKey: keyof SongStructure) => {
    if (!result) return;
    setSectionLoading(prev => ({ ...prev, [sectionKey]: true }));
    try {
      const newSection = await generateSingleSection(genre, key, mode, sectionKey);
      setResult(prev => prev ? ({ ...prev, [sectionKey]: newSection }) : null);
    } catch (err: any) {
      setError(`Failed to refresh ${sectionKey}: ${err.message}`);
    } finally {
      setSectionLoading(prev => ({ ...prev, [sectionKey]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      <header className="max-w-5xl mx-auto flex items-center justify-between mb-12">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setResult(null)}>
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
            <Music className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">ChordGenius</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          
          {result && (
            <button 
              onClick={() => setResult(null)}
              className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">New Song</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        {!result ? (
          <div className="max-w-2xl mx-auto space-y-10 py-12">
            <div className="space-y-4 text-center">
              <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">
                Find your <span className="text-indigo-500">progression.</span>
              </h2>
              <p className="text-slate-400 text-xl font-medium">Industry-standard chords for every genre.</p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-10 md:p-14 space-y-12 shadow-3xl backdrop-blur-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Musical Style</label>
                  <select 
                    value={genre}
                    onChange={(e) => setGenre(e.target.value as Genre)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-6 py-5 text-white font-bold text-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer appearance-none hover:bg-slate-800"
                  >
                    {Object.values(Genre).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Key</label>
                    <select 
                      value={key}
                      onChange={(e) => setKey(e.target.value as MusicalKey)}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-6 py-5 text-white font-bold text-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer appearance-none hover:bg-slate-800"
                    >
                      {Object.values(MusicalKey).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Scale</label>
                    <select 
                      value={mode}
                      onChange={(e) => setMode(e.target.value as MusicalMode)}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl px-6 py-5 text-white font-bold text-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer appearance-none hover:bg-slate-800"
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
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-7 rounded-[2rem] shadow-[0_0_50px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-4 text-2xl active:scale-[0.97]"
              >
                {isLoading ? (
                  <Loader2 className="w-10 h-10 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-8 h-8" />
                    Generate Progressions
                  </>
                )}
              </button>

              {error && (
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400 animate-in zoom-in duration-300">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-sm uppercase tracking-widest">Error</p>
                      <p className="text-sm opacity-90 leading-relaxed font-medium">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-12 gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
                  <Sparkles className="w-3.5 h-3.5" /> Generation Complete
                </div>
                <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter">{genre} in {key} <span className="text-indigo-500">{mode}</span></h2>
                <p className="text-slate-400 text-xl font-medium">Billboard-proven chord mapping for global hits.</p>
              </div>
              <button 
                onClick={handleGenerate}
                disabled={isLoading}
                className="p-5 bg-slate-900 hover:bg-slate-800 rounded-3xl transition-all border border-slate-800 shadow-2xl group disabled:opacity-50"
              >
                <RotateCcw className={`w-8 h-8 text-slate-400 group-hover:text-white transition-colors ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-16 md:gap-24">
              {(['verse', 'preChorus', 'chorus', 'bridge'] as const).map(section => (
                <SongSectionView 
                  key={section}
                  title={section} 
                  section={result[section]} 
                  onReroll={() => handleRerollSection(section)}
                  isLoading={sectionLoading[section]}
                />
              ))}
            </div>
            
            <div className="flex justify-center pt-20 pb-32">
               <button 
                  onClick={() => setResult(null)}
                  className="text-slate-400 hover:text-indigo-400 font-black uppercase tracking-[0.4em] text-xs transition-all py-6 px-16 border border-slate-800 rounded-full bg-slate-900/50 backdrop-blur-md shadow-xl hover:shadow-indigo-500/10 active:scale-95"
                >
                  Start New Session
                </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
