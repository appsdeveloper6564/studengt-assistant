
import React, { useState, useMemo } from 'react';
import { TimetableEntry } from '../types';
import { Plus, Trash2, MapPin, Calendar as CalendarIcon, X, Edit3, Grid, List, Clock, Sparkles, ExternalLink } from 'lucide-react';
import { AdService } from '../services/adService';

interface TimetableProps {
  entries: TimetableEntry[];
  setEntries: (entries: TimetableEntry[]) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

const TIME_SLOTS = Array.from({ length: 18 }, (_, i) => {
  const hour = i + 6;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const Timetable: React.FC<TimetableProps> = ({ entries, setEntries }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [activeDay, setActiveDay] = useState<typeof DAYS[number]>('Monday');

  const [formData, setFormData] = useState({
    subject: '',
    startTime: '',
    endTime: '',
    location: '',
  });

  const handleOpenAdd = (day?: typeof DAYS[number], time?: string) => {
    setEditingEntry(null);
    if (day) setActiveDay(day);
    setFormData({ 
      subject: '', 
      startTime: time || '08:00', 
      endTime: time ? `${(parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0')}:00` : '09:00', 
      location: '' 
    });
    setIsModalOpen(true);
  };

  const handleEdit = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setFormData({
      subject: entry.subject,
      startTime: entry.startTime,
      endTime: entry.endTime,
      location: entry.location,
    });
    setActiveDay(entry.day);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEntry) {
      setEntries(entries.map(e => e.id === editingEntry.id ? { ...editingEntry, ...formData, day: activeDay } : e));
    } else {
      const newEntry: TimetableEntry = {
        id: crypto.randomUUID(),
        day: activeDay,
        ...formData,
      };
      setEntries([...entries, newEntry]);
    }
    setIsModalOpen(false);
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const dayEntries = useMemo(() => 
    entries.filter(e => e.day === activeDay).sort((a, b) => a.startTime.localeCompare(b.startTime)),
  [entries, activeDay]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex bg-white card-surface border p-1 rounded-2xl shadow-sm overflow-x-auto no-scrollbar w-full sm:w-auto">
           <button 
            onClick={() => setViewMode('daily')}
            className={`px-4 lg:px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${viewMode === 'daily' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-blue-500'}`}
           >
             <List size={18} /> Daily
           </button>
           <button 
            onClick={() => setViewMode('weekly')}
            className={`px-4 lg:px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${viewMode === 'weekly' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-blue-500'}`}
           >
             <Grid size={18} /> Weekly
           </button>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => AdService.triggerDirectLink()}
            className="flex-1 sm:flex-none bg-emerald-100 text-emerald-700 px-6 py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-200 transition-all font-bold border border-emerald-200"
          >
            <Sparkles size={18} /> Boost Points
          </button>
          <button 
            onClick={() => handleOpenAdd()}
            className="flex-1 sm:flex-none bg-blue-600 text-white px-8 py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 font-bold active:scale-95"
          >
            <Plus size={20} /> Add Session
          </button>
        </div>
      </div>

      {viewMode === 'daily' ? (
        <div className="space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap border ${
                  activeDay === day 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' 
                    : 'bg-white card-surface border text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white card-surface rounded-[2.5rem] border shadow-sm p-4 lg:p-8">
              <div className="flex items-center justify-between mb-8 px-4">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  {activeDay} <span className="text-blue-600">Timeline</span>
                </h2>
                <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Clock size={14} /> Hourly View
                </div>
              </div>

              <div className="space-y-2">
                {TIME_SLOTS.map(slot => {
                  const entry = dayEntries.find(e => {
                    const hStart = parseInt(e.startTime.split(':')[0]);
                    const sHour = parseInt(slot.split(':')[0]);
                    return hStart === sHour;
                  });

                  return (
                    <div key={slot} className="group relative flex items-start gap-4 lg:gap-8 min-h-[80px]">
                      <div className="w-12 lg:w-16 pt-2 text-right">
                        <span className="text-xs lg:text-sm font-black text-slate-400 group-hover:text-blue-500 transition-colors">{slot}</span>
                      </div>

                      <div className="flex-1 pb-4 relative">
                        <div className="absolute top-4 left-0 right-0 h-px bg-slate-100 group-hover:bg-blue-100/50 transition-colors -z-10"></div>
                        
                        {entry ? (
                          <div 
                            onClick={() => handleEdit(entry)}
                            className="bg-blue-600 text-white p-4 lg:p-5 rounded-2xl shadow-lg shadow-blue-100 border border-blue-400 transition-all hover:scale-[1.01] hover:shadow-xl cursor-pointer"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-black text-lg leading-tight mb-1">{entry.subject}</h4>
                                <div className="flex flex-wrap items-center gap-3 opacity-80 text-[10px] lg:text-xs font-bold uppercase tracking-wider">
                                  <span>{entry.startTime} - {entry.endTime}</span>
                                  {entry.location && <span className="flex items-center gap-1"><MapPin size={10} /> {entry.location}</span>}
                                </div>
                              </div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleOpenAdd(activeDay, slot)}
                            className="w-full text-left py-4 px-6 rounded-2xl border-2 border-dashed border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all group/btn flex items-center justify-between"
                          >
                            <span className="text-slate-300 font-bold group-hover/btn:text-blue-400 transition-colors">Free Slot</span>
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 opacity-0 group-hover/btn:opacity-100 group-hover/btn:bg-blue-100 group-hover/btn:text-blue-600 transition-all">
                               <Plus size={18} />
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-academic rounded-[2.5rem] p-8 lg:p-10 text-white shadow-2xl shadow-blue-200/50 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                
                <h3 className="text-2xl font-black mb-6 relative z-10">Daily Insights</h3>
                <div className="space-y-6 relative z-10">
                  <div className="bg-white/10 rounded-3xl p-6 border border-white/5 backdrop-blur-md">
                    <div className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">Sessions Today</div>
                    <div className="flex items-end gap-2">
                        <span className="text-5xl font-black">{dayEntries.length}</span>
                        <span className="text-sm font-bold opacity-60 pb-2">Hours</span>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-yellow-400 text-yellow-950 rounded-3xl shadow-xl shadow-yellow-200/20 group">
                    <h4 className="font-black mb-4 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                       Study Booster <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                    </h4>
                    <p className="text-sm font-bold leading-relaxed mb-6">
                      Unlock optimized timetable layouts and secret productivity hacks.
                    </p>
                    <button 
                      onClick={() => AdService.triggerDirectLink()}
                      className="w-full py-3 bg-white/30 backdrop-blur-md rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/40 transition-all border border-white/20 flex items-center justify-center gap-2"
                    >
                       Get Access <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white card-surface border rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b flex items-center justify-between">
             <h2 className="text-xl font-black">Full Week <span className="text-blue-600">Overview</span></h2>
             <span className="text-xs font-bold text-slate-400">Scroll horizontally</span>
          </div>
          <div className="overflow-x-auto p-4 lg:p-8 no-scrollbar">
            <div className="min-w-[1200px]">
              <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-3 border-b pb-6 mb-6">
                <div></div>
                {DAYS.map(day => (
                  <div key={day} className={`text-center p-3 rounded-2xl border transition-all ${activeDay === day ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'bg-slate-50 text-slate-400 border-transparent'}`}>
                    <span className="block text-xs font-black uppercase tracking-widest">{day.slice(0, 3)}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3">
                {TIME_SLOTS.map(slot => (
                  <div key={slot} className="grid grid-cols-[100px_repeat(7,1fr)] gap-3 items-center">
                    <div className="text-xs font-black text-slate-300 text-center">{slot}</div>
                    {DAYS.map(day => {
                      const entry = entries.find(e => e.day === day && e.startTime.startsWith(slot.split(':')[0]));
                      return (
                        <div 
                          key={day} 
                          onClick={() => entry ? handleEdit(entry) : handleOpenAdd(day, slot)}
                          className={`min-h-[70px] p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-center text-center group ${
                          entry 
                            ? 'bg-blue-50 border-blue-200 hover:border-blue-500 hover:shadow-md' 
                            : 'bg-slate-50/30 border-dashed border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {entry ? (
                            <div className="animate-in fade-in zoom-in-95">
                              <span className="text-[10px] font-black text-blue-600 line-clamp-1 uppercase tracking-tighter mb-1 leading-tight">{entry.subject}</span>
                              <span className="text-[8px] font-bold text-slate-400 block">{entry.startTime}</span>
                            </div>
                          ) : (
                            <Plus size={14} className="mx-auto text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white card-surface w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="px-8 lg:px-10 py-6 lg:py-8 border-b border-slate-100 flex items-center justify-between bg-blue-50/30">
               <div>
                  <h3 className="text-2xl font-black text-slate-800">{editingEntry ? 'Edit Session' : 'Add to Plan'}</h3>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">Focusing on {activeDay}</p>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={28} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Which Day?</label>
                <div className="grid grid-cols-4 gap-2">
                  {DAYS.map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setActiveDay(d)}
                      className={`py-2 rounded-xl text-[10px] font-black border transition-all ${activeDay === d ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-400'}`}
                    >
                      {d.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Activity Name</label>
                <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="e.g., Math Workshop" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-bold text-slate-800" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Start Time</label>
                   <input required type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold text-slate-800" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">End Time</label>
                   <input required type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 font-bold text-slate-800" />
                 </div>
              </div>
              <div className="flex gap-4 mt-8">
                {editingEntry && (
                  <button 
                    type="button" 
                    onClick={() => { deleteEntry(editingEntry.id); setIsModalOpen(false); }}
                    className="flex-1 py-4 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-100 transition-all border border-red-100"
                  >
                    Delete
                  </button>
                )}
                <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95">
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
