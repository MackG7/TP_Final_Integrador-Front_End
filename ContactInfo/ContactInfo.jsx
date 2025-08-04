import { useParams, useNavigate } from 'react-router';
import { useContext } from 'react'; 
import { MessengerContext } from '../Context/MessengerContext';
import './ContactInfo.css';
import Icons from '../src/assets/Icons';




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
                    <Icons.Returnarrow />
                </button>
                <img src={contact.img} alt={contact.name} className="contact-info-img" />
                <h2 className="contact-info-name">{contact.name}</h2>
            </div>

            <div className="contact-info-actions">
                <button> <Icons.Call size={20}/> <br />Llamar</button>
                <button> <Icons.Video size={20} /> <br />Video</button>
                <button> <Icons.Search size={20}/> <br />Buscar</button>
            </div>

            <div className="contact-info-section">
                <hr />
                <p> <Icons.Notification size={20}/> Notificaciones</p>
                <hr />
                <p> <Icons.Multimedia size={20}/> Visibilidad de archivos multimedia</p>
                <small>Desactivada</small>
                <hr />
                <p> <Icons.Pin size={20}/> Mensajes conservados</p>
                <hr />
                <p> <Icons.Lock size={20}/> Cifrado</p>
                <small>Los mensajes y llamadas están cifrados de extremo a extremo.</small>
                <hr />
                <p> <Icons.Time size={20}/> Mensajes temporales</p>
                <small>90 días</small>
                <hr />
                <p> <Icons.Prohibit size={20}/> Restringir chat</p>
                <small>Restringe y oculta este chat en este dispositivo.</small>
                <hr />
            </div>
        </div>
    );
}


export default ContactInfo;


