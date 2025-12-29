
import React, { useState, useRef, useEffect } from 'react';
import { TaskItem } from '../types';
import { Bot, Send, Sparkles, User, Loader2, GraduationCap, Coins, AlertCircle, Play } from 'lucide-react';
import { getAIStudyAdvice } from '../services/gemini';

interface AICoachProps {
  tasks: TaskItem[];
  userPoints: number;
  onDeductPoints: () => void;
  onWatchAd: () => void;
  onAIConsult?: () => void;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const AICoach: React.FC<AICoachProps> = ({ tasks, userPoints, onDeductPoints, onWatchAd, onAIConsult }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "Namaste! I am your AI Scholar. Ask me anything about Indian history, science, math, or complex study concepts. \n\n⚠️ Each solution costs **10 Scholar Points**." }
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

    if (userPoints < 10) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    onDeductPoints();

    const aiResponse = await getAIStudyAdvice(userMessage);
    setMessages(prev => [...prev, { role: 'ai', content: aiResponse || "I'm processing too much academic data right now. Please try again in a moment." }]);
    setIsLoading(false);
    
    if (onAIConsult) onAIConsult();
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-14rem)] flex flex-col bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-50 animate-in zoom-in-95 duration-700">
      <div className="bg-festive-gradient p-10 flex items-center justify-between text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center border border-white/20 shadow-inner">
            <Bot size={36} className="text-orange-200" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight">Scholar AI</h2>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-100 mt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
              Active & Intelligent
            </div>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center gap-3 bg-white/15 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md">
           <Coins size={20} className="text-yellow-300" />
           <span className="text-sm font-black uppercase tracking-widest">10 Pts</span>
        </div>

        <Sparkles className="absolute right-10 top-10 opacity-10 animate-pulse" size={100} />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 bg-slate-50/20 no-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              msg.role === 'user' ? 'bg-brand-purple text-white' : 'bg-white text-brand-purple border border-slate-100'
            }`}>
              {msg.role === 'user' ? <User size={24} /> : <GraduationCap size={24} />}
            </div>
            <div className={`max-w-[85%] lg:max-w-[75%] p-6 lg:p-8 rounded-[2.5rem] shadow-sm text-base leading-relaxed font-semibold ${
              msg.role === 'user' 
                ? 'bg-brand-purple text-white rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-50 rounded-tl-none whitespace-pre-wrap'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 rounded-2xl bg-white text-brand-purple flex items-center justify-center shadow-lg border border-slate-100">
              <Bot size={24} />
            </div>
            <div className="px-8 py-5 bg-white border border-slate-50 rounded-[2.5rem] rounded-tl-none shadow-sm flex items-center gap-4">
              <Loader2 className="animate-spin text-brand-orange" size={20} />
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Generating Solution...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 lg:p-10 bg-white border-t border-slate-50">
        {userPoints < 10 && !isLoading && (
          <div className="mb-6 p-6 bg-orange-50 border border-orange-100 rounded-[2rem] flex items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-brand-orange font-black text-sm uppercase tracking-widest">
               <AlertCircle size={24} />
               Insufficient Scholar Points
            </div>
            <button 
              onClick={onWatchAd}
              className="px-6 py-3 bg-brand-orange text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg active:scale-95"
            >
              <Play size={16} fill="currentColor" /> Claim 10 Pts
            </button>
          </div>
        )}
        <form onSubmit={handleSend} className="flex gap-6">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={userPoints < 10 || isLoading}
            placeholder={userPoints < 10 ? "Get points to unlock AI assistance" : "Describe your problem here..."}
            className="flex-1 px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] focus:outline-none focus:border-brand-purple focus:ring-4 focus:ring-purple-50 transition-all font-bold disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={isLoading || userPoints < 10 || !input.trim()}
            className="w-16 h-16 lg:w-20 lg:h-20 bg-brand-purple text-white rounded-[2rem] flex items-center justify-center hover:bg-brand-deep transition-all shadow-2xl shadow-purple-200 disabled:opacity-50 shrink-0 active:scale-95"
          >
            <Send size={32} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AICoach;
