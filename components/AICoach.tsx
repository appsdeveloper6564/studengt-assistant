
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
    { role: 'ai', content: "Hello student! I am your Expert Question Solver. Ask me any question about your studies, math problems, or concepts. \n\n⚠️ Each question costs **10 Scholar Points**." }
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

    if (userPoints < 10) {
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Deduct points
    onDeductPoints();

    const aiResponse = await getAIStudyAdvice(userMessage);
    setMessages(prev => [...prev, { role: 'ai', content: aiResponse || "I couldn't solve that. Please try again." }]);
    setIsLoading(false);
    
    if (onAIConsult) onAIConsult();
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-14rem)] flex flex-col bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-700">
      <div className="bg-academic p-8 flex items-center justify-between text-white shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
            <GraduationCap size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">Expert AI Solver</h2>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-100">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              Powered by Gemini 3
            </div>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
           <Coins size={16} className="text-yellow-300" />
           <span className="text-xs font-black uppercase tracking-widest">10 Pts / Msg</span>
        </div>

        <Sparkles className="absolute right-8 top-8 opacity-20" size={80} />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30 no-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-start gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-slate-100'
            }`}>
              {msg.role === 'user' ? <User size={22} /> : <Bot size={22} />}
            </div>
            <div className={`max-w-[85%] lg:max-w-[75%] p-5 lg:p-6 rounded-[2rem] shadow-sm text-sm lg:text-[15px] leading-relaxed font-medium ${
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
              <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Solving...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 lg:p-8 bg-white border-t border-slate-100">
        {userPoints < 10 && !isLoading && (
          <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-red-600 font-bold text-sm">
               <AlertCircle size={20} />
               Insufficient Points
            </div>
            <button 
              onClick={onWatchAd}
              className="px-4 py-2 bg-yellow-400 text-yellow-950 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-yellow-300 transition-all shadow-md"
            >
              <Play size={14} /> Get Points
            </button>
          </div>
        )}
        <form onSubmit={handleSend} className="flex gap-4">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={userPoints < 10 || isLoading}
            placeholder={userPoints < 10 ? "Get points to ask questions" : "Type your question here..."}
            className="flex-1 px-6 lg:px-8 py-4 lg:py-5 bg-slate-50 border border-slate-200 rounded-[2rem] focus:outline-none focus:border-blue-500 transition-all font-medium disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={isLoading || userPoints < 10 || !input.trim()}
            className="w-14 h-14 lg:w-16 lg:h-16 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center hover:bg-blue-700 transition-all shadow-xl disabled:opacity-50 shrink-0"
          >
            <Send size={28} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AICoach;
