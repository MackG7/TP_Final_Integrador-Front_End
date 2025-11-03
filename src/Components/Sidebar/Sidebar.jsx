import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MessengerContext } from "../../Context/MessengerContext.jsx";
import ContactList from "../ContactList/ContactList.jsx";
import Icons from "../../assets/Icons.jsx";
import "./Sidebar.css";

function Sidebar() {
    const {
        contacts,
        groups,
        setActiveGroup,
        activeGroup,
        setActiveContact,
        user
    } = useContext(MessengerContext);

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    // Manejo de clic en contacto
    const handleContactClick = (contact) => {
        setActiveContact(contact);
        setActiveGroup(null); // deseleccionamos grupo
        navigate(`/chat/contact/${contact.id}`);
    };

    // Manejo de clic en grupo
    const handleGroupClick = (group) => {
        setActiveGroup(group);
        setActiveContact(null); // deseleccionamos contacto
        navigate(`/chat/${group.id}`);
    };

    // Filtro de contactos y grupos
    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredGroups = groups.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="sidebar">
            {/* Header */}
            <div className="sidebar-header">
                <h2>Wsp-messenger</h2>
                <div className="wspIcons">
                    <div>
                        <Icons.NotePencil
                            size={25}
                            title="Nuevo chat"
                            onClick={() => navigate("/create-group")}
                        />
                    </div>
                    <div>
                        <Icons.Filter size={25} title="Filtrar" />
                    </div>
                </div>
            </div>

            {/* Buscador */}
            <div className="sidebar-search">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Lista de contactos */}
            <div className="sidebar-contacts">
                <h3>Contactos</h3>
                {filteredContacts.length > 0 ? (
                    <ContactList
                        contacts={filteredContacts}
                        onContactClick={handleContactClick}
                        activeId={activeGroup ? null : activeContact?.id}
                    />
                ) : (
                    <p>No hay contactos disponibles</p>
                )}
            </div>

            {/* Lista de grupos */}
            <div className="sidebar-groups">
                <div className="groups-header">
                    <h3>Grupos</h3>
                    <button
                        className="add-group-btn"
                        onClick={() => navigate("/create-group")}
                        title="Crear nuevo grupo"
                    >
                        <Icons.Group size={20} />
                    </button>
                </div>

                {filteredGroups.length > 0 ? (
                    <ul className="group-list">
                        {filteredGroups.map((g) => (
                            <li key={g.id}>
                                <button
                                    className={`group-item ${
                                        activeGroup?.id === g.id ? "active" : ""
                                    }`}
                                    onClick={() => handleGroupClick(g)}
                                >
                                    <Icons.Group size={18} />
                                    <span>{g.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-groups">No hay grupos creados</p>
                )}
            </div>
        </div>
    );
}

export default Sidebar;