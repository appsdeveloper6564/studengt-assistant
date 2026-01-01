
import { GoogleGenAI, Type } from "@google/genai";
import { ForumPost, UserProfile, TimetableEntry, TaskItem, Routine, Quiz, GKQuestion } from "../types";

export const AIService = {
  /**
   * Safe retrieval of API Key defined in vite.config.ts
   */
  getApiKey: () => {
    const key = process.env.API_KEY;
    if (!key || key === "" || key === "undefined") return null;
    return key;
  },

  /**
   * AI Guru Pro: Academic Mentor with Web Search
   * Switched to 'gemini-3-flash-preview' for maximum compatibility and speed.
   */
  askGuru: async (prompt: string, grade: string, language: string, base64Image?: string) => {
    const apiKey = AIService.getApiKey();
    
    if (!apiKey) {
      return { 
        text: "🚨 API Key Configuration Error: Your key named 'geminiapikey' was not found during build. \n\nFIX: Go to Vercel Settings -> Environment Variables, ensure the key 'geminiapikey' is there, then REDEPLOY.", 
        references: [] 
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    const parts: any[] = [{ text: prompt }];
    
    if (base64Image) {
      parts.unshift({ 
        inlineData: { 
          mimeType: 'image/jpeg', 
          data: base64Image.includes(',') ? base64Image.split(',')[1] : base64Image 
        } 
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts },
        config: {
          systemInstruction: `You are the Scholar Hub AI Guru, a world-class academic mentor. 
          User Grade: ${grade}. 
          Language: ${language}.
          Tasks: Solve math/science problems, write essays, explain concepts.
          Web Search: Enabled. Use Google Search for facts, history, or current events.
          Tone: Encouraging and precise. Provide step-by-step logic.`,
          tools: [{ googleSearch: {} }],
          temperature: 0.7
        }
      });

      const text = response.text || "Guru is thinking... Please try asking again.";
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const references = groundingChunks
        .filter(chunk => chunk.web)
        .map(chunk => ({
          title: chunk.web?.title || 'Source',
          uri: chunk.web?.uri || '#'
        }));

      return { text, references };
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      const msg = error?.message || "Unknown error";
      
      if (msg.includes('API_KEY_INVALID') || msg.includes('403')) {
        return { 
          text: "Invalid API Key: Your key is set but Google rejected it. Please ensure your API Key is active in Google AI Studio and has no restrictions.",
          references: [] 
        };
      }
      
      // Return the specific error message to help the user identify what's wrong (e.g., quota, region)
      return { 
        text: `Guru Error: ${msg}. Please check your internet or try again later.`, 
        references: [] 
      };
    }
  },

  generateCustomQuiz: async (topic: string, grade: string): Promise<Quiz | null> => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return null;
    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a 5-question test for topic: "${topic}" (Grade ${grade}).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.INTEGER },
                    explanation: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });
      const data = JSON.parse(response.text || "{}");
      return {
        id: crypto.randomUUID(),
        title: data.title || topic,
        subjectId: 'ai_generated',
        questions: data.questions
      };
    } catch (e) {
      return null;
    }
  },

  generateGKQuestion: async (language: string): Promise<GKQuestion | null> => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return null;
    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Random GK question for students in ${language}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER },
            }
          }
        }
      });
      const data = JSON.parse(response.text || "{}");
      return { id: crypto.randomUUID(), ...data, isAnswered: false };
    } catch (e) {
      return null;
    }
  },

  generateQuiz: async (summary: string) => AIService.generateCustomQuiz(summary, "Student"),
  
  suggestPriority: async (tasks: TaskItem[]) => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return [];
    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Priority check: ${JSON.stringify(tasks)}`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || "[]");
    } catch { return []; }
  },

  breakdownTask: async (title: string) => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return [];
    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Subtasks for: ${title}`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || "[]");
    } catch { return []; }
  },

  detectBurnout: async (entries: TimetableEntry[]) => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return [];
    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Burnout risk in schedule: ${JSON.stringify(entries)}`,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || '{"risks":[]}');
      return data.risks || [];
    } catch { return []; }
  },

  suggestHabits: async (grade: string, language: string) => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return [];
    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Daily habits for ${grade} in ${language}`,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || "[]");
      return data.map((r:any) => ({ id: crypto.randomUUID(), ...r, isCompleted: false }));
    } catch { return []; }
  },

  suggestFlowState: async (task: string) => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return { minutes: 25, tip: "Focus" };
    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Timer focus for: ${task}`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '{"minutes":25,"tip":"Start now"}');
    } catch { return { minutes: 25, tip: "Stay focused" }; }
  },

  getForumSuggestion: async (post: ForumPost) => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return "";
    const ai = new GoogleGenAI({ apiKey });
    try {
      const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: `Comment on: ${post.title}` });
      return res.text || "";
    } catch { return ""; }
  },

  getDailyInsight: async (profile: UserProfile, total: number, done: number) => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return "Keep going!";
    const ai = new GoogleGenAI({ apiKey });
    try {
      const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: `Motivational quote for student.` });
      return res.text || "Success is a journey!";
    } catch { return "Keep studying!"; }
  }
};
