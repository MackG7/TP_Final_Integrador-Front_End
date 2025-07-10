import { useParams, useNavigate } from 'react-router';
import { useContext } from 'react';
import { MessengerContext } from '../Context/MessengerContext';
import './ContactDetail.css';

function ContactDetail() {
    const { contactId } = useParams();
    const navigate = useNavigate();
    const { contacts } = useContext(MessengerContext);

    const contact = contacts.find(c => c.id === parseInt(contactId));

    if (!contact) {
        return <div> Contacto no encontrado </div>;
    }

    return (
        <div className="contact-detail-container">
            <button onClick={() => navigate()} className="back-button" >
                ← Volver
            </button>

            <div className="profile-section">
                <img
                    src={contact.profilePicture}
                    alt={contact.name}
                    className="contact-picture"
                />
                <h2>{contact.name}</h2>
                <p className="contact-status">{contact.status || 'Sin estado'}</p>
            </div>

            <div className="info-section">
                <p><strong>Teléfono:</strong> {contact.phone || 'No disponible'}</p>
                <p><strong>Última vez:</strong> {contact.lastSeen || 'Desconocido'}</p>
            </div>
            
            <div className="contact-status">
                Última vez {contact.last_seen}
            </div>
        </div>
    );
}

export default ContactDetail;


