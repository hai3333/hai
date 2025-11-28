import { GoogleGenAI, Type } from "@google/genai";
import { LoveNoteResponse } from "../types";

const safeProcessEnvApiKey = (typeof process !== 'undefined' && (process as any).env && (process as any).env.API_KEY) || '';
const ai = new GoogleGenAI({ apiKey: safeProcessEnvApiKey });

export const generateLoveNote = async (tone: string = 'romantic'): Promise<LoveNoteResponse> => {
  try {
    if (import.meta.env.PROD) {
      const res = await fetch(`/api/generate-love-note?tone=${encodeURIComponent(tone)}`);
      if (!res.ok) throw new Error(`Bad response: ${res.status}`);
      const data = await res.json();
      return data as LoveNoteResponse;
    } else {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Write a short, poetic, and ${tone} love message (max 20 words).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              message: { type: Type.STRING, description: "The love message text" },
              mood: { type: Type.STRING, description: "A single word describing the mood, e.g., 'Passionate', 'Sweet'" }
            },
            required: ["message", "mood"]
          }
        }
      });
      const text = (response as any).text;
      if (!text) return { message: "Love lights up the darkest sky.", mood: "Timeless" };
      return JSON.parse(text) as LoveNoteResponse;
    }
  } catch (error) {
    console.error("Failed to generate love note:", error);
    return { message: "You are the spark in my life.", mood: "Classic" };
  }
};
