import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MessengerContext } from "../../Context/MessengerContext.jsx";
import './ContactList.css';

function ContactList({ contacts, activeId }) {
    const navigate = useNavigate();
    const { setActiveContact, setActiveGroup } = useContext(MessengerContext);

    const handleClick = (contact) => {
        setActiveContact(contact);
        setActiveGroup(null); // deseleccionamos grupo
        navigate(`/chat/contact/${contact.id}`);
    };

    return (
        <div className="contact-list">
            {contacts.map(contact => (
                <div
                    key={contact.id}
                    className={`contact-item ${activeId === contact.id ? "active" : ""}`}
                    onClick={() => handleClick(contact)}
                >
                    <img
                        src={contact.img || "/default-avatar.png"}
                        alt={contact.name}
                        className="contact-avatar"
                    />
                    <div className="contact-info">
                        <h3>{contact.name}</h3>
                        <p className="last-message">
                            {contact.last_message?.text || "Sin mensajes"}
                        </p>
                    </div>
                    <div className="contact-meta">
                        <span className="last-time">
                            {contact.last_time_connected || "-"}
                        </span>
                        {contact.unread_messages > 0 && (
                            <span className="unread-count">{contact.unread_messages}</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ContactList;







