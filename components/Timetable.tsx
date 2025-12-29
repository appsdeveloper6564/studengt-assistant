
import React, { useState, useMemo } from 'react';
import { TimetableEntry } from '../types';
import { Plus, Trash2, MapPin, Calendar as CalendarIcon, X, Edit3, Grid, List, Clock, Sparkles, ExternalLink, Moon, Sun } from 'lucide-react';
import { AdService } from '../services/adService';

interface TimetableProps {
  entries: TimetableEntry[];
  onUpdateEntries: (entries: TimetableEntry[]) => void;
  onAddEntry: (entry: TimetableEntry) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

// Focused on active hours (6 AM to 10 PM)
const ACTIVE_HOURS = Array.from({ length: 17 }, (_, i) => {
  const hour = i + 6;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const Timetable: React.FC<TimetableProps> = ({ entries, onUpdateEntries, onAddEntry }) => {
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

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    return (h2 * 60 + m2) - (h1 * 60 + m1);
  };

  const handleOpenAdd = (day?: typeof DAYS[number], time?: string) => {
    setEditingEntry(null);
    if (day) setActiveDay(day);
    setFormData({ 
      subject: '', 
      startTime: time || '08:00', 
      endTime: time ? `${(parseInt(time.split(':')[0]) + 2).toString().padStart(2, '0')}:00` : '10:00', 
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
    
    // Check sleep time constraint (10 PM to 6 AM)
    const [startH] = formData.startTime.split(':').map(Number);
    const [endH] = formData.endTime.split(':').map(Number);
    
    if (startH >= 22 || startH < 6 || endH > 22 || (endH <= 6 && endH !== 0)) {
      if (!confirm("This session overlaps with your 10 PM - 6 AM sleep time. Do you want to continue?")) {
        return;
      }
    }

    if (editingEntry) {
      onUpdateEntries(entries.map(e => e.id === editingEntry.id ? { ...editingEntry, ...formData, day: activeDay } : e));
    } else {
      const newEntry: TimetableEntry = {
        id: crypto.randomUUID(),
        day: activeDay,
        ...formData,
      };
      onAddEntry(newEntry);
    }
    setIsModalOpen(false);
  };

  const deleteEntry = (id: string) => {
    onUpdateEntries(entries.filter(e => e.id !== id));
  };

  const dayEntries = useMemo(() => 
    entries.filter(e => e.day === activeDay).sort((a, b) => a.startTime.localeCompare(b.startTime)),
  [entries, activeDay]);

  const duration = calculateDuration(formData.startTime, formData.endTime);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex bg-white card-surface border p-1 rounded-2xl shadow-sm overflow-x-auto no-scrollbar w-full sm:w-auto">
           <button onClick={() => setViewMode('daily')} className={`px-4 lg:px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${viewMode === 'daily' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-blue-500'}`}><List size={18} /> Daily</button>
           <button onClick={() => setViewMode('weekly')} className={`px-4 lg:px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${viewMode === 'weekly' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-blue-500'}`}><Grid size={18} /> Weekly</button>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => handleOpenAdd()} className="flex-1 sm:flex-none bg-blue-600 text-white px-8 py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 font-bold active:scale-95"><Plus size={20} /> New Study Block</button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-3 text-blue-700 font-bold text-sm">
        <Moon size={18} className="shrink-0" />
        <span>Sleep Mode Active: 10:00 PM - 06:00 AM. Study sessions are optimized for daytime.</span>
      </div>

      {viewMode === 'daily' ? (
        <div className="space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
            {DAYS.map(day => (
              <button key={day} onClick={() => setActiveDay(day)} className={`px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap border ${activeDay === day ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-white text-slate-500 hover:bg-blue-50'}`}>{day}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-12 bg-white card-surface rounded-[2.5rem] border shadow-sm p-4 lg:p-8">
              <div className="flex items-center justify-between mb-8 px-4">
                <h2 className="text-2xl font-black">{activeDay} <span className="text-blue-600">Active Schedule</span></h2>
                <div className="flex items-center gap-2 text-xs font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100"><Sun size={14} /> Peak Productivity Hours</div>
              </div>

              <div className="space-y-2">
                {ACTIVE_HOURS.map(slot => {
                  const entry = dayEntries.find(e => {
                    const hStart = parseInt(e.startTime.split(':')[0]);
                    const hEnd = parseInt(e.endTime.split(':')[0]);
                    const sHour = parseInt(slot.split(':')[0]);
                    return sHour >= hStart && sHour < hEnd;
                  });

                  return (
                    <div key={slot} className="group relative flex items-start gap-4 lg:gap-8 min-h-[90px]">
                      <div className="w-12 lg:w-16 pt-2 text-right">
                        <span className="text-xs lg:text-sm font-black text-slate-300 group-hover:text-blue-500">{slot}</span>
                      </div>
                      <div className="flex-1 pb-4 relative">
                        <div className="absolute top-4 left-0 right-0 h-px bg-slate-50 -z-10"></div>
                        {entry ? (
                          // Only show the card on its actual start slot to avoid duplicates in view
                          entry.startTime.startsWith(slot.split(':')[0]) && (
                            <div 
                              onClick={() => handleEdit(entry)}
                              className="bg-white border-2 border-blue-100 p-5 rounded-3xl shadow-sm transition-all hover:border-blue-500 hover:shadow-xl cursor-pointer group/card"
                              style={{ minHeight: `${Math.max(80, (calculateDuration(entry.startTime, entry.endTime) / 60) * 80)}px` }}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-1 rounded-lg uppercase">{calculateDuration(entry.startTime, entry.endTime) / 60} hrs Session</span>
                                    {entry.location && <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><MapPin size={10}/> {entry.location}</span>}
                                  </div>
                                  <h4 className="font-black text-xl text-slate-800 mb-1">{entry.subject}</h4>
                                  <p className="text-xs font-bold text-slate-400">{entry.startTime} - {entry.endTime}</p>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }} className="p-2 text-slate-200 hover:text-red-500 opacity-0 group-hover/card:opacity-100 transition-all"><Trash2 size={18} /></button>
                              </div>
                            </div>
                          )
                        ) : (
                          <button onClick={() => handleOpenAdd(activeDay, slot)} className="w-full text-left py-4 px-6 rounded-2xl border-2 border-dashed border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all group/btn flex items-center justify-between text-slate-200 font-black uppercase text-[10px] tracking-widest">
                            <span>Open Study Slot</span>
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover/btn:opacity-100 transition-all text-blue-600"><Plus size={18} /></div>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white card-surface border rounded-[2.5rem] shadow-sm overflow-hidden p-8">
           <p className="text-center font-bold text-slate-400">Weekly view optimized for 6 AM - 10 PM. Use Daily view for custom session lengths.</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-blue-50/30">
               <div>
                  <h3 className="text-2xl font-black text-slate-800">{editingEntry ? 'Edit Session' : 'Plan Long Study Session'}</h3>
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest mt-1">Focus Mode: {activeDay}</p>
               </div>
               <button onClick={() => setIsModalOpen(false)}><X size={28} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Study Subject</label>
                <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="e.g., Deep Science Study (2 hrs)" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Start Time</label>
                   <input required type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">End Time</label>
                   <input required type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
                 </div>
              </div>
              
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${duration >= 120 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                 <span className="text-xs font-black uppercase tracking-widest">Calculated Duration:</span>
                 <span className="text-lg font-black">{Math.floor(duration / 60)}h {duration % 60}m</span>
              </div>

              <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 active:scale-95 transition-all">
                {editingEntry ? 'Update Session' : 'Add to Schedule'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
