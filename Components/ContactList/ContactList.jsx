import './ContactList.css'
import { Link } from 'react-router'

function ContactList({ contacts, onContactClick }) {
    return (
        <div className="contact-list">
            {contacts.map(contact => (
                <Link to={`/chat/${contact.id}`} key={contact.id} className="contact-link">
                    <div
                        className="contact-item"
                        onClick={() => onContactClick(contact)}
                    >
                        <img src={contact.img} alt={contact.name} className="contact-avatar" />
                        <div className="contact-info">
                            <h3>{contact.name}</h3>
                            <p className="last-message">{contact.last_message.text}</p>
                        </div>
                        <div className="contact-meta">
                            <span className="last-time">{contact.last_time_connected}</span>
                            {contact.unread_messages > 0 && (
                                <span className="unread-count">{contact.unread_messages}</span>
                            )}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default ContactList








