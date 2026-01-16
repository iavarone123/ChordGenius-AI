
import React from 'react';
import { SongSection } from '../types';
import ChordGroup from './ChordGroup';
import { RotateCcw, Loader2, ArrowRight, BookOpen } from 'lucide-react';

interface SongSectionViewProps {
  title: string;
  section: SongSection;
  onReroll: () => void;
  isLoading?: boolean;
}

const SongSectionView: React.FC<SongSectionViewProps> = ({ title, section, onReroll, isLoading }) => {
  return (
    <div className="bg-slate-900/60 rounded-3xl p-8 border border-slate-800 backdrop-blur-sm relative group">
      {isLoading && (
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] z-10 rounded-3xl flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-10 gap-8">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between md:justify-start gap-5">
            <h3 className="text-2xl font-bold text-white capitalize tracking-wide">{title}</h3>
            <button
              onClick={onReroll}
              disabled={isLoading}
              title="Remix Section"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-indigo-400 border border-slate-700/50 transition-all active:scale-95 disabled:opacity-30 shadow-md"
            >
              <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Remix Section</span>
            </button>
          </div>
          
          <div className="space-y-3">
            <p className="text-indigo-400 font-semibold">{section.vibe}</p>
            {/* Chord Progression Summary */}
            <div className="flex flex-wrap items-center gap-2 py-2">
              {section.chords.map((chord, idx) => (
                <React.Fragment key={idx}>
                  <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-white font-bold text-sm shadow-sm">
                    {chord}
                  </span>
                  {idx < section.chords.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="flex items-center gap-2 mb-2 text-indigo-300/80">
            <BookOpen className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Theory & Analysis</span>
          </div>
          <p className="text-slate-400 italic leading-relaxed text-sm lg:text-base border-l-2 border-indigo-500/30 pl-6 py-1">
            {section.description}
          </p>
        </div>
      </div>

      {/* Grid for larger diagrams */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
        {section.chords.map((chord, idx) => (
          <ChordGroup key={`${title}-${chord}-${idx}`} chordName={chord} />
        ))}
      </div>
    </div>
  );
};

export default SongSectionView;
