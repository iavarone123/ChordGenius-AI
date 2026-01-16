
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
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is currently undefined in the browser environment. Please link your project key.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateChordProgressions = async (
  genre: Genre,
  key: MusicalKey,
  mode: MusicalMode
): Promise<SongStructure> => {
  const ai = getAiClient();
  
  const prompt = `You are a professional music theorist. Create a high-quality ${genre} chord progression in the key of ${key} ${mode}. 
  Provide chord names for Verse, Pre-Chorus, Chorus, and Bridge. 
  
  CRITICAL: In the 'description' field for each section, you MUST include:
  1. The Roman Numeral analysis of the progression (e.g., I - vi - IV - V).
  2. A brief music theory explanation of why these chords work for the ${genre} genre.
  3. Mention the specific chord names.
  
  Use standard notation like 'C', 'Am7', 'Gmaj9', 'F#m7b5'.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
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

    const text = response.text;
    if (!text) throw new Error("The AI returned an empty response.");
    return JSON.parse(text) as SongStructure;
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    throw new Error(error.message || "Failed to generate musical data.");
  }
};

export const generateSingleSection = async (
  genre: Genre,
  key: MusicalKey,
  mode: MusicalMode,
  sectionType: string
): Promise<SongSection> => {
  const ai = getAiClient();
  
  const prompt = `You are a professional music theorist. Create a new ${sectionType} chord progression for a ${genre} song in the key of ${key} ${mode}. 
  
  CRITICAL: In the 'description' field, include the Roman Numeral analysis and a theory breakdown.
  
  Use standard notation like 'C', 'Am7', 'Gmaj9'.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: SECTION_SCHEMA
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response received.");
  return JSON.parse(text) as SongSection;
};
