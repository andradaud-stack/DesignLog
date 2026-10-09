import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useWorks } from '../../context/WorksContext';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  isOpen,
  onClose,
  initialIndex = 0,
}) => {
  const { filteredWorks } = useWorks();
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const works = filteredWorks.length > 0 ? filteredWorks : [];
  const currentWork = works[currentIndex];

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % (works.length || 1));
  }, [works.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + works.length) % (works.length || 1));
  }, [works.length]);

  // Slideshow timer
  useEffect(() => {
    if (!isPlaying || !isOpen) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, isOpen, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  if (!isOpen || !currentWork) return null;

  const isSemarang = currentWork.hotelId === 'hotel_semarang';

  return (
    <div className="fixed inset-0 z-50 bg-black/95 text-white flex flex-col justify-between select-none animate-fade-in backdrop-blur-2xl">
      {/* Top Floating Control Bar */}
      <div className="p-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono font-bold tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-electric-400 animate-ping" />
            <span>PORTFOLIO PRESENTATION MODE</span>
          </div>

          <span className="text-xs font-mono text-slate-400">
            {currentIndex + 1} / {works.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors"
            title="Toggle Browser Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-rose-500/80 backdrop-blur-md text-white transition-colors"
            title="Exit Presentation (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Artwork Stage */}
      <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-white transition-all hover:scale-110 z-20 shadow-2xl active:scale-95"
          title="Previous (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-white transition-all hover:scale-110 z-20 shadow-2xl active:scale-95"
          title="Next (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Artwork Image with ambient drop shadow glow */}
        <div className="relative max-h-full max-w-full flex items-center justify-center animate-scale-in">
          {currentWork.videoUri ? (
            <video
              src={currentWork.videoUri}
              poster={currentWork.imageUri}
              controls
              autoPlay
              playsInline
              className="max-h-[68vh] sm:max-h-[74vh] max-w-[90vw] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-white/10"
            />
          ) : (
            <img
              src={currentWork.imageUri}
              alt={currentWork.title}
              className="max-h-[68vh] sm:max-h-[74vh] max-w-[90vw] object-contain rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-white/10"
            />
          )}
        </div>
      </div>

      {/* Bottom Floating Info & Controller Deck */}
      <div className="p-6 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="space-y-1 max-w-xl text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isSemarang
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              }`}
            >
              {isSemarang ? 'Horison Semarang • Inn' : 'Horison Jepara • Resort'}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {currentWork.dimensions} • {currentWork.colorSpace}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight">
            {currentWork.title}
          </h3>

          <p className="text-xs text-slate-300 line-clamp-1 max-w-lg">
            {currentWork.description}
          </p>
        </div>

        {/* Slideshow & Playback Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 backdrop-blur-md transition-all ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30'
                : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-slate-950" />
                <span>Pause Auto-play</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Auto-play Slides</span>
              </>
            )}
          </button>

          <span className="text-[11px] font-mono text-slate-400 hidden lg:inline-block">
            [Space: Play/Pause • ← / → : Navigate • Esc: Exit]
          </span>
        </div>
      </div>
    </div>
  );
};
