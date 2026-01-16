
import React, { useState } from 'react';
import { Genre, MusicalKey, MusicalMode, SongStructure } from './types.ts';
import { generateChordProgressions, generateSingleSection } from './services/geminiService.ts';
import SongSectionView from './components/SongSectionView.tsx';
import { Music, Loader2, Sparkles, Guitar, RotateCcw, Share2, Smartphone, Send, LayoutPanelLeft, Zap } from 'lucide-react';

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
      title: 'ChordGenius Studio',
      text: 'Check out this AI songwriter. It generates common and popular chord progressions instantly!',
      url: window.location.origin,
    };

    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { }
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert("Studio link copied!");
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateChordProgressions(genre, key, mode);
      setResult(data);
    } catch (err: any) {
      console.error("Studio Connection Error:", err);
      setError("The AI Studio is currently offline or warming up. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareSong = async () => {
    const text = `Drafting a ${genre} song in ${key} ${mode}. Generated via ChordGenius AI.`;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: 'ChordGenius AI', text, url }); } catch (err) {}
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      alert("Song draft copied!");
    }
  };

  const handleRerollSection = async (sectionKey: keyof SongStructure) => {
    if (!result) return;
    setSectionLoading(prev => ({ ...prev, [sectionKey]: true }));
    try {
      const newSection = await generateSingleSection(genre, key, mode, sectionKey);
      setResult(prev => prev ? ({ ...prev, [sectionKey]: newSection }) : null);
    } catch (err: any) {
      console.error(`Error remixing ${sectionKey}:`, err);
    } finally {
      setSectionLoading(prev => ({ ...prev, [sectionKey]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pb-24 selection:bg-indigo-500/30">
      {/* Immersive Studio Lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/5 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150"></div>
      </div>

      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-2xl sticky top-0 z-50 pt-[env(safe-area-inset-top)]">
        <div className="container mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setResult(null)}
          >
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)] group-hover:scale-105 transition-all">
              <Music className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-white">
              STUDIO<span className="text-indigo-500">GENIUS</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleShareApp}
              className="hidden sm:flex text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" /> <span>Invite</span>
            </button>
            
            {result && (
              <button 
                onClick={() => setResult(null)}
                className="p-3 text-slate-400 hover:text-white transition-all rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
        {!result ? (
          <div className="max-w-2xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
                <Zap className="w-3 h-3 fill-current" /> AI Songwriting Assistant
              </div>
              <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] md:leading-[0.85]">
                Generate <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-600">Popular</span> Chords.
              </h2>
              <p className="text-slate-500 text-lg md:text-xl max-w-lg mx-auto leading-relaxed font-medium">
                Professional chord progressions based on Billboard hits. Simply choose your vibe and start writing.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 md:p-14 shadow-3xl backdrop-blur-3xl ring-1 ring-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Genre / Style</label>
                  <select 
                    value={genre}
                    onChange={(e) => setGenre(e.target.value as Genre)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all appearance-none cursor-pointer hover:bg-black/60"
                  >
                    {Object.values(Genre).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Key</label>
                    <select 
                      value={key}
                      onChange={(e) => setKey(e.target.value as MusicalKey)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all appearance-none cursor-pointer hover:bg-black/60"
                    >
                      {Object.values(MusicalKey).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Scale</label>
                    <select 
                      value={mode}
                      onChange={(e) => setMode(e.target.value as MusicalMode)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white font-bold text-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all appearance-none cursor-pointer hover:bg-black/60"
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
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-6 rounded-3xl shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-4 group text-xl active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                    Compose My Song
                  </>
                )}
              </button>

              {error && (
                <div className="mt-8 p-6 bg-red-500/5 border border-red-500/20 rounded-3xl text-red-400 text-sm flex flex-col gap-5 animate-in fade-in zoom-in duration-300">
                  <p className="font-bold text-center">{error}</p>
                  <button 
                    onClick={handleGenerate}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-black py-4 rounded-2xl transition-all active:scale-95"
                  >
                    Reconnect Studio
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-4">
              <FeatureCard icon={<Guitar className="w-5 h-5" />} label="Common Progressions" />
              <FeatureCard icon={<Smartphone className="w-5 h-5" />} label="Mobile Studio" />
              <FeatureCard icon={<Zap className="w-5 h-5" />} label="Instant Drafts" />
              <FeatureCard icon={<LayoutPanelLeft className="w-5 h-5" />} label="Theory Support" />
            </div>
          </div>
        ) : (
          <div className="space-y-16 animate-in fade-in duration-1000 slide-in-from-bottom-8">
             <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-white/5 pb-12 gap-8 px-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-indigo-500/20">
                    Song Draft
                  </span>
                  <span className="text-slate-700 text-xs">•</span>
                  <span className="text-slate-400 text-sm font-bold tracking-widest uppercase">{genre} / {key} {mode}</span>
                </div>
                <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter">Your Progression.</h2>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={handleShareSong}
                  className="flex-1 lg:flex-none bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 px-10 py-5 rounded-3xl font-black transition-all border border-indigo-500/20 flex items-center justify-center gap-3 shadow-xl active:scale-95"
                >
                  <Share2 className="w-5 h-5" /> Share
                </button>
                <button 
                  onClick={handleGenerate}
                  className="flex-1 lg:flex-none bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-3xl font-black transition-all border border-white/10 flex items-center justify-center gap-3 active:scale-95"
                >
                  <RotateCcw className="w-5 h-5" /> Remix All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:gap-20">
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

            <div className="flex justify-center pb-20">
               <button 
                  onClick={() => setResult(null)}
                  className="text-slate-500 hover:text-indigo-400 font-black uppercase tracking-[0.4em] text-[10px] transition-all py-6 px-16 border border-white/5 hover:border-indigo-500/30 rounded-full bg-white/2"
                >
                  ← Create New Session
                </button>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Mobile Hint */}
      {!result && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-max px-8 py-4 bg-slate-900/90 backdrop-blur-2xl border border-white/5 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 shadow-2xl flex items-center justify-center gap-4 z-40">
          <Smartphone className="w-4 h-4 text-indigo-500" />
          <span>Tap Share → Add to Home Screen to install</span>
        </div>
      )}
    </div>
  );
};

const FeatureCard = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex flex-col items-center text-center p-8 bg-white/2 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 transition-all hover:-translate-y-2 cursor-default group">
    <div className="p-4 bg-indigo-500/5 rounded-2xl text-indigo-400 mb-4 group-hover:scale-110 group-hover:bg-indigo-500/10 transition-all">
      {icon}
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-300 transition-colors">{label}</span>
  </div>
);

export default App;
