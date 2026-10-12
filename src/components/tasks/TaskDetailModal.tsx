import React, { useState } from 'react';
import {
  X,
  Calendar,
  User,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  Edit,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useWorks } from '../../context/WorksContext';
import type { TaskStatus, Department, TaskPriority } from '../../types/task';

export const TaskDetailModal: React.FC = () => {
  const {
    selectedTaskForDetail,
    setSelectedTaskForDetail,
    moveTaskStatus,
    addRevisionNote,
    toggleRevisionResolved,
    convertTaskToWork,
    deleteTask,
    setEditingTask,
    setIsAddTaskModalOpen,
    works,
    setActiveTab,
    setSelectedWorkForDetail,
    showToast,
    requireEditorAuth,
  } = useWorks();

  const [revAuthor, setRevAuthor] = useState('');
  const [revNote, setRevNote] = useState('');
  const [copiedBrief, setCopiedBrief] = useState(false);

  if (!selectedTaskForDetail) return null;
  const task = selectedTaskForDetail;

  const handleCopyBrief = () => {
    navigator.clipboard.writeText(
      `[BRIEF DESAIN: ${task.title}]\n\nDepartemen: ${task.department.toUpperCase()}\nPemohon: ${task.requesterName}\nTarget: ${task.targetOutput} (${task.targetDimensions || '-'})\nDeadline: ${task.deadline}\n\nCatatan & Copywriting:\n${task.description}`
    );
    setCopiedBrief(true);
    showToast('Teks brief & copywriting berhasil disalin ke clipboard!', 'info');
    setTimeout(() => setCopiedBrief(false), 2000);
  };

  const handleAddRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revNote.trim()) return;
    requireEditorAuth(() => {
      addRevisionNote(task.id, revAuthor, revNote);
      setRevAuthor('');
      setRevNote('');
    });
  };

  const handleConvert = () => {
    requireEditorAuth(() => {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      convertTaskToWork(task.id);
    });
  };

  const getDeptBadge = (dept: Department) => {
    const map: Record<Department, { label: string; bg: string }> = {
      fnb: { label: 'F&B (Resto & Bar)', bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' },
      sales: { label: 'Sales & Marketing', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
      front_office: { label: 'Front Office', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
      hrd: { label: 'HRD & Internal', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
      gm: { label: 'GM Office', bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
      marcom: { label: 'Marcom / PR', bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
    };
    return map[dept] || { label: dept, bg: 'bg-slate-500/10 text-slate-600 border-slate-500/20' };
  };

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'urgent':
        return { label: '🔴 Urgent (H-1 / Segera)', cls: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30 font-bold' };
      case 'high':
        return { label: '🟡 Prioritas Tinggi', cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30' };
      case 'normal':
        return { label: '🔵 Normal', cls: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30' };
      case 'low':
        return { label: '⚪ Fleksibel', cls: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30' };
    }
  };

  const statusSteps: { id: TaskStatus; label: string; icon: string }[] = [
    { id: 'backlog', label: 'Belum Dikerjakan', icon: '📥' },
    { id: 'in_progress', label: 'Sedang Didesain', icon: '🎨' },
    { id: 'in_review', label: 'Review & Revisi', icon: '🔍' },
    { id: 'completed', label: 'Selesai / Approved', icon: '✅' },
  ];

  const dept = getDeptBadge(task.department);
  const prio = getPriorityBadge(task.priority);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-navy-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl shadow-2xl overflow-hidden my-auto animate-scale-in">
        {/* TOP ACCENT BAR */}
        <div className="h-1.5 w-full bg-gradient-to-r from-electric-500 via-indigo-500 to-amber-500" />

        {/* HEADER */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-navy-800 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${dept.bg}`}>
                {dept.label}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] border ${prio.cls}`}>
                {prio.label}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300">
                {task.hotelId === 'hotel_both'
                  ? '✨ Dual Unit (Semarang & Jepara)'
                  : task.hotelId === 'hotel_semarang'
                  ? '🏨 Horison Semarang'
                  : '🌊 Horison Jepara'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-navy-950 dark:text-white leading-snug">
              {task.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setSelectedTaskForDetail(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-navy-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WORKFLOW STATUS TABS */}
        <div className="bg-slate-50 dark:bg-navy-950/60 p-3 sm:px-6 border-b border-slate-200/80 dark:border-navy-800">
          <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
            Status Alur Pengerjaan:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {statusSteps.map((s) => {
              const isActive = task.status === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => requireEditorAuth(() => moveTaskStatus(task.id, s.id))}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-electric-500 text-white shadow-md shadow-electric-500/25 scale-[1.02]'
                      : 'bg-white dark:bg-navy-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-700 hover:border-electric-400'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* SECTION 1: METADATA GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950/40 border border-slate-200/70 dark:border-navy-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-electric-500" /> Pemohon
              </span>
              <p className="font-semibold text-sm text-navy-950 dark:text-white mt-1">
                {task.requesterName}
              </p>
              {task.requesterContact && (
                <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-slate-400" /> {task.requesterContact}
                </span>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950/40 border border-slate-200/70 dark:border-navy-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-electric-500" /> Target &amp; Dimensi
              </span>
              <p className="font-semibold text-sm text-navy-950 dark:text-white mt-1 truncate">
                {task.targetOutput}
              </p>
              <span className="text-[11px] font-mono text-electric-600 dark:text-electric-400 font-bold block mt-0.5">
                {task.targetDimensions || (task.mediaType === 'video' ? '1080×1920 (9:16)' : '1080×1080 (1:1)')}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950/40 border border-slate-200/70 dark:border-navy-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-red-500" /> Deadline Selesai
              </span>
              <p className="font-bold text-sm text-navy-950 dark:text-white mt-1">
                {task.deadline}
              </p>
              <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                Format: {task.mediaType === 'video' ? '🎬 Video Motion Reels' : '🖼️ Desain Grafis'}
              </span>
            </div>
          </div>

          {/* REFERENCE DRIVE LINK (IF ANY) */}
          {task.referenceUrl && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs text-blue-900 dark:text-blue-200 font-medium">
                  Bahan Mentah / Foto &amp; Aset Referensi Google Drive
                </span>
              </div>
              <a
                href={task.referenceUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-white dark:bg-navy-800 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg shadow-xs hover:underline flex items-center gap-1"
              >
                Buka Link ↗
              </a>
            </div>
          )}

          {/* SECTION 2: BRIEF & COPYWRITING */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-electric-500" />
                Catatan Brief &amp; Draft Copywriting Pemohon
              </label>
              <button
                type="button"
                onClick={handleCopyBrief}
                className="text-xs font-semibold text-electric-600 dark:text-electric-400 hover:text-electric-700 flex items-center gap-1"
              >
                {copiedBrief ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedBrief ? 'Tersalin!' : 'Salin Teks Brief'}
              </button>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950/70 border border-slate-200/80 dark:border-navy-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm whitespace-pre-line leading-relaxed font-sans">
              {task.description}
            </div>
          </div>

          {/* SECTION 3: REVISION & FEEDBACK LOG */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                Log Catatan Revisi &amp; Feedback ({task.revisions.length})
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                {task.revisions.filter((r) => r.resolved).length}/{task.revisions.length} Teratasi
              </span>
            </div>

            {/* Revision List */}
            {task.revisions.length > 0 ? (
              <div className="space-y-2">
                {task.revisions.map((rev) => (
                  <div
                    key={rev.id}
                    onClick={() => requireEditorAuth(() => toggleRevisionResolved(task.id, rev.id))}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      rev.resolved
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200/60 dark:border-emerald-900/30 text-slate-400 line-through'
                        : 'bg-white dark:bg-navy-800 border-amber-300/70 dark:border-amber-700/50 text-slate-800 dark:text-slate-100 shadow-xs'
                    }`}
                  >
                    <div className="pt-0.5">
                      {rev.resolved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-amber-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-navy-950 dark:text-white">
                          {rev.author}
                        </span>
                        <span className="font-mono text-slate-400 text-[10px]">{rev.createdAt}</span>
                      </div>
                      <p className={`text-xs ${rev.resolved ? 'text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                        {rev.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic p-3 rounded-2xl bg-slate-50 dark:bg-navy-950/40 border border-slate-200/50 dark:border-navy-800 text-center">
                Belum ada catatan revisi dari GM / Marcom. Klik form di bawah jika ada feedback.
              </p>
            )}

            {/* Add revision input */}
            <form onSubmit={handleAddRevision} className="flex flex-col sm:flex-row gap-2 pt-1">
              <input
                type="text"
                placeholder="Peninjau (misal: Bu GM, Marcom Head)"
                value={revAuthor}
                onChange={(e) => setRevAuthor(e.target.value)}
                className="w-full sm:w-1/3 px-3 py-2 text-xs rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-electric-500"
              />
              <input
                type="text"
                placeholder="Tulis catatan revisi (misal: Font harga diperbesar...)"
                value={revNote}
                onChange={(e) => setRevNote(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-electric-500"
              />
              <button
                type="submit"
                disabled={!revNote.trim()}
                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Catat
              </button>
            </form>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-navy-800 bg-slate-50/70 dark:bg-navy-950/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                requireEditorAuth(() => {
                  if (confirm(`Yakin ingin menghapus tugas "${task.title}"?`)) {
                    deleteTask(task.id);
                  }
                });
              }}
              className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Hapus
            </button>
            <button
              type="button"
              onClick={() => {
                requireEditorAuth(() => {
                  setEditingTask(task);
                  setIsAddTaskModalOpen(true);
                  setSelectedTaskForDetail(null);
                });
              }}
              className="px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-navy-800 rounded-xl transition-colors flex items-center gap-1"
            >
              <Edit className="w-3.5 h-3.5" /> Edit Data
            </button>
          </div>

          <div className="flex items-center gap-2">
            {task.convertedWorkId ? (
              <button
                type="button"
                onClick={() => {
                  const linkedWork = works.find((w) => w.id === task.convertedWorkId);
                  setSelectedTaskForDetail(null);
                  setActiveTab('my-works');
                  if (linkedWork) {
                    setSelectedWorkForDetail(linkedWork);
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Buka Karya di My Works ↗
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConvert}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-transform hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4" /> Jadikan Portofolio (+ Karya)
              </button>
            )}
            <button
              type="button"
              onClick={() => setSelectedTaskForDetail(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-navy-950 dark:hover:text-white"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
