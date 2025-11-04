import React, { useState } from "react";
import "./Message.css"; // ⬅ asegúrate de que el archivo exista con el nombre exacto

// ===========================
// Componente burbuja de mensaje
// ===========================
export function MessageBubble({ message, isOwn, sender, timestamp }) {
    const formattedTime = new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className={`message-bubble ${isOwn ? "own" : "received"}`}>
            {!isOwn && (
                <div className="message-sender">
                    {sender?.name || sender?.username || "Desconocido"}
                </div>
            )}
            <div className="message-content">{message}</div>
            <div className="message-time">{formattedTime}</div>
        </div>
    );
}

// ===========================
// Componente input de mensaje
// ===========================
export function MessageInput({ onSendMessage, disabled, placeholder }) {
    const [text, setText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSendMessage(text);
        setText("");
    };

    return (
        <form onSubmit={handleSubmit} className="message-input-form">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={placeholder || "Escribe un mensaje..."}
                disabled={disabled}
                className="message-input-field"
            />
            <button
                type="submit"
                disabled={disabled || !text.trim()}
                className="message-send-button"
            >
                Enviar
            </button>
        </form>
    );
}

// ===========================
// Export opcional default
// ===========================
// Esto permite importar así: 
// import MessageComponents from "../Message/MessageComponents.jsx";
// MessageComponents.MessageBubble ...
export default { MessageBubble, MessageInput };