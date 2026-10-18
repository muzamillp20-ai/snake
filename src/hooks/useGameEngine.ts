import { useState, useCallback, useRef, useEffect } from 'react';
import { Position, LevelConfig, PowerUp, POWER_UP_TYPES, SNAKE_SKINS, BOARD_THEMES } from '../gameData';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover' | 'levelcomplete';

interface ActivePowerUp {
  type: PowerUp['type'];
  emoji: string;
  label: string;
  expiresAt: number;
}

interface GameState {
  snake: Position[];
  food: Position;
  powerUp: PowerUp | null;
  direction: Direction;
  score: number;
  status: GameStatus;
  activePowerUps: ActivePowerUp[];
  hasShield: boolean;
}

export function useGameEngine(level: LevelConfig, snakeId: string, boardId: string) {
  const snakeSkin = SNAKE_SKINS.find(s => s.id === snakeId) || SNAKE_SKINS[0];
  const boardTheme = BOARD_THEMES.find(b => b.id === boardId) || BOARD_THEMES[0];

  const [gameState, setGameState] = useState<GameState>({
    snake: [],
    food: { x: 0, y: 0 },
    powerUp: null,
    direction: 'RIGHT',
    score: 0,
    status: 'idle',
    activePowerUps: [],
    hasShield: false,
  });

  const stateRef = useRef(gameState);
  const directionRef = useRef<Direction>('RIGHT');
  const nextDirectionRef = useRef<Direction | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastMoveTimeRef = useRef(0);
  const levelRef = useRef(level);

  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    levelRef.current = level;
  }, [level]);

  const getEffectiveSpeed = useCallback(() => {
    const state = stateRef.current;
    let speed = levelRef.current.baseSpeed;
    const hasSpeedBoost = state.activePowerUps.some(p => p.type === 'speed');
    const hasSlowMo = state.activePowerUps.some(p => p.type === 'slow');
    if (hasSpeedBoost) speed *= 0.6;
    if (hasSlowMo) speed *= 1.5;
    return speed;
  }, []);

  const generatePosition = useCallback((snake: Position[], obstacles: Position[], gridSize: number): Position => {
    let pos: Position;
    let attempts = 0;
    do {
      pos = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
      attempts++;
      if (attempts > 500) break;
    } while (
      snake.some(s => s.x === pos.x && s.y === pos.y) ||
      obstacles.some(o => o.x === pos.x && o.y === pos.y)
    );
    return pos;
  }, []);

  const generatePowerUp = useCallback((snake: Position[], obstacles: Position[], food: Position, gridSize: number): PowerUp | null => {
    if (Math.random() > levelRef.current.powerUpChance) return null;
    const typeData = POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];
    let pos: Position;
    let attempts = 0;
    do {
      pos = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
      attempts++;
      if (attempts > 200) return null;
    } while (
      snake.some(s => s.x === pos.x && s.y === pos.y) ||
      obstacles.some(o => o.x === pos.x && o.y === pos.y) ||
      (food.x === pos.x && food.y === pos.y)
    );
    return { pos, type: typeData.type, emoji: typeData.emoji, points: typeData.points, duration: typeData.duration };
  }, []);

  const initGame = useCallback(() => {
    const gridSize = level.gridSize;
    const mid = Math.floor(gridSize / 2);
    const initialSnake: Position[] = [
      { x: mid, y: mid },
      { x: mid - 1, y: mid },
      { x: mid - 2, y: mid },
    ];
    
    const food = generatePosition(initialSnake, level.obstacles, gridSize);
    const powerUp = generatePowerUp(initialSnake, level.obstacles, food, gridSize);

    const newState: GameState = {
      snake: initialSnake,
      food,
      powerUp,
      direction: 'RIGHT',
      score: 0,
      status: 'playing',
      activePowerUps: [],
      hasShield: false,
    };

    directionRef.current = 'RIGHT';
    nextDirectionRef.current = null;
    setGameState(newState);
    stateRef.current = newState;
    lastMoveTimeRef.current = performance.now();
  }, [level, generatePosition, generatePowerUp]);

  const moveSnake = useCallback(() => {
    const state = stateRef.current;
    if (state.status !== 'playing') return;

    // Apply queued direction
    if (nextDirectionRef.current) {
      directionRef.current = nextDirectionRef.current;
      nextDirectionRef.current = null;
    }

    const dir = directionRef.current;
    const head = { ...state.snake[0] };
    const gridSize = levelRef.current.gridSize;

    // Move with wrap-around borders
    switch (dir) {
      case 'UP': head.y -= 1; break;
      case 'DOWN': head.y += 1; break;
      case 'LEFT': head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
    }

    // Wrap around borders
    if (head.x < 0) head.x = gridSize - 1;
    if (head.x >= gridSize) head.x = 0;
    if (head.y < 0) head.y = gridSize - 1;
    if (head.y >= gridSize) head.y = 0;

    // Check obstacle collision
    const hitObstacle = levelRef.current.obstacles.some(o => o.x === head.x && o.y === head.y);
    if (hitObstacle) {
      if (state.hasShield) {
        // Shield absorbs one hit
        setGameState(prev => ({
          ...prev,
          hasShield: false,
          activePowerUps: prev.activePowerUps.filter(p => p.type !== 'shield'),
        }));
        return;
      }
      setGameState(prev => ({ ...prev, status: 'gameover' }));
      return;
    }

    // Check self collision
    const hitSelf = state.snake.some(seg => seg.x === head.x && seg.y === head.y);
    if (hitSelf) {
      if (state.hasShield) {
        setGameState(prev => ({
          ...prev,
          hasShield: false,
          activePowerUps: prev.activePowerUps.filter(p => p.type !== 'shield'),
        }));
        return;
      }
      setGameState(prev => ({ ...prev, status: 'gameover' }));
      return;
    }

    const newSnake = [head, ...state.snake];
    let newScore = state.score;
    let newFood = state.food;
    let newPowerUp = state.powerUp;
    let newActivePowerUps = [...state.activePowerUps];
    let hasShield = state.hasShield;
    let ate = false;

    // Check food collision
    if (head.x === state.food.x && head.y === state.food.y) {
      newScore += 1;
      newFood = generatePosition(newSnake, levelRef.current.obstacles, gridSize);
      if (!newPowerUp) {
        newPowerUp = generatePowerUp(newSnake, levelRef.current.obstacles, newFood, gridSize);
      }
      ate = true;
    }

    // Check power-up collision
    if (newPowerUp && head.x === newPowerUp.pos.x && head.y === newPowerUp.pos.y) {
      newScore += newPowerUp.points;
      const typeData = POWER_UP_TYPES.find(t => t.type === newPowerUp!.type)!;
      
      if (newPowerUp.type === 'golden') {
        // Instant effect, no timer
      } else if (newPowerUp.type === 'shield') {
        hasShield = true;
        newActivePowerUps.push({
          type: 'shield',
          emoji: typeData.emoji,
          label: typeData.label,
          expiresAt: Date.now() + typeData.duration,
        });
      } else {
        newActivePowerUps.push({
          type: newPowerUp.type,
          emoji: typeData.emoji,
          label: typeData.label,
          expiresAt: Date.now() + typeData.duration,
        });
      }
      newPowerUp = null;
      ate = true;
    }

    // Remove tail if didn't eat
    if (!ate) {
      newSnake.pop();
    }

    // Clean expired power-ups
    const now = Date.now();
    newActivePowerUps = newActivePowerUps.filter(p => p.expiresAt > now);
    hasShield = newActivePowerUps.some(p => p.type === 'shield');

    // Check level completion
    let status: GameStatus = 'playing';
    if (newScore >= levelRef.current.targetScore) {
      status = 'levelcomplete';
    }

    const newState: GameState = {
      snake: newSnake,
      food: newFood,
      powerUp: newPowerUp,
      direction: dir,
      score: newScore,
      status,
      activePowerUps: newActivePowerUps,
      hasShield,
    };

    setGameState(newState);
    stateRef.current = newState;

    return ate;
  }, [generatePosition, generatePowerUp]);

  // Game loop using requestAnimationFrame
  useEffect(() => {
    if (gameState.status !== 'playing') {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const loop = (timestamp: number) => {
      const speed = getEffectiveSpeed();
      if (timestamp - lastMoveTimeRef.current >= speed) {
        moveSnake();
        lastMoveTimeRef.current = timestamp;
      }
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    lastMoveTimeRef.current = performance.now();
    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.status, getEffectiveSpeed, moveSnake]);

  const changeDirection = useCallback((newDir: Direction) => {
    const current = directionRef.current;
    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT'
    };
    if (newDir !== opposites[current]) {
      nextDirectionRef.current = newDir;
    }
  }, []);

  const pause = useCallback(() => {
    setGameState(prev => ({ ...prev, status: 'paused' }));
  }, []);

  const resume = useCallback(() => {
    setGameState(prev => ({ ...prev, status: 'playing' }));
    lastMoveTimeRef.current = performance.now();
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prev => {
      if (prev.status === 'playing') {
        return { ...prev, status: 'paused' };
      } else if (prev.status === 'paused') {
        lastMoveTimeRef.current = performance.now();
        return { ...prev, status: 'playing' };
      }
      return prev;
    });
  }, []);

  return {
    gameState,
    snakeSkin,
    boardTheme,
    initGame,
    changeDirection,
    pause,
    resume,
    togglePause,
    level,
  };
}
