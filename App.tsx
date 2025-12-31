
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ListTodo, CalendarDays, Clock, Bot, Menu, X, Settings as SettingsIcon, GraduationCap, Coins, Play, Trophy, Timer, CheckCircle, BookOpen, MessageSquare, Files, Brain, HelpCircle, Cloud, CloudOff } from 'lucide-react';
import { View, TaskItem, TimetableEntry, Routine, UserProfile, Achievement, Subject } from './types';
import { StorageService } from './services/storage';
import { AdService } from './services/adService';
import { CloudStorage, supabase } from './services/supabase';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Timetable from './components/Timetable';
import RoutineTracker from './components/RoutineTracker';
import AICoach from './components/AICoach';
import Settings from './components/Settings';
import Achievements from './components/Achievements';
import CalendarView from './components/CalendarView';
import FocusTimer from './components/FocusTimer';
import MockTests from './components/MockTests';
import LearningHub from './components/LearningHub';
import ScholarForum from './components/ScholarForum';
import DocumentVault from './components/DocumentVault';
import HelpCenter from './components/HelpCenter';
import SupabaseAuth from './components/SupabaseAuth';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [points, setPoints] = useState<number>(StorageService.getPoints());
  const [profile, setProfile] = useState<UserProfile>(StorageService.getProfile());
  const [achievements, setAchievements] = useState<Achievement[]>(StorageService.getAchievements());
  const [subjects, setSubjects] = useState<Subject[]>(StorageService.getSubjects());
  
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);

  // Dynamic SEO Metadata Update
  useEffect(() => {
    const viewTitles: Record<View, string> = {
      dashboard: 'Dashboard | Scholar Hub Pro',
      tasks: 'Study Tasks & Missions | Scholar Hub Pro',
      calendar: 'Academic Planner | Scholar Hub Pro',
      timetable: 'Study Timetable | Scholar Hub Pro',
      routine: 'Daily Routine Tracker | Scholar Hub Pro',
      'learning-hub': 'Learning Hub & Flashcards | Scholar Hub Pro',
      'mock-tests': 'AI Mock Tests | Scholar Hub Pro',
      forum: 'Scholar Community Forum | Scholar Hub Pro',
      docs: 'Resource Vault | Scholar Hub Pro',
      'ai-coach': 'Consult AI Guru | Scholar Hub Pro',
      'focus-timer': 'Deep Focus Mode | Scholar Hub Pro',
      achievements: 'My Awards | Scholar Hub Pro',
      settings: 'Settings | Scholar Hub Pro',
      help: 'Help Center | Scholar Hub Pro'
    };

    document.title = viewTitles[currentView] || 'Scholar Hub Pro';
    
    // Update Canonical URL
    const canonical = document.getElementById('canonical-tag') as HTMLLinkElement;
    if (canonical) {
      canonical.href = `https://beststudent-assistant.vercel.app/${currentView === 'dashboard' ? '' : currentView}`;
    }
  }, [currentView]);

  useEffect(() => {
    // Initial sync
    setPoints(StorageService.getPoints());
    setTasks(StorageService.getTasks());
    setTimetable(StorageService.getTimetable());
    setRoutines(StorageService.getRoutines());
    setAchievements(StorageService.getAchievements());
    setSubjects(StorageService.getSubjects());
    AdService.initialize();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) syncFromCloud();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) syncFromCloud();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleWatchAd = () => {
    const newPoints = points + 10;
    setPoints(newPoints);
    StorageService.savePoints(newPoints);
    AdService.showSmartlink();
    alert("Scholar Points Rewarded! +10 PTS Added.");
  };

  const syncFromCloud = async () => {
    const [tasksRes, subjectsRes, ttRes, routinesRes] = await Promise.all([
      CloudStorage.fetchTasks(),
      CloudStorage.fetchSubjects(),
      CloudStorage.fetchTimetable(),
      CloudStorage.fetchRoutines()
    ]);

    if (tasksRes.data && tasksRes.data.length > 0) {
      const formatted = tasksRes.data.map(t => ({
        id: t.id, title: t.title, dueDate: t.due_date, isCompleted: t.is_completed, priority: t.priority, subtasks: t.subtasks || []
      }));
      setTasks(formatted);
      StorageService.saveTasks(formatted);
    }

    if (subjectsRes.data && subjectsRes.data.length > 0) {
      setSubjects(subjectsRes.data as Subject[]);
      StorageService.saveSubjects(subjectsRes.data as Subject[]);
    }

    if (ttRes.data && ttRes.data.length > 0) {
      const formatted = ttRes.data.map(e => ({
        id: e.id, day: e.day, subject: e.subject, startTime: e.start_time, endTime: e.end_time, location: e.location
      }));
      setTimetable(formatted as TimetableEntry[]);
      StorageService.saveTimetable(formatted as TimetableEntry[]);
    }

    if (routinesRes.data && routinesRes.data.length > 0) {
      const formatted = routinesRes.data.map(r => ({
        id: r.id, title: r.title, time: r.time, isCompleted: r.is_completed, durationMinutes: r.duration_minutes
      }));
      setRoutines(formatted);
      StorageService.saveRoutines(formatted);
    }
  };

  const handleUpdateTasks = (newTasks: TaskItem[]) => {
    setTasks(newTasks);
    StorageService.saveTasks(newTasks);
    if (user) CloudStorage.saveTasks(newTasks);
  };

  const handleAddTask = (task: TaskItem) => {
    const updated = [...tasks, task];
    setTasks(updated);
    StorageService.saveTasks(updated);
    if (user) CloudStorage.saveTasks(updated);
    const newPoints = points + 5;
    setPoints(newPoints);
    StorageService.savePoints(newPoints);
  };

  const handleDeductPoints = (amount: number) => {
    const newPoints = Math.max(0, points - amount);
    setPoints(newPoints);
    StorageService.savePoints(newPoints);
  };

  const t = (en: string, hi: string) => profile.language === 'Hindi' ? hi : en;

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t('Dashboard', 'डैशबोर्ड') },
    { id: 'tasks', icon: ListTodo, label: t('Study Tasks', 'अध्ययन कार्य') },
    { id: 'calendar', icon: CalendarDays, label: t('Planner', 'नियोजक') },
    { id: 'timetable', icon: Clock, label: t('Timetable', 'समय-सारणी') },
    { id: 'routine', icon: CheckCircle, label: t('Routine', 'दिनचर्या') },
    { id: 'learning-hub', icon: Brain, label: t('Learning Hub', 'लर्निंग हब') },
    { id: 'mock-tests', icon: BookOpen, label: t('Mock Tests', 'मॉक टेस्ट') },
    { id: 'forum', icon: MessageSquare, label: t('Forum', 'फोरम') },
    { id: 'docs', icon: Files, label: t('Resources', 'संसाधन') },
    { id: 'ai-coach', icon: Bot, label: t('AI Guru', 'एआई गुरु') },
    { id: 'focus-timer', icon: Timer, label: t('Focus Mode', 'फोकस मोड') },
    { id: 'achievements', icon: Trophy, label: t('Awards', 'पुरस्कार') },
    { id: 'settings', icon: SettingsIcon, label: t('Settings', 'सेटिंग्स') },
    { id: 'help', icon: HelpCircle, label: t('Help', 'सहायता') },
  ];

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col md:flex-row font-sans overflow-hidden text-slate-200">
      {showAuth && <SupabaseAuth onClose={() => setShowAuth(false)} onSuccess={() => { setShowAuth(false); syncFromCloud(); }} />}
      
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a] border-r border-slate-800/50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center text-white shadow-lg neon-blue">
              <GraduationCap size={24} />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">Scholar Hub Pro</h1>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden ml-auto text-slate-500"><X size={24} /></button>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar pb-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentView(item.id as View); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-xs ${currentView === item.id ? 'bg-brand-blue text-white shadow-lg neon-blue scale-[1.02]' : 'text-slate-500 hover:bg-slate-800/40 hover:text-slate-200'}`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          
          <button 
            onClick={() => user ? CloudStorage.signOut() : setShowAuth(true)}
            className="mt-auto p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between group hover:border-brand-blue transition-all"
          >
            <div className="flex items-center gap-3">
              {user ? <Cloud className="text-emerald-400" size={18} /> : <CloudOff className="text-slate-600" size={18} />}
              <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-white">{user ? 'Cloud Active' : 'Offline Mode'}</span>
            </div>
            <SettingsIcon size={14} className="text-slate-600" />
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
        <header className="h-16 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800/50 flex items-center justify-between px-6 md:px-12 sticky top-0 z-40">
           <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-400 hover:bg-slate-800 rounded-xl transition-all"><Menu size={20} /></button>
           <div className="flex items-center gap-4 ml-auto">
              <button onClick={handleWatchAd} className="flex items-center gap-2 bg-brand-orange/10 px-3 py-1.5 rounded-lg border border-brand-orange/20 shadow-sm active:scale-95 transition-all">
                 <Coins size={14} className="text-brand-orange" />
                 <span className="text-xs font-black text-brand-orange">{points} PTS</span>
              </button>
           </div>
        </header>

        <div className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto no-scrollbar">
           {currentView === 'dashboard' && <Dashboard tasks={tasks} timetable={timetable} routines={routines} profile={profile} points={points} onNavigate={setCurrentView} onWatchAd={handleWatchAd} />}
           {currentView === 'tasks' && <Tasks tasks={tasks} onUpdateTasks={handleUpdateTasks} onAddTask={handleAddTask} />}
           {currentView === 'calendar' && <CalendarView tasks={tasks} timetable={timetable} onAddTask={handleAddTask} />}
           {currentView === 'timetable' && <Timetable entries={timetable} profile={profile} onUpdateEntries={(e) => { setTimetable(e); StorageService.saveTimetable(e); if (user) CloudStorage.saveTimetable(e); }} onAddEntry={(e) => { const n = [...timetable, e]; setTimetable(n); StorageService.saveTimetable(n); if (user) CloudStorage.saveTimetable(n); }} />}
           {currentView === 'routine' && <RoutineTracker routines={routines} onUpdateRoutines={(r) => { setRoutines(r); StorageService.saveRoutines(r); if (user) CloudStorage.saveRoutines(r); }} onAddRoutine={(r) => { const n = [...routines, r]; setRoutines(n); StorageService.saveRoutines(n); if (user) CloudStorage.saveRoutines(n); }} />}
           {currentView === 'ai-coach' && <AICoach tasks={tasks} userPoints={points} onDeductPoints={handleDeductPoints} onWatchAd={handleWatchAd} />}
           {currentView === 'focus-timer' && <FocusTimer tasks={tasks} onUpdateTasks={handleUpdateTasks} />}
           {currentView === 'achievements' && <Achievements achievements={achievements} onAddAchievement={(a) => { const n = [...achievements, a]; setAchievements(n); StorageService.saveAchievements(n); }} />}
           {currentView === 'settings' && <Settings profile={profile} setProfile={(p) => { setProfile(p); StorageService.saveProfile(p); CloudStorage.syncProfile(p); }} />}
           {currentView === 'learning-hub' && <LearningHub subjects={subjects} />}
           {currentView === 'mock-tests' && <MockTests subjects={subjects} />}
           {currentView === 'forum' && <ScholarForum profile={profile} />}
           {currentView === 'docs' && <DocumentVault subjects={subjects} />}
           {currentView === 'help' && <HelpCenter />}
        </div>
      </main>
    </div>
  );
};

export default App;
