import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getGroupById, getGroupMembers, inviteUser } from "../../services/groupService.js"

export default function GroupPageScreen() {
    const { id } = useParams()
    const [group, setGroup] = useState(null)
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [emailToInvite, setEmailToInvite] = useState("")

    useEffect(() => {
        if (!id) {
            setError("ID del grupo no especificado en la URL")
            setLoading(false)
            return
        }

        const fetchGroup = async () => {
            try {
                setLoading(true)
                setError("")

                const [groupResponse, membersResponse] = await Promise.all([
                    getGroupById(id),
                    getGroupMembers(id)
                ])

                setGroup(groupResponse.data)
                setMembers(membersResponse.data)
            } catch (err) {
                console.error("❌ Error obteniendo grupo:", err)
                setError(err.message || "No se pudo cargar el grupo")
            } finally {
                setLoading(false)
            }
        }

        fetchGroup()
    }, [id])

    const handleInvite = async (e) => {
        e.preventDefault()
        if (!emailToInvite) return

        try {
            const response = await inviteUser(emailToInvite, id)
            setMembers(response.data.members)
            setEmailToInvite("")
            alert("Usuario invitado exitosamente")
        } catch (err) {
            console.error("❌ Error invitando usuario:", err)
            alert(err.message || "Error al invitar usuario")
        }
    }

    if (loading) return <p>Cargando grupo...</p>
    if (error) return <p>Error: {error}</p>
    if (!group) return <p>Grupo no encontrado</p>

    return (
        <div>
            <h1>{group.name}</h1>
            <p>{group.description || "Sin descripción"}</p>

            <h2>Miembros ({members.length})</h2>
            <ul>
                {members.map(member => (
                    <li key={member._id}>
                        <button onClick={() => navigate(`/chat/${group.id}/member/${member._id}`)}>
                            {member.name} ({member.email})
                        </button>
                    </li>
                ))}
            </ul>

            <h3>Invitar usuario por email</h3>
            <form onSubmit={handleInvite}>
                <input
                    type="email"
                    placeholder="Email del usuario"
                    value={emailToInvite}
                    onChange={(e) => setEmailToInvite(e.target.value)}
                    required
                />
                <button type="submit">Invitar</button>
            </form>
        </div>
    )
}