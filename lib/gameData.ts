// Game data types
export interface Room {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  connections: string[];
}

export interface Character {
  id: string;
  name: string;
  gender: 'male' | 'female';
  description: string;
  color: string;
}

export interface Weapon {
  id: string;
  name: string;
  description: string;
}

export interface Motive {
  id: string;
  name: string;
  description: string;
}

export interface Clue {
  id: string;
  type: 'suspect' | 'victim' | 'weapon' | 'motive' | 'location';
  description: string;
  relatedId: string;
}

export interface GameState {
  currentRoomId: string;
  discoveredClues: Clue[];
  playerPosition: number;
  solution: {
    suspect: string;
    victim: string;
    weapon: string;
    motive: string;
    location: string;
  };
  visitedRooms: Set<string>;
}

// Game data - generic names to avoid copyright issues
export const ROOMS: Room[] = [
  { id: 'foyer', name: 'Grand Foyer', description: 'An elegant entrance hall with marble floors', x: 1, y: 1, connections: ['study', 'lounge', 'dining'] },
  { id: 'study', name: 'Private Study', description: 'A room lined with bookshelves and leather chairs', x: 0, y: 0, connections: ['foyer', 'library'] },
  { id: 'library', name: 'Library', description: 'Towering shelves filled with ancient tomes', x: 0, y: 1, connections: ['study', 'conservatory'] },
  { id: 'conservatory', name: 'Conservatory', description: 'A glass-roofed room with exotic plants', x: 0, y: 2, connections: ['library', 'ballroom'] },
  { id: 'ballroom', name: 'Grand Ballroom', description: 'A spacious room with a crystal chandelier', x: 1, y: 2, connections: ['conservatory', 'dining'] },
  { id: 'dining', name: 'Dining Hall', description: 'A long table set for an elaborate feast', x: 1, y: 1, connections: ['foyer', 'ballroom', 'kitchen'] },
  { id: 'kitchen', name: 'Kitchen', description: 'A large kitchen with copper pots and pans', x: 2, y: 1, connections: ['dining', 'cellar'] },
  { id: 'cellar', name: 'Wine Cellar', description: 'A cool, dark room storing vintage wines', x: 2, y: 2, connections: ['kitchen', 'billiard'] },
  { id: 'billiard', name: 'Billiard Room', description: 'A game room with a green felt table', x: 2, y: 0, connections: ['cellar', 'lounge'] },
  { id: 'lounge', name: 'Lounge', description: 'A cozy sitting room with plush sofas', x: 1, y: 0, connections: ['foyer', 'billiard'] },
];

// Generic character names with appropriate genders
export const SUSPECTS: Character[] = [
  { id: 'alexander', name: 'Alexander Grey', gender: 'male', description: 'A distinguished businessman', color: '#4B5563' },
  { id: 'charlotte', name: 'Charlotte Reed', gender: 'female', description: 'A renowned artist', color: '#DC2626' },
  { id: 'benjamin', name: 'Benjamin Stone', gender: 'male', description: 'A wealthy investor', color: '#2563EB' },
  { id: 'victoria', name: 'Victoria Hart', gender: 'female', description: 'A celebrated actress', color: '#7C3AED' },
  { id: 'william', name: 'William Chase', gender: 'male', description: 'A retired military officer', color: '#059669' },
  { id: 'sophia', name: 'Sophia Rivers', gender: 'female', description: 'A mysterious traveler', color: '#D97706' },
];

export const VICTIMS: Character[] = [
  { id: 'victor_mansion', name: 'Victor Mansion', gender: 'male', description: 'The wealthy estate owner', color: '#000000' },
  { id: 'elizabeth', name: 'Elizabeth Blackwood', gender: 'female', description: 'A prominent socialite', color: '#1F2937' },
  { id: 'james', name: 'James Ashworth', gender: 'male', description: 'A renowned detective', color: '#374151' },
];

export const WEAPONS: Weapon[] = [
  { id: 'candlestick', name: 'Silver Candlestick', description: 'An ornate antique candlestick' },
  { id: 'rope', name: 'Silk Rope', description: 'A length of decorative rope' },
  { id: 'dagger', name: 'Ceremonial Dagger', description: 'An jeweled dagger from the study' },
  { id: 'poison', name: 'Poison Vial', description: 'A small vial containing unknown substance' },
  { id: 'revolver', name: 'Antique Revolver', description: 'A well-maintained firearm' },
  { id: 'wrench', name: 'Heavy Wrench', description: 'A tool from the maintenance closet' },
];

export const MOTIVES: Motive[] = [
  { id: 'inheritance', name: 'Inheritance Dispute', description: 'A contested will and fortune' },
  { id: 'revenge', name: 'Personal Revenge', description: 'An old grudge finally settled' },
  { id: 'blackmail', name: 'Blackmail Gone Wrong', description: 'Secrets that demanded silence' },
  { id: 'jealousy', name: 'Professional Jealousy', description: 'Career rivalry turned deadly' },
  { id: 'debt', name: 'Financial Debt', description: 'Desperate measures for desperate times' },
  { id: 'cover_up', name: 'Cover Up', description: 'Hiding a darker secret' },
];
