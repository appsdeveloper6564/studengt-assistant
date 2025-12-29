
import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap, Brain, Eye, ListTodo, CheckCircle, Target, ArrowLeft } from 'lucide-react';
import { TaskItem } from '../types';

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
      // Native notification logic would go here
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

  const progress = useMemo(() => {
    return ((initialSeconds - seconds) / initialSeconds) * 100;
  }, [seconds, initialSeconds]);

  if (!selectedTaskId) {
    return (
      <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
        <div className="bg-white rounded-[3.5rem] p-10 lg:p-16 shadow-2xl border border-slate-50">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-16 h-16 bg-brand-purple text-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-purple-100">
              <Target size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-brand-deep">Select a Mission</h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Start a timed study session</p>
            </div>
          </div>

          {pendingTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleSelectTask(task)}
                  className="group flex items-start gap-6 p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-left hover:bg-white hover:border-brand-purple hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-all shrink-0">
                    <ListTodo size={24} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-black text-lg text-slate-800 mb-1 truncate">{task.title}</h4>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black uppercase text-brand-orange bg-orange-50 px-2.5 py-1 rounded-lg">
                         {task.durationMinutes || 45} MINS
                       </span>
                       <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${
                         task.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                       }`}>
                         {task.priority}
                       </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50/50 rounded-[3rem] border-4 border-dashed border-slate-100">
              <Brain size={64} className="mx-auto text-slate-200 mb-6" />
              <p className="font-black text-slate-400 uppercase tracking-widest text-sm">No pending tasks found</p>
              <p className="text-xs text-slate-300 font-bold mt-2">Add a task first to start a timed session.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in zoom-in-95 duration-500">
      <div className="bg-white rounded-[4rem] p-12 lg:p-20 shadow-2xl border border-slate-50 text-center relative overflow-hidden">
        {/* Progress Bar Background */}
        <div className="absolute top-0 left-0 w-full h-3 bg-slate-50">
           <div 
             className="h-full bg-gradient-to-r from-brand-purple to-brand-orange transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(249,115,22,0.4)]" 
             style={{ width: `${progress}%` }}
           />
        </div>

        <button 
          onClick={() => setSelectedTaskId(null)}
          className="absolute top-8 left-8 p-4 text-slate-300 hover:text-brand-purple hover:bg-purple-50 rounded-2xl transition-all"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="flex flex-col items-center">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 text-brand-orange rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-orange-100">
               <Zap size={12} fill="currentColor" /> Live Mission
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-brand-deep tracking-tight mb-2 max-w-lg leading-tight">
              {activeTask?.title}
            </h2>
            <p className="text-xs font-black text-slate-300 uppercase tracking-[0.3em]">Time to complete</p>
          </div>

          <h1 className="text-8xl lg:text-9xl font-black mb-12 tracking-tighter text-brand-deep tabular-nums">
            {formatTime(seconds)}
          </h1>

          <div className="flex gap-8 mb-16">
            <button 
              onClick={() => setIsActive(!isActive)}
              className={`w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all active:scale-90 ${
                isActive ? 'bg-slate-100 text-slate-400 border border-slate-200' : 'bg-brand-purple text-white shadow-purple-200'
              }`}
            >
              {isActive ? <Pause size={40} /> : <Play size={40} className="ml-2" />}
            </button>
            <button 
              onClick={() => { setIsActive(false); setSeconds(initialSeconds); }}
              className="w-24 h-24 bg-white border-2 border-slate-100 text-slate-300 rounded-[2rem] flex items-center justify-center hover:border-brand-orange hover:text-brand-orange transition-all shadow-xl shadow-slate-100"
            >
              <RotateCcw size={32} />
            </button>
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-4">
             <button 
               onClick={handleMarkComplete}
               className="flex-1 py-6 bg-emerald-500 text-white rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-2xl shadow-emerald-200 hover:bg-emerald-600 transition-all active:scale-95"
             >
               <CheckCircle size={24} /> I've Finished!
             </button>
             <button 
               onClick={() => { setIsActive(false); setSeconds(5 * 60); setMode('break'); }}
               className="px-10 py-6 bg-slate-50 text-slate-500 border border-slate-200 rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-white hover:border-brand-purple hover:text-brand-purple transition-all"
             >
               <Coffee size={24} /> Take a Break
             </button>
          </div>
        </div>
      </div>

      <div className="bg-brand-purple/5 border border-brand-purple/10 p-8 rounded-[3rem] flex items-center gap-6 relative overflow-hidden group">
         <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:rotate-12 transition-transform duration-700">
            <Brain size={120} />
         </div>
         <div className="w-16 h-16 bg-white border border-purple-100 text-brand-purple rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
            <Eye size={32} />
         </div>
         <div className="relative z-10">
            <h4 className="text-xl font-black text-brand-deep">Concentration Mode</h4>
            <p className="text-sm font-semibold text-slate-500">The human brain focuses best for {activeTask?.durationMinutes || 45} minutes. Stay away from your phone and social media until the timer ends.</p>
         </div>
      </div>
    </div>
  );
};

export default FocusTimer;
