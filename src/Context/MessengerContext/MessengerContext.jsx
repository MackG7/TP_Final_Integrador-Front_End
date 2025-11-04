import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService.js";
import { getGroupList } from "../../services/groupService.js";
import { getAllUsers } from "../../services/userService.js";
import ContactService from "../../services/contactService.js";

export const MessengerContext = createContext();

export const MessengerProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(authService.getUser());
    const [groups, setGroups] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [activeGroup, setActiveGroup] = useState(null);
    const [activeContact, setActiveContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                if (!user) {
                    console.warn(" No hay usuario autenticado, redirigiendo...");
                    navigate("/login");
                    return;
                }

                // Obtener grupos
                const groupsRes = await getGroupList();
                setGroups(groupsRes.data);

                // Obtener usuarios (excluyendo el actual)
                const usersRes = await getAllUsers();
                setContacts(usersRes.data.filter((u) => u.id !== user.id));

                // Obtener contactos desde ContactService (si existe)
                try {
                    const contactsRes = await ContactService.getAllContacts();
                    setContacts((prev) => [...prev, ...contactsRes.data]);
                } catch (err) {
                    console.error("Error obteniendo contactos desde ContactService:", err);
                }
            } catch (err) {
                console.error(" Error cargando datos:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) fetchData();
    }, [user?.id, navigate]);


    const logout = () => {
        console.log(" Cerrando sesión desde MessengerContext...");
        authService.logout(navigate); // limpia storage + redirige al login

        //  Limpiar estados locales también
        setUser(null);
        setGroups([]);
        setContacts([]);
        setActiveGroup(null);
        setActiveContact(null);
        setMessages([]);
        setLoading(false);
    };


    // 💡 CONTEXTO GLOBAL
    const value = {
        user,
        setUser,
        groups,
        setGroups,
        contacts,
        setContacts,
        activeGroup,
        setActiveGroup,
        activeContact,
        setActiveContact,
        messages,
        setMessages,
        loading,
        logout,
    };


return (
    <MessengerContext.Provider value={value}>
        {children}
    </MessengerContext.Provider>
);
};