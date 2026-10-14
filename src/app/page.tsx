'use client';

import { Brain, Sparkles, TrendingUp, Calendar, Award } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { translateText } from '@/utils/translations';

export default function HomePage() {
  const { progress, dailyChallenge, language } = useStore();
  const t = (key: string, fallback: string) => translateText(language, key, fallback);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-primary to-accent p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">{t('welcomeTitle', 'Welcome to Manas Mitra')}</h1>
        <p className="text-lg opacity-90 mb-4">
          {t('welcomeSubtitle', 'Your AI-powered cognitive assistance platform for memory, focus, and learning')}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-gray-100 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            {t('startAssessment', 'Start Assessment')}
          </Link>
          <Link
            href="/daily-challenge"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            <Calendar className="h-4 w-4" />
            {t('dailyChallenge', 'Daily Challenge')}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">{t('activities', 'Activities')}</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{progress.activitiesCompleted}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('completed', 'Completed')}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-success" />
            <span className="text-sm font-medium text-muted-foreground">{t('accuracy', 'Accuracy')}</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{progress.accuracy}%</p>
          <p className="text-xs text-muted-foreground mt-1">{t('average', 'Average')}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Award className="h-5 w-5 text-warning" />
            <span className="text-sm font-medium text-muted-foreground">{t('streak', 'Streak')}</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{progress.currentStreak}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('days', 'Days')}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">{t('score', 'Score')}</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{progress.overallScore}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('overall', 'Overall')}</p>
        </div>
      </div>

      {dailyChallenge && !dailyChallenge.completed && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">{t('todayChallenge', "Today's Challenge")}</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {dailyChallenge.difficulty}
            </span>
          </div>
          <p className="text-muted-foreground mb-4">{dailyChallenge.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>⏱️ {dailyChallenge.estimatedTime} min</span>
              <span>🎁 {dailyChallenge.reward} points</span>
            </div>
            <Link
              href="/daily-challenge"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t('startChallenge', 'Start Challenge')}
            </Link>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">{t('quickAccess', 'Quick Access')}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/learning" className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <Brain className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-1">{t('learningHub', 'Learning Hub')}</h3>
            <p className="text-sm text-muted-foreground">{t('exploreEducationalActivities', 'Explore educational activities')}</p>
          </Link>

          <Link href="/games" className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <TrendingUp className="h-8 w-8 text-success mb-3" />
            <h3 className="font-semibold text-foreground mb-1">{t('games', 'Games')}</h3>
            <p className="text-sm text-muted-foreground">{t('playCognitiveGames', 'Play cognitive games')}</p>
          </Link>

          <Link href="/daily-plan" className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
            <Calendar className="h-8 w-8 text-accent mb-3" />
            <h3 className="font-semibold text-foreground mb-1">{t('dailyPlan', 'Daily Plan')}</h3>
            <p className="text-sm text-muted-foreground">{t('viewSchedule', 'View your schedule')}</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
