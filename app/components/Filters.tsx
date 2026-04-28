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

  const cities = Array.from(new Set(providers.map((p) => p.ville))).sort();
  const jobs = Array.from(new Set(providers.map((p) => p.metier))).sort();

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
    <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-lg space-y-4 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-white text-lg">🔍 Filtres</h3>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-sm text-[#D21034] hover:text-red-400 font-medium transition">
            Réinitialiser
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Ville</label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E] text-white"
        >
          <option value="">Toutes les villes</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Métier</label>
        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E] text-white"
        >
          <option value="">Tous les métiers</option>
          {jobs.map((job) => (
            <option key={job} value={job}>{job}</option>
          ))}
        </select>
      </div>

      <button
        onClick={applyFilters}
        className="w-full bg-[#006A4E] hover:bg-green-600 text-white font-bold py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
      >
        Rechercher
      </button>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-600">
          {selectedCity && (
            <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded-full">📍 {selectedCity}</span>
          )}
          {selectedJob && (
            <span className="text-xs bg-yellow-900 text-yellow-300 px-2 py-1 rounded-full">💼 {selectedJob}</span>
          )}
        </div>
      )}
    </div>
  );
}