'use client';

import { Player } from '@/lib/models/player';
import { xpProgressToNextLevel } from '@/lib/utils/leveling';

interface HUDProps {
  player: Player;
  onRollDice?: () => void;
  canRollDice?: boolean;
}

export default function HUD({ player, onRollDice, canRollDice = true }: HUDProps) {
  const progress = xpProgressToNextLevel(player.xp);

  return (
    <div className="bg-[#f5f1e8] p-4 rounded-sm worn-edges">
      <div className="space-y-3">
        {/* Player Name */}
        <div>
          <h3 className="text-xl font-bold typewriter text-gray-800 stamped-text">
            {player.name}
          </h3>
        </div>

        {/* Level */}
        <div className="flex items-center justify-between">
          <span className="typewriter text-gray-700 font-semibold">Level:</span>
          <span className="typewriter text-2xl font-bold text-blue-600">
            {player.level}
          </span>
        </div>

        {/* XP Progress Bar */}
        <div>
          <div className="flex justify-between text-xs typewriter text-gray-600 mb-1">
            <span>XP</span>
            <span>{Math.floor(progress.current)} / {progress.needed}</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(progress.percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Movement Points (if using dice) */}
        {onRollDice && (
          <div className="border-t-2 border-gray-400 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="typewriter text-gray-700 font-semibold">Movement:</span>
              <span className="typewriter text-xl font-bold text-purple-600">
                {player.movementPointsRemaining} steps
              </span>
            </div>
            <button
              onClick={onRollDice}
              disabled={!canRollDice}
              className={`w-full py-2 px-4 rounded typewriter text-sm font-bold ${
                canRollDice
                  ? 'bg-purple-700 hover:bg-purple-800 text-white'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              🎲 Roll Dice
            </button>
          </div>
        )}

        {/* Clues Found */}
        <div className="flex items-center justify-between border-t-2 border-gray-400 pt-3">
          <span className="typewriter text-gray-700 font-semibold">Clues Found:</span>
          <span className="typewriter text-2xl font-bold text-amber-600">
            {player.inventory?.length || 0}
          </span>
        </div>

        {/* Cases Solved */}
        <div className="flex items-center justify-between">
          <span className="typewriter text-gray-700 font-semibold">Cases Solved:</span>
          <span className="typewriter text-2xl font-bold text-green-600">
            {player.casesSolved}
          </span>
        </div>

        {/* Total XP */}
        <div className="flex items-center justify-between text-sm">
          <span className="typewriter text-gray-600">Total XP:</span>
          <span className="typewriter font-bold text-gray-700">
            {player.xp}
          </span>
        </div>
      </div>
    </div>
  );
}
