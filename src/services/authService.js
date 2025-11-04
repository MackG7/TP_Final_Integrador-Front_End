import ENVIRONMENT from "../config/environment.js";
import { CONTENT_TYPE_VALUES, HEADERS, HTTP_METHODS } from "../constants/htpps.js";
import { setToStorage, removeFromStorage, getFromStorage } from "../constants/LocalStorage.js";

class AuthService {
    constructor() {
        this.STORAGE_KEYS = {
            TOKEN: "whatsapp_auth_token",
            USER: "whatsapp_user_data",
        };
    }

    async register(name, email, password) {
        try {
            const usuario = { name, email, password };

            console.log(" Enviando registro con:", { name, email });

            const response_http = await fetch(
                `${ENVIRONMENT.URL_API}/api/auth/register`,
                {
                    method: HTTP_METHODS.POST,
                    headers: {
                        [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                    },
                    body: JSON.stringify(usuario),
                }
            );

            const response_data = await response_http.json();
            console.log(" Respuesta del registro:", response_data);

            if (!response_data.success) {
                throw new Error(response_data.error || response_data.message || "Error en el registro");
            }

            return response_data;
        } catch (error) {
            console.error(" ERROR en register:", error.message);
            throw error;
        }
    }

    async login(email, password) {
        try {
            console.log(" Enviando login con:", { email });

            const response = await fetch(
                `${ENVIRONMENT.URL_API}/api/auth/login`,
                {
                    method: HTTP_METHODS.POST,
                    headers: {
                        [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                        Accept: "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            const response_data = await response.json();
            console.log(" Respuesta del login:", response_data);

            if (!response.ok || !response_data.success) {
                const errorMessage =
                    response_data.error ||
                    response_data.message ||
                    `Error ${response.status}: ${response.statusText}`;
                throw new Error(errorMessage);
            }

            //token y usuario
            if (response_data.token) this.setAuthToken(response_data.token);
            if (response_data.user) this.setUserData(response_data.user);

            return response_data;
        } catch (error) {
            console.error(" ERROR en login:", error.message);
            throw error;
        }
    }

    async verifyToken() {
        try {
            const token = this.getToken();
            if (!token) throw new Error("No hay token disponible");

            const response = await fetch(
                `${ENVIRONMENT.URL_API}/api/auth/verify-token`,
                {
                    method: HTTP_METHODS.GET,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            const response_data = await response.json();
            if (!response.ok || !response_data.success) {
                throw new Error(response_data.error || "Token inválido");
            }

            return response_data;
        } catch (error) {
            console.error(" ERROR en verifyToken:", error.message);
            throw error;
        }
    }

    async getProfile() {
        try {
            const token = this.getToken();
            if (!token) throw new Error("No hay token disponible");

            const response = await fetch(
                `${ENVIRONMENT.URL_API}/api/auth/profile`,
                {
                    method: HTTP_METHODS.GET,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            const response_data = await response.json();
            if (!response.ok) throw new Error(response_data.error || "Error obteniendo perfil");

            return response_data;
        } catch (error) {
            console.error("❌ ERROR en getProfile:", error.message);
            throw error;
        }
    }

    async updateProfile(updates) {
        try {
            const token = this.getToken();
            if (!token) throw new Error("No hay token disponible");

            const response = await fetch(
                `${ENVIRONMENT.URL_API}/api/auth/profile`,
                {
                    method: HTTP_METHODS.PUT,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                        Accept: "application/json",
                    },
                    body: JSON.stringify(updates),
                }
            );

            const response_data = await response.json();
            if (!response.ok) throw new Error(response_data.error || "Error actualizando perfil");

            if (response_data.user) this.setUserData(response_data.user);

            return response_data;
        } catch (error) {
            console.error(" ERROR en updateProfile:", error.message);
            throw error;
        }
    }

    // GESTIÓN LOCAL (TOKEN/USER)
    setAuthToken(token) {
        if (!token) return console.warn(" Intentando establecer token vacío");
        setToStorage(this.STORAGE_KEYS.TOKEN, token);
        console.log(" Token guardado en storage");
    }

    setUserData(user) {
        if (!user) return console.warn(" Intentando establecer user vacío");
        setToStorage(this.STORAGE_KEYS.USER, JSON.stringify(user));
        console.log(" User data guardado:", user.email);
    }

    getToken() {
        return getFromStorage(this.STORAGE_KEYS.TOKEN);
    }

    getUser() {
        try {
            const user = getFromStorage(this.STORAGE_KEYS.USER);
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error(" Error parseando user data:", error);
            this.clearAuth();
            return null;
        }
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    clearAuth() {
        removeFromStorage(this.STORAGE_KEYS.TOKEN);
        removeFromStorage(this.STORAGE_KEYS.USER);
        console.log(" Auth data limpiada");
    }

    // LOGOUT (sin recargar)
    logout(navigate = null) {
        this.clearAuth();
        console.log(" Sesión cerrada");

        if (navigate) {
            navigate("/login"); // React Router
        } else if (typeof window !== "undefined") {
            window.location.href = "/login"; // fallback
        }
    }
}


const authService = new AuthService();

export { AuthService };
export const register = (name, email, password) => authService.register(name, email, password);
export const login = (email, password) => authService.login(email, password);
export const verifyToken = () => authService.verifyToken();
export const getProfile = () => authService.getProfile();
export default authService;