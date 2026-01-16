
import { GoogleGenAI, Type } from "@google/genai";
import { Genre, MusicalKey, MusicalMode, SongSection, SongStructure } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SECTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    chords: { type: Type.ARRAY, items: { type: Type.STRING } },
    vibe: { type: Type.STRING },
    description: { type: Type.STRING }
  },
  required: ["chords", "vibe", "description"]
};

export const generateChordProgressions = async (
  genre: Genre,
  key: MusicalKey,
  mode: MusicalMode
): Promise<SongStructure> => {
  const prompt = `You are a professional music theorist. Create a high-quality ${genre} chord progression in the key of ${key} ${mode}. 
  Provide chord names for Verse, Pre-Chorus, Chorus, and Bridge. 
  
  CRITICAL: In the 'description' field for each section, you MUST include:
  1. The Roman Numeral analysis of the progression (e.g., I - vi - IV - V or ii - V - I).
  2. A brief music theory explanation of why these chords work for the ${genre} genre.
  3. Mention the specific chord names in the explanation text as well.
  
  Ensure the chords are stylistically accurate. Use standard notation like 'C', 'Am7', 'Gmaj9', 'F#m7b5'.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verse: SECTION_SCHEMA,
          preChorus: SECTION_SCHEMA,
          chorus: SECTION_SCHEMA,
          bridge: SECTION_SCHEMA
        },
        required: ["verse", "preChorus", "chorus", "bridge"]
      }
    }
  });

  try {
    return JSON.parse(response.text) as SongStructure;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    throw new Error("Invalid musical data received from AI.");
  }
};

export const generateSingleSection = async (
  genre: Genre,
  key: MusicalKey,
  mode: MusicalMode,
  sectionType: string
): Promise<SongSection> => {
  const prompt = `You are a professional music theorist. Create a new ${sectionType} chord progression for a ${genre} song in the key of ${key} ${mode}. 
  This is a re-roll of just this one section. 
  
  CRITICAL: In the 'description' field, you MUST include:
  1. The Roman Numeral analysis (e.g., IV - V - iii - vi).
  2. A brief theory breakdown of the movement.
  3. Mention the specific chords names.
  
  Use standard notation like 'C', 'Am7', 'Gmaj9', 'F#m7b5'.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: SECTION_SCHEMA
    }
  });

  try {
    return JSON.parse(response.text) as SongSection;
  } catch (error) {
    console.error("Failed to parse Gemini response for section", error);
    throw new Error("Invalid section data received from AI.");
  }
};
