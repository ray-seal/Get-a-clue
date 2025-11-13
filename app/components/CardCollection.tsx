'use client';

export default function CardCollection() {
  return (
    <div className="bg-[#f5f1e8] p-6 rounded-sm worn-edges">
      <h3 className="text-2xl font-bold typewriter mb-4 text-gray-800 stamped-text text-center">
        🎴 Card Collection
      </h3>
      
      <div className="space-y-4">
        {/* Coming Soon Message */}
        <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded text-center">
          <p className="typewriter text-lg font-bold text-gray-800 mb-2">
            Coming Soon!
          </p>
          <p className="typewriter text-sm text-gray-700">
            Collect mystery cards, trade with other detectives, and build your collection.
          </p>
          <p className="typewriter text-xs text-gray-600 mt-3">
            Will integrate with Firebase for persistent cards and trading.
          </p>
        </div>

        {/* Disabled Purchase Button */}
        <button
          disabled
          className="w-full bg-gray-400 text-white font-bold py-3 px-6 rounded typewriter cursor-not-allowed opacity-60"
        >
          🎁 Purchase Card Pack (Coming Soon)
        </button>

        {/* Disabled Trading Button */}
        <button
          disabled
          className="w-full bg-gray-400 text-white font-bold py-3 px-6 rounded typewriter cursor-not-allowed opacity-60"
        >
          🔄 Trade Cards (Coming Soon)
        </button>

        {/* Info Text */}
        <div className="text-center pt-4 border-t border-gray-400">
          <p className="typewriter text-xs text-gray-600">
            Future features: Card packs, trading marketplace, card ownership via Firebase Authentication
          </p>
        </div>
      </div>
    </div>
  );
}
