import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useWorks } from '../../context/WorksContext';
import type { TaskPriority, TaskStatus, Department } from '../../types/task';

export const AddTaskModal: React.FC = () => {
  const {
    isAddTaskModalOpen,
    setIsAddTaskModalOpen,
    editingTask,
    setEditingTask,
    addTask,
    updateTask,
    showToast,
    requireEditorAuth,
  } = useWorks();

  const isEditing = !!editingTask;

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState<Department>('fnb');
  const [requesterName, setRequesterName] = useState('');
  const [requesterContact, setRequesterContact] = useState('');
  const [hotelId, setHotelId] = useState('hotel_semarang');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [targetOutput, setTargetOutput] = useState('Standing Banner 60×160 cm');
  const [targetDimensions, setTargetDimensions] = useState('60 × 160 cm');
  const [priority, setPriority] = useState<TaskPriority>('urgent');
  const [status, setStatus] = useState<TaskStatus>('backlog');
  const [deadline, setDeadline] = useState('2026-10-12');
  const [description, setDescription] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');

  // Dimension presets
  const presets = [
    { label: 'Standing Banner (60×160 cm)', output: 'Standing Banner 60×160 cm', dims: '60 × 160 cm', media: 'image' },
    { label: 'Instagram Feed (1080×1080 px)', output: 'Feed Instagram 1:1', dims: '1080 × 1080 px', media: 'image' },
    { label: 'Instagram Story (1080×1920 px)', output: 'Story Instagram 9:16', dims: '1080 × 1920 px', media: 'image' },
    { label: 'Reels / TikTok Video (9:16)', output: 'Video Reels 9:16', dims: '1080 × 1920 px', media: 'video' },
    { label: 'Table Tent Card A6 Resto', output: 'Tent Card Meja A6', dims: '10.5 × 14.8 cm', media: 'image' },
    { label: 'Keycard Pocket / Amplop', output: 'Amplop Saku Kartu Kamar', dims: '7 × 10 cm', media: 'image' },
    { label: 'Flyer / Poster Cetak A4', output: 'Poster / E-Flyer A4', dims: '21 × 29.7 cm', media: 'image' },
  ];

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDepartment(editingTask.department);
      setRequesterName(editingTask.requesterName);
      setRequesterContact(editingTask.requesterContact || '');
      setHotelId(editingTask.hotelId);
      setMediaType(editingTask.mediaType);
      setTargetOutput(editingTask.targetOutput);
      setTargetDimensions(editingTask.targetDimensions || '');
      setPriority(editingTask.priority);
      setStatus(editingTask.status);
      setDeadline(editingTask.deadline);
      setDescription(editingTask.description);
      setReferenceUrl(editingTask.referenceUrl || '');
    } else {
      // Default reset
      setTitle('');
      setDepartment('fnb');
      setRequesterName('');
      setRequesterContact('');
      setHotelId('hotel_semarang');
      setMediaType('image');
      setTargetOutput('Standing Banner 60×160 cm');
      setTargetDimensions('60 × 160 cm');
      setPriority('urgent');
      setStatus('backlog');
      setDeadline(new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10));
      setDescription('');
      setReferenceUrl('');
    }
  }, [editingTask, isAddTaskModalOpen]);

  if (!isAddTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Judul tugas wajib diisi!', 'error');
      return;
    }
    if (!requesterName.trim()) {
      showToast('Nama pemohon / staf wajib diisi!', 'error');
      return;
    }

    requireEditorAuth(() => {
      if (isEditing && editingTask) {
        updateTask(editingTask.id, {
          title,
          department,
          requesterName,
          requesterContact,
          hotelId,
          mediaType,
          targetOutput,
          targetDimensions,
          priority,
          status,
          deadline,
          description,
          referenceUrl,
        });
        setIsAddTaskModalOpen(false);
        setEditingTask(null);
      } else {
        addTask({
          title,
          department,
          requesterName,
          requesterContact,
          hotelId,
          mediaType,
          targetOutput,
          targetDimensions,
          priority,
          status,
          deadline,
          description,
          referenceUrl,
        });
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.7 },
        });
        setIsAddTaskModalOpen(false);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-navy-950/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-3xl shadow-2xl overflow-hidden my-auto animate-scale-in">
        {/* TOP ACCENT BAR */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-electric-500 to-indigo-600" />

        {/* HEADER */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-navy-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                {isEditing ? 'Perbarui Permintaan' : 'Request Desain Baru (Task Intake)'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-navy-950 dark:text-white">
              {isEditing ? 'Edit Tugas Desain' : 'Catat Antrean Tugas Desain'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsAddTaskModalOpen(false);
              setEditingTask(null);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-navy-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* JUDUL TUGAS */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1.5">
              Judul Tugas / Nama Promo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Standing Banner Promo Dimsum Fiesta Weekend"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-sm font-semibold text-navy-950 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-electric-500"
            />
          </div>

          {/* DEPARTEMEN & PEMOHON */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1.5">
                Departemen Pemohon <span className="text-red-500">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs sm:text-sm font-semibold text-navy-950 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-electric-500"
              >
                <option value="fnb">🍽️ F&amp;B (Restoran, Bar &amp; Banquet)</option>
                <option value="sales">💼 Sales &amp; Marketing</option>
                <option value="front_office">🛎️ Front Office &amp; Rooms</option>
                <option value="hrd">👥 HRD &amp; Internal Affairs</option>
                <option value="gm">👑 General Manager Office</option>
                <option value="marcom">📢 Internal Marcom / PR</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1.5">
                Nama Pemohon / Staf <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Chef Dimas / Bu Maya Sales"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs sm:text-sm font-semibold text-navy-950 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-electric-500"
              />
            </div>
          </div>

          {/* HOTEL & KONTAK WA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1.5">
                Properti Hotel
              </label>
              <select
                value={hotelId}
                onChange={(e) => setHotelId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs sm:text-sm font-semibold text-navy-950 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-electric-500"
              >
                <option value="hotel_semarang">🏨 Horison Inn Semarang</option>
                <option value="hotel_jepara">🌊 Horison Resort Jepara</option>
                <option value="hotel_both">✨ Kedua Hotel (Dual Unit - Semarang &amp; Jepara)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1.5">
                Kontak WA / Telepon (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: WA 0812-3456-7890 / Ext 104"
                value={requesterContact}
                onChange={(e) => setRequesterContact(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs sm:text-sm text-navy-950 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-electric-500"
              />
            </div>
          </div>

          {/* PRESET TARGET & DIMENSI */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
              Pilih Preset Output Media:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTargetOutput(p.output);
                    setTargetDimensions(p.dims);
                    setMediaType(p.media as 'image' | 'video');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    targetOutput === p.output
                      ? 'bg-electric-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-navy-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1.5">
                Nama Saluran Output
              </label>
              <input
                type="text"
                placeholder="misal: Standing Banner 60×160 cm"
                value={targetOutput}
                onChange={(e) => setTargetOutput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs sm:text-sm font-semibold text-navy-950 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-electric-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1.5">
                Dimensi Ukuran
              </label>
              <input
                type="text"
                placeholder="misal: 60 × 160 cm atau 1080 × 1080 px"
                value={targetDimensions}
                onChange={(e) => setTargetDimensions(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs sm:text-sm font-mono text-navy-950 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-electric-500"
              />
            </div>
          </div>

          {/* PRIORITAS, STATUS & DEADLINE */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1.5">
                Tingkat Prioritas
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs font-bold text-navy-950 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-electric-500"
              >
                <option value="urgent">🔴 Urgent (H-1 / H-2)</option>
                <option value="high">🟡 Tinggi</option>
                <option value="normal">🔵 Normal</option>
                <option value="low">⚪ Fleksibel / Rendah</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1.5">
                Status Awal
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs font-bold text-navy-950 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-electric-500"
              >
                <option value="backlog">📥 Belum Dikerjakan</option>
                <option value="in_progress">🎨 Sedang Didesain</option>
                <option value="in_review">🔍 Review &amp; Revisi</option>
                <option value="completed">✅ Selesai</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1.5">
                Deadline Selesai
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs font-mono font-bold text-navy-950 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-electric-500"
              />
            </div>
          </div>

          {/* CATATAN BRIEF / COPYWRITING */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1.5">
              Catatan Brief &amp; Draft Teks Promosi (Copywriting)
            </label>
            <textarea
              rows={4}
              placeholder="Tuliskan info promo, headline promo, harga, periode berlaku, syarat &amp; ketentuan, contact person..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs sm:text-sm text-navy-950 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-electric-500 leading-relaxed font-sans"
            />
          </div>

          {/* LINK GOOGLE DRIVE / BAHAN FOTO */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1.5">
              Link Referensi Foto / Google Drive (Opsional)
            </label>
            <input
              type="url"
              placeholder="https://drive.google.com/drive/folders/..."
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-xs text-navy-950 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-electric-500"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => {
                setIsAddTaskModalOpen(false);
                setEditingTask(null);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-electric-600 hover:bg-electric-500 text-white shadow-md shadow-electric-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              {isEditing ? 'Simpan Perubahan' : 'Tambahkan ke Papan Tugas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
