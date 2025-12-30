
import { TaskItem, TimetableEntry, Routine, UserProfile, Achievement, Subject } from '../types';

const STORAGE_KEYS = {
  TASKS: 'sa_tasks_v2',
  TIMETABLE: 'sa_timetable_v2',
  ROUTINE: 'sa_routine_v2',
  POINTS: 'sa_points_v2',
  PROFILE: 'sa_profile_v2',
  ACHIEVEMENTS: 'sa_achievements_v2',
  SUBJECTS: 'sa_subjects_v2',
  STREAK_DATE: 'sa_streak_date_v2',
  STREAK_COUNT: 'sa_streak_count_v2'
};

const safeGet = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return defaultValue;
  }
};

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'First Step', description: 'Complete your first task', icon: 'CheckCircle', requirement: 1, type: 'tasks', isUnlocked: false },
  { id: '2', title: 'Task Master', description: 'Complete 10 tasks', icon: 'Trophy', requirement: 10, type: 'tasks', isUnlocked: false },
  { id: '3', title: 'Scholar Star', description: 'Earn 100 points', icon: 'Star', requirement: 100, type: 'points', isUnlocked: false },
  { id: '4', title: 'Consistent', description: '3-day routine streak', icon: 'Zap', requirement: 3, type: 'routine', isUnlocked: false },
  { id: '5', title: 'Thinker', description: 'Ask the AI Coach a question', icon: 'Brain', requirement: 1, type: 'ai', isUnlocked: false }
];

const INITIAL_SUBJECTS: Subject[] = [
  { id: '1', name: 'Mathematics', color: '#2563eb' },
  { id: '2', name: 'Science', color: '#f97316' },
  { id: '3', name: 'History', color: '#8b5cf6' }
];

export const StorageService = {
  getTasks: (): TaskItem[] => safeGet(STORAGE_KEYS.TASKS, []),
  saveTasks: (tasks: TaskItem[]) => localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks)),

  getTimetable: (): TimetableEntry[] => safeGet(STORAGE_KEYS.TIMETABLE, []),
  saveTimetable: (entries: TimetableEntry[]) => localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(entries)),

  getRoutines: (): Routine[] => safeGet(STORAGE_KEYS.ROUTINE, []),
  saveRoutines: (routines: Routine[]) => localStorage.setItem(STORAGE_KEYS.ROUTINE, JSON.stringify(routines)),

  getPoints: (): number => safeGet(STORAGE_KEYS.POINTS, 0),
  savePoints: (points: number) => localStorage.setItem(STORAGE_KEYS.POINTS, JSON.stringify(points)),

  getProfile: (): UserProfile => safeGet(STORAGE_KEYS.PROFILE, { name: '', grade: '', school: '', goal: '' }),
  saveProfile: (profile: UserProfile) => localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile)),

  getSubjects: (): Subject[] => safeGet(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS),
  saveSubjects: (subjects: Subject[]) => localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects)),

  getAchievements: (): Achievement[] => safeGet(STORAGE_KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS),
  saveAchievements: (achievements: Achievement[]) => localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements)),
  
  getStreak: (): number => safeGet(STORAGE_KEYS.STREAK_COUNT, 0),
  updateStreak: () => {
    const lastDate = localStorage.getItem(STORAGE_KEYS.STREAK_DATE);
    const today = new Date().toDateString();
    let currentStreak = StorageService.getStreak();
    
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastDate === yesterday.toDateString()) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
      localStorage.setItem(STORAGE_KEYS.STREAK_DATE, today);
      localStorage.setItem(STORAGE_KEYS.STREAK_COUNT, JSON.stringify(currentStreak));
    }
    return currentStreak;
  }
};
