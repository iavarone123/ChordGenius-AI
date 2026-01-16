
import React from 'react';
import { ChordVoicing } from '../types';

interface ChordDiagramProps {
  chordName: string;
  voicing: ChordVoicing;
}

const ChordDiagram: React.FC<ChordDiagramProps> = ({ voicing }) => {
  const { frets, fingers, baseFret } = voicing;
  const numFretsVisible = 5;
  const width = 84; // Increased from 64
  const height = 104; // Increased from 80
  const margin = 14; // Increased from 10

  const stringWidth = (width - 2 * margin) / 5;
  const fretHeight = (height - 2 * margin) / numFretsVisible;

  return (
    <div className="flex flex-col items-center p-2 rounded-xl bg-slate-900/40 border border-slate-700/40 shadow-inner">
      <div className="relative">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Base Fret Label */}
          {baseFret > 1 && (
            <text x={margin - 5} y={margin + 10} textAnchor="end" fontSize="10" fill="#94a3b8" fontWeight="bold">
              {baseFret}f
            </text>
          )}

          {/* Fretboard grid */}
          <rect x={margin} y={margin} width={width - 2 * margin} height={height - 2 * margin} fill="none" stroke="#475569" strokeWidth="1.5" />
          
          {/* Vertical Strings */}
          {[...Array(6)].map((_, i) => (
            <line 
              key={i}
              x1={margin + i * stringWidth} 
              y1={margin} 
              x2={margin + i * stringWidth} 
              y2={height - margin} 
              stroke="#475569" 
              strokeWidth="1.5" 
            />
          ))}

          {/* Horizontal Frets */}
          {[...Array(numFretsVisible)].map((_, i) => (
            <line 
              key={i}
              x1={margin} 
              y1={margin + (i + 1) * fretHeight} 
              x2={width - margin} 
              y2={margin + (i + 1) * fretHeight} 
              stroke="#475569" 
              strokeWidth="1.5" 
            />
          ))}

          {/* Nut (if at base fret 1) */}
          {baseFret === 1 && (
            <line x1={margin} y1={margin} x2={width - margin} y2={margin} stroke="#cbd5e1" strokeWidth="3" />
          )}

          {/* Finger positions */}
          {frets.map((fret, stringIndex) => {
            if (fret === 'x') {
              return (
                <text key={stringIndex} x={margin + stringIndex * stringWidth} y={margin - 4} textAnchor="middle" fontSize="11" fill="#ef4444" fontWeight="bold">✕</text>
              );
            }
            if (fret === 0) {
              return (
                <circle key={stringIndex} cx={margin + stringIndex * stringWidth} cy={margin - 7} r="2.5" fill="none" stroke="#10b981" strokeWidth="1.5" />
              );
            }

            const relativeFret = fret - baseFret + 1;
            if (relativeFret < 1 || relativeFret > numFretsVisible) return null;

            const finger = fingers[stringIndex];

            return (
              <g key={stringIndex}>
                <circle 
                  cx={margin + stringIndex * stringWidth} 
                  cy={margin + (relativeFret - 0.5) * fretHeight} 
                  r="5" 
                  fill="#818cf8" 
                />
                {finger > 0 && (
                  <text 
                    x={margin + stringIndex * stringWidth} 
                    y={margin + (relativeFret - 0.5) * fretHeight + 2} 
                    textAnchor="middle" 
                    fontSize="6" 
                    fill="white" 
                    fontWeight="bold"
                  >
                    {finger}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default ChordDiagram;
