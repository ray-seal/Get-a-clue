// Player model for multiplayer game

export interface Player {
  id: string;
  name: string;
  spriteId: string;
  row: number;
  col: number;
  xp: number;
  level: number;
  casesSolved: number;
  connected: boolean;
}

export interface PlayerInput {
  name: string;
  spriteId: string;
  row?: number;
  col?: number;
}

// Available character sprites
export const CHARACTER_SPRITES = [
  { id: 'detective', name: 'Detective', color: '#3B82F6' },
  { id: 'inspector', name: 'Inspector', color: '#EF4444' },
  { id: 'agent', name: 'Agent', color: '#10B981' },
  { id: 'sleuth', name: 'Sleuth', color: '#F59E0B' },
  { id: 'investigator', name: 'Investigator', color: '#8B5CF6' },
  { id: 'analyst', name: 'Analyst', color: '#EC4899' },
];
