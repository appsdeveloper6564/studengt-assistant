import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ListTodo, CalendarDays, Clock, Bot, Menu, X, Settings as SettingsIcon, GraduationCap, Sun, Moon, Coffee, Coins, Play, Loader2, Sparkles } from 'lucide-react';
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

  const [isAdLoading, setIsAdLoading] = useState(false);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);

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
    if (newCompletedCount > oldCompletedCount) addPoints(10);
    setTasks(newTasks);
    StorageService.saveTasks(newTasks);
  };

  const updateTimetable = (newEntries: TimetableEntry[]) => {
    setTimetable(newEntries);
    StorageService.saveTimetable(newEntries);
  };

  const updateRoutines = (newRoutines: Routine[]) => {
    const oldCompletedCount = routines.filter(r => r.isCompleted).length;
    const newCompletedCount = newRoutines.filter(r => r.isCompleted).length;
    if (newCompletedCount > oldCompletedCount) addPoints(5);
    setRoutines(newRoutines);
    StorageService.saveRoutines(newRoutines);
  };

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    StorageService.saveProfile(newProfile);
  };

  const addPoints = (amount: number) => {
    const newPoints = points + amount;
    setPoints(newPoints);
    StorageService.savePoints(newPoints);
  };

  const toggleTheme = () => {
    const themes: ('light' | 'dark' | 'sepia')[] = ['light', 'dark', 'sepia'];
    const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const startAdSequence = async () => {
    setIsAdLoading(true);
    const success = await AdService.loadAd();
    setIsAdLoading(false);
    
    if (success) {
      // Try to show the real AdMob rewarded video
      AdService.showRewardedVideo(
        () => {
          // Success Callback
          claimAdReward();
        },
        () => {
          // Error or Browser Callback - fallback to simulation
          runSimulation();
        }
      );
    } else {
      runSimulation();
    }
  };

  const runSimulation = () => {
    setIsAdPlaying(true);
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

  const claimAdReward = () => {
    addPoints(10);
    setIsAdPlaying(false);
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
      case 'dashboard': return <Dashboard tasks={tasks} timetable={timetable} routines={routines} profile={profile} onNavigate={setCurrentView} onWatchAd={startAdSequence} />;
      case 'tasks': return <Tasks tasks={tasks} setTasks={updateTasks} />;
      case 'timetable': return <Timetable entries={timetable} setEntries={updateTimetable} />;
      case 'routine': return <RoutineTracker routines={routines} setRoutines={updateRoutines} />;
      case 'ai-coach': return <AICoach tasks={tasks} />;
      case 'settings': return <Settings profile={profile} setProfile={updateProfile} />;
      default: return <Dashboard tasks={tasks} timetable={timetable} routines={routines} profile={profile} onNavigate={setCurrentView} onWatchAd={startAdSequence} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-300">
      {isSidebarOpen && window.innerWidth < 1024 && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`card-surface border-r transition-all duration-300 ease-in-out flex flex-col z-40 fixed lg:relative h-full ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full lg:w-24 lg:translate-x-0 overflow-hidden'}`}>
        <div className="p-8 flex items-center justify-between h-24">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">
              <GraduationCap size={24} />
            </div>
            {isSidebarOpen && <span className="font-extrabold text-lg">Assistant</span>}
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2"><X size={20} /></button>
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
                currentView === item.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="font-bold text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6">
           <button onClick={startAdSequence} className={`w-full flex items-center justify-center gap-3 p-4 bg-yellow-400 text-yellow-950 rounded-xl font-black transition-all ${isAdLoading ? 'opacity-50' : 'active:scale-95'}`}>
             {isAdLoading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
             {isSidebarOpen && <span>Free +10 Pts</span>}
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 lg:h-24 border-b card-surface flex items-center justify-between px-6 lg:px-12 sticky top-0 z-10 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500"><Menu size={24} /></button>
            <h1 className="text-lg lg:text-2xl font-black capitalize tracking-tight">
              {currentView === 'dashboard' ? 'Overview' : currentView.replace('-', ' ')}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
               <Coins className="text-yellow-500" size={16} />
               <span className="font-black text-blue-700 text-sm">{points}</span>
             </div>
             <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center bg-white border rounded-xl text-slate-600 shadow-sm active:scale-95">
               {theme === 'light' ? <Sun size={20} /> : theme === 'dark' ? <Moon size={20} /> : <Coffee size={20} />}
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-12 no-scrollbar">
          <div className="max-w-6xl mx-auto pb-20">
            {renderContent()}
          </div>
        </div>
      </main>

      {isAdPlaying && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black p-4 lg:p-6">
          <div className="bg-white w-full max-w-xl rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col">
            <div className="aspect-video bg-slate-900 flex flex-col items-center justify-center relative">
               <div className="z-10 text-center text-white">
                  <GraduationCap size={64} className="text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-black">Ad Loading...</h3>
               </div>
               <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                  <div className="h-full bg-yellow-400 transition-all duration-1000 ease-linear" style={{ width: `${(5 - adCountdown) * 20}%` }} />
               </div>
            </div>
            <div className="p-8 flex flex-col items-center">
              {adCountdown > 0 ? (
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Granting Reward in {adCountdown}s</p>
              ) : (
                <div className="text-center">
                  <Sparkles size={40} className="text-emerald-500 mx-auto mb-4" />
                  <h4 className="text-xl font-black text-slate-800 mb-6">Success!</h4>
                  <button onClick={claimAdReward} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 active:scale-95">
                    Claim +10 Points
                  </button>
                </div>
              )}
            </div>
            <button onClick={() => adCountdown === 0 ? claimAdReward() : setIsAdPlaying(false)} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white"><X size={24} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;