import {
  MapPin,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useWorks } from '../../context/WorksContext';

export const HotelsView: React.FC = () => {
  const { works, setActiveScope, setActiveTab } = useWorks();

  const semarangWorks = works.filter((w) => w.hotelId === 'hotel_semarang');
  const jeparaWorks = works.filter((w) => w.hotelId === 'hotel_jepara');

  // Dynamic Print Ratio & Avg Iteration
  const semarangPrintCount = semarangWorks.filter((w) => w.dimensions?.includes('cm') || w.colorSpace?.includes('CMYK')).length;
  const semarangPrintRatio = semarangWorks.length > 0 ? Math.round((semarangPrintCount / semarangWorks.length) * 100) : 0;
  const semarangAvgRev = semarangWorks.length > 0 ? (semarangWorks.reduce((acc, w) => acc + (w.revisionCount || 0), 0) / semarangWorks.length).toFixed(1) : '0';

  const jeparaPrintCount = jeparaWorks.filter((w) => w.dimensions?.includes('cm') || w.colorSpace?.includes('CMYK')).length;
  const jeparaPrintRatio = jeparaWorks.length > 0 ? Math.round((jeparaPrintCount / jeparaWorks.length) * 100) : 0;
  const jeparaAvgRev = jeparaWorks.length > 0 ? (jeparaWorks.reduce((acc, w) => acc + (w.revisionCount || 0), 0) / jeparaWorks.length).toFixed(1) : '0';

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-electric-500 animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
            Hospitality Units
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-950 dark:text-white tracking-tight">
          Managed Hotel Properties
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Dual-property specifications, brand palettes, and design deliverables distribution across urban and resort clusters.
        </p>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Semarang Property */}
        <div className="rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm overflow-hidden flex flex-col justify-between group h-full">
          <div className="flex-1 flex flex-col">
            {/* Exterior Banner Image */}
            <div className="w-full h-64 sm:h-72 relative overflow-hidden bg-slate-100 dark:bg-navy-950 shrink-0">
              <img
                src="/horison-semarang.jpg"
                alt="Horison Inn Antawirya Semarang - Gedung BTB Training Center II Undip"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent flex items-end p-6">
                <div className="w-full">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white shadow-sm">
                      Training Center II Undip
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white border border-white/20 backdrop-blur-md">
                      Gedung BTB
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white mt-2 leading-snug">
                    Horison Inn Antawirya Semarang
                  </h2>
                  <div className="flex items-start gap-1.5 text-xs text-slate-300 mt-1 max-w-md min-h-[36px]">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">Jl. Prof. Soedarto, Tembalang, Kec. Tembalang, Kota Semarang, Jawa Tengah 50275</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics & Guidelines */}
            <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Deliverables</span>
                  <span className="text-xl font-display font-extrabold text-amber-600 dark:text-amber-400">
                    {semarangWorks.length} Works
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Print Ratio</span>
                  <span className="text-xl font-display font-extrabold text-navy-950 dark:text-white">
                    {semarangPrintRatio}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg Iteration</span>
                  <span className="text-xl font-display font-extrabold text-navy-950 dark:text-white">
                    {semarangAvgRev}x
                  </span>
                </div>
              </div>

              {/* Brand Guidelines & Palette */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                  Brand Colors &amp; Corporate Identity:
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex-1">
                    <span className="w-5 h-5 rounded-lg bg-[#a73918] shadow-xs shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-navy-950 dark:text-white truncate">Horison Ochre</div>
                      <div className="font-mono text-[10px] text-slate-400">#A73918</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex-1">
                    <span className="w-5 h-5 rounded-lg bg-[#191c21] shadow-xs shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-navy-950 dark:text-white truncate">Carbon Charcoal</div>
                      <div className="font-mono text-[10px] text-slate-400">#191C21</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 pt-0 flex flex-col sm:flex-row items-center gap-2.5 mt-auto">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Jl.+Prof.+Soedarto,+Tembalang,+Semarang+50275"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-navy-950 dark:text-white border border-slate-200 dark:border-navy-700 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
              <span>Google Maps</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setActiveScope('hotel_semarang');
                setActiveTab('my-works');
              }}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Explore Semarang Deliverables ({semarangWorks.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Jepara Property */}
        <div className="rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm overflow-hidden flex flex-col justify-between group h-full">
          <div className="flex-1 flex flex-col">
            {/* Exterior Banner Image */}
            <div className="w-full h-64 sm:h-72 relative overflow-hidden bg-slate-100 dark:bg-navy-950 shrink-0">
              <img
                src="/horison-jepara.jpg"
                alt="Horison Resort Antawirya Jepara - Beachfront Leisure Resort"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent flex items-end p-6">
                <div className="w-full">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-600 text-white shadow-sm">
                      Beachfront Leisure Resort
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white border border-white/20 backdrop-blur-md">
                      Teluk Awur
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-black text-white mt-2 leading-snug">
                    Horison Resort Antawirya Jepara
                  </h2>
                  <div className="flex items-start gap-1.5 text-xs text-slate-300 mt-1 max-w-md min-h-[36px]">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">Jl. Tlk. Awur, Telukawur, Kec. Tahunan, Kabupaten Jepara, Jawa Tengah 59427</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics & Guidelines */}
            <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Deliverables</span>
                  <span className="text-xl font-display font-extrabold text-cyan-600 dark:text-cyan-400">
                    {jeparaWorks.length} Works
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Print Ratio</span>
                  <span className="text-xl font-display font-extrabold text-navy-950 dark:text-white">
                    {jeparaPrintRatio}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg Iteration</span>
                  <span className="text-xl font-display font-extrabold text-navy-950 dark:text-white">
                    {jeparaAvgRev}x
                  </span>
                </div>
              </div>

              {/* Brand Guidelines & Palette */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                  Brand Colors &amp; Corporate Identity:
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex-1">
                    <span className="w-5 h-5 rounded-lg bg-[#254778] shadow-xs shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-navy-950 dark:text-white truncate">Deep Ocean Navy</div>
                      <div className="font-mono text-[10px] text-slate-400">#254778</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex-1">
                    <span className="w-5 h-5 rounded-lg bg-[#00a896] shadow-xs shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-navy-950 dark:text-white truncate">Teal Aqua</div>
                      <div className="font-mono text-[10px] text-slate-400">#00A896</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 pt-0 flex flex-col sm:flex-row items-center gap-2.5 mt-auto">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Jl.+Tlk.+Awur,+Telukawur,+Kec.+Tahunan,+Kabupaten+Jepara,+Jawa+Tengah+59427"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-navy-950 dark:text-white border border-slate-200 dark:border-navy-700 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-500" />
              <span>Google Maps</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setActiveScope('hotel_jepara');
                setActiveTab('my-works');
              }}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md shadow-cyan-600/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Explore Jepara Deliverables ({jeparaWorks.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
