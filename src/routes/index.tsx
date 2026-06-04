import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Wifi, WifiOff, Plus, AlertCircle, Sparkles, KeyRound } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: Dashboard,
});

function Dashboard() {
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // 1. Live Network Monitor
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 2. The Read Pipe (Automatically caches to IndexedDB)
  const { data: animals, isLoading, error } = useQuery({
    queryKey: ['animals'],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        // Fall back to localStorage simulation to allow demo run
        const raw = localStorage.getItem('simulated_animals');
        if (raw) return JSON.parse(raw);
        const defaultAnimals = [
          { id: '1', name: 'Barn Owl (Demo)', species: 'Tyto alba', is_demo: true },
          { id: '2', name: 'Golden Eagle (Demo)', species: 'Aquila chrysaetos', is_demo: true }
        ];
        localStorage.setItem('simulated_animals', JSON.stringify(defaultAnimals));
        return defaultAnimals;
      }

      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data;
    },
  });

  // 3. The Write Pipe (Automatically queues to IndexedDB if offline)
  const addAnimalMutation = useMutation({
    mutationFn: async () => {
      const demoAnimal = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
        entity_type: 'Bird',
        census_count: 1,
        weight_unit: 'g',
        red_list_status: 'LC',
        display_order: 1,
        name: `Test Subject ${Math.floor(Math.random() * 1000)}`,
        species: 'Tyto alba',
        is_demo: true
      };

      if (!isSupabaseConfigured) {
        // Simulate network latency for demo purposes
        await new Promise((resolve) => setTimeout(resolve, 500));
        const raw = localStorage.getItem('simulated_animals');
        const current = raw ? JSON.parse(raw) : [];
        const next = [demoAnimal, ...current];
        localStorage.setItem('simulated_animals', JSON.stringify(next));
        return [demoAnimal];
      }

      const { data, error } = await supabase.from('animals').insert([{
        entity_type: 'Bird',
        census_count: 1,
        weight_unit: 'g',
        red_list_status: 'LC',
        display_order: 1,
        name: `Test Subject ${Math.floor(Math.random() * 1000)}`,
        species: 'Tyto alba',
      }]).select();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
  });

  if (isLoading) return <div className="p-6">Syncing Database...</div>;
  if (error) return <div className="p-6 text-red-600 border border-red-200 bg-red-50 rounded-md">Error: {error.message}</div>;

  return (
    <div className="max-w-4xl space-y-6">
      
      {/* Configuration Status Notice when Credentials are missing */}
      {!isSupabaseConfigured && (
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-950 p-5 rounded-xl shadow-sm space-y-3">
          <div className="flex items-center gap-2.5">
            <KeyRound className="text-indigo-600 shrink-0" size={22} />
            <span className="font-bold text-base">Configuration Setup Guideline</span>
          </div>
          <p className="text-sm text-indigo-900 leading-relaxed">
            Your Supabase project credential keys are missing. To connect your live cloud database, configure them via the <strong className="text-indigo-950">Secrets</strong> menu in the AI Studio editor settings:
          </p>
          <div className="bg-indigo-950 text-indigo-200 p-3 rounded-lg font-mono text-[11px] leading-relaxed select-all">
            VITE_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"<br />
            VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
          </div>
          <div className="text-xs text-indigo-700 font-semibold flex items-center gap-1.5 pt-1">
            <Sparkles size={14} /> Simulated Sandbox mode activated. You can completely test adding records, cache retention, and offline queueing loops right now!
          </div>
        </div>
      )}

      {/* Network Status Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <h1 className="text-xl font-bold text-slate-800">Telemetry Test</h1>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
          {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
          {isOnline ? 'System Online (Live Sync)' : 'System Offline (Caching Locally)'}
        </div>
      </div>

      {/* Offline Warning Banner */}
      {!isOnline && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold">Offline Mode Active</h3>
            <p className="text-sm mt-1">Any records added now will be stored in IndexedDB and automatically pushed to Supabase when the connection is restored.</p>
          </div>
        </div>
      )}

      {/* Database Controls */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Collection Census</h2>
          <button 
            onClick={() => addAnimalMutation.mutate()}
            disabled={addAnimalMutation.isPending && isOnline}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium disabled:opacity-50"
          >
            <Plus size={16} />
            {addAnimalMutation.isPending && isOnline ? 'Inserting...' : addAnimalMutation.isPaused ? 'Queued Offline' : 'Add Test Animal'}
          </button>
        </div>

        {/* Data Grid */}
        <div className="border border-slate-200 rounded-md overflow-hidden">
          {animals?.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No records found. The database is empty.</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Species</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {animals?.map((animal: any) => (
                  <tr key={animal.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{animal.name}</td>
                    <td className="px-4 py-3 text-slate-500">{animal.species}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${animal.is_demo ? 'bg-indigo-50 text-indigo-700 border border-indigo-150' : 'bg-emerald-50 text-emerald-700 border border-emerald-150'}`}>
                        {animal.is_demo ? 'Local Sandbox' : 'Synced'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}