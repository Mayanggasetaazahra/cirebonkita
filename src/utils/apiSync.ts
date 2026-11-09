/**
 * Centralized API synchronization service for CirebonKita.
 * Guarantees that any changes made by any admin on any device
 * (updating images, descriptions, prices, facilities, categories, reservations)
 * are immediately persisted on the server and synchronized in real-time
 * to all other admins and visitors across different computers/phones.
 */

let currentVersion = 0;
let isSyncing = false;

export interface ServerSyncData {
  wisata?: any[];
  umkm?: any[];
  homestay?: any[];
  booking?: any[];
  ulasan?: any[];
  users?: any[];
  settings?: any;
  categories?: any[];
}

/**
 * Fetch the latest server data. If server is uninitialized, seeds it with initial fallback data.
 */
export async function syncInitWithServer(defaults: ServerSyncData): Promise<{
  data: ServerSyncData;
  version: number;
}> {
  try {
    const res = await fetch('/api/data', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        currentVersion = json.version || 1;
        
        // If server data has keys already populated, use them
        const hasServerContent = 
          (json.data.wisata && json.data.wisata.length > 0) ||
          (json.data.homestay && json.data.homestay.length > 0) ||
          (json.data.umkm && json.data.umkm.length > 0);

        if (hasServerContent) {
          return { data: json.data, version: currentVersion };
        } else {
          // Seed the server with our defaults
          await saveFullDataToServer(defaults);
          return { data: defaults, version: currentVersion };
        }
      }
    }
  } catch (err) {
    console.warn('[apiSync] Tidak dapat terhubung ke /api/data saat boot:', err);
  }

  return { data: defaults, version: currentVersion };
}

/**
 * Save single module changes to server (e.g. 'homestay', 'wisata', 'umkm')
 */
export async function saveModuleToServer(key: string, data: any): Promise<boolean> {
  try {
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, data }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.version) {
        currentVersion = json.version;
        return true;
      }
    }
  } catch (err) {
    console.error(`[apiSync] Gagal menyimpan modul '${key}' ke server:`, err);
  }
  return false;
}

/**
 * Save full dataset to server
 */
export async function saveFullDataToServer(allData: ServerSyncData): Promise<boolean> {
  try {
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ allData }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.version) {
        currentVersion = json.version;
        return true;
      }
    }
  } catch (err) {
    console.error('[apiSync] Gagal menyimpan full database ke server:', err);
  }
  return false;
}

/**
 * Upload an image to the server so that it has a permanent public URL (/uploads/...)
 * accessible to all other devices and users.
 */
export async function uploadImageToServer(dataUrl: string, filename?: string): Promise<string> {
  // If already a standard URL, no need to upload
  if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://') || dataUrl.startsWith('/uploads/')) {
    return dataUrl;
  }

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl, filename }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.url) {
        return json.url;
      }
    }
  } catch (err) {
    console.error('[apiSync] Gagal mengunggah foto ke server:', err);
  }

  // Fallback to original dataUrl if upload endpoint unreachable
  return dataUrl;
}

/**
 * Background auto-sync watcher: checks server version every 4 seconds
 * and notifies callback whenever another admin makes an update.
 */
export function startServerSyncWatcher(
  onUpdate: (freshData: ServerSyncData) => void,
  intervalMs = 4000
): () => void {
  const checkUpdate = async () => {
    if (isSyncing) return;
    try {
      const res = await fetch('/api/version', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.version && json.version > currentVersion) {
          isSyncing = true;
          const fullRes = await fetch('/api/data', { cache: 'no-store' });
          if (fullRes.ok) {
            const fullJson = await fullRes.json();
            if (fullJson.success && fullJson.data) {
              currentVersion = fullJson.version;
              onUpdate(fullJson.data);
            }
          }
          isSyncing = false;
        }
      }
    } catch {
      isSyncing = false;
    }
  };

  const intervalId = setInterval(checkUpdate, intervalMs);

  const handleFocus = () => {
    checkUpdate();
  };

  window.addEventListener('focus', handleFocus);

  return () => {
    clearInterval(intervalId);
    window.removeEventListener('focus', handleFocus);
  };
}
