'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CHARACTER_SPRITES } from '@/lib/models/player';

interface CharacterSelectProps {
  onSelect: (name: string, spriteId: string) => void;
}

export default function CharacterSelect({ onSelect }: CharacterSelectProps) {
  const [name, setName] = useState('');
  const [selectedSprite, setSelectedSprite] = useState(CHARACTER_SPRITES[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSelect(name.trim(), selectedSprite);
    }
  };

  return (
    <div className="bg-[#f5f1e8] p-8 rounded-sm worn-edges max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold typewriter mb-6 text-center text-gray-800 stamped-text">
        Choose Your Detective
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div>
          <label className="block typewriter font-bold mb-2 text-gray-800">
            Detective Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            maxLength={20}
            className="w-full p-3 border-2 border-gray-400 rounded typewriter text-lg focus:border-blue-600 focus:outline-none"
            required
          />
        </div>

        {/* Sprite Selection */}
        <div>
          <label className="block typewriter font-bold mb-3 text-gray-800">
            Choose Your Avatar:
          </label>
          <div className="grid grid-cols-3 gap-4">
            {CHARACTER_SPRITES.map((sprite) => (
              <button
                key={sprite.id}
                type="button"
                onClick={() => setSelectedSprite(sprite.id)}
                className={`p-4 rounded-lg border-4 transition-all ${
                  selectedSprite === sprite.id
                    ? 'border-blue-600 bg-blue-50 scale-105'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Image
                    src={`/assets/characters/${sprite.id}.svg`}
                    alt={sprite.name}
                    width={64}
                    height={64}
                    className="w-16 h-16"
                  />
                  <span className="typewriter text-sm font-semibold text-gray-800">
                    {sprite.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!name.trim()}
          className={`w-full bg-red-800 hover:bg-red-900 text-white font-bold py-4 px-6 rounded typewriter text-xl transition-all ${
            !name.trim() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Start Investigation
        </button>
      </form>
    </div>
  );
}
