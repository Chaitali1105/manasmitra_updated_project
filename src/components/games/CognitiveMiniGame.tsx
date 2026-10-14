'use client';

import { useState } from 'react';
import { CheckCircle, Brain, Eye, Puzzle, Type, ScanSearch, Languages } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { GameDifficulty, difficultyConfig } from '@/utils/gameConfig';

const prompts: Record<string, { question: string; options: string[]; answer: string; icon: 'brain' | 'eye' | 'puzzle' | 'type' | 'scan' | 'language' }> = {
  '6': { question: 'Which object did you just see?', options: ['Key', 'Cup', 'Book', 'Clock'], answer: 'Cup', icon: 'eye' },
  '7': { question: 'Complete the pattern: circle, square, circle, square, ?', options: ['Circle', 'Triangle', 'Star', 'Line'], answer: 'Circle', icon: 'puzzle' },
  '8': { question: 'Which word is related to Garden?', options: ['Flower', 'Train', 'Keyboard', 'Window'], answer: 'Flower', icon: 'type' },
  '9': { question: 'Which object helps you tell time?', options: ['Clock', 'Pillow', 'Spoon', 'Shoe'], answer: 'Clock', icon: 'scan' },
  '10': { question: 'Which color was in the visual card?', options: ['Blue', 'Green', 'Red', 'Yellow'], answer: 'Blue', icon: 'eye' },
  '11': { question: 'If all birds have wings and a robin is a bird, what does a robin have?', options: ['Wings', 'Fur', 'Scales', 'Wheels'], answer: 'Wings', icon: 'brain' },
  '12': { question: 'Complete the word: B _ T', options: ['A', 'E', 'I', 'O'], answer: 'A', icon: 'language' },
};

const icons = { brain: Brain, eye: Eye, puzzle: Puzzle, type: Type, scan: ScanSearch, language: Languages };

export default function CognitiveMiniGame({ gameId, title, difficulty = 'easy' }: { gameId: string; title: string; difficulty?: GameDifficulty }) {
  const config = difficultyConfig[difficulty];
  const prompt = prompts[gameId] || prompts['6'];
  const Icon = icons[prompt.icon];
  const updateGameScore = useStore((state) => state.updateGameScore);
  const completeGame = useStore((state) => state.completeGame);
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const rounds = gameId === '10' || gameId === '11' ? config.colorRounds : config.sequenceQuestions;

  const answer = (value: string) => {
    const nextCorrect = correct + (value === prompt.answer ? 1 : 0);
    if (round === rounds - 1) {
      const accuracy = Math.round((nextCorrect / rounds) * 100);
      updateGameScore(gameId, accuracy, accuracy, Math.max(1, Math.round(rounds / 2)), config.label, rounds);
      completeGame(gameId);
      setCorrect(nextCorrect);
      setFinished(true);
    } else {
      setCorrect(nextCorrect);
      setRound(round + 1);
    }
  };

  if (finished) return <div className="space-y-4 py-8 text-center"><CheckCircle className="mx-auto h-16 w-16 text-success" /><h2 className="text-2xl font-bold text-foreground">Great Work!</h2><p className="text-muted-foreground">Score {Math.round((correct / rounds) * 100)} · Accuracy {Math.round((correct / rounds) * 100)}% · {config.label}</p><button onClick={() => { setRound(0); setCorrect(0); setFinished(false); }} className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground">Play Again</button></div>;

  return <div className="space-y-6"><div className="flex items-start justify-between"><div><h2 className="text-2xl font-bold text-foreground">{title}</h2><p className="text-muted-foreground">Round {round + 1} of {rounds} · {config.label}</p></div><Icon className="h-10 w-10 text-primary" /></div><div className="rounded-2xl border border-border bg-card p-8 text-center"><p className="mb-8 text-xl font-bold text-foreground">{prompt.question}</p><div className="grid gap-3 sm:grid-cols-2">{prompt.options.map((option) => <button key={option} onClick={() => answer(option)} className="rounded-xl border-2 border-border p-4 font-semibold text-foreground hover:border-primary hover:bg-primary/5">{option}</button>)}</div></div></div>;
}