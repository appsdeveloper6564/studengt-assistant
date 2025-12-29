
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ListTodo, CalendarDays, Clock, Bot, Menu, X, Settings as SettingsIcon, GraduationCap, Coins, Play, Sparkles, ExternalLink, CheckCircle, Trophy, PartyPopper, Timer } from 'lucide-react';
import { View, TaskItem, TimetableEntry, Routine, UserProfile, Achievement } from './types';
import { StorageService } from './services/storage';
import { AdService } from './services/adService';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Timetable from './components/Timetable';
import RoutineTracker from './components/RoutineTracker';
import AICoach from './components/AICoach';
import Settings from './components/Settings';
import Achievements from './components/Achievements';
import CalendarView from './components/CalendarView';
import FocusTimer from './components/FocusTimer';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [profile, setProfile] = useState<UserProfile>(StorageService.getProfile());
  const [achievements, setAchievements] = useState<Achievement[]>(StorageService.getAchievements());

  // Ad Gate State
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adCountdown, setAdCountdown] = useState(0);
  const [pendingPoints, setPendingPoints] = useState<number>(0);
  const [hasClickedAd, setHasClickedAd] = useState(false);
  const [adCallback, setAdCallback] = useState<(() => void) | null>(null);
  const [unlockedBadge, setUnlockedBadge] = useState<Achievement | null>(null);

  useEffect(() => {
    setTasks(StorageService.getTasks());
    setTimetable(StorageService.getTimetable());
    setRoutines(StorageService.getRoutines());
    setPoints(StorageService.getPoints());
    setProfile(StorageService.getProfile());
    setAchievements(StorageService.getAchievements());
    
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const checkAchievements = (type: Achievement['type'], value: number) => {
    const updated = achievements.map(ach => {
      if (ach.type === type && !ach.isUnlocked && value >= ach.requirement) {
        setUnlockedBadge(ach);
        setTimeout(() => setUnlockedBadge(null), 5000);
        return { ...ach, isUnlocked: true, unlockedAt: new Date().toISOString() };
      }
      return ach;
    });
    setAchievements(updated);
    StorageService.saveAchievements(updated);
  };

  const gateActionWithAd = (callback: () => void, rewardPoints: number = 0) => {
    setPendingPoints(rewardPoints);
    setAdCallback(() => callback);
    setHasClickedAd(false);
    setAdCountdown(0);
    setIsAdPlaying(true);
  };

  const handleAdClick = () => {
    AdService.triggerDirectLink();
    setHasClickedAd(true);
    setAdCountdown(5);
    const interval = setInterval(() => {
      setAdCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const claimRewardAndProceed = () => {
    if (pendingPoints > 0) {
      const newPoints = points + pendingPoints;
      setPoints(newPoints);
      StorageService.savePoints(newPoints);
    }
    if (adCallback) adCallback();
    setIsAdPlaying(false);
    setAdCallback(null);
  };

  const updateTasks = (newTasks: TaskItem[]) => {
    setTasks(newTasks);
    StorageService.saveTasks(newTasks);
  };

  const updateTimetable = (newEntries: TimetableEntry[]) => {
    setTimetable(newEntries);
    StorageService.saveTimetable(newEntries);
  };

  const updateRoutines = (newRoutines: Routine[]) => {
    setRoutines(newRoutines);
    StorageService.saveRoutines(newRoutines);
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'focus-timer', icon: Timer, label: 'Focus Mode' },
    { id: 'calendar', icon: PartyPopper, label: 'Planner' },
    { id: 'achievements', icon: Trophy, label: 'Badges' },
    { id: 'tasks', icon: ListTodo, label: 'Tasks' },
    { id: 'timetable', icon: CalendarDays, label: 'Lectures' },
    { id: 'routine', icon: Clock, label: 'Routine' },
    { id: 'ai-coach', icon: Bot, label: 'AI Guru' },
    { id: 'settings', icon: SettingsIcon, label: 'Profile' },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard tasks={tasks} timetable={timetable} routines={routines} profile={profile} onNavigate={setCurrentView} onWatchAd={() => gateActionWithAd(() => {}, 10)} />;
      case 'focus-timer': return <FocusTimer tasks={tasks} onUpdateTasks={updateTasks} />;
      case 'calendar': return <CalendarView tasks={tasks} timetable={timetable} onAddTask={(t) => gateActionWithAd(() => updateTasks([...tasks, t]))} />;
      case 'achievements': return <Achievements achievements={achievements} onAddAchievement={(ach) => gateActionWithAd(() => { const updated = [...achievements, ach]; setAchievements(updated); StorageService.saveAchievements(updated); })} />;
      case 'tasks': return <Tasks tasks={tasks} onUpdateTasks={updateTasks} onAddTask={(t) => gateActionWithAd(() => updateTasks([...tasks, t]), 5)} />;
      case 'timetable': return <Timetable entries={timetable} onUpdateEntries={updateTimetable} onAddEntry={(e) => gateActionWithAd(() => updateTimetable([...timetable, e]), 5)} />;
      case 'routine': return <RoutineTracker routines={routines} onUpdateRoutines={updateRoutines} onAddRoutine={(r) => gateActionWithAd(() => updateRoutines([...routines, r]), 5)} />;
      case 'ai-coach': return <AICoach tasks={tasks} userPoints={points} onDeductPoints={() => setPoints(p => { const np = p - 10; StorageService.savePoints(np); return np; })} onWatchAd={() => gateActionWithAd(() => {}, 20)} onAIConsult={() => checkAchievements('ai', 1)} />;
      case 'settings': return <Settings profile={profile} setProfile={(p) => gateActionWithAd(() => { setProfile(p); StorageService.saveProfile(p); })} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#fcfaff] font-sans">
      {/* SIDEBAR */}
      <aside className={`bg-brand-deep transition-all duration-500 ease-in-out flex flex-col z-50 fixed lg:relative h-full ${isSidebarOpen ? 'w-72 translate-x-0 shadow-2xl' : 'w-0 -translate-x-full lg:w-24 lg:translate-x-0 overflow-hidden'}`}>
        <div className="p-8 flex items-center justify-between h-24">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-festive-gradient rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shrink-0 rotate-3">
              <GraduationCap size={28} />
            </div>
            {isSidebarOpen && <span className="font-black text-xl text-white tracking-tight">Assistant</span>}
          </div>
        </div>
        <nav className="flex-1 px-4 mt-8 space-y-2 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as View);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-5 px-6 py-4 rounded-[1.5rem] transition-all duration-300 ${
                currentView === item.id 
                ? 'bg-festive-gradient text-white shadow-xl shadow-indigo-900/40 scale-105' 
                : 'text-indigo-300/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={22} strokeWidth={2.5} />
              {isSidebarOpen && <span className="font-black text-sm uppercase tracking-widest">{item.label}</span>}
            </button>
          ))}
        </nav>
        {isSidebarOpen && (
          <div className="p-8">
            <button onClick={() => gateActionWithAd(() => {}, 10)} className="w-full flex items-center justify-center gap-3 p-5 bg-brand-orange text-white rounded-[2rem] font-black hover:scale-105 transition-all shadow-xl shadow-orange-950/20 active:scale-95 uppercase text-xs tracking-[0.2em]">
               <Play size={18} fill="currentColor" /> +10 Scholar Pts
            </button>
          </div>
        )}
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 lg:h-28 border-b border-slate-50 bg-white/80 backdrop-blur-xl flex items-center justify-between px-8 lg:px-16 sticky top-0 z-40">
          <div className="flex items-center gap-6">
             <div className="w-12 h-12 bg-festive-gradient rounded-xl lg:hidden flex items-center justify-center text-white shrink-0 shadow-lg">
                <GraduationCap size={24} />
             </div>
             <div className="flex items-center gap-3 px-5 py-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-sm">
               <Coins className="text-brand-orange" size={20} />
               <span className="font-black text-brand-purple text-lg">{points}</span>
             </div>
          </div>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-3 text-brand-deep hover:bg-slate-50 rounded-2xl transition-all ml-auto lg:hidden border border-slate-100 shadow-sm"
          >
            {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-16 no-scrollbar">
          <div className="max-w-6xl mx-auto pb-32">{renderContent()}</div>
        </div>

        {/* Achievement Unlock Popup */}
        {unlockedBadge && (
          <div className="fixed bottom-12 right-12 z-[110] animate-in slide-in-from-right-12 fade-in duration-500">
            <div className="bg-brand-deep text-white p-8 rounded-[3rem] shadow-2xl flex items-center gap-6 border-2 border-brand-orange/30">
              <div className="w-16 h-16 bg-brand-orange text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl rotate-12 shrink-0">
                <Trophy size={36} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-black text-2xl tracking-tight">Milestone!</h4>
                <p className="text-indigo-200 font-bold uppercase text-[10px] tracking-widest">{unlockedBadge.title}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* AD VERIFICATION OVERLAY */}
      {isAdPlaying && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-deep/90 backdrop-blur-xl p-6 animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-sm rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] relative p-12 text-center animate-in zoom-in-95">
             <div className="w-28 h-28 bg-brand-orange/10 text-brand-orange rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                <Sparkles size={56} className="animate-pulse" />
             </div>
             <h3 className="text-3xl font-black text-brand-deep mb-4 tracking-tighter">Human Check</h3>
             <p className="text-slate-500 font-semibold mb-12 leading-relaxed">
               Help us verify and unlock your rewards. <span className="text-brand-orange font-black">+{pendingPoints || 'Bonus'} points</span> incoming!
             </p>
             
             {!hasClickedAd ? (
               <button onClick={handleAdClick} className="w-full py-6 bg-brand-purple text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-purple-200 flex items-center justify-center gap-4 hover:bg-brand-deep transition-all active:scale-95">
                 <ExternalLink size={24} /> Verify Now
               </button>
             ) : adCountdown > 0 ? (
               <div className="w-full py-6 bg-slate-50 text-slate-300 rounded-[2rem] font-black text-xl border-4 border-dashed border-slate-100">
                 {adCountdown}s
               </div>
             ) : (
               <button onClick={claimRewardAndProceed} className="w-full py-6 bg-emerald-500 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-emerald-200 flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4">
                 <CheckCircle size={24} /> Unlock Reward
               </button>
             )}
             
             <button onClick={() => setIsAdPlaying(false)} className="mt-10 text-[10px] font-black text-slate-300 hover:text-brand-deep transition-all uppercase tracking-[0.4em]">Cancel Request</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
