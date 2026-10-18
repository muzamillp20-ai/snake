import React from 'react';

interface HomeScreenProps {
  onStart: () => void;
  onLevelSelect: () => void;
  onSnakeSelect: () => void;
  onBoardSelect: () => void;
  onSettings: () => void;
  completedLevels: number;
  totalLevels: number;
  selectedSnakeName: string;
  selectedSnakeEmoji: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onStart,
  onLevelSelect,
  onSnakeSelect,
  onBoardSelect,
  onSettings,
  completedLevels,
  totalLevels,
  selectedSnakeName,
  selectedSnakeEmoji,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-float"
            style={{
              width: `${10 + Math.random() * 30}px`,
              height: `${10 + Math.random() * 30}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#22c55e', '#eab308', '#a855f7', '#ef4444', '#06b6d4'][i % 5],
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-lg w-full">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500 mb-2 leading-tight">
            MAHIRA MANSHA
          </h1>
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500">
            SNAKE CRASH
          </h2>
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-2xl">🐍</span>
            <span className="text-xl md:text-2xl font-bold text-yellow-300 tracking-wider">
              MUZAMIL BHAIYA
            </span>
            <span className="text-2xl">🐍</span>
          </div>
        </div>

        {/* Welcome message */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-yellow-500/30">
          <p className="text-lg text-yellow-200 font-semibold">
            ✨ Mahira, this challenge is made for you! ✨
          </p>
          <p className="text-sm text-gray-300 mt-2">
            Guide MUZAMIL the snake to eat MAHIRA 👧 and grow bigger!
            <br />Don't touch yourself or the walls will wrap around!
          </p>
        </div>

        {/* Progress */}
        <div className="bg-black/20 rounded-xl p-3 mb-6 border border-green-500/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm text-green-400 font-bold">{completedLevels}/{totalLevels} levels</span>
          </div>
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-yellow-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedLevels / totalLevels) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-sm text-gray-400">Snake:</span>
            <span className="text-sm text-cyan-300 font-bold">{selectedSnakeEmoji} {selectedSnakeName}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onStart}
            className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-bold rounded-xl shadow-lg shadow-green-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all animate-pulse-glow"
          >
            🎮 Play Default Game
          </button>
          
          <button
            onClick={onLevelSelect}
            className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xl font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            📋 Select Level (41 Levels!)
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onSnakeSelect}
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-base font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              🐍 Snakes
            </button>
            <button
              onClick={onBoardSelect}
              className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white text-base font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              🎨 Boards
            </button>
          </div>

          <button
            onClick={onSettings}
            className="w-full px-6 py-3 bg-gray-700/50 text-gray-300 text-base font-bold rounded-xl border border-gray-600 hover:bg-gray-600/50 transition-all"
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-xs text-gray-500">
          <p>Arrow Keys / WASD to move • SPACE to pause</p>
          <p className="mt-1">Borders wrap around — snake passes through!</p>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
