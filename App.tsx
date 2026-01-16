
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

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateChordProgressions(genre, key, mode);
      setResult(data);
    } catch (err: any) {
      console.error("Generation error:", err);
      setError("Unable to connect to the music engine. Please check your internet and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareSong = async () => {
    const text = `Check out my ${genre} song in ${key} ${mode} generated with ChordGenius AI!`;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: 'ChordGenius AI', text, url }); } catch (err) {}
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert("Song details copied!");
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

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 pb-20 selection:bg-indigo-500/30">
      {/* Dynamic Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 pt-[env(safe-area-inset-top)]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setResult(null)}>
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <Music className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              ChordGenius
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleShareApp}
              className="flex text-xs font-bold text-indigo-400 items-center gap-2 transition-all px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" /> <span>Invite</span>
            </button>
            
            {result && (
              <button 
                onClick={() => setResult(null)}
                className="p-2.5 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-slate-800"
                title="Reset"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
        {!result ? (
          <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center space-y-6">
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1]">
                Master your <br/> next <span className="text-indigo-400">sound.</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
                The smart studio for modern musicians. Theory-backed chords for any genre.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/80 rounded-[3rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Vibe / Genre</label>
                  <select 
                    value={genre}
                    onChange={(e) => setGenre(e.target.value as Genre)}
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-2xl px-6 py-5 text-white font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all appearance-none cursor-pointer hover:bg-slate-800"
                  >
                    {Object.values(Genre).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Key</label>
                    <select 
                      value={key}
                      onChange={(e) => setKey(e.target.value as MusicalKey)}
                      className="w-full bg-slate-800/60 border border-slate-700/50 rounded-2xl px-6 py-5 text-white font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all appearance-none cursor-pointer hover:bg-slate-800"
                    >
                      {Object.values(MusicalKey).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Scale</label>
                    <select 
                      value={mode}
                      onChange={(e) => setMode(e.target.value as MusicalMode)}
                      className="w-full bg-slate-800/60 border border-slate-700/50 rounded-2xl px-6 py-5 text-white font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all appearance-none cursor-pointer hover:bg-slate-800"
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
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-6 rounded-3xl shadow-2xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-4 group text-xl active:scale-[0.97]"
              >
                {isLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                    Compose Now
                  </>
                )}
              </button>

              {error && (
                <div className="mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400 text-sm flex flex-col gap-4 animate-in fade-in zoom-in duration-300">
                  <div className="flex items-start gap-4">
                    <ShieldAlert className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-black uppercase tracking-wider text-xs">Error</p>
                      <p className="opacity-80 leading-relaxed font-medium">{error}</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleGenerate}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-4">
              <FeatureCard icon={<Guitar className="w-6 h-6" />} label="Chord Charts" />
              <FeatureCard icon={<Smartphone className="w-6 h-6" />} label="Install as App" />
              <FeatureCard icon={<Users className="w-6 h-6" />} label="Share Link" />
              <FeatureCard icon={<Sparkles className="w-6 h-6" />} label="Pro Theory" />
            </div>
          </div>
        ) : (
          <div className="space-y-16 animate-in fade-in duration-1000 slide-in-from-bottom-8">
             <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-slate-800/80 pb-12 gap-8 px-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border border-indigo-500/30">
                    AI Composition
                  </span>
                  <span className="text-slate-600 text-xs">•</span>
                  <span className="text-slate-400 text-base font-bold tracking-tight">{genre} • {key} {mode}</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Your Masterpiece.</h2>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={handleShareSong}
                  className="flex-1 lg:flex-none bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 px-8 py-5 rounded-2xl font-black transition-all border border-indigo-500/20 flex items-center justify-center gap-3 shadow-xl active:scale-95"
                >
                  <Share2 className="w-5 h-5" /> Share
                </button>
                <button 
                  onClick={handleGenerate}
                  className="flex-1 lg:flex-none bg-slate-800 hover:bg-slate-700 text-white px-8 py-5 rounded-2xl font-black transition-all border border-slate-700 flex items-center justify-center gap-3 active:scale-95"
                >
                  <RotateCcw className="w-5 h-5" /> Remix All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-16 lg:gap-24">
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

            <div className="flex justify-center pb-12">
               <button 
                  onClick={() => setResult(null)}
                  className="text-slate-500 hover:text-indigo-400 font-black uppercase tracking-[0.4em] text-[10px] transition-all py-6 px-12 border border-slate-800 hover:border-indigo-500/30 rounded-full"
                >
                  ← New Session
                </button>
            </div>
          </div>
        )}
      </main>

      {/* Cross-Device Hint */}
      {!result && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-max px-8 py-4 bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-3">
          <Smartphone className="w-4 h-4 text-indigo-500" />
          <span>Tap Share → Add to Home Screen to install as an app</span>
        </div>
      )}
    </div>
  );
};

const FeatureCard = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex flex-col items-center text-center p-6 bg-slate-900/40 rounded-[2rem] border border-slate-800/60 hover:border-indigo-500/30 transition-all hover:translate-y-[-4px] cursor-default">
    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 mb-3">
      {icon}
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</span>
  </div>
);

export default App;
