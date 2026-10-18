import React, { useEffect, useRef, useCallback } from 'react';
import { Position, LevelConfig, SnakeSkin, BoardTheme, PowerUp } from '../gameData';

interface GameBoardProps {
  snake: Position[];
  food: Position;
  powerUp: PowerUp | null;
  obstacles: Position[];
  level: LevelConfig;
  snakeSkin: SnakeSkin;
  boardTheme: BoardTheme;
  score: number;
  targetScore: number;
  status: string;
  activePowerUps: { type: string; emoji: string; label: string; expiresAt: number }[];
  hasShield: boolean;
  onPause: () => void;
  onQuit: () => void;
  onChangeDirection: (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  snake,
  food,
  powerUp,
  obstacles,
  level,
  snakeSkin,
  boardTheme,
  score,
  targetScore,
  status,
  activePowerUps,
  hasShield,
  onPause,
  onQuit,
  onChangeDirection,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = React.useState(400);
  const [showLevelIntro, setShowLevelIntro] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowLevelIntro(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Responsive canvas sizing
  useEffect(() => {
    const updateSize = () => {
      const maxSize = Math.min(window.innerWidth - 32, window.innerHeight - 250, 560);
      setCanvasSize(Math.max(280, maxSize));
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const cellSize = canvasSize / level.gridSize;

  // Render game on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvasSize;
    canvas.width = size;
    canvas.height = size;
    const cs = size / level.gridSize;

    // Background
    ctx.fillStyle = boardTheme.bgGradient.includes('linear') ? '#0a1628' : boardTheme.bgGradient;
    ctx.fillRect(0, 0, size, size);

    // Grid pattern
    ctx.strokeStyle = boardTheme.gridColor;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= level.gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cs, 0);
      ctx.lineTo(i * cs, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cs);
      ctx.lineTo(size, i * cs);
      ctx.stroke();
    }

    // Obstacles
    obstacles.forEach(obs => {
      const x = obs.x * cs;
      const y = obs.y * cs;
      ctx.fillStyle = '#4a4a5a';
      ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2);
      ctx.strokeStyle = '#6a6a7a';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 1, y + 1, cs - 2, cs - 2);
      // Brick pattern
      ctx.fillStyle = '#3a3a4a';
      ctx.fillRect(x + 2, y + cs / 2, cs - 4, 1);
      ctx.fillRect(x + cs / 2, y + 2, 1, cs - 4);
    });

    // Food (MAHIRA 👧)
    const fx = food.x * cs + cs / 2;
    const fy = food.y * cs + cs / 2;
    ctx.font = `${cs * 0.8}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👧', fx, fy);
    // Glow effect
    ctx.shadowColor = '#ff69b4';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(fx, fy, cs * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 105, 180, 0.1)';
    ctx.fill();
    ctx.shadowBlur = 0;
    // MAHIRA label
    ctx.font = `bold ${cs * 0.28}px sans-serif`;
    ctx.fillStyle = '#ff69b4';
    ctx.textAlign = 'center';
    ctx.fillText('MAHIRA', fx, fy + cs * 0.55);

    // Power-up
    if (powerUp) {
      const px = powerUp.pos.x * cs + cs / 2;
      const py = powerUp.pos.y * cs + cs / 2;
      ctx.font = `${cs * 0.7}px serif`;
      ctx.fillText(powerUp.emoji, px, py);
      // Pulsing glow
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(px, py, cs * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 215, 0, 0.1)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Snake body
    snake.forEach((seg, idx) => {
      const x = seg.x * cs;
      const y = seg.y * cs;
      const isHead = idx === 0;
      const progress = idx / snake.length;

      if (isHead) {
        // Head with glow
        ctx.shadowColor = snakeSkin.glowColor;
        ctx.shadowBlur = 12;
        
        if (snakeSkin.segmentStyle === 'round') {
          ctx.beginPath();
          ctx.arc(x + cs / 2, y + cs / 2, cs / 2 - 1, 0, Math.PI * 2);
          ctx.fillStyle = snakeSkin.headColor;
          ctx.fill();
        } else if (snakeSkin.segmentStyle === 'diamond') {
          ctx.beginPath();
          ctx.moveTo(x + cs / 2, y + 1);
          ctx.lineTo(x + cs - 1, y + cs / 2);
          ctx.lineTo(x + cs / 2, y + cs - 1);
          ctx.lineTo(x + 1, y + cs / 2);
          ctx.closePath();
          ctx.fillStyle = snakeSkin.headColor;
          ctx.fill();
        } else {
          ctx.fillStyle = snakeSkin.headColor;
          ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2);
        }
        ctx.shadowBlur = 0;

        // Eyes
        const eyeSize = cs * 0.12;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x + cs * 0.35, y + cs * 0.35, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + cs * 0.65, y + cs * 0.35, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x + cs * 0.35, y + cs * 0.35, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + cs * 0.65, y + cs * 0.35, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Shield indicator
        if (hasShield) {
          ctx.strokeStyle = '#ffd700';
          ctx.lineWidth = 2;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.arc(x + cs / 2, y + cs / 2, cs / 2 + 2, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // MUZAMIL label above head
        ctx.font = `bold ${cs * 0.28}px sans-serif`;
        ctx.fillStyle = '#ffd700';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText('MUZAMIL', x + cs / 2, y - 2);
      } else {
        // Body segments with gradient
        const alpha = 1 - progress * 0.4;
        ctx.globalAlpha = alpha;
        
        if (snakeSkin.segmentStyle === 'round') {
          ctx.beginPath();
          ctx.arc(x + cs / 2, y + cs / 2, cs / 2 - 2, 0, Math.PI * 2);
          ctx.fillStyle = snakeSkin.bodyColor;
          ctx.fill();
        } else if (snakeSkin.segmentStyle === 'diamond') {
          ctx.beginPath();
          ctx.moveTo(x + cs / 2, y + 2);
          ctx.lineTo(x + cs - 2, y + cs / 2);
          ctx.lineTo(x + cs / 2, y + cs - 2);
          ctx.lineTo(x + 2, y + cs / 2);
          ctx.closePath();
          ctx.fillStyle = snakeSkin.bodyColor;
          ctx.fill();
        } else {
          ctx.fillStyle = snakeSkin.bodyColor;
          ctx.fillRect(x + 2, y + 2, cs - 4, cs - 4);
        }
        ctx.globalAlpha = 1;
      }
    });

    // Border
    ctx.strokeStyle = boardTheme.borderColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(1, 1, size - 2, size - 2);

    // Wrap-around indicators (arrows on edges)
    ctx.fillStyle = boardTheme.accentColor + '40';
    ctx.font = `${cs * 0.4}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('→', size - cs * 0.3, cs * 0.5);
    ctx.fillText('←', cs * 0.3, cs * 0.5);
    ctx.fillText('↓', cs * 0.5, size - cs * 0.3);
    ctx.fillText('↑', cs * 0.5, cs * 0.3);

  }, [snake, food, powerUp, obstacles, level, snakeSkin, boardTheme, canvasSize, hasShield]);

  // Touch/swipe handling
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const minSwipe = 30;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > minSwipe) {
        onChangeDirection(dx > 0 ? 'RIGHT' : 'LEFT');
      }
    } else {
      if (Math.abs(dy) > minSwipe) {
        onChangeDirection(dy > 0 ? 'DOWN' : 'UP');
      }
    }
    touchStartRef.current = null;
  }, [onChangeDirection]);

  const progressPercent = Math.min((score / targetScore) * 100, 100);

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-2">
      {/* HUD */}
      <div className="w-full mb-2 bg-black/40 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <div className="text-xs text-gray-400">🐍 <span className="text-yellow-300 font-bold">MUZAMIL</span></div>
            <div className="text-xs text-gray-500">{level.name}</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-yellow-400">{score}<span className="text-gray-500 text-sm">/{targetScore}</span></div>
            <div className="text-xs text-gray-400">Score</div>
          </div>
          <div className="text-right flex gap-2">
            <button
              onClick={onPause}
              className="px-3 py-1.5 bg-yellow-600/80 text-white rounded-lg text-xs font-bold hover:bg-yellow-500 transition"
            >
              {status === 'paused' ? '▶' : '⏸'}
            </button>
            <button
              onClick={onQuit}
              className="px-3 py-1.5 bg-red-600/80 text-white rounded-lg text-xs font-bold hover:bg-red-500 transition"
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-2 w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-yellow-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Active power-ups */}
        {activePowerUps.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {activePowerUps.map((p, i) => (
              <span key={i} className="px-2 py-0.5 bg-purple-900/50 border border-purple-500/50 rounded text-xs text-purple-300">
                {p.emoji} {p.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Canvas Game Board */}
      <div
        ref={containerRef}
        className="relative rounded-xl overflow-hidden shadow-2xl"
        style={{
          width: canvasSize,
          height: canvasSize,
          border: `3px solid ${boardTheme.borderColor}`,
          boxShadow: `0 0 30px ${boardTheme.borderColor}40`,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className="block"
          style={{ width: canvasSize, height: canvasSize }}
        />

        {/* Level intro overlay */}
        {showLevelIntro && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 animate-slide-up">
            <div className="text-5xl mb-3">🎯</div>
            <div className="text-2xl md:text-3xl text-yellow-400 font-black mb-2">{level.name}</div>
            <div className="text-lg text-green-300 font-bold">Target: {targetScore} 👧</div>
            <div className="text-sm text-gray-400 mt-2">
              {level.obstacles.length > 0 ? `⚠️ ${level.obstacles.length} obstacles!` : '🌟 No obstacles!'}
            </div>
            <div className="text-xs text-gray-500 mt-3">Borders wrap around! 🌀</div>
          </div>
        )}

        {/* Pause overlay */}
        {status === 'paused' && !showLevelIntro && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
            <div className="text-4xl mb-3">⏸</div>
            <div className="text-2xl text-white font-bold mb-2">PAUSED</div>
            <div className="text-sm text-gray-400 mb-4">Press SPACE to resume</div>
            <button
              onClick={onPause}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500 transition"
            >
              ▶ Resume
            </button>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="mt-4 md:hidden">
        <div className="grid grid-cols-3 gap-2 w-44 mx-auto">
          <div />
          <button
            onTouchStart={(e) => { e.preventDefault(); onChangeDirection('UP'); }}
            className="p-4 bg-gray-700/80 rounded-xl text-white text-2xl active:bg-gray-600 border border-gray-600"
          >
            ↑
          </button>
          <div />
          <button
            onTouchStart={(e) => { e.preventDefault(); onChangeDirection('LEFT'); }}
            className="p-4 bg-gray-700/80 rounded-xl text-white text-2xl active:bg-gray-600 border border-gray-600"
          >
            ←
          </button>
          <button
            onTouchStart={(e) => { e.preventDefault(); onChangeDirection('DOWN'); }}
            className="p-4 bg-gray-700/80 rounded-xl text-white text-2xl active:bg-gray-600 border border-gray-600"
          >
            ↓
          </button>
          <button
            onTouchStart={(e) => { e.preventDefault(); onChangeDirection('RIGHT'); }}
            className="p-4 bg-gray-700/80 rounded-xl text-white text-2xl active:bg-gray-600 border border-gray-600"
          >
            →
          </button>
        </div>
        <p className="text-center text-xs text-gray-500 mt-2">Swipe on board or use buttons</p>
      </div>

      {/* Desktop controls hint */}
      <div className="hidden md:block mt-3 text-center text-xs text-gray-500">
        <p>Arrow Keys / WASD to move • SPACE to pause • Borders wrap around!</p>
      </div>
    </div>
  );
};

export default GameBoard;
