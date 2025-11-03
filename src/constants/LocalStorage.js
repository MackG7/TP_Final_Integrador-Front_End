export const LOCAL_STORAGE_KEYS = {
    TOKEN: 'whatsapp_auth_token',
    USER: 'whatsapp_user_data',
    THEME: 'whatsapp_theme',
    LANGUAGE: 'whatsapp_language'
};

export const getFromStorage = (key) => {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
};

export const setToStorage = (key, value) => {
    try {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch (error) {
        console.error('Error writing to localStorage:', error);
    }
};

export const removeFromStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
};

export const clearStorage = () => {
    try {
        localStorage.clear();
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
};

// ✅ Exportación por defecto (opcional, para compatibilidad)
const LocalStorage = {
    LOCAL_STORAGE_KEYS,
    getFromStorage,
    setToStorage,
    removeFromStorage,
    clearStorage
};

export default LocalStorage;