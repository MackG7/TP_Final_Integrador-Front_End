import api from '../services/apiService.js';

class ConversationService {
    // 💬 OBTENER CONVERSACIONES
    async getConversations() {
        try {
            const response = await api.get ('/conversations');
            return response;
        } catch (error) {
            throw error;
        }
    }

    // ➕ CREAR CONVERSACIÓN
    async createConversation(participantId) {
        try {
            const response = await api.post('/conversations', { participantId });
            return response;
        } catch (error) {
            throw error;
        }
    }

    // 👥 OBTENER DETALLES DE CONVERSACIÓN
    async getConversation(conversationId) {
        try {
            const response = await api.get(`/conversations/${conversationId}`);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // 🗑️ ELIMINAR CONVERSACIÓN
    async deleteConversation(conversationId) {
        try {
            const response = await api.delete(`/conversations/${conversationId}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default new ConversationService();