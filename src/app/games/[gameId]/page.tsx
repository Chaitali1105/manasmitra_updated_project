'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import MemoryMatchGame from '@/components/games/MemoryMatchGame';
import NumberSequenceGame from '@/components/games/NumberSequenceGame';
import WordSearchGame from '@/components/games/WordSearchGame';
import ReactionTimeGame from '@/components/games/ReactionTimeGame';
import ColorFocusGame from '@/components/games/ColorFocusGame';
import CognitiveMiniGame from '@/components/games/CognitiveMiniGame';
import { normalizeDifficulty } from '@/utils/gameConfig';

const gameComponents = {
  '1': MemoryMatchGame,
  '2': NumberSequenceGame,
  '3': WordSearchGame,
  '4': ReactionTimeGame,
  '5': ColorFocusGame,
};

const extraGameTitles: Record<string, string> = {
  '6': 'Image Recognition',
  '7': 'Pattern Completion',
  '8': 'Word Association',
  '9': 'Object Identification',
  '10': 'Visual Recall',
  '11': 'Logical Puzzle',
  '12': 'Vowel Challenge',
};

export default function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const searchParams = useSearchParams();
  const difficulty = normalizeDifficulty(searchParams.get('difficulty') || undefined);
  const Game = gameComponents[gameId as keyof typeof gameComponents];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/games" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to games
      </Link>
      {Game ? <Game difficulty={difficulty} /> : extraGameTitles[gameId] ? <CognitiveMiniGame gameId={gameId} title={extraGameTitles[gameId]} difficulty={difficulty} /> : <div className="rounded-xl border border-border bg-card p-8 text-center"><h1 className="text-2xl font-bold">Game not found</h1><p className="mt-2 text-muted-foreground">Choose a game from the games page.</p></div>}
    </div>
  );
}