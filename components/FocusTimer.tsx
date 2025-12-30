
import React, { useState, useEffect, useMemo } from 'react';
// Added Sparkles to the list of icons imported from lucide-react
import { Play, Pause, RotateCcw, Coffee, Zap, Brain, Eye, ListTodo, CheckCircle, Target, ArrowLeft, Sparkles } from 'lucide-react';
import { TaskItem } from '../types';
import AdsterraAd from './AdsterraAd';

interface FocusTimerProps {
  tasks: TaskItem[];
  onUpdateTasks: (tasks: TaskItem[]) => void;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ tasks, onUpdateTasks }) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(25 * 60);
  const [initialSeconds, setInitialSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');

  const pendingTasks = useMemo(() => tasks.filter(t => !t.isCompleted), [tasks]);
  const activeTask = useMemo(() => tasks.find(t => t.id === selectedTaskId), [tasks, selectedTaskId]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectTask = (task: TaskItem) => {
    setSelectedTaskId(task.id);
    const taskMins = task.durationMinutes || 45;
    setSeconds(taskMins * 60);
    setInitialSeconds(taskMins * 60);
    setMode('study');
    setIsActive(false);
  };

  const handleMarkComplete = () => {
    if (selectedTaskId) {
      onUpdateTasks(tasks.map(t => t.id === selectedTaskId ? { ...t, isCompleted: true } : t));
      setSelectedTaskId(null);
      setIsActive(false);
      setSeconds(25 * 60);
    }
  };

  const progress = useMemo(() => ((initialSeconds - seconds) / initialSeconds) * 100, [seconds, initialSeconds]);

  if (!selectedTaskId) {
    return (
      <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
        <div className="bg-[#0f172a] rounded-[4rem] p-12 lg:p-20 shadow-2xl border border-slate-800">
          <div className="flex items-center gap-8 mb-16">
            <div className="w-20 h-20 bg-brand-purple text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-brand-purple/20 neon-purple">
              <Target size={40} />
            </div>
            <div>
              <h2 className="text-5xl font-black text-white tracking-tight">Active Missions</h2>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">Select your next study session</p>
            </div>
          </div>

          {pendingTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pendingTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleSelectTask(task)}
                  className="group flex items-start gap-8 p-10 bg-slate-900/50 border border-slate-800 rounded-[3rem] text-left hover:bg-slate-900 hover:border-brand-purple hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="w-16 h-16 rounded-[1.5rem] bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-all shrink-0">
                    <Brain size={32} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-black text-2xl text-white mb-2 truncate group-hover:text-brand-purple transition-colors">{task.title}</h4>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black uppercase text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-4 py-1.5 rounded-full tracking-widest">
                         {task.durationMinutes || 45} MINUTE MISSION
                       </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-900/30 rounded-[4rem] border-4 border-dashed border-slate-800">
              <Sparkles size={80} className="mx-auto text-slate-800 mb-8" />
              <p className="font-black text-slate-600 uppercase tracking-[0.4em] text-sm">Awaiting fresh missions...</p>
            </div>
          )}
        </div>
        
        <AdsterraAd id="55ec911eca20ef6f6a3a27adad217f37" format="banner" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in zoom-in-95 duration-500 pb-20">
      <div className="bg-[#0f172a] rounded-[5rem] p-16 lg:p-24 shadow-2xl border border-slate-800 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-4 bg-slate-900 shadow-inner">
           <div 
             className="h-full bg-gradient-to-r from-brand-purple via-brand-orange to-brand-blue transition-all duration-1000 ease-linear shadow-[0_0_20px_rgba(249,115,22,0.4)]" 
             style={{ width: `${progress}%` }}
           />
        </div>

        <button 
          onClick={() => setSelectedTaskId(null)}
          className="absolute top-12 left-12 p-5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-3xl transition-all shadow-xl active:scale-90"
        >
          <ArrowLeft size={32} />
        </button>

        <div className="flex flex-col items-center">
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-brand-orange/10 text-brand-orange rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-brand-orange/20">
               <Zap size={14} fill="currentColor" className="animate-pulse" /> Mission Tracking Active
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter mb-4 max-w-2xl leading-[1.1]">
              {activeTask?.title}
            </h2>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.5em] opacity-60">Strategic focus window</p>
          </div>

          <div className="relative mb-20">
             <div className="absolute inset-0 bg-brand-blue/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
             <h1 className="text-[10rem] lg:text-[14rem] font-black tracking-tighter text-white tabular-nums drop-shadow-[0_0_30px_rgba(59,130,246,0.3)] select-none">
               {formatTime(seconds)}
             </h1>
          </div>

          <div className="flex gap-10 mb-20 scale-110 lg:scale-125">
            <button 
              onClick={() => setIsActive(!isActive)}
              className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center shadow-2xl transition-all active:scale-[0.85] ${
                isActive ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-brand-blue text-white shadow-brand-blue/30 neon-blue'
              }`}
            >
              {isActive ? <Pause size={48} strokeWidth={3} /> : <Play size={48} strokeWidth={3} className="ml-2" />}
            </button>
            <button 
              onClick={() => { setIsActive(false); setSeconds(initialSeconds); }}
              className="w-28 h-28 bg-slate-900 border-2 border-slate-800 text-slate-600 rounded-[2.5rem] flex items-center justify-center hover:border-white hover:text-white transition-all shadow-xl active:scale-[0.85]"
            >
              <RotateCcw size={40} />
            </button>
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-6 max-w-2xl">
             <button 
               onClick={handleMarkComplete}
               className="flex-1 py-7 bg-emerald-500 text-white rounded-3xl font-black flex items-center justify-center gap-4 shadow-2xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95 text-lg uppercase tracking-widest"
             >
               <CheckCircle size={28} /> Mission Accomplished
             </button>
             <button 
               onClick={() => { setIsActive(false); setSeconds(5 * 60); setMode('break'); }}
               className="px-12 py-7 bg-slate-900 text-slate-500 border border-slate-800 rounded-3xl font-black flex items-center justify-center gap-4 hover:bg-slate-800 hover:text-white transition-all text-lg uppercase tracking-widest"
             >
               <Coffee size={28} /> Strategic Break
             </button>
          </div>
        </div>
      </div>
      
      <AdsterraAd id="55ec911eca20ef6f6a3a27adad217f37" format="banner" />
    </div>
  );
};

export default FocusTimer;
