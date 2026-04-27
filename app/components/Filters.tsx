'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FiltersProps {
  providers: any[];
}

export default function Filters({ providers }: FiltersProps) {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extraire les villes et métiers uniques
  const cities = Array.from(new Set(providers.map((p) => p.ville))).sort();
  const jobs = Array.from(new Set(providers.map((p) => p.metier))).sort();

  // Initialiser depuis l'URL
  useEffect(() => {
    setSelectedCity(searchParams.get('ville') || '');
    setSelectedJob(searchParams.get('metier') || '');
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (selectedCity) params.set('ville', selectedCity);
    if (selectedJob) params.set('metier', selectedJob);
    
    router.push(`/?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedCity('');
    setSelectedJob('');
    router.push('/');
  };

  const hasActiveFilters = selectedCity || selectedJob;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-3">
      
      {/* Ville */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ville
        </label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E] bg-white"
        >
          <option value="">Toutes les villes</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Métier */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Métier
        </label>
        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E] bg-white"
        >
          <option value="">Tous les métiers</option>
          {jobs.map((job) => (
            <option key={job} value={job}>
              {job}
            </option>
          ))}
        </select>
      </div>

      {/* Bouton Appliquer */}
      <button
        onClick={applyFilters}
        className="w-full bg-[#006A4E] hover:bg-green-800 text-white font-semibold py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg"
      >
        Rechercher
      </button>

      {/* Réinitialiser si filtres actifs */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full text-sm text-gray-500 hover:text-gray-700 py-1"
        >
          Voir tous les prestataires
        </button>
      )}

      {/* Tags des filtres actifs */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {selectedCity && (
            <span className="text-xs bg-green-50 text-[#006A4E] px-2 py-1 rounded-full">
              📍 {selectedCity}
            </span>
          )}
          {selectedJob && (
            <span className="text-xs bg-yellow-50 text-yellow-800 px-2 py-1 rounded-full">
              💼 {selectedJob}
            </span>
          )}
        </div>
      )}
    </div>
  );
}