import React, { useState } from 'react';
import {
  Smartphone,
  Layers,
  UtensilsCrossed,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Building,
  Sparkles,
} from 'lucide-react';

interface MockupPreviewProps {
  imageUri: string;
  videoUri?: string;
  title: string;
  description: string;
  hotelId: string;
  dimensions: string;
  dateStr?: string | null;
}

export const MockupPreview: React.FC<MockupPreviewProps> = ({
  imageUri,
  videoUri,
  title,
  description,
  hotelId,
  dimensions,
  dateStr,
}) => {
  const [mockupType, setMockupType] = useState<'instagram' | 'standee' | 'acrylic'>('instagram');
  const isSemarang = hotelId === 'hotel_semarang';

  const igHandle = isSemarang ? 'horisoninn_antawirya' : 'horisonresort_jepara';
  const hotelLocation = isSemarang
    ? 'Hotel Horison Inn Antawirya Semarang • Official'
    : 'Horison Resort Jepara Beachfront • Official';

  return (
    <div className="space-y-4">
      {/* Mockup Frame Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Real-World Mockup Engine</span>
        </span>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800">
          <button
            type="button"
            onClick={() => setMockupType('instagram')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mockupType === 'instagram'
                ? 'bg-white dark:bg-navy-800 text-electric-600 dark:text-electric-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Instagram Feed</span>
          </button>

          <button
            type="button"
            onClick={() => setMockupType('standee')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mockupType === 'standee'
                ? 'bg-white dark:bg-navy-800 text-amber-600 dark:text-amber-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Lobby Standee</span>
          </button>

          <button
            type="button"
            onClick={() => setMockupType('acrylic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mockupType === 'acrylic'
                ? 'bg-white dark:bg-navy-800 text-cyan-600 dark:text-cyan-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Acrylic Table Tent</span>
          </button>
        </div>
      </div>

      {/* Frame 1: Instagram Post Mockup */}
      {mockupType === 'instagram' && (
        <div className="w-full flex justify-center py-4 bg-slate-900/60 dark:bg-slate-950/80 rounded-2xl p-4 border border-slate-200/50 dark:border-navy-800/80 overflow-hidden">
          <div className="w-full max-w-[380px] bg-white dark:bg-black text-slate-900 dark:text-white rounded-[36px] shadow-2xl border-4 border-slate-700/60 dark:border-slate-800 overflow-hidden flex flex-col">
            {/* Phone notch bar */}
            <div className="pt-2 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              <span>9:41</span>
              <div className="w-20 h-4 bg-black dark:bg-slate-900 rounded-full mx-auto" />
              <span>5G 100%</span>
            </div>

            {/* IG Header */}
            <div className="px-3.5 py-2.5 flex items-center justify-between border-b border-slate-100 dark:border-zinc-900 mt-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                  <div className="w-full h-full rounded-full bg-navy-950 flex items-center justify-center text-white text-[10px] font-bold">
                    {isSemarang ? 'HI' : 'HR'}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold font-sans tracking-tight leading-none">
                      {igHandle}
                    </span>
                    <span className="w-3 h-3 rounded-full bg-electric-500 text-white flex items-center justify-center text-[7px] font-black">
                      ✓
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate max-w-[200px] leading-tight">
                    {hotelLocation}
                  </span>
                </div>
              </div>
              <span className="text-slate-400 text-sm font-mono tracking-tighter">•••</span>
            </div>

            {/* Deliverable Media in Square IG Frame */}
            <div className="relative aspect-square w-full bg-slate-950 flex items-center justify-center overflow-hidden">
              {videoUri ? (
                <video
                  src={videoUri}
                  poster={imageUri}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={imageUri}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* IG Action Bar */}
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-200">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500 hover:scale-110 transition-transform cursor-pointer" />
                  <MessageCircle className="w-5 h-5 hover:scale-110 transition-transform cursor-pointer" />
                  <Send className="w-5 h-5 hover:scale-110 transition-transform cursor-pointer" />
                </div>
                <Bookmark className="w-5 h-5 hover:scale-110 transition-transform cursor-pointer" />
              </div>

              <div className="text-[11px] font-bold">
                Liked by <span className="font-extrabold">marcomm_horison</span> and 482 others
              </div>

              <div className="text-xs space-y-1">
                <p className="line-clamp-2 leading-relaxed">
                  <span className="font-bold mr-1.5">{igHandle}</span>
                  {description}
                </p>
                <p className="text-[11px] text-electric-600 dark:text-electric-400 font-medium">
                  #HorisonHotels #HospitalityDesign #{isSemarang ? 'Semarang' : 'Jepara'} #DesignLog2026
                </p>
              </div>

              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                {dateStr || 'OCTOBER 2026'} • OFFICIAL CAMPAIGN
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Frame 2: Lobby Roll-Up Banner Standee */}
      {mockupType === 'standee' && (
        <div className="w-full flex items-center justify-center py-6 bg-gradient-to-b from-slate-900 via-navy-950 to-slate-950 rounded-2xl p-6 border border-slate-200/50 dark:border-navy-800/80 min-h-[460px] relative overflow-hidden">
          {/* Subtle marble floor reflective perspective */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-800/30 to-transparent pointer-events-none" />

          {/* Standee hardware container */}
          <div className="relative flex flex-col items-center max-w-[280px] sm:max-w-[320px] z-10">
            {/* Top hanging aluminum strip */}
            <div className="w-[104%] h-3 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 rounded-t shadow-md border-b border-slate-500" />

            {/* Poster body */}
            <div className="w-full bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-slate-700/50 overflow-hidden">
              <img
                src={imageUri}
                alt={title}
                className="w-full max-h-[360px] object-contain block"
              />
            </div>

            {/* Roll-up aluminum base cassette */}
            <div className="w-[108%] h-5 bg-gradient-to-r from-slate-500 via-slate-300 to-slate-500 rounded-b shadow-2xl relative flex items-center justify-around border-t border-slate-300">
              {/* Standee stabilizer feet */}
              <div className="w-7 h-2 bg-slate-600 rounded-b shadow -mb-1" />
              <div className="w-7 h-2 bg-slate-600 rounded-b shadow -mb-1" />
            </div>

            {/* Floor shadow */}
            <div className="w-[115%] h-3 bg-black/60 blur-md rounded-full mt-1" />

            {/* Location tag badge */}
            <div className="mt-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-amber-400" />
              <span>Lobby Display • {dimensions} Standee</span>
            </div>
          </div>
        </div>
      )}

      {/* Frame 3: Acrylic Table Tent Mockup */}
      {mockupType === 'acrylic' && (
        <div className="w-full flex items-center justify-center py-6 bg-gradient-to-b from-amber-950/20 via-slate-950 to-navy-950 rounded-2xl p-6 border border-slate-200/50 dark:border-navy-800/80 min-h-[460px] relative overflow-hidden">
          {/* Wooden restaurant table surface background effect */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-amber-900/10 border-t border-amber-800/20" />

          <div className="relative flex flex-col items-center max-w-[280px] sm:max-w-[310px] z-10">
            {/* Acrylic glossy frame wrap */}
            <div className="relative p-2 rounded-t-xl bg-white/10 backdrop-blur-xl border-2 border-white/40 shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
              {/* Gloss shine bar */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none rounded-t-xl" />

              <div className="bg-slate-950 rounded-lg overflow-hidden border border-white/20">
                <img
                  src={imageUri}
                  alt={title}
                  className="w-full max-h-[320px] object-contain"
                />
              </div>
            </div>

            {/* Clear acrylic table stand base */}
            <div className="w-[110%] h-4 bg-white/20 backdrop-blur-2xl border-t border-b border-white/40 rounded-sm shadow-xl flex items-center justify-center">
              <span className="text-[8px] font-mono uppercase tracking-widest text-slate-300">
                Horison F&B Table Tent
              </span>
            </div>

            {/* Stand shadow */}
            <div className="w-[120%] h-3 bg-black/50 blur-sm rounded-full mt-0.5" />

            <div className="mt-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono flex items-center gap-1.5">
              <UtensilsCrossed className="w-3.5 h-3.5 text-cyan-400" />
              <span>{dimensions} Restaurant Table Display</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
