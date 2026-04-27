import { supabase } from '@/lib/supabaseClient'

export default async function Home() {
  let providers: any[] = []

  try {
    const { data, error } = await supabase
      .from('providers')
      .select('*')

    if (error) throw error
    providers = data || []
  } catch (error) {
    console.error('Erreur:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">TogoService 🇹</h1>
          <span className="text-xs bg-blue-800 px-2 py-1 rounded">
            {providers.length} disponibles
          </span>
        </div>
      </header>

      {/* LISTE */}
      <main className="p-4 max-w-md mx-auto space-y-4">
        {providers.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="font-bold text-gray-