'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    nom: '',
    metier: '',
    ville: '',
    quartier: '',
    telephone: '',
    prixBas: '',
    description: '',
  });

  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('❌ Pas d\'utilisateur connecté');
        router.push('/login');
        return;
      }
      
      console.log('✅ Utilisateur connecté:', user.email);
      setUser(user);
      
      // Charger les infos du prestataire
      const { data: providerData } = await supabase
        .from('providers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      console.log('📊 Données prestataire:', providerData);
      
      if (providerData) {
        setProvider(providerData);
        setFormData({
          nom: providerData.nom || '',
          metier: providerData.metier || '',
          ville: providerData.ville || '',
          quartier: providerData.quartier || '',
          telephone: providerData.telephone || '',
          prixBas: providerData.prixBas?.toString() || '',
          description: providerData.description || '',
        });
      }
    } catch (err) {
      console.error('Erreur chargement profil:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('providers')
        .upsert({
          id: provider?.id,
          user_id: user?.id,
          ...formData,
          prixBas: parseInt(formData.prixBas) || 0,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      setMessage({ type: 'success', text: '✅ Modifications enregistrées !' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erreur lors de la sauvegarde' });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm('⚠️ Supprimer définitivement votre fiche ?')) return;
    
    try {
      const { error } = await supabase
        .from('providers')
        .delete()
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      alert('Fiche supprimée. Déconnexion...');
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (err: any) {
      alert('Erreur: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#006A4E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="header-flag p-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-white hover:opacity-90 transition">
            <span className="text-2xl">🇹🇬</span>
            <span className="font-bold">TogoService</span>
          </Link>
          <button 
            onClick={handleSignOut}
            className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 mt-6">
        {message && (
          <div className={`p-4 rounded-lg mb-4 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* En-tête profil */}
          <div className="bg-gradient-to-r from-[#006A4E] to-[#008B6B] p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                👤
              </div>
              <div>
                <h1 className="text-xl font-bold">{formData.nom || 'Mon profil'}</h1>
                <p className="text-sm opacity-90">{user.email}</p>
                {provider?.created_at && (
                  <p className="text-xs opacity-75 mt-1">
                    Membre depuis {new Date(provider.created_at).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'activité *</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  className="input-togo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Métier *</label>
                <input
                  type="text"
                  name="metier"
                  value={formData.metier}
                  onChange={handleChange}
                  required
                  className="input-togo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Lomé"
                  className="input-togo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quartier *</label>
                <input
                  type="text"
                  name="quartier"
                  value={formData.quartier}
                  onChange={handleChange}
                  required
                  className="input-togo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                  placeholder="+228..."
                  className="input-togo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix de base (FCFA) *</label>
                <input
                  type="number"
                  name="prixBas"
                  value={formData.prixBas}
                  onChange={handleChange}
                  required
                  min="0"
                  className="input-togo"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="input-togo resize-none"
                placeholder="Décrivez vos services..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="btn-togo flex-1 flex justify-center items-center gap-2"
              >
                {saving ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Enregistrement...</>
                ) : '💾 Enregistrer'}
              </button>
              <Link href="/" className="btn-togo-secondary flex-1 text-center">
                🔙 Voir ma fiche
              </Link>
            </div>
          </form>

          {/* Zone danger */}
          <div className="px-6 pb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 text-sm mb-2">⚠️ Zone de danger</h3>
              <button
                onClick={handleDelete}
                className="text-sm text-red-600 hover:text-red-800 font-medium underline"
              >
                Supprimer définitivement ma fiche
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}