'use client';

import { useState, useEffect } from 'react';
import { GameState, ROOMS, SUSPECTS, VICTIMS, WEAPONS, MOTIVES, Clue } from '@/lib/gameData';
import { initializeGame, generateCluesForRoom, rollDice, canMoveToRoom, checkAccusation, getHint } from '@/lib/gameLogic';
import Link from 'next/link';

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [showAccusationForm, setShowAccusationForm] = useState(false);
  const [accusation, setAccusation] = useState({
    suspect: '',
    victim: '',
    weapon: '',
    motive: '',
    location: '',
  });
  const [gameOver, setGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);

  useEffect(() => {
    const newGame = initializeGame();
    setGameState(newGame);
    setMessage('Welcome, Detective. Begin your investigation by exploring the rooms.');
  }, []);

  const handleRollDice = () => {
    const roll = rollDice();
    setDiceValue(roll);
    setMessage(`You rolled a ${roll}. Select a connected room to move to.`);
  };

  const handleMoveToRoom = (roomId: string) => {
    if (!gameState) return;

    if (!canMoveToRoom(gameState.currentRoomId, roomId)) {
      setMessage('You cannot move to that room from here!');
      return;
    }

    if (diceValue === null) {
      setMessage('Roll the dice first!');
      return;
    }

    const newVisitedRooms = new Set(gameState.visitedRooms);
    newVisitedRooms.add(roomId);

    // Generate clues for this room if first visit
    const newClues = !gameState.visitedRooms.has(roomId)
      ? generateCluesForRoom(roomId, gameState.solution)
      : [];

    const room = ROOMS.find(r => r.id === roomId)!;

    setGameState({
      ...gameState,
      currentRoomId: roomId,
      discoveredClues: [...gameState.discoveredClues, ...newClues],
      visitedRooms: newVisitedRooms,
    });

    setDiceValue(null);
    
    if (newClues.length > 0) {
      setMessage(`You discovered ${newClues.length} clue(s) in the ${room.name}!`);
    } else {
      setMessage(`You entered the ${room.name}. You've already searched this room.`);
    }
  };

  const handleMakeAccusation = () => {
    if (!gameState) return;

    if (!accusation.suspect || !accusation.victim || !accusation.weapon || !accusation.motive || !accusation.location) {
      setMessage('Please fill in all fields before making your accusation!');
      return;
    }

    const isCorrect = checkAccusation(accusation, gameState.solution);
    
    setGameOver(true);
    setIsWinner(isCorrect);
    
    if (isCorrect) {
      setMessage('🎉 Congratulations! You solved the mystery! Your accusation was correct!');
    } else {
      const suspect = SUSPECTS.find(s => s.id === gameState.solution.suspect)!;
      const victim = VICTIMS.find(v => v.id === gameState.solution.victim)!;
      const weapon = WEAPONS.find(w => w.id === gameState.solution.weapon)!;
      const motive = MOTIVES.find(m => m.id === gameState.solution.motive)!;
      const location = ROOMS.find(r => r.id === gameState.solution.location)!;
      
      setMessage(
        `❌ Wrong accusation! The truth was: ${suspect.name} killed ${victim.name} with the ${weapon.name} ` +
        `due to ${motive.name.toLowerCase()} in the ${location.name}.`
      );
    }
  };

  const handleGetHint = () => {
    if (!gameState) return;
    const hint = getHint(gameState.discoveredClues, gameState.solution);
    setMessage(hint);
  };

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center case-file">
        <p className="text-2xl typewriter">Loading investigation...</p>
      </div>
    );
  }

  const currentRoom = ROOMS.find(r => r.id === gameState.currentRoomId)!;
  const connectedRooms = ROOMS.filter(r => currentRoom.connections.includes(r.id));

  return (
    <div className="min-h-screen p-4 case-file">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-[#f5f1e8] p-4 rounded-sm worn-edges mb-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold typewriter stamped-text text-red-800">
              ACTIVE INVESTIGATION
            </h1>
            <Link 
              href="/"
              className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded typewriter text-sm"
            >
              Exit Case
            </Link>
          </div>
        </div>

        {/* Game Over Screen */}
        {gameOver && (
          <div className="bg-[#f5f1e8] p-8 rounded-sm worn-edges mb-4 text-center">
            <h2 className={`text-3xl font-bold typewriter mb-4 ${isWinner ? 'text-green-700' : 'text-red-700'}`}>
              {isWinner ? 'CASE CLOSED' : 'CASE REMAINS OPEN'}
            </h2>
            <p className="text-lg typewriter mb-6">{message}</p>
            <button
              onClick={() => {
                const newGame = initializeGame();
                setGameState(newGame);
                setGameOver(false);
                setIsWinner(false);
                setShowAccusationForm(false);
                setAccusation({ suspect: '', victim: '', weapon: '', motive: '', location: '' });
                setMessage('New investigation started. Good luck, Detective.');
                setDiceValue(null);
              }}
              className="bg-red-800 hover:bg-red-900 text-white font-bold py-3 px-8 rounded typewriter"
            >
              NEW CASE
            </button>
          </div>
        )}

        {!gameOver && (
          <>
            {/* Message Display */}
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-4 worn-edges">
              <p className="typewriter text-gray-800">{message}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Main Game Area */}
              <div className="lg:col-span-2 space-y-4">
                {/* Current Room */}
                <div className="bg-[#f5f1e8] p-6 rounded-sm worn-edges">
                  <h2 className="text-2xl font-bold typewriter mb-2 text-gray-800 stamped-text">
                    📍 {currentRoom.name}
                  </h2>
                  <p className="typewriter text-gray-700 mb-4">{currentRoom.description}</p>

                  {/* Dice Roll */}
                  <div className="flex gap-4 items-center mb-4">
                    <button
                      onClick={handleRollDice}
                      disabled={diceValue !== null}
                      className={`bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded typewriter
                        ${diceValue !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      🎲 Roll Dice
                    </button>
                    {diceValue !== null && (
                      <span className="text-3xl font-bold typewriter">
                        Rolled: {diceValue}
                      </span>
                    )}
                  </div>

                  {/* Connected Rooms */}
                  <div>
                    <h3 className="font-bold typewriter mb-2 text-gray-800">Connected Rooms:</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {connectedRooms.map(room => (
                        <button
                          key={room.id}
                          onClick={() => handleMoveToRoom(room.id)}
                          disabled={diceValue === null}
                          className={`bg-green-700 hover:bg-green-800 text-white p-3 rounded typewriter text-sm
                            ${diceValue === null ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          🚪 {room.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Game Map */}
                <div className="bg-[#f5f1e8] p-6 rounded-sm worn-edges">
                  <h3 className="font-bold typewriter mb-3 text-gray-800 stamped-text">Estate Map</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {ROOMS.map(room => {
                      const isCurrentRoom = room.id === gameState.currentRoomId;
                      const isVisited = gameState.visitedRooms.has(room.id);
                      
                      return (
                        <div
                          key={room.id}
                          className={`p-3 rounded text-center typewriter text-xs border-2
                            ${isCurrentRoom ? 'bg-red-700 text-white border-red-900' : 
                              isVisited ? 'bg-green-100 border-green-600' : 'bg-gray-200 border-gray-400'}`}
                        >
                          {isCurrentRoom && '👤 '}
                          {room.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Actions */}
                <div className="bg-[#f5f1e8] p-4 rounded-sm worn-edges">
                  <h3 className="font-bold typewriter mb-3 text-gray-800 stamped-text">Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={handleGetHint}
                      className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded typewriter text-sm"
                    >
                      💡 Get Hint
                    </button>
                    <button
                      onClick={() => setShowAccusationForm(!showAccusationForm)}
                      className="w-full bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded typewriter text-sm"
                    >
                      ⚖️ Make Accusation
                    </button>
                  </div>
                </div>

                {/* Clues Discovered */}
                <div className="bg-[#f5f1e8] p-4 rounded-sm worn-edges max-h-96 overflow-y-auto">
                  <h3 className="font-bold typewriter mb-3 text-gray-800 stamped-text">
                    📋 Clues ({gameState.discoveredClues.length})
                  </h3>
                  <div className="space-y-2">
                    {gameState.discoveredClues.length === 0 ? (
                      <p className="text-sm typewriter text-gray-600">No clues discovered yet.</p>
                    ) : (
                      gameState.discoveredClues.map(clue => (
                        <div key={clue.id} className="bg-yellow-50 p-2 rounded border border-yellow-300">
                          <p className="text-xs typewriter text-gray-800">{clue.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Accusation Form */}
            {showAccusationForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-[#f5f1e8] p-6 rounded-sm worn-edges max-w-md w-full max-h-[90vh] overflow-y-auto">
                  <h2 className="text-2xl font-bold typewriter mb-4 text-gray-800 stamped-text">
                    Make Your Accusation
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block typewriter font-bold mb-1 text-sm">Suspect:</label>
                      <select
                        value={accusation.suspect}
                        onChange={(e) => setAccusation({ ...accusation, suspect: e.target.value })}
                        className="w-full p-2 border border-gray-400 rounded typewriter"
                      >
                        <option value="">Select suspect...</option>
                        {SUSPECTS.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block typewriter font-bold mb-1 text-sm">Victim:</label>
                      <select
                        value={accusation.victim}
                        onChange={(e) => setAccusation({ ...accusation, victim: e.target.value })}
                        className="w-full p-2 border border-gray-400 rounded typewriter"
                      >
                        <option value="">Select victim...</option>
                        {VICTIMS.map(v => (
                          <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block typewriter font-bold mb-1 text-sm">Weapon:</label>
                      <select
                        value={accusation.weapon}
                        onChange={(e) => setAccusation({ ...accusation, weapon: e.target.value })}
                        className="w-full p-2 border border-gray-400 rounded typewriter"
                      >
                        <option value="">Select weapon...</option>
                        {WEAPONS.map(w => (
                          <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block typewriter font-bold mb-1 text-sm">Motive:</label>
                      <select
                        value={accusation.motive}
                        onChange={(e) => setAccusation({ ...accusation, motive: e.target.value })}
                        className="w-full p-2 border border-gray-400 rounded typewriter"
                      >
                        <option value="">Select motive...</option>
                        {MOTIVES.map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block typewriter font-bold mb-1 text-sm">Location:</label>
                      <select
                        value={accusation.location}
                        onChange={(e) => setAccusation({ ...accusation, location: e.target.value })}
                        className="w-full p-2 border border-gray-400 rounded typewriter"
                      >
                        <option value="">Select location...</option>
                        {ROOMS.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2 mt-6">
                      <button
                        onClick={handleMakeAccusation}
                        className="flex-1 bg-red-800 hover:bg-red-900 text-white font-bold py-3 px-4 rounded typewriter"
                      >
                        Submit Accusation
                      </button>
                      <button
                        onClick={() => setShowAccusationForm(false)}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded typewriter"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
