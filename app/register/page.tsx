'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!data?.user) throw new Error('Erreur création compte');

      const { error: providerError } = await supabase
        .from('providers')
        .insert({
          nom: formData.nom, metier: formData.metier, ville: formData.ville,
          quartier: formData.quartier, telephone: formData.telephone,
          prixBas: parseInt(formData.prixBas) || 0, description: formData.description,
          user_id: data.user.id, email: formData.email, actif: true,
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 py-12">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-slate-700 animate-fade-in-up">
        <div className="text-center mb-8">
          <span className="text-5xl">🇹🇬</span>
          <h1 className="text-3xl font-bold text-white mt-4">Devenir prestataire</h1>
          <p className="text-slate-400 text-sm mt-2">Rejoignez TogoService et trouvez des clients</p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-togo" placeholder="votre@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Mot de passe</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} className="input-togo" placeholder="••••••••" />
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6 space-y-4">
            <h3 className="text-lg font-bold text-[#FFCE00]">Informations de l'activité</h3>
            
            <input type="text" name="nom" value={formData.nom} onChange={handleChange} required className="input-togo" placeholder="Nom de l'activité" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="metier" value={formData.metier} onChange={handleChange} required className="input-togo" placeholder="Métier" />
              <input type="text" name="ville" value={formData.ville} onChange={handleChange} required className="input-togo" placeholder="Ville" />
              <input type="text" name="quartier" value={formData.quartier} onChange={handleChange} required className="input-togo" placeholder="Quartier" />
              <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} required className="input-togo" placeholder="Téléphone" />
              <input type="number" name="prixBas" value={formData.prixBas} onChange={handleChange} required className="input-togo" placeholder="Prix (FCFA)" />
            </div>
            
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="input-togo resize-none" placeholder="Description..." />
          </div>

          <button type="submit" disabled={loading} className="btn-togo w-full mt-4 text-lg">
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Déjà inscrit ? <Link href="/login" className="text-[#FFCE00] font-bold hover:text-yellow-300 transition">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}