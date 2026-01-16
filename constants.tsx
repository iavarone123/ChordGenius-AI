
import { ChordDefinition } from './types';

export const CHORD_LIBRARY: Record<string, ChordDefinition> = {
  // --- MAJOR CHORDS ---
  'C': {
    name: 'C',
    voicings: [
      { frets: ['x', 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], baseFret: 1 },
      { frets: ['x', 3, 5, 5, 5, 3], fingers: [0, 1, 3, 3, 3, 1], baseFret: 3 },
      { frets: [8, 10, 10, 9, 8, 8], fingers: [1, 3, 4, 2, 1, 1], baseFret: 8 },
      { frets: ['x', 'x', 10, 12, 13, 12], fingers: [0, 0, 1, 3, 4, 2], baseFret: 10 },
    ]
  },
  'D': {
    name: 'D',
    voicings: [
      { frets: ['x', 'x', 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], baseFret: 1 },
      { frets: ['x', 5, 7, 7, 7, 5], fingers: [0, 1, 3, 3, 3, 1], baseFret: 5 },
      { frets: [10, 12, 12, 11, 10, 10], fingers: [1, 3, 4, 2, 1, 1], baseFret: 10 },
      { frets: ['x', 'x', 12, 14, 15, 14], fingers: [0, 0, 1, 3, 4, 2], baseFret: 12 },
    ]
  },
  'E': {
    name: 'E',
    voicings: [
      { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], baseFret: 1 },
      { frets: ['x', 7, 9, 9, 9, 7], fingers: [0, 1, 3, 3, 3, 1], baseFret: 7 },
      { frets: [12, 14, 14, 13, 12, 12], fingers: [1, 3, 4, 2, 1, 1], baseFret: 12 },
      { frets: ['x', 'x', 2, 4, 5, 4], fingers: [0, 0, 1, 3, 4, 2], baseFret: 2 },
    ]
  },
  'F': {
    name: 'F',
    voicings: [
      { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], baseFret: 1 },
      { frets: ['x', 8, 10, 10, 10, 8], fingers: [0, 1, 3, 3, 3, 1], baseFret: 8 },
      { frets: [13, 15, 15, 14, 13, 13], fingers: [1, 3, 4, 2, 1, 1], baseFret: 13 },
      { frets: ['x', 'x', 3, 5, 6, 5], fingers: [0, 0, 1, 3, 4, 2], baseFret: 3 },
    ]
  },
  'G': {
    name: 'G',
    voicings: [
      { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], baseFret: 1 },
      { frets: [3, 5, 5, 4, 3, 3], fingers: [1, 3, 4, 2, 1, 1], baseFret: 3 },
      { frets: ['x', 10, 12, 12, 12, 10], fingers: [0, 1, 3, 3, 3, 1], baseFret: 10 },
      { frets: ['x', 'x', 5, 7, 8, 7], fingers: [0, 0, 1, 3, 4, 2], baseFret: 5 },
    ]
  },
  'A': {
    name: 'A',
    voicings: [
      { frets: ['x', 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], baseFret: 1 },
      { frets: [5, 7, 7, 6, 5, 5], fingers: [1, 3, 4, 2, 1, 1], baseFret: 5 },
      { frets: ['x', 12, 14, 14, 14, 12], fingers: [0, 1, 3, 3, 3, 1], baseFret: 12 },
      { frets: ['x', 'x', 7, 9, 10, 9], fingers: [0, 0, 1, 3, 4, 2], baseFret: 7 },
    ]
  },
  'B': {
    name: 'B',
    voicings: [
      { frets: ['x', 2, 4, 4, 4, 2], fingers: [0, 1, 3, 3, 3, 1], baseFret: 2 },
      { frets: [7, 9, 9, 8, 7, 7], fingers: [1, 3, 4, 2, 1, 1], baseFret: 7 },
      { frets: ['x', 'x', 9, 11, 12, 11], fingers: [0, 0, 1, 3, 4, 2], baseFret: 9 },
      { frets: ['x', 14, 16, 16, 16, 14], fingers: [0, 1, 3, 3, 3, 1], baseFret: 14 },
    ]
  },

  // --- MINOR CHORDS ---
  'Am': {
    name: 'Am',
    voicings: [
      { frets: ['x', 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], baseFret: 1 },
      { frets: [5, 7, 7, 5, 5, 5], fingers: [1, 3, 4, 1, 1, 1], baseFret: 5 },
      { frets: ['x', 12, 14, 14, 13, 12], fingers: [0, 1, 3, 4, 2, 1], baseFret: 12 },
      { frets: ['x', 'x', 7, 9, 10, 8], fingers: [0, 0, 1, 3, 4, 2], baseFret: 7 },
    ]
  },
  'Bm': {
    name: 'Bm',
    voicings: [
      { frets: ['x', 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1], baseFret: 2 },
      { frets: [7, 9, 9, 7, 7, 7], fingers: [1, 3, 4, 1, 1, 1], baseFret: 7 },
      { frets: ['x', 'x', 9, 11, 12, 10], fingers: [0, 0, 1, 3, 4, 2], baseFret: 9 },
      { frets: ['x', 14, 16, 16, 15, 14], fingers: [0, 1, 3, 4, 2, 1], baseFret: 14 },
    ]
  },
  'Cm': {
    name: 'Cm',
    voicings: [
      { frets: ['x', 3, 5, 5, 4, 3], fingers: [0, 1, 3, 4, 2, 1], baseFret: 3 },
      { frets: [8, 10, 10, 8, 8, 8], fingers: [1, 3, 4, 1, 1, 1], baseFret: 8 },
      { frets: ['x', 'x', 10, 12, 13, 11], fingers: [0, 0, 1, 3, 4, 2], baseFret: 10 },
      { frets: ['x', 15, 17, 17, 16, 15], fingers: [0, 1, 3, 4, 2, 1], baseFret: 15 },
    ]
  },
  'Dm': {
    name: 'Dm',
    voicings: [
      { frets: ['x', 'x', 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], baseFret: 1 },
      { frets: ['x', 5, 7, 7, 6, 5], fingers: [0, 1, 3, 4, 2, 1], baseFret: 5 },
      { frets: [10, 12, 12, 10, 10, 10], fingers: [1, 3, 4, 1, 1, 1], baseFret: 10 },
      { frets: ['x', 'x', 12, 14, 15, 13], fingers: [0, 0, 1, 3, 4, 2], baseFret: 12 },
    ]
  },
  'Em': {
    name: 'Em',
    voicings: [
      { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], baseFret: 1 },
      { frets: ['x', 7, 9, 9, 8, 7], fingers: [0, 1, 3, 4, 2, 1], baseFret: 7 },
      { frets: [12, 14, 14, 12, 12, 12], fingers: [1, 3, 4, 1, 1, 1], baseFret: 12 },
      { frets: ['x', 'x', 2, 4, 5, 3], fingers: [0, 0, 1, 3, 4, 2], baseFret: 2 },
    ]
  },
  'Fm': {
    name: 'Fm',
    voicings: [
      { frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1], baseFret: 1 },
      { frets: ['x', 8, 10, 10, 9, 8], fingers: [0, 1, 3, 4, 2, 1], baseFret: 8 },
      { frets: [13, 15, 15, 13, 13, 13], fingers: [1, 3, 4, 1, 1, 1], baseFret: 13 },
      { frets: ['x', 'x', 3, 5, 6, 4], fingers: [0, 0, 1, 3, 4, 2], baseFret: 3 },
    ]
  },
  'Gm': {
    name: 'Gm',
    voicings: [
      { frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], baseFret: 3 },
      { frets: ['x', 10, 12, 12, 11, 10], fingers: [0, 1, 3, 4, 2, 1], baseFret: 10 },
      { frets: [15, 17, 17, 15, 15, 15], fingers: [1, 3, 4, 1, 1, 1], baseFret: 15 },
      { frets: ['x', 'x', 5, 7, 8, 6], fingers: [0, 0, 1, 3, 4, 2], baseFret: 5 },
    ]
  },

  // --- SEVENTH CHORDS ---
  'C7': {
    name: 'C7',
    voicings: [
      { frets: ['x', 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0], baseFret: 1 },
      { frets: ['x', 3, 5, 3, 5, 3], fingers: [0, 1, 3, 1, 4, 1], baseFret: 3 },
      { frets: [8, 10, 8, 9, 8, 8], fingers: [1, 3, 1, 2, 1, 1], baseFret: 8 },
      { frets: ['x', 'x', 10, 12, 11, 12], fingers: [0, 0, 1, 3, 2, 4], baseFret: 10 },
    ]
  },
  'D7': {
    name: 'D7',
    voicings: [
      { frets: ['x', 'x', 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3], baseFret: 1 },
      { frets: ['x', 5, 7, 5, 7, 5], fingers: [0, 1, 3, 1, 4, 1], baseFret: 5 },
      { frets: [10, 12, 10, 11, 10, 10], fingers: [1, 3, 1, 2, 1, 1], baseFret: 10 },
      { frets: ['x', 'x', 12, 14, 13, 14], fingers: [0, 0, 1, 3, 2, 4], baseFret: 12 },
    ]
  },
  'G7': {
    name: 'G7',
    voicings: [
      { frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1], baseFret: 1 },
      { frets: [3, 5, 3, 4, 3, 3], fingers: [1, 3, 1, 2, 1, 1], baseFret: 3 },
      { frets: ['x', 10, 12, 10, 12, 10], fingers: [0, 1, 3, 1, 4, 1], baseFret: 10 },
      { frets: ['x', 'x', 5, 7, 6, 7], fingers: [0, 0, 1, 3, 2, 4], baseFret: 5 },
    ]
  },

  // --- EXTENDED CHORDS ---
  'Cmaj7': {
    name: 'Cmaj7',
    voicings: [
      { frets: ['x', 3, 2, 0, 0, 0], fingers: [0, 3, 2, 0, 0, 0], baseFret: 1 },
      { frets: ['x', 3, 5, 4, 5, 3], fingers: [0, 1, 3, 2, 4, 1], baseFret: 3 },
      { frets: [8, 'x', 9, 9, 8, 'x'], fingers: [1, 0, 2, 3, 1, 0], baseFret: 8 },
      { frets: ['x', 'x', 10, 12, 12, 12], fingers: [0, 0, 1, 3, 3, 3], baseFret: 10 },
    ]
  },
  'E9': {
    name: 'E9',
    voicings: [
      { frets: [0, 2, 0, 1, 0, 2], fingers: [0, 2, 0, 1, 0, 3], baseFret: 1 },
      { frets: ['x', 7, 6, 7, 7, 7], fingers: [0, 2, 1, 3, 3, 3], baseFret: 7 },
      { frets: [12, 14, 12, 13, 12, 12], fingers: [1, 3, 1, 2, 1, 1], baseFret: 12 },
      { frets: ['x', 'x', 2, 1, 3, 2], fingers: [0, 0, 2, 1, 4, 3], baseFret: 1 },
    ]
  },
};

export const findChordDefinition = (chordName: string): ChordDefinition | null => {
  let name = chordName.replace(/b/g, 'b').replace(/#/g, 'Sharp').trim();
  
  // Basic mapping for flat/sharp keys not explicitly in keys
  const mapping: Record<string, string> = {
    'Bb': 'ASharp',
    'Eb': 'DSharp',
    'Ab': 'GSharp',
    'Db': 'CSharp',
    'Gb': 'FSharp'
  };
  
  Object.entries(mapping).forEach(([flat, sharp]) => {
    name = name.replace(flat, sharp);
  });

  // Try direct lookup
  if (CHORD_LIBRARY[name]) return CHORD_LIBRARY[name];
  
  // Try mapping back common names
  const common = name.replace('Sharp', '#');
  if (CHORD_LIBRARY[common]) return CHORD_LIBRARY[common];

  // Fallback to simplified version (stripping extensions)
  const simplified = name.replace(/(maj|min|m|7|9|11|13|sus|add).*/i, '');
  if (CHORD_LIBRARY[simplified]) return CHORD_LIBRARY[simplified];

  const rootOnly = name.charAt(0);
  if (CHORD_LIBRARY[rootOnly]) return CHORD_LIBRARY[rootOnly];

  return null;
};
