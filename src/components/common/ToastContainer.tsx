import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useWorks } from '../../context/WorksContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useWorks();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-xl transition-all duration-300 animate-fade-in-up ${
            toast.type === 'success'
              ? 'bg-white/95 dark:bg-navy-900/95 text-navy-950 dark:text-white border-emerald-500/30 ring-1 ring-emerald-500/10'
              : toast.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 border-rose-500/30'
              : 'bg-white/95 dark:bg-navy-900/95 text-navy-950 dark:text-white border-slate-200 dark:border-navy-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-electric-500 shrink-0" />
            )}
            <span className="font-display font-medium text-xs">{toast.message}</span>
          </div>

          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-navy-950 dark:hover:text-white transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
