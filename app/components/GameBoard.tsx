'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { GameGrid, GridRoom } from '@/lib/models/grid';
import { Player } from '@/lib/models/player';

interface GameBoardProps {
  grid: GameGrid;
  players: Player[];
  currentPlayerId: string;
  onTileClick: (row: number, col: number) => void;
  tileSize?: number;
}

export default function GameBoard({
  grid,
  players,
  currentPlayerId,
  onTileClick,
  tileSize = 64,
}: GameBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentPlayer = players.find(p => p.id === currentPlayerId);
      if (!currentPlayer) return;

      let newRow = currentPlayer.row;
      let newCol = currentPlayer.col;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          newRow = Math.max(0, currentPlayer.row - 1);
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          newRow = Math.min(grid.height - 1, currentPlayer.row + 1);
          e.preventDefault();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          newCol = Math.max(0, currentPlayer.col - 1);
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          newCol = Math.min(grid.width - 1, currentPlayer.col + 1);
          e.preventDefault();
          break;
        default:
          return;
      }

      if (newRow !== currentPlayer.row || newCol !== currentPlayer.col) {
        onTileClick(newRow, newCol);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [players, currentPlayerId, grid, onTileClick]);

  const currentPlayer = players.find(p => p.id === currentPlayerId);

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-yellow-50 border-l-4 border-yellow-600 p-3">
        <p className="typewriter text-sm text-gray-800">
          Click an adjacent tile or use arrow keys (WASD) to move
        </p>
      </div>

      {/* Game Board */}
      <div 
        ref={boardRef}
        className="bg-gray-800 p-4 rounded-lg overflow-auto max-h-[600px]"
        style={{ 
          maxWidth: '100%',
        }}
      >
        <div
          className="inline-block"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${grid.width}, ${tileSize}px)`,
            gridTemplateRows: `repeat(${grid.height}, ${tileSize}px)`,
            gap: '2px',
          }}
        >
          {grid.rooms.map((row, rowIndex) =>
            row.map((room, colIndex) => {
              const playersOnTile = players.filter(
                p => p.row === rowIndex && p.col === colIndex
              );
              const isCurrentPlayerTile = currentPlayer?.row === rowIndex && currentPlayer?.col === colIndex;
              const isAdjacentToPlayer = currentPlayer 
                ? Math.abs(currentPlayer.row - rowIndex) + Math.abs(currentPlayer.col - colIndex) === 1
                : false;

              return (
                <Tile
                  key={`${rowIndex}-${colIndex}`}
                  room={room}
                  players={playersOnTile}
                  isCurrentPlayer={isCurrentPlayerTile}
                  isAdjacent={isAdjacentToPlayer}
                  onClick={() => onTileClick(rowIndex, colIndex)}
                  tileSize={tileSize}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-[#f5f1e8] p-3 rounded-sm worn-edges">
        <div className="grid grid-cols-2 gap-2 text-sm typewriter">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span>Your position</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span>Adjacent (can move)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TileProps {
  room: GridRoom;
  players: Player[];
  isCurrentPlayer: boolean;
  isAdjacent: boolean;
  onClick: () => void;
  tileSize: number;
}

function Tile({ room, players, isCurrentPlayer, isAdjacent, onClick, tileSize }: TileProps) {
  const bgColor = isCurrentPlayer
    ? 'bg-blue-600'
    : isAdjacent
    ? 'bg-green-600'
    : 'bg-gray-600';

  return (
    <div
      className={`${bgColor} border border-gray-400 relative cursor-pointer hover:brightness-110 transition-all`}
      style={{ width: tileSize, height: tileSize }}
      onClick={onClick}
      title={room.name}
    >
      {/* Wall indicators */}
      {!room.exits.north && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-900"></div>
      )}
      {!room.exits.south && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900"></div>
      )}
      {!room.exits.west && (
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-gray-900"></div>
      )}
      {!room.exits.east && (
        <div className="absolute top-0 right-0 bottom-0 w-1 bg-gray-900"></div>
      )}

      {/* Players on this tile */}
      {players.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {players.map((player, index) => (
              <div
                key={player.id}
                className="absolute transition-all duration-300"
                style={{
                  transform: `translate(${index * 4}px, ${index * 4}px)`,
                  zIndex: index,
                }}
              >
                <Image
                  src={`/assets/characters/${player.spriteId}.svg`}
                  alt={player.name}
                  width={tileSize * 0.7}
                  height={tileSize * 0.7}
                  className="drop-shadow-lg"
                  title={player.name}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
