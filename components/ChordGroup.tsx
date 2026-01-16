
import React from 'react';
import { findChordDefinition } from '../constants.tsx';
import ChordDiagram from './ChordDiagram.tsx';

interface ChordGroupProps {
  chordName: string;
}

const ChordGroup: React.FC<ChordGroupProps> = ({ chordName }) => {
  const definition = findChordDefinition(chordName);

  if (!definition || definition.voicings.length === 0) {
    return (
      <div className="flex flex-col items-center bg-slate-800/40 p-4 rounded-xl border border-slate-700 w-full min-w-[120px]">
        <span className="text-xs font-bold text-indigo-300 mb-4">{chordName}</span>
        <div className="w-full aspect-[3/4] flex items-center justify-center border border-dashed border-slate-700 rounded text-[10px] text-slate-500 text-center px-2">
          Diagrams unavailable for {chordName}
        </div>
      </div>
    );
  }

  const gridClass = definition.voicings.length === 4 
    ? "grid grid-cols-2 gap-3" 
    : "flex flex-wrap gap-3";

  return (
    <div className="flex flex-col bg-slate-800/40 p-5 rounded-2xl border border-slate-700 transition-all hover:border-indigo-500/50 h-full shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <span className="text-base font-bold text-indigo-300">{chordName}</span>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{definition.voicings.length} Voicings</span>
      </div>
      
      <div className={gridClass}>
        {definition.voicings.slice(0, 4).map((voicing, idx) => (
          <ChordDiagram 
            key={`${chordName}-voicing-${idx}`} 
            chordName={chordName} 
            voicing={voicing} 
          />
        ))}
      </div>
    </div>
  );
};

export default ChordGroup;
