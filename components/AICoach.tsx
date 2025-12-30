
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Loader2, GraduationCap, Coins, AlertCircle, Camera, X, Calculator, Code, BrainCircuit } from 'lucide-react';
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
    { role: 'ai', content: "Namaste! I am your AI Guru. Ask me anything about Math, Science, or Coding. Each expert solution costs **10 Points**." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    if (userPoints < 10) {
      setMessages(prev => [...prev, { role: 'ai', content: "You need 10 points for a query. Click 'Earn Points' to continue!" }]);
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
      parts.push({ text: userMessage || "Solve the attached image problem step-by-step." });

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts },
        config: { systemInstruction: "You are a professional academic coach. Provide step-by-step clear explanations.", temperature: 0.1 }
      });

      setMessages(prev => [...prev, { role: 'ai', content: response.text || "Sorry, I couldn't solve that." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Connection error. Points have been deducted but I'll try better next time!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-14rem)] flex flex-col space-y-4">
      <div className="flex-1 flex flex-col bg-[#0f172a] rounded-[3rem] shadow-2xl border border-slate-800/50 overflow-hidden">
        <div className="bg-festive-gradient p-8 text-white flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
                <Bot size={28} />
            </div>
            <div>
                <h3 className="text-xl font-black">Expert AI Guru</h3>
                <p className="text-xs font-bold text-blue-100">Powered by Gemini 3 Pro</p>
            </div>
          </div>
          <div className="bg-brand-deep/50 px-4 py-2 rounded-xl border border-white/10 text-sm font-black flex items-center gap-2">
            <Coins size={16} className="text-amber-500" /> {userPoints} PTS
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-brand-blue' : 'bg-slate-800'}`}>
                  {msg.role === 'user' ? <User size={18} /> : <GraduationCap size={18} />}
              </div>
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-brand-blue text-white' : 'bg-slate-800/50 text-slate-200'} p-5 rounded-[1.8rem] text-sm leading-relaxed whitespace-pre-wrap`}>
                  {msg.image && <img src={msg.image} className="w-full rounded-xl mb-3 border border-white/10 shadow-lg" />}
                  {msg.content}
              </div>
            </div>
          ))}
          {isLoading && <Loader2 className="animate-spin text-brand-orange mx-auto" size={32} />}
        </div>

        <div className="p-6 bg-[#0f172a] border-t border-slate-800/50">
          {userPoints < 10 && !isLoading && (
            <div className="mb-4 p-4 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl flex justify-between items-center text-brand-orange text-xs font-black">
              <span className="flex items-center gap-2"><AlertCircle size={14} /> LOW POINTS BALANCE</span>
              <button onClick={onWatchAd} className="bg-brand-orange text-white px-4 py-1.5 rounded-lg shadow-lg">EARN 10 PTS</button>
            </div>
          )}
          <form onSubmit={handleSend} className="flex gap-3">
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Ask Guru anything..." 
              className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 outline-none focus:border-brand-blue transition-all font-bold"
            />
            <button type="submit" className="w-14 h-14 bg-brand-blue text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all">
                <Send size={24} />
            </button>
          </form>
        </div>
      </div>
      
      {/* Banner Ad below Guru chat */}
      <AdsterraAd id="55ec911eca20ef6f6a3a27adad217f37" format="banner" />
    </div>
  );
};

export default AICoach;
