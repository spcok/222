import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/collection')({
  component: CollectionRoute,
});

function CollectionRoute() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold mb-4 text-slate-800">Collection Census</h2>
      <p className="text-slate-600">
        The offline-first TanStack Table will be mounted here to display the animal database.
      </p>
    </div>
  );
}