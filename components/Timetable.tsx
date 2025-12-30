
import React, { useState, useMemo } from 'react';
import { TimetableEntry, UserProfile, Subject } from '../types';
import { Plus, Trash2, MapPin, X, Edit3, Grid, List, Clock, Sparkles, Moon, Sun, Wand2, Loader2, BrainCircuit, CalendarOff } from 'lucide-react';
import AdsterraAd from './AdsterraAd';
import { GoogleGenAI, Type } from "@google/genai";
import { StorageService } from '../services/storage';

interface TimetableProps {
  entries: TimetableEntry[];
  profile: UserProfile;
  onUpdateEntries: (entries: TimetableEntry[]) => void;
  onAddEntry: (entry: TimetableEntry) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

const ACTIVE_HOURS = Array.from({ length: 17 }, (_, i) => {
  const hour = i + 6;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const Timetable: React.FC<TimetableProps> = ({ entries, profile, onUpdateEntries, onAddEntry }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [activeDay, setActiveDay] = useState<typeof DAYS[number]>('Monday');

  const [formData, setFormData] = useState({ subject: '', startTime: '', endTime: '', location: '' });
  
  // AI Constraints
  const [aiConstraints, setAiConstraints] = useState({
    schoolStart: '08:00',
    schoolEnd: '14:30',
    coachingStart: '16:00',
    coachingEnd: '18:30',
    focusSubjects: StorageService.getSubjects().map(s => s.name).join(', '),
    schoolHolidays: ['Sunday'] as string[],
    coachingHolidays: ['Sunday'] as string[]
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
    setFormData({ subject: '', startTime: time || '08:00', endTime: time ? `${(parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0')}:00` : '09:00', location: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setFormData({ subject: entry.subject, startTime: entry.startTime, endTime: entry.endTime, location: entry.location });
    setActiveDay(entry.day);
    setIsModalOpen(true);
  };

  const toggleHoliday = (type: 'school' | 'coaching', day: string) => {
    setAiConstraints(prev => {
      const key = type === 'school' ? 'schoolHolidays' : 'coachingHolidays';
      const current = prev[key];
      const updated = current.includes(day) 
        ? current.filter(d => d !== day)
        : [...current, day];
      return { ...prev, [key]: updated };
    });
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

  const handleGenerateAiTimetable = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Generate a highly optimized 7-day academic timetable for a student in grade ${profile.grade || '12'}. 
      
      CONSTRAINTS: 
      - School Routine: ${aiConstraints.schoolStart} to ${aiConstraints.schoolEnd}.
      - School Holidays: ${aiConstraints.schoolHolidays.join(', ') || 'None'}. (On these days, NO school slots)
      - Coaching Routine: ${aiConstraints.coachingStart} to ${aiConstraints.coachingEnd}.
      - Coaching Holidays: ${aiConstraints.coachingHolidays.join(', ') || 'None'}. (On these days, NO coaching slots)
      - Subjects to focus: ${aiConstraints.focusSubjects}.
      
      LOGIC:
      - For SCHOOL/COACHING HOLIDAYS: Distribute the extra free time between Deep Self-Study, Revision, and Hobby/Rest.
      - Ensure 3 meals (Breakfast, Lunch, Dinner).
      - Maintain consistent sleep cycle (approx 10:30 PM to 6:00 AM).
      - Return an array of objects matching the specified schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING, description: "Monday through Sunday" },
                subject: { type: Type.STRING, description: "The activity name" },
                startTime: { type: Type.STRING, description: "HH:mm" },
                endTime: { type: Type.STRING, description: "HH:mm" },
                location: { type: Type.STRING, description: "School, Home, Coaching, etc." }
              },
              required: ["day", "subject", "startTime", "endTime", "location"]
            }
          }
        }
      });

      const generatedData = JSON.parse(response.text || '[]');
      const formattedEntries: TimetableEntry[] = generatedData.map((item: any) => ({
        ...item,
        id: crypto.randomUUID()
      }));

