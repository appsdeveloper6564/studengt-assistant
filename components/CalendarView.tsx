
import React, { useState } from 'react';
import { TaskItem, TimetableEntry } from '../types';
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock } from 'lucide-react';

interface CalendarViewProps {
  tasks: TaskItem[];
  timetable: TimetableEntry[];
  onAddTask: (task: TaskItem) => void;
}

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

    // Padding for prev month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 lg:h-32 bg-slate-50/50 rounded-2xl border border-transparent"></div>);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      const dayTasks = tasks.filter(t => t.dueDate === dateStr);
      
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), d).toDateString();

      days.push(
        <div key={d} className={`h-24 lg:h-32 p-2 lg:p-4 rounded-2xl border transition-all hover:shadow-lg bg-white relative group cursor-pointer ${isToday ? 'border-blue-600 ring-2 ring-blue-50' : 'border-slate-100'}`}>
          <div className="flex justify-between items-start mb-2">
            <span className={`text-xs font-black ${isToday ? 'text-blue-600' : 'text-slate-400'}`}>{d}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddTask({
                  id: crypto.randomUUID(),
                  title: 'New Quick Task',
                  dueDate: dateStr,
                  isCompleted: false,
                  priority: 'Medium'
                });
              }}
              className="opacity-0 group-hover:opacity-100 p-1 bg-blue-50 text-blue-600 rounded-lg transition-all"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-1 overflow-y-auto no-scrollbar max-h-[80%]">
            {dayTasks.map(t => (
              <div key={t.id} className={`text-[9px] font-bold p-1 rounded border-l-2 bg-blue-50 border-blue-500 text-blue-700 truncate`}>
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
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800">{monthNames[currentDate.getMonth()]} <span className="text-blue-600">{currentDate.getFullYear()}</span></h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Study Planner Calendar</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border shadow-sm">
           <button onClick={prevMonth} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><ChevronLeft size={24} /></button>
           <button onClick={nextMonth} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><ChevronRight size={24} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 lg:gap-4 mb-4">
        {weekDays.map(day => (
          <div key={day} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 lg:gap-4">
        {renderDays()}
      </div>
    </div>
  );
};

export default CalendarView;
