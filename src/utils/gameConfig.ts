import { Difficulty } from '@/types';

export type GameDifficulty = Lowercase<Difficulty>;

export const difficultyConfig: Record<GameDifficulty, {
  label: Difficulty;
  memoryPairs: number;
  memoryTime: number;
  sequenceQuestions: number;
  wordCount: number;
  reactionRounds: number;
  colorRounds: number;
  hints: number;
}> = {
  easy: { label: 'Easy', memoryPairs: 3, memoryTime: 60, sequenceQuestions: 3, wordCount: 3, reactionRounds: 2, colorRounds: 5, hints: 3 },
  medium: { label: 'Medium', memoryPairs: 6, memoryTime: 45, sequenceQuestions: 5, wordCount: 5, reactionRounds: 3, colorRounds: 8, hints: 2 },
  hard: { label: 'Hard', memoryPairs: 10, memoryTime: 30, sequenceQuestions: 7, wordCount: 7, reactionRounds: 5, colorRounds: 12, hints: 1 },
};

export const normalizeDifficulty = (value?: string): GameDifficulty =>
  value?.toLowerCase() === 'medium' || value?.toLowerCase() === 'hard' ? value.toLowerCase() as GameDifficulty : 'easy';