      if (formattedEntries.length > 0) {
        onUpdateEntries(formattedEntries);
        setIsAiModalOpen(false);
      }
    } catch (err) {
      console.error("AI Gen Error:", err);
      alert("AI was unable to generate the schedule. Please check your parameters and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteEntry = (id: string) => {
    onUpdateEntries(entries.filter(e => e.id !== id));
  };

  const dayEntries = useMemo(() => entries.filter(e => e.day === activeDay).sort((a, b) => a.startTime.localeCompare(b.startTime)), [entries, activeDay]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 px-0">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0f172a] p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-slate-800 shadow-xl mx-2">
        <div className="flex bg-slate-900/50 border border-slate-800 p-1 rounded-xl shadow-inner w-full md:w-auto overflow-x-auto no-scrollbar">
           <button onClick={() => setViewMode('daily')} className={`px-4 py-2 rounded-lg text-[10px] md:text-xs font-black flex items-center gap-2 transition-all shrink-0 ${viewMode === 'daily' ? 'bg-brand-blue text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}><List size={14} /> Day Grid</button>
           <button onClick={() => setViewMode('weekly')} className={`px-4 py-2 rounded-lg text-[10px] md:text-xs font-black flex items-center gap-2 transition-all shrink-0 ${viewMode === 'weekly' ? 'bg-brand-blue text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}><Grid size={14} /> Week View</button>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setIsAiModalOpen(true)}
            className="flex-1 md:flex-none bg-festive-gradient text-white px-4 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl font-black text-[10px] md:text-sm"
          >
            <Wand2 size={16} /> AI Magic
          </button>
          <button onClick={() => handleOpenAdd()} className="flex-1 md:flex-none bg-brand-blue text-white px-4 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl font-black text-[10px] md:text-sm">
            <Plus size={16} /> New Slot
          </button>
        </div>
      </div>

      <div className="mx-2 bg-brand-blue/10 border border-brand-blue/20 p-4 rounded-[1.5rem] flex items-center gap-3 text-brand-blue font-bold text-[10px] md:text-sm">
        <Moon size={16} className="shrink-0" />
        <span>Optimized Study Window: 06:00 AM - 10:00 PM. High productivity mode active.</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar px-2">
        {DAYS.map(day => (
          <button key={day} onClick={() => setActiveDay(day)} className={`px-5 py-2.5 rounded-xl font-black text-[9px] md:text-[11px] uppercase tracking-widest transition-all border shrink-0 ${activeDay === day ? 'bg-white text-brand-deep border-white shadow-lg scale-105' : 'bg-slate-900/50 text-slate-500 border-slate-800 hover:bg-slate-800'}`}>{day}</button>
        ))}
      </div>

      <div className="bg-[#0f172a] rounded-[2rem] md:rounded-[3rem] border border-slate-800 shadow-2xl p-4 md:p-8 lg:p-12 mx-1">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 md:mb-12 gap-4 px-2">
          <h2 className="text-xl md:text-3xl font-black text-white">{activeDay} <span className="text-brand-blue">Mission Control</span></h2>
          <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20"><Sun size={12} /> Energy Peaks</div>
        </div>

        <div className="space-y-3">
          {ACTIVE_HOURS.map(slot => {
            const entry = dayEntries.find(e => {
              const hStart = parseInt(e.startTime.split(':')[0]);
              const hEnd = parseInt(e.endTime.split(':')[0]);
              const sHour = parseInt(slot.split(':')[0]);
              return sHour >= hStart && sHour < hEnd;
            });

            return (
              <div key={slot} className="group relative flex items-start gap-4 md:gap-8 lg:gap-12 min-h-[80px]">
                <div className="w-12 md:w-20 pt-1 text-right">
                  <span className={`text-[10px] md:text-sm font-black transition-colors ${entry ? 'text-brand-blue' : 'text-slate-700'}`}>{slot}</span>
                </div>
                <div className="flex-1 pb-4 relative">
                  <div className="absolute top-3 left-0 right-0 h-px bg-slate-800/50 -z-10"></div>
                  {entry ? (
                    entry.startTime.startsWith(slot.split(':')[0]) && (
                      <div 
                        onClick={() => handleEdit(entry)}
                        className="bg-slate-900 border border-slate-700/50 p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-xl transition-all hover:border-brand-blue hover:translate-x-1 cursor-pointer group/card relative overflow-hidden"
                        style={{ minHeight: `${Math.max(80, (calculateDuration(entry.startTime, entry.endTime) / 60) * 80)}px` }}
                      >
                        <div className="absolute top-0 left-0 w-1 md:w-2 h-full bg-brand-blue"></div>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[8px] md:text-[10px] font-black bg-brand-blue/20 text-brand-blue px-2 py-0.5 rounded-md uppercase tracking-wider">{calculateDuration(entry.startTime, entry.endTime) / 60}h Session</span>
                              {entry.location && <span className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><MapPin size={8} className="text-brand-orange" /> {entry.location}</span>}
                            </div>
                            <h4 className="font-black text-sm md:text-2xl text-white mb-1 tracking-tight">{entry.subject}</h4>
                            <p className="text-[9px] md:text-xs font-bold text-slate-400 flex items-center gap-1"><Clock size={10} className="text-brand-blue" /> {entry.startTime} — {entry.endTime}</p>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id); }} className="p-2 text-slate-700 hover:text-red-500 transition-all active:scale-90"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    )
                  ) : (
                    <button onClick={() => handleOpenAdd(activeDay, slot)} className="w-full text-left py-4 px-6 rounded-xl md:rounded-[2rem] border-2 border-dashed border-slate-800 hover:border-brand-blue/30 hover:bg-slate-900/30 transition-all flex items-center justify-between group/btn">
                      <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 group-hover/btn:text-slate-500">Available Window</span>
                      <Plus size={16} className="text-slate-800 group-hover/btn:text-brand-blue transition-colors" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Generator Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in">
          <div className="bg-[#0f172a] w-full max-w-2xl rounded-[2rem] md:rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="px-6 py-4 md:px-10 md:py-8 border-b border-slate-800 flex items-center justify-between bg-festive-gradient">
                <div className="flex items-center gap-3 md:gap-4 text-white">
                  <BrainCircuit size={24} className="md:w-8 md:h-8" />
                  <div>
                    <h3 className="text-lg md:text-2xl font-black">AI Timetable Magic</h3>
                    <p className="text-[8px] md:text-[10px] font-bold uppercase opacity-80 tracking-widest">For {profile.name || 'Scholar'}</p>
                  </div>
                </div>
                <button onClick={() => setIsAiModalOpen(false)} className="text-white hover:scale-110 transition-transform"><X size={24} /></button>
             </div>

             <div className="p-6 md:p-10 space-y-6 md:space-y-8 max-h-[80vh] overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-2 gap-4 md:gap-8">
                  <div className="space-y-3">
                    <label className="block text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">School Start</label>
                    <input type="time" value={aiConstraints.schoolStart} onChange={e => setAiConstraints({...aiConstraints, schoolStart: e.target.value})} className="w-full px-4 py-3 md:px-6 md:py-4 bg-slate-900 border border-slate-800 rounded-xl font-bold text-white outline-none focus:border-brand-blue text-xs md:text-sm" />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">School End</label>
                    <input type="time" value={aiConstraints.schoolEnd} onChange={e => setAiConstraints({...aiConstraints, schoolEnd: e.target.value})} className="w-full px-4 py-3 md:px-6 md:py-4 bg-slate-900 border border-slate-800 rounded-xl font-bold text-white outline-none focus:border-brand-blue text-xs md:text-sm" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <CalendarOff size={14} className="text-brand-orange" /> School Holidays (Extra Study Days)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map(day => (
                      <button 
                        key={day} 
                        type="button" 
                        onClick={() => toggleHoliday('school', day)}
                        className={`px-3 py-1.5 rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-tighter transition-all border ${
                          aiConstraints.schoolHolidays.includes(day) 
                            ? 'bg-brand-orange border-brand-orange text-white' 
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-8 border-t border-slate-800 pt-6">
                  <div className="space-y-3">
                    <label className="block text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Coaching Start</label>
                    <input type="time" value={aiConstraints.coachingStart} onChange={e => setAiConstraints({...aiConstraints, coachingStart: e.target.value})} className="w-full px-4 py-3 md:px-6 md:py-4 bg-slate-900 border border-slate-800 rounded-xl font-bold text-white outline-none focus:border-brand-blue text-xs md:text-sm" />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Coaching End</label>
                    <input type="time" value={aiConstraints.coachingEnd} onChange={e => setAiConstraints({...aiConstraints, coachingEnd: e.target.value})} className="w-full px-4 py-3 md:px-6 md:py-4 bg-slate-900 border border-slate-800 rounded-xl font-bold text-white outline-none focus:border-brand-blue text-xs md:text-sm" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <CalendarOff size={14} className="text-brand-blue" /> Coaching Holidays
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map(day => (
                      <button 
                        key={day} 
                        type="button" 
                        onClick={() => toggleHoliday('coaching', day)}
                        className={`px-3 py-1.5 rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-tighter transition-all border ${
                          aiConstraints.coachingHolidays.includes(day) 
                            ? 'bg-brand-blue border-brand-blue text-white' 
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-800 pt-6">
                  <label className="block text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Focus Disciplines</label>
                  <input type="text" value={aiConstraints.focusSubjects} onChange={e => setAiConstraints({...aiConstraints, focusSubjects: e.target.value})} placeholder="e.g., Physics, Organic Chemistry" className="w-full px-4 py-3 md:px-6 md:py-4 bg-slate-900 border border-slate-800 rounded-xl font-bold text-white outline-none focus:border-brand-blue text-xs md:text-sm" />
                </div>

                <div className="p-4 bg-brand-blue/5 border border-brand-blue/20 rounded-xl text-brand-blue/80 text-[10px] font-medium leading-relaxed">
                  <Sparkles size={12} className="inline mr-2" />
                  On Holidays, the AI will prioritize deep-focus sessions and structured revision to maximize your productivity while keeping you fresh.
                </div>

                <button 
                  onClick={handleGenerateAiTimetable}
                  disabled={isGenerating}
                  className="w-full py-5 bg-festive-gradient text-white font-black rounded-xl md:rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all uppercase tracking-widest text-[10px] md:text-xs"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Guru is Thinking...
                    </>
                  ) : (
                    <>
                      <Wand2 size={20} />
                      Lock in New Routine
                    </>
                  )}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Manual Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0f172a] w-full max-w-lg rounded-[2rem] md:rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-brand-blue/10">
               <div>
                  <h3 className="text-xl font-black text-white">{editingEntry ? 'Refine Session' : 'Plan Deep Study'}</h3>
                  <p className="text-[8px] font-black text-brand-blue uppercase tracking-widest mt-0.5">{activeDay} Selection</p>
               </div>
               <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Session Title</label>
                <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="e.g., Matrix Calculus Review" className="w-full px-5 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:border-brand-blue font-bold text-white outline-none text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-3">
                   <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">Start</label>
                   <input required type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full px-5 py-3 bg-slate-900 border border-slate-800 rounded-xl font-bold text-white text-sm" />
                 </div>
                 <div className="space-y-3">
                   <label className="block text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1">End</label>
                   <input required type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full px-5 py-3 bg-slate-900 border border-slate-800 rounded-xl font-bold text-white text-sm" />
                 </div>
              </div>
              <button type="submit" className="w-full py-4 bg-brand-blue text-white font-black rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-widest text-[10px]">
                {editingEntry ? 'Save Changes' : 'Confirm Slot'}
              </button>
            </form>
          </div>
        </div>
      )}
      
      <div className="pt-2 px-2 flex justify-center">
        <AdsterraAd id="55ec911eca20ef6f6a3a27adad217f37" format="banner" />
      </div>
    </div>
  );
};

export default Timetable;
