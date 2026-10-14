'use client';

import { User, Mail, Calendar, Award, TrendingUp, LogOut } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, progress, achievements } = useStore();
  const logout = useStore((state) => state.logout);
  const router = useRouter();
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
        <p className="text-muted-foreground">View your profile and achievements</p>
      </div>

      <button onClick={() => { logout(); router.replace('/signup'); }} className="inline-flex items-center gap-2 rounded-lg border border-error px-4 py-2 text-sm font-semibold text-error hover:bg-error/10"><LogOut className="h-4 w-4" /> Logout</button>

      {/* User Info */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-10 w-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{user?.name || 'User'}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{user?.email || 'user@example.com'}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Member Since</span>
            </div>
            <p className="font-semibold text-foreground">January 2024</p>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Award className="h-4 w-4" />
              <span className="text-sm">Achievements</span>
            </div>
            <p className="font-semibold text-foreground">{unlockedAchievements} / {achievements.length}</p>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Overall Score</span>
            </div>
            <p className="font-semibold text-foreground">{progress.overallScore}</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Activities Completed</p>
          <p className="text-2xl font-bold text-foreground">{progress.activitiesCompleted}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Games Completed</p>
          <p className="text-2xl font-bold text-foreground">{progress.gamesCompleted}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
          <p className="text-2xl font-bold text-foreground">{progress.currentStreak} days</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-1">Time Spent</p>
          <p className="text-2xl font-bold text-foreground">{progress.timeSpent} min</p>
        </div>
      </div>
    </div>
  );
}
