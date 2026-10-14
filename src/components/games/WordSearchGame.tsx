'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Search, CheckCircle } from 'lucide-react';
import { GameDifficulty, difficultyConfig } from '@/utils/gameConfig';

const WORDS = ['MEMORY', 'FOCUS', 'BRAIN', 'LEARN', 'THINK'];
const GRID_SIZE = 10;

export default function WordSearchGame({ difficulty = 'easy' }: { difficulty?: GameDifficulty }) {
  const config = difficultyConfig[difficulty];
  const words = WORDS.slice(0, config.wordCount);
  const { updateGameScore, completeGame } = useStore();
  const [grid, setGrid] = useState<string[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const initializeGrid = () => {
    const newGrid: string[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    
    // Place words horizontally
    words.forEach(word => {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * (GRID_SIZE - word.length + 1));
        
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          if (newGrid[row][col + i] !== '' && newGrid[row][col + i] !== word[i]) {
            canPlace = false;
            break;
          }
        }
        
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            newGrid[row][col + i] = word[i];
          }
          placed = true;
        }
        attempts++;
      }
    });

    // Fill empty cells with random letters
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (newGrid[i][j] === '') {
          newGrid[i][j] = String.fromCharCode(65 + ((i * GRID_SIZE + j + words.length) % 26));
        }
      }
    }

    setGrid(newGrid);
  };

  const startGame = () => {
    initializeGrid();
    setFoundWords([]);
    setSelectedCells([]);
    setScore(0);
    setGameStarted(true);
    setGameCompleted(false);
  };

  const handleCellMouseDown = (row: number, col: number) => {
    if (!gameStarted || gameCompleted) return;
    setIsSelecting(true);
    setSelectedCells([[row, col]]);
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (!isSelecting || !gameStarted || gameCompleted) return;
    
    const firstCell = selectedCells[0];
    if (!firstCell) return;

    // Check if selection is horizontal
    if (firstCell[0] === row) {
      const minCol = Math.min(firstCell[1], col);
      const maxCol = Math.max(firstCell[1], col);
      const newSelection: [number, number][] = [];
      for (let c = minCol; c <= maxCol; c++) {
        newSelection.push([row, c]);
      }
      setSelectedCells(newSelection);
    }
    // Check if selection is vertical
    else if (firstCell[1] === col) {
      const minRow = Math.min(firstCell[0], row);
      const maxRow = Math.max(firstCell[0], row);
      const newSelection: [number, number][] = [];
      for (let r = minRow; r <= maxRow; r++) {
        newSelection.push([r, col]);
      }
      setSelectedCells(newSelection);
    }
  };

  const handleCellMouseUp = () => {
    if (!isSelecting || !gameStarted || gameCompleted) return;
    setIsSelecting(false);

    const selectedWord = selectedCells
      .map(([row, col]) => grid[row][col])
      .join('');

    if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
      setFoundWords([...foundWords, selectedWord]);
      setScore(score + 20);

      if (foundWords.length + 1 === words.length) {
        setGameCompleted(true);
        updateGameScore('3', score + 20, 100, 4, config.label, words.length);
        completeGame('3');
      }
    }

    setSelectedCells([]);
  };

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(([r, c]) => r === row && c === col);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Word Search</h2>
          <p className="text-muted-foreground">Find {words.length} hidden words on {config.label} mode.</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Score</p>
          <p className="text-xl font-bold text-foreground">{score}</p>
        </div>
      </div>

      {!gameStarted ? (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto mb-4 text-primary" />
          <button
            onClick={startGame}
            className="rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Words to find:</p>
              <div className="flex flex-wrap gap-2">
                {words.map(word => (
                  <span
                    key={word}
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      foundWords.includes(word)
                        ? 'bg-success/10 text-success line-through'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="inline-block">
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
              onMouseUp={handleCellMouseUp}
              onMouseLeave={handleCellMouseUp}
            >
              {grid.map((row, rowIndex) =>
                row.map((letter, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                    onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                    className={`w-10 h-10 flex items-center justify-center font-bold rounded transition-all ${
                      isCellSelected(rowIndex, colIndex)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    {letter}
                  </button>
                ))
              )}
            </div>
          </div>

          {gameCompleted && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Game Complete!</h3>
              <p className="text-muted-foreground mb-4">You found all words!</p>
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
