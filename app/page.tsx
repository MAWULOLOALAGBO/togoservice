import { supabase } from '@/lib/supabaseClient';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import Link from 'next/link';

export default async function Home({ searchParams }: { 
  searchParams: { search?: string; ville?: string; metier?: string } 
}) {
  const search = searchParams.search || '';
  const ville = searchParams.ville || '';
  const metier = searchParams.metier || '';
  
  const {  data } = await supabase.from('providers').select('*');

  let filteredData = data || [];

  if (search) {
    filteredData = filteredData.filter((p) =>
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.metier.toLowerCase().includes(search.toLowerCase()) ||
      p.ville.toLowerCase().includes(search.toLowerCase()) ||
      p.quartier.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (ville) filteredData = filteredData.filter((p) => p.ville === ville);
  if (metier) filteredData = filteredData.filter((p) => p.metier === metier);

  filteredData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      
      {/* 🇹🇬 HEADER AVEC ARMOIRIES ET DRAPEAU */}
      <header className="header-togo p-5 shadow-2xl sticky top-0 z-50 relative">
        {/* Drapeau animé en background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#006A4E] via-[#FFCE00] to-[#D21034] opacity-20 animate-pulse"></div>
        
        <div className="max-w-6xl mx-auto flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            {/* SVG Armoiries du Togo Simplifié */}
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#FFCE00]">
              <svg viewBox="0 0 50 50" className="w-8 h-8">
                <polygon points="25,5 30,20 45,20 32,30 37,45 25,35 13,45 18,30 5,20 20,20" fill="#006A4E" stroke="#FFCE00" strokeWidth="2"/>
                <text x="25" y="48" fontSize="5" textAnchor="middle" fill="white" fontWeight="bold">TG</text>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">TogoService</h1>
              <p className="text-xs text-white/80">Prestataires locaux</p>
            </div>
          </div>
          
          <nav className="flex gap-4 text-sm font-bold">
            <Link href="/login" className="hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 border border-white/30 hover:border-white">
              Connexion
            </Link>
            <Link href="/register" className="bg-[#FFCE00] text-[#006A4E] px-5 py-2 rounded-lg font-bold hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl">
              S'inscrire
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO ANIMÉ */}
      <section className="bg-gradient-to-b from-slate-800 to-slate-900 py-12 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
            Trouvez un <span className="text-[#FFCE00]">prestataire</span>
          </h2>
          <p className="text-slate-300 text-lg mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Plombiers, couturières, répétiteurs, électriciens...
          </p>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* CONTENU */}
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 animate-slide-in-left">
              <Filters providers={data || []} />
            </div>
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-slate-300 font-bold">
                {filteredData.length} prestataire{filteredData.length !== 1 ? 's' : ''}
              </div>

              {filteredData.length > 0 ? (
                filteredData.map((p: any, index: number) => (
                  <article
                    key={p.id}
                    className="card-provider"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-xl text-white mb-2">{p.nom}</h3>
                        <span className="badge-metier">{p.metier}</span>
                      </div>
                      <span className="text-[#FFCE00] font-bold text-2xl">{p.prixBas} F</span>
                    </div>
                    <p className="text-slate-300 mb-4">{p.description}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                      <span></span><span>{p.ville} • {p.quartier}</span>
                    </div>
                    <a href={`https://wa.me/${p.telephone?.replace(/\D/g, '')}`} target="_blank" className="btn-whatsapp block w-full text-center">
                      💬 Contacter sur WhatsApp
                    </a>
                  </article>
                ))
              ) : (
                <div className="text-center py-16 bg-slate-800 rounded-2xl border border-slate-700 animate-fade-in-up">
                  <div className="text-6xl mb-4 animate-float"></div>
                  <p className="text-slate-300 text-xl">Aucun résultat</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-8 mt-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-3">
            <span className="text-2xl">🇬</span>
            <span className="font-bold text-white">TogoService</span>
          </div>
          <p>© 2025 TogoService. Fait avec ❤️ au Togo.</p>
        </div>
      </footer>
    </div>
  );
}