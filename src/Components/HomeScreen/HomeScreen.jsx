import { useContext } from 'react'
import { Link } from 'react-router' 
import { MessengerContext } from '../../Context/MessengerContext.jsx'
import Sidebar from '../Sidebar/Sidebar.jsx'
import './HomeScreen.css'
import Icons from '../../assets/Icons.jsx'

function Home() {
    const { activeContact } = useContext(MessengerContext)

    return (
        <div className="home-container">
            <Sidebar />

            <div className="empty-chat">
                {!activeContact ?(
                    <div className="welcome-message">
                        <div className="wsplogo">
                            <Icons.Whatsapp size={150} color="gray" />
                        </div>

                        <h1>Bienvenido al wsp-messenger</h1>
                        <p>Selecciona un contacto para comenzar a chatear</p>
                    </div>
                ) : (
                    <div className="mobile-view-message">
                        <p>Chat abierto en vista móvil</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home