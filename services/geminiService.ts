
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
 * Creates a fresh AI instance using the current environment's API key.
 * This is crucial for environments where keys are selected dynamically.
 */
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateChordProgressions = async (
  genre: Genre,
  key: MusicalKey,
  mode: MusicalMode
): Promise<SongStructure> => {
  const ai = getAIClient();
  
  const prompt = `You are a world-class Billboard-charting music producer. 
  Your goal is to provide the most POPULAR and COMMON chord progressions for a ${genre} track in the key of ${key} ${mode}.
  
  Focus on "Standard" progressions that define the genre—those that feel instantly familiar and 'catchy'.
  
  For each section (Verse, Pre-Chorus, Chorus, Bridge):
  1. Use standard notation (e.g., 'Cmaj7', 'Am7', 'G').
  2. Describe the "Vibe" in 2-3 evocative words.
  3. In the "Description", provide the Roman Numeral analysis (e.g., I - vi - IV - V) and explain exactly why this specific progression is a hit-record staple for ${genre}.
  
  Ensure the transitions between sections feel musically logical.`;

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
    console.error("AI Generation Failed:", error);
    throw error;
  }
};

export const generateSingleSection = async (
  genre: Genre,
  key: MusicalKey,
  mode: MusicalMode,
  sectionType: string
): Promise<SongSection> => {
  const ai = getAIClient();
  
  const prompt = `Generate an alternative, popular ${sectionType} chord progression for a ${genre} song in ${key} ${mode}. 
  It must be a common industry-standard progression. 
  Include Roman Numeral analysis in the description.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: SECTION_SCHEMA
    }
  });

  const text = response.text;
  if (!text) throw new Error("No data returned from AI.");
  return JSON.parse(text) as SongSection;
};
