import { useState, useEffect } from 'react';
import { createRootRoute, Outlet, Link } from '@tanstack/react-router';
import { LayoutDashboard, Bird, FileText, Lock, Delete, LogIn, LogOut } from 'lucide-react';
import { AuthProvider, useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Sidebar } from '../components/Sidebar';

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <AuthGuard />
    </AuthProvider>
  ),
});

// 1. The Initial Master Login Screen
function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-indigo-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <LogIn size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">StrixOS System</h1>
          <p className="text-sm text-slate-500 mt-1">Authenticate to begin session</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3 rounded-md bg-rose-50 text-rose-600 text-sm border border-rose-200">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="keeper@academy.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Master Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-lg transition-colors mt-4"
          >
            {loading ? 'Authenticating...' : 'Establish Session'}
          </button>
        </form>
      </div>
    </div>
  );
}

// 2. The 5-Minute PIN Overlay
function LockScreen() {
  const { unlock } = useAuth();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (pin.length === 4) {
      if (!unlock(pin)) {
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 500);
      }
    }
  }, [pin, unlock]);

  const handlePadClick = (num: string) => {
    if (pin.length < 4) setPin(prev => prev + num);
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm mx-4">
        
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <Lock size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">StrixOS Locked</h2>
          <p className="text-sm text-slate-500 mt-1">Enter PIN to resume session</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className={`w-4 h-4 rounded-full transition-colors ${
                error ? 'bg-rose-500' : 
                i < pin.length ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePadClick(num.toString())}
              className="h-16 text-2xl font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-colors"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handlePadClick('0')}
            className="h-16 text-2xl font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-colors"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-16 flex items-center justify-center text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 rounded-xl transition-colors"
          >
            <Delete size={24} />
          </button>
        </div>
        
        {error && <p className="text-rose-500 text-sm text-center mt-6 font-medium animate-pulse">Incorrect PIN</p>}
      </div>
    </div>
  );
}

// 3. The Gatekeeper Layout Component
function AuthGuard() {
  // Pulling session and the mapped database profile
  const { session, user, profile, isLoading, isLocked, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-slate-400 font-medium">Initializing Engine...</div>
      </div>
    );
  }

  if (!session) {
    return <LoginScreen />;
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans antialiased relative">
      
      {isLocked && <LockScreen />}

      {/* SIDEBAR */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* MAIN APPLICATION WINDOW */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 shrink-0 justify-between">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            
            {/* Dynamic User Profile Injection */}
            <span className="text-sm font-medium text-slate-700">
              {profile?.name || user?.email || 'Unmapped Staff'}
            </span>
            <div className="h-8 w-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold uppercase overflow-hidden">
              {profile?.initials || profile?.name?.charAt(0) || user?.email?.charAt(0) || '?'}
            </div>
            
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            
            {/* Logout Trigger */}
            <button 
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-2 text-sm font-medium"
              title="Terminate Session"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
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