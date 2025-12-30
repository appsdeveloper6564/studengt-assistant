
import React, { useState, useMemo } from 'react';
import { TimetableEntry } from '../types';
import { Plus, Trash2, MapPin, Calendar as CalendarIcon, X, Edit3, Grid, List, Clock, Sparkles, ExternalLink, Moon, Sun } from 'lucide-react';
import AdsterraAd from './AdsterraAd';

interface TimetableProps {
  entries: TimetableEntry[];
  onUpdateEntries: (entries: TimetableEntry[]) => void;
  onAddEntry: (entry: TimetableEntry) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

const ACTIVE_HOURS = Array.from({ length: 17 }, (_, i) => {
  const hour = i + 6;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const Timetable: React.FC<TimetableProps> = ({ entries, onUpdateEntries, onAddEntry }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [activeDay, setActiveDay] = useState<typeof DAYS[number]>('Monday');

  const [formData, setFormData] = useState({ subject: '', startTime: '', endTime: '', location: '' });

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    return (h2 * 60 + m2) - (h1 * 60 + m1);
  };

  const handleOpenAdd = (day?: typeof DAYS[number], time?: string) => {
    setEditingEntry(null);
    if (day) setActiveDay(day);
    setFormData({ subject: '', startTime: time || '08:00', endTime: time ? `${(parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0')}:00` : '09:00', location: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setFormData({ subject: entry.subject, startTime: entry.startTime, endTime: entry.endTime, location: entry.location });
    setActiveDay(entry.day);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEntry) {
      onUpdateEntries(entries.map(e => e.id === editingEntry.id ? { ...editingEntry, ...formData, day: activeDay } : e));
    } else {
      onAddEntry({ id: crypto.randomUUID(), day: activeDay, ...formData });
    }
    setIsModalOpen(false);
  };

  const deleteEntry = (id: string) => {
    onUpdateEntries(entries.filter(e => e.id !== id));
  };

  const dayEntries = useMemo(() => entries.filter(e => e.day === activeDay).sort((a, b) => a.startTime.localeCompare(b.startTime)), [entries, activeDay]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex bg-slate-900/50 border border-slate-800 p-1.5 rounded-2xl shadow-inner w-full sm:w-auto overflow-x-auto no-scrollbar">
           <button onClick={() => setViewMode('daily')} className={`px-8 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${viewMode === 'daily' ? 'bg-brand-blue text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}><List size={16} /> Day Grid</button>
           <button onClick={() => setViewMode('weekly')} className={`px-8 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${viewMode === 'weekly' ? 'bg-brand-blue text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}><Grid size={16} /> Week View</button>
        </div>
        <button onClick={() => handleOpenAdd()} className="w-full sm:w-auto bg-brand-blue text-white px-10 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-brand-blue/20 font-black"><Plus size={20} /> New Slot</button>
      </div>

      <div className="bg-brand-blue/10 border border-brand-blue/20 p-5 rounded-[2rem] flex items-center gap-4 text-brand-blue font-bold text-sm">
        <Moon size={20} className="shrink-0" />
        <span>Optimized Study Window: 06:00 AM - 10:00 PM. High productivity mode active.</span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
        {DAYS.map(day => (
          <button key={day} onClick={() => setActiveDay(day)} className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${activeDay === day ? 'bg-white text-brand-deep border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105' : 'bg-slate-900/50 text-slate-500 border-slate-800 hover:bg-slate-800'}`}>{day}</button>
        ))}
      </div>

      <div className="bg-[#0f172a] rounded-[3rem] border border-slate-800 shadow-2xl p-6 lg:p-12">
        <div className="flex items-center justify-between mb-12 px-4">
          <h2 className="text-3xl font-black text-white">{activeDay} <span className="text-brand-blue">Mission Control</span></h2>
          <div className="flex items-center gap-3 text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20"><Sun size={14} /> Energy Peaks</div>
        </div>

        <div className="space-y-4">
          {ACTIVE_HOURS.map(slot => {
            const entry = dayEntries.find(e => {
              const hStart = parseInt(e.startTime.split(':')[0]);
              const hEnd = parseInt(e.endTime.split(':')[0]);
              const sHour = parseInt(slot.split(':')[0]);
              return sHour >= hStart && sHour < hEnd;
            });

            return (
              <div key={slot} className="group relative flex items-start gap-6 lg:gap-12 min-h-[100px]">
                <div className="w-16 lg:w-20 pt-2 text-right">
                  <span className={`text-sm font-black transition-colors ${entry ? 'text-brand-blue' : 'text-slate-700'}`}>{slot}</span>
                </div>
                <div className="flex-1 pb-6 relative">
                  <div className="absolute top-4 left-0 right-0 h-px bg-slate-800/50 -z-10"></div>
                  {entry ? (
                    entry.startTime.startsWith(slot.split(':')[0]) && (
                      <div 
                        onClick={() => handleEdit(entry)}
                        className="bg-slate-900 border border-slate-700/50 p-6 rounded-[2rem] shadow-xl transition-all hover:border-brand-blue hover:translate-x-1 cursor-pointer group/card relative overflow-hidden"
                        style={{ minHeight: `${Math.max(100, (calculateDuration(entry.startTime, entry.endTime) / 60) * 100)}px` }}
                      >
                        <div className="absolute top-0 left-0 w-2 h-full bg-brand-blue"></div>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-[10px] font-black bg-brand-blue/20 text-brand-blue px-3 py-1 rounded-lg uppercase tracking-wider">{calculateDuration(entry.startTime, entry.endTime) / 60}h Session</span>
                              {entry.location && <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><MapPin size={10} className="text-brand-orange" /> {entry.location}</span>}
                            </div>
                            <h4 className="font-black text-2xl text-white mb-2 tracking-tight">{entry.subject}</h4>
                            <p className="text-xs font-bold text-slate-400 flex items-center gap-1"><Clock size={12} className="text-brand-blue" /> {entry.startTime} — {entry.endTime}</p>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }} className="p-3 text-slate-700 hover:text-red-500 transition-all active:scale-90"><Trash2 size={22} /></button>
                        </div>
                      </div>
                    )
                  ) : (
                    <button onClick={() => handleOpenAdd(activeDay, slot)} className="w-full text-left py-6 px-8 rounded-[2rem] border-2 border-dashed border-slate-800 hover:border-brand-blue/30 hover:bg-slate-900/30 transition-all flex items-center justify-between group/btn">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 group-hover/btn:text-slate-500">Available Study Window</span>
                      <Plus size={20} className="text-slate-800 group-hover/btn:text-brand-blue transition-colors" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AdsterraAd id="55ec911eca20ef6f6a3a27adad217f37" format="banner" />

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0f172a] w-full max-w-lg rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-800 flex items-center justify-between bg-brand-blue/10">
               <div>
                  <h3 className="text-2xl font-black text-white">{editingEntry ? 'Refine Session' : 'Plan Deep Study'}</h3>
                  <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest mt-1">Focusing for: {activeDay}</p>
               </div>
               <button onClick={() => setIsModalOpen(false)}><X size={28} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Study Content</label>
                <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="e.g., Quantum Physics Review" className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl focus:border-brand-blue font-bold text-white outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-4">
                   <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Commence</label>
                   <input required type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl font-bold text-white" />
                 </div>
                 <div className="space-y-4">
                   <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Conclude</label>
                   <input required type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl font-bold text-white" />
                 </div>
              </div>
              <button type="submit" className="w-full py-6 bg-brand-blue text-white font-black rounded-2xl shadow-xl shadow-brand-blue/20 active:scale-95 transition-all uppercase tracking-widest text-xs">
                {editingEntry ? 'Update Strategy' : 'Lock in Slot'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
