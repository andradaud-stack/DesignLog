import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Building,
  Calendar,
  Video,
  Share2,
  Eye,
} from 'lucide-react';
import { useWorks } from '../../context/WorksContext';
import { PublicNavbar } from './PublicNavbar';
import { PublicMediaModal } from './PublicMediaModal';
import { CATEGORIES } from '../../data/constants';
import type { Work } from '../../types/work';

export const PublicShowcase: React.FC = () => {
  const {
    works,
    tasks,
    userProfile,
    showToast,
  } = useWorks();

  // Public Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedHotel, setSelectedHotel] = useState<string>('all');
  const [selectedMediaType, setSelectedMediaType] = useState<'all' | 'image' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectedWork, setInspectedWork] = useState<Work | null>(null);

  // Compute metrics dynamically from real data
  const totalWorks = works.length;
  const approvedWorks = works.filter((w) => w.status === 'final').length;
  const inReviewWorks = works.filter((w) => w.status === 'revision' || w.status === 'draft').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;

  const approvedRate = totalWorks > 0 ? Math.round((approvedWorks / totalWorks) * 100) : 0;
  const inReviewRate = totalWorks > 0 ? Math.round((inReviewWorks / totalWorks) * 100) : 0;

  // Active focus task (most recent in_progress task or first backlog task)
  const currentFocusTask = useMemo(() => {
    const active = tasks.find((t) => t.status === 'in_progress') || tasks.find((t) => t.status === 'backlog');
    if (active) return active;
    // Fallback focus presentation
    return {
      id: 'focus_fallback',
      title: 'Menu Digital QR & Standee Weekend Buffet Horison',
      hotelId: 'hotel_semarang',
      department: 'fnb',
      targetOutput: 'Standing Banner X-Banner • 60 × 160 cm',
      deadline: '2026-11-05',
      description: 'Mendesain display standing banner dan tent card meja untuk promo buffet akhir pekan.',
    };
  }, [tasks]);

  // Filtered works for showcase grid
  const filteredWorks = useMemo(() => {
    return works.filter((w) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'cat_video_reels') {
          if (w.categoryId !== 'cat_video_reels' && w.mediaType !== 'video') return false;
        } else if (w.categoryId !== selectedCategory) {
          return false;
        }
      }

      // Hotel Scope filter
      if (selectedHotel !== 'all') {
        if (w.hotelId !== selectedHotel && w.hotelId !== 'hotel_both') return false;
      }

      // Media type filter
      if (selectedMediaType === 'video' && w.mediaType !== 'video' && !w.videoUri && w.categoryId !== 'cat_video_reels') {
        return false;
      }
      if (selectedMediaType === 'image' && (w.mediaType === 'video' || w.videoUri || w.categoryId === 'cat_video_reels')) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = w.title.toLowerCase().includes(query);
        const matchesDesc = (w.description || '').toLowerCase().includes(query);
        const matchesHotel = w.hotelId.toLowerCase().includes(query);
        const matchesCategory = (CATEGORIES.find((c) => c.id === w.categoryId)?.name || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesHotel && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [works, selectedCategory, selectedHotel, selectedMediaType, searchQuery]);

  const handleScrollTo = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSharePortfolio = () => {
    if (navigator.share) {
      navigator.share({
        title: `${userProfile.name} — DesignLog Portfolio`,
        text: 'Lihat koleksi arsip desain grafis dan UI/UX internship di Horison Hotels.',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tautan portofolio berhasil disalin ke clipboard!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070c1b] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* 1. Minimal Navbar */}
      <PublicNavbar onScrollTo={handleScrollTo} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* 2. INTERN HEADER & METRIC ROW */}
        <section id="hero-overview" className="space-y-6 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: Persona & Bio Card */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                {/* Rounded Avatar with Active Dot */}
                <div className="relative shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-md">
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" title="Active Residency Scholar" />
                </div>

                {/* Identity Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/60">
                      Residency Scholar 2026
                    </span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      UDINUS FIK • Semarang
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {userProfile.name}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                    Lead Graphic &amp; UI/UX Design Intern
                  </p>

                  <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Oct 2026 – Jan 2027</span>
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-amber-500" />
                      <span>Horison Hotels Central Java Cluster</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio & Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal border-t border-slate-100 dark:border-slate-800 pt-4">
                Public showcase &amp; progress log tracking visual communications, pre-press marketing collaterals, and digital motion deliverables for <strong>Horison Inn Antawirya Semarang</strong> &amp; <strong>Horison Resort Antawirya Jepara</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleScrollTo('showcase-archive')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs tracking-wide shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <span>Explore All {totalWorks} Deliverables</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleSharePortfolio}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
                  title="Bagikan Tautan Portofolio"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Share Showcase</span>
                </button>
              </div>
            </div>

            {/* Right: 4-Card Executive Metric Strip */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {/* Metric 1: Total Tasks / Works */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Total Output</span>
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                    {totalWorks}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Archived deliverables</p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                  <span>Cohort I &amp; II</span>
                </div>
              </div>

              {/* Metric 2: Approved / Signed-off */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Approved</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-display font-extrabold text-emerald-600 dark:text-emerald-400">
                    {approvedWorks}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {approvedRate}% Pass Rate
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Sign-off Complete</span>
                </div>
              </div>

              {/* Metric 3: In Review */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-[11px] font-mono uppercase font-bold tracking-wider">In Review</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-display font-extrabold text-amber-600 dark:text-amber-400">
                    {inReviewWorks}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {inReviewRate}% Review Cycle
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                  <span>Marcom Audit</span>
                </div>
              </div>

              {/* Metric 4: In Progress / Focus */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Active Sprint</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-display font-extrabold text-blue-600 dark:text-blue-400">
                    {inProgressTasks || 1}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Current Focus</p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                  <span>Sprint Week 4</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CURRENTLY WORKING ON BANNER */}
        <section id="current-focus" className="rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-r from-indigo-50/50 via-slate-50 to-indigo-50/30 dark:from-indigo-950/20 dark:via-slate-900 dark:to-indigo-950/10 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            {/* Left: Active Task Description */}
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  Current Focus
                </span>
                <span className="text-xs font-mono text-slate-400">Sprint Week 4 • Deadline: {currentFocusTask.deadline || 'Nov 2026'}</span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {currentFocusTask.title}
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
                {currentFocusTask.description || 'Pre-press marketing collateral for Horison Inn Antawirya Semarang.'}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  {currentFocusTask.targetOutput || 'Display Banner / Print Collateral'}
                </span>
                <span>•</span>
                <span>Horison Semarang</span>
              </div>
            </div>

            {/* Right: Progress Track & Spec Button */}
            <div className="flex flex-col sm:items-end justify-center gap-3 shrink-0 min-w-[200px]">
              <div className="w-full sm:w-48 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono font-semibold">
                  <span className="text-slate-500 dark:text-slate-400">Progress</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">75%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-700" style={{ width: '75%' }} />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  // Find a relevant work or open first deliverable
                  if (works.length > 0) setInspectedWork(works[0]);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>Inspect Deliverable Spec</span>
                <ExternalLink className="w-3 h-3 text-indigo-500" />
              </button>
            </div>
          </div>
        </section>

        {/* 4. FILTER & TIMELINE TOOLBAR */}
        <section id="showcase-archive" className="space-y-4 pt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white">
                Archival Deliverables Showcase
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                High-resolution catalog of {totalWorks} audited design assets across Horison Semarang and Horison Jepara.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari karya, hotel, atau tag..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs transition-all"
              />
            </div>
          </div>

          {/* Filter Pills & Hotel Scope Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            {/* Category Filter Pills (Scrollable) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All Works ({works.length})
              </button>

              {CATEGORIES.map((cat) => {
                const count = works.filter((w) => w.categoryId === cat.id || (cat.id === 'cat_video_reels' && w.mediaType === 'video')).length;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-70 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Hotel Scope Dropdown & Media Selector */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              {/* Hotel Scope */}
              <select
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
              >
                <option value="all">Semua Properti ({works.length})</option>
                <option value="hotel_semarang">Horison Semarang ({works.filter(w => w.hotelId === 'hotel_semarang').length})</option>
                <option value="hotel_jepara">Horison Jepara ({works.filter(w => w.hotelId === 'hotel_jepara').length})</option>
                <option value="hotel_both">Dual Unit Cluster ({works.filter(w => w.hotelId === 'hotel_both').length})</option>
              </select>

              {/* Media Type Toggle */}
              <select
                value={selectedMediaType}
                onChange={(e) => setSelectedMediaType(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
              >
                <option value="all">Semua Format</option>
                <option value="image">Gambar Statis</option>
                <option value="video">Video &amp; Motion</option>
              </select>
            </div>
          </div>
        </section>

        {/* 5. SHOWCASE GRID & CARDS (READ-ONLY) */}
        <section>
          {filteredWorks.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-xl">
                🔎
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Tidak ada karya yang cocok</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Coba sesuaikan kata kunci pencarian atau ubah filter kategori/properti di atas.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedHotel('all');
                  setSelectedMediaType('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 transition-colors"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorks.map((work) => {
                const isVideo = work.mediaType === 'video' || Boolean(work.videoUri);
                const isApproved = work.status === 'final';
                const hotelName = work.hotelId === 'hotel_semarang' ? 'Horison Semarang' : work.hotelId === 'hotel_jepara' ? 'Horison Jepara' : 'Dual Unit';

                return (
                  <article
                    key={work.id}
                    onClick={() => setInspectedWork(work)}
                    className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Media Container (16:10 ratio) */}
                      <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden flex items-center justify-center">
                        <img
                          src={work.imageUri}
                          alt={work.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Video Indicator Pill */}
                        {isVideo && (
                          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-white text-[10px] font-mono font-semibold flex items-center gap-1 border border-white/20">
                            <Video className="w-3 h-3 text-purple-400" />
                            <span>{work.duration || 'Video Reel'}</span>
                          </div>
                        )}

                        {/* Top-Right Status Badge */}
                        <div className="absolute top-2.5 right-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-md border ${
                              isApproved
                                ? 'bg-emerald-500/80 text-white border-emerald-400/40 shadow-xs'
                                : 'bg-amber-500/80 text-white border-amber-400/40 shadow-xs'
                            }`}
                          >
                            {isApproved ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                            <span>{isApproved ? 'Approved' : 'In Review'}</span>
                          </span>
                        </div>

                        {/* Top-Left Hotel Tag */}
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-medium border border-white/15">
                            {hotelName}
                          </span>
                        </div>

                        {/* Hover Overlay Button */}
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                          <span className="px-3 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white font-semibold text-xs shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                            <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>Click to Inspect Spec</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span>{work.date || 'OCTOBER 2026'}</span>
                          <span>Rev {work.revisionCount || 1}</span>
                        </div>

                        <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {work.title}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {work.description || 'Desain promosi hotel dengan kalibrasi visual identity resmi PT MGM.'}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: Software badge & Spec button */}
                    <div className="p-4 pt-0 mt-2 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800/80 pt-3 text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        <span className="font-mono text-[11px]">
                          {isVideo ? 'After Effects / Premiere' : work.dimensions?.includes('cm') ? 'Photoshop (CMYK)' : 'Figma / Illustrator'}
                        </span>
                      </div>

                      <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[11px]">
                        <span>Inspect Spec</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* 6. EXPANDABLE MEDIA INSPECTION MODAL */}
      <PublicMediaModal
        worksList={filteredWorks}
        activeWork={inspectedWork}
        onClose={() => setInspectedWork(null)}
        onSelectWork={(w) => setInspectedWork(w)}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black text-xs">
              DL
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-200">DesignLog.</span>
            <span>•</span>
            <span>Archival Residency Portfolio</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>UDINUS FIK × PT MGM Horison Hotels</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>Semarang &amp; Jepara</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
