
export enum MusicalKey {
  C = 'C',
  CSharp = 'C#',
  D = 'D',
  DSharp = 'D#',
  E = 'E',
  F = 'F',
  FSharp = 'F#',
  G = 'G',
  GSharp = 'G#',
  A = 'A',
  ASharp = 'A#',
  B = 'B'
}

export enum MusicalMode {
  Major = 'Major',
  Minor = 'Minor'
}

export enum Genre {
  Pop = 'Pop',
  Rock = 'Rock',
  Jazz = 'Jazz',
  Blues = 'Blues',
  EDM = 'EDM',
  Country = 'Country',
  Soul = 'Soul',
  LoFi = 'Lo-Fi',
  Metal = 'Metal',
  Funk = 'Funk',
  Reggae = 'Reggae'
}

export interface SongSection {
  chords: string[];
  vibe: string;
  description: string;
}

export interface SongStructure {
  verse: SongSection;
  preChorus: SongSection;
  chorus: SongSection;
  bridge: SongSection;
}

export interface ChordVoicing {
  frets: (number | 'x')[];
  fingers: number[];
  baseFret: number; // 1 for open position, higher for barre chords
}

export interface ChordDefinition {
  name: string;
  voicings: ChordVoicing[];
}
