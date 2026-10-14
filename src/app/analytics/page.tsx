'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, Clock, Award, Flame } from 'lucide-react';
import { TimeFilter } from '@/types';

export default function AnalyticsPage() {
  const { progress, games } = useStore();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');

  const weeklyData = [
    { name: 'Mon', activities: 3, games: 2, accuracy: 85 },
    { name: 'Tue', activities: 4, games: 3, accuracy: 88 },
    { name: 'Wed', activities: 2, games: 1, accuracy: 82 },
    { name: 'Thu', activities: 5, games: 4, accuracy: 90 },
    { name: 'Fri', activities: 3, games: 2, accuracy: 87 },
    { name: 'Sat', activities: 6, games: 5, accuracy: 92 },
    { name: 'Sun', activities: 4, games: 3, accuracy: 89 },
  ];

  const activityDistribution = [
    { name: 'Memory', value: 30, color: '#4f46e5' },
    { name: 'Focus', value: 25, color: '#8b5cf6' },
    { name: 'Reading', value: 20, color: '#10b981' },
    { name: 'Vocabulary', value: 15, color: '#f59e0b' },
    { name: 'Problem Solving', value: 10, color: '#ef4444' },
  ];

  const gamePerformance = games.filter((game) => game.score > 0).map((game) => ({ name: game.title, score: game.score, accuracy: game.accuracy }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground">Detailed performance insights and trends</p>
        </div>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
          className="rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Overall Score</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{progress.overallScore}</p>
          <p className="text-xs text-success mt-1">+{progress.improvementPercentage}% improvement</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-success" />
            <span className="text-sm font-medium text-muted-foreground">Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{progress.accuracy}%</p>
          <p className="text-xs text-muted-foreground mt-1">Average accuracy</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">Time Spent</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{progress.timeSpent} min</p>
          <p className="text-xs text-muted-foreground mt-1">Total time</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="h-5 w-5 text-warning" />
            <span className="text-sm font-medium text-muted-foreground">Current Streak</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{progress.currentStreak} days</p>
          <p className="text-xs text-muted-foreground mt-1">Keep it up!</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Performance Line Chart */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Performance Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="activities" stroke="#4f46e5" strokeWidth={2} name="Activities" />
              <Line type="monotone" dataKey="games" stroke="#8b5cf6" strokeWidth={2} name="Games" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Distribution Pie Chart */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Activity Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={activityDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {activityDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Game Performance Bar Chart */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-foreground mb-4">Game Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gamePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="score" fill="#4f46e5" name="Score" radius={[8, 8, 0, 0]} />
              <Bar dataKey="accuracy" fill="#10b981" name="Accuracy" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Completion Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Games Completed</span>
              <span className="font-semibold text-foreground">{progress.gamesCompleted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Activities Completed</span>
              <span className="font-semibold text-foreground">{progress.activitiesCompleted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Time</span>
              <span className="font-semibold text-foreground">{progress.timeSpent} minutes</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-foreground mb-4">Achievement Progress</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Weekly Progress</span>
              <span className="font-semibold text-success">+12%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly Progress</span>
              <span className="font-semibold text-success">+28%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Overall Improvement</span>
              <span className="font-semibold text-success">{progress.improvementPercentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
