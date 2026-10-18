import React, { useState } from 'react';
import { LEVELS, SNAKE_SKINS, BOARD_THEMES, LevelConfig } from '../gameData';

interface LevelSelectProps {
  completedLevels: number[];
  highScores: Record<number, number>;
  onSelectLevel: (level: LevelConfig) => void;
  onBack: () => void;
  isLevelUnlocked: (id: number) => boolean;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  completedLevels,
  highScores,
  onSelectLevel,
  onBack,
  isLevelUnlocked,
}) => {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-yellow-400">📋 Select Level</h2>
          <button onClick={onBack} className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-500 transition font-bold">
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 gap-2">
          {LEVELS.map((level) => {
            const isCompleted = completedLevels.includes(level.id);
            const unlocked = isLevelUnlocked(level.id);
            const hs = highScores[level.id];

            return (
              <button
                key={level.id}
                onClick={() => unlocked && onSelectLevel(level)}
                disabled={!unlocked}
                className={`p-2 md:p-3 rounded-xl border-2 transition-all text-center ${
                  !unlocked
                    ? 'border-gray-700 bg-gray-900/50 opacity-40 cursor-not-allowed'
                    : isCompleted
                    ? 'border-green-500 bg-green-900/30 hover:scale-105 hover:border-green-400'
                    : 'border-gray-600 bg-gray-800/50 hover:scale-105 hover:border-yellow-500'
                }`}
              >
                <div className="text-xl md:text-2xl mb-1">
                  {!unlocked ? '🔒' : isCompleted ? '✅' : level.id === 0 ? '🎮' : '🎯'}
                </div>
                <div className="text-xs font-bold text-gray-300 truncate">
                  {level.id === 0 ? 'Default' : `Lvl ${level.id}`}
                </div>
                {hs && <div className="text-xs text-yellow-400 mt-0.5">⭐{hs}</div>}
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-center text-sm text-gray-400">
          <p>Complete each level to unlock the next one!</p>
          <p className="text-xs mt-1">Borders wrap around in all levels 🌀</p>
        </div>
      </div>
    </div>
  );
};

interface SnakeSelectProps {
  selectedSnakeId: string;
  completedLevels: number;
  onSelect: (id: string) => void;
  onBack: () => void;
}

export const SnakeSelect: React.FC<SnakeSelectProps> = ({
  selectedSnakeId,
  completedLevels,
  onSelect,
  onBack,
}) => {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-yellow-400">🐍 Choose Your Snake</h2>
          <button onClick={onBack} className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-500 transition font-bold">
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {SNAKE_SKINS.map((skin) => {
            const isUnlocked = completedLevels >= skin.unlockLevels;
            const isSelected = selectedSnakeId === skin.id;

            return (
              <button
                key={skin.id}
                onClick={() => isUnlocked && onSelect(skin.id)}
                disabled={!isUnlocked}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-yellow-400 bg-yellow-900/20 scale-[1.02] shadow-lg shadow-yellow-500/20'
                    : isUnlocked
                    ? 'border-gray-600 bg-gray-800/50 hover:border-green-500 hover:scale-[1.02]'
                    : 'border-gray-700 bg-gray-900/50 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{skin.emoji}</div>
                  <div>
                    <div className="font-bold" style={{ color: skin.headColor }}>
                      {skin.name}
                    </div>
                    <div className="text-xs text-gray-400">{skin.description}</div>
                  </div>
                </div>
                {!isUnlocked && (
                  <div className="text-xs text-red-400 mt-2">🔒 Complete {skin.unlockLevels} levels to unlock</div>
                )}
                {isSelected && (
                  <div className="text-xs text-yellow-400 mt-2 font-bold">✓ Currently Selected</div>
                )}
                {/* Preview */}
                {isUnlocked && (
                  <div className="flex gap-0.5 mt-2">
                    {[0, 1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="rounded-full"
                        style={{
                          width: 12 - i,
                          height: 12 - i,
                          backgroundColor: i === 0 ? skin.headColor : skin.bodyColor,
                          opacity: 1 - i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface BoardSelectProps {
  selectedBoardId: string;
  completedLevels: number;
  onSelect: (id: string) => void;
  onBack: () => void;
}

export const BoardSelect: React.FC<BoardSelectProps> = ({
  selectedBoardId,
  completedLevels,
  onSelect,
  onBack,
}) => {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-yellow-400">🎨 Choose Board Theme</h2>
          <button onClick={onBack} className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-500 transition font-bold">
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BOARD_THEMES.map((board) => {
            const isUnlocked = completedLevels >= board.unlockLevels;
            const isSelected = selectedBoardId === board.id;

            return (
              <button
                key={board.id}
                onClick={() => isUnlocked && onSelect(board.id)}
                disabled={!isUnlocked}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-yellow-400 scale-[1.02] shadow-lg'
                    : isUnlocked
                    ? 'border-gray-600 hover:border-green-500 hover:scale-[1.02]'
                    : 'border-gray-700 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-lg border-2 flex items-center justify-center text-2xl"
                    style={{
                      background: board.bgGradient,
                      borderColor: board.borderColor,
                    }}
                  >
                    {board.emoji}
                  </div>
                  <div className="text-left">
                    <div className="font-bold" style={{ color: board.accentColor }}>
                      {board.name}
                    </div>
                    {!isUnlocked && (
                      <div className="text-xs text-red-400 mt-1">🔒 Complete {board.unlockLevels} levels</div>
                    )}
                    {isSelected && (
                      <div className="text-xs text-yellow-400 mt-1 font-bold">✓ Selected</div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface SettingsProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetProgress: () => void;
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  soundEnabled,
  onToggleSound,
  onResetProgress,
  onBack,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-900/80 rounded-2xl p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-yellow-400">⚙️ Settings</h2>
          <button onClick={onBack} className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-500 transition font-bold">
            ← Back
          </button>
        </div>

        <div className="space-y-4">
          {/* Sound toggle */}
          <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
            <span className="text-gray-300 font-medium">🔊 Sound Effects</span>
            <button
              onClick={onToggleSound}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                soundEnabled ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-400'
              }`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Reset progress */}
          <div className="p-3 bg-gray-800/50 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 font-medium">🗑️ Reset All Progress</span>
              {!showConfirm ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-500 transition font-bold text-sm"
                >
                  Reset
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => { onResetProgress(); setShowConfirm(false); }}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg font-bold text-sm"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-3 py-2 bg-gray-600 text-white rounded-lg font-bold text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            {showConfirm && (
              <p className="text-xs text-red-400 mt-2">This will erase all progress, scores, and unlocks!</p>
            )}
          </div>

          {/* Info */}
          <div className="p-3 bg-gray-800/50 rounded-xl text-center">
            <p className="text-sm text-gray-400">Mahira Mansha Snake Crash</p>
            <p className="text-xs text-gray-500 mt-1">MUZAMIL BHAIYA Edition</p>
            <p className="text-xs text-gray-500 mt-1">41 Levels + Default Game</p>
          </div>
        </div>
      </div>
    </div>
  );
};
