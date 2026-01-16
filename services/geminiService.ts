
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
 * Direct AI instance initialization.
 */
const getAiClient = () => {
  const key = process.env.API_KEY;
  if (!key) {
    console.error("Critical: API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({ apiKey: key || "" });
};

export const generateChordProgressions = async (
  genre: Genre,
  key: MusicalKey,
  mode: MusicalMode
): Promise<SongStructure> => {
  const ai = getAiClient();
  
  const prompt = `You are a legendary, multi-platinum music producer. 
  Create a hit-record song structure in the genre of ${genre} using the key of ${key} ${mode}. 
  
  CRITICAL: You MUST prioritize the most COMMON and POPULAR chord progressions used in modern hit songs (Billboard Top 100 style). 
  Use progressions that are listeners find instantly familiar and catchy.
  
  Provide chord names for Verse, Pre-Chorus, Chorus, and Bridge. 
  
  In the 'description' field for each section, include:
  1. The Roman Numeral analysis (e.g., I - V - vi - IV).
  2. Why this progression is a popular staple for ${genre}.
  3. The exact chords to play.
  
  Use standard notation like 'C', 'Am7', 'Gmaj9', 'F#m7b5'.`;

  try {
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

    const text = response.text;
    if (!text) throw new Error("Empty Studio response.");
    return JSON.parse(text) as SongStructure;
  } catch (error: any) {
    console.error("AI Error:", error);
    throw new Error("Studio engine timeout. Reconnecting...");
  }
};

export const generateSingleSection = async (
  genre: Genre,
  key: MusicalKey,
  mode: MusicalMode,
  sectionType: string
): Promise<SongSection> => {
  const ai = getAiClient();
  
  const prompt = `As a hit songwriter, suggest a new, highly POPULAR ${sectionType} chord progression for a ${genre} track in ${key} ${mode}. 
  Focus on common choices that work for professional radio play.
  
  Include Roman Numeral analysis.
  
  Use standard notation like 'C', 'Am7', 'Gmaj9'.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: SECTION_SCHEMA
    }
  });

  const text = response.text;
  if (!text) throw new Error("No data");
  return JSON.parse(text) as SongSection;
};
