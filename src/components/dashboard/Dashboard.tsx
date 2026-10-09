import React from 'react';
import {
  Sparkles,
  Plus,
  ArrowRight,
  Layers,
  CalendarCheck,
  Building,
  Palmtree,
  Download,
  Eye,
  CheckCircle2,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  Maximize2,
} from 'lucide-react';
import { useWorks } from '../../context/WorksContext';
import type { Work } from '../../types/work';

export const Dashboard: React.FC = () => {
  const {
    works,
    backlogTasksCount,
    userProfile,
    activeScope,
    setActiveScope,
    setActiveCategory,
    setActiveTab,
    setIsAddModalOpen,
    setSelectedWorkForDetail,
    setIsPdfModalOpen,
    openPresentation,
    showToast,
  } = useWorks();

  // Compute metrics dynamically
  const totalWorks = works.length;
  const semarangWorks = works.filter((w) => w.hotelId === 'hotel_semarang').length;
  const jeparaWorks = works.filter((w) => w.hotelId === 'hotel_jepara').length;
  const semarangPercent = totalWorks > 0 ? Math.round((semarangWorks / totalWorks) * 100) : 0;
  const jeparaPercent = totalWorks > 0 ? 100 - semarangPercent : 0;

  // October 2026 works count
  const octoberWorks = works.filter((w) => w.month === 10 && w.year === 2026).length;

  // Final sign-off count
  const finalWorksCount = works.filter((w) => w.status === 'final').length;
  const finalRate = totalWorks > 0 ? Math.round((finalWorksCount / totalWorks) * 100) : 0;

  // Categories list
  const categories = [
    { id: 'cat_hari_nasional', name: 'Hari Nasional', count: works.filter((w) => w.categoryId === 'cat_hari_nasional').length, color: 'bg-electric-500', text: 'text-electric-500' },
    { id: 'cat_promo', name: 'Promo & F&B', count: works.filter((w) => w.categoryId === 'cat_promo').length, color: 'bg-amber-500', text: 'text-amber-500' },
    { id: 'cat_event', name: 'Event & Workshop', count: works.filter((w) => w.categoryId === 'cat_event').length, color: 'bg-indigo-500', text: 'text-indigo-500' },
    { id: 'cat_greeting', name: 'Greeting Cards', count: works.filter((w) => w.categoryId === 'cat_greeting').length, color: 'bg-emerald-500', text: 'text-emerald-500' },
    { id: 'cat_social_media', name: 'Social Media Feeds', count: works.filter((w) => w.categoryId === 'cat_social_media').length, color: 'bg-cyan-500', text: 'text-cyan-500' },
    { id: 'cat_backdrop', name: 'Backdrop / Stage', count: works.filter((w) => w.categoryId === 'cat_backdrop').length, color: 'bg-purple-500', text: 'text-purple-500' },
    { id: 'cat_marketing', name: 'Marketing Collateral', count: works.filter((w) => w.categoryId === 'cat_marketing').length, color: 'bg-rose-500', text: 'text-rose-500' },
    { id: 'cat_lainnya', name: 'Lainnya', count: works.filter((w) => w.categoryId === 'cat_lainnya').length, color: 'bg-slate-500', text: 'text-slate-500' },
  ];

  // Recent 4 works
  const recentWorks = works.slice(0, 4);

  const handleDownloadAsset = (work: Work, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = work.imageUri;
    link.download = `${work.title.toLowerCase().replace(/\s+/g, '_')}_asset.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloading deliverable package for "${work.title}"`, 'success');
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* 1. HERO BANNER (Versaltwo inspired aesthetic) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 text-white p-6 sm:p-8 lg:p-10 border border-navy-800/80 shadow-2xl">
        {/* Glow ambient background elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-electric-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 dark:bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold tracking-wider text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-electric-400" />
              <span>Internship Residency 2026</span>
              <span className="w-1 h-1 rounded-full bg-slate-400" />
              <span>Horison Hotels Group</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-white leading-tight">
              Good day, <span className="bg-gradient-to-r from-white via-slate-100 to-electric-300 bg-clip-text text-transparent">{userProfile.name}</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              Dual-property graphic design ledger cataloging <strong>{totalWorks} audited deliverables</strong> across Horison Inn Semarang and Horison Resort Jepara.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-electric-500 hover:bg-electric-600 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-electric-500/25 transition-all flex items-center gap-2 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Deliverable</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('my-works')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 font-semibold text-xs sm:text-sm tracking-wide transition-all flex items-center gap-2 active:scale-95"
              >
                <span>Browse All {totalWorks} Works</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsPdfModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold tracking-wide transition-all flex items-center gap-2"
                title="Open Pre-Press PDF Preview"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Export PDF Proof</span>
              </button>

              <button
                type="button"
                onClick={() => openPresentation()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-electric-500/20 hover:from-amber-500/30 hover:to-electric-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold tracking-wide transition-all flex items-center gap-2 shadow-lg"
                title="Launch Fullscreen Portfolio Slideshow"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Present Showcase</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tasks')}
                className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold tracking-wide transition-all flex items-center gap-2"
                title="Buka Papan Tugas & Antrean Desain"
              >
                <span>Task Board ({backlogTasksCount} Pending)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick status pill card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 min-w-[260px]">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Operational Integrity</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-extrabold text-white">{finalRate}%</span>
              <span className="text-xs text-emerald-400 font-medium">Final Sign-off</span>
            </div>

            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-electric-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${finalRate}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
              <span>{finalWorksCount} Approved</span>
              <span>{totalWorks - finalWorksCount} In Review</span>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5. DESIGN INTAKE & TASK ALERT STRIP */}
      {backlogTasksCount > 0 && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-amber-500/20 shrink-0">
              📥
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Antrean Tugas Belum Dikerjakan
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black">
                  {backlogTasksCount} Tugas Menunggu
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 mt-0.5">
                Ada permintaan desain dari departemen hotel (F&amp;B, Sales, Front Office) yang menunggu dieksekusi.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm shadow-amber-500/25 flex items-center justify-center gap-1.5 shrink-0 transition-transform active:scale-95"
          >
            <span>Buka Papan Tugas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. TOP EXECUTIVE STAT CARDS (CBT-PPLG inspired high-contrast cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Assets */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Total Output</span>
            <div className="w-10 h-10 rounded-xl bg-electric-500/10 text-electric-600 dark:text-electric-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-display font-extrabold text-navy-950 dark:text-white">
              {totalWorks}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Archived design deliverables</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-navy-800/80 flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              100% Audited
            </span>
            <span className="font-mono text-slate-400">Cohort I &amp; II</span>
          </div>
        </div>

        {/* Card 2: October Pacing */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Active Month</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-display font-extrabold text-navy-950 dark:text-white">
              {octoberWorks}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Created in October 2026</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-navy-800/80 flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              On Track
            </span>
            <span className="font-mono text-slate-400">Day 24 of Cycle</span>
          </div>
        </div>

        {/* Card 3: Semarang Property */}
        <div
          onClick={() => {
            setActiveScope(activeScope === 'hotel_semarang' ? 'all' : 'hotel_semarang');
            setActiveTab('my-works');
          }}
          className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm hover:shadow-md hover:border-amber-500/40 transition-all flex flex-col justify-between cursor-pointer group"
          title="Click to view Semarang deliverables"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Horison Semarang</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-display font-extrabold text-amber-600 dark:text-amber-400">
              {semarangWorks}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Inn Antawirya (City)</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-navy-800/80 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {semarangPercent}% Portfolio Share
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Jepara Property */}
        <div
          onClick={() => {
            setActiveScope(activeScope === 'hotel_jepara' ? 'all' : 'hotel_jepara');
            setActiveTab('my-works');
          }}
          className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm hover:shadow-md hover:border-cyan-500/40 transition-all flex flex-col justify-between cursor-pointer group"
          title="Click to view Jepara deliverables"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Horison Jepara</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Palmtree className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-display font-extrabold text-cyan-600 dark:text-cyan-400">
              {jeparaWorks}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Resort Antawirya (Teluk Awur)</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-navy-800/80 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {jeparaPercent}% Portfolio Share
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* 3. DUAL-HOTEL BALANCE & RESIDENCY TIMELINE STRIP */}
      <section className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-navy-800/80">
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-navy-950 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-electric-500" />
              <span>Dual-Property Balance &amp; Operational Ratio</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tracking workload distribution between urban business hotel and beachfront resort.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 self-start sm:self-auto">
            Target: 50% ± 5% Balance
          </span>
        </div>

        {/* Dual Bar Graphic */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-navy-950 flex overflow-hidden p-0.5 border border-slate-200/80 dark:border-navy-800">
            <div
              className="bg-amber-500 h-full rounded-l-full transition-all duration-700 relative group"
              style={{ width: `${semarangPercent}%` }}
              title={`Horison Semarang: ${semarangWorks} works (${semarangPercent}%)`}
            />
            <div
              className="bg-cyan-500 h-full rounded-r-full transition-all duration-700 relative group"
              style={{ width: `${jeparaPercent}%` }}
              title={`Horison Jepara: ${jeparaWorks} works (${jeparaPercent}%)`}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-amber-500" />
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Horison Semarang:</span>
              <span className="font-mono text-slate-500 dark:text-slate-400">{semarangWorks} works ({semarangPercent}%)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-cyan-500" />
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Horison Jepara:</span>
              <span className="font-mono text-slate-500 dark:text-slate-400">{jeparaWorks} works ({jeparaPercent}%)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CATEGORIES BREAKDOWN (Interactive filter triggers) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-navy-950 dark:text-white">
              Deliverable Categories Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any category pill to filter the complete work archive.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setActiveTab('my-works');
            }}
            className="text-xs font-semibold text-electric-600 dark:text-electric-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setActiveTab('my-works');
              }}
              className="p-3.5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 hover:border-electric-500/40 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group active:scale-95"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-electric-500 transition-colors">
                  {cat.count}
                </span>
              </div>
              <div className="text-xs font-bold text-navy-950 dark:text-white truncate">
                {cat.name}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 font-mono">
                {Math.round((cat.count / totalWorks) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. RECENT DELIVERABLES SHOWCASE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-navy-950 dark:text-white">
              Recent Design Output Showcase
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Curated recent promotional, social media, and national holiday assets.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('my-works')}
            className="text-xs font-semibold text-electric-600 dark:text-electric-400 hover:underline flex items-center gap-1"
          >
            <span>Complete Gallery ({totalWorks})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recentWorks.map((work) => {
            const isSemarang = work.hotelId === 'hotel_semarang';

            return (
              <div
                key={work.id}
                onClick={() => setSelectedWorkForDetail(work)}
                className="group relative flex flex-col bg-white dark:bg-navy-900 rounded-2xl border border-slate-200/80 dark:border-navy-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Media Image Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-navy-950">
                  <img
                    alt={work.title}
                    src={work.imageUri}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWorkForDetail(work);
                      }}
                      className="p-2.5 rounded-xl bg-white text-navy-950 hover:bg-electric-500 hover:text-white transition-all shadow-md active:scale-90"
                      title="Inspect Deliverable"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDownloadAsset(work, e)}
                      className="p-2.5 rounded-xl bg-white text-navy-950 hover:bg-electric-500 hover:text-white transition-all shadow-md active:scale-90"
                      title="Download Package"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-sm border ${
                        isSemarang
                          ? 'bg-amber-500/90 text-white border-amber-400/40'
                          : 'bg-cyan-600/90 text-white border-cyan-400/40'
                      }`}
                    >
                      {isSemarang ? 'Semarang' : 'Jepara'}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-navy-950/80 text-white backdrop-blur-md border border-white/20">
                      {work.date || 'Oct 2026'}
                    </span>
                  </div>
                </div>

                {/* Content info */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="font-display font-bold text-sm text-navy-950 dark:text-white line-clamp-1 group-hover:text-electric-500 transition-colors">
                      {work.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {work.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-navy-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono">{work.dimensions}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Signoff
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
