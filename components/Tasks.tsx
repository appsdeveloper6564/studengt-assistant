
import React, { useState } from 'react';
import { TaskItem, Priority, Subject, Recurrence, SubTask } from '../types';
import { Plus, Trash2, CheckCircle2, Circle, Search, Clock, ListTodo, X, Timer, Download, Tag, Repeat, ListChecks, CheckCircle, ChevronDown, Flag } from 'lucide-react';
import { StorageService } from '../services/storage';
import AdsterraAd from './AdsterraAd';
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
  const [subjects] = useState<Subject[]>(StorageService.getSubjects());
  
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('Medium');
  const [newDate, setNewDate] = useState('');
  const [newDuration, setNewDuration] = useState('60');
  const [newSubjectId, setNewSubjectId] = useState('');
  const [newRecurrence, setNewRecurrence] = useState<Recurrence>('None');
  const [newSubtasks, setNewSubtasks] = useState<{title: string}[]>([]);
  const [currentSubtaskInput, setCurrentSubtaskInput] = useState('');

  const handleAddSubtask = () => {
    if (!currentSubtaskInput.trim()) return;
    setNewSubtasks([...newSubtasks, { title: currentSubtaskInput.trim() }]);
    setCurrentSubtaskInput('');
  };

  const removeNewSubtask = (index: number) => {
    setNewSubtasks(newSubtasks.filter((_, i) => i !== index));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const formattedSubtasks: SubTask[] = newSubtasks.map(st => ({
      id: crypto.randomUUID(),
      title: st.title,
      isCompleted: false
    }));

    onAddTask({
      id: crypto.randomUUID(),
      title: newTitle,
      priority: newPriority,
      dueDate: newDate || new Date().toISOString().split('T')[0],
      isCompleted: false,
      durationMinutes: parseInt(newDuration),
      subjectId: newSubjectId || undefined,
      recurrence: newRecurrence,
      subtasks: formattedSubtasks
    });
    
    setNewTitle('');
    setNewPriority('Medium');
    setNewDate('');
    setNewDuration('60');
    setNewSubjectId('');
    setNewRecurrence('None');
    setNewSubtasks([]);
    setIsAdding(false);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Due Date', 'Completed', 'Priority', 'Duration(min)', 'Recurrence', 'Subtasks Count'];
    const rows = tasks.map(t => [t.id, t.title, t.dueDate, t.isCompleted, t.priority, t.durationMinutes || 0, t.recurrence || 'None', t.subtasks?.length || 0]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `study_tasks_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const toggleComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.isCompleted) {
      AdService.showSmartlink();
    }
    onUpdateTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    onUpdateTasks(tasks.map(t => {
      if (t.id === taskId && t.subtasks) {
        const updatedSubtasks = t.subtasks.map(st => {
          if (st.id === subtaskId) {
            if (!st.isCompleted) AdService.showSmartlink();
            return { ...st, isCompleted: !st.isCompleted };
          }
          return st;
        });
        return { ...t, subtasks: updatedSubtasks };
      }
      return t;
    }));
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
    <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search study goals..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full pl-12 pr-4 py-4 bg-[#0f172a] border border-slate-800 rounded-2xl focus:border-brand-blue font-bold shadow-2xl text-slate-200 placeholder-slate-500" 
          />
        </div>
        
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <div className="flex bg-[#0f172a] border border-slate-800 rounded-2xl p-1 shadow-inner">
             {(['All', 'Pending', 'Completed'] as const).map((f) => (
               <button 
                 key={f} 
                 onClick={() => setFilter(f)} 
                 className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${filter === f ? 'bg-brand-blue text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 {f}
               </button>
             ))}
          </div>
          <button onClick={exportToCSV} className="p-4 bg-[#0f172a] text-slate-400 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2 font-bold shadow-lg">
            <Download size={20} />
          </button>
          <button onClick={() => setIsAdding(true)} className="flex-1 lg:flex-none bg-brand-blue text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-brand-blue/20 font-black active:scale-95">
            <Plus size={20} /> Create Mission
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0f172a] w-full max-w-2xl rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-brand-blue/10 to-transparent">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center shadow-lg neon-blue">
                     <ListChecks size={24} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-white">Plan Study Goal</h3>
                     <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Break down your academic mission</p>
                  </div>
               </div>
               <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white transition-colors"><X size={28} /></button>
            </div>
            <form onSubmit={handleAddTask} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Task Description</label>
                <input required type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g., Mathematics - Integration Chapter" className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl focus:border-brand-blue font-bold text-slate-200 outline-none transition-all" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Academic Context</label>
                  <select value={newSubjectId} onChange={(e) => setNewSubjectId(e.target.value)} className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl font-bold text-slate-200 outline-none">
                    <option value="">General Task</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Priority</label>
                  <div className="flex gap-2">
                    {(['Low', 'Medium', 'High'] as Priority[]).map(p => (
                      <button 
                        key={p} type="button" onClick={() => setNewPriority(p)}
                        className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${newPriority === p ? (p === 'High' ? 'bg-red-500 border-red-500 text-white shadow-lg' : 'bg-brand-blue border-brand-blue text-white shadow-lg') : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Breakdown (Sub-steps)</label>
                <div className="flex gap-2">
                  <input type="text" value={currentSubtaskInput} onChange={e => setCurrentSubtaskInput(e.target.value)} placeholder="Add a step..." className="flex-1 px-5 py-3 bg-slate-900 border border-slate-800 rounded-xl font-bold text-sm text-slate-200" onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())} />
                  <button type="button" onClick={handleAddSubtask} className="p-3 bg-brand-blue text-white rounded-xl hover:bg-blue-600 transition-all"><Plus size={20}/></button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
                  {newSubtasks.map((st, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800/50 animate-in slide-in-from-left-2">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-blue" /> {st.title}</span>
                      <button type="button" onClick={() => removeNewSubtask(i)} className="text-slate-600 hover:text-red-500"><Trash2 size={14}/></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Recurrence</label>
                    <select value={newRecurrence} onChange={(e) => setNewRecurrence(e.target.value as Recurrence)} className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl font-bold text-slate-200">
                      <option value="None">Once</option>
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                    </select>
                 </div>
                 <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Target Date</label>
                    <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl font-bold text-slate-200" />
                 </div>
              </div>

              <button type="submit" className="w-full py-6 bg-brand-blue text-white font-black rounded-2xl shadow-xl shadow-brand-blue/20 uppercase tracking-[0.2em] text-sm hover:scale-[1.02] transition-all active:scale-95">
                Launch Mission (+5 Pts)
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredTasks.map((task) => {
          const subject = subjects.find(s => s.id === task.subjectId);
          const completedSubtasks = task.subtasks?.filter(st => st.isCompleted).length || 0;
          const totalSubtasks = task.subtasks?.length || 0;
          const subProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

          return (
            <div key={task.id} className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-2 flex flex-col ${task.isCompleted ? 'bg-slate-900/40 border-slate-800 grayscale' : 'bg-[#0f172a] border-slate-800 shadow-2xl hover:border-brand-blue/40 hover:neon-blue'}`}>
              <div className="flex items-start justify-between mb-8">
                <button onClick={() => toggleComplete(task.id)} className={`transition-all hover:scale-110 ${task.isCompleted ? 'text-emerald-500' : 'text-slate-700 hover:text-brand-blue'}`}>
                  {task.isCompleted ? <CheckCircle2 size={40} strokeWidth={2.5} /> : <Circle size={40} strokeWidth={2} />}
                </button>
                <div className="flex flex-col items-end gap-2">
                  <div className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-sm ${task.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20'}`}>
                    <Flag size={10} fill="currentColor" /> {task.priority}
                  </div>
                  {subject && (
                    <div className="text-[9px] font-black px-2.5 py-1 rounded-lg uppercase bg-slate-800/50 text-slate-400 border border-slate-700/50 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: subject.color }} /> {subject.name}
                    </div>
                  )}
                </div>
              </div>
              
              <h4 className={`text-2xl font-black mb-6 leading-tight tracking-tight ${task.isCompleted ? 'line-through text-slate-600' : 'text-white'}`}>
                {task.title}
              </h4>

              {totalSubtasks > 0 && (
                <div className="mb-8 space-y-4">
                   <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span>Breakdown</span>
                      <span className="text-brand-blue">{completedSubtasks}/{totalSubtasks} DONE</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-brand-blue transition-all duration-1000 ease-out shadow-lg" style={{ width: `${subProgress}%` }} />
                   </div>
                   <div className="space-y-2.5 pt-2">
                      {task.subtasks?.map(st => (
                        <button 
                          key={st.id} 
                          onClick={() => toggleSubtask(task.id, st.id)}
                          className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all ${st.isCompleted ? 'bg-emerald-500/5 text-emerald-500/40 border border-emerald-500/10' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'}`}
                        >
                           {st.isCompleted ? <CheckCircle size={14} className="shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-700 shrink-0" />}
                           <span className={`text-xs font-bold truncate ${st.isCompleted ? 'line-through' : ''}`}>{st.title}</span>
                        </button>
                      ))}
                   </div>
                </div>
              )}
              
              <div className="mt-auto pt-6 border-t border-slate-800/50 flex flex-col gap-3">
                 <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                    <Clock size={14} className="text-brand-orange" />
                    <span>Due: {task.dueDate}</span>
                 </div>
                 {task.durationMinutes && (
                   <div className="flex items-center gap-2 text-[10px] text-brand-blue font-black uppercase tracking-widest">
                      <Timer size={14} />
                      <span>{task.durationMinutes}m Effort</span>
                   </div>
                 )}
              </div>

              <button onClick={() => deleteTask(task.id)} className="absolute bottom-6 right-6 p-3 text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all active:scale-90"><Trash2 size={20} /></button>
            </div>
          );
        })}
      </div>
      
      <div className="pt-10">
        <AdsterraAd id="55ec911eca20ef6f6a3a27adad217f37" format="banner" />
      </div>

      {filteredTasks.length === 0 && (
        <div className="py-32 text-center bg-[#0f172a] rounded-[4rem] border-2 border-dashed border-slate-800 animate-pulse">
           <ListTodo size={64} className="mx-auto text-slate-800 mb-8" />
           <h3 className="text-3xl font-black text-slate-700">Mission Log Empty</h3>
           <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-4">Plan your next academic victory today</p>
        </div>
      )}
    </div>
  );
};

export default Tasks;
