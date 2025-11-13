'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CharacterSelect from '../components/CharacterSelect';
import GameBoard from '../components/GameBoard';
import HUD from '../components/HUD';
import CardCollection from '../components/CardCollection';
import { generateGrid, canMoveToPosition } from '@/lib/models/grid';
import { Player } from '@/lib/models/player';
import { calculateLevel, XP_PER_CASE } from '@/lib/utils/leveling';
import { socketService } from '@/lib/services/socket';

type GameMode = 'solo' | 'multiplayer';
type GamePhase = 'setup' | 'playing';

function GameContent() {
  const searchParams = useSearchParams();
  const [gameMode] = useState<GameMode>(
    (searchParams?.get('mode') as GameMode) || 'solo'
  );
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [roomCode, setRoomCode] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const [grid] = useState(() => generateGrid());
  const [message, setMessage] = useState('');
  const [showCardCollection, setShowCardCollection] = useState(false);

  // Initialize solo game
  const initSoloGame = useCallback((name: string, spriteId: string) => {
    const soloPlayer: Player = {
      id: 'solo-player',
      name,
      spriteId,
      row: 4,
      col: 4,
      xp: 0,
      level: 1,
      casesSolved: 0,
      connected: true,
    };
    setPlayers([soloPlayer]);
    setCurrentPlayerId('solo-player');
    setGamePhase('playing');
    setMessage('Welcome! Use arrow keys or click adjacent tiles to move.');
  }, []);

  // Initialize multiplayer game
  const initMultiplayerGame = useCallback((name: string, spriteId: string) => {
    socketService.connect();

    // Check if we have a join code from URL
    const urlRoomCode = searchParams?.get('room');
    
    if (urlRoomCode) {
      // Join existing room
      socketService.joinRoom(
        urlRoomCode,
        { name, spriteId, row: 4, col: 4 },
        (response) => {
          if (response.success && response.players && response.yourId) {
            setPlayers(response.players);
            setCurrentPlayerId(response.yourId);
            setRoomCode(urlRoomCode);
            setGamePhase('playing');
            setMessage(`Joined room ${urlRoomCode}. ${response.players.length} player(s) connected.`);
          } else {
            setMessage(`Failed to join room: ${response.error || 'Unknown error'}`);
          }
        }
      );
    } else {
      // Create new room
      socketService.createRoom((response) => {
        if (response.success && response.code) {
          const code = response.code;
          setRoomCode(code);
          
          // Join the created room
          socketService.joinRoom(
            code,
            { name, spriteId, row: 4, col: 4 },
            (joinResponse) => {
              if (joinResponse.success && joinResponse.players && joinResponse.yourId) {
                setPlayers(joinResponse.players);
                setCurrentPlayerId(joinResponse.yourId);
                setGamePhase('playing');
                setMessage(`Room created! Share code: ${code}`);
              }
            }
          );
        } else {
          setMessage('Failed to create room');
        }
      });
    }

    // Set up event listeners
    socketService.onPlayerJoined((player) => {
      setPlayers((prev) => [...prev, player]);
      setMessage(`${player.name} joined the game!`);
    });

    socketService.onPlayerMoved((data) => {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === data.playerId
            ? { ...p, row: data.to.row, col: data.to.col }
            : p
        )
      );
    });

    socketService.onPlayerStatsUpdated((data) => {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === data.playerId
            ? { ...p, casesSolved: data.casesSolved, xp: data.xp, level: data.level }
            : p
        )
      );
      if (data.playerId === currentPlayerId) {
        setMessage(`Case solved! +${XP_PER_CASE} XP`);
      } else {
        const player = players.find(p => p.id === data.playerId);
        if (player) {
          setMessage(`${player.name} solved a case!`);
        }
      }
    });

    socketService.onPlayerDisconnected((playerId) => {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === playerId ? { ...p, connected: false } : p
        )
      );
      const player = players.find(p => p.id === playerId);
      if (player) {
        setMessage(`${player.name} disconnected`);
      }
    });

    return () => {
      socketService.disconnect();
    };
  }, [searchParams, currentPlayerId, players]);

  // Handle character selection
  const handleCharacterSelect = (name: string, spriteId: string) => {
    if (gameMode === 'solo') {
      initSoloGame(name, spriteId);
    } else {
      initMultiplayerGame(name, spriteId);
    }
  };

  // Handle tile click
  const handleTileClick = useCallback(
    (row: number, col: number) => {
      const currentPlayer = players.find((p) => p.id === currentPlayerId);
      if (!currentPlayer) return;

      // Check if move is valid
      if (!canMoveToPosition(grid, currentPlayer.row, currentPlayer.col, row, col)) {
        setMessage('Cannot move there! Only adjacent tiles are accessible.');
        return;
      }

      const from = { row: currentPlayer.row, col: currentPlayer.col };
      const to = { row, col };

      if (gameMode === 'solo') {
        // Update local state
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === currentPlayerId ? { ...p, row, col } : p
          )
        );
        setMessage(`Moved to ${grid.rooms[row][col].name}`);
      } else {
        // Send move to server
        socketService.move(roomCode, from, to, (response) => {
          if (!response.success) {
            setMessage(`Move failed: ${response.error || 'Unknown error'}`);
          }
        });
      }
    },
    [players, currentPlayerId, grid, gameMode, roomCode]
  );

  // Handle solve case
  const handleSolveCase = () => {
    const currentPlayer = players.find((p) => p.id === currentPlayerId);
    if (!currentPlayer) return;

    if (gameMode === 'solo') {
      // Update local state
      const newXP = currentPlayer.xp + XP_PER_CASE;
      const newLevel = calculateLevel(newXP);
      const newCasesSolved = currentPlayer.casesSolved + 1;

      setPlayers((prev) =>
        prev.map((p) =>
          p.id === currentPlayerId
            ? { ...p, xp: newXP, level: newLevel, casesSolved: newCasesSolved }
            : p
        )
      );
      setMessage(`Case solved! +${XP_PER_CASE} XP. Total: ${newCasesSolved} cases.`);
    } else {
      // Send to server
      socketService.solveCase(roomCode, (response) => {
        if (!response.success) {
          setMessage(`Failed to solve case: ${response.error || 'Unknown error'}`);
        }
      });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameMode === 'multiplayer') {
        socketService.disconnect();
      }
    };
  }, [gameMode]);

  const currentPlayer = players.find((p) => p.id === currentPlayerId);

  return (
    <div className="min-h-screen p-4 case-file">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-[#f5f1e8] p-4 rounded-sm worn-edges mb-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold typewriter stamped-text text-red-800">
                DETECTIVE BOARD GAME
              </h1>
              <p className="typewriter text-sm text-gray-600">
                {gameMode === 'solo' ? '🎮 Solo Mode' : `🌐 Multiplayer Mode${roomCode ? ` - Room: ${roomCode}` : ''}`}
              </p>
            </div>
            <Link
              href="/"
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded typewriter text-sm"
            >
              Exit Game
            </Link>
          </div>
        </div>

        {/* Setup Phase: Character Selection */}
        {gamePhase === 'setup' && (
          <CharacterSelect onSelect={handleCharacterSelect} />
        )}

        {/* Playing Phase */}
        {gamePhase === 'playing' && currentPlayer && (
          <>
            {/* Message Display */}
            {message && (
              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-4 worn-edges">
                <p className="typewriter text-gray-800">{message}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Game Board - takes 3 columns */}
              <div className="lg:col-span-3">
                <GameBoard
                  grid={grid}
                  players={players.filter(p => p.connected)}
                  currentPlayerId={currentPlayerId}
                  onTileClick={handleTileClick}
                  tileSize={64}
                />
              </div>

              {/* Sidebar - takes 1 column */}
              <div className="space-y-4">
                {/* Player HUD */}
                <HUD player={currentPlayer} />

                {/* Actions */}
                <div className="bg-[#f5f1e8] p-4 rounded-sm worn-edges">
                  <h3 className="font-bold typewriter mb-3 text-gray-800 stamped-text">
                    Actions
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={handleSolveCase}
                      className="w-full bg-green-700 hover:bg-green-800 text-white py-3 px-4 rounded typewriter text-sm font-bold"
                    >
                      ✅ Solve Case (+{XP_PER_CASE} XP)
                    </button>
                    <button
                      onClick={() => setShowCardCollection(!showCardCollection)}
                      className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 px-4 rounded typewriter text-sm font-bold"
                    >
                      🎴 Card Collection
                    </button>
                  </div>
                </div>

                {/* Players List (for multiplayer) */}
                {gameMode === 'multiplayer' && (
                  <div className="bg-[#f5f1e8] p-4 rounded-sm worn-edges">
                    <h3 className="font-bold typewriter mb-3 text-gray-800 stamped-text">
                      Players ({players.length})
                    </h3>
                    <div className="space-y-2">
                      {players.map((player) => (
                        <div
                          key={player.id}
                          className={`p-2 rounded text-sm typewriter ${
                            player.id === currentPlayerId
                              ? 'bg-blue-100 border-2 border-blue-600'
                              : player.connected
                              ? 'bg-white border border-gray-300'
                              : 'bg-gray-200 border border-gray-400 opacity-50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold">
                              {player.name} {player.id === currentPlayerId && '(You)'}
                            </span>
                            <span className={player.connected ? 'text-green-600' : 'text-gray-500'}>
                              {player.connected ? '●' : '○'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Lv {player.level} • {player.casesSolved} cases
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Collection Modal */}
            {showCardCollection && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="max-w-md w-full">
                  <div className="mb-4 flex justify-end">
                    <button
                      onClick={() => setShowCardCollection(false)}
                      className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded typewriter"
                    >
                      Close
                    </button>
                  </div>
                  <CardCollection />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center case-file">
        <p className="text-2xl typewriter">Loading game...</p>
      </div>
    }>
      <GameContent />
    </Suspense>
  );
}
