import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default async function Home() {
  const {  data } = await supabase
    .from('providers')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* HEADER */}
      <header className="bg-[#006A4E] text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇹🇬</span>
            <h1 className="text-xl font-bold tracking-wide">TogoService</h1>
          </div>
          <nav className="flex gap-4 text-sm font-medium">
            <Link href="/login" className="hover:text-[#FFCE00] transition">Connexion</Link>
            <Link href="/register" className="bg-[#FFCE00] text-[#006A4E] px-3 py-1.5 rounded-lg font-bold hover:bg-yellow-300 transition shadow-sm">
              S'inscrire
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Trouvez un prestataire de confiance
          </h2>
          <p className="text-gray-600 mb-6">Plombiers, couturières, répétiteurs, électriciens...</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Ex: Plombier à Lomé..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E] transition"
            />
            <button className="bg-[#006A4E] hover:bg-green-800 text-white px-5 rounded-lg font-medium transition shadow">
              Rechercher
            </button>
          </div>
        </div>
      </section>

      {/* LISTE */}
      <main className="flex-1 p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {data && data.length > 0 ? (
            data.map((p: any) => (
              <article
                key={p.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
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
                  className="block w-full text-center bg-[#25D366] hover:bg-green-600 text-white py-2.5 rounded-lg font-bold transition-colors shadow-sm"
                >
                  💬 Contacter sur WhatsApp
                </a>
              </article>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow">
              <p className="text-gray-500">Aucun prestataire disponible pour le moment.</p>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-6 mt-8">
        <div className="max-w-2xl mx-auto px-4 text-center text-sm">
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="text-xl">🇹🇬</span>
            <span className="font-bold text-white">TogoService</span>
          </div>
          <p>© 2025 TogoService. Fait avec ❤️ au Togo.</p>
        </div>
      </footer>

    </div>
  );
}