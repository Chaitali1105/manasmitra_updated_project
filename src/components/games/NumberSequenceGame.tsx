'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Hash, CheckCircle, X } from 'lucide-react';
import { GameDifficulty, difficultyConfig } from '@/utils/gameConfig';

export default function NumberSequenceGame({ difficulty = 'easy' }: { difficulty?: GameDifficulty }) {
  const config = difficultyConfig[difficulty];
  const { updateGameScore, completeGame } = useStore();
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');

  const sequences = [
    { sequence: [2, 4, 6, 8, '?'], answer: 10, pattern: 'Add 2' },
    { sequence: [1, 4, 9, 16, '?'], answer: 25, pattern: 'Squares (1², 2², 3²...)' },
    { sequence: [3, 6, 9, 12, '?'], answer: 15, pattern: 'Add 3' },
    { sequence: [1, 1, 2, 3, 5, '?'], answer: 8, pattern: 'Fibonacci' },
    { sequence: [5, 10, 20, 40, '?'], answer: 80, pattern: 'Multiply by 2' },
  ];

  const startGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswer('');
    setGameStarted(true);
    setGameCompleted(false);
  };

  const handleSubmit = () => {
    const answer = parseInt(userAnswer);
    const currentSeq = sequences[currentQuestion % sequences.length];

    if (answer === currentSeq.answer) {
      setScore(score + 20);
    }

    if (currentQuestion < config.sequenceQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setUserAnswer('');
    } else {
      setGameCompleted(true);
      const finalScore = score + (answer === currentSeq.answer ? 20 : 0);
      const accuracy = Math.round((finalScore / (config.sequenceQuestions * 20)) * 100);
      updateGameScore('2', finalScore, accuracy, 3, config.label, config.sequenceQuestions);
      completeGame('2');
    }
  };

  const renderSequence = (seq: (number | string)[]) => {
    return seq.map((item, index) => (
      <span key={index} className="inline-block mx-1">
        {item === '?' ? (
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="w-16 text-center border-b-2 border-primary bg-transparent text-foreground focus:outline-none"
            disabled={gameCompleted}
          />
        ) : (
          <span className="text-2xl font-bold text-foreground">{item}</span>
        )}
      </span>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Number Sequence</h2>
          <p className="text-muted-foreground">Complete {config.sequenceQuestions} number patterns on {config.label} mode.</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Score</p>
          <p className="text-xl font-bold text-foreground">{score}</p>
        </div>
      </div>

      {!gameStarted ? (
        <div className="text-center py-12">
          <Hash className="h-16 w-16 mx-auto mb-4 text-primary" />
          <button
            onClick={startGame}
            className="rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          {!gameCompleted && (
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Question {currentQuestion + 1} of {config.sequenceQuestions}</p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${((currentQuestion + 1) / config.sequenceQuestions) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-3xl mb-6">
                {renderSequence(sequences[currentQuestion % sequences.length].sequence)}
              </div>

              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground">Look for the rule connecting the numbers.</p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!userAnswer}
                className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit Answer
              </button>
            </div>
          )}

          {gameCompleted && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Game Complete!</h3>
              <p className="text-muted-foreground mb-4">Final Score: {score}</p>
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
