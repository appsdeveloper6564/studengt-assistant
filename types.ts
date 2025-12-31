
export type Priority = 'Low' | 'Medium' | 'High';
export type Recurrence = 'None' | 'Daily' | 'Weekly';

export interface UserProfile {
  name: string;
  grade: string;
  school: string;
  goal: string;
  avatar?: string;
  language?: string;
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

export interface QuizResult {
  id: string;
  quizTitle: string;
  score: number;
  total: number;
  date: string;
}

export interface DocumentSummary {
  id: string;
  title: string;
  summary: string;
  flashcards: { front: string; back: string }[];
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  image?: string;
  timestamp: string;
  references?: { title: string; uri: string }[];
}

export interface GKQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  id: string;
  isAnswered?: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  subjectId: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subjectId: string;
}

export interface ForumPost {
  id: string;
  author: string;
  title: string;
  content: string;
  timestamp: string;
  upvotes: number;
  commentsCount: number;
}

export interface DocResource {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'video';
  subjectId: string;
  size?: string;
  tags?: string[];
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

export type View = 'dashboard' | 'calendar' | 'tasks' | 'timetable' | 'routine' | 'ai-coach' | 'settings' | 'achievements' | 'focus-timer' | 'mock-tests' | 'learning-hub' | 'forum' | 'docs' | 'help';
