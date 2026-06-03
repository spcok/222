import { createRootRoute, Outlet, Link } from '@tanstack/react-router';
import { LayoutDashboard, Bird, FileText } from 'lucide-react';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 font-bold text-white text-xl tracking-tight border-b border-slate-800">
          StrixOS
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1">
          <Link 
            to="/" 
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-slate-800 hover:text-white"
            activeProps={{ className: 'bg-indigo-600 text-white hover:bg-indigo-600' }}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link 
            to="/" 
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-slate-800 hover:text-white"
          >
            <Bird size={20} />
            Collection
          </Link>
          <Link 
            to="/" 
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-slate-800 hover:text-white"
          >
            <FileText size={20} />
            Daily Logs
          </Link>
        </nav>
      </aside>

      {/* MAIN APPLICATION WINDOW */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 shrink-0">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700">Academy Staff</span>
            <div className="h-8 w-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
              KOA
            </div>
          </div>
        </header>

        {/* ROUTER OUTLET */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}