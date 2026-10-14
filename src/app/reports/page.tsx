'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { FileText, Download, Printer, Calendar, TrendingUp, Award, Clock, Target } from 'lucide-react';
import { format } from 'date-fns';

export default function ReportsPage() {
  const { progress, achievements } = useStore();
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-01-08');

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Mock download functionality
    const reportData = {
      type: reportType,
      period: { startDate, endDate },
      progress,
      achievements: achievements.filter((a) => a.unlocked),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manas-mitra-report-${reportType}-${startDate}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const unlockedAchievements = achievements.filter((a) => a.unlocked);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Reports</h1>
        <p className="text-muted-foreground">Generate and view detailed performance reports</p>
      </div>

      {/* Report Configuration */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-4">Report Configuration</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as 'weekly' | 'monthly')}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download Report
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Printer className="h-4 w-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Manas Mitra Report</h2>
            <p className="text-sm text-muted-foreground">
              {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report • {startDate} to {endDate}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Target className="h-4 w-4" />
              <span className="text-sm">Activities</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{progress.activitiesCompleted}</p>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Games</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{progress.gamesCompleted}</p>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Time Spent</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{progress.timeSpent} min</p>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Award className="h-4 w-4" />
              <span className="text-sm">Achievements</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{unlockedAchievements.length}</p>
          </div>
        </div>

        {/* Performance Details */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-foreground mb-3">Performance Overview</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall Score</span>
                <span className="font-medium text-foreground">{progress.overallScore}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Average Accuracy</span>
                <span className="font-medium text-foreground">{progress.accuracy}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current Streak</span>
                <span className="font-medium text-foreground">{progress.currentStreak} days</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Improvement</span>
                <span className="font-medium text-success">+{progress.improvementPercentage}%</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Achievements Unlocked</h3>
            {unlockedAchievements.length > 0 ? (
              <div className="grid gap-2 md:grid-cols-2">
                {unlockedAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-warning" />
                    <span className="text-foreground">{achievement.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No achievements unlocked yet.</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Weekly Performance Trend</h3>
            <div className="space-y-2">
              {progress.weeklyPerformance.map((score, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-8">Day {index + 1}</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-foreground w-10">{score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Generated on {format(new Date(), 'PPP')} by Manas Mitra Platform
          </p>
        </div>
      </div>
    </div>
  );
}
