import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Loader2, GraduationCap, Coins, AlertCircle, Camera, X, Calculator, Code, BrainCircuit, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import AdsterraAd from './AdsterraAd';

interface AICoachProps {
  tasks: any[];
  userPoints: number;
  onDeductPoints: () => void;
  onWatchAd: () => void;
}

const AICoach: React.FC<AICoachProps> = ({ userPoints, onDeductPoints, onWatchAd }) => {
  const [messages, setMessages] = useState<any[]>([
    { 
      role: 'ai', 
      content: "Namaste Scholar! I am your AI Guru. 🎓\n\nI have been expanded to FULL SCREEN. Letters are now smaller and easier to read.\n\nI can help you with:\n• 📝 High-Quality Essays\n• 🧬 Complex Math Solutions\n• 💻 Professional Coding\n\nAsk me anything below!" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    if (userPoints < 10) {
      setMessages(prev => [...prev, { role: 'ai', content: "You need 10 points for a query. Please click 'Earn Points' to continue." }]);
      return;
    }

    const userMessage = input.trim();
    const userImage = selectedImage;
    setInput('');
    setSelectedImage(null);
    setMessages(prev => [...prev, { role: 'user', content: userMessage || "Solving from image...", image: userImage }]);
    setIsLoading(true);
    onDeductPoints();

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const parts: any[] = [];
      if (userImage) parts.push({ inlineData: { mimeType: 'image/jpeg', data: userImage.split(',')[1] } });
      parts.push({ text: userMessage || "Solve the attached image problem step-by-step or provide an essay as requested." });

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts },
        config: { 
          systemInstruction: `You are Scholar Hub's "AI Guru". Provide EXTREMELY detailed, high-quality academic help. Use bold headings. Keep font size readable but professional.`,
          temperature: 0.3 
        }
      });

      setMessages(prev => [...prev, { role: 'ai', content: response.text || "I'm sorry, I couldn't process that. Try rephrasing." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Server busy. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full mx-auto flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] -mt-6 md:-mt-8 animate-in fade-in duration-500 overflow-hidden px-0">
      {/* Mega Container - Maximized to Edges */}
      <div className="flex-1 flex flex-col bg-[#0b1222] rounded-t-[1.5rem] md:rounded-t-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] border-x border-t border-slate-800 overflow-hidden relative">
        
        {/* Slim Header */}
        <div className="bg-festive-gradient p-2 md:p-4 text-white flex justify-between items-center z-20 shadow-xl border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-md border border-white/10">
                <Bot size={16} className="md:w-6 md:h-6 text-blue-100" />
            </div>
            <div>
              <h3 className="text-xs md:text-xl font-black tracking-tighter">AI Guru Pro</h3>
              <p className="text-[6px] md:text-[9px] font-bold opacity-60">High Performance Mode</p>
            </div>
          </div>
          <div className="bg-brand-deep/50 px-2 py-1 md:px-4 md:py-2 rounded-lg border border-white/5 text-[8px] md:text-sm font-black flex items-center gap-1.5 shadow-inner">
            <Coins size={10} className="text-amber-400 md:w-4 md:h-4" /> 
            <span className="text-amber-500">{userPoints} PTS</span>
          </div>
        </div>

        {/* Message Thread - Full Width and Normal Font Size */}
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto p-2 md:p-6 space-y-4 md:space-y-8 bg-gradient-to-b from-[#0f172a] to-[#01030a] scroll-smooth no-scrollbar"
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-start gap-2 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in zoom-in-95`}>
              <div className={`w-6 h-6 md:w-10 md:h-10 rounded-md md:rounded-xl flex items-center justify-center shrink-0 shadow-lg border ${msg.role === 'user' ? 'bg-brand-blue border-blue-400' : 'bg-slate-800 border-slate-700'}`}>
                  {msg.role === 'user' ? <User size={10} className="md:w-5 md:h-5 text-white" /> : <GraduationCap size={10} className="md:w-5 md:h-5 text-brand-orange" />}
              </div>
              <div className={`max-w-[95%] md:max-w-[90%] shadow-xl p-3 md:p-6 text-sm md:text-lg leading-relaxed md:leading-normal whitespace-pre-wrap transition-all ${
                msg.role === 'user' 
                  ? 'bg-brand-blue text-white rounded-xl rounded-tr-none font-medium' 
                  : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-xl rounded-tl-none shadow-black/40'
              }`}>
                  {msg.image && <img src={msg.image} className="w-full max-w-sm rounded-lg mb-3 border border-white/5 shadow-xl mx-auto" alt="Attached" />}
                  {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 animate-pulse px-1">
               <div className="w-6 h-6 md:w-10 md:h-10 bg-slate-800 rounded-md flex items-center justify-center">
                  <Bot size={10} className="text-slate-500" />
               </div>
               <div className="bg-slate-800/30 p-2 md:p-4 rounded-xl text-[8px] md:text-sm font-bold text-slate-500 italic uppercase tracking-widest">
                  Analyzing Query...
               </div>
            </div>
          )}
          <div className="h-2" />
        </div>

        {/* Lower Controls - Super Slim */}
        <div className="p-2 md:p-4 bg-[#0b1222] border-t border-slate-800/50 z-20 shrink-0">
          {userPoints < 10 && !isLoading && (
            <div className="mb-2 p-1.5 md:p-2 bg-brand-orange/5 border border-brand-orange/20 rounded-lg flex justify-between items-center gap-2 text-brand-orange">
              <span className="text-[7px] md:text-xs font-black uppercase">Low Balance</span>
              <button onClick={onWatchAd} className="bg-brand-orange text-white px-2 py-0.5 md:px-3 md:py-1 rounded-md font-black uppercase text-[6px] md:text-[10px] shadow-md">Refill</button>
            </div>
          )}
          
          <form onSubmit={handleSend} className="flex gap-1.5 md:gap-3">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                placeholder="Ask Guru..." 
                className="w-full bg-slate-900 border border-slate-800 rounded-lg md:rounded-xl px-3 py-2 md:px-5 md:py-4 outline-none focus:border-brand-blue font-bold text-xs md:text-lg text-white placeholder-slate-700"
              />
              <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-700">
                <Camera size={12} className="md:w-5 md:h-5" />
              </button>
            </div>
            <button 
              type="submit" 
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className={`w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                isLoading || (!input.trim() && !selectedImage) 
                  ? 'bg-slate-800 text-slate-700' 
                  : 'bg-brand-blue text-white shadow-lg shadow-blue-500/10'
              }`}
            >
                {isLoading ? <Loader2 className="animate-spin" size={12} /> : <Send size={14} className="md:w-6 md:h-6" />}
            </button>
          </form>
        </div>
      </div>
      
      {/* Slim Sponsor */}
      <div className="mt-1 mb-1 shrink-0 scale-75 md:scale-90 flex justify-center">
        <AdsterraAd id="55ec911eca20ef6f6a3a27adad217f37" format="banner" />
      </div>
    </div>
  );
};

export default AICoach;