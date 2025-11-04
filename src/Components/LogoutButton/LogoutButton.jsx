import { useContext } from "react";
import { MessengerContext } from "../../Context/MessengerContext/MessengerContext.jsx";

function LogoutButton() {
    const { logout } = useContext(MessengerContext);

    return (
        <button onClick={logout} className="logout-btn">
            Cerrar sesión
        </button>
    );
}

export default LogoutButton;