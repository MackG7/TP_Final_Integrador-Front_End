import { useParams, useNavigate } from 'react-router';
import { useContext } from 'react'; 
import { MessengerContext } from '../Context/MessengerContext';
import './ContactInfo.css';

function ContactInfo() {
    const { contactId } = useParams();
    const { contacts } = useContext(MessengerContext);
    const navigate = useNavigate();

    const contact = contacts.find(c => c.id === parseInt(contactId));

    if (!contact) return <div> Contacto no encontrado </div>;

    return (
        <div className="contact-info-container">

            <div className="contact-info-header">
                <button className="back-button" onClick={() => navigate(`/chat/${contact.id}`)}>
                    ←
                </button>
                <img src={contact.img} alt={contact.name} className="contact-info-img" />
                <h2 className="contact-info-name">{contact.name}</h2>
            </div>

            <div className="contact-info-actions">
                <button>📞<br />Llamar</button>
                <button>📹<br />Video</button>
                <button>🔍<br />Buscar</button>
            </div>

            <div className="contact-info-section">
                <hr />
                <p>🔔 Notificaciones</p>
                <hr />
                <p>🖼️ Visibilidad de archivos multimedia</p>
                <small>Desactivada</small>
                <hr />
                <p>📌 Mensajes conservados</p>
                <hr />
                <p>🔒 Cifrado</p>
                <small>Los mensajes y llamadas están cifrados de extremo a extremo.</small>
                <hr />
                <p>⏳ Mensajes temporales</p>
                <small>90 días</small>
                <hr />
                <p>🚫 Restringir chat</p>
                <small>Restringe y oculta este chat en este dispositivo.</small>
                <hr />
            </div>
        </div>
    );
}


export default ContactInfo;


