import type { Work } from '../types/work';
import type { DesignTask } from '../types/task';
import type { UserProfile } from '../types/user';

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

// WORKS API
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
    });
    return res.ok;
  } catch {
    return false;
  }
}

// TASKS API
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
    });
    return res.ok;
  } catch {
    return false;
  }
}

// PROFILE API
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    return res.ok;
  } catch {
    return false;
  }
}
