import { useParams } from 'react-router';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { MessengerContext } from '../../Context/MessengerContext';
import ChatHeader from '../ChatHeader/ChatHeader';
import Message from '../Message/Message';
import MessageInput from '../../MessageInput/MessageInput';
import '../Chat/Chat.css';

function Chat() {
    const { contactId } = useParams();
    const { contacts } = useContext(MessengerContext);
    const navigate = useNavigate();

    const contact = contacts.find(c => c.id === parseInt(contactId));

    if (!contact) {
        return <div>Selecciona un contacto</div>;
    }

    return (
        <div className="chat-container">
            <div className="chat-navigation">
                <ChatHeader
                    contact={contact}
                    onProfileClick={() => navigate(`/contactInfo/${contact.id}`)}
                />
            </div>
            <div className="messages-container">
                {contact.messages.map(message => (
                    <Message
                        key={message.id}
                        message={message}
                        isOwn={message.emisor === 'YO'}
                    />
                ))}
            </div>
            <MessageInput contactId={contact.id} />
        </div>
    );
}

export default Chat;




