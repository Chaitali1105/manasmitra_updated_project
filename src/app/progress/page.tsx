'use client';

import { useStore } from '@/store/useStore';
import { TrendingUp, Target, Clock, Award, Flame } from 'lucide-react';
import Link from 'next/link';

export default function ProgressPage() {
  const { progress, activities, games } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Progress</h1>
        <p className="text-muted-foreground">Track your cognitive improvement over time</p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Overall Score</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{progress.overallScore}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-success" />
            <span className="text-sm font-medium text-muted-foreground">Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{progress.accuracy}%</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">Time Spent</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{progress.timeSpent} min</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="h-5 w-5 text-warning" />
            <span className="text-sm font-medium text-muted-foreground">Current Streak</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{progress.currentStreak} days</p>
        </div>
      </div>

      {/* Completion Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Activities</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="text-lg font-bold text-foreground">{progress.activitiesCompleted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Available</span>
              <span className="text-lg font-bold text-foreground">{activities.length}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(progress.activitiesCompleted / activities.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Games</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="text-lg font-bold text-foreground">{progress.gamesCompleted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Available</span>
              <span className="text-lg font-bold text-foreground">{games.length}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-success h-2 rounded-full transition-all"
                style={{ width: `${(progress.gamesCompleted / games.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">View Detailed Analytics</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/analytics"
            className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted transition-colors"
          >
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">Analytics</span>
          </Link>
          <Link
            href="/achievements"
            className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted transition-colors"
          >
            <Award className="h-5 w-5 text-warning" />
            <span className="font-medium text-foreground">Achievements</span>
          </Link>
          <Link
            href="/reports"
            className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted transition-colors"
          >
            <Target className="h-5 w-5 text-accent" />
            <span className="font-medium text-foreground">Reports</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
