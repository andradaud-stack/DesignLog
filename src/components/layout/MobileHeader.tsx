import React from 'react';
import { Sun, Moon, Lock, Unlock } from 'lucide-react';
import { useWorks } from '../../context/WorksContext';

export const MobileHeader: React.FC = () => {
  const {
    setActiveTab,
    userProfile,
    isDark,
    toggleDarkMode,
    isSecurityEnabled,
    isEditorUnlocked,
    hasPinSet,
    lockEditor,
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
        {hasPinSet && isSecurityEnabled && (
          <button
            type="button"
            onClick={() => {
              if (isEditorUnlocked) {
                lockEditor();
              } else {
                setIsAuthModalOpen(true);
              }
            }}
            className={`p-2 rounded-lg border shadow-sm transition-all ${
              isEditorUnlocked
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
            }`}
            title={isEditorUnlocked ? 'Klik untuk Mengunci Editor' : 'Klik untuk Membuka Kunci Editor'}
            aria-label="Editor Security Status"
          >
            {isEditorUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </button>
        )}

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
