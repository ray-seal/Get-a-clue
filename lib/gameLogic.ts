import { ROOMS, SUSPECTS, VICTIMS, WEAPONS, MOTIVES, Clue, GameState } from './gameData';

// Initialize a new random game
export function initializeGame(): GameState {
  const solution = {
    suspect: SUSPECTS[Math.floor(Math.random() * SUSPECTS.length)].id,
    victim: VICTIMS[Math.floor(Math.random() * VICTIMS.length)].id,
    weapon: WEAPONS[Math.floor(Math.random() * WEAPONS.length)].id,
    motive: MOTIVES[Math.floor(Math.random() * MOTIVES.length)].id,
    location: ROOMS[Math.floor(Math.random() * ROOMS.length)].id,
  };

  return {
    currentRoomId: 'foyer',
    discoveredClues: [],
    playerPosition: 0,
    solution,
    visitedRooms: new Set(['foyer']),
  };
}

// Generate clues for each room
export function generateCluesForRoom(roomId: string, solution: GameState['solution']): Clue[] {
  const clues: Clue[] = [];
  const random = Math.random();
  
  // Each room has 1-2 clues
  const numClues = Math.floor(random * 2) + 1;
  
  for (let i = 0; i < numClues; i++) {
    const clueType = Math.floor(Math.random() * 5);
    
    if (clueType === 0) {
      // Suspect clue
      const suspectId = SUSPECTS[Math.floor(Math.random() * SUSPECTS.length)].id;
      const suspect = SUSPECTS.find(s => s.id === suspectId)!;
      const isSolution = suspectId === solution.suspect;
      
      clues.push({
        id: `${roomId}-suspect-${i}`,
        type: 'suspect',
        description: isSolution 
          ? `You find ${suspect.name}'s personal belongings in this room.`
          : `${suspect.name} was seen near here earlier.`,
        relatedId: suspectId,
      });
    } else if (clueType === 1) {
      // Victim clue
      const victimId = VICTIMS[Math.floor(Math.random() * VICTIMS.length)].id;
      const victim = VICTIMS.find(v => v.id === victimId)!;
      const isSolution = victimId === solution.victim;
      
      clues.push({
        id: `${roomId}-victim-${i}`,
        type: 'victim',
        description: isSolution
          ? `A torn piece of ${victim.name}'s clothing is found here.`
          : `${victim.name} visited this room recently.`,
        relatedId: victimId,
      });
    } else if (clueType === 2) {
      // Weapon clue
      const weaponId = WEAPONS[Math.floor(Math.random() * WEAPONS.length)].id;
      const weapon = WEAPONS.find(w => w.id === weaponId)!;
      const isSolution = weaponId === solution.weapon;
      
      clues.push({
        id: `${roomId}-weapon-${i}`,
        type: 'weapon',
        description: isSolution && roomId === solution.location
          ? `The ${weapon.name} is found here with suspicious marks!`
          : `You see a ${weapon.name} in the corner.`,
        relatedId: weaponId,
      });
    } else if (clueType === 3) {
      // Motive clue
      const motiveId = MOTIVES[Math.floor(Math.random() * MOTIVES.length)].id;
      const motive = MOTIVES.find(m => m.id === motiveId)!;
      const isSolution = motiveId === solution.motive;
      
      clues.push({
        id: `${roomId}-motive-${i}`,
        type: 'motive',
        description: isSolution
          ? `Documents related to ${motive.name.toLowerCase()} are scattered here.`
          : `You notice signs of ${motive.name.toLowerCase()}.`,
        relatedId: motiveId,
      });
    } else {
      // Location clue
      const locationId = ROOMS[Math.floor(Math.random() * ROOMS.length)].id;
      const room = ROOMS.find(r => r.id === locationId)!;
      const isSolution = locationId === solution.location;
      
      clues.push({
        id: `${roomId}-location-${i}`,
        type: 'location',
        description: isSolution
          ? `Signs of a struggle point to the ${room.name}.`
          : `Footprints lead towards the ${room.name}.`,
        relatedId: locationId,
      });
    }
  }
  
  return clues;
}

// Roll a dice
export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1;
}

// Move to a connected room
export function canMoveToRoom(currentRoomId: string, targetRoomId: string): boolean {
  const currentRoom = ROOMS.find(r => r.id === currentRoomId);
  return currentRoom?.connections.includes(targetRoomId) ?? false;
}

// Check if the player's accusation is correct
export function checkAccusation(
  accusation: { suspect: string; victim: string; weapon: string; motive: string; location: string },
  solution: GameState['solution']
): boolean {
  return (
    accusation.suspect === solution.suspect &&
    accusation.victim === solution.victim &&
    accusation.weapon === solution.weapon &&
    accusation.motive === solution.motive &&
    accusation.location === solution.location
  );
}

// Get a hint based on discovered clues
export function getHint(discoveredClues: Clue[], solution: GameState['solution']): string {
  const correctClues = discoveredClues.filter(clue => {
    if (clue.type === 'suspect') return clue.relatedId === solution.suspect;
    if (clue.type === 'victim') return clue.relatedId === solution.victim;
    if (clue.type === 'weapon') return clue.relatedId === solution.weapon;
    if (clue.type === 'motive') return clue.relatedId === solution.motive;
    if (clue.type === 'location') return clue.relatedId === solution.location;
    return false;
  });

  if (correctClues.length === 0) {
    return 'Keep searching for clues. The truth is hidden in the rooms.';
  } else if (correctClues.length < 3) {
    return `You're on the right track. You've found ${correctClues.length} key piece(s) of evidence.`;
  } else {
    return `You have strong evidence. You've discovered ${correctClues.length} crucial clues!`;
  }
}
