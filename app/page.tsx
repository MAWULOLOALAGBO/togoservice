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
      
      <header className="bg-gradient-to-r from-[#006A4E] via-[#FFCE00] to-[#D21034] p-5 shadow-2xl sticky top-0 z-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')] animate-pulse"></div>
        </div>
        
        <div className="max-w-6xl mx-auto flex justify-between items-center relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full p-2 shadow-xl border-4 border-[#FFCE00] animate-pulse-slow">
              <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-lg">
                <g transform="translate(50, 30)">
                  <g transform="rotate(-25)">
                    <rect x="-15" y="-10" width="15" height="20" fill="#006A4E"/>
                    <rect x="0" y="-10" width="15" height="20" fill="#FFCE00"/>
                    <rect x="15" y="-10" width="15" height="20" fill="#FFCE00"/>
                    <rect x="30" y="-10" width="15" height="20" fill="#FFFFFF"/>
                    <rect x="45" y="-10" width="15" height="20" fill="#D21034"/>
                    <polygon points="7,-3 8,1 12,1 9,4 10,8 7,5 4,8 5,4 2,1 6,1" fill="#FFFFFF"/>
                  </g>
                  <g transform="rotate(25)">
                    <rect x="-15" y="-10" width="15" height="20" fill="#006A4E"/>
                    <rect x="0" y="-10" width="15" height="20" fill="#FFCE00"/>
                    <rect x="15" y="-10" width="15" height="20" fill="#FFCE00"/>
                    <rect x="30" y="-10" width="15" height="20" fill="#FFFFFF"/>
                    <rect x="45" y="-10" width="15" height="20" fill="#D21034"/>
                    <polygon points="7,-3 8,1 12,1 9,4 10,8 7,5 4,8 5,4 2,1 6,1" fill="#FFFFFF"/>
                  </g>
                </g>
                <g transform="translate(50, 52)">
                  <circle cx="0" cy="0" r="15" fill="#FFCE00" stroke="#D21034" strokeWidth="2"/>
                  <text x="0" y="5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#000">RT</text>
                </g>
                <path d="M25,85 Q20,80 22,75 Q25,70 28,75 Q30,80 28,90 Z" fill="#D21034"/>
                <circle cx="25" cy="78" r="4" fill="#D21034"/>
                <path d="M75,85 Q80,80 78,75 Q75,70 72,75 Q70,80 72,90 Z" fill="#D21034"/>
                <circle cx="75" cy="78" r="4" fill="#D21034"/>
                <text x="50" y="12" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#006A4E" letterSpacing="1">TRAVAIL LIBERTÉ PATRIE</text>
              </svg>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">TogoService</h1>
              <p className="text-xs text-white/90 font-medium">Prestataires locaux de confiance</p>
            </div>
          </div>
          
          <nav className="flex gap-4 text-sm font-bold">
            <Link href="/login" className="hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 border border-white/30 hover:border-white backdrop-blur-sm">
              Connexion
            </Link>
            <Link href="/register" className="bg-[#006A4E] text-white px-5 py-2 rounded-lg font-bold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-[#FFCE00]">
              S&apos;inscrire
            </Link>
          </nav>
        </div>
      </header>

      <section className="bg-gradient-to-b from-slate-800 to-slate-900 py-12 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
            Trouvez un <span className="text-[#FFCE00]">prestataire</span>
          </h2>
          <p className="text-slate-300 text-lg mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Plombiers, couturi&egrave;res, r&eacute;p&eacute;titeurs, &eacute;lectriciens...
          </p>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <SearchBar />
          </div>
        </div>
      </section>

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
                      <span>📍</span><span>{p.ville} • {p.quartier}</span>
                    </div>
                    <a href={`https://wa.me/${p.telephone?.replace(/\D/g, '')}`} target="_blank" className="btn-whatsapp block w-full text-center">
                      💬 Contacter sur WhatsApp
                    </a>
                  </article>
                ))
              ) : (
                <div className="text-center py-16 bg-slate-800 rounded-2xl border border-slate-700 animate-fade-in-up">
                  <div className="text-6xl mb-4 animate-float">🔍</div>
                  <p className="text-slate-300 text-xl">Aucun r&eacute;sultat</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-950 text-slate-400 py-8 mt-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-3">
            <span className="text-2xl">🇹🇬</span>
            <span className="font-bold text-white">TogoService</span>
          </div>
          <p>© 2025 TogoService. Fait avec ❤️ au Togo.</p>
        </div>
      </footer>
    </div>
  );
}