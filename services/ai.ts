
import { GoogleGenAI, Type } from "@google/genai";
import { ForumPost, UserProfile, TimetableEntry, TaskItem, Routine, Quiz, GKQuestion } from "../types";

export const AIService = {
  /**
   * Helper to get API Key safely. 
   */
  getApiKey: () => {
    const key = process.env.API_KEY;
    if (!key || key === 'undefined' || key === 'null') return '';
    return key;
  },

  /**
   * Complex Academic Q&A (Guru Pro)
   * Upgraded to gemini-3-pro-preview with googleSearch tool enabled.
   */
  askGuru: async (prompt: string, grade: string, language: string, base64Image?: string) => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return { text: "API Key not configured. Please ensure API_KEY is set in your Vercel environment variables.", references: [] };

    const ai = new GoogleGenAI({ apiKey });
    const parts: any[] = [{ text: prompt }];
    if (base64Image) {
      parts.unshift({ 
        inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] } 
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts },
        config: {
          systemInstruction: `You are the Scholar Hub AI Guru, a world-class academic mentor. 
          The user is in grade: ${grade}. 
          Answer in: ${language}.
          Always provide step-by-step logic for math. Use analogies for science. 
          Use Google Search to provide accurate, up-to-date information for queries about history, geography, or current events.
          Be encouraging and concise unless deep explanation is needed.`,
          tools: [{ googleSearch: {} }],
          temperature: 0.7
        }
      });

      const text = response.text || "Guru is currently silent. Try rephrasing your question!";
      
      // Extract grounding chunks for website references
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
      const msg = error?.message || "";
      if (msg.includes('API_KEY_INVALID')) {
        return { 
          text: "The academic gateway key (API Key) is invalid. Please verify it in your environment settings. (Build-time variables might be missing).",
          references: [] 
        };
      }
      if (msg.includes('429')) {
        return { text: "Guru is handling too many students right now! Please wait a few seconds.", references: [] };
      }
      return { text: "Guru encountered a technical hiccup. Please try again in a moment!", references: [] };
    }
  },

  /**
   * AI Generated Mock Test
   */
  generateCustomQuiz: async (topic: string, grade: string): Promise<Quiz | null> => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return null;

    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a 5-question academic mock test about "${topic}" for a student in ${grade}.`,
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
                  },
                  required: ["question", "options", "correctAnswer"]
                }
              }
            }
          }
        }
      });
      const data = JSON.parse(response.text || "{}");
      return {
        id: crypto.randomUUID(),
        title: data.title || `AI Quiz: ${topic}`,
        subjectId: 'ai_generated',
        questions: data.questions
      };
    } catch (e) {
      console.error("Quiz generation failed:", e);
      return null;
    }
  },

  /**
   * Generate 4-hourly GK Question
   */
  generateGKQuestion: async (language: string): Promise<GKQuestion | null> => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return null;

    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a random, high-quality General Knowledge (GK) question. Ensure it has 4 unique options and one correct answer. Target audience is students. Language: ${language}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER },
            },
            required: ["question", "options", "correctAnswer"]
          }
        }
      });
      const data = JSON.parse(response.text || "{}");
      return {
        id: crypto.randomUUID(),
        question: data.question,
        options: data.options,
        correctAnswer: data.correctAnswer,
        isAnswered: false
      };
    } catch (e) {
      console.error("GK generation failed:", e);
      return null;
    }
  },

  /**
   * Alias for generateCustomQuiz used in LearningHub
   */
  generateQuiz: async (summary: string): Promise<Quiz | null> => {
    return AIService.generateCustomQuiz(`Quiz based on this content: ${summary.substring(0, 500)}`, "appropriate level");
  },

  /**
   * Suggest task priority based on importance and proximity
   */
  suggestPriority: async (tasks: TaskItem[]) => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return [];

    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Given these study tasks, suggest which ones should be prioritized and why: ${JSON.stringify(tasks.map(t => ({ title: t.title, dueDate: t.dueDate, priority: t.priority })))}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                taskTitle: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["taskTitle", "reason"]
            }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Priority suggestion failed:", e);
      return [];
    }
  },

  /**
   * Break down a complex task into subtasks
   */
  breakdownTask: async (title: string) => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return [];

    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Break down this study task into 3-5 small, actionable sub-tasks: "${title}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Task breakdown failed:", e);
      return [];
    }
  },

  /**
   * Detect burnout risks in schedule
   */
  detectBurnout: async (entries: TimetableEntry[]) => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return [];

    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this study schedule for potential burnout risks: ${JSON.stringify(entries)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              risks: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });
      const data = JSON.parse(response.text || '{"risks": []}');
      return data.risks || [];
    } catch (e) {
      console.error("Burnout detection failed:", e);
      return [];
    }
  },

  /**
   * Suggest daily rituals/habits
   */
  suggestHabits: async (grade: string, language: string): Promise<Routine[]> => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return [];

    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Suggest 3-5 daily study habits/rituals for a student in grade ${grade}. Answer in ${language}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                time: { type: Type.STRING },
                durationMinutes: { type: Type.INTEGER }
              },
              required: ["title", "time"]
            }
          }
        }
      });
      const data = JSON.parse(response.text || "[]");
      return data.map((r: any) => ({
        id: crypto.randomUUID(),
        title: r.title,
        time: r.time,
        isCompleted: false,
        durationMinutes: r.durationMinutes || 30
      }));
    } catch (e) {
      console.error("Habit suggestion failed:", e);
      return [];
    }
  },

  /**
   * Suggest optimal focus timer settings
   */
  suggestFlowState: async (taskTitle: string) => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return { minutes: 25, tip: "Stay focused!" };

    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Suggest an optimal focus duration and tip for: "${taskTitle}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              minutes: { type: Type.INTEGER },
              tip: { type: Type.STRING }
            },
            required: ["minutes", "tip"]
          }
        }
      });
      return JSON.parse(response.text || '{"minutes": 25, "tip": "Just start for 5 minutes."}');
    } catch (e) {
      console.error("Flow state suggestion failed:", e);
      return { minutes: 25, tip: "Stay focused!" };
    }
  },

  getForumSuggestion: async (post: ForumPost): Promise<string> => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return "";

    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a helpful student peer. Provide a concise response to: ${post.title}`,
      });
      return response.text || "Great discussion!";
    } catch (error) {
      return "Thanks for starting this discussion!";
    }
  },

  getDailyInsight: async (profile: UserProfile, total: number, done: number): Promise<string> => {
    const apiKey = AIService.getApiKey();
    if (!apiKey) return "Keep pushing towards your goals!";

    const ai = new GoogleGenAI({ apiKey });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Student ${profile.name} completed ${done}/${total} tasks. Give a short powerful motivational quote.`,
      });
      return response.text || "Persistence is the key to success!";
    } catch (error) { return "Focus on your goals!"; }
  }
};
