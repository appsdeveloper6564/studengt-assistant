
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap, Brain, Eye } from 'lucide-react';

const FocusTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(120 * 60); // Default 2 hours
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      alert(mode === 'study' ? "Great job! Time for a well-deserved break." : "Break over! Let's get back to it.");
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, mode]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const setDuration = (mins: number) => {
    setIsActive(false);
    setSeconds(mins * 60);
    setMode('study');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in zoom-in-95 duration-500">
      <div className="bg-white rounded-[3.5rem] p-12 lg:p-20 shadow-2xl border border-slate-50 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
           <div 
             className="h-full bg-brand-orange transition-all duration-1000" 
             style={{ width: `${(seconds / (mode === 'study' ? 7200 : 300)) * 100}%` }}
           />
        </div>

        <div className="flex flex-col items-center">
          <div className={`mb-8 px-6 py-2 rounded-2xl font-black uppercase tracking-widest text-xs border-2 ${
            mode === 'study' ? 'bg-orange-50 text-brand-orange border-orange-100' : 'bg-purple-50 text-brand-purple border-purple-100'
          }`}>
            {mode === 'study' ? 'Deep Work Session' : 'Short Break'}
          </div>

          <h1 className={`text-8xl lg:text-9xl font-black mb-12 tracking-tighter ${
            mode === 'study' ? 'text-brand-deep' : 'text-brand-purple'
          }`}>
            {formatTime(seconds)}
          </h1>

          <div className="flex gap-6 mb-16">
            <button 
              onClick={() => setIsActive(!isActive)}
              className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 ${
                isActive ? 'bg-slate-100 text-slate-400' : 'bg-brand-purple text-white'
              }`}
            >
              {isActive ? <Pause size={40} /> : <Play size={40} className="ml-2" />}
            </button>
            <button 
              onClick={() => { setIsActive(false); setSeconds(120 * 60); }}
              className="w-24 h-24 bg-white border-2 border-slate-100 text-slate-300 rounded-full flex items-center justify-center hover:border-brand-orange hover:text-brand-orange transition-all"
            >
              <RotateCcw size={32} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
             {[
               { label: '45m', mins: 45, icon: Zap },
               { label: '90m', mins: 90, icon: Brain },
               { label: '2h', mins: 120, icon: GraduationCap },
               { label: 'Break', mins: 5, icon: Coffee }
             ].map((btn) => (
               <button 
                key={btn.label}
                onClick={() => setDuration(btn.mins)}
                className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-brand-purple hover:bg-purple-50 transition-all flex flex-col items-center gap-2 group"
               >
                 <btn.icon size={24} className="text-slate-400 group-hover:text-brand-purple" />
                 <span className="font-black text-slate-800">{btn.label}</span>
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="bg-brand-orange/10 border border-brand-orange/20 p-8 rounded-[2.5rem] flex items-center gap-6">
         <div className="w-16 h-16 bg-brand-orange text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-200">
            <Eye size={32} />
         </div>
         <div>
            <h4 className="text-xl font-black text-brand-deep">20-20-20 Eye Protection</h4>
            <p className="text-sm font-semibold text-brand-orange/80">Every 20 mins, look at something 20 feet away for 20 seconds. This prevents study fatigue.</p>
         </div>
      </div>
    </div>
  );
};

const GraduationCap = ({ size, className }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

export default FocusTimer;
