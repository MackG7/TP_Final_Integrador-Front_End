import { getFromStorage, removeFromStorage } from '../constants/LocalStorage.js';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.STORAGE_KEYS = {
            TOKEN: 'whatsapp_auth_token',
            USER: 'whatsapp_user_data'
        };
    }

    async request(endpoint, options = {}) {
        const token = getFromStorage(this.STORAGE_KEYS.TOKEN);

        console.log(' Enviando request:', {
            url: `${this.baseURL}${endpoint}`,
            method: options.method || 'GET',
            endpoint,
            hasToken: !!token
        });

        const config = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            credentials: 'include',
        };

        // 🔹 Procesar body correctamente
        if (options.body && options.method !== 'GET') {
            config.body = this.processBody(options.body);
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);

            console.log(' Respuesta HTTP:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
                endpoint
            });

            return await this.handleResponse(response, endpoint);

        } catch (error) {
            console.error(` API Error en ${endpoint}:`, {
                message: error.message,
                endpoint,
                method: options.method || 'GET'
            });

            this.handleApiError(error, endpoint);
            throw error;
        }
    }

    //  PROCESS BODY - Centralizado y mejorado
    processBody(body) {
        if (body instanceof FormData) {
            console.log(' Body es FormData, omitiendo Content-Type');
            return body;
        }

        console.log(' Procesando body:', body);
        
        if (typeof body === 'string') {
            try {
                JSON.parse(body);
                console.log(' Body ya es JSON string válido');
                return body;
            } catch {
                console.warn(' Body string no es JSON válido, convirtiendo...');
                return JSON.stringify({ data: body });
            }
        }

        // Para objetos, arrays, etc.
        return JSON.stringify(body);
    }

    //  HANDLE RESPONSE - Mejorado y más limpio
    async handleResponse(response, endpoint) {
        // Manejar respuesta sin contenido
        if (response.status === 204) {
            console.log(' Respuesta 204 - No Content');
            return { success: true, status: 204 };
        }

        const textResponse = await response.text();
        console.log(' Respuesta en texto:', textResponse.substring(0, 200) + '...');

        let data;
        if (textResponse) {
            try {
                data = JSON.parse(textResponse);
                console.log(' Respuesta parseada como JSON');
            } catch (parseError) {
                console.error(' Error parseando JSON:', parseError);
                console.error(' Texto que falló:', textResponse.substring(0, 500));
                throw new Error(`Respuesta del servidor no es JSON válido en ${endpoint}`);
            }
        } else {
            data = {};
            console.log(' Respuesta vacía');
        }

        // 🔹 Manejar errores HTTP
        if (!response.ok) {
            const errorMessage = data.error || data.message || 
            `Error ${response.status}: ${response.statusText}`;
            
            console.error(' Error del servidor:', {
                status: response.status,
                message: errorMessage,
                endpoint
            });

            const error = new Error(errorMessage);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        console.log(' Request exitoso en:', endpoint);
        return data;
    }

    //  HANDLE API ERROR - Mejorado
    handleApiError(error, endpoint) {
        // Solo manejar errores de autenticación
        const authErrors = [
            '401', 'No autorizado', 'token', 'autenticación', 
            'Unauthorized', 'invalid token'
        ];

        const isAuthError = authErrors.some(authError => 
            error.message.toLowerCase().includes(authError.toLowerCase())
        );

        if (isAuthError || error.status === 401) {
            console.warn(' Error de autenticación detectado, limpiando...');
            this.handleUnauthorized();
        }
    }

    //  HANDLE UNAUTHORIZED - Usando storage utils
    handleUnauthorized() {
        console.log(' Limpiando datos de autenticación...');
        removeFromStorage(this.STORAGE_KEYS.TOKEN);
        removeFromStorage(this.STORAGE_KEYS.USER);

        // Redirigir solo en cliente
        if (typeof window !== 'undefined' && window.location) {
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        }
    }

    //  MÉTODOS HTTP - Simplificados y consistentes
    get(endpoint, options = {}) {
        console.log(` GET ${endpoint}`);
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    post(endpoint, body) {
    console.log(' DEBUG - Body que se enviará:', body);
    console.log(' DEBUG - Tipo de body:', typeof body);
    console.log(' DEBUG - Estructura completa:', JSON.stringify(body, null, 2));
    
    return this.request(endpoint, {
        method: 'POST',
        body,
    });
}

    put(endpoint, body, options = {}) {
        console.log(` PUT ${endpoint}`, body);
        return this.request(endpoint, { 
            ...options, 
            method: 'PUT', 
            body 
        });
    }

    patch(endpoint, body, options = {}) {
        console.log(` PATCH ${endpoint}`, body);
        return this.request(endpoint, { 
            ...options, 
            method: 'PATCH', 
            body 
        });
    }

    delete(endpoint, options = {}) {
        console.log(` DELETE ${endpoint}`);
        return this.request(endpoint, { 
            ...options, 
            method: 'DELETE' 
        });
    }

    //  MÉTODOS ADICIONALES
    upload(endpoint, formData, options = {}) {
        console.log(` UPLOAD ${endpoint}`, formData);
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: formData,
            headers: {
                // No establecer Content-Type para FormData, el navegador lo hace automáticamente
                ...(options.headers || {})
            }
        });
    }

    //  MÉTODO PARA CONFIGURACIÓN DINÁMICA
    setBaseURL(newBaseURL) {
        this.baseURL = newBaseURL;
        console.log(` Base URL actualizada a: ${this.baseURL}`);
    }

    // MÉTODO PARA LIMPIAR CONFIGURACIÓN
    clearAuth() {
        removeFromStorage(this.STORAGE_KEYS.TOKEN);
        removeFromStorage(this.STORAGE_KEYS.USER);
    }
}

//  Exportar singleton
const apiService = new ApiService();
export default apiService;