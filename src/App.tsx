import { useState, useEffect, useCallback, useRef } from 'react';
import { Position, SNAKE_TYPES, LEVELS, SnakeType, Level } from './gameData';

type GameState = 'menu' | 'playing' | 'gameover' | 'win' | 'levelSelect' | 'snakeSelect';

function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedSnake, setSelectedSnake] = useState<SnakeType>(SNAKE_TYPES[0]);
  const [score, setScore] = useState(0);
  const [highScores, setHighScores] = useState<Record<number, number>>({});
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  
  // Game state
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<string>('RIGHT');
  const [isPaused, setIsPaused] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(150);
  const [gridSize] = useState(20);
  const [obstacles, setObstacles] = useState<Position[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const gameLoopRef = useRef<number | null>(null);
  const directionRef = useRef(direction);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  const generateFood = useCallback((currentSnake: Position[], currentObstacles: Position[], size: number): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * size),
        y: Math.floor(Math.random() * size),
      };
    } while (
      currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y) ||
      currentObstacles.some(obs => obs.x === newFood.x && obs.y === newFood.y)
    );
    return newFood;
  }, []);

  const startGame = useCallback((level: Level) => {
    const initialSnake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    setSnake(initialSnake);
    setDirection('RIGHT');
    setScore(0);
    setObstacles(level.obstacles);
    setGameSpeed(level.speed);
    setIsPaused(false);
    setFood(generateFood(initialSnake, level.obstacles, level.gridSize));
    setGameState('playing');
  }, [generateFood]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing') return;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (directionRef.current !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (directionRef.current !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (directionRef.current !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (directionRef.current !== 'LEFT') setDirection('RIGHT');
        break;
      case ' ':
        setIsPaused(p => !p);
        break;
    }
  }, [gameState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing' || isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    gameLoopRef.current = window.setInterval(() => {
      moveSnake();
    }, gameSpeed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, isPaused, gameSpeed]);

  const moveSnake = useCallback(() => {
    const currentSnake = [...snakeRef.current];
    const head = { ...currentSnake[0] };
    const dir = directionRef.current;

    switch (dir) {
      case 'UP': head.y -= 1; break;
      case 'DOWN': head.y += 1; break;
      case 'LEFT': head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
    }

    // Wall collision
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      setGameState('gameover');
      return;
    }

    // Self collision
    if (currentSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
      setGameState('gameover');
      return;
    }

    // Obstacle collision
    if (obstacles.some(obs => obs.x === head.x && obs.y === head.y)) {
      setGameState('gameover');
      return;
    }

    const newSnake = [head, ...currentSnake];
    const currentFood = foodRef.current;

    if (head.x === currentFood.x && head.y === currentFood.y) {
      // Ate food
      const newScore = score + 1;
      setScore(newScore);
      
      const level = LEVELS[currentLevel];
      if (newScore >= level.targetScore) {
        // Level complete!
        setCompletedLevels(prev => {
          if (!prev.includes(currentLevel)) {
            return [...prev, currentLevel];
          }
          return prev;
        });
        setHighScores(prev => ({
          ...prev,
          [currentLevel]: Math.max(prev[currentLevel] || 0, newScore)
        }));
        setShowConfetti(true);
        setGameState('win');
        setTimeout(() => setShowConfetti(false), 3000);
        return;
      }
      
      const newFood = generateFood(newSnake, obstacles, gridSize);
      setFood(newFood);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [score, obstacles, gridSize, currentLevel, generateFood]);

  const handleDirectionButton = (dir: string) => {
    if (dir === 'UP' && directionRef.current !== 'DOWN') setDirection('UP');
    if (dir === 'DOWN' && directionRef.current !== 'UP') setDirection('DOWN');
    if (dir === 'LEFT' && directionRef.current !== 'RIGHT') setDirection('LEFT');
    if (dir === 'RIGHT' && directionRef.current !== 'LEFT') setDirection('RIGHT');
  };

  // Render Menu
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500 mb-4 animate-pulse">
            🐍 MAHIRA MANSHA
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">
            SNAKE CRASH
          </h2>
          <p className="text-xl text-yellow-300 mb-2 animate-float">⭐ Muzamill Bhaiya Edition ⭐</p>
          <p className="text-lg text-gray-300 mb-8">41 Epic Levels + Default Game!</p>
          
          <div className="space-y-4">
            <button
              onClick={() => { setCurrentLevel(0); startGame(LEVELS[0]); }}
              className="block w-64 mx-auto px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-bold rounded-xl shadow-lg hover:scale-105 transition-transform animate-pulse-glow"
            >
              🎮 Play Default Game
            </button>
            <button
              onClick={() => setGameState('levelSelect')}
              className="block w-64 mx-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xl font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              📋 Select Level
            </button>
            <button
              onClick={() => setGameState('snakeSelect')}
              className="block w-64 mx-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xl font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              🐍 Choose Snake
            </button>
          </div>

          <div className="mt-8 p-4 bg-black/30 rounded-xl border border-yellow-500/30">
            <p className="text-yellow-400 font-bold text-lg">🏆 Current Snake: {selectedSnake.name} {selectedSnake.emoji}</p>
            <p className="text-gray-400">{selectedSnake.description}</p>
            <p className="text-green-400 mt-2">✅ Completed: {completedLevels.length}/42 levels</p>
          </div>
        </div>
      </div>
    );
  }

  // Render Level Select
  if (gameState === 'levelSelect') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-yellow-400">📋 Select Level</h2>
            <button
              onClick={() => setGameState('menu')}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              ← Back
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => { setCurrentLevel(level.id); startGame(level); }}
                className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                  completedLevels.includes(level.id)
                    ? 'bg-green-900/50 border-green-500 text-green-300'
                    : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-yellow-500'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">
                    {completedLevels.includes(level.id) ? '✅' : level.id === 0 ? '🎮' : '🎯'}
                  </div>
                  <div className="text-xs font-bold">{level.name.split(' - ')[0]}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {level.id === 0 ? 'Default' : `Lvl ${level.id}`}
                  </div>
                  {highScores[level.id] && (
                    <div className="text-xs text-yellow-400 mt-1">⭐ {highScores[level.id]}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render Snake Select
  if (gameState === 'snakeSelect') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-yellow-400">🐍 Choose Your Snake</h2>
            <button
              onClick={() => setGameState('menu')}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              ← Back
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {SNAKE_TYPES.map((snakeType) => {
              const isUnlocked = completedLevels.length >= snakeType.unlockLevel || snakeType.unlockLevel === 0;
              return (
                <button
                  key={snakeType.id}
                  onClick={() => isUnlocked && setSelectedSnake(snakeType)}
                  disabled={!isUnlocked}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedSnake.id === snakeType.id
                      ? 'border-yellow-400 bg-yellow-900/30 scale-105'
                      : isUnlocked
                      ? 'border-gray-600 bg-gray-800/50 hover:border-green-500 hover:scale-105'
                      : 'border-gray-700 bg-gray-900/50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{snakeType.emoji}</div>
                    <div className="font-bold text-lg" style={{ color: snakeType.color }}>
                      {snakeType.name}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">{snakeType.description}</div>
                    {!isUnlocked && (
                      <div className="text-xs text-red-400 mt-2">🔒 Complete {snakeType.unlockLevel} levels to unlock</div>
                    )}
                    {selectedSnake.id === snakeType.id && (
                      <div className="text-xs text-yellow-400 mt-2">✓ Selected</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Render Game Over
  if (gameState === 'gameover') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-red-900 flex flex-col items-center justify-center p-4">
        <div className="text-center animate-shake">
          <div className="text-6xl mb-4">💀</div>
          <h1 className="text-4xl md:text-6xl font-bold text-red-500 mb-4">GAME OVER!</h1>
          <p className="text-2xl text-gray-300 mb-2">Muzamill Bhaiya crashed!</p>
          <p className="text-xl text-yellow-400 mb-2">Score: {score}</p>
          <p className="text-lg text-gray-400 mb-8">
            {LEVELS[currentLevel].name} | Target: {LEVELS[currentLevel].targetScore}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => startGame(LEVELS[currentLevel])}
              className="block w-64 mx-auto px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="block w-64 mx-auto px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xl font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              🏠 Main Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Win Screen
  if (gameState === 'win') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-green-900 to-purple-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${50 + Math.random() * 50}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  fontSize: `${20 + Math.random() * 20}px`,
                }}
              >
                {['🎉', '⭐', '🏆', '✨', '🎊', '💫'][Math.floor(Math.random() * 6)]}
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center z-10">
          <div className="text-6xl mb-4 animate-float">🏆</div>
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-400 mb-4">
            MAHIRA WINNER!
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">
            PROUD OF YOU! 🎉
          </h2>
          <p className="text-xl text-green-300 mb-2">
            {LEVELS[currentLevel].name} Completed!
          </p>
          <p className="text-lg text-gray-300 mb-4">
            Score: {score} | Snake: {selectedSnake.name} {selectedSnake.emoji}
          </p>
          
          {currentLevel === 41 && (
            <div className="text-2xl text-yellow-400 font-bold mb-4 animate-pulse">
              🌟 ALL 41 LEVELS COMPLETED! YOU ARE THE ULTIMATE CHAMPION! 🌟
            </div>
          )}
          
          <div className="space-y-3 mt-6">
            {currentLevel < 41 && (
              <button
                onClick={() => { setCurrentLevel(currentLevel + 1); startGame(LEVELS[currentLevel + 1]); }}
                className="block w-64 mx-auto px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-bold rounded-xl shadow-lg hover:scale-105 transition-transform animate-pulse-glow"
              >
                ▶ Next Level
              </button>
            )}
            <button
              onClick={() => startGame(LEVELS[currentLevel])}
              className="block w-64 mx-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xl font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              🔄 Play Again
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="block w-64 mx-auto px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xl font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              🏠 Main Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Playing Game
  const level = LEVELS[currentLevel];
  const cellSize = Math.min(Math.floor((window.innerWidth - 40) / gridSize), 25);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 flex flex-col items-center p-2 md:p-4">
      {/* Header */}
      <div className="w-full max-w-2xl mb-2">
        <div className="flex justify-between items-center bg-black/40 rounded-xl p-3 border border-gray-700">
          <div className="text-left">
            <div className="text-sm text-gray-400">🐍 {selectedSnake.name}</div>
            <div className="text-xs text-gray-500">{level.name}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{score}/{level.targetScore}</div>
            <div className="text-xs text-gray-400">Score</div>
          </div>
          <div className="text-right">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700"
            >
              {isPaused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="ml-2 px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="game-board relative"
        style={{ 
          width: cellSize * gridSize + 8, 
          height: cellSize * gridSize + 8,
          backgroundColor: level.bgColor,
          borderColor: level.borderColor,
        }}
      >
        {/* Grid background */}
        <div className="absolute inset-1 grid" style={{ 
          gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
        }}>
          {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
            const x = idx % gridSize;
            const y = Math.floor(idx / gridSize);
            return (
              <div
                key={idx}
                className="border border-gray-800/20"
                style={{ width: cellSize, height: cellSize }}
              />
            );
          })}
        </div>

        {/* Obstacles */}
        {obstacles.map((obs, idx) => (
          <div
            key={`obs-${idx}`}
            className="absolute bg-gray-600 border border-gray-500 rounded-sm"
            style={{
              left: obs.x * cellSize + 4,
              top: obs.y * cellSize + 4,
              width: cellSize,
              height: cellSize,
              boxShadow: 'inset 0 0 5px rgba(0,0,0,0.5)',
            }}
          >
            <div className="w-full h-full flex items-center justify-center text-xs">🧱</div>
          </div>
        ))}

        {/* Food */}
        <div
          className="absolute food-cell flex items-center justify-center"
          style={{
            left: food.x * cellSize + 4,
            top: food.y * cellSize + 4,
            width: cellSize,
            height: cellSize,
            fontSize: cellSize * 0.7,
          }}
        >
          👧
        </div>

        {/* Snake */}
        {snake.map((segment, idx) => (
          <div
            key={`snake-${idx}`}
            className={`absolute ${idx === 0 ? 'snake-head' : 'rounded-sm'}`}
            style={{
              left: segment.x * cellSize + 4,
              top: segment.y * cellSize + 4,
              width: cellSize,
              height: cellSize,
              backgroundColor: idx === 0 ? selectedSnake.headColor : selectedSnake.color,
              opacity: 1 - (idx * 0.02),
              zIndex: snake.length - idx,
              boxShadow: idx === 0 ? `0 0 10px ${selectedSnake.headColor}` : 'none',
            }}
          >
            {idx === 0 && (
              <div className="w-full h-full flex items-center justify-center" style={{ fontSize: cellSize * 0.5 }}>
                {selectedSnake.emoji}
              </div>
            )}
          </div>
        ))}

        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50 rounded-xl">
            <div className="text-center">
              <div className="text-4xl mb-2">⏸</div>
              <div className="text-2xl text-white font-bold">PAUSED</div>
              <div className="text-sm text-gray-400 mt-2">Press SPACE to resume</div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="mt-4 md:hidden">
        <div className="grid grid-cols-3 gap-2 w-40 mx-auto">
          <div></div>
          <button
            onTouchStart={() => handleDirectionButton('UP')}
            className="p-3 bg-gray-700 rounded-lg text-white text-xl active:bg-gray-600"
          >
            ↑
          </button>
          <div></div>
          <button
            onTouchStart={() => handleDirectionButton('LEFT')}
            className="p-3 bg-gray-700 rounded-lg text-white text-xl active:bg-gray-600"
          >
            ←
          </button>
          <button
            onTouchStart={() => handleDirectionButton('DOWN')}
            className="p-3 bg-gray-700 rounded-lg text-white text-xl active:bg-gray-600"
          >
            ↓
          </button>
          <button
            onTouchStart={() => handleDirectionButton('RIGHT')}
            className="p-3 bg-gray-700 rounded-lg text-white text-xl active:bg-gray-600"
          >
            →
          </button>
        </div>
      </div>

      {/* Controls Info */}
      <div className="mt-3 text-center text-gray-500 text-xs hidden md:block">
        <p>Arrow Keys / WASD to move | SPACE to pause</p>
      </div>
    </div>
  );
}

export default App;
