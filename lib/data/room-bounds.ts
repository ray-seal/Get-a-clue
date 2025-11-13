// Room boundaries in pixel coordinates for the mansion floorplan image
// These coordinates define the bounding boxes for each room on the map

export interface RoomBounds {
  id: string;
  name: string;
  x: number; // Top-left X coordinate in pixels
  y: number; // Top-left Y coordinate in pixels
  width: number; // Width in pixels
  height: number; // Height in pixels
}

// Mansion floorplan room definitions
// The image is assumed to be approximately 1920x1080 pixels
// These bounds will be mapped to grid cells (default 64px per cell)
export const ROOM_BOUNDS: RoomBounds[] = [
  // Ground Floor - Main Areas
  {
    id: 'FOYER',
    name: 'Grand Foyer',
    x: 800,
    y: 400,
    width: 320,
    height: 280,
  },
  {
    id: 'LIBRARY',
    name: 'Library',
    x: 100,
    y: 100,
    width: 380,
    height: 340,
  },
  {
    id: 'STUDY',
    name: 'Private Study',
    x: 1440,
    y: 100,
    width: 380,
    height: 340,
  },
  {
    id: 'DINING',
    name: 'Dining Hall',
    x: 100,
    y: 640,
    width: 380,
    height: 340,
  },
  {
    id: 'KITCHEN',
    name: 'Kitchen',
    x: 520,
    y: 640,
    width: 340,
    height: 340,
  },
  {
    id: 'BALLROOM',
    name: 'Grand Ballroom',
    x: 1060,
    y: 640,
    width: 420,
    height: 340,
  },
  {
    id: 'LOUNGE',
    name: 'Lounge',
    x: 1520,
    y: 640,
    width: 300,
    height: 340,
  },
  {
    id: 'CONSERVATORY',
    name: 'Conservatory',
    x: 520,
    y: 100,
    width: 240,
    height: 240,
  },
  {
    id: 'BILLIARD',
    name: 'Billiard Room',
    x: 1160,
    y: 100,
    width: 240,
    height: 240,
  },
];

// Image dimensions for scaling calculations
export const MAP_IMAGE = {
  width: 1920,
  height: 1080,
  path: '/assets/maps/board.png',
};
