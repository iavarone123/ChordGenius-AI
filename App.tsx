
import React, { useState } from 'react';
import { Genre, MusicalKey, MusicalMode, SongStructure } from './types.ts';
import { generateChordProgressions, generateSingleSection } from './services/geminiService.ts';
import SongSectionView from './components/SongSectionView.tsx';
import { Music, Loader2, Sparkles, RotateCcw, Share2 } from 'lucide-react';

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
      console.error("Connection Error:", err);
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
      setError(`Failed to remix ${sectionKey}: ${err.message}`);
    } finally {
      setSectionLoading(prev => ({ ...prev, [sectionKey]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      <header className="max-w-4xl mx-auto flex items-center justify-between mb-12">
        <div className="flex items-center gap-2">
          <Music className="w-6 h-6 text-indigo-500" />
          <h1 className="text-xl font-bold tracking-tight">ChordGenius</h1>
        </div>
        {result && (
          <button 
            onClick={() => setResult(null)}
            className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> New Session
          </button>
        )}
      </header>

      <main className="max-w-4xl mx-auto">
        {!result ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-black text-white">Find your progression.</h2>
              <p className="text-slate-400">Get the most popular chord sequences for your style.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 space-y-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Genre</label>
                  <select 
                    value={genre}
                    onChange={(e) => setGenre(e.target.value as Genre)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
                  >
                    {Object.values(Genre).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key</label>
                    <select 
                      value={key}
                      onChange={(e) => setKey(e.target.value as MusicalKey)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
                    >
                      {Object.values(MusicalKey).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scale</label>
                    <select 
                      value={mode}
                      onChange={(e) => setMode(e.target.value as MusicalMode)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-white font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
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
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 text-lg"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    Generate Chords
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
                  <p className="font-bold mb-1">Error:</p>
                  <p className="opacity-80">{error}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between border-b border-slate-800 pb-8">
              <div>
                <h2 className="text-3xl font-black text-white">{genre} in {key} {mode}</h2>
                <p className="text-slate-400 text-sm mt-1">Based on popular hit records</p>
              </div>
              <button 
                onClick={handleGenerate}
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
                title="Refresh All"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-10">
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
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
