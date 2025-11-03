import { useParams, useLocation, useNavigate } from 'react-router'
import { useContext } from 'react'
import { MessengerContext } from '../../Context/MessengerContext.jsx'
import ChatHeader from '../ChatHeader/ChatHeader'
import Message from '../Message/Message.jsx'
import MessageInput from '../../MessageInput/MessageInput.jsx'
import './Chat.css'

function Chat() {
    const { contactId, groupId } = useParams()
    const { contacts, groups } = useContext(MessengerContext)
    const navigate = useNavigate()
    const location = useLocation()

    // Detectar si la ruta es de grupo o contacto
    const isGroupChat = location.pathname.includes('/group/')
    const chatData = isGroupChat
        ? groups.find(g => g.id === groupId)
        : contacts.find(c => c.id === parseInt(contactId))

    if (!chatData) {
        return <div>Selecciona un chat o grupo</div>
    }

    const handleProfileClick = () => {
        if (isGroupChat) {
            // Redirigir a la info del grupo (a crear)
            navigate(`/groupInfo/${chatData.id}`)
        } else {
            navigate(`/contactInfo/${chatData.id}`)
        }
    }

    return (
        <div className="chat-container">
            <div className="chat-navigation">
                <ChatHeader
                    contact={chatData}
                    onProfileClick={handleProfileClick}
                />
            </div>

            <div className="messages-container">
                {chatData.messages.map(message => (
                    <Message
                        key={message.id}
                        message={message}
                        isOwn={message.emisor === 'YO'}
                        isGroupChat={isGroupChat} // 👈 nuevo
                    />
                ))}
            </div>

            {/* 
        🔹 MessageInput se adapta:
        Si es grupo => enviar a grupo
        Si es contacto => enviar normal
      */}
            <MessageInput
                contactId={!isGroupChat ? chatData.id : null}
                groupId={isGroupChat ? chatData.id : null}
                isGroupChat={isGroupChat}
            />
        </div>
    )
}

export default Chat



