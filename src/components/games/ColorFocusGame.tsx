'use client';

import { useState } from 'react';
import { CheckCircle, Palette } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { GameDifficulty, difficultyConfig } from '@/utils/gameConfig';

const COLORS = [
  { name: 'Red', className: 'text-red-500' },
  { name: 'Blue', className: 'text-blue-500' },
  { name: 'Green', className: 'text-green-500' },
  { name: 'Orange', className: 'text-orange-500' },
];

const makePrompt = () => {
  const word = COLORS[Math.floor(Math.random() * COLORS.length)];
  let ink = COLORS[Math.floor(Math.random() * COLORS.length)];
  while (ink.name === word.name) ink = COLORS[Math.floor(Math.random() * COLORS.length)];
  return { word, ink };
};

export default function ColorFocusGame({ difficulty = 'easy' }: { difficulty?: GameDifficulty }) {
  const config = difficultyConfig[difficulty];
  const { updateGameScore, completeGame } = useStore();
  const [prompt, setPrompt] = useState(makePrompt);
  const [question, setQuestion] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const answer = (color: string) => {
    const nextCorrect = correct + (color === prompt.ink.name ? 1 : 0);
    if (question === config.colorRounds - 1) {
      const accuracy = Math.round((nextCorrect / config.colorRounds) * 100);
      updateGameScore('5', accuracy, accuracy, 3, config.label, config.colorRounds);
      completeGame('5');
      setCorrect(nextCorrect);
      setFinished(true);
      return;
    }
    setCorrect(nextCorrect);
    setQuestion(question + 1);
    setPrompt(makePrompt());
  };

  const reset = () => {
    setPrompt(makePrompt());
    setQuestion(0);
    setCorrect(0);
    setFinished(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div><h2 className="text-2xl font-bold text-foreground">Color Focus</h2><p className="text-muted-foreground">Choose the ink color, not the word.</p></div>
        <Palette className="h-8 w-8 text-primary" />
      </div>
      {!finished ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="mb-8 text-sm text-muted-foreground">Round {question + 1} of {config.colorRounds}</p>
          <p className={`mb-10 text-5xl font-black ${prompt.ink.className}`}>{prompt.word.name}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {COLORS.map((color) => <button key={color.name} type="button" onClick={() => answer(color.name)} className="rounded-lg border border-border px-3 py-3 font-semibold hover:border-primary hover:bg-muted">{color.name}</button>)}
          </div>
        </div>
      ) : (
        <div className="py-10 text-center"><CheckCircle className="mx-auto mb-3 h-12 w-12 text-success" /><h3 className="text-2xl font-bold">Game Complete</h3><p className="my-3 text-muted-foreground">You got {correct} of {config.colorRounds} correct.</p><button type="button" onClick={reset} className="rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground">Play Again</button></div>
      )}
    </div>
  );
}