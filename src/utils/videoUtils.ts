/**
 * Utility functions for video processing, automatic poster frame extraction,
 * duration calculation, and indexedDB storage for large video files.
 */

const DB_NAME = 'designlog_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'videos';

// Open or initialize IndexedDB for video blobs
function openVideoDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB'));
  });
}

/**
 * Save a video Blob/File into IndexedDB associated with a workId or temporary key.
 */
export async function saveVideoBlob(key: string, blob: Blob): Promise<string> {
  try {
    const db = await openVideoDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(blob, key);
      req.onsuccess = () => resolve(`indexeddb:${key}`);
      req.onerror = () => reject(req.error || new Error('Failed to save video'));
    });
  } catch (err) {
    console.warn('[VideoStorage] IndexedDB save failed, falling back to data URL:', err);
    return fileToDataUrl(blob);
  }
}

/**
 * Retrieve a video Blob from IndexedDB by key.
 */
export async function getVideoBlob(key: string): Promise<Blob | null> {
  const cleanKey = key.replace(/^indexeddb:/, '');
  try {
    const db = await openVideoDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(cleanKey);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Converts a Blob or File to a Data URL string.
 */
export function fileToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to convert file to Data URL'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Formats seconds into MM:SS format.
 */
export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return '0:30';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export interface VideoMetadata {
  durationStr: string;
  durationSec: number;
  posterDataUrl: string;
  width: number;
  height: number;
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5';
}

/**
 * Analyzes an uploaded video file: extracts duration, dimensions,
 * determines aspect ratio preset, and captures a high-quality poster frame from 1.0s.
 */
export function extractVideoMetadata(file: File | Blob): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    let hasSeeked = false;

    video.onloadedmetadata = () => {
      // Seek to 1s or midpoint if video is shorter than 1s
      const seekTime = Math.min(1.0, video.duration > 0.2 ? video.duration / 2 : 0);
      video.currentTime = seekTime;
    };

    video.onseeked = () => {
      if (hasSeeked) return;
      hasSeeked = true;

      try {
        const width = video.videoWidth || 1080;
        const height = video.videoHeight || 1920;
        const durationSec = video.duration || 30;
        const durationStr = formatDuration(durationSec);

        // Determine aspect ratio
        let aspectRatio: '9:16' | '16:9' | '1:1' | '4:5' = '9:16';
        const ratio = width / height;
        if (ratio < 0.65) {
          aspectRatio = '9:16';
        } else if (ratio > 1.4) {
          aspectRatio = '16:9';
        } else if (ratio >= 0.75 && ratio <= 0.85) {
          aspectRatio = '4:5';
        } else if (ratio >= 0.9 && ratio <= 1.1) {
          aspectRatio = '1:1';
        }

        // Draw poster frame to canvas (cap max dimension to 1200px)
        const canvas = document.createElement('canvas');
        let cWidth = width;
        let cHeight = height;
        const maxDim = 1200;
        if (cWidth > maxDim || cHeight > maxDim) {
          if (cWidth > cHeight) {
            cHeight = Math.round((cHeight * maxDim) / cWidth);
            cWidth = maxDim;
          } else {
            cWidth = Math.round((cWidth * maxDim) / cHeight);
            cHeight = maxDim;
          }
        }
        canvas.width = cWidth;
        canvas.height = cHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, cWidth, cHeight);
          const posterDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          URL.revokeObjectURL(objectUrl);
          resolve({
            durationStr,
            durationSec,
            posterDataUrl,
            width,
            height,
            aspectRatio,
          });
        } else {
          URL.revokeObjectURL(objectUrl);
          resolve({
            durationStr,
            durationSec,
            posterDataUrl: '',
            width,
            height,
            aspectRatio,
          });
        }
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load video file. Please verify it is a valid MP4, WebM, or MOV file.'));
    };
  });
}

/**
 * Resolves a video URI (which could be an indexeddb: key, blob:, data:, or http(s) URL)
 * into a directly playable source URL.
 */
export async function resolveVideoUrl(uri?: string): Promise<string> {
  if (!uri) return '';
  if (uri.startsWith('indexeddb:')) {
    const blob = await getVideoBlob(uri);
    if (blob) {
      return URL.createObjectURL(blob);
    }
    return '';
  }
  return uri;
}

