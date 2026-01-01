
import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Loader2, GraduationCap, Coins, Camera, X, BrainCircuit, Trash2, Play, ExternalLink, Files, AlertCircle } from 'lucide-react';
import { StorageService } from '../services/storage';
import { AIService } from '../services/ai';
import AdsterraAd from './AdsterraAd';
import { ChatMessage } from '../types';

interface AICoachProps {
  tasks: any[];
  userPoints: number;
  onDeductPoints: (amount: number) => void;
  onWatchAd: () => void;
}

const AICoach: React.FC<AICoachProps> = ({ userPoints, onDeductPoints, onWatchAd }) => {
  const profile = StorageService.getProfile();
  const [messages, setMessages] = useState<ChatMessage[]>(StorageService.getChatHistory());
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      const welcome = { 
        role: 'ai', 
        content: profile.language === 'Hindi' 
          ? "नमस्ते! मैं आपका AI गुरु हूँ। मैं आपके गणित, विज्ञान और निबंधों में मदद कर सकता हूँ। पूछिए!"
          : "Namaste Scholar! I am your AI Guru. 🎓 I can solve Math, Science, and help with Essays. Ask me anything!",
        timestamp: new Date().toLocaleTimeString()
      } as ChatMessage;
      setMessages([welcome]);
      StorageService.saveChatHistory([welcome]);
    }
  }, [profile.language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    if (userPoints < 10) {
      alert("You need at least 10 Points to consult the Guru. Watch an ad to earn more!");
      return; 
    }

    const userMsg: ChatMessage = { 
      role: 'user', 
      content: input.trim(), 
      image: selectedImage || undefined, 
      timestamp: new Date().toLocaleTimeString() 
    };
    
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    StorageService.saveChatHistory(updatedHistory);
    
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const { text, references } = await AIService.askGuru(
        userMsg.content || "Analyze this",
        profile.grade,
        profile.language || 'English',
        userMsg.image || undefined
      );

      // Deduct points only for real responses
      const isError = text.includes("API Key Missing") || text.includes("Invalid API Key");
      if (!isError) {
        onDeductPoints(10);
      }

      const aiMsg: ChatMessage = { 
        role: 'ai', 
        content: text, 
        references: references,
        timestamp: new Date().toLocaleTimeString() 
      };
      
      const finalHistory = [...updatedHistory, aiMsg];
      setMessages(finalHistory);
      StorageService.saveChatHistory(finalHistory);
    } catch (err) {
      const errorMsg: ChatMessage = { 
        role: 'ai', 
        content: "Error connecting to Guru. Please check your internet connection.", 
        timestamp: new Date().toLocaleTimeString() 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (confirm("Clear chat history?")) {
      const empty: ChatMessage[] = [];
      setMessages(empty);
      StorageService.saveChatHistory(empty);
    }
  };

  return (
    <div className="w-full max-w-full mx-auto flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] -mt-6 md:-mt-8 animate-in fade-in duration-500 overflow-hidden px-0">
      <div className="flex-1 flex flex-col bg-[#0b1222] rounded-t-[1.5rem] md:rounded-t-[2.5rem] shadow-2xl border-x border-t border-slate-800 overflow-hidden relative">
        
        <div className="bg-festive-gradient p-4 text-white flex justify-between items-center z-20 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-md border border-white/10">
                <Bot size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black">AI Guru Pro</h3>
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Web Grounding Active • {profile.language}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-black/20 px-3 py-1 rounded-full border border-white/10 text-[10px] font-black flex items-center gap-1.5">
               <Coins size={12} className="text-brand-orange" /> {userPoints}
            </div>
            <button onClick={clearHistory} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Trash2 size={18} /></button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-[#01030a] no-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-brand-blue border-blue-400' : 'bg-slate-800 border-slate-700'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <GraduationCap size={16} className="text-brand-orange" />}
              </div>
              <div className={`max-w-[85%] p-5 text-sm md:text-base leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user' ? 'bg-brand-blue text-white rounded-2xl rounded-tr-none' : 
                (msg.content.includes("API Key Missing") ? 'bg-red-950/40 text-red-400 border border-red-900/50' : 'bg-slate-900 text-slate-100 border border-slate-800') + ' rounded-2xl rounded-tl-none'
              }`}>
                  {msg.image && <img src={msg.image} className="w-full max-w-sm rounded-lg mb-3 shadow-xl" alt="Query" />}
                  
                  {msg.content.includes("API Key Missing") && <AlertCircle className="inline-block mr-2 mb-1" size={16} />}
                  {msg.content}

                  {/* Display Search References */}
                  {msg.references && msg.references.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-800/50">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <ExternalLink size={10} /> Web Sources
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.references.map((ref, idx) => (
                          <a 
                            key={idx} 
                            href={ref.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-brand-blue rounded-lg text-[10px] font-bold transition-all border border-slate-700 max-w-full"
                          >
                            <Files size={10} />
                            <span className="truncate max-w-[120px] md:max-w-[200px]">{ref.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-2 text-[9px] opacity-40 uppercase font-black">{msg.timestamp}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex flex-col gap-2 ml-12 animate-pulse">
               <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Guru Searching Web...</div>
               <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-blue w-1/2 animate-infinite-scroll"></div>
               </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-[#0b1222] border-t border-slate-800">
          {userPoints < 10 && (
            <div className="mb-4 p-4 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Coins size={18} className="text-brand-orange" />
                 <span className="text-[10px] font-black text-brand-orange uppercase">Insufficent Points (10 Needed)</span>
              </div>
              <button onClick={onWatchAd} className="bg-brand-orange text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg active:scale-95 transition-all">
                <Play size={12} fill="currentColor" /> Earn +10 Points
              </button>
            </div>
          )}
          
          <form onSubmit={handleSend} className="flex gap-3">
            <input 
              disabled={userPoints < 10 || isLoading}
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder={userPoints < 10 ? "Recharge points to consult the Guru..." : "Type your question (History, Math, etc.)"}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 outline-none focus:border-brand-blue font-bold text-white placeholder-slate-600 disabled:opacity-50"
            />
            <button type="submit" disabled={isLoading || userPoints < 10} className="w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-50 disabled:grayscale">
                <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
