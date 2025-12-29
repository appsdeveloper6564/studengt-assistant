
import { TaskItem, TimetableEntry, Routine, UserProfile } from '../types';

const STORAGE_KEYS = {
  TASKS: 'sa_tasks_v2',
  TIMETABLE: 'sa_timetable_v2',
  ROUTINE: 'sa_routine_v2',
  POINTS: 'sa_points_v2',
  PROFILE: 'sa_profile_v2',
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

export const StorageService = {
  getTasks: (): TaskItem[] => safeGet(STORAGE_KEYS.TASKS, []),
  saveTasks: (tasks: TaskItem[]) => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  getTimetable: (): TimetableEntry[] => safeGet(STORAGE_KEYS.TIMETABLE, []),
  saveTimetable: (entries: TimetableEntry[]) => {
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(entries));
  },

  getRoutines: (): Routine[] => safeGet(STORAGE_KEYS.ROUTINE, []),
  saveRoutines: (routines: Routine[]) => {
    localStorage.setItem(STORAGE_KEYS.ROUTINE, JSON.stringify(routines));
  },

  getPoints: (): number => safeGet(STORAGE_KEYS.POINTS, 0),
  savePoints: (points: number) => {
    localStorage.setItem(STORAGE_KEYS.POINTS, JSON.stringify(points));
  },

  getProfile: (): UserProfile => safeGet(STORAGE_KEYS.PROFILE, {
    name: '',
    grade: '',
    school: '',
    goal: ''
  }),
  saveProfile: (profile: UserProfile) => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }
};
