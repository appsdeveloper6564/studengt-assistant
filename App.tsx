
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ListTodo, CalendarDays, Clock, Bot, Menu, X, Settings as SettingsIcon, GraduationCap, Sun, Moon, Coffee, Coins, Play, Loader2, Sparkles, ExternalLink, CheckCircle, Trophy, Medal } from 'lucide-react';
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

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>(
    (localStorage.getItem('sa_theme') as any) || 'light'
  );
  
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [profile, setProfile] = useState<UserProfile>(StorageService.getProfile());
  const [achievements, setAchievements] = useState<Achievement[]>(StorageService.getAchievements());

  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adCountdown, setAdCountdown] = useState(0);
  const [pendingPoints, setPendingPoints] = useState<number>(0);
  const [hasClickedAd, setHasClickedAd] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState<Achievement | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sa_theme', theme);
  }, [theme]);

  useEffect(() => {
    AdService.initialize();
    NotificationService.requestPermission();
    
    setTasks(StorageService.getTasks());
    setTimetable(StorageService.getTimetable());
    setRoutines(StorageService.getRoutines());
    setPoints(StorageService.getPoints());
    setProfile(StorageService.getProfile());
    setAchievements(StorageService.getAchievements());

    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
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

  const updateTasks = (newTasks: TaskItem[]) => {
    const oldCompletedCount = tasks.filter(t => t.isCompleted).length;
    const newCompletedCount = newTasks.filter(t => t.isCompleted).length;
    
    setTasks(newTasks);
    StorageService.saveTasks(newTasks);

    if (newCompletedCount > oldCompletedCount) {
      triggerPointAd(10);
      checkAchievements('tasks', newCompletedCount);
    }
  };

  const deductPoints = (amount: number) => {
    const newPoints = Math.max(0, points - amount);
    setPoints(newPoints);
    StorageService.savePoints(newPoints);
    return newPoints;
  };

  const updateRoutines = (newRoutines: Routine[]) => {
    const oldCompletedCount = routines.filter(r => r.isCompleted).length;
    const newCompletedCount = newRoutines.filter(r => r.isCompleted).length;
    
    setRoutines(newRoutines);
    StorageService.saveRoutines(newRoutines);

    if (newCompletedCount > oldCompletedCount) {
      triggerPointAd(5);
      const streak = StorageService.updateStreak();
      checkAchievements('routine', streak);
    }
  };

  const triggerPointAd = (amount: number) => {
    setPendingPoints(amount);
    setHasClickedAd(false);
    setAdCountdown(0);
    setIsAdPlaying(true);
  };

  const claimReward = () => {
    const newPoints = points + pendingPoints;
    setPoints(newPoints);
    StorageService.savePoints(newPoints);
    checkAchievements('points', newPoints);
    setIsAdPlaying(false);
    setPendingPoints(0);
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

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'achievements', icon: Trophy, label: 'Achievements' },
    { id: 'tasks', icon: ListTodo, label: 'Task List' },
    { id: 'timetable', icon: CalendarDays, label: 'Timetable' },
    { id: 'routine', icon: Clock, label: 'Daily Routine' },
    { id: 'ai-coach', icon: Bot, label: 'AI Solver' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard tasks={tasks} timetable={timetable} routines={routines} profile={profile} onNavigate={setCurrentView} onWatchAd={() => triggerPointAd(10)} />;
      case 'achievements': return <Achievements achievements={achievements} />;
      case 'tasks': return <Tasks tasks={tasks} setTasks={updateTasks} />;
      case 'timetable': return <Timetable entries={timetable} setEntries={(e) => { setTimetable(e); StorageService.saveTimetable(e); }} />;
      case 'routine': return <RoutineTracker routines={routines} setRoutines={updateRoutines} />;
      case 'ai-coach': return <AICoach tasks={tasks} userPoints={points} onDeductPoints={() => deductPoints(10)} onWatchAd={() => triggerPointAd(15)} onAIConsult={() => checkAchievements('ai', 1)} />;
      case 'settings': return <Settings profile={profile} setProfile={(p) => { setProfile(p); StorageService.saveProfile(p); }} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300">
      {/* SIDEBAR */}
      <aside className={`card-surface border-r transition-all duration-300 ease-in-out flex flex-col z-50 fixed lg:relative h-full ${isSidebarOpen ? 'w-72 translate-x-0 shadow-2xl' : 'w-0 -translate-x-full lg:w-24 lg:translate-x-0 overflow-hidden'}`}>
        <div className="p-8 flex items-center justify-between h-24">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">
              <GraduationCap size={24} />
            </div>
            {isSidebarOpen && <span className="font-extrabold text-lg">Assistant</span>}
          </div>
          {isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          )}
        </div>
        <nav className="flex-1 px-4 mt-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as View);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all ${
                currentView === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="font-bold text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-6">
           <button onClick={() => triggerPointAd(10)} className="w-full flex items-center justify-center gap-3 p-4 bg-yellow-400 text-yellow-950 rounded-xl font-black active:scale-95 transition-all shadow-lg hover:bg-yellow-300">
             <Play size={20} />
             {isSidebarOpen && <span>Free +10 Pts</span>}
           </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 lg:h-24 border-b card-surface flex items-center justify-between px-6 lg:px-12 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-lg flex lg:hidden items-center justify-center text-white shrink-0">
                <GraduationCap size={18} />
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
               <Coins className="text-yellow-500" size={16} />
               <span className="font-black text-blue-700 text-sm">{points}</span>
             </div>
          </div>
          
          {/* Menu Toggle Moved to the Right */}
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

      {isAdPlaying && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-3xl flex items-center justify-center text-yellow-600 mx-auto mb-6">
                <Sparkles size={40} className="animate-pulse" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Scholar Points Ready!</h3>
              <p className="text-slate-500 font-medium mb-8">
                You've earned <span className="text-blue-600 font-bold">+{pendingPoints} Points</span>. Click below to verify and claim them!
              </p>
              <div className="space-y-3">
                {!hasClickedAd ? (
                  <button onClick={handleAdClick} className="w-full flex items-center justify-center gap-3 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
                    <ExternalLink size={24} /> Visit & Verify
                  </button>
                ) : adCountdown > 0 ? (
                  <div className="w-full py-5 bg-slate-100 text-slate-400 rounded-2xl font-black text-lg border-2 border-dashed border-slate-200">
                    Verifying in {adCountdown}s...
                  </div>
                ) : (
                  <button onClick={claimReward} className="w-full flex items-center justify-center gap-3 py-5 bg-emerald-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 animate-in fade-in slide-in-from-bottom-2">
                    <CheckCircle size={24} /> Claim {pendingPoints} Points
                  </button>
                )}
              </div>
            </div>
            <button onClick={() => setIsAdPlaying(false)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-500"><X size={20} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
