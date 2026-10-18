export interface Position {
  x: number;
  y: number;
}

export interface PowerUp {
  pos: Position;
  type: 'speed' | 'slow' | 'golden' | 'shield';
  emoji: string;
  points: number;
  duration?: number;
}

export interface SnakeSkin {
  id: string;
  name: string;
  emoji: string;
  bodyColor: string;
  headColor: string;
  glowColor: string;
  segmentStyle: 'round' | 'square' | 'diamond';
  description: string;
  unlockLevels: number;
}

export interface BoardTheme {
  id: string;
  name: string;
  emoji: string;
  bgGradient: string;
  gridColor: string;
  borderColor: string;
  accentColor: string;
  unlockLevels: number;
}

export interface LevelConfig {
  id: number;
  name: string;
  gridSize: number;
  baseSpeed: number;
  targetScore: number;
  obstacles: Position[];
  powerUpChance: number;
  boardThemeId: string;
  completionMessage: string;
}

export const SNAKE_SKINS: SnakeSkin[] = [
  { id: 'classic', name: 'Classic Green', emoji: '🐍', bodyColor: '#22c55e', headColor: '#4ade80', glowColor: '#22c55e80', segmentStyle: 'round', description: 'The original snake', unlockLevels: 0 },
  { id: 'neon', name: 'Neon Electric', emoji: '⚡', bodyColor: '#06b6d4', headColor: '#22d3ee', glowColor: '#06b6d480', segmentStyle: 'round', description: 'Electric blue neon glow', unlockLevels: 3 },
  { id: 'fire', name: 'Fire Snake', emoji: '🔥', bodyColor: '#ef4444', headColor: '#f97316', glowColor: '#ef444480', segmentStyle: 'diamond', description: 'Blazing fire serpent', unlockLevels: 6 },
  { id: 'ice', name: 'Ice Snake', emoji: '❄️', bodyColor: '#3b82f6', headColor: '#93c5fd', glowColor: '#3b82f680', segmentStyle: 'round', description: 'Frozen ice serpent', unlockLevels: 9 },
  { id: 'golden', name: 'Golden Snake', emoji: '👑', bodyColor: '#eab308', headColor: '#fde047', glowColor: '#eab30880', segmentStyle: 'diamond', description: 'Royal golden snake', unlockLevels: 12 },
  { id: 'rainbow', name: 'Rainbow Snake', emoji: '🌈', bodyColor: '#a855f7', headColor: '#e879f9', glowColor: '#a855f780', segmentStyle: 'round', description: 'Colorful rainbow serpent', unlockLevels: 16 },
  { id: 'shadow', name: 'Shadow Snake', emoji: '👻', bodyColor: '#6366f1', headColor: '#818cf8', glowColor: '#6366f180', segmentStyle: 'square', description: 'Dark shadow serpent', unlockLevels: 20 },
  { id: 'cyber', name: 'Cyber Snake', emoji: '🤖', bodyColor: '#14b8a6', headColor: '#2dd4bf', glowColor: '#14b8a680', segmentStyle: 'square', description: 'Digital cyber snake', unlockLevels: 25 },
  { id: 'nature', name: 'Nature Snake', emoji: '🌿', bodyColor: '#16a34a', headColor: '#86efac', glowColor: '#16a34a80', segmentStyle: 'round', description: 'Forest nature snake', unlockLevels: 30 },
  { id: 'royal', name: 'Royal Snake', emoji: '💎', bodyColor: '#7c3aed', headColor: '#c084fc', glowColor: '#7c3aed80', segmentStyle: 'diamond', description: 'MUZAMIL\'s Royal Snake', unlockLevels: 35 },
];

