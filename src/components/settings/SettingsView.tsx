import React, { useRef, useState } from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  Sun,
  Moon,
  CheckCircle2,
  HardDrive,
  Edit3,
  X,
  MapPin,
  ExternalLink,
  Camera,
  Building2,
  UserCheck,
  ArrowRight,
  Shield,
  Lock,
  Unlock,
  Key,
} from 'lucide-react';
import { useWorks } from '../../context/WorksContext';
import type { UserProfile } from '../../types/user';

export const SettingsView: React.FC = () => {
  const {
    works,
    resetToDefault,
    importBackupJson,
    exportBackupJson,
    isDark,
    toggleDarkMode,
    userProfile,
    updateUserProfile,
    resetUserProfile,
    setActiveScope,
    setActiveTab,
    isSecurityEnabled,
    isEditorUnlocked,
    hasPinSet,
    setIsAuthModalOpen,
    lockEditor,
    setSecurityPin,
    removeSecurityPin,
    requireEditorAuth,
  } = useWorks();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarUploadRef = useRef<HTMLInputElement>(null);

  // Security PIN Modal State
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isRemovingPinMode, setIsRemovingPinMode] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Profile Edit Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState<UserProfile>(userProfile);

  const openEditModal = () => {
    requireEditorAuth(() => {
      setProfileForm({ ...userProfile });
      setIsEditProfileOpen(true);
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    requireEditorAuth(() => {
      updateUserProfile(profileForm);
      setIsEditProfileOpen(false);
    });
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setProfileForm((prev) => ({ ...prev, avatar: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    requireEditorAuth(() => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          importBackupJson(text);
        }
      };
      reader.readAsText(file);
    });
    e.target.value = '';
  };

  const handleReset = () => {
    requireEditorAuth(() => {
      if (window.confirm('Reset ledger back to original 48 audited graphic design deliverables?')) {
        resetToDefault();
      }
    });
  };

  const openSetPinModal = () => {
    setNewPin('');
    setConfirmPin('');
    setCurrentPin('');
    setPinError('');
    setIsRemovingPinMode(false);
    setIsPinModalOpen(true);
  };

  const openRemovePinModal = () => {
    setCurrentPin('');
    setPinError('');
    setIsRemovingPinMode(true);
    setIsPinModalOpen(true);
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    if (isRemovingPinMode) {
      if (!currentPin) {
        setPinError('Masukkan PIN saat ini');
        return;
      }
      const success = await removeSecurityPin(currentPin);
      if (success) {
        setIsPinModalOpen(false);
      } else {
        setPinError('PIN saat ini tidak tepat');
      }
      return;
    }

    if (newPin.length < 4) {
      setPinError('PIN minimal 4 karakter');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('Konfirmasi PIN tidak cocok');
      return;
    }

    const success = await setSecurityPin(newPin);
    if (success) {
      setIsPinModalOpen(false);
    } else {
      setPinError('Gagal menyimpan PIN');
    }
  };

  const semarangWorksCount = works.filter((w) => w.hotelId === 'hotel_semarang').length;
  const jeparaWorksCount = works.filter((w) => w.hotelId === 'hotel_jepara').length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-electric-500 animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
            Scholar &amp; Property Credentials
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-950 dark:text-white tracking-tight">
          Settings &amp; Profiles
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Kelola profil mahasiswa magang, data properti Horison Semarang &amp; Jepara, tema tampilan, serta cadangan arsip.
        </p>
      </div>

      {/* 1. INTERN SCHOLAR PROFILE CARD */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-electric-500/5 dark:bg-electric-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with Status badge */}
          <div className="relative shrink-0">
            <img
              alt={userProfile.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-electric-500/20 shadow-md group-hover:scale-105 transition-transform"
              src={userProfile.avatar}
            />
            <span
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-navy-900 flex items-center justify-center text-white shadow-sm"
              title="Cohort Aktif & Terverifikasi"
            >
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>

          {/* Profile details */}
          <div className="flex flex-col gap-2.5 min-w-0 flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-display font-black text-navy-950 dark:text-white tracking-tight">
                {userProfile.name}
              </h2>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-electric-500/15 text-electric-600 dark:text-electric-400 border border-electric-500/30">
                {userProfile.role}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                {userProfile.cohort}
              </span>

              <button
                type="button"
                onClick={openEditModal}
                className="ml-auto px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-navy-800 hover:bg-electric-500 hover:text-white text-navy-950 dark:text-slate-200 border border-slate-200/80 dark:border-navy-700 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profil</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {userProfile.bio || (
                <>
                  Residency scholar di <strong>{userProfile.company}</strong> bekerja sama dengan{' '}
                  <strong>{userProfile.institution}</strong>, {userProfile.faculty}.
                </>
              )}
            </p>

            {/* Quick Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Cluster Magang</span>
                <span className="font-bold text-navy-950 dark:text-white truncate block">{userProfile.cluster}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Spesialisasi</span>
                <span className="font-bold text-navy-950 dark:text-white truncate block">{userProfile.specialization}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Supervisi Marcomm</span>
                <span className="font-bold text-navy-950 dark:text-white truncate block">{userProfile.supervisor}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Approval Rate</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">91.6% (Audited)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRIMARY PROPERTY PROFILE SHOWCASE (Semarang & Jepara) */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-amber-500" />
            <h2 className="text-xl font-display font-extrabold text-navy-950 dark:text-white">
              Data Hotel &amp; Alamat Properti Penempatan
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Unit perhotelan PT Metropolitan Golden Management tempat pelaksanaan tugas marketing communication.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Semarang Property Showcase Card */}
          <div className="rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm overflow-hidden flex flex-col justify-between group">
            <div>
              {/* Building Facade Photo */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100 dark:bg-navy-950">
                <img
                  src="/horison-semarang.jpg"
                  alt="Horison Inn Antawirya Semarang - Gedung BTB Training Center II Undip"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent flex items-end p-5">
                  <div className="text-white space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white shadow-sm">
                        Training Center II Undip
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white border border-white/20 backdrop-blur-md">
                        Gedung BTB
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-black leading-snug">
                      Hotel Horison Inn Antawirya Semarang
                    </h3>
                  </div>
                </div>
              </div>

              {/* Address & Specs */}
              <div className="p-5 space-y-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Alamat Resmi Terverifikasi:</span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    Jl. Prof. Soedarto, Tembalang, Kec. Tembalang, Kota Semarang, Jawa Tengah 50275
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Kawasan Kampus</span>
                    <span className="font-semibold text-navy-950 dark:text-white">Undip Tembalang</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Karya Selesai</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{semarangWorksCount} Deliverables</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 flex flex-wrap items-center gap-2">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Jl.+Prof.+Soedarto,+Tembalang,+Semarang+50275"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[140px] py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-navy-950 dark:text-white border border-slate-200 dark:border-navy-700 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
                <span>Buka di Google Maps</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setActiveScope('hotel_semarang');
                  setActiveTab('my-works');
                }}
                className="flex-1 min-w-[140px] py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Lihat Karya ({semarangWorksCount})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Jepara Property Showcase Card */}
          <div className="rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm overflow-hidden flex flex-col justify-between group">
            <div>
              {/* Building Facade Photo */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100 dark:bg-navy-950">
                <img
                  src="/horison-jepara.jpg"
                  alt="Horison Resort Antawirya Jepara - Beachfront Leisure Resort"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent flex items-end p-5">
                  <div className="text-white space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-600 text-white shadow-sm">
                        Beachfront Leisure Resort
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white border border-white/20 backdrop-blur-md">
                        Teluk Awur
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-black leading-snug">
                      Hotel Horison Resort Antawirya Jepara
                    </h3>
                  </div>
                </div>
              </div>

              {/* Address & Specs */}
              <div className="p-5 space-y-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Alamat Resmi Terverifikasi:</span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    Jl. Tlk. Awur, Telukawur, Kec. Tahunan, Kabupaten Jepara, Jawa Tengah 59427
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Kawasan Pesisir</span>
                    <span className="font-semibold text-navy-950 dark:text-white">Teluk Awur, Tahunan</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Karya Selesai</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">{jeparaWorksCount} Deliverables</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 flex flex-wrap items-center gap-2">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Jl.+Tlk.+Awur,+Telukawur,+Kec.+Tahunan,+Kabupaten+Jepara,+Jawa+Tengah+59427"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[140px] py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-navy-950 dark:text-white border border-slate-200 dark:border-navy-700 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-500" />
                <span>Buka di Google Maps</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setActiveScope('hotel_jepara');
                  setActiveTab('my-works');
                }}
                className="flex-1 min-w-[140px] py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs shadow-md shadow-cyan-600/20 transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Lihat Karya ({jeparaWorksCount})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PREFERENCES & SYSTEM TOOLS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Appearance Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
            <h3 className="font-display font-bold text-base text-navy-950 dark:text-white flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Tema &amp; Tampilan Visual</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">UI Mode</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Peralihan tema antara kontras tajam Light Mode dan Deep Navy Dark Mode yang nyaman saat kurasi portofolio malam hari.
          </p>

          <button
            type="button"
            onClick={toggleDarkMode}
            className="w-full py-3 rounded-xl bg-slate-100 dark:bg-navy-950 hover:bg-slate-200 dark:hover:bg-navy-800 border border-slate-200 dark:border-navy-700 text-navy-950 dark:text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Ganti ke Light Theme</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-electric-600" />
                <span>Ganti ke Dark Theme</span>
              </>
            )}
          </button>
        </div>

        {/* Data Management Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
            <h3 className="font-display font-bold text-base text-navy-950 dark:text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-electric-500" />
              <span>Cadangan &amp; Pemulihan Arsip</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{works.length} items</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Ekspor seluruh arsip karya &amp; tugas ke berkas JSON lokal untuk backup aman, atau reset ke 48 benih awal.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImportFile}
          />

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={exportBackupJson}
              className="flex-1 min-w-[130px] py-2.5 px-3 rounded-xl bg-electric-500 hover:bg-electric-600 text-white font-semibold text-xs shadow-md shadow-electric-500/25 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor JSON</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 min-w-[130px] py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-navy-950 dark:text-white border border-slate-200 dark:border-navy-700 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-electric-500" />
              <span>Impor JSON</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
              title="Reset Ledger ke 48 Deliverables Awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. SECURITY & ANTI-TAMPER PROTECTIONS */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-navy-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-emerald-500" />
              <h2 className="text-xl font-display font-extrabold text-navy-950 dark:text-white">
                Proteksi Keamanan &amp; Kunci Editor (Anti-Tamper)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Melindungi data portofolio dari perubahan atau pembajakan saat link Vercel dibuka pengunjung publik.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isSecurityEnabled ? (
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border ${
                isEditorUnlocked
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              }`}>
                {isEditorUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{isEditorUnlocked ? 'Editor Terbuka (Unrestricted)' : 'Terkunci (Read-Only Mode)'}</span>
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-navy-950 text-slate-500 border border-slate-200 dark:border-navy-800 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>PIN Belum Diaktifkan</span>
              </span>
            )}
          </div>
        </div>

        {/* Security Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 space-y-1.5">
            <span className="font-bold text-navy-950 dark:text-white flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-electric-500" />
              PIN Hash SHA-256
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              PIN dienkripsi dengan standar cryptographic hash Web Crypto SHA-256. Password asli tidak pernah tersimpan terbuka.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 space-y-1.5">
            <span className="font-bold text-navy-950 dark:text-white flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              Sanitasi XSS &amp; URL
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Semua link referensi &amp; gambar disaring otomatis untuk memblokir script berbahaya (<code>javascript:</code>, payload XSS).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 space-y-1.5">
            <span className="font-bold text-navy-950 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />
              HTTP Security Headers
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Vercel dikonfigurasi dengan Content Security Policy (CSP), anti-clickjacking (DENY), dan nosniff MIME protection.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {hasPinSet ? (
            <>
              {isEditorUnlocked ? (
                <button
                  type="button"
                  onClick={lockEditor}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-navy-950 hover:bg-slate-200 dark:hover:bg-navy-800 text-navy-950 dark:text-white border border-slate-200 dark:border-navy-700 text-xs font-bold transition-all flex items-center gap-2 active:scale-95"
                >
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>Kunci Mode Editor Sekarang (Jadikan Read-Only)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-electric-500 hover:bg-electric-600 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-electric-500/25 active:scale-95"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Buka Kunci Editor dengan PIN</span>
                </button>
              )}

              <button
                type="button"
                onClick={openSetPinModal}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-navy-950 hover:bg-slate-200 dark:hover:bg-navy-800 text-navy-950 dark:text-white border border-slate-200 dark:border-navy-700 text-xs font-bold transition-all flex items-center gap-2 active:scale-95"
              >
                <Key className="w-4 h-4 text-electric-500" />
                <span>Ganti PIN Keamanan</span>
              </button>

              <button
                type="button"
                onClick={openRemovePinModal}
                className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-2 active:scale-95"
              >
                <span>Nonaktifkan PIN</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={openSetPinModal}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-2 active:scale-95 transition-all"
            >
              <Shield className="w-4 h-4" />
              <span>Aktifkan Kunci PIN Editor (Rekomendasi Sebelum Deploy ke Vercel)</span>
            </button>
          )}
        </div>
      </section>

      {/* 5. MODAL EDIT PROFIL INTERN */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-800">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-electric-500" />
                <h3 className="font-display font-extrabold text-lg text-navy-950 dark:text-white">
                  Edit Profil Mahasiswa Magang
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
              {/* Avatar Selector */}
              <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800">
                <img
                  src={profileForm.avatar}
                  alt={profileForm.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-electric-500/40 shrink-0"
                />
                <div className="flex-1 space-y-1.5">
                  <span className="text-xs font-bold text-navy-950 dark:text-white block">
                    Foto Avatar / Profil
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => avatarUploadRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-electric-500 hover:bg-electric-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Unggah Foto</span>
                    </button>
                    <input
                      ref={avatarUploadRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarFileChange}
                    />
                  </div>
                  <input
                    type="url"
                    placeholder="Atau tempel URL gambar avatar..."
                    value={profileForm.avatar}
                    onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-electric-500"
                  />
                </div>
              </div>

              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Nama Lengkap / Panggilan
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-electric-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Jabatan / Role
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-electric-500"
                  />
                </div>
              </div>

              {/* University / Institution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Asal Kampus / Institusi
                  </label>
                  <input
                    type="text"
                    value={profileForm.institution}
                    onChange={(e) => setProfileForm({ ...profileForm, institution: e.target.value })}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-electric-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Fakultas / Program Studi
                  </label>
                  <input
                    type="text"
                    value={profileForm.faculty}
                    onChange={(e) => setProfileForm({ ...profileForm, faculty: e.target.value })}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-electric-500"
                  />
                </div>
              </div>

              {/* Company & Cohort */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Perusahaan Magang
                  </label>
                  <input
                    type="text"
                    value={profileForm.company}
                    onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-electric-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Periode / Cohort
                  </label>
                  <input
                    type="text"
                    value={profileForm.cohort}
                    onChange={(e) => setProfileForm({ ...profileForm, cohort: e.target.value })}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-electric-500"
                  />
                </div>
              </div>

              {/* Cluster & Supervisor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Cluster Wilayah
                  </label>
                  <input
                    type="text"
                    value={profileForm.cluster}
                    onChange={(e) => setProfileForm({ ...profileForm, cluster: e.target.value })}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-electric-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Supervisor / Pembimbing
                  </label>
                  <input
                    type="text"
                    value={profileForm.supervisor}
                    onChange={(e) => setProfileForm({ ...profileForm, supervisor: e.target.value })}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-electric-500"
                  />
                </div>
              </div>

              {/* Bio / Deskripsi */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  Biografi Singkat / Deskripsi Peran
                </label>
                <textarea
                  rows={2}
                  value={profileForm.bio || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-electric-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-navy-800">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Kembalikan ke profil default?')) {
                      resetUserProfile();
                      setIsEditProfileOpen(false);
                    }
                  }}
                  className="text-xs text-rose-500 hover:text-rose-600 font-medium"
                >
                  Reset ke Setelan Awal
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-navy-950 dark:text-white text-xs font-semibold"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-electric-500 hover:bg-electric-600 text-white text-xs font-bold shadow-md shadow-electric-500/25 active:scale-95"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL SET / CHANGE / REMOVE PIN */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                <h3 className="font-display font-extrabold text-lg text-navy-950 dark:text-white">
                  {isRemovingPinMode ? 'Nonaktifkan PIN Editor' : hasPinSet ? 'Ganti PIN Editor' : 'Atur PIN Keamanan Editor'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPinModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePinSubmit} className="mt-5 space-y-4">
              {pinError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  {pinError}
                </div>
              )}

              {isRemovingPinMode ? (
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Masukkan PIN Saat Ini
                  </label>
                  <input
                    type="password"
                    required
                    autoFocus
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value)}
                    placeholder="Masukkan PIN lama..."
                    className="w-full text-sm p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Setelah dinonaktifkan, siapa pun yang membuka link Vercel dapat mengedit data.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                      {hasPinSet ? 'PIN Baru (Minimal 4 Karakter)' : 'Buat PIN Editor Baru'}
                    </label>
                    <input
                      type="password"
                      required
                      autoFocus
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="Contoh: 1234 atau kata sandi rahasia..."
                      className="w-full text-sm p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                      Ulangi / Konfirmasi PIN
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      placeholder="Ketik ulang PIN..."
                      className="w-full text-sm p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    💡 Catat atau ingat PIN ini! PIN ini digunakan untuk membuka akses edit saat kamu membuka portofolio dari HP atau browser lain.
                  </p>
                </>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-navy-800">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-navy-950 dark:text-white text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-white text-xs font-bold shadow-md active:scale-95 ${
                    isRemovingPinMode
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                  }`}
                >
                  {isRemovingPinMode ? 'Hapus PIN' : 'Simpan & Aktifkan PIN'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
