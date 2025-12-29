
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ListTodo, CalendarDays, Clock, Bot, Menu, X, Settings as SettingsIcon, GraduationCap, Coins, Play, Sparkles, ExternalLink, CheckCircle, Trophy, Calendar as CalendarIcon } from 'lucide-react';
import { View, TaskItem, TimetableEntry, Routine, UserProfile, Achievement } from './types';
import { StorageService } from './services/storage';
import { AdService } from './services/adService';
import { NotificationService } from './services/notificationService';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Timetable from './components/Timetable';
import RoutineTracker from './components/RoutineTracker';
import AICoach from './components/AICoach';
import Settings from './components/Settings';
import Achievements from './components/Achievements';
import CalendarView from './components/CalendarView';

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
    
    // Auto-close sidebar on mobile resize
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
    { id: 'calendar', icon: CalendarIcon, label: 'Calendar' },
    { id: 'achievements', icon: Trophy, label: 'Achievements' },
    { id: 'tasks', icon: ListTodo, label: 'Task List' },
    { id: 'timetable', icon: CalendarDays, label: 'Timetable' },
    { id: 'routine', icon: Clock, label: 'Daily Routine' },
    { id: 'ai-coach', icon: Bot, label: 'AI Solver' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard tasks={tasks} timetable={timetable} routines={routines} profile={profile} onNavigate={setCurrentView} onWatchAd={() => gateActionWithAd(() => {}, 10)} />;
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
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* SIDEBAR */}
      <aside className={`card-surface border-r transition-all duration-300 ease-in-out flex flex-col z-50 fixed lg:relative h-full ${isSidebarOpen ? 'w-72 translate-x-0 shadow-2xl' : 'w-0 -translate-x-full lg:w-24 lg:translate-x-0 overflow-hidden'}`}>
        <div className="p-8 flex items-center justify-between h-24">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">
              <GraduationCap size={24} />
            </div>
            {isSidebarOpen && <span className="font-extrabold text-lg text-slate-800">Assistant</span>}
          </div>
        </div>
        <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as View);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all ${
                currentView === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="font-bold text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>
        {isSidebarOpen && (
          <div className="p-6">
            <button onClick={() => gateActionWithAd(() => {}, 10)} className="w-full flex items-center justify-center gap-3 p-4 bg-yellow-400 text-yellow-950 rounded-2xl font-black active:scale-95 transition-all shadow-lg hover:bg-yellow-300">
               <Play size={20} /> Free +10 Pts
            </button>
          </div>
        )}
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 lg:h-24 border-b card-surface flex items-center justify-between px-6 lg:px-12 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-blue-600 rounded-lg lg:hidden flex items-center justify-center text-white shrink-0">
                <GraduationCap size={18} />
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
               <Coins className="text-yellow-500" size={16} />
               <span className="font-black text-blue-700 text-sm">{points}</span>
             </div>
          </div>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors ml-auto lg:hidden"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-12 no-scrollbar">
          <div className="max-w-6xl mx-auto pb-20">{renderContent()}</div>
        </div>

        {/* Achievement Unlock Popup */}
        {unlockedBadge && (
          <div className="fixed bottom-10 right-10 z-[110] animate-in slide-in-from-right-8 fade-in">
            <div className="bg-white border-2 border-yellow-400 p-6 rounded-3xl shadow-2xl flex items-center gap-4 max-w-sm">
              <div className="w-14 h-14 bg-yellow-400 text-yellow-950 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-100 shrink-0">
                <Trophy size={32} />
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-lg">Badge Unlocked!</h4>
                <p className="text-sm font-bold text-slate-500">{unlockedBadge.title}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* AD VERIFICATION OVERLAY */}
      {isAdPlaying && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl relative p-10 text-center animate-in zoom-in-95">
             <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Sparkles size={48} className="animate-pulse" />
             </div>
             <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">Security Verification</h3>
             <p className="text-slate-500 font-semibold mb-10 leading-relaxed">
               Please click the link below and wait 5 seconds to verify and earn your <span className="text-blue-600 font-black">+{pendingPoints || 'Bonus'} points</span>!
             </p>
             
             {!hasClickedAd ? (
               <button onClick={handleAdClick} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 flex items-center justify-center gap-3 hover:bg-blue-700 active:scale-95 transition-all">
                 <ExternalLink size={24} /> Start Verification
               </button>
             ) : adCountdown > 0 ? (
               <div className="w-full py-5 bg-slate-100 text-slate-400 rounded-2xl font-black text-lg border-2 border-dashed border-slate-200">
                 Verifying... {adCountdown}s
               </div>
             ) : (
               <button onClick={claimRewardAndProceed} className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                 <CheckCircle size={24} /> Confirm & Claim
               </button>
             )}
             
             <button onClick={() => setIsAdPlaying(false)} className="mt-8 text-sm font-bold text-slate-300 hover:text-slate-500 transition-colors uppercase tracking-widest">Skip for now</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
