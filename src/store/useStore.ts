import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '@/utils/storage';
import {
  Activity,
  Game,
  Achievement,
  DailyChallenge,
  Task,
  Reminder,
  Notification,
  ChatMessage,
  UserProgress,
  Resource,
  GameResult,
  Language,
  AssessmentResult,
} from '@/types';
import {
  mockActivities,
  mockGames,
  mockAchievements,
  mockDailyChallenges,
  mockResources,
  mockNotifications,
} from '@/data/mockData';

interface AppState {
  // Frontend demo authentication
  isAuthenticated: boolean;
  isDemoUser: boolean;
  hasCompletedAssessment: boolean;
  assessmentSkipped: boolean;
  assessmentResult: AssessmentResult | null;
  completeAssessment: () => void;
  skipAssessment: () => void;
  setAssessmentResult: (result: AssessmentResult) => void;
  signIn: (email: string, password: string) => boolean;
  signUp: (user: { name: string; email: string; age?: number; caregiverName?: string }) => void;
  tryDemo: () => void;
  logout: () => void;

  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (language: Language) => void;
  voiceEnabled: boolean;
  voiceVolume: number;
  setVoiceEnabled: (enabled: boolean) => void;
  setVoiceVolume: (volume: number) => void;
  accessibility: { largerText: boolean; highContrast: boolean; reducedMotion: boolean };
  setAccessibility: (updates: Partial<AppState['accessibility']>) => void;

  // User
  user: { name: string; email: string; age?: number; caregiverName?: string; memberSince?: string } | null;
  setUser: (user: { name: string; email: string } | null) => void;
  updateUser: (updates: Partial<NonNullable<AppState['user']>>) => void;

  // Activities
  activities: Activity[];
  setActivities: (activities: Activity[]) => void;
  updateActivityProgress: (id: string, progress: number) => void;
  completeActivity: (id: string) => void;

  // Games
  games: Game[];
  setGames: (games: Game[]) => void;
  updateGameScore: (id: string, score: number, accuracy: number, timeSpent: number, difficulty?: 'Easy' | 'Medium' | 'Hard', attempts?: number) => void;
  completeGame: (id: string) => void;
  gameResults: GameResult[];
  saveGameResult: (result: GameResult) => void;

  // Achievements
  achievements: Achievement[];
  setAchievements: (achievements: Achievement[]) => void;
  unlockAchievement: (id: string) => void;
  updateAchievementProgress: (id: string, progress: number) => void;

  // Daily Challenge
  dailyChallenge: DailyChallenge | null;
  setDailyChallenge: (challenge: DailyChallenge | null) => void;
  completeDailyChallenge: () => void;
  updateChallengeStreak: () => void;
  dailyChallengeHistory: DailyChallenge[];
  ensureDailyChallenge: () => void;

  // Tasks
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
  updateTaskPriority: (id: string, priority: 'low' | 'medium' | 'high') => void;

  // Reminders
  reminders: Reminder[];
  setReminders: (reminders: Reminder[]) => void;
  addReminder: (reminder: Reminder) => void;
  removeReminder: (id: string) => void;
  toggleReminder: (id: string) => void;

  // Notifications
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  getUnreadCount: () => number;

