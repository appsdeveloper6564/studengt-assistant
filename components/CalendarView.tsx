
import React, { useState } from 'react';
import { TaskItem, TimetableEntry } from '../types';
import { ChevronLeft, ChevronRight, Plus, PartyPopper, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import AdsterraAd from './AdsterraAd';

interface CalendarViewProps {
  tasks: TaskItem[];
  timetable: TimetableEntry[];
  onAddTask: (task: TaskItem) => void;
}

interface Festival {
  date: string;
  name: string;
  type: 'Holiday' | 'Festival' | 'National';
  color: string;
}

const INDIAN_FESTIVALS: Festival[] = [
  { date: '2024-01-26', name: 'Republic Day', type: 'National', color: 'orange' },
  { date: '2024-03-25', name: 'Holi', type: 'Festival', color: 'purple' },
  { date: '2024-04-09', name: 'Gudi Padwa', type: 'Festival', color: 'orange' },
  { date: '2024-08-15', name: 'Independence Day', type: 'National', color: 'blue' },
  { date: '2024-08-19', name: 'Raksha Bandhan', type: 'Festival', color: 'purple' },
  { date: '2024-08-26', name: 'Janmashtami', type: 'Festival', color: 'blue' },
  { date: '2024-09-07', name: 'Ganesh Chaturthi', type: 'Festival', color: 'orange' },
  { date: '2024-10-02', name: 'Gandhi Jayanti', type: 'National', color: 'blue' },
  { date: '2024-10-12', name: 'Dussehra', type: 'Festival', color: 'orange' },
  { date: '2024-10-31', name: 'Diwali', type: 'Festival', color: 'purple' },
  { date: '2024-12-25', name: 'Christmas', type: 'Festival', color: 'blue' },
  { date: '2025-01-26', name: 'Republic Day', type: 'National', color: 'orange' },
  { date: '2025-03-14', name: 'Holi', type: 'Festival', color: 'purple' },
  { date: '2025-08-15', name: 'Independence Day', type: 'National', color: 'blue' },
  { date: '2025-10-20', name: 'Diwali', type: 'Festival', color: 'purple' },
];

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, timetable, onAddTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const renderDays = () => {
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 lg:h-44 bg-slate-900/10 rounded-3xl border border-transparent opacity-30"></div>);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
      const dateStr = `${dayDate.getFullYear()}-${(dayDate.getMonth() + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      
      const dayTasks = tasks.filter(t => t.dueDate === dateStr);
      const festival = INDIAN_FESTIVALS.find(f => f.date === dateStr);
      const isToday = new Date().toDateString() === dayDate.toDateString();

      days.push(
        <div 
          key={d} 
          className={`h-32 lg:h-44 p-4 rounded-[2rem] border transition-all duration-300 hover:shadow-2xl relative group cursor-pointer overflow-hidden ${
            isToday ? 'bg-brand-blue/10 border-brand-blue shadow-lg scale-[1.02] z-10' : 'bg-[#0f172a] border-slate-800/50 hover:border-slate-700'
          }`}
        >
          {festival && (
            <div className={`absolute -top-4 -right-4 w-20 h-20 opacity-10 rotate-12`}>
               <PartyPopper size={64} className={`text-brand-${festival.color}`} />
            </div>
          )}

          <div className="flex justify-between items-start mb-3 relative z-10">
            <span className={`text-lg font-black ${isToday ? 'text-brand-blue drop-shadow-sm' : 'text-slate-500'}`}>{d}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddTask({ id: crypto.randomUUID(), title: 'Study Task', dueDate: dateStr, isCompleted: false, priority: 'Medium' });
              }}
              className="opacity-0 group-hover:opacity-100 p-2 bg-slate-800 text-white rounded-xl transition-all hover:bg-brand-orange shadow-lg"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-1.5 overflow-y-auto no-scrollbar max-h-[60%] relative z-10">
            {festival && (
              <div className={`text-[9px] font-black p-2 rounded-xl flex items-center gap-1 leading-tight shadow-md border-l-4
                ${festival.color === 'orange' ? 'bg-orange-500/10 text-orange-400 border-orange-500' : 
                  festival.color === 'purple' ? 'bg-purple-500/10 text-purple-400 border-purple-500' : 
                  'bg-brand-blue/10 text-brand-blue border-brand-blue'}`}
              >
                <Sparkles size={10} /> {festival.name}
              </div>
            )}
            
            {dayTasks.map(t => (
              <div key={t.id} className={`text-[9px] font-bold p-2 rounded-xl border-l-4 bg-brand-blue/10 border-brand-blue text-slate-200 truncate ${t.isCompleted ? 'opacity-40 line-through' : ''}`}>
                {t.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="flex flex-col lg:flex-row items-center justify-between mb-12 gap-8 bg-[#0f172a] p-10 rounded-[3rem] border border-slate-800 shadow-2xl">
        <div className="text-center lg:text-left">
          <h2 className="text-5xl font-black text-white tracking-tight">
            {monthNames[currentDate.getMonth()]} <span className="text-brand-purple">{currentDate.getFullYear()}</span>
          </h2>
          <div className="flex items-center gap-6 mt-4 justify-center lg:justify-start">
             <div className="flex items-center gap-2 text-[10px] font-black text-brand-orange uppercase tracking-widest bg-brand-orange/10 px-4 py-1.5 rounded-full border border-brand-orange/20">
                <PartyPopper size={14} /> Regional Events
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black text-brand-blue uppercase tracking-widest bg-brand-blue/10 px-4 py-1.5 rounded-full border border-brand-blue/20">
                <CalendarIcon size={14} /> Study Targets
             </div>
          </div>
        </div>
        <div className="flex bg-slate-900/50 p-2 rounded-[1.5rem] border border-slate-800 shadow-inner">
           <button onClick={prevMonth} className="p-4 text-slate-500 hover:text-white transition-all hover:bg-slate-800 rounded-xl"><ChevronLeft size={32} /></button>
           <button onClick={nextMonth} className="p-4 text-slate-500 hover:text-white transition-all hover:bg-slate-800 rounded-xl"><ChevronRight size={32} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 lg:gap-6 mb-8 px-4">
        {weekDays.map(day => (
          <div key={day} className="text-center text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-4 lg:gap-6 mb-12">
        {renderDays()}
      </div>

      <AdsterraAd id="55ec911eca20ef6f6a3a27adad217f37" format="banner" />
    </div>
  );
};

export default CalendarView;
