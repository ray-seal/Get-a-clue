// Grid and room models for the multiplayer board

export interface Exit {
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
}

export interface GridRoom {
  row: number;
  col: number;
  exits: Exit;
  name: string;
  description: string;
}

export interface GameGrid {
  rooms: GridRoom[][];
  width: number;
  height: number;
}

// Generate a 9x9 grid with all rooms connected
export function generateGrid(): GameGrid {
  const width = 9;
  const height = 9;
  const rooms: GridRoom[][] = [];

  // Room names for a mystery mansion
  const roomNames = [
    'Grand Foyer', 'Private Study', 'Library', 'Conservatory', 
    'Grand Ballroom', 'Dining Hall', 'Kitchen', 'Wine Cellar',
    'Billiard Room', 'Lounge', 'Master Bedroom', 'Guest Room',
    'Servants Quarters', 'Attic', 'Trophy Room', 'Music Room',
    'Drawing Room', 'Garden Path', 'Greenhouse', 'Chapel',
    'Gallery', 'Study Alcove', 'Tea Room', 'Parlor',
    'Smoking Room', 'Card Room', 'Office', 'Storage Room',
    'Secret Passage', 'Hidden Room', 'Vault', 'Observatory',
    'Laboratory', 'Workshop', 'Armory', 'Stable',
    'Courtyard', 'Fountain Hall', 'West Wing', 'East Wing',
    'North Tower', 'South Tower', 'Great Hall', 'Ante Chamber',
    'Portrait Gallery', 'Sitting Room', 'Morning Room', 'Sun Room',
    'Library Annex', 'Reading Nook', 'Map Room', 'Game Room',
    'Butler Pantry', 'Scullery', 'Root Cellar', 'Powder Room',
    'Bathroom', 'Dressing Room', 'Closet', 'Vestibule',
    'Corridor', 'Landing', 'Stairwell', 'Alcove',
    'Nook', 'Corner', 'Chamber', 'Hall',
    'Passage', 'Room', 'Space', 'Area',
    'Zone', 'Section', 'Quarter', 'District'
  ];

  let nameIndex = 0;

  for (let row = 0; row < height; row++) {
    rooms[row] = [];
    for (let col = 0; col < width; col++) {
      const exits: Exit = {
        north: row > 0,
        south: row < height - 1,
        east: col < width - 1,
        west: col > 0,
      };

      rooms[row][col] = {
        row,
        col,
        exits,
        name: roomNames[nameIndex % roomNames.length],
        description: `A mysterious room in the mansion.`,
      };
      nameIndex++;
    }
  }

  return {
    rooms,
    width,
    height,
  };
}

// Validate if a move is possible based on exits
export function canMoveToPosition(
  grid: GameGrid,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): boolean {
  // Check bounds
  if (toRow < 0 || toRow >= grid.height || toCol < 0 || toCol >= grid.width) {
    return false;
  }

  // Check if adjacent
  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;

  if (Math.abs(rowDiff) + Math.abs(colDiff) !== 1) {
    return false; // Not adjacent
  }

  const fromRoom = grid.rooms[fromRow][fromCol];

  // Check exit availability
  if (rowDiff === -1 && !fromRoom.exits.north) return false;
  if (rowDiff === 1 && !fromRoom.exits.south) return false;
  if (colDiff === 1 && !fromRoom.exits.east) return false;
  if (colDiff === -1 && !fromRoom.exits.west) return false;

  return true;
}

// Get adjacent accessible rooms
export function getAdjacentRooms(
  grid: GameGrid,
  row: number,
  col: number
): GridRoom[] {
  const adjacent: GridRoom[] = [];
  const room = grid.rooms[row][col];

  if (room.exits.north && row > 0) {
    adjacent.push(grid.rooms[row - 1][col]);
  }
  if (room.exits.south && row < grid.height - 1) {
    adjacent.push(grid.rooms[row + 1][col]);
  }
  if (room.exits.east && col < grid.width - 1) {
    adjacent.push(grid.rooms[row][col + 1]);
  }
  if (room.exits.west && col > 0) {
    adjacent.push(grid.rooms[row][col - 1]);
  }

  return adjacent;
}
