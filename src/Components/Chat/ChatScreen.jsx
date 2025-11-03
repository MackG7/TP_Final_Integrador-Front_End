import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessengerContext } from '../../Context/MessengerContext.jsx';
import MessageBubble from './MessageBubble/MessageBubble.jsx';
import MessageInput from '../../MessageInput/MessageInput.jsx';
import './ChatScreen.css';

const ChatScreen = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user, sendUserMessage, getUserMessages } = useContext(MessengerContext);
    
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [contact, setContact] = useState(null);
    const messagesEndRef = useRef(null);

    // Scroll al final de los mensajes
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView ({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Cargar mensajes y datos del contacto
    useEffect(() => {
        const loadChatData = async () => {
            if (!userId) return;
            
            setLoading(true);
            try {
                // Cargar mensajes
                const messagesResult = await getUserMessages(userId);
                if (messagesResult.success) {
                    setMessages(messagesResult.data || []);
                }

                // TODO: Cargar datos del contacto
                // const contactResult = await getUserProfile(userId);
                // setContact(contactResult.user);

            } catch (error) {
                console.error('Error cargando chat:', error);
            } finally {
                setLoading(false);
            }
        };

        loadChatData();
    }, [userId, getUserMessages]);

    const handleSendMessage = async (messageText) => {
        if (!messageText.trim() || !userId) return;

        setSending(true);
        try {
            const result = await sendUserMessage(userId, messageText);
            if (result.success) {
                // Agregar mensaje a la lista localmente
                const newMessage = {
                    _id: Date.now().toString(), // Temporal hasta respuesta del servidor
                    content: messageText,
                    sender: user,
                    receiver: userId,
                    timestamp: new Date().toISOString(),
                    isOwn: true
                };
                setMessages(prev => [...prev, newMessage]);
            }
        } catch (error) {
            console.error('Error enviando mensaje:', error);
        } finally {
            setSending(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="chat-screen">
                <div className="loading-chat">Cargando conversación...</div>
            </div>
        );
    }

    return (
        <div className="chat-screen">
            {/* Header del chat */}
            <div className="chat-header">
                <button onClick={handleBack} className="back-button">
                    ←
                </button>
                <div className="contact-info">
                    <div className="contact-avatar">
                        {contact?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="contact-details">
                        <h3>{contact?.name || 'Usuario'}</h3>
                        <span className="contact-status">En línea</span>
                    </div>
                </div>
            </div>

            {/* Lista de mensajes */}
            <div className="messages-container">
                {messages.length === 0 ? (
                    <div className="no-messages">
                        <p>No hay mensajes aún</p>
                        <span>Envía un mensaje para iniciar la conversación</span>
                    </div>
                ) : (
                    messages.map((message) => (
                        <MessageBubble
                            key={message._id}
                            message={message.content}
                            isOwn={message.sender?._id === user?.id}
                            sender={message.sender}
                            timestamp={message.timestamp}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input para enviar mensajes */}
            <MessageInput
                onSendMessage={handleSendMessage}
                disabled={sending}
                placeholder="Escribe un mensaje..."
            />
        </div>
    );
};

export default ChatScreen;