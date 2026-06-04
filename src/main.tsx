import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, MutationCache } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import * as idb from 'idb-keyval';
import './index.css';

import { routeTree } from './routeTree.gen';

// The Maximum Read Cache Lifespan
const FOURTEEN_DAYS_MS = 1000 * 60 * 60 * 24 * 14;

// 1. Initialize the Offline-First Engine
const queryClient = new QueryClient({
  mutationCache: new MutationCache(),
  defaultOptions: {
    queries: {
      gcTime: FOURTEEN_DAYS_MS,
      staleTime: Infinity, 
      retry: 2,
      networkMode: 'offlineFirst',
    },
    mutations: {
      networkMode: 'offlineFirst', 
    }
  },
});

// 2. Bind the Persister to IndexedDB
const idbPersister = createAsyncStoragePersister({
  storage: {
    getItem: async (key) => await idb.get(key),
    setItem: async (key, value) => await idb.set(key, value),
    removeItem: async (key) => await idb.del(key),
  },
});

// 3. Register the router
const router = createRouter({ 
  routeTree,
  context: { queryClient },
});

declare module '@tanstack/react-router' {
  interface Register { router: typeof router; }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ 
        persister: idbPersister,
        maxAge: FOURTEEN_DAYS_MS,
        // 4. THE BIFURCATED CACHE FILTER
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            // ONLY save to the hard drive if the query explicitly asks for it
            return query.meta?.persist === true && query.state.status === 'success';
          },
          shouldDehydrateMutation: (mutation) => mutation.state.isPaused, 
        },
      }}
    >
      <RouterProvider router={router} />
    </PersistQueryClientProvider>
  </StrictMode>
);