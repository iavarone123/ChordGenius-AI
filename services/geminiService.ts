
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

// Standard initialization as per SDK guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateChordProgressions = async (
  genre: Genre,
  key: MusicalKey,
  mode: MusicalMode
): Promise<SongStructure> => {
  const prompt = `You are an expert music producer. 
  Create a professional song structure for the ${genre} genre in the key of ${key} ${mode}. 
  
  IMPORTANT: Only use the most COMMON and POPULAR chord progressions for this style. 
  Focus on the staple sounds found in hit records.
  
  Provide chord names for Verse, Pre-Chorus, Chorus, and Bridge. 
  
  In the 'description' for each section, include the Roman Numeral analysis (e.g., I-V-vi-IV) and why it works.
  
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
    throw error;
  }
};

export const generateSingleSection = async (
  genre: Genre,
  key: MusicalKey,
  mode: MusicalMode,
  sectionType: string
): Promise<SongSection> => {
  const prompt = `Provide a popular ${sectionType} chord progression for ${genre} in ${key} ${mode}. 
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
