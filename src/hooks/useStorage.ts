import { useState, useCallback } from 'react';

interface GameProgress {
  highScores: Record<number, number>;
  completedLevels: number[];
  selectedSnakeId: string;
  selectedBoardId: string;
  soundEnabled: boolean;
  musicEnabled: boolean;
  totalGamesPlayed: number;
}

const STORAGE_KEY = 'mahira_snake_crash_progress';

const defaultProgress: GameProgress = {
  highScores: {},
  completedLevels: [],
  selectedSnakeId: 'classic',
  selectedBoardId: 'classic',
  soundEnabled: true,
  musicEnabled: true,
  totalGamesPlayed: 0,
};

function loadProgress(): GameProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultProgress, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Failed to load progress:', e);
  }
  return { ...defaultProgress };
}

function saveProgress(progress: GameProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to save progress:', e);
  }
}

export function useStorage() {
  const [progress, setProgress] = useState<GameProgress>(loadProgress);

  const updateProgress = useCallback((updates: Partial<GameProgress>) => {
    setProgress(prev => {
      const next = { ...prev, ...updates };
      saveProgress(next);
      return next;
    });
  }, []);

  const completeLevel = useCallback((levelId: number, score: number) => {
    setProgress(prev => {
      const completedLevels = prev.completedLevels.includes(levelId)
        ? prev.completedLevels
        : [...prev.completedLevels, levelId];
      const highScores = { ...prev.highScores };
      highScores[levelId] = Math.max(highScores[levelId] || 0, score);
      const next = { ...prev, completedLevels, highScores, totalGamesPlayed: prev.totalGamesPlayed + 1 };
      saveProgress(next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({ ...defaultProgress });
    saveProgress(defaultProgress);
  }, []);

  const isLevelUnlocked = useCallback((levelId: number) => {
    if (levelId === 0) return true;
    if (levelId === 1) return true;
    return progress.completedLevels.includes(levelId - 1);
  }, [progress.completedLevels]);

  return {
    progress,
    updateProgress,
    completeLevel,
    resetProgress,
    isLevelUnlocked,
  };
}
