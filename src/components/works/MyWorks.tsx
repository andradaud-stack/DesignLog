import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Download,
  Eye,
  Edit3,
  CheckCircle2,
  Clock,
  X,
  ArrowUpDown,
  Building,
  Palmtree,
  Maximize2,
  Trash2,
  Copy,
  FileDown,
  FileUp,
  AlertTriangle,
  Video,
  Sparkles,
} from 'lucide-react';
import { useWorks } from '../../context/WorksContext';
import type { Work, WorkStatus, SortOption } from '../../types/work';

export const MyWorks: React.FC = () => {
  const {
    works,
    filteredWorks,
    activeScope,
    setActiveScope,
    activePeriod,
    setActivePeriod,
    activeCategory,
    setActiveCategory,
    mediaTypeFilter,
    setMediaTypeFilter,
    activeStatus,
    setActiveStatus,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    clearFilters,
    setIsAddModalOpen,
    setEditingWork,
    setSelectedWorkForDetail,
    deleteWork,
    duplicateWork,
    clearAllWorks,
    exportBackupJson,
    importBackupJson,
    openPresentation,
    showToast,
    requireEditorAuth,
  } = useWorks();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const jsonBackupInputRef = useRef<HTMLInputElement>(null);
  const [workToDelete, setWorkToDelete] = useState<Work | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredWorks.length / itemsPerPage) || 1;
  const paginatedWorks = filteredWorks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeScope, activePeriod, activeCategory, activeStatus, searchQuery, sortBy]);

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

  const getCategoryName = (catId: string) => {
    const map: Record<string, string> = {
      cat_hari_nasional: 'Hari Nasional',
      cat_promo: 'Promo',
      cat_event: 'Event',
      cat_greeting: 'Greeting',
      cat_social_media: 'Social Media',
      cat_video_reels: 'Video & Reels',
      cat_backdrop: 'Backdrop',
      cat_marketing: 'Marketing',
      cat_lainnya: 'Lainnya',
    };
    return map[catId] || catId;
  };

  const formatWorkDisplayDate = (dateStr?: string | null, fallbackMonth?: number | null) => {
    if (!dateStr) return fallbackMonth ? `Okt 2026` : '-';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  const hasActiveFilters =
    activeScope !== 'all' ||
    activePeriod !== 'all' ||
    activeCategory !== 'all' ||
    activeStatus !== 'all' ||
    searchQuery.trim() !== '';

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* 1. HEADER & ACTIONS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-electric-500 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
              Creative Deliverables Ledger
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-950 dark:text-white tracking-tight">
            My Works Archive
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Catalog of {works.length} audited hospitality deliverables across Semarang and Jepara properties.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* JSON Backup Input */}
          <input
            ref={jsonBackupInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImportFile}
          />

          <button
            type="button"
            onClick={exportBackupJson}
            className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-300 font-semibold text-xs tracking-wide transition-all flex items-center gap-1.5 border border-slate-200/80 dark:border-navy-700 shadow-sm"
            title="Download JSON Backup of all deliverables"
          >
            <FileDown className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          <button
            type="button"
            onClick={() => jsonBackupInputRef.current?.click()}
            className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-300 font-semibold text-xs tracking-wide transition-all flex items-center gap-1.5 border border-slate-200/80 dark:border-navy-700 shadow-sm"
            title="Import deliverables from JSON backup file"
          >
            <FileUp className="w-4 h-4 text-electric-500" />
            <span className="hidden sm:inline">Import JSON</span>
          </button>

          <button
            type="button"
            onClick={() => openPresentation()}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm tracking-wide transition-all flex items-center gap-2 border border-slate-200/80 dark:border-navy-700 shadow-sm"
            title="Launch Fullscreen Slideshow"
          >
            <Maximize2 className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Present Showcase</span>
          </button>

          {works.length > 0 && (
            <button
              type="button"
              onClick={() => {
                requireEditorAuth(() => {
                  if (window.confirm('Yakin ingin mengosongkan semua karya di My Works? (Profil intern kamu tetap aman)')) {
                    clearAllWorks();
                  }
                });
              }}
              className="p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold text-xs tracking-wide transition-all flex items-center gap-1.5 border border-rose-500/20 shadow-sm active:scale-95"
              title="Kosongkan semua karya di My Works"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Reset Semua Karya</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => requireEditorAuth(() => setIsAddModalOpen(true))}
            className="px-4 py-2.5 rounded-xl bg-electric-500 hover:bg-electric-600 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md shadow-electric-500/25 transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Work</span>
          </button>
        </div>
      </div>

      {/* 2. MODERN FILTER & SEARCH TOOLBAR */}
      <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-4">
        {/* Row 1: Search and Primary Controls */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input with kbd badge */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, event, client hotel, specs, tags..."
              className="w-full pl-10 pr-20 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-xs sm:text-sm text-navy-950 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-electric-500 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
              <kbd className="font-mono text-[10px] font-semibold bg-white dark:bg-navy-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-navy-700 shadow-xs">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Hotel Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-navy-950 p-1 rounded-xl self-start lg:self-auto overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveScope('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeScope === 'all'
                  ? 'bg-white dark:bg-navy-800 text-navy-950 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white'
              }`}
            >
              All Hotels ({works.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveScope('hotel_semarang')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeScope === 'hotel_semarang'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-amber-600'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Semarang (26)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveScope('hotel_jepara')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeScope === 'hotel_jepara'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-cyan-600'
              }`}
            >
              <Palmtree className="w-3.5 h-3.5" />
              <span>Jepara (22)</span>
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-navy-950 p-1 rounded-xl self-end lg:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-navy-800 text-electric-600 dark:text-electric-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-navy-800 text-electric-600 dark:text-electric-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Row 2: Secondary Dropdown Selectors */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-navy-800/80 text-xs">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Category:</span>
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-navy-950 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-electric-500"
            >
              <option value="all">All Categories</option>
              <option value="cat_hari_nasional">Hari Nasional (14)</option>
              <option value="cat_promo">Promo (10)</option>
              <option value="cat_event">Event (8)</option>
              <option value="cat_greeting">Greeting (5)</option>
              <option value="cat_social_media">Social Media (4)</option>
              <option value="cat_video_reels">Video & Reels (3)</option>
              <option value="cat_backdrop">Backdrop (3)</option>
              <option value="cat_marketing">Marketing (2)</option>
              <option value="cat_lainnya">Lainnya (2)</option>
            </select>
          </div>

          {/* Media Format Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Format:</span>
            <select
              value={mediaTypeFilter}
              onChange={(e) => setMediaTypeFilter(e.target.value as 'all' | 'image' | 'video')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-navy-950 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-electric-500"
            >
              <option value="all">All Formats (Image & Video)</option>
              <option value="image">Static Artwork Only</option>
              <option value="video">Video & Reels Only</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={activeStatus}
              onChange={(e) => setActiveStatus(e.target.value as WorkStatus | 'all')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-navy-950 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-electric-500"
            >
              <option value="all">All Statuses</option>
              <option value="final">Final Signoff (41)</option>
              <option value="revision">In Revision (4)</option>
              <option value="in_progress">In Progress (2)</option>
              <option value="draft">Draft (1)</option>
            </select>
          </div>

          {/* Period Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Period:</span>
            <select
              value={activePeriod}
              onChange={(e) => setActivePeriod(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-navy-950 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-electric-500"
            >
              <option value="all">All Cohorts (Apr–Dec 2026)</option>
              <option value="period_2026_2">Cohort II (Oct–Dec 2026 Active)</option>
              <option value="period_2026_1">Cohort I (Apr–Jun 2026 Completed)</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-navy-950 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-electric-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="recently_added">Recently Added</option>
              <option value="hotel">Group by Hotel</option>
            </select>
          </div>

          {/* Clear Filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium hover:bg-rose-500/20 transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. DELIVERABLES CONTENT AREA */}
      <div>
        {paginatedWorks.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 p-8 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-electric-500/10 text-electric-600 dark:text-electric-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-lg text-navy-950 dark:text-white">
              {works.length === 0 ? 'Portofolio Bersih & Siap Diisi!' : 'Tidak ada karya yang cocok'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {works.length === 0
                ? 'Semua karya contoh telah dibersihkan. Klik tombol di bawah untuk mulai mengunggah karya magang pertamamu!'
                : 'Tidak ada karya yang sesuai dengan filter atau kata kunci pencarian. Coba reset filter.'}
            </p>
            {works.length === 0 ? (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-electric-500 hover:bg-electric-600 text-white font-semibold text-xs shadow-md transition-all active:scale-95 inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Upload Karya Pertama</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-2 px-4 py-2 rounded-xl bg-electric-500 text-white font-semibold text-xs shadow-md"
              >
                Reset Semua Filter
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginatedWorks.map((work) => {
              const isSemarang = work.hotelId === 'hotel_semarang';

              return (
                <article
                  key={work.id}
                  onClick={() => setSelectedWorkForDetail(work)}
                  className="group relative flex flex-col bg-white dark:bg-navy-900 rounded-2xl border border-slate-200/80 dark:border-navy-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  {/* Media Visual Aspect */}
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-navy-950">
                    <img
                      alt={work.title}
                      src={work.imageUri}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Quick Hover Action Overlays */}
                    <div className="absolute inset-0 bg-navy-950/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5 backdrop-blur-[2px] px-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWorkForDetail(work);
                        }}
                        className="p-2.5 rounded-xl bg-white text-navy-950 hover:bg-electric-500 hover:text-white transition-all shadow-md active:scale-90"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          requireEditorAuth(() => setEditingWork(work));
                        }}
                        className="p-2.5 rounded-xl bg-white text-navy-950 hover:bg-amber-500 hover:text-white transition-all shadow-md active:scale-90"
                        title="Edit Deliverable"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          requireEditorAuth(() => duplicateWork(work.id));
                        }}
                        className="p-2.5 rounded-xl bg-white text-navy-950 hover:bg-purple-500 hover:text-white transition-all shadow-md active:scale-90"
                        title="Duplicate / Copy Work"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          requireEditorAuth(() => setWorkToDelete(work));
                        }}
                        className="p-2.5 rounded-xl bg-white text-navy-950 hover:bg-rose-500 hover:text-white transition-all shadow-md active:scale-90"
                        title="Delete Deliverable"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDownloadAsset(work, e)}
                        className="p-2.5 rounded-xl bg-white text-navy-950 hover:bg-emerald-500 hover:text-white transition-all shadow-md active:scale-90"
                        title="Download Asset"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Hotel Badge & New Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-sm border ${
                          isSemarang
                            ? 'bg-amber-500/90 text-white border-amber-400/40'
                            : 'bg-cyan-600/90 text-white border-cyan-400/40'
                        }`}
                      >
                        {isSemarang ? 'Semarang' : 'Jepara'}
                      </span>
                      {(work.isUserCreated || work.id.startsWith('work-conv-') || !/^work-(video-)?(0[1-9]|[1-4][0-9])$/.test(work.id)) && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm flex items-center gap-1">
                          <span>✨ Baru</span>
                        </span>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md shadow-sm flex items-center gap-1 ${
                          work.status === 'final'
                            ? 'bg-emerald-500/90 text-white'
                            : work.status === 'revision'
                            ? 'bg-amber-500/90 text-white'
                            : 'bg-navy-950/80 text-white'
                        }`}
                      >
                        {work.status === 'final' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approved</span>
                          </>
                        ) : work.status === 'revision' ? (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>Revision {work.revisionCount}</span>
                          </>
                        ) : (
                          <span>In Review</span>
                        )}
                      </span>
                    </div>

                    {/* Video Reel Badge */}
                    {(work.mediaType === 'video' || work.videoUri || work.categoryId === 'cat_video_reels') && (
                      <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-lg bg-black/85 backdrop-blur-md text-white text-[10px] font-mono font-bold flex items-center gap-1.5 border border-purple-500/40 shadow-lg">
                        <Video className="w-3.5 h-3.5 text-purple-400" />
                        <span>{work.duration || 'Video Reel'}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content Footer */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span className="font-semibold text-electric-600 dark:text-electric-400 uppercase tracking-wider text-[10px]">
                          {getCategoryName(work.categoryId)}
                        </span>
                        <span className="font-mono text-slate-500 dark:text-slate-400">{formatWorkDisplayDate(work.date, work.month)}</span>
                      </div>

                      <h3 className="font-display font-bold text-sm text-navy-950 dark:text-white line-clamp-1 group-hover:text-electric-500 transition-colors">
                        {work.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {work.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-navy-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono">{work.dimensions}</span>
                      <span className="font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300">
                        {work.colorSpace}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-navy-950 border-b border-slate-200/80 dark:border-navy-800 text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Deliverable</th>
                    <th className="py-3 px-4">Hotel Property</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Specifications</th>
                    <th className="py-3 px-4">Date Precision</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-navy-800/60">
                  {paginatedWorks.map((work) => {
                    const isSemarang = work.hotelId === 'hotel_semarang';
                    return (
                      <tr
                        key={work.id}
                        onClick={() => setSelectedWorkForDetail(work)}
                        className="hover:bg-slate-50/80 dark:hover:bg-navy-800/40 transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              alt={work.title}
                              src={work.imageUri}
                              className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-navy-800 shrink-0"
                            />
                            <div>
                              <div className="font-display font-bold text-navy-950 dark:text-white group-hover:text-electric-500 transition-colors flex items-center gap-1.5">
                                <span>{work.title}</span>
                                {(work.isUserCreated || work.id.startsWith('work-conv-') || !/^work-(video-)?(0[1-9]|[1-4][0-9])$/.test(work.id)) && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                    Baru
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                                {work.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isSemarang
                                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                                : 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30'
                            }`}
                          >
                            {isSemarang ? 'Semarang Inn' : 'Jepara Resort'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {getCategoryName(work.categoryId)}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          <div>{work.dimensions}</div>
                          <div className="text-[10px] text-slate-400">{work.colorSpace}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                          {formatWorkDisplayDate(work.date, work.month)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                              work.status === 'final'
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                : work.status === 'revision'
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            {work.status === 'final' ? 'Approved' : work.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => setSelectedWorkForDetail(work)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-electric-500 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                              title="Inspect Deliverable"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => requireEditorAuth(() => setEditingWork(work))}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                              title="Edit Deliverable"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => requireEditorAuth(() => duplicateWork(work.id))}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-500 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                              title="Duplicate / Copy Work"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => requireEditorAuth(() => setWorkToDelete(work))}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                              title="Delete Deliverable"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDownloadAsset(work, e)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                              title="Download Asset"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. PAGINATION FOOTER */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 dark:border-navy-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-mono">
              Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredWorks.length)} of {filteredWorks.length} deliverables
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 disabled:opacity-40 text-slate-700 dark:text-slate-300 font-medium"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg font-semibold font-mono text-xs transition-colors ${
                    currentPage === page
                      ? 'bg-electric-500 text-white shadow-xs'
                      : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 disabled:opacity-40 text-slate-700 dark:text-slate-300 font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {workToDelete && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-navy-900 rounded-3xl border border-slate-200/80 dark:border-navy-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-navy-950 dark:text-white">
                  Delete Deliverable?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Are you sure you want to remove &quot;{workToDelete.title}&quot; from the archival ledger?
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/60 dark:border-navy-800 flex items-center gap-3">
              <img src={workToDelete.imageUri} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-950" />
              <div className="min-w-0">
                <span className="text-xs font-bold text-navy-950 dark:text-white block truncate">
                  {workToDelete.title}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block">
                  {workToDelete.dimensions} • {workToDelete.hotelId === 'hotel_semarang' ? 'Semarang' : 'Jepara'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setWorkToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteWork(workToDelete.id);
                  setWorkToDelete(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/25 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
