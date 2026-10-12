import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Work, WorkStatus, SortOption } from '../types/work';
import type { Hotel } from '../types/hotel';
import type { Period } from '../types/period';
import type { Category } from '../types/category';
import type { DesignTask, TaskStatus, RevisionItem } from '../types/task';
import type { UserProfile } from '../types/user';
import { HOTELS, PERIODS, CATEGORIES } from '../data/constants';
import { SEED_WORKS, SEED_TASKS } from '../data/seedWorks';
import { sanitizeUrl, sanitizeText, safeJsonParse, hashPin } from '../utils/security';
import {
  checkDatabaseHealth,
  fetchWorksFromApi,
  saveWorkToApi,
  deleteWorkFromApi,
  bulkSyncWorksToApi,
  clearAllWorksFromApi,
  fetchTasksFromApi,
  saveTaskToApi,
  deleteTaskFromApi,
  bulkSyncTasksToApi,
  clearAllTasksFromApi,
  fetchProfileFromApi,
  saveProfileToApi,
} from '../utils/apiSync';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface WorksContextType {
  // TiDB Cloud & Connection Status
  dbStatus: { connected: boolean; message: string };
  checkDbConnection: () => Promise<void>;
  works: Work[];
  hotels: Hotel[];
  periods: Period[];
  categories: Category[];
  
  // Intern Profile
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  resetUserProfile: () => void;
  
  // Tasks & Design Requests State
  tasks: DesignTask[];
  backlogTasksCount: number;
  activeTasksCount: number;
  addTask: (task: Omit<DesignTask, 'id' | 'createdAt' | 'updatedAt' | 'revisions'>) => void;
  updateTask: (id: string, updates: Partial<DesignTask>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (id: string, nextStatus: TaskStatus) => void;
  addRevisionNote: (taskId: string, author: string, note: string) => void;
  toggleRevisionResolved: (taskId: string, revisionId: string) => void;
  convertTaskToWork: (taskId: string) => void;
  syncAllCompletedTasksToWorks: () => void;
  clearAllTasks: (removeConvertedWorks?: boolean) => void;
  selectedTaskForDetail: DesignTask | null;
  setSelectedTaskForDetail: (task: DesignTask | null) => void;
  isAddTaskModalOpen: boolean;
  setIsAddTaskModalOpen: (open: boolean) => void;
  editingTask: DesignTask | null;
  setEditingTask: (task: DesignTask | null) => void;

  // Filters & View state
  activeScope: string; // 'all' | 'hotel_semarang' | 'hotel_jepara' | 'hotel_both'
  setActiveScope: (scope: string) => void;
  activePeriod: string; // 'all' | 'period_2026_1' | 'period_2026_2'
  setActivePeriod: (period: string) => void;
  activeCategory: string; // 'all' | categoryId
  setActiveCategory: (cat: string) => void;
  mediaTypeFilter: 'all' | 'image' | 'video';
  setMediaTypeFilter: (filter: 'all' | 'image' | 'video') => void;
  activeStatus: WorkStatus | 'all';
  setActiveStatus: (status: WorkStatus | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;

  // Filter actions
  clearFilters: () => void;
  filteredWorks: Work[];

  // CRUD operations
  addWork: (work: Omit<Work, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWork: (id: string, updates: Partial<Work>) => void;
  deleteWork: (id: string) => void;
  duplicateWork: (id: string) => void;
  clearAllWorks: () => void;
  exportBackupJson: () => void;
  importBackupJson: (jsonData: string) => boolean;
  resetToDefault: () => void;

  // Modals
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  editingWork: Work | null;
  setEditingWork: (work: Work | null) => void;
  selectedWorkForDetail: Work | null;
  setSelectedWorkForDetail: (work: Work | null) => void;
  isPdfModalOpen: boolean;
  setIsPdfModalOpen: (open: boolean) => void;
  isPresentationOpen: boolean;
  setIsPresentationOpen: (open: boolean) => void;
  presentationIndex: number;
  setPresentationIndex: (idx: number) => void;
  openPresentation: (workId?: string) => void;

  // Navigation
  activeTab: 'dashboard' | 'my-works' | 'tasks' | 'calendar' | 'statistics' | 'internship-periods' | 'hotels' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'my-works' | 'tasks' | 'calendar' | 'statistics' | 'internship-periods' | 'hotels' | 'settings') => void;

  // Dark mode
  isDark: boolean;
  toggleDarkMode: () => void;

  // Notification toasts
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  // Security & Passcode Protection
  isSecurityEnabled: boolean;
  isEditorUnlocked: boolean;
  hasPinSet: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  unlockWithPin: (pin: string) => Promise<boolean>;
  lockEditor: () => void;
  setSecurityPin: (newPin: string) => Promise<boolean>;
  removeSecurityPin: (currentPin: string) => Promise<boolean>;
  requireEditorAuth: (callback?: () => void) => boolean;
}

const WorksContext = createContext<WorksContextType | undefined>(undefined);

const STORAGE_KEY = 'designlog_v3_works_ledger';
const TASKS_STORAGE_KEY = 'designlog_v3_tasks_ledger';
const USER_PROFILE_STORAGE_KEY = 'designlog_v2_user_profile';
const SECURITY_PIN_KEY = 'designlog_v3_pin_hash';
const SECURITY_ENABLED_KEY = 'designlog_v3_pin_enabled';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Aang',
  role: 'Lead Design Intern',
  institution: 'Universitas Dian Nuswantoro (UDINUS)',
  faculty: 'Fakultas Ilmu Komputer (FIK)',
  company: 'PT Metropolitan Golden Management (Horison Hotels Group)',
  cohort: 'Cohort II (Oktober–Desember 2026)',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlyjWEqlIk1TcTRjFlJprzeDyaLtIPN2XEuNCq5LJX1Qyj31Wnbb7VVPhYBEfs74KPfbvTsmCg0_R6jxTn-48KgsxuVvD4jwatiDKWh7zk2JkmJ2yP_zoxfE_qn4CcI3ZO8aD8UMEnfiY5wAZy1OVaRNdbR3iRQP0Qjftrfxm6VFERMnidd2GqpxXewScyy7HdUc6UG4C1IWcr7I1kGmR67j5cNQ3cgQysw7qzF2molhVi3KAju8c',
  cluster: 'Central Java Cluster',
  specialization: 'Visual & Marcomm Designer',
  supervisor: 'Cluster Marcomm Manager',
  email: 'aang.design@horisonhotels.com',
  phone: '+62 812-3456-7890',
  bio: 'Residency scholar at PT Metropolitan Golden Management (Horison Hotels Group) in cooperation with Universitas Dian Nuswantoro (UDINUS), Faculty of Computer Science. Managing creative visual communications for Horison Inn Antawirya Semarang & Horison Resort Antawirya Jepara.',
};

export const WorksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [works, setWorks] = useState<Work[]>(() => {
    try {
      // Clear legacy dummy works from previous sessions
      localStorage.removeItem('designlog_v2_works_ledger');
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse works from localStorage:', e);
    }
    return SEED_WORKS;
  });

  const [tasks, setTasks] = useState<DesignTask[]>(() => {
    try {
      // Clear legacy dummy tasks from previous test sessions
      localStorage.removeItem('designlog_v2_tasks_ledger');
      const stored = localStorage.getItem(TASKS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse tasks from localStorage:', e);
    }
    return SEED_TASKS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Failed to save tasks to localStorage:', e);
    }
  }, [tasks]);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_USER_PROFILE, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to parse user profile from localStorage:', e);
    }
    return DEFAULT_USER_PROFILE;
  });

  // TiDB Cloud Database Connection Status & Initial Sync
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; message: string }>({
    connected: false,
    message: 'Checking...',
  });

  const checkDbConnection = async () => {
    const status = await checkDatabaseHealth();
    setDbStatus(status);
  };

  useEffect(() => {
    checkDbConnection();

    (async () => {
      try {
        const cloudWorks = await fetchWorksFromApi();
        if (cloudWorks && cloudWorks.length > 0) {
          setWorks(cloudWorks);
        }
        const cloudTasks = await fetchTasksFromApi();
        if (cloudTasks && cloudTasks.length > 0) {
          setTasks(cloudTasks);
        }
        const cloudProfile = await fetchProfileFromApi();
        if (cloudProfile && cloudProfile.name) {
          setUserProfile((prev) => ({ ...prev, ...cloudProfile }));
        }
      } catch (e) {
        console.warn('Initial TiDB sync bypassed:', e);
      }
    })();
  }, []);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save user profile:', e);
      }
      saveProfileToApi(updated);
      return updated;
    });
    showToast('Profil intern berhasil diperbarui!', 'success');
  };

  const resetUserProfile = () => {
    setUserProfile(DEFAULT_USER_PROFILE);
    try {
      localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(DEFAULT_USER_PROFILE));
    } catch (e) {
      console.warn('Failed to reset user profile:', e);
    }
    saveProfileToApi(DEFAULT_USER_PROFILE);
    showToast('Profil dikembalikan ke setelan awal', 'info');
  };

  const [activeTab, setActiveTab] = useState<'dashboard' | 'my-works' | 'tasks' | 'calendar' | 'statistics' | 'internship-periods' | 'hotels' | 'settings'>('dashboard');
  const [activeScope, setActiveScope] = useState<string>('all');
  const [activePeriod, setActivePeriod] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [activeStatus, setActiveStatus] = useState<WorkStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Dark mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('designlog_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('designlog_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('designlog_theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  // Security & Passcode Protection State
  const [isSecurityEnabled, setIsSecurityEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SECURITY_ENABLED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [hasPinSet, setHasPinSet] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem(SECURITY_PIN_KEY);
    } catch {
      return false;
    }
  });

  const [isEditorUnlocked, setIsEditorUnlocked] = useState<boolean>(() => {
    try {
      const enabled = localStorage.getItem(SECURITY_ENABLED_KEY) === 'true';
      if (!enabled) return true;
      return sessionStorage.getItem('designlog_editor_unlocked') === 'true';
    } catch {
      return true;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAuthAction, setPendingAuthAction] = useState<(() => void) | null>(null);

  const unlockWithPin = async (pin: string): Promise<boolean> => {
    try {
      const storedHash = localStorage.getItem(SECURITY_PIN_KEY);
      if (!storedHash) {
        setIsEditorUnlocked(true);
        return true;
      }
      const inputHash = await hashPin(pin);
      if (inputHash === storedHash) {
        setIsEditorUnlocked(true);
        try {
          sessionStorage.setItem('designlog_editor_unlocked', 'true');
        } catch (e) {
          console.warn(e);
        }
        setIsAuthModalOpen(false);
        showToast('Akses Editor Terbuka! 🔓', 'success');
        if (pendingAuthAction) {
          pendingAuthAction();
          setPendingAuthAction(null);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const lockEditor = () => {
    setIsEditorUnlocked(false);
    try {
      sessionStorage.removeItem('designlog_editor_unlocked');
    } catch (e) {
      console.warn(e);
    }
    showToast('Mode Editor Dikunci (Read-Only) 🔒', 'info');
  };

  const setSecurityPin = async (newPin: string): Promise<boolean> => {
    try {
      if (!newPin.trim()) return false;
      const hash = await hashPin(newPin);
      localStorage.setItem(SECURITY_PIN_KEY, hash);
      localStorage.setItem(SECURITY_ENABLED_KEY, 'true');
      setHasPinSet(true);
      setIsSecurityEnabled(true);
      setIsEditorUnlocked(true);
      try {
        sessionStorage.setItem('designlog_editor_unlocked', 'true');
      } catch (e) {
        console.warn(e);
      }
      showToast('PIN Keamanan Editor Berhasil Diaktifkan! 🛡️', 'success');
      return true;
    } catch {
      showToast('Gagal menyimpan PIN keamanan', 'error');
      return false;
    }
  };

  const removeSecurityPin = async (currentPin: string): Promise<boolean> => {
    try {
      const storedHash = localStorage.getItem(SECURITY_PIN_KEY);
      if (storedHash) {
        const inputHash = await hashPin(currentPin);
        if (inputHash !== storedHash) {
          showToast('PIN saat ini tidak cocok!', 'error');
          return false;
        }
      }
      localStorage.removeItem(SECURITY_PIN_KEY);
      localStorage.removeItem(SECURITY_ENABLED_KEY);
      try {
        sessionStorage.removeItem('designlog_editor_unlocked');
      } catch (e) {
        console.warn(e);
      }
      setHasPinSet(false);
      setIsSecurityEnabled(false);
      setIsEditorUnlocked(true);
      showToast('Kunci PIN Editor Dinonaktifkan', 'info');
      return true;
    } catch {
      showToast('Gagal menonaktifkan PIN', 'error');
      return false;
    }
  };

  const requireEditorAuth = (callback?: () => void): boolean => {
    if (!isSecurityEnabled || isEditorUnlocked) {
      if (callback) callback();
      return true;
    }
    if (callback) {
      setPendingAuthAction(() => callback);
    }
    setIsAuthModalOpen(true);
    return false;
  };

  // Works Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [selectedWorkForDetail, setSelectedWorkForDetail] = useState<Work | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [presentationIndex, setPresentationIndex] = useState(0);

  // Tasks Modals
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<DesignTask | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<DesignTask | null>(null);

  const openPresentation = (workId?: string) => {
    if (workId) {
      const idx = filteredWorks.findIndex((w) => w.id === workId);
      if (idx !== -1) {
        setPresentationIndex(idx);
      }
    }
    setIsPresentationOpen(true);
  };

  // Toasts
  const [toasts, setToasts] = useState<ToastState[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(works));
    } catch (e) {
      console.warn('Failed to save works to localStorage:', e);
    }
  }, [works]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const clearFilters = () => {
    setActiveScope('all');
    setActivePeriod('all');
    setActiveCategory('all');
    setMediaTypeFilter('all');
    setActiveStatus('all');
    setSearchQuery('');
    setSortBy('newest');
    showToast('Filters cleared', 'info');
  };

  const addWork = (newWorkData: Omit<Work, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = 'work-' + Date.now();
    const now = new Date().toISOString();
    const created: Work = {
      ...newWorkData,
      id,
      title: sanitizeText(newWorkData.title, 150),
      description: sanitizeText(newWorkData.description, 3000),
      imageUri: sanitizeUrl(newWorkData.imageUri),
      videoUri: newWorkData.videoUri ? sanitizeUrl(newWorkData.videoUri) : undefined,
      draftImageUri: newWorkData.draftImageUri ? sanitizeUrl(newWorkData.draftImageUri) : undefined,
      isUserCreated: true,
      createdAt: now,
      updatedAt: now,
    };
    setWorks((prev) => [created, ...prev]);
    saveWorkToApi(created);
    setSortBy('newest');
    showToast(`Added deliverable "${created.title}"`, 'success');
  };

  const updateWork = (id: string, updates: Partial<Work>) => {
    const sanitizedUpdates: Partial<Work> = {
      ...updates,
      title: updates.title !== undefined ? sanitizeText(updates.title, 150) : undefined,
      description: updates.description !== undefined ? sanitizeText(updates.description, 3000) : undefined,
      imageUri: updates.imageUri !== undefined ? sanitizeUrl(updates.imageUri) : undefined,
      videoUri: updates.videoUri !== undefined ? sanitizeUrl(updates.videoUri) : undefined,
      draftImageUri: updates.draftImageUri !== undefined ? sanitizeUrl(updates.draftImageUri) : undefined,
    };
    Object.keys(sanitizedUpdates).forEach(
      (k) => (sanitizedUpdates as Record<string, unknown>)[k] === undefined && delete (sanitizedUpdates as Record<string, unknown>)[k]
    );

    setWorks((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const updated = { ...w, ...sanitizedUpdates, updatedAt: new Date().toISOString() };
          saveWorkToApi(updated);
          return updated;
        }
        return w;
      })
    );
    showToast('Deliverable metadata updated', 'success');
  };

  const deleteWork = (id: string) => {
    const item = works.find((w) => w.id === id);
    setWorks((prev) => prev.filter((w) => w.id !== id));
    deleteWorkFromApi(id);
    if (selectedWorkForDetail?.id === id) {
      setSelectedWorkForDetail(null);
    }
    showToast(`Removed "${item?.title || 'work'}"`, 'info');
  };

  const duplicateWork = (id: string) => {
    const original = works.find((w) => w.id === id);
    if (!original) return;
    const now = new Date().toISOString();
    const duplicated: Work = {
      ...original,
      id: 'work-' + Date.now(),
      title: `${original.title} (Copy)`,
      status: 'revision',
      revisionCount: original.revisionCount + 1,
      createdAt: now,
      updatedAt: now,
    };
    setWorks((prev) => [duplicated, ...prev]);
    saveWorkToApi(duplicated);
    showToast(`Duplicated "${original.title}"`, 'success');
  };

  // Tasks Computations & CRUD
  const backlogTasksCount = tasks.filter((t) => t.status === 'backlog').length;
  const activeTasksCount = tasks.filter((t) => t.status !== 'completed').length;

  const addTask = (taskData: Omit<DesignTask, 'id' | 'createdAt' | 'updatedAt' | 'revisions'>) => {
    const newTask: DesignTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      title: sanitizeText(taskData.title, 150),
      description: sanitizeText(taskData.description, 3000),
      requesterName: sanitizeText(taskData.requesterName, 100),
      requesterContact: taskData.requesterContact ? sanitizeText(taskData.requesterContact, 100) : undefined,
      referenceUrl: taskData.referenceUrl ? sanitizeUrl(taskData.referenceUrl) : undefined,
      revisions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    saveTaskToApi(newTask);
    showToast(`Request "${newTask.title}" berhasil ditambahkan!`, 'success');
  };

  const updateTask = (id: string, updates: Partial<DesignTask>) => {
    const sanitizedUpdates: Partial<DesignTask> = {
      ...updates,
      title: updates.title !== undefined ? sanitizeText(updates.title, 150) : undefined,
      description: updates.description !== undefined ? sanitizeText(updates.description, 3000) : undefined,
      requesterName: updates.requesterName !== undefined ? sanitizeText(updates.requesterName, 100) : undefined,
      requesterContact: updates.requesterContact !== undefined ? sanitizeText(updates.requesterContact, 100) : undefined,
      referenceUrl: updates.referenceUrl !== undefined ? sanitizeUrl(updates.referenceUrl) : undefined,
    };
    Object.keys(sanitizedUpdates).forEach(
      (k) => (sanitizedUpdates as Record<string, unknown>)[k] === undefined && delete (sanitizedUpdates as Record<string, unknown>)[k]
    );

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...sanitizedUpdates, updatedAt: new Date().toISOString() };
          saveTaskToApi(updated);
          return updated;
        }
        return t;
      })
    );
    if (selectedTaskForDetail && selectedTaskForDetail.id === id) {
      setSelectedTaskForDetail((prev) => (prev ? { ...prev, ...sanitizedUpdates, updatedAt: new Date().toISOString() } : null));
    }
    showToast('Tugas desain berhasil diperbarui', 'info');
  };

  const deleteTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    deleteTaskFromApi(id);
    if (selectedTaskForDetail?.id === id) {
      setSelectedTaskForDetail(null);
    }
    showToast(`Tugas "${task?.title || id}" dihapus`, 'info');
  };

  const moveTaskStatus = (id: string, nextStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const now = new Date().toISOString();
    let updatedConvertedWorkId = task.convertedWorkId;

    if (nextStatus === 'completed') {
      // Solusi 1: Auto-convert to Work in My Works if not yet converted!
      if (!task.convertedWorkId) {
        const workId = `work-conv-${Date.now()}`;
        const newWork: Work = {
          id: workId,
          title: task.title,
          hotelId: task.hotelId,
          periodId: 'period_2026_2',
          categoryId:
            task.department === 'fnb'
              ? 'cat_promo'
              : task.department === 'sales'
              ? 'cat_event'
              : task.mediaType === 'video'
              ? 'cat_video_reels'
              : 'cat_social_media',
          status: 'final',
          description: `${task.description}\n\n[Dibuat dari permintaan ${task.requesterName} - Dept ${task.department.toUpperCase()}]`,
          date: task.completedAt || task.deadline || now.slice(0, 10),
          month: (task.completedAt || task.deadline) ? parseInt((task.completedAt || task.deadline).split('-')[1], 10) || 10 : 10,
          year: (task.completedAt || task.deadline) ? parseInt((task.completedAt || task.deadline).split('-')[0], 10) || 2026 : 2026,
          dateCertainty: 'exact',
          revisionCount: task.revisions.length,
          dimensions: task.targetDimensions || (task.mediaType === 'video' ? '1080 × 1920 px' : '1080 × 1080 px'),
          colorSpace: task.targetDimensions?.includes('cm') ? 'CMYK / PRINT' : 'RGB / DIGITAL',
          aspectRatio: task.mediaType === 'video' ? '9:16' : task.targetDimensions?.includes('cm') ? '16:9' : '1:1',
          mediaType: task.mediaType,
          imageUri: 'https://images.unsplash.com/photo-1542314831-c6a4d27265a6?auto=format&fit=crop&w=1200&q=80',
          isUserCreated: true,
          createdAt: now,
          updatedAt: now,
        };
        setWorks((prev) => [newWork, ...prev]);
        saveWorkToApi(newWork);
        updatedConvertedWorkId = workId;
        showToast(`🎉 Tugas "${task.title}" selesai & otomatis masuk ke My Works!`, 'success');
      } else {
        showToast(`Tugas "${task.title}" diselesaikan!`, 'success');
      }
    } else {
      const labels: Record<TaskStatus, string> = {
        backlog: 'Belum Dikerjakan',
        in_progress: 'Sedang Didesain',
        in_review: 'Review & Revisi',
        completed: 'Selesai / Approved',
      };
      showToast(`Status tugas dipindah ke: ${labels[nextStatus]}`, 'info');
    }

    const updatedTask: DesignTask = {
      ...task,
      status: nextStatus,
      convertedWorkId: updatedConvertedWorkId,
      completedAt: nextStatus === 'completed' ? (task.completedAt || now.slice(0, 10)) : task.completedAt,
      updatedAt: now,
    };
    saveTaskToApi(updatedTask);

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? updatedTask : t))
    );

    if (selectedTaskForDetail && selectedTaskForDetail.id === id) {
      setSelectedTaskForDetail(updatedTask);
    }
  };

  const addRevisionNote = (taskId: string, author: string, note: string) => {
    const newRev: RevisionItem = {
      id: `rev-${Date.now()}`,
      author: author.trim() || 'Reviewer',
      note: note.trim(),
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      resolved: false,
    };
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated: DesignTask = {
            ...t,
            revisions: [...t.revisions, newRev],
            status: t.status === 'completed' ? 'in_review' : t.status,
            updatedAt: new Date().toISOString(),
          };
          saveTaskToApi(updated);
          return updated;
        }
        return t;
      })
    );
    if (selectedTaskForDetail && selectedTaskForDetail.id === taskId) {
      setSelectedTaskForDetail((prev) =>
        prev
          ? {
              ...prev,
              revisions: [...prev.revisions, newRev],
              status: prev.status === 'completed' ? 'in_review' : prev.status,
              updatedAt: new Date().toISOString(),
            }
          : null
      );
    }
    showToast('Catatan revisi berhasil dicatat', 'info');
  };

  const toggleRevisionResolved = (taskId: string, revisionId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedRevisions = t.revisions.map((r) =>
            r.id === revisionId ? { ...r, resolved: !r.resolved } : r
          );
          const updated: DesignTask = { ...t, revisions: updatedRevisions, updatedAt: new Date().toISOString() };
          saveTaskToApi(updated);
          return updated;
        }
        return t;
      })
    );
    if (selectedTaskForDetail && selectedTaskForDetail.id === taskId) {
      setSelectedTaskForDetail((prev) =>
        prev
          ? {
              ...prev,
              revisions: prev.revisions.map((r) =>
                r.id === revisionId ? { ...r, resolved: !r.resolved } : r
              ),
              updatedAt: new Date().toISOString(),
            }
          : null
      );
    }
  };

  const convertTaskToWork = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const workId = `work-conv-${Date.now()}`;
    const newWork: Work = {
      id: workId,
      title: task.title,
      hotelId: task.hotelId,
      periodId: 'period_2026_2',
      categoryId:
        task.department === 'fnb'
          ? 'cat_promo'
          : task.department === 'sales'
          ? 'cat_event'
          : task.mediaType === 'video'
          ? 'cat_video_reels'
          : 'cat_social_media',
      status: 'final',
      description: `${task.description}\n\n[Dibuat dari permintaan ${task.requesterName} - Dept ${task.department.toUpperCase()}]`,
      date: task.completedAt || task.deadline || new Date().toISOString().slice(0, 10),
      month: (task.completedAt || task.deadline) ? parseInt((task.completedAt || task.deadline).split('-')[1], 10) || 10 : 10,
      year: (task.completedAt || task.deadline) ? parseInt((task.completedAt || task.deadline).split('-')[0], 10) || 2026 : 2026,
      dateCertainty: 'exact',
      revisionCount: task.revisions.length,
      dimensions: task.targetDimensions || (task.mediaType === 'video' ? '1080 × 1920 px' : '1080 × 1080 px'),
      colorSpace: task.targetDimensions?.includes('cm') ? 'CMYK / PRINT' : 'RGB / DIGITAL',
      aspectRatio: task.mediaType === 'video' ? '9:16' : task.targetDimensions?.includes('cm') ? '16:9' : '1:1',
      mediaType: task.mediaType,
      imageUri: 'https://images.unsplash.com/photo-1542314831-c6a4d27265a6?auto=format&fit=crop&w=1200&q=80',
      isUserCreated: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setWorks((prev) => [newWork, ...prev]);
    saveWorkToApi(newWork);
    const now = new Date().toISOString();
    const updatedTask: DesignTask = {
      ...task,
      status: 'completed',
      convertedWorkId: workId,
      completedAt: task.completedAt || now.slice(0, 10),
      updatedAt: now,
    };
    saveTaskToApi(updatedTask);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? updatedTask : t))
    );
    setSelectedTaskForDetail(null);
    clearFilters();
    setSortBy('newest');
    setActiveTab('my-works');
    setSelectedWorkForDetail(newWork);
    showToast(`🎉 Sukses! Tugas "${task.title}" langsung masuk ke posisi teratas My Works.`, 'success');
  };

  const syncAllCompletedTasksToWorks = () => {
    const uncommitted = tasks.filter((t) => t.status === 'completed' && !t.convertedWorkId);
    if (uncommitted.length === 0) {
      showToast('Semua tugas selesai sudah ada di My Works!', 'info');
      return;
    }
    const now = new Date().toISOString();
    const newWorksList: Work[] = [];
    const updatedIdsMap = new Map<string, string>();

    uncommitted.forEach((task, index) => {
      const workId = `work-conv-${Date.now()}-${index}`;
      updatedIdsMap.set(task.id, workId);
      newWorksList.push({
        id: workId,
        title: task.title,
        hotelId: task.hotelId,
        periodId: 'period_2026_2',
        categoryId:
          task.department === 'fnb'
            ? 'cat_promo'
            : task.department === 'sales'
            ? 'cat_event'
            : task.mediaType === 'video'
            ? 'cat_video_reels'
            : 'cat_social_media',
        status: 'final',
        description: `${task.description}\n\n[Dibuat dari permintaan ${task.requesterName} - Dept ${task.department.toUpperCase()}]`,
        date: task.completedAt?.slice(0, 10) || now.slice(0, 10),
        month: 10,
        year: 2026,
        dateCertainty: 'exact',
        revisionCount: task.revisions.length,
        dimensions: task.targetDimensions || (task.mediaType === 'video' ? '1080 × 1920 px' : '1080 × 1080 px'),
        colorSpace: task.targetDimensions?.includes('cm') ? 'CMYK / PRINT' : 'RGB / DIGITAL',
        aspectRatio: task.mediaType === 'video' ? '9:16' : task.targetDimensions?.includes('cm') ? '16:9' : '1:1',
        mediaType: task.mediaType,
        imageUri: 'https://images.unsplash.com/photo-1542314831-c6a4d27265a6?auto=format&fit=crop&w=1200&q=80',
        isUserCreated: true,
        createdAt: now,
        updatedAt: now,
      });
    });

    setWorks((prev) => [...newWorksList, ...prev]);
    bulkSyncWorksToApi(newWorksList);

    const updatedTasksList = tasks.map((t) => {
      if (updatedIdsMap.has(t.id)) {
        return {
          ...t,
          convertedWorkId: updatedIdsMap.get(t.id),
          completedAt: t.completedAt || now.slice(0, 10),
          updatedAt: now,
        };
      }
      return t;
    });
    setTasks(updatedTasksList);
    bulkSyncTasksToApi(updatedTasksList);

    showToast(`⚡ Berhasil memasukkan ${newWorksList.length} tugas selesai ke My Works!`, 'success');
  };

  const exportBackupJson = () => {
    try {
      const backupData = {
        version: 2,
        exportDate: new Date().toISOString(),
        works,
        tasks,
      };
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `designlog_backup_${new Date().toISOString().slice(0, 10)}.json`);
      downloadAnchor.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast(`Exported ${works.length} deliverables & ${tasks.length} tasks to backup`, 'success');
    } catch {
      showToast('Failed to export backup', 'error');
    }
  };

  const importBackupJson = (jsonData: string): boolean => {
    try {
      const parsed = safeJsonParse<any>(jsonData);
      if (!parsed) {
        showToast('Format file JSON tidak valid atau berukuran terlalu besar!', 'error');
        return false;
      }
      if (typeof parsed === 'object') {
        if (Array.isArray(parsed.works) && parsed.works.length > 0) {
          const sanitizedWorks: Work[] = parsed.works.map((w: any) => ({
            ...w,
            title: sanitizeText(w.title || '', 150),
            description: sanitizeText(w.description || '', 3000),
            imageUri: sanitizeUrl(w.imageUri || ''),
            videoUri: w.videoUri ? sanitizeUrl(w.videoUri) : undefined,
            draftImageUri: w.draftImageUri ? sanitizeUrl(w.draftImageUri) : undefined,
          }));
          setWorks(sanitizedWorks);
          bulkSyncWorksToApi(sanitizedWorks);
          if (Array.isArray(parsed.tasks)) {
            const sanitizedTasks: DesignTask[] = parsed.tasks.map((t: any) => ({
              ...t,
              title: sanitizeText(t.title || '', 150),
              description: sanitizeText(t.description || '', 3000),
              requesterName: sanitizeText(t.requesterName || '', 100),
              referenceUrl: t.referenceUrl ? sanitizeUrl(t.referenceUrl) : undefined,
            }));
            setTasks(sanitizedTasks);
            bulkSyncTasksToApi(sanitizedTasks);
          }
          showToast(`Berhasil restore backup (${sanitizedWorks.length} karya, ${parsed.tasks?.length || 0} tugas)!`, 'success');
          return true;
        }
      }
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title && parsed[0].hotelId) {
        const sanitizedWorks: Work[] = parsed.map((w: any) => ({
          ...w,
          title: sanitizeText(w.title || '', 150),
          description: sanitizeText(w.description || '', 3000),
          imageUri: sanitizeUrl(w.imageUri || ''),
          videoUri: w.videoUri ? sanitizeUrl(w.videoUri) : undefined,
          draftImageUri: w.draftImageUri ? sanitizeUrl(w.draftImageUri) : undefined,
        }));
        setWorks(sanitizedWorks);
        bulkSyncWorksToApi(sanitizedWorks);
        showToast(`Berhasil import ${sanitizedWorks.length} karya!`, 'success');
        return true;
      }
      showToast('Format JSON backup tidak sesuai struktur yang didukung', 'error');
      return false;
    } catch {
      showToast('Gagal memproses file JSON backup', 'error');
      return false;
    }
  };

  const clearAllTasks = (removeConvertedWorks: boolean = true) => {
    setTasks([]);
    clearAllTasksFromApi();
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify([]));
      localStorage.removeItem('designlog_v2_tasks_ledger');
    } catch (e) {
      console.warn('Failed to clear tasks:', e);
    }
    if (removeConvertedWorks) {
      setWorks((prev) => {
        const cleaned = prev.filter((w) => !w.id.startsWith('work-conv-'));
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
        } catch (e) {
          console.warn(e);
        }
        bulkSyncWorksToApi(cleaned);
        return cleaned;
      });
    }
    showToast('Semua tugas berhasil di-reset dan dikosongkan. Profil kamu tetap aman!', 'info');
  };

  const clearAllWorks = () => {
    setWorks([]);
    clearAllWorksFromApi();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      localStorage.removeItem('designlog_v2_works_ledger');
    } catch (e) {
      console.warn('Failed to clear works:', e);
    }
    showToast('Semua karya di My Works berhasil dikosongkan. Profil kamu tetap aman!', 'info');
  };

  const resetToDefault = () => {
    setWorks(SEED_WORKS);
    setTasks(SEED_TASKS);
    clearAllWorksFromApi();
    clearAllTasksFromApi();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_WORKS));
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(SEED_TASKS));
      localStorage.removeItem('designlog_v2_works_ledger');
      localStorage.removeItem('designlog_v2_tasks_ledger');
    } catch (e) {
      console.warn('Failed to clear works and tasks:', e);
    }
    showToast('Semua karya dan tugas berhasil dikosongkan bersih', 'info');
  };

  // Compute filtered & sorted works
  const filteredWorks = works
    .filter((w) => {
      // Hotel scope
      if (activeScope !== 'all') {
        if (activeScope === 'hotel_both') {
          if (w.hotelId !== 'hotel_both') return false;
        } else if (w.hotelId !== activeScope && w.hotelId !== 'hotel_both') {
          return false;
        }
      }
      // Period
      if (activePeriod !== 'all' && w.periodId !== activePeriod) {
        return false;
      }
      // Category
      if (activeCategory !== 'all' && w.categoryId !== activeCategory) {
        return false;
      }
      // Media type filter
      if (mediaTypeFilter === 'video' && w.mediaType !== 'video' && !w.videoUri && w.categoryId !== 'cat_video_reels') {
        return false;
      }
      if (mediaTypeFilter === 'image' && (w.mediaType === 'video' || w.videoUri || w.categoryId === 'cat_video_reels')) {
        return false;
      }
      // Status
      if (activeStatus !== 'all' && w.status !== activeStatus) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const hotel = HOTELS.find((h) => h.id === w.hotelId)?.name.toLowerCase() || '';
        const cat = CATEGORIES.find((c) => c.id === w.categoryId)?.name.toLowerCase() || '';
        const matchesTitle = w.title.toLowerCase().includes(query);
        const matchesDesc = w.description.toLowerCase().includes(query);
        const matchesHotel = hotel.includes(query);
        const matchesCategory = cat.includes(query);
        const matchesDimensions = w.dimensions.toLowerCase().includes(query);
        const matchesColorSpace = w.colorSpace.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesHotel && !matchesCategory && !matchesDimensions && !matchesColorSpace) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      const isUserItem = (w: Work) => {
        return (
          w.isUserCreated === true ||
          w.id.startsWith('work-conv-') ||
          w.id.startsWith('work-1') ||
          !/^work-(video-)?(0[1-9]|[1-4][0-9])$/.test(w.id)
        );
      };

      if (sortBy === 'newest') {
        const aIsUser = isUserItem(a);
        const bIsUser = isUserItem(b);

        // User-created and converted items appear before seeds
        if (aIsUser && !bIsUser) return -1;
        if (!aIsUser && bIsUser) return 1;

        // Primary sort: Deliverable date descending
        const dateA = a.date || a.createdAt?.slice(0, 10) || '';
        const dateB = b.date || b.createdAt?.slice(0, 10) || '';
        if (dateA !== dateB) {
          return dateB.localeCompare(dateA);
        }

        // Secondary tiebreaker: creation timestamp
        const timeA = new Date(a.createdAt).getTime() || 0;
        const timeB = new Date(b.createdAt).getTime() || 0;
        return timeB - timeA;
      }

      if (sortBy === 'recently_added') {
        const aIsUser = isUserItem(a);
        const bIsUser = isUserItem(b);
        if (aIsUser && !bIsUser) return -1;
        if (!aIsUser && bIsUser) return 1;
        return b.createdAt.localeCompare(a.createdAt);
      }

      if (sortBy === 'oldest') {
        const dateA = a.date || a.createdAt?.slice(0, 10) || '';
        const dateB = b.date || b.createdAt?.slice(0, 10) || '';
        if (dateA !== dateB) {
          return dateA.localeCompare(dateB);
        }
        const timeA = new Date(a.createdAt).getTime() || 0;
        const timeB = new Date(b.createdAt).getTime() || 0;
        return timeA - timeB;
      }

      if (sortBy === 'hotel') {
        return a.hotelId.localeCompare(b.hotelId);
      }

      return 0;
    });

  return (
    <WorksContext.Provider
      value={{
        works,
        hotels: HOTELS,
        periods: PERIODS,
        categories: CATEGORIES,

        // Intern Profile
        userProfile,
        updateUserProfile,
        resetUserProfile,

        // Tasks & Design Requests
        tasks,
        backlogTasksCount,
        activeTasksCount,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        addRevisionNote,
        toggleRevisionResolved,
        convertTaskToWork,
        syncAllCompletedTasksToWorks,
        clearAllTasks,
        selectedTaskForDetail,
        setSelectedTaskForDetail,
        isAddTaskModalOpen,
        setIsAddTaskModalOpen,
        editingTask,
        setEditingTask,

        activeScope,
        setActiveScope,
        activePeriod,
        setActivePeriod,
        activeCategory,
        setActiveCategory,
        mediaTypeFilter,
        setMediaTypeFilter,
        activeStatus,
        setActiveStatus,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        viewMode,
        setViewMode,
        clearFilters,
        filteredWorks,
        addWork,
        updateWork,
        deleteWork,
        duplicateWork,
        clearAllWorks,
        exportBackupJson,
        importBackupJson,
        resetToDefault,
        isAddModalOpen,
        setIsAddModalOpen,
        editingWork,
        setEditingWork,
        selectedWorkForDetail,
        setSelectedWorkForDetail,
        isPdfModalOpen,
        setIsPdfModalOpen,
        isPresentationOpen,
        setIsPresentationOpen,
        presentationIndex,
        setPresentationIndex,
        openPresentation,
        activeTab,
        setActiveTab,
        isDark,
        toggleDarkMode,
        toasts,
        showToast,
        removeToast,

        // Security & Editor Protection
        isSecurityEnabled,
        isEditorUnlocked,
        hasPinSet,
        isAuthModalOpen,
        setIsAuthModalOpen,
        unlockWithPin,
        lockEditor,
        setSecurityPin,
        removeSecurityPin,
        requireEditorAuth,

        // TiDB Cloud & Connection Status
        dbStatus,
        checkDbConnection,
      }}
    >
      {children}
    </WorksContext.Provider>
  );
};

export const useWorks = () => {
  const context = useContext(WorksContext);
  if (!context) {
    throw new Error('useWorks must be used within a WorksProvider');
  }
  return context;
};
