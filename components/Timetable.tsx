
import React, { useState, useEffect } from 'react';
import { TimetableEntry, UserProfile } from '../types';
import { Plus, Trash2, MapPin, X, Clock, Wand2, Loader2, BrainCircuit, AlertTriangle, Lightbulb } from 'lucide-react';
import { AIService } from '../services/ai';

interface TimetableProps {
  entries: TimetableEntry[];
  profile: UserProfile;
  onUpdateEntries: (entries: TimetableEntry[]) => void;
  onAddEntry: (entry: TimetableEntry) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

const Timetable: React.FC<TimetableProps> = ({ entries, profile, onUpdateEntries, onAddEntry }) => {
  const [activeDay, setActiveDay] = useState<typeof DAYS[number]>('Monday');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [burnoutRisks, setBurnoutRisks] = useState<string[]>([]);
  const [formData, setFormData] = useState({ subject: '', startTime: '08:00', endTime: '09:00', location: '' });

  const runBurnoutCheck = async () => {
    if (entries.length === 0) return;
    setIsAnalyzing(true);
    const risks = await AIService.detectBurnout(entries);
    setBurnoutRisks(risks);
    setIsAnalyzing(false);
  };

  const dayEntries = entries.filter(e => e.day === activeDay).sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0f172a] p-6 rounded-[2rem] border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-2xl font-black text-white">Mission <span className="text-brand-blue">Schedule</span></h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Strategic Time Blocks</p>
        </div>
        <div className="flex gap-2">
          <button onClick={runBurnoutCheck} className="bg-brand-orange/10 border border-brand-orange/20 text-brand-orange px-6 py-4 rounded-2xl flex items-center gap-2 font-black text-xs">
            {isAnalyzing ? <Loader2 className="animate-spin" /> : <Lightbulb size={18} />} Check Burnout
          </button>
          <button onClick={() => setIsModalOpen(true)} className="bg-brand-blue text-white px-8 py-4 rounded-2xl flex items-center gap-2 font-black text-xs shadow-xl active:scale-95 transition-all">
            <Plus size={18} /> New Slot
          </button>
        </div>
      </div>

      {burnoutRisks.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[2rem] space-y-3">
          <h4 className="text-xs font-black text-red-400 flex items-center gap-2 uppercase tracking-widest">
            <AlertTriangle size={16} /> AI Burnout Detection
          </h4>
          <ul className="space-y-2">
            {burnoutRisks.map((risk, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> {risk}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {DAYS.map(day => (
          <button key={day} onClick={() => setActiveDay(day)} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border shrink-0 ${activeDay === day ? 'bg-white text-brand-deep border-white shadow-lg' : 'bg-slate-900/50 text-slate-500 border-slate-800'}`}>{day}</button>
        ))}
      </div>

      <div className="bg-[#0f172a] rounded-[3rem] border border-slate-800 p-8 space-y-4">
        {dayEntries.length > 0 ? dayEntries.map(e => (
          <div key={e.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between group">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center border border-brand-blue/20">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="font-black text-white text-lg">{e.subject}</h4>
                <p className="text-xs text-slate-500 font-bold">{e.startTime} — {e.endTime} {e.location && `• ${e.location}`}</p>
              </div>
            </div>
            <button onClick={() => onUpdateEntries(entries.filter(ent => ent.id !== e.id))} className="text-slate-700 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 p-2">
              <Trash2 size={20} />
            </button>
          </div>
        )) : (
          <div className="text-center py-16">
            <Clock size={48} className="mx-auto mb-4 text-slate-800" />
            <p className="text-slate-600 font-black uppercase tracking-widest text-[10px]">No sessions planned for {activeDay}</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0f172a] w-full max-w-lg rounded-[3rem] border border-slate-800 shadow-2xl">
            <div className="px-10 py-8 border-b border-slate-800 flex items-center justify-between bg-brand-blue/10">
               <h3 className="text-xl font-black text-white">Add Session</h3>
               <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onAddEntry({ id: crypto.randomUUID(), day: activeDay, ...formData }); setIsModalOpen(false); }} className="p-10 space-y-6">
               <input required type="text" placeholder="Subject" value={formData.subject} onChange={ev => setFormData({...formData, subject: ev.target.value})} className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl text-white outline-none focus:border-brand-blue" />
               <div className="grid grid-cols-2 gap-4">
                 <input type="time" value={formData.startTime} onChange={ev => setFormData({...formData, startTime: ev.target.value})} className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-white outline-none" />
                 <input type="time" value={formData.endTime} onChange={ev => setFormData({...formData, endTime: ev.target.value})} className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-white outline-none" />
               </div>
               <button type="submit" className="w-full py-4 bg-brand-blue text-white font-black rounded-xl uppercase tracking-widest text-xs">Confirm Slot</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
