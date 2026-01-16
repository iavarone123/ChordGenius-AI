
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
 * Creates an AI instance using the platform-provided API key.
 */
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
};

export const generateChordProgressions = async (
  genre: Genre,
  key: MusicalKey,
  mode: MusicalMode
): Promise<SongStructure> => {
  const ai = getAiClient();
  
  const prompt = `You are a world-class music theorist and hit songwriter. 
  Create a professional, highly effective ${genre} song structure in the key of ${key} ${mode}. 
  
  IMPORTANT: Focus on the most COMMON and POPULAR chord progressions for ${genre}. 
  Avoid overly complex avant-garde choices unless they are staple to the genre (like in Jazz).
  
  Provide chord names for Verse, Pre-Chorus, Chorus, and Bridge. 
  
  In the 'description' field for each section, include:
  1. The Roman Numeral analysis (e.g., I - vi - IV - V).
  2. A brief, catchy explanation of why these chords are popular in ${genre}.
  3. Mention the specific chord names for the musician.
  
  Use standard music notation like 'C', 'Am7', 'Gmaj9', 'F#m7b5'.`;

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
    if (!text) throw new Error("Received empty content from composer.");
    return JSON.parse(text) as SongStructure;
  } catch (error: any) {
    console.error("AI Music Error:", error);
    throw new Error("The music engine is busy. Please try composing again in a moment.");
  }
};

export const generateSingleSection = async (
  genre: Genre,
  key: MusicalKey,
  mode: MusicalMode,
  sectionType: string
): Promise<SongSection> => {
  const ai = getAiClient();
  
  const prompt = `As a hit songwriter, suggest a new, popular ${sectionType} chord progression for a ${genre} track in ${key} ${mode}. 
  Focus on the most common and effective choices. 
  
  Include Roman Numeral analysis in the description.
  
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
  if (!text) throw new Error("Empty response");
  return JSON.parse(text) as SongSection;
};
