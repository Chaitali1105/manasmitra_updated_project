'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Brain, CheckCircle, X } from 'lucide-react';
import { GameDifficulty, difficultyConfig } from '@/utils/gameConfig';

const EMOJIS = ['🧠', '💡', '🎯', '📚', '⏰', '🏆', '⭐', '🔥'];

export default function MemoryMatchGame({ difficulty = 'easy' }: { difficulty?: GameDifficulty }) {
  const config = difficultyConfig[difficulty];
  const { updateGameScore, completeGame } = useStore();
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const startGame = () => {
    const symbols = EMOJIS.slice(0, config.memoryPairs);
    const shuffledEmojis = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    setCards(shuffledEmojis.map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false })));
    setFlippedCards([]);
    setMoves(0);
    setScore(0);
    setGameStarted(true);
    setGameCompleted(false);
  };

  const handleCardClick = (index: number) => {
    if (!gameStarted || gameCompleted || cards[index].flipped || cards[index].matched || flippedCards.length >= 2) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstIndex, secondIndex] = newFlippedCards;

      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        // Match found
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[firstIndex].matched = true;
          updatedCards[secondIndex].matched = true;
          setCards(updatedCards);
          setFlippedCards([]);
          const nextScore = score + 10;
          setScore(nextScore);

          // Check if all matched
          if (updatedCards.every(card => card.matched)) {
            setGameCompleted(true);
            const finalScore = Math.max(0, 100 - (moves + 1) * 2 + nextScore);
            updateGameScore('1', finalScore, Math.round((nextScore / (config.memoryPairs * 10)) * 100), Math.max(1, Math.round(config.memoryTime / 10)), config.label, moves + 1);
            completeGame('1');
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[firstIndex].flipped = false;
          updatedCards[secondIndex].flipped = false;
          setCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Memory Match</h2>
          <p className="text-muted-foreground">Find {config.memoryPairs} matching pairs on {config.label} mode.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Moves</p>
            <p className="text-xl font-bold text-foreground">{moves}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-xl font-bold text-foreground">{score}</p>
          </div>
        </div>
      </div>

      {!gameStarted ? (
        <div className="text-center py-12">
          <Brain className="h-16 w-16 mx-auto mb-4 text-primary" />
          <button
            onClick={startGame}
            className="rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
            {cards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                disabled={card.flipped || card.matched}
                className={`aspect-square rounded-xl flex items-center justify-center text-4xl transition-all ${
                  card.flipped || card.matched
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-muted border-2 border-border hover:border-primary/50'
                } ${card.matched ? 'opacity-50' : ''}`}
              >
                {card.flipped || card.matched ? card.emoji : '?'}
              </button>
            ))}
          </div>

          {gameCompleted && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Game Complete!</h3>
              <p className="text-muted-foreground mb-4">You finished in {moves} moves</p>
              <button
                onClick={startGame}
                className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
