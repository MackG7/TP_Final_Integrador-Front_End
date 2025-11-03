import { getFromStorage } from './LocalStorage.js';

// ✅ AGREGAR esta función
export const getAuthorizationToken = () => {
    return getFromStorage('whatsapp_auth_token');
};

// Tus exportaciones existentes (si las tienes):
export const CONTENT_TYPE_VALUES = {
    JSON: 'application/json',
    FORM_DATA: 'multipart/form-data',
    TEXT: 'text/plain'
};

export const HEADERS = {
    CONTENT_TYPE: 'Content-Type',
    AUTHORIZATION: 'Authorization'
};


export const HTTP_METHODS = {
    GET:'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
}



