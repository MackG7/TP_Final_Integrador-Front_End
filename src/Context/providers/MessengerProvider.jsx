import React from 'react';
import { MessengerContext } from '../MessengerContext/MessengerContext.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useMessages } from '../hooks/useMessages.jsx';
import { useGroups } from '../hooks/useGroups.jsx';

export const MessengerProvider = ({ children }) => {
    const auth = useAuth();
    const messages = useMessages();
    const groups = useGroups();

    const value = {
        // Estados de Auth
        user: auth.user,
        loading: auth.loading,
        authLoading: auth.authLoading,
        error: auth.error,
        isAuthenticated: auth.isAuthenticated,
        
        // Estados de Messages
        contacts: messages.contacts,
        conversations: messages.conversations,
        messagesLoading: messages.messagesLoading,
        
        // Estados de Groups
        groups: groups.groups,
        groupsLoading: groups.groupsLoading,

        // Funciones de Auth
        register: auth.register,
        login: auth.login,
        logout: auth.logout,
        clearError: auth.clearError,
        setAuthState: auth.setAuthState,
        clearAuthState: auth.clearAuthState,

        // Funciones de Messages
        sendUserMessage: messages.sendUserMessage,
        sendGroupMessage: messages.sendGroupMessage,
        getUserMessages: messages.getUserMessages,
        getGroupMessages: messages.getGroupMessages,
        getRecentConversations: messages.getRecentConversations,
        deleteMessage: messages.deleteMessage,

        // Funciones de Groups
        createGroup: groups.createGroup,
        getGroupList: groups.getGroupList,
        getGroupById: groups.getGroupById,
        inviteUserToGroup: groups.inviteUserToGroup,

        // Estados derivados
        hasUser: auth.hasUser,
        userInitials: auth.userInitials,
    };

    return (
        <MessengerContext.Provider value={value}>
            {children}
        </MessengerContext.Provider>
    );
};

export default MessengerProvider;