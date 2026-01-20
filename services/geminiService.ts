
import { GoogleGenAI, Type } from "@google/genai";
import { Scores, Hobby, Personalities } from '../types';

// Function to fetch hobby suggestions using the Gemini API
export const getHobbySuggestions = async (scores: Scores): Promise<Hobby[]> => {
  // Always initialize with process.env.API_KEY as per the library guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const rankedTraits = Object.entries(scores)
    .filter(([, score]) => score > 0)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .map(([trait]) => trait)
    .join(', ');
    
  if (!rankedTraits) {
      return [
        { name: "Exploration", description: "You have a balanced profile! Try exploring a variety of activities from different categories to see what sparks your interest." },
      ]
  }

  // Define the prompt for generating hobby suggestions based on personality traits
  const prompt = `Based on the following personality trait scores, where higher numbers indicate stronger preference, suggest 9 unique and interesting hobbies. For each hobby, provide a short, encouraging description of about 2 sentences. The user's strongest traits are: ${rankedTraits}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hobbies: {
              type: Type.ARRAY,
              description: "A list of 9 hobby suggestions.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: {
                    type: Type.STRING,
                    description: "The name of the hobby.",
                  },
                  description: {
                    type: Type.STRING,
                    description: "A short, encouraging description of the hobby.",
                  },
                },
                required: ["name", "description"],
              },
            },
          },
          required: ["hobbies"],
        },
      },
    });

    const jsonText = response.text?.trim() || "{}";
    const result = JSON.parse(jsonText);
    return result.hobbies || [];
  } catch (error) {
    console.error("Error fetching hobby suggestions from Gemini API:", error);
    // Provide general fallback suggestions on error as we assume API_KEY is managed externally.
    return [
      { name: "Sketching", description: "Grab a pencil and paper and draw what you see. It's a relaxing way to improve observation skills and be creative." },
      { name: "Board Games", description: "Challenge your mind and have fun with friends or family. There are thousands of board games, from strategic epics to simple party games." },
      { name: "Running", description: "A simple way to get active and enjoy the outdoors while building endurance." },
      { name: "Cooking", description: "Experiment with recipes and flavors to create delightful meals for yourself and others." },
      { name: "Photography", description: "Capture the beauty of the world around you and develop a unique creative perspective." },
      { name: "Coding", description: "Build your own digital tools and games while exploring the logic of software development." },
      { name: "Reading", description: "Immerse yourself in new worlds and gain diverse perspectives through literature." },
      { name: "Yoga", description: "Find physical balance and mental clarity through focused movement and breathing." },
      { name: "Gardening", description: "Connect with nature by nurturing plants and creating a vibrant, living space." },
    ];
  }
};

export const getPersonalityDescription = async (scores: Scores): Promise<Personalities[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const rankedTraits = Object.entries(scores)
    .filter(([, score]) => score > 0)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .map(([trait]) => trait)
    .join(', ');

    console.log("Ranked Traits:", rankedTraits);
  if (!rankedTraits) {
      return [{
        name: "Balanced Personality",
        description: "You have a well-rounded personality with no dominant traits. This balance allows you to adapt to various situations and connect with a wide range of people."
      }];
  }

  const prompt = `Based on the following personality trait scores, where higher numbers indicate stronger preference, provide a personality type name and a brief description in about 3 sentences. The user's strongest traits are: ${rankedTraits}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {     
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: "The name of the personality type.",
            },
            description: {
              type: Type.STRING,
              description: "A short, encouraging description of the personality type.",
            },
          },
          required: ["name", "description"],
        },
      },
    });
    const jsonText = response.text?.trim() || "{}";
    const result = JSON.parse(jsonText);
    return [result];
  } catch (error) {
    console.error("Error fetching personality description from Gemini API:", error);
     // Provide general fallback suggestions on error as we assume API_KEY is managed externally.
    return [
      { 
      name: "The Visionary", 
      description: "You have a vivid imagination and see possibilities where others see walls. You thrive on creation and original thought." 
    },
    { 
      name: "The Strategist", 
      description: "Logical and methodical, you enjoy deconstructing complex problems and finding the most efficient path to victory." 
    },
    { 
      name: "The Explorer", 
      description: "Curiosity is your engine. You love discovering new places, ideas, and experiences, rarely staying in one 'zone' for long." 
    },
    { 
      name: "The Guardian", 
      description: "Reliable and observant, you value stability and take pride in protecting and nurturing your environment and community." 
    },
    { 
      name: "The Competitor", 
      description: "Driven by high scores and personal growth, you are always looking for a challenge to test your limits and refine your skills." 
    },
    { 
      name: "The Harmonizer", 
      description: "You excel at finding balance and bringing people together. Your strength lies in empathy and creating a peaceful atmosphere." 
    },
    { 
      name: "The Tinkerer", 
      description: "You love understanding how things work. Whether digital or physical, you’re happiest when you’re taking things apart and improving them." 
    },
    { 
      name: "The Performer", 
      description: "Dynamic and expressive, you enjoy being in the spotlight and sharing your energy with an audience, making every moment memorable." 
    },
    { 
      name: "The Scholar", 
      description: "A lifelong learner who values deep knowledge. You prefer to dive deep into a single subject until you've mastered every detail." 
    }
    ]
  }
};