export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type ActivityCategory = 'Memory' | 'Focus' | 'Reading' | 'Vocabulary' | 'ProblemSolving';

export type NotificationType = 'achievement' | 'daily-challenge' | 'reminder' | 'progress' | 'system';

export type TimeFilter = 'week' | 'month' | '3months' | 'all';

export type Language = 'en' | 'hi' | 'mr' | 'gu' | 'bn' | 'ta' | 'te' | 'kn';

export type CognitiveSupportLevel = 'low' | 'moderate' | 'high';

export interface GameResult {
  gameId: string;
  gameName: string;
  category: ActivityCategory;
  difficulty: Difficulty;
  score: number;
  accuracy: number;
  attempts: number;
  completionTime: number;
  completedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  difficulty: Difficulty;
  duration: number; // in minutes
  icon: string;
  completed: boolean;
  progress: number;
  lastPlayed?: Date;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  difficulty: Difficulty;
  icon: string;
  completed: boolean;
  score: number;
  accuracy: number;
  timeSpent: number; // in minutes
  lastPlayed?: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedTime: number; // in minutes
  reward: number;
  completed: boolean;
  completedAt?: Date;
  streak: number;
  date?: string;
  score?: number;
  accuracy?: number;
  attempts?: number;
  timeSpent?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'activity' | 'game' | 'learning' | 'reminder';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  dueDate?: Date;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  time: Date;
  completed: boolean;
  recurring?: boolean;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface AssessmentQuestion {
  id: string;
  category: ActivityCategory;
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit?: number; // in seconds
}

export interface AssessmentResult {
  overallScore: number;
  categoryScores: Record<ActivityCategory, number>;
  strengths: ActivityCategory[];
  areasForImprovement: ActivityCategory[];
  recommendedActivities: string[];
  level: CognitiveSupportLevel;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'Memory' | 'Focus' | 'Reading' | 'Vocabulary' | 'General';
  type: 'article' | 'guide' | 'exercise' | 'tip';
  icon: string;
  bookmarked: boolean;
  lastViewed?: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UserProgress {
  overallScore: number;
  gamesCompleted: number;
  activitiesCompleted: number;
  accuracy: number;
  timeSpent: number; // in minutes
  currentStreak: number;
  improvementPercentage: number;
  weeklyPerformance: number[];
  monthlyPerformance: number[];
  gamePerformance: Record<string, number>;
  activityPerformance: Record<string, number>;
}

export interface Report {
  id: string;
  type: 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  activitiesCompleted: number;
  gamesCompleted: number;
  averageAccuracy: number;
  totalTimeSpent: number;
  streak: number;
  achievementsUnlocked: number;
}
