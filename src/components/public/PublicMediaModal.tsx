import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Video,
  CheckCircle2,
  Clock,
  Sparkles,
  Building,
  Palmtree,
  Calendar,
} from 'lucide-react';
import type { Work } from '../../types/work';
import { resolveVideoUrl } from '../../utils/videoUtils';

interface PublicMediaModalProps {
  worksList: Work[];
  activeWork: Work | null;
  onClose: () => void;
  onSelectWork: (work: Work) => void;
}

export const PublicMediaModal: React.FC<PublicMediaModalProps> = ({
  worksList,
  activeWork,
  onClose,
  onSelectWork,
}) => {
  if (!activeWork) return null;

  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [panPos, setPanPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [resolvedVideoUrl, setResolvedVideoUrl] = useState<string>('');

  const modalContainerRef = useRef<HTMLDivElement>(null);
  const currentIndex = worksList.findIndex((w) => w.id === activeWork.id);

  // Resolve video URL if work is a video
  useEffect(() => {
    let isMounted = true;
    if (activeWork.videoUri) {
      resolveVideoUrl(activeWork.videoUri).then((url) => {
        if (isMounted) setResolvedVideoUrl(url);
      });
    } else {
      setResolvedVideoUrl('');
    }
    // Reset zoom and pan on work change
    setZoomLevel(100);
    setPanPos({ x: 0, y: 0 });
    return () => {
      isMounted = false;
    };
  }, [activeWork]);

  // Keyboard navigation (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < worksList.length - 1) {
          onSelectWork(worksList[currentIndex + 1]);
        } else if (worksList.length > 0) {
          onSelectWork(worksList[0]);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          onSelectWork(worksList[currentIndex - 1]);
        } else if (worksList.length > 0) {
          onSelectWork(worksList[worksList.length - 1]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, worksList, isFullscreen, onClose, onSelectWork]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      onSelectWork(worksList[currentIndex - 1]);
    } else if (worksList.length > 0) {
      onSelectWork(worksList[worksList.length - 1]);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < worksList.length - 1) {
      onSelectWork(worksList[currentIndex + 1]);
    } else if (worksList.length > 0) {
      onSelectWork(worksList[0]);
    }
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(250, prev + 25));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(75, prev - 25));
  const handleZoomReset = () => {
    setZoomLevel(100);
    setPanPos({ x: 0, y: 0 });
  };

  // Mouse pan handlers when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 100) return;
    setIsPanning(true);
    setDragStart({ x: e.clientX - panPos.x, y: e.clientY - panPos.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || zoomLevel <= 100) return;
    setPanPos({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsPanning(false);

  const isVideo = activeWork.mediaType === 'video' || Boolean(activeWork.videoUri);
  const isApproved = activeWork.status === 'final';

  return (
    <div
      ref={modalContainerRef}
      className={`fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-between text-white overflow-hidden animate-fade-in ${
        isFullscreen ? 'p-0' : 'p-2 sm:p-4 lg:p-6'
      }`}
    >
      {/* Top Header & Control Bar */}
      <div className="z-20 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-white/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        {/* Left: Work Title, Status, Hotel Pill */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 ${
                isApproved
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}
            >
              {isApproved ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              <span>{isApproved ? 'Approved' : 'In Review'}</span>
            </span>

            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/15 text-[11px] font-medium shrink-0">
              {activeWork.hotelId === 'hotel_semarang' ? (
                <Building className="w-3 h-3 text-amber-400" />
              ) : activeWork.hotelId === 'hotel_jepara' ? (
                <Palmtree className="w-3 h-3 text-cyan-400" />
              ) : (
                <Sparkles className="w-3 h-3 text-indigo-400" />
              )}
              <span>
                {activeWork.hotelId === 'hotel_semarang'
                  ? 'Horison Semarang'
                  : activeWork.hotelId === 'hotel_jepara'
                  ? 'Horison Jepara'
                  : 'Dual Unit'}
              </span>
            </span>
          </div>

          <h2 className="font-display font-bold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md lg:max-w-lg">
            {activeWork.title}
          </h2>
        </div>

        {/* Right: Zoom Toolbar & Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {!isVideo && (
            <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/15">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 75}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-40 transition-colors"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleZoomReset}
                className="px-2 py-1 text-[11px] font-mono font-bold text-slate-200 hover:text-white transition-colors"
                title="Reset Zoom"
              >
                {zoomLevel}%
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 250}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-40 transition-colors"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleZoomReset}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Fit to Screen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/15 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Spec View'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-rose-500 text-slate-300 hover:text-white border border-white/15 transition-colors"
            title="Close Preview (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Viewport Stage */}
      <div
        className="relative flex-1 flex items-center justify-center overflow-hidden my-2 sm:my-3 cursor-default"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Floating Prev Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 z-30 w-11 h-11 rounded-2xl bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl transition-all active:scale-90 group"
          title="Previous Deliverable (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Media Asset (Image or Video) */}
        <div className="relative max-h-full max-w-full flex items-center justify-center">
          {isVideo ? (
            <div className="flex flex-col items-center max-w-full">
              <video
                src={resolvedVideoUrl || activeWork.videoUri}
                poster={activeWork.imageUri}
                controls
                playsInline
                className={`max-h-[70vh] sm:max-h-[76vh] w-auto max-w-[92vw] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-white/15 ${
                  activeWork.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-video'
                }`}
              />
              {activeWork.duration && (
                <div className="mt-3 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-[11px] font-mono text-purple-300 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-purple-400" />
                  <span>Duration: {activeWork.duration} • 9:16 Motion Reel</span>
                </div>
              )}
            </div>
          ) : (
            <img
              src={activeWork.imageUri}
              alt={activeWork.title}
              draggable={false}
              style={{
                transform: `scale(${zoomLevel / 100}) translate(${panPos.x / (zoomLevel / 100)}px, ${panPos.y / (zoomLevel / 100)}px)`,
                cursor: zoomLevel > 100 ? (isPanning ? 'grabbing' : 'grab') : 'default',
              }}
              className="max-h-[70vh] sm:max-h-[76vh] max-w-[92vw] object-contain rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-white/15 select-none transition-transform duration-150"
            />
          )}
        </div>

        {/* Floating Next Button */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2 sm:right-4 z-30 w-11 h-11 rounded-2xl bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl transition-all active:scale-90 group"
          title="Next Deliverable (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Bottom Information Bar & Thumbnail Strip Reel */}
      <div className="z-20 bg-slate-950/85 backdrop-blur-md rounded-2xl border border-white/10 p-3 sm:p-4 space-y-3 shadow-xl">
        {/* Spec Information Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center flex-wrap gap-2 text-slate-300">
            <span className="font-mono bg-white/10 px-2.5 py-1 rounded-lg text-[11px] border border-white/10">
              {activeWork.dimensions || '1080 × 1080 px'}
            </span>
            <span className="font-mono bg-white/10 px-2.5 py-1 rounded-lg text-[11px] border border-white/10">
              {activeWork.colorSpace || 'RGB Screen'}
            </span>
            <span className="font-mono bg-white/10 px-2.5 py-1 rounded-lg text-[11px] border border-white/10">
              Rev {activeWork.revisionCount || 1}
            </span>
            {activeWork.date && (
              <span className="hidden sm:inline-flex items-center gap-1 font-mono text-slate-400 text-[11px]">
                <Calendar className="w-3 h-3" />
                <span>{activeWork.date}</span>
              </span>
            )}
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            Karya {currentIndex + 1} dari {worksList.length}
          </div>
        </div>

        {/* Thumbnail Reel Strip */}
        {worksList.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-white/20">
            {worksList.map((w, idx) => {
              const isSelected = w.id === activeWork.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => onSelectWork(w)}
                  className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border transition-all ${
                    isSelected
                      ? 'ring-2 ring-indigo-500 border-white scale-105 shadow-md'
                      : 'border-white/20 opacity-50 hover:opacity-100 hover:border-white/60'
                  }`}
                  title={`${idx + 1}. ${w.title}`}
                >
                  <img
                    src={w.imageUri}
                    alt={w.title}
                    className="w-full h-full object-cover"
                  />
                  {(w.mediaType === 'video' || w.videoUri) && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Video className="w-3.5 h-3.5 text-purple-300" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
