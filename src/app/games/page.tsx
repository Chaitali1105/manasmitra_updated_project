'use client';

import { useStore } from '@/store/useStore';
import { Gamepad2, Clock, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { difficultyConfig, GameDifficulty } from '@/utils/gameConfig';
import { getCategoryLabel, getSupportLevelLabel, translateText } from '@/utils/translations';

export default function GamesPage() {
  const { games, assessmentResult, language } = useStore();
  const [difficulty, setDifficulty] = useState<GameDifficulty>('easy');
  const selectedConfig = difficultyConfig[difficulty];
  const allowedDifficulties = assessmentResult?.level === 'high'
    ? ['Easy']
    : assessmentResult?.level === 'moderate'
    ? ['Easy', 'Medium']
    : ['Easy', 'Medium', 'Hard'];
  const recommendedGames = games.filter((game) => allowedDifficulties.includes(game.difficulty));
  const t = (key: string, fallback: string) => translateText(language, key, fallback);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('games', 'Games')}</h1>
        <p className="text-muted-foreground">{t('gamesDescription', 'Play cognitive games to improve memory, focus, and problem-solving skills')}</p>
      </div>

      {assessmentResult && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-semibold text-primary">{t('recommendedForYou', 'Recommended for you')}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {getSupportLevelLabel(language, assessmentResult.level)}. {t('gamesAdaptToLevel', 'Games are adjusted to begin at a comfortable challenge level.')}
          </p>
        </div>
      )}

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-bold text-foreground">{t('chooseDifficulty', 'Choose Difficulty')}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {(['easy', 'medium', 'hard'] as GameDifficulty[]).map((level) => {
            const config = difficultyConfig[level];
            return <button key={level} onClick={() => setDifficulty(level)} className={`rounded-xl border-2 p-4 text-left transition-colors ${difficulty === level ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}><span className="block font-bold text-foreground">{config.label}</span><span className="text-xs text-muted-foreground">{config.memoryPairs * 2} memory cards · {config.hints} hints · {config.memoryTime}s</span></button>;
          })}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">Selected level: <span className="font-semibold text-foreground">{selectedConfig.label}</span>. Every game adapts to this level.</p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recommendedGames.map((game) => (
          <div
            key={game.id}
            className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Gamepad2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{game.title}</h3>
                  <span className="text-xs text-muted-foreground">{getCategoryLabel(language, game.category)}</span>
                </div>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  game.difficulty === 'Easy'
                    ? 'bg-success/10 text-success'
                    : game.difficulty === 'Medium'
                    ? 'bg-warning/10 text-warning'
                    : 'bg-error/10 text-error'
                }`}
              >
                {game.difficulty}
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{game.description}</p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>{t('accuracy', 'Accuracy')}: {game.accuracy}%</span>
              </div>

            <p className="mb-4 text-xs text-muted-foreground">{game.id === '1' ? `${selectedConfig.memoryPairs * 2} cards · ${selectedConfig.memoryTime} seconds · ${selectedConfig.hints} hints` : game.id === '2' ? `${selectedConfig.sequenceQuestions} questions` : game.id === '3' ? `${selectedConfig.wordCount} words` : game.id === '4' ? `${selectedConfig.reactionRounds} rounds` : `${selectedConfig.colorRounds} rounds`}</p>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{game.timeSpent} min</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              {game.completed && <div className="flex items-center gap-2 text-success"><Zap className="h-4 w-4" /><span className="text-sm font-semibold">Best: {game.score}</span></div>}
              <Link
                href={`/games/${game.id}?difficulty=${difficulty}`}
                className="block w-full rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {game.completed ? t('playAgain', 'Play Again') : t('playNow', 'Play Now')}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
