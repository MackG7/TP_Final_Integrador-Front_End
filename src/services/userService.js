import authService from "./authService.js";
import { HTTP_METHODS } from "../constants/htpps.js";

class UserService {
    constructor() {
        this.baseURL = "/api/user";
    }

    async getAllUsers() {
        const token = authService.getToken();
        if (!token) throw new Error("No hay token de autorización disponible");

        const response = await fetch(this.baseURL, {
            method: HTTP_METHODS.GET,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json",
            }
        });

        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || data.message);
        return data.data; // Devuelve la lista de usuarios
    }
}

const userService = new UserService();
export default userService;
export const getAllUsers = () => userService.getAllUsers();