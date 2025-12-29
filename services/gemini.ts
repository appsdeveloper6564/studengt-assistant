
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIStudyAdvice = async (context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: context,
      config: {
        systemInstruction: `You are an expert student assistant and question solver. 
        Your goal is to provide deep, accurate, and step-by-step solutions to any academic question. 
        If the user asks a math problem, solve it clearly. If they ask for a summary, provide a comprehensive one. 
        Always be professional, concise, and helpful.`,
        temperature: 0.5,
      },
    });
    return response.text;
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "Sorry, I'm currently unavailable to process this question. Please ensure your points are enough or try again later!";
  }
};
