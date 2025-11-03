import ENVIRONMENT from "../config/environment.js";
import { CONTENT_TYPE_VALUES, HEADERS, HTTP_METHODS } from "../constants/htpps.js";
import { getFromStorage } from "../constants/LocalStorage.js";

class MessageService {
    constructor() {
        this.baseURL = `${ENVIRONMENT.URL_API}/api`;
    }

    // 🔧 HELPER PARA OBTENER TOKEN (solución directa)
    getAuthorizationToken() {
        const token = getFromStorage('whatsapp_auth_token');
        console.log('🔑 Token obtenido:', !!token);
        return token;
    }

    // 💬 ENVIAR MENSAJE A USUARIO
    async sendUserMessage(receiverId, message) {
        try {
            console.log('💬 Enviando mensaje a usuario:', { receiverId, message });

            const token = this.getAuthorizationToken(); // ← ✅ CAMBIADO: this.getAuthorizationToken()
            if (!token) {
                throw new Error('No hay token de autorización disponible');
            }

            const body = {
                receiverId,
                content: message,
                type: 'text',
                timestamp: new Date().toISOString()
            };

            const response = await fetch(`${this.baseURL}/messages/user`, {
                method: HTTP_METHODS.POST,
                headers: {
                    [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const response_data = await response.json();
            
            console.log('📨 Respuesta de sendUserMessage:', response_data);

            if (!response.ok || !response_data.success) {
                const errorMessage = response_data.error || 
                    response_data.message || 
                    `Error ${response.status}: ${response.statusText}`;
                throw new Error(errorMessage);
            }

            return response_data;

        } catch (error) {
            console.error('❌ ERROR en sendUserMessage:', error.message);
            throw error;
        }
    }

    // 💬 ENVIAR MENSAJE A GRUPO
    async sendGroupMessage(groupId, message) {
        try {
            console.log('💬 Enviando mensaje a grupo:', { groupId, message });

            const token = this.getAuthorizationToken(); // ← ✅ CAMBIADO: this.getAuthorizationToken()
            if (!token) {
                throw new Error('No hay token de autorización disponible');
            }

            const body = {
                content: message,
                type: 'text',
                timestamp: new Date().toISOString()
            };

            const response = await fetch(`${this.baseURL}/groups/${groupId}/messages`, {
                method: HTTP_METHODS.POST,
                headers: {
                    [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const response_data = await response.json();
            
            console.log('📨 Respuesta de sendGroupMessage:', response_data);

            if (!response.ok || !response_data.success) {
                const errorMessage = response_data.error || 
                    response_data.message || 
                    `Error ${response.status}: ${response.statusText}`;
                throw new Error(errorMessage);
            }

            return response_data;

        } catch (error) {
            console.error('❌ ERROR en sendGroupMessage:', error.message);
            throw error;
        }
    }

    // 📨 OBTENER MENSAJES CON USUARIO
    async getUserMessages(userId, page = 1, limit = 50) {
        try {
            console.log('📨 Obteniendo mensajes con usuario:', userId);

            const token = this.getAuthorizationToken(); // ← ✅ CAMBIADO: this.getAuthorizationToken()
            if (!token) {
                throw new Error('No hay token de autorización disponible');
            }

            const response = await fetch(
                `${this.baseURL}/messages/user/${userId}?page=${page}&limit=${limit}`, 
                {
                    method: HTTP_METHODS.GET,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                }
            );

            const response_data = await response.json();
            
            console.log('📨 Respuesta de getUserMessages:', response_data);

            if (!response.ok || !response_data.success) {
                const errorMessage = response_data.error || 
                    response_data.message || 
                    `Error ${response.status}: ${response.statusText}`;
                throw new Error(errorMessage);
            }

            return response_data;

        } catch (error) {
            console.error('❌ ERROR en getUserMessages:', error.message);
            throw error;
        }
    }

    // 📨 OBTENER MENSAJES DE GRUPO
    async getGroupMessages(groupId, page = 1, limit = 50) {
        try {
            console.log('📨 Obteniendo mensajes de grupo:', groupId);

            const token = this.getAuthorizationToken(); // ← ✅ CAMBIADO: this.getAuthorizationToken()
            if (!token) {
                throw new Error('No hay token de autorización disponible');
            }

            const response = await fetch(
                `${this.baseURL}/groups/${groupId}/messages?page=${page}&limit=${limit}`, 
                {
                    method: HTTP_METHODS.GET,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                }
            );

            const response_data = await response.json();
            
            console.log('📨 Respuesta de getGroupMessages:', response_data);

            if (!response.ok || !response_data.success) {
                const errorMessage = response_data.error || 
                response_data.message || 
                `Error ${response.status}: ${response.statusText}`;
                throw new Error(errorMessage);
            }

            return response_data;

        } catch (error) {
            console.error('❌ ERROR en getGroupMessages:', error.message);
            throw error;
        }
    }

    // 🔄 OBTENER CONVERSACIONES RECIENTES
    async getRecentConversations() {
        try {
            console.log('🔄 Obteniendo conversaciones recientes');

            const token = this.getAuthorizationToken(); // ← ✅ CAMBIADO: this.getAuthorizationToken()
            if (!token) {
                throw new Error('No hay token de autorización disponible');
            }

            const response = await fetch(`${this.baseURL}/messages/conversations`, {
                method: HTTP_METHODS.GET,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });

            const response_data = await response.json();
            
            console.log('📨 Respuesta de getRecentConversations:', response_data);

            if (!response.ok || !response_data.success) {
                const errorMessage = response_data.error || 
                    response_data.message || 
                    `Error ${response.status}: ${response.statusText}`;
                throw new Error(errorMessage);
            }

            return response_data;

        } catch (error) {
            console.error('❌ ERROR en getRecentConversations:', error.message);
            throw error;
        }
    }

    // 🗑️ ELIMINAR MENSAJE
    async deleteMessage(messageId) {
        try {
            console.log('🗑️ Eliminando mensaje:', messageId);

            const token = this.getAuthorizationToken(); // ← ✅ CAMBIADO: this.getAuthorizationToken()
            if (!token) {
                throw new Error('No hay token de autorización disponible');
            }

            const response = await fetch(`${this.baseURL}/messages/${messageId}`, {
                method: HTTP_METHODS.DELETE,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });

            const response_data = await response.json();
            
            console.log('📨 Respuesta de deleteMessage:', response_data);

            if (!response.ok || !response_data.success) {
                const errorMessage = response_data.error || 
                    response_data.message || 
                    `Error ${response.status}: ${response.statusText}`;
                throw new Error(errorMessage);
            }

            return response_data;

        } catch (error) {
            console.error('❌ ERROR en deleteMessage:', error.message);
            throw error;
        }
    }
}

// ✅ Exportar como singleton
const messageService = new MessageService();

export default messageService;