import type { Work } from '../types/work';
import type { DesignTask } from '../types/task';
import type { UserProfile } from '../types/user';

export const AUTH_TOKEN_KEY = 'designlog_auth_token';

// Helper to get Authorization Header
export function getAuthHeaders(): Record<string, string> {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

// Check TiDB database health
export async function checkDatabaseHealth(): Promise<{ connected: boolean; message: string }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return { connected: false, message: 'API not reachable' };
    const data = await res.json();
    return {
      connected: Boolean(data.connected),
      message: data.message || (data.connected ? 'TiDB Connected' : 'Local Storage Mode'),
    };
  } catch {
    return { connected: false, message: 'Local Storage Mode (Offline/Standalone)' };
  }
}

// ==========================================
// AUTH API
// ==========================================
export async function checkAuthStatus(): Promise<{
  authenticated: boolean;
  isSetup: boolean;
  user: { username: string; email: string } | null;
}> {
  try {
    const res = await fetch('/api/auth', {
      headers: { ...getAuthHeaders() },
    });
    if (res.ok) {
      const data = await res.json();
      return {
        authenticated: Boolean(data.authenticated),
        isSetup: Boolean(data.isSetup),
        user: data.user || null,
      };
    }
    return { authenticated: false, isSetup: true, user: null };
  } catch {
    return { authenticated: false, isSetup: true, user: null };
  }
}

export async function loginAdminApi(
  identifier: string,
  password: string
): Promise<{ success: boolean; message?: string; user?: any; needSetup?: boolean }> {
  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', identifier, password }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      return { success: true, message: data.message, user: data.user };
    }
    return { success: false, message: data.error || 'Login gagal', needSetup: data.needSetup };
  } catch {
    return { success: false, message: 'Gagal menghubungi server autentikasi' };
  }
}

export async function setupAdminApi(
  username: string,
  email: string,
  password: string
): Promise<{ success: boolean; message?: string; user?: any }> {
  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'setup', username, email, password }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      return { success: true, message: data.message, user: data.user };
    }
    return { success: false, message: data.error || 'Setup gagal' };
  } catch {
    return { success: false, message: 'Gagal menghubungi server' };
  }
}

export async function changePasswordApi(
  currentPassword: string,
  newPassword: string,
  username?: string,
  email?: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ action: 'change-password', currentPassword, newPassword, username, email }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      return { success: true, message: data.message };
    }
    return { success: false, message: data.error || 'Gagal mengubah password' };
  } catch {
    return { success: false, message: 'Gagal menghubungi server' };
  }
}

export async function logoutAdminApi(): Promise<boolean> {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    return true;
  } catch {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return true;
  }
}

// ==========================================
// WORKS API
// ==========================================
export async function fetchWorksFromApi(): Promise<Work[] | null> {
  try {
    const res = await fetch('/api/works');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveWorkToApi(work: Work): Promise<boolean> {
  try {
    const res = await fetch('/api/works', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(work),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteWorkFromApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/works?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function bulkSyncWorksToApi(works: Work[]): Promise<boolean> {
  try {
    const res = await fetch('/api/works', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ works }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function clearAllWorksFromApi(): Promise<boolean> {
  try {
    const res = await fetch('/api/works?all=true', {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ==========================================
// TASKS API
// ==========================================
export async function fetchTasksFromApi(): Promise<DesignTask[] | null> {
  try {
    const res = await fetch('/api/tasks');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveTaskToApi(task: DesignTask): Promise<boolean> {
  try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(task),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteTaskFromApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/tasks?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function bulkSyncTasksToApi(tasks: DesignTask[]): Promise<boolean> {
  try {
    const res = await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ tasks }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function clearAllTasksFromApi(): Promise<boolean> {
  try {
    const res = await fetch('/api/tasks?all=true', {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ==========================================
// PROFILE API
// ==========================================
export async function fetchProfileFromApi(): Promise<UserProfile | null> {
  try {
    const res = await fetch('/api/profile');
    if (res.ok) {
      const data = await res.json();
      if (data && data.name) return data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveProfileToApi(profile: UserProfile): Promise<boolean> {
  try {
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(profile),
    });
    return res.ok;
  } catch {
    return false;
  }
}
