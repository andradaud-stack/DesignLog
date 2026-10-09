import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Eye,
} from 'lucide-react';
import { useWorks } from '../../context/WorksContext';

export const CalendarView: React.FC = () => {
  const { works, setSelectedWorkForDetail } = useWorks();

  const [selectedMonth, setSelectedMonth] = useState<number>(10); // 10 = October 2026
  const [selectedDay, setSelectedDay] = useState<number | null>(6);

  // Month works
  const monthWorks = works.filter((w) => w.month === selectedMonth && w.year === 2026);
  const exactWorks = monthWorks.filter((w) => w.dateCertainty === 'exact' && w.date);
  const monthOnlyWorks = works.filter((w) => w.dateCertainty === 'month' && w.month === selectedMonth);

  // Days in month calculation (October 2026 has 31 days, starts on Thursday)
  const daysInMonth = 31;
  const startDayOfWeek = 4; // Thursday (0 = Sun, 1 = Mon, ..., 4 = Thu)

  const getWorksForDay = (day: number) => {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateStr = `2026-${selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth}-${dayStr}`;
    return exactWorks.filter((w) => w.date === dateStr);
  };

  const selectedDayWorks = selectedDay ? getWorksForDay(selectedDay) : [];

  const getMonthName = (m: number) => {
    const names = ['', '', '', '', 'April', 'May', 'June', '', '', '', 'October', 'November', 'December'];
    return names[m] || 'Month';
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-electric-500 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
              Release &amp; Publication Schedule
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-950 dark:text-white tracking-tight">
            Production Calendar
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Multi-tier chronological ledger tracking exact release dates and seasonal sprints.
          </p>
        </div>

        {/* Month Selector Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-navy-950 p-1 rounded-xl">
          {[4, 5, 6, 10, 11, 12].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setSelectedMonth(m);
                setSelectedDay(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedMonth === m
                  ? 'bg-white dark:bg-navy-800 text-electric-600 dark:text-electric-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white'
              }`}
            >
              {getMonthName(m)} 2026
            </button>
          ))}
        </div>
      </div>

      {/* 2. CALENDAR GRID + DAY INSPECTOR SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800/80">
            <h2 className="font-display font-bold text-lg text-navy-950 dark:text-white">
              {getMonthName(selectedMonth)} 2026 Grid
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {exactWorks.length} exact dated • {monthOnlyWorks.length} month-level
            </span>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-2">
            {/* Blank leading days */}
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`blank-${i}`} className="aspect-square rounded-xl bg-slate-50/50 dark:bg-navy-950/40 opacity-30" />
            ))}

            {/* Days 1 to 31 */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const dayWorks = getWorksForDay(day);
              const isSelected = selectedDay === day;
              const hasWorks = dayWorks.length > 0;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square p-1.5 sm:p-2 rounded-2xl flex flex-col justify-between transition-all text-left relative group ${
                    isSelected
                      ? 'bg-electric-500 text-white ring-2 ring-electric-500 shadow-md shadow-electric-500/25 scale-[1.03]'
                      : hasWorks
                      ? 'bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 hover:border-electric-400/50 text-navy-950 dark:text-white'
                      : 'bg-white dark:bg-navy-900 border border-slate-100 dark:border-navy-800/60 hover:bg-slate-50 dark:hover:bg-navy-800/40 text-slate-400'
                  }`}
                >
                  <span className={`text-xs font-bold font-mono ${isSelected ? 'text-white' : ''}`}>
                    {day}
                  </span>

                  {hasWorks && (
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-white' : 'bg-electric-500 animate-pulse'
                        }`}
                      />
                      <span
                        className={`text-[10px] font-mono font-bold ${
                          isSelected ? 'text-white' : 'text-electric-600 dark:text-electric-400'
                        }`}
                      >
                        {dayWorks.length}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Day Inspector (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-navy-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-800/80">
              <h3 className="font-display font-bold text-base text-navy-950 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-electric-500" />
                <span>
                  {selectedDay
                    ? `${getMonthName(selectedMonth)} ${selectedDay}, 2026`
                    : 'Select a Date'}
                </span>
              </h3>
              <span className="text-xs font-mono font-bold text-electric-600 dark:text-electric-400">
                {selectedDayWorks.length} works
              </span>
            </div>

            {/* List of deliverables on this day */}
            <div className="space-y-3 mt-4 max-h-[460px] overflow-y-auto pr-1">
              {selectedDayWorks.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                  <CalendarIcon className="w-8 h-8 mx-auto text-slate-300 dark:text-navy-700" />
                  <p>No deliverables recorded specifically on this calendar day.</p>
                </div>
              ) : (
                selectedDayWorks.map((work) => {
                  const isSemarang = work.hotelId === 'hotel_semarang';
                  return (
                    <div
                      key={work.id}
                      onClick={() => setSelectedWorkForDetail(work)}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 hover:border-electric-500/50 cursor-pointer transition-all flex items-center gap-3 group"
                    >
                      <img
                        alt={work.title}
                        src={work.imageUri}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-navy-800 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                              isSemarang
                                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                                : 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400'
                            }`}
                          >
                            {isSemarang ? 'Semarang' : 'Jepara'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {work.dimensions}
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-xs text-navy-950 dark:text-white truncate group-hover:text-electric-500 transition-colors">
                          {work.title}
                        </h4>
                      </div>
                      <Eye className="w-4 h-4 text-slate-400 group-hover:text-electric-500 shrink-0" />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Month Precision Note */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">
              Multi-Tier Precision Note:
            </span>
            <p>
              Deliverables without exact timestamps ({monthOnlyWorks.length} this month) are archived at monthly scope and accessible via My Works filter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
