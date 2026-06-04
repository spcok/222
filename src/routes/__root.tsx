import { useState, useEffect } from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Lock, Delete, LogIn } from 'lucide-react';
import { AuthProvider, useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';

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
    <div className="min-h-screen flex items-center justify-center bg-[#0A0B0E] p-4">
      <div className="bg-[#0F1117] p-8 rounded-2xl shadow-2xl max-w-md w-full border border-slate-800/80">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mb-4 shadow-lg border border-emerald-500/20">
            <LogIn size={32} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight uppercase">Strix<span className="text-emerald-500">OS</span></h1>
          <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mt-2">Authenticate to begin session</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 text-xs font-bold tracking-wide border border-rose-500/20">
              {error}
            </div>
          )}
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-[#0A0B0E] border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-300 outline-none transition-all text-sm font-medium"
              placeholder="keeper@academy.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Master Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-[#0A0B0E] border border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-300 outline-none transition-all text-sm font-medium"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl transition-all mt-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0B0E]/95 backdrop-blur-md">
      <div className="bg-[#0F1117] p-8 rounded-3xl shadow-2xl w-full max-w-sm mx-4 border border-slate-800/80">
        
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-4 border border-rose-500/20 shadow-[0_0_15px_rgba(225,29,72,0.15)]">
            <Lock size={28} />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">Strix<span className="text-rose-500">Locked</span></h2>
          <p className="text-xs font-bold text-slate-500 tracking-widest uppercase mt-2">Enter PIN to resume</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                error ? 'bg-rose-500 shadow-[0_0_10px_rgba(225,29,72,0.5)]' : 
                i < pin.length ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePadClick(num.toString())}
              className="h-16 text-xl font-black text-slate-300 bg-[#0A0B0E] hover:bg-slate-800/80 hover:text-white border border-slate-800/50 rounded-2xl transition-all"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handlePadClick('0')}
            className="h-16 text-xl font-black text-slate-300 bg-[#0A0B0E] hover:bg-slate-800/80 hover:text-white border border-slate-800/50 rounded-2xl transition-all"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-16 flex items-center justify-center text-slate-500 hover:text-rose-400 bg-[#0A0B0E] hover:bg-rose-500/10 border border-slate-800/50 hover:border-rose-500/20 rounded-2xl transition-all"
          >
            <Delete size={24} />
          </button>
        </div>
        
        {error && <p className="text-rose-500 text-xs font-bold tracking-widest uppercase text-center mt-6 animate-pulse">Incorrect PIN</p>}
      </div>
    </div>
  );
}

// 3. The Gatekeeper Layout Component
function AuthGuard() {
  const { session, isLoading, isLocked } = useAuth();
  
  // UI State hoisted here to control both Sidebar and Header
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0B0E] flex items-center justify-center">
        <div className="animate-pulse text-emerald-500/50 font-black tracking-widest uppercase text-sm flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          Initializing Engine...
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginScreen />;
  }

  return (
    <div className="flex h-screen bg-[#0A0B0E] text-slate-300 font-sans antialiased relative overflow-hidden">
      
      {isLocked && <LockScreen />}

      {/* Sidebar with dynamic width controlled by layout state */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Container */}
      <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300">
        
        {/* Header receives the toggle function */}
        <Header 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen} 
        />
        
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}