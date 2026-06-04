import { createFileRoute, Link } from '@tanstack/react-router';
import { Construction } from 'lucide-react';

export const Route = createFileRoute('/$')({
  component: NotFound,
});

function NotFound() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
      <div className="h-20 w-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6">
        <Construction size={40} />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Module Not Connected</h2>
      <p className="text-slate-500 max-w-md mb-8">
        This section of the application has not been assembled yet. It is mapped in the routing table but lacks a physical view component.
      </p>
      <Link 
        to="/"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}