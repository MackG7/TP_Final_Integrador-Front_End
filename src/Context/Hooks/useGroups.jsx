import { useState, useCallback } from 'react';
import GroupService from '../../services/groupService';
import MockGroupService from '../../services/groupService';

export const useGroups = () => {
    const [groups, setGroups] = useState([]);
    const [groupsLoading, setGroupsLoading] = useState(false);
    
    const createGroup = useCallback(async (groupData) => {
    try {
        setGroupsLoading(true);

        console.log('👥 [useGroups] Datos recibidos:', groupData); // ← AGREGAR ESTE LOG

        // ✅ VALIDACIÓN EN FRONTEND ANTES DE ENVIAR
        if (!groupData.name || groupData.name.trim() === '') {
            throw new Error('El nombre del grupo es requerido');
        }

        const response = await GroupService.createGroup(
            groupData.name.trim(), 
            groupData.url_img || ''
        );

        console.log('👥 [useGroups] Respuesta del backend:', response); // ← AGREGAR ESTE LOG

        if (response.success) {
            setGroups(prev => [...prev, response.data]);
            return {
                success: true,
                group: response.data,
                message: response.message || 'Grupo creado exitosamente'
            };
        } else {
            throw new Error(response.error || 'Error al crear el grupo');
        }

    } catch (error) {
        console.error('❌ ERROR en createGroup:', error.message);
        return {
            success: false,
            error: error.message,
            message: error.message
        };
    } finally {
        setGroupsLoading(false);
    }
}, []);

    

    // 👥 OBTENER LISTA DE GRUPOS
    const getGroupList = useCallback(async () => {
        try {
            setGroupsLoading(true);
            console.log('👥 Obteniendo lista de grupos');
            
            const response = await GroupService.getGroupList();
            
            if (response.success) {
                setGroups(response.data || []);
            }
            
            return response;
        } catch (error) {
            console.error('❌ ERROR en getGroupList:', error.message);
            return {
                success: false,
                error: error.message,
                data: []
            };
        } finally {
            setGroupsLoading(false);
        }
    }, []);

    // 👥 OBTENER GRUPO POR ID
    const getGroupById = useCallback(async (groupId) => {
        try {
            console.log('👥 Obteniendo grupo por ID:', groupId);
            
            const response = await GroupService.getGroupById(groupId);
            return response;
        } catch (error) {
            console.error('❌ ERROR en getGroupById:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }, []);

    // 👥 INVITAR USUARIO A GRUPO
    const inviteUserToGroup = useCallback(async (email, groupId) => {
        try {
            console.log('👥 Invitando usuario a grupo:', { email, groupId });
            
            const response = await GroupService.inviteUser(email, groupId);
            return response;
        } catch (error) {
            console.error('❌ ERROR en inviteUserToGroup:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }, []);

    return {
        // Estados
        groups,
        groupsLoading,
        
        // Funciones
        createGroup,
        getGroupList,
        getGroupById,
        inviteUserToGroup,
        setGroups,
    };
};