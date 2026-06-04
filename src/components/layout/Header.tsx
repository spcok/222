import React, { useState } from 'react';
import { Menu, Play, Square, Loader2 } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useQuery } from '@tanstack/react-query';
import { timesheetService } from '../../services/timesheetService';
import { useOutboxStore } from '../../store/outboxStore';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
  const { user } = useAuth(); 
  const [isProcessing, setIsProcessing] = useState(false);

  // IMMUTABLE ZUSTAND STORE LAW: Exact isolated selector
  const pendingMutations = useOutboxStore((s) => s.mutations.length);

  const { data: activeShift, isLoading: checkingShift } = useQuery({
    queryKey: ['active_shift', user?.id],
    queryFn: () => timesheetService.getActiveShift(user?.id as string),
    enabled: !!user?.id,
  });

  const handleClockAction = async () => {
    if (!user?.id) return;
    setIsProcessing(true);
    try {
      if (activeShift) {
        await timesheetService.clockOut(activeShift, user.id);
      } else {
        await timesheetService.clockIn(user.id);
      }
    } catch (error) {
      console.error("Failed to update timesheet", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <header className="h-16 bg-[#0F1117] border-b border-slate-800/80 flex items-center justify-between px-6 shrink-0 z-10 sticky top-0 transition-all duration-300">
      
      {/* LEFT SIDE: Toggle, Shift Controls & Sync Status */}
      <div className="flex items-center gap-4">
        
        {/* SIDEBAR TOGGLE BUTTON */}
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>

        {user?.id && (
          <button 
            onClick={handleClockAction}
            disabled={isProcessing || checkingShift}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 ${
              activeShift 
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.15)]' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]'
            }`}
          >
            {isProcessing || checkingShift ? <Loader2 size={14} className="animate-spin" /> : activeShift ? <Square size={14} /> : <Play size={14} />}
            {activeShift ? 'Clock Out' : 'Clock In'}
          </button>
        )}

        {/* OFFLINE SYNC BADGE */}
        {pendingMutations > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
              Sync Pending ({pendingMutations})
            </span>
          </div>
        )}
      </div>

      {/* RIGHT SIDE: User Info ONLY */}
      <div className="flex items-center gap-4">
        <span className="text-slate-400 font-bold text-xs uppercase tracking-widest hidden sm:block">
          {user?.email || 'Guest User'}
        </span>
      </div>
      
    </header>
  );
}