'use client';

import { useStore } from '@/store/useStore';
import { Users, TrendingUp, Award, Calendar, Activity, Target, Clock, Heart } from 'lucide-react';

export default function FamilyDashboardPage() {
  const { progress, achievements, activities, games } = useStore();
  const unlockedAchievements = achievements.filter((a) => a.unlocked);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Family Dashboard</h1>
        <p className="text-muted-foreground">Overview of activity and progress (Privacy-conscious view)</p>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl border border-warning/20 bg-warning/5 p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Privacy Note:</strong> This dashboard provides general activity information for family members. No diagnostic or medical information is shared.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Activities</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{progress.activitiesCompleted}</p>
          <p className="text-xs text-muted-foreground mt-1">Completed</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-success" />
            <span className="text-sm font-medium text-muted-foreground">Games</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{progress.gamesCompleted}</p>
          <p className="text-xs text-muted-foreground mt-1">Completed</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Award className="h-5 w-5 text-warning" />
            <span className="text-sm font-medium text-muted-foreground">Achievements</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{unlockedAchievements.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Unlocked</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">Streak</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{progress.currentStreak} days</p>
          <p className="text-xs text-muted-foreground mt-1">Current</p>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Learning Progress</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Activities Completed</span>
              <span className="font-semibold text-foreground">{progress.activitiesCompleted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Available</span>
              <span className="font-semibold text-foreground">{activities.length}</span>
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
          <div className="flex items-center gap-3 mb-4">
            <Target className="h-5 w-5 text-success" />
            <h3 className="font-semibold text-foreground">Game Activity</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Games Completed</span>
              <span className="font-semibold text-foreground">{progress.gamesCompleted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Available</span>
              <span className="font-semibold text-foreground">{games.length}</span>
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

      {/* Weekly/Monthly Progress */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="h-5 w-5 text-accent" />
          <h3 className="font-semibold text-foreground">Weekly & Monthly Progress</h3>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Weekly Performance</h4>
            <div className="space-y-2">
              {progress.weeklyPerformance.map((score, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-12">Day {index + 1}</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-foreground w-8">{score}%</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Monthly Performance</h4>
            <div className="space-y-2">
              {progress.monthlyPerformance.map((score, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-12">Week {index + 1}</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-foreground w-8">{score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Award className="h-5 w-5 text-warning" />
          <h3 className="font-semibold text-foreground">Recent Achievements</h3>
        </div>
        {unlockedAchievements.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {unlockedAchievements.slice(0, 4).map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No achievements unlocked yet.</p>
        )}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Heart className="h-4 w-4 text-success" />
            <span className="text-muted-foreground">Consistent daily engagement</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Regular completion of activities</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Target className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">Active participation in games</span>
          </div>
        </div>
      </div>

      {/* Support Info */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Family Support Tips</h3>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Encourage regular daily activities to maintain engagement</li>
          <li>• Celebrate achievements and milestones together</li>
          <li>• Monitor progress without creating pressure</li>
          <li>• Use the daily plan feature to establish routines</li>
          <li>• Contact healthcare professionals for specific concerns</li>
        </ul>
      </div>
    </div>
  );
}
