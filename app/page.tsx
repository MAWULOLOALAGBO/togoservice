import { supabase } from '@/lib/supabaseClient';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import Link from 'next/link';

export default async function Home({ searchParams }: { 
  searchParams: { 
    search?: string;
    ville?: string;
    metier?: string;
  } 
}) {
  const search = searchParams.search || '';
  const ville = searchParams.ville || '';
  const metier = searchParams.metier || '';
  
  // ✅ CORRECTION: Utiliser 'data' pas 'allData'
  const {  data } = await supabase
    .from('providers')
    .select('*');

  // Filtrer les résultats
  let filteredData = data || [];

  if (search) {
    filteredData = filteredData.filter((p) =>
      p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.metier.toLowerCase().includes(search.toLowerCase()) ||
      p.ville.toLowerCase().includes(search.toLowerCase()) ||
      p.quartier.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (ville) {
    filteredData = filteredData.filter((p) => p.ville === ville);
  }

  if (metier) {
    filteredData = filteredData.filter((p) => p.metier === metier);
  }

  // Trier par date
  filteredData.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* HEADER */}
      <header className="bg-gradient-to-r from-[#006A4E] via-[#FFCE00] to-[#D21034] text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🇹🇬</span>
            <div>
              <h1 className="text-xl font-bold tracking-wide">TogoService</h1>
              <p className="text-xs opacity-90">Prestataires locaux</p>
            </div>
          </div>
          <nav className="flex gap-4 text-sm font-medium">
            <Link href="/login" className="hover:text-white/80 transition">Connexion</Link>
            <Link href="/register" className="bg-white text-[#006A4E] px-4 py-1.5 rounded-lg font-bold hover:bg-gray-100 transition shadow-md">
              S'inscrire
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
            Trouvez un prestataire de confiance
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Plombiers, couturières, répétiteurs, électriciens...
          </p>
          <SearchBar />
        </div>
      </section>

      {/* CONTENU */}
      <main className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Filtres - On passe TOUTES les données */}
            <div className="md:col-span-1">
              <Filters providers={data || []} />
            </div>

            {/* Résultats */}
            <div className="md:col-span-3 space-y-4">
              
              {/* Compteur */}
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-700 font-medium">
                  {filteredData.length} prestataire{filteredData.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Liste */}
              {filteredData.length > 0 ? (
                filteredData.map((p: any) => (
                  <article
                    key={p.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{p.nom}</h3>
                        <span className="inline-block bg-green-50 text-[#006A4E] text-xs px-2.5 py-1 rounded-full font-medium mt-1">
                          {p.metier}
                        </span>
                      </div>
                      <span className="text-[#006A4E] font-bold text-lg">{p.prixBas} F</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">{p.description}</p>

                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                      <span>📍</span>
                      <span>{p.ville} • {p.quartier}</span>
                    </div>

                    <a
                      href={`https://wa.me/${p.telephone?.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-[#25D366] hover:bg-green-600 text-white py-2.5 rounded-lg font-bold transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                    >
                      💬 Contacter sur WhatsApp
                    </a>
                  </article>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-gray-500 text-lg">Aucun résultat</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-6 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm">
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="text-2xl">🇹🇬</span>
            <span className="font-bold text-white">TogoService</span>
          </div>
          <p>© 2025 TogoService. Fait avec ❤️ au Togo.</p>
        </div>
      </footer>

    </div>
  );
}