import ENVIRONMENT from "../config/environment.js"
import { CONTENT_TYPE_VALUES, HEADERS, HTTP_METHODS } from "../constants/htpps.js"
import { setToStorage, removeFromStorage, getFromStorage } from '../constants/LocalStorage.js'

class AuthService {
    constructor() {
        this.STORAGE_KEYS = {
            TOKEN: 'whatsapp_auth_token',
            USER: 'whatsapp_user_data'
        };
    }
    
    
    async register(name, email, password) {
        try {
            const usuario = {
                name: name,  
                email: email,
                password: password
            }

            console.log ('🔍 Enviando registro con:', { name, email });

            const response_http = await fetch(
                `${ENVIRONMENT.URL_API}/api/auth/register`,
                {
                    method: HTTP_METHODS.POST,
                    headers: {
                        [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON
                    },
                    body: JSON.stringify(usuario)
                }
            )

            const response_data = await response_http.json()
            
            console.log('📨 Respuesta del registro:', response_data);

            // ✅ Corregido: Verificar success en lugar de ok
            if (!response_data.success) {
                throw new Error(response_data.error || response_data.message || 'Error en el registro')
            }

            return response_data

        } catch (error) {
            console.error('❌ ERROR en register:', error.message);
            throw error;
        }
    }

    async login(email, password) {
        try {
            console.log('🔍 Enviando login con:', { email });

            const response = await fetch(
                `${ENVIRONMENT.URL_API}/api/auth/login`,
                {
                    method: HTTP_METHODS.POST,
                    headers: {
                        [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                }
            )

            const response_data = await response.json()
            
            console.log('📨 Respuesta del login:', response_data);

            // ✅ Corregido: Verificar tanto response.ok como response_data.success
            if (!response.ok || !response_data.success) {
                const errorMessage = response_data.error || 
                response_data.message || 
                `Error ${response.status}: ${response.statusText}`;
                throw new Error(errorMessage)
            }

            // ✅ Guardar token y usuario si el login es exitoso
            if (response_data.token) {
                this.setAuthToken(response_data.token);
            }
            if (response_data.user) {
                this.setUserData(response_data.user);
            }

            return response_data

        } catch (error) {
            console.error('❌ ERROR en login:', error.message);
            throw error;
        }
    }

    async verifyToken() {
        try {
            const token = this.getToken();
            
            if (!token) {
                throw new Error('No hay token disponible');
            }

            const response = await fetch(
                `${ENVIRONMENT.URL_API}/api/auth/verify-token`,
                {
                    method: HTTP_METHODS.GET,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                }
            )

            const response_data = await response.json()
            
            if (!response.ok || !response_data.success) {
                throw new Error(response_data.error || 'Token inválido');
            }

            return response_data

        } catch (error) {
            console.error('❌ ERROR en verifyToken:', error.message);
            throw error;
        }
    }

    async getProfile() {
        try {
            const token = this.getToken();
            
            if (!token) {
                throw new Error('No hay token disponible');
            }

            const response = await fetch(
                `${ENVIRONMENT.URL_API}/api/auth/profile`,
                {
                    method: HTTP_METHODS.GET,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                }
            )

            const response_data = await response.json()
            
            if (!response.ok) {
                throw new Error(response_data.error || 'Error obteniendo perfil');
            }

            return response_data

        } catch (error) {
            console.error('❌ ERROR en getProfile:', error.message);
            throw error;
        }
    }

    // 🔧 MÉTODOS DE HELPERS PARA MANEJO DE STORAGE
    setAuthToken(token) {
        if (!token) {
            console.warn('⚠️ Intentando establecer token vacío');
            return;
        }
        setToStorage(this.STORAGE_KEYS.TOKEN, token);
        console.log('✅ Token guardado en storage');
    }

    setUserData(user) {
        if (!user) {
            console.warn('⚠️ Intentando establecer user vacío');
            return;
        }
        setToStorage(this.STORAGE_KEYS.USER, JSON.stringify(user));
        console.log('✅ User data guardado en storage:', user.email);
    }

    getToken() {
        return getFromStorage(this.STORAGE_KEYS.TOKEN);
    }

    getUser() {
        try {
            const user = getFromStorage(this.STORAGE_KEYS.USER);
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('❌ Error parseando user data:', error);
            this.clearAuth();
            return null;
        }
    }

    isAuthenticated() {
        const token = this.getToken();
        return !!token;
    }

    clearAuth() {
        removeFromStorage(this.STORAGE_KEYS.TOKEN);
        removeFromStorage(this.STORAGE_KEYS.USER);
        console.log('🧹 Auth data limpiada');
    }

    logout() {
        this.clearAuth();
        console.log('👋 Sesión cerrada');
        
        // Redirigir al login si estamos en el cliente
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }

    // 🔄 MÉTODO PARA ACTUALIZAR PERFIL
    async updateProfile(updates) {
        try {
            const token = this.getToken();
            
            if (!token) {
                throw new Error('No hay token disponible');
            }

            const response = await fetch(
                `${ENVIRONMENT.URL_API}/api/auth/profile`,
                {
                    method: HTTP_METHODS.PUT,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(updates)
                }
            )

            const response_data = await response.json()
            
            if (!response.ok) {
                throw new Error(response_data.error || 'Error actualizando perfil');
            }

            // Actualizar datos del usuario en storage
            if (response_data.user) {
                this.setUserData(response_data.user);
            }

            return response_data

        } catch (error) {
            console.error('❌ ERROR en updateProfile:', error.message);
            throw error;
        }
    }
}

// ✅ Exportar como singleton para usar la misma instancia en toda la app
const authService = new AuthService();

// ✅ También exportar la clase por si se necesita crear múltiples instancias
export { AuthService };

// ✅ Exportar funciones individuales para mantener compatibilidad con código existente
export const register = (name, email, password) => authService.register(name, email, password);
export const login = (email, password) => authService.login(email, password);
export const verifyToken = () => authService.verifyToken();
export const getProfile = () => authService.getProfile();

export default authService;

