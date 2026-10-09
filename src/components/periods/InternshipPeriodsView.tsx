import React from 'react';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useWorks } from '../../context/WorksContext';

export const InternshipPeriodsView: React.FC = () => {
  const { works, setActivePeriod, setActiveTab } = useWorks();

  const cohort2Works = works.filter((w) => w.periodId === 'period_2026_2');
  const cohort1Works = works.filter((w) => w.periodId === 'period_2026_1');

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-electric-500 animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
            Residency Roadmap &amp; Curriculum
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-950 dark:text-white tracking-tight">
          Internship Periods
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Dual cohort curriculum tracking deliverables velocity, seasonal sprints, and institutional milestones.
        </p>
      </div>

      {/* Cohorts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cohort II: Active Track */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border-2 border-electric-500 shadow-xl flex flex-col justify-between relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-48 h-48 bg-electric-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
              <span className="px-3 py-1 rounded-full bg-electric-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm shadow-electric-500/25">
                Cohort II • Active Residency
              </span>
              <span className="text-xs font-semibold text-electric-600 dark:text-electric-400 font-mono">
                Day 24 of 92 (26% Elapsed)
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-navy-950 dark:text-white">
                Oktober — Desember 2026
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Active seasonal peak handling dual properties across Halloween events, Hari Batik, Hari Santri, and upcoming year-end festive promotions.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Output</span>
                <span className="text-xl font-display font-extrabold text-navy-950 dark:text-white">
                  {cohort2Works.length} Assets
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Semarang</span>
                <span className="text-xl font-display font-extrabold text-amber-600 dark:text-amber-400">
                  {cohort2Works.filter((w) => w.hotelId === 'hotel_semarang').length}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Jepara</span>
                <span className="text-xl font-display font-extrabold text-cyan-600 dark:text-cyan-400">
                  {cohort2Works.filter((w) => w.hotelId === 'hotel_jepara').length}
                </span>
              </div>
            </div>

            {/* Curriculum Milestones */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                Curriculum Milestones Completed:
              </span>
              <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Onboarding &amp; MGM Brand Standards Alignment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>October Seasonal Sprint: Hari Batik &amp; Halloween Backdrops</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-electric-500 shrink-0" />
                  <span>In Progress: Year-End F&amp;B Vouchers &amp; Banquet Standees</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setActivePeriod('period_2026_2');
              setActiveTab('my-works');
            }}
            className="w-full py-3 rounded-xl bg-electric-500 hover:bg-electric-600 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md shadow-electric-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Explore Cohort II Works ({cohort2Works.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Cohort I: Completed Track */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800">
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                Cohort I • Completed
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                100% Certified
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-black text-navy-950 dark:text-white">
                April — Juni 2026
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Foundational term establishing multi-property visual language, Hari Lahir Pancasila, Eid Mubarak greetings, and initial banquet roll-up collateral.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Output</span>
                <span className="text-xl font-display font-extrabold text-navy-950 dark:text-white">
                  {cohort1Works.length} Assets
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Semarang</span>
                <span className="text-xl font-display font-extrabold text-amber-600 dark:text-amber-400">
                  {cohort1Works.filter((w) => w.hotelId === 'hotel_semarang').length}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Jepara</span>
                <span className="text-xl font-display font-extrabold text-cyan-600 dark:text-cyan-400">
                  {cohort1Works.filter((w) => w.hotelId === 'hotel_jepara').length}
                </span>
              </div>
            </div>

            {/* Curriculum Milestones */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                Certification Archival Record:
              </span>
              <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Foundational Design System Sign-off</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Midterm Evaluation: Score 94.2 / 100</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Portfolio Assessment Approved by General Manager</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setActivePeriod('period_2026_1');
              setActiveTab('my-works');
            }}
            className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 text-navy-950 dark:text-white font-semibold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Explore Cohort I Works ({cohort1Works.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
