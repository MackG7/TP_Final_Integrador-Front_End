import axios from "axios";
import { LOCAL_STORAGE_KEYS } from "../constants/LocalStorage.js";

const API_URL = "http://localhost:5000/api/contacts";

// Helper para obtener el token actual
const getAuthHeaders = () => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
};

const getAllContacts = () => axios.get(API_URL, getAuthHeaders());

const getContactById = (id) => axios.get(`${API_URL}/${id}`, getAuthHeaders());

const createContact = (contact) => axios.post(API_URL, contact, getAuthHeaders());

const updateContact = (id, data) =>
    axios.put(`${API_URL}/${id}`, data, getAuthHeaders());

const deleteContact = (id) => axios.delete(`${API_URL}/${id}`, getAuthHeaders());

export default {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
};