import React, { useState, useEffect } from 'react';
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  BookOpen,
  File,
  Printer,
  Download,
  X,
} from 'lucide-react';
import { useWorks } from '../../context/WorksContext';

export const PdfPreviewModal: React.FC = () => {
  const { isPdfModalOpen, setIsPdfModalOpen, showToast } = useWorks();

  const [currentSpread, setCurrentSpread] = useState<number>(1); // 1 = Spread 1-2, 2 = Spread 3-4
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [spreadMode, setSpreadMode] = useState<'facing' | 'single'>('facing');
  const [focusMode, setFocusMode] = useState<boolean>(false);

  // Close on Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPdfModalOpen) {
        setIsPdfModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPdfModalOpen, setIsPdfModalOpen]);

  if (!isPdfModalOpen) return null;

  const handlePrintProof = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    showToast('Exporting pre-press ISO FOGRA39 PDF/X-1a package...', 'info');
    setTimeout(() => {
      showToast('Downloaded Aang_Portfolio_Ledger_Horison_Hotels_2026.pdf (84.2 MB)', 'success');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#191c21]/80 backdrop-blur-[6px] flex flex-col justify-between overflow-hidden animate-in fade-in duration-200">
      {/* Top Document Control Toolbar */}
      <header className="w-full bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-800 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-electric-500/10 text-electric-600 dark:text-electric-400 border border-electric-500/20">
            <FileText className="w-4 h-4" />
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold">PDF/X-1a</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-navy-950 dark:text-white truncate max-w-xs md:max-w-md">
                Aang_Portfolio_Ledger_Horison_Hotels_2026.pdf
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-navy-800 text-slate-500 font-medium">
                84.2 MB
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              DesignLog Archival Ledger — Complete Portfolio Export (2026.10 Edition)
            </span>
          </div>
        </div>

        {/* Center pagination & zoom controls */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 px-3 py-1.5 rounded-xl">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentSpread((s) => Math.max(1, s - 1))}
              disabled={currentSpread === 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-colors"
              id="prev-page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs px-2 text-slate-700 dark:text-slate-300 font-mono">
              Spread <strong className="font-bold text-navy-950 dark:text-white">{currentSpread === 1 ? '1–2' : '3–4'}</strong> of 18
            </span>
            <button
              onClick={() => setCurrentSpread((s) => Math.min(2, s + 1))}
              disabled={currentSpread === 2}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-colors"
              id="next-page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-4 bg-slate-200 dark:bg-navy-800" />

          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono font-bold w-12 text-center text-navy-950 dark:text-white">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(130, z + 15))}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="px-2 py-1 rounded-lg text-xs hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 font-medium transition-colors"
            >
              Fit Width
            </button>
          </div>

          <div className="w-px h-4 bg-slate-200 dark:bg-navy-800" />

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSpreadMode('facing')}
              className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-colors ${
                spreadMode === 'facing'
                  ? 'bg-electric-500 text-white shadow-xs font-bold border-electric-500'
                  : 'hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-400 border-transparent'
              }`}
              title="Facing Pages Spread"
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSpreadMode('single')}
              className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-colors ${
                spreadMode === 'single'
                  ? 'bg-electric-500 text-white shadow-xs font-bold border-electric-500'
                  : 'hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-400 border-transparent'
              }`}
              title="Single Page Flow"
            >
              <File className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right action suite */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintProof}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Proof</span>
          </button>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-electric-500 hover:bg-electric-600 text-white text-xs font-semibold shadow-md shadow-electric-500/25 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
          <button
            onClick={() => setIsPdfModalOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-500 hover:text-navy-950 dark:hover:text-white transition-colors ml-1"
            title="Close Viewer (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Stage */}
      <div className="flex-1 flex overflow-hidden">
        {/* Center Canvas Stage */}
        <div
          className={`flex-1 overflow-y-auto overflow-x-auto p-4 md:p-8 flex flex-col items-center gap-8 bg-[#eceef4] transition-all`}
        >
          {/* Spread Notification Banner */}
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/95 border border-surface-container-highest backdrop-blur-md shadow-sm text-on-surface shrink-0">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant font-semibold">
              Exhibition Proofing Mode
            </span>
            <span className="text-surface-dim font-light">•</span>
            <span className="font-label-sm text-label-sm text-on-surface font-medium">
              A4 Spread (420 × 297 mm) • ISO 12647-2 FOGRA39
            </span>
          </div>

          {/* SPREAD CONTAINER */}
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="transition-transform duration-200"
          >
            {currentSpread === 1 ? (
              /* SPREAD 1: Cover & Institutional Executive Brief */
              <div
                className={`w-full max-w-5xl shadow-2xl border border-surface-container-highest rounded bg-surface-container-lowest grid overflow-hidden ${
                  spreadMode === 'facing' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
                }`}
              >
                {/* LEFT PAGE: Front Archival Cover */}
                <div className="relative bg-[#191c21] text-surface p-8 sm:p-12 flex flex-col justify-between aspect-[1/1.414] overflow-hidden select-none">
                  <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-secondary/30 to-transparent pointer-events-none" />

                  {/* Header Stamp Block */}
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="font-label-sm text-label-sm tracking-[0.25em] uppercase text-surface-variant/80 font-semibold">
                        Archival Series ID
                      </span>
                      <span className="font-mono text-[13px] tracking-wider text-surface-tint">DL-ARCH-2026-HOR-001</span>
                    </div>
                    <div className="px-2 py-1 rounded bg-white/10 text-surface font-label-sm text-[10px] uppercase tracking-widest font-bold">
                      Official Release
                    </div>
                  </div>

                  {/* Primary Editorial Cover Title */}
                  <div className="relative z-10 flex flex-col gap-4 my-auto py-8">
                    <div className="w-12 h-1 bg-secondary mb-2" />
                    <span className="font-label-md text-label-md uppercase tracking-[0.2em] text-secondary-fixed font-bold">
                      Horison Hospitality Visual Ledger
                    </span>
                    <h2 className="font-headline-lg text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.08]">
                      DESIGNLOG<span className="text-secondary">.</span>
                    </h2>
                    <p className="font-editorial-quote text-editorial-quote italic text-surface-variant/90 leading-relaxed font-normal max-w-md text-lg">
                      Graphic Design Residency &amp; Multi-Property Brand Communications Ledger across Semarang &amp; Jepara
                      Properties.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-6 mt-4 border-t border-white/10 text-surface-variant">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[9px] uppercase tracking-wider text-white/50">Residency Scholar</span>
                        <span className="font-body-md text-body-md font-semibold text-white">Aang</span>
                        <span className="font-body-sm text-[11px] text-white/70">Lead Design Intern</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[9px] uppercase tracking-wider text-white/50">
                          Supervising Institution
                        </span>
                        <span className="font-body-md text-body-md font-semibold text-white">UDINUS &amp; MGM Corp</span>
                        <span className="font-body-sm text-[11px] text-white/70">Faculty of Computer Science</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Monogram & Seal */}
                  <div className="relative z-10 flex items-end justify-between pt-6 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white text-xs tracking-tighter ring-1 ring-white/20">
                        HD
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[10px] uppercase tracking-wider text-white/90 font-semibold">
                          PT Metropolitan Golden Management
                        </span>
                        <span className="font-body-sm text-[10px] text-white/50">
                          Horison Hotels Group • Central Java Operations
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-label-sm text-[10px] uppercase text-white/40 block">Cohort Period</span>
                      <span className="font-label-md text-label-md font-bold text-white tracking-widest">2023–2026</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT PAGE: Curatorial Executive Brief */}
                <div className="bg-surface-container-lowest p-8 sm:p-12 flex flex-col justify-between aspect-[1/1.414] select-none text-on-surface">
                  <div className="flex items-center justify-between pb-4 border-b border-surface-container-high">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant font-semibold">
                      Archival Ledger • Vol. IV
                    </span>
                    <span className="font-mono text-body-sm text-on-surface-variant">P. 01 / 18</span>
                  </div>

                  <div className="flex flex-col gap-4 py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary" />
                      <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                        Institutional Summary
                      </span>
                    </div>

                    <h3 className="font-headline-md text-2xl text-primary font-bold tracking-tight">
                      Curatorial Overview &amp; Cross-Property Methodology
                    </h3>

                    <p className="font-body-md text-sm text-on-surface-variant leading-relaxed text-justify">
                      This archival catalog establishes an official chronological record of 48 design deliverables formulated
                      for Horison Inn Antawirya Semarang and Horison Resort Antawirya Jepara. Collateral bridges dual-tier
                      hospitality narratives: the rigorous, urban business efficiency of the Semarang metro unit alongside
                      the maritime leisure, cultural heritage, and event-centric cadence of the coastal Jepara resort.
                    </p>

                    {/* Table of Archives */}
                    <div className="flex flex-col gap-2 pt-2">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold mb-1">
                        Index of Catalogued Folios
                      </span>
                      {[
                        { num: '01', title: 'Executive Overview & Verification Certifications', page: 'P. 01' },
                        { num: '02', title: 'Semarang Business Collaterals & In-Room Promos', page: 'P. 04' },
                        { num: '03', title: 'Jepara Coastal Resort Campaigns & Event Scenography', page: 'P. 08' },
                        { num: '04', title: 'National Commemorations & Cultural Heritage Series', page: 'P. 12' },
                        { num: '05', title: 'Pre-Press Color Specifications, Ink Density & Typographic DNA', page: 'P. 16' },
                      ].map((item) => (
                        <div
                          key={item.num}
                          className="flex items-baseline justify-between py-1 border-b border-dashed border-surface-container-highest text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-label-sm text-secondary font-bold">{item.num}</span>
                            <span className="font-medium text-on-surface text-xs">{item.title}</span>
                          </div>
                          <span className="font-mono text-xs text-on-surface-variant">{item.page}</span>
                        </div>
                      ))}
                    </div>

                    {/* Stamp */}
                    <div className="mt-2 p-3 rounded bg-surface-container-low border border-surface-container flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[9px] uppercase tracking-wider text-on-surface-variant">
                          Corporate Brand Verification
                        </span>
                        <span className="font-label-md text-label-md font-bold text-primary">MGM MarCom Directorate</span>
                        <span className="font-body-sm text-[11px] text-outline">Status: Fully Endorsed &amp; Sealed</span>
                      </div>
                      <div className="w-12 h-12 rounded-full border border-dashed border-secondary/60 flex items-center justify-center p-1 text-center bg-white shadow-sm">
                        <span className="font-label-sm text-[8px] uppercase tracking-tight font-bold text-secondary">
                          APPROVED 2026
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-surface-container-high text-on-surface-variant">
                    <span className="font-body-sm text-[11px]">DesignLog Documentation System</span>
                    <span className="font-label-sm text-[10px] uppercase tracking-widest font-semibold">
                      Semarang &amp; Jepara Units
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* SPREAD 2: Primary Work Gallery Inspection Spread */
              <div
                className={`w-full max-w-5xl shadow-2xl border border-surface-container-highest rounded bg-surface-container-lowest grid overflow-hidden ${
                  spreadMode === 'facing' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
                }`}
              >
                {/* LEFT PAGE: Urban & Heritage Collateral Showcase */}
                <div className="bg-surface-container-lowest p-8 sm:p-10 flex flex-col justify-between aspect-[1/1.414] select-none text-on-surface">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
                    <span className="px-2 py-0.5 rounded text-[10px] font-label-sm uppercase tracking-wider bg-secondary/10 text-secondary font-bold">
                      Folio 02 — Semarang Unit
                    </span>
                    <span className="font-mono text-body-sm text-on-surface-variant">P. 02 / 18</span>
                  </div>

                  {/* Showcase 1 */}
                  <div className="flex flex-col gap-2 my-1">
                    <div className="aspect-[4/3] rounded overflow-hidden relative shadow-sm bg-surface-container">
                      <img
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQMekxfju23fc27YC6uU5he8BWJa6oLmElu2GMnNVmt-Jroy87Hu90nIxsXO_QrNtNx4wPEZ-3RkNP9Adkd7FvqohPpLmi3yjrGNKnHLbNkbo4bCOUvDosa3NlKhF6L478Ip-dezH6Crri5J-7psb4lqA4BPZe_bRIAh1HEp-ERuUJ5zSz_NuMQdESKPyUWsVGegyaEcJNDId6tCbmeAelVkv4EXFELv2J4dKetyqovx_i0GSF6AI"
                        alt="Promo Kamar Semarang"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white font-label-sm text-[9px] uppercase tracking-widest font-semibold">
                        Poster A2 • 420 × 594 mm
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-headline-sm text-sm font-bold text-primary">Weekend Staycation Promo Kamar</h4>
                        <span className="font-label-sm text-[10px] text-secondary font-bold">300 DPI CMYK</span>
                      </div>
                      <p className="font-body-sm text-[11px] text-on-surface-variant leading-tight mt-0.5">
                        Key in-room collateral and elevator display targeting corporate weekend guests. Features warm neutral
                        typography pairing.
                      </p>
                    </div>
                  </div>

                  {/* Showcase 2 */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-surface-container-high">
                    <div className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-4 aspect-square rounded overflow-hidden shadow-sm bg-surface-container">
                        <img
                          className="w-full h-full object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7BBsj82XKLYnOposq_RHUzispWz4TOSJ8GX3hTZG1IR0iqrwKBd5RyubL4QWI9CrA4HibSxeBUkpj_Pgmvdc3nh3-xec3nw10Ws8i2kQcv6vcXiKYWLbtm75smirUJoAxBLo1NGUVznw0lpgiCb7aqAtb2J1LmnqMJhxPW40R2InT0axzNf8CsktgnOh1Vx57tmxtKK7PU11_caekqFX1w9h3e7kQ-z6Q-Pfp_r9r9KZSKgMmdTk"
                          alt="Pancasila"
                        />
                      </div>
                      <div className="col-span-8 flex flex-col gap-1">
                        <span className="font-label-sm text-[9px] uppercase tracking-widest text-secondary font-bold">
                          National Commemoration
                        </span>
                        <h5 className="font-headline-sm text-xs font-bold text-primary">Hari Kesaktian Pancasila</h5>
                        <p className="font-body-sm text-[11px] text-on-surface-variant leading-tight">
                          Vector-crafted coat of arms with solemn gold foil accents.
                        </p>
                        <span className="font-mono text-[10px] text-outline">1080 × 1080 px • sRGB 100%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-surface-container-high text-on-surface-variant text-[10px]">
                    <span className="uppercase font-semibold">Property: Horison Inn Semarang</span>
                    <span className="font-mono">Curator: Aang (DesignLog 2026)</span>
                  </div>
                </div>

                {/* RIGHT PAGE: Coastal Resort & Event Scenography */}
                <div className="bg-surface-container-lowest p-8 sm:p-10 flex flex-col justify-between aspect-[1/1.414] select-none text-on-surface">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
                    <span className="px-2 py-0.5 rounded text-[10px] font-label-sm uppercase tracking-wider bg-tertiary-container/15 text-[#254778] font-bold">
                      Folio 03 — Jepara Resort Unit
                    </span>
                    <span className="font-mono text-body-sm text-on-surface-variant">P. 03 / 18</span>
                  </div>

                  {/* Showcase 3 */}
                  <div className="flex flex-col gap-2 my-1">
                    <div className="aspect-square max-h-48 mx-auto rounded overflow-hidden relative shadow-sm bg-surface-container">
                      <img
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpEvh51RzyZIq1CLpCoP-11ceFP3nH5uctUN2jXAnZVDAWmYLvguVJy6SivkKPJnVw352awc40U2fh2560msShAd9rgrgqPlA6vMeWESalQmen9bKlNby7A6F6ldDuFQNM6d9a7wsPSCcHXFxigNYNk4Qg5x_1VZ52SJ5oo3kWuL95MSgGT-7ycNCsiUP8Qslxd8SdfmlkUc8VZGS1tC3v0du7YXrCBdPruJQ9ZVhuvnVtnnu6Yf8"
                        alt="Batik Jepara"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white font-label-sm text-[9px] uppercase tracking-widest font-semibold">
                        Campaign Feed • 1080 × 1350 px
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-headline-sm text-sm font-bold text-primary">Hari Batik Nasional</h4>
                        <span className="font-label-sm text-[10px] text-[#254778] font-bold">Feed 4:5 Asset</span>
                      </div>
                      <p className="font-body-sm text-[11px] text-on-surface-variant leading-tight mt-0.5">
                        Integrated hospitality marketing celebrating Indonesian textile heritage against the Jepara
                        beachfront landscape.
                      </p>
                    </div>
                  </div>

                  {/* Showcase 4 */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-surface-container-high">
                    <div className="relative rounded overflow-hidden aspect-[16/9] shadow-sm bg-surface-container">
                      <img
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-wjdxEj1SncH-KUQnegjX4KqJnkBM7z6w9CZeh2n5zBzyrtUZMSrhocY5swJf6QmiIBjtNJGLDH7_Im0KKziAhMTpaBbwAATT1UbXeAbrhw73PXhbQ7rWTN8VFXhNWndNnH34D98_YfFOrrZzxENjvDQ18CYvQNfaFeYEvI1BffJxDwH_P_pKAeQKI7HUCizrrCxMEECGAaNWb8ZZwyQXSzwKpH5vSj1HR0nb7IpRoN4yzmqFh5U"
                        alt="Halloween Stage"
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-white font-label-sm text-[9px] uppercase tracking-widest font-semibold">
                        Flexi Backdrop • 6000 × 3500 mm
                      </div>
                    </div>
                    <div>
                      <h5 className="font-headline-sm text-xs font-bold text-primary">Halloween Night Party Stage Backdrop</h5>
                      <p className="font-body-sm text-[11px] text-on-surface-variant leading-tight">
                        Beachfront truss concert backdrop and guest photobooth system.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-surface-container-high text-on-surface-variant text-[10px]">
                    <span className="uppercase font-semibold">Property: Horison Resort Jepara</span>
                    <span className="font-mono">Verified: GM Sign-off Logged</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Curatorial Zoom & Floating Inspection Dock */}
          {!focusMode && (
            <div className="sticky bottom-4 z-30 flex items-center gap-3 px-4 py-2 rounded-full bg-white/95 border border-surface-container-highest backdrop-blur-md shadow-lg text-on-surface shrink-0">
              <div className="flex items-center gap-2 pr-3 border-r border-surface-container-highest">
                <span className="material-symbols-outlined text-[18px] text-secondary">palette</span>
                <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
                  Detected Color DNA
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-[#1b2b34] ring-1 ring-black/10" title="#1B2B34 • Slate Dark" />
                <div className="w-4 h-4 rounded-full bg-[#baa479] ring-1 ring-black/10" title="#BAA479 • Hotel Gold" />
                <div className="w-4 h-4 rounded-full bg-[#a73918] ring-1 ring-black/10" title="#A73918 • Horison Terracotta" />
                <div className="w-4 h-4 rounded-full bg-[#2b4c7e] ring-1 ring-black/10" title="#2B4C7E • Jepara Coast Blue" />
              </div>
              <div className="w-px h-4 bg-surface-container-highest" />
              <button
                onClick={() => setFocusMode(true)}
                className="flex items-center gap-1 text-label-sm font-label-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                <span>Focus Mode</span>
              </button>
            </div>
          )}
        </div>

        {/* Right-Hand Document Sidebar: Pre-Press Rail */}
        {!focusMode && (
          <aside className="w-80 lg:w-96 bg-white border-l border-surface-container-highest flex flex-col justify-between shrink-0 overflow-y-auto z-10 shadow-sm text-on-surface">
            <div className="p-space-lg flex flex-col gap-5">
              <div className="flex flex-col gap-1 pb-4 border-b border-surface-container-highest">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                    Pre-Press Pipeline
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-label-sm uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span>Valid
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-primary">Pre-Flight Certification</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Automated validation adhering to ISO 12647-2 commercial print standards.
                </p>
              </div>

              {/* Technical Verification Matrix */}
              <div className="flex flex-col gap-3">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
                  Technical Verification Matrix
                </span>
                <div className="space-y-2.5">
                  {[
                    {
                      title: 'Raster Assets Embedded ≥ 300 DPI',
                      desc: 'All 48 deliverables render above high-resolution threshold.',
                    },
                    {
                      title: 'CMYK FOGRA39 & sRGB Embedded',
                      desc: 'Dual profile mapping active for lithographic & digital proofing.',
                    },
                    {
                      title: '3mm Document Bleed & Trim Box',
                      desc: 'Accurate die-cut margins configured on print assets.',
                    },
                    {
                      title: 'Typefaces Outlined & Embedded',
                      desc: 'Plus Jakarta Sans, Inter & Newsreader glyph subsets intact.',
                    },
                    {
                      title: 'Delta E < 2.0 Color Tolerancing',
                      desc: 'Horison terracotta brand palette strictly within tolerance bounds.',
                    },
                  ].map((check) => (
                    <div
                      key={check.title}
                      className="flex items-start gap-2.5 p-2.5 rounded bg-surface-container-low border border-surface-container-highest"
                    >
                      <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5 font-bold">
                        verified
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-label-md font-bold text-primary">{check.title}</span>
                        <span className="font-body-sm text-[11px] text-on-surface-variant leading-snug">{check.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Print Substrate Specs */}
              <div className="flex flex-col gap-2 pt-2 border-t border-surface-container-highest">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
                  Target Substrates
                </span>
                <div className="p-3 rounded bg-surface-container-low text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Inner Folios:</span>
                    <span className="font-semibold text-primary">Arctic Volume White 150 gsm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Hardcover:</span>
                    <span className="font-semibold text-primary">Curious Matter 380 gsm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Binding:</span>
                    <span className="font-semibold text-primary">Swiss Lay-flat Exposed Sewn</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-space-lg border-t border-surface-container-highest bg-surface-container-low flex flex-col gap-2">
              <button
                onClick={handleDownloadPdf}
                className="w-full py-2.5 rounded bg-primary text-white font-label-md text-label-md font-bold flex items-center justify-center gap-2 hover:bg-[#2e3036] transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">file_download</span>
                <span>Export Master Archive PDF</span>
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
