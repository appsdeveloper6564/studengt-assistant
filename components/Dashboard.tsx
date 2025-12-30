
import React, { useState, useEffect } from 'react';
import { TaskItem, TimetableEntry, Routine, View, UserProfile, Exam } from '../types';
import { CheckCircle2, Target, Sparkles, BrainCircuit, GraduationCap, Play, Coins, Timer, Flame, Lightbulb, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { StorageService } from '../services/storage';
import NativeAd from './NativeAd';
import AdsterraAd from './AdsterraAd';

interface DashboardProps {
  tasks: TaskItem[];
  timetable: TimetableEntry[];
  routines: Routine[];
  profile: UserProfile;
  points: number;
  onNavigate: (view: View) => void;
  onWatchAd: () => void;
}

const INDIAN_EXAMS: Exam[] = [
  { id: '1', name: 'JEE Main 2025', date: '2025-01-24', color: 'brand-blue' },
  { id: '2', name: 'CBSE Boards', date: '2025-02-15', color: 'brand-purple' },
  { id: '3', name: 'NEET UG 2025', date: '2025-05-04', color: 'brand-orange' },
];

const Dashboard: React.FC<DashboardProps> = ({ tasks, timetable, routines, profile, points, onNavigate, onWatchAd }) => {
  const [streak, setStreak] = useState(0);
  
  useEffect(() => {
    setStreak(StorageService.updateStreak());
  }, []);

  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const pendingTasks = tasks.length - completedTasks;
  const taskData = [
    { name: 'Done', value: completedTasks || 0.1 }, 
    { name: 'Todo', value: pendingTasks || 0.1 },
  ];
  const COLORS = ['#a855f7', '#3b82f6'];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-festive-gradient rounded-[3rem] p-10 text-white shadow-2xl neon-purple group">
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-white/20">
            <Sparkles size={14} className="text-yellow-300" />
            Scholar Pro Assistant
          </div>
          <h2 className="text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-tight">
            {profile.name ? `Namaste, ${profile.name}` : "Namaste, Scholar"}
          </h2>
          <p className="text-blue-50 text-xl font-medium mb-10 leading-relaxed max-w-sm">
            Ready to crush your {profile.grade || 'study'} goals today?
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate('focus-timer')}
              className="px-8 py-4 bg-white text-brand-deep font-black rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95 flex items-center gap-2"
            >
              <Timer size={20} /> Start Session
            </button>
            <button 
              onClick={onWatchAd}
              className="px-8 py-4 bg-brand-orange text-white font-black rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95 flex items-center gap-2"
            >
              <Play size={20} fill="currentColor" /> Earn Points
            </button>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 lg:right-20 lg:bottom-10 opacity-20 lg:opacity-40 scale-150 transition-transform group-hover:rotate-12 duration-700">
             <GraduationCap size={200} className="text-white drop-shadow-2xl" strokeWidth={1} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Completed', val: completedTasks, icon: CheckCircle2, color: 'text-brand-purple', bg: 'bg-brand-purple/10' },
              { label: 'Streak', val: `${streak} Days`, icon: Flame, color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
              { label: 'Points', val: points, icon: Coins, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-800/50 hover:border-brand-blue/50 transition-all group">
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 border border-white/5`}>
                  <stat.icon size={28} />
                </div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
                <h3 className="text-4xl font-black text-white">{stat.val}</h3>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onNavigate('ai-coach')}
            className="w-full p-8 rounded-[3rem] bg-gradient-to-r from-brand-blue via-brand-purple to-brand-orange text-white shadow-2xl flex items-center justify-between group relative overflow-hidden active:scale-[0.98] transition-all"
          >
             <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner group-hover:rotate-6 transition-transform">
                   <Lightbulb size={32} className="text-yellow-300" />
                </div>
                <div className="text-left">
                   <h3 className="text-2xl font-black tracking-tight">AI Homework Guru</h3>
                   <p className="text-white/80 font-bold text-sm">Solve complex doubts in seconds</p>
                </div>
             </div>
             <ChevronRight size={32} className="relative z-10 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-[#0f172a] rounded-[3rem] p-10 border border-slate-800/50 shadow-2xl">
            <h3 className="text-xl font-black mb-8 text-white flex items-center gap-3">
               <Target size={24} className="text-brand-orange" /> Study Vibe
            </h3>
            <div className="h-60 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taskData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                    {taskData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={12} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-white">{tasks.length > 0 ? Math.round((completedTasks/tasks.length)*100) : 0}%</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Adsterra Native Section */}
      <div className="animate-in fade-in zoom-in duration-700">
         <div className="flex items-center gap-3 mb-6 px-4">
            <Sparkles size={20} className="text-brand-orange" />
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Scholar Bonus Content</h4>
         </div>
         <NativeAd />
      </div>

      {/* Banner Ad Footer */}
      <AdsterraAd id="55ec911eca20ef6f6a3a27adad217f37" format="banner" />
    </div>
  );
};

export default Dashboard;
