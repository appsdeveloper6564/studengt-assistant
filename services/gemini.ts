import { GoogleGenAI } from "@google/genai";

// Safe access to API KEY with a fallback to avoid ReferenceError
const API_KEY = typeof process !== 'undefined' ? process.env.API_KEY : '';

const ai = new GoogleGenAI({ apiKey: (API_KEY as string) || 'MISSING_KEY' });

export const getAIStudyAdvice = async (context: string) => {
  if (!API_KEY || API_KEY === 'undefined') {
    return "Study Tip: Set up your Gemini API key to get personalized AI coaching! For now, remember to take 5-minute breaks every 25 minutes (Pomodoro technique).";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: context,
      config: {
        systemInstruction: "You are a world-class academic coach and student assistant. Provide concise, actionable advice on productivity, study techniques (like Pomodoro or Feynman), and task management. Be encouraging and organized.",
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "I'm having a small technical glitch. Focus on your top priority task for now, and I'll be back soon!";
  }
};