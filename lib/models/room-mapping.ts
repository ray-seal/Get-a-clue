// Room mapping utilities to convert pixel-space room boundaries to grid cells

import { RoomBounds } from '../data/room-bounds';

export interface GridCell {
  row: number;
  col: number;
}

export interface RoomGridMapping {
  roomId: string;
  roomName: string;
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
  cells: GridCell[];
}

// Minimum room width in grid cells (requirement)
const MIN_ROOM_WIDTH = 5;

/**
 * Convert pixel coordinates to grid cell coordinates
 */
export function pixelToGridCell(
  pixelX: number,
  pixelY: number,
  tileSize: number
): GridCell {
  return {
    row: Math.floor(pixelY / tileSize),
    col: Math.floor(pixelX / tileSize),
  };
}

/**
 * Map room pixel boundaries to grid cells
 * Ensures minimum room width of 5 cells
 */
export function mapRoomToGrid(
  room: RoomBounds,
  tileSize: number
): RoomGridMapping {
  // Convert room bounds to grid cells
  let startCol = Math.floor(room.x / tileSize);
  let startRow = Math.floor(room.y / tileSize);
  let endCol = Math.floor((room.x + room.width) / tileSize);
  let endRow = Math.floor((room.y + room.height) / tileSize);

  // Enforce minimum width of 5 cells
  const width = endCol - startCol;
  if (width < MIN_ROOM_WIDTH) {
    const expansion = Math.ceil((MIN_ROOM_WIDTH - width) / 2);
    startCol = Math.max(0, startCol - expansion);
    endCol = startCol + MIN_ROOM_WIDTH;
  }

  // Generate all cells within the room bounds
  const cells: GridCell[] = [];
  for (let row = startRow; row < endRow; row++) {
    for (let col = startCol; col < endCol; col++) {
      cells.push({ row, col });
    }
  }

  return {
    roomId: room.id,
    roomName: room.name,
    startRow,
    startCol,
    endRow,
    endCol,
    cells,
  };
}

/**
 * Create a lookup map from grid cell to room ID
 */
export function createCellToRoomMap(
  rooms: RoomBounds[],
  tileSize: number
): Map<string, string> {
  const cellToRoom = new Map<string, string>();

  for (const room of rooms) {
    const mapping = mapRoomToGrid(room, tileSize);
    for (const cell of mapping.cells) {
      const key = `${cell.row},${cell.col}`;
      cellToRoom.set(key, room.id);
    }
  }

  return cellToRoom;
}

/**
 * Get the room ID for a given grid cell
 */
export function getRoomAtCell(
  row: number,
  col: number,
  cellToRoomMap: Map<string, string>
): string | null {
  const key = `${row},${col}`;
  return cellToRoomMap.get(key) || null;
}

/**
 * Calculate grid dimensions based on image size and tile size
 */
export function calculateGridDimensions(
  imageWidth: number,
  imageHeight: number,
  tileSize: number
): { width: number; height: number } {
  return {
    width: Math.ceil(imageWidth / tileSize),
    height: Math.ceil(imageHeight / tileSize),
  };
}

/**
 * Get all cells reachable within N steps (BFS)
 */
export function getReachableCells(
  startRow: number,
  startCol: number,
  steps: number,
  gridWidth: number,
  gridHeight: number
): GridCell[] {
  if (steps <= 0) return [];

  const visited = new Set<string>();
  const reachable: GridCell[] = [];
  const queue: { cell: GridCell; distance: number }[] = [
    { cell: { row: startRow, col: startCol }, distance: 0 },
  ];
  visited.add(`${startRow},${startCol}`);

  while (queue.length > 0) {
    const { cell, distance } = queue.shift()!;

    if (distance > 0) {
      reachable.push(cell);
    }

    if (distance < steps) {
      // Add adjacent cells (orthogonal only)
      const adjacent = [
        { row: cell.row - 1, col: cell.col }, // North
        { row: cell.row + 1, col: cell.col }, // South
        { row: cell.row, col: cell.col - 1 }, // West
        { row: cell.row, col: cell.col + 1 }, // East
      ];

      for (const adj of adjacent) {
        const key = `${adj.row},${adj.col}`;
        if (
          !visited.has(key) &&
          adj.row >= 0 &&
          adj.row < gridHeight &&
          adj.col >= 0 &&
          adj.col < gridWidth
        ) {
          visited.add(key);
          queue.push({ cell: adj, distance: distance + 1 });
        }
      }
    }
  }

  return reachable;
}
