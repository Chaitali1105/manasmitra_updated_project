'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle, MousePointer2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { GameDifficulty, difficultyConfig } from '@/utils/gameConfig';

type Phase = 'idle' | 'waiting' | 'ready' | 'finished';

export default function ReactionTimeGame({ difficulty = 'easy' }: { difficulty?: GameDifficulty }) {
  const config = difficultyConfig[difficulty];
  const { updateGameScore, completeGame } = useStore();
  const [phase, setPhase] = useState<Phase>('idle');
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const startedAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const startRound = () => {
    setPhase('waiting');
    timer.current = setTimeout(() => {
      startedAt.current = performance.now();
      setPhase('ready');
    }, 900 + Math.random() * 1800);
  };

  const handleBoardClick = () => {
    if (phase === 'waiting') {
      if (timer.current) clearTimeout(timer.current);
      setPhase('idle');
      return;
    }
    if (phase !== 'ready') return;

    const nextTime = Math.round(performance.now() - startedAt.current);
    const nextTimes = [...times, nextTime];
    setTimes(nextTimes);
    if (round === config.reactionRounds - 1) {
      const average = Math.round(nextTimes.reduce((sum, value) => sum + value, 0) / nextTimes.length);
      const score = Math.max(0, Math.min(100, 100 - Math.round((average - 200) / 8)));
      updateGameScore('4', score, score, Math.max(1, Math.round(average / 1000)), config.label, config.reactionRounds);
      completeGame('4');
      setPhase('finished');
    } else {
      setRound(round + 1);
      setPhase('idle');
    }
  };

  const reset = () => {
    setRound(0);
    setTimes([]);
    setPhase('idle');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Reaction Time</h2>
        <p className="text-muted-foreground">Wait for green, then tap as quickly as you can for {config.reactionRounds} rounds.</p>
      </div>
      <button
        type="button"
        onClick={handleBoardClick}
        className={`flex min-h-72 w-full flex-col items-center justify-center rounded-2xl border-2 text-center transition-colors ${
          phase === 'ready' ? 'border-success bg-success text-white' : 'border-border bg-card text-foreground'
        }`}
      >
        <MousePointer2 className="mb-4 h-12 w-12" />
        {phase === 'waiting' && <span className="text-xl font-semibold">Wait...</span>}
        {phase === 'ready' && <span className="text-xl font-semibold">Tap now!</span>}
        {phase === 'idle' && <span className="text-xl font-semibold">{round ? 'Next round' : 'Start test'}</span>}
        {phase === 'finished' && <span className="text-xl font-semibold">Test complete</span>}
      </button>
      <p className="text-center text-sm text-muted-foreground">
        {times.length ? `Times: ${times.join(' ms, ')} ms` : 'Three rounds measure your average response time.'}
      </p>
      {phase === 'finished' && (
        <div className="text-center">
          <CheckCircle className="mx-auto mb-3 h-12 w-12 text-success" />
          <button type="button" onClick={reset} className="rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground">
            Try Again
          </button>
        </div>
      )}
      {phase === 'idle' && <button type="button" onClick={startRound} className="mx-auto block rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground">{round ? 'Begin Round' : 'Start Game'}</button>}
    </div>
  );
}