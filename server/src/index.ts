import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { customAlphabet } from 'nanoid';
import { searchRoomForClue } from './data/clues';

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Generate 6-character alphanumeric join codes
const generateCode = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 6);

interface Clue {
  id: string;
  type: string;
  description: string;
  xpAward: number;
  roomId: string;
}

interface Player {
  id: string;
  name: string;
  spriteId: string;
  row: number;
  col: number;
  xp: number;
  level: number;
  casesSolved: number;
  connected: boolean;
  movementPointsRemaining: number;
  inventory: Clue[];
}

interface Room {
  code: string;
  players: Map<string, Player>;
  createdAt: number;
  lastActivity: number;
}

const rooms = new Map<string, Room>();

// Clean up inactive rooms every 5 minutes
setInterval(() => {
  const now = Date.now();
  const ROOM_TTL = 30 * 60 * 1000; // 30 minutes

  for (const [code, room] of rooms.entries()) {
    const allDisconnected = Array.from(room.players.values()).every(p => !p.connected);
    const inactive = now - room.lastActivity > ROOM_TTL;

    if (allDisconnected && inactive) {
      rooms.delete(code);
      console.log(`Cleaned up inactive room: ${code}`);
    }
  }
}, 5 * 60 * 1000);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('createRoom', (callback) => {
    const code = generateCode();
    const room: Room = {
      code,
      players: new Map(),
      createdAt: Date.now(),
      lastActivity: Date.now(),
    };
    rooms.set(code, room);
    console.log(`Room created: ${code}`);
    callback({ success: true, code });
  });

  socket.on('joinRoom', ({ code, player }, callback) => {
    const room = rooms.get(code);
    
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }

    // Join the socket room
    socket.join(code);

    // Add or update player
    const newPlayer: Player = {
      id: socket.id,
      name: player.name || `Player ${socket.id.substring(0, 4)}`,
      spriteId: player.spriteId || 'default',
      row: player.row || 0,
      col: player.col || 0,
      xp: 0,
      level: 1,
      casesSolved: 0,
      connected: true,
      movementPointsRemaining: 0,
      inventory: [],
    };

    room.players.set(socket.id, newPlayer);
    room.lastActivity = Date.now();

    console.log(`Player ${newPlayer.name} joined room ${code}`);

    // Send current room state to the joining player
    const playersArray = Array.from(room.players.values());
    callback({ success: true, players: playersArray, yourId: socket.id });

    // Broadcast to others that a new player joined
    socket.to(code).emit('playerJoined', newPlayer);
  });

  socket.on('move', ({ code, from, to }, callback) => {
    const room = rooms.get(code);
    
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }

    const player = room.players.get(socket.id);
    
    if (!player) {
      callback({ success: false, error: 'Player not found' });
      return;
    }

    // Validate movement (adjacent tiles only)
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);
    const isAdjacent = (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);

    if (!isAdjacent) {
      callback({ success: false, error: 'Can only move to adjacent tiles' });
      return;
    }

    // Update player position
    player.row = to.row;
    player.col = to.col;
    room.lastActivity = Date.now();

    callback({ success: true });

    // Broadcast the move to all players in the room
    io.to(code).emit('playerMoved', {
      playerId: socket.id,
      from,
      to,
    });
  });

  socket.on('solveCase', ({ code }, callback) => {
    const room = rooms.get(code);
    
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }

    const player = room.players.get(socket.id);
    
    if (!player) {
      callback({ success: false, error: 'Player not found' });
      return;
    }

    // Award XP and increment cases solved
    const XP_PER_CASE = 50;
    player.casesSolved += 1;
    player.xp += XP_PER_CASE;
    
    // Calculate level: level = floor(sqrt(xp/100)) + 1
    player.level = Math.floor(Math.sqrt(player.xp / 100)) + 1;
    
    room.lastActivity = Date.now();

    console.log(`Player ${player.name} solved a case! XP: ${player.xp}, Level: ${player.level}`);

    callback({ success: true, player });

    // Broadcast updated player stats to all players in the room
    io.to(code).emit('playerStatsUpdated', {
      playerId: socket.id,
      casesSolved: player.casesSolved,
      xp: player.xp,
      level: player.level,
    });
  });

  // Roll dice to get movement points
  socket.on('rollDice', ({ code }, callback) => {
    const room = rooms.get(code);
    
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }

    const player = room.players.get(socket.id);
    
    if (!player) {
      callback({ success: false, error: 'Player not found' });
      return;
    }

    // Generate dice roll (1-6)
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    
    // Set movement points
    player.movementPointsRemaining = diceRoll;
    room.lastActivity = Date.now();

    console.log(`Player ${player.name} rolled ${diceRoll}`);

    callback({ success: true, roll: diceRoll, movementPoints: diceRoll });

    // Broadcast dice roll to all players in the room
    io.to(code).emit('diceRolled', {
      playerId: socket.id,
      playerName: player.name,
      roll: diceRoll,
    });
  });

  // Move one step (consumes movement points)
  socket.on('moveStep', ({ code, from, to }, callback) => {
    const room = rooms.get(code);
    
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }

    const player = room.players.get(socket.id);
    
    if (!player) {
      callback({ success: false, error: 'Player not found' });
      return;
    }

    // Check if player has movement points
    if (player.movementPointsRemaining <= 0) {
      callback({ success: false, error: 'No movement points remaining. Roll dice first!' });
      return;
    }

    // Validate movement (adjacent tiles only)
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);
    const isAdjacent = (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);

    if (!isAdjacent) {
      callback({ success: false, error: 'Can only move to adjacent tiles' });
      return;
    }

    // Update player position and consume movement point
    player.row = to.row;
    player.col = to.col;
    player.movementPointsRemaining -= 1;
    room.lastActivity = Date.now();

    callback({ 
      success: true, 
      movementPointsRemaining: player.movementPointsRemaining 
    });

    // Broadcast the move to all players in the room
    io.to(code).emit('playerMoved', {
      playerId: socket.id,
      from,
      to,
      movementPointsRemaining: player.movementPointsRemaining,
    });
  });

  // Search for clues in a room
  socket.on('searchRoom', ({ code, roomId }, callback) => {
    const room = rooms.get(code);
    
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }

    const player = room.players.get(socket.id);
    
    if (!player) {
      callback({ success: false, error: 'Player not found' });
      return;
    }

    if (!roomId) {
      callback({ success: false, error: 'Not in a valid room' });
      return;
    }

    // Get list of already found clue IDs
    const foundClueIds = player.inventory.map(c => c.id);

    // Search for clue
    const result = searchRoomForClue(roomId, foundClueIds);

    if (result.found && result.clue) {
      // Add clue to inventory
      const clue: Clue = {
        id: result.clue.id,
        type: result.clue.type,
        description: result.clue.description,
        xpAward: result.clue.xpAward,
        roomId: roomId,
      };
      
      player.inventory.push(clue);
      
      // Award XP
      player.xp += result.clue.xpAward;
      player.level = Math.floor(Math.sqrt(player.xp / 100)) + 1;
      
      room.lastActivity = Date.now();

      console.log(`Player ${player.name} found clue: ${result.clue.description}`);

      callback({ 
        success: true, 
        found: true, 
        clue,
        xp: player.xp,
        level: player.level,
      });

      // Broadcast clue found to all players
      io.to(code).emit('clueFound', {
        playerId: socket.id,
        playerName: player.name,
        clue,
        roomId,
      });

      // Broadcast updated player stats
      io.to(code).emit('playerStatsUpdated', {
        playerId: socket.id,
        casesSolved: player.casesSolved,
        xp: player.xp,
        level: player.level,
      });
    } else {
      callback({ 
        success: true, 
        found: false 
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);

    // Mark player as disconnected in all rooms
    for (const room of rooms.values()) {
      const player = room.players.get(socket.id);
      if (player) {
        player.connected = false;
        room.lastActivity = Date.now();
        
        // Notify others in the room
        socket.to(room.code).emit('playerDisconnected', socket.id);
      }
    }
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
