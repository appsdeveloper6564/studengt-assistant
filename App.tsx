
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ListTodo, CalendarDays, Clock, Bot, Menu, X, Settings as SettingsIcon, GraduationCap, Coins, Play, Trophy, Timer, CheckCircle } from 'lucide-react';
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

  useEffect(() => {
    setTasks(StorageService.getTasks());
    setTimetable(StorageService.getTimetable());
    setRoutines(StorageService.getRoutines());
    setPoints(StorageService.getPoints());
    setProfile(StorageService.getProfile());
    setAchievements(StorageService.getAchievements());
    AdService.initialize();
  }, []);

  const handleAddTask = (task: TaskItem) => {
    const updated = [...tasks, task];
    setTasks(updated);
    StorageService.saveTasks(updated);
    const newPoints = points + 5;
    setPoints(newPoints);
    StorageService.savePoints(newPoints);
  };

  const handleUpdateTasks = (newTasks: TaskItem[]) => {
    setTasks(newTasks);
    StorageService.saveTasks(newTasks);
  };

  const handleWatchAd = () => {
    // Adsterra Smartlink Trigger
    AdService.showSmartlink();
    
    // Grant points immediately as we can't track completion 100% on direct links
    const newPoints = points + 10;
    setPoints(newPoints);
    StorageService.savePoints(newPoints);
  };

  const handleDeductPoints = (amount: number) => {
    const newPoints = Math.max(0, points - amount);
    setPoints(newPoints);
    StorageService.savePoints(newPoints);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col md:flex-row font-sans overflow-hidden text-slate-200">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a] border-r border-slate-800/50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center text-white shadow-lg neon-blue">
              <GraduationCap size={24} />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">Scholar Hub</h1>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden ml-auto text-slate-500"><X size={24} /></button>
          </div>
          <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'tasks', icon: ListTodo, label: 'Study Tasks' },
              { id: 'calendar', icon: CalendarDays, label: 'Planner' },
              { id: 'timetable', icon: Clock, label: 'Timetable' },
              { id: 'routine', icon: CheckCircle, label: 'Routine' },
              { id: 'ai-coach', icon: Bot, label: 'AI Guru' },
              { id: 'focus-timer', icon: Timer, label: 'Focus Mode' },
              { id: 'achievements', icon: Trophy, label: 'Awards' },
              { id: 'settings', icon: SettingsIcon, label: 'Settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentView(item.id as View); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${currentView === item.id ? 'bg-brand-blue text-white shadow-lg neon-blue scale-[1.02]' : 'text-slate-500 hover:bg-slate-800/40 hover:text-slate-200'}`}
              >
                <item.icon size={22} />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
        <header className="h-20 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800/50 flex items-center justify-between px-6 md:px-12 sticky top-0 z-40">
           <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-400 hover:bg-slate-800 rounded-xl transition-all"><Menu size={24} /></button>
           <div className="flex items-center gap-4 ml-auto">
              <button onClick={handleWatchAd} className="flex items-center gap-2 bg-brand-orange/10 px-4 py-2 rounded-xl border border-brand-orange/20 shadow-sm active:scale-95 transition-all">
                 <Coins size={18} className="text-brand-orange" />
                 <span className="text-sm font-black text-brand-orange">{points} PTS</span>
              </button>
           </div>
        </header>
        <div className="flex-1 p-4 md:p-12 max-w-7xl mx-auto w-full overflow-y-auto no-scrollbar">
           {currentView === 'dashboard' && <Dashboard tasks={tasks} timetable={timetable} routines={routines} profile={profile} points={points} onNavigate={setCurrentView} onWatchAd={handleWatchAd} />}
           {currentView === 'tasks' && <Tasks tasks={tasks} onUpdateTasks={handleUpdateTasks} onAddTask={handleAddTask} />}
           {currentView === 'calendar' && <CalendarView tasks={tasks} timetable={timetable} onAddTask={handleAddTask} />}
           {currentView === 'timetable' && <Timetable entries={timetable} onUpdateEntries={(e) => { setTimetable(e); StorageService.saveTimetable(e); }} onAddEntry={(e) => { const n = [...timetable, e]; setTimetable(n); StorageService.saveTimetable(n); }} />}
           {currentView === 'routine' && <RoutineTracker routines={routines} onUpdateRoutines={(r) => { setRoutines(r); StorageService.saveRoutines(r); }} onAddRoutine={(r) => { const n = [...routines, r]; setRoutines(n); StorageService.saveRoutines(n); }} />}
           {currentView === 'ai-coach' && <AICoach tasks={tasks} userPoints={points} onDeductPoints={() => handleDeductPoints(10)} onWatchAd={handleWatchAd} />}
           {currentView === 'focus-timer' && <FocusTimer tasks={tasks} onUpdateTasks={handleUpdateTasks} />}
           {currentView === 'achievements' && <Achievements achievements={achievements} onAddAchievement={(a) => { const n = [...achievements, a]; setAchievements(n); StorageService.saveAchievements(n); }} />}
           {currentView === 'settings' && <Settings profile={profile} setProfile={(p) => { setProfile(p); StorageService.saveProfile(p); }} />}
        </div>
      </main>
    </div>
  );
};

export default App;
