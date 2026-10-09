import React, { useState, useRef, useCallback } from 'react';
import { SlidersHorizontal, CheckCircle2, History } from 'lucide-react';

interface BeforeAfterSliderProps {
  imageUri: string;
  draftUri?: string;
  title: string;
  revisionCount: number;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  imageUri,
  draftUri,
  title,
  revisionCount,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <div className="space-y-4">
      {/* Description header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <SlidersHorizontal className="w-3.5 h-3.5 text-electric-500" />
          <span>Interactive Revision Split View</span>
          <span className="text-[11px] text-slate-400 font-normal">
            (Drag divider to compare draft vs approved sign-off)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSliderPos(0)}
            className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-navy-700 transition-colors"
          >
            Draft (0%)
          </button>
          <button
            type="button"
            onClick={() => setSliderPos(50)}
            className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-electric-500/10 text-electric-600 dark:text-electric-400 border border-electric-500/20 hover:bg-electric-500/20 transition-colors"
          >
            Split (50%)
          </button>
          <button
            type="button"
            onClick={() => setSliderPos(100)}
            className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-navy-700 transition-colors"
          >
            Final (100%)
          </button>
        </div>
      </div>

      {/* Interactive slider frame */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden select-none cursor-ew-resize bg-slate-950 border border-slate-200/80 dark:border-navy-800 shadow-xl"
      >
        {/* Layer 2 (Bottom / Right): Final Approved Sign-off */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-950">
          <img
            src={imageUri}
            alt={`${title} - Final Approved`}
            className="w-full h-full object-contain pointer-events-none"
          />
          <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold shadow-lg backdrop-blur-sm flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Final Approved Sign-Off</span>
          </div>
        </div>

        {/* Layer 1 (Top / Left clipped): Draft / Earlier Revision */}
        <div
          className="absolute inset-0 h-full overflow-hidden flex items-center justify-center bg-slate-950"
          style={{ width: `${sliderPos}%` }}
        >
          <div
            className="relative h-full flex items-center justify-center"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
          >
            <img
              src={draftUri || imageUri}
              alt={`${title} - Initial Draft`}
              className={`w-full h-full object-contain pointer-events-none ${
                !draftUri ? 'brightness-90 contrast-95 saturate-[0.75] sepia-[0.15]' : ''
              }`}
            />
          </div>

          <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-[11px] font-bold shadow-lg backdrop-blur-sm flex items-center gap-1.5">
            <History className="w-3.5 h-3.5" />
            <span>Draft / Revision #{Math.max(1, revisionCount)}</span>
          </div>
        </div>

        {/* Vertical Divider Line & Draggable Handle */}
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          {/* Vertical white rule */}
          <div className="w-0.5 h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] -translate-x-1/2" />

          {/* Central handle button */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-navy-950 shadow-2xl flex items-center justify-center border-2 border-electric-500 ring-4 ring-navy-950/20">
            <div className="flex items-center gap-0.5">
              <span className="w-0.5 h-3.5 bg-slate-400 rounded-full" />
              <span className="w-0.5 h-3.5 bg-slate-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 font-mono">
        Showing {Math.round(sliderPos)}% Draft / {100 - Math.round(sliderPos)}% Final Sign-off
      </div>
    </div>
  );
};
