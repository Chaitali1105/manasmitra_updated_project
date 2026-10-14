'use client';

import { useStore } from '@/store/useStore';
import { Trophy, Star, Flame, Award, Target, Crosshair, GraduationCap, Brain, Eye, Gamepad2, Lock } from 'lucide-react';

export default function AchievementsPage() {
  const { achievements } = useStore();
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const progressPercentage = (unlockedCount / achievements.length) * 100;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Star':
        return <Star className="h-6 w-6" />;
      case 'Trophy':
        return <Trophy className="h-6 w-6" />;
      case 'Flame':
        return <Flame className="h-6 w-6" />;
      case 'Award':
        return <Award className="h-6 w-6" />;
      case 'Gamepad2':
        return <Gamepad2 className="h-6 w-6" />;
      case 'Target':
        return <Target className="h-6 w-6" />;
      case 'Crosshair':
        return <Crosshair className="h-6 w-6" />;
      case 'GraduationCap':
        return <GraduationCap className="h-6 w-6" />;
      case 'Brain':
        return <Brain className="h-6 w-6" />;
      case 'Eye':
        return <Eye className="h-6 w-6" />;
      default:
        return <Star className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Achievements</h1>
        <p className="text-muted-foreground">Track your accomplishments and unlock badges</p>
      </div>

      {/* Progress Summary */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Achievement Progress</h3>
            <p className="text-sm text-muted-foreground">{unlockedCount} of {achievements.length} unlocked</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">{progressPercentage.toFixed(0)}%</p>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`rounded-xl border ${
              achievement.unlocked
                ? 'border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5'
                : 'border-border bg-card opacity-60'
            } p-6 shadow-sm`}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-primary to-accent text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {achievement.unlocked ? getIcon(achievement.icon) : <Lock className="h-6 w-6" />}
              </div>
              {achievement.unlocked && achievement.unlockedAt && (
                <span className="text-xs text-muted-foreground">
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </span>
              )}
            </div>

            <h3 className="font-semibold text-foreground mb-1">{achievement.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>

            <div className="mb-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">
                  {achievement.progress} / {achievement.maxProgress}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    achievement.unlocked ? 'bg-success' : 'bg-primary'
                  }`}
                  style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                />
              </div>
            </div>

            {achievement.unlocked && (
              <div className="mt-2 text-sm font-semibold text-success flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                Unlocked!
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