export const BOARD_THEMES: BoardTheme[] = [
  { id: 'classic', name: 'Classic Green', emoji: '🟩', bgGradient: 'linear-gradient(135deg, #0a1628 0%, #0d2137 100%)', gridColor: '#1a3a2a', borderColor: '#22c55e', accentColor: '#22c55e', unlockLevels: 0 },
  { id: 'wooden', name: 'Wooden Board', emoji: '🪵', bgGradient: 'linear-gradient(135deg, #3e2723 0%, #5d4037 100%)', gridColor: '#4e342e', borderColor: '#8d6e63', accentColor: '#d7ccc8', unlockLevels: 3 },
  { id: 'neon', name: 'Neon Cyber', emoji: '💜', bgGradient: 'linear-gradient(135deg, #0a0020 0%, #1a0040 100%)', gridColor: '#1a0040', borderColor: '#a855f7', accentColor: '#c084fc', unlockLevels: 6 },
  { id: 'arcade', name: 'Dark Arcade', emoji: '🕹️', bgGradient: 'linear-gradient(135deg, #111111 0%, #1a1a2e 100%)', gridColor: '#222244', borderColor: '#e94560', accentColor: '#e94560', unlockLevels: 10 },
  { id: 'garden', name: 'Nature Garden', emoji: '🌸', bgGradient: 'linear-gradient(135deg, #0a2e1a 0%, #1a4a2e 100%)', gridColor: '#1a3a2a', borderColor: '#4ade80', accentColor: '#86efac', unlockLevels: 14 },
  { id: 'ice', name: 'Ice World', emoji: '🧊', bgGradient: 'linear-gradient(135deg, #0a1a3e 0%, #1a3a5e 100%)', gridColor: '#1a2a4e', borderColor: '#60a5fa', accentColor: '#93c5fd', unlockLevels: 18 },
  { id: 'fire', name: 'Fire Arena', emoji: '🔥', bgGradient: 'linear-gradient(135deg, #2e0a0a 0%, #4a1a0a 100%)', gridColor: '#3a1a0a', borderColor: '#f97316', accentColor: '#fb923c', unlockLevels: 22 },
  { id: 'royal', name: 'Royal Gold', emoji: '👑', bgGradient: 'linear-gradient(135deg, #1a1a0a 0%, #2e2a0a 100%)', gridColor: '#2a2a1a', borderColor: '#eab308', accentColor: '#fde047', unlockLevels: 28 },
  { id: 'space', name: 'Space', emoji: '🌌', bgGradient: 'linear-gradient(135deg, #000011 0%, #0a0a2e 100%)', gridColor: '#0a0a3e', borderColor: '#6366f1', accentColor: '#818cf8', unlockLevels: 33 },
  { id: 'celebration', name: 'Celebration', emoji: '🎉', bgGradient: 'linear-gradient(135deg, #1a0a2e 0%, #2e0a3e 100%)', gridColor: '#2a1a3e', borderColor: '#ec4899', accentColor: '#f472b6', unlockLevels: 38 },
];

function generateObstacles(level: number, gridSize: number): Position[] {
  const obstacles: Position[] = [];
  if (level < 4) return obstacles;
  
  const seed = level * 7;
  const count = Math.min(Math.floor(level / 3) + 2, 30);
  
  for (let i = 0; i < count; i++) {
    const hash = (seed + i * 13 + i * i * 3) % 997;
    const x = (hash * 7 + i * 11) % gridSize;
    const y = (hash * 11 + i * 7) % gridSize;
    // Don't place obstacles in the center area where snake starts
    if (Math.abs(x - gridSize / 2) < 3 && Math.abs(y - gridSize / 2) < 3) continue;
    obstacles.push({ x, y });
  }
  
  // Add structured patterns for certain levels
  if (level >= 8 && level < 12) {
    // Horizontal wall
    for (let i = 4; i < gridSize - 4; i++) {
      if (Math.abs(i - gridSize / 2) > 2) {
        obstacles.push({ x: i, y: Math.floor(gridSize / 3) });
      }
    }
  }
  if (level >= 12 && level < 16) {
    // Box pattern
    const s = Math.floor(gridSize / 4);
    for (let i = s; i < gridSize - s; i++) {
      obstacles.push({ x: i, y: s });
      obstacles.push({ x: i, y: gridSize - s - 1 });
    }
  }
  if (level >= 20 && level < 25) {
    // Cross pattern
    const mid = Math.floor(gridSize / 2);
    for (let i = 3; i < gridSize - 3; i++) {
      if (Math.abs(i - mid) > 2) {
        obstacles.push({ x: mid, y: i });
        obstacles.push({ x: i, y: mid });
      }
    }
  }
  if (level >= 30 && level < 35) {
    // Spiral hint
    for (let i = 3; i < gridSize - 3; i++) {
      obstacles.push({ x: i, y: 3 });
      obstacles.push({ x: gridSize - 4, y: i });
    }
  }
  if (level >= 38) {
    // Dense maze
    for (let i = 2; i < gridSize - 2; i += 4) {
      for (let j = 2; j < gridSize - 2; j++) {
        if (Math.abs(i - gridSize / 2) > 3 && Math.abs(j - gridSize / 2) > 3) {
          obstacles.push({ x: i, y: j });
        }
      }
    }
  }
  
  return obstacles;
}

