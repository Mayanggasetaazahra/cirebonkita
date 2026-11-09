/**
 * LocalStorage persistence utility for CirebonKita portal
 * Guarantees that any add/edit/delete made by admin or visitors
 * persists across reloads, login/logout, and page navigation.
 */

export const STORAGE_KEYS = {
  WISATA: 'cirebonkita_wisata_v2',
  UMKM: 'cirebonkita_umkm_v2',
  HOMESTAY: 'cirebonkita_homestay_v2',
  BOOKING: 'cirebonkita_booking_v2',
  ULASAN: 'cirebonkita_ulasan_v2',
  USERS: 'cirebonkita_users_v2',
  SETTINGS: 'cirebonkita_settings_v2',
  CATEGORIES: 'cirebonkita_categories_v2',
  AUTH: 'cirebonkita_auth_v2',
} as const;

export function loadStoredData<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw);
    if (parsed === null || parsed === undefined) return defaultValue;
    if (Array.isArray(defaultValue) && !Array.isArray(parsed)) return defaultValue;
    return parsed as T;
  } catch (err) {
    console.warn(`[Storage] Gagal membaca data ${key}:`, err);
    return defaultValue;
  }
}

export function saveStoredData<T>(key: string, data: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error(`[Storage] Gagal menyimpan data ${key} ke localStorage:`, err);
    return false;
  }
}

export function resetStoredData(): void {
  if (typeof window === 'undefined') return;
  Object.values(STORAGE_KEYS).forEach((k) => {
    localStorage.removeItem(k);
  });
}
