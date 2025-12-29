
import React, { useState } from 'react';
import { TaskItem, TimetableEntry } from '../types';
import { ChevronLeft, ChevronRight, Plus, PartyPopper, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

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
  // 2025 Approximations
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
      days.push(<div key={`empty-${i}`} className="h-28 lg:h-36 bg-slate-50/30 rounded-3xl border border-transparent opacity-50"></div>);
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
          className={`h-28 lg:h-36 p-3 lg:p-4 rounded-[2rem] border transition-all hover:shadow-2xl bg-white relative group cursor-pointer overflow-hidden ${
            isToday ? 'border-brand-purple ring-4 ring-purple-50 shadow-xl' : 'border-slate-100 hover:border-brand-orange/30'
          }`}
        >
          {festival && (
            <div className={`absolute top-0 right-0 w-12 h-12 flex items-center justify-center opacity-10 -mr-2 -mt-2 rotate-12`}>
               <PartyPopper size={40} className={`text-brand-${festival.color}`} />
            </div>
          )}

          <div className="flex justify-between items-start mb-2 relative z-10">
            <span className={`text-sm font-black ${isToday ? 'text-brand-purple' : 'text-slate-400'}`}>{d}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddTask({
                  id: crypto.randomUUID(),
                  title: 'New Study Task',
                  dueDate: dateStr,
                  isCompleted: false,
                  priority: 'Medium'
                });
              }}
              className="opacity-0 group-hover:opacity-100 p-2 bg-brand-orange/10 text-brand-orange rounded-xl transition-all active:scale-90"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-1 overflow-y-auto no-scrollbar max-h-[70%]">
            {festival && (
              <div className={`text-[9px] font-black p-1.5 rounded-lg flex items-center gap-1 leading-tight mb-1 shadow-sm
                ${festival.color === 'orange' ? 'bg-orange-100 text-orange-700 border-l-4 border-orange-500' : 
                  festival.color === 'purple' ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-500' : 
                  'bg-blue-100 text-blue-700 border-l-4 border-blue-500'}`}
              >
                <Sparkles size={10} /> {festival.name}
              </div>
            )}
            
            {dayTasks.map(t => (
              <div key={t.id} className="text-[9px] font-bold p-1.5 rounded-lg border-l-2 bg-blue-50 border-brand-blue text-brand-blue truncate">
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
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 pb-10">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-black text-brand-deep tracking-tight">
            {monthNames[currentDate.getMonth()]} <span className="text-brand-purple">{currentDate.getFullYear()}</span>
          </h2>
          <div className="flex items-center gap-4 mt-2 justify-center md:justify-start">
             <div className="flex items-center gap-1.5 text-[10px] font-black text-brand-orange uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
                <PartyPopper size={12} /> Festivals
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-black text-brand-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                <CalendarIcon size={12} /> Study Blocks
             </div>
          </div>
        </div>
        <div className="flex bg-slate-50 p-2 rounded-2xl border border-slate-100">
           <button onClick={prevMonth} className="p-3 text-slate-400 hover:text-brand-purple transition-all hover:bg-white rounded-xl shadow-sm"><ChevronLeft size={28} /></button>
           <button onClick={nextMonth} className="p-3 text-slate-400 hover:text-brand-purple transition-all hover:bg-white rounded-xl shadow-sm"><ChevronRight size={28} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3 lg:gap-5 mb-6 px-4">
        {weekDays.map(day => (
          <div key={day} className="text-center text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-3 lg:gap-5">
        {renderDays()}
      </div>
    </div>
  );
};

export default CalendarView;
