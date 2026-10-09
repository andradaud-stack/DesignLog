import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  Smartphone,
  SlidersHorizontal,
  Maximize2,
  Share2,
  Building,
  Palmtree,
  Copy,
  Video,
} from 'lucide-react';
import { useWorks } from '../../context/WorksContext';
import { MockupPreview } from '../works/MockupPreview';
import { BeforeAfterSlider } from '../works/BeforeAfterSlider';
import { BrandPaletteBar } from '../works/BrandPaletteBar';
import { PreflightChecklist } from '../works/PreflightChecklist';

export const WorkDetailModal: React.FC = () => {
  const {
    selectedWorkForDetail,
    setSelectedWorkForDetail,
    setEditingWork,
    deleteWork,
    duplicateWork,
    openPresentation,
    showToast,
    requireEditorAuth,
  } = useWorks();

  const [activeMediaTab, setActiveMediaTab] = useState<'artwork' | 'mockup' | 'compare'>('artwork');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedWorkForDetail) {
        setSelectedWorkForDetail(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedWorkForDetail, setSelectedWorkForDetail]);

  // Reset tab on modal open
  useEffect(() => {
    if (selectedWorkForDetail) {
      setActiveMediaTab('artwork');
    }
  }, [selectedWorkForDetail]);

  if (!selectedWorkForDetail) return null;

  const work = selectedWorkForDetail;
  const isSemarang = work.hotelId === 'hotel_semarang';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = work.imageUri;
    link.download = `${work.title.toLowerCase().replace(/\s+/g, '_')}_asset.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloading deliverable package for "${work.title}"`, 'success');
  };

  const handleDelete = () => {
    requireEditorAuth(() => {
      if (!isConfirmingDelete) {
        setIsConfirmingDelete(true);
        return;
      }
      deleteWork(work.id);
      setSelectedWorkForDetail(null);
    });
  };

  const handleDuplicate = () => {
    requireEditorAuth(() => {
      duplicateWork(work.id);
      setSelectedWorkForDetail(null);
    });
  };

  const handleShareFolio = () => {
    const shareText = `🎨 [DesignLog V2 Deliverable]\n📌 Title: ${work.title}\n🏨 Property: ${
      isSemarang ? 'Hotel Horison Inn Antawirya Semarang' : 'Horison Resort Jepara'
    }\n📐 Specs: ${work.dimensions} (${work.colorSpace})\n✅ Status: ${
      work.status === 'final' ? 'Final Approved Sign-Off' : `Revision #${work.revisionCount}`
    }\n🔗 Asset: ${work.imageUri}`;

    navigator.clipboard.writeText(shareText);
    showToast('Folio summary copied to clipboard! Ready to share.', 'success');
  };

  const handlePresentFullscreen = () => {
    setSelectedWorkForDetail(null);
    openPresentation(work.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-navy-900 rounded-3xl border border-slate-200/80 dark:border-navy-800 shadow-2xl max-w-4xl w-full max-h-[94vh] overflow-y-auto flex flex-col my-auto">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-navy-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-navy-900/95 backdrop-blur-md z-20">
          <div className="flex items-center gap-2.5">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isSemarang
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                  : 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30'
              }`}
            >
              {isSemarang ? <Building className="w-3 h-3" /> : <Palmtree className="w-3 h-3" />}
              <span>{isSemarang ? 'Horison Semarang • Inn' : 'Horison Jepara • Resort'}</span>
            </span>
            <span className="text-xs font-mono text-slate-400">
              Folio #{work.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePresentFullscreen}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Present Fullscreen Slide"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setSelectedWorkForDetail(null)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-800 text-slate-400 hover:text-navy-950 dark:hover:text-white transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode Segmented Controls */}
        <div className="px-6 pt-4 pb-2 bg-slate-50/50 dark:bg-navy-950/40 border-b border-slate-100 dark:border-navy-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/60 dark:bg-navy-950 border border-slate-300/60 dark:border-navy-800">
            <button
              type="button"
              onClick={() => setActiveMediaTab('artwork')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeMediaTab === 'artwork'
                  ? 'bg-white dark:bg-navy-800 text-electric-600 dark:text-electric-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Full Artwork</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMediaTab('mockup')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeMediaTab === 'mockup'
                  ? 'bg-white dark:bg-navy-800 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mockup Frames</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMediaTab('compare')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeMediaTab === 'compare'
                  ? 'bg-white dark:bg-navy-800 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Before / After Split</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5 ${
                work.status === 'final'
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                  : work.status === 'revision'
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                  : 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border border-slate-500/30'
              }`}
            >
              {work.status === 'final' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Final Sign-off</span>
                </>
              ) : work.status === 'revision' ? (
                <>
                  <Clock className="w-3.5 h-3.5" />
                  <span>Revision #{work.revisionCount}</span>
                </>
              ) : (
                <span>In Progress</span>
              )}
            </span>
          </div>
        </div>

        {/* Media Stage Area */}
        <div className="p-6 bg-slate-100/50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-navy-800/80">
          {activeMediaTab === 'artwork' && (
            <div className="w-full bg-slate-950 rounded-2xl relative flex items-center justify-center p-4 sm:p-6 min-h-[360px] border border-slate-200/50 dark:border-navy-800 shadow-xl overflow-hidden">
              {work.videoUri ? (
                <div className="flex flex-col items-center max-w-full">
                  <video
                    src={work.videoUri}
                    poster={work.imageUri}
                    controls
                    playsInline
                    className={`max-h-[460px] w-auto max-w-full rounded-xl shadow-2xl ${
                      work.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'
                    }`}
                  />
                  {work.duration && (
                    <div className="mt-3 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[11px] font-mono text-purple-300 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-purple-400" />
                      <span>Duration: {work.duration} • 9:16 Vertical Video Reel</span>
                    </div>
                  )}
                </div>
              ) : (
                <img
                  src={work.imageUri}
                  alt={work.title}
                  className="max-h-[460px] w-auto max-w-full object-contain rounded-xl shadow-2xl transition-transform hover:scale-[1.01]"
                />
              )}
            </div>
          )}

          {activeMediaTab === 'mockup' && (
            <MockupPreview
              imageUri={work.imageUri}
              videoUri={work.videoUri}
              title={work.title}
              description={work.description}
              hotelId={work.hotelId}
              dimensions={work.dimensions}
              dateStr={work.date}
            />
          )}

          {activeMediaTab === 'compare' && (
            <BeforeAfterSlider
              imageUri={work.imageUri}
              draftUri={work.draftImageUri}
              title={work.title}
              revisionCount={work.revisionCount}
            />
          )}
        </div>

        {/* Content & Metadata Inspector */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-display font-extrabold text-navy-950 dark:text-white">
              {work.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {work.description}
            </p>
          </div>

          {/* Technical Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Dimensions</span>
              <span className="font-mono text-xs font-bold text-navy-950 dark:text-white mt-0.5 block">
                {work.dimensions}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Aspect Ratio</span>
              <span className="font-mono text-xs font-bold text-navy-950 dark:text-white mt-0.5 block">
                {work.aspectRatio}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Color Profile</span>
              <span className="font-mono text-xs font-bold text-navy-950 dark:text-white mt-0.5 block">
                {work.colorSpace}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Publication Date</span>
              <span className="font-mono text-xs font-bold text-navy-950 dark:text-white mt-0.5 block">
                {work.date || `Month ${work.month || 10}, 2026`}
              </span>
            </div>
          </div>

          {/* Brand Color Hierarchy Bar */}
          <BrandPaletteBar hotelId={work.hotelId} categoryId={work.categoryId} />

          {/* Preflight Print & Digital Specifications */}
          <PreflightChecklist work={work} />

          {/* Action Buttons Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-navy-800">
            {isConfirmingDelete ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-500/25 animate-pulse"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Delete Now</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Work</span>
              </button>
            )}

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleDuplicate}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-95"
                title="Create a copy for a new revision"
              >
                <Copy className="w-4 h-4 text-purple-500" />
                <span>Duplicate / New Revision</span>
              </button>

              <button
                type="button"
                onClick={handleShareFolio}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>Copy Folio</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  requireEditorAuth(() => {
                    const toEdit = selectedWorkForDetail;
                    setSelectedWorkForDetail(null);
                    setEditingWork(toEdit);
                  });
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-navy-950 dark:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-95"
              >
                <Edit3 className="w-4 h-4 text-amber-500" />
                <span>Edit Metadata</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="px-5 py-2.5 rounded-xl bg-electric-500 hover:bg-electric-600 text-white text-xs font-semibold shadow-md shadow-electric-500/25 flex items-center gap-2 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download Asset</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
