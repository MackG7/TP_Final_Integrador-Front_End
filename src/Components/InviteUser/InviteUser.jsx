import { useEffect, useState } from "react";
import { getAllUsers } from "../services/userService.js";
import { inviteUser } from "../services/groupService.js";

export default function InviteUser({ groupId }) {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userList = await getAllUsers();
                setUsers(userList);
                setFilteredUsers(userList);
            } catch (error) {
                console.error("❌ Error cargando usuarios:", error);
                setMessage("Error cargando usuarios");
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        // Filtra usuarios por búsqueda en nombre o email
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const toggleSelectUser = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleInvite = async () => {
        if (selectedUsers.length === 0) {
            setMessage("Seleccioná al menos un usuario");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            for (const userId of selectedUsers) {
                const user = users.find(u => u._id === userId);
                if (!user) continue;
                await inviteUser(user.email, groupId);
            }
            setMessage("✅ Invitaciones enviadas correctamente");
            setSelectedUsers([]);
        } catch (error) {
            console.error("❌ Error invitando usuarios:", error);
            setMessage("Error enviando invitaciones");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="invite-user-container" style={{ maxWidth: "400px", margin: "0 auto" }}>
            <h3>Invitar usuarios al grupo</h3>

            <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc"
                }}
            />

            <div style={{
                maxHeight: "250px",
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "5px"
            }}>
                {filteredUsers.length === 0 && <p>No se encontraron usuarios</p>}
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {filteredUsers.map(user => (
                        <li key={user._id} style={{ marginBottom: "5px" }}>
                            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user._id)}
                                    onChange={() => toggleSelectUser(user._id)}
                                    style={{ marginRight: "8px" }}
                                />
                                <span>{user.name} ({user.email})</span>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            {message && <p style={{ marginTop: "10px" }}>{message}</p>}

            <button
                onClick={handleInvite}
                disabled={loading}
                style={{
                    marginTop: "10px",
                    padding: "8px 16px",
                    borderRadius: "5px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer"
                }}
            >
                {loading ? "Enviando..." : "Invitar"}
            </button>
        </div>
    );
}