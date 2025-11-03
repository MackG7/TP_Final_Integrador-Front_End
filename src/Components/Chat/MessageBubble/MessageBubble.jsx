import React from 'react';
import './MessageBubble.css';

const MessageBubble = ({ message, isOwn, sender, timestamp }) => {
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <div className={`message-bubble ${isOwn ? 'own-message' : 'other-message'}`}>
            {!isOwn && sender && (
                <div className="sender-name">{sender.name}</div>
            )}
            <div className="message-content">
                <p>{message}</p>
                <span className="message-time">
                    {formatTime(timestamp)}
                </span>
            </div>
        </div>
    );
};

export default MessageBubble;