import axios from "axios";

const API_URL = "http://localhost:5000/api/contacts";

const getAllContacts = () => axios.get(API_URL);

const getContactById = (id) => axios.get(`${API_URL}/${id}`);

const createContact = (contact) => axios.post(API_URL, contact);

const updateContact = (id, data) => axios.put(`${API_URL}/${id}`, data);

const deleteContact = (id) => axios.delete(`${API_URL}/${id}`);

export default {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
};