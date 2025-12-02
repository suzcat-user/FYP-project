
import { GoogleGenAI, Type } from "@google/genai";
import { PersonalityResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    personalityTitle: {
      type: Type.STRING,
      description: "A creative and fun personality title for a child, like 'The Cosmic Jester' or 'The Enchanted Adventurer'."
    },
    tagline: {
      type: Type.STRING,
      description: "A short, catchy tagline for this personality, enclosed in quotes."
    },
    description: {
      type: Type.STRING,
      description: "A short, encouraging paragraph (2-3 sentences) explaining this personality in a positive way for a child."
    },
    hobbies: {
      type: Type.ARRAY,
      description: "An array of 1 to 3 hobby suggestions.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "Name of the suggested hobby."
          },
          description: {
            type: Type.STRING,
            description: "A one-sentence description of this hobby."
          },
          reason: {
            type: Type.STRING,
            description: "A short 'Why?' explanation for why this hobby fits them."
          },
        },
        required: ["name", "description", "reason"]
      }
    }
  },
  required: ["personalityTitle", "tagline", "description", "hobbies"]
};

export const getPersonalityAndHobbies = async (answers: string[]): Promise<PersonalityResult> => {
  const prompt = `You are a fun and creative assistant who helps kids discover their personality and new hobbies through a game.
Based on the following selections a child made in a series of games, please generate a personality profile and hobby suggestions.

The child's selections were: [${answers.map(a => `"${a}"`).join(', ')}]

Please respond ONLY with a JSON object that perfectly matches the provided schema. The tone should be playful, encouraging, and suitable for kids.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    return result;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get personality and hobbies from Gemini API.");
  }
};
