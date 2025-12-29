import React, { useState } from 'react';
import { TaskItem, TimetableEntry, Routine, View, UserProfile } from '../types';
import { CheckCircle2, Clock, Target, Calendar, Sparkles, BrainCircuit, BookOpen, GraduationCap, Play, Coins, ExternalLink } from 'lucide-react';
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

const Dashboard: React.FC<DashboardProps> = ({ tasks, timetable, routines, profile, onNavigate, onWatchAd }) => {
  const [focusLevel, setFocusLevel] = useState(70);
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const pendingTasks = tasks.length - completedTasks;
  
  const taskData = [
    { name: 'Completed', value: completedTasks || (tasks.length === 0 ? 0 : 0.001) }, 
    { name: 'Pending', value: pendingTasks || (tasks.length === 0 ? 1 : 0.001) },
  ];

  const COLORS = ['#2563eb', '#e2e8f0'];

  const getDayName = () => new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  const todayClasses = timetable.filter(e => e.day === getDayName());
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-academic rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-200 group">
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/10">
            <Sparkles size={14} className="text-yellow-300" />
            {profile.school || 'Academic'} Student Hub
          </div>
          <h2 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight leading-tight">
            {profile.name ? (
              <>Welcome back, <span className="text-yellow-300">{profile.name}</span></>
            ) : (
              <>Welcome to <span className="text-yellow-300">Assistant</span></>
            )}
          </h2>
          <p className="text-blue-100 text-lg font-medium mb-8 leading-relaxed">
            {profile.goal ? `Working towards: ${profile.goal}` : 'Set your study goals in settings to track progress!'}
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => onNavigate('tasks')}
              className="px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-xl active:scale-95 flex items-center gap-2"
            >
              Get Started
            </button>
            <button 
              onClick={onWatchAd}
              className="px-8 py-4 bg-yellow-400 text-yellow-950 font-black rounded-2xl hover:bg-yellow-300 transition-all shadow-xl active:scale-95 flex items-center gap-2 border border-yellow-200"
            >
              <Play size={20} /> +10 Pts Ad
            </button>
          </div>
        </div>
        
        <div className="absolute -bottom-10 -right-10 lg:right-10 lg:bottom-10 opacity-30 lg:opacity-100 illustration-float">
          <div className="w-64 h-64 lg:w-80 lg:h-80 bg-white/10 backdrop-blur-3xl rounded-[3rem] border border-white/20 flex items-center justify-center rotate-12 shadow-inner">
             <GraduationCap size={160} className="text-white drop-shadow-2xl" strokeWidth={1} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Completed', val: completedTasks, icon: CheckCircle2, color: 'blue' },
              { label: 'Scholar Pts', val: StorageService.getPoints(), icon: Coins, color: 'yellow' },
              { label: 'Study Rate', val: `${completionRate}%`, icon: Target, color: 'emerald' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white card-surface p-8 rounded-[2rem] shadow-sm border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6`}>
                  <stat.icon size={28} className={stat.color === 'yellow' ? 'text-yellow-500' : 'text-blue-600'} />
                </div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black">{stat.val}</h3>
              </div>
            ))}
          </div>

          <div className="bg-white card-surface p-10 rounded-[2.5rem] shadow-sm border">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Today's Schedule</h3>
                  <p className="text-sm text-slate-400 font-medium">{getDayName()}</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('timetable')}
                className="text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
              >
                View Full
              </button>
            </div>
            
            {todayClasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {todayClasses.map((item) => (
                  <div key={item.id} className="relative group overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-1.5 bg-blue-600 rounded-full"></div>
                    <div className="pl-6 py-4 bg-slate-50/50 rounded-2xl border border-slate-100 group-hover:bg-blue-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-black text-blue-600 bg-white px-2 py-1 rounded-lg border border-blue-100">{item.startTime}</span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase truncate max-w-[80px]">{item.location}</span>
                      </div>
                      <h4 className="font-bold text-lg leading-tight truncate">{item.subject}</h4>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-slate-300 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                <Calendar size={48} className="mb-4 opacity-20" />
                <p className="font-bold text-slate-400">No lectures scheduled today!</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div className="bg-academic rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-100">
             <div className="flex items-center gap-3 mb-6">
                <BrainCircuit size={24} className="text-yellow-300" />
                <h3 className="text-lg font-black uppercase tracking-tight">Study Vibe</h3>
             </div>
             <div className="mb-8">
                <div className="flex justify-between text-[10px] font-black mb-2 opacity-80 uppercase tracking-[0.2em]">
                   <span>Rest</span>
                   <span>Deep Work</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={focusLevel} 
                  onChange={(e) => setFocusLevel(parseInt(e.target.value))}
                  className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer" 
                />
             </div>
             <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/5">
                <p className="text-sm font-medium leading-relaxed italic opacity-95">
                  {focusLevel > 80 ? '"Peak cognitive state. Tackle your hardest subjects now."' : 
                   focusLevel > 40 ? '"Good momentum. Perfect for focused study sessions."' : 
                   '"Low energy detected. Use this time for light review or planning."'}
                </p>
             </div>
          </div>

          <div className="bg-white card-surface p-10 rounded-[2.5rem] shadow-sm border">
            <h3 className="text-xl font-black mb-8">Reward Progress</h3>
            <div className="h-56 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tasks.length > 0 ? taskData : [{ name: 'None', value: 1 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={10}
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
                <span className="text-3xl font-black">{completionRate}%</span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Scholar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADSTERRA NATIVE BANNER AREA */}
      <div className="mt-10 pt-10 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-6 opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all">
          <div className="h-px flex-1 bg-slate-300"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
            Academic Partner <ExternalLink size={10} />
          </span>
          <div className="h-px flex-1 bg-slate-300"></div>
        </div>
        
        <NativeAd />
      </div>
    </div>
  );
};

export default Dashboard;