
import { GoogleGenAI, Type } from "@google/genai";
import { Genre, MusicalKey, MusicalMode, SongSection, SongStructure } from "../types.ts";

const SECTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    chords: { type: Type.ARRAY, items: { type: Type.STRING } },
    vibe: { type: Type.STRING },
    description: { type: Type.STRING }
  },
  required: ["chords", "vibe", "description"]
};

/**
 * Creates a fresh AI instance using the current environment state.
 */
const createAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("An API Key must be set when running in a browser. Please link your account.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateChordProgressions = async (
  genre: Genre,
  key: MusicalKey,
  mode: MusicalMode
): Promise<SongStructure> => {
  const ai = createAiClient();
  
  const prompt = `You are a professional music theorist. Create a high-quality ${genre} chord progression in the key of ${key} ${mode}. 
  Provide chord names for Verse, Pre-Chorus, Chorus, and Bridge. 
  
  CRITICAL: In the 'description' field for each section, you MUST include:
  1. The Roman Numeral analysis of the progression (e.g., I - vi - IV - V).
  2. A brief music theory explanation of why these chords work for the ${genre} genre.
  3. Mention the specific chord names.
  
  Use standard notation like 'C', 'Am7', 'Gmaj9', 'F#m7b5'.`;

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
    const text = response.text;
    if (!text) throw new Error("No response received from AI.");
    return JSON.parse(text) as SongStructure;
  } catch (error) {
    console.error("Parse error:", error);
    throw new Error("Failed to interpret musical data. Please try again.");
  }
};

export const generateSingleSection = async (
  genre: Genre,
  key: MusicalKey,
  mode: MusicalMode,
  sectionType: string
): Promise<SongSection> => {
  const ai = createAiClient();
  
  const prompt = `You are a professional music theorist. Create a new ${sectionType} chord progression for a ${genre} song in the key of ${key} ${mode}. 
  
  CRITICAL: In the 'description' field, include the Roman Numeral analysis and a theory breakdown.
  
  Use standard notation like 'C', 'Am7', 'Gmaj9'.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: SECTION_SCHEMA
    }
  });

  try {
    const text = response.text;
    if (!text) throw new Error("No response received.");
    return JSON.parse(text) as SongSection;
  } catch (error) {
    throw new Error("Section generation failed.");
  }
};
