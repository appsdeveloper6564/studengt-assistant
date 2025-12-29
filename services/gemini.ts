import { GoogleGenAI } from "@google/genai";

// Initialize AI with API key from environment variable safely
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getAIStudyAdvice = async (context: string) => {
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
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!";
  }
};