'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Mise à jour de l'URL en temps réel
    if (value.trim()) {
      router.push(`/?search=${encodeURIComponent(value)}`, { scroll: false });
    } else {
      router.push('/', { scroll: false });
    }
  };

  const handleClear = () => {
    setQuery('');
    router.push('/', { scroll: false });
  };

  return (
    <div className="relative max-w-md mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Ex: Plombier à Lomé..."
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#006A4E] focus:ring-2 focus:ring-green-100 transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 rounded-lg font-medium transition"
          >
            ✕
          </button>
        )}
        <button 
          className="bg-[#006A4E] hover:bg-green-800 text-white px-6 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          🔍
        </button>
      </div>
      
      {query && (
        <p className="text-xs text-gray-500 mt-2 text-left">
          Recherche : "{query}"
        </p>
      )}
    </div>
  );
}