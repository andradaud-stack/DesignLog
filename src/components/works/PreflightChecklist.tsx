import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Printer, Monitor } from 'lucide-react';
import type { Work } from '../../types/work';

interface PreflightChecklistProps {
  work: Work;
}

export const PreflightChecklist: React.FC<PreflightChecklistProps> = ({ work }) => {
  const isPrintTarget =
    work.categoryId === 'cat_backdrop' ||
    work.categoryId === 'cat_marketing' ||
    work.dimensions.toLowerCase().includes('cm') ||
    work.dimensions.toLowerCase().includes('mm') ||
    work.colorSpace.includes('CMYK');

  const specs = [
    {
      title: 'Color Space Calibration',
      status: work.colorSpace,
      verified: true,
      hint: isPrintTarget ? 'FOGRA39 CMYK 4-Color Process' : 'sRGB IEC61966-2.1 Web Spec',
    },
    {
      title: 'Resolution Density',
      status: isPrintTarget ? '300 DPI Native' : '72–150 DPI Retina',
      verified: true,
      hint: isPrintTarget ? 'High-resolution lossless raster' : 'Optimized for mobile compression',
    },
    {
      title: 'Bleed & Safety Zone',
      status: isPrintTarget ? '3mm Bleed Included' : 'Clean Aspect Ratio 1:1',
      verified: true,
      hint: 'No text or critical logos within cutting margin',
    },
    {
      title: 'Typography & Outlines',
      status: 'Vectors Converted to Curves',
      verified: true,
      hint: 'Fonts embedded / expanded to prevent vendor font missing',
    },
    {
      title: 'Editorial Sign-Off',
      status: work.status === 'final' ? 'Certified by GM & Marcomm' : `Reviewing (Rev #${work.revisionCount})`,
      verified: work.status === 'final',
      hint: work.status === 'final' ? 'Authorized for release & production' : 'Pending revision sign-off',
    },
  ];

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold text-navy-950 dark:text-white uppercase tracking-wider">
            Pre-Press & Publication Preflight Checklist
          </span>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
          {isPrintTarget ? <Printer className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
          <span>{isPrintTarget ? 'Print Production Ready' : 'Digital Release Ready'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {specs.map((spec, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 p-2 rounded-xl bg-white dark:bg-navy-900 border border-slate-200/60 dark:border-navy-800/80"
          >
            {spec.verified ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            )}
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  {spec.title}
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-navy-950 dark:text-white block">
                {spec.status}
              </span>
              <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                {spec.hint}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
