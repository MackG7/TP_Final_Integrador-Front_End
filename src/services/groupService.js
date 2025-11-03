import authService from './authService.js';
import { CONTENT_TYPE_VALUES, HEADERS, HTTP_METHODS } from "../constants/htpps.js";

class GroupService {
    constructor() {
        // ✅ Ruta relativa para que Vite use el proxy
        this.baseURL = "/api/group";
    }

    // 🔹 Obtener lista de grupos
    async getGroupList() {
        try {
            const token = authService.getToken();
            if (!token) throw new Error("No hay token de autorización disponible");

            const response = await fetch(this.baseURL, {
                method: HTTP_METHODS.GET,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });

            const response_data = await response.json();

            if (!response.ok || !response_data.success) {
                throw new Error(response_data.error || response_data.message || `Error ${response.status}`);
            }

            return response_data;
        } catch (error) {
            console.error("❌ ERROR en getGroupList:", error.message);
            throw error;
        }
    }

    // 🔹 Crear grupo
    async createGroup(name, url_img = "") {
        try {
            if (!name || name.trim() === "") throw new Error("El nombre del grupo es requerido");

            const token = authService.getToken();
            if (!token) throw new Error("No hay token de autorización disponible");

            const body = { name: name.trim(), url_img: url_img || "" };

            const response = await fetch(this.baseURL, {
                method: HTTP_METHODS.POST,
                headers: {
                    [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const response_data = await response.json();

            if (!response.ok || !response_data.success) {
                throw new Error(response_data.error || response_data.message || `Error ${response.status}`);
            }

            return response_data;
        } catch (error) {
            console.error("❌ ERROR en createGroup:", error.message);
            throw error;
        }
    }

    // 🔹 Obtener grupo por ID
    async getGroupById(group_id) {
        try {
            if (!group_id) throw new Error("ID del grupo es requerido");

            const token = authService.getToken();
            if (!token) throw new Error("No hay token de autorización disponible");

            const response = await fetch(`${this.baseURL}/${group_id}`, {
                method: HTTP_METHODS.GET,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });

            const response_data = await response.json();

            if (!response.ok || !response_data.success) {
                throw new Error(response_data.error || response_data.message || `Error ${response.status}`);
            }

            return response_data;
        } catch (error) {
            console.error("❌ ERROR en getGroupById:", error.message);
            throw error;
        }
    }

    // 🔹 Invitar usuario a grupo
    async inviteUser(email, group_id) {
        try {
            if (!email || !group_id) throw new Error("Email y ID del grupo son requeridos");
            if (!/\S+@\S+\.\S+/.test(email)) throw new Error("El formato del email es inválido");

            const token = authService.getToken();
            if (!token) throw new Error("No hay token de autorización disponible");

            const body = { invited_email: email.toLowerCase().trim() };

            const response = await fetch(`${this.baseURL}/${group_id}/invite`, {
                method: HTTP_METHODS.POST,
                headers: {
                    [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const response_data = await response.json();

            if (!response.ok || !response_data.success) {
                throw new Error(response_data.error || response_data.message || `Error ${response.status}`);
            }

            return response_data;
        } catch (error) {
            console.error("❌ ERROR en inviteUser:", error.message);
            throw error;
        }
    }

    // 🔹 Actualizar grupo
    async updateGroup(group_id, updates) {
        try {
            if (!group_id || !updates) throw new Error("ID del grupo y actualizaciones son requeridos");

            const token = authService.getToken();
            if (!token) throw new Error("No hay token de autorización disponible");

            const response = await fetch(`${this.baseURL}/${group_id}`, {
                method: HTTP_METHODS.PUT,
                headers: {
                    [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            const response_data = await response.json();

            if (!response.ok || !response_data.success) {
                throw new Error(response_data.error || response_data.message || `Error ${response.status}`);
            }

            return response_data;
        } catch (error) {
            console.error("❌ ERROR en updateGroup:", error.message);
            throw error;
        }
    }

    // 🔹 Eliminar grupo
    async deleteGroup(group_id) {
        try {
            if (!group_id) throw new Error("ID del grupo es requerido");

            const token = authService.getToken();
            if (!token) throw new Error("No hay token de autorización disponible");

            const response = await fetch(`${this.baseURL}/${group_id}`, {
                method: HTTP_METHODS.DELETE,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });

            const response_data = await response.json();

            if (!response.ok || !response_data.success) {
                throw new Error(response_data.error || response_data.message || `Error ${response.status}`);
            }

            return response_data;
        } catch (error) {
            console.error("❌ ERROR en deleteGroup:", error.message);
            throw error;
        }
    }

    // 🔹 Obtener miembros del grupo
    async getGroupMembers(group_id) {
        try {
            if (!group_id) throw new Error("ID del grupo es requerido");

            const token = authService.getToken();
            if (!token) throw new Error("No hay token de autorización disponible");

            const response = await fetch(`${this.baseURL}/${group_id}/members`, {
                method: HTTP_METHODS.GET,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });

            const response_data = await response.json();

            if (!response.ok || !response_data.success) {
                throw new Error(response_data.error || response_data.message || `Error ${response.status}`);
            }

            return response_data;
        } catch (error) {
            console.error("❌ ERROR en getGroupMembers:", error.message);
            throw error;
        }
    }
}

// ✅ Singleton
const groupService = new GroupService();

// ✅ Export funciones individuales
export const getGroupList = () => groupService.getGroupList();
export const createGroup = (name, url_img = "") => groupService.createGroup(name, url_img);
export const getGroupById = (group_id) => groupService.getGroupById(group_id);
export const inviteUser = (email, group_id) => groupService.inviteUser(email, group_id);
export const updateGroup = (group_id, updates) => groupService.updateGroup(group_id, updates);
export const deleteGroup = (group_id) => groupService.deleteGroup(group_id);
export const getGroupMembers = (group_id) => groupService.getGroupMembers(group_id);

export default groupService;