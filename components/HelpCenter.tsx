
import React from 'react';
import { HelpCircle, Book, Zap, Coins, Bot, ShieldCheck, ChevronRight, MessageSquare, Info } from 'lucide-react';

const HelpCenter: React.FC = () => {
  const faqs = [
    { q: "How do I earn Scholar Points?", a: "Complete study tasks (+5 pts), watch educational reward ads (+10 pts), or finish a mock test (+15 pts)." },
    { q: "What is AI Guru Pro?", a: "It's a specialized AI coach that uses your grade level and preferred language to solve math problems, write essays, and explain concepts." },
    { q: "Can I use this offline?", a: "Yes! Most features like tasks, timetable, and learning hub work offline. AI features require an internet connection." }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="bg-brand-blue/10 border border-brand-blue/20 p-10 rounded-[3.5rem] relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white mb-4">Scholar <span className="text-brand-blue">Support</span></h2>
          <p className="text-slate-400 font-medium max-w-xl">Master your productivity hub and learn how to leverage AI for academic excellence.</p>
        </div>
        <HelpCircle size={150} className="absolute -bottom-10 -right-10 text-brand-blue opacity-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-xl font-black text-white flex items-center gap-3">
             <Zap size={24} className="text-brand-orange" /> Quick Start Guide
          </h3>
          <div className="space-y-4">
            {[
              { icon: Bot, title: "AI Guru", desc: "Upload images of problems or ask complex questions." },
              { icon: Coins, title: "Point System", desc: "Unlock AI queries and premium features using points." },
              { icon: Book, title: "Learning Hub", desc: "Create flashcards manually or use AI to summarize notes." }
            ].map((step, idx) => (
              <div key={idx} className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 flex items-center gap-6 group hover:border-brand-blue transition-all">
                <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center text-brand-blue border border-slate-800 group-hover:bg-brand-blue group-hover:text-white">
                  <step.icon size={20} />
                </div>
                <div>
                  <h4 className="font-black text-white">{step.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black text-white flex items-center gap-3">
             <MessageSquare size={24} className="text-brand-purple" /> Frequently Asked
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 space-y-2">
                <h4 className="text-sm font-black text-slate-200">{faq.q}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <ShieldCheck size={32} className="text-emerald-500" />
          <div>
            <h4 className="font-black text-white">Privacy & Safety</h4>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Your data is stored locally on this device.</p>
          </div>
        </div>
        <button className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all flex items-center gap-2">
          Contact Support <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default HelpCenter;
