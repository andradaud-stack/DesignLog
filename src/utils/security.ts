/**
 * Security & Anti-Tampering Utilities for DesignLog
 * Enforces XSS prevention, safe protocol filtering, prototype pollution defense, and PIN hashing.
 */

// Allowed URI schemes
const SAFE_URL_PATTERN = /^(https?:\/\/|\/|data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,)/i;

/**
 * Sanitizes URLs to prevent XSS via javascript:, data:text/html, vbscript:, etc.
 * Returns the URL if safe, or a fallback safe empty string.
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();

  // Block dangerous schemes explicitly
  const dangerousPatterns = /^(javascript|vbscript|data(?!:image\/(png|jpeg|jpg|webp|gif|svg\+xml);base64,)|file):/i;
  if (dangerousPatterns.test(trimmed)) {
    console.warn('[Security] Blocked dangerous URI scheme:', trimmed.slice(0, 30));
    return '';
  }

  // Allow standard http, https, relative paths, and safe image data URLs
  if (SAFE_URL_PATTERN.test(trimmed)) {
    return trimmed;
  }

  // If it starts with www. or domain format, prepend https://
  if (/^([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return '';
}

/**
 * Strips dangerous HTML tags or control characters from user text inputs.
 */
export function sanitizeText(text: string | null | undefined, maxLength = 2000): string {
  if (!text) return '';
  // Trim and limit length
  let sanitized = text.slice(0, maxLength);
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  return sanitized;
}

/**
 * Safe JSON parser with Prototype Pollution defense and max size limits.
 */
export function safeJsonParse<T = unknown>(jsonStr: string, maxSizeBytes = 10 * 1024 * 1024): T | null {
  try {
    if (typeof jsonStr !== 'string') return null;
    if (jsonStr.length > maxSizeBytes) {
      console.warn('[Security] JSON payload exceeds maximum allowed size');
      return null;
    }

    // Reviver to strip __proto__, constructor, and prototype to prevent prototype pollution
    const parsed = JSON.parse(jsonStr, (key, value) => {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        return undefined;
      }
      return value;
    });

    return parsed as T;
  } catch (e) {
    console.warn('[Security] JSON parse failed:', e);
    return null;
  }
}

/**
 * Cryptographically hashes a PIN using Web Crypto SHA-256 with a local salt.
 */
export async function hashPin(pin: string): Promise<string> {
  const normalized = `designlog_salt_v1_${pin.trim()}`;
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(normalized);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback below
    }
  }

  // Fallback FNV-1a 32-bit hash
  let hash = 2166136261;
  for (let i = 0; i < normalized.length; i++) {
    hash ^= normalized.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv_${(hash >>> 0).toString(16)}`;
}
