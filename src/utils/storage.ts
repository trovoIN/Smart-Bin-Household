const STORAGE_PREFIX = 'hsb_';

export const storage = {
    get: <T>(key: string): T | null => {
        try {
            const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
            return item ? JSON.parse(item) : null;
        } catch {
            return null;
        }
    },

    set: <T>(key: string, value: T): void => {
        try {
            localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    remove: (key: string): void => {
        localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    },

    clear: (): void => {
        Object.keys(localStorage)
            .filter((key) => key.startsWith(STORAGE_PREFIX))
            .forEach((key) => localStorage.removeItem(key));
    },
};

export const STORAGE_KEYS = {
    MOCK_DB: 'mock_db_v1',
    SESSION: 'session_v1',
} as const;
