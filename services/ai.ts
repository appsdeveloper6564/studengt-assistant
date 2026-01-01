
import { GoogleGenAI, Type } from "@google/genai";
import { ForumPost, UserProfile, TimetableEntry, TaskItem, Routine, Quiz, GKQuestion } from "../types";

export const AIService = {
  /**
   * Complex Academic Q&A (Guru Pro)
   * Using gemini-3-pro-preview for advanced reasoning and Google Search Grounding.
   */
  askGuru: async (prompt: string, grade: string, language: string, base64Image?: string) => {
    // Create a new instance for every call to ensure the latest API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
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
      if (msg.includes('API_KEY_INVALID') || msg.includes('403')) {
        return { 
          text: "Guru is having trouble accessing the academic gateway. Please verify your connection or API configuration.",
          references: [] 
        };
      }
      return { 
        text: "Guru is currently busy analyzing new data. Please try again in a moment!", 
        references: [] 
      };
    }
  },

  /**
   * AI Generated Mock Test
   */
  generateCustomQuiz: async (topic: string, grade: string): Promise<Quiz | null> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a random, high-quality General Knowledge (GK) question. Ensure it has 4 unique options and one correct answer. Language: ${language}`,
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

  suggestPriority: async (tasks: TaskItem[]) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Prioritize these tasks: ${JSON.stringify(tasks.map(t => ({ title: t.title, dueDate: t.dueDate })))}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                taskTitle: { type: Type.STRING },
                reason: { type: Type.STRING }
              }
            }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    } catch (e) {
      return [];
    }
  },

  breakdownTask: async (title: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Break down: "${title}"`,
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
      return [];
    }
  },

  detectBurnout: async (entries: TimetableEntry[]) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Check burnout: ${JSON.stringify(entries)}`,
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
      return [];
    }
  },

  suggestHabits: async (grade: string, language: string): Promise<Routine[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Suggest habits for grade ${grade} in ${language}.`,
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
              }
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
      return [];
    }
  },

  suggestFlowState: async (taskTitle: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Flow state for: "${taskTitle}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              minutes: { type: Type.INTEGER },
              tip: { type: Type.STRING }
            }
          }
        }
      });
      return JSON.parse(response.text || '{"minutes": 25, "tip": "Focus on one small part first."}');
    } catch (e) {
      return { minutes: 25, tip: "Stay focused!" };
    }
  },

  getForumSuggestion: async (post: ForumPost): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Concise peer response to: ${post.title}`,
      });
      return response.text || "Great discussion!";
    } catch (error) {
      return "Thanks for starting this discussion!";
    }
  },

  getDailyInsight: async (profile: UserProfile, total: number, done: number): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Motivational quote for student who did ${done}/${total} tasks.`,
      });
      return response.text || "Persistence is the key to success!";
    } catch (error) { return "Focus on your goals!"; }
  }
};
