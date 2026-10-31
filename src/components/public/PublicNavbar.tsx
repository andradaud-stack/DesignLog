import React, { useState } from 'react';
import {
  Lock,
  Sun,
  Moon,
  ArrowRight,
  ShieldAlert,
  KeyRound,
  X,
} from 'lucide-react';
import { useWorks } from '../../context/WorksContext';

interface PublicNavbarProps {
  onScrollTo: (sectionId: string) => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ onScrollTo }) => {
  const {
    isDark,
    toggleDarkMode,
    navigateToAdmin,
    adminSlug,
    loginAdmin,
    isAdminLoggedIn,
    showToast,
  } = useWorks();

  const [isSecretPortalOpen, setIsSecretPortalOpen] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle secret keybinding: Ctrl+Shift+A or Cmd+Shift+A opens secret portal modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsSecretPortalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePortalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) return;

    setErrorMsg('');
    setIsVerifying(true);

    try {
      // Check if user entered the secret slug directly or admin password
      const cleanPass = passphrase.trim();
      if (cleanPass === adminSlug || cleanPass === '89rfwei8rf9wni8wd9eionjs8u0wjde9o') {
        setIsSecretPortalOpen(false);
        setPassphrase('');
        showToast('Akses terverifikasi. Membuka dashboard internal...', 'success');
        navigateToAdmin();
        return;
      }

      // Try server admin login
      const result = await loginAdmin('andra', cleanPass);
      if (result.success) {
        setIsSecretPortalOpen(false);
        setPassphrase('');
        showToast('Login berhasil! Mengalihkan ke dashboard admin...', 'success');
        navigateToAdmin();
      } else {
        setErrorMsg('Kata sandi atau token otorisasi tidak valid.');
      }
    } catch {
      setErrorMsg('Gagal memverifikasi akses internal.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Monogram & Active Status Pill */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onScrollTo('hero-overview')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black text-sm tracking-tighter shadow-sm group-hover:scale-105 transition-transform">
                DL
              </div>
              <span className="font-display font-black text-xl tracking-tight text-slate-900 dark:text-white">
                DesignLog<span className="text-indigo-600 dark:text-indigo-400">.</span>
              </span>
            </button>

            {/* Micro Active Intern Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 text-[11px] font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active Intern</span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              type="button"
              onClick={() => onScrollTo('hero-overview')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => onScrollTo('current-focus')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
              <span>Current Focus</span>
            </button>
            <button
              type="button"
              onClick={() => onScrollTo('showcase-archive')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Works Archive
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Secret Admin Portal Key (Discreet button) */}
            <button
              type="button"
              onClick={() => {
                if (isAdminLoggedIn) {
                  navigateToAdmin();
                } else {
                  setIsSecretPortalOpen(true);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-semibold transition-all group"
              title="Internal Administrative Portal (Ctrl+Shift+A)"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
              <span className="hidden sm:inline">Admin Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Secret Admin Gatekeeper Modal */}
      {isSecretPortalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-5 animate-scale-in">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Internal Ledger Portal
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Otorisasi akses administratif &amp; manajemen karya
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSecretPortalOpen(false);
                  setPassphrase('');
                  setErrorMsg('');
                }}
                className="w-7 h-7 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePortalSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                  Password Administrator atau Secret Slug
                </label>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Masukkan kata sandi admin..."
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSecretPortalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isVerifying || !passphrase.trim()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  <span>{isVerifying ? 'Memverifikasi...' : 'Buka Dashboard'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 font-mono text-center">
                Shortcut cepat: <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Ctrl+Shift+A</kbd>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
