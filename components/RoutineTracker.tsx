
import React, { useState } from 'react';
import { Routine } from '../types';
import { CheckCircle2, Circle, Plus, Trash2, LayoutList } from 'lucide-react';

interface RoutineTrackerProps {
  routines: Routine[];
  onUpdateRoutines: (routines: Routine[]) => void;
  onAddRoutine: (routine: Routine) => void;
}

const RoutineTracker: React.FC<RoutineTrackerProps> = ({ routines, onUpdateRoutines, onAddRoutine }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    onAddRoutine({
      id: crypto.randomUUID(),
      title: newTitle,
      time: newTime || 'Anytime',
      isCompleted: false,
    });
    
    setNewTitle('');
    setNewTime('');
  };

  const toggleRoutine = (id: string) => {
    onUpdateRoutines(routines.map(r => r.id === id ? { ...r, isCompleted: !r.isCompleted } : r));
  };

  const deleteRoutine = (id: string) => {
    onUpdateRoutines(routines.filter(r => r.id !== id));
  };

  const resetAll = () => {
    onUpdateRoutines(routines.map(r => ({ ...r, isCompleted: false })));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="bg-white p-10 lg:p-12 rounded-[3rem] shadow-sm border border-slate-100">
         <div className="flex items-center justify-between mb-10">
            <div>
               <h2 className="text-3xl font-black text-slate-800 tracking-tight">Daily Habits</h2>
               <p className="text-slate-400 font-bold mt-1">Consistency is the secret to mastery.</p>
            </div>
            <button 
              onClick={resetAll}
              className="px-6 py-3 text-sm font-black text-blue-600 hover:bg-blue-50 rounded-2xl transition-all uppercase tracking-widest border border-blue-100"
            >
              Reset
            </button>
         </div>

         <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 mb-10">
            <input 
              required
              type="text" 
              placeholder="e.g., Morning Meditation" 
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all shadow-sm"
            />
            <input 
              type="text" 
              placeholder="08:00 AM" 
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
              className="w-full sm:w-40 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold transition-all shadow-sm"
            />
            <button type="submit" className="py-4 px-8 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-100 font-black uppercase text-sm tracking-widest">
              Add Habit
            </button>
         </form>

         <div className="space-y-4">
            {routines.map(item => (
              <div 
                key={item.id} 
                className={`flex items-center gap-5 p-6 rounded-[2rem] transition-all border group ${
                  item.isCompleted 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                    : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-md'
                }`}
              >
                <button 
                  onClick={() => toggleRoutine(item.id)}
                  className={`transition-all hover:scale-125 ${item.isCompleted ? 'text-emerald-500' : 'text-slate-200 hover:text-blue-500'}`}
                >
                   {item.isCompleted ? <CheckCircle2 size={32} /> : <Circle size={32} />}
                </button>
                <div className="flex-1">
                   <h4 className={`text-xl font-black leading-tight mb-1 ${item.isCompleted ? 'line-through opacity-60' : 'text-slate-800'}`}>
                     {item.title}
                   </h4>
                   <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${item.isCompleted ? 'opacity-50' : 'text-blue-400'}`}>
                     {item.time}
                   </span>
                </div>
                <button 
                  onClick={() => deleteRoutine(item.id)}
                  className="p-3 text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                   <Trash2 size={20} />
                </button>
              </div>
            ))}
            {routines.length === 0 && (
              <div className="text-center py-20 text-slate-300">
                 <LayoutList size={80} className="mx-auto mb-6 opacity-5" />
                 <p className="text-xl font-black uppercase tracking-[0.2em]">No Habits Set</p>
              </div>
            )}
         </div>

         {routines.length > 0 && (
           <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-100">
              <div className="text-center md:text-left">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Routine Accuracy</div>
                <div className="text-4xl font-black text-slate-800">
                  {Math.round((routines.filter(r => r.isCompleted).length / routines.length) * 100)}%
                </div>
              </div>
              <div className="w-full md:w-2/3 h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                 <div 
                  className="h-full bg-emerald-500 transition-all duration-1000 ease-out shadow-lg" 
                  style={{ width: `${(routines.filter(r => r.isCompleted).length / routines.length) * 100}%` }}
                 />
              </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default RoutineTracker;
