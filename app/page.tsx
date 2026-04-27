import { supabase } from '@/lib/supabaseClient'

export default async function Home() {
  const { data: providers, error } = await supabase
    .from('providers')
    .select('*')

  if (error) {
    console.error('Erreur Supabase:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        TogoService 🇹
      </h1>
      
      <p className="mb-4 text-gray-600">
        {providers?.length || 0} prestataires trouvés
      </p>

      <div className="space-y-4">
        {providers?.map((p: any) => (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <h2 className="font-bold">{p.nom}</h2>
            <p className="text-sm text-gray-600">{p.metier}</p>
            <p className="text-sm text-gray-500">{p.ville}</p>
            <a 
              href={`https://wa.me/${p.telephone}`} 
              className="mt-2 inline-block bg-green-500 text-white px-4 py-2 rounded text-sm"
              target="_blank"
            >
              WhatsApp
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}