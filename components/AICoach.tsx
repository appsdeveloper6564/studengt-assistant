
import React, { useState, useRef, useEffect } from 'react';
import { TaskItem } from '../types';
import { Bot, Send, Sparkles, User, Loader2, GraduationCap } from 'lucide-react';
import { getAIStudyAdvice } from '../services/gemini';

interface AICoachProps {
  tasks: TaskItem[];
  onAIConsult?: () => void;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const AICoach: React.FC<AICoachProps> = ({ tasks, onAIConsult }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Hi! I'm your Student AI Coach. I can help you break down complex tasks, suggest study schedules, or explain difficult concepts. How can I help you excel today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const pendingTasksList = tasks.filter(t => !t.isCompleted).map(t => t.title).join(', ');
    const context = `
      User Query: ${userMessage}
      Current Pending Tasks: ${pendingTasksList || 'None'}
      Please provide a helpful, organized response as an academic coach.
    `;

    const aiResponse = await getAIStudyAdvice(context);
    setMessages(prev => [...prev, { role: 'ai', content: aiResponse || "Sorry, I couldn't process that." }]);
    setIsLoading(false);
    
    // Trigger achievement check
    if (onAIConsult) onAIConsult();
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-14rem)] flex flex-col bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-700">
      <div className="bg-academic p-8 flex items-center gap-5 text-white shadow-lg relative overflow-hidden">
        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 relative z-10">
          <GraduationCap size={32} />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black tracking-tight">AI Study Coach</h2>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-100">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            Analyzing Academic Context
          </div>
        </div>
        <Sparkles className="absolute right-8 top-8 opacity-20" size={80} />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-slate-100'
            }`}>
              {msg.role === 'user' ? <User size={22} /> : <Bot size={22} />}
            </div>
            <div className={`max-w-[75%] p-6 rounded-[2rem] shadow-sm text-[15px] leading-relaxed font-medium ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none whitespace-pre-wrap'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-lg border border-slate-100">
              <Bot size={22} />
            </div>
            <div className="px-6 py-4 bg-white border border-slate-100 rounded-[2rem] rounded-tl-none shadow-sm flex items-center gap-3">
              <Loader2 className="animate-spin text-blue-600" size={18} />
              <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Generating Insight...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="flex gap-4">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask your coach anything about your studies..."
            className="flex-1 px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] focus:outline-none focus:border-blue-500 focus:ring-8 focus:ring-blue-50 transition-all font-medium"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="w-16 h-16 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 active:scale-95 shrink-0"
          >
            <Send size={28} />
          </button>
        </form>
        <div className="flex items-center gap-2 mt-6 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] justify-center">
          Intelligence powered by Gemini Pro
        </div>
      </div>
    </div>
  );
};

export default AICoach;
