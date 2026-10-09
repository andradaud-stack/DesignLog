import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, ShieldAlert } from 'lucide-react';
import { useWorks } from '../../context/WorksContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, unlockWithPin } = useWorks();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setErrorMsg('Masukkan PIN keamanan terlebih dahulu');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    const success = await unlockWithPin(pin);
    setIsLoading(false);

    if (success) {
      setPin('');
      setIsAuthModalOpen(false);
    } else {
      setErrorMsg('PIN yang Anda masukkan salah. Coba lagi.');
    }
  };

  const handleClose = () => {
    setPin('');
    setErrorMsg('');
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl relative text-navy-950 dark:text-white space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg leading-tight">
                Kunci Editor
              </h3>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Verifikasi Hak Akses
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-400 hover:text-navy-950 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Tindakan ini memerlukan PIN Editor untuk mencegah perubahan yang tidak sah pada portofolio dan data tugas magang Anda.
        </p>

        {/* PIN Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
              Masukkan PIN Keamanan
            </label>
            <div className="relative">
              <input
                autoFocus
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={20}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Ketik PIN..."
                className="w-full text-center text-lg font-mono tracking-widest px-4 py-3 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-950 dark:hover:text-white p-1"
                title={showPin ? 'Sembunyikan' : 'Tampilkan'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errorMsg && (
              <div className="flex items-center gap-1.5 text-xs text-rose-500 mt-2 font-medium">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-navy-950 dark:text-white text-xs font-semibold transition-all active:scale-95"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || !pin.trim()}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-amber-500/25 transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Memverifikasi...' : 'Buka Kunci'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
