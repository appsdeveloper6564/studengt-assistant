
import React, { useState } from 'react';
import { Routine } from '../types';
import { CheckCircle2, Circle, Plus, Trash2, LayoutList, AlertCircle, Timer } from 'lucide-react';

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

    // Check sleep constraints (10 PM to 6 AM)
    const timeNum = parseInt(newTime.split(':')[0]);
    const isSleepTime = (timeNum >= 22 || timeNum < 6);
    
    if (isSleepTime && !confirm("This routine is planned during your sleep time (10 PM - 6 AM). Are you sure?")) {
      return;
    }
    
    onAddRoutine({
      id: crypto.randomUUID(),
      title: newTitle,
      time: newTime || 'Anytime',
      isCompleted: false,
      durationMinutes: parseInt(newDuration)
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

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="bg-white p-10 lg:p-12 rounded-[3rem] shadow-sm border border-slate-100">
         <div className="flex items-center justify-between mb-10">
            <div>
               <h2 className="text-3xl font-black text-slate-800 tracking-tight">Active Habits</h2>
               <p className="text-slate-400 font-bold mt-1">Sit less, study more, rest deeply.</p>
            </div>
         </div>

         <form onSubmit={handleAdd} className="space-y-4 mb-10">
            <div className="flex flex-col sm:flex-row gap-4">
              <input required type="text" placeholder="e.g., Deep Focus Block" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 font-bold" />
              <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="w-full sm:w-40 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <select value={newDuration} onChange={e => setNewDuration(e.target.value)} className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold">
                <option value="45">45m Focus (Pomodoro)</option>
                <option value="90">90m Focus (Deep State)</option>
                <option value="120">120m Focus (Scholar Session)</option>
              </select>
              <button type="submit" className="py-4 px-10 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-black uppercase text-sm shadow-xl shadow-blue-100">Add habit</button>
            </div>
         </form>

         <div className="space-y-4">
            {routines.map(item => {
              const timeNum = parseInt(item.time.split(':')[0]);
              const isSleepTimeOverlap = !isNaN(timeNum) && (timeNum >= 22 || timeNum < 6);

              return (
                <div key={item.id} className={`flex items-center gap-5 p-6 rounded-[2rem] transition-all border group ${item.isCompleted ? 'bg-emerald-50 border-emerald-100' : isSleepTimeOverlap ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-100'}`}>
                  <button onClick={() => toggleRoutine(item.id)} className={`transition-all hover:scale-125 ${item.isCompleted ? 'text-emerald-500' : 'text-slate-200 hover:text-blue-500'}`}>
                     {item.isCompleted ? <CheckCircle2 size={32} /> : <Circle size={32} />}
                  </button>
                  <div className="flex-1">
                     <div className="flex items-center gap-2">
                        <h4 className={`text-xl font-black ${item.isCompleted ? 'line-through opacity-60' : 'text-slate-800'}`}>{item.title}</h4>
                        {isSleepTimeOverlap && <AlertCircle size={16} className="text-yellow-500" title="Planned during sleep hours" />}
                     </div>
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">{item.time}</span>
                        {item.durationMinutes && (
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1"><Timer size={12}/> {item.durationMinutes}m Session</span>
                        )}
                     </div>
                  </div>
                  <button onClick={() => deleteRoutine(item.id)} className="p-3 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={20} /></button>
                </div>
              );
            })}
         </div>
      </div>
    </div>
  );
};

export default RoutineTracker;