function getBoardThemeId(level: number): string {
  if (level <= 3) return 'classic';
  if (level <= 7) return 'wooden';
  if (level <= 11) return 'neon';
  if (level <= 15) return 'arcade';
  if (level <= 19) return 'garden';
  if (level <= 23) return 'ice';
  if (level <= 27) return 'fire';
  if (level <= 31) return 'royal';
  if (level <= 36) return 'space';
  return 'celebration';
}

const completionMessages = [
  "Mahira, great start! 🌟",
  "You're getting better, Mahira! 💪",
  "Mahira, amazing skills! 🎯",
  "Keep going, Mahira! 🚀",
  "Mahira, you're on fire! 🔥",
  "Incredible, Mahira! ⭐",
  "Mahira, unstoppable! 💫",
  "Mahira, what a player! 🏅",
  "Mahira, legendary moves! 👑",
  "Mahira, half way there! 🎉",
  "Mahira, champion material! 🏆",
  "MUZAMIL is proud of you, Mahira! 💖",
];

export const LEVELS: LevelConfig[] = [
  // Default game (id: 0)
  { id: 0, name: 'Default Game', gridSize: 20, baseSpeed: 180, targetScore: 10, obstacles: [], powerUpChance: 0.15, boardThemeId: 'classic', completionMessage: 'Default game complete! 🎮' },
];

// Generate 41 levels
for (let i = 1; i <= 41; i++) {
  const gridSize = 20;
  const baseSpeed = Math.max(80, 200 - i * 2.8);
  const targetScore = Math.min(5 + Math.floor(i * 0.8), 25);
  const obstacles = generateObstacles(i, gridSize);
  const powerUpChance = Math.min(0.05 + i * 0.008, 0.3);
  const boardThemeId = getBoardThemeId(i);
  const msgIdx = Math.min(Math.floor((i - 1) / 4), completionMessages.length - 1);
  
  LEVELS.push({
    id: i,
    name: i === 41 ? 'Level 41 — ULTIMATE' : `Level ${i}`,
    gridSize,
    baseSpeed,
    targetScore,
    obstacles,
    powerUpChance,
    boardThemeId,
    completionMessage: completionMessages[msgIdx],
  });
}

export const POWER_UP_TYPES: { type: PowerUp['type']; emoji: string; points: number; duration: number; label: string }[] = [
  { type: 'speed', emoji: '⚡', points: 2, duration: 5000, label: 'Speed Boost!' },
  { type: 'slow', emoji: '🐌', points: 1, duration: 5000, label: 'Slow Motion!' },
  { type: 'golden', emoji: '💰', points: 5, duration: 0, label: 'Golden Food!' },
  { type: 'shield', emoji: '🛡️', points: 1, duration: 8000, label: 'Shield Active!' },
];
