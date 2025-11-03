import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { MessengerContext } from '../../src/Context/MessengerContext';
import './ContactDetail.css'; 

export default function MemberDetail() {
    const { memberId } = useParams();
    const navigate = useNavigate();
    const { activeGroup } = useContext(MessengerContext); // Tomamos el grupo activo
    const members = activeGroup?.members || []; // Lista de miembros del grupo

    // Buscamos el miembro por su ID
    const member = members.find(m => m._id === memberId);

    if (!member) {
        return <div> Miembro no encontrado </div>;
    }

    return (
        <div className="contact-detail-container">
            <button onClick={() => navigate(-1)} className="back-button">
                ← Volver
            </button>

            <div className="profile-section">
                <img
                    src={member.profilePicture || '/default-avatar.png'} // Usa un avatar por defecto si no hay
                    alt={member.name}
                    className="contact-picture"
                />
                <h2>{member.name}</h2>
                <p className="contact-status">{member.status || 'Sin estado'}</p>
            </div>

            <div className="info-section">
                <p><strong>Email:</strong> {member.email || 'No disponible'}</p>
                <p><strong>Última conexión:</strong> {member.lastSeen || 'Desconocida'}</p>
            </div>
        </div>
    );
}