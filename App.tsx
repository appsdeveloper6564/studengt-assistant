import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ListTodo, CalendarDays, Clock, Bot, Menu, X, Settings as SettingsIcon, GraduationCap, Sun, Moon, Coffee, Coins, Play, Loader2, Sparkles, ExternalLink, CheckCircle } from 'lucide-react';
import { View, TaskItem, TimetableEntry, Routine, UserProfile } from './types';
import { StorageService } from './services/storage';
import { AdService } from './services/adService';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Timetable from './components/Timetable';
import RoutineTracker from './components/RoutineTracker';
import AICoach from './components/AICoach';
import Settings from './components/Settings';

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

  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adCountdown, setAdCountdown] = useState(0);
  const [pendingPoints, setPendingPoints] = useState<number>(0);
  const [hasClickedAd, setHasClickedAd] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sa_theme', theme);
  }, [theme]);

  useEffect(() => {
    AdService.initialize();
    setTasks(StorageService.getTasks());
    setTimetable(StorageService.getTimetable());
    setRoutines(StorageService.getRoutines());
    setPoints(StorageService.getPoints());
    setProfile(StorageService.getProfile());

    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateTasks = (newTasks: TaskItem[]) => {
    const oldCompletedCount = tasks.filter(t => t.isCompleted).length;
    const newCompletedCount = newTasks.filter(t => t.isCompleted).length;
    
    setTasks(newTasks);
    StorageService.saveTasks(newTasks);

    if (newCompletedCount > oldCompletedCount) {
      triggerPointAd(10); // Reward for task
    }
  };

  const updateRoutines = (newRoutines: Routine[]) => {
    const oldCompletedCount = routines.filter(r => r.isCompleted).length;
    const newCompletedCount = newRoutines.filter(r => r.isCompleted).length;
    
    setRoutines(newRoutines);
    StorageService.saveRoutines(newRoutines);

    if (newCompletedCount > oldCompletedCount) {
      triggerPointAd(5); // Reward for routine
    }
  };

  const triggerPointAd = (amount: number) => {
    setPendingPoints(amount);
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

  const claimReward = () => {
    const newPoints = points + pendingPoints;
    setPoints(newPoints);
    StorageService.savePoints(newPoints);
    setIsAdPlaying(false);
    setPendingPoints(0);
  };

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'tasks', icon: ListTodo, label: 'Task List' },
    { id: 'timetable', icon: CalendarDays, label: 'Timetable' },
    { id: 'routine', icon: Clock, label: 'Daily Routine' },
    { id: 'ai-coach', icon: Bot, label: 'Study Coach' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard tasks={tasks} timetable={timetable} routines={routines} profile={profile} onNavigate={setCurrentView} onWatchAd={() => triggerPointAd(10)} />;
      case 'tasks': return <Tasks tasks={tasks} setTasks={updateTasks} />;
      case 'timetable': return <Timetable entries={timetable} setEntries={(e) => { setTimetable(e); StorageService.saveTimetable(e); }} />;
      case 'routine': return <RoutineTracker routines={routines} setRoutines={updateRoutines} />;
      case 'ai-coach': return <AICoach tasks={tasks} />;
      case 'settings': return <Settings profile={profile} setProfile={(p) => { setProfile(p); StorageService.saveProfile(p); }} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300">
      <aside className={`card-surface border-r transition-all duration-300 ease-in-out flex flex-col z-40 fixed lg:relative h-full ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full lg:w-24 lg:translate-x-0 overflow-hidden'}`}>
        <div className="p-8 flex items-center justify-between h-24">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">
              <GraduationCap size={24} />
            </div>
            {isSidebarOpen && <span className="font-extrabold text-lg">Assistant</span>}
          </div>
        </div>
        <nav className="flex-1 px-4 mt-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
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
           <button onClick={() => triggerPointAd(10)} className="w-full flex items-center justify-center gap-3 p-4 bg-yellow-400 text-yellow-950 rounded-xl font-black active:scale-95 transition-all">
             <Play size={20} />
             {isSidebarOpen && <span>Free +10 Pts</span>}
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 lg:h-24 border-b card-surface flex items-center justify-between px-6 lg:px-12 sticky top-0 z-10 bg-white/80 backdrop-blur-md">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500"><Menu size={24} /></button>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
               <Coins className="text-yellow-500" size={16} />
               <span className="font-black text-blue-700 text-sm">{points}</span>
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 lg:p-12 no-scrollbar">
          <div className="max-w-6xl mx-auto pb-20">{renderContent()}</div>
        </div>
      </main>

      {/* REWARD AD MODAL */}
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
                  <button 
                    onClick={handleAdClick}
                    className="w-full flex items-center justify-center gap-3 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    <ExternalLink size={24} /> Visit & Verify
                  </button>
                ) : adCountdown > 0 ? (
                  <div className="w-full py-5 bg-slate-100 text-slate-400 rounded-2xl font-black text-lg border-2 border-dashed border-slate-200">
                    Verifying in {adCountdown}s...
                  </div>
                ) : (
                  <button 
                    onClick={claimReward}
                    className="w-full flex items-center justify-center gap-3 py-5 bg-emerald-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 animate-in fade-in slide-in-from-bottom-2"
                  >
                    <CheckCircle size={24} /> Claim {pendingPoints} Points
                  </button>
                )}
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">Verification required to prevent spam</p>
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