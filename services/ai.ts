
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
   * AI Guru Pro: Academic Mentor
   * FIX: Removed Google Search tool to stop 429 Quota Exceeded errors on Free Keys.
   * Model switched to 'gemini-flash-lite-latest' for higher rate limits.
   */
  askGuru: async (prompt: string, grade: string, language: string, base64Image?: string) => {
    const apiKey = AIService.getApiKey();
    
    if (!apiKey) {
      return { 
        text: "🚨 API Key Missing: Please check your Vercel Environment Variables.", 
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
        model: 'gemini-flash-lite-latest',
        contents: { parts },
        config: {
          systemInstruction: `You are Scholar Hub AI Guru. User Grade: ${grade}. Lang: ${language}. 
          Solve academic tasks with step-by-step logic. Use your vast internal knowledge.
          Tone: Concise, expert, and encouraging.`,
          // Removed tools: [{ googleSearch: {} }] to prevent 429 quota exhaustion on free keys
          temperature: 0.7,
          topP: 0.95,
          topK: 40
        }
      });

      const text = response.text || "Guru is thinking... Please try asking again.";
      
      // Since tools are removed, references will be empty
      return { text, references: [] };
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      const msg = error?.message || "";
      
      if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
        return { 
          text: "🚀 Guru ki limits full ho gayi hain! (Quota Exceeded)\n\nGoogle Free Tier par limit thodi kam hoti hai. Bas 30-60 seconds wait karke dobara puchiye, ye apne aap reset ho jayega.",
          references: [] 
        };
      }

      if (msg.includes('API_KEY_INVALID') || msg.includes('403')) {
        return { 
          text: "Invalid API Key: Your key is set but Google rejected it. Check your Google AI Studio dashboard.",
          references: [] 
        };
      }
      
      return { 
        text: `Guru Technical Issue: ${msg.substring(0, 100)}... Please try in a moment.`, 
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
        model: 'gemini-flash-lite-latest',
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
      return { id: crypto.randomUUID(), title: data.title || topic, subjectId: 'ai_generated', questions: data.questions };
    } catch (e) { return null; }
  },

  generateGKQuestion: async (language: string): Promise<GKQuestion | null> => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return null;
    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-flash-lite-latest',
        contents: `Random GK question in ${language}.`,
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
      return { id: crypto.randomUUID(), ...JSON.parse(response.text || "{}"), isAnswered: false };
    } catch { return null; }
  },

  generateQuiz: async (summary: string) => AIService.generateCustomQuiz(summary, "Student"),
  
  suggestPriority: async (tasks: TaskItem[]) => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return [];
    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({ model: 'gemini-flash-lite-latest', contents: `Priority: ${JSON.stringify(tasks)}`, config: { responseMimeType: "application/json" } });
      return JSON.parse(response.text || "[]");
    } catch { return []; }
  },

  breakdownTask: async (title: string) => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return [];
    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({ model: 'gemini-flash-lite-latest', contents: `Subtasks: ${title}`, config: { responseMimeType: "application/json" } });
      return JSON.parse(response.text || "[]");
    } catch { return []; }
  },

  detectBurnout: async (entries: TimetableEntry[]) => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return [];
    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({ model: 'gemini-flash-lite-latest', contents: `Burnout check: ${JSON.stringify(entries)}`, config: { responseMimeType: "application/json" } });
      const data = JSON.parse(response.text || '{"risks":[]}');
      return data.risks || [];
    } catch { return []; }
  },

  suggestHabits: async (grade: string, language: string) => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return [];
    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({ model: 'gemini-flash-lite-latest', contents: `Daily habits for ${grade} in ${language}`, config: { responseMimeType: "application/json" } });
      const data = JSON.parse(response.text || "[]");
      return data.map((r:any) => ({ id: crypto.randomUUID(), ...r, isCompleted: false }));
    } catch { return []; }
  },

  suggestFlowState: async (task: string) => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return { minutes: 25, tip: "Focus" };
    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({ model: 'gemini-flash-lite-latest', contents: `Timer for: ${task}`, config: { responseMimeType: "application/json" } });
      return JSON.parse(response.text || '{"minutes":25,"tip":"Start now"}');
    } catch { return { minutes: 25, tip: "Stay focused" }; }
  },

  getForumSuggestion: async (post: ForumPost) => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return "";
    const ai = new GoogleGenAI({ apiKey });
    try {
      const res = await ai.models.generateContent({ model: 'gemini-flash-lite-latest', contents: `Comment on: ${post.title}` });
      return res.text || "";
    } catch { return ""; }
  },

  getDailyInsight: async (profile: UserProfile, total: number, done: number) => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return "Keep going!";
    const ai = new GoogleGenAI({ apiKey });
    try {
      const res = await ai.models.generateContent({ model: 'gemini-flash-lite-latest', contents: `Motivational quote.` });
      return res.text || "Success is a journey!";
    } catch { return "Keep studying!"; }
  }
};
