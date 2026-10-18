import React from 'react';
import { LevelConfig } from '../gameData';

interface GameOverScreenProps {
  level: LevelConfig;
  score: number;
  snakeName: string;
  onRetry: () => void;
  onMenu: () => void;
  onLevelSelect: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  level,
  score,
  snakeName,
  onRetry,
  onMenu,
  onLevelSelect,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/50 via-gray-900 to-red-900/50" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            💀
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center max-w-md w-full">
        <div className="text-7xl mb-4 animate-shake">💀</div>
        <h1 className="text-4xl md:text-5xl font-black text-red-500 mb-3">GAME OVER!</h1>
        <p className="text-xl text-gray-300 mb-1">
          <span className="text-yellow-300 font-bold">MUZAMIL</span> crashed!
        </p>
        <p className="text-lg text-gray-400 mb-2">
          {level.name}
        </p>
        <div className="bg-black/30 rounded-xl p-4 mb-6 border border-red-500/30">
          <div className="text-2xl font-bold text-yellow-400 mb-1">Score: {score}</div>
          <div className="text-sm text-gray-400">Target was: {level.targetScore}</div>
          <div className="text-sm text-gray-400">Snake: {snakeName}</div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            🔄 Try Again
          </button>
          <button
            onClick={onLevelSelect}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-lg font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            📋 Choose Another Level
          </button>
          <button
            onClick={onMenu}
            className="w-full px-6 py-3 bg-gray-700/50 text-gray-300 text-lg font-bold rounded-xl border border-gray-600 hover:bg-gray-600/50 transition-all"
          >
            🏠 Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

interface LevelCompleteScreenProps {
  level: LevelConfig;
  score: number;
  snakeName: string;
  completionMessage: string;
  isFinalLevel: boolean;
  onNextLevel: () => void;
  onRetry: () => void;
  onMenu: () => void;
  hasNextLevel: boolean;
}

export const LevelCompleteScreen: React.FC<LevelCompleteScreenProps> = ({
  level,
  score,
  snakeName,
  completionMessage,
  isFinalLevel,
  onNextLevel,
  onRetry,
  onMenu,
  hasNextLevel,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/40 via-green-900/40 to-purple-900/40" />
      
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${40 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1.5 + Math.random() * 2}s`,
              fontSize: `${16 + Math.random() * 24}px`,
            }}
          >
            {['🎉', '⭐', '🏆', '✨', '🎊', '💫', '🌟', '🎈'][Math.floor(Math.random() * 8)]}
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center max-w-md w-full">
        <div className="text-6xl mb-4 animate-float">🏆</div>
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-400 mb-2">
          LEVEL COMPLETE!
        </h1>
        <p className="text-xl text-yellow-300 font-bold mb-1">
          {level.name}
        </p>
        <p className="text-lg text-green-300 mb-4">
          {completionMessage}
        </p>

        <div className="bg-black/30 rounded-xl p-4 mb-6 border border-yellow-500/30">
          <div className="text-2xl font-bold text-yellow-400 mb-1">Score: {score}</div>
          <div className="text-sm text-gray-400">Snake: {snakeName}</div>
        </div>

        <div className="space-y-3">
          {hasNextLevel && !isFinalLevel && (
            <button
              onClick={onNextLevel}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-bold rounded-xl shadow-lg shadow-green-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all animate-pulse-glow"
            >
              ▶ Next Level
            </button>
          )}
          <button
            onClick={onRetry}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-lg font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            🔄 Play Again
          </button>
          <button
            onClick={onMenu}
            className="w-full px-6 py-3 bg-gray-700/50 text-gray-300 text-lg font-bold rounded-xl border border-gray-600 hover:bg-gray-600/50 transition-all"
          >
            🏠 Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

interface VictoryScreenProps {
  totalScore: number;
  onPlayAgain: () => void;
  onMenu: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  totalScore,
  onPlayAgain,
  onMenu,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Epic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/60 via-purple-900/60 to-green-900/60" />
      
      {/* Massive confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${30 + Math.random() * 70}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              fontSize: `${20 + Math.random() * 30}px`,
            }}
          >
            {['🎉', '⭐', '🏆', '✨', '🎊', '💫', '🌟', '🎈', '👑', '💎', '🔥', '💖'][Math.floor(Math.random() * 12)]}
          </div>
        ))}
      </div>

      {/* Glowing rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 rounded-full border-4 border-yellow-400/30 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute w-48 h-48 rounded-full border-4 border-green-400/30 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute w-32 h-32 rounded-full border-4 border-purple-400/30 animate-ping" style={{ animationDuration: '1.5s' }} />
      </div>

      <div className="relative z-10 text-center max-w-lg w-full">
        {/* Winner badge */}
        <div className="inline-block mb-4">
          <div className="relative">
            <div className="text-8xl animate-float">🏆</div>
            <div className="absolute -top-2 -right-2 text-3xl animate-pulse">⭐</div>
            <div className="absolute -bottom-1 -left-2 text-3xl animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</div>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-400 to-purple-400 mb-3 leading-tight">
          MAHIRA, WINNER!
        </h1>
        <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-400 mb-4">
          PROUD OF YOU! 🏆
        </h2>
        <p className="text-xl text-yellow-300 font-bold mb-2">
          BHAIYAA PROUD OF YOU! 💖
        </p>
        <p className="text-lg text-gray-300 mb-2">
          All 41 levels completed!
        </p>
        <p className="text-base text-gray-400 mb-6">
          <span className="text-yellow-300 font-bold">MUZAMIL</span> the snake is the ultimate champion!
        </p>

        <div className="bg-black/40 rounded-2xl p-6 mb-6 border-2 border-yellow-500/50 shadow-lg shadow-yellow-500/20">
          <div className="text-3xl font-black text-yellow-400 mb-2">🌟 ULTIMATE CHAMPION 🌟</div>
          <div className="text-lg text-green-300">Mahira Mansha has conquered all challenges!</div>
          <div className="text-sm text-gray-400 mt-2">Total Score: {totalScore}</div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-xl font-bold rounded-xl shadow-lg shadow-yellow-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all animate-pulse-glow"
          >
            🔄 Play All Levels Again
          </button>
          <button
            onClick={onMenu}
            className="w-full px-6 py-3 bg-gray-700/50 text-gray-300 text-lg font-bold rounded-xl border border-gray-600 hover:bg-gray-600/50 transition-all"
          >
            🏠 Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};
