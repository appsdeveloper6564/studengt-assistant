
import React, { useState, useEffect } from 'react';
import { TaskItem, TimetableEntry, Routine, View, UserProfile } from '../types';
import { CheckCircle2, Target, Sparkles, BrainCircuit, GraduationCap, Play, Coins, Timer, Flame, Lightbulb, ChevronRight, BarChart3, TrendingUp, Loader2, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { StorageService } from '../services/storage';
import { AIService } from '../services/ai';
import { AdService } from '../services/adService';
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

const Dashboard: React.FC<DashboardProps> = ({ tasks, timetable, routines, profile, points, onNavigate, onWatchAd }) => {
  const [streak, setStreak] = useState(0);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const subjects = StorageService.getSubjects();
  
  useEffect(() => {
    setStreak(StorageService.updateStreak());
    loadInsight();
  }, []);

  const loadInsight = async () => {
    setLoadingInsight(true);
    const completed = tasks.filter(t => t.isCompleted).length;
    const insight = await AIService.getDailyInsight(profile, tasks.length, completed);
    setAiInsight(insight);
    setLoadingInsight(false);
  };

  const handleBonusClaim = () => {
    AdService.showSmartlink();
    alert("Reward session initiated! Watch the content to unlock bonus points.");
  };

  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const pendingTasks = tasks.length - completedTasks;
  
  const subjectDistribution = subjects.map(s => ({
    name: s.name,
    completed: tasks.filter(t => t.subjectId === s.id && t.isCompleted).length,
    total: tasks.filter(t => t.subjectId === s.id).length,
    color: s.color
  })).filter(s => s.total > 0);

  const taskData = [
    { name: 'Done', value: completedTasks || 0.1 }, 
    { name: 'Todo', value: pendingTasks || 0.1 },
  ];
  
  const COLORS = ['#a855f7', '#3b82f6'];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-festive-gradient rounded-[3rem] p-8 md:p-12 text-white shadow-2xl neon-purple group">
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/20">
            <Sparkles size={14} className="text-yellow-300" />
            Scholar Pro Dashboard
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            {profile.language === 'Hindi' ? `नमस्ते, ${profile.name || 'छात्र'}` : `Namaste, ${profile.name || 'Scholar'}`}
          </h2>
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 mb-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
               <Lightbulb size={14} className="text-yellow-300" /> Guru's Word
            </h4>
            {loadingInsight ? (
              <Loader2 className="animate-spin text-white/50" size={20} />
            ) : (
              <p className="text-sm font-bold leading-relaxed">{aiInsight}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate('focus-timer')}
              className="px-6 py-3 md:px-8 md:py-4 bg-white text-brand-deep font-black rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95 flex items-center gap-2 text-sm"
            >
              <Timer size={18} /> {profile.language === 'Hindi' ? 'सत्र शुरू करें' : 'Start Session'}
            </button>
            <button 
              onClick={handleBonusClaim}
              className="px-6 py-3 md:px-8 md:py-4 bg-brand-orange text-white font-black rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95 flex items-center gap-2 text-sm"
            >
              <Zap size={18} fill="currentColor" /> {profile.language === 'Hindi' ? 'बोनस लें' : 'Claim Bonus'}
            </button>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 lg:right-20 lg:bottom-10 opacity-20 lg:opacity-40 scale-150 transition-transform group-hover:rotate-12 duration-700">
             <GraduationCap size={200} className="text-white drop-shadow-2xl" strokeWidth={1} />
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 bg-[#0f172a] p-10 rounded-[3rem] border border-slate-800/50 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white flex items-center gap-3">
               <BarChart3 size={24} className="text-brand-blue" /> Subject Progress
            </h3>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Performance Metrics</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Bar dataKey="completed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#0f172a] p-10 rounded-[3rem] border border-slate-800/50 shadow-2xl flex flex-col items-center justify-center">
          <h3 className="text-xl font-black mb-8 text-white w-full flex items-center gap-3">
             <TrendingUp size={24} className="text-brand-orange" /> Overall Goal Status
          </h3>
          <div className="h-60 w-full relative">
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
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Complete</span>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => onNavigate('ai-coach')}
        className="w-full p-8 rounded-[3rem] bg-gradient-to-r from-brand-blue via-brand-purple to-brand-orange text-white shadow-2xl flex items-center justify-between group active:scale-[0.98] transition-all"
      >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner group-hover:rotate-6 transition-transform">
                <BrainCircuit size={32} className="text-yellow-300" />
            </div>
            <div className="text-left">
                <h3 className="text-2xl font-black tracking-tight">AI Guru Pro</h3>
                <p className="text-white/80 font-bold text-sm">Full Academic Q&A Active</p>
            </div>
          </div>
          <ChevronRight size={32} className="group-hover:translate-x-2 transition-transform" />
      </button>

      <div className="pt-8">
        <AdsterraAd id="55ec911eca20ef6f6a3a27adad217f37" format="banner" />
      </div>
    </div>
  );
};

export default Dashboard;
