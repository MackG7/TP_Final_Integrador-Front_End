import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessengerContext } from '../../Context/MessengerContext/MessengerContext.jsx';
import MessageBubble from '../Chat/MessageBubble/MessageBubble.jsx';
import MessageInput from '../../MessageInput/MessageInput.jsx';
import './GroupChatScreen';

const GroupChatScreen = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const { user, sendGroupMessage, getGroupMessages } = useContext(MessengerContext);
    
    const [messages, setMessages] = useState([]);
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Cargar mensajes y datos del grupo
    useEffect(() => {
        const loadGroupData = async () => {
            if (!groupId) return;
            
            setLoading(true);
            try {
                // Cargar mensajes del grupo
                const messagesResult = await getGroupMessages(groupId);
                if (messagesResult.success) {
                    setMessages(messagesResult.data || []);
                }

                // TODO: Cargar datos del grupo
                // const groupResult = await getGroupById(groupId);
                // setGroup(groupResult.data);

            } catch (error) {
                console.error('Error cargando grupo:', error);
            } finally {
                setLoading(false);
            }
        };

        loadGroupData();
    }, [groupId, getGroupMessages]);

    const handleSendMessage = async (messageText) => {
        if (!messageText.trim() || !groupId) return;

        setSending(true);
        try {
            const result = await sendGroupMessage(groupId, messageText);
            if (result.success) {
                // Agregar mensaje a la lista localmente
                const newMessage = {
                    _id: Date.now().toString(),
                    content: messageText,
                    sender: user,
                    groupId: groupId,
                    timestamp: new Date().toISOString(),
                    isOwn: true
                };
                setMessages(prev => [...prev, newMessage]);
            }
        } catch (error) {
            console.error('Error enviando mensaje grupal:', error);
        } finally {
            setSending(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="group-chat-screen">
                <div className="loading-chat">Cargando grupo...</div>
            </div>
        );
    }

    return (
        <div className="group-chat-screen">
            {/* Header del grupo */}
            <div className="group-chat-header">
                <button onClick={handleBack} className="back-button">
                    ←
                </button>
                <div className="group-info">
                    <div className="group-avatar">
                        {group?.name?.charAt(0) || 'G'}
                    </div>
                    <div className="group-details">
                        <h3>{group?.name || 'Grupo'}</h3>
                        <span className="group-members">
                            {group?.members?.length || 0} miembros
                        </span>
                    </div>
                </div>
            </div>

            {/* Lista de mensajes */}
            <div className="messages-container">
                {messages.length === 0 ? (
                    <div className="no-messages">
                        <p>No hay mensajes en este grupo</p>
                        <span>Sé el primero en enviar un mensaje</span>
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
                placeholder="Escribe un mensaje al grupo..."
            />
        </div>
    );
};

export default GroupChatScreen;