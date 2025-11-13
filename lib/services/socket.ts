'use client';

import { io, Socket } from 'socket.io-client';
import { Player, PlayerInput } from '../models/player';

class SocketService {
  private socket: Socket | null = null;
  private serverUrl: string;

  constructor() {
    this.serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
  }

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(this.serverUrl, {
        transports: ['websocket', 'polling'],
      });

      this.socket.on('connect', () => {
        console.log('Connected to server:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });
    }
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  createRoom(callback: (response: { success: boolean; code?: string; error?: string }) => void): void {
    if (!this.socket) {
      callback({ success: false, error: 'Not connected' });
      return;
    }
    this.socket.emit('createRoom', callback);
  }

  joinRoom(
    code: string,
    player: PlayerInput,
    callback: (response: { success: boolean; players?: Player[]; yourId?: string; error?: string }) => void
  ): void {
    if (!this.socket) {
      callback({ success: false, error: 'Not connected' });
      return;
    }
    this.socket.emit('joinRoom', { code, player }, callback);
  }

  move(
    code: string,
    from: { row: number; col: number },
    to: { row: number; col: number },
    callback: (response: { success: boolean; error?: string }) => void
  ): void {
    if (!this.socket) {
      callback({ success: false, error: 'Not connected' });
      return;
    }
    this.socket.emit('move', { code, from, to }, callback);
  }

  solveCase(
    code: string,
    callback: (response: { success: boolean; player?: Player; error?: string }) => void
  ): void {
    if (!this.socket) {
      callback({ success: false, error: 'Not connected' });
      return;
    }
    this.socket.emit('solveCase', { code }, callback);
  }

  rollDice(
    code: string,
    callback: (response: { success: boolean; roll?: number; movementPoints?: number; error?: string }) => void
  ): void {
    if (!this.socket) {
      callback({ success: false, error: 'Not connected' });
      return;
    }
    this.socket.emit('rollDice', { code }, callback);
  }

  moveStep(
    code: string,
    from: { row: number; col: number },
    to: { row: number; col: number },
    callback: (response: { success: boolean; movementPointsRemaining?: number; error?: string }) => void
  ): void {
    if (!this.socket) {
      callback({ success: false, error: 'Not connected' });
      return;
    }
    this.socket.emit('moveStep', { code, from, to }, callback);
  }

  searchRoom(
    code: string,
    roomId: string,
    callback: (response: { success: boolean; found?: boolean; clue?: any; xp?: number; level?: number; error?: string }) => void
  ): void {
    if (!this.socket) {
      callback({ success: false, error: 'Not connected' });
      return;
    }
    this.socket.emit('searchRoom', { code, roomId }, callback);
  }

  onPlayerJoined(callback: (player: Player) => void): void {
    if (this.socket) {
      this.socket.on('playerJoined', callback);
    }
  }

  onPlayerMoved(callback: (data: { playerId: string; from: { row: number; col: number }; to: { row: number; col: number } }) => void): void {
    if (this.socket) {
      this.socket.on('playerMoved', callback);
    }
  }

  onPlayerStatsUpdated(callback: (data: { playerId: string; casesSolved: number; xp: number; level: number }) => void): void {
    if (this.socket) {
      this.socket.on('playerStatsUpdated', callback);
    }
  }

  onPlayerDisconnected(callback: (playerId: string) => void): void {
    if (this.socket) {
      this.socket.on('playerDisconnected', callback);
    }
  }

  onDiceRolled(callback: (data: { playerId: string; playerName: string; roll: number }) => void): void {
    if (this.socket) {
      this.socket.on('diceRolled', callback);
    }
  }

  onClueFound(callback: (data: { playerId: string; playerName: string; clue: any; roomId: string }) => void): void {
    if (this.socket) {
      this.socket.on('clueFound', callback);
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
