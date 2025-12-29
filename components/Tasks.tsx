
import React, { useState } from 'react';
import { TaskItem, Priority } from '../types';
import { Plus, Trash2, CheckCircle2, Circle, Search, Clock, ListTodo, Edit3, X, Timer } from 'lucide-react';
import NativeAd from './NativeAd';

interface TasksProps {
  tasks: TaskItem[];
  onUpdateTasks: (tasks: TaskItem[]) => void;
  onAddTask: (task: TaskItem) => void;
}

const Tasks: React.FC<TasksProps> = ({ tasks, onUpdateTasks, onAddTask }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
  
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('Medium');
  const [newDate, setNewDate] = useState('');
  const [newDuration, setNewDuration] = useState('60');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      id: crypto.randomUUID(),
      title: newTitle,
      priority: newPriority,
      dueDate: newDate || new Date().toISOString().split('T')[0],
      isCompleted: false,
      durationMinutes: parseInt(newDuration)
    });
    
    setNewTitle('');
    setIsAdding(false);
  };

  const toggleComplete = (id: string) => {
    onUpdateTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const deleteTask = (id: string) => {
    onUpdateTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' ? true : filter === 'Completed' ? task.isCompleted : !task.isCompleted;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-3xl focus:border-blue-500 font-bold shadow-sm" />
        </div>
        
        <button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white px-8 py-4 rounded-3xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 font-black active:scale-95">
          <Plus size={20} /> Create Study Session
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-10 rounded-[2.5rem] border-2 border-blue-100 shadow-2xl animate-in zoom-in-95 relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-2xl font-black text-slate-800">New Task & Time Plan</h3>
             <button onClick={() => setIsAdding(false)} className="text-slate-300 hover:text-slate-600"><X size={28} /></button>
          </div>
          <form onSubmit={handleAddTask} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Task Description</label>
                <input required type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g., Deep Biology Chapter 4 Review" className="w-full px-6 py-4 border border-slate-200 rounded-2xl focus:border-blue-500 bg-slate-50 font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Planned Session Length</label>
                <select value={newDuration} onChange={(e) => setNewDuration(e.target.value)} className="w-full px-6 py-4 border border-slate-200 rounded-2xl font-bold bg-white">
                  <option value="30">30 Minutes (Quick Review)</option>
                  <option value="60">1 Hour (Standard)</option>
                  <option value="120">2 Hours (Deep Work)</option>
                  <option value="180">3 Hours (Marathon)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Priority</label>
                <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as Priority)} className="w-full px-6 py-4 border border-slate-200 rounded-2xl font-bold bg-white">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 uppercase tracking-widest text-sm">
                Unlock Study Goal (+5 Pts)
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTasks.map((task) => (
          <div key={task.id} className={`p-8 rounded-[2.5rem] border transition-all hover:shadow-2xl bg-white group ${task.isCompleted ? 'border-emerald-100 bg-emerald-50/20' : 'border-slate-100'}`}>
            <div className="flex items-start justify-between mb-8">
              <button onClick={() => toggleComplete(task.id)} className={`transition-all hover:scale-125 ${task.isCompleted ? 'text-emerald-500' : 'text-slate-200 hover:text-blue-500'}`}>
                {task.isCompleted ? <CheckCircle2 size={32} /> : <Circle size={32} />}
              </button>
              <span className={`text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-tight ${task.priority === 'High' ? 'bg-red-500 text-white' : task.priority === 'Medium' ? 'bg-yellow-400 text-yellow-900' : 'bg-blue-500 text-white'}`}>
                {task.priority}
              </span>
            </div>
            
            <h4 className={`text-xl font-black mb-3 line-clamp-2 ${task.isCompleted ? 'line-through text-slate-300' : 'text-slate-800'}`}>
              {task.title}
            </h4>
            
            <div className="flex flex-col gap-2 mb-8">
               <div className="flex items-center gap-2 text-xs text-slate-400 font-black uppercase tracking-wider">
                  <Clock size={16} />
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
               </div>
               {task.durationMinutes && (
                 <div className="flex items-center gap-2 text-xs text-blue-600 font-black uppercase tracking-wider">
                    <Timer size={16} />
                    <span>Intended Session: {task.durationMinutes >= 60 ? `${task.durationMinutes / 60}h` : `${task.durationMinutes}m`}</span>
                 </div>
               )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-50 pt-6">
              <button onClick={() => deleteTask(task.id)} className="p-3 text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
