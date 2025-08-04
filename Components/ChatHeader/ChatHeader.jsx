import { useNavigate } from 'react-router'
import { Link } from 'react-router'
import './ChatHeader.css'
import Icons from '../../src/assets/Icons'

function ChatHeader({ contact, onProfileClick }) {
    const navigate = useNavigate()

    if (!contact) {
        return <div className="chat-header">Cargando contacto...</div>
    }

    const handleBackClick = () => {
        navigate('/')
    }

    return (
        <div className="chat-header">
            <button onClick={handleBackClick} className="back-button" aria-label="Volver a contactos">
                <Icons.Returnarrow />
            </button>

            <Link to={`/contactInfo/${contact.id}`}>
                <img
                    src={contact.img || ''}
                    alt={contact.name || 'Usuario'}
                    className="contact-avatar"
                />
            </Link>

            <div className="contact-info">
                <h2>{contact.name}</h2>
                <p className="last-seen">
                {contact.isOnline
                ? 'En línea'
                : `Última vez hoy a las ${contact.last_time_connected}`}
            </p>
            </div>

        </div>
    )
}

export default ChatHeader






