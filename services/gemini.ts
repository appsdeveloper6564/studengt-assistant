
import { GoogleGenAI } from "@google/genai";

export const getAIStudyAdvice = async (context: string) => {
  try {
    // Strictly using process.env.API_KEY as per system requirements.
    // Initializing inside the function to ensure the most up-to-date API key is used.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: context,
      config: {
        systemInstruction: `You are an expert student assistant and academic question solver. 
        Your goal is to provide accurate, step-by-step solutions for math, science, and general study queries. 
        Be professional, encouraging, and concise.`,
        temperature: 0.7,
      },
    });
    // .text is a property, not a method.
    return response.text;
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "I'm having trouble connecting to my academic database. Please check your internet or ensure you have enough points!";
  }
};
