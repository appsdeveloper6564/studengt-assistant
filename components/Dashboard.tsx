
import React, { useState, useEffect } from 'react';
import { TaskItem, TimetableEntry, Routine, View, UserProfile, GKQuestion } from '../types';
import { CheckCircle2, Sparkles, BrainCircuit, GraduationCap, Coins, Timer, Flame, Lightbulb, ChevronRight, BarChart3, TrendingUp, Loader2, Zap, Gift, HelpCircle, Check, X } from 'lucide-react';
// Added missing imports for charting components
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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
  addPoints: (amount: number) => void;
}

const GKChallenge: React.FC<{ 
  profile: UserProfile; 
  onCorrect: () => void;
}> = ({ profile, onCorrect }) => {
  const [gk, setGk] = useState<GKQuestion | null>(StorageService.getGKQuestion());
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const GK_INTERVAL = 4 * 60 * 60 * 1000; // 4 Hours

  useEffect(() => {
    const checkGk = async () => {
      const lastTime = StorageService.getLastGKTime();
      const now = Date.now();
      
      if (!lastTime || (now - lastTime) >= GK_INTERVAL) {
        setIsGenerating(true);
        const newGk = await AIService.generateGKQuestion(profile.language || 'English');
        if (newGk) {
          StorageService.saveGKQuestion(newGk);
          StorageService.saveLastGKTime(now);
          setGk(newGk);
          setSelectedIdx(null);
          setIsWrong(false);
        }
        setIsGenerating(false);
      }
    };

    checkGk();
    const timer = setInterval(() => {
      const lastTime = StorageService.getLastGKTime();
      const now = Date.now();
      const diff = GK_INTERVAL - (now - lastTime);
      if (diff > 0) {
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        setTimeLeft(`${h}h ${m}m`);
      } else {
        setTimeLeft('Refreshing...');
        checkGk();
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [profile.language]);

  const handleAnswer = (idx: number) => {
    if (gk?.isAnswered || isGenerating) return;
    setSelectedIdx(idx);
    
    if (idx === gk?.correctAnswer) {
      const updated = { ...gk, isAnswered: true };
      setGk(updated);
      StorageService.saveGKQuestion(updated);
      onCorrect();
    } else {
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 1000);
    }
  };

  if (isGenerating) return (
    <div className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-800 animate-pulse flex flex-col items-center justify-center min-h-[200px]">
       <Loader2 className="animate-spin text-brand-orange mb-4" size={32} />
       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Generating IQ Challenge...</p>
    </div>
  );

  if (!gk) return null;

  return (
    <div className="bg-[#0f172a] p-8 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden">
       <div className="absolute top-0 right-0 p-6 flex flex-col items-end">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Next Challenge In</span>
          <span className="text-[10px] font-black text-brand-orange tabular-nums">{timeLeft}</span>
       </div>

       <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-brand-orange/10 text-brand-orange rounded-xl flex items-center justify-center border border-brand-orange/20">
             <HelpCircle size={24} />
          </div>
          <div>
             <h3 className="text-xl font-black text-white">Scholar Trivia</h3>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Earn 10 PTS Every 4h</p>
          </div>
       </div>

       <p className="text-lg font-bold text-slate-200 mb-8 leading-tight">{gk.question}</p>

       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {gk.options.map((opt, i) => {
            const isCorrect = gk.isAnswered && i === gk.correctAnswer;
            const isSelectedWrong = isWrong && selectedIdx === i;

            return (
              <button
                key={i}
                disabled={gk.isAnswered}
                onClick={() => handleAnswer(i)}
                className={`p-4 rounded-2xl text-xs font-bold text-left transition-all border flex justify-between items-center group
                  ${isCorrect ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 
                    isSelectedWrong ? 'bg-red-500/10 border-red-500 text-red-400 animate-shake' : 
                    'bg-slate-900 border-slate-800 text-slate-400 hover:border-brand-orange'}`}
              >
                <span>{opt}</span>
                {isCorrect && <Check size={14} />}
                {isSelectedWrong && <X size={14} />}
              </button>
            )
          })}
       </div>

       {gk.isAnswered && (
         <div className="mt-6 flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest animate-in fade-in zoom-in-95">
            <Sparkles size={14} /> Correct! +10 Scholar Points Added
         </div>
       )}
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ tasks, timetable, routines, profile, points, onNavigate, onWatchAd, addPoints }) => {
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
    try {
      const completed = tasks.filter(t => t.isCompleted).length;
      const insight = await AIService.getDailyInsight(profile, tasks.length, completed);
      setAiInsight(insight);
    } catch (e) {
      setAiInsight("Every small step leads to a giant leap. Keep studying!");
    } finally {
      setLoadingInsight(false);
    }
  };

  const handleClaimReward = () => {
    AdService.showSmartlink();
    onWatchAd();
  };

  const handleCorrectGk = () => {
    addPoints(10);
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
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                <span className="text-xs font-bold opacity-60 italic">Consulting the academic spirits...</span>
              </div>
            ) : (
              <p className="text-sm font-bold leading-relaxed">{aiInsight}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate('focus-timer')}
              className="px-6 py-3 md:px-8 md:py-4 bg-white text-brand-deep font-black rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95 flex items-center gap-2 text-sm"
            >
              <Timer size={18} /> {profile.language === 'Hindi' ? 'सत्र शुरू करें' : 'Start Focus'}
            </button>
            <button 
              onClick={handleClaimReward}
              className="px-6 py-3 md:px-8 md:py-4 bg-brand-orange text-white font-black rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95 flex items-center gap-2 text-sm"
            >
              <Gift size={18} /> {profile.language === 'Hindi' ? 'मुफ्त अंक' : 'Claim Points (Ad)'}
            </button>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 lg:right-20 lg:bottom-10 opacity-20 lg:opacity-40 scale-150 transition-transform group-hover:rotate-12 duration-700">
             <GraduationCap size={200} className="text-white drop-shadow-2xl" strokeWidth={1} />
        </div>
      </div>

      {/* GK Challenge Integrated */}
      <GKChallenge profile={profile} onCorrect={handleCorrectGk} />

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Completed', val: completedTasks, icon: CheckCircle2, color: 'text-brand-purple', bg: 'bg-brand-purple/10' },
          { label: 'Streak', val: `${streak} Days`, icon: Flame, color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
          { label: 'Points', val: points, icon: Coins, color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-800/50 hover:border-brand-blue/50 transition-all group cursor-pointer" onClick={() => AdService.showSmartlink()}>
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
               <BarChart3 size={24} className="text-brand-blue" /> Discipline Progress
            </h3>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Academic Metrics</div>
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
             <TrendingUp size={24} className="text-brand-orange" /> Master Objective
          </h3>
          <div className="h-60 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {/* Fixed cornerRadius error by moving it from Cell to Pie component */}
                <Pie data={taskData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none" cornerRadius={12}>
                  {taskData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-white">{tasks.length > 0 ? Math.round((completedTasks/tasks.length)*100) : 0}%</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Status</span>
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
                <h3 className="text-2xl font-black tracking-tight">Consult AI Guru Pro</h3>
                <p className="text-white/80 font-bold text-sm">Real-time academic problem solving</p>
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
