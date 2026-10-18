import { useState, useEffect, useCallback } from 'react';
import { LEVELS, LevelConfig, SNAKE_SKINS, BOARD_THEMES } from './gameData';
import { useStorage } from './hooks/useStorage';
import { useSound } from './hooks/useSound';
import { useGameEngine } from './hooks/useGameEngine';
import HomeScreen from './components/HomeScreen';
import GameBoard from './components/GameBoard';
import { LevelSelect, SnakeSelect, BoardSelect, Settings } from './components/Menus';
import { GameOverScreen, LevelCompleteScreen, VictoryScreen } from './components/Screens';

type Screen = 'home' | 'playing' | 'gameover' | 'levelcomplete' | 'victory' | 'levelSelect' | 'snakeSelect' | 'boardSelect' | 'settings';

function GameWrapper({ level, snakeId, boardId, onComplete, onGameOver, onQuit }: {
  level: LevelConfig;
  snakeId: string;
  boardId: string;
  onComplete: (score: number) => void;
  onGameOver: (score: number) => void;
  onQuit: () => void;
}) {
  const { gameState, snakeSkin, boardTheme, initGame, changeDirection, togglePause } = useGameEngine(level, snakeId, boardId);
  const { sound } = useSound();
  const [initialized, setInitialized] = useState(false);
  const [prevScore, setPrevScore] = useState(0);

  useEffect(() => {
    initGame();
    setInitialized(true);
  }, [initGame]);

  // Play sound when eating
  useEffect(() => {
    if (!initialized) return;
    if (gameState.score > prevScore) {
      if (gameState.score - prevScore >= 3) {
        sound.playPowerUp();
      } else {
        sound.playEat();
      }
    }
    setPrevScore(gameState.score);
  }, [gameState.score, initialized, sound, prevScore]);

  // Handle game state changes
  useEffect(() => {
    if (!initialized) return;
    if (gameState.status === 'levelcomplete') {
      sound.playLevelComplete();
      onComplete(gameState.score);
    } else if (gameState.status === 'gameover') {
      sound.playGameOver();
      onGameOver(gameState.score);
    }
  }, [gameState.status, gameState.score, initialized, sound, onComplete, onGameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.status !== 'playing' && gameState.status !== 'paused') return;
      
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W':
          e.preventDefault();
          changeDirection('UP');
          break;
        case 'ArrowDown': case 's': case 'S':
          e.preventDefault();
          changeDirection('DOWN');
          break;
        case 'ArrowLeft': case 'a': case 'A':
          e.preventDefault();
          changeDirection('LEFT');
          break;
        case 'ArrowRight': case 'd': case 'D':
          e.preventDefault();
          changeDirection('RIGHT');
          break;
        case ' ':
          e.preventDefault();
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status, changeDirection, togglePause]);

  // Prevent scrolling
  useEffect(() => {
    const preventScroll = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', preventScroll, { passive: false });
    return () => window.removeEventListener('keydown', preventScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-2" style={{ background: boardTheme.bgGradient }}>
      <GameBoard
        snake={gameState.snake}
        food={gameState.food}
        powerUp={gameState.powerUp}
        obstacles={level.obstacles}
        level={level}
        snakeSkin={snakeSkin}
        boardTheme={boardTheme}
        score={gameState.score}
        targetScore={level.targetScore}
        status={gameState.status}
        activePowerUps={gameState.activePowerUps}
        hasShield={gameState.hasShield}
        onPause={togglePause}
        onQuit={onQuit}
        onChangeDirection={changeDirection}
      />
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [currentLevel, setCurrentLevel] = useState<LevelConfig>(LEVELS[0]);
  const [lastScore, setLastScore] = useState(0);
  const [gameKey, setGameKey] = useState(0);
  const { progress, updateProgress, completeLevel, resetProgress, isLevelUnlocked } = useStorage();
  const { sound, setEnabled: setSoundEnabled } = useSound();

  // Sync sound setting
  useEffect(() => {
    setSoundEnabled(progress.soundEnabled);
  }, [progress.soundEnabled, setSoundEnabled]);

  const selectedSnake = SNAKE_SKINS.find(s => s.id === progress.selectedSnakeId) || SNAKE_SKINS[0];
  const selectedBoard = BOARD_THEMES.find(b => b.id === progress.selectedBoardId) || BOARD_THEMES[0];

  const handleStartDefault = useCallback(() => {
    setCurrentLevel(LEVELS[0]);
    setGameKey(k => k + 1);
    setScreen('playing');
  }, []);

  const handleSelectLevel = useCallback((level: LevelConfig) => {
    setCurrentLevel(level);
    setGameKey(k => k + 1);
    setScreen('playing');
  }, []);

  const handleComplete = useCallback((score: number) => {
    setLastScore(score);
    completeLevel(currentLevel.id, score);
    
    // Check if this is the final level (41)
    if (currentLevel.id === 41) {
      setScreen('victory');
      sound.playVictory();
    } else {
      setScreen('levelcomplete');
    }
  }, [currentLevel.id, completeLevel, sound]);

  const handleGameOver = useCallback((score: number) => {
    setLastScore(score);
    setScreen('gameover');
  }, []);

  const handleNextLevel = useCallback(() => {
    const nextId = currentLevel.id + 1;
    const nextLevel = LEVELS.find(l => l.id === nextId);
    if (nextLevel) {
      setCurrentLevel(nextLevel);
      setGameKey(k => k + 1);
      setScreen('playing');
    }
  }, [currentLevel.id]);

  const handleRetry = useCallback(() => {
    setGameKey(k => k + 1);
    setScreen('playing');
  }, []);

  const handleQuit = useCallback(() => {
    setScreen('home');
  }, []);

  const handleToggleSound = useCallback(() => {
    updateProgress({ soundEnabled: !progress.soundEnabled });
  }, [progress.soundEnabled, updateProgress]);

  // Calculate total score across all levels
  const totalScore = Object.values(progress.highScores).reduce((a, b) => a + b, 0);

  // Render current screen
  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return (
          <HomeScreen
            onStart={handleStartDefault}
            onLevelSelect={() => setScreen('levelSelect')}
            onSnakeSelect={() => setScreen('snakeSelect')}
            onBoardSelect={() => setScreen('boardSelect')}
            onSettings={() => setScreen('settings')}
            completedLevels={progress.completedLevels.length}
            totalLevels={42}
            selectedSnakeName={selectedSnake.name}
            selectedSnakeEmoji={selectedSnake.emoji}
          />
        );

      case 'playing':
        return (
          <GameWrapper
            key={`game-${currentLevel.id}-${gameKey}`}
            level={currentLevel}
            snakeId={progress.selectedSnakeId}
            boardId={progress.selectedBoardId}
            onComplete={handleComplete}
            onGameOver={handleGameOver}
            onQuit={handleQuit}
          />
        );

      case 'gameover':
        return (
          <GameOverScreen
            level={currentLevel}
            score={lastScore}
            snakeName={selectedSnake.name}
            onRetry={handleRetry}
            onMenu={handleQuit}
            onLevelSelect={() => setScreen('levelSelect')}
          />
        );

      case 'levelcomplete':
        return (
          <LevelCompleteScreen
            level={currentLevel}
            score={lastScore}
            snakeName={selectedSnake.name}
            completionMessage={currentLevel.completionMessage}
            isFinalLevel={currentLevel.id === 41}
            onNextLevel={handleNextLevel}
            onRetry={handleRetry}
            onMenu={handleQuit}
            hasNextLevel={currentLevel.id < 41}
          />
        );

      case 'victory':
        return (
          <VictoryScreen
            totalScore={totalScore}
            onPlayAgain={() => { setCurrentLevel(LEVELS[1]); setGameKey(k => k + 1); setScreen('playing'); }}
            onMenu={handleQuit}
          />
        );

      case 'levelSelect':
        return (
          <LevelSelect
            completedLevels={progress.completedLevels}
            highScores={progress.highScores}
            onSelectLevel={handleSelectLevel}
            onBack={() => setScreen('home')}
            isLevelUnlocked={isLevelUnlocked}
          />
        );

      case 'snakeSelect':
        return (
          <SnakeSelect
            selectedSnakeId={progress.selectedSnakeId}
            completedLevels={progress.completedLevels.length}
            onSelect={(id) => updateProgress({ selectedSnakeId: id })}
            onBack={() => setScreen('home')}
          />
        );

      case 'boardSelect':
        return (
          <BoardSelect
            selectedBoardId={progress.selectedBoardId}
            completedLevels={progress.completedLevels.length}
            onSelect={(id) => updateProgress({ selectedBoardId: id })}
            onBack={() => setScreen('home')}
          />
        );

      case 'settings':
        return (
          <Settings
            soundEnabled={progress.soundEnabled}
            onToggleSound={handleToggleSound}
            onResetProgress={resetProgress}
            onBack={() => setScreen('home')}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {renderScreen()}
    </div>
  );
}

export default App;
