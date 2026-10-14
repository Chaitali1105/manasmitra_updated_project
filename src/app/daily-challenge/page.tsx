'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Zap, Clock, Award, Flame, CheckCircle, Sparkles } from 'lucide-react';

export default function DailyChallengePage() {
  const { dailyChallenge, completeDailyChallenge, ensureDailyChallenge, dailyChallengeHistory } = useStore();
  const [isCompleting, setIsCompleting] = useState(false);
  const [challengeStep, setChallengeStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => { ensureDailyChallenge(); }, [ensureDailyChallenge]);

  const handleStartChallenge = () => {
    if (challengeStep < 2) {
      setChallengeStep(challengeStep + 1);
      return;
    }
    setIsCompleting(true);
    setTimeout(() => {
      completeDailyChallenge();
      setShowSuccess(true);
      setIsCompleting(false);
    }, 2000);
  };

  if (!dailyChallenge) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <Zap className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No daily challenge available right now.</p>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-primary to-accent text-white">
                <CheckCircle className="h-12 w-12" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Today&apos;s Challenge Completed</h2>
            <p className="text-muted-foreground">Score {dailyChallenge.score || 85} · Accuracy {dailyChallenge.accuracy || 85}% · Time {dailyChallenge.timeSpent || dailyChallenge.estimatedTime} min</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-warning">
            <Flame className="h-5 w-5" />
            <span className="text-lg font-semibold">{dailyChallenge.streak + 1} day streak!</span>
          </div>
          <button
            onClick={() => setShowSuccess(false)}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Play More Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Daily Challenge</h1>
        <p className="text-muted-foreground">Complete today&apos;s challenge to earn rewards and maintain your streak</p>
      </div>

      {/* Challenge Card */}
      <div className="rounded-2xl border-2 border-primary/20 bg-linear-to-br from-primary/5 to-accent/5 p-8 shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-primary to-accent text-white">
              <Zap className="h-8 w-8" />
            </div>
            <div>
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold mb-2 ${
                  dailyChallenge.difficulty === 'Easy'
                    ? 'bg-success/10 text-success'
                    : dailyChallenge.difficulty === 'Medium'
                    ? 'bg-warning/10 text-warning'
                    : 'bg-error/10 text-error'
                }`}
              >
                {dailyChallenge.difficulty}
              </span>
              <h2 className="text-2xl font-bold text-foreground">{dailyChallenge.title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 text-warning">
            <Flame className="h-5 w-5" />
            <span className="font-semibold">{dailyChallenge.streak} day streak</span>
          </div>
        </div>

        <p className="text-lg text-muted-foreground mb-6">{dailyChallenge.description}</p>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="flex items-center gap-3 rounded-lg bg-card p-4">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Estimated Time</p>
              <p className="font-semibold text-foreground">{dailyChallenge.estimatedTime} min</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-card p-4">
            <Award className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Reward</p>
              <p className="font-semibold text-foreground">{dailyChallenge.reward} points</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-card p-4">
            <Sparkles className="h-5 w-5 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-semibold text-foreground">
                {dailyChallenge.completed ? 'Completed' : 'Not Started'}
              </p>
            </div>
          </div>
        </div>

        {dailyChallenge.completed ? (
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-6 py-3 text-success">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">Already Completed Today</span>
            </div>
            <button onClick={() => setShowSuccess(true)} className="block mx-auto rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground">View Today&apos;s Result</button>
          </div>
        ) : (
          <div>
          <div className="mb-4 rounded-xl bg-card p-4"><div className="flex items-center justify-between text-sm font-semibold text-foreground"><span>Challenge Progress</span><span>{challengeStep + 1} / 3</span></div><div className="mt-3 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${((challengeStep + 1) / 3) * 100}%` }} /></div><p className="mt-3 text-sm text-muted-foreground">Step {challengeStep + 1}: {['Memory practice', 'Focus exercise', 'Pattern recognition'][challengeStep]}</p></div>
          <button
            onClick={handleStartChallenge}
            disabled={isCompleting}
            className="w-full rounded-xl bg-linear-to-r from-primary to-accent px-8 py-4 text-lg font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCompleting ? 'Completing Challenge...' : 'Start Challenge'}
          </button>
          </div>
        )}
      </div>

      {dailyChallengeHistory.length > 0 && <section className="rounded-xl border border-border bg-card p-6 shadow-sm"><h3 className="mb-4 font-semibold text-foreground">Challenge History</h3><div className="space-y-2">{dailyChallengeHistory.slice(-5).reverse().map((item) => <div key={`${item.id}-${item.date}`} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted p-3 text-sm"><span className="font-semibold text-foreground">{item.title}</span><span className="text-muted-foreground">{item.date} · {item.score} score · {item.accuracy}% accuracy</span></div>)}</div></section>}

      {/* Tips */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="font-semibold text-foreground mb-3">Tips for Success</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Find a quiet place where you can focus without distractions</li>
          <li>• Take your time - accuracy is more important than speed</li>
          <li>• Stay hydrated and take short breaks if needed</li>
          <li>• Complete challenges daily to maintain your streak</li>
        </ul>
      </div>
    </div>
  );
}
