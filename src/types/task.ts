export type TaskPriority = 'urgent' | 'high' | 'normal' | 'low';

export type TaskStatus =
  | 'backlog'       // Belum Dikerjakan (Antrean Request)
  | 'in_progress'   // Sedang Dikerjakan (In Progress)
  | 'in_review'     // Review & Revisi (Tinjauan GM/Marcom)
  | 'completed';    // Selesai (Approved / Siap Cetak & Posting)

export type Department =
  | 'fnb'           // Food & Beverage / Resto & Lounge
  | 'sales'         // Sales & Marketing
  | 'front_office'  // Front Office & Rooms
  | 'hrd'           // HRD & General Affairs
  | 'gm'            // General Manager Office
  | 'marcom';       // Internal Marcom

export interface RevisionItem {
  id: string;
  author: string;     // e.g. "Bu GM", "Pak Marcom Manager", "Chef Juna"
  note: string;       // e.g. "Ganti font harga promo jadi Rp 88.000 nett, tambah logo Halal"
  createdAt: string;  // 'YYYY-MM-DD HH:mm'
  resolved: boolean;
}

export interface DesignTask {
  id: string;
  title: string;
  hotelId: string;         // 'hotel_semarang' | 'hotel_jepara' | 'hotel_both'
  department: Department;
  requesterName: string;   // e.g. "Chef Dimas (Head Chef Resto)"
  requesterContact?: string; // e.g. "WA: 0812-3456-7890"
  priority: TaskPriority;
  status: TaskStatus;
  mediaType: 'image' | 'video';
  targetOutput: string;    // e.g. "Standing Banner X-Banner", "Feed IG 1:1", "Tent Card Resto A6", "Video Reels 9:16"
  targetDimensions?: string; // e.g. "60 × 160 cm", "1080 × 1080 px", "1080 × 1920 px"
  deadline: string;        // 'YYYY-MM-DD'
  description: string;     // Brief detail / draft copywriting promo
  referenceUrl?: string;   // Link Google Drive / file referensi foto
  revisions: RevisionItem[];
  convertedWorkId?: string; // ID work jika sudah dikonversi ke koleksi portofolio
  completedAt?: string;     // Tanggal tugas diselesaikan ('YYYY-MM-DD' atau ISO)
  createdAt: string;
  updatedAt: string;
}

export type TaskFilterDepartment = 'all' | Department;
export type TaskFilterPriority = 'all' | TaskPriority;
export type TaskFilterStatus = 'all' | TaskStatus;
export type TaskDayFilter = 'all' | 'today' | 'yesterday' | 'custom';
