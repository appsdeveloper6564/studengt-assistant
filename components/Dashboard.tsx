
import React, { useState } from 'react';
import { TaskItem, TimetableEntry, Routine, View, UserProfile, Exam } from '../types';
import { CheckCircle2, Clock, Target, Calendar, Sparkles, BrainCircuit, GraduationCap, Play, Coins, ExternalLink, Timer } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { StorageService } from '../services/storage';
import NativeAd from './NativeAd';

interface DashboardProps {
  tasks: TaskItem[];
  timetable: TimetableEntry[];
  routines: Routine[];
  profile: UserProfile;
  onNavigate: (view: View) => void;
  onWatchAd: () => void;
}

const INDIAN_EXAMS: Exam[] = [
  { id: '1', name: 'JEE Main 2025 (Tentative)', date: '2025-01-24', color: 'brand-blue' },
  { id: '2', name: 'CBSE Board Exams', date: '2025-02-15', color: 'brand-purple' },
  { id: '3', name: 'NEET UG 2025', date: '2025-05-04', color: 'brand-orange' },
];

const Dashboard: React.FC<DashboardProps> = ({ tasks, timetable, routines, profile, onNavigate, onWatchAd }) => {
  const [focusLevel, setFocusLevel] = useState(70);
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const pendingTasks = tasks.length - completedTasks;
  
  const taskData = [
    { name: 'Completed', value: completedTasks || (tasks.length === 0 ? 0 : 0.001) }, 
    { name: 'Pending', value: pendingTasks || (tasks.length === 0 ? 1 : 0.001) },
  ];

  const COLORS = ['#8b5cf6', '#f97316'];

  const getDayName = () => new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  const todayClasses = timetable.filter(e => e.day === getDayName());
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const getDaysRemaining = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-festive-gradient rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-100 group">
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-white/10">
            <Sparkles size={14} className="text-yellow-300" />
            Scholar Student Hub
          </div>
          <h2 className="text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-tight">
            {profile.name ? (
              <>Namaste, <span className="text-orange-200">{profile.name}</span></>
            ) : (
              <>Welcome <span className="text-orange-200">Scholar</span></>
            )}
          </h2>
          <p className="text-blue-50 text-xl font-medium mb-10 leading-relaxed max-w-sm">
            {profile.goal ? `Focus: ${profile.goal}` : 'Crush your study goals today!'}
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate('focus-timer')}
              className="px-8 py-4 bg-white text-indigo-700 font-black rounded-2xl hover:bg-orange-50 transition-all shadow-xl active:scale-95 flex items-center gap-2"
            >
              <Timer size={20} /> Start Session
            </button>
            <button 
              onClick={onWatchAd}
              className="px-8 py-4 bg-brand-orange text-white font-black rounded-2xl hover:bg-orange-600 transition-all shadow-xl active:scale-95 flex items-center gap-2"
            >
              <Play size={20} fill="currentColor" /> +10 Points
            </button>
          </div>
        </div>
        
        <div className="absolute -bottom-10 -right-10 lg:right-20 lg:bottom-10 opacity-30 lg:opacity-80 illustration-float">
          <div className="w-64 h-64 lg:w-96 lg:h-96 bg-white/10 backdrop-blur-3xl rounded-[4rem] border border-white/20 flex items-center justify-center rotate-12 shadow-2xl">
             <GraduationCap size={200} className="text-white drop-shadow-2xl" strokeWidth={1} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          
          {/* Indian Exam Countdown Section */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-orange-50 text-brand-orange rounded-xl flex items-center justify-center shadow-sm">
                   <Target size={24} />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-brand-deep">Major Exam Deadlines</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {INDIAN_EXAMS.map(exam => (
                  <div key={exam.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 relative overflow-hidden group hover:border-brand-purple transition-all">
                     <div className={`absolute top-0 right-0 w-16 h-16 opacity-5 -mr-4 -mt-4 transition-transform group-hover:scale-150`}>
                        <Clock size={64} className={`text-${exam.color}`} />
                     </div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{exam.name}</p>
                     <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-brand-deep">{getDaysRemaining(exam.date)}</span>
                        <span className="text-xs font-bold text-slate-400">days left</span>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Completed', val: completedTasks, icon: CheckCircle2, bg: 'bg-purple-50', text: 'text-brand-purple' },
              { label: 'Scholar Pts', val: StorageService.getPoints(), icon: Coins, bg: 'bg-orange-50', text: 'text-brand-orange' },
              { label: 'Routine Done', val: routines.filter(r => r.isCompleted).length, icon: Sparkles, bg: 'bg-blue-50', text: 'text-brand-blue' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white card-surface p-8 rounded-[2.5rem] shadow-sm border border-slate-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className={`w-14 h-14 ${stat.bg} ${stat.text} rounded-2xl flex items-center justify-center mb-6`}>
                  <stat.icon size={28} />
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                <h3 className="text-4xl font-black text-slate-800">{stat.val}</h3>
              </div>
            ))}
          </div>

          <div className="bg-white card-surface p-10 rounded-[3rem] shadow-sm border border-slate-50">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-indigo-50 text-brand-purple rounded-2xl flex items-center justify-center">
                  <Calendar size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-brand-deep">Today's Lectures</h3>
                  <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-1">{getDayName()}</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('timetable')}
                className="text-brand-purple font-black text-xs uppercase tracking-widest bg-purple-50 px-6 py-3 rounded-2xl hover:bg-purple-100 transition-all border border-purple-100"
              >
                Schedule
              </button>
            </div>
            
            {todayClasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {todayClasses.map((item) => (
                  <div key={item.id} className="relative group overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-2 bg-brand-orange rounded-full"></div>
                    <div className="pl-8 py-6 bg-slate-50/40 rounded-[2rem] border border-slate-100 group-hover:bg-orange-50/50 transition-all group-hover:border-brand-orange/20">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black text-brand-orange bg-white px-3 py-1.5 rounded-xl border border-orange-100 uppercase tracking-widest">{item.startTime}</span>
                        <span className="text-[9px] font-black text-slate-300 uppercase truncate max-w-[80px] tracking-tighter">{item.location}</span>
                      </div>
                      <h4 className="font-black text-xl text-slate-800 leading-tight truncate">{item.subject}</h4>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-300 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                <Calendar size={64} className="mb-6 opacity-10" />
                <p className="font-black text-slate-400 uppercase tracking-widest text-sm">No lectures today</p>
                <button onClick={() => onNavigate('timetable')} className="mt-4 text-brand-purple font-bold text-xs hover:underline">Plan your schedule</button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-brand-deep rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple blur-[60px] opacity-40"></div>
             <div className="flex items-center gap-4 mb-10 relative z-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                   <BrainCircuit size={24} className="text-orange-400" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">Focus Vibe</h3>
             </div>
             <div className="mb-10 relative z-10">
                <div className="flex justify-between text-[10px] font-black mb-4 opacity-60 uppercase tracking-[0.3em]">
                   <span>Rest</span>
                   <span>Peak</span>
                </div>
                <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-purple to-brand-orange transition-all duration-1000" 
                    style={{ width: `${focusLevel}%` }}
                  />
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={focusLevel} 
                    onChange={(e) => setFocusLevel(parseInt(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                  />
                </div>
             </div>
             <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/5 relative z-10">
                <p className="text-base font-medium leading-relaxed italic text-blue-100">
                  {focusLevel > 80 ? '🔥 Maximum Focus. Perfect for high-intensity Science/Math.' : 
                   focusLevel > 40 ? '✨ Study ready. Good for reading and organization.' : 
                   '😴 Low energy. You should rest according to your 10PM schedule.'}
                </p>
             </div>
          </div>

          <div className="bg-white card-surface p-10 rounded-[3rem] shadow-sm border border-slate-50">
            <h3 className="text-2xl font-black mb-8 text-brand-deep">Daily Effort</h3>
            <div className="h-60 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tasks.length > 0 ? taskData : [{ name: 'None', value: 1 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {taskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={12} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-brand-purple">{completionRate}%</span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-1">Goal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-12 border-t border-slate-100">
        <NativeAd />
      </div>
    </div>
  );
};

export default Dashboard;
