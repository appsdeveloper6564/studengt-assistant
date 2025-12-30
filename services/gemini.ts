
import { GoogleGenAI } from "@google/genai";

export const getAIStudyAdvice = async (context: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: context,
      config: {
        systemInstruction: `You are the Scholar Hub AI Guru, an advanced academic mentor. 
        Your expertise includes:
        - MATHEMATICS: Step-by-step problem solving with logical proofs.
        - LITERATURE: Writing high-quality essays, analysis, and creative responses.
        - SCIENCE: Explaining complex physics/chemistry/biology laws clearly.
        - STUDY COACHING: Providing time management and memorization techniques.
        
        Always prioritize student comprehension. If a solution is long, use bullet points and bold headers.`,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "I'm having trouble connecting to my academic database. Please check your internet or ensure you have enough points!";
  }
};
