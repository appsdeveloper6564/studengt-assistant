
import React, { useState } from 'react';
import { Routine } from '../types';
import { CheckCircle2, Circle, Plus, Trash2, LayoutList, AlertCircle, Timer, Sparkles } from 'lucide-react';
import AdsterraAd from './AdsterraAd';

interface RoutineTrackerProps {
  routines: Routine[];
  onUpdateRoutines: (routines: Routine[]) => void;
  onAddRoutine: (routine: Routine) => void;
}

const RoutineTracker: React.FC<RoutineTrackerProps> = ({ routines, onUpdateRoutines, onAddRoutine }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newDuration, setNewDuration] = useState('45');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddRoutine({ id: crypto.randomUUID(), title: newTitle, time: newTime || 'Anytime', isCompleted: false, durationMinutes: parseInt(newDuration) });
    setNewTitle('');
    setNewTime('');
  };

  const toggleRoutine = (id: string) => {
    onUpdateRoutines(routines.map(r => r.id === id ? { ...r, isCompleted: !r.isCompleted } : r));
  };

  const deleteRoutine = (id: string) => {
    onUpdateRoutines(routines.filter(r => r.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in slide-in-from-right-4 duration-500 pb-20">
      <div className="bg-[#0f172a] p-10 lg:p-16 rounded-[4rem] border border-slate-800 shadow-2xl">
         <div className="flex items-center gap-6 mb-12">
            <div className="w-16 h-16 bg-brand-orange text-white rounded-[2rem] flex items-center justify-center shadow-xl neon-orange">
               <Sparkles size={32} />
            </div>
            <div>
               <h2 className="text-4xl font-black text-white tracking-tight">Daily Rituals</h2>
               <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Consistency creates scholars</p>
            </div>
         </div>

         <form onSubmit={handleAdd} className="space-y-6 mb-16">
            <div className="flex flex-col sm:flex-row gap-4">
              <input required type="text" placeholder="Habit name..." value={newTitle} onChange={e => setNewTitle(e.target.value)} className="flex-1 px-8 py-5 bg-slate-900 border border-slate-800 rounded-3xl focus:border-brand-orange text-white font-bold outline-none" />
              <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="w-full sm:w-48 px-8 py-5 bg-slate-900 border border-slate-800 rounded-3xl text-white font-bold outline-none" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <select value={newDuration} onChange={e => setNewDuration(e.target.value)} className="flex-1 px-8 py-5 bg-slate-900 border border-slate-800 rounded-3xl text-white font-bold outline-none">
                <option value="45">45m Focus Session</option>
                <option value="90">90m Deep Work</option>
                <option value="120">2h Scholarly Pursuit</option>
              </select>
              <button type="submit" className="py-5 px-12 bg-brand-orange text-white rounded-3xl hover:bg-orange-600 transition-all font-black uppercase text-xs tracking-widest shadow-xl shadow-brand-orange/20 active:scale-95">Add Ritual</button>
            </div>
         </form>

         <div className="space-y-4">
            {routines.map(item => (
              <div key={item.id} className={`flex items-center gap-6 p-6 rounded-[2.5rem] transition-all border group ${item.isCompleted ? 'bg-emerald-500/5 border-emerald-500/20 grayscale' : 'bg-slate-900/50 border-slate-800 hover:border-brand-orange/40 hover:bg-slate-900'}`}>
                <button onClick={() => toggleRoutine(item.id)} className={`transition-all hover:scale-125 ${item.isCompleted ? 'text-emerald-500' : 'text-slate-700 hover:text-brand-orange'}`}>
                   {item.isCompleted ? <CheckCircle2 size={40} /> : <Circle size={40} />}
                </button>
                <div className="flex-1">
                   <h4 className={`text-2xl font-black tracking-tight ${item.isCompleted ? 'line-through text-slate-600' : 'text-white'}`}>{item.title}</h4>
                   <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange">{item.time}</span>
                      {item.durationMinutes && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1"><Timer size={12}/> {item.durationMinutes}m ritual</span>
                      )}
                   </div>
                </div>
                <button onClick={() => deleteRoutine(item.id)} className="p-3 text-slate-800 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={24} /></button>
              </div>
            ))}
         </div>
      </div>
      
      <AdsterraAd id="55ec911eca20ef6f6a3a27adad217f37" format="banner" />
    </div>
  );
};

export default RoutineTracker;
