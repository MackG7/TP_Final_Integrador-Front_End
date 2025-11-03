import { useParams, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { MessengerContext } from '../../Context/MessengerContext.jsx';
import Icons from '../../assets/Icons.jsx';
import './MemberInfoScreen.css'

export default function MemberInfoScreen() {
    const { groupId, memberId } = useParams();
    const { groups } = useContext(MessengerContext);
    const navigate = useNavigate();

    // Buscar el grupo por ID
    const group = groups.find(g => g.id === groupId || g._id === groupId);
    if (!group) return <div>Grupo no encontrado</div>;

    // Buscar miembro dentro del grupo
    const member = group.members?.find(m => m._id === memberId);
    if (!member) return <div>Miembro no encontrado</div>;

    return (
        <div className="member-info-container">
            <div className="member-info-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <Icons.Returnarrow />
                </button>
                <img
                    src={member.img || member.avatar}
                    alt={member.name}
                    className="member-info-img"
                />
                <h2 className="member-info-name">{member.name}</h2>
            </div>

            <div className="member-info-actions">
                <button> <Icons.Call size={20} /> <br />Llamar</button>
                <button> <Icons.Video size={20} /> <br />Video</button>
                <button> <Icons.Search size={20} /> <br />Buscar</button>
            </div>

            <div className="member-info-section">
                <hr />
                <p> <Icons.Notification size={20} /> Notificaciones</p>
                <hr />
                <p> <Icons.Lock size={20} /> Cifrado</p>
                <small>Los mensajes y llamadas están cifrados de extremo a extremo.</small>
            </div>
        </div>
    );
}