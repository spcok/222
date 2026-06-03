import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold mb-4 text-slate-800">Collection Overview</h2>
      <p className="text-slate-600">
        StrixOS SPA Router successfully mounted. The layout shell is active and the network is ready for the data layer.
      </p>
    </div>
  );
}