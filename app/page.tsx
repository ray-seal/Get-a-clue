'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [showMultiplayer, setShowMultiplayer] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 case-file">
      {/* Coffee stains positioned randomly */}
      <div className="coffee-stain-1" style={{ top: '10%', left: '15%' }}></div>
      <div className="coffee-stain-2" style={{ top: '60%', right: '20%' }}></div>
      <div className="coffee-stain-3" style={{ bottom: '15%', left: '25%' }}></div>
      
      <div className="max-w-2xl w-full bg-[#f5f1e8] p-8 md:p-12 rounded-sm worn-edges">
        {/* Case file header stamp */}
        <div className="text-center mb-8">
          <div className="inline-block border-4 border-red-800 px-6 py-3 rotate-[-2deg] mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-red-800 typewriter stamped-text">
              CASE FILE
            </h1>
          </div>
        </div>

        {/* Case details */}
        <div className="space-y-6 typewriter text-gray-800">
          <div className="border-l-4 border-gray-600 pl-4">
            <p className="text-sm text-gray-600 mb-1">CLASSIFICATION:</p>
            <h2 className="text-3xl font-bold stamped-text">TOP SECRET</h2>
          </div>

          <div className="space-y-3 text-base md:text-lg leading-relaxed">
            <p className="stamped-text">
              <span className="font-bold">CASE NO:</span> {Math.floor(Math.random() * 90000) + 10000}
            </p>
            
            <p className="stamped-text">
              <span className="font-bold">DATE:</span> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>

            <div className="my-6 border-t-2 border-gray-400 border-dashed"></div>

            <p className="stamped-text leading-loose">
              A mysterious incident has occurred at the grand estate. 
              Navigate the grid-based mansion, solve cases, and gain experience
              as a detective. Play solo or team up with other investigators!
            </p>

            <p className="stamped-text font-bold text-lg mt-4">
              Choose your mode of investigation:
            </p>
          </div>

          {/* Game Mode Selection */}
          {!showMultiplayer ? (
            <div className="mt-10 space-y-4">
              {/* Solo Play Button */}
              <Link 
                href="/game?mode=solo"
                className="block bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-12 rounded-sm 
                         shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-105 
                         typewriter text-xl text-center"
              >
                🎮 PLAY SOLO
              </Link>

              {/* Multiplayer Button */}
              <button
                onClick={() => setShowMultiplayer(true)}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 px-12 rounded-sm 
                         shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-105 
                         typewriter text-xl"
              >
                🌐 MULTIPLAYER
              </button>
            </div>
          ) : (
            <div className="mt-10 space-y-4">
              {/* Back Button */}
              <button
                onClick={() => setShowMultiplayer(false)}
                className="text-gray-600 hover:text-gray-800 typewriter text-sm mb-2"
              >
                ← Back to mode selection
              </button>

              {/* Create Room */}
              <Link 
                href="/game?mode=multiplayer"
                className="block bg-green-700 hover:bg-green-800 text-white font-bold py-4 px-12 rounded-sm 
                         shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-105 
                         typewriter text-xl text-center"
              >
                ➕ CREATE ROOM
              </Link>

              {/* Join Room */}
              <div className="space-y-2">
                <label className="block typewriter font-bold text-gray-800">
                  Or join an existing room:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toLowerCase())}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="flex-1 p-3 border-2 border-gray-400 rounded typewriter text-lg uppercase focus:border-green-600 focus:outline-none"
                  />
                  <Link
                    href={joinCode.length === 6 ? `/game?mode=multiplayer&room=${joinCode}` : '#'}
                    className={`bg-red-800 hover:bg-red-900 text-white font-bold py-3 px-6 rounded typewriter
                      ${joinCode.length !== 6 ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    JOIN
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Signature line */}
          <div className="mt-12 pt-6 border-t border-gray-400">
            <p className="text-sm text-gray-600 stamped-text text-center">
              DETECTIVE BUREAU • CONFIDENTIAL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
