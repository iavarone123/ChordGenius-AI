
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

export const generateChordProgressions = async (
  genre: Genre,
  key: MusicalKey,
  mode: MusicalMode
): Promise<SongStructure> => {
  // Initialize AI client inside the function to ensure process.env.API_KEY is available
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `You are an expert music producer specializing in hit records. 
  Create a professional song structure for the ${genre} genre in the key of ${key} ${mode}. 
  
  IMPORTANT: Only use the most COMMON and POPULAR chord progressions for this style. 
  Focus on the staple sounds found in global hit records.
  
  Provide chord names for Verse, Pre-Chorus, Chorus, and Bridge. 
  
  In the 'description' for each section, include the Roman Numeral analysis (e.g., I-V-vi-IV) and why it is so popular in ${genre}.
  
  Use standard notation like 'C', 'Am7', 'Gmaj9'.`;

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
    if (!text) throw new Error("No content received from AI service.");
    return JSON.parse(text) as SongStructure;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // If it's a key error, we pass it through clearly
    throw error;
  }
};

export const generateSingleSection = async (
  genre: Genre,
  key: MusicalKey,
  mode: MusicalMode,
  sectionType: string
): Promise<SongSection> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Provide a popular and common ${sectionType} chord progression for ${genre} in ${key} ${mode}. 
  Include Roman Numeral analysis in description.
  Use standard notation like 'C', 'Am7'.`;

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
