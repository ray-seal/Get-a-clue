// Leveling and XP utilities

// Calculate level from XP using formula: level = floor(sqrt(xp/100)) + 1
export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

// Calculate XP needed for next level
export function xpForNextLevel(currentLevel: number): number {
  // From formula: level = floor(sqrt(xp/100)) + 1
  // Solving for xp: xp = ((level - 1) ^ 2) * 100
  return Math.pow(currentLevel, 2) * 100;
}

// Calculate XP progress to next level
export function xpProgressToNextLevel(xp: number): {
  current: number;
  needed: number;
  percentage: number;
} {
  const level = calculateLevel(xp);
  const nextLevelXP = xpForNextLevel(level);
  const currentLevelXP = xpForNextLevel(level - 1);
  const needed = nextLevelXP - currentLevelXP;
  const current = xp - currentLevelXP;
  const percentage = (current / needed) * 100;

  return {
    current,
    needed,
    percentage,
  };
}

// XP awarded for solving a case
export const XP_PER_CASE = 50;
