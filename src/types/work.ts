import type { Hotel } from './hotel';
import type { Period } from './period';
import type { Category } from './category';

export type DateCertainty = 'exact' | 'month' | 'period' | 'unknown';
export type WorkStatus = 'draft' | 'in_progress' | 'revision' | 'final';
export type AspectRatio = '1:1' | '3:4' | '16:10' | '4:5' | '16:9' | '9:16';
export type MediaType = 'image' | 'video';

export interface Work {
  id: string;
  title: string;
  hotelId: string;
  periodId: string;
  categoryId: string;
  status: WorkStatus;
  description: string;
  date: string | null;      // 'YYYY-MM-DD'
  month: number | null;     // 1-12
  year: number | null;      // 2026
  dateCertainty: DateCertainty;
  revisionCount: number;
  dimensions: string;
  colorSpace: string;
  aspectRatio: AspectRatio;
  mediaType?: MediaType;    // 'image' | 'video'
  imageUri: string;         // Poster / Thumbnail / Artwork image
  videoUri?: string;        // Video MP4, WebM, or stream URL
  duration?: string;        // e.g. '0:30', '0:45', '1:15'
  draftImageUri?: string;
  isUserCreated?: boolean;
  createdAt: string;
  updatedAt: string;

  // Resolved entities
  hotel?: Hotel;
  period?: Period;
  category?: Category;
}

export type SortOption = 'newest' | 'oldest' | 'recently_added' | 'hotel';

export interface WorkFilter {
  hotelId: string; // 'all' or id
  periodId: string; // 'all' or id
  categoryId: string; // 'all' or id
  mediaType?: 'all' | 'image' | 'video';
  status: WorkStatus | 'all';
  searchQuery: string;
  sortBy: SortOption;
}
