import React, { useState } from 'react';
import {
  Kanban,
  List,
  Plus,
  Search,
  Filter,
  Clock,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  Eye,
  Calendar,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useWorks } from '../../context/WorksContext';
import type {
  TaskStatus,
  Department,
  TaskPriority,
  TaskFilterDepartment,
  TaskFilterPriority,
  TaskDayFilter,
  DesignTask,
} from '../../types/task';

export const TaskBoard: React.FC = () => {
  const {
    tasks,
    works,
    moveTaskStatus,
    setSelectedTaskForDetail,
    setIsAddTaskModalOpen,
    convertTaskToWork,
    syncAllCompletedTasksToWorks,
    clearAllTasks,
    setActiveTab,
    setSelectedWorkForDetail,
    activeScope,
    requireEditorAuth,
  } = useWorks();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState<TaskFilterDepartment>('all');
  const [filterPriority, setFilterPriority] = useState<TaskFilterPriority>('all');
  const [filterHotel, setFilterHotel] = useState<string>('all');

  // Day filter states
  const todayStr = new Date().toISOString().slice(0, 10);
  const dYesterday = new Date(Date.now() - 86400000);
  const yesterdayStr = dYesterday.toISOString().slice(0, 10);

  const [dayFilter, setDayFilter] = useState<TaskDayFilter>('all');
  const [customDate, setCustomDate] = useState<string>(todayStr);

  const targetDateStr =
    dayFilter === 'today'
      ? todayStr
      : dayFilter === 'yesterday'
      ? yesterdayStr
      : dayFilter === 'custom'
      ? customDate
      : null;

  // Format date helper for Indonesian UI
  const formatShortDate = (dStr: string) => {
    try {
      const parts = dStr.split('-');
      if (parts.length === 3) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return `${parseInt(parts[2], 10)} ${months[parseInt(parts[1], 10) - 1]}`;
      }
      return dStr;
    } catch {
      return dStr;
    }
  };

  // Rollover info helper
  const getRolloverBadge = (task: DesignTask) => {
    if (task.status === 'completed') return null;
    const refDateStr = targetDateStr || todayStr;
    const createdDate = task.createdAt.slice(0, 10);
    if (createdDate < refDateStr) {
      const diffMs = new Date(refDateStr).getTime() - new Date(createdDate).getTime();
      const diffDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
      if (diffDays === 1) {
        return {
          label: '⏳ Limpahan Kemarin',
          cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30',
        };
      }
      return {
        label: `⏳ Rollover (Hari ke-${diffDays + 1})`,
        cls: 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border border-orange-500/30',
      };
    }
    return null;
  };

  // Filter predicate
  const filteredTasks = tasks.filter((task) => {
    // Hotel filter (combine activeScope from sidebar if specified or local filter)
    const effectiveHotel = filterHotel !== 'all' ? filterHotel : activeScope;
    if (effectiveHotel !== 'all') {
      if (effectiveHotel === 'hotel_both') {
        if (task.hotelId !== 'hotel_both') return false;
      } else {
        if (task.hotelId !== effectiveHotel && task.hotelId !== 'hotel_both') {
          return false;
        }
      }
    }
    // Department filter
    if (filterDept !== 'all' && task.department !== filterDept) {
      return false;
    }
    // Priority filter
    if (filterPriority !== 'all' && task.priority !== filterPriority) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchReq = task.requesterName.toLowerCase().includes(q);
      const matchDesc = task.description.toLowerCase().includes(q);
      const matchTarget = task.targetOutput.toLowerCase().includes(q);
      if (!matchTitle && !matchReq && !matchDesc && !matchTarget) {
        return false;
      }
    }

    // DAY FILTER LOGIC (Tugas Selesai terhitung di hari itu, yang belum selesai rollover ke hari berikutnya)
    if (targetDateStr) {
      if (task.status === 'completed') {
        const compDate = (task.completedAt || task.updatedAt || task.createdAt).slice(0, 10);
        if (compDate !== targetDateStr) {
          return false;
        }
      } else {
        // Active task (backlog, in_progress, in_review)
        const createdDate = task.createdAt.slice(0, 10);
        // Task must have been created on or before targetDate to be active on that date
        if (createdDate > targetDateStr) {
          return false;
        }
      }
    }

    return true;
  });

  // Stats calculation based on active filter
  const backlogTasks = filteredTasks.filter((t) => t.status === 'backlog');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress');
  const inReviewTasks = filteredTasks.filter((t) => t.status === 'in_review');
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed');

  // Rollover count in active tasks
  const rolloverActiveCount = filteredTasks.filter((t) => t.status !== 'completed' && getRolloverBadge(t) !== null).length;

  // Unconverted completed tasks count (eligible for bulk portfolio sync)
  const unconvertedCompletedCount = tasks.filter((t) => t.status === 'completed' && !t.convertedWorkId).length;

  const columns: {
    status: TaskStatus;
    title: string;
    subtitle: string;
    icon: string;
    accent: string;
    badgeBg: string;
  }[] = [
    {
      status: 'backlog',
      title: 'Belum Dikerjakan',
      subtitle: 'Antrean request masuk',
      icon: '📥',
      accent: 'border-amber-500/30 bg-amber-500/5',
      badgeBg: 'bg-amber-500 text-white',
    },
    {
      status: 'in_progress',
      title: 'Sedang Didesain',
      subtitle: 'Dalam proses kreatif',
      icon: '🎨',
      accent: 'border-blue-500/30 bg-blue-500/5',
      badgeBg: 'bg-blue-500 text-white',
    },
    {
      status: 'in_review',
      title: 'Review & Revisi',
      subtitle: 'Tinjauan GM / Marcom',
      icon: '🔍',
      accent: 'border-purple-500/30 bg-purple-500/5',
      badgeBg: 'bg-purple-500 text-white',
    },
    {
      status: 'completed',
      title: 'Selesai / Approved',
      subtitle: dayFilter === 'all' ? 'Siap cetak & tayang' : `Hasil output ${targetDateStr ? formatShortDate(targetDateStr) : ''}`,
      icon: '✅',
      accent: 'border-emerald-500/30 bg-emerald-500/5',
      badgeBg: 'bg-emerald-500 text-white',
    },
  ];

  const getDeptBadge = (dept: Department) => {
    const map: Record<Department, { label: string; bg: string }> = {
      fnb: { label: 'F&B Resto', bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' },
      sales: { label: 'Sales & Mkt', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
      front_office: { label: 'Front Office', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
      hrd: { label: 'HRD', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
      gm: { label: 'GM Office', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
      marcom: { label: 'Marcom / PR', bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
    };
    return map[dept] || { label: dept, bg: 'bg-slate-500/10 text-slate-600 border-slate-500/20' };
  };

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'urgent':
        return { label: '🔴 Urgent', cls: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30 font-bold' };
      case 'high':
        return { label: '🟡 Tinggi', cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30' };
      case 'normal':
        return { label: '🔵 Normal', cls: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30' };
      case 'low':
        return { label: '⚪ Fleksibel', cls: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30' };
    }
  };

  const getDeadlineIndicator = (deadlineStr: string) => {
    if (deadlineStr < todayStr) {
      return { text: 'Terlewat', cls: 'text-red-600 dark:text-red-400 bg-red-500/10 font-bold' };
    }
    if (deadlineStr === todayStr) {
      return { text: 'Hari Ini!', cls: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 font-bold animate-pulse' };
    }
    return { text: deadlineStr, cls: 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-navy-800' };
  };

  const handleQuickConvert = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    requireEditorAuth(() => {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      convertTaskToWork(taskId);
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* 1. HEADER & SUMMARY METRICS */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
              Marketing Communication &amp; Graphic Design Intake
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-950 dark:text-white tracking-tight">
            Papan Tugas &amp; Permintaan Desain
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manajemen antrean riil dari departemen F&amp;B, Sales, HRD, dan Front Office hotel lengkap dengan alur rollover harian.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-wrap items-center gap-2">
          {tasks.length > 0 && (
            <button
              type="button"
              onClick={() => {
                requireEditorAuth(() => {
                  if (window.confirm('Yakin ingin mereset dan menghapus semua tugas di Task Board? (Data profil kamu tetap aman & tidak akan hilang)')) {
                    clearAllTasks();
                  }
                });
              }}
              className="px-3.5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs sm:text-sm font-semibold rounded-2xl transition-all flex items-center gap-1.5 active:scale-95"
              title="Reset dan hapus semua tugas di papan"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset Semua Tugas</span>
            </button>
          )}

          {unconvertedCompletedCount > 0 && (
            <button
              type="button"
              onClick={() => requireEditorAuth(() => syncAllCompletedTasksToWorks())}
              className="px-3.5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md shadow-emerald-500/25 flex items-center gap-1.5 transition-transform hover:scale-[1.02] active:scale-95"
              title="Masukkan semua tugas selesai yang belum ada di My Works"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Masukkan Semua ke Porto ({unconvertedCompletedCount})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => requireEditorAuth(() => setIsAddTaskModalOpen(true))}
            className="px-4 py-2.5 bg-electric-600 hover:bg-electric-500 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md shadow-electric-500/25 flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Request Desain Baru</span>
          </button>
        </div>
      </div>


      {/* STATS STRIP (Dynamically reflects day filter) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Belum Dikerjakan
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-extrabold text-amber-500">
                {backlogTasks.length}
              </span>
              {rolloverActiveCount > 0 && (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold font-mono">
                  ({rolloverActiveCount} Rollover)
                </span>
              )}
            </div>
          </div>
          <span className="text-xl">📥</span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Sedang Didesain
            </span>
            <span className="text-2xl font-display font-extrabold text-blue-500">
              {inProgressTasks.length}
            </span>
          </div>
          <span className="text-xl">🎨</span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              Review &amp; Revisi
            </span>
            <span className="text-2xl font-display font-extrabold text-purple-500">
              {inReviewTasks.length}
            </span>
          </div>
          <span className="text-xl">🔍</span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              {dayFilter === 'today'
                ? 'Selesai Hari Ini'
                : dayFilter === 'yesterday'
                ? 'Selesai Kemarin'
                : dayFilter === 'custom'
                ? `Selesai ${formatShortDate(customDate)}`
                : 'Selesai / Approved'}
            </span>
            <span className="text-2xl font-display font-extrabold text-emerald-500">
              {completedTasks.length}
            </span>
          </div>
          <span className="text-xl">✅</span>
        </div>
      </div>

      {/* 2. CONTROLS, SEARCH, AND FILTERS */}
      <div className="p-4 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-xs space-y-3.5">
        {/* DAY FILTER & ROLLOVER STRIP */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mr-1">
              <Calendar className="w-3.5 h-3.5 text-electric-500" />
              <span>Filter Hari:</span>
            </span>

            <button
              type="button"
              onClick={() => setDayFilter('today')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                dayFilter === 'today'
                  ? 'bg-electric-500 text-white shadow-sm shadow-electric-500/25'
                  : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 border border-slate-200 dark:border-navy-800'
              }`}
            >
              <span>Hari Ini</span>
              <span className="text-[10px] font-mono opacity-80">({formatShortDate(todayStr)})</span>
            </button>

            <button
              type="button"
              onClick={() => setDayFilter('yesterday')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                dayFilter === 'yesterday'
                  ? 'bg-electric-500 text-white shadow-sm shadow-electric-500/25'
                  : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 border border-slate-200 dark:border-navy-800'
              }`}
            >
              <span>Kemarin</span>
              <span className="text-[10px] font-mono opacity-80">({formatShortDate(yesterdayStr)})</span>
            </button>

            <button
              type="button"
              onClick={() => setDayFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                dayFilter === 'all'
                  ? 'bg-electric-500 text-white shadow-sm shadow-electric-500/25'
                  : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 border border-slate-200 dark:border-navy-800'
              }`}
            >
              <span>Semua Hari</span>
            </button>

            {/* Custom Date Input */}
            <div className="flex items-center gap-1">
              <input
                type="date"
                value={customDate}
                onChange={(e) => {
                  setCustomDate(e.target.value);
                  setDayFilter('custom');
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-xl border bg-white dark:bg-navy-900 text-navy-950 dark:text-white transition-all ${
                  dayFilter === 'custom'
                    ? 'border-electric-500 ring-2 ring-electric-500/20'
                    : 'border-slate-200 dark:border-navy-800'
                }`}
                title="Pilih tanggal khusus untuk melihat laporan harian"
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {dayFilter === 'today'
                ? 'Output selesai hari ini terhitung rapi • Tugas belum selesai bergulir ke hari ini'
                : dayFilter === 'yesterday'
                ? 'Arsip pengerjaan & output hari kemarin'
                : dayFilter === 'custom'
                ? `Melihat catatan pengerjaan tanggal ${formatShortDate(customDate)}`
                : 'Mode riwayat akumulatif semua hari'}
            </span>
          </div>
        </div>

        {/* Search & View Mode Switcher */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul tugas, pemohon (Chef, Sales), materi promosi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-navy-950 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-electric-500"
            />
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-navy-950 p-1 rounded-xl self-end md:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-navy-800 text-electric-600 dark:text-electric-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" /> Papan Kanban
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-navy-800 text-electric-600 dark:text-electric-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" /> Daftar Tabel
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-navy-800/80">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mr-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter:
          </div>

          {/* Department */}
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value as TaskFilterDepartment)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="all">Semua Departemen</option>
            <option value="fnb">🍽️ F&amp;B Restoran &amp; Bar</option>
            <option value="sales">💼 Sales &amp; Marketing</option>
            <option value="front_office">🛎️ Front Office</option>
            <option value="hrd">👥 HRD</option>
            <option value="gm">👑 GM Office</option>
            <option value="marcom">📢 Marcom / PR</option>
          </select>

          {/* Priority */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as TaskFilterPriority)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="all">Semua Prioritas</option>
            <option value="urgent">🔴 Urgent</option>
            <option value="high">🟡 Tinggi</option>
            <option value="normal">🔵 Normal</option>
            <option value="low">⚪ Fleksibel</option>
          </select>

          {/* Hotel */}
          <select
            value={filterHotel}
            onChange={(e) => setFilterHotel(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="all">Semua Hotel</option>
            <option value="hotel_semarang">🏨 Horison Semarang</option>
            <option value="hotel_jepara">🌊 Horison Jepara</option>
            <option value="hotel_both">✨ Dual Unit (2 Hotel)</option>
          </select>

          {(filterDept !== 'all' || filterPriority !== 'all' || filterHotel !== 'all' || searchQuery || dayFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setFilterDept('all');
                setFilterPriority('all');
                setFilterHotel('all');
                setDayFilter('all');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-electric-600 dark:text-electric-400 hover:underline px-2"
            >
              Reset Semua Filter
            </button>
          )}

          <span className="ml-auto text-xs font-mono text-slate-400">
            Menampilkan {filteredTasks.length} dari {tasks.length} tugas
          </span>
        </div>
      </div>

      {/* 3. KANBAN VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.status);
            const unconvertedInCol = colTasks.filter((t) => !t.convertedWorkId).length;

            return (
              <div
                key={col.status}
                className="flex flex-col rounded-3xl bg-slate-100/70 dark:bg-navy-950/50 border border-slate-200/80 dark:border-navy-800/80 p-3.5 space-y-3 min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-navy-800">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{col.icon}</span>
                    <div>
                      <h3 className="font-display font-bold text-sm text-navy-950 dark:text-white leading-tight">
                        {col.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono">{col.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {col.status === 'completed' && unconvertedInCol > 0 && (
                      <button
                        type="button"
                        onClick={() => syncAllCompletedTasksToWorks()}
                        className="px-2 py-0.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold shadow-xs flex items-center gap-1 active:scale-95 transition-all"
                        title="Masukkan semua tugas selesai yang belum ada di My Works"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Sync Porto ({unconvertedInCol})</span>
                      </button>
                    )}

                    <span
                      className={`w-6 h-6 rounded-full text-xs font-mono font-bold flex items-center justify-center ${col.badgeBg}`}
                    >
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1">
                  {colTasks.length > 0 ? (
                    colTasks.map((task) => {
                      const dept = getDeptBadge(task.department);
                      const prio = getPriorityBadge(task.priority);
                      const deadline = getDeadlineIndicator(task.deadline);
                      const rollover = getRolloverBadge(task);
                      const hasRevisions = task.revisions.length > 0;
                      const unresolvedRevs = task.revisions.filter((r) => !r.resolved).length;
                      const compDate = (task.completedAt || task.updatedAt || task.createdAt).slice(0, 10);

                      return (
                        <div
                          key={task.id}
                          onClick={() => setSelectedTaskForDetail(task)}
                          className="group relative p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/90 dark:border-navy-800 hover:border-electric-500/50 dark:hover:border-electric-500/50 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2.5"
                        >
                          {/* Card Meta Badges */}
                          <div className="flex flex-wrap items-center justify-between gap-1 text-[10px]">
                            <div className="flex items-center gap-1">
                              <span className={`px-2 py-0.5 rounded-md font-bold border ${dept.bg}`}>
                                {dept.label}
                              </span>
                              <span className={`px-2 py-0.5 rounded-md border ${prio.cls}`}>
                                {prio.label}
                              </span>
                            </div>

                            {/* Rollover badge for active tasks */}
                            {rollover && (
                              <span className={`px-2 py-0.5 rounded-md font-bold ${rollover.cls}`}>
                                {rollover.label}
                              </span>
                            )}

                            {/* Completed date badge */}
                            {col.status === 'completed' && (
                              <span className="px-2 py-0.5 rounded-md font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                Selesai {formatShortDate(compDate)}
                              </span>
                            )}
                          </div>

                          {/* Task Title */}
                          <h4 className="font-display font-bold text-sm text-navy-950 dark:text-white leading-snug group-hover:text-electric-600 dark:group-hover:text-electric-400 transition-colors">
                            {task.title}
                          </h4>

                          {/* Brief Excerpt */}
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>

                          {/* Output format & hotel */}
                          <div className="flex flex-wrap items-center gap-1 text-[11px] font-mono">
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300">
                              {task.mediaType === 'video' ? '🎬' : '🖼️'} {task.targetOutput}
                            </span>
                            <span className="text-slate-400 text-[10px]">
                              {task.hotelId === 'hotel_both'
                                ? '✨ Dual (2 Hotel)'
                                : task.hotelId === 'hotel_semarang'
                                ? 'Semarang'
                                : 'Jepara'}
                            </span>
                          </div>

                          {/* Deadline & Revisions Strip */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-navy-800 text-[11px]">
                            <span
                              className={`px-2 py-0.5 rounded-md font-mono flex items-center gap-1 ${deadline.cls}`}
                            >
                              <Clock className="w-3 h-3" /> {deadline.text}
                            </span>

                            {hasRevisions && (
                              <span
                                className={`px-1.5 py-0.5 rounded-md font-bold text-[10px] flex items-center gap-1 ${
                                  unresolvedRevs > 0
                                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                }`}
                              >
                                <AlertCircle className="w-3 h-3" />
                                {unresolvedRevs > 0 ? `${unresolvedRevs} Revisi` : 'Revisi Clear'}
                              </span>
                            )}
                          </div>

                          {/* Quick Stage Controls */}
                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-1">
                              {col.status !== 'backlog' && (
                                <button
                                  type="button"
                                  title="Kembalikan status sebelumnya"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    requireEditorAuth(() => {
                                      const prevStatus =
                                        col.status === 'completed'
                                          ? 'in_review'
                                          : col.status === 'in_review'
                                          ? 'in_progress'
                                          : 'backlog';
                                      moveTaskStatus(task.id, prevStatus);
                                    });
                                  }}
                                  className="p-1 rounded-lg text-slate-400 hover:text-navy-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                                >
                                  <ArrowLeft className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {col.status !== 'completed' && (
                                <button
                                  type="button"
                                  title="Majukan status selanjutnya"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    requireEditorAuth(() => {
                                      const nextStatus =
                                        col.status === 'backlog'
                                          ? 'in_progress'
                                          : col.status === 'in_progress'
                                          ? 'in_review'
                                          : 'completed';
                                      if (nextStatus === 'completed') {
                                        confetti({
                                          particleCount: 80,
                                          spread: 60,
                                          origin: { y: 0.6 },
                                        });
                                      }
                                      moveTaskStatus(task.id, nextStatus);
                                    });
                                  }}
                                  className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-electric-500 hover:text-white text-slate-600 dark:text-slate-300 text-[10px] font-bold flex items-center gap-1 transition-colors"
                                >
                                  <span>Lanjut</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>

                            {/* Portfolio Status Badge / Button for completed */}
                            {col.status === 'completed' && (
                              <div>
                                {task.convertedWorkId ? (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const found = works.find((w) => w.id === task.convertedWorkId);
                                      setActiveTab('my-works');
                                      if (found) setSelectedWorkForDetail(found);
                                    }}
                                    className="px-2 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1 transition-colors"
                                    title="Klik untuk membuka karya di My Works"
                                  >
                                    <CheckCircle2 className="w-3 h-3" /> Ada di Works ↗
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={(e) => handleQuickConvert(e, task.id)}
                                    className="px-2 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-[10px] font-bold shadow-xs flex items-center gap-1 hover:scale-105 transition-transform"
                                  >
                                    <Sparkles className="w-3 h-3" /> + Ke Porto
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 dark:border-navy-800 rounded-2xl text-slate-400">
                      <span className="text-xl mb-1 opacity-50">{col.icon}</span>
                      <p className="text-xs">
                        {dayFilter === 'all'
                          ? 'Tidak ada tugas di kolom ini'
                          : `Tidak ada tugas di hari ini`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 4. LIST / TABLE VIEW */
        <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-navy-950/70 border-b border-slate-200/80 dark:border-navy-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Tugas &amp; Target Output</th>
                  <th className="py-3 px-4">Departemen &amp; Pemohon</th>
                  <th className="py-3 px-4">Prioritas</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4">Alur / Selesai</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => {
                    const dept = getDeptBadge(task.department);
                    const prio = getPriorityBadge(task.priority);
                    const deadline = getDeadlineIndicator(task.deadline);
                    const rollover = getRolloverBadge(task);
                    const compDate = (task.completedAt || task.updatedAt || task.createdAt).slice(0, 10);

                    return (
                      <tr
                        key={task.id}
                        onClick={() => setSelectedTaskForDetail(task)}
                        className="hover:bg-slate-50/80 dark:hover:bg-navy-800/40 cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <select
                            value={task.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => moveTaskStatus(task.id, e.target.value as TaskStatus)}
                            className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                          >
                            <option value="backlog">📥 Belum Dikerjakan</option>
                            <option value="in_progress">🎨 Sedang Didesain</option>
                            <option value="in_review">🔍 Review &amp; Revisi</option>
                            <option value="completed">✅ Selesai</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-display font-bold text-navy-950 dark:text-white block">
                            {task.title}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {task.mediaType === 'video' ? '🎬' : '🖼️'} {task.targetOutput} • {task.hotelId === 'hotel_both' ? '✨ Dual (2 Hotel)' : task.hotelId === 'hotel_semarang' ? 'Semarang' : 'Jepara'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${dept.bg} inline-block mb-1`}>
                            {dept.label}
                          </span>
                          <p className="text-slate-600 dark:text-slate-300 font-medium">
                            {task.requesterName}
                          </p>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] border ${prio.cls}`}>
                            {prio.label}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold">
                          <span className={`px-2 py-0.5 rounded-md ${deadline.cls}`}>
                            {deadline.text}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {task.status === 'completed' ? (
                            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                              Selesai: {formatShortDate(compDate)}
                            </span>
                          ) : rollover ? (
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${rollover.cls}`}>
                              {rollover.label}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px] font-mono">
                              Masuk: {formatShortDate(task.createdAt.slice(0, 10))}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {task.status === 'completed' && (
                              task.convertedWorkId ? (
                                <span className="px-2 py-1 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Di Works
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => handleQuickConvert(e, task.id)}
                                  className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500"
                                >
                                  + Portofolio
                                </button>
                              )
                            )}
                            <button
                              type="button"
                              onClick={() => setSelectedTaskForDetail(task)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-navy-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      Tidak ada tugas yang sesuai filter hari atau kriteria pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
