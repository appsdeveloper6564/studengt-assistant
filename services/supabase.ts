
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rexcmklkvcgyctirqfba.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_F8OqKunB56VAiP7AAoqJNw_SnCPxzGK';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const CloudStorage = {
  // Auth Functions
  signUp: async (email: string, pass: string) => supabase.auth.signUp({ email, password: pass }),
  signIn: async (email: string, pass: string) => supabase.auth.signInWithPassword({ email, password: pass }),
  signOut: async () => supabase.auth.signOut(),
  getUser: async () => (await supabase.auth.getUser()).data.user,

  // Profile Sync
  syncProfile: async (profile: any) => {
    const user = await CloudStorage.getUser();
    if (!user) return;
    return await supabase.from('profiles').upsert({ id: user.id, ...profile });
  },

  // Task Sync
  saveTasks: async (tasks: any[]) => {
    const user = await CloudStorage.getUser();
    if (!user) return;
    return await supabase.from('tasks').upsert(
      tasks.map(t => ({ 
        id: t.id, 
        user_id: user.id, 
        title: t.title, 
        priority: t.priority, 
        due_date: t.dueDate,
        is_completed: t.isCompleted 
      }))
    );
  },

  // Subject Sync
  saveSubjects: async (subjects: any[]) => {
    const user = await CloudStorage.getUser();
    if (!user) return;
    return await supabase.from('subjects').upsert(
      subjects.map(s => ({ id: s.id, user_id: user.id, name: s.name, color: s.color }))
    );
  },

  // Timetable Sync
  saveTimetable: async (entries: any[]) => {
    const user = await CloudStorage.getUser();
    if (!user) return;
    return await supabase.from('timetable').upsert(
      entries.map(e => ({ 
        id: e.id, 
        user_id: user.id, 
        day: e.day, 
        subject: e.subject, 
        start_time: e.startTime, 
        end_time: e.endTime, 
        location: e.location 
      }))
    );
  },

  // Routine Sync
  saveRoutines: async (routines: any[]) => {
    const user = await CloudStorage.getUser();
    if (!user) return;
    return await supabase.from('routines').upsert(
      routines.map(r => ({ 
        id: r.id, 
        user_id: user.id, 
        title: r.title, 
        time: r.time, 
        is_completed: r.isCompleted, 
        duration_minutes: r.durationMinutes 
      }))
    );
  },

  fetchTasks: async () => supabase.from('tasks').select('*, subtasks(*)'),
  fetchSubjects: async () => supabase.from('subjects').select('*'),
  fetchTimetable: async () => supabase.from('timetable').select('*'),
  fetchRoutines: async () => supabase.from('routines').select('*')
};
