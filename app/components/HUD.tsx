'use client';

import { Player } from '@/lib/models/player';
import { xpProgressToNextLevel } from '@/lib/utils/leveling';

interface HUDProps {
  player: Player;
}

export default function HUD({ player }: HUDProps) {
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

        {/* Cases Solved */}
        <div className="flex items-center justify-between border-t-2 border-gray-400 pt-3">
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
