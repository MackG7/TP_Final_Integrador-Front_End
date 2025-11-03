import { useState, useCallback, useEffect } from 'react';
import AuthService from '../../services/authService.js';
import { getFromStorage, setToStorage, removeFromStorage } from '../../constants/LocalStorage.js';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const STORAGE_KEYS = {
        AUTH_TOKEN: 'whatsapp_auth_token',
        USER_DATA: 'whatsapp_user_data'
    };

    const setAuthState = useCallback((userData = null, authenticated = false) => {
        setUser(userData);
        setIsAuthenticated(authenticated);
    }, []);

    const clearAuthState = useCallback(() => {
        setAuthState(null, false);
        setError(null);
    }, [setAuthState]);

    // ✅ CORREGIDO: useEffect con dependencias adecuadas
    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                setLoading(true);
                const token = getFromStorage(STORAGE_KEYS.AUTH_TOKEN);
                const userData = getFromStorage(STORAGE_KEYS.USER_DATA);

                console.log('🔍 CheckAuthentication - Token:', !!token, 'UserData:', !!userData);

                if (!token) {
                    console.log('🔍 No hay token, limpiando estado...');
                    clearAuthState();
                    return;
                }

                try {
                    const response = await AuthService.verifyToken();
                    console.log('✅ Token válido:', response.user?.email);
                    
                    if (response.success && response.user) {
                        setAuthState(response.user, true);
                    } else {
                        throw new Error('Token inválido');
                    }
                    
                } catch (verifyError) {
                    console.warn('⚠️ Token inválido, limpiando auth...', verifyError.message);
                    clearAuthState();
                }

            } catch (error) {
                console.error('❌ Error en checkAuthentication:', error);
                clearAuthState();
            } finally {
                setLoading(false);
                console.log('🔍 CheckAuthentication completado');
            }
        };

        checkAuthentication();
    }, []); // ✅ DEPENDENCIAS VACÍAS - solo se ejecuta una vez al montar

    // 🔐 LOGIN
    const login = useCallback(async (email, password) => {
        try {
            setAuthLoading(true);
            setError(null);

            if (typeof email !== 'string' || typeof password !== 'string') {
                return { success: false, error: 'Email y password deben ser strings' };
            }

            const response = await AuthService.login(email, password);
            
            if (response.success) {
                setAuthState(response.user, true);
                return { success: true, user: response.user };
            } else {
                throw new Error(response.error || 'Error en el login');
            }

        } catch (error) {
            const errorMessage = error.message || 'Error al iniciar sesión';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setAuthLoading(false);
        }
    }, [setAuthState]);

    // 📝 REGISTRO
    const register = useCallback(async (userData) => {
        try {
            setAuthLoading(true);
            setError(null);

            if (!userData || typeof userData !== 'object') {
                return { success: false, error: 'Datos de usuario inválidos' };
            }

            const { name, email, password } = userData;

            if (!name || !email || !password) {
                return { success: false, error: 'Nombre, email y contraseña son requeridos' };
            }

            const response = await AuthService.register(name, email, password);
            
            if (response.success) {
                return { success: true, message: response.message };
            } else {
                throw new Error(response.error || 'Error en el registro');
            }

        } catch (error) {
            const errorMessage = error.message || 'Error al registrar usuario';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setAuthLoading(false);
        }
    }, []);

    // 🚪 LOGOUT
    const logout = useCallback(() => {
        console.log('👋 Cerrando sesión...');
        removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
        removeFromStorage(STORAGE_KEYS.USER_DATA);
        clearAuthState();
        
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }, [clearAuthState, STORAGE_KEYS]);

    // 🗑️ LIMPIAR ERROR
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        // Estados
        user,
        loading,
        authLoading,
        error,
        isAuthenticated,
        
        // Funciones
        register,
        login,
        logout,
        clearError,
        setAuthState,
        clearAuthState,
        
        // Estados derivados
        hasUser: !!user,
        userInitials: user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U',
    };
};