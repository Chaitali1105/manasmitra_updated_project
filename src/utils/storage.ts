const STORAGE_PREFIX = 'manasmitra_';

export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage for key ${key}:`, error);
      return defaultValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage for key ${key}:`, error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (error) {
      console.error(`Error removing from localStorage for key ${key}:`, error);
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(STORAGE_PREFIX))
        .forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};
