import { useContext, useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar.jsx";
import { MessengerContext } from "../../Context/MessengerContext.jsx";
import { getGroupList } from "../../services/groupService.js";
import { useNavigate } from "react-router-dom";

export default function GroupsScreen() {
    const { groups, setGroups, setActiveGroup } = useContext(MessengerContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                setLoading(true);
                const response = await getGroupList();
                setGroups(response.data);
            } catch (err) {
                console.error("❌ Error cargando grupos:", err);
                setError("No se pudieron cargar los grupos");
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, [setGroups]);
    
    useEffect(() => {
    
    if (groups.length > 0) {
        const newGroup = groups[groups.length - 1]; 
        navigate(`/chat/${newGroup.id}`);
    }
}, [groups, setActiveGroup, navigate]);

    const handleGroupClick = (group) => {
        setActiveGroup(group);
        navigate(`/chat/${group.id}`);
    };

    return (
        <div className="groups-screen" style={{ display: "flex" }}>
            <Sidebar />

            <div className="groups-content" style={{ flex: 1, padding: "1rem" }}>
                {loading && <p>Cargando grupos...</p>}
                {error && <p>{error}</p>}

                {!loading && !error && groups.length === 0 && (
                    <p>No tienes grupos todavía. ¡Crea uno!</p>
                )}

                {!loading && !error && groups.length > 0 && (
                    <div>
                        <h2>Bienvenido a tus grupos</h2>
                        <p>Selecciona un grupo desde la barra lateral:</p>
                        <ul>
                            {groups.map((g) => (
                                <li key={g.id}>
                                    <button onClick={() => handleGroupClick(g)}>
                                        {g.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}