  // Chat
  chatMessages: ChatMessage[];
  setChatMessages: (messages: ChatMessage[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;

  // Resources
  resources: Resource[];
  setResources: (resources: Resource[]) => void;
  toggleBookmark: (id: string) => void;
  updateResourceViewed: (id: string) => void;

  // Progress
  progress: UserProgress;
  setProgress: (progress: UserProgress) => void;
  updateProgress: (updates: Partial<UserProgress>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Authentication is intentionally local-only until a backend is connected.
      isAuthenticated: false,
      isDemoUser: false,
      hasCompletedAssessment: false,
      assessmentSkipped: false,
      assessmentResult: null,
      completeAssessment: () => set({ hasCompletedAssessment: true, assessmentSkipped: false }),
      skipAssessment: () => set({ assessmentSkipped: true, hasCompletedAssessment: false }),
      setAssessmentResult: (assessmentResult) => set({ assessmentResult }),
      signIn: (email) => {
        const storedUser = get().user;
        if (!storedUser || storedUser.email.toLowerCase() !== email.toLowerCase()) return false;
        set({ isAuthenticated: true });
        return true;
      },
      signUp: (user) =>
        set({
          user: { ...user, memberSince: new Date().toISOString() },
          isAuthenticated: true,
          isDemoUser: false,
          hasCompletedAssessment: false,
          assessmentSkipped: false,
          assessmentResult: null,
        }),
      tryDemo: () =>
        set({
          isAuthenticated: true,
          isDemoUser: true,
          hasCompletedAssessment: false,
          assessmentSkipped: false,
          assessmentResult: null,
          user: {
            name: 'Demo User',
            email: 'demo@manasmitra.com',
            age: 68,
            memberSince: '2024-01-15',
          },
          progress: {
            overallScore: 78,
            gamesCompleted: 2,
            activitiesCompleted: 3,
            accuracy: 82,
            timeSpent: 42,
            currentStreak: 4,
            improvementPercentage: 12,
            weeklyPerformance: [65, 70, 75, 80, 72, 85, 90],
            monthlyPerformance: [70, 72, 75, 78, 80, 82, 85, 88, 90, 87, 85, 89],
            gamePerformance: { '1': 82, '2': 76 },
            activityPerformance: { '1': 85, '2': 78, '3': 90 },
          },
          games: mockGames.map((game) =>
            ['1', '2'].includes(game.id)
              ? { ...game, completed: true, score: game.id === '1' ? 82 : 76, accuracy: game.id === '1' ? 82 : 76, timeSpent: 6 }
              : game
          ),
          activities: mockActivities.map((activity) =>
            ['1', '2', '3'].includes(activity.id)
              ? { ...activity, completed: true, progress: 100, lastPlayed: new Date() }
              : activity
          ),
        }),
      logout: () => set({ isAuthenticated: false, isDemoUser: false, hasCompletedAssessment: false, assessmentSkipped: false, assessmentResult: null }),

      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      language: 'en',
      setLanguage: (language) => set({ language }),
      voiceEnabled: false,
      voiceVolume: 1,
      setVoiceEnabled: (voiceEnabled) => set({ voiceEnabled }),
      setVoiceVolume: (voiceVolume) => set({ voiceVolume }),
      accessibility: { largerText: false, highContrast: false, reducedMotion: false },
      setAccessibility: (updates) => set((state) => ({ accessibility: { ...state.accessibility, ...updates } })),

      // User
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (updates) => set((state) => ({ user: state.user ? { ...state.user, ...updates } : state.user })),

      // Activities
      activities: mockActivities,
      setActivities: (activities) => set({ activities }),
      updateActivityProgress: (id, progress) =>
        set((state) => ({
          activities: state.activities.map((a) =>
            a.id === id ? { ...a, progress, completed: progress >= 100 } : a
          ),
        })),
      completeActivity: (id) =>
        set((state) => {
          const activity = state.activities.find((item) => item.id === id);
          if (!activity || activity.completed) return state;
          const nextActivitiesCompleted = state.progress.activitiesCompleted + 1;
          return {
            activities: state.activities.map((item) => item.id === id ? { ...item, completed: true, progress: 100, lastPlayed: new Date() } : item),
            achievements: state.achievements.map((achievement) => achievement.id === '1' && !achievement.unlocked ? { ...achievement, progress: 1, unlocked: true, unlockedAt: new Date() } : achievement),
            progress: {
              ...state.progress,
              activitiesCompleted: nextActivitiesCompleted,
              overallScore: Math.round((state.progress.overallScore + 85) / 2),
              accuracy: Math.round((state.progress.accuracy + 85) / 2),
              timeSpent: state.progress.timeSpent + (activity.duration || 5),
              currentStreak: Math.max(1, state.progress.currentStreak),
              activityPerformance: { ...state.progress.activityPerformance, [id]: 85 },
            },
          };
        }),

      // Games
      games: mockGames,
      setGames: (games) => set({ games }),
      updateGameScore: (id, score, accuracy, timeSpent, difficulty = 'Easy', attempts = 1) =>
        set((state) => {
          const game = state.games.find((item) => item.id === id);
          if (!game) return state;
          const result: GameResult = { gameId: id, gameName: game.title, category: game.category, difficulty, score, accuracy, attempts, completionTime: timeSpent, completedAt: new Date().toISOString() };
          const completedGames = state.games.filter((item) => item.completed).length;
          return {
          games: state.games.map((g) =>
            g.id === id ? { ...g, score, accuracy, timeSpent } : g
          ),
          achievements: state.achievements.map((achievement) => {
            if (achievement.id === '2' && !achievement.unlocked) return { ...achievement, progress: 1, unlocked: true, unlockedAt: new Date() };
            if (achievement.id === '5') return { ...achievement, progress: Math.min(achievement.maxProgress, completedGames + 1), unlocked: completedGames + 1 >= achievement.maxProgress };
            return achievement;
          }),
          gameResults: [...state.gameResults, result],
          progress: {
            ...state.progress,
            overallScore: Math.round((state.progress.overallScore + score) / 2),
            accuracy: Math.round((state.progress.accuracy + accuracy) / 2),
            timeSpent: state.progress.timeSpent + timeSpent,
            gamePerformance: { ...state.progress.gamePerformance, [id]: score },
          },
          };
        }),
      completeGame: (id) =>
        set((state) => ({
          games: state.games.map((g) =>
            g.id === id ? { ...g, completed: true, lastPlayed: new Date() } : g
          ),
          progress: {
            ...state.progress,
            gamesCompleted: state.progress.gamesCompleted + (state.games.find((g) => g.id === id)?.completed ? 0 : 1),
          },
        })),
      gameResults: [],
      saveGameResult: (result) =>
        set((state) => ({
          gameResults: [...state.gameResults, result],
          progress: {
            ...state.progress,
            gamePerformance: { ...state.progress.gamePerformance, [result.gameId]: result.score },
          },
        })),

      // Achievements
      achievements: mockAchievements,
      setAchievements: (achievements) => set({ achievements }),
      unlockAchievement: (id) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id ? { ...a, unlocked: true, unlockedAt: new Date(), progress: a.maxProgress } : a
          ),
          notifications: [
            {
              id: Date.now().toString(),
              type: 'achievement',
              title: 'Achievement Unlocked!',
              message: state.achievements.find((a) => a.id === id)?.title || 'New achievement',
              read: false,
              createdAt: new Date(),
            },
            ...state.notifications,
          ],
        })),
      updateAchievementProgress: (id, progress) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id ? { ...a, progress } : a
          ),
        })),

      // Daily Challenge
      dailyChallenge: { ...(mockDailyChallenges[0] || null), date: new Date().toISOString().slice(0, 10) },
      dailyChallengeHistory: [],
      ensureDailyChallenge: () =>
        set((state) => {
          const today = new Date().toISOString().slice(0, 10);
          if (state.dailyChallenge?.date === today) return state;
          const options = [
            { title: 'Memory Boost', description: 'Complete a short memory exercise today', difficulty: 'Easy' as const, estimatedTime: 10, reward: 100 },
            { title: 'Focus Spark', description: 'Complete a focused attention exercise today', difficulty: 'Medium' as const, estimatedTime: 15, reward: 120 },
            { title: 'Pattern Path', description: 'Solve a pattern challenge today', difficulty: 'Hard' as const, estimatedTime: 20, reward: 150 },
          ];
          const challenge = options[new Date().getDate() % options.length];
          return { dailyChallenge: { id: `daily-${today}`, ...challenge, completed: false, streak: state.progress.currentStreak, date: today } };
        }),
      setDailyChallenge: (challenge) => set({ dailyChallenge: challenge }),
      completeDailyChallenge: () =>
        set((state) => {
          if (!state.dailyChallenge || state.dailyChallenge.completed) return state;
          const completedChallenge = { ...state.dailyChallenge, completed: true, completedAt: new Date(), score: 85, accuracy: 85, attempts: 3, timeSpent: state.dailyChallenge.estimatedTime };
          return {
            dailyChallenge: completedChallenge,
            dailyChallengeHistory: [...state.dailyChallengeHistory, completedChallenge],
            progress: {
              ...state.progress,
              currentStreak: state.progress.currentStreak + 1,
            },
            notifications: [
              {
                id: Date.now().toString(),
                type: 'daily-challenge',
                title: 'Daily Challenge Completed!',
                message: `You earned ${completedChallenge.reward} points`,
                read: false,
                createdAt: new Date(),
              },
              ...state.notifications,
            ],
          };
        }),
      updateChallengeStreak: () =>
        set((state) => ({
          dailyChallenge: state.dailyChallenge
            ? { ...state.dailyChallenge, streak: state.dailyChallenge.streak + 1 }
            : null,
        })),

      // Tasks
      tasks: [],
      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      removeTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        })),
      updateTaskPriority: (id, priority) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, priority } : t)),
        })),

      // Reminders
      reminders: [],
      setReminders: (reminders) => set({ reminders }),
      addReminder: (reminder) => set((state) => ({ reminders: [...state.reminders, reminder] })),
      removeReminder: (id) =>
        set((state) => ({ reminders: state.reminders.filter((r) => r.id !== id) })),
      toggleReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)),
        })),

      // Notifications
      notifications: mockNotifications,
      setNotifications: (notifications) => set({ notifications }),
      addNotification: (notification) =>
        set((state) => ({ notifications: [notification, ...state.notifications] })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      deleteNotification: (id) =>
        set((state) => ({ notifications: state.notifications.filter((n) => n.id !== id) })),
      getUnreadCount: () => get().notifications.filter((n) => !n.read).length,

      // Chat
      chatMessages: [],
      setChatMessages: (messages) => set({ chatMessages: messages }),
      addChatMessage: (message) =>
        set((state) => ({ chatMessages: [...state.chatMessages, message] })),
      clearChat: () => set({ chatMessages: [] }),

      // Resources
      resources: mockResources,
      setResources: (resources) => set({ resources }),
      toggleBookmark: (id) =>
        set((state) => ({
          resources: state.resources.map((r) =>
            r.id === id ? { ...r, bookmarked: !r.bookmarked } : r
          ),
        })),
      updateResourceViewed: (id) =>
        set((state) => ({
          resources: state.resources.map((r) =>
            r.id === id ? { ...r, lastViewed: new Date() } : r
          ),
        })),

      // Progress
      progress: {
        overallScore: 0,
        gamesCompleted: 0,
        activitiesCompleted: 0,
        accuracy: 0,
        timeSpent: 0,
        currentStreak: 0,
        improvementPercentage: 0,
        weeklyPerformance: [65, 70, 75, 80, 72, 85, 90],
        monthlyPerformance: [70, 72, 75, 78, 80, 82, 85, 88, 90, 87, 85, 89],
        gamePerformance: {},
        activityPerformance: {},
      },
      setProgress: (progress) => set({ progress }),
      updateProgress: (updates) =>
        set((state) => ({
          progress: { ...state.progress, ...updates },
        })),
    }),
    {
      name: 'manasmitra-storage',
      storage: {
        getItem: (name) => storage.get(name, null),
        setItem: (name, value) => storage.set(name, value),
        removeItem: (name) => storage.remove(name),
      },
    }
  )
);
