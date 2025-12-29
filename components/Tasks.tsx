
import React, { useState } from 'react';
import { TaskItem, Priority } from '../types';
import { Plus, Trash2, CheckCircle2, Circle, Search, Clock, ListTodo, Edit3, X, ExternalLink, Sparkles } from 'lucide-react';
import NativeAd from './NativeAd';
import { AdService } from '../services/adService';

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

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      id: crypto.randomUUID(),
      title: newTitle,
      priority: newPriority,
      dueDate: newDate || new Date().toISOString().split('T')[0],
      isCompleted: false,
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
    const matchesFilter = 
      filter === 'All' ? true : 
      filter === 'Completed' ? task.isCompleted : 
      !task.isCompleted;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search your tasks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-slate-800 shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex bg-white border border-slate-200 p-1.5 rounded-[1.5rem] shadow-sm overflow-x-auto no-scrollbar">
             {(['All', 'Pending', 'Completed'] as const).map(f => (
               <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap ${filter === f ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-500 hover:text-slate-800'}`}
               >
                 {f}
               </button>
             ))}
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 ml-auto font-black active:scale-95 shrink-0"
          >
            <Plus size={20} /> Add New
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border-2 border-blue-100 shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-2xl font-black text-slate-800 tracking-tight">Create Study Task</h3>
             <button onClick={() => setIsAdding(false)} className="text-slate-300 hover:text-slate-600 transition-colors"><X size={28} /></button>
          </div>
          <form onSubmit={handleAddTask} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Task Description</label>
                <input autoFocus required type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g., Read Biology Chapter 4" className="w-full px-6 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 bg-slate-50/50 font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Urgency Level</label>
                <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as Priority)} className="w-full px-6 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 bg-white font-bold">
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Deadline Date</label>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full px-6 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold" />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button type="submit" className="w-full md:w-auto px-12 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 uppercase tracking-widest text-sm">
                Unlock Task (+5 Pts Ad)
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTasks.map((task) => (
          <div 
            key={task.id} 
            className={`p-8 rounded-[2.5rem] border transition-all hover:shadow-2xl bg-white group relative ${task.isCompleted ? 'border-emerald-100 bg-emerald-50/20' : 'border-slate-100'}`}
          >
            <div className="flex items-start justify-between mb-8">
              <button 
                onClick={() => toggleComplete(task.id)}
                className={`transition-all hover:scale-125 active:scale-90 ${task.isCompleted ? 'text-emerald-500' : 'text-slate-200 hover:text-blue-500'}`}
              >
                {task.isCompleted ? <CheckCircle2 size={32} /> : <Circle size={32} />}
              </button>
              <div className="flex gap-2">
                <span className={`text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-tight ${
                  task.priority === 'High' ? 'bg-red-500 text-white shadow-lg shadow-red-100' :
                  task.priority === 'Medium' ? 'bg-yellow-400 text-yellow-950' :
                  'bg-blue-500 text-white shadow-lg shadow-blue-100'
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>
            
            <h4 className={`text-xl font-black mb-3 line-clamp-2 pr-4 leading-tight ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
              {task.title}
            </h4>
            
            <div className="flex items-center gap-2 text-xs text-slate-400 font-black uppercase tracking-wider mb-8">
               <Clock size={16} />
               <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-50 pt-6">
              <button 
                onClick={() => deleteTask(task.id)}
                className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                title="Delete Task"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
        
        {filteredTasks.length > 0 && (
          <div className="col-span-full mt-6">
            <NativeAd />
          </div>
        )}

        {filteredTasks.length === 0 && !isAdding && (
          <div className="col-span-full py-28 flex flex-col items-center justify-center text-slate-300 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-inner">
            <ListTodo size={96} className="mb-8 opacity-10" />
            <p className="text-2xl font-black uppercase tracking-widest mb-4">Focus Empty</p>
            <button onClick={() => setIsAdding(true)} className="text-blue-600 font-black hover:underline tracking-tight">Create your first task now</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
