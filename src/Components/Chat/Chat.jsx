import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessengerContext } from "../../Context/MessengerContext/MessengerContext.jsx";
import { MessageBubble, MessageInput } from "../Message/MessageComponents.jsx";
import LogoutButton from "../../Components/LogoutButton/LogoutButton.jsx";

export default function Chat() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const {
        user,
        messages,
        setMessages,
        sendUserMessage,
        getUserMessages,
    } = useContext(MessengerContext);

    const [contact, setContact] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        const loadChat = async () => {
            if (!userId) return;
            setLoading(true);
            try {
                const result = await getUserMessages(userId);
                if (result?.success) setMessages(result.data || []);
            } catch (err) {
                console.error("Error cargando chat:", err);
            } finally {
                setLoading(false);
            }
        };
        loadChat();
    }, [userId, getUserMessages, setMessages]);

    const handleSendMessage = async (text) => {
        if (!text.trim()) return;
        setSending(true);
        try {
            const result = await sendUserMessage(userId, text);
            if (result.success) {
                const newMsg = {
                    _id: Date.now().toString(),
                    content: text,
                    sender: user,
                    receiver: userId,
                    timestamp: new Date().toISOString(),
                };
                setMessages((prev) => [...prev, newMsg]);
            }
        } catch (err) {
            console.error("Error enviando mensaje:", err);
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="chat-screen">Cargando chat...</div>;

    return (
        <div className="chat-screen">
            <div className="chat-header">
                <button onClick={() => navigate(-1)} className="back-button">←</button>
                <div className="contact-info">
                    <div className="contact-avatar">
                        {contact?.name?.[0] || "U"}
                    </div>
                    <div className="contact-details">
                        <h3>{contact?.name || "Usuario"}</h3>
                        <span className="contact-status">En línea</span>
                    </div>
                </div>
                <LogoutButton />
            </div>

            <div className="messages-container">
                {messages.length === 0 ? (
                    <div className="no-messages">
                        <p>No hay mensajes aún</p>
                        <span>Envía un mensaje para iniciar la conversación</span>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <MessageBubble
                            key={msg._id}
                            message={msg.content}
                            isOwn={msg.sender?._id === user?.id}
                            sender={msg.sender}
                            timestamp={msg.timestamp}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <MessageInput
                onSendMessage={handleSendMessage}
                disabled={sending}
                placeholder="Escribe un mensaje..."
            />
        </div>
    );
}
