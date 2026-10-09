import React, { useState } from 'react';
import {
  TrendingUp,
  Download,
  Layers,
  Sparkles,
  Clock,
  Printer,
  Monitor,
  FileCheck,
} from 'lucide-react';
import { useWorks } from '../../context/WorksContext';
import { CATEGORIES } from '../../data/constants';

export const Statistics: React.FC = () => {
  const { works, setIsPdfModalOpen } = useWorks();
  const [selectedPeriodTab, setSelectedPeriodTab] = useState<'all' | 'c2' | 'c1'>('all');

  const periodFilteredWorks = works.filter((w) => {
    if (selectedPeriodTab === 'c2') return w.periodId === 'period_2026_2';
    if (selectedPeriodTab === 'c1') return w.periodId === 'period_2026_1';
    return true;
  });

  const totalWorks = periodFilteredWorks.length;
  const semarangWorks = periodFilteredWorks.filter((w) => w.hotelId === 'hotel_semarang');
  const jeparaWorks = periodFilteredWorks.filter((w) => w.hotelId === 'hotel_jepara');
  const semarangPercent = totalWorks > 0 ? Math.round((semarangWorks.length / totalWorks) * 100) : 0;
  const jeparaPercent = totalWorks > 0 ? 100 - semarangPercent : 0;

  // KPI 2: Velocity
  const velocity = totalWorks > 0 ? (totalWorks / 4).toFixed(1) : '0.0';

  // KPI 3: Signoff Accuracy
  const approvedWorks = periodFilteredWorks.filter((w) => w.status === 'final').length;
  const accuracyRate = totalWorks > 0 ? ((approvedWorks / totalWorks) * 100).toFixed(1) : '0.0';

  // KPI 4: Iteration depth
  const avgRounds = totalWorks > 0 ? (periodFilteredWorks.reduce((acc, w) => acc + (w.revisionCount || 0), 0) / totalWorks).toFixed(1) : '0.0';
  const srgAvgRounds = semarangWorks.length > 0 ? (semarangWorks.reduce((acc, w) => acc + (w.revisionCount || 0), 0) / semarangWorks.length).toFixed(1) : '0.0';
  const jprAvgRounds = jeparaWorks.length > 0 ? (jeparaWorks.reduce((acc, w) => acc + (w.revisionCount || 0), 0) / jeparaWorks.length).toFixed(1) : '0.0';

  // Format split Semarang & Jepara
  const srgPrintCount = semarangWorks.filter((w) => w.dimensions?.includes('cm') || w.colorSpace?.includes('CMYK')).length;
  const srgPrintPct = semarangWorks.length > 0 ? Math.round((srgPrintCount / semarangWorks.length) * 100) : 0;
  const srgDigPct = semarangWorks.length > 0 ? 100 - srgPrintPct : 0;

  const jprPrintCount = jeparaWorks.filter((w) => w.dimensions?.includes('cm') || w.colorSpace?.includes('CMYK')).length;
  const jprPrintPct = jeparaWorks.length > 0 ? Math.round((jprPrintCount / jeparaWorks.length) * 100) : 0;
  const jprDigPct = jeparaWorks.length > 0 ? 100 - jprPrintPct : 0;

  // Overall Media Channel
  const printCount = periodFilteredWorks.filter((w) => w.dimensions?.includes('cm') || w.colorSpace?.includes('CMYK')).length;
  const digCount = totalWorks - printCount;
  const printPct = totalWorks > 0 ? ((printCount / totalWorks) * 100).toFixed(1) : '0.0';
  const digPct = totalWorks > 0 ? ((digCount / totalWorks) * 100).toFixed(1) : '0.0';

  // Color Space
  const cmykCount = periodFilteredWorks.filter((w) => w.colorSpace?.includes('CMYK')).length;
  const rgbCount = totalWorks - cmykCount;

  // Category breakdown
  const categoryBreakdown = CATEGORIES.map((cat, idx) => {
    const catWorks = periodFilteredWorks.filter((w) => w.categoryId === cat.id);
    const smg = catWorks.filter((w) => w.hotelId === 'hotel_semarang').length;
    const jpr = catWorks.filter((w) => w.hotelId === 'hotel_jepara').length;
    const count = catWorks.length;
    const pct = totalWorks > 0 ? `${((count / totalWorks) * 100).toFixed(1)}%` : '0%';
    const smgPct = count > 0 ? `${Math.round((smg / count) * 100)}%` : '0%';
    const jprPct = count > 0 ? `${100 - Math.round((smg / count) * 100)}%` : '0%';
    return {
      name: `${idx + 1}. ${cat.name}`,
      smg,
      jpr,
      total: count,
      pct,
      smgPct,
      jprPct,
    };
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* 1. ARCHIVAL ANALYTICS HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-electric-500 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
              Quantitative Portfolio Ledger
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-950 dark:text-white tracking-tight">
            Analytics &amp; Statistics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Statistical audit of {totalWorks} design deliverables cataloging velocity, format ratios, and property balance.
          </p>
        </div>

        {/* Action buttons & Period filter pills */}
        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-navy-950 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedPeriodTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPeriodTab === 'all'
                  ? 'bg-white dark:bg-navy-800 text-navy-950 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white'
              }`}
            >
              All Periods (Apr–Dec 2026)
            </button>
            <button
              type="button"
              onClick={() => setSelectedPeriodTab('c2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedPeriodTab === 'c2'
                  ? 'bg-white dark:bg-navy-800 text-electric-600 dark:text-electric-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white'
              }`}
            >
              <span>Oct–Dec 2026</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedPeriodTab('c1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPeriodTab === 'c1'
                  ? 'bg-white dark:bg-navy-800 text-navy-950 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white'
              }`}
            >
              Apr–Jun 2026
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsPdfModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-electric-500 hover:bg-electric-600 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md shadow-electric-500/25 transition-all flex items-center gap-2 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export Analytics PDF</span>
          </button>
        </div>
      </div>

      {/* 2. TOP METRIC KPI HIGHLIGHTS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Archived Inventory */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Archived Inventory</span>
            <div className="w-9 h-9 rounded-xl bg-electric-500/10 text-electric-600 dark:text-electric-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-display font-extrabold text-navy-950 dark:text-white">
                {totalWorks}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Assets</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-navy-950 h-2 rounded-full overflow-hidden mt-2.5 flex">
              <div className="bg-amber-500 h-full" style={{ width: `${semarangPercent}%` }} />
              <div className="bg-cyan-500 h-full" style={{ width: `${jeparaPercent}%` }} />
            </div>
          </div>
          <div className="pt-2.5 border-t border-slate-100 dark:border-navy-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Semarang: {semarangWorks.length}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-500" /> Jepara: {jeparaWorks.length}
            </span>
          </div>
        </div>

        {/* KPI 2: Velocity */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Production Velocity</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-display font-extrabold text-navy-950 dark:text-white">
                {velocity}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Designs / Wk</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Active cadence during seasonal campaigns
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 dark:border-navy-800/80 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>{totalWorks > 0 ? '+ Active' : '0.0 baseline'}</span>
            <span className="font-mono text-slate-400">Cohort II</span>
          </div>
        </div>

        {/* KPI 3: Signoff Accuracy */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Signoff Accuracy</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-display font-extrabold text-navy-950 dark:text-white">
                {accuracyRate}%
              </span>
              <span className="text-xs font-mono text-emerald-500 font-bold">Approved</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Passed review within initial iterations
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 dark:border-navy-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{approvedWorks} of {totalWorks} approved</span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {totalWorks > 0 ? 'Verified' : 'Standby'}
            </span>
          </div>
        </div>

        {/* KPI 4: Iteration Depth */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Iteration Depth</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-display font-extrabold text-navy-950 dark:text-white">
                {avgRounds}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Rounds Avg</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Across marketing &amp; banquet collateral
            </p>
          </div>
          <div className="pt-2.5 border-t border-slate-100 dark:border-navy-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span className="text-amber-600 dark:text-amber-400 font-semibold">SRG: {srgAvgRounds}</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">JPR: {jprAvgRounds}</span>
          </div>
        </div>
      </section>

      {/* 3. DUAL-PROPERTY OUTPUT COMPARISON */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-navy-950 dark:text-white">
            Dual-Property Output Analysis
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Urban business hotel operational needs vs. coastal leisure resort requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Semarang Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                    Semarang Property • Urban Business
                  </span>
                  <h3 className="font-display font-bold text-lg text-navy-950 dark:text-white mt-2">
                    Horison Inn Antawirya Semarang
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Corporate lodging, MICE packages, staycation food promotions, and local city events.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-3xl font-display font-extrabold text-amber-600 dark:text-amber-400">
                    {semarangWorks.length}
                  </span>
                  <span className="block text-[10px] font-mono text-slate-400 uppercase font-bold">
                    Works ({semarangPercent}%)
                  </span>
                </div>
              </div>

              {/* Detail Stats Sub-Grid */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Format Split</span>
                  <div className="mt-1 flex items-baseline gap-1 text-xs">
                    <span className="font-bold text-navy-950 dark:text-white">{srgPrintPct}%</span>
                    <span className="text-slate-400">Print</span>
                    <span className="text-slate-300">/</span>
                    <span className="font-bold text-navy-950 dark:text-white">{srgDigPct}%</span>
                    <span className="text-slate-400">Digital</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Avg Iteration</span>
                  <div className="mt-1 flex items-baseline gap-1 text-xs">
                    <span className="font-bold text-navy-950 dark:text-white">{srgAvgRounds}</span>
                    <span className="text-slate-400">rounds/work</span>
                  </div>
                </div>
              </div>

              {/* Tags Profile */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-2">
                  Key Deliverables Profile
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Staycation F&B Vouchers',
                    'Banquet Standees & Rollups',
                    'Hari Nasional Campaigns',
                    'Room Promo Print Inserts',
                    'Keycard Sleeves',
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-navy-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Palettes: Ochre, Terra Cotta, Carbon Charcoal</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                {semarangWorks.length > 0 ? 'ACTIVE' : 'STANDBY'}
              </span>
            </div>
          </div>

          {/* Jepara Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30">
                    Jepara Property • Coastal Resort
                  </span>
                  <h3 className="font-display font-bold text-lg text-navy-950 dark:text-white mt-2">
                    Horison Resort Antawirya Jepara
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Seaside hospitality, beachfront concert stages, cultural heritage celebrations, and pool party graphics.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-3xl font-display font-extrabold text-cyan-600 dark:text-cyan-400">
                    {jeparaWorks.length}
                  </span>
                  <span className="block text-[10px] font-mono text-slate-400 uppercase font-bold">
                    Works ({jeparaPercent}%)
                  </span>
                </div>
              </div>

              {/* Detail Stats Sub-Grid */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Format Split</span>
                  <div className="mt-1 flex items-baseline gap-1 text-xs">
                    <span className="font-bold text-navy-950 dark:text-white">{jprPrintPct}%</span>
                    <span className="text-slate-400">Print</span>
                    <span className="text-slate-300">/</span>
                    <span className="font-bold text-navy-950 dark:text-white">{jprDigPct}%</span>
                    <span className="text-slate-400">Digital</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Avg Iteration</span>
                  <div className="mt-1 flex items-baseline gap-1 text-xs">
                    <span className="font-bold text-navy-950 dark:text-white">{jprAvgRounds}</span>
                    <span className="text-slate-400">rounds/work</span>
                  </div>
                </div>
              </div>

              {/* Tags Profile */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-2">
                  Key Deliverables Profile
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Halloween Beach Stage',
                    'Hari Batik Social Campaigns',
                    'Sunset Pool Lounge Menus',
                    'Live Acoustic Media Kits',
                    'Resort Signage Modules',
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-navy-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Palettes: Coastal Slate, Sand Beige, Cerulean</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                {jeparaWorks.length > 0 ? 'ACTIVE' : 'STANDBY'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CATEGORY BREAKDOWN (Stacked Comparative Bars) */}
      <section className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-navy-800/80">
          <div>
            <h3 className="font-display font-bold text-lg text-navy-950 dark:text-white">
              Works by Category ({CATEGORIES.length} Taxonomy Dimensions)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deliverable volume comparative split between Semarang and Jepara.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
              <span className="text-slate-700 dark:text-slate-300">Semarang</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" />
              <span className="text-slate-700 dark:text-slate-300">Jepara</span>
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {categoryBreakdown.map((item) => (
            <div key={item.name} className="space-y-1.5">
              <div className="flex justify-between items-baseline text-xs">
                <span className="font-semibold text-navy-950 dark:text-white truncate max-w-sm sm:max-w-md">
                  {item.name}
                </span>
                <span className="font-mono text-slate-500 dark:text-slate-400 shrink-0">
                  {item.total} works ({item.pct})
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-navy-950 overflow-hidden flex">
                <div
                  className="bg-amber-500 h-full transition-all duration-500"
                  style={{ width: item.smgPct }}
                  title={`Semarang: ${item.smg}`}
                />
                <div
                  className="bg-cyan-500 h-full transition-all duration-500"
                  style={{ width: item.jprPct }}
                  title={`Jepara: ${item.jpr}`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FORMAT & COLOR SPACE METRICS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Print vs Digital */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800/80">
            <h3 className="font-display font-bold text-base text-navy-950 dark:text-white flex items-center gap-2">
              <Printer className="w-4 h-4 text-electric-500" />
              <span>Media Channel Split</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Print vs Digital</span>
          </div>

          <div className="flex items-center justify-around py-4">
            <div className="text-center">
              <div className="text-3xl font-display font-extrabold text-navy-950 dark:text-white">{printPct}%</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-amber-500" />
                <span>Print Collateral ({printCount})</span>
              </div>
            </div>

            <div className="h-12 w-px bg-slate-200 dark:bg-navy-800" />

            <div className="text-center">
              <div className="text-3xl font-display font-extrabold text-navy-950 dark:text-white">{digPct}%</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-cyan-500" />
                <span>Digital / Feed ({digCount})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Color Space */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800/80">
            <h3 className="font-display font-bold text-base text-navy-950 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Color Space Calibration</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">Pre-Press Standards</span>
          </div>

          <div className="flex items-center justify-around py-4">
            <div className="text-center">
              <div className="text-3xl font-display font-extrabold text-navy-950 dark:text-white">{cmykCount}</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                CMYK / ISO FOGRA39
              </div>
            </div>

            <div className="h-12 w-px bg-slate-200 dark:bg-navy-800" />

            <div className="text-center">
              <div className="text-3xl font-display font-extrabold text-navy-950 dark:text-white">{rgbCount}</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                RGB / sRGB Screen
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
