'use client';

import { useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { GameGrid, GridRoom } from '@/lib/models/grid';
import { Player } from '@/lib/models/player';
import { ROOM_BOUNDS, MAP_IMAGE } from '@/lib/data/room-bounds';
import { createCellToRoomMap, getRoomAtCell, getReachableCells, calculateGridDimensions } from '@/lib/models/room-mapping';

interface GameBoardProps {
  grid: GameGrid;
  players: Player[];
  currentPlayerId: string;
  onTileClick: (row: number, col: number) => void;
  onSearchRoom?: (roomId: string) => void;
  tileSize?: number;
  showMovementOverlay?: boolean;
}

export default function GameBoard({
  grid,
  players,
  currentPlayerId,
  onTileClick,
  onSearchRoom,
  tileSize = 64,
  showMovementOverlay = true,
}: GameBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  
  // Create cell-to-room mapping
  const cellToRoomMap = useMemo(() => createCellToRoomMap(ROOM_BOUNDS, tileSize), [tileSize]);
  
  // Calculate board dimensions based on image
  const boardDimensions = useMemo(() => 
    calculateGridDimensions(MAP_IMAGE.width, MAP_IMAGE.height, tileSize),
    [tileSize]
  );
  
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  
  // Get current room for the player
  const currentRoomId = currentPlayer ? getRoomAtCell(currentPlayer.row, currentPlayer.col, cellToRoomMap) : null;
  
  // Get reachable cells based on movement points
  const reachableCells = useMemo(() => {
    if (!currentPlayer || !showMovementOverlay || currentPlayer.movementPointsRemaining <= 0) {
      return [];
    }
    return getReachableCells(
      currentPlayer.row,
      currentPlayer.col,
      currentPlayer.movementPointsRemaining,
      boardDimensions.width,
      boardDimensions.height
    );
  }, [currentPlayer, boardDimensions, showMovementOverlay]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
          newRow = Math.min(boardDimensions.height - 1, currentPlayer.row + 1);
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
          newCol = Math.min(boardDimensions.width - 1, currentPlayer.col + 1);
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
  }, [currentPlayer, boardDimensions, onTileClick]);

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-yellow-50 border-l-4 border-yellow-600 p-3">
        <p className="typewriter text-sm text-gray-800">
          {currentPlayer?.movementPointsRemaining > 0 
            ? `You have ${currentPlayer.movementPointsRemaining} movement points. Click a tile or use arrow keys to move.`
            : 'Roll dice to get movement points, then move around the mansion!'}
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
          className="relative inline-block"
          style={{
            width: boardDimensions.width * tileSize,
            height: boardDimensions.height * tileSize,
          }}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={MAP_IMAGE.path}
              alt="Mansion Floorplan"
              width={boardDimensions.width * tileSize}
              height={boardDimensions.height * tileSize}
              className="object-cover"
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Grid Overlay */}
          <div
            className="absolute inset-0"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${boardDimensions.width}, ${tileSize}px)`,
              gridTemplateRows: `repeat(${boardDimensions.height}, ${tileSize}px)`,
            }}
          >
            {Array.from({ length: boardDimensions.height }).map((_, rowIndex) =>
              Array.from({ length: boardDimensions.width }).map((_, colIndex) => {
                const playersOnTile = players.filter(
                  p => p.row === rowIndex && p.col === colIndex
                );
                const isCurrentPlayerTile = currentPlayer?.row === rowIndex && currentPlayer?.col === colIndex;
                const isReachable = reachableCells.some(c => c.row === rowIndex && c.col === colIndex);
                const roomId = getRoomAtCell(rowIndex, colIndex, cellToRoomMap);

                return (
                  <GridCell
                    key={`${rowIndex}-${colIndex}`}
                    row={rowIndex}
                    col={colIndex}
                    players={playersOnTile}
                    isCurrentPlayer={isCurrentPlayerTile}
                    isReachable={isReachable}
                    roomId={roomId}
                    onClick={() => onTileClick(rowIndex, colIndex)}
                    tileSize={tileSize}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Search Button */}
      {currentRoomId && onSearchRoom && (
        <div className="bg-amber-50 border-l-4 border-amber-600 p-3">
          <div className="flex items-center justify-between">
            <p className="typewriter text-sm text-gray-800">
              You are in the <strong>{ROOM_BOUNDS.find(r => r.id === currentRoomId)?.name}</strong>
            </p>
            <button
              onClick={() => onSearchRoom(currentRoomId)}
              className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded typewriter text-sm font-bold"
            >
              🔍 Search for Clues
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-[#f5f1e8] p-3 rounded-sm worn-edges">
        <div className="grid grid-cols-2 gap-2 text-sm typewriter">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span>Your position</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 bg-opacity-50 border-2 border-green-600 rounded"></div>
            <span>Can move here</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface GridCellProps {
  row: number;
  col: number;
  players: Player[];
  isCurrentPlayer: boolean;
  isReachable: boolean;
  roomId: string | null;
  onClick: () => void;
  tileSize: number;
}

function GridCell({ 
  row, 
  col, 
  players, 
  isCurrentPlayer, 
  isReachable, 
  roomId, 
  onClick, 
  tileSize 
}: GridCellProps) {
  const hasPlayers = players.length > 0;
  
  return (
    <div
      className={`relative border border-gray-500/20 cursor-pointer transition-all ${
        isCurrentPlayer 
          ? 'bg-blue-600/40 border-blue-600' 
          : isReachable 
          ? 'bg-green-600/30 border-green-600 hover:bg-green-600/50' 
          : 'hover:bg-white/10'
      }`}
      style={{ width: tileSize, height: tileSize }}
      onClick={onClick}
      title={roomId ? `${roomId} (${row}, ${col})` : `(${row}, ${col})`}
    >
      {/* Players on this tile */}
      {hasPlayers && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
                  width={tileSize * 0.6}
                  height={tileSize * 0.6}
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
