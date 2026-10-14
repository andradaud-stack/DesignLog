import React from 'react';
import { Sun, Moon, Lock, ShieldCheck } from 'lucide-react';
import { useWorks } from '../../context/WorksContext';

export const MobileHeader: React.FC = () => {
  const {
    setActiveTab,
    userProfile,
    isDark,
    toggleDarkMode,
    isAdminLoggedIn,
    logoutAdmin,
    setIsAuthModalOpen,
  } = useWorks();

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 h-16 z-40 bg-white/90 dark:bg-navy-950/90 backdrop-blur-xl flex items-center justify-between px-4 border-b border-slate-200/80 dark:border-navy-800/80 shadow-sm transition-colors duration-200">
      <div
        onClick={() => setActiveTab('dashboard')}
        className="flex items-center gap-2.5 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-500 to-indigo-600 text-white flex items-center justify-center font-display font-black text-xs tracking-wider shadow-sm">
          DL
        </div>
        <div className="flex flex-col">
          <span className="font-display font-bold tracking-tight text-base text-navy-950 dark:text-white leading-tight">
            DesignLog
          </span>
          <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Archive 2026
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (isAdminLoggedIn) {
              logoutAdmin();
            } else {
              setIsAuthModalOpen(true);
            }
          }}
          className={`px-2.5 py-1.5 rounded-lg border shadow-sm transition-all flex items-center gap-1.5 text-xs font-semibold ${
            isAdminLoggedIn
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              : 'bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-navy-700'
          }`}
          title={isAdminLoggedIn ? 'Logout Admin' : 'Login Admin'}
          aria-label="Admin Status"
        >
          {isAdminLoggedIn ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-bold">Admin</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px]">Login</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-navy-700 shadow-sm"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-electric-600" />}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-electric-500/30"
          aria-label="Profile Settings"
        >
          <img
            alt={userProfile.name}
            className="w-full h-full object-cover"
            src={userProfile.avatar}
          />
        </button>
      </div>
    </header>
  );
};
