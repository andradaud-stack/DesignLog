import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Check,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Trash2,
  Layers,
  Video,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useWorks } from '../../context/WorksContext';
import { compressImageFile } from '../../utils/imageUtils';
import type { WorkStatus, DateCertainty, AspectRatio } from '../../types/work';

export const AddWorkModal: React.FC = () => {
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    editingWork,
    setEditingWork,
    addWork,
    updateWork,
    hotels,
    periods,
    categories,
    showToast,
    requireEditorAuth,
  } = useWorks();

  const isEditing = !!editingWork;

  const getTodayDateString = () => new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState('');
  const [hotelId, setHotelId] = useState('hotel_semarang');
  const [periodId, setPeriodId] = useState('period_2026_2');
  const [categoryId, setCategoryId] = useState('cat_hari_nasional');
  const [status, setStatus] = useState<WorkStatus>('final');
  const [description, setDescription] = useState('');
  const [dateCertainty, setDateCertainty] = useState<DateCertainty>('exact');
  const [date, setDate] = useState(getTodayDateString());
  const [month, setMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(() => new Date().getFullYear());
  const [revisionCount, setRevisionCount] = useState<number>(1);
  const [dimensions, setDimensions] = useState('1080 × 1080 px');
  const [colorSpace, setColorSpace] = useState('RGB / FEED');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [videoUri, setVideoUri] = useState('');
  const [duration, setDuration] = useState('0:30');
  const [imageUri, setImageUri] = useState('');
  const [draftImageUri, setDraftImageUri] = useState('');
  const [imageInputMethod, setImageInputMethod] = useState<'upload' | 'url'>('upload');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const draftFileInputRef = useRef<HTMLInputElement>(null);

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    if (newDate) {
      const parts = newDate.split('-');
      if (parts.length >= 2) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        if (!isNaN(m)) setMonth(m);
        if (!isNaN(y)) setYear(y);
        setDateCertainty('exact');
      }
    }
  };

  useEffect(() => {
    if (editingWork) {
      setTitle(editingWork.title);
      setHotelId(editingWork.hotelId);
      setPeriodId(editingWork.periodId);
      setCategoryId(editingWork.categoryId);
      setStatus(editingWork.status);
      setDescription(editingWork.description);
      setDateCertainty(editingWork.dateCertainty || 'exact');
      const workDate = editingWork.date || (editingWork.createdAt ? editingWork.createdAt.slice(0, 10) : getTodayDateString());
      setDate(workDate);
      if (workDate) {
        const parts = workDate.split('-');
        if (parts.length >= 2) {
          setYear(parseInt(parts[0], 10) || 2026);
          setMonth(parseInt(parts[1], 10) || 10);
        }
      } else {
        setMonth(editingWork.month || 10);
        setYear(editingWork.year || 2026);
      }
      setRevisionCount(editingWork.revisionCount);
      setDimensions(editingWork.dimensions);
      setColorSpace(editingWork.colorSpace);
      setAspectRatio(editingWork.aspectRatio);
      setMediaType(editingWork.mediaType || (editingWork.videoUri ? 'video' : 'image'));
      setVideoUri(editingWork.videoUri || '');
      setDuration(editingWork.duration || '0:30');
      setImageUri(editingWork.imageUri);
      setDraftImageUri(editingWork.draftImageUri || '');
      setImageInputMethod(editingWork.imageUri.startsWith('data:') ? 'upload' : 'url');
    } else {
      setTitle('');
      setHotelId('hotel_semarang');
      setPeriodId('period_2026_2');
      setCategoryId('cat_hari_nasional');
      setStatus('final');
      setDescription('');
      setDateCertainty('exact');
      const today = getTodayDateString();
      setDate(today);
      setMonth(new Date().getMonth() + 1);
      setYear(new Date().getFullYear());
      setRevisionCount(1);
      setDimensions('1080 × 1080 px');
      setColorSpace('RGB / FEED');
      setAspectRatio('1:1');
      setMediaType('image');
      setVideoUri('');
      setDuration('0:30');
      setImageUri('');
      setDraftImageUri('');
      setImageInputMethod('upload');
    }
  }, [editingWork, isAddModalOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (isAddModalOpen || editingWork)) {
        setIsAddModalOpen(false);
        setEditingWork(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddModalOpen, editingWork, setIsAddModalOpen, setEditingWork]);

  // Support clipboard paste (Ctrl+V) when modal is focused
  useEffect(() => {
    if (!isAddModalOpen && !editingWork) return;

    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            setIsCompressing(true);
            try {
              const dataUrl = await compressImageFile(file);
              setImageUri(dataUrl);
              setImageInputMethod('upload');
              showToast('Pasted image from clipboard successfully!', 'success');
            } catch {
              showToast('Failed to process pasted image', 'error');
            } finally {
              setIsCompressing(false);
            }
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isAddModalOpen, editingWork, showToast]);

  const handleFileUpload = async (file: File, isDraft = false) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP, SVG)', 'error');
      return;
    }

    setIsCompressing(true);
    try {
      const compressedDataUrl = await compressImageFile(file);
      if (isDraft) {
        setDraftImageUri(compressedDataUrl);
        showToast('Draft revision image attached!', 'success');
      } else {
        setImageUri(compressedDataUrl);
        showToast('Main deliverable image loaded & optimized!', 'success');
      }
    } catch {
      showToast('Error processing file', 'error');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0], false);
    }
  };

  const setDimensionPreset = (dim: string, ratio: AspectRatio, space: string) => {
    setDimensions(dim);
    setAspectRatio(ratio);
    setColorSpace(space);
  };

  if (!isAddModalOpen && !editingWork) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a deliverable title', 'error');
      return;
    }

    const defaultFallback = mediaType === 'video'
      ? 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80'
      : 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80';
    const finalImageUri = imageUri.trim() || defaultFallback;

    const finalDate = date.trim() || getTodayDateString();
    const finalYear = finalDate ? parseInt(finalDate.split('-')[0], 10) || year : year;
    const finalMonth = finalDate ? parseInt(finalDate.split('-')[1], 10) || month : month;

    requireEditorAuth(() => {
      if (isEditing && editingWork) {
        updateWork(editingWork.id, {
          title,
          hotelId,
          periodId,
          categoryId,
          status,
          description,
          dateCertainty,
          date: finalDate,
          month: finalMonth,
          year: finalYear,
          revisionCount,
          dimensions,
          colorSpace,
          aspectRatio,
          mediaType,
          videoUri: mediaType === 'video' ? (videoUri.trim() || undefined) : undefined,
          duration: mediaType === 'video' ? duration : undefined,
          imageUri: finalImageUri,
          draftImageUri: draftImageUri.trim() || undefined,
        });
        setEditingWork(null);
      } else {
        addWork({
          title,
          hotelId,
          periodId,
          categoryId,
          status,
          description,
          dateCertainty,
          date: finalDate,
          month: finalMonth,
          year: finalYear,
          revisionCount,
          dimensions,
          colorSpace,
          aspectRatio,
          mediaType,
          videoUri: mediaType === 'video' ? (videoUri.trim() || undefined) : undefined,
          duration: mediaType === 'video' ? duration : undefined,
          imageUri: finalImageUri,
          draftImageUri: draftImageUri.trim() || undefined,
        });
        setIsAddModalOpen(false);
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch {
          // ignore
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-navy-900 rounded-3xl border border-slate-200/80 dark:border-navy-800 shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto flex flex-col my-auto">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-navy-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-navy-900/95 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-electric-500/10 text-electric-600 dark:text-electric-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-base sm:text-lg text-navy-950 dark:text-white">
                {isEditing ? 'Edit Design Deliverable' : 'Add New Graphic Deliverable'}
              </h2>
              <span className="text-[11px] text-slate-400">
                Horison Hotels Archival Ledger • Dual Property
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsAddModalOpen(false);
              setEditingWork(null);
            }}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-navy-800 flex items-center justify-center text-slate-400 hover:text-navy-950 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs">
          {/* Format Type Selector (Static Graphic Design vs Video Reels) */}
          <div className="space-y-1.5">
            <label className="font-bold text-navy-950 dark:text-white block text-xs">
              Deliverable Medium &amp; Format *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMediaType('image');
                  if (categoryId === 'cat_video_reels') setCategoryId('cat_promo');
                }}
                className={`p-3 rounded-2xl border flex items-center gap-3 transition-all text-left ${
                  mediaType === 'image'
                    ? 'border-electric-500 bg-electric-500/10 text-navy-950 dark:text-white shadow-sm ring-1 ring-electric-500'
                    : 'border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950/40 text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-electric-500/15 text-electric-500 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold block text-xs">Static Graphic Design</span>
                  <span className="text-[10px] text-slate-400 block">Poster, Feed, Standee, Tentcard</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMediaType('video');
                  setCategoryId('cat_video_reels');
                  setDimensions('1080 × 1920 px (9:16)');
                  setAspectRatio('9:16');
                  setColorSpace('Rec.709 / 1080p');
                }}
                className={`p-3 rounded-2xl border flex items-center gap-3 transition-all text-left ${
                  mediaType === 'video'
                    ? 'border-purple-500 bg-purple-500/10 text-navy-950 dark:text-white shadow-sm ring-1 ring-purple-500'
                    : 'border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950/40 text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold block text-xs">Video &amp; Motion Reels</span>
                  <span className="text-[10px] text-slate-400 block">9:16 Reels, TikTok, Room Tour</span>
                </div>
              </button>
            </div>
          </div>

          {/* Video Stream Source (Only for video deliverables) */}
          {mediaType === 'video' && (
            <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-navy-950 dark:text-white flex items-center gap-1.5 text-xs">
                  <Video className="w-4 h-4 text-purple-500" />
                  <span>Video Stream Source (MP4, WebM, Cloud Link) *</span>
                </label>
                <span className="text-[10px] font-mono text-purple-400">9:16 Vertical Video</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold block">Video URL</label>
                  <input
                    type="url"
                    value={videoUri}
                    onChange={(e) => setVideoUri(e.target.value)}
                    placeholder="https://.../video.mp4 or Drive / Cloud video URL"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-navy-950 dark:text-white font-mono text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold block">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 0:30"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-navy-950 dark:text-white font-mono text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 1. VISUAL ASSET UPLOADER (Drag & Drop, File Picker, or URL) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-navy-950 dark:text-white flex items-center gap-1.5 text-xs">
                <ImageIcon className="w-4 h-4 text-electric-500" />
                <span>{mediaType === 'video' ? 'Video Cover / Poster Artwork *' : 'Primary Deliverable Artwork *'}</span>
              </label>

              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800">
                <button
                  type="button"
                  onClick={() => setImageInputMethod('upload')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                    imageInputMethod === 'upload'
                      ? 'bg-white dark:bg-navy-800 text-electric-600 dark:text-electric-400 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Upload File / Paste (Ctrl+V)
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMethod('url')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                    imageInputMethod === 'url'
                      ? 'bg-white dark:bg-navy-800 text-electric-600 dark:text-electric-400 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {imageInputMethod === 'upload' ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                  isDragging
                    ? 'border-electric-500 bg-electric-500/10'
                    : imageUri
                    ? 'border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950/60'
                    : 'border-slate-300 dark:border-navy-700 hover:border-electric-500/50 bg-slate-50/50 dark:bg-navy-950/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0], false);
                    }
                  }}
                />

                {imageUri ? (
                  <div className="space-y-3 w-full flex flex-col items-center">
                    <div className="relative max-h-48 max-w-xs rounded-xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-navy-800 bg-slate-950">
                      <img
                        src={imageUri}
                        alt="Preview"
                        className="max-h-48 w-auto object-contain"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Artwork Loaded
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageUri('');
                        }}
                        className="text-[11px] text-rose-500 hover:underline flex items-center gap-1 ml-2"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Click or drop another file to replace • Ctrl+V to paste screenshot
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-electric-500/10 text-electric-500 flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-navy-950 dark:text-white text-xs sm:text-sm">
                        {isCompressing ? 'Compressing and optimizing...' : 'Click to browse or drag & drop artwork'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        PNG, JPG, WebP, SVG • Or press <strong>Ctrl+V</strong> to paste from clipboard
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={imageUri}
                    onChange={(e) => setImageUri(e.target.value)}
                    placeholder="https://example.com/artwork.jpg"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-navy-950 dark:text-white font-mono text-xs focus:ring-2 focus:ring-electric-500 outline-none"
                  />
                </div>
                {imageUri && (
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/60 dark:border-navy-800">
                    <img src={imageUri} alt="URL Preview" className="w-10 h-10 rounded-lg object-cover" />
                    <span className="text-[11px] text-slate-500 truncate">Preview loaded from URL</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. CORE INFORMATION */}
          <div className="space-y-1.5">
            <label className="font-bold text-navy-950 dark:text-white">
              Deliverable Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Desain Promo Weekend Buffet Horison Semarang"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-electric-500 text-xs sm:text-sm font-medium"
            />
          </div>

          {/* Hotel & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-navy-950 dark:text-white">Hotel Property *</label>
              <select
                value={hotelId}
                onChange={(e) => setHotelId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-electric-500 font-medium"
              >
                {hotels.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.id === 'hotel_both' ? '✨ Kedua Hotel (Dual Unit - Semarang & Jepara)' : `${h.name} (${h.city})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-navy-950 dark:text-white">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-electric-500 font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tanggal Karya / Publikasi & Internship Cohort */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-navy-950 dark:text-white flex items-center gap-1.5 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-electric-500" />
                  <span>Tanggal Karya / Selesai Dibuat *</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleDateChange(getTodayDateString())}
                  className="text-[10px] text-electric-500 hover:text-electric-600 font-bold hover:underline transition-colors"
                >
                  Set Hari Ini
                </button>
              </div>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-electric-500 font-medium text-xs sm:text-sm cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 block">
                Bisa dipilih bebas: tanggal hari ini, kemarin, atau tanggal tugas sebelumnya.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-navy-950 dark:text-white">Internship Cohort / Periode</label>
              <select
                value={periodId}
                onChange={(e) => setPeriodId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-electric-500 font-medium"
              >
                {periods.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400 block">
                Periode penempatan magang aktif.
              </span>
            </div>
          </div>

          {/* Status & Revision Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-navy-950 dark:text-white">Editorial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as WorkStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-electric-500 font-medium capitalize"
              >
                <option value="final">Final Sign-Off (Approved)</option>
                <option value="revision">In Revision</option>
                <option value="in_progress">In Progress</option>
                <option value="draft">Concept Draft</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-navy-950 dark:text-white">Revision Cycle</label>
              <input
                type="number"
                min="0"
                max="20"
                value={revisionCount}
                onChange={(e) => setRevisionCount(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-navy-950 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-bold text-navy-950 dark:text-white">
              Description &amp; Operational Rationale
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain marketing objective, typography decisions, target guest audience, and publication placement..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-electric-500 font-medium"
            />
          </div>

          {/* Quick Presets for Technical Specifications */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-navy-950 dark:text-white">
                Technical Specifications &amp; Presets
              </label>
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => setDimensionPreset('1080 × 1920 px', '9:16', 'Rec.709 / 1080p')}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 dark:bg-purple-500/20 hover:bg-purple-500/30 text-purple-600 dark:text-purple-300 border border-purple-500/30"
                >
                  9:16 Video Reel
                </button>
                <button
                  type="button"
                  onClick={() => setDimensionPreset('1080 × 1080 px', '1:1', 'RGB / FEED')}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                >
                  IG Feed 1:1
                </button>
                <button
                  type="button"
                  onClick={() => setDimensionPreset('1080 × 1920 px', '9:16', 'RGB / FEED')}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                >
                  Story / Reel
                </button>
                <button
                  type="button"
                  onClick={() => setDimensionPreset('60 × 160 cm', '3:4', 'CMYK / PRINT')}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                >
                  Standee 60×160
                </button>
                <button
                  type="button"
                  onClick={() => setDimensionPreset('A5 (148 × 210 mm)', '3:4', 'CMYK / PRINT')}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                >
                  A5 Table Tent
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Dimensions</label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="1080 × 1080 px"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-navy-950 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-navy-950 dark:text-white font-medium"
                >
                  <option value="1:1">1:1 Square</option>
                  <option value="9:16">9:16 Reels / TikTok / Story</option>
                  <option value="4:5">4:5 Instagram Portrait</option>
                  <option value="3:4">3:4 Poster / Standee</option>
                  <option value="16:9">16:9 Banner / Landscape Video</option>
                  <option value="16:10">16:10 Horizontal Media</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Color Profile</label>
                <select
                  value={colorSpace}
                  onChange={(e) => setColorSpace(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200/80 dark:border-navy-800 text-navy-950 dark:text-white font-medium"
                >
                  <option value="RGB / FEED">RGB / FEED</option>
                  <option value="CMYK / PRINT">CMYK / PRINT</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. OPTIONAL DRAFT / REVISION COMPARISON IMAGE */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950/50 border border-slate-200/80 dark:border-navy-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-navy-950 dark:text-white flex items-center gap-1.5 text-xs">
                <Layers className="w-3.5 h-3.5 text-purple-500" />
                <span>Optional Earlier Draft (For Before/After Slider)</span>
              </label>

              {draftImageUri && (
                <button
                  type="button"
                  onClick={() => setDraftImageUri('')}
                  className="text-[10px] text-rose-500 hover:underline"
                >
                  Remove Draft
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                ref={draftFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0], true);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => draftFileInputRef.current?.click()}
                className="px-3 py-2 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:border-purple-500 transition-colors flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-purple-500" />
                <span>Choose Draft File</span>
              </button>

              {draftImageUri && (
                <div className="flex items-center gap-2">
                  <img src={draftImageUri} alt="Draft Preview" className="w-8 h-8 rounded-lg object-cover border border-purple-500/40" />
                  <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Draft attached</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-navy-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingWork(null);
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-electric-500 hover:bg-electric-600 text-white font-semibold shadow-md shadow-electric-500/25 flex items-center gap-2 transition-all active:scale-95 text-xs sm:text-sm"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Record in Ledger'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
