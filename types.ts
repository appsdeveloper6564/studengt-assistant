
export type Priority = 'Low' | 'Medium' | 'High';
export type Recurrence = 'None' | 'Daily' | 'Weekly';

export interface UserProfile {
  name: string;
  grade: string;
  school: string;
  goal: string;
  avatar?: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
}

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
  priority: Priority;
  subjectId?: string;
  category?: string;
  durationMinutes?: number;
  recurrence?: Recurrence;
  subtasks?: SubTask[];
}

export interface TimetableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  subject: string;
  startTime: string;
  endTime: string;
  location: string;
}

export interface Routine {
  id: string;
  title: string;
  time: string;
  isCompleted: boolean;
  durationMinutes?: number;
}

export interface Exam {
  id: string;
  name: string;
  date: string;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'tasks' | 'points' | 'routine' | 'ai' | 'custom';
  isUnlocked: boolean;
  unlockedAt?: string;
}

export type View = 'dashboard' | 'calendar' | 'tasks' | 'timetable' | 'routine' | 'ai-coach' | 'settings' | 'achievements' | 'focus-timer';
