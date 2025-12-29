
import React, { useState } from 'react';
import { Routine } from '../types';
import { CheckCircle2, Circle, Plus, Trash2, LayoutList } from 'lucide-react';

interface RoutineTrackerProps {
  routines: Routine[];
  setRoutines: (routines: Routine[]) => void;
}

const RoutineTracker: React.FC<RoutineTrackerProps> = ({ routines, setRoutines }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');

  const addRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newRoutine: Routine = {
      id: crypto.randomUUID(),
      title: newTitle,
      time: newTime || 'Anytime',
      isCompleted: false,
    };
    setRoutines([...routines, newRoutine]);
    setNewTitle('');
    setNewTime('');
  };

  const toggleRoutine = (id: string) => {
    setRoutines(routines.map(r => r.id === id ? { ...r, isCompleted: !r.isCompleted } : r));
  };

  const deleteRoutine = (id: string) => {
    setRoutines(routines.filter(r => r.id !== id));
  };

  const resetAll = () => {
    setRoutines(routines.map(r => ({ ...r, isCompleted: false })));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
         <div className="flex items-center justify-between mb-8">
            <div>
               <h2 className="text-3xl font-bold text-slate-800">Daily Routine</h2>
               <p className="text-slate-500">Track your daily habits and consistency.</p>
            </div>
            <button 
              onClick={resetAll}
              className="px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
            >
              Reset for Today
            </button>
         </div>

         <form onSubmit={addRoutine} className="flex gap-3 mb-8">
            <input 
              required
              type="text" 
              placeholder="e.g., Morning reading" 
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors"
            />
            <input 
              type="text" 
              placeholder="08:00 AM" 
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
              className="w-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button type="submit" className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-transform active:scale-95 shadow-lg shadow-blue-200">
              <Plus size={24} />
            </button>
         </form>

         <div className="space-y-3">
            {routines.map(item => (
              <div 
                key={item.id} 
                className={`flex items-center gap-4 p-5 rounded-3xl transition-all border ${
                  item.isCompleted 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                    : 'bg-white border-slate-100 hover:border-blue-200'
                }`}
              >
                <button 
                  onClick={() => toggleRoutine(item.id)}
                  className={`transition-colors ${item.isCompleted ? 'text-emerald-500' : 'text-slate-300 hover:text-blue-500'}`}
                >
                   {item.isCompleted ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                </button>
                <div className="flex-1">
                   <h4 className={`text-lg font-bold leading-none ${item.isCompleted ? 'line-through opacity-60' : ''}`}>
                     {item.title}
                   </h4>
                   <span className={`text-xs font-medium uppercase tracking-wider ${item.isCompleted ? 'opacity-50' : 'text-slate-400'}`}>
                     {item.time}
                   </span>
                </div>
                <button 
                  onClick={() => deleteRoutine(item.id)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                   <Trash2 size={20} />
                </button>
              </div>
            ))}
            {routines.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                 <LayoutList size={64} className="mx-auto mb-4 opacity-20" />
                 <p className="text-lg">No routines set. Consistency is key!</p>
              </div>
            )}
         </div>

         {routines.length > 0 && (
           <div className="mt-10 p-6 bg-slate-50 rounded-3xl flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Today's Progress</div>
                <div className="text-3xl font-black text-slate-800">
                  {Math.round((routines.filter(r => r.isCompleted).length / routines.length) * 100)}%
                </div>
              </div>
              <div className="w-1/2 h-3 bg-slate-200 rounded-full overflow-hidden">
                 <div 
                  className="h-full bg-emerald-500 transition-all duration-700 ease-out" 
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
