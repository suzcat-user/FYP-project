
import { GoogleGenAI, Type } from "@google/genai";
import { PersonaResult } from "../types";

const apiKey = process.env.VITE_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generatePersona = async (selectedTraits: string[]): Promise<PersonaResult> => {
  const traitsList = selectedTraits.join(', ');

  const prompt = `
    A kid played a "Personality Bingo" game and selected the following fun traits:
    [${traitsList}]
    
    Based on these traits:
    1. Determine a super fun, kid-friendly "Character Archetype".
    2. Create a cool, catchy tagline (like a superhero catchphrase).
    3. Write a fun 2-sentence description of their personality that makes them feel special.
    4. Generate exactly 9 NEW "Bingo Tiles". These should be funny habits or predictions for a kid with this personality (e.g., "Builds a fort out of pillows", "Talks to cats", "Dreams of Mars").
    5. Suggest 3 awesome hobbies they should try.

    Tone: Energetic, encouraging, funny, and appropriate for ages 8-14.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            archetype: { type: Type.STRING, description: "Fun name for the personality type" },
            tagline: { type: Type.STRING, description: "A cool slogan" },
            description: { type: Type.STRING, description: "Fun description" },
            bingoTiles: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 9 short phrases for bingo"
            },
            hobbies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  whyItFits: { type: Type.STRING }
                }
              }
            }
          },
          required: ["archetype", "tagline", "description", "bingoTiles", "hobbies"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text) as PersonaResult;
      // Ensure we have exactly 9 tiles
      if (data.bingoTiles.length > 9) data.bingoTiles = data.bingoTiles.slice(0, 9);
      while (data.bingoTiles.length < 9) data.bingoTiles.push("Free Space");
      return data;
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error("Error generating persona:", error);
    // Fallback data
    return {
      archetype: "The Mystery Explorer",
      tagline: "Adventure is out there!",
      description: "We couldn't quite find the map to your personality this time, but that just means you're uncharted territory!",
      bingoTiles: ["Loves Mystery", "Super Curious", "Unknown Power", "Loading Fun...", "Glitch in Matrix", "Future Hero", "Hidden Talent", "Wildcard", "Free Space"],
      hobbies: [
        { name: "Scavenger Hunt", description: "Create your own adventure!", whyItFits: "You are full of surprises." }
      ]
    };
  }
};
