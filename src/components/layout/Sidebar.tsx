import React, { useState } from 'react';
import {
  LayoutDashboard,
  Images,
  Calendar,
  BarChart3,
  Layers,
  Building2,
  Settings,
  ChevronDown,
  Sun,
  Moon,
  Check,
  Building,
  CheckSquare,
  Lock,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { useWorks } from '../../context/WorksContext';

interface NavItem {
  id: 'dashboard' | 'my-works' | 'tasks' | 'calendar' | 'statistics' | 'internship-periods' | 'hotels' | 'settings';
  label: string;
  icon: LucideIcon;
  badge?: number;
  badgeCls?: string;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activeScope,
    setActiveScope,
    works,
    backlogTasksCount,
    userProfile,
    isDark,
    toggleDarkMode,
    setIsAuthModalOpen,
    isAdminLoggedIn,
    adminUser,
    logoutAdmin,
  } = useWorks();

  const [scopeDropdownOpen, setScopeDropdownOpen] = useState(false);

  const semarangWorksCount = works.filter((w) => w.hotelId === 'hotel_semarang' || w.hotelId === 'hotel_both').length;
  const jeparaWorksCount = works.filter((w) => w.hotelId === 'hotel_jepara' || w.hotelId === 'hotel_both').length;
  const bothWorksCount = works.filter((w) => w.hotelId === 'hotel_both').length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-works', label: 'My Works', icon: Images, badge: works.length },
    {
      id: 'tasks',
      label: 'Task Board',
      icon: CheckSquare,
      badge: backlogTasksCount,
      badgeCls: backlogTasksCount > 0 ? 'bg-amber-500 text-white font-black animate-pulse' : undefined,
    },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
    { id: 'internship-periods', label: 'Internship Periods', icon: Layers },
    { id: 'hotels', label: 'Hotels', icon: Building2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getScopeDetails = () => {
    if (activeScope === 'hotel_semarang') {
      return {
        title: 'Horison Semarang',
        sub: 'Inn Antawirya (Tembalang)',
        color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
        dot: 'bg-amber-500',
      };
    }
    if (activeScope === 'hotel_jepara') {
      return {
        title: 'Horison Jepara',
        sub: 'Resort Antawirya (Teluk Awur)',
        color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30',
        dot: 'bg-cyan-500',
      };
    }
    if (activeScope === 'hotel_both') {
      return {
        title: 'Dual Unit (2 Hotel)',
        sub: 'Shared Semarang & Jepara',
        color: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
        dot: 'bg-purple-500',
      };
    }
    return {
      title: 'Dual-Property Scope',
      sub: 'Semarang & Jepara',
      color: 'text-electric-500 bg-electric-500/10 border-electric-500/30',
      dot: 'bg-electric-500',
    };
  };

  const scope = getScopeDetails();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-white/90 dark:bg-navy-950/90 backdrop-blur-xl z-40 flex-col justify-between p-5 border-r border-slate-200/80 dark:border-navy-800/80 shadow-sm select-none transition-colors duration-200">
      <div className="flex flex-col gap-5">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-navy-800/80">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-500 to-indigo-600 text-white flex items-center justify-center font-display font-black text-sm tracking-wider shadow-md shadow-electric-500/25 group-hover:scale-105 transition-transform">
              DL
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold tracking-tight text-lg text-navy-950 dark:text-white leading-tight">
                DesignLog
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 tracking-wider uppercase font-semibold">
                Intern Ledger
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-electric-500/10 text-electric-600 dark:text-electric-400 border border-electric-500/20">
            2026
          </span>
        </div>

        {/* Current Scope Switcher */}
        <div className="relative">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1.5 flex items-center justify-between px-1">
            <span>Hospitality Scope</span>
            <span className={`w-2 h-2 rounded-full ${scope.dot} animate-pulse`} />
          </div>

          <button
            type="button"
            onClick={() => setScopeDropdownOpen(!scopeDropdownOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 hover:border-electric-400/50 transition-all text-left shadow-sm group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${scope.color}`}>
                <Building className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="font-display font-bold text-xs text-navy-950 dark:text-white truncate">
                  {scope.title}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {scope.sub}
                </div>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${scopeDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Scope Dropdown Menu */}
          {scopeDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-navy-900 rounded-xl shadow-xl border border-slate-200 dark:border-navy-800 p-1.5 z-50 animate-fade-in-up">
              <button
                type="button"
                onClick={() => {
                  setActiveScope('all');
                  setScopeDropdownOpen(false);
                }}
                className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  activeScope === 'all'
                    ? 'bg-electric-500/10 text-electric-600 dark:text-electric-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800'
                }`}
              >
                <div>
                  <div className="font-semibold">All Properties (Dual Scope)</div>
                  <div className="text-[10px] text-slate-400">{works.length} total deliverables</div>
                </div>
                {activeScope === 'all' && <Check className="w-4 h-4 text-electric-500" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveScope('hotel_semarang');
                  setScopeDropdownOpen(false);
                }}
                className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  activeScope === 'hotel_semarang'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800'
                }`}
              >
                <div>
                  <div className="font-semibold">Horison Semarang</div>
                  <div className="text-[10px] text-slate-400">Inn Antawirya Tembalang ({semarangWorksCount} works)</div>
                </div>
                {activeScope === 'hotel_semarang' && <Check className="w-4 h-4 text-amber-500" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveScope('hotel_jepara');
                  setScopeDropdownOpen(false);
                }}
                className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  activeScope === 'hotel_jepara'
                    ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800'
                }`}
              >
                <div>
                  <div className="font-semibold">Horison Jepara</div>
                  <div className="text-[10px] text-slate-400">Resort Antawirya Teluk Awur ({jeparaWorksCount} works)</div>
                </div>
                {activeScope === 'hotel_jepara' && <Check className="w-4 h-4 text-cyan-500" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveScope('hotel_both');
                  setScopeDropdownOpen(false);
                }}
                className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                  activeScope === 'hotel_both'
                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800'
                }`}
              >
                <div>
                  <div className="font-semibold">Dual Unit (2 Hotel)</div>
                  <div className="text-[10px] text-slate-400">Desain Bersama Cluster ({bothWorksCount} works)</div>
                </div>
                {activeScope === 'hotel_both' && <Check className="w-4 h-4 text-purple-500" />}
              </button>
            </div>
          )}
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold px-1 mb-2">
            Navigation Menu
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group text-left ${
                    isActive
                      ? 'bg-electric-500 text-white font-bold shadow-md shadow-electric-500/25 scale-[1.01]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-900/60'
                  }`}
                >
                  <div
                    className={`p-1 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-slate-500 dark:text-slate-400 group-hover:text-electric-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate flex-1">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeCls || 'bg-slate-200/80 dark:bg-navy-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer: Intern Profile & Dark Mode Toggle */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-navy-800/80">
        {/* Intern Profile Card */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 flex items-center justify-between shadow-sm">
          <div
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1"
            title="Buka Pengaturan & Edit Profil"
          >
            <div className="relative shrink-0">
              <img
                alt={userProfile.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-electric-500/30 group-hover:ring-electric-500 transition-all"
                src={userProfile.avatar}
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-navy-900" />
            </div>
            <div className="min-w-0">
              <div className="font-display font-bold text-xs text-navy-950 dark:text-white truncate group-hover:text-electric-500 transition-colors">
                {userProfile.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {userProfile.role} • MGM
              </div>
            </div>
          </div>

          {/* Dark Mode Switcher */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-white dark:bg-navy-800 text-slate-600 dark:text-slate-300 hover:text-electric-500 dark:hover:text-electric-400 border border-slate-200/80 dark:border-navy-700 shadow-sm transition-transform active:scale-90"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-electric-600" />}
          </button>
        </div>

        {/* Security / Admin Auth Status Badge */}
        <button
          type="button"
          onClick={() => {
            if (isAdminLoggedIn) {
              logoutAdmin();
            } else {
              setIsAuthModalOpen(true);
            }
          }}
          className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all border shadow-xs ${
            isAdminLoggedIn
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-rose-500/15 hover:text-rose-600 hover:border-rose-500/30'
              : 'bg-slate-100 hover:bg-electric-500/10 dark:bg-navy-950 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-navy-800 hover:border-electric-500/30'
          }`}
          title={isAdminLoggedIn ? 'Klik untuk Logout Admin' : 'Klik untuk Login sebagai Admin'}
        >
          <div className="flex items-center gap-2">
            {isAdminLoggedIn ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="truncate">
              {isAdminLoggedIn ? `Admin (${adminUser?.username || 'Andra'})` : 'Mode Pengunjung'}
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-wider opacity-80">
            {isAdminLoggedIn ? 'Logout' : 'Login'}
          </span>
        </button>

        <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Horison Group Active</span>
          </span>
          <span className="font-mono">v2.4.0</span>
        </div>
      </div>
    </aside>
  );
};
