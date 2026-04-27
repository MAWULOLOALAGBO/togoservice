'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // ✅ On utilise notre client existant
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nom: '', metier: '', ville: '', quartier: '',
    telephone: '', prixBas: '', description: '',
    email: '', password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Création compte
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erreur création compte');

      // 2. Ajout prestataire
      const { error: providerError } = await supabase
        .from('providers')
        .insert({
          nom: formData.nom,
          metier: formData.metier,
          ville: formData.ville,
          quartier: formData.quartier,
          telephone: formData.telephone,
          prixBas: parseInt(formData.prixBas) || 0,
          description: formData.description,
          user_id: authData.user.id,
          actif: true,
        });

      if (providerError) throw providerError;

      alert('✅ Inscription réussie !');
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <span className="text-4xl">🇹🇬</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Devenir prestataire</h1>
          <p className="text-gray-600 text-sm mt-1">Rejoignez TogoService</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-b border-gray-200 pb-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Connexion</h3>
            <div className="space-y-3">
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email" className="input-togo" />
              <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} placeholder="Mot de passe (min. 6 caractères)" className="input-togo" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Activité</h3>
            <input type="text" name="nom" value={formData.nom} onChange={handleChange} required placeholder="Nom de l'activité" className="input-togo" />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" name="metier" value={formData.metier} onChange={handleChange} required placeholder="Métier" className="input-togo" />
              <select name="ville" value={formData.ville} onChange={handleChange} required className="input-togo">
                <option value="">Ville</option>
                <option value="Lomé">Lomé</option>
                <option value="Kpalimé">Kpalimé</option>
                <option value="Sokodé">Sokodé</option>
                <option value="Kara">Kara</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" name="quartier" value={formData.quartier} onChange={handleChange} required placeholder="Quartier" className="input-togo" />
              <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} required placeholder="+228..." className="input-togo" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" name="prixBas" value={formData.prixBas} onChange={handleChange} required min="0" placeholder="Prix (FCFA)" className="input-togo" />
            </div>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Description..." className="input-togo resize-none" />
          </div>

          <button type="submit" disabled={loading} className="btn-togo w-full mt-4">
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Déjà inscrit ? <Link href="/login" className="text-[#006A4E] font-semibold hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}