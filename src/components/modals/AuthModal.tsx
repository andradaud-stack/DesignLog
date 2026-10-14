import React, { useState, useEffect } from 'react';
import { ShieldCheck, Eye, EyeOff, X, ShieldAlert, LogIn, KeyRound, User, Mail, Sparkles } from 'lucide-react';
import { useWorks } from '../../context/WorksContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    isAdminLoggedIn,
    isSetupRequired,
    adminUser,
    loginAdmin,
    setupAdmin,
    logoutAdmin,
  } = useWorks();

  const [identifier, setIdentifier] = useState('admin');
  const [email, setEmail] = useState('andrasyahdand@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(isSetupRequired);

  useEffect(() => {
    setIsSetupMode(isSetupRequired);
  }, [isSetupRequired]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg('Masukkan password terlebih dahulu');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password minimal 6 karakter');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    if (isSetupMode) {
      const res = await setupAdmin(identifier || 'admin', email || 'andrasyahdand@gmail.com', password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.message || 'Gagal mengatur akun admin');
      } else {
        setPassword('');
        setIsAuthModalOpen(false);
      }
    } else {
      const res = await loginAdmin(identifier, password);
      setIsLoading(false);
      if (!res.success) {
        if (res.needSetup) {
          setIsSetupMode(true);
          setErrorMsg('Belum ada akun terdaftar. Silakan buat password admin baru di bawah.');
        } else {
          setErrorMsg(res.message || 'Login gagal. Periksa kembali username/email dan password Anda.');
        }
      } else {
        setPassword('');
        setIsAuthModalOpen(false);
      }
    }
  };

  const handleClose = () => {
    setPassword('');
    setErrorMsg('');
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative text-navy-950 dark:text-white space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-electric-500/15 text-electric-600 dark:text-electric-400 border border-electric-500/25 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg leading-tight">
                {isAdminLoggedIn
                  ? 'Akun Admin Terverifikasi'
                  : isSetupMode
                  ? 'Setup Akun Admin'
                  : 'Login Admin & Editor'}
              </h3>
              <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                {isAdminLoggedIn
                  ? 'Hak Akses Penuh'
                  : isSetupMode
                  ? 'Inisialisasi Password TiDB Cloud'
                  : 'Autentikasi Server TiDB Cloud'}
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

        {/* Status notice */}
        {isAdminLoggedIn ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-semibold">
                Anda saat ini aktif sebagai <strong>{adminUser?.username || 'Admin'}</strong> ({adminUser?.email || 'andrasyahdand@gmail.com'})
              </p>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Hak akses penambahan karya, pengeditan, serta manajemen antrean tugas terbuka penuh.
            </p>
            <button
              type="button"
              onClick={async () => {
                await logoutAdmin();
                setIsAuthModalOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold transition-all"
            >
              Logout Admin (Kembali ke Read-Only)
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isSetupMode
                ? 'Atur kredensial Admin untuk pertama kali. Setelah password dibuat, hanya Anda yang dapat menambah, mengubah, atau menghapus karya di TiDB Cloud.'
                : 'Pengunjung publik tetap dapat melihat karya dalam mode Read-Only. Masukkan kredensial untuk membuka akses Admin.'}
            </p>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username / Identifier */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  {isSetupMode ? 'Username Admin' : 'Username atau Email'}
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="Contoh: admin atau andrasyahdand@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs font-medium text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-electric-500"
                  />
                </div>
              </div>

              {/* Email (If in setup mode) */}
              {isSetupMode && (
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Email Pemilik / Notifikasi
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder="andrasyahdand@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs font-medium text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-electric-500"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  {isSetupMode ? 'Buat Password Admin' : 'Password Admin'}
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    autoFocus
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder={isSetupMode ? 'Minimal 6 karakter...' : 'Ketik password admin...'}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs font-medium text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-electric-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy-950 dark:hover:text-white p-1"
                    title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errorMsg && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-500 mt-2 font-medium">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-navy-950 dark:text-white text-xs font-semibold transition-all active:scale-95"
                >
                  Batal (Tetap Read-Only)
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !password.trim()}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-electric-500 hover:bg-electric-600 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-electric-500/25 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  {isSetupMode ? <Sparkles className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                  <span>
                    {isLoading
                      ? 'Memverifikasi...'
                      : isSetupMode
                      ? 'Simpan & Masuk'
                      : 'Login Admin'}
                  </span>
                </button>
              </div>

              {/* Mode toggle */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsSetupMode(!isSetupMode);
                    setErrorMsg('');
                  }}
                  className="text-[11px] text-electric-600 dark:text-electric-400 hover:underline font-medium"
                >
                  {isSetupMode
                    ? 'Sudah punya akun? Masuk lewat form Login'
                    : 'Belum setup password admin? Buat akun di sini'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
