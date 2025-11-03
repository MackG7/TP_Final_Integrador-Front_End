import { useState, useCallback } from 'react';
import MessageService from '../../services/messageService.js';

export const useMessages = () => {
    const [contacts, setContacts] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);

    // 💬 ENVIAR MENSAJE A USUARIO
    const sendUserMessage = useCallback(async (receiverId, message) => {
        try {
            console.log('💬 Enviando mensaje a usuario:', { receiverId, message });
            
            const response = await MessageService.sendUserMessage(receiverId, message);
            
            if (response.success) {
                console.log('✅ Mensaje enviado exitosamente');
            }
            
            return response;
        } catch (error) {
            console.error('❌ ERROR en sendUserMessage:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }, []);

    // 💬 ENVIAR MENSAJE A GRUPO
    const sendGroupMessage = useCallback(async (groupId, message) => {
        try {
            console.log('💬 Enviando mensaje a grupo:', { groupId, message });
            
            const response = await MessageService.sendGroupMessage(groupId, message);
            
            if (response.success) {
                console.log('✅ Mensaje grupal enviado exitosamente');
            }
            
            return response;
        } catch (error) {
            console.error('❌ ERROR en sendGroupMessage:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }, []);

    // 📨 OBTENER MENSAJES CON USUARIO
    const getUserMessages = useCallback(async (userId, page = 1, limit = 50) => {
        try {
            console.log('📨 Obteniendo mensajes con usuario:', userId);
            
            const response = await MessageService.getUserMessages(userId, page, limit);
            return response;
        } catch (error) {
            console.error('❌ ERROR en getUserMessages:', error.message);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }, []);

    // 📨 OBTENER MENSAJES DE GRUPO
    const getGroupMessages = useCallback(async (groupId, page = 1, limit = 50) => {
        try {
            console.log('📨 Obteniendo mensajes de grupo:', groupId);
            
            const response = await MessageService.getGroupMessages(groupId, page, limit);
            return response;
        } catch (error) {
            console.error('❌ ERROR en getGroupMessages:', error.message);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }, []);

    // 🔄 OBTENER CONVERSACIONES RECIENTES
    const getRecentConversations = useCallback(async () => {
        try {
            console.log('🔄 Obteniendo conversaciones recientes');
            
            const response = await MessageService.getRecentConversations();
            
            if (response.success) {
                setConversations(response.data || []);
            }
            
            return response;
        } catch (error) {
            console.error('❌ ERROR en getRecentConversations:', error.message);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }, []);

    // 🗑️ ELIMINAR MENSAJE
    const deleteMessage = useCallback(async (messageId) => {
        try {
            console.log('🗑️ Eliminando mensaje:', messageId);
            
            const response = await MessageService.deleteMessage(messageId);
            return response;
        } catch (error) {
            console.error('❌ ERROR en deleteMessage:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }, []);

    return {
        // Estados
        contacts,
        conversations,
        messagesLoading,
        
        // Funciones
        sendUserMessage,
        sendGroupMessage,
        getUserMessages,
        getGroupMessages,
        getRecentConversations,
        deleteMessage,
        setContacts,
        setConversations,
    };
};