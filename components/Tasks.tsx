
import React, { useState } from 'react';
import { TaskItem, Priority } from '../types';
import { Plus, Trash2, CheckCircle2, Circle, Search, Clock, ListTodo, Edit3, X, ExternalLink, Sparkles } from 'lucide-react';
import NativeAd from './NativeAd';
import { AdService } from '../services/adService';

interface TasksProps {
  tasks: TaskItem[];
  setTasks: (tasks: TaskItem[]) => void;
}

const Tasks: React.FC<TasksProps> = ({ tasks, setTasks }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
  
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('Medium');
  const [newDate, setNewDate] = useState('');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: TaskItem = {
      id: crypto.randomUUID(),
      title: newTitle,
      priority: newPriority,
      dueDate: newDate || new Date().toISOString().split('T')[0],
      isCompleted: false,
    };

    setTasks([...tasks, newTask]);
    setNewTitle('');
    setIsAdding(false);
  };

  const updateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    
    setTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t));
    setEditingTask(null);
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm overflow-x-auto no-scrollbar">
             {(['All', 'Pending', 'Completed'] as const).map(f => (
               <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === f ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
               >
                 {f}
               </button>
             ))}
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 ml-auto font-bold active:scale-95 shrink-0"
          >
            <Plus size={20} /> Add
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-3xl border-2 border-blue-100 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-black text-slate-800">New Task</h3>
             <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
          </div>
          <form onSubmit={addTask} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Title</label>
                <input autoFocus required type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Assignment name..." className="w-full px-5 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 bg-slate-50/50" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Priority</label>
                <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as Priority)} className="w-full px-5 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 bg-white">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Due Date</label>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full px-5 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REWARD SMARTLINK INTEGRATION */}
      <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-6 rounded-3xl text-yellow-950 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg border border-yellow-300">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center">
              <Sparkles size={24} />
           </div>
           <div>
              <h4 className="font-black text-lg">Task Reward Program</h4>
              <p className="text-sm font-bold opacity-80 uppercase tracking-tighter">Click to unlock bonus productivity points</p>
           </div>
        </div>
        <button 
          onClick={() => AdService.triggerDirectLink()}
          className="px-6 py-3 bg-yellow-950 text-yellow-400 rounded-xl font-black flex items-center gap-2 hover:scale-105 transition-transform shadow-xl"
        >
          Check Rewards <ExternalLink size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div 
            key={task.id} 
            className={`p-6 rounded-[2rem] border transition-all hover:shadow-xl bg-white group relative ${task.isCompleted ? 'border-emerald-100 bg-emerald-50/10' : 'border-slate-100'}`}
          >
            <div className="flex items-start justify-between mb-6">
              <button 
                onClick={() => toggleComplete(task.id)}
                className={`transition-all hover:scale-110 active:scale-90 ${task.isCompleted ? 'text-emerald-500' : 'text-slate-300 hover:text-blue-500'}`}
              >
                {task.isCompleted ? <CheckCircle2 size={28} /> : <Circle size={28} />}
              </button>
              <div className="flex gap-2">
                <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tight ${
                  task.priority === 'High' ? 'bg-red-500 text-white shadow-lg shadow-red-50' :
                  task.priority === 'Medium' ? 'bg-yellow-400 text-yellow-900' :
                  'bg-blue-500 text-white shadow-lg shadow-blue-50'
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>
            
            <h4 className={`text-xl font-bold mb-2 line-clamp-2 pr-8 leading-snug ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
              {task.title}
            </h4>
            
            <div className="flex items-center gap-2 text-sm text-slate-400 font-bold mb-6">
               <Clock size={16} />
               <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-50 pt-4">
              <button 
                onClick={() => setEditingTask(task)}
                className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
                title="Edit Task"
              >
                <Edit3 size={18} />
              </button>
              <button 
                onClick={() => deleteTask(task.id)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                title="Delete Task"
              >
                <Trash2 size={18} />
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
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-slate-400 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <ListTodo size={80} className="mb-6 opacity-10" />
            <p className="text-2xl font-black text-slate-300 uppercase tracking-widest">No tasks active</p>
            <button onClick={() => setIsAdding(true)} className="mt-4 text-blue-600 font-bold hover:underline">Click here to start your list</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
