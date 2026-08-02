const STORAGE_KEY = "soul-selected-category";

export function getStoredCategory(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredCategory(slug: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, slug);
  } catch {
    // sessionStorage unavailable (SSR / private mode)
  }
}

export function clearStoredCategory(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // sessionStorage unavailable
  }
}
