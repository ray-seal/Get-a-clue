// Server-side clue definitions and probabilities by room

export interface ClueDefinition {
  id: string;
  type: string;
  description: string;
  xpAward: number;
}

export interface RoomClueConfig {
  roomId: string;
  probability: number; // 0.0 to 1.0
  clues: ClueDefinition[];
}

// Sample clue definitions
export const CLUES: ClueDefinition[] = [
  {
    id: 'clue_fingerprint',
    type: 'Physical Evidence',
    description: 'A set of mysterious fingerprints on a glass.',
    xpAward: 25,
  },
  {
    id: 'clue_letter',
    type: 'Document',
    description: 'A torn letter with cryptic handwriting.',
    xpAward: 30,
  },
  {
    id: 'clue_key',
    type: 'Object',
    description: 'An old brass key with strange markings.',
    xpAward: 20,
  },
  {
    id: 'clue_footprint',
    type: 'Physical Evidence',
    description: 'Muddy footprints leading to the door.',
    xpAward: 15,
  },
  {
    id: 'clue_book',
    type: 'Document',
    description: 'A journal with suspicious annotations.',
    xpAward: 35,
  },
  {
    id: 'clue_photograph',
    type: 'Document',
    description: 'An old photograph with a familiar face.',
    xpAward: 25,
  },
  {
    id: 'clue_weapon',
    type: 'Object',
    description: 'A letter opener with dried stains.',
    xpAward: 40,
  },
  {
    id: 'clue_cigar',
    type: 'Physical Evidence',
    description: 'A half-smoked cigar in an ashtray.',
    xpAward: 20,
  },
  {
    id: 'clue_receipt',
    type: 'Document',
    description: 'A receipt for a large sum of money.',
    xpAward: 30,
  },
  {
    id: 'clue_fabric',
    type: 'Physical Evidence',
    description: 'A torn piece of expensive fabric.',
    xpAward: 15,
  },
];

// Room-specific clue configurations
export const ROOM_CLUE_CONFIGS: RoomClueConfig[] = [
  {
    roomId: 'LIBRARY',
    probability: 0.6,
    clues: [
      CLUES.find((c) => c.id === 'clue_book')!,
      CLUES.find((c) => c.id === 'clue_letter')!,
      CLUES.find((c) => c.id === 'clue_photograph')!,
    ],
  },
  {
    roomId: 'STUDY',
    probability: 0.65,
    clues: [
      CLUES.find((c) => c.id === 'clue_letter')!,
      CLUES.find((c) => c.id === 'clue_receipt')!,
      CLUES.find((c) => c.id === 'clue_key')!,
    ],
  },
  {
    roomId: 'DINING',
    probability: 0.5,
    clues: [
      CLUES.find((c) => c.id === 'clue_fingerprint')!,
      CLUES.find((c) => c.id === 'clue_weapon')!,
      CLUES.find((c) => c.id === 'clue_fabric')!,
    ],
  },
  {
    roomId: 'KITCHEN',
    probability: 0.55,
    clues: [
      CLUES.find((c) => c.id === 'clue_footprint')!,
      CLUES.find((c) => c.id === 'clue_fingerprint')!,
      CLUES.find((c) => c.id === 'clue_weapon')!,
    ],
  },
  {
    roomId: 'BALLROOM',
    probability: 0.45,
    clues: [
      CLUES.find((c) => c.id === 'clue_fabric')!,
      CLUES.find((c) => c.id === 'clue_photograph')!,
      CLUES.find((c) => c.id === 'clue_footprint')!,
    ],
  },
  {
    roomId: 'LOUNGE',
    probability: 0.5,
    clues: [
      CLUES.find((c) => c.id === 'clue_cigar')!,
      CLUES.find((c) => c.id === 'clue_fingerprint')!,
      CLUES.find((c) => c.id === 'clue_key')!,
    ],
  },
  {
    roomId: 'CONSERVATORY',
    probability: 0.4,
    clues: [
      CLUES.find((c) => c.id === 'clue_footprint')!,
      CLUES.find((c) => c.id === 'clue_fabric')!,
    ],
  },
  {
    roomId: 'BILLIARD',
    probability: 0.5,
    clues: [
      CLUES.find((c) => c.id === 'clue_cigar')!,
      CLUES.find((c) => c.id === 'clue_photograph')!,
      CLUES.find((c) => c.id === 'clue_key')!,
    ],
  },
  {
    roomId: 'FOYER',
    probability: 0.35,
    clues: [
      CLUES.find((c) => c.id === 'clue_footprint')!,
      CLUES.find((c) => c.id === 'clue_key')!,
    ],
  },
];

/**
 * Search for a clue in a given room
 * Returns a clue or null based on probability
 */
export function searchRoomForClue(
  roomId: string,
  foundClueIds: string[]
): { found: boolean; clue?: ClueDefinition } {
  const roomConfig = ROOM_CLUE_CONFIGS.find((rc) => rc.roomId === roomId);

  if (!roomConfig) {
    return { found: false };
  }

  // Roll for success
  const roll = Math.random();
  if (roll > roomConfig.probability) {
    return { found: false };
  }

  // Filter out already found clues
  const availableClues = roomConfig.clues.filter(
    (clue) => !foundClueIds.includes(clue.id)
  );

  if (availableClues.length === 0) {
    return { found: false };
  }

  // Pick a random clue from available ones
  const randomIndex = Math.floor(Math.random() * availableClues.length);
  const selectedClue = availableClues[randomIndex];

  return { found: true, clue: selectedClue };
}
