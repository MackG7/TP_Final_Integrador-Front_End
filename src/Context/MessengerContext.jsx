import { createContext, useState, useEffect } from "react";
import authService from "../services/authService.js";
import { getGroupList } from "../services/groupService.js";
import { getAllUsers } from "../services/userService.js";
import ContactService from "../services/contactService.js"; // ✅ Asegúrate de importarlo

export const MessengerContext = createContext();

export const MessengerProvider = ({ children }) => {
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

                // ✅ Obtener grupos
                const groupsRes = await getGroupList();
                setGroups(groupsRes.data);

                // ✅ Obtener usuarios (excluyendo el usuario actual)
                const usersRes = await getAllUsers();
                setContacts(usersRes.data.filter(u => u.id !== user.id));

                // ✅ Obtener contactos de ContactService
                try {
                    const contactsRes = await ContactService.getAllContacts();
                    setContacts(prev => [...prev, ...contactsRes.data]);
                } catch (err) {
                    console.error("Error obteniendo contactos desde ContactService:", err);
                }

            } catch (err) {
                console.error("❌ Error cargando datos:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.id]);

    const value = {
        user,
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
        loading
    };

    return (
        <MessengerContext.Provider value={value}>
            {children}
        </MessengerContext.Provider>
    );
};